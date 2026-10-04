import { useState } from "react";
import { clients, clientsIntro, isTodo, visibleProducts } from "../content";
import Reveal from "../components/Reveal";
import RevealText from "../components/RevealText";
import LiquidImage from "../components/LiquidImage";
import SectionHead from "./SectionHead";
import "./ClientWork.css";

const productName = (id) => visibleProducts.find((p) => p.id === id)?.name;

export default function ClientWork() {
  const [active, setActive] = useState(0);
  const c = clients[active];

  return (
    <section id="clients" className="section clients">
      <SectionHead eyebrow={clientsIntro.eyebrow} heading={clientsIntro.heading} aside={`0${clients.length} / Roles`} />

      <div className="clients-grid">
        <ul className="clients-list" role="tablist" aria-label="Client work">
          {clients.map((item, i) => (
            <Reveal as="li" key={item.name} delay={i * 90} duration={560}>
              <button
                type="button"
                role="tab"
                id={`client-tab-${i}`}
                aria-selected={i === active}
                aria-controls="client-panel"
                className={`client-btn${i === active ? " is-active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className="client-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="client-text">
                  <span className="client-name">{item.name}</span>
                  <span className="client-role">{item.role}</span>
                </span>
                <span className="client-rule" aria-hidden="true" />
              </button>
            </Reveal>
          ))}
        </ul>

        <div
          className="client-panel"
          id="client-panel"
          role="tabpanel"
          aria-labelledby={`client-tab-${active}`}
        >
          <blockquote className="client-quote">
            <RevealText
              key={active}
              as="p"
              className="client-quote-text"
              lines={c.summary}
              mode="words"
              stagger={22}
              duration={520}
              ease="var(--ease-quart)"
            />
            <footer className="label client-foot">
              {c.org} — {c.role}
            </footer>
            <div className="client-tags">
              <ul className="chips">
                {c.tags.map((t) => (
                  <li className="chip" key={t}>{t}</li>
                ))}
              </ul>
              {c.related.some(productName) && (
                <p className="client-related">
                  Led to{" "}
                  {c.related.filter(productName).map((id, i) => (
                    <span key={id}>
                      {i > 0 && " & "}
                      <a href={`#product-${id}`}>{productName(id)}</a>
                    </span>
                  ))}
                </p>
              )}
            </div>
          </blockquote>

          {/* Client images are optional: no image column until one is added. */}
          {!isTodo(c.image) && (
          <Reveal className="client-media" y={0} scale={1.06} duration={640}>
            <LiquidImage
              key={c.image}
              src={c.image}
              alt={c.org}
              placeholderLabel={c.name}
              scaleTo={22}
              className="client-img"
            />
          </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
