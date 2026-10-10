import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useBeat } from "./beat";

/**
 * Global camera rig. Every scene sits inside it, so the whole frame:
 *  - punches in a touch on each beat and harder on downbeats
 *  - shakes and splits colour (red/cyan fringes) on accent hits
 * The beat grid comes from BeatContext, so each composition uses its own track.
 */
export function Camera({ children, strength = 1, beatStrength = strength, hitStrength = strength }) {
  const frame = useCurrentFrame();
  const { beatPulse, downbeatPulse, hitEnvelope } = useBeat();
  const hit = Math.min(hitEnvelope(frame), 1.4) * hitStrength;
  const zoom = 1 + (0.01 * beatPulse(frame) + 0.022 * downbeatPulse(frame)) * beatStrength + 0.03 * hit;
  // Deterministic shake: two incommensurate sines scaled by the hit envelope.
  const sx = Math.sin(frame * 2.7) * 14 * hit;
  const sy = Math.cos(frame * 3.3) * 10 * hit;
  const rot = Math.sin(frame * 1.9) * 0.6 * hit;
  const split = Math.round(10 * hit);
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${sx}px, ${sy}px) scale(${zoom}) rotate(${rot}deg)`,
        filter:
          split > 0
            ? `drop-shadow(${split}px 0 0 rgba(255,40,110,0.65)) drop-shadow(${-split}px 0 0 rgba(34,211,238,0.65))`
            : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
}
