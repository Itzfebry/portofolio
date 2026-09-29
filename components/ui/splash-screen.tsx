"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

const DURATION = 2400;
const HOLD = 380;
const EXIT = 760;

const LOG = [
  { text: "boot glass.kernel", status: "ok" },
  { text: "mount · about skills projects", status: "ok" },
  { text: "link · supabase pool", status: "ok" },
  { text: "compile · vortex grid pulse", status: "ok" },
  { text: "system ready", status: "100%" },
];

/** Posisi deterministik supaya SSR dan client menghasilkan markup yang sama. */
const PARTICLES = [
  { left: 8, top: 22, size: 3, delay: 0.0, dur: 7.5 },
  { left: 17, top: 68, size: 2, delay: 1.2, dur: 8.4 },
  { left: 26, top: 34, size: 2, delay: 2.1, dur: 6.8 },
  { left: 34, top: 82, size: 3, delay: 0.6, dur: 9.1 },
  { left: 43, top: 14, size: 2, delay: 1.8, dur: 7.2 },
  { left: 57, top: 74, size: 3, delay: 2.6, dur: 8.0 },
  { left: 66, top: 28, size: 2, delay: 0.9, dur: 6.5 },
  { left: 74, top: 60, size: 3, delay: 1.5, dur: 9.4 },
  { left: 83, top: 18, size: 2, delay: 2.9, dur: 7.7 },
  { left: 91, top: 72, size: 3, delay: 0.3, dur: 8.8 },
  { left: 12, top: 48, size: 2, delay: 2.4, dur: 7.0 },
  { left: 88, top: 44, size: 2, delay: 1.1, dur: 6.9 },
];

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const doneRef = useRef(false);
  const leavingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const clearPending = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    rafRef.current = null;
    timerRef.current = null;
  }, []);

  const startLeaving = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    clearPending();
    setLeaving(true);
    timerRef.current = window.setTimeout(() => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDone();
    }, EXIT);
  }, [clearPending, onDone]);

  const skip = useCallback(() => {
    if (leavingRef.current) return;
    clearPending();
    setProgress(100);
    setShown(LOG.length);
    startLeaving();
  }, [clearPending, startLeaving]);

  // Kunci scroll di balik splash selama masih tampil.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Timeline: progress 0 → 100 lalu tahan sebentar sebelum keluar.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reduced motion: tampil sebagai kartu statis sesaat, tanpa animasi.
    if (reduced) {
      rafRef.current = requestAnimationFrame(() => {
        setProgress(100);
        setShown(LOG.length);
        rafRef.current = null;
        timerRef.current = window.setTimeout(() => {
          if (doneRef.current) return;
          doneRef.current = true;
          onDone();
        }, 900);
      });
      return clearPending;
    }

    const start = performance.now();
    const perLine = DURATION / (LOG.length + 0.5);

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / DURATION);
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      setShown(Math.min(LOG.length, Math.floor(elapsed / perLine)));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      setShown(LOG.length);
      timerRef.current = window.setTimeout(startLeaving, HOLD);
    };

    rafRef.current = requestAnimationFrame(tick);
    return clearPending;
  }, [startLeaving, clearPending, onDone]);

  // Lewati lewat keyboard.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" && event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      skip();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [skip]);

  return (
    <div
      className={`splash${leaving ? " is-leaving" : ""}`}
      onClick={skip}
    >
      <p className="sr-only" role="status">
        Memuat portofolio
      </p>

      <div className="splash__bg" aria-hidden="true">
        <span className="splash__grid" />
        <span className="splash__glow splash__glow--cyan" />
        <span className="splash__glow splash__glow--violet" />
        <span className="splash__beam" />
        {PARTICLES.map((particle, i) => (
          <span
            key={i}
            className="splash__particle"
            style={
              {
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: particle.size,
                height: particle.size,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.dur}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="splash__panel glass" aria-hidden="true">
        <span className="splash__corner splash__corner--tl" />
        <span className="splash__corner splash__corner--tr" />
        <span className="splash__corner splash__corner--bl" />
        <span className="splash__corner splash__corner--br" />
        <span className="splash__gleam" />

        <div className="splash__brand">
          <span className="splash__ring" />
          <span className="splash__mono">IF</span>
        </div>

        <div className="splash__head">
          <p className="splash__title">ItzFebryHcx</p>
          <p className="splash__sub">PORTFOLIO · SYSTEM BOOT</p>
        </div>

        <div className="splash__log">
          {LOG.map((line, i) => (
            <p key={line.text} className={`splash__line${i < shown ? " is-on" : ""}`}>
              <span className="splash__prompt">›</span>
              <span className="splash__txt">{line.text}</span>
              <span className="splash__leader" />
              <span className="splash__ok">{line.status}</span>
            </p>
          ))}
        </div>

        <div className="splash__meter">
          <div className="splash__bar">
            <span className="splash__fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="splash__meta">
            <span>LOADING</span>
            <span className="splash__pct">{String(progress).padStart(3, "0")}%</span>
          </div>
        </div>
      </div>

      <button type="button" className="splash__skip" onClick={(e) => { e.stopPropagation(); skip(); }}>
        Lewati
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

export default function OpeningScreen() {
  const [done, setDone] = useState(false);
  const handleDone = useCallback(() => setDone(true), []);

  if (done) return null;
  return <SplashScreen onDone={handleDone} />;
}
