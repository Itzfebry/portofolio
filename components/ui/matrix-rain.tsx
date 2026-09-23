"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎ0123456789ABCDEF#$%&+=<>";
const FONT_SIZE = 15;

/**
 * Falling-code backdrop used behind the admin area.
 * Honours prefers-reduced-motion by painting a single static frame.
 */
export default function MatrixRain({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];
    let frame = 0;
    let last = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      columns = Math.ceil(width / FONT_SIZE);
      drops = Array.from({ length: columns }, () => Math.random() * -60);
      context.fillStyle = "#04070a";
      context.fillRect(0, 0, width, height);
    };

    const paintFrame = () => {
      context.fillStyle = "rgba(4, 7, 10, .12)";
      context.fillRect(0, 0, width, height);
      context.font = `${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, monospace`;

      for (let column = 0; column < columns; column += 1) {
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = column * FONT_SIZE;
        const y = drops[column] * FONT_SIZE;

        context.fillStyle = "rgba(0, 255, 136, .95)";
        context.fillText(glyph, x, y);
        context.fillStyle = "rgba(0, 255, 136, .35)";

        if (y > 0) context.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], x, y - FONT_SIZE);

        if (y > height && Math.random() > 0.972) drops[column] = Math.random() * -30;
        else drops[column] += 1;
      }
    };

    const loop = (time: number) => {
      frame = requestAnimationFrame(loop);
      if (time - last < 55) return;
      last = time;
      paintFrame();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    if (reduced) {
      for (let index = 0; index < 40; index += 1) paintFrame();
    } else {
      frame = requestAnimationFrame(loop);
    }

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
