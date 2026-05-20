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

export const LOCALES: Lang[] = ['en', 'tr'];
export const DEFAULT_LOCALE: Lang = 'en';

/** BCP-47 tags used in <html lang>, og:locale, and Date formatting. */
export const BCP47: Record<Lang, string> = {
  en: 'en-US',
  tr: 'tr-TR',
};

type Dict = {
  nav: { projects: string; blog: string; home: string };
  hero: {
    eyebrow: string;
    role: string;
    description: string;
    cta: { viewProjects: string; readBlog: string };
    scroll: string;
  };
  heroCanvas: { score: string; best: string; timeIsUp: string; retry: string };
  about: { title: string; p1: string; p2: string; p3: string };
  featured: { title: string; seeAll: string };
  latest: { title: string; allPosts: string; empty: string };
  contact: { title: string };
  blogIndex: { title: string; subtitle: string; empty: string; back: string; updated: string };
  projectsIndex: { title: string; subtitle: string };
  projectDetail: {
    back: string;
    role: string;
    timeline: string;
    techStack: string;
    links: string;
    screenshots: string;
  };
  projectFilter: { all: string; aria: string };
  projectCard: { view: string };
  blogCard: { read: string };
  notFound: { errorTag: string; gameOver: string; body: string; restart: string };
  toggle: { theme: string; language: string };
  stats: { class: string; xp: string; focus: string; engine: string; location: string };
  social: { newTab: string };
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
  nav: { projects: 'Projects', blog: 'Blog', home: 'home' },
  hero: {
    eyebrow: '/// PORTFOLIO · BLOG',
    role: 'GAME DEVELOPER',
    description:
      'Building mobile games since 2020. Specialized in Unity, focused on lightweight, addictive experiences.',
    cta: { viewProjects: '[ View Projects ]', readBlog: '[ Read Blog ]' },
    scroll: 'SCROLL',
  },
  heroCanvas: { score: 'SCORE', best: 'BEST', timeIsUp: 'TIME IS UP', retry: 'RETRY' },
  about: {
    title: 'About',
    p1: "I've been part of the software and game development world since 2020. My journey started with a degree in Digital Game Design — and what began as curiosity about programming and game engines became my primary focus.",
    p2: `I've worked on projects spanning mobile, PC, and VR, but I've chosen to specialize in <span class="text-text-100">mobile game development</span>. From hyper-casual prototypes built in two weeks to roguelike systems developed over five months, I enjoy the full spectrum: gameplay programming, system design, and the small details that make a game feel alive.`,
    p3: `Currently focused on <span class="text-accent-1">Unity</span> and <span class="text-accent-1">C#</span>, with side interests in custom engine work, VR physics, and ECS architecture.`,
  },
  featured: { title: 'Featured Projects', seeAll: '[ See All Projects → ]' },
  latest: { title: 'Latest Posts', allPosts: '[ All Posts → ]', empty: 'Coming soon.' },
  contact: { title: 'Contact' },
  blogIndex: {
    title: 'Blog',
    subtitle: 'Devlogs, post-mortems, and notes on the craft.',
    empty: 'No posts yet. Coming soon.',
    back: '← Back to Blog',
    updated: 'updated',
  },
  projectsIndex: {
    title: 'Projects',
    subtitle:
      'A selection of games and prototypes — mobile, PC, and VR — spanning hyper-casual sprints, jam builds, and multi-month roguelike systems.',
  },
  projectDetail: {
    back: '← Back to Projects',
    role: 'Role',
    timeline: 'Timeline',
    techStack: 'Tech Stack',
    links: 'Links',
    screenshots: 'Screenshots',
  },
  projectFilter: { all: 'All', aria: 'Filter projects by platform' },
  projectCard: { view: 'View →' },
  blogCard: { read: 'Read →' },
  notFound: {
    errorTag: 'ERROR · 404',
    gameOver: 'GAME OVER',
    body: "The page you're looking for doesn't exist — maybe a broken link, maybe a page that never shipped.",
    restart: '[ RESTART ]',
  },
  toggle: { theme: 'Toggle theme', language: 'Toggle language' },
  stats: {
    class: 'CLASS',
    xp: 'XP',
    focus: 'FOCUS',
    engine: 'ENGINE',
    location: 'LOCATION',
  },
  social: { newTab: 'opens in new tab' },
  meta: {
    siteTitle: 'Kaan Usta — Game Developer',
    siteDescription:
      'Building mobile games since 2020. Specialized in Unity, focused on lightweight, addictive experiences.',
    blogTitle: 'Blog',
    blogDescription:
      'Devlogs, post-mortems, and notes on game development from Kaan Usta.',
    projectsTitle: 'Projects',
    projectsDescription:
      'Games and prototypes by Kaan Usta — mobile, PC, and VR.',
  },
};

