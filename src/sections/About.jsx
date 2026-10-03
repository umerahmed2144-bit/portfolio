import { aboutIntro, credentials, education, process, stack, stats } from "../content";
import Reveal from "../components/Reveal";
import Eyebrow from "../components/Eyebrow";
import RevealText from "../components/RevealText";
import "./About.css";

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="about-top">
        <div className="about-head">
          <Eyebrow>{aboutIntro.eyebrow}</Eyebrow>
          <RevealText as="h2" className="display h about-h" lines={aboutIntro.heading} stagger={90} duration={900} />
        </div>
        <div className="about-pitch">
          {aboutIntro.pitch.map((p, i) => (
            <Reveal as="p" key={i} className={i === 0 ? "fs-lead" : "fs-lead muted"} delay={i * 90} duration={520}>
              {p}
            </Reveal>
          ))}
        </div>
      </div>

      <dl className="stats">
        {stats.map((s, i) => (
          <Reveal key={s.label} className="stat" delay={i * 110} duration={560}>
            <dd className="display stat-value">{s.value}</dd>
            <dt className="stat-label">{s.label}</dt>
          </Reveal>
        ))}
      </dl>

      <div className="about-grid">
        <div className="about-col">
          <Reveal as="h3" className="label about-sub">How I build</Reveal>
          <Reveal as="p" className="about-lede" delay={60}>{process.intro}</Reveal>
          <ol className="steps">
            {process.steps.map((s, i) => (
              <Reveal as="li" key={s.title} className="step" delay={i * 90}>
                <span className="step-index">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h4 className="step-title">{s.title}</h4>
                  <p className="step-body">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal as="h3" className="label about-sub about-sub-gap">Stack</Reveal>
          <dl className="stack">
            {stack.map((g, i) => (
              <Reveal key={g.category} className="stack-row" delay={i * 70}>
                <dt className="label">{g.category}</dt>
                <dd>
                  <ul className="chips">
                    {g.tools.map((t) => (
                      <li className="chip" key={t}>{t}</li>
                    ))}
                  </ul>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <div className="about-col">
          <Reveal as="h3" className="label about-sub">Education</Reveal>
          <Reveal className="edu" delay={60}>
            <p className="edu-degree">{education.degree}</p>
            <p className="muted">{education.detail}</p>
          </Reveal>
          <dl className="coursework">
            {education.coursework.map((c, i) => (
              <Reveal key={c.area} className="course-row" delay={i * 70}>
                <dt className="label">{c.area}</dt>
                <dd>{c.courses}</dd>
              </Reveal>
            ))}
          </dl>

          <Reveal className="thesis" delay={80}>
            <span className="label accent">Thesis in progress</span>
            <p>{education.thesis}</p>
          </Reveal>

          <Reveal as="h3" className="label about-sub about-sub-gap">Applied projects</Reveal>
          <Reveal as="ul" className="applied" delay={60}>
            {education.applied.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </Reveal>

          <Reveal as="h3" className="label about-sub about-sub-gap">Certifications</Reveal>
          <Reveal className="certs" delay={60}>
            <ul className="chips">
              {credentials.certifications.map((c) => (
                <li className="chip chip-accent" key={c}>{c}</li>
              ))}
            </ul>
            <p className="muted">{credentials.learning}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
