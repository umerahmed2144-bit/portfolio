import { Easing, interpolate } from "remotion";

export const expo = Easing.bezier(0.16, 1, 0.3, 1);
export const quart = Easing.bezier(0.165, 0.84, 0.44, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);

// 0→1 progress of a tween that starts at `from` and lasts `dur` frames.
export const tween = (frame, from, dur, easing = expo) =>
  interpolate(frame, [from, from + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

// Deterministic PRNG so every render is identical.
export const rng = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
