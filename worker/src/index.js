/**
 * kaanusta.dev chat proxy — Cloudflare Worker.
 *
 * Browser (/chat on GitHub Pages) → this Worker → Anthropic Messages API.
 * The Anthropic key lives only here, as a Worker secret. Each person has
 * their own password; the Worker maps it to a user id and keeps that
 * user's conversations, settings, projects, memory and usage in D1.
 *
 * A chat request carries the conversation's `messages` plus choices from
 * the allowlists below (model, effort, web, code, project). The Worker
 * builds the real request (max_tokens, system prompt, tools, fallbacks)
 * and runs the turn: it streams Anthropic's SSE to the page unchanged
 * while reading it, answers memory tool calls itself, resumes paused
 * turns, and finally sends one extra `usage_summary` event.
 *
 * Secrets (set with `wrangler secret put`, never in code):
 *   ANTHROPIC_API_KEY  — Anthropic Console key
 *   ACCESS_TOKEN       — password of the "partner" user
 *   ACCESS_TOKEN_KAAN  — password of the "kaan" user
 *                        (both sent URL-encoded, so ö/ş/ğ/ı survive)
 *   FILE_REF_SECRET    — random key that signs file references (uploads are
 *                        disabled without it)
 *
 * Vars (wrangler.toml):
 *   ALLOWED_ORIGINS    — comma-separated list of origins allowed by CORS
 *
 * Bindings (wrangler.toml):
 *   DB                 — D1 database (schema in migrations/)
 *   RATE_LIMITER       — Workers Rate Limiting binding, keyed per client IP
 *
 * Routes (all need the password):
 *   GET    /auth                 → { user }
 *   POST   /                     → chat turn (SSE)
 *   POST   /title                → { title } for a new conversation (Haiku)
 *   POST   /compact              → { summary } of older messages (Sonnet)
 *   POST   /files[?keep=1]       → upload one attachment (raw body)
 *   DELETE /files/<ref>          → delete an attachment this Worker uploaded
 *   GET    /outputs/<file_id>    → download a file Claude made for this user
 *   GET    /convos               → { items: [{ id, title, updatedAt, projectId }] }
 *   GET    /convos/<id>          → { id, title, updatedAt, projectId, conversation }
 *   PUT    /convos/<id>          → save (raw conversation JSON body, see saveConvo)
 *   DELETE /convos/<id>          → delete
 *   GET    /settings             → { name, instructions, memory }
 *   PUT    /settings             → save any of { name, instructions, memory }
 *   GET    /projects             → { items: [project] }
 *   PUT    /projects/<id>        → save { name, instructions, files }
 *   DELETE /projects/<id>        → delete (and its files)
 *   GET    /memory               → { files: [{ path, content, updatedAt }] }
 *   DELETE /memory?path=<path>   → forget a memory file or folder
 *   GET    /usage                → { month, cost, input, output, requests }
 *
 * Uploaded files are visible to the whole Anthropic workspace, so the page
 * never gets a bare file_id for its uploads: it gets `<file_id>.<signature>`,
 * and the Worker only accepts references it signed itself. Files Claude
 * creates are recorded per user in D1 and only that user can download them.
 */

// ─── Request shape — change these, not the client ──────────────────────────

// Models the page may pick. Keep in sync with CHAT_MODELS in
// src/lib/constants.ts (the page's labels). Model ids:
// https://platform.claude.com/docs/en/about-claude/models/overview
//
// `fallback`: when Anthropic's safety classifiers decline a request, retry
// it on the recommended fallback model inside the same call. Haiku 5.5 has
// no server-side fallback, so it's off there.
const MODELS = {
  'claude-opus-5-5': { fallback: true },
  'claude-sonnet-5-5': { fallback: true },
  'claude-haiku-5-5': { fallback: false },
};
const DEFAULT_MODEL = 'claude-opus-5-5';

// $ per million tokens, for the cost estimate shown on the page. Fallback
// models are listed so a rescued reply is priced at the model that wrote it.
// Haiku 5.5 costs more once a prompt passes 100K tokens (`long`).
const PRICES = {
  'claude-opus-5-5': { in: 4, out: 20, read: 0.2, write: 5 },
  'claude-sonnet-5-5': { in: 2, out: 10, read: 0.2, write: 2.5 },
  'claude-haiku-5-5': { in: 0.1, out: 0.5, read: 0.01, write: 0.125, long: { in: 0.5, out: 2.5, read: 0.05, write: 0.625 } },
  'claude-opus-5': { in: 5, out: 25, read: 0.5, write: 6.25 },
  'claude-opus-4-8': { in: 5, out: 25, read: 0.5, write: 6.25 },
  'claude-sonnet-5': { in: 2, out: 10, read: 0.2, write: 2.5 },
};
const WEB_SEARCH_PRICE = 0.01; // $10 per 1,000 searches

// Effort levels the page may pick, each with its reply ceiling. All three
// models think before answering and the thinking counts against
// max_tokens, so deeper effort gets more room. A ceiling, not a charge —
// you only pay for what's used.
const EFFORTS = {
  low: 4096,
  medium: 8192,
  high: 16000,
};
const DEFAULT_EFFORT = 'low';

const FALLBACK_BETA = 'server-side-fallback-2026-07-01';

// Server tools (Anthropic runs them). The basic versions work on every
// model in MODELS. Web search is $10 per 1,000 searches; fetch is free
// apart from the tokens it reads; code execution has 1,550 free container
// hours a month per organization, then $0.05/hour.
const WEB_SEARCH_TOOL = {
  type: 'web_search_20250305',
  name: 'web_search',
  user_location: { type: 'approximate', country: 'TR', timezone: 'Europe/Istanbul' },
};
const WEB_FETCH_TOOL = {
  type: 'web_fetch_20250910',
  name: 'web_fetch',
  max_content_tokens: 50_000,
  citations: { enabled: true },
};
// Search is always offered; the Araştırma button only raises these limits.
const NORMAL_LIMITS = { searches: 3, fetches: 5 };
const DEEP_LIMITS = { searches: 15, fetches: 10 };
// A link in the chat turns web_fetch on even without web: reading a page
// the person shared costs only tokens.
const LINK_RE = /\bhttps?:\/\/\S|\bwww\.\S|\b[a-z0-9-]+\.(?:com|net|org|io|dev|app|ai|co|edu|gov|tr)\b/i;
const CODE_TOOL = { type: 'code_execution_20250825', name: 'code_execution' };
// Client tool: Claude asks, this Worker runs it against D1.
const MEMORY_TOOL = { type: 'memory_20250818', name: 'memory' };

// One turn may take several requests: memory calls and paused server-tool
// loops each need another round.
const MAX_ROUNDS = 10;

// Small side jobs.
const TITLE_MODEL = 'claude-haiku-5-5';
const COMPACT_MODEL = 'claude-sonnet-5-5';

// Attachments. Each type maps to the content block the API expects.
// Office files only make sense to code execution, so they become
// `container_upload` blocks (and turn code execution on for that turn).
const UPLOAD_TYPES = {
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'application/pdf': 'document',
  'text/plain': 'document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'container',
  'application/vnd.ms-excel': 'container',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'container',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'container',
};
const BLOCK_TYPES = { image: 'image', document: 'document', container: 'container_upload' };
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const FILE_TTL_SECONDS = 90 * 24 * 60 * 60; // the Files API maximum; project files don't expire
const ANTHROPIC_FILES_URL = 'https://api.anthropic.com/v1/files';

