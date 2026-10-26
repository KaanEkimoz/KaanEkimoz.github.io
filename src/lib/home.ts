/**
 * Home page content, EN + TR side by side.
 *
 * Kept out of i18n.ts because most of it is structured data (Q&A, skills,
 * career nodes) rather than flat UI strings. Every number here comes from
 * the profile brief; do not add figures that aren't backed by it.
 * Turkish copy is written to read naturally, not as a translation.
 */
import type { Lang } from '@lib/i18n';

type L10n = Record<Lang, string>;
export const pick = (v: L10n | string, lang: Lang): string => (typeof v === 'string' ? v : v[lang]);

export const copy = {
  hero: {
    hi: { en: "Hi, I'm Kaan", tr: 'Merhaba, ben Kaan' },
    title: { en: 'Full-Stack Developer', tr: 'Full-Stack Developer' },
    lede: {
      en: "Based in Istanbul, I build end-to-end products. By collaborating with AI coding agents, I manage everything from database architecture to UI design, code review, and testing.",
      tr: "İstanbul'da ürünleri baştan sona geliştiriyorum. Yapay zekâ kodlama ajanlarıyla birlikte çalışıyorum; veritabanı mimarisinden arayüz tasarımına, kod incelemesinden testlere kadar her şeyi ben yönetiyorum.",
    },
    stats: [
      { n: { en: '30+', tr: '30+' }, l: { en: 'Projects', tr: 'Proje' } },
      { n: { en: '5,000+', tr: '5.000+' }, l: { en: 'Commits', tr: 'Commit' } },
      { n: { en: '6+ yrs', tr: '6+ yıl' }, l: { en: 'Experience', tr: 'Deneyim' } },
    ],
    note: { en: 'better code, better tomorrow :)', tr: 'daha iyi kod, daha iyi yarın :)' },
    now: { en: 'Currently Working On', tr: 'Şu An Üzerinde Çalıştığım' },
    nowDesc: { en: 'Pet Services Marketplace', tr: 'Pet Hizmetleri Pazaryeri' },
    nowLink: { en: 'View Project', tr: 'Projeyi Gör' },
    stack: { en: 'Tech Stack', tr: 'Tech Stack' },
    photoNote: { en: 'same guy, bigger dreams :)', tr: 'aynı Kaan, daha büyük hayaller :)' },
  },
  ask: {
    title: { en: 'About me', tr: 'Hakkımda' },
  },
  method: {
    title: { en: 'How I use AI', tr: 'Yapay zekâyı nasıl kullanıyorum' },
    body: [
      {
        en: "I've been building with AI coding agents for two years. Every day I use Claude Code with MCP, split bigger changes across several agents, and run local models with Ollama when they're enough. I write my own agent skills for the parts of my work I keep repeating, and I've shipped LLM features to real users.",
        tr: "İki yıldır yapay zekâ kodlama ajanlarıyla çalışıyorum. Her gün MCP ile Claude Code kullanıyorum; büyük değişiklikleri birkaç ajana bölüyorum, yeterli olduğunda Ollama ile yerel modeller çalıştırıyorum. Sık tekrarladığım işler için kendi agent skill'lerimi yazıyorum, gerçek kullanıcılara LLM özellikleri de sundum.",
      },
    ],
    studio: {
      aria: { en: 'Animated map of how I work with AI: me, the agents I hand work to, their tools, the code, my projects and the people who use them.', tr: 'Yapay zekâyla nasıl çalıştığımın hareketli haritası: ben, işi verdiğim ajanlar, araçları, yazdığım kod, projelerim ve onları kullanan insanlar.' },
      stages: [
        { en: 'Me', tr: 'Ben' },
        { en: 'MCP + Skills', tr: "MCP + Skill'ler" },
        { en: 'Agents', tr: 'Ajanlar' },
        { en: 'Modes', tr: 'Modlar' },
        { en: 'Code', tr: 'Kod' },
        { en: 'Projects', tr: 'Projeler' },
        { en: 'End User', tr: 'Son kullanıcı' },
      ],
      hint: { en: 'Tap an agent to open its tools', tr: 'Araçlarını açmak için bir ajana dokun' },
      // Labels that change with the language (keyed by node id); names of tools stay as they are.
      names: {
        local: { en: 'Local LLMs', tr: "Yerel LLM'ler" },
        'hub-skills': { en: 'Skills + Memory', tr: "Skill'ler + Hafıza" },
        'hub-langs': { en: 'Languages', tr: 'Diller' },
        'hub-infra': { en: 'Engines & Deployment', tr: 'Motorlar & Yayın' },
        'hub-outputs': { en: 'Projects', tr: 'Projeler' },
        'hub-users': { en: 'End User', tr: 'Son kullanıcı' },
        'o-soft': { en: 'Software', tr: 'Yazılımlar' },
        'o-games': { en: 'Games', tr: 'Oyunlar' },
        'o-auto': { en: 'Automations', tr: 'Otomasyonlar' },
        'u-users': { en: 'Users', tr: 'Kullanıcılar' },
        'u-customers': { en: 'Customers', tr: 'Müşteriler' },
        'u-biz': { en: 'Businesses', tr: 'İşletmeler' },
      },
    },
  },
  career: {
    title: { en: 'My Journey', tr: 'Yolculuğum' },
    now: { en: 'NOW', tr: 'ŞU AN' },
    prev: { en: 'Previous step', tr: 'Önceki adım' },
    next: { en: 'Next step', tr: 'Sonraki adım' },
    step: { en: 'Step', tr: 'Adım' },
  },
  skills: {
    title: { en: 'Tech Stack', tr: 'Tech Stack' },
  },
  projects: {
    title: { en: 'My Projects', tr: 'Projelerim' },
    all: { en: 'All projects', tr: 'Tüm projeler' },
    swipe: { en: 'Swipe', tr: 'Kaydır' },
  },
  writing: {
    title: { en: 'Blog Posts', tr: 'Blog Yazıları' },
    all: { en: 'All posts →', tr: 'Tüm yazılar →' },
  },
  contact: {
    title: { en: "Let's build something", tr: 'Birlikte bir şey yapalım' },
    lede: { en: 'Have a project or an idea, or just want to say hi? Write to me.', tr: 'Bir projen ya da fikrin varsa, ya da sadece merhaba demek istersen yaz.' },
    send: { en: 'Send me an email', tr: 'E-posta gönder' },
    copy: { en: 'Copy', tr: 'Kopyala' },
    copied: { en: 'Copied', tr: 'Kopyalandı' },
    selected: { en: 'Selected', tr: 'Seçildi' },
    email: { en: 'Email', tr: 'E-posta' },
    location: { en: 'Location', tr: 'Konum' },
    place: { en: 'Istanbul, Türkiye · GMT+3', tr: 'İstanbul, Türkiye · GMT+3' },
    socials: { en: 'Elsewhere', tr: 'Sosyal' },
    note: { en: 'good ideas start with a message :)', tr: 'iyi fikirler bir mesajla başlar :)' },
  },
  resume: {
    title: { en: 'Resume', tr: 'Özgeçmiş' },
    metaDescription: { en: 'Resume of Kaan Usta, full-stack developer in Istanbul.', tr: "Kaan Usta'nın özgeçmişi; İstanbul'da full-stack developer." },
    print: { en: 'Download PDF', tr: 'PDF indir' },
    summary: {
      en: "Full-stack developer in Istanbul. Since June 2026 I've been building Patimania, a pet-services marketplace with a website, an iOS and Android app, and business and admin panels. I build with AI coding agents and check the work with tests and CI guards I wrote myself. Before that I spent six years making games in Unity.",
      tr: "İstanbul'da full-stack geliştiriciyim. Haziran 2026'dan beri web sitesi, iOS ve Android uygulaması, işletme ve yönetim panelinden oluşan bir pet hizmetleri pazaryeri olan Patimania'yı geliştiriyorum. Yapay zekâ kodlama ajanlarıyla geliştiriyor, işi kendi yazdığım testler ve CI nöbetçileriyle denetliyorum. Öncesinde altı yıl Unity ile oyun geliştirdim.",
    },
    experience: { en: 'Experience', tr: 'Deneyim' },
    education: { en: 'Education', tr: 'Eğitim' },
    skills: { en: 'Tech Stack', tr: 'Tech Stack' },
    tests: { en: 'Assessments', tr: 'Testler' },
    tests_note: { en: 'TestGorilla, September 2026 · percentile among all test takers', tr: 'TestGorilla, Eylül 2026 · tüm katılımcılar arasındaki yüzdelik dilim' },
    languages: { en: 'Languages', tr: 'Diller' },
    languagesValue: { en: 'Turkish · English', tr: 'Türkçe · İngilizce' },
    links: { en: 'Links', tr: 'Bağlantılar' },
    patimania: [
      {
        en: 'Designed and built the product: NestJS API (32 modules), Next.js website (128 routes), React Native + Expo app (45 screens), business and admin panels.',
        tr: 'Ürünü tasarlayıp geliştirdim: NestJS API (32 modül), Next.js web sitesi (128 sayfa), React Native + Expo uygulaması (45 ekran), işletme ve yönetim panelleri.',
      },
      {
        en: 'PostgreSQL + PostGIS data model with 68 tables; double booking blocked in the database with an EXCLUDE constraint; escrow money flow with an append-only ledger.',
        tr: '68 tabloluk PostgreSQL + PostGIS veri modeli; çift rezervasyonu veritabanında engelleyen EXCLUDE kısıtı; yalnız eklenebilir defterli Ödeme Güvencesi akışı.',
      },
      {
        en: 'AI-assisted development with Claude Code, checked by 76 end-to-end test suites (3,900 assertions), 7 CI guard scripts and 102 written decision records.',
        tr: 'Claude Code ile yapay zekâ destekli geliştirme; 76 uçtan uca test paketi (3.900 doğrulama), 7 CI nöbetçisi ve yazıya geçmiş 102 karar kaydıyla denetim.',
      },
      {
        en: 'Docker on a server in Türkiye, a staging-to-production pipeline and OTA mobile releases. Soft launch: real payments off, app in Google Play closed testing and TestFlight.',
        tr: "Türkiye'deki sunucuda Docker, staging'den prod'a yayın hattı ve OTA mobil güncellemeler. Ön yayın: gerçek ödeme kapalı, uygulama Google Play kapalı testinde ve TestFlight'ta.",
      },
    ],
  },
  sources: {
    method: { en: 'How I use AI', tr: 'Yapay zekâ' },
    career: { en: 'Career', tr: 'Kariyer' },
    skills: { en: 'Tech Stack', tr: 'Tech Stack' },
    games: { en: 'Games', tr: 'Oyunlar' },
    contact: { en: 'Contact', tr: 'İletişim' },
  },
} as const;

