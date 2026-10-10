import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { C, F } from "../theme";
import { beatF, stepF } from "./timing";
import { tween, expo } from "../components/ease";
import { PRODUCTS } from "./data";

const G = 20; // gutter

/**
 * One layout per beat: rect [x, y, w, h] per pane (null = not on screen yet).
 * Landscape splits side by side; portrait stacks, so panes stay readable.
 */
function layouts(W, H, landscape) {
  const half = (W - G) / 2;
  const halfH = (H - G) / 2;
  if (landscape) {
    const third = (W - 2 * G) / 3;
    const thirdH = (H - 2 * G) / 3;
    return [
      [[0, 0, W, H], null, null, null],
      [[0, 0, half, H], [half + G, 0, half, H], null, null],
      [[0, 0, half, halfH], [half + G, 0, half, halfH], [0, halfH + G, half, halfH], [half + G, halfH + G, half, halfH]],
      [[0, 0, third * 2 + G, H], [third * 2 + G * 2, 0, third, thirdH], [third * 2 + G * 2, thirdH + G, third, thirdH], [third * 2 + G * 2, (thirdH + G) * 2, third, thirdH]],
    ];
  }
  const third = (W - 2 * G) / 3;
  const big = H * 0.6;
  return [
    [[0, 0, W, H], null, null, null],
    [[0, 0, W, halfH], [0, halfH + G, W, halfH], null, null],
    [[0, 0, half, halfH], [half + G, 0, half, halfH], [0, halfH + G, half, halfH], [half + G, halfH + G, half, halfH]],
    [[0, 0, W, big], [0, big + G, third, H - big - G], [third + G, big + G, third, H - big - G], [(third + G) * 2, big + G, third, H - big - G]],
  ];
}

const lerp = (a, b, p) => a + (b - a) * p;

// Bar 3: the live products, in a split-screen grid that re-flows on every beat.
export function GridMontage() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const landscape = width >= height;
  const M = landscape ? 60 : 84; // outer margin (portrait keeps clear of LinkedIn's UI)
  const top = landscape ? M : 150;
  const W = width - M * 2;
  const H = height - top - (landscape ? M : 190);
  const LAYOUTS = layouts(W, H, landscape);
  const beats = [0, 1, 2, 3].map(stepF);
  let k = 0;
  beats.forEach((b, i) => {
    if (frame >= b) k = i;
  });
  const p = tween(frame - beats[k], 0, 10, expo);
  const from = LAYOUTS[Math.max(0, k - 1)];
  const to = LAYOUTS[k];

  return (
    <AbsoluteFill>
      {PRODUCTS.slice(0, 4).map((pane, i) => {
        const target = to[i];
        if (!target) return null;
        const source = from[i] || target; // new panes appear in place
        const isNew = !from[i] || k === 0;
        const [x, y, w, h] = target.map((v, j) => lerp(source[j], v, p));
        const reveal = isNew ? p : 1;
        const parallax = interpolate(frame, [0, beatF(6)], [-30, 30]) * (i % 2 ? -1 : 1);
        const small = w < 500;
        return (
          <div
            key={pane.name}
            style={{
              position: "absolute",
              left: M + x,
              top: top + y,
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
              src={staticFile(pane.image)}
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
            <div
              style={{
                position: "absolute",
                left: 16,
                bottom: 14,
                padding: small ? "6px 12px" : "8px 16px",
                borderRadius: 99,
                background: "rgba(8,8,10,0.8)",
                border: `1px solid ${C.lineStrong}`,
                fontFamily: F.sans,
                fontWeight: 600,
                fontSize: small ? 18 : 22,
                letterSpacing: "0.06em",
                color: C.fg,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: C.cyan, marginRight: 8 }}>●</span>
              {pane.name}
            </div>
          </div>
        );
      })}
      {/* in portrait the first pane's tagline sits above the grid */}
      {!landscape && k === 0 && (
        <div style={{ position: "absolute", left: M, right: M, top: 70, fontFamily: F.sans, fontWeight: 600, fontSize: 34, color: C.fg, opacity: tween(frame, 2, 8) }}>
          {PRODUCTS[0].tagline}
        </div>
      )}
    </AbsoluteFill>
  );
}
