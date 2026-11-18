---
title: "Draw Rush"
platform: Mobile
genres: ["Hyper-casual", "Puzzle"]
year: 2026
duration: "2-week prototype (2022), 6-month rebuild (May–Nov 2026)"
role: "Developer: code, design, UI, store release (2022 prototype with a designer and a 3D artist)"
description: "A one-finger drawing game where a tiny pencil races desk monsters. A 2022 prototype from 208 Studios, rebuilt and released in 2026."
techStack: ["Unity 6 LTS", "C#", "URP", "Cinemachine", "AI Navigation", "Input System", "LevelPlay (ironSource)", "Unity Test Framework"]
links:
  googlePlay: "https://play.google.com/store/apps/details?id=com.ekimozgames.drawrush"
  github: "https://github.com/KaanEkimoz/DrawRush-HyperCasual"
icon: "../../assets/projects/draw-rush/icon.png"
coverImage: "../../assets/projects/draw-rush/cover-wide.webp"
coverSquare: "../../assets/projects/draw-rush/cover-square.webp"
gallery:
  - "../../assets/projects/draw-rush/gallery/00-key-art.webp"
  - "../../assets/projects/draw-rush/gallery/01-gameplay-draw.webp"
  - "../../assets/projects/draw-rush/gallery/02-desk-monsters.webp"
  - "../../assets/projects/draw-rush/gallery/03-power-ups.webp"
  - "../../assets/projects/draw-rush/gallery/04-shop.webp"
  - "../../assets/projects/draw-rush/gallery/05-collection.webp"
  - "../../assets/projects/draw-rush/gallery/06-showroom-shop.webp"
  - "../../assets/projects/draw-rush/gallery/07-settings-languages.webp"
  - "../../assets/projects/draw-rush/gallery/08-skins.webp"
  - "../../assets/projects/draw-rush/cover.png"
  - "../../assets/projects/draw-rush/gallery/01.png"
  - "../../assets/projects/draw-rush/gallery/02.png"
youtubeId: "k2DOHk8m15U"
published: true
order: 4
---

You play a tiny pencil on a giant desk. Run along a dotted outline to draw the shape while staplers, scissors, erasers and glue bottles chase you around the page.

Draw Rush started in 2022 as a two-week hyper-casual prototype at 208 Studios. In 2026 I took it over and rebuilt it as a full game under Ekimoz Games. It's live on Google Play (v1.6.0) and in App Store review, with 55 levels, 9 pencil skins, a shop with upgrades and a Dash skill, in English, Turkish and Spanish.

## Engineering highlights

- **Drawing system.** Drawing works edge by edge with closed-loop checks, and an edge completes itself at 99%. An autoplay bot in the editor plays every level end to end to prove each one can be beaten.
- **Level structure.** All levels live in one scene, with a level manager that resets state between them. A fixed level order and a difficulty curve bring in enemies and traps one at a time.
- **Architecture.** No singletons: ScriptableObject configs, a small service registry, feature folders and assembly definitions. 124 EditMode tests guard the save data and progression.
- **Smaller download.** Build-size work took the AAB from 77 MB to 55 MB and the arm64 download from 52.6 MB to 38.4 MB, without losing a single supported device on Play.
- **Languages.** A light localization layer with TextMeshPro fallback fonts, so Turkish and Spanish characters render in every UI font.
- **Economy and progression.** 3-star scoring tied to coin rewards. The skin shop works like a showroom: skins unlock in order, and a badge counts the upgrades you can afford.
- **Monetization.** Rewarded and interstitial ads through LevelPlay, with a consent flow and its own [privacy](/drawrush-privacy/) and [terms](/drawrush-terms/) pages.

## Process notes

- Hand-drawn notebook art style. The desk props were made as 3D models with Meshy AI and cut down to about 1.2k triangles each.
- Releases go up through the Google Play Developer API with a service-account upload script, not by hand in the Console.
- The splash animation is drawn in code: the pencil sketches the logo stroke, then the letters pop in.
- I built it with an AI-assisted workflow (Claude Code driving the Unity Editor over MCP) and checked every gameplay change on a device myself.
