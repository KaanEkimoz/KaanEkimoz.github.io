---
title: "Draw Rush"
platform: Mobile
genres: ["Hiper-casual", "Bulmaca"]
year: 2026
duration: "2 haftalık prototip (2022), 6 aylık yeniden yazım (Mayıs–Kasım 2026)"
role: "Geliştirici: kod, tasarım, arayüz, mağaza yayını (2022 prototipinde bir tasarımcı ve bir 3D sanatçıyla)"
description: "Küçük bir kalemin masa canavarlarından kaçarak şekil çizdiği tek parmak oyunu. 208 Studios'taki 2022 prototipini 2026'da baştan yazıp yayınladım."
techStack: ["Unity 6 LTS", "C#", "URP", "Cinemachine", "AI Navigation", "Input System", "LevelPlay (ironSource)", "Unity Test Framework"]
links:
  googlePlay: "https://play.google.com/store/apps/details?id=com.ekimozgames.drawrush"
  github: "https://github.com/KaanEkimoz/DrawRush-HyperCasual"
coverImage: "../../assets/projects/draw-rush/cover-wide.webp"
coverSquare: "../../assets/projects/draw-rush/cover-square.webp"
gallery:
  - "../../assets/projects/draw-rush/gallery/00-key-art.webp"
  - "../../assets/projects/draw-rush/gallery/01-gameplay-draw.webp"
  - "../../assets/projects/draw-rush/gallery/02-desk-monsters.webp"
  - "../../assets/projects/draw-rush/gallery/03-power-ups.webp"
  - "../../assets/projects/draw-rush/gallery/04-shop.webp"
  - "../../assets/projects/draw-rush/gallery/05-collection.webp"
  - "../../assets/projects/draw-rush/gallery/06-showroom-shop.webp"
  - "../../assets/projects/draw-rush/gallery/07-settings-languages.webp"
  - "../../assets/projects/draw-rush/gallery/08-skins.webp"
  - "../../assets/projects/draw-rush/cover.png"
  - "../../assets/projects/draw-rush/gallery/01.png"
  - "../../assets/projects/draw-rush/gallery/02.png"
youtubeId: "k2DOHk8m15U"
published: true
order: 4
lang: tr
---

Dev bir masada küçücük bir kalemsin. Noktalı çizginin üstünden koşarak şekli çiziyorsun; zımbalar, makaslar, silgiler ve yapıştırıcılar da sayfada peşinden koşuyor.

Draw Rush, 2022'de 208 Studios'ta iki haftalık bir hiper-casual prototip olarak başladı. 2026'da oyunu devraldım ve Ekimoz Games adıyla baştan, eksiksiz bir oyun olarak yeniden yaptım. Şu an Google Play'de yayında (v1.6.0), App Store'da incelemede. 55 level, 9 kalem skin'i, geliştirmeli bir mağaza ve Dash yeteneği var; oyun İngilizce, Türkçe ve İspanyolca.

## Teknik öne çıkanlar

- **Çizim sistemi.** Çizim kenar kenar ilerliyor; şeklin kapandığı kontrol ediliyor ve kenar %99'da kendini tamamlıyor. Editördeki otomatik oyun botu her leveli baştan sona oynayıp hepsinin geçilebildiğini kanıtlıyor.
- **Level yapısı.** Bütün leveller tek sahnede; level yöneticisi aradaki durumu sıfırlıyor. Sabit level sırası ve zorluk eğrisi, düşmanları ve tuzakları birer birer tanıtıyor.
- **Mimari.** Singleton yok: ScriptableObject ayarları, küçük bir servis kaydı, özellik klasörleri ve asmdef'ler. 124 EditMode testi kayıt verisini ve ilerlemeyi koruyor.
- **Daha küçük indirme.** Build boyutu çalışmasıyla AAB 77 MB'tan 55 MB'a, arm64 indirme boyutu 52,6 MB'tan 38,4 MB'a indi. Play'de hiçbir cihaz desteği kaybedilmedi.
- **Diller.** Hafif bir yerelleştirme katmanı ve TextMeshPro yedek fontları sayesinde Türkçe ve İspanyolca karakterler tüm arayüz fontlarında doğru görünüyor.
- **Ekonomi ve ilerleme.** Coin ödüllerine bağlı 3 yıldızlı puanlama. Skin mağazası bir showroom gibi çalışıyor: skin'ler sırayla açılıyor, bir rozet de alınabilecek geliştirme sayısını gösteriyor.
- **Gelir.** LevelPlay üzerinden ödüllü ve geçiş reklamları; izin akışı ve oyunun kendi [gizlilik](/drawrush-privacy/) ve [kullanım şartları](/drawrush-terms/) sayfaları var.

## Süreç notları

- Elle çizilmiş defter görünümü. Masa eşyaları Meshy AI ile 3D model olarak üretildi ve her biri yaklaşık 1,2k üçgene indirildi.
- Sürümler elle Console'a değil, servis hesabıyla çalışan bir yükleme betiğiyle Google Play Developer API üzerinden yükleniyor.
- Açılış animasyonu kodla çiziliyor: kalem logonun çizgisini çiziyor, ardından harfler beliriyor.
- Yapay zekâ destekli bir akışla geliştirdim (Unity Editör'ü MCP ile süren Claude Code); oynanıştaki her değişikliği cihazda kendim kontrol ettim.
