import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { C, F } from "../theme";
import { beatF } from "./timing";
import { tween, expo } from "../components/ease";

const PANES = [
  { name: "FulfillIQ", src: "img/fulfilliq-1.jpg" },
  { name: "NurtureAI", src: "img/nurtureai-2.jpg" },
  { name: "StudyForge", src: "img/studyforge-1.jpg" },
  { name: "RestockIQ", src: "img/restockiq-1.jpg" },
];

const M = 60; // outer margin
const G = 20; // gutter
const W = 1920 - M * 2;
const H = 1080 - M * 2;
const half = (W - G) / 2;
const halfH = (H - G) / 2;
const third = (W - 2 * G) / 3;
const thirdH = (H - 2 * G) / 3;

// One layout per beat: rect [x, y, w, h] per pane (null = not yet on screen).
const LAYOUTS = [
  [[0, 0, W, H], null, null, null],
  [[0, 0, half, H], [half + G, 0, half, H], null, null],
  [[0, 0, half, halfH], [half + G, 0, half, halfH], [0, halfH + G, half, halfH], [half + G, halfH + G, half, halfH]],
  [[0, 0, third * 2 + G, H], [third * 2 + G * 2, 0, third, thirdH], [third * 2 + G * 2, thirdH + G, third, thirdH], [third * 2 + G * 2, (thirdH + G) * 2, third, thirdH]],
];

const lerp = (a, b, p) => a + (b - a) * p;

// Bar 3 (5.7 → 7.6s): the work, in a split-screen grid that re-flows on every beat.
export function GridMontage() {
  const frame = useCurrentFrame();
  const beats = [0, 1, 2, 3].map(beatF);
  let k = 0;
  beats.forEach((b, i) => {
    if (frame >= b) k = i;
  });
  const p = tween(frame - beats[k], 0, 10, expo);
  const from = LAYOUTS[Math.max(0, k - 1)];
  const to = LAYOUTS[k];

  return (
    <AbsoluteFill>
      {PANES.map((pane, i) => {
        const target = to[i];
        if (!target) return null;
        const source = from[i] || target; // new panes appear in place
        const isNew = !from[i] || k === 0;
        const [x, y, w, h] = target.map((v, j) => lerp(source[j], v, p));
        const reveal = isNew ? p : 1;
        const parallax = interpolate(frame, [0, 58], [-30, 30]) * (i % 2 ? -1 : 1);
        return (
          <div
            key={pane.name}
            style={{
              position: "absolute",
              left: M + x,
              top: M + y,
              width: w,
              height: h,
              overflow: "hidden",
              borderRadius: 18,
              background: C.surface,
              boxShadow: "0 30px 80px -30px rgba(139,92,246,0.6)",
              clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0 round 18px)`,
            }}
          >
            <Img
              src={staticFile(pane.src)}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 1800,
                height: 1125,
                objectFit: "cover",
                objectPosition: "50% 0%",
                transform: `translate(calc(-50% + ${parallax}px), -50%) scale(${Math.max(w / 1800, h / 1125) * 1.08})`,
              }}
            />
            <div style={{ position: "absolute", left: 18, bottom: 16, padding: "8px 16px", borderRadius: 99, background: "rgba(8,8,10,0.78)", border: `1px solid ${C.lineStrong}`, fontFamily: F.sans, fontWeight: 600, fontSize: 22, letterSpacing: "0.08em", color: C.fg }}>
              <span style={{ color: C.cyan, marginRight: 10 }}>●</span>
              {pane.name}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
