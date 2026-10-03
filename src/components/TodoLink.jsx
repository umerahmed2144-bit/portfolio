import { isTodo, SHOW_TODOS } from "../content";

// A link that degrades to a clearly-marked placeholder while its href is a TODO_.
export default function TodoLink({
  href,
  children,
  className = "",
  pendingLabel = "Link coming soon",
  external = false,
  download = false,
  ...rest
}) {
  if (isTodo(href)) {
    return (
      <span
        className={`${className} is-todo`}
        data-todo={href}
        title={href}
        aria-disabled="true"
      >
        {pendingLabel}
        {SHOW_TODOS && <span className="todo-key">{href}</span>}
      </span>
    );
  }
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : null)}
      {...(download ? { download: "" } : null)}
      {...rest}
    >
      {children}
    </a>
  );
}
