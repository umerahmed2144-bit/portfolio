import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F, SAFE } from "../theme";
import { CoreScene } from "../components/CoreScene";
import { Odometer, FlipText, Glitch } from "../components/fx";
import { beatPulse } from "../components/beat";
import { sec, T } from "../timing";
import { tween, expo } from "../components/ease";

// 9.08 → 11.49s. Glitch in; the core shatters behind a rolling "4".
export function Stat() {
  const frame = useCurrentFrame();
  const global = frame + sec(T.stat);
  const shatter = tween(frame, 0, 46, expo);
  const reveal = tween(frame, 8, 14, expo);
  const pulse = beatPulse(global);

  const layers = (
    <AbsoluteFill style={{ padding: `0 ${SAFE.x}px`, justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 30, marginTop: -60 }}>
        <Odometer
          value={4}
          start={0}
          dur={20}
          size={520}
          digitStyle={{
            fontFamily: F.display,
            lineHeight: 1,
            background: `linear-gradient(180deg, ${C.fg} 25%, ${C.violetSoft} 100%)`,
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        />
        <div style={{ position: "relative", paddingBottom: 34 }}>
          <div style={{ clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`, fontFamily: F.display, fontSize: 150, lineHeight: 0.9, textTransform: "uppercase", color: C.fg }}>
            <div>AI</div>
            <div>products.</div>
          </div>
          {reveal > 0 && reveal < 1 && (
            <div style={{ position: "absolute", top: 0, bottom: 34, left: `${reveal * 100}%`, width: 8, background: C.cyan, boxShadow: `0 0 24px ${C.cyan}` }} />
          )}
        </div>
      </div>
      <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 24 }}>
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 99,
            background: C.cyan,
            boxShadow: `0 0 ${16 + 40 * pulse}px ${C.cyan}`,
            transform: `scale(${tween(frame, 20, 10) * (1 + 0.4 * pulse)})`,
          }}
        />
        <FlipText text="ALL LIVE." start={22} stagger={2} dur={14} style={{ fontFamily: F.display, fontSize: 130, lineHeight: 1, color: C.cyan }} />
      </div>
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill>
      <CoreScene shell={1 + shatter * 0.7} shatter={shatter} core={1.1} orbit={1.4 + frame * 0.03} tilt={0.25} y={0} opacity={0.85} />
      <Glitch at={0} len={6} seed={21} amp={120}>
        {layers}
      </Glitch>
    </AbsoluteFill>
  );
}
