import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, F } from "../theme";
import { stepF } from "./timing";

import { ROLES } from "./data";

// Three faces, one flip every 1.5 beats (SHIP already landed in the kinetic scene).
const WORDS = ROLES.slice(0, 3);
const ROW = 150; // spacing between text rows on a wall

/** One wall of the tunnel: rows of outlined words streaming toward camera. */
function Wall({ frame, style, color }) {
  const shift = (frame * 22) % ROW;
  return (
    <div style={{ position: "absolute", overflow: "hidden", ...style }}>
      <div style={{ transform: `translateY(${shift - ROW}px)` }}>
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            style={{
              height: ROW,
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              fontFamily: F.display,
              fontSize: 120,
              textTransform: "uppercase",
              color: "transparent",
              WebkitTextStroke: `2px ${i % 3 === 0 ? color : C.lineStrong}`,
              transform: `translateX(${(i % 2 ? -1 : 1) * 200}px)`,
            }}
          >
            {`${WORDS.join(" · ")} · ${WORDS.join(" · ")}`}
          </div>
        ))}
      </div>
    </div>
  );
}

// Bar 6: a word cube flips through the roles on each beat inside a tunnel of
// streaming outlined type.
export function TextTunnel() {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const beats = [0, 1, 2].map(stepF);
  // Cube angle springs to the next face on each beat.
  const angle = beats.reduce((acc, b, i) => (i === 0 ? acc : acc + 90 * spring({ frame: frame - b, fps: 30, config: { damping: 12, stiffness: 220, mass: 0.7 } })), 0);
  const D = 3600; // wall depth
  const CUBE = W >= H ? 240 : 200;
  const CW = Math.min(1200, W * 0.88);
  return (
    <AbsoluteFill style={{ perspective: 700, perspectiveOrigin: "50% 50%" }}>
      {/* floor, ceiling, left and right walls: each hinged on a frame edge and swung away into depth */}
      <Wall frame={frame} color={C.violetSoft} style={{ left: 0, top: H, width: W, height: D, transformOrigin: "50% 0", transform: "rotateX(-84deg)" }} />
      <Wall frame={frame} color={C.cyan} style={{ left: 0, top: -D, width: W, height: D, transformOrigin: "50% 100%", transform: "rotateX(84deg)" }} />
      <Wall frame={frame + 7} color={C.violetSoft} style={{ left: -D, top: 0, width: D, height: H, transformOrigin: "100% 50%", transform: "rotateY(-84deg)" }} />
      <Wall frame={frame + 3} color={C.cyan} style={{ left: W, top: 0, width: D, height: H, transformOrigin: "0 50%", transform: "rotateY(84deg)" }} />

      {/* the word cube */}
      <div style={{ position: "absolute", left: "50%", top: "50%", width: CW, height: CUBE, marginLeft: -CW / 2, marginTop: -CUBE / 2, transformStyle: "preserve-3d", transform: `translateZ(-120px) rotateX(${-angle}deg)` }}>
        {WORDS.map((w, i) => (
          <div
            key={w}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backfaceVisibility: "hidden",
              transform: `rotateX(${i * 90}deg) translateZ(${CUBE / 2}px)`,
              background: i % 2 ? C.violet : C.fg,
              color: i % 2 ? C.fg : C.bg,
              fontFamily: F.display,
              fontSize: W >= H ? 200 : 150,
              lineHeight: 1,
              textTransform: "uppercase",
              boxShadow: "0 0 80px rgba(139,92,246,0.45)",
            }}
          >
            {w}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}
