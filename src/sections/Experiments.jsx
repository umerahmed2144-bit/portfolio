import { experiments, experimentsIntro } from "../content";
import Reveal from "../components/Reveal";
import SectionHead from "./SectionHead";
import "./Experiments.css";

export default function Experiments() {
  return (
    <section id="lab" className="section lab">
      <SectionHead eyebrow={experimentsIntro.eyebrow} heading={experimentsIntro.heading} aside={experimentsIntro.note} />
      <ul className="lab-strip" aria-label="Experiments and side projects">
        {experiments.map((x, i) => (
          <Reveal as="li" key={x.id} id={`lab-${x.id}`} className="lab-card" delay={i * 110} duration={560}>
            <span className="lab-index label">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="display lab-name">{x.name}</h3>
            <p className="lab-what">{x.what}</p>
            <ul className="chips lab-stack">
              {x.stack.map((s) => (
                <li className="chip" key={s}>{s}</li>
              ))}
            </ul>
            <p className="lab-proves">
              <span className="label">Proves</span>
              {x.proves}
            </p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
