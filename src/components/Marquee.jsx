import { marquee } from "../content";
import "./Marquee.css";

export default function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <section className="marquee" aria-label="How I build">
      <ul className="sr-only">
        {marquee.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
      <div className="marquee-track" aria-hidden="true">
        {items.map((w, i) => (
          <span className={`marquee-item${(i % marquee.length) % 2 ? " is-alt" : ""}`} key={i}>
            <span className="display marquee-word">{w}</span>
            <span className="marquee-dot" />
          </span>
        ))}
      </div>
    </section>
  );
}
