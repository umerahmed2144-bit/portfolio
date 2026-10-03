import { useEffect } from "react";
import Lenis from "lenis";

let instance = null;
export const getLenis = () => instance;

export function scrollToHash(hash) {
  const target = hash === "#top" ? 0 : document.querySelector(hash);
  if (target === null) return;
  if (instance) instance.scrollTo(target, { offset: 0, duration: 1.2, force: true });
  else if (target === 0) window.scrollTo({ top: 0, behavior: "smooth" });
  else target.scrollIntoView({ behavior: "smooth" });
}

// Creates the Lenis singleton, runs its RAF loop and routes in-page anchor
// clicks through it.
export function useLenis({ enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ smoothWheel: true });
    instance = lenis;
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      instance = null;
    };
  }, [enabled]);

  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href");
      if (hash.length < 2) return;
      e.preventDefault();
      scrollToHash(hash);
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}
