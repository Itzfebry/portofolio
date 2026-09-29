/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Gallery foto proyek. Kursor berubah jadi panah kiri/kanan tergantung sisi
 * yang di-hover, klik untuk pindah foto, dan ada dot navigasi.
 */
export default function ProjectCarousel({ photos, title }: { photos: string[]; title: string }) {
  const total = photos.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total],
  );

  // Jeda auto-scroll selalu pointer masih di atas kartu.
  useEffect(() => {
    const card = trackRef.current?.closest(".glass");
    if (!card) return;
    const enter = () => setPaused(true);
    const leave = () => setPaused(false);
    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);
    return () => {
      card.removeEventListener("mouseenter", enter);
      card.removeEventListener("mouseleave", leave);
    };
  }, [total]);

  // Auto-scroll tiap 3 detik, dimulai ulang tiap kali index berubah supaya
  // setelah klik panah ada jeda penuh sebelum lanjut sendiri.
  useEffect(() => {
    if (total <= 1 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex((i) => (((i + 1) % total) + total) % total), 3000);
    return () => clearInterval(timer);
  }, [total, paused, index]);

  if (total <= 1) {
    return photos[0] ? <img src={photos[0]} alt={title} loading="lazy" /> : null;
  }

  const current = ((index % total) + total) % total;

  return (
    <div className="project-card__carousel">
      <div
        ref={trackRef}
        className="project-card__carousel-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {photos.map((photo, i) => (
          <img key={i} src={photo} alt={`${title} - ${i + 1}`} loading="lazy" />
        ))}
      </div>

      <button
        type="button"
        className="project-card__carousel-nav project-card__carousel-nav--prev"
        onClick={() => goTo(current - 1)}
        aria-label={`Foto sebelumnya dari ${title}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
          <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        className="project-card__carousel-nav project-card__carousel-nav--next"
        onClick={() => goTo(current + 1)}
        aria-label={`Foto berikutnya dari ${title}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
          <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="project-card__carousel-dots">
        {photos.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`project-card__carousel-dot${i === current ? " is-active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Tampilkan foto ${i + 1} dari ${title}`}
            aria-current={i === current}
          />
        ))}
      </div>
    </div>
  );
}
