import { useEffect, useId, useRef, useState } from "react";
import { isTodo, SHOW_TODOS } from "../content";
import { canHover } from "../hooks/motion";
import "./LiquidImage.css";

const BASE_FREQ = 0.009;
const HOVER_FREQ = 0.022;
// Loose, watery spring (tension 140 / friction 13, mass 1).
const TENSION = 140;
const FRICTION = 13;

/**
 * Image with an SVG turbulence/displacement filter that wobbles on hover.
 *  - bare: just the filtered image, no surface/veil/glow (hero portrait).
 *    Renders nothing if the image is missing.
 *  - full: grayscale→colour veil, violet/cyan glow sweep, vignette and a
 *    branded placeholder (with the TODO key) while the image is missing.
 */
export default function LiquidImage({
  src,
  alt = "",
  bare = false,
  scaleTo = 28,
  className = "",
  fit = "cover",
  position = "center",
  placeholderLabel,
  eager = false,
  style,
}) {
  const filterId = `liquid-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const [failed, setFailed] = useState(false);
  const figRef = useRef(null);
  const imgRef = useRef(null);
  const dispRef = useRef(null);
  const turbRef = useRef(null);
  const spring = useRef({ x: 0, v: 0, target: 0, raf: 0, last: 0 });

  const missing = isTodo(src) || failed;

  useEffect(() => {
    setFailed(false);
  }, [src]);

  useEffect(() => () => cancelAnimationFrame(spring.current.raf), []);

  const write = (x) => {
    const scale = Math.max(0, 1 + x * (scaleTo - 1));
    const freq = Math.max(0.001, BASE_FREQ + x * (HOVER_FREQ - BASE_FREQ));
    dispRef.current?.setAttribute("scale", scale.toFixed(2));
    turbRef.current?.setAttribute("baseFrequency", freq.toFixed(4));
    if (imgRef.current) {
      // Only pay for the filter while it's doing something.
      imgRef.current.style.filter = Math.abs(x) > 0.002 ? `url(#${filterId})` : "none";
    }
  };

  const step = (now) => {
    const s = spring.current;
    const dt = Math.min(0.032, (now - (s.last || now)) / 1000) || 0.016;
    s.last = now;
    const a = -TENSION * (s.x - s.target) - FRICTION * s.v;
    s.v += a * dt;
    s.x += s.v * dt;
    if (Math.abs(s.x - s.target) < 0.001 && Math.abs(s.v) < 0.001) {
      s.x = s.target;
      s.v = 0;
      s.raf = 0;
      write(s.x);
      return;
    }
    write(s.x);
    s.raf = requestAnimationFrame(step);
  };

  const setHover = (on) => {
    if (missing || !canHover()) return;
    figRef.current?.classList.toggle("is-hover", on);
    const s = spring.current;
    s.target = on ? 1 : 0;
    if (!s.raf) {
      s.last = 0;
      s.raf = requestAnimationFrame(step);
    }
  };

  if (bare && missing) return null;

  return (
    <figure
      ref={figRef}
      className={`liquid${bare ? " is-bare" : ""}${missing ? " is-missing" : ""} ${className}`}
      style={style}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      {...(missing ? { role: "img", "aria-label": placeholderLabel || alt } : null)}
    >
      <svg className="liquid-svg" aria-hidden="true" focusable="false">
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            ref={turbRef}
            type="fractalNoise"
            baseFrequency={BASE_FREQ}
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            ref={dispRef}
            in="SourceGraphic"
            in2="noise"
            scale="1"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {missing ? (
        <div className="liquid-placeholder">
          {placeholderLabel && <span className="liquid-placeholder-label display">{placeholderLabel}</span>}
          <span className="liquid-placeholder-note">
            {SHOW_TODOS ? <span className="todo-key">{src || "TODO_IMAGE"}</span> : "Screenshot coming soon"}
          </span>
        </div>
      ) : (
        <img
          ref={imgRef}
          className="liquid-media"
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          style={{ objectFit: fit, objectPosition: position }}
        />
      )}

      {!bare && (
        <>
          <span className="liquid-veil" aria-hidden="true" />
          <span className="liquid-glow" aria-hidden="true" />
          <span className="liquid-vignette" aria-hidden="true" />
        </>
      )}
    </figure>
  );
}
