---
title: "Brick Game"
platform: Mobile
genres: ["Casual", "Arcade"]
year: 2022
duration: "2 ay"
role: "Solo (kod, görsel, arayüz, ses, monetizasyon)"
description: "Tek başına baştan sona geliştirilmiş, cilalı bir mobil blok puzzle."
techStack: ["Unity", "C#", "LevelPlay (ironSource)", "Unity IAP"]
links:
  github: "https://github.com/KaanEkimoz/Brick-Game"
  googlePlay: "https://play.google.com/store/apps/details?id=com.ekimozgames.brickgame"
coverImage: "../../assets/projects/brick-game/cover.png"
gallery:
  - "../../assets/projects/brick-game/gallery/00-title-tr.png"
  - "../../assets/projects/brick-game/gallery/01-classic-tr.png"
  - "../../assets/projects/brick-game/gallery/02-tetris-tr.png"
  - "../../assets/projects/brick-game/gallery/03-bomb-tr.png"
  - "../../assets/projects/brick-game/gallery/04-laser-tr.png"
  - "../../assets/projects/brick-game/gallery/05-colors-tr.png"
youtubeId: "8HeRix3L7K0"
featured: true
published: true
order: 2
lang: tr
---

Düşen-blok arcade formatına modern bir bakış — çekirdek mekanik blok yığma; Classic modunun yanında Bomb ve Laser yetenekleri ekleyen bir Extended mod var. Çapraz platform (Android yayında, iOS başvuru aşamasında).

## Teknik öne çıkanlar

- Sürümlü migration'lar ve 7-bag parça randomizer'ı içeren özel save sistemi.
- LevelPlay reklamlar + Unity IAP entegrasyonu, restore-purchases akışıyla birlikte.
- 5 aşamalı zorluk eğrisi, lock-delay tuning, hard/soft-drop fizik.
- Restart-state sızıntıları için bug-hunting turları (HUD, level, bag, ability buffer).

## Süreç notları

- Tüm görseller engine içinde yapıldı — üçüncü taraf sanat asset'i kullanılmadı.
- SFX, Audacity'de public-domain örnekler üzerinden sıfırdan kesildi.
- Level temposu, koda dökülmeden önce spreadsheet simülasyonlarıyla ince ayarlandı.
