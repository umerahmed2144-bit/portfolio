import { useRef } from "react";
import useInView from "../hooks/useInView";

// Fade + slide-up block. Plays once when scrolled into view, or when
// `trigger` becomes true if it's passed.
export default function Reveal({
  as: Tag = "div",
  trigger,
  delay = 0,
  y = 24,
  scale,
  duration = 560,
  ease = "var(--ease-expo)",
  className = "",
  style,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const shown = trigger === undefined ? inView : trigger;
  return (
    <Tag
      ref={ref}
      className={`reveal${shown ? " is-in" : ""}${className ? ` ${className}` : ""}`}
      style={{
        "--r-delay": `${delay}ms`,
        "--r-y": `${y}px`,
        "--r-dur": `${duration}ms`,
        "--r-ease": ease,
        ...(scale ? { "--r-scale": scale } : null),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
