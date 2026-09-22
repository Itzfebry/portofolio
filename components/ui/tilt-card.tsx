"use client";

import { useEffect, useRef, type ReactNode } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** maximum tilt angle in degrees */
  max?: number;
};

/**
 * Adds a smooth 3D tilt + specular glare that follows the pointer.
 * Motion is disabled for touch devices and reduced-motion users.
 */
export default function TiltCard({ children, className = "", max = 9 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (reduced || touch) return;

    let frame = 0;

    const apply = (px: number, py: number) => {
      node.style.setProperty("--ry", `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
      node.style.setProperty("--rx", `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
      node.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
      node.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = node.getBoundingClientRect();
      const px = (event.clientX - bounds.left) / bounds.width;
      const py = (event.clientY - bounds.top) / bounds.height;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        apply(Math.min(Math.max(px, 0), 1), Math.min(Math.max(py, 0), 1));
      });
    };

    const handlePointerLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      node.style.setProperty("--rx", "0deg");
      node.style.setProperty("--ry", "0deg");
      node.style.setProperty("--gx", "50%");
      node.style.setProperty("--gy", "50%");
    };

    node.addEventListener("pointermove", handlePointerMove, { passive: true });
    node.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      node.removeEventListener("pointermove", handlePointerMove);
      node.removeEventListener("pointerleave", handlePointerLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [max]);

  return (
    <div ref={ref} className={`tilt ${className}`}>
      {children}
      <span className="tilt__glare" aria-hidden="true" />
    </div>
  );
}
