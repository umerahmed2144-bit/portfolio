import { AbsoluteFill, useCurrentFrame, spring } from "remotion";
import { C, F } from "../theme";
import { beatF } from "./timing";
import { tween, expo } from "../components/ease";

const display = { fontFamily: F.display, textTransform: "uppercase", lineHeight: 0.86, letterSpacing: "-0.01em" };

/** DESIGN: the word assembles from horizontal slices sliding in from alternating sides. */
function Sliced({ text, local, color }) {
  const bands = 7;
  return (
    <div style={{ position: "relative" }}>
      {Array.from({ length: bands }, (_, i) => {
        const p = tween(local, i * 0.8, 10, expo);
        const dir = i % 2 ? 1 : -1;
        return (
          <div
            key={i}
            aria-hidden={i > 0}
            style={{
              ...display,
              fontSize: 400,
              color,
              position: i === 0 ? "relative" : "absolute",
              inset: 0,
              clipPath: `inset(${(i / bands) * 100}% 0 ${100 - ((i + 1) / bands) * 100}% 0)`,
              transform: `translateX(${(1 - p) * dir * 1400}px)`,
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
}

/** BUILD: letters drop in and stack with a springy bounce. */
function Stacked({ text, local, color, fps }) {
  return (
    <div style={{ display: "flex", ...display, fontSize: 400, color }}>
      {Array.from(text).map((ch, i) => {
        const s = spring({ frame: local - i * 1.5, fps, config: { damping: 9, stiffness: 180, mass: 0.6 } });
        return (
          <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - s) * -900}px) rotate(${(1 - s) * (i % 2 ? 14 : -14)}deg)` }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
}

/** SHIP: slams from 3x with motion blur. */
function Slam({ text, local, color }) {
  const p = tween(local, 0, 9, expo);
  return (
    <div style={{ ...display, fontSize: 460, color, transform: `scale(${3 - p * 2})`, filter: p < 0.97 ? `blur(${(1 - p) * 18}px)` : undefined, opacity: Math.min(1, p * 3) }}>
      {text}
    </div>
  );
}

/** AI-FIRST: outline strokes draw on, then the fill floods in. */
function Outline({ text, local }) {
  const draw = tween(local, 0, 10, expo);
  const fill = tween(local, 6, 8, expo);
  return (
    <svg width="1700" height="420" viewBox="0 0 1700 420" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="kt-g" x1="0" x2="1">
          <stop offset="0" stopColor={C.violetSoft} />
          <stop offset="1" stopColor={C.cyan} />
        </linearGradient>
      </defs>
      <text
        x="850"
        y="350"
        textAnchor="middle"
        style={{ ...display, fontSize: 400 }}
        fill="url(#kt-g)"
        fillOpacity={fill}
        stroke={C.fg}
        strokeWidth={3}
        strokeDasharray={1400}
        strokeDashoffset={1400 * (1 - draw)}
      >
        {text}
      </text>
    </svg>
  );
}

// Bar 1 (1.9 → 3.8s): one word per beat, each with its own technique and a
// full colour swap behind it.
export function KineticType() {
  const frame = useCurrentFrame();
  const beats = [0, 1, 2, 3].map(beatF);
  let k = 0;
  beats.forEach((b, i) => {
    if (frame >= b) k = i;
  });
  const local = frame - beats[k];
  const bg = [C.bg, C.violet, C.fg, C.bg][k];
  const ink = [C.fg, C.bg, C.bg, C.fg][k];
  // The new colour wipes in diagonally on each beat.
  const wipe = tween(local, 0, 6, expo);
  const prevBg = [C.bg, C.bg, C.violet, C.fg][k];
  return (
    <AbsoluteFill style={{ background: prevBg }}>
      <AbsoluteFill style={{ background: bg, clipPath: `polygon(0 0, ${wipe * 140}% 0, ${wipe * 140 - 40}% 100%, 0 100%)` }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {k === 0 && <Sliced text="DESIGN" local={local} color={ink} />}
        {k === 1 && <Stacked text="BUILD" local={local} color={ink} fps={30} />}
        {k === 2 && <Slam text="SHIP" local={local} color={ink} />}
        {k === 3 && <Outline text="AI-FIRST" local={local} />}
      </AbsoluteFill>
      {/* beat counter */}
      <div style={{ position: "absolute", left: 140, bottom: 70, fontFamily: F.sans, fontWeight: 600, fontSize: 24, letterSpacing: "0.2em", color: ink, opacity: 0.7 }}>
        {`0${k + 1} / 04`}
      </div>
    </AbsoluteFill>
  );
}
