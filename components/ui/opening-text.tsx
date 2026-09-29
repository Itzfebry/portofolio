"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { onEnter } from "@/lib/entrance";

type OpeningTextProps = {
  text: string;
  className?: string;
  /** ms before the opening starts */
  delay?: number;
  /** ms between each character */
  speed?: number;
};

/**
 * Opening reveal effect — characters drop in one by one from above with a
 * spring settle, a brief glow pulse, and a subtle scale. Reads as a cinematic
 * "opening sequence" rather than a decode/scramble.
 */
export default function OpeningText({
  text,
  className = "",
  delay = 0,
  speed = 55,
}: OpeningTextProps) {
  const [revealed, setRevealed] = useState(0);
  const revealedRef = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      revealedRef.current = text.length;
      setRevealed(text.length);
      return;
    }

    let interval = 0;

    const start = () => {
      const startedAt = performance.now() + delay;
      interval = window.setInterval(() => {
        const now = performance.now();
        if (now < startedAt) return;
        const count = Math.min(text.length, Math.floor((now - startedAt) / speed));
        if (count !== revealedRef.current) {
          revealedRef.current = count;
          setRevealed(count);
        }
        if (count >= text.length) {
          window.clearInterval(interval);
        }
      }, 30);
    };

    // Ditahan sampai splash selesai — kalau tidak, efeknya sudah habis
    // bermain di balik splash.
    const stop = onEnter(start);
    return () => {
      stop();
      window.clearInterval(interval);
    };
  }, [text, delay, speed]);

  let charIndex = 0;

  return (
    <span className={`opening ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="opening__chars">
        {text.split("").map((char, i) => {
          const idx = charIndex++;
          const isSpace = char === " ";
          const isRevealed = i < revealed;
          return (
            <span
              key={i}
              className="opening__char"
              style={
                {
                  "--i": String(idx),
                  "--open-delay": `${idx * speed}ms`,
                  animation: isRevealed
                    ? `opening-char .85s cubic-bezier(.16, 1, .3, 1) both`
                    : "none",
                  opacity: isRevealed ? undefined : 0,
                } as CSSProperties
              }
            >
              {isSpace ? "\u00A0" : char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