export type SectionId = keyof typeof copy.sources;

/** Pre-written questions and answers for the ask box. */
export const QA: { id: string; q: L10n; a: L10n; stats?: Record<Lang, string[]>; src: SectionId[] }[] = [
  {
    id: 'what',
    q: { en: 'What do I do?', tr: 'Ne yapıyorum?' },
    a: {
      en: "I'm a full-stack developer in Istanbul. I build complete products: the backend, the web and mobile apps, and the pipeline that ships them. AI coding agents help me write the code; the architecture, review and tests stay with me.",
      tr: "İstanbul'da full-stack geliştiriciyim. Arka uç, web ve mobil uygulama, yayın altyapısıyla ürünün tamamını geliştiriyorum. Kodu yapay zekâ ajanlarıyla yazıyorum; mimari, kod incelemesi ve testler bende.",
    },
    stats: { en: ['30+ projects', '5,000+ commits', '6+ yrs experience'], tr: ['30+ proje', '5.000+ commit', '6+ yıl deneyim'] },
    src: ['career'],
  },
  {
    id: 'now',
    q: { en: 'What am I working on?', tr: 'Şu an ne üzerinde çalışıyorum?' },
    a: {
      en: "Patimania, a marketplace connecting pet hotels, groomers and pet taxis with pet owners across Türkiye, on the web, iOS and Android (NestJS, Next.js, React Native). Payments wait in escrow until the service is done, and the database itself blocks double bookings. It's in soft launch: businesses are demo records for now, real payments open once the provider is connected, and the app is in Google Play closed testing and TestFlight.",
      tr: "Patimania: Türkiye genelinde pet otellerini, kuaförleri ve pet taksileri hayvan sahipleriyle buluşturan, web, iOS ve Android'de çalışan bir pazaryeri (NestJS, Next.js, React Native). Ödeme, hizmet bitene kadar Ödeme Güvencesi'nde bekliyor; çift rezervasyonu veritabanı engelliyor. Ön yayında: işletmeler şimdilik demo kayıt, gerçek ödemeler sağlayıcı bağlanınca açılacak, uygulama Google Play kapalı testinde ve TestFlight'ta.",
    },
    stats: { en: ['2,441 commits', '68 tables', '76 E2E test suites'], tr: ['2.441 commit', '68 tablo', '76 uçtan uca test paketi'] },
    src: [],
  },
  {
    id: 'skills',
    q: { en: 'What are my skills?', tr: 'Yeteneklerim neler?' },
    a: {
      en: 'Turning ideas into products people use, and keeping them running: data models where the database refuses bad states, web and mobile apps shipped to Google Play and TestFlight, and CI checks that catch mistakes before release. Games taught me to care about performance and feel. I work well with designers and artists, and studied entirely in English.',
      tr: "Fikirleri insanların kullandığı ürünlere çevirmek ve ayakta tutmak: hatalı durumları veritabanının reddettiği veri modelleri, Google Play ve TestFlight'a çıkan web ve mobil uygulamalar, hataları yayından önce yakalayan CI kontrolleri. Oyunlar bana performansı ve kullanım hissini önemsetti. Tasarımcı ve sanatçılarla iyi çalışırım; üniversiteyi tamamen İngilizce okudum.",
    },
    src: ['skills'],
  },
  {
    id: 'stack',
    q: { en: "What's my stack?", tr: 'Hangi teknolojileri kullanıyorum?' },
    a: {
      en: 'Mostly TypeScript: NestJS, Prisma and PostgreSQL on the backend, Next.js and React on the web, React Native with Expo on mobile, Docker and GitHub Actions to ship. I also work with C# and .NET, and spent six years in Unity before that.',
      tr: 'Ağırlıklı olarak TypeScript: arka uçta NestJS, Prisma ve PostgreSQL; webde Next.js ve React; mobilde Expo ile React Native; yayın için Docker ve GitHub Actions. C# ve .NET ile de çalışıyorum; öncesinde altı yıl Unity kullandım.',
    },
    src: ['skills'],
  },
  {
    id: 'ai',
    q: { en: 'How do I use AI?', tr: 'Yapay zekâyı nasıl kullanıyorum?' },
    a: {
      en: "Every day: Claude Code, MCP and agent skills I write myself, and I've shipped LLM features to real users. Agents write code fast; the architecture, review and tests stay with me, and I decide what goes live.",
      tr: "Her gün: Claude Code, MCP ve kendi yazdığım agent skill'ler; gerçek kullanıcılara LLM özellikleri de sundum. Ajanlar kodu hızlı yazıyor; mimari, kod incelemesi ve testler bende, neyin yayına çıkacağına ben karar veriyorum.",
    },
    src: ['method'],
  },
  {
    id: 'story',
    q: { en: "What's my story?", tr: 'Kısaca hikayem' },
    a: {
      en: 'I studied Digital Game Design at İstinye University and made Unity games for six years, including Brick Game on Google Play and the roguelike Orbs of The Power. Games taught me performance and how software should feel. After retail systems at a grocery chain, I now build full-stack web and mobile products.',
      tr: "İstinye Üniversitesi'nde Dijital Oyun Tasarımı okudum ve altı yıl Unity ile oyun geliştirdim; Google Play'deki Brick Game ve roguelike Orbs of The Power bunlardan. Performansı ve bir yazılımın nasıl hissettirmesi gerektiğini oyunlardan öğrendim. Bir market zincirinde perakende sistemleri üzerinde çalıştıktan sonra şimdi full-stack web ve mobil ürünler geliştiriyorum.",
    },
    src: ['career', 'games'],
  },
  {
    id: 'contact',
    q: { en: 'How can you reach me?', tr: 'Bana nasıl ulaşabilirsin?' },
    a: {
      en: "Email works best: kaanekimoz@gmail.com. I'm in Istanbul (GMT+3). For my CV or availability, just ask; LinkedIn and GitHub are below.",
      tr: "En kolayı e-posta: kaanekimoz@gmail.com. İstanbul'dayım (GMT+3). Özgeçmiş ya da müsaitlik için yazman yeterli; LinkedIn ve GitHub aşağıda.",
    },
    src: ['contact'],
  },
];

