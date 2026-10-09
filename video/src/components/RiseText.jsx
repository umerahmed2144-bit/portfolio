import { useCurrentFrame } from "remotion";
import { tween } from "./ease";

/**
 * Text that rises out of a mask, like the site's spring-text reveals.
 *  mode="letters": per-letter stagger, `lineDelay` frames between lines
 *  mode="lines":   per-line stagger
 * `out` (frame) slides everything up and away again.
 */
export function RiseText({
  lines,
  mode = "lines",
  start = 0,
  stagger = 3,
  lineDelay = 6,
  dur = 22,
  out,
  outDur = 12,
  style,
  lineStyle,
  unitStyle,
  align = "left",
}) {
  const frame = useCurrentFrame();
  const list = Array.isArray(lines) ? lines : [lines];
  const leave = out === undefined ? 0 : tween(frame, out, outDur);

  const unit = (p, key, content, extra) => (
    <span
      key={key}
      style={{
        display: "inline-block",
        transform: `translateY(${(1 - p) * 110 - leave * 110}%)`,
        opacity: Math.min(p * 1.4, 1) * (1 - leave),
        whiteSpace: "pre",
        ...unitStyle,
        ...extra,
      }}
    >
      {content}
    </span>
  );

  return (
    <div style={{ textAlign: align, ...style }}>
      {list.map((line, i) => {
        const text = typeof line === "string" ? line : line.text;
        const extra = typeof line === "string" ? null : line.style;
        return (
          <div
            key={i}
            style={{ overflow: "hidden", padding: "0.06em 0", margin: "-0.06em 0", whiteSpace: "nowrap", ...lineStyle }}
          >
            {mode === "letters"
              ? Array.from(text).map((ch, j) =>
                  unit(tween(frame, start + i * lineDelay + j * stagger, dur), j, ch, extra)
                )
              : unit(tween(frame, start + i * stagger, dur), 0, text, extra)}
          </div>
        );
      })}
    </div>
  );
}
