import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { C, F, SAFE, nameGradient } from "../theme";
import { sec, beatAt, T } from "../timing";
import { RiseText } from "../components/RiseText";
import { CoreScene } from "../components/CoreScene";
import { tween } from "../components/ease";

const ROLES = ["Marketer", "Builder", "AI-first", "Shipper"];

// 4.25 → 9.08s. Giant name rises, portrait slides up in front, roles flick on beats.
export function Hero() {
  const frame = useCurrentFrame();
  const base = sec(T.hero);
  const at = (s) => sec(s) - base; // absolute seconds → scene frame
  const portrait = tween(frame, 8, 34);
  const push = interpolate(frame, [0, at(T.stat)], [1.0, 1.06]);
  const roleBeats = [5, 7, 9, 11].map((n) => at(beatAt(n)));
  let role = -1;
  roleBeats.forEach((f, i) => {
    if (frame >= f) role = i;
  });

  return (
    <AbsoluteFill>
      <CoreScene opacity={0.85} y={1.1} scale={1.05} />
      {/* name sits behind the portrait */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, display: "flex", justifyContent: "center" }}>
        <RiseText
          lines={["UMER", "AHMED"]}
          mode="letters"
          start={0}
          stagger={2}
          lineDelay={6}
          dur={26}
          align="center"
          style={{ fontFamily: F.display, fontSize: 330, lineHeight: 0.8, letterSpacing: "-0.01em" }}
          unitStyle={{ background: nameGradient, WebkitBackgroundClip: "text", color: "transparent" }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: -40,
          width: 520,
          height: 940,
          transform: `translateX(-50%) translateY(${(1 - portrait) * 260}px) scale(${push})`,
          transformOrigin: "50% 100%",
          opacity: Math.min(1, portrait * 1.5),
        }}
      >
        <Img src={staticFile("img/portrait.webp")} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "50% 100%" }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 360, background: `linear-gradient(to bottom, transparent, ${C.bg} 85%)` }} />

      {/* top row */}
      <div style={{ position: "absolute", top: SAFE.top, left: SAFE.x, right: SAFE.x, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ position: "relative", height: 100, width: 520, overflow: "hidden" }}>
          {ROLES.map((r, i) => {
            const p = tween(frame, roleBeats[i], 10);
            const gone = i < role ? tween(frame, roleBeats[i + 1], 10) : 0;
            if (i > role) return null;
            return (
              <div
                key={r}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  fontFamily: F.display,
                  fontSize: 96,
                  lineHeight: 1,
                  textTransform: "uppercase",
                  color: i % 2 ? C.violetSoft : C.fg,
                  transform: `translateY(${(1 - p) * 100 - gone * 100}%)`,
                }}
              >
                {r}
              </div>
            );
          })}
        </div>
        <RiseText
          lines={["Marketing brain,", "builder's hands."]}
          start={16}
          stagger={5}
          dur={22}
          align="right"
          style={{ fontFamily: F.sans, fontSize: 34, fontWeight: 500, lineHeight: 1.25, color: C.fg, marginTop: 8 }}
        />
      </div>
    </AbsoluteFill>
  );
}
