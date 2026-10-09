import { FPS } from "../theme";
import { BEAT, DOWNBEAT0, T, barAt, beatAt } from "../timing";

// Position of a frame relative to the measured beat grid.
const locate = (frame) => {
  const t = frame / FPS;
  const n = Math.floor((t - DOWNBEAT0) / BEAT);
  return { t, n, dt: t - (DOWNBEAT0 + n * BEAT) };
};

// Music-driven section where beat reactions are on (after the first hit,
// before the outro fade).
const live = (t) => t >= 1.8 && t < T.end + 0.2;

/** 1 on every beat, decaying exponentially. */
export const beatPulse = (frame, decay = 0.16) => {
  const { t, dt } = locate(frame);
  return live(t) ? Math.exp(-dt / decay) : 0;
};

/** 1 on every downbeat (bar start), decaying more slowly. */
export const downbeatPulse = (frame, decay = 0.32) => {
  const { t, n, dt } = locate(frame);
  if (!live(t)) return 0;
  const k = ((n % 4) + 4) % 4;
  return Math.exp(-(k * BEAT + dt) / decay);
};

/**
 * Accent hits in seconds with a strength. The camera shakes, punches and
 * splits colour on these; they sit on real onsets / cuts in the track.
 */
export const HITS = [
  [1.23, 0.35],
  [T.shipIt, 1],
  [T.hero, 0.7],
  [T.stat, 1],
  [barAt(4), 0.8],
  [barAt(5), 0.8],
  [barAt(6), 0.8],
  [barAt(7), 0.8],
  [T.process, 0.7],
  [beatAt(36), 0.5],
  [T.end, 1],
];

/** Sum of decaying hit envelopes at a frame (0..~1). */
export const hitEnvelope = (frame, decayFrames = 5) =>
  HITS.reduce((acc, [s, w]) => {
    const d = frame - Math.round(s * FPS);
    return d >= 0 && d < decayFrames * 6 ? acc + w * Math.exp(-d / decayFrames) : acc;
  }, 0);
