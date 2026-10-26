/**
 * i18n dictionary + helpers.
 *
 * The whole site supports two locales: English (default, served at `/...`)
 * and Turkish (served at `/tr/...`). Page templates take a `lang` prop and
 * resolve UI strings through `t(key, lang)`; collection entries carry a
 * matching `lang` field on their frontmatter so the right content is paired
 * with the right URL tree.
 */

export type Lang = 'en' | 'tr';

export const DEFAULT_LOCALE: Lang = 'en';

/** BCP-47 tags used in <html lang>, og:locale, and Date formatting. */
export const BCP47: Record<Lang, string> = {
  en: 'en-US',
  tr: 'tr-TR',
};

type Dict = {
  nav: { projects: string; blog: string; resume: string; home: string; contact: string; skip: string; main: string };
  footer: { links: string };
  blogIndex: { eyebrow: string; title: string; subtitle: string; empty: string; back: string; updated: string };
  projectsIndex: { eyebrow: string; title: string; subtitle: string };
  projectDetail: {
    back: string;
    role: string;
    timeline: string;
    techStack: string;
    links: string;
    screenshots: string;
    visitSite: string;
    trailer: string;
  };
  projectFilter: { all: string; products: string; games: string; aria: string };
  projectCard: { view: string };
  blogCard: { read: string; watch: string };
  notFound: { errorTag: string; title: string; body: string; restart: string; description: string };
  toggle: { theme: string; language: string };
  meta: {
    siteTitle: string;
    siteDescription: string;
    blogTitle: string;
    blogDescription: string;
    projectsTitle: string;
    projectsDescription: string;
  };
};

const en: Dict = {
  nav: { projects: 'Projects', blog: 'Blog', resume: 'Resume', home: 'home', contact: 'Contact', skip: 'Skip to content', main: 'Main' },
  footer: { links: 'Elsewhere' },
  blogIndex: {
    eyebrow: 'Writing',
    title: 'Blog',
    subtitle: 'Devlogs, build notes and things I learned shipping software.',
    empty: 'No posts yet. Coming soon.',
    back: '← Blog',
    updated: 'updated',
  },
  projectsIndex: {
    eyebrow: 'Work',
    title: 'Projects',
    subtitle: 'Products I build end to end, and the games where I learned how.',
  },
  projectDetail: {
    back: '← Projects',
    role: 'Role',
    timeline: 'Timeline',
    techStack: 'Stack',
    links: 'Links',
    screenshots: 'Screenshots',
    visitSite: 'Visit site ↗',
    trailer: 'Trailer ↗',
  },
  projectFilter: { all: 'All', products: 'Products & Web', games: 'Games', aria: 'Filter projects' },
  projectCard: { view: 'Details →' },
  blogCard: { read: 'Read →', watch: 'Watch →' },
  notFound: {
    errorTag: 'Error · 404',
    title: 'No rows returned.',
    body: "The page you're looking for doesn't exist. Maybe a broken link, maybe a page that never shipped.",
    restart: 'Back to home',
    description: 'Page not found.',
  },
  toggle: { theme: 'Toggle theme', language: 'Toggle language' },
  meta: {
    siteTitle: 'Kaan Usta — Full-Stack Developer',
    siteDescription:
      'Full-stack developer in Istanbul. I build and ship complete products: NestJS and PostgreSQL backends, Next.js web apps, React Native mobile apps and the pipelines that deploy them.',
    blogTitle: 'Blog',
    blogDescription: 'Devlogs, build notes and things I learned shipping software.',
    projectsTitle: 'Projects',
    projectsDescription: 'My products and games: Patimania (web, iOS, Android) and six years of Unity games.',
  },
};

