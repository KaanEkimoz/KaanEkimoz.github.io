---
title: "Brick Game"
platform: Mobile
genres: ["Casual", "Arcade"]
year: 2022
duration: "2 months"
role: "Solo (code, visuals, UI, SFX, monetization)"
description: "A polished mobile block-puzzle, built solo end-to-end."
techStack: ["Unity", "C#", "LevelPlay (ironSource)", "Unity IAP"]
links:
  github: "https://github.com/KaanEkimoz/Brick-Game"
  googlePlay: "https://play.google.com/store/apps/details?id=com.ekimozgames.brickgame"
coverImage: "../../assets/projects/brick-game/cover.png"
gallery:
  - "../../assets/projects/brick-game/gallery/00-title.png"
  - "../../assets/projects/brick-game/gallery/01-classic.png"
  - "../../assets/projects/brick-game/gallery/02-tetris.png"
  - "../../assets/projects/brick-game/gallery/03-bomb.png"
  - "../../assets/projects/brick-game/gallery/04-laser.png"
  - "../../assets/projects/brick-game/gallery/05-colors.png"
youtubeId: "8HeRix3L7K0"
featured: true
order: 2
---

A modern take on the falling-block arcade format — block-stacking core with a Classic mode plus an Extended mode that adds Bomb and Laser abilities. Cross-platform (Android live, iOS in submission).

## Engineering highlights

- Custom save system with versioned migrations + 7-bag piece randomizer.
- LevelPlay ads + Unity IAP integration with a restore-purchases flow.
- 5-stage difficulty curve, lock-delay tuning, hard/soft-drop physics.
- Bug-hunting passes for restart-state leaks (HUD, level, bag, ability buffer).

## Process notes

- All visuals built in-engine — no third-party art assets.
- SFX cut from scratch in Audacity over public-domain samples.
- Level pacing tuned via spreadsheet sims before code.
