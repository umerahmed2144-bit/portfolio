import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F } from "../theme";
import { beatF } from "./timing";
import { tween, expo, inOut } from "../components/ease";

const N = 180; // samples around the shape

// Radius at angle a for each shape (unit size).
const polygon = (n, a, rot = 0) => {
  const seg = (2 * Math.PI) / n;
  const x = ((((a + rot) % seg) + seg) % seg) - seg / 2;
  return Math.cos(Math.PI / n) / Math.cos(x);
};
const SHAPES = [
  (a, t) => 1 + 0.13 * Math.sin(3 * a + t * 3) + 0.07 * Math.sin(5 * a - t * 4), // liquid blob
  () => 1, // circle
  (a) => polygon(4, a, Math.PI / 4) * 0.92, // square
  (a) => polygon(3, a, -Math.PI / 2) * 1.08, // triangle
];

const pathFor = (radius, R, cx, cy) =>
  Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2;
    const r = radius(a) * R;
    return `${i ? "L" : "M"}${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`;
  }).join(" ") + "Z";

// Bar 5: one gradient form morphs blob → circle → square → triangle on the
// beats, then collapses into the UA monogram drawing itself.
export function ShapeMorph() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / 30;
  // Morph every three-quarter beat so the monogram gets the back half of the bar.
  const beats = [0, 0.75, 1.5, 2.25].map(beatF);
  let k = 0;
  beats.forEach((b, i) => {
    if (frame >= b) k = i;
  });
  const p = tween(frame - beats[k], 0, 8, expo);
  const from = SHAPES[Math.max(0, k - 1)];
  const to = SHAPES[k];
  const radius = (a) => from(a, t) + (to(a, t) - from(a, t)) * (k === 0 ? 1 : p);

  const collapse = tween(frame, beats[3] + 4, 7, inOut);
  const draw = tween(frame, beats[3] + 6, 11, expo);
  const R = 300 * (1 - collapse) * (1 + 0.05 * Math.sin(t * 6));
  const cx = width / 2;
  const cy = height / 2;
  const spin = frame * 1.2;

  return (
    <AbsoluteFill>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="sm-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={C.violetSoft} />
            <stop offset="0.55" stopColor={C.violet} />
            <stop offset="1" stopColor={C.cyan} />
          </linearGradient>
          <filter id="sm-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
        </defs>
        <g transform={`rotate(${spin} ${cx} ${cy})`}>
          {/* echo outlines trailing the morph */}
          {[1.5, 1.3, 1.15].map((s, i) => (
            <path key={i} d={pathFor(radius, R * s, cx, cy)} fill="none" stroke={i % 2 ? C.cyan : C.violetSoft} strokeOpacity={0.18 + i * 0.08} strokeWidth={2} />
          ))}
          <path d={pathFor(radius, R, cx, cy)} fill="url(#sm-g)" filter="url(#sm-glow)" opacity={0.6} />
          <path d={pathFor(radius, R, cx, cy)} fill="url(#sm-g)" />
        </g>
        {/* the monogram draws itself as the form collapses */}
        {draw > 0 && (
          <g>
            <circle cx={cx} cy={cy} r={170} fill="none" stroke={C.fg} strokeWidth={4} strokeDasharray={1070} strokeDashoffset={1070 * (1 - draw)} transform={`rotate(-90 ${cx} ${cy})`} />
            <text
              x={cx}
              y={cy + 62}
              textAnchor="middle"
              style={{ fontFamily: F.display, fontSize: 180 }}
              fill={C.fg}
              fillOpacity={tween(frame, beats[3] + 12, 8)}
              stroke={C.cyan}
              strokeWidth={3}
              strokeDasharray={700}
              strokeDashoffset={700 * (1 - draw)}
            >
              UA
            </text>
          </g>
        )}
      </svg>
      <div style={{ position: "absolute", left: 140, bottom: 70, fontFamily: F.sans, fontWeight: 600, fontSize: 24, letterSpacing: "0.2em", color: C.muted }}>
        {collapse > 0.5 ? "MONOGRAM" : ["FORM", "CIRCLE", "SQUARE", "TRIANGLE"][k]}
      </div>
    </AbsoluteFill>
  );
}