export const SKILL_GROUPS: { id: string; label: L10n; color: string; items: string[] }[] = [
  { id: 'lang', label: { en: 'Languages', tr: 'Diller' }, color: '#60a5fa', items: ['TypeScript', 'JavaScript', 'C#', 'SQL', 'HTML/CSS'] },
  { id: 'back', label: { en: 'Backend', tr: 'Arka uç' }, color: '#22d3ee', items: ['NestJS', 'Node.js', 'PostgreSQL', 'Prisma', 'PostGIS', 'ASP.NET Core', 'SQL Server'] },
  { id: 'front', label: { en: 'Frontend', tr: 'Ön yüz' }, color: '#818cf8', items: ['React', 'Next.js', 'Tailwind', 'Astro', 'Storybook'] },
  { id: 'mob', label: { en: 'Mobile', tr: 'Mobil' }, color: '#a78bfa', items: ['React Native', 'Expo', 'Reanimated', 'NativeWind'] },
  { id: 'ai', label: { en: 'AI', tr: 'Yapay zekâ' }, color: '#3d7bff', items: ['Claude Code', 'MCP', 'Anthropic API', 'Ollama', 'Agent skills'] },
  { id: 'ops', label: { en: 'DevOps', tr: 'DevOps' }, color: '#2dd4bf', items: ['Docker', 'GitHub Actions', 'nginx', 'Azure', 'Cloudflare', 'MinIO'] },
  { id: 'game', label: { en: 'Games', tr: 'Oyun' }, color: '#94a3b8', items: ['Unity', 'Unreal Engine 5', 'MonoGame', 'DOTween'] },
];

