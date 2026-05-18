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
  title: 'Kaan Usta — Game Developer',
  description:
    'Building mobile games since 2020. Specialized in Unity, focused on lightweight, addictive experiences.',
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
] as const;

export const SOCIAL = {
  email: 'kaanekimoz@gmail.com',
  github: 'https://github.com/KaanEkimoz',
  linkedin: 'https://linkedin.com/in/yusufkaanusta/',
  youtube: 'https://youtube.com/channel/UCABKLpR-H1MvMzF9sBcnYqA',
  itchio: 'https://ekimozkaan.itch.io',
} as const;

// StatsCard rows. Labels render from i18n.ts (`stats.class`, etc.) so they
// translate per locale; values are short proper-noun strings that stay
// identical across languages ("Unity", "Mobile", "Türkiye", "6+ years").
export const STATS = [
  { key: 'class', value: 'Game Dev' },
  { key: 'xp', value: '6+ years' },
  { key: 'focus', value: 'Mobile' },
  { key: 'engine', value: 'Unity' },
  { key: 'location', value: 'Türkiye' },
] as const;
