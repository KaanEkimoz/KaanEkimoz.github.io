/**
 * Type definitions for the hero target-practice mini-game. Pure data —
 * no runtime coupling, so splitting this out of HeroCanvas.astro just
 * makes types grep-able and shrinks the component file without any
 * behavioral effect.
 */

export type ShapeKind = 'triangle' | 'circle' | 'hexagon' | 'square' | 'dots';

export type Zone = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export type KindDef = {
  kind: ShapeKind;
  zones: Zone[];
  /** The current base size for this kind. Runtime randomizes up to ~1.4×. */
  sizeMin: number;
  /** CSS custom-property name (e.g. "--accent-1") resolved at init time. */
  color: string;
};

export type Shape = {
  kind: ShapeKind;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  phaseX: number;
  phaseY: number;
  freqX: number;
  freqY: number;
  ampX: number;
  ampY: number;
  rot: number;
  vrot: number;
  fleeX: number;
  fleeY: number;
  size: number;
  color: string;
  opacity: number;
  alive: boolean;
  respawnAt: number;
  entering: boolean;
  entryFromX: number;
  entryFromY: number;
  entryStart: number;
  pulse: number;
  hitCooldownUntil: number;
  /** true = respawns forever (base pool or bonus), false = one-shot clone. */
  permanent: boolean;
};

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  color: string;
  size: number;
};

export type Shockwave = {
  x: number;
  y: number;
  radius: number;
  life: number;
  color: string;
};
