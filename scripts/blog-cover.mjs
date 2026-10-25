/**
 * Blog covers in one family: navy field with the site's dot grid and data
 * bars, the title on the left, a picture on the right.
 *
 *   node scripts/blog-cover.mjs devlog "MAY 2026" src/assets/blog/may-2026.jpg
 *   node scripts/blog-cover.mjs intro src/assets/blog/meet-kaan.jpg
 *
 * Devlog covers differ only in the date. Run `node scripts/install-og-fonts.mjs`
 * first: librsvg only sees system fonts and silently falls back without them.
 */
import sharp from 'sharp';
import * as si from 'simple-icons';

const [kind, ...rest] = process.argv.slice(2);
const out = rest.at(-1);
const date = kind === 'devlog' ? rest[0] : null;
if (!out || (kind === 'devlog' && !date) || !['devlog', 'intro'].includes(kind)) {
  console.error('usage: blog-cover.mjs devlog "<MONTH YEAR>" <out> | intro <out>');
  process.exit(1);
}

const W = 1920;
const H = 1080;

// Data bars along the bottom edge, as in the home hero (fixed seed so reruns match).
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const bars = Array.from({ length: 96 }, (_, i) => {
  const h = 18 + Math.pow(rnd(), 2.2) * 150 + Math.sin(i / 7) * 14;
  const x = i * 20 + 3;
  return `<rect x="${x}" y="${H - h}" width="12" height="${h}" rx="2" fill="url(#bar)" opacity="${(0.35 + rnd() * 0.5).toFixed(2)}"/>`;
}).join('');

// Pointy-top hexagon around (cx, cy) with circumradius r.
const hex = (cx, cy, r) =>
  Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');

// Tool tiles fanned around the devlog hexagon (same tiles as My Journey).
const tile = (x, y, s, grad, inner) =>
  `<g transform="translate(${x} ${y})"><rect width="${s}" height="${s}" rx="${s * 0.26}" fill="${grad}"/>` +
  `<rect width="${s}" height="${s}" rx="${s * 0.26}" fill="none" stroke="#fff" stroke-opacity=".22"/>${inner}</g>`;
const mark = (path, s, fill = '#fff') => `<g transform="translate(${s * 0.22} ${s * 0.22}) scale(${(s * 0.56) / 24})"><path d="${path}" fill="${fill}"/></g>`;

