import Eyebrow from "../components/Eyebrow";
import RevealText from "../components/RevealText";

export default function SectionHead({ eyebrow, heading, aside, headingClass = "" }) {
  return (
    <header className="section-head">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <RevealText as="h2" className={`display h ${headingClass}`} lines={heading} stagger={90} duration={900} />
      </div>
      {aside && <div className="section-aside label">{aside}</div>}
    </header>
  );
}
