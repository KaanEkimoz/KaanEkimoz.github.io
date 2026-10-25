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
    eyebrow: { en: 'Kaan Usta · Istanbul', tr: 'Kaan Usta · İstanbul' },
    title: { en: 'Full-stack engineer shipping products <em>end to end</em>.', tr: 'Ürünleri <em>uçtan uca</em> geliştiren <span style="white-space:nowrap">full-stack</span> mühendis.' },
    lede: {
      en: "I'm Kaan. I build the backend, the web and mobile apps, and the pipeline that deploys them. Right now that's Patimania, as its only engineer.",
      tr: "Ben Kaan. Arka ucu, web ve mobil uygulamaları ve bunları yayına alan altyapıyı ben kuruyorum. Şu sıralar tek mühendisi olduğum Patimania'yı geliştiriyorum.",
    },
    facts: [
      { en: 'Web + iOS + Android', tr: 'Web + iOS + Android' },
      { en: '74 end-to-end test files', tr: '74 uçtan uca test dosyası' },
      { en: '6 years of C# and Unity before', tr: 'Öncesinde 6 yıl C# ve Unity' },
    ],
    email: { en: 'Email me', tr: 'E-posta gönder' },
    seeWork: { en: 'See Patimania', tr: "Patimania'ya bak" },
  },
  ask: {
    title: { en: 'About me', tr: 'Hakkımda' },
    placeholder: { en: 'Ask about his work…', tr: 'İşleri hakkında bir şey sor…' },
    inputLabel: { en: 'Ask a question about Kaan', tr: 'Kaan hakkında bir soru sor' },
    send: { en: 'Send', tr: 'Gönder' },
    fallback: {
      en: "That one isn't covered here. Try a question below, or email Kaan at kaanekimoz@gmail.com.",
      tr: 'Bu soru burada yok. Aşağıdaki sorulardan birini dene ya da Kaan’a yaz: kaanekimoz@gmail.com.',
    },
  },
  work: {
    eyebrow: { en: 'Flagship · Jun 2026 — now', tr: 'Ana proje · Haz 2026 — devam' },
    title: { en: 'Patimania, <em>built by one engineer</em>.', tr: 'Patimania, <em>tek mühendisin elinden</em>.' },
    lede: {
      en: 'A marketplace that connects pet hotels, groomers and pet taxis with pet owners across Türkiye. I designed the system and built every part of it.',
      tr: 'Türkiye genelinde pet otelleri, kuaförleri ve pet taksileri hayvan sahipleriyle buluşturan bir pazaryeri. Sistemi tasarladım ve her parçasını ben geliştirdim.',
    },
    status: { en: 'soft launch · payments off', tr: 'ön yayında · ödeme kapalı' },
    tabs: { en: ['Home', 'Search', 'Business', 'Mobile', 'Panel', 'Calendar'], tr: ['Ana sayfa', 'Arama', 'İşletme', 'Mobil', 'Panel', 'Takvim'] },
    rows: [
      { k: { en: 'surfaces', tr: 'platformlar' }, v: { en: 'Web · iOS · Android', tr: 'Web · iOS · Android' } },
      { k: { en: 'backend', tr: 'arka uç' }, v: { en: '<b>32</b> NestJS domain modules', tr: '<b>32</b> NestJS alan modülü' } },
      { k: { en: 'data', tr: 'veri' }, v: { en: '<b>68</b> Prisma models · <b>132</b> migrations · PostGIS', tr: '<b>68</b> Prisma modeli · <b>132</b> migration · PostGIS' } },
      { k: { en: 'quality', tr: 'kalite' }, v: { en: '<b>74</b> end-to-end test files on real Postgres + MinIO', tr: '<b>74</b> uçtan uca test dosyası, gerçek Postgres + MinIO ile' } },
      { k: { en: 'delivery', tr: 'yayın' }, v: { en: '<b>7</b> GitHub Actions workflows', tr: '<b>7</b> GitHub Actions iş akışı' } },
      { k: { en: 'history', tr: 'geçmiş' }, v: { en: '<b>2,409</b> commits since 2 July 2026', tr: "2 Temmuz 2026'dan beri <b>2.409</b> commit" } },
    ],
    models: { en: 'Data models', tr: 'Veri modelleri' },
    modules: { en: 'Domain modules', tr: 'Alan modülleri' },
    note: {
      en: "Storefront, search and business onboarding are open. Bookings and payments switch on once the company's live payment account is ready; no code change needed. Numbers counted from the repository in October 2026.",
      tr: 'Vitrin, arama ve işletme kaydı açık. Rezervasyon ve ödeme, şirketin canlı ödeme hesabı açılınca devreye girecek; kodda değişiklik gerekmiyor. Rakamlar Ekim 2026’da kod deposundan sayıldı.',
    },
    visit: { en: 'Visit patimania.com ↗', tr: "patimania.com'u ziyaret et ↗" },
  },
  method: {
    eyebrow: { en: 'How I work', tr: 'Nasıl çalışıyorum' },
    title: { en: 'AI in the loop, <em>me on the hook</em>.', tr: 'Yapay zekâ yardımcı, <em>sorumluluk bende</em>.' },
    items: [
      {
        k: { en: 'Daily', tr: 'Her gün' },
        h: { en: 'Agents speed up the routine work', tr: 'Rutin işi ajanlara bırakıyorum' },
        p: {
          en: 'Claude Code and MCP every day, multi-agent orchestration for bigger changes, local models with Ollama when they fit. Two years of building this way.',
          tr: 'Her gün Claude Code ve MCP; büyük değişikliklerde çok ajanlı orkestrasyon, uygun olduğunda Ollama ile yerel modeller. İki yıldır böyle geliştiriyorum.',
        },
      },
      {
        k: { en: 'Tooling', tr: 'Araçlar' },
        h: { en: 'I write my own skills', tr: "Kendi agent skill'lerimi yazıyorum" },
        p: {
          en: 'Agent skills that automate my own workflows, and LLM features shipped to real users.',
          tr: 'Kendi iş akışlarımı otomatikleştiren ajan becerileri yazıyorum; gerçek kullanıcılara LLM özellikleri de sundum.',
        },
      },
      {
        k: { en: 'Ownership', tr: 'Sorumluluk' },
        h: { en: 'I own what ships', tr: 'Yayına çıkanın sorumlusu benim' },
        p: {
          en: "Architecture, review and tests stay with me. Patimania's 74 end-to-end test files run against a real database before anything deploys.",
          tr: "Mimari, kod incelemesi ve testler bende. Patimania'nın 74 uçtan uca test dosyası, yayından önce gerçek bir veritabanına karşı çalışıyor.",
        },
      },
    ],
  },
  career: {
    eyebrow: { en: 'Career · timeline', tr: 'Kariyer · zaman çizelgesi' },
    title: { en: 'A pipeline from <em>games</em> to products.', tr: '<em>Oyunlardan</em> ürünlere uzanan bir hat.' },
    lede: { en: 'Each step fed the next one. Hover or tap a node for details.', tr: 'Her adım bir sonrakini besledi. Ayrıntı için bir düğüme dokun ya da üzerine gel.' },
    lanes: { en: ['Software', 'Games', 'Education'], tr: ['Yazılım', 'Oyun', 'Eğitim'] },
  },
  skills: {
    eyebrow: { en: 'Skills', tr: 'Yetenekler' },
    title: { en: 'A map of the <em>stack</em>.', tr: 'Teknolojilerin <em>haritası</em>.' },
    lede: { en: 'The tools I use every day, grouped by where they sit in a product.', tr: 'Her gün kullandığım araçlar, üründe durdukları yere göre gruplanmış hâlde.' },
  },
  evals: {
    eyebrow: { en: 'Evals', tr: 'Değerlendirme' },
    title: { en: 'Tested <em>by someone else</em>.', tr: '<em>Bağımsız</em> olarak test edildi.' },
    assessment: { en: 'Assessment', tr: 'Test' },
    percentile: { en: 'Percentile', tr: 'Yüzdelik dilim' },
    caption: {
      en: 'TestGorilla assessments, September 2026. Percentile among all test takers; the shaded band is the top 10%.',
      tr: 'TestGorilla değerlendirmeleri, Eylül 2026. Tüm katılımcılar arasındaki yüzdelik dilim; taralı bölge ilk %10.',
    },
  },
  games: {
    eyebrow: { en: 'Where I started · since 2020', tr: "Başladığım yer · 2020'den beri" },
    title: { en: 'Six years of <em>games</em>.', tr: 'Altı yıllık <em>oyun</em> deneyimi.' },
    lede: {
      en: 'B.Sc. Digital Game Design, İstinye University, 2024. Games taught me performance budgets and how software should feel.',
      tr: "İstinye Üniversitesi'nde Dijital Oyun Tasarımı okudum, 2024'te mezun oldum. Performans bütçesini ve bir yazılımın nasıl hissettirmesi gerektiğini oyunlardan öğrendim.",
    },
  },
  writing: {
    eyebrow: { en: 'Writing', tr: 'Yazılar' },
    title: { en: 'Latest posts', tr: 'Son yazılar' },
    all: { en: 'All posts →', tr: 'Tüm yazılar →' },
  },
  contact: {
    eyebrow: { en: 'Contact', tr: 'İletişim' },
    title: { en: 'Have a product <em>to build</em>?', tr: 'Birlikte bir <em>ürün</em> mü geliştirelim?' },
    copy: { en: 'Copy', tr: 'Kopyala' },
    copied: { en: 'Copied', tr: 'Kopyalandı' },
    selected: { en: 'Selected', tr: 'Seçildi' },
    info: [
      { k: { en: 'based', tr: 'konum' }, v: { en: 'Sarıyer, İstanbul · GMT+3', tr: 'Sarıyer, İstanbul · GMT+3' } },
      { k: { en: 'languages', tr: 'diller' }, v: { en: 'Turkish · English', tr: 'Türkçe · İngilizce' } },
      { k: { en: 'building', tr: 'üzerinde' }, v: { en: 'Patimania', tr: 'Patimania' } },
      { k: { en: 'stack', tr: 'teknoloji' }, v: { en: 'TypeScript · NestJS · Next.js · React Native', tr: 'TypeScript · NestJS · Next.js · React Native' } },
    ],
  },
  sources: {
    work: { en: 'Patimania', tr: 'Patimania' },
    method: { en: 'How I work', tr: 'Çalışma şekli' },
    career: { en: 'Career', tr: 'Kariyer' },
    skills: { en: 'Skills', tr: 'Yetenekler' },
    evals: { en: 'Evals', tr: 'Değerlendirme' },
    games: { en: 'Games', tr: 'Oyunlar' },
    contact: { en: 'Contact', tr: 'İletişim' },
  },
} as const;

