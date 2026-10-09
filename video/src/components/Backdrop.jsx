import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

// Near-black base, soft violet/cyan glows, vignette and animated film grain.
export function Backdrop({ glow = 1, glowX = 50, glowY = 78 }) {
  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(55% 40% at ${glowX}% ${glowY}%, rgba(139,92,246,${0.22 * glow}), transparent 70%),
          radial-gradient(40% 30% at ${100 - glowX}% 12%, rgba(34,211,238,${0.07 * glow}), transparent 70%),
          ${C.bg}`,
      }}
    />
  );
}

export function Finish() {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill
        style={{
          background: "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay", pointerEvents: "none" }}>
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 12} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
    </>
  );
}
