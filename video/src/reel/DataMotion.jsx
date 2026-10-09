import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { beatF } from "./timing";
import { Odometer } from "../components/fx";
import { tween, expo, inOut } from "../components/ease";

const STATS = [
  { value: "4", suffix: "", label: "AI products, live" },
  { value: "550", suffix: "K+", label: "PKR raised · Rizq LSE" },
  { value: "5", suffix: "", label: "step build process" },
];
const STEPS = ["Problem", "Spec", "Build", "Economics", "Ship"];

// Bar 4 (7.6 → 9.5s): numbers roll, bars grow and a line draws, all on beats.
export function DataMotion() {
  const frame = useCurrentFrame();
  const beats = [0, 1, 2, 3].map(beatF);
  const CW = 860;
  const CH = 560;
  const bw = 120;
  const gap = (CW - bw * 5) / 4;
  const line = tween(frame, beats[1], beats[3] - beats[1] + 8, inOut);
  const pts = STEPS.map((_, i) => [i * (bw + gap) + bw / 2, CH - 80 - i * 95]);
  const path = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const len = 1100;

  return (
    <AbsoluteFill style={{ padding: "150px 140px", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
        {STATS.map((s, i) => {
          const p = tween(frame, beats[i], 10, expo);
          return (
            <div key={s.label} style={{ opacity: p, transform: `translateX(${(1 - p) * -80}px)` }}>
              <div style={{ display: "flex", alignItems: "flex-end", fontFamily: F.display, color: C.fg }}>
                <Odometer value={s.value} start={beats[i]} dur={16} size={170} digitStyle={{ fontFamily: F.display, lineHeight: 1, background: `linear-gradient(180deg, ${C.fg} 30%, ${C.violetSoft})`, WebkitBackgroundClip: "text", color: "transparent" }} />
                {s.suffix && <span style={{ fontSize: 170, lineHeight: 1, color: C.violetSoft }}>{s.suffix}</span>}
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
          const p = tween(frame, beats[0] + i * 3, 14, expo);
          const h = (130 + i * 95) * p;
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
