import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, F, SAFE } from "../theme";
import { sec, T } from "../timing";
import { CoreScene } from "../components/CoreScene";
import { FlipText, Flash } from "../components/fx";
import { tween, expo } from "../components/ease";

const accelIn = Easing.bezier(0.7, 0, 0.84, 0);

// 0 → 4.25s. Hyperspace settles into the core, the claim flips in, then
// "I SHIP IT." slams on the bar and the camera dives through the full stop.
export function WarpOpen() {
  const frame = useCurrentFrame();
  const hit = sec(T.shipIt);
  const end = sec(T.hero);
  const settle = tween(frame, 0, 46, expo);
  // Starts 2 frames early so the slam is already landing on the beat.
  const slam = tween(frame, hit - 2, 10, expo);
  const dive = interpolate(frame, [end - 22, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: accelIn });

  const display = { fontFamily: F.display, textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 0.9 };

  return (
    <AbsoluteFill>
      <CoreScene
        warp={1 - settle}
        travel={settle * 70}
        shell={0.15 + 0.85 * tween(frame, 18, 30, expo)}
        core={tween(frame, 26, 26, expo)}
        orbit={frame * 0.012}
        dolly={dive * 4}
        opacity={1 - dive * 0.6}
      />

      {/* the claim */}
      <div style={{ position: "absolute", left: SAFE.x, top: 380 }}>
        {/* clears completely just before the hit */}
        <FlipText text="I DON'T JUST" start={8} stagger={1.5} dur={16} out={hit - 9} outStagger={0.3} outDur={6} style={{ ...display, fontSize: 132, color: C.fg }} />
        <FlipText text="TALK ABOUT AI." start={14} stagger={1.5} dur={16} out={hit - 8} outStagger={0.3} outDur={6} style={{ ...display, fontSize: 132, color: C.fg }} />
      </div>

      {/* the slam */}
      {frame >= hit - 2 && (
        <div
          style={{
            position: "absolute",
            left: SAFE.x,
            top: 420,
            ...display,
            fontSize: 270,
            transform: `scale(${1.7 - slam * 0.7}) scale(${1 + dive * 0.15})`,
            transformOrigin: "0% 50%",
            filter: slam < 0.98 ? `blur(${(1 - slam) * 14}px)` : undefined,
            opacity: Math.min(1, slam * 2),
          }}
        >
          <div style={{ color: C.fg, opacity: 1 - dive }}>I SHIP</div>
          <div>
            <span style={{ background: `linear-gradient(90deg, ${C.violetSoft}, ${C.cyan})`, WebkitBackgroundClip: "text", color: "transparent", opacity: 1 - dive }}>IT</span>
            <span style={{ color: C.violetSoft }}>.</span>
          </div>
        </div>
      )}
      {/* the full stop opens into a violet circle that fills the frame (match cut into the core).
          (276, 882) is where Anton draws the stop at this size, measured from a render. */}
      {dive > 0 && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, ${C.violetSoft}, ${C.violet})`,
            clipPath: `circle(${22 + dive * 1700}px at 276px 882px)`,
          }}
        />
      )}
      <Flash at={hit} peak={0.5} len={8} />
    </AbsoluteFill>
  );
}
