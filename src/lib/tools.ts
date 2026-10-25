/**
 * Tools I used at each career step, drawn as small app tiles: a gradient
 * background (brand colours where the brand has one) and a white mark.
 * Shared by My Journey on the home page and the resume. Keys are the
 * `tools` / `more` entries of CAREER in home.ts.
 */
import * as si from 'simple-icons';

export type Icon = { brand: string } | { glyph: string } | { solid: string } | { badge: string };
// App-tile background (brand colours where the brand has one) and the mark drawn on it.
export const TOOLS: Record<string, { name: { en: string; tr: string }; tile: string; icon: Icon }> = {
  unity: { name: { en: 'Unity', tr: 'Unity' }, tile: 'linear-gradient(135deg,#5b616e,#16181d)', icon: { brand: 'siUnity' } },
  csharp: { name: { en: 'C#', tr: 'C#' }, tile: 'linear-gradient(135deg,#a660c8,#68217a)', icon: { badge: 'C#' } },
  unrealengine: { name: { en: 'Unreal Engine', tr: 'Unreal Engine' }, tile: 'linear-gradient(135deg,#3a3f55,#0e1128)', icon: { brand: 'siUnrealengine' } },
  design: { name: { en: 'Game design', tr: 'Oyun tasarımı' }, tile: 'linear-gradient(135deg,#a597ff,#5a46e6)', icon: { solid: 'M12 3 1 8.5l11 5.5 9-4.5V16h2V8.5zM5.5 12.6V16c0 1.8 3 3.5 6.5 3.5s6.5-1.7 6.5-3.5v-3.4L12 15.9z' } },
  googleplay: { name: { en: 'Google Play', tr: 'Google Play' }, tile: 'linear-gradient(135deg,#ffffff,#e9eef7)', icon: { brand: 'siGoogleplay' } },
  android: { name: { en: 'Android', tr: 'Android' }, tile: 'linear-gradient(135deg,#5ef0a0,#1fae63)', icon: { brand: 'siAndroid' } },
  mobile: { name: { en: 'Mobile', tr: 'Mobil' }, tile: 'linear-gradient(135deg,#ff8cc0,#e0397f)', icon: { solid: 'M8 1.5h8A2.5 2.5 0 0 1 18.5 4v16a2.5 2.5 0 0 1-2.5 2.5H8A2.5 2.5 0 0 1 5.5 20V4A2.5 2.5 0 0 1 8 1.5zM10 18.5a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2z' } },
  github: { name: { en: 'GitHub', tr: 'GitHub' }, tile: 'linear-gradient(135deg,#3b434c,#0d1117)', icon: { brand: 'siGithub' } },
  xr: { name: { en: 'Unity XR', tr: 'Unity XR' }, tile: 'linear-gradient(135deg,#d48cff,#7b3fe4)', icon: { badge: 'XR' } },
  physics: { name: { en: 'Physics', tr: 'Fizik' }, tile: 'linear-gradient(135deg,#5fe3f5,#0e8fbf)', icon: { glyph: '<circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="9" ry="3.4"/><ellipse cx="12" cy="12" rx="9" ry="3.4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.4" transform="rotate(120 12 12)"/>' } },
  gameplay: { name: { en: 'Gameplay', tr: 'Oynanış' }, tile: 'linear-gradient(135deg,#78a6ff,#2459e8)', icon: { solid: 'M7 6.5h10a5 5 0 0 1 4.9 6l-1 4.6a3 3 0 0 1-5.2 1.4l-1.8-2h-3.8l-1.8 2a3 3 0 0 1-5.2-1.4l-1-4.6A5 5 0 0 1 7 6.5zM7 9.4h1.6V11h1.6v1.6H8.6v1.6H7v-1.6H5.4V11H7zM15 10.6a1.1 1.1 0 1 0 2.2 0 1.1 1.1 0 1 0-2.2 0zM17 13a1.1 1.1 0 1 0 2.2 0 1.1 1.1 0 1 0-2.2 0z' } },
  pos: { name: { en: 'POS', tr: 'Kasa (POS)' }, tile: 'linear-gradient(135deg,#ffc061,#ff7a1a)', icon: { solid: 'M7 2h10a1 1 0 0 1 1 1v6H6V3a1 1 0 0 1 1-1zM4 10h16a1.5 1.5 0 0 1 1.5 1.5V20a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 20v-8.5A1.5 1.5 0 0 1 4 10zM6 13h2v2H6zM11 13h2v2h-2zM16 13h2v2h-2zM6 17h12v2H6z' } },
  barcode: { name: { en: 'Barcode', tr: 'Barkod' }, tile: 'linear-gradient(135deg,#55dcf2,#1a7fd6)', icon: { solid: 'M3 4h2v16H3zM6.5 4h1v16h-1zM9 4h2.5v16H9zM13 4h1v16h-1zM15.5 4h2v16h-2zM19 4h1v16h-1zM21 4h1v16h-1z' } },
  scale: { name: { en: 'Scales', tr: 'Terazi' }, tile: 'linear-gradient(135deg,#6be8b8,#12a676)', icon: { glyph: '<path d="M12 4.5v15M7 19.5h10M4.5 8h15M7 8l-3 6.5h6zM17 8l-3 6.5h6z"/>' } },
  cart: { name: { en: 'Online sales', tr: 'Online satış' }, tile: 'linear-gradient(135deg,#ff8aa6,#e0396a)', icon: { solid: 'M2 3.5h3.2l.6 3H21a1 1 0 0 1 1 1.2l-1.4 6.6a2 2 0 0 1-2 1.7H8.6l.3 1.5H19v2H7.3L4.4 5.5H2zM9 21.5a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 1 0 0 3.2zM17 21.5a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 1 0 0 3.2z' } },
  levelplay: { name: { en: 'LevelPlay ads', tr: 'LevelPlay reklam' }, tile: 'linear-gradient(135deg,#ffb35c,#f0581f)', icon: { solid: 'M3 9.5h3l9-5v15l-9-5H3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1zM6.5 15.5 8 20.5h2.5l-1.4-5zM17 9h2.5v6H17z' } },
  iap: { name: { en: 'Unity IAP', tr: 'Unity IAP' }, tile: 'linear-gradient(135deg,#ffd76a,#e09a10)', icon: { solid: 'M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20zM11 6h2v1.6c1.4.3 2.5 1.2 2.6 2.6h-2c-.1-.6-.7-1-1.6-1-1 0-1.6.4-1.6 1s.5.9 1.9 1.2c2 .4 3.4 1.2 3.4 3 0 1.4-1.1 2.4-2.7 2.7V18h-2v-1.9c-1.6-.3-2.8-1.3-2.9-2.8h2c.1.7.8 1.2 1.9 1.2 1.1 0 1.7-.4 1.7-1.1 0-.6-.5-.9-2-1.2-1.9-.4-3.3-1.1-3.3-2.9 0-1.3 1-2.3 2.6-2.6z' } },
  typescript: { name: { en: 'TypeScript', tr: 'TypeScript' }, tile: 'linear-gradient(135deg,#5a9be8,#235a97)', icon: { brand: 'siTypescript' } },
  react: { name: { en: 'React / React Native', tr: 'React / React Native' }, tile: 'linear-gradient(135deg,#2c3e50,#14202c)', icon: { brand: 'siReact' } },
  prisma: { name: { en: 'Prisma', tr: 'Prisma' }, tile: 'linear-gradient(135deg,#4a5a75,#1a2433)', icon: { brand: 'siPrisma' } },
  docker: { name: { en: 'Docker', tr: 'Docker' }, tile: 'linear-gradient(135deg,#4fa8f5,#1d63c9)', icon: { brand: 'siDocker' } },
  nginx: { name: { en: 'Nginx', tr: 'Nginx' }, tile: 'linear-gradient(135deg,#2bb673,#00703c)', icon: { brand: 'siNginx' } },
  githubactions: { name: { en: 'GitHub Actions', tr: 'GitHub Actions' }, tile: 'linear-gradient(135deg,#4d9fff,#1a5fd1)', icon: { brand: 'siGithubactions' } },
  minio: { name: { en: 'MinIO', tr: 'MinIO' }, tile: 'linear-gradient(135deg,#e5566f,#a51c35)', icon: { brand: 'siMinio' } },
  iyzico: { name: { en: 'iyzico escrow', tr: 'iyzico Ödeme Güvencesi' }, tile: 'linear-gradient(135deg,#3fb8ff,#1567c7)', icon: { solid: 'M3 5h18a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 21 19H3a1.5 1.5 0 0 1-1.5-1.5v-11A1.5 1.5 0 0 1 3 5zM1.5 8.5v3h21v-3zM4.5 14.5v1.6h5v-1.6z' } },
  nextdotjs: { name: { en: 'Next.js', tr: 'Next.js' }, tile: 'linear-gradient(135deg,#3a3a3a,#000)', icon: { brand: 'siNextdotjs' } },
  nestjs: { name: { en: 'NestJS', tr: 'NestJS' }, tile: 'linear-gradient(135deg,#ff5d7a,#c8102e)', icon: { brand: 'siNestjs' } },
  postgresql: { name: { en: 'PostgreSQL', tr: 'PostgreSQL' }, tile: 'linear-gradient(135deg,#6a9ef0,#336791)', icon: { brand: 'siPostgresql' } },
  expo: { name: { en: 'Expo', tr: 'Expo' }, tile: 'linear-gradient(135deg,#7a66ff,#4630eb)', icon: { brand: 'siExpo' } },
};
const brandPath = (n: string) => (si as unknown as Record<string, { path: string }>)[n].path;
// Google Play keeps its four colours; every other mark is white on its tile.
export const iconSvg = (k: string) => {
  const ic = TOOLS[k].icon;
  if ('brand' in ic) {
    if (k === 'googleplay')
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="gp-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00c3ff"/><stop offset=".38" stop-color="#00e676"/><stop offset=".7" stop-color="#ffd400"/><stop offset="1" stop-color="#ff3a44"/></linearGradient></defs><path d="${brandPath(ic.brand)}" fill="url(#gp-grad)"/></svg>`;
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${brandPath(ic.brand)}" fill="#fff"/></svg>`;
  }
  if ('badge' in ic) return `<b class="bdg">${ic.badge}</b>`;
  if ('solid' in ic) return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ic.solid}" fill="#fff" fill-rule="evenodd"/></svg>`;
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><g class="glyph">${ic.glyph}</g></svg>`;
};

/** simple-icons export for each resume tech-stack item that has a brand mark. */
export const SKILL_ICONS: Record<string, string> = {
  TypeScript: 'siTypescript', JavaScript: 'siJavascript', 'HTML/CSS': 'siHtml5',
  NestJS: 'siNestjs', 'Node.js': 'siNodedotjs', PostgreSQL: 'siPostgresql', Prisma: 'siPrisma', 'ASP.NET Core': 'siDotnet',
  React: 'siReact', 'Next.js': 'siNextdotjs', Tailwind: 'siTailwindcss', Astro: 'siAstro', Storybook: 'siStorybook',
  'React Native': 'siReact', Expo: 'siExpo',
  'Claude Code': 'siClaude', MCP: 'siModelcontextprotocol', 'Anthropic API': 'siAnthropic', Ollama: 'siOllama',
  Docker: 'siDocker', 'GitHub Actions': 'siGithubactions', nginx: 'siNginx', Cloudflare: 'siCloudflare', MinIO: 'siMinio',
  Unity: 'siUnity', 'Unreal Engine 5': 'siUnrealengine',
};
