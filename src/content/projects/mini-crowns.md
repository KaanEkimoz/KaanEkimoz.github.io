---
title: "Mini Crowns"
platform: PC
genres: ["Lane defense", "Strategy"]
year: 2026
duration: "2022 school prototype, rebuilt April–November 2026"
role: "Developer: code, game design, UI, AI-assisted art pipeline"
description: "A five-lane castle defense game. You send an army of chibi soldiers against four enemy kingdoms, then grow your own castle from a wooden palisade into a white-and-gold citadel during the match."
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
---

Mini Crowns is a lane defense game about two castles and the five roads between them. You spend gold to send soldiers down a lane, and they march, fight whatever they meet and try to reach the enemy castle. The enemy does the same, with its own AI deciding what to send and where. Between waves you build up your own castle, and the castle changes how the battle goes.

It started in 2022 as a two-week school prototype. In 2026 I came back to it and rebuilt it as a full game: 12 campaign levels plus a tutorial across four kingdoms (Empire, Orcs, the Dead and Pirates), 8 player units, 3 bosses and 4 ultimate abilities. The game is in Turkish and targets PC first, then mobile.

In numbers (18 November 2026): about 520 commits since April 2026, about 27,000 lines of C#, 120 EditMode tests and 52 building models. The code was written with Claude Code driving the Unity Editor over MCP. The design, the art direction and the play-testing are mine.

## The castle grows during the match

- **21 buildings.** 17 courtyard buildings (barracks, forge, mage tower, temple, bank, gold mine and more), each with three tiers, plus the walls, the gate, a watchtower and a catapult.
- **Build in the match.** The shop unlocks a building once. In the match you tap an empty plot, pick a card and pay with match gold, then watch scaffolding go up with a progress bar. Every match starts again from a small wooden town hall.
- **Every building does something.** The bank pays interest, the mage tower fires lightning down the lanes, the alchemist throws potions, the mercenary camp hires extra soldiers, the gate slows attackers and the catapult throws rocks.
- **The walls change with the tier.** Tier 1 is a wooden palisade, tier 2 stone town walls with tiled towers, and tier 3 a white-and-gold Empire wall with blue spires. Buildings start small and grow with each tier, so a tier 3 courtyard looks like a city.

## Engineering highlights

- **Lane combat.** A lane registry keeps friendly units spaced out, faster units can pass slower ones, and blocked units wait instead of pushing. Hits land on animation events inside the clips, so a sword deals damage on the frame it connects.
- **Architecture.** No singletons: ScriptableObject configs, a small static service locator, composition-based units and one game scene that holds the menu, the level select and the match. 120 EditMode tests cover the economy, saves and combat rules.
- **Safe saves.** JSON saves with a versioned migrator and atomic writes (write to a temp file, then swap, keeping a backup), so a crash mid-save can't wipe progress.
- **Win conditions.** Levels can be won by destroying the enemy castle, surviving a timer, reaching a gold target or escorting a unit.
- **Animation.** One humanoid animation library is retargeted onto every unit through an animator and override controller per class. A contact-sheet tool renders each clip frame by frame so I could check every attack and walk cycle.
- **Test tools.** A test level with unlimited gold and a panel that jumps every building to tier 1, 2 or 3, spawns any unit or boss and changes the game speed. There's also a separate unit test arena scene that keeps its saves in memory.

## Art pipeline

- One art direction for everything, "Golden Hour Diorama": warm light, toy-like proportions and a fixed color palette, with lighting and post-processing applied by an editor tool.
- Every unit, boss and building was made with Meshy AI: a concept image first, then image-to-3D with low-poly topology, then rigging for the characters. The 51 building tiers share one prompt template and one tier rule (wood, then stone, then white stone with gold trim) so the set looks like one kit. Each concept was checked by eye before it became a model.
- The menu background is an AI-generated video loop. Music is by Kevin MacLeod (CC BY 4.0), and the sound effects are CC0.
