/**
 * Site-wide constants — single source of truth for branding, links, and metadata.
 * Edit values here; they propagate everywhere.
 */

export const SITE = {
  name: 'kaanusta.dev',
  title: 'Y. Kaan Usta — Game Developer',
  description:
    'Building mobile games since 2020. Specialized in Unity, focused on lightweight, addictive experiences.',
  url: 'https://kaanusta.dev',
  author: 'Y. Kaan Usta',
  locale: 'en-US',
} as const;

export const NAV = [
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
] as const;

export const SOCIAL = {
  email: 'kaanekimoz@gmail.com',
  github: 'https://github.com/KaanEkimoz',
  linkedin: 'https://linkedin.com/in/yusufkaanusta/',
  youtube: 'https://youtube.com/channel/UCABKLpR-H1MvMzF9sBcnYqA',
  itchio: 'https://ekimozkaan.itch.io',
} as const;

export const STATS = [
  { label: 'CLASS', value: 'Game Dev' },
  { label: 'XP', value: '6+ years' },
  { label: 'FOCUS', value: 'Mobile' },
  { label: 'ENGINE', value: 'Unity' },
  { label: 'LOCATION', value: 'Türkiye' },
] as const;
