import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { tween, inOut } from "./ease";

/**
 * A violet panel with a cyan leading edge that sweeps up across the frame,
 * fully covering it at `at` — place cuts exactly on that frame.
 */
export function MaskWipe({ at, half = 7 }) {
  const frame = useCurrentFrame();
  if (frame < at - half || frame > at + half) return null;
  const pin = tween(frame, at - half, half, inOut); // 0→1 covering
  const pout = tween(frame, at, half, inOut); // 0→1 revealing
  const bottom = (1 - pin) * 100; // panel's top edge rises from 100% to 0%
  const top = pout * 100;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${frame < at ? bottom : 0}%`,
          bottom: `${frame < at ? 0 : top}%`,
          background: `linear-gradient(180deg, ${C.violet}, ${C.violetDeep})`,
          boxShadow: `0 0 60px ${C.violet}`,
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: frame < at ? 0 : "auto", bottom: frame < at ? "auto" : 0, height: 6, background: C.cyan, boxShadow: `0 0 24px ${C.cyan}` }} />
      </div>
    </AbsoluteFill>
  );
}
