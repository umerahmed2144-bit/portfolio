import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, F } from "../theme";
import { beatF } from "./timing";
import { tween, expo } from "../components/ease";

const display = { fontFamily: F.display, textTransform: "uppercase", lineHeight: 0.86, letterSpacing: "-0.01em" };

/** DESIGN: the word assembles from horizontal slices sliding in from alternating sides. */
function Sliced({ text, local, color, size }) {
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
              fontSize: size,
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
function Stacked({ text, local, color, fps, size }) {
  return (
    <div style={{ display: "flex", ...display, fontSize: size, color }}>
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
function Slam({ text, local, color, size }) {
  const p = tween(local, 0, 9, expo);
  return (
    <div style={{ ...display, fontSize: size, color, transform: `scale(${3 - p * 2})`, filter: p < 0.97 ? `blur(${(1 - p) * 18}px)` : undefined, opacity: Math.min(1, p * 3) }}>
      {text}
    </div>
  );
}

// Intro (1.05 → 4.1s): one word every two beats, each with its own technique and a
// full colour swap behind it.
export function KineticType() {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  // Anton is ~0.5em per letter: keep the longest word inside the frame.
  const big = Math.min(400, width * 0.31);
  const beats = [0, 2, 4].map(beatF); // one word every two beats of the intro
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
        {k === 0 && <Sliced text="DESIGN" local={local} color={ink} size={big} />}
        {k === 1 && <Stacked text="BUILD" local={local} color={ink} fps={30} size={big} />}
        {k === 2 && <Slam text="SHIP" local={local} color={ink} size={Math.min(460, width * 0.42)} />}
      </AbsoluteFill>
      {/* beat counter */}
      <div style={{ position: "absolute", left: 140, bottom: 70, fontFamily: F.sans, fontWeight: 600, fontSize: 24, letterSpacing: "0.2em", color: ink, opacity: 0.7 }}>
        {`0${k + 1} / 03`}
      </div>
    </AbsoluteFill>
  );
}
