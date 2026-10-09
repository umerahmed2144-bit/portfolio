import { FPS } from "./theme";

// Beat grid measured from the music edit (librosa beat tracking + onset fit):
// one beat every 0.6037s, phase-locked to the strong hits at 1.23s / 2.44s.
// Bars are four beats; downbeats fall on 1.834 + n * 2.415s.
export const BEAT = 0.6037;
export const BAR = BEAT * 4;
export const DOWNBEAT0 = 1.834;

export const sec = (s) => Math.round(s * FPS);
export const beatAt = (n) => DOWNBEAT0 + n * BEAT; // n can be negative
export const barAt = (n) => DOWNBEAT0 + n * BAR;

export const DURATION = sec(30);

// Scene boundaries, all on bar lines.
export const T = {
  shipIt: barAt(0), // 1.83s  "I ship it." hit
  hero: barAt(1), // 4.25s
  stat: barAt(3), // 9.08s  section lift in the track
  products: barAt(4), // 11.49s
  process: barAt(8), // 21.15s
  end: barAt(10), // 25.98s
};