const devlogArt = () => {
  const cx = 1440;
  const cy = 470;
  const s = 124;
  return `
  <circle cx="${cx}" cy="${cy}" r="360" fill="url(#halo)"/>
  <polygon points="${hex(cx, cy, 300)}" fill="none" stroke="#3d7bff" stroke-opacity=".25" stroke-width="2"/>
  <polygon points="${hex(cx, cy, 236)}" fill="url(#hexfill)" stroke="#7fb0ff" stroke-opacity=".55" stroke-width="3"/>
  <polygon points="${hex(cx, cy, 206)}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="2"/>
  <g transform="translate(${cx - 105} ${cy - 105}) scale(${210 / 24})"><path d="${si.siUnity.path}" fill="#fff"/></g>
  ${tile(cx - 380, cy - 250, s, 'url(#tC)', `<text x="${s / 2}" y="${s / 2 + 17}" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="48" fill="#fff">C#</text>`)}
  ${tile(cx + 262, cy - 270, s, 'url(#tPlay)', mark(si.siGoogleplay.path, s))}
  ${tile(cx + 300, cy + 130, s, 'url(#tDroid)', mark(si.siAndroid.path, s))}
  ${tile(cx - 400, cy + 150, s, 'url(#tPad)', mark('M7 6.5h10a5 5 0 0 1 4.9 6l-1 4.6a3 3 0 0 1-5.2 1.4l-1.8-2h-3.8l-1.8 2a3 3 0 0 1-5.2-1.4l-1-4.6A5 5 0 0 1 7 6.5zM7 9.4h1.6V11h1.6v1.6H8.6v1.6H7v-1.6H5.4V11H7zM15 10.6a1.1 1.1 0 1 0 2.2 0 1.1 1.1 0 1 0-2.2 0zM17 13a1.1 1.1 0 1 0 2.2 0 1.1 1.1 0 1 0-2.2 0z', s))}
  `;
};

const introArt = () => `
  <circle cx="1450" cy="430" r="400" fill="url(#halo)"/>
  <polygon points="${hex(1450, 450, 330)}" fill="url(#hexfill)" fill-opacity=".55" stroke="#7fb0ff" stroke-opacity=".5" stroke-width="3"/>
  <polygon points="${hex(1450, 450, 392)}" fill="none" stroke="#3d7bff" stroke-opacity=".22" stroke-width="2"/>`;

const title = kind === 'devlog' ? ['Developer', 'Update'] : ['Meet', 'Kaan'];
const chip = kind === 'devlog' ? 'DEVLOG' : 'INTRO';
const sub = kind === 'devlog' ? date : 'FULL-STACK ENGINEER';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <radialGradient id="bg" cx="72%" cy="40%" r="75%"><stop offset="0" stop-color="#0f1f4d"/><stop offset=".55" stop-color="#081230"/><stop offset="1" stop-color="#050912"/></radialGradient>
  <radialGradient id="halo"><stop offset="0" stop-color="#22d3ee" stop-opacity=".28"/><stop offset=".45" stop-color="#3d7bff" stop-opacity=".16"/><stop offset="1" stop-color="#3d7bff" stop-opacity="0"/></radialGradient>
  <linearGradient id="hexfill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3d7bff"/><stop offset="1" stop-color="#4338ca"/></linearGradient>
  <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset="1" stop-color="#3d7bff" stop-opacity=".15"/></linearGradient>
  <linearGradient id="tC" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a660c8"/><stop offset="1" stop-color="#68217a"/></linearGradient>
  <linearGradient id="tPlay" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1fb87a"/><stop offset="1" stop-color="#0b7a52"/></linearGradient>
  <linearGradient id="tDroid" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5ef0a0"/><stop offset="1" stop-color="#1fae63"/></linearGradient>
  <linearGradient id="tPad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#78a6ff"/><stop offset="1" stop-color="#2459e8"/></linearGradient>
  <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="#7fa6ff" fill-opacity=".16"/></pattern>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#dots)"/>
${bars}
${kind === 'devlog' ? devlogArt() : introArt()}
<text x="120" y="150" font-family="JetBrains Mono" font-weight="500" font-size="40" fill="#e6edff">kaanusta<tspan fill="#22d3ee">.dev</tspan></text>
<rect x="120" y="318" width="${chip.length * 25 + 52}" height="60" rx="30" fill="#3d7bff" fill-opacity=".14" stroke="#3d7bff" stroke-opacity=".55" stroke-width="2"/>
<text x="146" y="358" font-family="JetBrains Mono" font-weight="600" font-size="30" letter-spacing="3" fill="#9fc0ff">${chip}</text>
<text font-family="Sora SemiBold" font-weight="600" font-size="164" letter-spacing="-6" fill="#ffffff"><tspan x="112" y="560">${title[0]}</tspan><tspan x="112" y="730">${title[1]}</tspan></text>
<text x="120" y="840" font-family="JetBrains Mono" font-weight="600" font-size="${kind === 'devlog' ? 64 : 40}" letter-spacing="${kind === 'devlog' ? 8 : 5}" fill="#22d3ee">${sub}</text>
</svg>`;

let img = sharp(Buffer.from(svg));
if (kind === 'intro') {
  // The cut-out portrait from the home hero, standing on the bottom edge.
  // The photo's own left and bottom edges are hard cuts, so they fade out.
  const me0 = await sharp('src/assets/portrait-me.webp').resize({ height: 1040 }).toBuffer();
  const { width, height } = await sharp(me0).metadata();
  const fade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs><linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset=".62" stop-color="#fff"/><stop offset=".97" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".22" stop-color="#fff"/></linearGradient>
    <mask id="m"><rect width="100%" height="100%" fill="url(#h)"/></mask></defs>
    <rect width="100%" height="100%" fill="url(#v)" mask="url(#m)"/></svg>`);
  const me = await sharp(me0).composite([{ input: fade, blend: 'dest-in' }]).png().toBuffer();
  img = sharp(await img.png().toBuffer()).composite([{ input: me, left: Math.round(1470 - width / 2), top: H - height }]);
}
await img.flatten({ background: '#050912' }).jpeg({ quality: 86, mozjpeg: true }).toFile(out);
console.log('wrote', out);
