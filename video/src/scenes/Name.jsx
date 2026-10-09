import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F, SAFE, nameGradient } from "../theme";
import { sec, beatAt, T } from "../timing";
import { CoreScene } from "../components/CoreScene";
import { FlipText, Marquee, Typewriter, Glitch } from "../components/fx";
import { tween, expo, inOut } from "../components/ease";

const ROLES = ["Marketer", "Builder", "AI-first", "Shipper"];

/** A word that flips over like a cube face on each change. */
function RoleCube({ changes }) {
  const frame = useCurrentFrame();
  let k = -1;
  changes.forEach((f, i) => {
    if (frame >= f) k = i;
  });
  const p = k < 0 ? 0 : tween(frame, changes[k], 9, inOut);
  const face = (i, angle) => (
    <div
      key={i}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backfaceVisibility: "hidden",
        transform: `rotateX(${angle}deg) translateZ(55px)`,
        fontFamily: F.display,
        fontSize: 104,
        lineHeight: 1,
        textTransform: "uppercase",
        color: i % 2 ? C.cyan : C.fg,
      }}
    >
      {ROLES[i]}
    </div>
  );
  return (
    <div style={{ width: 700, height: 110, perspective: 900, margin: "0 auto" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transform: `translateZ(-55px)` }}>
        {k > 0 && face(k - 1, -90 * p)}
        {k >= 0 && face(k, 90 - 90 * p)}
      </div>
    </div>
  );
}

// 4.25 → 9.08s. Iris out of the violet dot into the orbiting core; the name
// flips in over diagonal marquees; roles cube-flip on beats.
export function Name() {
  const frame = useCurrentFrame();
  const base = sec(T.hero);
  const len = sec(T.stat) - base;
  const iris = tween(frame, 0, 14, expo);
  const burst = tween(frame, 0, 34, expo);
  const changes = [5, 7, 9, 11].map((n) => sec(beatAt(n)) - base);

  const layers = (
    <AbsoluteFill>
      <Marquee text="Marketer · Builder · AI-first · Shipper" y={150} angle={-9} speed={7} size={190} opacity={0.16} />
      <Marquee text="Marketing brain · Builder's hands" y={1010} angle={-9} speed={6} size={150} opacity={0.14} color={C.cyan} dir={-1} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center" }}>
        <FlipText
          text="UMER"
          start={8}
          stagger={3}
          dur={18}
          style={{ fontFamily: F.display, fontSize: 320, lineHeight: 0.82, letterSpacing: "-0.01em" }}
          letterStyle={{ background: nameGradient, WebkitBackgroundClip: "text", color: "transparent" }}
        />
        <FlipText
          text="AHMED"
          start={16}
          stagger={3}
          dur={18}
          style={{ fontFamily: F.display, fontSize: 320, lineHeight: 0.82, letterSpacing: "-0.01em" }}
          letterStyle={{ background: nameGradient, WebkitBackgroundClip: "text", color: "transparent" }}
        />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 930 }}>
        <RoleCube changes={changes} />
      </div>
      <div style={{ position: "absolute", left: SAFE.x, right: SAFE.x, top: 1080, display: "flex", justifyContent: "center" }}>
        <Typewriter text="Marketing brain, builder's hands." start={34} cps={34} style={{ fontFamily: F.sans, fontSize: 40, fontWeight: 500, color: C.fg }} />
      </div>
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill>
      <CoreScene shell={0.3 + 0.75 * burst} core={0.3 + 0.75 * burst} orbit={0.6 + frame * 0.018} tilt={0.18} y={0} opacity={0.95} />
      <Glitch at={len - 5} len={5} seed={9}>
        {layers}
      </Glitch>
      {/* the violet dot from the open, closing to a point on the core */}
      {iris < 1 && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, ${C.violetSoft}, ${C.violet})`,
            clipPath: `circle(${(1 - iris) * 120}% at 50% 50%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
}
