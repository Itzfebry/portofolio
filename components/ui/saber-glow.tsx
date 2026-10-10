import type { CSSProperties } from "react";

type SaberGlowProps = {
  /** Menentukan rotasi/durasi random. Nilai beda → tatanan saber beda. */
  seed?: number;
  /** Jumlah bilah saber. */
  beams?: number;
  className?: string;
};

/** PRNG deterministik supaya hasil render server & client identik. */
function pseudo(seed: number, index: number) {
  const value = Math.sin(seed * 127.1 + index * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

/**
 * Latar "saber": bilah cahaya panjang yang berotasi random dan opacity-nya
 * berdenyut (pulse) — konsep yang sama dengan efek pada kartu contact.
 */
export default function SaberGlow({ seed = 1, beams = 6, className = "" }: SaberGlowProps) {
  const items = Array.from({ length: beams }, (_, i) => {
    const r = (slot: number) => pseudo(seed + i * 7.3, slot);

    const style = {
      "--saber-x": `${(r(1) * 60 + 5).toFixed(1)}%`,
      "--saber-y": `${(r(2) * 70 + 12).toFixed(1)}%`,
      "--saber-w": `${(40 + r(3) * 55).toFixed(1)}%`,
      "--saber-angle": `${Math.round(r(4) * 360)}deg`,
      "--saber-spin": `${(16 + r(5) * 30).toFixed(1)}s`,
      "--saber-dir": r(6) > 0.5 ? "reverse" : "normal",
      "--saber-thick": `${(1.5 + r(7) * 2.5).toFixed(1)}px`,
      "--saber-hue": `${Math.round(172 + r(8) * 130)}`,
      "--saber-pulse": `${(3.4 + r(9) * 5.4).toFixed(2)}s`,
      "--saber-delay": `${(-r(10) * 6).toFixed(2)}s`,
      "--saber-alpha": `${(0.3 + r(11) * 0.55).toFixed(2)}`,
    } as CSSProperties;

    return <span key={i} className="saber__beam" style={style} aria-hidden="true" />;
  });

  return <div className={`saber ${className}`.trim()} aria-hidden="true">{items}</div>;
}
