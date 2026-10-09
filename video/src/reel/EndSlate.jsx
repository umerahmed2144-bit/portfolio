import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F, nameGradient } from "../theme";
import { f, barT, S } from "./timing";
import { FlipText, Typewriter, Flash } from "../components/fx";
import { RiseText } from "../components/RiseText";
import { CoreScene } from "../components/CoreScene";
import { Viewfinder } from "./Slate";
import { tween, expo } from "../components/ease";

// Final bar → end (12.53 → 15s): everything resolves into the name and URL,
// framed by the same viewfinder as the opening slate so the loop bookends.
export function EndSlate() {
  const frame = useCurrentFrame();
  const global = frame + S[7];
  const accent = f(barT(8)) - S[7]; // last downbeat (14.2s)
  const frameIn = tween(frame, 0, 12, expo);
  return (
    <AbsoluteFill>
      <CoreScene shell={0.4 + 0.7 * tween(frame, 0, 30, expo)} core={0.5} orbit={frame * 0.02} tilt={0.3} y={0} opacity={0.45} spin={0.7} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", transform: `scale(${1.08 - frameIn * 0.08})` }}>
        <FlipText
          text="UMER AHMED"
          start={2}
          stagger={1.2}
          dur={14}
          style={{ fontFamily: F.display, fontSize: 250, lineHeight: 0.86, letterSpacing: "-0.01em" }}
          letterStyle={{ background: nameGradient, WebkitBackgroundClip: "text", color: "transparent" }}
        />
        <RiseText lines={["Marketing brain, builder's hands."]} start={12} dur={14} align="center" style={{ marginTop: 26, fontFamily: F.sans, fontSize: 44, fontWeight: 500, color: C.fg }} />
        <Typewriter text="umer-ahmed.vercel.app" start={22} cps={36} style={{ marginTop: 30, fontFamily: F.sans, fontSize: 48, fontWeight: 600, color: C.cyan }} />
      </AbsoluteFill>
      <Viewfinder frame={global} opacity={frameIn} />
      <Flash at={accent} peak={0.35} len={8} color="#c4b5fd" />
    </AbsoluteFill>
  );
}
