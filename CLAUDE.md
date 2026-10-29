# CLAUDE.md — kaanusta.dev

Context for Claude sessions working on this repo (local or cloud). The repo is public: never put passwords, API keys or tokens in this file or anywhere in the repo.

## Owner and how to work with him

- **Kaan Usta** (Yusuf Kaan Usta), based in Türkiye. Full-stack developer who builds Patimania (Next.js, NestJS, Expo); Unity/C# game developer since 2020. The site presents him as a full-stack developer (Kaan, 26 Oct 2026: "Full-Stack Developer", no "AI", not "engineer"), with games as where he started.
- Talk to him in **Turkish**, naturally (not translated-sounding). He gives a lot of autonomy. Site PRs merge without asking (see below); still confirm anything else hard to undo (deleting content, Worker deploys, D1 migrations, history rewrites).
- His internet drops often: re-read this file and the code before asking where things were left.
- Plans: write only what will be done — no "out of scope / v2" sections unless he asks what else is possible.
- Before saying "done", verify every acceptance criterion yourself, including clashes with existing systems (e.g. theme, i18n, the project modal, `/chat`).

## Stack

Astro 5 static site + content collections, Tailwind CSS (theme via CSS variables), TypeScript, self-hosted Sora (display) + Geist (text) + JetBrains Mono (Inter only for `/chat`), `ClientRouter` view transitions. Hosted on **GitHub Pages** (static only — no server code; anything dynamic runs client-side or in the Cloudflare Worker below).

```sh
npm ci
npm run dev      # http://localhost:4321
npm run build    # dist/
npm run check    # astro check (types) — keep it at 0 errors
```

## Branches, PRs, deploy

- Work on the persistent branch **`dev/claude`** (never delete it). Flow: commit on `dev/claude` → push → PR into `main` → merge (`gh pr merge <n> --merge --delete-branch=false`) → GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys Pages in ~1 min.
- Commit style: `type(scope): summary` — e.g. `feat(chat): …`, `content(blog): …`, `fix(theme): …`.
- `git add` specific files, not `-A`.
- Don't hard-reset or force-push shared branches; roll back with `git revert`.
- After a merge, verify the live site (`curl -sL https://kaanusta.dev/<path>`); a browser may need a hard refresh because of view transitions / the /chat service worker.

## Session rules (learned the hard way)

These come from mistakes made in earlier sessions. Follow them in every session, especially cloud ones.

