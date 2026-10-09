import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F, SAFE, nameGradient } from "../theme";
import { RiseText } from "../components/RiseText";
import { CoreScene } from "../components/CoreScene";
import { tween } from "../components/ease";

// 25.98 → 30s. Who, what, and where to go — held long enough to read the URL.
export function EndCard() {
  const frame = useCurrentFrame();
  const btn = tween(frame, 18, 18);
  const url = tween(frame, 26, 18);
  const mono = tween(frame, 0, 20);
  return (
    <AbsoluteFill>
      <CoreScene opacity={0.5} y={2.1} scale={0.8} spin={0.6} />
      <AbsoluteFill style={{ padding: `0 ${SAFE.x}px`, justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ width: 96, height: 96, borderRadius: 99, border: `1px solid ${C.lineStrong}`, display: "grid", placeItems: "center", fontFamily: F.sans, fontWeight: 600, fontSize: 30, color: C.fg, opacity: mono, transform: `scale(${0.7 + mono * 0.3})` }}>
          UA
        </div>
        <RiseText
          lines={["UMER AHMED"]}
          mode="letters"
          start={4}
          stagger={1.5}
          dur={22}
          align="center"
          style={{ marginTop: 40, fontFamily: F.display, fontSize: 168, lineHeight: 0.85, letterSpacing: "-0.01em" }}
          lineStyle={{ whiteSpace: "nowrap" }}
          unitStyle={{ background: nameGradient, WebkitBackgroundClip: "text", color: "transparent" }}
        />
        <RiseText
          lines={["Marketing brain, builder's hands."]}
          start={12}
          dur={20}
          align="center"
          style={{ marginTop: 28, fontFamily: F.sans, fontSize: 40, fontWeight: 500, color: C.fg }}
        />
        <div
          style={{
            marginTop: 64,
            padding: "26px 52px",
            borderRadius: 99,
            background: C.violet,
            color: "#fff",
            fontFamily: F.sans,
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            boxShadow: `0 20px 70px -10px rgba(139,92,246,${0.8 * btn})`,
            opacity: btn,
            transform: `translateY(${(1 - btn) * 30}px)`,
          }}
        >
          Hire me for a build ↗
        </div>
        <div style={{ marginTop: 40, fontFamily: F.sans, fontSize: 44, fontWeight: 600, color: C.cyan, letterSpacing: "-0.01em", opacity: url, transform: `translateY(${(1 - url) * 20}px)` }}>
          umer-ahmed.vercel.app
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