export type SectionId = keyof typeof copy.sources;

/** Pre-written answers for the ask box. `keys` are matched as whole words (or word prefixes for keys longer than 3). */
export const QA: { id: string; keys: string[]; q: L10n; a: L10n; stats?: Record<Lang, string[]>; src: SectionId[] }[] = [
  {
    id: 'what',
    keys: ['build', 'builds', 'job', 'role', 'kim', 'yapıyor', 'iş', 'işi', 'meslek'],
    q: { en: 'What does Kaan build?', tr: 'Kaan ne yapıyor?' },
    a: {
      en: "Kaan is a full-stack engineer in Istanbul. He builds complete products on his own: the backend, the web app, the mobile app and the pipeline that deploys them. Right now that's Patimania, a pet-services marketplace where he is the only engineer.",
      tr: "Kaan, İstanbul'da yaşayan bir full-stack yazılım mühendisi. Ürünleri baştan sona kendisi kuruyor: arka uç, web uygulaması, mobil uygulama ve hepsini yayına alan altyapı. Şu sıralar tek mühendisi olduğu Patimania üzerinde çalışıyor; evcil hayvan hizmetleri için bir pazaryeri.",
    },
    src: ['work', 'career'],
  },
  {
    id: 'pm',
    keys: ['patimania', 'marketplace', 'pazaryeri', 'pet', 'payment', 'payments', 'escrow', 'ödeme', 'proje'],
    q: { en: 'Tell me about Patimania', tr: 'Patimania nedir?' },
    a: {
      en: "Patimania connects pet hotels, groomers and pet taxis with pet owners in Türkiye. Kaan designed and built all of it: NestJS with PostgreSQL and PostGIS, Next.js, and React Native for iOS and Android. It's in a soft launch at patimania.com; the escrow payment flow is built and switches on with bookings after launch.",
      tr: "Patimania, Türkiye'de pet otelleri, kuaförleri ve pet taksileri hayvan sahipleriyle buluşturuyor. Kaan sistemin tamamını tasarlayıp geliştirdi: PostgreSQL ve PostGIS ile NestJS, Next.js, iOS ve Android için React Native. Platform patimania.com'da ön yayında; Ödeme Güvencesi altyapısı hazır, rezervasyon ve ödeme lansmanla açılacak.",
    },
    stats: { en: ['2,409 commits', '68 data models', '74 E2E test files'], tr: ['2.409 commit', '68 veri modeli', '74 uçtan uca test'] },
    src: ['work'],
  },
  {
    id: 'stack',
    keys: ['stack', 'tech', 'skill', 'skills', 'language', 'languages', 'teknoloji', 'yetenek', 'dil', 'typescript', 'react', 'next.js', 'nextjs', 'nestjs', 'node', 'docker', '.net', 'c#', 'postgres', 'postgresql', 'expo', 'mobile', 'mobil', 'biliyor'],
    q: { en: "What's his stack?", tr: 'Hangi teknolojileri kullanıyor?' },
    a: {
      en: 'Mostly TypeScript: NestJS, Prisma and PostgreSQL on the backend, Next.js and React on the web, React Native with Expo on mobile, Docker and GitHub Actions to ship. He also works with C# and .NET, and spent six years in Unity before that.',
      tr: 'Ağırlıklı olarak TypeScript: arka uçta NestJS, Prisma ve PostgreSQL; webde Next.js ve React; mobilde Expo ile React Native; yayın için Docker ve GitHub Actions. C# ve .NET ile de çalışıyor; öncesinde altı yıl Unity kullandı.',
    },
    src: ['skills', 'evals'],
  },
  {
    id: 'evals',
    keys: ['test', 'tests', 'tested', 'testgorilla', 'percentile', 'score', 'assessment', 'sınav', 'puan', 'yüzdelik', 'değerlendirme'],
    q: { en: 'Has he been tested?', tr: 'Bağımsız olarak test edildi mi?' },
    a: {
      en: 'Yes. In TestGorilla assessments in September 2026 he scored in the 99th percentile for .NET, React and artificial intelligence, the 98th for Microsoft Azure and the 97th for English.',
      tr: 'Evet. Eylül 2026’daki TestGorilla değerlendirmelerinde .NET, React ve yapay zekâda 99., Microsoft Azure’da 98., İngilizcede 97. yüzdelik dilimde yer aldı.',
    },
    src: ['evals'],
  },
  {
    id: 'ai',
    keys: ['ai', 'agent', 'agents', 'claude', 'llm', 'gpt', 'yapay', 'zeka', 'zekâ', 'ajan', 'ajanlar'],
    q: { en: 'How does he use AI?', tr: 'Yapay zekâyı nasıl kullanıyor?' },
    a: {
      en: "Every day. He works with coding agents like Claude Code and MCP, writes his own agent skills, and has shipped LLM features to real users. The architecture, the review and the tests stay his responsibility: Patimania's 74 end-to-end test files run against a real database.",
      tr: "Her gün. Claude Code ve MCP gibi kodlama ajanlarıyla çalışıyor, kendi agent skill'lerini yazıyor ve gerçek kullanıcılara LLM özellikleri sundu. Mimari, kod incelemesi ve testler yine onun sorumluluğunda: Patimania'nın 74 uçtan uca test dosyası gerçek bir veritabanına karşı çalışıyor.",
    },
    src: ['method', 'work'],
  },
  {
    id: 'start',
    keys: ['start', 'started', 'game', 'games', 'unity', 'background', 'school', 'university', 'education', 'experience', 'years', 'oyun', 'oyunlar', 'başladı', 'okul', 'üniversite', 'eğitim', 'deneyim', 'tecrübe', 'yıl', 'yıllık'],
    q: { en: 'Where did he start?', tr: 'Nereden başladı?' },
    a: {
      en: 'With games. He studied Digital Game Design at İstinye University and spent six years shipping Unity games: Brick Game on Google Play, the roguelike Orbs of The Power, VR and hyper-casual titles. Then retail systems at a grocery chain, and since June 2026 full-stack work on Patimania.',
      tr: "Oyunlardan. İstinye Üniversitesi'nde Dijital Oyun Tasarımı okudu ve altı yıl boyunca Unity ile oyunlar yayımladı: Google Play'deki Brick Game, roguelike Orbs of The Power, VR ve hiper-casual oyunlar. Ardından bir market zincirinde perakende sistemleri, Haziran 2026'dan beri de Patimania'da full-stack geliştirme.",
    },
    src: ['career', 'games'],
  },
  {
    id: 'contact',
    keys: ['contact', 'email', 'mail', 'hire', 'hiring', 'reach', 'available', 'availability', 'cv', 'resume', 'linkedin', 'where', 'based', 'location', 'remote', 'iletişim', 'ulaş', 'ulaşırım', 'eposta', 'e-posta', 'adres', 'nerede', 'konum', 'özgeçmiş', 'müsait', 'uzaktan'],
    q: { en: 'How do I reach him?', tr: 'Ona nasıl ulaşırım?' },
    a: {
      en: 'Email works best: kaanekimoz@gmail.com. He is based in Sarıyer, Istanbul (GMT+3). For his CV or availability, ask him directly; LinkedIn and GitHub are linked below.',
      tr: 'En kolayı e-posta: kaanekimoz@gmail.com. Sarıyer, İstanbul’da yaşıyor (GMT+3). Özgeçmiş ya da müsaitlik için doğrudan ona yazabilirsin; LinkedIn ve GitHub aşağıda.',
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
export const CAREER: { lane: 0 | 1 | 2; lab: number; s: number; e: number; long?: boolean; sw?: boolean; title: L10n; at: string; when: L10n; d: L10n }[] = [
  { lane: 2, lab: -1, s: 2020.0, e: 2024.5, title: { en: 'B.Sc. Digital Game Design', tr: 'Dijital Oyun Tasarımı lisansı' }, at: 'İstinye University', when: { en: '2020 — 2024', tr: '2020 — 2024' },
    d: { en: 'Taught entirely in English. Where programming and engines became the focus.', tr: 'Eğitim dili tamamen İngilizceydi. Programlama ve oyun motorları burada asıl odağım oldu.' } },
  { lane: 1, lab: -1, s: 2022.25, e: 2022.5, title: { en: 'Jr. Game Developer', tr: 'Jr. Game Developer' }, at: '208 Studios', when: { en: 'Apr — Jun 2022', tr: 'Nis — Haz 2022' },
    d: { en: 'Hyper-casual games and rapid prototypes, including Draw Rush and Stack Runner.', tr: 'Draw Rush ve Stack Runner dahil hiper-casual oyunlar ve hızlı prototipler.' } },
  { lane: 1, lab: 1.7, s: 2022.0, e: 2026.85, long: true, title: { en: 'Game Developer', tr: 'Game Developer' }, at: 'Ekimoz Games', when: { en: '2022 — now', tr: '2022 — devam' },
    d: { en: 'Self-published mobile games: publishing, ad mediation and monetisation.', tr: 'Kendi yayımladığım mobil oyunlar: yayıncılık, reklam mediasyonu ve monetizasyon.' } },
  { lane: 1, lab: -1, s: 2023.33, e: 2023.75, title: { en: 'Unity XR Developer', tr: 'Unity XR Developer' }, at: 'Visionary Spaces', when: { en: 'May — Sep 2023', tr: 'May — Eyl 2023' },
    d: { en: 'VR scenes and games with physics-based mechanics.', tr: 'Fizik tabanlı mekaniklerle VR sahneleri ve oyunları.' } },
  { lane: 1, lab: -1, s: 2024.83, e: 2025.83, title: { en: 'Unity Developer', tr: 'Unity Developer' }, at: 'YTÜ DOGDOK', when: { en: 'Nov 2024 — Oct 2025', tr: 'Kas 2024 — Eki 2025' },
    d: { en: 'Core gameplay systems for mobile games in a team of three.', tr: 'Üç kişilik ekipte mobil oyunların temel oynanış sistemleri.' } },
  { lane: 0, lab: -1, sw: true, s: 2025.83, e: 2026.08, title: { en: 'Retail Technology Specialist', tr: 'Perakende Teknolojileri Uzmanı' }, at: 'Gurmenin Sepeti', when: { en: 'Nov 2025 — Jan 2026', tr: 'Kas 2025 — Oca 2026' },
    d: { en: "Took a grocery chain's POS, barcode and scale systems live across its stores, plus its online sales system.", tr: 'Market zincirinin kasa, barkod ve terazi sistemlerini mağazalarda canlıya aldım; online satış sistemini de yayına açtım.' } },
  { lane: 0, lab: 1, sw: true, s: 2026.42, e: 2026.85, title: { en: 'Full-Stack Engineer', tr: 'Full-Stack Engineer' }, at: 'Patimania', when: { en: 'Jun 2026 — now', tr: 'Haz 2026 — devam' },
    d: { en: 'Sole engineer: architecture, backend, web, mobile, design system, escrow payments and CI/CD.', tr: 'Tek mühendis: mimari, arka uç, web, mobil, tasarım sistemi, Ödeme Güvencesi altyapısı ve CI/CD.' } },
];
/** Edges between career nodes (indices into CAREER), in time order. */
export const CAREER_EDGES: [number, number][] = [[0, 1], [1, 3], [3, 4], [4, 5], [5, 6]];

export const PATIMANIA_MODULES =
  'auth users providers services service-types reservations payments disputes cart messages notifications reviews favorites search geo addresses pets media campaigns banners announcements events reports analytics support abuse jobs maintenance platform-settings admin-alerts demo-panel taxi'.split(' ');
