/**
 * Tuning constants + kind definitions for the hero target-practice mini-game.
 *
 * Isolated from HeroCanvas.astro so future balance tweaks produce a clean
 * diff and so the config is grep-able. No side effects, no runtime coupling.
 */

import type { KindDef } from './hero-canvas.types';

// --- Flee / cursor behavior (desktop) --------------------------------------
/** Cursor-to-shape distance within which shapes start fleeing (px). */
export const FLEE_RADIUS = 120;
/** Inside this distance the flee kicks extra hard (panic zone). */
export const PANIC_RADIUS = 40;
/** Base flee acceleration applied each frame while inside FLEE_RADIUS. */
export const FLEE_FORCE = 0.72;
/** Frame-over-frame damping on the flee velocity. */
export const FLEE_DAMPING = 0.88;
/**
 * When the cursor is inside a shape's body the flee eases off — gives the
 * player a "commit zone" to actually land the click.
 */
export const COMMIT_FLEE_DAMPING = 0.2;

// --- Hit detection ---------------------------------------------------------
/**
 * Clicks get a slightly forgiving hit radius — the pointer-events fix on the
 * button row does the heavy lifting, so we can keep this modest.
 */
export const HIT_RADIUS_MULTIPLIER = 1.5;
/** Extra radius for touch taps (fat finger tolerance). */
export const TAP_BONUS_RADIUS = 18;
/** Per-shape cooldown so a single swipe path doesn't double-hit. */
export const HIT_COOLDOWN_MS = 120;

// --- Spawn / respawn -------------------------------------------------------
export const RESPAWN_DELAY_MS = 1200;
/** Entry animation duration when a shape slides in from an edge. */
export const ENTRY_MS = 420;
/** Base pool size — these are always-respawning shapes. */
export const BASE_POOL = 5;
/** Absolute cap including base + bonus shapes. */
export const MAX_POOL = 10;
/** Permanent bonus shape added every N hits (until MAX_POOL). */
export const HITS_PER_BONUS = 5;
/** Chance per hit that a short-lived clone also spawns. */
export const DOUBLE_SPAWN_CHANCE = 0.23;
/** Randomized size range: sizeMin × (1 + random × SIZE_JITTER). */
export const SIZE_JITTER = 0.4;

// --- Particles / juice -----------------------------------------------------
export const PARTICLE_COUNT = 12;
export const PARTICLE_MAX = 140;

// --- Round / timer ---------------------------------------------------------
export const TIMER_DURATION_MS = 20_000;

// --- Kinds + zones ---------------------------------------------------------
/**
 * Zones avoid the central text block — roughly x 0.22–0.78, y 0.24–0.80 on
 * desktop. Safe areas: left column, right column, top strip, bottom strip
 * (above the scroll indicator at ~y 0.92).
 */
export const KINDS: KindDef[] = [
  {
    kind: 'triangle',
    sizeMin: 52,
    color: '--accent-1',
    zones: [
      { xMin: 0.04, xMax: 0.20, yMin: 0.10, yMax: 0.28 },
      { xMin: 0.04, xMax: 0.18, yMin: 0.62, yMax: 0.86 },
    ],
  },
  {
    kind: 'circle',
    sizeMin: 60,
    color: '--accent-2',
    zones: [
      { xMin: 0.80, xMax: 0.96, yMin: 0.12, yMax: 0.30 },
      { xMin: 0.82, xMax: 0.96, yMin: 0.64, yMax: 0.86 },
    ],
  },
  {
    kind: 'square',
    sizeMin: 44,
    color: '--accent-3',
    zones: [
      { xMin: 0.04, xMax: 0.18, yMin: 0.36, yMax: 0.58 },
      { xMin: 0.28, xMax: 0.44, yMin: 0.04, yMax: 0.18 },
    ],
  },
  {
    kind: 'hexagon',
    sizeMin: 58,
    color: '--accent-1',
    zones: [
      { xMin: 0.82, xMax: 0.96, yMin: 0.38, yMax: 0.60 },
      { xMin: 0.56, xMax: 0.72, yMin: 0.04, yMax: 0.18 },
    ],
  },
  {
    kind: 'dots',
    sizeMin: 36,
    color: '--accent-2',
    zones: [
      { xMin: 0.44, xMax: 0.56, yMin: 0.04, yMax: 0.16 },
      { xMin: 0.44, xMax: 0.56, yMin: 0.82, yMax: 0.90 },
    ],
  },
];
