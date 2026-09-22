"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export type GatewayFlowProps = {
  className?: string;
  style?: CSSProperties;
  speed?: number;
  density?: number;
  opacity?: number;
  strokeWidth?: number;
};

type FlowPath = {
  angle: number;
  radius: number;
  length: number;
  phase: number;
  drift: number;
  color: string;
};

const TAU = Math.PI * 2;

/** Cyan / violet / pink strokes so the flow matches the site palette. */
const PALETTE = [
  "103, 232, 249",
  "167, 139, 250",
  "249, 168, 212",
  "147, 197, 253",
] as const;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export default function GatewayFlow({
  className,
  style,
  speed = 1,
  density = 1,
  opacity = 1,
  strokeWidth = 1,
}: GatewayFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let paths: FlowPath[] = [];
    let startTime = performance.now();

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const count = Math.round(clamp(density, 0.35, 2) * (width < 640 ? 42 : 74));
      paths = Array.from({ length: count }, (_, index) => ({
        angle: (index / count) * TAU + (Math.random() - 0.5) * 0.1,
        radius: 30 + Math.random() * Math.max(width, height) * 0.5,
        length: 18 + Math.random() * 80,
        phase: Math.random() * TAU,
        drift: 0.3 + Math.random() * 0.8,
        color: PALETTE[index % PALETTE.length],
      }));
    };

    const draw = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      const motion = reducedMotion.matches ? 0 : clamp(speed, 0, 3);
      const centerX = width * 0.5;
      const centerY = height * 0.44;
      const maxRadius = Math.hypot(width, height) * 0.7;

      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = "screen";
      context.lineCap = "round";
      context.lineWidth = clamp(strokeWidth, 0.5, 3);

      for (const path of paths) {
        const progress = (path.radius + elapsed * motion * 30 * path.drift) % maxRadius;
        const radius = 22 + progress;
        const wave = Math.sin(elapsed * 0.55 + path.phase) * 0.08;
        const angle = path.angle + wave;
        // arc-length based tail keeps the trail visually consistent at any radius
        const tail = (path.length * (0.7 + radius / maxRadius)) / Math.max(radius, 1);
        const alpha = clamp(opacity, 0.05, 1) * (0.08 + (radius / maxRadius) * 0.24);

        context.strokeStyle = `rgba(${path.color}, ${alpha})`;
        context.beginPath();
        context.arc(centerX, centerY, radius, angle - tail, angle);
        context.stroke();
      }

      context.strokeStyle = `rgba(103, 232, 249, ${clamp(opacity, 0.05, 1) * 0.16})`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(centerX, centerY, 26 + Math.sin(elapsed * 0.8) * 2, 0, TAU);
      context.stroke();
      context.restore();

      animationFrame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    animationFrame = requestAnimationFrame((time) => {
      startTime = time;
      draw(time);
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [density, opacity, speed, strokeWidth]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={style}
    />
  );
}
