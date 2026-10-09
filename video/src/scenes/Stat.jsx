import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C, F, SAFE } from "../theme";
import { RiseText } from "../components/RiseText";
import { tween } from "../components/ease";

// 9.08 → 11.49s. "4 AI products. Live." on the track's section lift.
export function Stat() {
  const frame = useCurrentFrame();
  const n = Math.min(4, Math.floor(interpolate(frame, [0, 14], [0, 4.99], { extrapolateRight: "clamp" })));
  const pop = tween(frame, 0, 18);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 4);
  return (
    <AbsoluteFill style={{ padding: `0 ${SAFE.x}px`, justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 36 }}>
        <div
          style={{
            fontFamily: F.display,
            fontSize: 560,
            lineHeight: 0.8,
            background: `linear-gradient(180deg, ${C.fg} 20%, ${C.violetSoft} 100%)`,
            WebkitBackgroundClip: "text",
            color: "transparent",
            transform: `scale(${0.8 + pop * 0.2})`,
            transformOrigin: "0% 100%",
            filter: `drop-shadow(0 0 ${40 * pop}px rgba(139,92,246,0.55))`,
          }}
        >
          {n}
        </div>
        <RiseText
          lines={["AI", "products."]}
          start={4}
          stagger={4}
          dur={20}
          style={{ fontFamily: F.display, fontSize: 150, lineHeight: 0.9, textTransform: "uppercase", color: C.fg, paddingBottom: 18 }}
        />
      </div>
      <div style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 22, opacity: tween(frame, 16, 14), transform: `translateY(${(1 - tween(frame, 16, 18)) * 30}px)` }}>
        <span style={{ width: 28, height: 28, borderRadius: 99, background: C.cyan, boxShadow: `0 0 ${18 + 22 * pulse}px ${C.cyan}` }} />
        <span style={{ fontFamily: F.display, fontSize: 120, lineHeight: 1, textTransform: "uppercase", color: C.cyan }}>All live.</span>
      </div>
    </AbsoluteFill>
  );
}
