---
title: "Patimania"
platform: Web
genres: ["Marketplace", "SaaS", "Pet-tech"]
year: 2026
duration: "3 ay (sürüyor)"
role: "Tek geliştirici"
description: "Pet otel, kuaför ve taksi hizmetlerini tek platformda toplayan, ödeme güvenceli çok taraflı bir pazaryeri. Web + iOS + Android, tek geliştirici."
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

Projeyi tek başıma, üç ayda sıfırdan kurdum — veri modelinden altyapıya, backend'ten mobil uygulamaya kadar her katman. Temmuz 2026'da başladım. Web patimania.com'da yayında; Android Google Play kapalı testinde, iOS App Store incelemesinde.

Üç ayın rakamları: ~1.500 commit, dört kod tabanında ~145 bin satır TypeScript, 52 tablo, 84 migration, gerçek Postgres + MinIO'ya karşı çalışan 37 uçtan uca test paketi (~1.090 kontrol) ve web + iOS + Android boyunca 129 farklı ekran.

## Gurur duyduğum yerler

- **Çift rezervasyon veritabanı düzeyinde imkânsız.** `btree_gist` üzerinde `(resource_id, tstzrange)` için PostgreSQL `EXCLUDE` kısıtı, aynı odaya veya araca çakışan iki zaman aralığını reddediyor. İki müşteri aynı slot için yarışırsa veritabanı tarafında biri kazanıyor — uygulama mantığı yanılsa bile çift rezervasyon oluşamıyor. Üstünde ödeme tamamlanana kadar tutan 5–10 dakikalık yumuşak tutma (soft-hold) katmanı var.
- **Para tamamen sunucu otoritesinde, arkasında çift girişli defter var.** Tutar, komisyon ve serbest bırakma kuralları sunucuda; istemci sadece teklif verebiliyor. Ödeme Güvencesi akışının arkasında komisyon geliri, işletme alacağı ve KDV bacaklarını tutan, her yazımda borç = alacak korunan bir muhasebe defteri var. Para alanları `numeric`, `float` değil.
- **Durum değiştiren yazımlar koşullu.** Onay, iptal, iade işlemleri `UPDATE ... WHERE status = 'pending'` şeklinde. Koşulsuz hâlini ölçtüm: iki eşzamanlı onay çağrısı gerçekten iki ayrı kabul kaydı üretiyor, ikisi de başarı dönüyordu. Artık üretemez.
- **RBAC nöbetçileri gerçek bir açığı yakaladı.** Yönetim uç noktaları kişi başı yetkilere bağlı, ama bir uca yetki satırı yazmayı unutmak erişimi *kapatmıyor — açıyor*. CI artık yetki satırı olmayan yeni bir yönetim ucu eklenirse derlemeyi durduruyor. Nöbetçi canlı bir hata yakaladı: destek personeli kendi müşteri şikâyetlerini tek başına kapatabiliyormuş.
- **iOS ↔ Android denklik iskeleti.** Üç katmanlı sistem — platform dallarının defteri (sayı oynarsa CI durur), `app.json` / AASA / rota tablosu üçlüsü arasında derin bağlantı paritesi kontrolü ve cihaz üstünde çalışıp görsel bozulmaları sayıya çeviren bir tanı defteri. Sessizce iş yapmayan bir iOS deep-link'i bu şekilde yakalandı; düz duman testleri ikisinde de yeşil yanıyordu.

## Bilinçli kısıtlar

Uçtan uca Türkiye'de, Türk bir VDS üzerinde barındırılıyor; kaynak sunucunun önünde üçüncü taraf CDN yok — KVKK uyumu böylece sıkıcı, korkutucu değil. Modüler monolit: tek repo, üç deploy hedefi (api / web / mobil). İşletmelere "kaç kez görüldüm" verisi için üçüncü taraf analitik yerine, günlük döndürülen karma ve koordinatların 3 haneye yuvarlandığı, çerezsiz birinci-taraf ziyaret kaydı var.
