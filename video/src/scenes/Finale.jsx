import { AbsoluteFill, useCurrentFrame, spring } from "remotion";
import { C, F, SAFE, nameGradient } from "../theme";
import { CoreScene } from "../components/CoreScene";
import { FlipText, Typewriter, Flash } from "../components/fx";
import { RiseText } from "../components/RiseText";
import { tween, expo, inOut } from "../components/ease";

// 25.98 → 30s. Everything implodes to a point, flashes, bursts, and resolves
// into who / what / where — the URL held long enough to read.
export function Finale() {
  const frame = useCurrentFrame();
  const implode = tween(frame, 0, 9, inOut);
  const burst = tween(frame, 9, 34, expo);
  const shell = frame < 9 ? 1 - implode : 1.35 * burst;
  const btn = spring({ frame: frame - 30, fps: 30, config: { damping: 11, stiffness: 140, mass: 0.8 } });
  const ring = tween(frame, 12, 18, expo);

  return (
    <AbsoluteFill>
      <CoreScene shell={shell} core={frame < 9 ? 1 - implode : 0.55 * burst} orbit={frame * 0.012} tilt={0.3} y={2.2} opacity={0.7} spin={0.6} />
      <Flash at={9} peak={0.55} len={9} color="#ddd6fe" />
      <AbsoluteFill style={{ padding: `0 ${SAFE.x}px`, justifyContent: "center", alignItems: "center", textAlign: "center", marginTop: -40 }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 99,
            border: `1px solid ${C.lineStrong}`,
            display: "grid",
            placeItems: "center",
            fontFamily: F.sans,
            fontWeight: 600,
            fontSize: 30,
            color: C.fg,
            opacity: ring,
            transform: `scale(${0.4 + ring * 0.6}) rotate(${(1 - ring) * -180}deg)`,
            boxShadow: `0 0 ${30 * ring}px rgba(139,92,246,0.5)`,
          }}
        >
          UA
        </div>
        <FlipText
          text="UMER AHMED"
          start={14}
          stagger={1.5}
          dur={16}
          style={{ marginTop: 36, fontFamily: F.display, fontSize: 168, lineHeight: 0.86, letterSpacing: "-0.01em" }}
          letterStyle={{ background: nameGradient, WebkitBackgroundClip: "text", color: "transparent" }}
        />
        <RiseText lines={["Marketing brain, builder's hands."]} start={22} dur={16} align="center" style={{ marginTop: 26, fontFamily: F.sans, fontSize: 40, fontWeight: 500, color: C.fg }} />
        <div
          style={{
            marginTop: 60,
            padding: "26px 52px",
            borderRadius: 99,
            background: C.violet,
            color: "#fff",
            fontFamily: F.sans,
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            boxShadow: `0 20px 70px -10px rgba(139,92,246,0.85)`,
            transform: `scale(${Math.max(0, btn)})`,
          }}
        >
          Hire me for a build ↗
        </div>
        <Typewriter text="umer-ahmed.vercel.app" start={38} cps={32} style={{ marginTop: 40, fontFamily: F.sans, fontSize: 46, fontWeight: 600, color: C.cyan, letterSpacing: "-0.01em" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