// Users and the secret holding each one's password.
const USERS = [
  { id: 'partner', secret: 'ACCESS_TOKEN' },
  { id: 'kaan', secret: 'ACCESS_TOKEN_KAAN' },
];

const SYSTEM_PROMPT = `You are a warm, helpful assistant chatting with one person through a small private chat page.
Reply in the language the user writes in (usually Turkish). Write naturally, not like a word-for-word translation.
Keep answers as long as the question needs: short for casual chat, thorough for real questions.
Use Markdown when it helps (lists, headings, code blocks, tables); don't use it for simple conversational replies.
Math renders with LaTeX: use $...$ inline and $$...$$ for display formulas.`;

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

// ─── Abuse / cost limits ───────────────────────────────────────────────────

const MAX_BODY_BYTES = 1024 * 1024; // raw chat request body
const MAX_MESSAGES = 200; // turns in one request (older ones get summarized)
const MAX_MESSAGE_CHARS = 30_000; // one message
const MAX_TOTAL_CHARS = 400_000; // whole conversation as sent
const MAX_ATTACHMENTS_PER_MESSAGE = 5;
const MAX_ATTACHMENTS_TOTAL = 30; // attachments are re-sent every turn
const MAX_CONVO_BYTES = 1_500_000; // one saved conversation (D1 rows top out at 2 MB)
const MAX_INSTRUCTIONS_CHARS = 2_000;
const MAX_NAME_CHARS = 40;
const MAX_PROJECT_INSTRUCTIONS_CHARS = 4_000;
const MAX_PROJECT_FILES = 10;
const MAX_MEMORY_FILES = 50;
const MAX_MEMORY_FILE_CHARS = 20_000;
const MEMORY_PROMPT_CHARS = 8_000; // memory shown up front in the system prompt

const ROUTES = [
  ['GET', /^\/auth$/, 'auth'],
  ['POST', /^\/$/, 'chat'],
  ['POST', /^\/title$/, 'title'],
  ['POST', /^\/compact$/, 'compact'],
  ['POST', /^\/files$/, 'upload'],
  ['DELETE', /^\/files\/([\w.-]{1,200})$/, 'deleteFile'],
  ['GET', /^\/outputs\/(file_[A-Za-z0-9]{1,100})$/, 'download'],
  ['GET', /^\/convos$/, 'listConvos'],
  ['GET', /^\/convos\/([\w-]{8,64})$/, 'getConvo'],
  ['PUT', /^\/convos\/([\w-]{8,64})$/, 'saveConvo'],
  ['DELETE', /^\/convos\/([\w-]{8,64})$/, 'deleteConvo'],
  ['GET', /^\/settings$/, 'getSettings'],
  ['PUT', /^\/settings$/, 'saveSettings'],
  ['GET', /^\/projects$/, 'listProjects'],
  ['PUT', /^\/projects\/([\w-]{8,64})$/, 'saveProject'],
  ['DELETE', /^\/projects\/([\w-]{8,64})$/, 'deleteProject'],
  ['GET', /^\/memory$/, 'listMemory'],
  ['DELETE', /^\/memory$/, 'deleteMemory'],
  ['GET', /^\/usage$/, 'usage'],
];

// ─── Worker ────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin');
    const allowed = parseOrigins(env.ALLOWED_ORIGINS);
    const cors = corsHeaders(origin, allowed);

    // Browsers always send Origin on cross-origin fetches. Reject the ones
    // we don't know. Requests without Origin (curl) pass through to the
    // token check — CORS isn't the security boundary, the token is.
    if (origin && !allowed.includes(origin)) {
      return json({ error: 'Origin not allowed.' }, 403);
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const route = matchRoute(request.method, url.pathname);
    if (!route) {
      return json({ error: 'Not found.' }, 404, cors);
    }

    // Rate limit before the token check so password guessing is throttled too.
    if (env.RATE_LIMITER) {
      const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) {
        return json({ error: 'Çok fazla istek. Biraz bekleyip tekrar dene.' }, 429, cors);
      }
    }

    if (!env.ANTHROPIC_API_KEY || !USERS.some((u) => env[u.secret])) {
      console.error('Missing ANTHROPIC_API_KEY or every ACCESS_TOKEN secret.');
      return json({ error: 'Sunucu yapılandırılmamış.' }, 500, cors);
    }

    const user = await identify(request, env);
    if (!user) {
      return json({ error: 'Parola hatalı.' }, 401, cors);
    }

    const [name, param] = route;
    switch (name) {
      case 'auth':
        return json({ user }, 200, cors);
      case 'chat': {
        const parsed = await readChatRequest(request, user, env);
        if (parsed.error) return json({ error: parsed.error }, parsed.status, cors);
        return runTurn(parsed, user, env, ctx, cors);
      }
      case 'title':
        return makeTitle(request, user, env, ctx, cors);
      case 'compact':
        return compact(request, user, env, ctx, cors);
      case 'upload':
        return uploadFile(request, url, env, cors);
      case 'deleteFile':
        return deleteFile(param, env, cors);
    }

    if (!env.DB) {
      return json({ error: 'Sunucuda veritabanı tanımlı değil.' }, 503, cors);
    }
    switch (name) {
      case 'download':
        return downloadOutput(user, param, env, cors);
      case 'listConvos':
        return listConvos(user, env, cors);
      case 'getConvo':
        return getConvo(user, param, env, cors);
      case 'saveConvo':
        return saveConvo(request, user, param, url, env, cors);
      case 'deleteConvo':
        await env.DB.prepare('DELETE FROM conversations WHERE user = ? AND id = ?').bind(user, param).run();
        return new Response(null, { status: 204, headers: cors });
      case 'getSettings':
        return json(await loadSettings(user, env), 200, cors);
      case 'saveSettings':
        return saveSettings(request, user, env, cors);
      case 'listProjects':
        return listProjects(user, env, cors);
      case 'saveProject':
        return saveProject(request, user, param, env, cors);
      case 'deleteProject':
        return deleteProject(user, param, env, cors);
      case 'listMemory':
        return json({ files: await memoryFiles(user, env) }, 200, cors);
      case 'deleteMemory': {
        const path = normalizeMemoryPath(url.searchParams.get('path'));
        if (!path || path === '/memories') return json({ error: 'Geçersiz yol.' }, 400, cors);
        await memoryDelete(user, path, env);
        return new Response(null, { status: 204, headers: cors });
      }
      case 'usage':
        return json(await monthUsage(user, env), 200, cors);
    }
    return json({ error: 'Not found.' }, 404, cors);
  },
};

function matchRoute(method, pathname) {
  for (const [m, re, name] of ROUTES) {
    if (m !== method) continue;
    const match = pathname.match(re);
    if (match) return [name, match[1]];
  }
  return null;
}

