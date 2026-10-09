import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C, F, SAFE } from "../theme";
import { sec, T } from "../timing";
import { RiseText } from "../components/RiseText";
import { CoreScene } from "../components/CoreScene";
import { tween } from "../components/ease";

// 0 → 4.25s. "I don't just talk about AI." then, on the bar, "I ship it."
export function ColdOpen() {
  const frame = useCurrentFrame();
  const hit = sec(T.shipIt);
  const flash = interpolate(frame, [hit, hit + 2, hit + 10], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const punch = tween(frame, hit, 16);
  return (
    <AbsoluteFill>
      <CoreScene opacity={interpolate(frame, [0, 40], [0, 0.55], { extrapolateRight: "clamp" })} y={0.2} zoom={interpolate(frame, [0, 130], [0, 1.6])} />
      <AbsoluteFill style={{ padding: `0 ${SAFE.x}px`, justifyContent: "center" }}>
        <RiseText
          lines={["I don't just", "talk about AI."]}
          start={6}
          stagger={6}
          dur={24}
          out={hit - 2}
          outDur={10}
          style={{ fontFamily: F.display, fontSize: 132, lineHeight: 0.95, color: C.fg, textTransform: "uppercase", letterSpacing: "-0.01em", position: "absolute", top: 380, left: SAFE.x }}
        />
        <div
          style={{
            position: "absolute",
            left: SAFE.x,
            top: 470,
            fontFamily: F.display,
            fontSize: 250,
            lineHeight: 0.9,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            opacity: frame >= hit ? 1 : 0,
            transform: `scale(${1.25 - punch * 0.25}) translateY(${(1 - punch) * 30}px)`,
            transformOrigin: "0% 60%",
            filter: `blur(${(1 - punch) * 8}px)`,
          }}
        >
          <div style={{ color: C.fg }}>I ship</div>
          <div style={{ background: `linear-gradient(90deg, ${C.violetSoft}, ${C.cyan})`, WebkitBackgroundClip: "text", color: "transparent" }}>it.</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: C.violetSoft, opacity: flash, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
}
