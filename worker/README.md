# kaanusta-chat — /chat için Cloudflare Worker

```
Tarayıcı (kaanusta.dev/chat) → bu Worker (anahtar burada) → api.anthropic.com/v1/messages
```

Anthropic API anahtarı ve sohbet parolası **yalnızca** Worker secret'larında durur.
Repoda, commit geçmişinde ve sitenin JS'inde hiçbiri yok.

| Ayar | Nerede | Not |
|---|---|---|
| `ANTHROPIC_API_KEY` | `wrangler secret put` | Anthropic Console'dan |
| `ACCESS_TOKEN` | `wrangler secret put` | Paylaşılan parola; uzun ve rastgele olsun |
| `ALLOWED_ORIGINS` | `wrangler.toml` → `[vars]` | CORS listesi |
| Rate limit | `wrangler.toml` → `[[ratelimits]]` | IP başına 20 istek / 60 sn |
| Model, `max_tokens`, effort, system prompt | `src/index.js` en üstteki sabitler | İstemci değiştiremez |
| Mesaj sayısı / boyut sınırları | `src/index.js` → `MAX_*` | 60 mesaj, mesaj başına 20k, toplam 120k karakter |

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

5. Sitede Worker adresi: `src/lib/constants.ts` → `CHAT_WORKER_URL` (şu an `https://kaanusta-chat.kaanekimoz.workers.dev`). Adres değişirse burayı güncelle, sonra normal akış: `dev/claude` → PR → `main` → GitHub Actions deploy.

> **iCloud notu:** Repo `~/Documents` altında iCloud'a eşitleniyorsa ve dosyalar yerelde indirilmemişse `npx wrangler` takılır. O durumda `worker/` klasörünü iCloud dışına kopyalayıp (örn. `~/kaanusta-chat-worker`) komutları orada `npx -y wrangler@4 ...` ile çalıştır.

## Sonraki değişiklikler

- Worker kodunu/ayarını değiştirdin → `npx wrangler deploy`
- Parolayı değiştir → `npx wrangler secret put ACCESS_TOKEN` (eski parolayla açık olan sayfa bir sonraki mesajda parolayı tekrar sorar)
- Loglar (hata ayıklama; anahtar loglanmaz) → `npx wrangler tail`

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
- [ ] İstemcinin gönderdiği `model` / `max_tokens` yok sayılır (yanıttaki `message_start` → `"model":"claude-opus-5-5"`)
- [ ] `kaanusta.dev/chat`: yanlış parola hata gösterir, doğrusu sohbeti açar
- [ ] Yanıt akarak gelir; Durdur butonu yarıda keser, "Durduruldu." notu çıkar
- [ ] Sayfayı yenile: parola ve sohbet geçmişi duruyor
- [ ] Yeni sohbet, geçmiş menüsü, tek sohbet silme, tüm geçmişi silme çalışıyor
- [ ] Telefonda: klavye açılınca yazı alanı görünür kalıyor, yatay kaydırma yok
- [ ] Markdown: liste, kod bloğu (+ Kopyala), tablo düzgün
- [ ] `view-source:kaanusta.dev/chat` → `noindex` var; sayfanın JS'inde anahtar/parola yok
- [ ] `kaanusta.dev/sitemap-0.xml` içinde `/chat` yok
