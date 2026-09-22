"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function SiteNav({ email }: { email: string }) {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, doc.scrollTop / max) : 0);
      setScrolled(doc.scrollTop > 24);

      let current = "";
      for (const link of LINKS) {
        const section = document.getElementById(link.id);
        if (section && section.getBoundingClientRect().top <= 160) current = link.id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="site-nav__bar">
        <a href="#top" className="site-nav__brand" onClick={() => setOpen(false)}>
          <span className="site-nav__mark" aria-hidden="true" />
          Portfolio
        </a>

        <nav className="site-nav__links" aria-label="Sections">
          {LINKS.map((link) => (
            <a key={link.id} href={`#${link.id}`} className={active === link.id ? "is-active" : ""}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="site-nav__actions">
          <a href={`mailto:${email}`} className="btn btn-primary btn-sm">
            Let&apos;s talk
          </a>
          <button
            type="button"
            className="site-nav__toggle"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="site-nav__progress" style={{ transform: `scaleX(${progress})` }} />

      {open && (
        <nav className="site-nav__mobile" aria-label="Mobile sections">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={active === link.id ? "is-active" : ""}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
