import { useRef } from "react";
import useInView from "../hooks/useInView";

// Text reveals in the spirit of spring-text-engine:
//   mode="lines"   each line slides up out of a mask (stagger per line)
//   mode="letters" each letter rises out of its line's mask (stagger per letter,
//                  `lineDelay` between lines)
//   mode="words"   each word rises 18px and fades in (stagger per word)
// Plays once on view, or when `trigger` turns true. Remount (change `key`) to replay.
export default function RevealText({
  as: Tag = "span",
  lines,
  mode = "lines",
  trigger,
  delay = 0,
  stagger = 90,
  lineDelay = 240,
  duration = 850,
  ease = "var(--ease-expo)",
  className = "",
  unitClassName = "",
  style,
}) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const shown = trigger === undefined ? inView : trigger;
  const list = Array.isArray(lines) ? lines : [lines];
  const label = list.join(" ");

  const unitStyle = (d) => ({ "--rt-d": `${d}ms` });

  let body;
  if (mode === "letters") {
    body = list.map((line, i) => (
      <span className="rt-line" key={i} style={{ "--rt-y": "100%" }}>
        {Array.from(line).map((ch, j) => (
          <span
            className={`rt-unit ${unitClassName}`}
            key={j}
            style={unitStyle(delay + i * lineDelay + j * stagger)}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    ));
  } else if (mode === "words") {
    const words = label.split(/\s+/);
    body = words.map((w, j) => (
      <span key={j}>
        <span
          className={`rt-unit ${unitClassName}`}
          style={{ ...unitStyle(delay + j * stagger), "--rt-y": "18px" }}
        >
          {w}
        </span>
        {j < words.length - 1 ? " " : null}
      </span>
    ));
  } else {
    body = list.map((line, i) => (
      <span className="rt-line" key={i}>
        <span className={`rt-unit ${unitClassName}`} style={unitStyle(delay + i * stagger)}>
          {line}
        </span>
      </span>
    ));
  }

  return (
    <Tag
      ref={ref}
      className={`rt${shown ? " is-in" : ""}${className ? ` ${className}` : ""}`}
      style={{ "--rt-dur": `${duration}ms`, "--rt-ease": ease, ...style }}
      aria-label={label}
    >
      <span aria-hidden="true">{body}</span>
    </Tag>
  );
}
