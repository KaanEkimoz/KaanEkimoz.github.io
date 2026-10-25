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
    title: { en: 'I build web and mobile products.', tr: 'Web ve mobil ürünler geliştiriyorum.' },
    lede: {
      en: "Hi, I'm Kaan, a full-stack engineer in Istanbul. Since June 2026 I've been building Patimania on my own: the NestJS backend, the Next.js site, the React Native app and the servers they run on. Before that I spent six years making games in Unity.",
      tr: "Merhaba, ben Kaan; İstanbul'da full-stack yazılım mühendisiyim. Haziran 2026'dan beri Patimania'yı tek başıma geliştiriyorum: NestJS arka ucu, Next.js sitesi, React Native uygulaması ve hepsinin çalıştığı sunucular. Öncesinde altı yıl Unity ile oyun yaptım.",
    },
    email: { en: 'Email me', tr: 'E-posta gönder' },
    seeWork: { en: 'See Patimania', tr: "Patimania'ya bak" },
  },
  ask: {
    title: { en: 'About me', tr: 'Hakkımda' },
    placeholder: { en: 'Ask about my work…', tr: 'İşlerim hakkında bir şey sor…' },
    inputLabel: { en: 'Ask me a question', tr: 'Bana bir soru sor' },
    send: { en: 'Send', tr: 'Gönder' },
    fallback: {
      en: "That one isn't covered here. Try one of the questions above, or email me at kaanekimoz@gmail.com.",
      tr: 'Bu soru burada yok. Yukarıdaki sorulardan birini dene ya da bana yaz: kaanekimoz@gmail.com.',
    },
  },
  work: {
    title: { en: 'Patimania', tr: 'Patimania' },
    lede: {
      en: "A marketplace that connects pet hotels, groomers and pet taxis with pet owners across Türkiye. I'm the only engineer on it, so every screen and every table you see here is mine.",
      tr: "Türkiye'de pet otellerini, kuaförleri ve pet taksileri hayvan sahipleriyle buluşturan bir pazaryeri. Projenin tek mühendisi benim; burada gördüğün her ekranı ve her tabloyu ben yazdım.",
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
  notes: {
    title: { en: 'Notes from the build', tr: 'Yapım notları' },
    lede: { en: 'A few problems I ran into on Patimania, and what I did about them.', tr: "Patimania'da karşılaştığım birkaç sorun ve onları nasıl çözdüğüm." },
    items: [
      {
        h: { en: 'Two customers, one room', tr: 'Aynı oda, iki müşteri' },
        p: {
          en: "Two people could try to book the same room at the same moment. I didn't leave that to the app logic; I made it impossible in the database. A PostgreSQL EXCLUDE constraint rejects overlapping bookings, so only one of the two writes goes through.",
          tr: 'İki kişi aynı odayı aynı anda ayırtmaya çalışabiliyordu. Bunu uygulama mantığına bırakmadım, veritabanında imkânsız hâle getirdim: PostgreSQL’deki bir EXCLUDE kısıtı çakışan rezervasyonları reddediyor, iki yazımdan yalnızca biri geçiyor.',
        },
      },
      {
        h: { en: 'Approved twice', tr: 'İki kez onaylanan işlem' },
        p: {
          en: "I tested what happens when two people press approve at the same time. Both requests succeeded and two accepted rows appeared. Now every status change only runs if the row is still in the state it expects, so the second request fails.",
          tr: 'Aynı anda iki kişinin “onayla”ya basmasını denedim: iki istek de başarılı döndü, iki ayrı kabul kaydı oluştu. Artık her durum değişikliği yalnızca kayıt hâlâ beklenen durumdaysa çalışıyor; ikinci istek reddediliyor.',
        },
      },
      {
        h: { en: 'A permission I forgot', tr: 'Unutulan bir yetki' },
        p: {
          en: 'In the admin panel, forgetting a permission entry opened an endpoint instead of closing it. I added a CI check that fails the build when a new admin endpoint has no permission. It caught a real hole: support staff could close their own customers’ complaints.',
          tr: 'Yönetim panelinde bir yetki satırını unutmak, ilgili ucu kapatmak yerine açıyordu. Yetkisi tanımlanmamış yeni bir uç eklenirse derlemeyi durduran bir CI kontrolü yazdım. Kontrol gerçek bir açık yakaladı: destek personeli kendi müşterilerinin şikâyetlerini tek başına kapatabiliyordu.',
        },
      },
      {
        h: { en: 'Quietly broken on iOS', tr: "iOS'ta sessiz bir arıza" },
        p: {
          en: 'A deep link stopped working on iOS while the plain smoke tests stayed green. What caught it was a check I had written to compare app.json, the iOS association file and the route table.',
          tr: 'iOS’ta bir derin bağlantı çalışmayı bıraktı ama düz duman testleri yeşil kaldı. Sorunu, app.json, iOS ilişkilendirme dosyası ve rota tablosunu karşılaştırmak için yazdığım kontrol yakaladı.',
        },
      },
    ],
  },
  method: {
    title: { en: 'How I use AI', tr: 'Yapay zekâyı nasıl kullanıyorum' },
    body: [
      {
        en: "I've been building with AI coding agents for two years. Every day I use Claude Code with MCP, split bigger changes across several agents, and run local models with Ollama when they're enough. I write my own agent skills for the parts of my work I keep repeating, and I've shipped LLM features to real users.",
        tr: "İki yıldır yapay zekâ kodlama ajanlarıyla çalışıyorum. Her gün MCP ile Claude Code kullanıyorum; büyük değişiklikleri birkaç ajana bölüyorum, yeterli olduğunda Ollama ile yerel modeller çalıştırıyorum. Sık tekrarladığım işler için kendi agent skill'lerimi yazıyorum, gerçek kullanıcılara LLM özellikleri de sundum.",
      },
      {
        en: "The agents write a lot of the routine code. The design, the review and the tests stay with me: Patimania's 74 end-to-end test files run against a real database before anything ships. If something breaks, it's on me.",
        tr: "Rutin kodun büyük kısmını ajanlar yazıyor. Tasarım, kod incelemesi ve testler bende: Patimania'nın 74 uçtan uca test dosyası, yayına çıkmadan önce gerçek bir veritabanına karşı çalışıyor. Bir şey bozulursa sorumlusu benim.",
      },
    ],
  },
  career: {
    title: { en: 'How I got here', tr: 'Buraya nasıl geldim' },
    lede: { en: 'Games first, then retail systems, now Patimania. Hover or tap a step for details.', tr: 'Önce oyunlar, sonra perakende sistemleri, şimdi Patimania. Ayrıntı için bir adıma dokun ya da üzerine gel.' },
    lanes: { en: ['Software', 'Games', 'Education'], tr: ['Yazılım', 'Oyun', 'Eğitim'] },
  },
  skills: {
    title: { en: 'What I work with', tr: 'Neyle çalışıyorum' },
    lede: { en: 'Grouped by where each tool sits in a product.', tr: 'Her araç, üründe durduğu yere göre gruplandı.' },
  },
  evals: {
    title: { en: 'Test results', tr: 'Test sonuçları' },
    assessment: { en: 'Assessment', tr: 'Test' },
    percentile: { en: 'Percentile', tr: 'Yüzdelik dilim' },
    caption: {
      en: 'TestGorilla assessments, September 2026. Percentile among all test takers; the shaded band is the top 10%.',
      tr: 'TestGorilla değerlendirmeleri, Eylül 2026. Tüm katılımcılar arasındaki yüzdelik dilim; taralı bölge ilk %10.',
    },
  },
  games: {
    title: { en: 'Where I started', tr: 'Başladığım yer' },
    lede: {
      en: "I studied Digital Game Design at İstinye University (2020–2024) and made games for six years. That's where I learned to watch performance closely and to care how an app feels in the hand.",
      tr: "İstinye Üniversitesi'nde Dijital Oyun Tasarımı okudum (2020–2024) ve altı yıl oyun geliştirdim. Performansı yakından takip etmeyi ve bir uygulamanın elde nasıl hissettirdiğini önemsemeyi orada öğrendim.",
    },
  },
  writing: {
    title: { en: 'Writing', tr: 'Yazılar' },
    all: { en: 'All posts →', tr: 'Tüm yazılar →' },
  },
  contact: {
    title: { en: 'Get in touch', tr: 'Bana yaz' },
    lede: { en: 'Email is the easiest way to reach me.', tr: 'Bana ulaşmanın en kolay yolu e-posta.' },
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
    method: { en: 'How I use AI', tr: 'Yapay zekâ' },
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
    keys: ['build', 'builds', 'do', 'job', 'role', 'kim', 'kimsin', 'yapıyor', 'iş', 'işi', 'işin', 'meslek'],
    q: { en: 'What do I do?', tr: 'Ne yapıyorum?' },
    a: {
      en: "I'm a full-stack engineer in Istanbul. I build complete products on my own: the backend, the web app, the mobile app and the pipeline that deploys them. Right now that's Patimania, a pet-services marketplace where I'm the only engineer.",
      tr: "İstanbul'da full-stack yazılım mühendisiyim. Ürünleri baştan sona kendim kuruyorum: arka uç, web uygulaması, mobil uygulama ve hepsini yayına alan altyapı. Şu sıralar tek mühendisi olduğum Patimania üzerinde çalışıyorum; evcil hayvan hizmetleri için bir pazaryeri.",
    },
    src: ['work', 'career'],
  },
  {
    id: 'pm',
    keys: ['patimania', 'marketplace', 'pazaryeri', 'pet', 'payment', 'payments', 'escrow', 'ödeme', 'proje'],
    q: { en: 'What is Patimania?', tr: 'Patimania nedir?' },
    a: {
      en: "Patimania connects pet hotels, groomers and pet taxis with pet owners in Türkiye. I designed and built all of it: NestJS with PostgreSQL and PostGIS, Next.js, and React Native for iOS and Android. It's in a soft launch at patimania.com; the escrow payment flow is built and switches on with bookings after launch.",
      tr: "Patimania, Türkiye'de pet otellerini, kuaförleri ve pet taksileri hayvan sahipleriyle buluşturuyor. Sistemin tamamını ben tasarlayıp geliştirdim: PostgreSQL ve PostGIS ile NestJS, Next.js, iOS ve Android için React Native. Platform patimania.com'da ön yayında; Ödeme Güvencesi altyapısı hazır, rezervasyon ve ödeme lansmanla açılacak.",
    },
    stats: { en: ['2,409 commits', '68 data models', '74 E2E test files'], tr: ['2.409 commit', '68 veri modeli', '74 uçtan uca test'] },
    src: ['work'],
  },
  {
    id: 'stack',
    keys: ['stack', 'tech', 'skill', 'skills', 'language', 'languages', 'teknoloji', 'yetenek', 'dil', 'typescript', 'react', 'next.js', 'nextjs', 'nestjs', 'node', 'docker', '.net', 'c#', 'postgres', 'postgresql', 'expo', 'mobile', 'mobil', 'biliyor'],
    q: { en: "What's my stack?", tr: 'Hangi teknolojileri kullanıyorum?' },
    a: {
      en: 'Mostly TypeScript: NestJS, Prisma and PostgreSQL on the backend, Next.js and React on the web, React Native with Expo on mobile, Docker and GitHub Actions to ship. I also work with C# and .NET, and spent six years in Unity before that.',
      tr: 'Ağırlıklı olarak TypeScript: arka uçta NestJS, Prisma ve PostgreSQL; webde Next.js ve React; mobilde Expo ile React Native; yayın için Docker ve GitHub Actions. C# ve .NET ile de çalışıyorum; öncesinde altı yıl Unity kullandım.',
    },
    src: ['skills', 'evals'],
  },
  {
    id: 'evals',
    keys: ['test', 'tests', 'tested', 'testgorilla', 'percentile', 'score', 'assessment', 'sınav', 'puan', 'yüzdelik', 'değerlendirme'],
    q: { en: 'My test results', tr: 'Test sonuçlarım' },
    a: {
      en: 'In TestGorilla assessments in September 2026 I scored in the 99th percentile for .NET, React and artificial intelligence, the 98th for Microsoft Azure and the 97th for English.',
      tr: 'Eylül 2026’daki TestGorilla değerlendirmelerinde .NET, React ve yapay zekâda 99., Microsoft Azure’da 98., İngilizcede 97. yüzdelik dilimde yer aldım.',
    },
    src: ['evals'],
  },
  {
    id: 'ai',
    keys: ['ai', 'agent', 'agents', 'claude', 'llm', 'gpt', 'yapay', 'zeka', 'zekâ', 'ajan', 'ajanlar'],
    q: { en: 'How do I use AI?', tr: 'Yapay zekâyı nasıl kullanıyorum?' },
    a: {
      en: "Every day. I work with coding agents like Claude Code and MCP, write my own agent skills, and have shipped LLM features to real users. The architecture, the review and the tests stay my responsibility: Patimania's 74 end-to-end test files run against a real database.",
      tr: "Her gün. Claude Code ve MCP gibi kodlama ajanlarıyla çalışıyorum, kendi agent skill'lerimi yazıyorum ve gerçek kullanıcılara LLM özellikleri sundum. Mimari, kod incelemesi ve testler yine benim sorumluluğumda: Patimania'nın 74 uçtan uca test dosyası gerçek bir veritabanına karşı çalışıyor.",
    },
    src: ['method', 'work'],
  },
  {
    id: 'start',
    keys: ['start', 'started', 'game', 'games', 'unity', 'background', 'school', 'university', 'education', 'experience', 'years', 'oyun', 'oyunlar', 'başladı', 'okul', 'üniversite', 'eğitim', 'deneyim', 'tecrübe', 'yıl', 'yıllık'],
    q: { en: 'Where did I start?', tr: 'Nereden başladım?' },
    a: {
      en: 'With games. I studied Digital Game Design at İstinye University and spent six years shipping Unity games: Brick Game on Google Play, the roguelike Orbs of The Power, VR and hyper-casual titles. Then retail systems at a grocery chain, and since June 2026 full-stack work on Patimania.',
      tr: "Oyunlardan. İstinye Üniversitesi'nde Dijital Oyun Tasarımı okudum ve altı yıl boyunca Unity ile oyunlar yayımladım: Google Play'deki Brick Game, roguelike Orbs of The Power, VR ve hiper-casual oyunlar. Ardından bir market zincirinde perakende sistemleri üzerinde çalıştım; Haziran 2026'dan beri de Patimania'yı geliştiriyorum.",
    },
    src: ['career', 'games'],
  },
  {
    id: 'contact',
    keys: ['contact', 'email', 'mail', 'hire', 'hiring', 'reach', 'available', 'availability', 'cv', 'resume', 'linkedin', 'where', 'based', 'location', 'remote', 'iletişim', 'ulaş', 'ulaşırım', 'eposta', 'e-posta', 'adres', 'nerede', 'konum', 'özgeçmiş', 'müsait', 'uzaktan'],
    q: { en: 'How to reach me', tr: 'Bana nasıl ulaşırsın?' },
    a: {
      en: "Email works best: kaanekimoz@gmail.com. I'm based in Sarıyer, Istanbul (GMT+3). For my CV or availability, just ask; LinkedIn and GitHub are linked below.",
      tr: 'En kolayı e-posta: kaanekimoz@gmail.com. Sarıyer, İstanbul’da yaşıyorum (GMT+3). Özgeçmiş ya da müsaitlik için doğrudan bana yazabilirsin; LinkedIn ve GitHub aşağıda.',
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
