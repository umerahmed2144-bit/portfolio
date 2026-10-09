import { useEffect, useState } from "react";
import Preloader from "./components/Preloader";
import SiteNav from "./components/SiteNav";
import Marquee from "./components/Marquee";
import Hero from "./sections/Hero";
import Showreel from "./sections/Showreel";
import { showreel } from "./content";
import FeaturedProducts from "./sections/FeaturedProducts";
import ClientWork from "./sections/ClientWork";
import Experiments from "./sections/Experiments";
import Services from "./sections/Services";
import About from "./sections/About";
import Contact from "./sections/Contact";
import { getLenis, useLenis } from "./hooks/lenis";
import useAdaptiveGrid from "./hooks/useAdaptiveGrid";
import { prefersReducedMotion } from "./hooks/motion";

export default function App() {
  const reduced = prefersReducedMotion();
  const [loading, setLoading] = useState(!reduced);

  useAdaptiveGrid();
  useLenis({ enabled: !reduced });

  // Scroll stays locked while the preloader runs.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const lenis = getLenis();
    if (loading) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [loading]);

  return (
    <>
      {loading && <Preloader onDone={() => setLoading(false)} />}
      <SiteNav />
      <main>
        <Hero />
        {showreel.enabled && <Showreel />}
        <Marquee />
        <FeaturedProducts />
        <ClientWork />
        <Experiments />
        <Services />
        <About />
      </main>
      <Contact />
    </>
  );
}
