import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { rng, tween, expo } from "./ease";

/** Slow violet / cyan light blobs drifting across the frame. */
export function LightLeak({ strength = 1 }) {
  const f = useCurrentFrame();
  const a = (s) => 50 + 38 * Math.sin(f / s);
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "screen",
        opacity: strength,
        background: `
          radial-gradient(30% 22% at ${a(47)}% ${a(61)}%, rgba(139,92,246,0.20), transparent 70%),
          radial-gradient(26% 20% at ${a(53) * 0.8 + 10}% ${100 - a(71)}%, rgba(34,211,238,0.12), transparent 70%)`,
        pointerEvents: "none",
      }}
    />
  );
}

/** Horizontal-only blur filter, referenced as `url(#hblur-<id>)`. */
export function HBlurDef({ id, amount }) {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <filter id={`hblur-${id}`} x="-30%" y="0" width="160%" height="100%">
        <feGaussianBlur stdDeviation={`${amount} 0`} />
      </filter>
    </svg>
  );
}

/** Per-letter 3D flip in (rotateX from below), optional flip-out. */
export function FlipText({ text, start = 0, stagger = 2, dur = 18, out, outStagger = 1, outDur = 10, style, letterStyle }) {
  const frame = useCurrentFrame();
  return (
    <div style={{ whiteSpace: "nowrap", ...style }}>
      {Array.from(text).map((ch, i) => {
        const p = tween(frame, start + i * stagger, dur);
        const q = out === undefined ? 0 : tween(frame, out + i * outStagger, outDur);
        return (
          <span key={i} style={{ display: "inline-block", perspective: 900 }}>
            <span
              style={{
                display: "inline-block",
                transformOrigin: "50% 100%",
                transform: `translateY(${(1 - p) * 40 - q * 60}%) rotateX(${(1 - p) * -105 + q * 90}deg)`,
                opacity: Math.min(1, p * 1.6) * (1 - q),
                ...letterStyle,
              }}
            >
              {ch === " " ? " " : ch}
            </span>
          </span>
        );
      })}
    </div>
  );
}

/** Letters fly in from scattered positions and assemble; optional scatter-out. */
export function ScatterText({ text, start = 0, dur = 20, out, seed = 1, spread = 1, style, letterStyle }) {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const offs = Array.from(text).map(() => [(r() - 0.5) * 900 * spread, (r() - 0.5) * 700 * spread, (r() - 0.5) * 140, 0.4 + r() * 1.4]);
  return (
    <div style={{ whiteSpace: "nowrap", ...style }}>
      {Array.from(text).map((ch, i) => {
        const [dx, dy, rot, sc] = offs[i];
        const p = tween(frame, start + (i % 3), dur);
        const q = out === undefined ? 0 : tween(frame, out, 9);
        const k = 1 - p + q * 1.2;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translate(${dx * k}px, ${dy * k}px) rotate(${rot * k}deg) scale(${1 + (sc - 1) * k})`,
              opacity: Math.min(1, p * 1.5) * (1 - q),
              filter: k > 0.05 ? `blur(${Math.min(10, k * 14)}px)` : undefined,
              ...letterStyle,
            }}
          >
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </div>
  );
}

/** Slot-machine digits rolling to `value`, with a vertical blur trail. */
export function Odometer({ value, start = 0, dur = 22, size = 200, style, digitStyle }) {
  const frame = useCurrentFrame();
  const digits = String(value).split("");
  return (
    <div style={{ display: "flex", height: size, overflow: "hidden", lineHeight: 1, ...style }}>
      {digits.map((d, i) => {
        const target = Number(d) + 10 * (2 + i); // spin through two full loops
        const p = tween(frame, start + i * 3, dur, expo);
        const pos = target * p;
        const vel = Math.abs(target * (tween(frame + 1, start + i * 3, dur, expo) - p));
        return (
          <div key={i} style={{ height: size, overflow: "hidden" }}>
            <div style={{ transform: `translateY(${-(pos % 10) * size}px)`, filter: vel > 0.15 ? `blur(${Math.min(6, vel * 3)}px)` : undefined }}>
              {Array.from({ length: 11 }, (_, k) => (
                <div key={k} style={{ height: size, fontSize: size, ...digitStyle }}>
                  {k % 10}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Giant outlined text band scrolling across the frame at an angle. */
export function Marquee({ text, y, angle = -10, speed = 6, size = 200, opacity = 0.18, color = C.fg, dir = 1 }) {
  const frame = useCurrentFrame();
  const unit = `${text} · `;
  return (
    <div
      style={{
        position: "absolute",
        left: -400,
        right: -400,
        top: y,
        transform: `rotate(${angle}deg)`,
        overflow: "hidden",
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          whiteSpace: "nowrap",
          fontFamily: F.display,
          fontSize: size,
          lineHeight: 1,
          textTransform: "uppercase",
          color: "transparent",
          WebkitTextStroke: `2px ${color}`,
          transform: `translateX(${dir * frame * speed - 1200}px)`,
        }}
      >
        {unit.repeat(8)}
      </div>
    </div>
  );
}

/** Typewriter with a blinking block cursor. */
export function Typewriter({ text, start = 0, cps = 30, style, cursorColor = C.cyan }) {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - start) / 30) * cps)));
  const blink = Math.floor(frame / 8) % 2 === 0 || n < text.length;
  return (
    <div style={{ whiteSpace: "nowrap", ...style }}>
      {text.slice(0, n)}
      <span style={{ display: "inline-block", width: "0.5em", height: "0.95em", marginLeft: 6, verticalAlign: "-0.12em", background: cursorColor, opacity: frame < start ? 0 : blink ? 1 : 0 }} />
    </div>
  );
}

/**
 * Glitch tear: while active, renders `children` as horizontal slices pushed
 * sideways with colour-tinted ghosts. Use only on DOM layers (not canvas).
 */
export function Glitch({ at, len = 6, seed = 3, amp = 90, children }) {
  const frame = useCurrentFrame();
  const d = frame - at;
  if (d < 0 || d >= len) return <>{children}</>;
  const r = rng(seed + d * 13);
  const bands = 9;
  return (
    <AbsoluteFill>
      {Array.from({ length: bands }, (_, i) => {
        const top = (i / bands) * 100;
        const off = (r() - 0.5) * 2 * amp * (1 - d / len);
        const tint = r() > 0.7;
        return (
          <AbsoluteFill
            key={i}
            style={{
              clipPath: `inset(${top}% 0 ${100 - top - 100 / bands}% 0)`,
              transform: `translateX(${off}px)`,
              filter: tint ? `drop-shadow(${r() > 0.5 ? 8 : -8}px 0 0 ${r() > 0.5 ? C.cyan : "#ff2a6e"})` : undefined,
            }}
          >
            {children}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
}

/** Thin full-frame flash. */
export function Flash({ at, peak = 0.6, len = 10, color = "#c4b5fd" }) {
  const frame = useCurrentFrame();
  const d = frame - at;
  if (d < 0 || d > len) return null;
  const o = d < 2 ? (d / 2) * peak : peak * (1 - (d - 2) / (len - 2));
  return <AbsoluteFill style={{ background: color, opacity: o, mixBlendMode: "screen", pointerEvents: "none" }} />;
}