// Returns the user id whose password matches, or null. Every configured
// password is compared so timing doesn't reveal which one was close.
async function identify(request, env) {
  const auth = request.headers.get('Authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? decodeToken(auth.slice(7)) : '';
  let found = null;
  for (const u of USERS) {
    const secret = env[u.secret];
    if (secret && (await tokensMatch(token, normalizeToken(secret))) && !found) found = u.id;
  }
  return found;
}

// ─── Chat request ──────────────────────────────────────────────────────────

async function readChatRequest(request, user, env) {
  const declared = Number(request.headers.get('Content-Length') ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return { error: 'İstek çok büyük.', status: 413 };
  }

  let raw;
  try {
    raw = await request.text();
  } catch {
    return { error: 'İstek okunamadı.', status: 400 };
  }
  if (raw.length > MAX_BODY_BYTES) {
    return { error: 'İstek çok büyük.', status: 413 };
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return { error: 'Geçersiz JSON.', status: 400 };
  }

  const input = data?.messages;
  if (!Array.isArray(input) || input.length === 0) {
    return { error: '`messages` boş olmayan bir dizi olmalı.', status: 400 };
  }
  if (input.length > MAX_MESSAGES) {
    return { error: 'Sohbet çok uzadı. Yeni bir sohbet başlat.', status: 413 };
  }

  // Rebuild each message from scratch so only text and attachments this
  // Worker signed reach the API (no tool blocks, system roles, raw
  // file_ids, or extra fields).
  const messages = [];
  const counts = { chars: 0, attachments: 0, container: false };
  for (const m of input) {
    const role = m?.role;
    if (role !== 'user' && role !== 'assistant') {
      return { error: 'Geçersiz mesaj rolü.', status: 400 };
    }
    const content = await readContent(m?.content, role, env, counts);
    if (content.error) return content;
    messages.push({ role, content: content.value });
  }
  if (counts.chars > MAX_TOTAL_CHARS) {
    return { error: 'Sohbet çok uzadı. Yeni bir sohbet başlat.', status: 413 };
  }
  if (messages[0].role !== 'user' || messages.at(-1).role !== 'user') {
    return { error: 'Sohbet kullanıcı mesajıyla başlayıp bitmeli.', status: 400 };
  }

  const model = data.model ?? DEFAULT_MODEL;
  const effort = data.effort ?? DEFAULT_EFFORT;
  if (!Object.hasOwn(MODELS, model)) {
    return { error: 'Bu model kullanılamıyor.', status: 400 };
  }
  if (!Object.hasOwn(EFFORTS, effort)) {
    return { error: 'Geçersiz güç seviyesi.', status: 400 };
  }

  // A project adds its instructions to the system prompt and its files to
  // the start of the conversation.
  let project = null;
  if (typeof data.projectId === 'string' && env.DB) {
    project = await loadProject(user, data.projectId, env);
    if (project?.files.length) {
      const blocks = [];
      for (const f of project.files) {
        const block = await fileBlock(f, env);
        if (block) {
          blocks.push(block);
          if (block.type === 'container_upload') counts.container = true;
        }
      }
      const first = messages[0];
      const rest = typeof first.content === 'string' ? [{ type: 'text', text: first.content }] : first.content;
      first.content = [...blocks, ...rest];
    }
  }

  const containerId =
    typeof data.containerId === 'string' && /^[\w-]{1,120}$/.test(data.containerId) ? data.containerId : null;

  return {
    messages,
    model,
    effort,
    web: data.web === true,
    deep: data.deep === true,
    links: messages.some((m) => m.role === 'user' && hasLink(m.content)),
    // Office attachments need the sandbox to be read at all.
    code: data.code === true || counts.container,
    project,
    containerId,
  };
}

function hasLink(content) {
  if (typeof content === 'string') return LINK_RE.test(content);
  return content.some((b) => b.type === 'text' && LINK_RE.test(b.text));
}

// A message is either a string or a list of blocks:
//   { type: 'text', text } | { type: 'image' | 'document' | 'container_upload', ref, title? }
// Attachments are allowed only in user messages.
async function readContent(content, role, env, counts) {
  if (typeof content === 'string') {
    const text = content.trim();
    if (!text) return { error: 'Boş mesaj gönderilemez.', status: 400 };
    if (text.length > MAX_MESSAGE_CHARS) return { error: 'Mesajlardan biri çok uzun.', status: 413 };
    counts.chars += text.length;
    return { value: text };
  }
  if (!Array.isArray(content) || content.length === 0 || content.length > MAX_ATTACHMENTS_PER_MESSAGE + 2) {
    return { error: 'Geçersiz mesaj içeriği.', status: 400 };
  }

  const blocks = [];
  let attachments = 0;
  for (const block of content) {
    if (block?.type === 'text') {
      const text = typeof block.text === 'string' ? block.text.trim() : '';
      if (!text) continue;
      if (text.length > MAX_MESSAGE_CHARS) return { error: 'Mesajlardan biri çok uzun.', status: 413 };
      counts.chars += text.length;
      blocks.push({ type: 'text', text });
    } else if (Object.values(BLOCK_TYPES).includes(block?.type) && role === 'user') {
      const kind = Object.keys(BLOCK_TYPES).find((k) => BLOCK_TYPES[k] === block.type);
      const out = await fileBlock({ ref: block.ref, kind, name: block.title }, env);
      if (!out) return { error: 'Eklerden biri artık kullanılamıyor.', status: 400 };
      if (out.type === 'container_upload') counts.container = true;
      attachments += 1;
      blocks.push(out);
    } else {
      return { error: 'Geçersiz mesaj içeriği.', status: 400 };
    }
  }
  if (blocks.length === 0) return { error: 'Boş mesaj gönderilemez.', status: 400 };
  if (attachments > MAX_ATTACHMENTS_PER_MESSAGE) {
    return { error: `Bir mesaja en fazla ${MAX_ATTACHMENTS_PER_MESSAGE} dosya eklenebilir.`, status: 400 };
  }
  counts.attachments += attachments;
  if (counts.attachments > MAX_ATTACHMENTS_TOTAL) {
    return { error: 'Bu sohbette çok fazla dosya var. Yeni bir sohbet başlat.', status: 413 };
  }
  return { value: blocks };
}

// Turns a signed attachment reference into the API content block.
async function fileBlock(file, env) {
  const fileId = await verifyRef(file?.ref, file?.kind, env);
  if (!fileId) return null;
  if (file.kind === 'container') return { type: 'container_upload', file_id: fileId };
  const out = { type: BLOCK_TYPES[file.kind], source: { type: 'file', file_id: fileId } };
  if (file.kind === 'document' && typeof file.name === 'string' && file.name.trim()) {
    out.title = file.name.trim().slice(0, 200);
  }
  return out;
}

// ─── The turn ──────────────────────────────────────────────────────────────

async function runTurn(req, user, env, ctx, cors) {
  const settings = await loadSettings(user, env);
  const memoryOn = settings.memory && !!env.DB;
  const tools = [];
  const limits = req.deep ? DEEP_LIMITS : NORMAL_LIMITS;
  if (req.web) tools.push({ ...WEB_SEARCH_TOOL, max_uses: limits.searches });
  if (req.web || req.links) tools.push({ ...WEB_FETCH_TOOL, max_uses: limits.fetches });
  if (req.code) tools.push(CODE_TOOL);
  if (memoryOn) tools.push(MEMORY_TOOL);

  const body = {
    model: req.model,
    max_tokens: EFFORTS[req.effort],
    system: systemPrompt(settings, req, memoryOn ? await memoryFiles(user, env) : null),
    messages: req.messages,
    // Thinking stays adaptive; "summarized" lets the page show what the
    // model was thinking about (the raw chain of thought is never sent).
    thinking: { type: 'adaptive', display: 'summarized' },
    output_config: { effort: req.effort },
    // Cache the conversation prefix so a long chat (or an attached PDF)
    // isn't billed at full price again on every turn.
    cache_control: { type: 'ephemeral' },
    stream: true,
  };
  if (tools.length) body.tools = tools;
  if (req.containerId && req.code) body.container = req.containerId;
  const headers = {
    'x-api-key': env.ANTHROPIC_API_KEY,
    'anthropic-version': ANTHROPIC_VERSION,
    'content-type': 'application/json',
  };
  if (MODELS[req.model].fallback) {
    body.fallbacks = 'default';
    headers['anthropic-beta'] = FALLBACK_BETA;
  }

  // The first request decides the HTTP status the page sees; later rounds
  // report problems inside the stream.
  let upstream = await callAnthropic(body, headers);
  if (upstream.status === 400 && body.container) {
    // The saved container may have expired; start a fresh one.
    delete body.container;
    upstream = await callAnthropic(body, headers);
  }
  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '');
    console.error(`Anthropic ${upstream.status}: ${detail.slice(0, 500)}`);
    return json(...upstreamError(upstream.status), cors);
  }

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const totals = { input: 0, cacheRead: 0, cacheWrite: 0, output: 0, searches: 0, cost: 0, context: 0, model: req.model };
  const outputs = [];
  let containerId = req.containerId;
  let clientGone = false;

  const send = async (bytes) => {
    if (clientGone) return;
    try {
      await writer.write(bytes);
    } catch {
      clientGone = true;
    }
  };

  ctx.waitUntil(
    (async () => {
      try {
        for (let round = 0; round < MAX_ROUNDS && !clientGone; round++) {
          if (round > 0) {
            upstream = await callAnthropic(body, headers);
            if (!upstream.ok) {
              const detail = await upstream.text().catch(() => '');
              console.error(`Anthropic round ${round} ${upstream.status}: ${detail.slice(0, 500)}`);
              await send(encoder.encode(sseEvent('error', { type: 'error', error: { type: 'api_error', message: 'round failed' } })));
              break;
            }
          }

          const message = await relay(upstream.body, send, () => clientGone);
          addUsage(totals, message);
          containerId = message.containerId ?? containerId;
          for (const id of message.outputIds) if (!outputs.includes(id)) outputs.push(id);

          const content = echoable(message.content);
          if (message.stopReason === 'tool_use') {
            const results = [];
            for (const block of content) {
              if (block.type !== 'tool_use') continue;
              const result =
                block.name === 'memory' && memoryOn
                  ? await runMemory(user, block.input ?? {}, env)
                  : { text: `Error: unknown tool ${block.name}`, error: true };
              results.push({ type: 'tool_result', tool_use_id: block.id, content: result.text, ...(result.error ? { is_error: true } : {}) });
            }
            if (!results.length) break;
            body.messages = [...body.messages, { role: 'assistant', content }, { role: 'user', content: results }];
          } else if (message.stopReason === 'pause_turn') {
            body.messages = [...body.messages, { role: 'assistant', content }];
          } else {
            break;
          }
          if (containerId && req.code) body.container = containerId;
        }

        const files = await recordOutputs(user, outputs, env);
        await send(encoder.encode(sseEvent('usage_summary', { type: 'usage_summary', ...totals, containerId, files })));
        await recordUsage(user, totals, env);
      } catch (err) {
        console.error('Turn failed:', err);
        await send(encoder.encode(sseEvent('error', { type: 'error', error: { type: 'api_error', message: 'turn failed' } })));
      } finally {
        try {
          await writer.close();
        } catch {}
      }
    })(),
  );

  return new Response(readable, {
    status: 200,
    headers: {
      ...cors,
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}

function callAnthropic(body, headers) {
  return fetch(ANTHROPIC_URL, { method: 'POST', headers, body: JSON.stringify(body) }).catch((err) => {
    console.error('Anthropic fetch failed:', err);
    return new Response('{}', { status: 502 });
  });
}

// Copies one upstream SSE stream to the page byte for byte, and rebuilds
// the message from it on the side (content blocks, stop reason, usage).
async function relay(stream, send, stopped) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const msg = { content: [], stopReason: null, model: null, usage: {}, containerId: null, outputIds: [] };
  const partial = new Map(); // index → partial tool input JSON
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    await send(value);
    if (stopped()) {
      await reader.cancel().catch(() => {});
      break;
    }
    buffer += decoder.decode(value, { stream: true });
    let sep;
    while ((sep = buffer.indexOf('\n\n')) !== -1) {
      const chunk = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      const line = chunk.split('\n').find((l) => l.startsWith('data:'));
      if (!line) continue;
      let event;
      try {
        event = JSON.parse(line.slice(5));
      } catch {
        continue;
      }
      applyEvent(msg, partial, event);
    }
  }
  return msg;
}

