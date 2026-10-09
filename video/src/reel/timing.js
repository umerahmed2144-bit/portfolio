import { FPS } from "../theme";

// "Kenji" (Ooyy), 15s Epidemic edit. Measured from the audio (onset
// autocorrelation + a linear fit through the strongest hits): 144 BPM, bars
// every 1.6663s, downbeats on 0.865 + n * BAR. The library's 126 BPM tag
// doesn't match this edit. The drop's riser peaks at 3.31s (beat 3 of bar 1)
// and the first big downbeat lands at 4.198s.
export const BAR = 1.6663;
export const BEAT = BAR / 4;
export const DOWN0 = 0.865;
export const DURATION = 15 * FPS; // 450 frames

export const f = (s) => Math.round(s * FPS);
/** Frames for n beats after a scene start (scenes start on bar lines). */
export const beatF = (n) => f(n * BEAT);
/** Absolute time of bar n (bar 0 = first downbeat). */
export const barT = (n) => DOWN0 + n * BAR;
/** Absolute time of beat n counted from the first downbeat. */
export const beatT = (n) => DOWN0 + n * BEAT;

// Scene starts in frames: slate (with pre-roll) then one scene per bar.
export const S = [0, ...Array.from({ length: 7 }, (_, i) => f(barT(i + 1)))];
