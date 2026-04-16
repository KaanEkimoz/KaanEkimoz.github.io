/**
 * Cross-component event names and localStorage keys for the FX layer.
 *
 * Centralized so a typo in one consumer can't silently break the other end
 * of the pub/sub chain. Import these constants instead of using bare strings
 * — the TypeScript type catches mismatches at compile time.
 *
 * Wiring:
 * - FxToggle writes FX_STORAGE.sound / .cursor and dispatches FX_EVENTS.*Changed
 * - SoundFx listens for FX_EVENTS.soundChanged / .hit / .gameover
 * - CustomCursor listens for FX_EVENTS.cursorChanged
 * - HeroCanvas dispatches FX_EVENTS.hit and .gameover, uses FX_STORAGE.heroBest
 */

export const FX_EVENTS = {
  /** Hero canvas: a shape was destroyed. Payload: none. */
  hit: 'fx:hit',
  /** Hero canvas: a round ended (timer ran out). Payload: none. */
  gameover: 'fx:gameover',
  /** FxToggle: user toggled the sound button. Payload: { on: boolean }. */
  soundChanged: 'fx:sound-changed',
  /** FxToggle: user toggled the cursor button. Payload: { on: boolean }. */
  cursorChanged: 'fx:cursor-changed',
} as const;

export const FX_STORAGE = {
  sound: 'fx-sound',
  cursor: 'fx-cursor',
  heroBest: 'hero-best',
} as const;

export type FxEventName = (typeof FX_EVENTS)[keyof typeof FX_EVENTS];
export type FxStorageKey = (typeof FX_STORAGE)[keyof typeof FX_STORAGE];
