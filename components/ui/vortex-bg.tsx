"use client";

import { useEffect, useRef } from "react";

type VortexBgProps = {
  className?: string;
  lineCount?: number;
  hue?: number;
  speed?: number;
  frequency?: number;
  amplitude?: number;
};

const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;

const GRAD2 = new Float32Array([
  1, 1, -1, 1, 1, -1, -1, -1,
  1, 0, -1, 0, 0, 1, 0, -1,
]);

function dot2(g: Float32Array, x: number, y: number): number {
  return g[0] * x + g[1] * y;
}

class SimplexNoise {
  perm: Uint8Array;

  constructor(seed: number) {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let s = seed;
    const rand = () => {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      return (s >>> 0) / 0xffffffff;
    };
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const t = p[i];
      p[i] = p[j];
      p[j] = t;
    }
    this.perm = new Uint8Array(512);
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }

  noise2D(x: number, y: number): number {
    const perm = this.perm;
    const s = (x + y) * F2;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const t = (i + j) * G2;
    const x0 = x - (i - t);
    const y0 = y - (j - t);
    const i1 = x0 > y0 ? 1 : 0;
    const j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    const ii = i & 255;
    const jj = j & 255;
    let n0 = 0;
    let n1 = 0;
    let n2 = 0;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      const gi0 = (perm[ii + perm[jj]] % 8) * 2;
      t0 *= t0;
      n0 = t0 * t0 * dot2(GRAD2.subarray(gi0, gi0 + 2), x0, y0);
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      const gi1 = (perm[ii + i1 + perm[jj + j1]] % 8) * 2;
      t1 *= t1;
      n1 = t1 * t1 * dot2(GRAD2.subarray(gi1, gi1 + 2), x1, y1);
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      const gi2 = (perm[ii + 1 + perm[jj + 1]] % 8) * 2;
      t2 *= t2;
      n2 = t2 * t2 * dot2(GRAD2.subarray(gi2, gi2 + 2), x2, y2);
    }
    return 70 * (n0 + n1 + n2);
  }
}

export default function VortexBg({
  className = "",
  lineCount = 32,
  hue = 190,
  speed = 0.35,
  frequency = 0.0018,
  amplitude = 55,
}: VortexBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const noiseRef = useRef<SimplexNoise | null>(null);

  useEffect(() => {
    if (!noiseRef.current) {
      noiseRef.current = new SimplexNoise(42);
    }

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

    const noise = noiseRef.current;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const t = time * 0.001 * speed;

      for (let line = 0; line < lineCount; line++) {
        const lineProgress = line / lineCount;
        const hueShift = lineProgress * 60;

        ctx.beginPath();

        for (let x = 0; x <= width; x += 3) {
          const nx = x * frequency;
          const ny = lineProgress * 3;

          const n = noise.noise2D(nx + t * 0.4, ny + t * 0.25);
          const n2 = noise.noise2D(nx * 1.6 + t * 0.2 + 100, ny * 1.6);

          const wave =
            Math.sin(x * 0.012 + t * 1.2 + lineProgress * Math.PI) * 0.4 +
            Math.sin(x * 0.005 + t * 0.7) * 0.3;

          const y =
            height * (0.12 + lineProgress * 0.76) +
            n * amplitude +
            n2 * (amplitude * 0.45) +
            wave * amplitude * 0.35;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        const lightness = 55 + lineProgress * 12;

        // Opacity pulse — each line breathes on its own phase so the field
        // never reads as a static, monotonous pattern.
        const pulse = 0.55 + 0.45 * Math.sin(t * 1.6 + lineProgress * Math.PI * 2.2);
        const alpha = (0.08 + lineProgress * 0.16) * pulse;

        ctx.strokeStyle = "hsla(" + (hue + hueShift) + ", 85%, " + lightness + "%, " + alpha + ")";
        ctx.lineWidth = 1.1 + lineProgress * 0.6;
        ctx.stroke();
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
  }, [lineCount, hue, speed, frequency, amplitude]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
