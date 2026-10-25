# Patimania — hazır portfolyo metinleri

Hepsi doğrudan kullanılabilir. Rakamlar 24 Ekim 2026'da ölçülmüştür.

---

## Tek cümle

Pet otel, pet taksi ve pet kuaför hizmetlerini emanet (escrow) ödeme modeliyle tek
platformda toplayan, web + mobil uygulama + işletme paneli + yönetim panelinden oluşan
çok taraflı bir pazaryeri.

---

## Kısa (~50 kelime)

Patimania, evcil hayvan sahipleriyle pet otel, taksi ve kuaför işletmelerini buluşturan bir
pazaryeri. Müşteri arar, seçer ve güvenli öder; para işletmeye hizmet tamamlanana kadar
geçmez. Ürünün tamamı — Next.js vitrin, React Native uygulama, NestJS API, PostgreSQL veri
modeli, işletme ve yönetim panelleri — dört ayda sıfırdan geliştirildi ve canlıya alındı.

---

## Orta (~120 kelime)

Patimania, üç farklı pet hizmetini tek platformda toplayan çok taraflı bir pazaryeri.
Projenin belirleyici zorluğu, bu üç hizmetin gerçekten farklı zaman ve kapasite modellerine
sahip olması: otel gece bazlı ve odaya bağlı, kuaför saat bazlı ve çalışana bağlı, taksi ise
sabit fiyatı olmayan bir teklif pazarı.

Çift rezervasyon riski uygulama kodunda değil, PostgreSQL dışlama kısıtıyla
(`EXCLUDE USING gist` + `tstzrange`) veritabanı seviyesinde imkânsız kılındı. Para akışı
emanet modeliyle kurgulandı: tutar bloke edilir, hizmet tamamlanınca komisyon kesilip
işletmeye aktarılır; tüm geçişler silinemez bir deftere yazılır.

Web (Next.js 15), mobil uygulama (React Native + Expo), API (NestJS + Prisma) ve ortak iş
mantığı paketi tek monorepoda. 76 uçtan uca test paketi, 3.900 doğrulama ve 7 CI nöbetçisiyle
korunuyor.

---

## Uzun (~250 kelime)

Patimania, evcil hayvan sahipleriyle pet otel, pet taksi ve pet kuaför işletmelerini
buluşturan bir hizmet pazaryeri. Müşteri konumuna göre arar, işletmeyi ve odayı/saati seçer,
evcil hayvanını tanıtır ve güvenli öder — para işletmeye hizmet tamamlanana kadar geçmez.

En belirleyici tasarım kararı, üç hizmeti tek bir "randevu" soyutlamasına zorlamamak oldu.
Otel gece bazlı çalışır ve isimli odalara bağlıdır; kuaför saat dilimi bazlıdır ve isimli
çalışana bağlıdır; pet taksinin ise sabit fiyatı yoktur — müşteri talep açar, şoförler teklif
verir, müşteri seçer. Her biri kendi zaman ve kapasite modelini korudu.

Çift rezervasyon, platformun kabul edemeyeceği tek hata. Bu yüzden kural uygulama kodundan
alınıp veritabanına taşındı: PostgreSQL dışlama kısıtı (`EXCLUDE USING gist` + `tstzrange`)
çakışan zaman aralıklarını fiziksel olarak imkânsız kılıyor. Uygulama hata yapsa, iki istek
aynı mikrosaniyede gelse bile veritabanı ikincisini reddediyor.

Para tarafında emanet (escrow) modeli kuruldu: tutar tahsil edilir ama bloke tutulur, hizmet
tamamlandıktan sonra komisyon kesilip işletmeye aktarılır. Durum değiştiren her yazım
koşulludur; para geçişleri yalnız eklenebilir bir deftere yazılır ve silinmez.

Yönetim tarafında 30 ekranlık bir panel ve kişi başına yetki sistemi var. Yetki satırı
taşımayan bir yönetim ucu bütün personele açık olacağından, bunu derleme anında yakalayan
bir CI nöbetçisi yazıldı — benzer nöbetçiler kilit sırası, platform sapması ve derin bağlantı
pariteti için de çalışıyor.

Web (Next.js 15), mobil uygulama (React Native + Expo), API (NestJS + Prisma) ve üç yüzeyin
paylaştığı ortak iş mantığı paketi tek monorepoda. Ürünün tamamı — veri modelinden mağaza
görsellerine, sunucu kurulumundan yayın hattına kadar — tek kişi tarafından dört ayda
geliştirildi.

---

## İngilizce (~110 kelime)

Patimania is a multi-sided marketplace connecting pet owners with boarding, transport and
grooming businesses in Turkey. Customers search, book and pay through escrow — funds are held
until the service is completed, then the commission is deducted and the remainder released.

