import { Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { C, F } from "../theme";
import { tween, inOut } from "./ease";

/**
 * A dark browser window showing a live product URL. Screens cross-fade at
 * `switches` frames; the whole shot drifts in a slow Ken Burns push.
 */
export function BrowserFrame({ url, images, switches = [], width = 912, start = 0, len = 72 }) {
  const frame = useCurrentFrame();
  const height = Math.round(((width - 0) * 10) / 16) + 52;
  const enter = tween(frame, start, 20);
  const push = interpolate(frame, [start, start + len], [1.02, 1.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drift = interpolate(frame, [start, start + len], [0, -3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let active = 0;
  switches.forEach((f, i) => {
    if (frame >= f) active = i + 1;
  });

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 22,
        overflow: "hidden",
        background: C.surface,
        border: `1px solid ${C.lineStrong}`,
        boxShadow: `0 40px 120px -30px rgba(139,92,246,0.55), 0 0 0 1px rgba(255,255,255,0.03)`,
        transform: `translateY(${(1 - enter) * 120}px) rotateX(${(1 - enter) * 12}deg) scale(${0.94 + enter * 0.06})`,
        opacity: enter,
        transformOrigin: "50% 100%",
      }}
    >
      <div style={{ height: 52, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", borderBottom: `1px solid ${C.line}` }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c, opacity: 0.85 }} />
        ))}
        <div
          style={{
            marginLeft: 16,
            flex: 1,
            height: 32,
            borderRadius: 99,
            background: C.surface2,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 16px",
            fontFamily: F.sans,
            fontSize: 19,
            color: C.muted,
          }}
        >
          <span style={{ color: C.cyan, fontSize: 15 }}>●</span>
          {url}
        </div>
      </div>
      <div style={{ position: "relative", height: height - 52, overflow: "hidden" }}>
        {images.map((src, i) => {
          const fadeIn = i === 0 ? 1 : tween(frame, switches[i - 1], 10, inOut);
          const visible = i <= active + 1;
          if (!visible) return null;
          return (
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
                opacity: i === 0 ? 1 : fadeIn,
                transform: `scale(${push}) translateY(${drift}%)`,
                transformOrigin: "50% 30%",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
