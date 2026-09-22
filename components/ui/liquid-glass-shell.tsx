"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function LiquidGlassShell({ children }: { children: ReactNode }) {
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchQuery = window.matchMedia("(hover: none), (pointer: coarse)");
    if (motionQuery.matches || touchQuery.matches) return;

    let frame = 0;
    let x = 50;
    let y = 20;

    const update = () => {
      shell.style.setProperty("--mouse-x", `${x}%`);
      shell.style.setProperty("--mouse-y", `${y}%`);
      frame = 0;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = shell.getBoundingClientRect();
      x = ((event.clientX - bounds.left) / bounds.width) * 100;
      y = ((event.clientY - bounds.top) / bounds.height) * 100;
      if (!frame) frame = requestAnimationFrame(update);
    };

    shell.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      shell.removeEventListener("pointermove", handlePointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={shellRef} className="liquid-shell">{children}</div>;
}
