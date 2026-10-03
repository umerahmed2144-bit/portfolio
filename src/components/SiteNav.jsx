import { useEffect, useState } from "react";
import { nav, person } from "../content";
import { getLenis } from "../hooks/lenis";
import "./SiteNav.css";

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`site-nav${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <nav className="site-nav-inner" aria-label="Primary">
        <a href="#top" className="site-nav-logo" onClick={() => setOpen(false)}>
          <span className="site-nav-mono">{person.monogram}</span>
          <span className="site-nav-name">{person.name}</span>
        </a>

        <ul className="site-nav-links">
          {nav.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="site-nav-link">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="site-nav-burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div id="mobile-menu" className="mobile-menu" aria-hidden={!open} inert={!open}>
        <ul>
          {nav.map((l, i) => (
            <li key={l.href} style={{ "--i": i }}>
              <a href={l.href} className="display mobile-menu-link" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
