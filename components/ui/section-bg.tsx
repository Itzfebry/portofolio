"use client";

import { useEffect, useRef } from "react";

type SectionBgProps = {
  className?: string;
  variant?: "grid" | "particles" | "waves" | "pulse" | "dots";
  hue?: number;
  speed?: number;
};

export default function SectionBg({
  className = "",
  variant = "grid",
  hue = 190,
  speed = 0.3,
}: SectionBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const drawGrid = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const spacing = 48;
      const offset = (t * 12 * speed) % spacing;

      ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.06)`;
      ctx.lineWidth = 1;

      for (let x = -spacing + offset; x < width + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = -spacing + offset; y < height + spacing; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const drawParticles = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const count = 40;

      for (let i = 0; i < count; i++) {
        const seed = i * 137.508;
        const x = ((seed * 7.3 + t * 20 * speed * (0.5 + (i % 3) * 0.3)) % (width + 40)) - 20;
        const y = ((seed * 13.7 + t * 15 * speed * (0.4 + (i % 4) * 0.2)) % (height + 40)) - 20;
        const r = 1 + (i % 3) * 0.5;
        const alpha = 0.15 + 0.1 * Math.sin(t * 2 + i);

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue + (i % 5) * 15}, 80%, 65%, ${alpha})`;
        ctx.fill();
      }
    };

    const drawWaves = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const lines = 8;

      for (let line = 0; line < lines; line++) {
        const progress = line / lines;
        ctx.beginPath();

        for (let x = 0; x <= width; x += 4) {
          const y =
            height * (0.15 + progress * 0.7) +
            Math.sin(x * 0.008 + t * 1.5 * speed + line * 0.8) * 20 +
            Math.sin(x * 0.003 + t * 0.8 * speed) * 30;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `hsla(${hue + progress * 40}, 75%, 60%, ${0.04 + progress * 0.06})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const drawPulse = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const cx = width * 0.7;
      const cy = height * 0.3;
      const maxR = Math.max(width, height) * 0.6;

      for (let i = 0; i < 5; i++) {
        const phase = (t * 0.4 * speed + i * 0.2) % 1;
        const r = phase * maxR;
        const alpha = (1 - phase) * 0.08;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue + i * 10}, 80%, 60%, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    const drawDots = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const spacing = 36;
      const offsetX = (t * 8 * speed) % spacing;
      const offsetY = (t * 5 * speed) % spacing;

      for (let x = -spacing + offsetX; x < width + spacing; x += spacing) {
        for (let y = -spacing + offsetY; y < height + spacing; y += spacing) {
          const dist = Math.sqrt((x - width * 0.5) ** 2 + (y - height * 0.5) ** 2);
          const alpha = 0.04 + 0.06 * Math.sin(dist * 0.01 - t * 2 * speed);
          const r = 1.2 + 0.8 * Math.sin(t * 1.5 + x * 0.01 + y * 0.01);

          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${Math.max(0.02, alpha)})`;
          ctx.fill();
        }
      }
    };

    const draw = (time: number) => {
      const t = time * 0.001;

      switch (variant) {
        case "grid":
          drawGrid(t);
          break;
        case "particles":
          drawParticles(t);
          break;
        case "waves":
          drawWaves(t);
          break;
        case "pulse":
          drawPulse(t);
          break;
        case "dots":
          drawDots(t);
          break;
      }

      if (!reduced) {
        frameRef.current = requestAnimationFrame(draw);
      }
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [variant, hue, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
