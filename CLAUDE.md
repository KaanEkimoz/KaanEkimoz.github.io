# CLAUDE.md — kaanusta.dev

Context for Claude sessions working on this repo (local or cloud). The repo is public: never put passwords, API keys or tokens in this file or anywhere in the repo.

## Owner and how to work with him

- **Kaan Usta** (Yusuf Kaan Usta), based in Türkiye. Unity/C# game developer (mobile-focused, since 2020) and solo full-stack developer of Patimania (Next.js, NestJS, Expo).
- Talk to him in **Turkish**, naturally (not translated-sounding). He gives a lot of autonomy; confirm before merging, deploying or anything hard to undo.
- His internet drops often: re-read this file and the code before asking where things were left.
- Plans: write only what will be done — no "out of scope / v2" sections unless he asks what else is possible.
- Before saying "done", verify every acceptance criterion yourself, including clashes with existing systems (e.g. the custom cursor, theme, i18n).

## Stack

Astro 5 static site + content collections, Tailwind CSS (theme via CSS variables), TypeScript, self-hosted Inter + JetBrains Mono, `ClientRouter` view transitions. Hosted on **GitHub Pages** (static only — no server code; anything dynamic runs client-side or in the Cloudflare Worker below).

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

## Site structure

```
/                    hero + mini-game, featured projects, latest posts
/projects[/<slug>]   grid with filter pills (All | Mobile | PC | VR | Published) and detail pages
/blog[/<slug>]       posts (md / mdx)
/brickcrack-privacy  hidden, for App Store Connect (iOS build name "BrickCrack" = Brick Game)
/drawrush-privacy    hidden, raw HTML in public/drawrush-privacy/ (bypasses Astro)
/chat                hidden, private Claude chat (see below)
/tr/...              Turkish mirror of every page except /chat and /drawrush-privacy
/rss.xml, /tr/rss.xml
```

- **i18n:** EN at `/…` (default, no prefix), TR at `/tr/…`. Strings + helpers in `src/lib/i18n.ts` (`t`, `localizedPath`, `alternateUrl`). Page bodies live once in `src/views/*.astro` and take a `lang` prop; `src/pages/…` and `src/pages/tr/…` are thin wrappers, so a page change is made in the view, not twice. `LanguageToggle` remembers the choice in `localStorage.fx-lang`; the pre-paint redirect in `BaseLayout` only runs on the root paths.
- **Content files:** EN `foo.md`, TR `foo-tr.md` (dash, not dot — Astro strips dots from ids). Slug pages drop the `-tr` suffix (`slugOf` in `src/lib/content.ts`) so both languages share one slug; `getProjects(lang)` / `getPosts(lang)` there return a locale's entries already filtered and sorted. Schemas in `src/content.config.ts` (`lang`, `published`, `featured`, `youtubeId`, `coverImage`, `gallery`…).
- **Theme:** design tokens in `src/styles/global.css` are **space-separated RGB triplets** (`--accent-1: 0 217 255`) so Tailwind's `rgb(var(--x) / <alpha-value>)` works. Dark in `:root`, light in `html[data-theme='light']`. Don't put hex values back into `tailwind.config.mjs`. In canvas/inline styles wrap tokens with `rgb(...)`.
- **Key components:** `BaseLayout` (head, pre-paint theme + language scripts, hreflang), `HeroCanvas` (target mini-game), `ProjectFilter`, `ProjectCard`, `ProjectModal`, `LiteYouTube`, `CustomCursor` (hides over iframes), `ThemeToggle`, `LanguageToggle`.
- **Images:** put content images in `src/assets/` (Astro optimizes them); `public/` is served as-is. Keep big PNGs under ~2 MB.
- **OG image:** must be JPEG — WhatsApp silently rejects palette PNGs. Regenerate from `scripts/og-image.svg`:
  `node -e "require('sharp')(require('fs').readFileSync('scripts/og-image.svg')).flatten({background:'#0a0a14'}).jpeg({quality:88,mozjpeg:true}).toFile('public/og-image.jpg')"`

## Content

- **Projects** (`src/content/projects/`, all with `-tr` mirrors): brick-game (Mobile, `published: true`, on Google Play; per-locale Play Store screenshots with `-tr` suffix), draw-rush, flex-hit, orbs-of-the-power, patimania (Web/SaaS, pre-launch, `featured`, no trailer), stack-runner, still.
- **Blog** (`src/content/blog/`): welcome, april-2026-developer-update (mdx), may-2026-developer-update (mdx), each with `-tr`.
- Adding a project: `<slug>.md` + `<slug>-tr.md`, `src/assets/projects/<slug>/cover.*` + `gallery/`. A new platform needs the pill in `ProjectFilter.astro` and strings in `i18n.ts`.
- Adding a post: `<slug>.{md,mdx}` + `-tr`, hero image in `src/assets/blog/`; in MDX use `import LiteYouTube from '@components/LiteYouTube.astro'`.

## Writing rules

- **Turkish copy must be idiomatic, never a calque.** Rewrite the idea in Turkish instead of following English sentence structure. Examples Kaan rejected → preferred: "… lisansıyla başladı" → "üniversitede … okudu"; "varsayılan olarak" → "zaten / normalde" or drop it; "tatlı bir nokta" → "ideal bir denge"; "elimde üç oyun vardı" → "üç oyun üzerinde çalıştım"; "yazmaktansa göstermek daha kolay geldi" → "İşte Nisan ayında yaptıklarım.".
- Keep proper nouns and tech chips unchanged (game titles, "Kaan Usta", "GAME OVER", stack names). Patimania: "Ödeme Güvencesi" in public TR copy, "escrow" in EN.
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