function applyEvent(msg, partial, event) {
  switch (event.type) {
    case 'message_start':
      msg.model = event.message?.model ?? msg.model;
      Object.assign(msg.usage, event.message?.usage);
      if (event.message?.container?.id) msg.containerId = event.message.container.id;
      break;
    case 'content_block_start': {
      const block = structuredClone(event.content_block ?? {});
      if (block.type === 'tool_use' || block.type === 'server_tool_use') partial.set(event.index, '');
      if (block.type === 'bash_code_execution_tool_result') {
        for (const out of block.content?.content ?? []) if (out?.file_id) msg.outputIds.push(out.file_id);
      }
      msg.content[event.index] = block;
      break;
    }
    case 'content_block_delta': {
      const block = msg.content[event.index];
      const d = event.delta ?? {};
      if (!block) break;
      if (d.type === 'text_delta') block.text = (block.text ?? '') + d.text;
      else if (d.type === 'thinking_delta') block.thinking = (block.thinking ?? '') + d.thinking;
      else if (d.type === 'signature_delta') block.signature = d.signature;
      else if (d.type === 'input_json_delta') partial.set(event.index, (partial.get(event.index) ?? '') + d.partial_json);
      else if (d.type === 'citations_delta') (block.citations ??= []).push(d.citation);
      break;
    }
    case 'content_block_stop':
      if (partial.has(event.index)) {
        const block = msg.content[event.index];
        try {
          block.input = JSON.parse(partial.get(event.index) || '{}');
        } catch {
          block.input = {};
        }
        partial.delete(event.index);
      }
      break;
    case 'message_delta':
      if (event.delta?.stop_reason) msg.stopReason = event.delta.stop_reason;
      if (event.delta?.container?.id) msg.containerId = event.delta.container.id;
      if (event.usage) Object.assign(msg.usage, event.usage);
      break;
  }
}

// What to send back for the next round. After a server-side fallback the
// declined partial's non-text blocks must not be echoed (see the refusal
// fallback docs); the fallback marker itself can go too.
function echoable(content) {
  const blocks = content.filter(Boolean);
  const last = blocks.map((b) => b.type).lastIndexOf('fallback');
  if (last < 0) return blocks;
  return [...blocks.slice(0, last).filter((b) => b.type === 'text'), ...blocks.slice(last + 1)];
}

function addUsage(totals, message) {
  const u = message.usage ?? {};
  const model = message.model ?? totals.model;
  const input = u.input_tokens ?? 0;
  const cacheRead = u.cache_read_input_tokens ?? 0;
  const cacheWrite = u.cache_creation_input_tokens ?? 0;
  const output = u.output_tokens ?? 0;
  const searches = u.server_tool_use?.web_search_requests ?? 0;
  totals.input += input;
  totals.cacheRead += cacheRead;
  totals.cacheWrite += cacheWrite;
  totals.output += output;
  totals.searches += searches;
  totals.cost += priceOf(model, { input, cacheRead, cacheWrite, output }) + searches * WEB_SEARCH_PRICE;
  totals.context = input + cacheRead + cacheWrite + output;
  totals.model = model;
}

function priceOf(model, t) {
  let p = PRICES[model] ?? PRICES[DEFAULT_MODEL];
  if (p.long && t.input + t.cacheRead + t.cacheWrite > 100_000) p = p.long;
  return (t.input * p.in + t.cacheRead * p.read + t.cacheWrite * p.write + t.output * p.out) / 1e6;
}

function sseEvent(name, data) {
  return `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`;
}

