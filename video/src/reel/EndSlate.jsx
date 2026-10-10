import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, F, nameGradient } from "../theme";
import { f, barT, S } from "./timing";
import { FlipText, Typewriter, Flash } from "../components/fx";
import { RiseText } from "../components/RiseText";
import { CoreScene } from "../components/CoreScene";
import { Viewfinder } from "./Slate";
import { tween, expo } from "../components/ease";
import { NAME, TAGLINE, URL, CTA } from "./data";

// Outro (15.3 → 21s): everything resolves into name, call to action
// and URL, framed by the opening viewfinder so the loop bookends.
export function EndSlate() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const landscape = width >= height;
  const global = frame + S[7];
  const accent = f(barT(9)) - S[7]; // the outro's last full downbeat (19.4s)
  const frameIn = tween(frame, 0, 12, expo);
  const btn = spring({ frame: frame - 18, fps: 30, config: { damping: 11, stiffness: 150, mass: 0.7 } });
  const nameSize = Math.min(250, width * 0.19);
  return (
    <AbsoluteFill>
      <CoreScene shell={0.4 + 0.7 * tween(frame, 0, 30, expo)} core={0.5} orbit={frame * 0.02} tilt={0.3} y={landscape ? 0 : 2.4} opacity={0.45} spin={0.7} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", transform: `scale(${1.08 - frameIn * 0.08})`, marginTop: landscape ? 0 : 60 }}>
        <FlipText
          text={NAME.toUpperCase()}
          start={2}
          stagger={1.2}
          dur={14}
          style={{ fontFamily: F.display, fontSize: nameSize, lineHeight: 0.86, letterSpacing: "-0.01em" }}
          letterStyle={{ background: nameGradient, WebkitBackgroundClip: "text", color: "transparent" }}
        />
        <RiseText lines={[TAGLINE]} start={10} dur={14} align="center" style={{ marginTop: 24, fontFamily: F.sans, fontSize: landscape ? 44 : 40, fontWeight: 500, color: C.fg }} />
        <div
          style={{
            marginTop: 40,
            padding: "22px 46px",
            borderRadius: 99,
            background: C.violet,
            color: "#fff",
            fontFamily: F.sans,
            fontSize: landscape ? 28 : 30,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            boxShadow: "0 20px 70px -10px rgba(139,92,246,0.85)",
            transform: `scale(${Math.max(0, btn)})`,
          }}
        >
          {CTA} ↗
        </div>
        <Typewriter text={URL} start={24} cps={40} style={{ marginTop: 30, fontFamily: F.sans, fontSize: 46, fontWeight: 600, color: C.cyan }} />
      </AbsoluteFill>
      <Viewfinder frame={global} opacity={frameIn} />
      <Flash at={accent} peak={0.35} len={8} color="#c4b5fd" />
    </AbsoluteFill>
  );
}
