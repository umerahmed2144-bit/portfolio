import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F, SAFE } from "../theme";
import { RiseText } from "../components/RiseText";
import { BrowserFrame } from "../components/BrowserFrame";
import { tween } from "../components/ease";

export const PRODUCTS = [
  {
    n: "01",
    name: "FulfillIQ",
    line: "Can I deliver this order on time?",
    sub: "Order promising for small manufacturers",
    url: "fulfilliq-three.vercel.app",
    images: ["img/fulfilliq-1.jpg", "img/fulfilliq-3.jpg"],
  },
  {
    n: "02",
    name: "NurtureAI",
    line: "Understand how your child learns.",
    sub: "Child development · EN / Urdu / Roman Urdu",
    url: "nurture-ai-kappa.vercel.app",
    images: ["img/nurtureai-1.jpg", "img/nurtureai-2.jpg"],
  },
  {
    n: "03",
    name: "StudyForge",
    line: "Messy notes → a day-by-day study plan.",
    sub: "Claude API · no sign-up",
    url: "studyforge-flax.vercel.app",
    images: ["img/studyforge-1.jpg"],
  },
  {
    n: "04",
    name: "RestockIQ",
    line: "Restock alerts from real consumption.",
    sub: "Raw material tracking for manufacturers",
    url: "restockiq-sable.vercel.app",
    images: ["img/restockiq-1.jpg"],
  },
];

// One product per bar (~72 frames).
export function Product({ p, len }) {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 3.5);
  const pill = tween(frame, 14, 14);
  return (
    <AbsoluteFill style={{ padding: `${SAFE.top}px ${SAFE.x}px 0` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <RiseText
          lines={[`${p.n} / 04`]}
          start={0}
          dur={16}
          style={{ fontFamily: F.sans, fontSize: 24, fontWeight: 600, letterSpacing: "0.22em", color: C.violetSoft }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 20px",
            borderRadius: 99,
            border: `1px solid rgba(34,211,238,0.45)`,
            fontFamily: F.sans,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.18em",
            color: C.cyan,
            opacity: pill,
            transform: `scale(${0.8 + pill * 0.2})`,
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: 99, background: C.cyan, boxShadow: `0 0 ${8 + 14 * pulse}px ${C.cyan}` }} />
          LIVE
        </div>
      </div>
      <RiseText
        lines={[p.name]}
        mode="letters"
        start={1}
        stagger={1}
        dur={16}
        style={{ marginTop: 26, fontFamily: F.display, fontSize: 172, lineHeight: 0.9, textTransform: "uppercase", color: C.fg, letterSpacing: "-0.01em" }}
      />
      <RiseText
        lines={[p.line]}
        start={5}
        dur={16}
        style={{ marginTop: 22, fontFamily: F.sans, fontSize: 44, fontWeight: 500, lineHeight: 1.2, color: C.fg, letterSpacing: "-0.01em" }}
      />
      <RiseText
        lines={[p.sub]}
        start={8}
        dur={16}
        style={{ marginTop: 12, fontFamily: F.sans, fontSize: 26, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted }}
      />
      <div style={{ marginTop: 52, display: "flex", justifyContent: "center", perspective: 1600 }}>
        <BrowserFrame url={p.url} images={p.images} switches={p.images.length > 1 ? [Math.round(len * 0.55)] : []} start={4} len={len} />
      </div>
    </AbsoluteFill>
  );
}
