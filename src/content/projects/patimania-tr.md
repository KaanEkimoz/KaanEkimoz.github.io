---
title: "Patimania"
platform: Web
genres: ["Marketplace", "SaaS", "Pet-tech"]
year: 2026
duration: "Haziran 2026'dan beri"
role: "Full-stack geliştirici"
description: "Pet otel, kuaför ve taksi hizmetlerini tek platformda toplayan, Ödeme Güvenceli çok taraflı bir pazaryeri. Web + iOS + Android; ön yayında."
techStack:
  - "Next.js 15"
  - "React 19"
  - "NestJS"
  - "TypeScript"
  - "PostgreSQL + PostGIS"
  - "Prisma"
  - "React Native + Expo"
  - "iyzico (Ödeme Güvencesi)"
  - "MinIO S3"
  - "Docker"
  - "Nginx"
links:
  website: "https://patimania.com"
featured: true
category: product
published: false
coverImage: "../../assets/projects/patimania/cover-wide.webp"
coverSquare: "../../assets/projects/patimania/cover-square.webp"
gallery:
  - "../../assets/projects/patimania/gallery/01-home.png"
  - "../../assets/projects/patimania/gallery/02-search.png"
  - "../../assets/projects/patimania/gallery/03-business-profile.png"
  - "../../assets/projects/patimania/app/01-home.jpg"
  - "../../assets/projects/patimania/app/02-hotels.jpg"
  - "../../assets/projects/patimania/app/03-room.jpg"
  - "../../assets/projects/patimania/app/04-groomer.jpg"
  - "../../assets/projects/patimania/app/05-taxi-offers.jpg"
  - "../../assets/projects/patimania/app/06-booking.jpg"
  - "../../assets/projects/patimania/app/07-reviews.jpg"
  - "../../assets/projects/patimania/app/08-driver.jpg"
  - "../../assets/projects/patimania/gallery/04-business-panel.png"
  - "../../assets/projects/patimania/gallery/05-room-calendar.png"
  - "../../assets/projects/patimania/gallery/06-admin-stats.png"
  - "../../assets/projects/patimania/gallery/07-mobile-home.png"
  - "../../assets/projects/patimania/gallery/08-mobile-business.png"
  - "../../assets/projects/patimania/arch/01-system.png"
  - "../../assets/projects/patimania/arch/02-booking-money.png"
  - "../../assets/projects/patimania/arch/03-data-model.png"
order: 0
lang: tr
---

Patimania; pet otel, kuaför ve pet taksi hizmetlerini bir araya getiren bir pazaryeri. Müşteri ödemeyi baştan yapıyor, para hizmet tamamlanana kadar iyzico'da Ödeme Güvencesi ile bekliyor, sonra işletmeye aktarılıyor. Veri modelinden backend'e, web'den mobil uygulamaya ve sunucu tarafına kadar her katmanında çalışıyorum. İlk commit 2 Temmuz 2026'da atıldı.

Şu an patimania.com'da ön yayında. Vitrin, arama ve işletme kaydı açık; şimdilik listelenen işletmeler demo kayıt. Ödeme sağlayıcısı bağlanana kadar gerçek ödeme kapalı, akışın kendisi test edildi. Uygulama Google Play kapalı testinde ve TestFlight dış testinde.

Rakamlarla (24 Ekim 2026): 115 günde 2.441 commit, 315.165 satır TypeScript, 68 tablo, 45 uygulama ekranı ve 76 uçtan uca test paketi. Kod Claude Code ile yazıldı; kararlar, kod incelemesi ve bunları denetleyen düzen bana ait.

## Gurur duyduğum yerler

- **Çift rezervasyon olmuyor.** PostgreSQL `EXCLUDE` kısıtı aynı oda ya da araç için çakışan rezervasyonları reddediyor; uygulama mantığı hata yapsa bile.
- **Para hesabı sunucuda.** Fiyat ve komisyon sunucuda hesaplanıyor, çift girişli bir defterde tutuluyor.
- **Durum değişiklikleri yarışa dayanıklı.** Onay, iptal ve iade koşullu güncellemeyle yapılıyor; aynı anda gelen iki istek ikisi birden başarılı olamıyor.
- **CI nöbetçileri.** Yetki satırı olmayan yeni bir yönetim ucu eklenirse derleme duruyor; bu kontrol gerçek bir yetki açığını yakaladı.
