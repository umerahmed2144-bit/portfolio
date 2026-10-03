import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { contact, hero, person } from "../content";
import RevealText from "../components/RevealText";
import Reveal from "../components/Reveal";
import LiquidImage from "../components/LiquidImage";
import TodoLink from "../components/TodoLink";
import useMounted from "../hooks/useMounted";
import { prefersReducedMotion, REVEAL_DELAY } from "../hooks/motion";
import "./Hero.css";

const HeroCanvas = lazy(() => import("../components/HeroCanvas"));

export default function Hero() {
  const ready = useMounted();
  const ref = useRef(null);
  const [onScreen, setOnScreen] = useState(true);
  const [compact] = useState(() => typeof window !== "undefined" && window.innerWidth <= 768);
  const reduced = prefersReducedMotion();

  // Stop rendering the 3D scene once the hero has scrolled away.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const D = REVEAL_DELAY;

  return (
    <section id="top" className="hero" ref={ref}>
      <div className="hero-canvas" aria-hidden="true">
        <Suspense fallback={null}>
          <HeroCanvas active={onScreen} still={reduced} compact={compact} />
        </Suspense>
      </div>

      <div className="hero-top">
        <RevealText
          as="h2"
          className="display hero-roles"
          lines={hero.roles}
          mode="lines"
          trigger={ready}
          delay={D + 200}
          stagger={80}
          duration={760}
        />

        <div className="hero-copy">
          <Reveal as="p" className="hero-headline" trigger={ready} delay={D + 400} y={16} duration={520}>
            {hero.headline}
          </Reveal>
          <Reveal as="p" className="hero-sub" trigger={ready} delay={D + 500} y={16} duration={520}>
            {hero.sub}
          </Reveal>
          <Reveal className="hero-ctas" trigger={ready} delay={D + 620} y={16} duration={520}>
            <a href={hero.primaryCta.href} className="btn btn-primary">
              {hero.primaryCta.label}
              <span className="arrow" aria-hidden="true">↗</span>
            </a>
            <TodoLink href={contact.cv} className="btn btn-ghost" download pendingLabel="CV coming soon">
              {hero.secondaryCta.label}
              <span className="arrow" aria-hidden="true">↓</span>
            </TodoLink>
          </Reveal>
        </div>
      </div>

      <div className="hero-spacer" />

      <div className="hero-stage">
        <h1 className="hero-name display">
          <span className="sr-only">{person.name}</span>
          <RevealText
            className="hero-name-lines"
            lines={[person.first, person.last]}
            mode="letters"
            trigger={ready}
            delay={D}
            stagger={52}
            lineDelay={240}
            duration={900}
            unitClassName="hero-letter"
          />
        </h1>

        <div className="hero-portrait">
          <LiquidImage
            src={person.portrait}
            alt={`Portrait of ${person.name}`}
            bare
            scaleTo={30}
            fit="contain"
            position="center bottom"
            eager
            className="hero-portrait-img"
          />
        </div>
        <div className="hero-fade" aria-hidden="true" />
      </div>

      <Reveal className="hero-cue" trigger={ready} delay={D + 900} y={0} duration={600}>
        <span className="hero-cue-rule" aria-hidden="true" />
        {hero.scrollCue}
      </Reveal>
    </section>
  );
}
