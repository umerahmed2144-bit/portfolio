import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { CoreScene } from "../components/CoreScene";
import { Flash } from "../components/fx";
import { tween, expo } from "../components/ease";

const NAMES = ["FULFILLIQ", "NURTUREAI", "STUDYFORGE", "RESTOCKIQ", "FULFILLIQ", "NURTUREAI", "STUDYFORGE", "RESTOCKIQ"];

/** Product names on a ring orbiting the core (DOM 3D, preserve-3d). */
function NameRing({ frame, reveal }) {
  const R = 760;
  const step = 360 / NAMES.length;
  const spin = frame * 1.6;
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", perspective: 1500, transformStyle: "preserve-3d" }}>
      <div style={{ transformStyle: "preserve-3d", transform: `rotateX(-16deg) rotateY(${spin}deg)` }}>
        {NAMES.map((n, i) => {
          const a = i * step;
          // dim names on the far side of the ring
          const facing = Math.cos(((a + spin) * Math.PI) / 180);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) rotateY(${a}deg) translateZ(${R}px)`,
                backfaceVisibility: "hidden",
                fontFamily: F.display,
                fontSize: 96,
                lineHeight: 1,
                whiteSpace: "nowrap",
                color: i % 2 ? C.cyan : C.fg,
                opacity: reveal * (0.25 + 0.75 * Math.max(0, facing)),
              }}
            >
              {n}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Bar 2 (3.8 → 5.7s): the drop. Hyperspace decelerates into the orbiting core
// while the product names circle it.
export function DropCore() {
  const frame = useCurrentFrame();
  const settle = tween(frame, 0, 30, expo);
  return (
    <AbsoluteFill>
      <CoreScene warp={1 - settle} travel={settle * 90} shell={0.2 + 0.9 * tween(frame, 6, 26, expo)} core={0.2 + 0.9 * tween(frame, 8, 24, expo)} orbit={frame * 0.03} tilt={0.2} y={0} />
      <NameRing frame={frame} reveal={tween(frame, 10, 16)} />
      <Flash at={0} peak={0.75} len={9} color="#ffffff" />
    </AbsoluteFill>
  );
}
