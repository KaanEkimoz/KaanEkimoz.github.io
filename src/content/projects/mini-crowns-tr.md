---
title: "Mini Crowns"
platform: PC
genres: ["Şerit savunma", "Strateji"]
year: 2026
duration: "2022'de okul prototipi, Nisan–Kasım 2026'da yeniden yazım"
role: "Geliştirici: kod, oyun tasarımı, arayüz, yapay zekâ destekli sanat akışı"
description: "Beş şeritli bir kale savunma oyunu. Chibi askerlerden kurduğun orduyu dört düşman krallığa gönderiyor, maç sırasında da kendi kaleni ahşap bir çitten beyaz-altın bir hisara büyütüyorsun."
techStack:
  - "Unity 6"
  - "C#"
  - "URP"
  - "Cinemachine"
  - "Input System"
  - "DOTween"
  - "Unity Test Framework"
  - "Meshy AI"
  - "Claude Code + Unity MCP"
category: game
published: false
coverImage: "../../assets/projects/mini-crowns/cover-wide.webp"
coverSquare: "../../assets/projects/mini-crowns/cover-square.webp"
gallery:
  - "../../assets/projects/mini-crowns/gallery/00-key-art.webp"
  - "../../assets/projects/mini-crowns/gallery/01-battle.webp"
  - "../../assets/projects/mini-crowns/gallery/02-castle-tiers.webp"
  - "../../assets/projects/mini-crowns/gallery/03-castle-t3.webp"
  - "../../assets/projects/mini-crowns/gallery/04-battle-close.webp"
  - "../../assets/projects/mini-crowns/gallery/05-bosses.webp"
  - "../../assets/projects/mini-crowns/gallery/06-building-panel.webp"
  - "../../assets/projects/mini-crowns/gallery/07-level-select.webp"
  - "../../assets/projects/mini-crowns/gallery/08-realm-deads.webp"
  - "../../assets/projects/mini-crowns/gallery/09-realm-pirates.webp"
  - "../../assets/projects/mini-crowns/gallery/10-realm-orcs.webp"
  - "../../assets/projects/mini-crowns/gallery/11-building-concepts.webp"
youtubeId: "KQxZksQuXIY"
order: 8
lang: tr
---

Mini Crowns, iki kale ve aralarındaki beş yol üzerine kurulu bir şerit savunma oyunu. Altın harcayıp bir şeride asker gönderiyorsun; askerler yürüyor, karşılarına çıkanla savaşıyor ve düşman kalesine ulaşmaya çalışıyor. Düşman da aynısını yapıyor, neyi nereye göndereceğine kendi yapay zekâsı karar veriyor. Dalgaların arasında kendi kaleni büyütüyorsun ve kale savaşın gidişini değiştiriyor.

Oyun 2022'de iki haftalık bir okul prototipi olarak başladı. 2026'da projeye geri dönüp onu eksiksiz bir oyun olarak yeniden yaptım: dört krallıkta (İmparatorluk, Orklar, Ölüler ve Korsanlar) 12 kampanya bölümü ve bir eğitim bölümü, 8 oyuncu birimi, 3 boss ve 4 ultimate yetenek. Oyun Türkçe; önce PC, sonra mobil hedefleniyor.

Rakamlarla (18 Kasım 2026): Nisan 2026'dan beri yaklaşık 520 commit, yaklaşık 27.000 satır C#, 120 EditMode testi ve 52 bina modeli. Kodu, Unity Editör'ü MCP ile süren Claude Code ile yazdım. Tasarım, sanat yönetimi ve oyun testleri bana ait.

## Kale maç içinde büyüyor

- **21 bina.** Her biri üç seviyeli 17 avlu binası (kışla, demirci, büyücü kulesi, tapınak, banka, altın madeni ve diğerleri), bunlara ek olarak sur, kapı, gözcü kulesi ve mancınık.
- **Maç içinde inşa.** Mağaza bir binanın kilidini bir kez açıyor. Maçta boş bir arsaya dokunup kartı seçiyor, maç altınıyla ödüyorsun; ardından ilerleme çubuğuyla birlikte iskelenin yükseldiğini görüyorsun. Her maç yine küçük, ahşap bir belediye binasıyla başlıyor.
- **Her binanın bir işi var.** Banka faiz veriyor, büyücü kulesi şeritlere şimşek atıyor, simyacı iksir fırlatıyor, paralı asker kampı fazladan asker kiralıyor, kapı saldıranları yavaşlatıyor, mancınık da taş atıyor.
- **Surlar seviyeyle değişiyor.** 1. seviye ahşap bir çit, 2. seviye kiremit çatılı kuleleriyle taş şehir surları, 3. seviye mavi kuleli beyaz-altın İmparatorluk surları. Binalar küçük başlayıp her seviyede büyüyor; 3. seviyede avlu bir şehir gibi görünüyor.

## Teknik öne çıkanlar

- **Şerit savaşı.** Bir şerit kaydı dost birimler arasındaki mesafeyi koruyor; hızlı birimler yavaşları sollayabiliyor, önü kapalı birimler ittirmek yerine bekliyor. Vuruşlar kliplerin içindeki animasyon olaylarına bağlı, yani kılıç hasarı tam temas ettiği karede veriyor.
- **Mimari.** Singleton yok: ScriptableObject ayarları, küçük bir statik servis bulucu, bileşenlerden kurulan birimler ve menüyü, bölüm seçimini ve maçı aynı yerde tutan tek bir oyun sahnesi. 120 EditMode testi ekonomiyi, kayıtları ve savaş kurallarını koruyor.
- **Güvenli kayıt.** Sürümlü bir dönüştürücüsü olan JSON kayıtları atomik olarak yazılıyor (önce geçici dosyaya yazılıp sonra yer değiştiriliyor, yedek de tutuluyor). Böylece kayıt sırasında oyun çökse bile ilerleme silinmiyor.
- **Kazanma koşulları.** Bölümler düşman kalesini yıkarak, süre dolana kadar dayanarak, altın hedefine ulaşarak ya da bir birimi hedefe götürerek kazanılabiliyor.
- **Animasyon.** Tek bir insansı animasyon kütüphanesi, her sınıfa ait bir animator ve override controller üzerinden bütün birimlere aktarılıyor. Her klibi kare kare çizen bir kontak sayfası aracıyla her saldırıyı ve yürüyüşü tek tek kontrol ettim.
- **Test araçları.** Sınırsız altınlı bir test bölümü ve bütün binaları tek tıkla 1., 2. ya da 3. seviyeye getiren, istenen birimi ya da boss'u sahaya süren, oyun hızını değiştiren bir panel. Kayıtları bellekte tutan ayrı bir birim test arenası sahnesi de var.

## Sanat akışı

- Her şey tek bir sanat yönüne bağlı: "Golden Hour Diorama". Sıcak ışık, oyuncak gibi oranlar ve sabit bir renk paleti; ışık ve post-processing ayarlarını bir editör aracı uyguluyor.
- Bütün birimler, boss'lar ve binalar Meshy AI ile yapıldı: önce bir konsept görseli, sonra düşük poligonlu topolojiyle görselden 3D'ye, karakterler için de rig. 51 bina seviyesi aynı prompt şablonunu ve aynı seviye kuralını (ahşap, sonra taş, sonra altın süslemeli beyaz taş) paylaşıyor, bu yüzden hepsi tek bir set gibi duruyor. Her konsept model olmadan önce gözle kontrol edildi.
- Menü arka planı yapay zekâyla üretilmiş bir video döngüsü. Müzikler Kevin MacLeod'a ait (CC BY 4.0), ses efektleri CC0.