function upstreamError(status) {
  if (status === 429) {
    return [{ error: 'Şu an çok yoğun. Biraz bekleyip tekrar dene.' }, 429];
  }
  if (status === 529 || status >= 500) {
    return [{ error: 'Servis geçici olarak meşgul. Birazdan tekrar dene.' }, 503];
  }
  if (status === 401 || status === 403) {
    // Our API key is wrong or out of credit — not the user's fault.
    return [{ error: 'Sunucu tarafında bir yetki sorunu var.' }, 502];
  }
  if (status === 413) {
    return [{ error: 'Sohbet çok uzadı. Yeni bir sohbet başlat.' }, 413];
  }
  return [{ error: 'İstek işlenemedi.' }, 400];
}

// ─── Prompt ────────────────────────────────────────────────────────────────

function systemPrompt({ name, instructions }, req, memory) {
  const today = new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'full',
    timeZone: 'Europe/Istanbul',
  }).format(new Date());
  const parts = [SYSTEM_PROMPT, `Today is ${today} (Europe/Istanbul).`];
  if (name) parts.push(`The person you're talking to is called ${name}.`);

  if (req.web) {
    parts.push(
      req.deep
        ? 'The person turned on research mode: treat this as a research task. Search from several angles, read the best sources in full, compare them, and answer with a thorough, organized report that cites them.'
        : "You can search the web. Use it when the answer depends on current or specific facts you aren't sure of; a search or two is usually enough.",
    );
  }
  if (req.web || req.links) {
    parts.push(
      "You can read web pages with web_fetch. When the person shares a link, read it before answering. If a page can't be read (login wall, blocked site, video), say which link failed and why, and ask them to paste the text.",
    );
  }
  if (req.code) {
    parts.push(
      'You can run code in a sandbox (Python with pandas, matplotlib, openpyxl, python-docx, python-pptx, reportlab and more). The sandbox itself is offline, which does not limit web_search or web_fetch: never tell the person you have no internet because of it. ' +
        'When the person wants a file (spreadsheet, document, slides, PDF, chart image), create it and save it at the top level of $OUTPUT_DIR: only files saved there reach them as downloads. ' +
        'Uploaded files are in the sandbox too.',
    );
  }
  if (memory) {
    parts.push(
      'You have a memory tool. Save durable things about the person that will help in later chats (preferences, ongoing plans, important facts they share), keep the files short and organized, and update or delete what becomes outdated. Never store passwords, ID numbers or financial details.',
    );
    let snapshot = memory.map((f) => `<file path="${f.path}">\n${f.content}\n</file>`).join('\n');
    if (snapshot.length > MEMORY_PROMPT_CHARS) snapshot = `${snapshot.slice(0, MEMORY_PROMPT_CHARS)}\n…(truncated; view the files for the rest)`;
    parts.push(
      memory.length
        ? `Your memory directory as of the start of this turn (already viewed for you; use the tool only to change it or read a truncated part):\n<memory>\n${snapshot}\n</memory>`
        : 'Your memory directory is empty right now (already checked for you).',
    );
  }
  if (instructions) {
    parts.push(
      `The person you're talking to left these standing instructions. Follow them unless they would make you unsafe or dishonest:\n<user_instructions>\n${instructions}\n</user_instructions>`,
    );
  }
  if (req.project) {
    parts.push(
      `This chat belongs to the project "${req.project.name}". Its files are attached at the start of the conversation.` +
        (req.project.instructions ? `\nProject instructions:\n<project_instructions>\n${req.project.instructions}\n</project_instructions>` : ''),
    );
  }
  return parts.join('\n\n');
}

