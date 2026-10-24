/**
 * kaanusta.dev chat proxy — Cloudflare Worker.
 *
 * Browser (/chat on GitHub Pages) → this Worker → Anthropic Messages API.
 * The Anthropic key lives only here, as a Worker secret. Each person has
 * their own password; the Worker maps it to a user id and keeps that
 * user's conversations and settings in D1. The browser sends the
 * conversation's `messages` plus a `model`, `effort` and `web` choice from
 * the allowlists below; everything else (max_tokens, system prompt, tools,
 * fallbacks) is decided here.
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
 *   DB                 — D1 database with conversations + settings
 *   RATE_LIMITER       — Workers Rate Limiting binding, keyed per client IP
 *
 * Routes (all need the password):
 *   GET    /auth             → { user }
 *   POST   /                 → chat (streams Anthropic SSE back unchanged)
 *   POST   /title            → { title } for a new conversation (Haiku)
 *   POST   /files            → upload one attachment (raw body) to the Files API
 *   DELETE /files/<ref>      → delete an attachment this Worker uploaded
 *   GET    /convos           → { items: [{ id, title, updatedAt }] }
 *   GET    /convos/<id>      → { id, title, updatedAt, messages }
 *   PUT    /convos/<id>      → save (raw messages JSON body, see saveConvo)
 *   DELETE /convos/<id>      → delete
 *   GET    /settings         → { instructions }
 *   PUT    /settings         → save { instructions }
 *
 * Uploaded files are visible to the whole Anthropic workspace, so the page
 * never gets a bare file_id: it gets `<file_id>.<signature>`, and the Worker
 * only accepts references it signed itself.
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
  'claude-opus-5-5': { fallback: true }, // $4 / $20 per MTok
  'claude-sonnet-5-5': { fallback: true }, // $2 / $10 per MTok
  'claude-haiku-5-5': { fallback: false }, // $0.10 / $0.50 per MTok
};
const DEFAULT_MODEL = 'claude-opus-5-5';

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

// Attachments. Each type maps to the content block the API expects. Images
// are downscaled in the browser before upload; the size cap is for PDFs.
const UPLOAD_TYPES = {
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'application/pdf': 'document',
  'text/plain': 'document',
};
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const FILE_TTL_SECONDS = 90 * 24 * 60 * 60; // the Files API maximum
const ANTHROPIC_FILES_URL = 'https://api.anthropic.com/v1/files';

// Users and the secret holding each one's password.
const USERS = [
  { id: 'partner', secret: 'ACCESS_TOKEN' },
  { id: 'kaan', secret: 'ACCESS_TOKEN_KAAN' },
];

// Web search (server tool, $10 per 1,000 searches on top of tokens). The
// basic version works on every model in MODELS.
const WEB_SEARCH_TOOL = {
  type: 'web_search_20250305',
  name: 'web_search',
  max_uses: 5,
  user_location: { type: 'approximate', country: 'TR', timezone: 'Europe/Istanbul' },
};

// Conversation titles come from the cheapest model.
const TITLE_MODEL = 'claude-haiku-5-5';

const SYSTEM_PROMPT = `You are a warm, helpful assistant chatting with one person through a small private chat page.
Reply in the language the user writes in (usually Turkish). Write naturally, not like a word-for-word translation.
Keep answers as long as the question needs: short for casual chat, thorough for real questions.
Use Markdown when it helps (lists, headings, code blocks); don't use it for simple conversational replies.`;

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

// ─── Abuse / cost limits ───────────────────────────────────────────────────

const MAX_BODY_BYTES = 256 * 1024; // raw request body
const MAX_MESSAGES = 60; // turns in one conversation
const MAX_MESSAGE_CHARS = 20_000; // one message
const MAX_TOTAL_CHARS = 120_000; // whole conversation (~30-40k tokens)
const MAX_ATTACHMENTS_PER_MESSAGE = 5;
const MAX_ATTACHMENTS_TOTAL = 20; // attachments are re-sent every turn
const MAX_CONVO_BYTES = 1_500_000; // one saved conversation (D1 rows top out at 2 MB)
const MAX_INSTRUCTIONS_CHARS = 2_000;

const ROUTES = [
  ['GET', /^\/auth$/, 'auth'],
  ['POST', /^\/$/, 'chat'],
  ['POST', /^\/title$/, 'title'],
  ['POST', /^\/files$/, 'upload'],
  ['DELETE', /^\/files\/([\w.-]{1,200})$/, 'deleteFile'],
  ['GET', /^\/convos$/, 'listConvos'],
  ['GET', /^\/convos\/([\w-]{8,64})$/, 'getConvo'],
  ['PUT', /^\/convos\/([\w-]{8,64})$/, 'saveConvo'],
  ['DELETE', /^\/convos\/([\w-]{8,64})$/, 'deleteConvo'],
  ['GET', /^\/settings$/, 'getSettings'],
  ['PUT', /^\/settings$/, 'saveSettings'],
];

// ─── Worker ────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
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
        const parsed = await readMessages(request, env);
        if (parsed.error) return json({ error: parsed.error }, parsed.status, cors);
        return proxyToAnthropic(parsed, user, env, cors);
      }
      case 'title':
        return makeTitle(request, env, cors);
      case 'upload':
        return uploadFile(request, env, cors);
      case 'deleteFile':
        return deleteFile(param, env, cors);
    }

    if (!env.DB) {
      return json({ error: 'Sohbet geçmişi sunucuda açık değil.' }, 503, cors);
    }
    switch (name) {
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
        return json({ instructions: await loadInstructions(user, env) }, 200, cors);
      case 'saveSettings':
        return saveSettings(request, user, env, cors);
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

// ─── Anthropic ─────────────────────────────────────────────────────────────

async function proxyToAnthropic({ messages, model, effort, web }, user, env, cors) {
  const body = {
    model,
    max_tokens: EFFORTS[effort],
    system: systemPrompt(await loadInstructions(user, env)),
    messages,
    // Thinking stays adaptive; "summarized" lets the page show what the
    // model was thinking about (the raw chain of thought is never sent).
    thinking: { type: 'adaptive', display: 'summarized' },
    output_config: { effort },
    // Cache the conversation prefix so a long chat (or an attached PDF)
    // isn't billed at full price again on every turn.
    cache_control: { type: 'ephemeral' },
    stream: true,
  };
  const headers = {
    'x-api-key': env.ANTHROPIC_API_KEY,
    'anthropic-version': ANTHROPIC_VERSION,
    'content-type': 'application/json',
  };
  if (web) body.tools = [WEB_SEARCH_TOOL];
  if (MODELS[model].fallback) {
    body.fallbacks = 'default';
    headers['anthropic-beta'] = FALLBACK_BETA;
  }

  let upstream;
  try {
    upstream = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error('Anthropic fetch failed:', err);
    return json({ error: 'Yapay zekâ servisine ulaşılamadı.' }, 502, cors);
  }

  if (!upstream.ok) {
    // Log the upstream error for `wrangler tail`, but give the client only
    // a short, generic message — no key, no internals.
    const detail = await upstream.text().catch(() => '');
    console.error(`Anthropic ${upstream.status}: ${detail.slice(0, 500)}`);
    return json(...upstreamError(upstream.status), cors);
  }

  // Hand the SSE stream through untouched.
  return new Response(upstream.body, {
    status: 200,
    headers: {
      ...cors,
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
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

// ─── Input validation ──────────────────────────────────────────────────────

async function readMessages(request, env) {
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
  const counts = { chars: 0, attachments: 0 };
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

  return { messages, model, effort, web: data.web === true };
}

// A message is either a string or a list of blocks:
//   { type: 'text', text }  |  { type: 'image', ref }  |  { type: 'document', ref, title? }
// Attachments are allowed only in user messages.
async function readContent(content, role, env, counts) {
  if (typeof content === 'string') {
    const text = content.trim();
    if (!text) return { error: 'Boş mesaj gönderilemez.', status: 400 };
    if (text.length > MAX_MESSAGE_CHARS) return { error: 'Mesajlardan biri çok uzun.', status: 413 };
    counts.chars += text.length;
    return { value: text };
  }
  if (!Array.isArray(content) || content.length === 0 || content.length > MAX_ATTACHMENTS_PER_MESSAGE + 1) {
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
    } else if ((block?.type === 'image' || block?.type === 'document') && role === 'user') {
      const fileId = await verifyRef(block.ref, block.type, env);
      if (!fileId) return { error: 'Eklerden biri artık kullanılamıyor.', status: 400 };
      attachments += 1;
      const out = { type: block.type, source: { type: 'file', file_id: fileId } };
      if (block.type === 'document' && typeof block.title === 'string' && block.title.trim()) {
        out.title = block.title.trim().slice(0, 200);
      }
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

// ─── Prompt ────────────────────────────────────────────────────────────────

function systemPrompt(instructions) {
  const today = new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'full',
    timeZone: 'Europe/Istanbul',
  }).format(new Date());
  let prompt = `${SYSTEM_PROMPT}\n\nToday is ${today} (Europe/Istanbul).`;
  if (instructions) {
    prompt += `\n\nThe person you're talking to left these standing instructions. Follow them unless they would make you unsafe or dishonest:\n<user_instructions>\n${instructions}\n</user_instructions>`;
  }
  return prompt;
}

async function makeTitle(request, env, cors) {
  let text = '';
  try {
    const data = await request.json();
    text = typeof data?.text === 'string' ? data.text.slice(0, 2000) : '';
  } catch {}
  if (!text.trim()) return json({ error: 'Metin gerekli.' }, 400, cors);

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': ANTHROPIC_VERSION,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: TITLE_MODEL,
        max_tokens: 300,
        output_config: { effort: 'low' },
        system:
          'Write a short title (at most 6 words) for a chat that starts with the message below. Use the language of the message. Reply with the title only: no quotes, no trailing punctuation.',
        messages: [{ role: 'user', content: text }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}`);
    const msg = await res.json();
    const title = (msg.content ?? [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .replace(/^["'“”]+|["'“”.]+$/g, '')
      .trim()
      .slice(0, 60);
    return title ? json({ title }, 200, cors) : json({ error: 'Başlık üretilemedi.' }, 502, cors);
  } catch (err) {
    console.error('Title failed:', err);
    return json({ error: 'Başlık üretilemedi.' }, 502, cors);
  }
}

// ─── History (D1) ──────────────────────────────────────────────────────────

async function listConvos(user, env, cors) {
  const { results } = await env.DB.prepare(
    'SELECT id, title, updated_at FROM conversations WHERE user = ? ORDER BY updated_at DESC LIMIT 500',
  )
    .bind(user)
    .all();
  return json(
    { items: results.map((r) => ({ id: r.id, title: r.title, updatedAt: r.updated_at })) },
    200,
    cors,
  );
}

async function getConvo(user, id, env, cors) {
  const row = await env.DB.prepare(
    'SELECT id, title, updated_at, data FROM conversations WHERE user = ? AND id = ?',
  )
    .bind(user, id)
    .first();
  if (!row) return json({ error: 'Sohbet bulunamadı.' }, 404, cors);
  // `data` is stored exactly as the page sent it; splice it in as-is so the
  // Worker never parses a large conversation.
  const head = JSON.stringify({ id: row.id, title: row.title, updatedAt: row.updated_at });
  return new Response(`${head.slice(0, -1)},"messages":${row.data}}`, {
    status: 200,
    headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

// The body is the messages array as JSON, stored verbatim (only its size
// and outer shape are checked, to keep CPU time low). Title and timestamp
// ride along as ?updatedAt= and an X-Title header (URL-encoded).
async function saveConvo(request, user, id, url, env, cors) {
  const declared = Number(request.headers.get('Content-Length') ?? 0);
  if (declared > MAX_CONVO_BYTES) return json({ error: 'Sohbet kaydedilemeyecek kadar büyük.' }, 413, cors);
  const data = await request.text();
  if (data.length > MAX_CONVO_BYTES) return json({ error: 'Sohbet kaydedilemeyecek kadar büyük.' }, 413, cors);
  if (!data.startsWith('[') || !data.endsWith(']')) return json({ error: 'Geçersiz sohbet.' }, 400, cors);

  const updatedAt = Number(url.searchParams.get('updatedAt'));
  if (!Number.isSafeInteger(updatedAt) || updatedAt <= 0) return json({ error: 'Geçersiz zaman.' }, 400, cors);
  let title = '';
  try {
    title = decodeURIComponent(request.headers.get('X-Title') ?? '');
  } catch {}
  title = title.trim().slice(0, 120);

  await env.DB.prepare(
    `INSERT INTO conversations (user, id, title, updated_at, data) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT (user, id) DO UPDATE SET title = excluded.title, updated_at = excluded.updated_at, data = excluded.data`,
  )
    .bind(user, id, title, updatedAt, data)
    .run();
  return new Response(null, { status: 204, headers: cors });
}

async function loadInstructions(user, env) {
  if (!env.DB) return '';
  const row = await env.DB.prepare('SELECT instructions FROM settings WHERE user = ?').bind(user).first();
  return row?.instructions ?? '';
}

async function saveSettings(request, user, env, cors) {
  let instructions = '';
  try {
    const data = await request.json();
    instructions = typeof data?.instructions === 'string' ? data.instructions.trim() : '';
  } catch {
    return json({ error: 'Geçersiz JSON.' }, 400, cors);
  }
  if (instructions.length > MAX_INSTRUCTIONS_CHARS) {
    return json({ error: `Talimatlar en fazla ${MAX_INSTRUCTIONS_CHARS} karakter olabilir.` }, 413, cors);
  }
  await env.DB.prepare(
    `INSERT INTO settings (user, instructions, updated_at) VALUES (?, ?, ?)
     ON CONFLICT (user) DO UPDATE SET instructions = excluded.instructions, updated_at = excluded.updated_at`,
  )
    .bind(user, instructions, Date.now())
    .run();
  return json({ instructions }, 200, cors);
}

// ─── Files ─────────────────────────────────────────────────────────────────

// The page sends the file as the raw body, its type as Content-Type and its
// name URL-encoded in X-File-Name. The Worker builds the multipart upload
// itself so it controls the type allowlist and the expiry.
async function uploadFile(request, env, cors) {
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
  form.append('expires_in_seconds', String(FILE_TTL_SECONDS));

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
  const fileId =
    (await verifyRef(ref, 'image', env)) ?? (await verifyRef(ref, 'document', env));
  if (!fileId) return json({ error: 'Geçersiz dosya.' }, 400, cors);
  try {
    const res = await fetch(`${ANTHROPIC_FILES_URL}/${fileId}`, {
      method: 'DELETE',
      headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': ANTHROPIC_VERSION },
    });
    // Already gone (deleted or expired) counts as done.
    if (!res.ok && res.status !== 404) {
      console.error(`Files delete ${res.status}`);
      return json({ error: 'Dosya silinemedi.' }, 502, cors);
    }
  } catch (err) {
    console.error('Files delete failed:', err);
    return json({ error: 'Dosya silinemedi.' }, 502, cors);
  }
  return new Response(null, { status: 204, headers: cors });
}

function safeFileName(header, type) {
  let name = '';
  try {
    name = decodeURIComponent(header ?? '');
  } catch {}
  // The Files API rejects < > : " | ? * \ / and control characters.
  name = name.replace(/[<>:"|?*\\/\u0000-\u001f]/g, '_').trim().slice(0, 120);
  if (name) return name;
  return type === 'application/pdf' ? 'belge.pdf' : type === 'text/plain' ? 'metin.txt' : 'gorsel';
}

// ref = <file_id>.<HMAC(file_id:kind)>, so a ref can't be forged or reused
// as the other block type.
async function signRef(fileId, kind, env) {
  return `${fileId}.${await refSignature(fileId, kind, env)}`;
}

async function verifyRef(ref, kind, env) {
  if (!env.FILE_REF_SECRET || typeof ref !== 'string') return null;
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
