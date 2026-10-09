import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F, SAFE } from "../theme";
import { sec, beatAt, T } from "../timing";
import { CoreScene } from "../components/CoreScene";
import { FlipText, Glitch } from "../components/fx";
import { RiseText } from "../components/RiseText";
import { tween, expo, inOut } from "../components/ease";

const STEPS = ["Find the real problem", "Write the spec", "Build with Claude Code", "Control the economics", "Ship and share"];

// 21.15 → 25.98s. Steps fly in from depth, one per beat, then collapse into
// "Days, not months."
export function Process() {
  const frame = useCurrentFrame();
  const base = sec(T.process);
  const hits = STEPS.map((_, i) => sec(beatAt(32 + i)) - base);
  const collapseAt = sec(beatAt(38)) - base;
  const collapse = tween(frame, collapseAt, 10, inOut);
  const line = tween(frame, hits[0], hits[4] - hits[0] + 8);
  const ROW = 124;

  const steps = (
    <AbsoluteFill style={{ padding: `${SAFE.top + 10}px ${SAFE.x}px 0` }}>
      <RiseText lines={["How I build"]} start={0} dur={14} out={collapseAt} style={{ fontFamily: F.sans, fontSize: 26, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: C.violetSoft }} />
      <div
        style={{
          position: "relative",
          marginTop: 56,
          paddingLeft: 64,
          perspective: 1400,
          transform: `translateY(${collapse * 240}px) scale(${1 - collapse * 0.5})`,
          transformOrigin: "50% 40%",
          opacity: 1 - collapse,
        }}
      >
        <div style={{ position: "absolute", left: 11, top: 18, width: 3, height: ROW * 4 * line, background: `linear-gradient(${C.violet}, ${C.cyan})`, boxShadow: `0 0 18px ${C.violet}` }} />
        {STEPS.map((s, i) => {
          const p = tween(frame, hits[i], 14, expo);
          const last = i === STEPS.length - 1;
          return (
            <div
              key={s}
              style={{
                position: "relative",
                height: ROW,
                display: "flex",
                alignItems: "flex-start",
                gap: 26,
                opacity: Math.min(1, p * 1.4),
                transform: `translateZ(${(1 - p) * -1100}px) rotateX(${(1 - p) * 35}deg) translateY(${(1 - p) * -60}px)`,
                transformOrigin: "0% 50%",
              }}
            >
              <span style={{ position: "absolute", left: -64, top: 8, width: 24, height: 24, borderRadius: 99, background: last ? C.cyan : C.violet, boxShadow: `0 0 20px ${last ? C.cyan : C.violet}` }} />
              <span style={{ fontFamily: F.sans, fontSize: 40, fontWeight: 600, color: last ? C.cyan : C.violet, lineHeight: 1 }}>{`0${i + 1}`}</span>
              <span style={{ fontFamily: F.display, fontSize: 76, lineHeight: 0.95, textTransform: "uppercase", color: C.fg }}>{s}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );

  const payoff = (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <FlipText text="DAYS," start={collapseAt + 4} stagger={2} dur={14} style={{ fontFamily: F.display, fontSize: 230, lineHeight: 0.9, color: C.fg }} />
      <FlipText
        text="NOT MONTHS."
        start={collapseAt + 9}
        stagger={2}
        dur={14}
        style={{ fontFamily: F.display, fontSize: 168, lineHeight: 0.9 }}
        letterStyle={{ background: `linear-gradient(90deg, ${C.violetSoft}, ${C.cyan})`, WebkitBackgroundClip: "text", color: "transparent" }}
      />
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill>
      <CoreScene shell={0.9} core={0.6} orbit={2.4 + frame * 0.02} tilt={-0.2} y={0} opacity={0.35 + collapse * 0.45} dolly={collapse * 2.5} />
      {steps}
      {frame >= collapseAt && (
        <Glitch at={collapseAt + 4} len={5} seed={33} amp={110}>
          {payoff}
        </Glitch>
      )}
    </AbsoluteFill>
  );
}
