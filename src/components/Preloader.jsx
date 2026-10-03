import { useEffect, useState } from "react";
import { person } from "../content";
import "./Preloader.css";

const COUNT_MS = 2000;
const FADE_MS = 300;
const HOLD_MS = 200;
const WIPE_MS = 650;

// Count 0→100, fade the labels, hold, then wipe the whole screen upward.
export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("count"); // count → fade → wipe → done

  useEffect(() => {
    window.scrollTo(0, 0);
    let raf;
    const timers = [];
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      // gentle ease-in-out so it doesn't feel mechanical
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setCount(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      setPhase("fade");
      timers.push(setTimeout(() => setPhase("wipe"), FADE_MS + HOLD_MS));
      timers.push(
        setTimeout(() => {
          setPhase("done");
          onDone?.();
        }, FADE_MS + HOLD_MS + WIPE_MS)
      );
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`preloader is-${phase}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${count}%`}
    >
      <span className="preloader-bg" aria-hidden="true" />
      <p className="preloader-brand display">{person.name}</p>
      <p className="preloader-count display" aria-hidden="true">
        {count}
        <span className="accent">%</span>
      </p>
    </div>
  );
}
