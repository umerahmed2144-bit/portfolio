import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F } from "../theme";
import { beatF, stepF } from "./timing";
import { Odometer } from "../components/fx";
import { tween, expo, inOut } from "../components/ease";

import { STATS, STEPS } from "./data";

// Data: numbers roll on every other beat while the bars grow and the line draws.
export function DataMotion() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const landscape = width >= height;
  const beats = [...[0, 1, 2].map(stepF), beatF(4)]; // [3] = scene end
  const CW = landscape ? 860 : width - 2 * 84;
  const CH = landscape ? 560 : 400;
  const statSize = landscape ? 170 : 118;
  const n = STEPS.length;
  const bw = landscape ? 120 : 130;
  const gap = (CW - bw * n) / (n - 1);
  const rise = (CH - 180) / (n - 1);
  const line = tween(frame, beats[0] + 8, beats[3] - beats[0] - 14, inOut);
  const pts = STEPS.map((_, i) => [i * (bw + gap) + bw / 2, CH - 80 - i * rise]);
  const path = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const len = 1100;

  return (
    <AbsoluteFill
      style={{
        padding: landscape ? "150px 140px" : "130px 84px 200px",
        flexDirection: landscape ? "row" : "column",
        justifyContent: "space-between",
        alignItems: landscape ? "center" : "flex-start",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: landscape ? 44 : 18 }}>
        {STATS.map((s, i) => {
          const p = tween(frame, beats[i], 10, expo);
          return (
            <div key={s.label} style={{ opacity: p, transform: `translateX(${(1 - p) * -80}px)` }}>
              <div style={{ display: "flex", alignItems: "flex-end", fontFamily: F.display, color: C.fg }}>
                <Odometer value={s.value} start={beats[i]} dur={16} size={statSize} digitStyle={{ fontFamily: F.display, lineHeight: 1, background: `linear-gradient(180deg, ${C.fg} 30%, ${C.violetSoft})`, WebkitBackgroundClip: "text", color: "transparent" }} />
                {s.suffix && <span style={{ fontSize: statSize, lineHeight: 1, color: C.violetSoft }}>{s.suffix}</span>}
              </div>
              <div style={{ marginTop: 6, fontFamily: F.sans, fontWeight: 500, fontSize: 28, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <svg width={CW} height={CH + 60} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="dm-bar" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={C.violetDeep} />
            <stop offset="1" stopColor={C.violetSoft} />
          </linearGradient>
        </defs>
        {/* baseline + grid */}
        {[0, 1, 2, 3].map((g) => (
          <line key={g} x1={0} x2={CW * tween(frame, 0, 12, expo)} y1={CH - g * 140} y2={CH - g * 140} stroke={C.line} strokeWidth={2} />
        ))}
        {STEPS.map((s, i) => {
          const p = tween(frame, beats[0] + i * 5, 16, expo);
          const h = (130 + i * rise) * p;
          const x = i * (bw + gap);
          return (
            <g key={s}>
              <rect x={x} y={CH - h} width={bw} height={h} rx={10} fill="url(#dm-bar)" opacity={0.9} />
              <text x={x + bw / 2} y={CH + 44} textAnchor="middle" style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 22, letterSpacing: "0.06em" }} fill={C.muted} opacity={p}>
                {s.toUpperCase()}
              </text>
            </g>
          );
        })}
        <path d={path} fill="none" stroke={C.cyan} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - line)} style={{ filter: `drop-shadow(0 0 10px ${C.cyan})` }} />
        {pts.map(([x, y], i) => {
          const on = line * (STEPS.length - 1) >= i - 0.01;
          return <circle key={i} cx={x} cy={y} r={on ? 12 : 0} fill={C.bg} stroke={C.cyan} strokeWidth={5} />;
        })}
      </svg>
    </AbsoluteFill>
  );
}
