# Patimania — Veri Yapısı

**20 Ekim 2026 · canlı veritabanından ölçülerek çıkarıldı** (`patimania.com` · PostgreSQL 17 + PostGIS).

Bu belgedeki her sayı canlı sistemden okundu; tablo açıklamaları şemada elle yazılmış tanımlardan alındı. Tahmin yok.

---

## Özetle

|                                      |            |
| ------------------------------------ | ---------- |
| Tablo sayısı                         | **68**     |
| Tablolar arası bağ (yabancı anahtar) | **101**    |
| Toplam kayıt                         | **17.966** |
| Veritabanı göçü (migration)          | **121**    |

⚠️ **Kayıtların çoğu ölçüm verisi.** Sistem şu an **demo verisiyle** çalışıyor: gerçek müşteri trafiği yok, bu yüzden rezervasyon ve ödeme tabloları neredeyse boş. Yapı kurulu, içi dolmayı bekliyor.

### Veri en çok nerede toplanıyor

| Tablo                |  Kayıt | Ne                                                                     |
| -------------------- | -----: | ---------------------------------------------------------------------- |
| `view_events`        | 14.863 | view_events — işletme görünürlük/trafik analitiği (dashboard)          |
| `app_events`         |  1.527 | app_events — minimal first-party product analytics (2 Oct 2026, Kaan:  |
| `sessions`           |    530 | Reuse-detection: revoke edilmiş token tekrar gelirse kullanıcının TÜM  |
| `search_events`      |    432 | search_events — ARAMA kaydı (platform trafik raporu, panel-eksikler §7 |
| `_prisma_migrations` |    121 | —                                                                      |
| `resources`          |     87 | resources — sağlayıcının somut kapasite birimleri (oda/kafes/personel/ |

### Merkez tablolar — en çok atıf alanlar

Bir tabloya ne kadar çok bağ geliyorsa, sistemde o kadar merkezîdir.

| Tablo          | Kendisine bağlı tablo |
| -------------- | --------------------: |
| `users`        |                    36 |
| `reservations` |                    17 |
| `providers`    |                    17 |
| `services`     |                     6 |
| `pets`         |                     4 |
| `resources`    |                     4 |

---

## Kimlik, oturum ve güvenlik

_Kim giriyor, nasıl doğrulanıyor, kim neyi yaptı._

| Tablo                   | Sütun | Kayıt | Ne işe yarar                                                                                                                                                                                                                                                                                              |
| ----------------------- | ----: | ----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `users`                 |    22 |    26 | müşteri / işletme sahibi / admin ortak hesap tablosu. Kayıt = telefon SMS OTP doğrulamalı (rules §8); e-posta doğrulama zorunlu.                                                                                                                                                                          |
| `sessions`              |    11 |   530 | Reuse-detection: revoke edilmiş token tekrar gelirse kullanıcının TÜM oturumları düşürülür.                                                                                                                                                                                                               |
| `verification_codes`    |    13 |     0 | SMS OTP + e-posta doğrulama/şifre sıfırlama token'ları. Kod/token ham SAKLANMAZ (scrypt hash); kısa TTL + deneme sayacı + tek kullanım.                                                                                                                                                                   |
| `two_factor_challenges` |    10 |     1 | parola doğrulandıktan sonra verilen KISA ömürlü ikinci adım bileti (ham değer saklanmaz, sha256). `purpose`: login · setup.                                                                                                                                                                               |
| `staff_two_factor`      |    10 |     1 | PERSONEL iki adımlı giriş (TOTP) durumu (7 Eki 2026). Yalnız `role = admin` hesaplarda uygulanır; müşteri/işletme etkilenmez. Sır ŞİFRELİ saklanır (`TWO_FACTOR_ENCRYPTION_KEY`, AES-256-GCM, "v1:" öneki); anahtar tanımlı değilse "plain:" önekiyle düz yazılır ve anahtar gelince ilk başarılı…        |
| `staff_trusted_devices` |    10 |     1 | sessions — refresh token oturumları. Ham token ASLA saklanmaz (sha256 hash). Rotation: her refresh'te eski satır revoke + yeni satır (rotated_from zinciri). staff_trusted_devices — "BU CİHAZI 30 GÜN HATIRLA" (decisions §89 K6/K23, 10 Eki 2026). Personel 2FA ZORUNLU oldu; aynı cihazda her girişte… |
| `staff_recovery_codes`  |     5 |     0 | tek kullanımlık kurtarma kodları (yalnız sha256 özeti).                                                                                                                                                                                                                                                   |
| `user_blocks`           |     4 |     0 | Kullanıcı engelleme. Engelleyenin sohbetlerinde karşı tarafın mesajları gösterilmez ve yeni mesaj gönderilemez. ⚠️ TEK YÖNLÜ ve ÇİFT TARAFLI ETKİ: A, B'yi engellerse ikisi de birbirine yazamaz. Tek taraflı sussaydı engelleyen kişi hâlâ taciz mesajı ALIRDI — engellemenin amacı tam olarak bunu…     |
| `audit_log`             |     8 |    51 | DEĞİŞTİRİLEMEZ denetim izi (para/onay/rol/admin işlemleri). PII maskeli tutulur.                                                                                                                                                                                                                          |

## Müşteri tarafı

_Müşterinin kendi verisi: adresleri, hayvanları, sepeti._

| Tablo        | Sütun | Kayıt | Ne işe yarar                                                                                                                                                                                                                                                                                           |
| ------------ | ----: | ----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `addresses`  |    22 |     7 | _(şemada açıklama yok)_ — bağlı olduğu tablolar: `users`                                                                                                                                                                                                                                               |
| `pets`       |    17 |     6 | müşterinin evcil hayvanları (çoklu).                                                                                                                                                                                                                                                                   |
| `favorites`  |     4 |    11 | müşterinin kaydettiği işletmeler. Eskiden yalnız tarayıcı localStorage'ındaydı: telefonda eklenen favori bilgisayarda görünmüyor, tarayıcı temizlenince kayboluyordu (Kaan bildirdi). (customer_id, provider_id) UNIQUE → aynı işletme iki kez favorilenemez; "ekle" isteği idempotent olabilsin diye… |
| `carts`      |     8 |     3 | Customer's cart at ONE provider. Holds no inventory; 7 days after the last change (a direct cart: 24 h).                                                                                                                                                                                               |
| `cart_items` |    11 |     3 | One cart line: hotel = one room with 1..N pets for a date range; grooming = one back-to-back session at one groomer. `pets` = [{petId, serviceIds?, note?}] — validated with zod on every read.                                                                                                        |

## İşletme ve hizmetler

_İşletme kaydı, sunduğu hizmetler ve kapasitesi._

| Tablo                            | Sütun | Kayıt | Ne işe yarar                                                                                                                                                                                                                                                                                     |
| -------------------------------- | ----: | ----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `providers`                      |    32 |    12 | hizmet veren işletme profili (bir User = bir Provider).                                                                                                                                                                                                                                          |
| `provider_applications`          |    28 |     0 | _(şemada açıklama yok)_                                                                                                                                                                                                                                                                          |
| `provider_change_requests`       |    14 |     0 | _(şemada açıklama yok)_ — bağlı olduğu tablolar: `providers`                                                                                                                                                                                                                                     |
| `provider_payout_info`           |    18 |    12 | _(şemada açıklama yok)_ — bağlı olduğu tablolar: `providers`                                                                                                                                                                                                                                     |
| `provider_commission_agreements` |     7 |     0 | komisyon oranı versiyonlama (efektif tarih aralıklı).                                                                                                                                                                                                                                            |
| `provider_suggestions`           |    13 |     0 | İŞLETME ÖNERİSİ — MÜŞTERİ doldurur (Kaan, 27 Ağustos 2026). Kaan: _"Ana sayfa header'da İşletme Ol'un yanına İşletme Öner diye tuş… müşteri dolduracak bu formu."_ ⚠️ `ProviderApplication` İLE KARIŞTIRMA — ayrı tablo olmasının sebebi: · Başvuruyu **işletmenin kendisi** doldurur, öneriyi…  |
| `services`                       |    17 |    46 | sağlayıcının sunduğu hizmetler (para = numeric(12,2), asla float).                                                                                                                                                                                                                               |
| `service_add_ons`                |     9 |    44 | _(şemada açıklama yok)_ — bağlı olduğu tablolar: `providers`                                                                                                                                                                                                                                     |
| `service_add_on_services`        |     2 |     0 | Ek hizmet ↔ hizmet bağı (`scope = selected` için). Ayrı tablo çünkü bir ekstra BİRDEN ÇOK hizmette geçerli olabiliyor: "ekstra yatak" Standart + Deluxe'te var, Süit'te yok. `service_id`yi nullable yapıp "null = tümü" demek bu üçüncü durumu karşılamıyordu ve modeli ikinci kez değiştirmek… |
| `service_type_flags`             |     3 |     4 | platform genelinde hizmet tipi aç/kapa (Faz B). Kod/enum/seed korunur; kapatılan tip yalnızca GİZLENİR ve yeni hizmet/rezervasyon kabul etmez (mevcut rezervasyonlar sürer). Tek doğruluk kaynağı: bu tablo.                                                                                     |
| `resources`                      |     9 |    87 | sağlayıcının somut kapasite birimleri (oda/kafes/personel/araç). EXCLUDE constraint bu birim üzerinden çalışır (çift rezervasyon imkânsız).                                                                                                                                                      |
| `resource_blocks`                |    16 |     0 | _(şemada açıklama yok)_ — bağlı olduğu tablolar: `providers`, `resources`, `services`                                                                                                                                                                                                            |

## Rezervasyon

_Projenin kalbi. Çift rezervasyon veritabanı kısıtıyla engelleniyor._

| Tablo                     | Sütun | Kayıt | Ne işe yarar                                                                                                                                                                                                                                                                                            |
| ------------------------- | ----: | ----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reservations`            |    51 |     1 | çekirdek. Çift rezervasyon EXCLUDE constraint ile DB'de imkânsız (raw SQL migration; btree_gist + tstzrange). Soft-hold: expires_at.                                                                                                                                                                    |
| `reservation_items`       |    11 |     1 | One occupation of one resource for one time range inside a reservation. `status` is MIRRORED from the header by database triggers (the EXCLUDE predicate can only read this table) — the application never writes it.                                                                                   |
| `reservation_item_pets`   |     9 |     1 | Which pet is inside an item + per-appointment notes + interim delivery.                                                                                                                                                                                                                                 |
| `reservation_pets`        |     2 |     1 | bir rezervasyondaki hayvanlar (çoklu hayvan). `Reservation.petId` geriye dönük uyum için DURUYOR ve listenin ilkini tutar; tek-hayvanlı eski kayıtlar migration'da buraya kopyalandı.                                                                                                                   |
| `reservation_lines`       |    16 |     1 | Frozen price breakdown, written once at booking (dispute evidence).                                                                                                                                                                                                                                     |
| `reservation_add_ons`     |     9 |     0 | _(şemada açıklama yok)_ — bağlı olduğu tablolar: `reservations`, `service_add_ons`                                                                                                                                                                                                                      |
| `reservation_surcharges`  |    12 |     0 | Groomer "fark talebi" (wrong size declared). Paid as a SEPARATE child reservation (extension pattern) — `paymentReservationId`.                                                                                                                                                                         |
| `reservation_extensions`  |    11 |     0 | otelde UZATMA talebi (müşteri onayı, 3 Ağu S4+S15). Akış: müşteri talep gönderir → sistem odanın o günlerde boş olduğunu doğrular → otel onaylar → fark tahsil edilir. Telefonda halledilmez: hem odanın gerçekten boş olduğu görülür hem ödeme/muhasebe temiz kalır. Neden ayrı tablo: uzatma ONAY…    |
| `change_policy_overrides` |     4 |     0 | "bu alan onaya tabi mi?" kararının ADMIN TARAFINDAN DEĞİŞTİRİLEBİLİR hâli (Kaan, 15 Ağu 2026). Kaan: _"onaya gereken ve gerekmeyen kalemler olsun, onları sonradan düzeltebiliriz; mesela çalışma saatleri onaya gerekmeyebilir."_ Kodadaki tablo (change-policy.ts) VARSAYILAN olarak kalır; buradaki… |

## Ödeme ve muhasebe

_Para hareketi, escrow defteri ve uyuşmazlıklar._

| Tablo                 | Sütun | Kayıt | Ne işe yarar                                                                                                                                                                                                                                                                                            |
| --------------------- | ----: | ----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `payments`            |    15 |     0 | rezervasyon başına ödeme (iyzico). Kart bilgisi TUTULMAZ (PCI iyzico'da).                                                                                                                                                                                                                               |
| `payment_transitions` |     7 |     0 | append-only durum geçiş izi (dispute/muhasebe için "neden bu durumda").                                                                                                                                                                                                                                 |
| `ledger`              |     9 |     0 | append-only double-entry para defteri (gerçeğin kaynağı; reservations.status = cari durum). Hesap planı (account): platform_pool · provider_payable · commission_income · vat_payable · customer_refund · chargeback. Invariant: entry_group_id başına SUM(debit) = SUM(credit) — uygulama katmanı tek… |
| `invoices`            |    11 |     0 | fatura kayıtları (e-Arşiv/e-Fatura). GİB entegratörü ile eşleşir.                                                                                                                                                                                                                                       |
| `disputes`            |    10 |     0 | şikayet/uyuşmazlık. AÇIKKEN escrow auto-release DURUR (tüketici koruma).                                                                                                                                                                                                                                |
| `webhook_events`      |     9 |     0 | iyzico webhook idempotency + audit. UNIQUE(provider,event_type,external_id).                                                                                                                                                                                                                            |

## Pet Taksi

_Teklif sistemi: talep → teklifler → kabul → yolculuk._

| Tablo               | Sütun | Kayıt | Ne işe yarar                                                                                                                                                                                                                                                                                           |
| ------------------- | ----: | ----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `taxi_requests`     |    22 |    11 | müşterinin talebi. tripId doluysa HEDEFLİ (tek şoföre), boşsa GENEL (ildeki tüm taksicilere düşer — Kaan, A2).                                                                                                                                                                                         |
| `taxi_request_pets` |     2 |    15 | Talepteki hayvanlar. Ayrı tablo: bir talepte birden çok hayvan olabilir (Kaan, B8: "3 peti olan 1 müşteri" tek rezervasyon sayılır).                                                                                                                                                                   |
| `taxi_offers`       |    14 |    44 | şoförün teklifi: FİYAT + hangi GÜN + hangi SAAT ARALIĞINDA alabileceği (Kaan, A3). Fiyatta taban/tavan YOK (A7).                                                                                                                                                                                       |
| `taxi_trips`        |    17 |    13 | şoförün İLAN ETTİĞİ yolculuk ("şu gün İstanbul'dan çıkıyorum, şu gün Ankara'dayım"). Müşteri bunları görüp hedefli talep gönderir. ⚠️ ŞEHİRLERARASI: koordinatlar tüm Türkiye'de olabilir (decisions §36) — otel/kuaför İstanbul sınırında kalır, taksi için sınır açıldı.                             |
| `taxi_trip_stops`   |     5 |     0 | ilanın ARA DURAKLARI (Kaan, 25 Ağu 2026: _"Pet Taksi'de yolculuk eklerken ara durak olsun; hem müşteri görecek hem işletme ekleyecek"_). İstanbul → Ankara giden araç Bolu'dan geçiyorsa Bolu'daki müşteri de o yolculuğa binebilmeli. Kalkış/varış ikilisi bu bilgiyi taşıyamıyordu: ilan yalnız iki… |

## İletişim ve itibar

_Mesajlaşma, destek, yorumlar ve şikâyetler._

| Tablo                     | Sütun | Kayıt | Ne işe yarar                                                                                                                                                                                                                                                                                             |
| ------------------------- | ----: | ----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `conversations`           |     9 |     1 | müşteri ↔ işletme mesajlaşması (Kaan'ın 1. önceliği, S16). BAĞLAM ZORUNLU: bir sohbet HER ZAMAN bir rezervasyona bağlıdır. "Kiminle konuşabilirim?" sorusunun cevabı böylece tek: seninle GERÇEK bir işi olan taraf. Bağlamsız sohbet açılabilseydi vitrindeki her işletmeye mesaj atılabilirdi (spam +… |
| `messages`                |     9 |     5 | sohbetin tek tek mesajları.                                                                                                                                                                                                                                                                              |
| `message_escape_attempts` |     6 |     0 | Kaçış girişimi = platform dışına çıkma denemesi (numara/Instagram/e-posta). Kaan: "engelle + admin görsün". Mesaj GİTMEZ ama kaydı tutulur; böylece tek seferlik yanlışlık ile SİSTEMLİ kaçış girişimi ayrışır.                                                                                          |
| `support_threads`         |    15 |     0 | ───────────────────────────────────────────────────────────────────────────── DESTEK YAZIŞMASI — İŞLETME/MÜŞTERİ ⇄ PATİMANİA (Kaan, 26 Ağu 2026: _"işletmelerin bizle yazışabileceği bir yer yok"_) ───────────────────────────────────────────────────────────────────────────── ⚠️ `Conversation` İLE… |
| `support_messages`        |     7 |     0 | _(şemada açıklama yok)_ — bağlı olduğu tablolar: `support_threads`, `users`                                                                                                                                                                                                                              |
| `reviews`                 |    14 |     0 | _(şemada açıklama yok)_ — bağlı olduğu tablolar: `providers`, `reservations`, `users`                                                                                                                                                                                                                    |
| `abuse_reports`           |    12 |     0 | İçerik/davranış şikâyeti. Admin destek akışında görünür.                                                                                                                                                                                                                                                 |

## Bildirim

_Hangi kanaldan, kimin iznine göre bildirim gider._

| Tablo                      | Sütun | Kayıt | Ne işe yarar                                                                                                                                                                                                                                                                                           |
| -------------------------- | ----: | ----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `notifications`            |    10 |    45 | gönderim kaydı (İYS izlenebilirlik). category=commercial ise notification_consents'te granted izin ARANIR (yoksa skipped_no_consent). İşlemsel (transactional) bildirimler İYS'den muaf.                                                                                                               |
| `notification_preferences` |     7 |     0 | "hangi olayda hangi kanaldan haber ver" (Kaan, 17 Ağu 2026: _"İletişim Tercihleri… mail atma, bunlar da olsun"_). ⚠️ `notification_consents` İLE KARIŞTIRILMAMALI — ikisi ayrı şeyler: · consents = YASAL izin (İYS). Ticari ileti için ZORUNLU, kullanıcı vermezse gönderemeyiz; hukuki kayıt. ·…     |
| `notification_consents`    |     9 |    11 | İYS uyumu (ticari ileti izni). İşlemsel bildirim muaf.                                                                                                                                                                                                                                                 |
| `device_tokens`            |     9 |    24 | mobil cihazın push adresi (Expo push token). Token CİHAZA aittir, kullanıcıya değil: aynı telefonda başka biri giriş yaparsa satır yeni kullanıcıya TAŞINIR (token unique). GUEST DEVICES (Oct 11 2026, Kaan — decisions §89 "misafir kayıt"): the app also registers WITHOUT sign-in, so `user_id`…   |
| `push_broadcasts`          |    23 |     1 | "send a push to customers" from the admin panel (Kaan, Oct 11 2026 — decisions §89 "toplu bildirim"). ⚖️ `category` is the legal split (İYS): `transactional` = service information ("Bilgilendirme") → every matching device incl. guests; `commercial` = campaign → ONLY signed-in customers with a… |
| `push_tickets`             |     4 |     0 | Expo push tickets waiting for their delivery RECEIPT (Oct 10 2026). "DeviceNotRegistered" usually arrives only in the receipt, so dead tokens are pruned from here (PushService.checkReceipts). Short-lived rows.                                                                                      |

## Yönetim ve pazarlama

_Platform ayarları, duyurular, kampanyalar._

| Tablo                  | Sütun | Kayıt | Ne işe yarar                                                                                                                                                                                                                                                                                          |
| ---------------------- | ----: | ----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `platform_settings`    |     3 |     1 | işletmeye değil PLATFORMA ait, admin panelinden değiştirilebilen ayarlar (anahtar → değer). İlk kullanıcı: iptal/iade politikasının ücretsiz iptal penceresi (Kaan, 26 Eyl 2026 — "S1-a yap ama bu sistemden değiştirilebilsin"). ⚠️ Değer STRING tutulur, tip okuma anında doğrulanır…               |
| `announcements`        |    12 |     0 | ADMIN DUYURUSU (Kaan, 15 Ağu 2026). Kaan: _"admin panelinden duyuru geçmeyi ekledik mi tüm işletmelere sistem üzerinden ve mailleri üzerinden."_ ⚠️ İKİ TÜR DUYURU, YASAL OLARAK FARKLI (İYS): · `transactional` → hizmetin işleyişine dair ("bakım var", "komisyon değişti"). Rıza aranmaz, herkese… |
| `campaigns`            |    14 |     0 | kampanya/kupon ALTYAPISI (S10). ⚠️ HİÇBİR UÇ/EKRAN bunu doldurmuyor (Kaan: "kodlasan ama eklemesek, altyapısı hazır olsun"). Kampanyayı kimin açacağı, kapsamı ve kimin hak kazanacağı karar bekliyor. Hesap kuralı `discount.ts`te kodlu ve testli.                                                  |
| `campaign_redemptions` |     6 |     0 | kullanım kaydı; kontenjan sayacı ve "kişi başı bir kez" kuralı buradan yürür.                                                                                                                                                                                                                         |
| `customer_banners`     |    13 |     2 | home-page campaign banner for CUSTOMERS (4 Oct 2026, Kaan: "Admin'e müşteri bandı ekleyelim, resim falan da olsun"). ⚠️ NOT the same thing as `Campaign`: that one is a DISCOUNT RULE (money, commission, coupon code) and has no title or image. A banner is pure presentation — it may point at a…  |

## Ölçüm ve analitik

_KVKK uyumlu, çerezsiz kullanım ölçümü._

| Tablo           | Sütun |  Kayıt | Ne işe yarar                                                                                                                                                                                                                                                                                           |
| --------------- | ----: | -----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `view_events`   |     7 | 14.863 | işletme görünürlük/trafik analitiği (dashboard). KVKK: PII SAKLANMAZ; ziyaretçi yalnız günlük-dönen tuzla hash'lenmiş anonim `visitor_hash` ile temsil edilir (ham IP/UA saklanmaz, kişi kalıcı izlenemez). Dış analytics yok, veri TR'de. type: 'profile_view' (client beacon) · 'search_impression'… |
| `search_events` |    11 |    432 | ARAMA kaydı (platform trafik raporu, panel-eksikler §7). Neden ayrı tablo: `view_events` "kim görüldü"yü tutuyor; burada asıl değerli olan **hiç kimsenin görülmediği** arama — sonuç 0 dönen sorgu, arzın eksik olduğu yeri gösterir ("Trabzon'da pet otel arandı, hiç sonuç yok"). KVKK: serbest…    |
| `app_events`    |     8 |  1.527 | minimal first-party product analytics (2 Oct 2026, Kaan: "analitik kendi sunucumuzda, minimal"). The mobile app posts funnel events (`POST /events`, see modules/events). KVKK (rules §5): NO personal data. No user id, no e-mail, no coordinates. `anon_hash` is the same daily-rotating…            |

## Sistem

_Framework'ün kendi tablosu._

| Tablo                | Sütun | Kayıt | Ne işe yarar            |
| -------------------- | ----: | ----: | ----------------------- |
| `_prisma_migrations` |     8 |   121 | _(şemada açıklama yok)_ |

---

## Doğrulama

- Gruplara dağıtılan tablo: **68**
- Veritabanındaki tablo: **68**
- İkisi eşitse hiçbir tablo atlanmamıştır.

Kaynaklar: `information_schema.columns` (sütun) · tablo başına `count(*)` (kayıt) · `pg_constraint` (bağlar) · `apps/api/prisma/schema.prisma` (açıklamalar).
