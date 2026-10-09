import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { C, F, SAFE, FPS } from "../theme";
import { BAR } from "../timing";
import { ScatterText, Marquee, Odometer, HBlurDef } from "../components/fx";
import { RiseText } from "../components/RiseText";
import { beatPulse } from "../components/beat";
import { tween, inOut } from "../components/ease";

export const PRODUCTS = [
  {
    name: "FulfillIQ",
    line: "Can I deliver this order on time?",
    sub: "Order promising for small manufacturers",
    url: "fulfilliq-three.vercel.app",
    images: ["img/fulfilliq-1.jpg", "img/fulfilliq-3.jpg"],
  },
  {
    name: "NurtureAI",
    line: "Understand how your child learns.",
    sub: "Child development · EN / Urdu / Roman Urdu",
    url: "nurture-ai-kappa.vercel.app",
    images: ["img/nurtureai-1.jpg", "img/nurtureai-2.jpg"],
  },
  {
    name: "StudyForge",
    line: "Messy notes → a day-by-day study plan.",
    sub: "Claude API · no sign-up",
    url: "studyforge-flax.vercel.app",
    images: ["img/studyforge-1.jpg"],
  },
  {
    name: "RestockIQ",
    line: "Restock alerts from real consumption.",
    sub: "Raw material tracking for manufacturers",
    url: "restockiq-sable.vercel.app",
    images: ["img/restockiq-1.jpg"],
  },
];

const STEP = 40; // degrees between cards on the ring
const RADIUS = 1250;
const CARD_W = 860;
const CARD_H = Math.round((CARD_W * 10) / 16) + 50;
const WHIP_IN = 9; // frames before the downbeat the swing starts
const WHIP_OUT = 7; // frames after the downbeat it lands

/** Browser window with the live URL; screens cross-fade, a light sweeps across. */
function Card({ p, local, active }) {
  const len = BAR * FPS;
  const switchAt = Math.round(len * 0.52);
  const push = interpolate(local, [0, len], [1.03, 1.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sweep = tween(local, 5, 18, inOut);
  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        borderRadius: 22,
        overflow: "hidden",
        background: C.surface,
        border: `1px solid ${C.lineStrong}`,
        boxShadow: active ? `0 40px 140px -30px rgba(139,92,246,0.75)` : "none",
      }}
    >
      <div style={{ height: 50, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", borderBottom: `1px solid ${C.line}` }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c, opacity: 0.85 }} />
        ))}
        <div style={{ marginLeft: 16, flex: 1, height: 30, borderRadius: 99, background: C.surface2, display: "flex", alignItems: "center", gap: 10, padding: "0 16px", fontFamily: F.sans, fontSize: 18, color: C.muted }}>
          <span style={{ color: C.cyan, fontSize: 14 }}>●</span>
          {p.url}
        </div>
      </div>
      <div style={{ position: "relative", height: CARD_H - 50, overflow: "hidden" }}>
        {p.images.map((src, i) => (
          <Img
            key={src}
            src={staticFile(src)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 0%",
              opacity: i === 0 ? 1 : tween(local, switchAt, 8, inOut),
              transform: `scale(${push})`,
              transformOrigin: "50% 25%",
            }}
          />
        ))}
        {active && sweep > 0 && sweep < 1 && (
          <div
            style={{
              position: "absolute",
              inset: "-20% -60%",
              background: "linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.22) 50%, transparent 58%)",
              transform: `translateX(${(sweep - 0.5) * 140}%)`,
              mixBlendMode: "screen",
            }}
          />
        )}
      </div>
    </div>
  );
}

