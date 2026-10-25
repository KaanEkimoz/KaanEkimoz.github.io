/**
 * Renders /resume and /tr/resume to A4 PDFs in public/cv/, the files the
 * resume page's download button points to. The PDFs use the page's print
 * styles, so the screen layout and the PDF stay one source.
 *
 *   npm run build && npm run resume:pdf && npm run build
 *
 * Run it again whenever the resume facts change (CAREER, SKILL_GROUPS,
 * EVALS or copy.resume in src/lib/home.ts). Needs Playwright with Chromium
 * (`npx playwright install chromium` on a fresh machine).
 */
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { extname, join, resolve } from 'node:path';

const { chromium } = createRequire(import.meta.url)('playwright');

const DIST = resolve('dist');
const OUT = resolve('public/cv');
const PAGES = [
  ['/resume/', 'kaan-usta-resume.pdf'],
  ['/tr/resume/', 'kaan-usta-ozgecmis.pdf'],
];
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };

if (!existsSync(join(DIST, 'resume/index.html'))) {
  console.error('dist/ has no resume page; run `npm run build` first.');
  process.exit(1);
}

// A minimal static server over dist/ (directories serve their index.html).
const server = createServer((req, res) => {
  let file = join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!file.startsWith(DIST) || !existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  for (const [path, name] of PAGES) {
    const page = await browser.newPage();
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: join(OUT, name), format: 'A4', printBackground: true, preferCSSPageSize: true });
    console.log('wrote', join('public/cv', name));
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
