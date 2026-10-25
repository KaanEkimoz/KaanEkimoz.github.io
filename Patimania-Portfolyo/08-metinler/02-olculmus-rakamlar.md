# Ölçülmüş rakamlar — 24 Ekim 2026

Bu listedeki her sayı ölçülmüştür. Tahmin veya yuvarlama yoktur.
Kaynak: kod deposu (git), canlı PostgreSQL veritabanı.

## Kod

| Ne | Değer | Nasıl ölçüldü |
|---|---|---|
| Toplam uygulama + test kodu | **315.165 satır / 1.330 dosya** | `.ts`, `.tsx`, `.mjs`; `node_modules`, derleme çıktıları ve native build klasörleri hariç |
| Backend (`apps/api/src`) | 69.504 satır / 304 dosya | |
| Veritabanı şeması + migration + tohum (`apps/api/prisma`) | 12.020 satır / 27 dosya | |
| Uçtan uca testler (`apps/api/test`) | 46.758 satır / 79 dosya | |
| Web (`apps/web`) | 111.911 satır / 568 dosya | |
| Mobil uygulama (`apps/mobile-customer`) | 55.788 satır / 212 dosya | |
| Paylaşılan paketler (`packages`) | 19.184 satır / 140 dosya | core · shared · ui · tokens · tailwind-config |

## Geçmiş

| Ne | Değer |
|---|---|
| Commit | **2.441** |
| İlk commit | 2 Temmuz 2026 |
| Son commit | 24 Ekim 2026 |
| Süre | 115 gün (günde ortalama 21 commit) |
| Temmuz / Ağustos / Eylül / Ekim | 494 / 757 / 331 / 859 commit |

## Yapı

| Ne | Değer |
|---|---|
| Backend modülü (NestJS) | **32** |
| Web sayfası / rota | **128** (30'u yönetim paneli) |
| Mobil uygulama ekranı | **45** |
| Uçtan uca test paketi | **76** |
| Test doğrulaması (assertion) | **3.900** |
| CI nöbetçi betiği | **7** |
| Yazılı karar kaydı | **102** |
| Proje belgesi | **102 markdown dosyası** |

## Veritabanı (canlı)

| Ne | Değer |
|---|---|
| Tablo | **68** |
| Yabancı anahtar | **106** |
| Uygulanmış migration | **124** (depoda 135 migration klasörü — main prod'un önünde) |
| Enum (durum/tip sözlüğü) | **48** |
| En çok atıf alan tablo | `users` (36 tablo bağlı) |
| Sonraki | `reservations` ve `providers` (17'şer) |

## Mobil yayın

| Ne | Değer |
|---|---|
| Mağazaya gönderilen sürüm | 1.3.7 |
| Yayındaki OTA | 1.3.6.3 / 1.3.7.1 |
| Dağıtım | Google Play kapalı test · TestFlight dış test |

## ⚠️ Dikkat

- Canlıdaki işletmelerin tamamı **demo kaydıdır**. Panel ekran görüntülerindeki ciro,
  escrow bakiyesi ve rezervasyon sayıları **demo verisidir** — gerçek ticaret değildir.
- **Gerçek ödeme kapalıdır** (`PAYMENTS_ENABLED=false`); ödeme sağlayıcısı adaptörü
  henüz bağlanmadı. Akışın kendisi test edilmiş durumda.
- Bu iki noktayı portfolyo metninde gizlemeyin; "yumuşak lansman" olarak anlatmak hem
  doğru hem daha güçlü.
