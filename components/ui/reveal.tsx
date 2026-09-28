"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** animation delay in milliseconds */
  delay?: number;
  /** travel distance in px */
  y?: number;
};

export default function Reveal({ children, className = "", delay = 0, y = 26 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.classList.add("is-visible");
      return;
    }

    // `will-change` is applied only while the reveal actually animates
    // (see `.reveal.is-animating` in globals.css). Keeping it on permanently
    // pinned a composited layer per reveal for the whole page lifetime, which
    // starved the compositor and showed up as stutter on the hero → about
    // scroll. The transform/opacity transition is promoted automatically for
    // the duration, so nothing is lost.
    let settleTimer = 0;

    const release = () => {
      window.clearTimeout(settleTimer);
      settleTimer = 0;
      node.classList.remove("is-animating");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add("is-visible", "is-animating");
            // transitionend covers opacity+transform; the timer is a safety
            // net for reduced/compositor-skipped transitions.
            node.addEventListener("transitionend", release, { once: true });
            settleTimer = window.setTimeout(release, 2200);
            observer.unobserve(node);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(settleTimer);
    };
  }, []);

  const style = {
    "--reveal-delay": `${delay}ms`,
    "--reveal-y": `${y}px`,
  } as CSSProperties;

  return (
    <div ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </div>
  );
}