const tr: Dict = {
  nav: { projects: 'Projeler', blog: 'Blog', resume: 'Özgeçmiş', home: 'ana sayfa', contact: 'İletişim', skip: 'İçeriğe geç', main: 'Ana menü' },
  footer: { links: 'Diğer hesaplar' },
  blogIndex: {
    eyebrow: 'Yazılar',
    title: 'Blog',
    subtitle: 'Geliştirme günlükleri, yapım notları ve yazılım yayımlarken öğrendiklerim.',
    empty: 'Henüz yazı yok. Yakında.',
    back: '← Blog',
    updated: 'güncellendi',
  },
  projectsIndex: {
    eyebrow: 'İşler',
    title: 'Projeler',
    subtitle: 'Uçtan uca kurduğum ürünler ve bu işi öğrendiğim oyunlar.',
  },
  projectDetail: {
    back: '← Projeler',
    role: 'Rol',
    timeline: 'Süre',
    techStack: 'Teknoloji',
    links: 'Bağlantılar',
    screenshots: 'Ekran görüntüleri',
    visitSite: 'Siteyi aç ↗',
    trailer: 'Fragman ↗',
  },
  projectFilter: { all: 'Tümü', products: 'Ürün ve web', games: 'Oyunlar', aria: 'Projeleri filtrele' },
  projectCard: { view: 'Detaylar →' },
  blogCard: { read: 'Oku →', watch: 'İzle →' },
  notFound: {
    errorTag: 'Hata · 404',
    title: 'Sonuç bulunamadı.',
    body: 'Aradığın sayfa burada yok; kırık bir bağlantı ya da hiç yayımlanmamış bir sayfa olabilir.',
    restart: 'Ana sayfaya dön',
    description: 'Sayfa bulunamadı.',
  },
  toggle: { theme: 'Temayı değiştir', language: 'Dili değiştir' },
  meta: {
    siteTitle: 'Kaan Usta — Full-Stack Developer',
    siteDescription:
      "İstanbul'da full-stack geliştiriciyim. Ürünleri uçtan uca kurup yayına alıyorum: NestJS ve PostgreSQL arka uçlar, Next.js web uygulamaları, React Native mobil uygulamalar ve bunları dağıtan altyapı.",
    blogTitle: 'Blog',
    blogDescription: 'Geliştirme günlüklerim, yapım notlarım ve yazılım yayımlarken öğrendiklerim.',
    projectsTitle: 'Projeler',
    projectsDescription: 'Ürünlerim ve oyunlarım: Patimania (web, iOS, Android) ve altı yıllık Unity oyunları.',
  },
};

const dicts: Record<Lang, Dict> = { en, tr };

/**
 * Path-style lookup against the per-locale dictionary. Falls back to EN if
 * the TR side hasn't been authored yet — and ultimately to the key itself
 * so a missing translation is visible in dev rather than silent.
 */
export function t(key: string, lang: Lang = DEFAULT_LOCALE): string {
  const parts = key.split('.');
  const walk = (obj: unknown): string | undefined => {
    let cur: unknown = obj;
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
        cur = (cur as Record<string, unknown>)[p];
      } else {
        return undefined;
      }
    }
    return typeof cur === 'string' ? cur : undefined;
  };
  return walk(dicts[lang]) ?? walk(dicts.en) ?? key;
}

/**
 * Prefix a logical EN-canonical path with `/tr` when rendering for TR.
 * `localizedPath('/blog', 'tr')` → `/tr/blog`. Trailing slash semantics
 * mirror Astro's default behavior so links don't trigger redirects.
 */
export function localizedPath(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === DEFAULT_LOCALE) return clean;
  if (clean === '/') return '/tr/';
  return `/tr${clean}`;
}

/**
 * Given the current URL path and current locale, return the URL of the
 * matching page in the other locale — used by LanguageToggle to switch
 * without losing the user's place in the site.
 */
export function alternateUrl(currentPath: string, currentLang: Lang): string {
  if (currentLang === 'tr') {
    const stripped = currentPath.replace(/^\/tr(?=\/|$)/, '');
    return stripped === '' ? '/' : stripped;
  }
  if (currentPath === '/') return '/tr/';
  return `/tr${currentPath}`;
}
