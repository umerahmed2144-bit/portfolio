import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F, SAFE } from "../theme";
import { sec, beatAt, T } from "../timing";
import { RiseText } from "../components/RiseText";
import { tween } from "../components/ease";

const STEPS = ["Find the real problem", "Write the spec", "Build with Claude Code", "Control the economics", "Ship and share"];

// 21.15 → 25.98s. One step per beat along a growing violet line.
export function Process() {
  const frame = useCurrentFrame();
  const base = sec(T.process);
  const hits = STEPS.map((_, i) => sec(beatAt(32 + i)) - base);
  const lineP = tween(frame, hits[0], hits[4] - hits[0] + 8);
  const ROW = 128;
  return (
    <AbsoluteFill style={{ padding: `${SAFE.top + 20}px ${SAFE.x}px 0` }}>
      <RiseText lines={["How I build"]} start={0} dur={16} style={{ fontFamily: F.sans, fontSize: 26, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: C.violetSoft }} />
      <div style={{ position: "relative", marginTop: 60, paddingLeft: 64 }}>
        <div style={{ position: "absolute", left: 11, top: 18, width: 2, height: ROW * 4 * lineP, background: `linear-gradient(${C.violet}, ${C.cyan})`, boxShadow: `0 0 16px ${C.violet}` }} />
        {STEPS.map((s, i) => {
          const p = tween(frame, hits[i], 16);
          const last = i === STEPS.length - 1;
          return (
            <div key={s} style={{ position: "relative", height: ROW, display: "flex", alignItems: "flex-start", gap: 28, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
              <span style={{ position: "absolute", left: -64, top: 8, width: 24, height: 24, borderRadius: 99, background: last ? C.cyan : C.violet, boxShadow: `0 0 18px ${last ? C.cyan : C.violet}`, transform: `scale(${p})` }} />
              <span style={{ fontFamily: F.sans, fontSize: 40, fontWeight: 600, color: last ? C.cyan : C.violet, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{`0${i + 1}`}</span>
              <span style={{ fontFamily: F.display, fontSize: 76, lineHeight: 0.95, textTransform: "uppercase", color: C.fg }}>{s}</span>
            </div>
          );
        })}
      </div>
      <RiseText
        lines={[{ text: "Days, not months.", style: { color: C.cyan } }]}
        start={hits[4] + 8}
        dur={22}
        style={{ marginTop: 40, fontFamily: F.sans, fontSize: 46, fontWeight: 600, letterSpacing: "-0.01em" }}
      />
    </AbsoluteFill>
  );
}
