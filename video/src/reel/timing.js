import { FPS } from "../theme";

// "Kenji", 21s Epidemic edit (drop region pinned at 3.81s). The grid is
// measured from the audio, not the library tag: the accents repeat every
// 2.042s (117.5 BPM), the energy step lands on beat 6 and the music falls
// away into its outro on beat 28 (~15.3s).
export const BEAT = 0.5105;
export const BAR = BEAT * 4;
export const DOWN0 = 1.049;
export const DURATION = 21 * FPS; // 630 frames

export const f = (s) => Math.round(s * FPS);
/** Frames for n beats after a scene start (scenes start on beat lines). */
export const beatF = (n) => f(n * BEAT);
/** Frames for the nth change in a scene: changes land every 1.5 beats, with the track's syncopation. */
export const stepF = (n) => beatF(n * 1.5);
/** Absolute time of bar n (bar 0 = first downbeat). */
export const barT = (n) => DOWN0 + n * BAR;
/** Absolute time of beat n counted from the first downbeat. */
export const beatT = (n) => DOWN0 + n * BEAT;

// Scene starts in beats: kinetic 0, drop 6 (energy step), grid 10, data 16,
// shape 20, tunnel 24, end slate 28 (the outro). The slate is the pre-roll.
export const START_BEATS = [0, 6, 10, 16, 20, 24, 28];

// Scene starts in frames: [slate, kinetic, drop, grid, data, shape, tunnel, end].
export const S = [0, ...START_BEATS.map((b) => f(beatT(b)))];
