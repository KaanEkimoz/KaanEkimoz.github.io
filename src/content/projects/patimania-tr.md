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
coverImage: "../../assets/projects/patimania/cover.jpg"
gallery:
  - "../../assets/projects/patimania/gallery/01-home.png"
  - "../../assets/projects/patimania/gallery/02-search.png"
  - "../../assets/projects/patimania/gallery/03-business-profile.png"
  - "../../assets/projects/patimania/gallery/04-business-panel.png"
  - "../../assets/projects/patimania/gallery/05-room-calendar.png"
  - "../../assets/projects/patimania/gallery/06-admin-stats.png"
  - "../../assets/projects/patimania/gallery/07-mobile-home.png"
  - "../../assets/projects/patimania/gallery/08-mobile-business.png"
order: 0
lang: tr
---

Patimania, pet otel · kuaför · taksi hizmetlerini tek platformda toplayan, ödeme güvenceli çok taraflı bir pazaryeri. Müşteri güvenli ödeme yapıyor, para hizmet tamamlanana kadar iyzico Alt Üye İşyeri modelinde güvencede bekliyor; sonra komisyon kesilerek işletmeye aktarılıyor.

Projeyi sıfırdan geliştiriyorum; veri modelinden altyapıya, backend'den mobil uygulamaya kadar her katman bende. İlk commit 2 Temmuz 2026'da atıldı.

Şu an patimania.com'da ön yayında: vitrin, arama ve işletme kaydı açık; şimdilik listelenen işletmeler demo kaydı. Ödeme sağlayıcısı bağlanana kadar gerçek ödeme kapalı, akışın kendisi test edildi. Mobil uygulama Google Play kapalı testinde ve TestFlight dış testinde.

Rakamlarla (24 Ekim 2026'da ölçüldü): 115 günde 2.441 commit, 315.165 satır TypeScript, 32 NestJS modülü, 106 yabancı anahtarlı 68 tablo, canlıda 124 migration, 128 web sayfası, 45 uygulama ekranı, 3.900 doğrulamalı 76 uçtan uca test paketi, 7 CI nöbetçisi ve yazıya geçmiş 102 karar kaydı.

Kod baştan sona Claude Code ile yazıldı. Kararlar, kod incelemesi ve bunları denetleyen düzen bana ait.

## Gurur duyduğum yerler

- **Çift rezervasyon veritabanı düzeyinde imkânsız.** `btree_gist` üzerinde `(resource_id, tstzrange)` için PostgreSQL `EXCLUDE` kısıtı, aynı odaya veya araca çakışan iki zaman aralığını reddediyor. İki müşteri aynı slot için yarışırsa veritabanı tarafında biri kazanıyor — uygulama mantığı yanılsa bile çift rezervasyon oluşamıyor. Üstünde ödeme tamamlanana kadar tutan 5–10 dakikalık yumuşak tutma (soft-hold) katmanı var.
- **Para tamamen sunucu otoritesinde, arkasında çift girişli defter var.** Tutar, komisyon ve serbest bırakma kuralları sunucuda; istemci sadece teklif verebiliyor. Ödeme Güvencesi akışının arkasında komisyon geliri, işletme alacağı ve KDV bacaklarını tutan, her yazımda borç = alacak korunan bir muhasebe defteri var. Para alanları `numeric`, `float` değil.
- **Durum değiştiren yazımlar koşullu.** Onay, iptal, iade işlemleri `UPDATE ... WHERE status = 'pending'` şeklinde. Koşulsuz hâlini ölçtüm: iki eşzamanlı onay çağrısı gerçekten iki ayrı kabul kaydı üretiyor, ikisi de başarı dönüyordu. Artık üretemez.
- **RBAC nöbetçileri gerçek bir açığı yakaladı.** Yönetim uç noktaları kişi başı yetkilere bağlı, ama bir uca yetki satırı yazmayı unutmak erişimi *kapatmıyor — açıyor*. CI artık yetki satırı olmayan yeni bir yönetim ucu eklenirse derlemeyi durduruyor. Nöbetçi canlı bir hata yakaladı: destek personeli kendi müşteri şikâyetlerini tek başına kapatabiliyormuş.
- **iOS ↔ Android denklik iskeleti.** Üç katmanlı sistem — platform dallarının defteri (sayı oynarsa CI durur), `app.json` / AASA / rota tablosu üçlüsü arasında derin bağlantı paritesi kontrolü ve cihaz üstünde çalışıp görsel bozulmaları sayıya çeviren bir tanı defteri. Sessizce iş yapmayan bir iOS deep-link'i bu şekilde yakalandı; düz duman testleri ikisinde de yeşil yanıyordu.

## Bilinçli kısıtlar

Uçtan uca Türkiye'de, Türk bir VDS üzerinde barındırılıyor; kaynak sunucunun önünde üçüncü taraf CDN yok — KVKK uyumu böylece sıkıcı, korkutucu değil. Modüler monolit: tek repo, üç deploy hedefi (api / web / mobil). İşletmelere "kaç kez görüldüm" verisi için üçüncü taraf analitik yerine, günlük döndürülen karma ve koordinatların 3 haneye yuvarlandığı, çerezsiz birinci-taraf ziyaret kaydı var.
