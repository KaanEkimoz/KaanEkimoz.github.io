// Installs the OG image fonts (Sora, Geist, JetBrains Mono) as system fonts
// so librsvg (used by sharp) can render scripts/og-image.svg. @fontsource only
// ships WOFF, so each file is unpacked to a plain TTF in ~/.fonts.
// usage: node scripts/install-og-fonts.mjs   (then run the sharp command)
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { inflateSync } from 'node:zlib';

const FONTS = [
  'sora/files/sora-latin-500-normal',
  'sora/files/sora-latin-600-normal',
  'geist/files/geist-latin-400-normal',
  'geist/files/geist-latin-500-normal',
  'jetbrains-mono/files/jetbrains-mono-latin-500-normal',
];

// WOFF 1.0 → SFNT: copy the header, rewrite the table directory, inflate tables.
function woffToTtf(woff) {
  const n = woff.readUInt16BE(12);
  const tables = Array.from({ length: n }, (_, i) => {
    const o = 44 + i * 20;
    return { tag: woff.subarray(o, o + 4), off: woff.readUInt32BE(o + 4), clen: woff.readUInt32BE(o + 8), olen: woff.readUInt32BE(o + 12), sum: woff.readUInt32BE(o + 16) };
  });
  const dir = Buffer.alloc(12 + 16 * n);
  const es = Math.floor(Math.log2(n));
  dir.writeUInt32BE(woff.readUInt32BE(4), 0);
  dir.writeUInt16BE(n, 4);
  dir.writeUInt16BE(16 * 2 ** es, 6);
  dir.writeUInt16BE(es, 8);
  dir.writeUInt16BE(n * 16 - 16 * 2 ** es, 10);
  const parts = [];
  let pos = dir.length;
  tables.forEach((t, i) => {
    let data = woff.subarray(t.off, t.off + t.clen);
    if (t.clen < t.olen) data = inflateSync(data);
    const o = 12 + i * 16;
    t.tag.copy(dir, o);
    dir.writeUInt32BE(t.sum, o + 4);
    dir.writeUInt32BE(pos, o + 8);
    dir.writeUInt32BE(t.olen, o + 12);
    const pad = Buffer.alloc((4 - (data.length % 4)) % 4);
    parts.push(data, pad);
    pos += data.length + pad.length;
  });
  return Buffer.concat([dir, ...parts]);
}

const out = `${homedir()}/.fonts`;
mkdirSync(out, { recursive: true });
for (const f of FONTS) {
  const woff = readFileSync(new URL(`../node_modules/@fontsource/${f}.woff`, import.meta.url));
  writeFileSync(`${out}/${f.split('/').pop()}.ttf`, woffToTtf(woff));
}
execSync('fc-cache -f');
console.log(execSync('fc-list : family | grep -iE "sora|geist|jetbrains" | sort -u').toString());
