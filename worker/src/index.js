/**
 * kaanusta.dev chat proxy — Cloudflare Worker.
 *
 * Browser (/chat on GitHub Pages) → this Worker → Anthropic Messages API.
 * The Anthropic key lives only here, as a Worker secret. The browser sends
 * a shared password (ACCESS_TOKEN) and the conversation's `messages`;
 * everything else about the request (model, max_tokens, system prompt) is
 * fixed below so a client can't change it.
 *
 * Secrets (set with `wrangler secret put`, never in code):
 *   ANTHROPIC_API_KEY  — Anthropic Console key
 *   ACCESS_TOKEN       — shared password the chat page sends as a Bearer token
 *                        (URL-encoded, so Turkish letters like ö/ş survive)
 *
 * Vars (wrangler.toml):
 *   ALLOWED_ORIGINS    — comma-separated list of origins allowed by CORS
 *
 * Bindings (wrangler.toml, optional):
 *   RATE_LIMITER       — Workers Rate Limiting binding, keyed per client IP
 *
 * Routes:
 *   POST /      → chat (streams Anthropic SSE back unchanged)
 *   GET  /auth  → 204 if the token is valid, 401 otherwise (password check)
 */

// ─── Request shape — change these, not the client ──────────────────────────

// Model ids: https://platform.claude.com/docs/en/about-claude/models/overview
const MODEL = 'claude-opus-5-5';

// Upper bound on one reply. Opus 5.5 always thinks before answering and the
// thinking tokens count against this limit, so 1024 would cut long answers
// short; 4096 leaves room. It's a ceiling — you only pay for what's used.
const MAX_TOKENS = 4096;

// Opus 5.5 defaults to "medium". "low" is quicker and cheaper and is
// plenty for everyday chat; use "medium" or "high" for harder questions.
const EFFORT = 'low';

// When Anthropic's safety classifiers decline a request, retry it on the
// recommended fallback model inside the same call (server-side). Set to
// false to turn it off.
const USE_FALLBACK = true;
const FALLBACK_BETA = 'server-side-fallback-2026-07-01';

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
    const route = `${request.method} ${url.pathname}`;
    if (route !== 'POST /' && route !== 'GET /auth') {
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

    if (!env.ACCESS_TOKEN || !env.ANTHROPIC_API_KEY) {
      console.error('Missing ACCESS_TOKEN or ANTHROPIC_API_KEY secret.');
      return json({ error: 'Sunucu yapılandırılmamış.' }, 500, cors);
    }

    const auth = request.headers.get('Authorization') ?? '';
    const token = auth.startsWith('Bearer ') ? decodeToken(auth.slice(7)) : '';
    if (!(await tokensMatch(token, normalizeToken(env.ACCESS_TOKEN)))) {
      return json({ error: 'Parola hatalı.' }, 401, cors);
    }

    if (route === 'GET /auth') {
      return new Response(null, { status: 204, headers: cors });
    }

    const parsed = await readMessages(request);
    if (parsed.error) {
      return json({ error: parsed.error }, parsed.status, cors);
    }

    return proxyToAnthropic(parsed.messages, env, cors);
  },
};

// ─── Anthropic ─────────────────────────────────────────────────────────────

async function proxyToAnthropic(messages, env, cors) {
  const body = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages,
    output_config: { effort: EFFORT },
    stream: true,
  };
  const headers = {
    'x-api-key': env.ANTHROPIC_API_KEY,
    'anthropic-version': ANTHROPIC_VERSION,
    'content-type': 'application/json',
  };
  if (USE_FALLBACK) {
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

async function readMessages(request) {
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

  // Rebuild each message from scratch so nothing but role + text reaches
  // the API (no images, tool blocks, system roles, or extra fields).
  const messages = [];
  let total = 0;
  for (const m of input) {
    const role = m?.role;
    const content = typeof m?.content === 'string' ? m.content.trim() : '';
    if (role !== 'user' && role !== 'assistant') {
      return { error: 'Geçersiz mesaj rolü.', status: 400 };
    }
    if (!content) {
      return { error: 'Boş mesaj gönderilemez.', status: 400 };
    }
    if (content.length > MAX_MESSAGE_CHARS) {
      return { error: 'Mesajlardan biri çok uzun.', status: 413 };
    }
    total += content.length;
    messages.push({ role, content });
  }
  if (total > MAX_TOTAL_CHARS) {
    return { error: 'Sohbet çok uzadı. Yeni bir sohbet başlat.', status: 413 };
  }
  if (messages[0].role !== 'user' || messages.at(-1).role !== 'user') {
    return { error: 'Sohbet kullanıcı mesajıyla başlayıp bitmeli.', status: 400 };
  }

  return { messages };
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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
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
