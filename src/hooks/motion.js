export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Hover-driven effects (liquid distortion etc.) only on real pointers, > 768px.
export const canHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 769px)").matches;

// Hero entrance baseline: ~2000ms count + ~500ms of the preloader wipe.
export const REVEAL_DELAY = prefersReducedMotion() ? 0 : 2500;