The defining challenge was that the three services have genuinely different time and capacity
models: boarding is night-based and tied to named rooms, grooming is slot-based and tied to
named staff, and pet transport has no fixed price at all — it is a bidding flow.

Double booking is prevented at the database level rather than in application code, using a
PostgreSQL exclusion constraint over `tstzrange`. Web (Next.js 15), mobile (React Native +
Expo), API (NestJS + Prisma) and the shared business-logic package live in one monorepo,
guarded by 76 end-to-end test suites.

The codebase was written throughout with Claude Code, as AI-assisted development — which is
how a one-person team shipped four surfaces in four months. The harder lesson was on the
verification side: AI writes fast, and writes wrong code just as fast. What held the project
together was the review discipline built around that speed — 76 end-to-end suites, 7 CI
guard scripts that fail the build on silent error classes, and 102 written architecture
decisions.

---

## Rol tanımı

Ürün tasarımı, veri modeli, backend, web, mobil uygulama, tasarım sistemi, sunucu kurulumu,
yayın hattı ve mağaza süreçlerinin tamamı tek kişi tarafından yürütüldü. Kod, baştan sona
Claude Code ile yapay zekâ eşliğinde yazıldı; ürün ve mimari kararlar ile doğrulama düzeni
(76 uçtan uca test paketi, 7 CI nöbetçisi, yazılı karar kaydı) geliştiriciye ait.

---

## Yapay zekâ destekli geliştirme — kısa (~60 kelime)

Projenin kodu baştan sona Claude Code ile yazıldı. Tek kişilik bir ekibin dört ayda dört ayrı
yüzeyi (API, web, mobil uygulama, yönetim paneli) üretebilmesinin sebebi bu. Asıl öğrenilen
şeyse denetim tarafı oldu: yapay zekâ hızlı yazar, yanlış yazdığında da aynı hızda yazar.
Projeyi ayakta tutan şey 76 uçtan uca test paketi, 7 CI nöbetçisi ve yazıya geçmiş 102 karar
kaydından oluşan doğrulama düzeniydi.

---

## Yapay zekâ destekli geliştirme — uzun (~160 kelime)

Projenin kodu baştan sona Claude Code ile, yapay zekâ eşliğinde yazıldı. Bu bir dipnot değil,
çalışma biçiminin kendisi: tek kişilik bir ekibin dört ayda API, web, mobil uygulama ve
yönetim panelini bu ölçekte üretebilmesinin sebebi bu.

Ama projenin asıl öğrettiği şey denetim tarafıydı. Yapay zekâ hızlı yazar; yanlış yazdığında
da aynı hızda ve aynı güvenle yazar. Bu yüzden dört kural kuruldu:

1. **Kararlar insanın.** Ürün kapsamı, veri modeli, mimari seçimler ve "bunu yapmıyoruz"
   demek insan kararı olarak kaldı, gerekçesiyle yazıya geçti — 102 karar kaydı.
2. **Ölçülmeyen iddia kabul edilmiyor.** "Çalışıyor" yerine çalıştığının kanıtı isteniyor.
3. **Sessiz hata sınıfları makineye devredildi.** Yetkisiz bir yönetim ucu, ters kilit
   sırası, iOS/Android sapması — 7 CI nöbetçisi bunları derleme anında yakalıyor.
4. **Bağımsız denetim turu.** Aşama sonlarında, kodu yazan bağlamdan ayrı bir gözden
   geçirme koşuluyor.

76 uçtan uca test paketi ve 3.900 doğrulama bu düzenin sonucu: hızlı üretilen kodun
güvenilir olması, üretim hızıyla orantılı bir doğrulama düzeniyle mümkün.

---

## Öne çıkarılacak teknik başlıklar

- Veritabanı seviyesinde çakışma engelleme (`EXCLUDE` kısıtı + zaman aralığı tipi)
- Emanet (escrow) ödeme modeli ve yalnız-eklenebilir para defteri
- Politikanın rezervasyona dondurulması (ayar değişse de geçmiş rezervasyonun kuralı değişmez)
- Kişi başına yetki sistemi + yetkisiz ucu derleme anında yakalayan CI nöbetçisi
- Üç yüzeyde (web, app, API) paylaşılan tek iş mantığı paketi
- Coğrafi arama (PostGIS) + harita sağlayıcısı yedeklemeli adres çözümleme
- İki aşamalı adres girişi (önce harita noktası, sonra kapı ayrıntısı)
- OTA güncellemeli mobil yayın hattı; staging'de doğrulanan imajın prod'a terfisi
- 76 uçtan uca test paketi / 3.900 doğrulama
- Yapay zekâ destekli geliştirme (Claude Code) + hıza karşı kurulan doğrulama düzeni
