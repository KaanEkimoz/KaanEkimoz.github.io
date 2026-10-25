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
    title: { en: 'Full-Stack AI Developer', tr: 'Full-Stack AI Developer' },
    lede: {
      en: "Based in Istanbul, I build end-to-end products. By collaborating with AI coding agents, I manage everything from database architecture to UI design, code review, and testing.",
      tr: "İstanbul'da ürünleri baştan sona geliştiriyorum. Yapay zekâ kodlama ajanlarıyla birlikte çalışıyorum; veritabanı mimarisinden arayüz tasarımına, kod incelemesinden testlere kadar her şeyi ben yönetiyorum.",
    },
    projects: { en: 'See my projects', tr: 'Projelerime bak' },
    email: { en: 'Email me', tr: 'E-posta gönder' },
    stats: [
      { n: { en: '2,441', tr: '2.441' }, l: { en: 'commits on Patimania', tr: "Patimania commit'i" } },
      { n: { en: '315k', tr: '315 bin' }, l: { en: 'lines of TypeScript', tr: 'satır TypeScript' } },
      { n: { en: '6 yrs', tr: '6 yıl' }, l: { en: 'experience', tr: 'deneyim' } },
    ],
    note: { en: 'better code, better tomorrow :)', tr: 'daha iyi kod, daha iyi yarın :)' },
    now: { en: 'Currently working on', tr: 'Şu an üzerinde çalıştığım' },
    nowDesc: { en: 'Pet services marketplace', tr: 'Evcil hayvan hizmetleri pazaryeri' },
    nowLink: { en: 'View project', tr: 'Projeyi gör' },
    stack: { en: 'Tech stack', tr: 'Tech stack' },
    photoNote: { en: 'same guy, bigger dreams :)', tr: 'aynı Kaan, daha büyük hayaller :)' },
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
      { k: { en: 'surfaces', tr: 'platformlar' }, v: { en: 'Web (<b>128</b> routes) · iOS & Android app (<b>45</b> screens)', tr: 'Web (<b>128</b> sayfa) · iOS ve Android uygulaması (<b>45</b> ekran)' } },
      { k: { en: 'backend', tr: 'arka uç' }, v: { en: '<b>32</b> NestJS domain modules', tr: '<b>32</b> NestJS alan modülü' } },
      { k: { en: 'data', tr: 'veri' }, v: { en: '<b>68</b> tables · <b>106</b> foreign keys · <b>124</b> migrations live · PostGIS', tr: '<b>68</b> tablo · <b>106</b> yabancı anahtar · canlıda <b>124</b> migration · PostGIS' } },
      { k: { en: 'quality', tr: 'kalite' }, v: { en: '<b>76</b> end-to-end test suites · <b>3,900</b> assertions · <b>7</b> CI guard scripts', tr: '<b>76</b> uçtan uca test paketi · <b>3.900</b> doğrulama · <b>7</b> CI nöbetçisi' } },
      { k: { en: 'code', tr: 'kod' }, v: { en: '<b>315,165</b> lines of TypeScript across API, web, app and tests', tr: 'API, web, uygulama ve testlerde <b>315.165</b> satır TypeScript' } },
      { k: { en: 'history', tr: 'geçmiş' }, v: { en: '<b>2,441</b> commits in 115 days, since 2 July 2026', tr: "2 Temmuz 2026'dan bu yana 115 günde <b>2.441</b> commit" } },
    ],
    models: { en: 'Data models', tr: 'Veri modelleri' },
    modules: { en: 'Domain modules', tr: 'Alan modülleri' },
    note: {
      en: "It's in a soft launch. The storefront, search and business onboarding are open, and the businesses listed so far are demo records. Real payments stay off until the payment provider is connected; the flow itself is tested. The app is in Google Play closed testing and TestFlight external testing. Numbers measured from the repository and the live database on 24 October 2026.",
      tr: 'Proje ön yayında. Vitrin, arama ve işletme kaydı açık; şu an listelenen işletmeler demo kaydı. Ödeme sağlayıcısı bağlanana kadar gerçek ödeme kapalı, akışın kendisi test edildi. Uygulama Google Play kapalı testinde ve TestFlight dış testinde. Rakamlar 24 Ekim 2026’da kod deposundan ve canlı veritabanından ölçüldü.',
    },
    visit: { en: 'Visit patimania.com ↗', tr: "patimania.com'u ziyaret et ↗" },
    appTitle: { en: 'The mobile app', tr: 'Mobil uygulama' },
    appLede: { en: 'Eight of its 45 screens: search, hotels, a room, a groomer, taxi offers, bookings, reviews and a driver profile. The businesses are demo records.', tr: '45 ekranından sekizi: arama, oteller, oda, kuaför, taksi teklifleri, rezervasyonlar, yorumlar ve şoför profili. İşletmeler demo kaydı.' },
    archTitle: { en: 'How it fits together', tr: 'Nasıl çalışıyor' },
    arch: [
      { en: 'System architecture', tr: 'Sistem mimarisi' },
      { en: 'Booking and money flow', tr: 'Rezervasyon ve para akışı' },
      { en: 'Data model', tr: 'Veri modeli' },
    ],
    archNote: { en: 'Diagrams are in Turkish; open one to see it full size.', tr: 'Tam boyutu görmek için bir şemaya tıkla.' },
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
        en: "Patimania's code was written with Claude Code from start to finish. That's how one person shipped an API, a website, a mobile app and an admin panel in four months. The harder part was checking it: AI writes wrong code just as fast and just as confidently as right code. So the decisions stay with me, written down with their reasons (102 decision records so far), and the checks run on every change: 76 end-to-end test suites with 3,900 assertions, and 7 CI guard scripts that fail the build on mistakes that would otherwise slip through quietly.",
        tr: "Patimania'nın kodu baştan sona Claude Code ile yazıldı. Tek kişinin dört ayda API, web sitesi, mobil uygulama ve yönetim paneli çıkarabilmesinin sebebi bu. Asıl zor kısım denetimdi: yapay zekâ yanlış kodu da doğru kod kadar hızlı ve emin yazıyor. Bu yüzden kararlar bende kalıyor ve gerekçesiyle yazıya geçiyor (şu ana kadar 102 karar kaydı); kontroller de her değişiklikte çalışıyor: 3.900 doğrulamalı 76 uçtan uca test paketi ve gözden kaçabilecek hataları derleme anında yakalayan 7 CI nöbetçisi.",
      },
    ],
  },
  career: {
    title: { en: 'How I got here', tr: 'Buraya nasıl geldim' },
    lede: { en: 'Games first, then retail systems, now Patimania. Hover or tap a step for details.', tr: 'Önce oyunlar, sonra perakende sistemleri, şimdi Patimania. Ayrıntı için bir adıma dokun ya da üzerine gel.' },
    lanes: { en: ['Software', 'Games', 'Education'], tr: ['Yazılım', 'Oyun', 'Eğitim'] },
  },
  skills: {
    title: { en: 'Tech Stack', tr: 'Tech Stack' },
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
    all: { en: 'All projects', tr: 'Tüm projeler' },
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
    metaDescription: { en: 'Resume of Kaan Usta, full-stack AI developer in Istanbul.', tr: "Kaan Usta'nın özgeçmişi; İstanbul'da full-stack AI developer." },
    print: { en: 'Print / save as PDF', tr: 'Yazdır / PDF olarak kaydet' },
    summary: {
      en: "Full-stack developer in Istanbul. Since June 2026 I've been the only engineer on Patimania, a pet-services marketplace with a website, an iOS and Android app, and business and admin panels. I build with AI coding agents and check the work with tests and CI guards I wrote myself. Before that I spent six years making games in Unity.",
      tr: "İstanbul'da full-stack geliştiriciyim. Haziran 2026'dan beri web sitesi, iOS ve Android uygulaması, işletme ve yönetim panelinden oluşan bir evcil hayvan hizmetleri pazaryeri olan Patimania'nın tek mühendisiyim. Yapay zekâ kodlama ajanlarıyla geliştiriyor, işi kendi yazdığım testler ve CI nöbetçileriyle denetliyorum. Öncesinde altı yıl Unity ile oyun geliştirdim.",
    },
    experience: { en: 'Experience', tr: 'Deneyim' },
    education: { en: 'Education', tr: 'Eğitim' },
    skills: { en: 'Tech stack', tr: 'Tech stack' },
    tests: { en: 'Assessments', tr: 'Testler' },
    tests_note: { en: 'TestGorilla, September 2026 · percentile among all test takers', tr: 'TestGorilla, Eylül 2026 · tüm katılımcılar arasındaki yüzdelik dilim' },
    languages: { en: 'Languages', tr: 'Diller' },
    languagesValue: { en: 'Turkish · English', tr: 'Türkçe · İngilizce' },
    links: { en: 'Links', tr: 'Bağlantılar' },
    patimania: [
      {
        en: 'Designed and built the whole product alone: NestJS API (32 modules), Next.js website (128 routes), React Native + Expo app (45 screens), business and admin panels.',
        tr: 'Ürünün tamamını tek başıma tasarlayıp geliştirdim: NestJS API (32 modül), Next.js web sitesi (128 sayfa), React Native + Expo uygulaması (45 ekran), işletme ve yönetim panelleri.',
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
    work: { en: 'Patimania', tr: 'Patimania' },
    method: { en: 'How I use AI', tr: 'Yapay zekâ' },
    career: { en: 'Career', tr: 'Kariyer' },
    skills: { en: 'Tech Stack', tr: 'Tech Stack' },
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
    stats: { en: ['2,441 commits', '68 tables', '76 E2E test suites'], tr: ['2.441 commit', '68 tablo', '76 uçtan uca test paketi'] },
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
      en: "Every day. I work with coding agents like Claude Code and MCP, write my own agent skills, and have shipped LLM features to real users. The architecture, the review and the tests stay my responsibility: Patimania's 76 end-to-end test suites run against a real database.",
      tr: "Her gün. Claude Code ve MCP gibi kodlama ajanlarıyla çalışıyorum, kendi agent skill'lerimi yazıyorum ve gerçek kullanıcılara LLM özellikleri sundum. Mimari, kod incelemesi ve testler yine benim sorumluluğumda: Patimania'nın 76 uçtan uca test paketi gerçek bir veritabanına karşı çalışıyor.",
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