const tr: Dict = {
  nav: { projects: 'Projeler', blog: 'Blog', home: 'ana sayfa' },
  hero: {
    eyebrow: '/// PORTFOLYO · BLOG',
    role: 'OYUN GELİŞTİRİCİSİ',
    description:
      '2020’den beri mobil oyunlar çıkarıyor. Unity üzerine uzmanlaşmış; hafif ve kolay bağımlılık yapan deneyimlere odaklanıyor.',
    cta: { viewProjects: '[ Projeleri Gör ]', readBlog: '[ Blogu Oku ]' },
    scroll: 'KAYDIR',
  },
  heroCanvas: {
    score: 'SKOR',
    best: 'EN İYİ',
    timeIsUp: 'SÜRE DOLDU',
    retry: 'TEKRAR DENE',
  },
  about: {
    title: 'Hakkında',
    p1: '2020’den bu yana yazılım ve oyun geliştirme dünyasının içindeyim. Yolculuğum üniversitede Dijital Oyun Tasarımı okuyarak başladı — programlamaya ve oyun motorlarına duyduğum merak, zamanla asıl odağım haline geldi.',
    p2: `Mobil, PC ve VR’a uzanan projelerde çalıştım; ama uzmanlığımı <span class="text-text-100">mobil oyun geliştirme</span> tarafında derinleştirmeyi tercih ettim. İki haftada yapılan hiper-casual prototiplerden beş ay boyunca geliştirdiğim roguelike sistemlere kadar bu işin tüm yelpazesini seviyorum: oynanış programlaması, sistem tasarımı ve bir oyunu yaşatan o küçük ayrıntılar.`,
    p3: `Şu sıralar <span class="text-accent-1">Unity</span> ve <span class="text-accent-1">C#</span> üzerine yoğunlaşıyorum. Yan tarafta custom engine geliştirme, VR fizik ve ECS mimarisiyle ilgileniyorum.`,
  },
  featured: { title: 'Öne Çıkan Projeler', seeAll: '[ Tüm Projeler → ]' },
  latest: { title: 'Son Yazılar', allPosts: '[ Tüm Yazılar → ]', empty: 'Yakında.' },
  contact: { title: 'İletişim' },
  blogIndex: {
    title: 'Blog',
    subtitle: 'Geliştirme günlükleri, post-mortem’ler ve zanaata dair notlar.',
    empty: 'Henüz yazı yok. Yakında.',
    back: '← Bloga Dön',
    updated: 'güncellendi',
  },
  projectsIndex: {
    title: 'Projeler',
    subtitle:
      'Mobil, PC ve VR’dan bir oyun ve prototip seçkisi — iki haftalık hiper-casual sprintlerden game jam yapımlarına, aylarca süren roguelike sistemlere kadar uzanıyor.',
  },
  projectDetail: {
    back: '← Projelere Dön',
    role: 'Rol',
    timeline: 'Zaman Çizelgesi',
    techStack: 'Teknoloji',
    links: 'Bağlantılar',
    screenshots: 'Ekran Görüntüleri',
  },
  projectFilter: { all: 'Tümü', aria: 'Projeleri platforma göre filtrele' },
  projectCard: { view: 'Aç →' },
  blogCard: { read: 'Oku →' },
  notFound: {
    errorTag: 'HATA · 404',
    // "GAME OVER" stays as proper-noun gaming reference — Turkish gamers
    // recognize it directly and the iconography is the point.
    gameOver: 'GAME OVER',
    body: 'Aradığın sayfa burada yok — kırık bir link ya da hiç yayımlanmamış bir sayfa olabilir.',
    restart: '[ YENİDEN BAŞLA ]',
  },
  toggle: { theme: 'Temayı değiştir', language: 'Dili değiştir' },
  stats: {
    class: 'SINIF',
    xp: 'XP',
    focus: 'ODAK',
    engine: 'MOTOR',
    location: 'KONUM',
  },
  social: { newTab: 'yeni sekmede açılır' },
  meta: {
    siteTitle: 'Kaan Usta — Oyun Geliştirici',
    siteDescription:
      '2020’den beri mobil oyunlar çıkarıyor. Unity üzerine uzmanlaşmış; hafif ve kolay bağımlılık yapan deneyimlere odaklanıyor.',
    blogTitle: 'Blog',
    blogDescription:
      'Kaan Usta’nın oyun geliştirme üzerine devlogları, post-mortem’leri ve notları.',
    projectsTitle: 'Projeler',
    projectsDescription:
      'Kaan Usta’nın oyun ve prototipleri — mobil, PC ve VR.',
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

/**
 * Read the locale from a pathname — used at page boundaries when a template
 * is shared across both locales and doesn't have the value as a prop.
 */
export function langFromPath(pathname: string): Lang {
  return pathname === '/tr' || pathname.startsWith('/tr/') ? 'tr' : 'en';
}