async function oneShot(model, system, text, maxTokens, env) {
  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': ANTHROPIC_VERSION,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      output_config: { effort: 'low' },
      system,
      messages: [{ role: 'user', content: text }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}`);
  const msg = await res.json();
  const out = (msg.content ?? [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
  return { text: out, usage: msg.usage ?? {}, model: msg.model ?? model };
}

async function makeTitle(request, user, env, ctx, cors) {
  let text = '';
  try {
    const data = await request.json();
    text = typeof data?.text === 'string' ? data.text.slice(0, 2000) : '';
  } catch {}
  if (!text.trim()) return json({ error: 'Metin gerekli.' }, 400, cors);

  try {
    const r = await oneShot(
      TITLE_MODEL,
      'Write a short title (at most 6 words) for a chat that starts with the message below. Use the language of the message. Reply with the title only: no quotes, no trailing punctuation.',
      text,
      300,
      env,
    );
    ctx.waitUntil(recordOneShot(user, r, env));
    const title = r.text.replace(/^["'“”]+|["'“”.]+$/g, '').trim().slice(0, 60);
    return title ? json({ title }, 200, cors) : json({ error: 'Başlık üretilemedi.' }, 502, cors);
  } catch (err) {
    console.error('Title failed:', err);
    return json({ error: 'Başlık üretilemedi.' }, 502, cors);
  }
}

// Summarizes the older part of a long conversation so it can keep going.
// The page sends that part as plain text and keeps the summary.
async function compact(request, user, env, ctx, cors) {
  let text = '';
  try {
    const data = await request.json();
    text = typeof data?.text === 'string' ? data.text : '';
  } catch {}
  if (!text.trim()) return json({ error: 'Metin gerekli.' }, 400, cors);
  if (text.length > MAX_TOTAL_CHARS * 2) return json({ error: 'Metin çok uzun.' }, 413, cors);

  try {
    const r = await oneShot(
      COMPACT_MODEL,
      'You compress chat history. Write a faithful summary of the conversation below in its own language, so the chat can continue without it: who the person is and what they want, facts, decisions, numbers, names, open questions, promises made, and the style of the conversation. Use short headed sections. Leave nothing important out; skip small talk.',
      text,
      6000,
      env,
    );
    ctx.waitUntil(recordOneShot(user, r, env));
    return r.text ? json({ summary: r.text }, 200, cors) : json({ error: 'Özet üretilemedi.' }, 502, cors);
  } catch (err) {
    console.error('Compact failed:', err);
    return json({ error: 'Özet üretilemedi.' }, 502, cors);
  }
}

async function recordOneShot(user, r, env) {
  const totals = { input: 0, cacheRead: 0, cacheWrite: 0, output: 0, searches: 0, cost: 0, context: 0, model: r.model };
  addUsage(totals, { usage: r.usage, model: r.model });
  await recordUsage(user, totals, env);
}

// ─── Usage (D1) ────────────────────────────────────────────────────────────

const monthKey = () =>
  new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', timeZone: 'Europe/Istanbul' }).format(new Date());

async function recordUsage(user, t, env) {
  if (!env.DB) return;
  try {
    await env.DB.prepare(
      `INSERT INTO usage (user, month, cost_micros, input_tokens, output_tokens, requests) VALUES (?, ?, ?, ?, ?, 1)
       ON CONFLICT (user, month) DO UPDATE SET cost_micros = cost_micros + excluded.cost_micros,
         input_tokens = input_tokens + excluded.input_tokens, output_tokens = output_tokens + excluded.output_tokens,
         requests = requests + 1`,
    )
      .bind(user, monthKey(), Math.round(t.cost * 1e6), t.input + t.cacheRead + t.cacheWrite, t.output)
      .run();
  } catch (err) {
    console.error('Usage record failed:', err);
  }
}

async function monthUsage(user, env) {
  const month = monthKey();
  const row = await env.DB.prepare('SELECT * FROM usage WHERE user = ? AND month = ?').bind(user, month).first();
  return {
    month,
    cost: (row?.cost_micros ?? 0) / 1e6,
    input: row?.input_tokens ?? 0,
    output: row?.output_tokens ?? 0,
    requests: row?.requests ?? 0,
  };
}

// ─── History (D1) ──────────────────────────────────────────────────────────

async function listConvos(user, env, cors) {
  const { results } = await env.DB.prepare(
    'SELECT id, title, updated_at, project_id FROM conversations WHERE user = ? ORDER BY updated_at DESC LIMIT 500',
  )
    .bind(user)
    .all();
  return json(
    {
      items: results.map((r) => ({ id: r.id, title: r.title, updatedAt: r.updated_at, projectId: r.project_id ?? null })),
    },
    200,
    cors,
  );
}

async function getConvo(user, id, env, cors) {
  const row = await env.DB.prepare(
    'SELECT id, title, updated_at, project_id, data FROM conversations WHERE user = ? AND id = ?',
  )
    .bind(user, id)
    .first();
  if (!row) return json({ error: 'Sohbet bulunamadı.' }, 404, cors);
  // `data` is stored exactly as the page sent it; splice it in as-is so the
  // Worker never parses a large conversation.
  const head = JSON.stringify({ id: row.id, title: row.title, updatedAt: row.updated_at, projectId: row.project_id ?? null });
  return new Response(`${head.slice(0, -1)},"conversation":${row.data}}`, {
    status: 200,
    headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

// The body is the conversation JSON (messages, summary, container…),
// stored verbatim: only its size and outer shape are checked, to keep CPU
// time low. Title, timestamp and project ride along as query parameters
// and an X-Title header.
async function saveConvo(request, user, id, url, env, cors) {
  const declared = Number(request.headers.get('Content-Length') ?? 0);
  if (declared > MAX_CONVO_BYTES) return json({ error: 'Sohbet kaydedilemeyecek kadar büyük.' }, 413, cors);
  const data = await request.text();
  if (data.length > MAX_CONVO_BYTES) return json({ error: 'Sohbet kaydedilemeyecek kadar büyük.' }, 413, cors);
  if (!data.startsWith('{') || !data.endsWith('}')) return json({ error: 'Geçersiz sohbet.' }, 400, cors);

  const updatedAt = Number(url.searchParams.get('updatedAt'));
  if (!Number.isSafeInteger(updatedAt) || updatedAt <= 0) return json({ error: 'Geçersiz zaman.' }, 400, cors);
  const projectId = url.searchParams.get('projectId');
  if (projectId && !/^[\w-]{8,64}$/.test(projectId)) return json({ error: 'Geçersiz proje.' }, 400, cors);
  let title = '';
  try {
    title = decodeURIComponent(request.headers.get('X-Title') ?? '');
  } catch {}
  title = title.trim().slice(0, 120);

  await env.DB.prepare(
    `INSERT INTO conversations (user, id, title, updated_at, project_id, data) VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT (user, id) DO UPDATE SET title = excluded.title, updated_at = excluded.updated_at,
       project_id = excluded.project_id, data = excluded.data`,
  )
    .bind(user, id, title, updatedAt, projectId || null, data)
    .run();
  return new Response(null, { status: 204, headers: cors });
}

// ─── Settings (D1) ─────────────────────────────────────────────────────────

async function loadSettings(user, env) {
  if (!env.DB) return { name: '', instructions: '', memory: false };
  const row = await env.DB.prepare('SELECT display_name, instructions, memory_enabled FROM settings WHERE user = ?')
    .bind(user)
    .first();
  return { name: row?.display_name ?? '', instructions: row?.instructions ?? '', memory: (row?.memory_enabled ?? 1) === 1 };
}

async function saveSettings(request, user, env, cors) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Geçersiz JSON.' }, 400, cors);
  }
  const current = await loadSettings(user, env);
  const instructions = typeof data?.instructions === 'string' ? data.instructions.trim() : current.instructions;
  const memory = typeof data?.memory === 'boolean' ? data.memory : current.memory;
  // A name, not a prompt: one line, no markup.
  const name = typeof data?.name === 'string' ? data.name.replace(/[\s<>]+/g, ' ').trim() : current.name;
  if (instructions.length > MAX_INSTRUCTIONS_CHARS) {
    return json({ error: `Talimatlar en fazla ${MAX_INSTRUCTIONS_CHARS} karakter olabilir.` }, 413, cors);
  }
  if (name.length > MAX_NAME_CHARS) {
    return json({ error: `Ad en fazla ${MAX_NAME_CHARS} karakter olabilir.` }, 413, cors);
  }
  await env.DB.prepare(
    `INSERT INTO settings (user, display_name, instructions, memory_enabled, updated_at) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT (user) DO UPDATE SET display_name = excluded.display_name, instructions = excluded.instructions,
       memory_enabled = excluded.memory_enabled, updated_at = excluded.updated_at`,
  )
    .bind(user, name, instructions, memory ? 1 : 0, Date.now())
    .run();
  return json({ name, instructions, memory }, 200, cors);
}

// ─── Projects (D1) ─────────────────────────────────────────────────────────

function rowToProject(r) {
  let files = [];
  try {
    files = JSON.parse(r.files);
  } catch {}
  return { id: r.id, name: r.name, instructions: r.instructions, files, updatedAt: r.updated_at };
}

async function listProjects(user, env, cors) {
  const { results } = await env.DB.prepare('SELECT * FROM projects WHERE user = ? ORDER BY updated_at DESC')
    .bind(user)
    .all();
  return json({ items: results.map(rowToProject) }, 200, cors);
}

async function loadProject(user, id, env) {
  const row = await env.DB.prepare('SELECT * FROM projects WHERE user = ? AND id = ?').bind(user, id).first();
  return row ? rowToProject(row) : null;
}

async function saveProject(request, user, id, env, cors) {
  let data;
  try {
    const raw = await request.text();
    if (raw.length > 100_000) return json({ error: 'Proje çok büyük.' }, 413, cors);
    data = JSON.parse(raw);
  } catch {
    return json({ error: 'Geçersiz JSON.' }, 400, cors);
  }
  const name = typeof data?.name === 'string' ? data.name.trim().slice(0, 80) : '';
  const instructions = typeof data?.instructions === 'string' ? data.instructions.trim() : '';
  if (!name) return json({ error: 'Projeye bir ad ver.' }, 400, cors);
  if (instructions.length > MAX_PROJECT_INSTRUCTIONS_CHARS) {
    return json({ error: `Proje talimatları en fazla ${MAX_PROJECT_INSTRUCTIONS_CHARS} karakter olabilir.` }, 413, cors);
  }
  const files = [];
  for (const f of Array.isArray(data?.files) ? data.files : []) {
    if (files.length >= MAX_PROJECT_FILES) return json({ error: `Bir projede en fazla ${MAX_PROJECT_FILES} dosya olabilir.` }, 400, cors);
    if (!(await verifyRef(f?.ref, f?.kind, env))) return json({ error: 'Dosyalardan biri geçersiz.' }, 400, cors);
    files.push({ ref: f.ref, kind: f.kind, name: String(f.name ?? 'dosya').slice(0, 120), expiresAt: f.expiresAt ?? null });
  }
  await env.DB.prepare(
    `INSERT INTO projects (user, id, name, instructions, files, updated_at) VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT (user, id) DO UPDATE SET name = excluded.name, instructions = excluded.instructions,
       files = excluded.files, updated_at = excluded.updated_at`,
  )
    .bind(user, id, name, instructions, JSON.stringify(files), Date.now())
    .run();
  return json({ id, name, instructions, files }, 200, cors);
}

async function deleteProject(user, id, env, cors) {
  const project = await loadProject(user, id, env);
  if (project) {
    for (const f of project.files) {
      const fileId = await verifyRef(f.ref, f.kind, env);
      if (fileId) await anthropicDeleteFile(fileId, env);
    }
    await env.DB.prepare('DELETE FROM projects WHERE user = ? AND id = ?').bind(user, id).run();
    await env.DB.prepare('UPDATE conversations SET project_id = NULL WHERE user = ? AND project_id = ?').bind(user, id).run();
  }
  return new Response(null, { status: 204, headers: cors });
}

// ─── Memory tool (D1) ──────────────────────────────────────────────────────
// Claude's memory lives under /memories, one row per file. Folders exist
// implicitly through the paths. Messages follow the memory tool docs.

function normalizeMemoryPath(path) {
  if (typeof path !== 'string' || path.length > 200) return null;
  if (/[\\\0%]/.test(path)) return null;
  const segs = path.split('/').filter(Boolean);
  if (segs[0] !== 'memories') return null;
  if (segs.some((s) => s === '..' || s === '.' || s.startsWith('.'))) return null;
  return `/${segs.join('/')}`;
}

async function memoryFiles(user, env) {
  const { results } = await env.DB.prepare('SELECT path, content, updated_at FROM memories WHERE user = ? ORDER BY path')
    .bind(user)
    .all();
  return results.map((r) => ({ path: r.path, content: r.content, updatedAt: r.updated_at }));
}

async function memoryPut(user, path, content, env) {
  await env.DB.prepare(
    `INSERT INTO memories (user, path, content, updated_at) VALUES (?, ?, ?, ?)
     ON CONFLICT (user, path) DO UPDATE SET content = excluded.content, updated_at = excluded.updated_at`,
  )
    .bind(user, path, content, Date.now())
    .run();
}

async function memoryDelete(user, path, env) {
  await env.DB.prepare('DELETE FROM memories WHERE user = ? AND (path = ? OR path LIKE ?)')
    .bind(user, path, `${path}/%`)
    .run();
}

const humanSize = (n) => (n < 1024 ? `${n}` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)}K` : `${(n / 1048576).toFixed(1)}M`);

