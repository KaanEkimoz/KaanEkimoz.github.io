/**
 * Site-wide constants — single source of truth for branding, links, and metadata.
 * Edit values here; they propagate everywhere.
 *
 * Locale-dependent strings (title, description, role-specific copy, NAV labels)
 * live in `src/lib/i18n.ts`. The SITE export here keeps the locale-agnostic
 * fields plus EN fallbacks for tooling that doesn't know about locales.
 */

export const SITE = {
  name: 'kaanusta.dev',
  title: 'Kaan Usta — Full-Stack Developer',
  description:
    'Full-stack developer in Istanbul. I build and ship complete products: backend, web, mobile and the pipeline that deploys them.',
  url: 'https://kaanusta.dev',
  author: 'Kaan Usta',
  locale: 'en-US',
} as const;

// Order of navigation links — labels resolve from i18n.ts at render time so
// they translate per locale. `href` here is the EN-canonical path; pages add
// the /tr prefix when rendering the TR header.
export const NAV = [
  { key: 'projects', href: '/projects' },
  { key: 'blog', href: '/blog' },
  { key: 'resume', href: '/resume' },
] as const;

export const SOCIAL = {
  email: 'kaanekimoz@gmail.com',
  github: 'https://github.com/KaanEkimoz',
  linkedin: 'https://linkedin.com/in/yusufkaanusta/',
  youtube: 'https://youtube.com/channel/UCABKLpR-H1MvMzF9sBcnYqA',
  itchio: 'https://ekimozkaan.itch.io',
} as const;

// Cloudflare Worker that proxies /chat to the Anthropic API (see worker/).
// Public URL only — the API key and the chat password live in the Worker's
// secrets, never here.
export const CHAT_WORKER_URL = 'https://kaanusta-chat.kaanekimoz.workers.dev';

// Model and effort choices on /chat. The Worker has the matching allowlist
// (MODELS / EFFORTS in worker/src/index.js) and rejects anything else, so
// add a model in both places. First entry is the default.
export const CHAT_MODELS = [
  { id: 'claude-opus-5-5', label: 'Opus 5.5', hint: 'En güçlü' },
  { id: 'claude-sonnet-5-5', label: 'Sonnet 5.5', hint: 'Hızlı ve güçlü' },
  { id: 'claude-haiku-5-5', label: 'Haiku 5.5', hint: 'En hızlı, en ucuz' },
] as const;

export const CHAT_EFFORTS = [
  { id: 'low', label: 'Düşük' },
  { id: 'medium', label: 'Orta' },
  { id: 'high', label: 'Yüksek' },
] as const;
