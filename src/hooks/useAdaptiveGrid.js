import { useEffect } from "react";

const FONT_BASE = 16;
const BASE_W = 1920;
const COEF = 0.6666;

// Above 1920px, scale the root font-size up (damped); below, the vw media
// queries in global.css drive it.
export default function useAdaptiveGrid() {
  useEffect(() => {
    const apply = () => {
      const w = window.innerWidth;
      const reduction = ((BASE_W - w) / BASE_W) * 100 * COEF;
      const size = FONT_BASE - (FONT_BASE * reduction) / 100;
      if (size > FONT_BASE) document.documentElement.style.fontSize = `${size}px`;
      else document.documentElement.style.removeProperty("font-size");
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);
}
