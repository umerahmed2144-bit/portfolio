import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F } from "../theme";
import { f, beatT } from "./timing";
import { tween, expo } from "../components/ease";
import { NAME } from "./data";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

/** Camera-viewfinder chrome: crop marks, safe frame, REC dot, running timecode. */
export function Viewfinder({ frame, opacity = 1, label = `${NAME.toUpperCase()} — SHOWREEL ’26` }) {
  const { width: W, height: H, fps } = useVideoConfig();
  const tc = (n) => String(n).padStart(2, "0");
  const timecode = `00:00:${tc(Math.floor(frame / fps))}:${tc(frame % fps)}`;
  const mark = 54;
  const corner = (x, y, sx, sy) => (
    <div key={`${x}${y}`} style={{ position: "absolute", left: x, top: y, width: mark, height: mark, borderLeft: sx ? `2px solid ${C.fg}` : "none", borderRight: sx ? "none" : `2px solid ${C.fg}`, borderTop: sy ? `2px solid ${C.fg}` : "none", borderBottom: sy ? "none" : `2px solid ${C.fg}`, opacity: 0.8 }} />
  );
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none", fontFamily: mono, fontSize: 22, letterSpacing: "0.08em", color: C.fg }}>
      {corner(60, 60, true, true)}
      {corner(W - 60 - mark, 60, false, true)}
      {corner(60, H - 60 - mark, true, false)}
      {corner(W - 60 - mark, H - 60 - mark, false, false)}
      <div style={{ position: "absolute", left: 140, top: 76, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 16, height: 16, borderRadius: 99, background: "#ff3b4e", opacity: Math.floor(frame / 8) % 2 ? 0.25 : 1, boxShadow: "0 0 14px #ff3b4e" }} />
        REC
      </div>
      <div style={{ position: "absolute", right: 140, top: 76, fontVariantNumeric: "tabular-nums" }}>{timecode}</div>
      <div style={{ position: "absolute", left: 140, bottom: 76, color: C.muted }}>{label}</div>
      <div style={{ position: "absolute", right: 140, bottom: 76, color: C.muted }}>{`${W}×${H} · 30 FPS`}</div>
    </AbsoluteFill>
  );
}

// Pre-roll (0 → 1.05s): film-leader countdown 3·2·1 accelerating into the
// first downbeat, where the kinetic type takes over.
export function Slate() {
  const frame = useCurrentFrame();
  const beats = [0, f(beatT(-1)), f(beatT(-0.5)), f(beatT(0))];
  let k = 0;
  beats.forEach((b, i) => {
    if (frame >= b) k = i;
  });
  const local = frame - beats[k];
  const sweep = Math.min(1, local / ((beats[k + 1] ?? beats[k] + 8) - beats[k]));
  const label = ["3", "2", "1", "1"][k];
  const pop = tween(local, 0, 8, expo);
  const R = 230;
  const circ = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* crosshair */}
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: C.lineStrong }} />
      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: C.lineStrong }} />
      <svg width={R * 2 + 40} height={R * 2 + 40} style={{ position: "absolute" }}>
        <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke={C.lineStrong} strokeWidth={2} />
        <circle cx={R + 20} cy={R + 20} r={R - 40} fill="none" stroke={C.line} strokeWidth={2} />
        {k < 3 && (
          <circle
            cx={R + 20}
            cy={R + 20}
            r={R}
            fill="none"
            stroke={C.violet}
            strokeWidth={10}
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - sweep)}
            transform={`rotate(-90 ${R + 20} ${R + 20})`}
            style={{ filter: `drop-shadow(0 0 12px ${C.violet})` }}
          />
        )}
      </svg>
      <div
        key={k}
        style={{
          fontFamily: F.display,
          fontSize: k === 3 ? 300 : 340,
          lineHeight: 1,
          color: k === 3 ? C.cyan : C.fg,
          transform: `scale(${1.6 - pop * 0.6})`,
          opacity: pop,
          filter: pop < 0.95 ? `blur(${(1 - pop) * 10}px)` : undefined,
        }}
      >
        {label}
      </div>
      <Viewfinder frame={frame} />
    </AbsoluteFill>
  );
}