export const EVALS: { name: L10n; value: number }[] = [
  { name: { en: '.NET', tr: '.NET' }, value: 99 },
  { name: { en: 'React', tr: 'React' }, value: 99 },
  { name: { en: 'Artificial intelligence', tr: 'Yapay zekâ' }, value: 99 },
  { name: { en: 'Microsoft Azure', tr: 'Microsoft Azure' }, value: 98 },
  { name: { en: 'English (B2)', tr: 'İngilizce (B2)' }, value: 97 },
];

/** Career nodes. `s`/`e` are fractional years; lane 0 software, 1 games, 2 education. `lab` puts the label above (-1) or below (+1). */
/** Career steps (lane 0 software, 1 games, 2 education). `tools` (four, fanned on hover) and `more` (detail panel only) are keys of TOOLS in CareerSection. */
export const CAREER: { lane: 0 | 1 | 2; s: number; e: number; title: L10n; at: string; when: L10n; d: L10n; tools: string[]; more?: string[] }[] = [
  { lane: 2, s: 2020.0, e: 2024.5, title: { en: 'B.Sc. Digital Game Design', tr: 'Dijital Oyun Tasarımı lisansı' }, at: 'İstinye University', when: { en: '2020 — 2024', tr: '2020 — 2024' },
    d: { en: 'Taught entirely in English. Where programming and engines became the focus.', tr: 'Eğitim dili tamamen İngilizceydi. Programlama ve oyun motorları burada asıl odağım oldu.' }, tools: ['unity', 'csharp', 'unrealengine', 'design'] },
  { lane: 1, s: 2022.25, e: 2022.5, title: { en: 'Jr. Game Developer', tr: 'Jr. Game Developer' }, at: '208 Studios', when: { en: 'Apr — Jun 2022', tr: 'Nis — Haz 2022' },
    d: { en: 'Hyper-casual games and rapid prototypes, including Draw Rush and Stack Runner.', tr: 'Draw Rush ve Stack Runner dahil hiper-casual oyunlar ve hızlı prototipler.' }, tools: ['unity', 'csharp', 'mobile', 'github'] },
  { lane: 1, s: 2022.0, e: 2026.85, title: { en: 'Game Developer', tr: 'Game Developer' }, at: 'Ekimoz Games', when: { en: '2022 — now', tr: '2022 — devam' },
    d: { en: 'Self-published mobile games: publishing, ad mediation and monetisation.', tr: 'Kendi yayımladığım mobil oyunlar: yayıncılık, reklam mediasyonu ve monetizasyon.' }, tools: ['unity', 'csharp', 'googleplay', 'android'], more: ['levelplay', 'iap'] },
  { lane: 1, s: 2023.33, e: 2023.75, title: { en: 'Unity XR Developer', tr: 'Unity XR Developer' }, at: 'Visionary Spaces', when: { en: 'May — Sep 2023', tr: 'May — Eyl 2023' },
    d: { en: 'VR scenes and games with physics-based mechanics.', tr: 'Fizik tabanlı mekaniklerle VR sahneleri ve oyunları.' }, tools: ['unity', 'csharp', 'xr', 'physics'] },
  { lane: 1, s: 2024.83, e: 2025.83, title: { en: 'Unity Developer', tr: 'Unity Developer' }, at: 'YTÜ DOGDOK', when: { en: 'Nov 2024 — Oct 2025', tr: 'Kas 2024 — Eki 2025' },
    d: { en: 'Core gameplay systems for mobile games in a team of three.', tr: 'Üç kişilik ekipte mobil oyunların temel oynanış sistemleri.' }, tools: ['unity', 'csharp', 'mobile', 'gameplay'] },
  { lane: 0, s: 2025.83, e: 2026.08, title: { en: 'Retail Technology Specialist', tr: 'Perakende Teknolojileri Uzmanı' }, at: 'Gurmenin Sepeti', when: { en: 'Nov 2025 — Jan 2026', tr: 'Kas 2025 — Oca 2026' },
    d: { en: "Took a grocery chain's POS, barcode and scale systems live across its stores, plus its online sales system.", tr: 'Market zincirinin kasa, barkod ve terazi sistemlerini mağazalarda canlıya aldım; online satış sistemini de yayına açtım.' }, tools: ['pos', 'barcode', 'scale', 'cart'] },
  { lane: 0, s: 2026.42, e: 2026.85, title: { en: 'Full-Stack Developer', tr: 'Full-Stack Developer' }, at: 'Patimania', when: { en: 'Jun 2026 — now', tr: 'Haz 2026 — devam' },
    d: { en: 'Architecture, backend, web, mobile, design system, escrow payments and CI/CD.', tr: 'Mimari, arka uç, web, mobil, tasarım sistemi, Ödeme Güvencesi altyapısı ve CI/CD.' }, tools: ['nextdotjs', 'nestjs', 'postgresql', 'expo'], more: ['typescript', 'react', 'prisma', 'docker', 'nginx', 'githubactions', 'minio', 'iyzico'] },
];

export const PATIMANIA_MODULES =
  'auth users providers services service-types reservations payments disputes cart messages notifications reviews favorites search geo addresses pets media campaigns banners announcements events reports analytics support abuse jobs maintenance platform-settings admin-alerts demo-panel taxi'.split(' ');
