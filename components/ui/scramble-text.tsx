"use client";

import { useEffect, useState, type CSSProperties } from "react";

type ScrambleTextProps = {
  /** final text */
  text: string;
  className?: string;
  /** ms before the decode starts */
  delay?: number;
  /** ms per resolved character */
  speed?: number;
  /** css gradient applied to the resolved text */
  gradient?: string;
};

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&*<>/\\+=?";

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/**
 * Decode/scramble text effect: characters resolve left to right from random
 * glyphs. The final text is kept in a hidden node so the layout never shifts.
 */
export default function ScrambleText({
  text,
  className = "",
  delay = 0,
  speed = 40,
  gradient,
}: ScrambleTextProps) {
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startedAt = performance.now() + delay;

    const finish = () => {
      setOutput(text);
      setDone(true);
    };

    if (reduced) {
      const timeout = window.setTimeout(finish, 0);
      return () => window.clearTimeout(timeout);
    }

    const timer = window.setInterval(() => {
      const now = performance.now();
      if (now < startedAt) return;

      const revealed = Math.floor((now - startedAt) / speed);
      if (revealed >= text.length) {
        window.clearInterval(timer);
        finish();
        return;
      }

      let line = "";
      for (let index = 0; index < text.length; index += 1) {
        const character = text[index];
        line += index < revealed || character === " " ? character : randomGlyph();
      }
      setOutput(line);
    }, 45);

    return () => window.clearInterval(timer);
  }, [text, delay, speed]);

  const style = gradient
    ? ({ "--scramble-grad": gradient } as CSSProperties)
    : undefined;

  return (
    <span
      className={[
        "scramble",
        gradient ? "scramble--grad" : "",
        done ? "is-done" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <span className="sr-only">{text}</span>
      <span className="scramble-reserve" aria-hidden="true">
        {text}
      </span>
      <span className="scramble-live" aria-hidden="true">
        {output}
      </span>
    </span>
  );
}
