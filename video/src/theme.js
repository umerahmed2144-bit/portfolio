// Mirrors the site's tokens (src/styles/global.css in the portfolio).
export const C = {
  bg: "#08080a",
  fg: "#f3f1ea",
  surface: "#111114",
  surface2: "#17171b",
  muted: "#807f78",
  line: "rgba(243,241,234,0.12)",
  lineStrong: "rgba(243,241,234,0.24)",
  violet: "#8b5cf6",
  violetSoft: "#a78bfa",
  violetDeep: "#6d28d9",
  cyan: "#22d3ee",
};

export const F = {
  display: "Anton, Impact, sans-serif",
  sans: "Onest, system-ui, sans-serif",
};

export const W = 1080;
export const H = 1350;
export const FPS = 30;
// Keep copy inside this frame (LinkedIn overlays UI near the bottom).
export const SAFE = { x: 84, top: 110, bottom: 170 };

export const nameGradient = `linear-gradient(180deg, #c4b5fd 0%, ${C.violet} 45%, ${C.violetDeep} 72%, ${C.cyan} 118%)`;
