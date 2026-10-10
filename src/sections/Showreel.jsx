import { useEffect, useRef, useState } from "react";
import { showreel } from "../content";
import Eyebrow from "../components/Eyebrow";
import Reveal from "../components/Reveal";
import RevealText from "../components/RevealText";
import { prefersReducedMotion } from "../hooks/motion";
import "./Showreel.css";

export default function Showreel() {
  const wrap = useRef(null);
  const video = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const reduced = prefersReducedMotion();

  // Autoplay (muted) only while the player is on screen; pause when it isn't.
  useEffect(() => {
    const el = wrap.current;
    const v = video.current;
    if (!el || !v || reduced || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => {});
  };

  const togglePlay = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const fullscreen = () => {
    const v = video.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    (v.requestFullscreen || v.webkitEnterFullscreen || v.webkitRequestFullscreen)?.call(v);
    v.play().catch(() => {});
  };

  return (
    <section id="reel" className="section reel">
      <header className="section-head">
        <div>
          <Eyebrow>{showreel.eyebrow}</Eyebrow>
          <RevealText as="h2" className="display h" lines={showreel.heading} stagger={90} duration={900} />
        </div>
        <p className="section-aside reel-caption">{showreel.caption}</p>
      </header>

      <Reveal className="reel-frame" y={60} duration={700}>
        <div className="reel-player" ref={wrap}>
          <video
            ref={video}
            className="reel-video"
            poster={showreel.poster}
            muted
            loop
            playsInline
            preload="metadata"
            autoPlay={!reduced}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onClick={togglePlay}
            aria-label="Showreel: 21 seconds of motion design featuring FulfillIQ, NurtureAI, StudyForge and RestockIQ"
          >
            <source src={showreel.mp4Small} type="video/mp4" media="(max-width: 768px)" />
            <source src={showreel.webm} type="video/webm" />
            <source src={showreel.mp4} type="video/mp4" />
          </video>

          {/* viewfinder corners, echoing the reel's own slate */}
          <span className="reel-corner tl" aria-hidden="true" />
          <span className="reel-corner tr" aria-hidden="true" />
          <span className="reel-corner bl" aria-hidden="true" />
          <span className="reel-corner br" aria-hidden="true" />

          {!playing && (
            <button type="button" className="reel-play" onClick={togglePlay} aria-label="Play showreel">
              <span aria-hidden="true">▶</span>
            </button>
          )}

          <div className="reel-controls">
            <button type="button" className={`reel-btn${muted ? "" : " is-on"}`} onClick={toggleSound} aria-pressed={!muted}>
              <span className="reel-eq" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              {muted ? "Sound on" : "Sound off"}
            </button>
            <button type="button" className="reel-btn" onClick={fullscreen}>
              ⤢ Full screen
            </button>
          </div>
        </div>
      </Reveal>
      <p className="reel-credit label">{showreel.credit}</p>
    </section>
  );
}
