---
title: "BatteryHealth"
platform: PC
genres: ["macOS uygulaması", "Araç"]
year: 2026
duration: "Kasım 2026"
role: "Geliştirici"
description: "Apple silicon MacBook'ların şarjını senin belirlediğin bir sınırda, örneğin %80'de durduran bir menü çubuğu uygulaması; pil böylece daha yavaş yıpranıyor. GitHub'da ücretsiz, imzalı ve Apple onaylı, kendini güncelliyor."
techStack:
  - "Swift"
  - "SwiftUI"
  - "Swift Package Manager"
  - "IOKit / SMC"
  - "LaunchDaemon + XPC"
  - "Sparkle"
  - "Developer ID + notarization"
links:
  github: "https://github.com/KaanEkimoz/BatteryHealth"
category: product
published: false
coverImage: "../../assets/projects/battery-health/cover-wide.webp"
coverSquare: "../../assets/projects/battery-health/cover-square.webp"
gallery:
  - "../../assets/projects/battery-health/gallery/01-panel-tr.png"
  - "../../assets/projects/battery-health/gallery/02-panel-dark-tr.png"
  - "../../assets/projects/battery-health/gallery/03-settings-tr.png"
  - "../../assets/projects/battery-health/gallery/04-settings-dark-tr.png"
order: 7
lang: tr
---

BatteryHealth, Apple silicon MacBook'lar için küçük bir menü çubuğu uygulaması. Şarjı senin seçtiğin sınırda (normalde %80) durduruyor ve Mac şarja takılı çalışırken pili orada tutuyor. Lityum piller saatlerce %100'de kalınca daha hızlı yıpranıyor; masada sürekli şarjda duran dizüstülerin çoğunun başına gelen de bu. Uygulamayı kendi M4 MacBook Air'im için yaptım.

Sınırı, pili birkaç saniyede bir kontrol eden uygulama korumuyor. Küçük bir arka plan servisi sınırı SMC üzerinden doğrudan pilin donanım yazılımına yazıyor; uygulama da bu servisle XPC üzerinden konuşuyor. Sınırı donanım tuttuğu için Mac uykudayken ya da uygulama kapalıyken de çalışıyor. Kurulumda şifre yalnızca bir kez soruluyor.

Uygulama ücretsiz, kaynak kodu da GitHub'da. İndirilen DMG benim Developer ID'mle imzalı ve Apple tarafından onaylı (notarized); bu yüzden uyarısız açılıyor, kimsenin Xcode kurmasına gerek kalmıyor. Güncellemeler, EdDSA anahtarıyla imzalanmış bir akıştan Sparkle ile geliyor. Uygulama Mac'in diline uyuyor; İngilizce, Türkçe ve İspanyolca destekliyor.

Rakamlarla (18 Kasım 2026): iki günde 1.0'dan 1.2'ye üç sürüm, 17 commit ve yaklaşık 2.900 satır Swift. Kod Claude Code ile yazıldı; kararlar, gerçek cihazdaki testler ve yayın süreci bana ait.

## Panelde neler var

- **Şarj sınırı.** Bir kaydırıcı ve pil sınırda beklerken Mac'i doğrudan adaptörden besleyen "Sabit tut" modu.
- **Güç Akışı.** Adaptörden Mac'e ve pile giden gücü anlık olarak watt cinsinden gösteriyor; pilin devre dışı kaldığı da buradan görülüyor.
- **Hızlı işlemler.** Tam şarj gereken günler için bir kezlik %100'e doldurma, sınıra kadar boşaltma ve pil 35, 38 ya da 40 °C'nin üstüne çıkınca şarjı durduran Isı Koruması.
- **Düzenlenebilir göstergeler.** Kapasite, döngü, sağlık, sıcaklık, açık kalma süresi ve kalan süre ayrı kutularda. Kutular gizlenebiliyor, geri eklenebiliyor ve sürükleyerek yer değiştirebiliyor.
- **Küçük ekstralar.** MagSafe ışığı pil sınırda beklerken yeşil, şarj seviyesi değişirken turuncu yanıyor. Mac üç gün kapanmadan açık kalınca yeniden başlatmayı öneren bir bildirim geliyor.

## Gurur duyduğum kısımlar

- **Menü çubuğu gerçek sınırı gösteriyor.** Donanıma düz bir sınır yazınca macOS %80 yerine %79 gösterebiliyor. "Sabit tut" modu şarj aralığını buna göre ayarlıyor, böylece menü çubuğundaki yüzde senin seçtiğin sınırla aynı oluyor.
- **Güncelleme gerçekten denendi.** Mac'imdeki 1.1 sürümü GitHub'da 1.2'yi buldu, imzasını doğruladı ve kendini güncelledi.
- **Menü çubuğu panelinde sürükle-bırak.** SwiftUI'ın hazır sürükle-bırak özelliği panelin içinde çalışmadı. Kutular bu yüzden basit bir sürükleme hareketiyle, imlecin konumundan yeni yerlerini hesaplayarak yer değiştiriyor.
- **Doğal okunan çeviriler.** Yüzdeler ve süreler uygulamanın diline göre yazılıyor; bölgesi Türkiye olan bir Mac'te bile İngilizce panel "80%" gösteriyor, Türkçe panel "%80".