async function runMemory(user, input, env) {
  const ok = (text) => ({ text, error: false });
  const fail = (text) => ({ text, error: true });
  const cmd = input.command;
  const path = normalizeMemoryPath(input.path ?? input.old_path);
  if (!path) return fail(`Error: The path ${input.path ?? input.old_path} is not allowed. Use paths under /memories.`);
  const files = await memoryFiles(user, env);
  const isDir = path === '/memories' || files.some((f) => f.path.startsWith(`${path}/`));
  const current = files.find((f) => f.path === path)?.content ?? null;

  switch (cmd) {
    case 'view': {
      if (current !== null) {
        let lines = current.split('\n');
        const range = Array.isArray(input.view_range) ? input.view_range : null;
        if (range) lines = lines.slice(Math.max(0, range[0] - 1), range[1] === -1 ? undefined : range[1]);
        const offset = range ? Math.max(1, range[0]) : 1;
        let text = lines.map((l, i) => `${String(i + offset).padStart(6)}\t${l}`).join('\n');
        if (text.length > 16_000) text = `${text.slice(0, 16_000)}\n… (truncated; use view_range)`;
        return ok(`Here's the content of ${path} with line numbers:\n${text}`);
      }
      if (isDir) {
        const under = files.filter((f) => f.path.startsWith(`${path}/`));
        const entries = new Map();
        for (const f of under) {
          const rel = f.path.slice(path.length + 1).split('/');
          for (let depth = 1; depth <= Math.min(2, rel.length); depth++) {
            const p = `${path}/${rel.slice(0, depth).join('/')}`;
            entries.set(p, (entries.get(p) ?? 0) + f.content.length);
          }
        }
        const total = under.reduce((s, f) => s + f.content.length, 0);
        const listing = [`${humanSize(total)}\t${path}`, ...[...entries].sort().map(([p, n]) => `${humanSize(n)}\t${p}`)];
        return ok(`Here're the files and directories up to 2 levels deep in ${path}, excluding hidden items and node_modules:\n${listing.join('\n')}`);
      }
      return fail(`The path ${path} does not exist. Please provide a valid path.`);
    }
    case 'create': {
      const text = String(input.file_text ?? '');
      if (isDir) return fail(`Error: ${path} is a directory`);
      if (text.length > MAX_MEMORY_FILE_CHARS) return fail(`Error: File too long (max ${MAX_MEMORY_FILE_CHARS} characters). Keep memory files short.`);
      if (current === null && files.length >= MAX_MEMORY_FILES) return fail(`Error: Memory is full (${MAX_MEMORY_FILES} files). Delete or merge old files first.`);
      await memoryPut(user, path, text, env);
      return ok(`File created successfully at: ${path}`);
    }
    case 'str_replace': {
      if (current === null) return fail(`Error: The path ${path} does not exist. Please provide a valid path.`);
      const oldStr = String(input.old_str ?? '');
      const at = [];
      for (let i = current.indexOf(oldStr); oldStr && i !== -1; i = current.indexOf(oldStr, i + 1)) at.push(i);
      if (at.length === 0) return fail(`No replacement was performed, old_str \`${oldStr}\` did not appear verbatim in ${path}.`);
      if (at.length > 1) {
        const lines = at.map((i) => current.slice(0, i).split('\n').length);
        return fail(`No replacement was performed. Multiple occurrences of old_str \`${oldStr}\` in lines: ${lines.join(', ')}. Please ensure it is unique`);
      }
      const next = current.slice(0, at[0]) + String(input.new_str ?? '') + current.slice(at[0] + oldStr.length);
      if (next.length > MAX_MEMORY_FILE_CHARS) return fail('Error: File would become too long. Keep memory files short.');
      await memoryPut(user, path, next, env);
      return ok('The memory file has been edited.');
    }
    case 'insert': {
      if (current === null) return fail(`Error: The path ${path} does not exist`);
      const lines = current.split('\n');
      const at = Number(input.insert_line);
      if (!Number.isInteger(at) || at < 0 || at > lines.length) {
        return fail(`Error: Invalid \`insert_line\` parameter: ${input.insert_line}. It should be within the range of lines of the file: [0, ${lines.length}]`);
      }
      lines.splice(at, 0, String(input.insert_text ?? '').replace(/\n$/, ''));
      const next = lines.join('\n');
      if (next.length > MAX_MEMORY_FILE_CHARS) return fail('Error: File would become too long. Keep memory files short.');
      await memoryPut(user, path, next, env);
      return ok(`The file ${path} has been edited.`);
    }
    case 'delete': {
      if (path === '/memories') return fail('Error: The /memories directory itself cannot be deleted');
      if (current === null && !isDir) return fail(`Error: The path ${path} does not exist`);
      await memoryDelete(user, path, env);
      return ok(`Successfully deleted ${path}`);
    }
    case 'rename': {
      const to = normalizeMemoryPath(input.new_path);
      if (path === '/memories') return fail('Error: The /memories directory itself cannot be renamed');
      if (!to || to === '/memories') return fail(`Error: The path ${input.new_path} is not allowed. Use paths under /memories.`);
      if (current === null && !isDir) return fail(`Error: The path ${path} does not exist`);
      if (files.some((f) => f.path === to || f.path.startsWith(`${to}/`))) return fail(`Error: The destination ${to} already exists`);
      for (const f of files.filter((x) => x.path === path || x.path.startsWith(`${path}/`))) {
        await memoryPut(user, to + f.path.slice(path.length), f.content, env);
      }
      await memoryDelete(user, path, env);
      return ok(`Successfully renamed ${path} to ${to}`);
    }
  }
  return fail(`Error: unknown command ${cmd}`);
}

