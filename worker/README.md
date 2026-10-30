# kaanusta-chat — /chat için Cloudflare Worker

```
Tarayıcı (kaanusta.dev/chat) → bu Worker (anahtar burada) → api.anthropic.com/v1/messages
```

Anthropic API anahtarı ve parolalar **yalnızca** Worker secret'larında durur.
Repoda, commit geçmişinde ve sitenin JS'inde hiçbiri yok. Her kişinin kendi parolası
var; sohbet geçmişi ve kişisel talimatlar Cloudflare D1'de kişi başına (şifresiz)
saklanır ve cihazlar arasında eşitlenir.

| Ayar | Nerede | Not |
|---|---|---|
| `ANTHROPIC_API_KEY` | `wrangler secret put` | Anthropic Console'dan |
| `ACCESS_TOKEN` | `wrangler secret put` | "partner" kullanıcısının parolası |
| `ACCESS_TOKEN_KAAN` | `wrangler secret put` | "kaan" kullanıcısının parolası |
| D1 `kaanusta-chat` | `wrangler.toml` → `[[d1_databases]]` | Sohbetler + kişisel talimatlar; şema `migrations/` |
| Web araması | `src/index.js` → `WEB_SEARCH_TOOL` | Sayfadaki "Web" düğmesiyle açılır; arama başına $0,01 |
| `FILE_REF_SECRET` | `wrangler secret put` | Dosya referanslarını imzalayan rastgele anahtar; yoksa dosya yükleme kapalı |
| `ALLOWED_ORIGINS` | `wrangler.toml` → `[vars]` | CORS listesi |
| Rate limit | `wrangler.toml` → `[[ratelimits]]` | IP başına 60 istek / 60 sn |
| Seçilebilir modeller / güç seviyeleri | `src/index.js` → `MODELS`, `EFFORTS` | Sayfadaki liste `src/lib/constants.ts`'te; ikisini birlikte güncelle |
| `max_tokens`, system prompt | `src/index.js` | İstemci değiştiremez |
| Dosya ekleri | `src/index.js` → `UPLOAD_TYPES`, `MAX_UPLOAD_BYTES` | Görsel (JPEG/PNG/GIF/WebP), PDF, düz metin; en fazla 15 MB; 90 gün sonra otomatik silinir |
| Mesaj sayısı / boyut sınırları | `src/index.js` → `MAX_*` | 200 mesaj, mesaj başına 30k, toplam 400k karakter; mesaj başına 5, toplam 30 ek |

## İlk kurulum

Tüm komutlar `worker/` klasöründe çalışır.

```bash
cd worker
```

1. Cloudflare'a giriş (tarayıcı açılır):

```bash
npx wrangler login
```

2. Worker'ı yayınla. Çıktının sonunda `https://kaanusta-chat.<alt-alan>.workers.dev` adresi görünür; bunu not al:

```bash
npx wrangler deploy
```

3. Parolayı üret ya da kendin belirle (en az 12–16 karakter; Türkçe harfler olur, başta/sonda boşluk olmasın). Sevgiline güvenli bir kanaldan ilet:

```bash
openssl rand -base64 24
```

4. Secret'ları ekle (her komut değeri gizli olarak sorar; değer terminal geçmişine yazılmaz):

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

```bash
npx wrangler secret put ACCESS_TOKEN
```

```bash
npx wrangler secret put ACCESS_TOKEN_KAAN
```

Dosya yükleme için imza anahtarı (değeri kimsenin bilmesi gerekmez, rastgele üretilip doğrudan yüklenir):

```bash
openssl rand -base64 32 | npx wrangler secret put FILE_REF_SECRET
```

5. Sitede Worker adresi: `src/lib/constants.ts` → `CHAT_WORKER_URL` (şu an `https://kaanusta-chat.kaanekimoz.workers.dev`). Adres değişirse burayı güncelle, sonra normal akış: `dev/claude` → PR → `main` → GitHub Actions deploy.

> **iCloud notu:** Repo `~/Documents` altında iCloud'a eşitleniyorsa ve dosyalar yerelde indirilmemişse `npx wrangler` takılır. O durumda `worker/` klasörünü iCloud dışına kopyalayıp (örn. `~/kaanusta-chat-worker`) komutları orada `npx -y wrangler@4 ...` ile çalıştır.

6. Sohbet geçmişi veritabanı (bir kez):

```bash
npx wrangler d1 create kaanusta-chat
```

Çıkan `database_id`'yi `wrangler.toml`'a yaz, sonra şemayı uygula:

```bash
npx wrangler d1 migrations apply kaanusta-chat --remote
```

Yeni bir `migrations/000N_*.sql` eklendiğinde aynı komut yalnızca eksik olanları uygular.

## Özellikler ve nerede durdukları