// 11.49 → 21.15s. Four products on a 3D ring; the camera whip-swings to the
// next card on every downbeat.
export function Carousel() {
  const frame = useCurrentFrame();
  const len = BAR * FPS;
  const starts = PRODUCTS.map((_, i) => Math.round(i * len));

  // Ring angle: hold on card i, whip to i+1 centred on the downbeat.
  let angle = 0;
  let speed = 0;
  starts.slice(1).forEach((s, i) => {
    const p = tween(frame, s - WHIP_IN, WHIP_IN + WHIP_OUT, inOut);
    const pPrev = tween(frame - 1, s - WHIP_IN, WHIP_IN + WHIP_OUT, inOut);
    angle += p * STEP;
    speed += Math.abs(p - pPrev) * STEP;
  });
  // Entry: swing in from the side at the start of the section.
  const enter = tween(frame, 0, 14, inOut);
  angle += (1 - enter) * -STEP * 1.2;

  let current = 0;
  starts.forEach((s, i) => {
    if (frame >= s) current = i;
  });
  const local = frame - starts[current];
  const p = PRODUCTS[current];
  const blur = Math.min(26, speed * 4.5);
  const pulse = beatPulse(frame + Math.round(11.49 * FPS));
  const outAt = current < PRODUCTS.length - 1 ? Math.round(len) - WHIP_IN : undefined;

  return (
    <AbsoluteFill>
      <HBlurDef id="ring" amount={blur} />
      <Marquee text={p.name} y={760} angle={0} speed={10} size={300} opacity={0.1} key={`mq-${current}`} />

      {/* the ring */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 620, height: CARD_H, perspective: 2200, perspectiveOrigin: "50% 40%" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            width: CARD_W,
            height: CARD_H,
            marginLeft: -CARD_W / 2,
            transformStyle: "preserve-3d",
            transform: `translateZ(${-RADIUS}px) rotateY(${-angle}deg)`,
            filter: blur > 0.6 ? `url(#hblur-ring)` : undefined,
          }}
        >
          {PRODUCTS.map((prod, i) => {
            const rel = i * STEP - angle;
            const vis = Math.max(0, 1 - Math.abs(rel) / (STEP * 1.6));
            if (vis <= 0) return null;
            return (
              <div
                key={prod.name}
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `rotateY(${i * STEP}deg) translateZ(${RADIUS}px)`,
                  backfaceVisibility: "hidden",
                  opacity: 0.25 + 0.75 * vis,
                }}
              >
                <Card p={prod} local={frame - starts[i]} active={i === current} />
              </div>
            );
          })}
        </div>
      </div>

      {/* product copy, re-keyed per product so it re-animates */}
      <AbsoluteFill key={`copy-${current}`} style={{ padding: `${SAFE.top}px ${SAFE.x}px 0` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: F.sans, fontSize: 26, fontWeight: 600, letterSpacing: "0.2em", color: C.violetSoft }}>
            <Odometer value={`0${current + 1}`} start={starts[current]} dur={14} size={30} digitStyle={{ fontFamily: F.sans, fontWeight: 600, lineHeight: "30px" }} />
            <span>/ 04</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 22px",
              borderRadius: 99,
              border: `1px solid rgba(34,211,238,${0.4 + 0.5 * pulse})`,
              fontFamily: F.sans,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: C.cyan,
              transform: `scale(${1 + 0.06 * pulse})`,
            }}
          >
            <span style={{ width: 12, height: 12, borderRadius: 99, background: C.cyan, boxShadow: `0 0 ${8 + 24 * pulse}px ${C.cyan}` }} />
            LIVE
          </div>
        </div>
        <ScatterText
          text={p.name.toUpperCase()}
          start={frame - local + 0}
          dur={16}
          out={outAt === undefined ? undefined : frame - local + outAt}
          seed={current * 7 + 2}
          style={{ marginTop: 22, fontFamily: F.display, fontSize: 172, lineHeight: 0.9, color: C.fg, letterSpacing: "-0.01em" }}
        />
        <RiseText lines={[p.line]} start={frame - local + 6} dur={16} out={outAt === undefined ? undefined : frame - local + outAt} outDur={8} style={{ marginTop: 20, fontFamily: F.sans, fontSize: 44, fontWeight: 500, lineHeight: 1.2, color: C.fg }} />
        <RiseText lines={[p.sub]} start={frame - local + 9} dur={16} out={outAt === undefined ? undefined : frame - local + outAt} outDur={8} style={{ marginTop: 10, fontFamily: F.sans, fontSize: 25, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