**Git and PRs**
- Start with `git fetch origin` and check whether the last PR from `dev/claude` is already merged. If it is, restart the branch from main (`git checkout -B dev/claude origin/main`) before new work. Never add commits to a merged PR.
- A rejected push means the remote moved (e.g. CLAUDE.md edited on GitHub): `git pull --rebase origin dev/claude`, then push.
- **Auto-merge (Kaan's rule, 25 Oct 2026):** keep working on `dev/claude` and going through a PR, but don't wait for his approval. Once `npm run check`, `npm run build` and the screenshot/interaction checks below pass, mark the PR ready, merge it (`--merge`), confirm the deploy run succeeds, and tell him what went live. If something breaks later it gets fixed in a new PR (or `git revert`). This covers the site only — Worker deploys and D1 migrations still need his OK.
- Cloud sandboxes can't reach kaanusta.dev (proxy 403). Verify a deploy by the Actions run conclusion and tell Kaan the live page itself wasn't checked.

**Facts and copy**
- Never invent numbers, levels, dates or status. Facts live in `src/lib/home.ts`; everything else must match it.
- When a fact changes, grep for the old one across `src/content`, `src/lib`, README and this file. Project pages, blog posts and Q&A answers repeat facts, and stale copies there contradicted the home page before.
- If two places disagree (once: English "C1" in contact vs "B2" in the evals), don't pick one. Drop the unverified one and ask Kaan.
- No store status or usage metrics without his confirmation. Patimania facts come from his portfolio package (`Patimania-Portfolyo/08-metinler/02-olculmus-rakamlar.md`, measured 24 Oct 2026): soft launch, real payments off, live businesses are demo records (say so, don't hide it), app in Google Play closed test + TestFlight external test, code written with Claude Code (say so, framed as AI-assisted development with the checks he built around it).
- Don't write unmeasured claims into docs (a "Lighthouse 100" line had to be removed).
- Personal data stays out of this public repo: no phone, street address, birth date or finances, and no CV link without asking.

**CSS and scripts**
- Use `minmax(0, 1fr)` for grid columns, not `1fr`, when a child has `white-space: nowrap`, tabs or chip rows. Plain `1fr` made the Patimania card overflow on phones.
- A title + pill row needs `flex-wrap: wrap` at phone widths.
- `ProjectPage` HTML is injected into the project modal on other pages, so style it with utilities / global classes only. Scoped `<style>` won't load there.
- Scripts init on `astro:page-load` and clean up on `astro:before-swap`. With `history.replaceState`, pass `history.state` through, since ClientRouter keeps its state there.

**Resume PDFs**
- The resume's "Download PDF" button serves pre-rendered files in `public/cv/` (EN + TR), made from the page's print styles (navy header band, sidebar + main column, 2 A4 pages). After changing any resume fact (CAREER, SKILL_GROUPS, EVALS, copy.resume) or the print CSS, regenerate them: `npm run build && npm run resume:pdf && npm run build`, and look at both PDFs before committing.

**Before saying "done"**
- `npm run check` (0 errors) and `npm run build`.
- Run `npx astro preview` and screenshot each changed page with Playwright (pre-installed; don't reinstall) at 1280 and 390 px wide, dark and light, EN and TR.
- Check the console and `scrollWidth > clientWidth`, then look at the screenshots. The overflow check doesn't catch content spilling out of a card.
- If `global.css` or the tokens changed, compare `/chat` before and after; it must not change.
- Test behaviour, not just looks: the Q&A box, filters, the modal (open, Escape, close), theme and language toggles, and that canvases and scroll effects restart after client-side navigation.
- Not bugs: the sticky header showing mid-page in full-page screenshots, and YouTube thumbnails failing in the sandbox (`ERR_TUNNEL_CONNECTION_FAILED`).

**Tooling**
- Don't put `pkill`/`kill` in the same Bash command as other work; it can kill the shell.
- Standalone HTML drafts need `<meta charset="utf-8">`, or Turkish letters break in local previews.
- OG image: librsvg only sees system fonts. Run `node scripts/install-og-fonts.mjs` first; it installs the fonts and prints the family names fontconfig uses (e.g. "Sora Medium"), which the SVG must match. Look at the JPEG before committing.

**Design**
- Kaan likes blue and a futuristic data/AI look. He rejected a draft that looked like Claude's own UI. Build on the existing tokens and shared classes instead of adding new palettes.
- Don't call him the "sole / only engineer" or say he built things "alone" (Kaan, 25 Oct 2026): he has worked with very good people on many projects and doesn't want solo work emphasised.
- No home-page sections dedicated to Patimania (removed 25 Oct 2026): it's his first product of several, so it appears as a project (hero card, Q&A answer, /projects), not as its own section.
- He also said the site looked AI-made. Avoid the template tells: no eyebrow label on every section, no gradient or blue-accent word in headings, no glow on cards, no slogans ("end to end", "built by one engineer"). Vary section layouts, and prefer real material (his photo, real stories from his work) over decoration.

## Site structure

```
/                    hero (greeting, title, stats, 'currently working on' + tech stack over the data canvas, bars on the bottom edge), photo + Q&A box (question chips only, no text input), how I use AI (animated AI studio map, `AIStudio` + `src/lib/ai-studio.ts`; under 900px a separate two-column top-to-bottom layout with a self-running agent tour, and it animates even with reduced motion on, at Kaan's request), My Journey (career as hexagon steps with tool fans, `CareerSection`), Tech Stack, My Projects (endless strip of all projects, wide and square cards taking turns, `ProjectsStrip`), A Year on GitHub (`GitHubActivity`: the contribution calendar fetched into the gitignored `src/data/github-activity.json` by `scripts/github-activity.mjs` on `prebuild`; the deploy workflow also runs daily at 03:17 UTC to refresh it; private Patimania commits count because Kaan's profile includes private contributions), latest posts, contact
/projects[/<slug>]   grid with filter pills (All | Products & Web | Games) and detail pages
/blog[/<slug>]       posts (md / mdx)
/resume              Özgeçmiş / Resume, built from home.ts facts (CAREER, SKILL_GROUPS, EVALS, copy.resume); its button downloads public/cv/*.pdf
/brickcrack-privacy  hidden, for App Store Connect (iOS build name "BrickCrack" = Brick Game)
/drawrush-privacy    hidden, raw HTML in public/drawrush-privacy/ (bypasses Astro)
/chat                hidden, private Claude chat (see below)
/tr/...              Turkish mirror of every page except /chat and /drawrush-privacy
/rss.xml, /tr/rss.xml
```

- **i18n:** EN at `/…` (default, no prefix), TR at `/tr/…`. Strings + helpers in `src/lib/i18n.ts` (`t`, `localizedPath`, `alternateUrl`). Page bodies live once in `src/views/*.astro` and take a `lang` prop; `src/pages/…` and `src/pages/tr/…` are thin wrappers, so a page change is made in the view, not twice. `LanguageToggle` remembers the choice in `localStorage.fx-lang`; the pre-paint redirect in `BaseLayout` only runs on the root paths.
- **Content files:** EN `foo.md`, TR `foo-tr.md` (dash, not dot — Astro strips dots from ids). Slug pages drop the `-tr` suffix (`slugOf` in `src/lib/content.ts`) so both languages share one slug; `getProjects(lang)` / `getPosts(lang)` there return a locale's entries already filtered and sorted. Schemas in `src/content.config.ts` (`lang`, `published`, `featured`, `youtubeId`, `coverImage`, `gallery`…).
- **Theme:** dark-first navy with blue (`--accent-1`), cyan (`--accent-2`) and indigo (`--accent-3`) accents. Design tokens in `src/styles/global.css` are **space-separated RGB triplets** (`--accent-1: 61 123 255`) so Tailwind's `rgb(var(--x) / <alpha-value>)` works. Dark in `:root`, light in `html[data-theme='light']`. Light is a blue-grey ground with white cards and blue-tinted shadows, plus blue washes on the body and on #method / #skills / #writing (end of `global.css`); Kaan found an all-white light theme too pale (25 Oct 2026). Don't put hex values back into `tailwind.config.mjs`. In canvas/inline styles wrap tokens with `rgb(...)`.
- **Shared classes** (`@layer components` in `global.css`): `.wrap`, `.sec`, `.sec-head`, `.eyebrow`, `.grad-em`, `.panel`, `.btn`, `.btn-ghost`, `.link`, `.mono-chip`, `.hand` (Caveat handwritten notes).
- **Logos:** `BrandIcon` renders simple-icons by export name (`siNextdotjs`…); LinkedIn is drawn in the component because simple-icons dropped it.
- **Key components:** `BaseLayout` (head, pre-paint theme + language scripts, hreflang), `Header` / `Footer` / `Mark`, the home sections in `src/components/home/` (`HeroField` canvas, `HeroSection` with the pre-written Q&A box, `MethodSection`, `CareerSection`, `SkillsSection`, `ProjectsStrip`, `ContactSection`), `ProjectFilter`, `ProjectCard`, `ProjectModal`, `BlogCard`, `PageHeader`, `LiteYouTube`, `ThemeToggle`, `LanguageToggle`.
- **Home copy and data** (Q&A, career nodes, skills, evals for the resume and Q&A) live in `src/lib/home.ts`, EN and TR side by side. Numbers there come from Kaan's profile brief; don't add figures or claims (store status, metrics) he hasn't confirmed.
- **Client scripts** init on `astro:page-load` and clean up on `astro:before-swap`. The project modal injects `#project-detail` from a detail page into other pages, so `ProjectPage` uses utilities / global classes only (scoped CSS wouldn't load there); its back link carries `data-back` so the modal can hide it.
- **Images:** put content images in `src/assets/` (Astro optimizes them); `public/` is served as-is. Keep big PNGs under ~2 MB.
- **SEO and stats:** `src/lib/seo.ts` builds the schema.org JSON-LD (Person + WebSite on home, BlogPosting on posts, CreativeWork on projects); posts and projects use their own cover, cut to 1200×630 JPEG, as the link preview. `ANALYTICS` in `src/lib/constants.ts` holds the Cloudflare Web Analytics token and the Google Search Console verification code (public values; empty = off). /chat loads neither.
- **OG image:** must be JPEG — WhatsApp silently rejects palette PNGs. Regenerate from `scripts/og-image.svg` after `node scripts/install-og-fonts.mjs` (without the fonts librsvg falls back silently):
  `node -e "require('sharp')(require('fs').readFileSync('scripts/og-image.svg')).flatten({background:'#050912'}).jpeg({quality:88,mozjpeg:true}).toFile('public/og-image.jpg')"`

## Content

- **Projects** (`src/content/projects/`, all with `-tr` mirrors): brick-game (Mobile, `published: true`, on Google Play; per-locale Play Store screenshots with `-tr` suffix), draw-rush, flex-hit, orbs-of-the-power, patimania (Web/SaaS, pre-launch, `featured`, no trailer), stack-runner, still.
- **Blog** (`src/content/blog/`): welcome, april-2026-developer-update (mdx), may-2026-developer-update (mdx), building-patimania ("Building a Pet Marketplace Platform", Kaan's own post on how Patimania is built, facts from the portfolio package), each with `-tr`.
- Adding a project: `<slug>.md` + `<slug>-tr.md`, `src/assets/projects/<slug>/cover.*` + `gallery/`. Set `category: product` for products (wide card on /projects) or leave the default `game`; `coverPosition` crops the cover in tight tiles. Covers are `cover-wide.webp` (16:9, 1920×1080) as `coverImage` and `cover-square.webp` (1:1, 1440×1440) as `coverSquare` for the square cards of the home strip; without `coverSquare` the wide cover is shown whole over a blurred copy (Brick Game keeps its own `cover.png`). The old `cover.png` files of the games stay in their galleries as real screenshots.
- Adding a post: `<slug>.{md,mdx}` + `-tr`, hero image in `src/assets/blog/`; in MDX use `import LiteYouTube from '@components/LiteYouTube.astro'`.
- Devlog covers come from `scripts/blog-cover.mjs` (run `node scripts/install-og-fonts.mjs` first): light blue field, floor grid, soft vignette, calm cyan date over a centred white "Developer Update", after the original May 2026 cover; only the date changes: `node scripts/blog-cover.mjs devlog "JUNE 2026" src/assets/blog/june-2026.jpg`. The Meet Kaan cover (`src/assets/blog/meet-kaan.jpg`, dark, with the cut-out portrait) is a one-off; Kaan wants it kept as is.

## Writing rules

- **Turkish copy must be idiomatic, never a calque.** Rewrite the idea in Turkish instead of following English sentence structure. Examples Kaan rejected → preferred: "… lisansıyla başladı" → "üniversitede … okudu"; "varsayılan olarak" → "zaten / normalde" or drop it; "tatlı bir nokta" → "ideal bir denge"; "elimde üç oyun vardı" → "üç oyun üzerinde çalıştım"; "yazmaktansa göstermek daha kolay geldi" → "İşte Nisan ayında yaptıklarım.".
- **Site copy is in Kaan's own voice, first person** ("I build…", "Ne yapıyorum?"), including the ask box questions and answers. Headings and labels can be plain nouns ("Hakkımda", "Projeler", "Blog"). Write plainly and specifically; no slogans.
- Keep proper nouns and tech chips unchanged (game titles, "Kaan Usta", stack names). Patimania: "Ödeme Güvencesi" in public TR copy, "escrow" in EN.
- The **welcome** post is written by Claude in the **third person** about Kaan ("He works in…", signed "— Claude"); never first person. Kaan's own posts are first person.
- Devlog intros are short and plain, leading into the video with a colon ("Three games I worked on in May:").

## /chat — private Claude chat

A password-protected chat at `kaanusta.dev/chat` (noindex, not in the sitemap, not linked) for two users: `kaan` and `partner`.

- **Architecture:** browser → Cloudflare Worker `kaanusta-chat` (`worker/`, URL in `CHAT_WORKER_URL` in `src/lib/constants.ts`) → Anthropic Messages API. The Anthropic key and the passwords exist only as Worker secrets (`ANTHROPIC_API_KEY`, `ACCESS_TOKEN` = partner, `ACCESS_TOKEN_KAAN` = kaan, `FILE_REF_SECRET`). History, settings, projects, memory and usage live in Cloudflare D1 `kaanusta-chat` (schema in `worker/migrations/`).
- **Page:** `src/pages/chat.astro`, standalone (no `BaseLayout`), claude.ai-style layout with its own warm palette (site tokens re-pointed under `.chat-body`). PWA files in `public/chat/` (scope `/chat/`). Passwords go in the `Authorization` header URL-encoded (Turkish letters). Model/effort lists exist in both `worker/src/index.js` (`MODELS`, `EFFORTS`, the allowlist) and `src/lib/constants.ts` (`CHAT_MODELS`, `CHAT_EFFORTS`, the labels) — change both.
- **Worker features:** runs the whole turn (relays SSE unchanged while rebuilding the message, answers memory tool calls against D1, resumes `pause_turn`, reuses the code container, ends with a `usage_summary` event); web search/fetch, code execution with per-user output downloads, signed file refs (`<file_id>.<HMAC>`; never accept bare file_ids), projects, `/compact` summaries, display name, monthly usage. Full details and commands: `worker/README.md`.
- **Deploying Worker changes** (needs Cloudflare auth — `wrangler login` locally, or a `CLOUDFLARE_API_TOKEN` in a cloud environment), from `worker/`:
  1. `npx -y wrangler@4 d1 migrations apply kaanusta-chat --remote` (if a new migration was added)
  2. `npx -y wrangler@4 deploy`
  3. then merge the page PR. If the Worker's API changes shape, deploy it right before merging so the live page and Worker stay compatible.
- Test the Worker locally with `npx -y wrangler@4 dev` + a `.dev.vars` file (fake key; never commit it) and `d1 migrations apply --local`; test the page against it by pointing `CHAT_WORKER_URL` at localhost temporarily (revert before committing).
- Some networks (e.g. Türk Telekom's "Güvenli İnternet" filter) block `*.workers.dev`; that's a network issue, not a bug.
