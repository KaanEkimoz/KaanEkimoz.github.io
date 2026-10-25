/**
 * Blog covers in one family, after the original May 2026 cover: a light
 * blue field with a perspective floor grid, a glowing horizon, the date
 * (or label) in cyan between two rules and the title centred under it.
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
const HZ = 700; // horizon
const intro = kind === 'intro';
const label = intro ? 'FULL-STACK ENGINEER' : date.toUpperCase();
const title = intro ? 'Meet Kaan' : 'Developer Update';
// Text block sits a little lower on the intro to leave room for the photo.
const labelY = intro ? 560 : 470;
const titleY = intro ? 720 : 680;

// Back wall: a flat square grid above the horizon.
let wall = '';
for (let x = 0; x <= W; x += 64) wall += `<line x1="${x}" y1="0" x2="${x}" y2="${HZ}"/>`;
for (let y = HZ; y >= 0; y -= 64) wall += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;

// Floor: lines fanning out from the centre and rows that widen toward the viewer.
let floor = '';
for (let i = -24; i <= 24; i++) floor += `<line x1="${W / 2 + i * 46}" y1="${HZ}" x2="${W / 2 + i * 200}" y2="${H}"/>`;
for (let k = 1; k <= 9; k++) {
  const y = HZ + (H - HZ) * Math.pow(k / 9, 1.7);
  floor += `<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}"/>`;
}

// A few specks of light (fixed seed so reruns match).
let seed = 11;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const specks = Array.from({ length: 16 }, () => {
  const x = rnd() * W;
  const y = rnd() * H;
  return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1.2 + rnd() * 1.8).toFixed(1)}" fill="${rnd() > 0.5 ? '#ffffff' : '#5fe3ff'}" opacity="${(0.5 + rnd() * 0.5).toFixed(2)}"/>`;
}).join('');

// Width of the label in px (mono-ish estimate for Sora with wide tracking) to place the rules.
const labelSize = intro ? 64 : 118;
const track = intro ? 14 : 30;
const labelW = label.length * (labelSize * 0.66 + track);
const ruleGap = 56;

const badge = intro
  ? `<g transform="translate(80 946)"><rect width="300" height="80" rx="16" fill="#0b1430" fill-opacity=".55" stroke="#ffffff" stroke-opacity=".14"/>
     <text x="30" y="51" font-family="JetBrains Mono" font-weight="500" font-size="28" fill="#eaf1ff">kaanusta<tspan fill="#5fe3ff">.dev</tspan></text></g>`
  : `<g transform="translate(80 946)"><rect width="212" height="80" rx="16" fill="#0b1430" fill-opacity=".55" stroke="#ffffff" stroke-opacity=".14"/>
     <g transform="translate(24 20) scale(${40 / 24})"><path d="${si.siUnity.path}" fill="#eaf1ff"/></g>
     <text x="88" y="34" font-family="Sora SemiBold" font-weight="600" font-size="14" letter-spacing="2" fill="#c7d4f5">MADE WITH</text>
     <text x="88" y="62" font-family="Sora SemiBold" font-weight="600" font-size="28" fill="#ffffff">Unity</text></g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <radialGradient id="bg" cx="52%" cy="40%" r="80%"><stop offset="0" stop-color="#6d8ae0"/><stop offset=".45" stop-color="#4560b8"/><stop offset="1" stop-color="#253a80"/></radialGradient>
  <radialGradient id="teal" cx="92%" cy="55%" r="55%"><stop offset="0" stop-color="#2cc3d6" stop-opacity=".45"/><stop offset="1" stop-color="#2cc3d6" stop-opacity="0"/></radialGradient>
  <radialGradient id="dim" cx="0%" cy="0%" r="60%"><stop offset="0" stop-color="#1a2160" stop-opacity=".55"/><stop offset="1" stop-color="#1a2160" stop-opacity="0"/></radialGradient>
  <linearGradient id="hz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fe8ff" stop-opacity="0"/><stop offset=".5" stop-color="#7fe8ff" stop-opacity=".45"/><stop offset="1" stop-color="#7fe8ff" stop-opacity="0"/></linearGradient>
  <linearGradient id="floorfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#fff"/></linearGradient>
  <mask id="fm"><rect y="${HZ}" width="${W}" height="${H - HZ}" fill="url(#floorfade)"/></mask>
  <linearGradient id="ruleL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5fe3ff" stop-opacity="0"/><stop offset="1" stop-color="#5fe3ff"/></linearGradient>
  <linearGradient id="ruleR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5fe3ff"/><stop offset="1" stop-color="#5fe3ff" stop-opacity="0"/></linearGradient>
  <filter id="glow" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="shadow" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#teal)"/>
<rect width="${W}" height="${H}" fill="url(#dim)"/>
<g stroke="#a9bcff" stroke-opacity=".10" stroke-width="1.5">${wall}</g>
<g stroke="#8fa6ff" stroke-opacity=".32" stroke-width="2" mask="url(#fm)">${floor}</g>
<rect y="${HZ - 30}" width="${W}" height="60" fill="url(#hz)"/>
${specks}
<rect x="${W / 2 - labelW / 2 - ruleGap - 140}" y="${labelY - labelSize * 0.36 - 2}" width="140" height="4" rx="2" fill="url(#ruleL)"/>
<rect x="${W / 2 + labelW / 2 + ruleGap}" y="${labelY - labelSize * 0.36 - 2}" width="140" height="4" rx="2" fill="url(#ruleR)"/>
<text x="${W / 2 + track / 2}" y="${labelY}" text-anchor="middle" font-family="Sora SemiBold" font-weight="600" font-size="${labelSize}" letter-spacing="${track}" fill="#5fe3ff" filter="url(#glow)" opacity=".7">${label}</text>
<text x="${W / 2 + track / 2}" y="${labelY}" text-anchor="middle" font-family="Sora SemiBold" font-weight="600" font-size="${labelSize}" letter-spacing="${track}" fill="#22d8ff">${label}</text>
<text x="${W / 2}" y="${titleY + 12}" text-anchor="middle" font-family="Sora SemiBold" font-weight="600" font-size="172" letter-spacing="-5" fill="#0b1440" opacity=".45" filter="url(#shadow)">${title}</text>
<text x="${W / 2}" y="${titleY}" text-anchor="middle" font-family="Sora SemiBold" font-weight="600" font-size="172" letter-spacing="-5" fill="#ffffff">${title}</text>
${badge}
</svg>`;

let img = sharp(Buffer.from(svg));
if (intro) {
  // Round photo above the label: the square crop of the home portrait in a cyan ring.
  const D = 300;
  const ring = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${D + 24}" height="${D + 24}">
    <circle cx="${D / 2 + 12}" cy="${D / 2 + 12}" r="${D / 2 + 6}" fill="none" stroke="#5fe3ff" stroke-width="5"/></svg>`);
  const circle = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${D}" height="${D}"><circle cx="${D / 2}" cy="${D / 2}" r="${D / 2}" fill="#fff"/></svg>`);
  const photo = await sharp('src/assets/portrait-square.jpg').resize(D, D).composite([{ input: circle, blend: 'dest-in' }]).png().toBuffer();
  img = sharp(await img.png().toBuffer()).composite([
    { input: ring, left: W / 2 - D / 2 - 12, top: 120 - 12 },
    { input: photo, left: W / 2 - D / 2, top: 120 },
  ]);
}
await img.flatten({ background: '#253a80' }).jpeg({ quality: 88, mozjpeg: true }).toFile(out);
console.log('wrote', out);