| Özellik | Sayfada | Worker'da |
|---|---|---|
| Model / güç seçimi | Yazı kutusunun üstü | `MODELS`, `EFFORTS` |
| Web araması | "Web" düğmesi | `WEB_SEARCH_TOOL` (arama başına $0,01) |
| Bağlantı okuma | Sohbette link varsa kendiliğinden; "Web" açıkken her zaman | `WEB_FETCH_TOOL`, `LINK_RE` (ücretsiz, yalnızca token) |
| Kod çalıştırma, dosya üretme (Excel/Word/PDF/grafik) | "Kod" düğmesi; Office dosyası eklenince kendiliğinden açılır | `CODE_TOOL`; çıktılar `outputs` tablosunda kişiye bağlı, `/outputs/<id>` ile iner. Ayda 1.550 konteyner-saati ücretsiz, sonra saatte $0,05 |
| Hafıza | Menü → Hafıza (görüntüle/sil); Kişisel talimatlar → aç/kapa | `MEMORY_TOOL` + `runMemory()`; `memories` tablosu. Worker araç döngüsünü kendisi yürütür |
| Projeler (kalıcı dosya + talimat) | Menüdeki proje seçici | `projects` tablosu; proje dosyaları süresiz, proje silinince silinir |
| Uzun sohbet | ~120k token ya da 120 mesajda eski kısım otomatik özetlenir | `/compact` (Sonnet 5.5) |
| Kullanım ve maliyet | Her yanıtın altında + altta bağlam göstergesi + menüde aylık toplam | `PRICES`; `usage` tablosu (tahmindir; kesin tutar Claude Console'da) |
| Ana ekran uygulaması | Telefonda "Ana Ekrana Ekle" | `public/chat/` (manifest, simgeler, service worker; yalnızca `/chat/` kapsamı) |

> **CPU notu:** Worker artık akışı okuyup araç döngüsünü kendisi yürüttüğü için istek başına biraz daha CPU harcıyor. Ücretsiz Workers planında (istek başına 10 ms CPU) uzun yanıtlarda `1102` hatası görülürse Workers Paid ($5/ay) planına geçmek yeterli.

## Sonraki değişiklikler

- Worker kodunu/ayarını değiştirdin → `npx wrangler deploy`
- Parolayı değiştir → `npx wrangler secret put ACCESS_TOKEN` (ya da `ACCESS_TOKEN_KAAN`); eski parolayla açık sayfa bir sonraki istekte parolayı tekrar sorar. Geçmiş kullanıcıya bağlı olduğu için parola değişse de kaybolmaz.
- Veritabanını görmek → Cloudflare paneli → Storage & Databases → D1 → `kaanusta-chat` (sohbetler şifresiz saklanır)
- Loglar (hata ayıklama; anahtar loglanmaz) → `npx wrangler tail`

## Dosya ekleri

- Dosyalar Anthropic Files API'ye yüklenir; mesajlarda yeniden gönderilmez, kimlikleriyle anılır.
- Yüklenen dosyalar API anahtarının **bütün workspace'ine** açıktır. Bu yüzden sayfa çıplak `file_id` görmez: Worker `<file_id>.<imza>` verir ve yalnızca kendi imzaladığı referansları kabul eder. Bu sohbet için ayrı bir workspace ve o workspace'e ait bir API anahtarı kullanmak en temizidir.
- Her dosya 90 gün sonra kendiliğinden silinir; sohbet silinince ekleri de hemen silinir. Süresi dolan ekler eski sohbette "süresi doldu" olarak görünür ve modele not olarak gider.
- `FILE_REF_SECRET` değişirse eski eklerin referansları geçersiz olur; o sohbetler eklerle devam edemez.
- Ekler her mesajda yeniden token olarak sayılır (büyük bir PDF onlarca bin token eder). Worker konuşmayı önbelleğe alarak (prompt caching) tekrarlanan kısmın maliyetini düşürür.

## Rate limiting

`wrangler.toml`'daki `[[ratelimits]]` bağlaması Worker içinde IP başına sayar ve parola
denemelerini de yavaşlatır (token kontrolünden önce çalışır). Ek katman istersen
Cloudflare panelinde **Security → WAF → Rate limiting rules** ile `kaanusta-chat` için
kural ekleyebilirsin; ancak workers.dev adresinde WAF kuralları çalışmaz, bunun için
Worker'ı Cloudflare'de yönetilen bir alan adına bağlamak gerekir.

## Test kontrol listesi

`URL` yerine kendi Worker adresini, `PAROLA` yerine parolayı yaz.

- [ ] Parolasız istek 401 döner:
  `curl -i -X POST URL -d '{"messages":[{"role":"user","content":"selam"}]}'`
- [ ] Doğru parola 204 döner: `curl -i URL/auth -H "Authorization: Bearer PAROLA"`
- [ ] Yabancı origin 403 döner: `curl -i -X POST URL -H "Origin: https://example.com"`
- [ ] Akış çalışır (SSE satırları peş peşe gelir):
  `curl -N -X POST URL -H "Authorization: Bearer PAROLA" -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"Merhaba"}]}'`
- [ ] Listede olmayan `model` 400 döner; `max_tokens` istemciden alınmaz (model belirtilmezse yanıttaki `message_start` → `"model":"claude-opus-5-5"`)
- [ ] `kaanusta.dev/chat`: yanlış parola hata gösterir, doğrusu sohbeti açar
- [ ] Yanıt akarak gelir; Durdur butonu yarıda keser, "Durduruldu." notu çıkar
- [ ] Sayfayı yenile: parola ve sohbet geçmişi duruyor
- [ ] Yeni sohbet, geçmiş menüsü, tek sohbet silme, tüm geçmişi silme çalışıyor
- [ ] Telefonda: klavye açılınca yazı alanı görünür kalıyor, yatay kaydırma yok
- [ ] Markdown: liste, kod bloğu (+ Kopyala), tablo düzgün
- [ ] `view-source:kaanusta.dev/chat` → `noindex` var; sayfanın JS'inde anahtar/parola yok
- [ ] `kaanusta.dev/sitemap-0.xml` içinde `/chat` yok
