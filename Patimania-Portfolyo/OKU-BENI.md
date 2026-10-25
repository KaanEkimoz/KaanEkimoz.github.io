# Patimania — portfolyo paketi

Hazırlanma tarihi: **24 Ekim 2026**. Bu klasör, Patimania projesini bir portfolyoya
koyabilmek için gereken her şeyi içerir: anlatı belgesi, ekran görüntüleri, diyagramlar,
marka varlıkları ve kopyalanmaya hazır metinler.

## Nereden başlanır

**`Patimania-Portfolyo.pdf`** — 26 sayfalık ana belge. Projeyi bir vaka çalışması olarak
anlatır: ne yaptığı, nasıl çalıştığı, hangi mühendislik problemlerinin nasıl çözüldüğü,
neyin bitmediği. Kaynağı `Patimania-Portfolyo.html` dosyasıdır; metni değiştirip
yeniden PDF basmak isterseniz aşağıdaki komut yeter.

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --no-pdf-header-footer --print-to-pdf=Patimania-Portfolyo.pdf \
  --virtual-time-budget=25000 "file://$PWD/Patimania-Portfolyo.html"
```

## Klasörler

| Klasör | İçinde ne var |
|---|---|
| `01-marka/` | Logo (renkli / beyaz / düz beyaz), uygulama ikonu 1024px, Google Play öne çıkan görseli |
| `02-web-masaustu/` | Canlı siteden 10 masaüstü ekran görüntüsü — 2× retina, 1440×900 |
| `03-web-mobil/` | Canlı siteden 4 mobil ekran görüntüsü — 2× retina, 390×844 |
| `04-paneller/` | İşletme paneli (6) ve yönetim paneli (6) — demo veriyle, yerel ortamdan |
| `05-mobil-app/` | 41 mobil uygulama ekranı; dosya adında ne gösterdiği yazılı |
| `06-mimari/` | 3 diyagram: sistem mimarisi · rezervasyon ve para akışı · veri modeli |
| `07-ek-belgeler/` | Veri yapısı PDF'i (68 tablonun tamamı), proje tanıtım belgesi, uygulama ekranları sunumu, Ağustos raporu |
| `08-metinler/` | Kopyalanmaya hazır tanıtım metinleri (tek cümle → uzun → İngilizce) + ölçülmüş rakam listesi |

Görseller kaynak kalitesindedir; portfolyo sitesi için küçültmek gerekebilir
(masaüstü çekimleri 2880×1800).

## Bu paketi kullanacak ajan için notlar

**Rakamlar ölçülmüştür, uydurma yoktur.** `08-metinler/02-olculmus-rakamlar.md`
her sayının nereden geldiğini söyler. Yeni bir sayı eklemeniz gerekirse ölçün;
tahmin etmeyin.

**İki şeyi gizlemeyin:**

1. Canlıdaki işletmelerin tamamı **demo kaydıdır**; panel ekranlarındaki ciro ve
   escrow tutarları **demo verisidir**.
2. **Gerçek ödeme kapalıdır** — ödeme sağlayıcısı adaptörü henüz bağlanmadı
   (akışın kendisi test edilmiş durumda).

Bunları "yumuşak lansman" olarak anlatmak hem doğru hem de daha güçlü: ürünün teknik
olarak hazır olduğunu ama ticari adımların bilinçli sırayla ilerlediğini gösterir.
Ana PDF'in 1. ve 13. bölümlerinde bu zaten böyle anlatılıyor.

**Yapay zekâ destekli geliştirme açıkça anlatılıyor.** Projenin kodu baştan sona Claude Code
ile yazıldı; bu, ana PDF'in 12. bölümünde ("Çalışma biçimi" → "Yapay zekâ destekli
geliştirme") ve rol tanımında yer alıyor. Gizlenecek bir şey olarak değil, çalışma biçiminin
kendisi olarak anlatıldı: tek kişilik bir ekibin dört ayda dört yüzeyi üretmesini mümkün kılan
şey bu, ve asıl anlatılmaya değer kısım bu hıza karşı kurulan doğrulama düzeni (76 uçtan uca
test paketi, 7 CI nöbetçisi, 102 yazılı karar kaydı). `08-metinler/` içinde bu konunun kısa
ve uzun hazır metinleri de var. Bu çerçeveyi zayıflatmayın — "yapay zekâ yazdı" demekle
"yapay zekânın hızına denetim düzeni kurduk" demek aynı şey değil.

**Gizlilik:** bu pakette sır, anahtar, parola veya gerçek müşteri verisi yoktur.
Ekran görüntülerindeki isimler demo kayıtlarına aittir.

## Kaynak

- Canlı site: https://patimania.com
- İşletme paneli: https://isletme.patimania.com
- Kod deposu özel (private).
