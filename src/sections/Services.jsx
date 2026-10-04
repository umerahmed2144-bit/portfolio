import { experiments, products, services, servicesIntro, visibleProducts } from "../content";
import Reveal from "../components/Reveal";
import SectionHead from "./SectionHead";
import "./Services.css";

// Returns null for hidden products so they drop out of the proof list.
const proofLink = (id) => {
  const p = visibleProducts.find((x) => x.id === id);
  if (p) return { href: `#product-${id}`, name: p.name };
  if (products.some((x) => x.id === id)) return null;
  const x = experiments.find((e) => e.id === id);
  return { href: `#lab-${id}`, name: x?.name ?? id };
};

export default function Services() {
  return (
    <section id="services" className="section services">
      <SectionHead eyebrow={servicesIntro.eyebrow} heading={servicesIntro.heading} aside={servicesIntro.note} />
      <ol className="services-list">
        {services.map((s, i) => (
          <Reveal as="li" key={s.title} className="service" delay={i * 90} duration={560}>
            <span className="service-index">{String(i + 1).padStart(2, "0")}</span>
            <div className="service-main">
              <h3 className="display service-title">{s.title}</h3>
              <p className="service-body">{s.body}</p>
            </div>
            <div className="service-proof">
              <span className="label">Proof</span>
              <ul>
                {s.proof.map((id) => {
                  const l = proofLink(id);
                  if (!l) return null;
                  return (
                    <li key={id}>
                      <a href={l.href} className="service-proof-link">
                        {l.name}
                        <span aria-hidden="true">↘</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        ))}
      </ol>
      <Reveal className="services-cta" delay={120}>
        <a href="#contact" className="btn btn-primary">
          {servicesIntro.cta}
          <span className="arrow" aria-hidden="true">↗</span>
        </a>
      </Reveal>
    </section>
  );
}