// ─── Files ─────────────────────────────────────────────────────────────────

// The page sends the file as the raw body, its type as Content-Type and its
// name URL-encoded in X-File-Name. The Worker builds the multipart upload
// itself so it controls the type allowlist and the expiry (?keep=1 for
// project files, which stay until the project is deleted).
async function uploadFile(request, url, env, cors) {
  if (!env.FILE_REF_SECRET) {
    return json({ error: 'Dosya yükleme henüz açılmadı.' }, 503, cors);
  }
  const type = (request.headers.get('Content-Type') ?? '').split(';')[0].trim().toLowerCase();
  const kind = UPLOAD_TYPES[type];
  if (!kind) {
    return json({ error: 'Bu dosya türü desteklenmiyor.' }, 415, cors);
  }
  const declared = Number(request.headers.get('Content-Length') ?? 0);
  if (declared > MAX_UPLOAD_BYTES) {
    return json({ error: 'Dosya çok büyük (en fazla 15 MB).' }, 413, cors);
  }

  const blob = await request.blob();
  if (blob.size === 0) return json({ error: 'Dosya boş.' }, 400, cors);
  if (blob.size > MAX_UPLOAD_BYTES) {
    return json({ error: 'Dosya çok büyük (en fazla 15 MB).' }, 413, cors);
  }

  const form = new FormData();
  form.append('file', new File([blob], safeFileName(request.headers.get('X-File-Name'), type), { type }));
  if (url.searchParams.get('keep') !== '1') form.append('expires_in_seconds', String(FILE_TTL_SECONDS));

  let upstream;
  try {
    upstream = await fetch(ANTHROPIC_FILES_URL, {
      method: 'POST',
      headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': ANTHROPIC_VERSION },
      body: form,
    });
  } catch (err) {
    console.error('Files upload failed:', err);
    return json({ error: 'Dosya yüklenemedi.' }, 502, cors);
  }
  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '');
    console.error(`Files ${upstream.status}: ${detail.slice(0, 500)}`);
    return json(...upstreamError(upstream.status), cors);
  }

  const file = await upstream.json();
  return json(
    { ref: await signRef(file.id, kind, env), kind, expiresAt: file.expires_at ?? null },
    200,
    cors,
  );
}

async function deleteFile(ref, env, cors) {
  let fileId = null;
  for (const kind of Object.keys(BLOCK_TYPES)) fileId ??= await verifyRef(ref, kind, env);
  if (!fileId) return json({ error: 'Geçersiz dosya.' }, 400, cors);
  if (!(await anthropicDeleteFile(fileId, env))) return json({ error: 'Dosya silinemedi.' }, 502, cors);
  return new Response(null, { status: 204, headers: cors });
}

async function anthropicDeleteFile(fileId, env) {
  try {
    const res = await fetch(`${ANTHROPIC_FILES_URL}/${fileId}`, {
      method: 'DELETE',
      headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': ANTHROPIC_VERSION },
    });
    // Already gone (deleted or expired) counts as done.
    return res.ok || res.status === 404;
  } catch {
    return false;
  }
}

// Files code execution made during a turn: remember they belong to this
// user, and look up their names for the download chips.
async function recordOutputs(user, ids, env) {
  const files = [];
  for (const id of ids.slice(0, 10)) {
    let name = 'dosya';
    try {
      const res = await fetch(`${ANTHROPIC_FILES_URL}/${id}`, {
        headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': ANTHROPIC_VERSION },
      });
      if (res.ok) name = (await res.json()).filename ?? name;
    } catch {}
    files.push({ id, name });
    if (env.DB) {
      await env.DB.prepare('INSERT OR REPLACE INTO outputs (user, file_id, filename, created_at) VALUES (?, ?, ?, ?)')
        .bind(user, id, name, Date.now())
        .run()
        .catch(() => {});
    }
  }
  return files;
}

async function downloadOutput(user, fileId, env, cors) {
  const row = await env.DB.prepare('SELECT filename FROM outputs WHERE user = ? AND file_id = ?').bind(user, fileId).first();
  if (!row) return json({ error: 'Dosya bulunamadı.' }, 404, cors);
  const res = await fetch(`${ANTHROPIC_FILES_URL}/${fileId}/content`, {
    headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': ANTHROPIC_VERSION },
  });
  if (!res.ok) return json({ error: 'Dosya indirilemedi (süresi dolmuş olabilir).' }, res.status === 404 ? 404 : 502, cors);
  const ascii = row.filename.replace(/[^\x20-\x7e]/g, '_').replace(/"/g, '');
  return new Response(res.body, {
    status: 200,
    headers: {
      ...cors,
      'Content-Type': res.headers.get('Content-Type') ?? 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(row.filename)}`,
      'Access-Control-Expose-Headers': 'Content-Disposition',
    },
  });
}

function safeFileName(header, type) {
  let name = '';
  try {
    name = decodeURIComponent(header ?? '');
  } catch {}
  // The Files API rejects < > : " | ? * \ / and control characters.
  name = name.replace(/[<>:"|?*\\/\u0000-\u001f]/g, '_').trim().slice(0, 120);
  if (name) return name;
  return type === 'application/pdf' ? 'belge.pdf' : type === 'text/plain' ? 'metin.txt' : 'dosya';
}

// ref = <file_id>.<HMAC(file_id:kind)>, so a ref can't be forged or reused
// as another block type.
async function signRef(fileId, kind, env) {
  return `${fileId}.${await refSignature(fileId, kind, env)}`;
}

async function verifyRef(ref, kind, env) {
  if (!env.FILE_REF_SECRET || typeof ref !== 'string' || !Object.hasOwn(BLOCK_TYPES, kind)) return null;
  const dot = ref.lastIndexOf('.');
  if (dot <= 0) return null;
  const fileId = ref.slice(0, dot);
  if (!/^file_[A-Za-z0-9]{1,100}$/.test(fileId)) return null;
  const enc = new TextEncoder();
  const given = enc.encode(ref.slice(dot + 1));
  const expected = enc.encode(await refSignature(fileId, kind, env));
  if (given.byteLength !== expected.byteLength) return null;
  return crypto.subtle.timingSafeEqual(given, expected) ? fileId : null;
}

async function refSignature(fileId, kind, env) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(env.FILE_REF_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${fileId}:${kind}`));
  return btoa(String.fromCharCode(...new Uint8Array(mac).slice(0, 18)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function parseOrigins(value) {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function corsHeaders(origin, allowed) {
  if (!origin || !allowed.includes(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-File-Name, X-Title',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

// HTTP headers can only carry Latin-1, so the page URL-encodes the password
// (ö, ş, ğ, ı… arrive as %C3%B6 etc.). Both sides are NFC-normalized so a
// decomposed "o + ¨" typed on macOS still matches a precomposed "ö".
function decodeToken(value) {
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {}
  return normalizeToken(decoded);
}

function normalizeToken(value) {
  return value.trim().normalize('NFC');
}

// Constant-time comparison. Hashing first makes both sides the same length,
// so neither the content nor the length of the secret leaks through timing.
async function tokensMatch(given, expected) {
  if (!given) return false;
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(given)),
    crypto.subtle.digest('SHA-256', enc.encode(expected)),
  ]);
  return crypto.subtle.timingSafeEqual(a, b);
}

function json(data, status, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
  });
}
