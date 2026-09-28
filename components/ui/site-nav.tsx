"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

const LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

/** A link becomes active once its top edge is this far above the viewport top. */
const ACTIVE_OFFSET = 160;
const SCROLLED_AT = 24;

export default function SiteNav({ email }: { email: string }) {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scrolling must not re-render React, and must not force layout.
    //
    // Previously every animation frame committed a new <SiteNav> render
    // (setProgress with a fresh float), read document scrollHeight /
    // clientHeight, then called getBoundingClientRect() once per section.
    // That is a forced synchronous layout per frame, interleaved with the
    // transform <ScrollFx /> writes on the hero, so the main thread spent
    // every frame in style -> layout and the compositor starved.
    //
    // Now: geometry is measured once (and on resize / content resize), the
    // per-frame work is pure arithmetic, and the progress bar is driven by
    // writing `transform` straight to the node. React only re-renders when
    // `active` or `scrolled` actually change — i.e. a handful of times per
    // page, not 60 times per second.
    const bar = barRef.current;

    let frame = 0;
    let maxScroll = 0;
    let sectionTops: number[] = [];
    let lastProgress = -1;
    let lastActive = "";
    let lastScrolled = false;

    const measure = () => {
      const doc = document.documentElement;
      maxScroll = Math.max(0, doc.scrollHeight - doc.clientHeight);
      sectionTops = LINKS.map((link) => {
        const section = document.getElementById(link.id);
        if (!section) return Number.POSITIVE_INFINITY;
        return section.getBoundingClientRect().top + window.scrollY;
      });
    };

    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;

      // Progress: compositor-only `transform`, no layout, no React.
      const progress = maxScroll > 0 ? Math.min(1, scrollY / maxScroll) : 0;
      if (bar && Math.abs(progress - lastProgress) > 0.0005) {
        lastProgress = progress;
        bar.style.transform = `scaleX(${progress.toFixed(4)})`;
      }

      // Active section from cached offsets — no getBoundingClientRect().
      let current = "";
      for (let index = 0; index < sectionTops.length; index += 1) {
        if (sectionTops[index] - scrollY <= ACTIVE_OFFSET) current = LINKS[index].id;
      }
      if (current !== lastActive) {
        lastActive = current;
        setActive(current);
      }

      const isScrolled = scrollY > SCROLLED_AT;
      if (isScrolled !== lastScrolled) {
        lastScrolled = isScrolled;
        setScrolled(isScrolled);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const remeasure = () => {
      measure();
      lastProgress = -1; // force a progress write at the new scale
      update();
    };

    measure();
    update();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });

    // Section heights change with font loading, late images and reflow, and
    // window `resize` does not fire for any of those.
    const resizeObserver = new ResizeObserver(remeasure);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      resizeObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="site-nav__bar">
        <a href="#top" className="site-nav__brand" onClick={() => setOpen(false)}>
          <Image
            src="/images/favcion.png"
            alt=""
            width={48}
            height={48}
            className="site-nav__mark"
          />
          Portfolio
        </a>

        <nav className="site-nav__links" aria-label="Sections">
          {LINKS.map((link) => (
            <a key={link.id} href={`#${link.id}`} className={active === link.id ? "is-active" : ""}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* <div className="site-nav__actions">
          <LiquidMetalButton
            label="Let's talk"
            variant="light"
            onClick={() => {
              window.location.href = `mailto:${email}`;
            }}
          />
          <button
            type="button"
            className="site-nav__toggle"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
          </button>
        </div> */}
      </div>

      {/* Driven imperatively from the scroll loop above: a CSS transition here
          would be restarted on every frame and could never settle, which is
          what made the bar lag behind the scroll position. */}
      <div className="site-nav__progress" ref={barRef} />

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
