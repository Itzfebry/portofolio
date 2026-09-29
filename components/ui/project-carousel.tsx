/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef } from "react";

export default function ProjectCarousel({ photos, title }: { photos: string[]; title: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (photos.length <= 1) return;

    const track = trackRef.current;
    const dots = dotsRef.current;
    if (!track || !dots) return;

    let current = 0;
    const total = photos.length;

    const goTo = (index: number) => {
      current = ((index % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      Array.from(dots.children).forEach((dot, i) => {
        dot.classList.toggle("is-active", i === current);
      });
    };

    const startAutoScroll = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => goTo(current + 1), 3000);
    };

    const stopAutoScroll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleDotClick = (index: number) => {
      goTo(index);
      startAutoScroll();
    };

    Array.from(dots.children).forEach((dot, i) => {
      dot.addEventListener("click", () => handleDotClick(i));
    });

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mediaQuery.matches) {
      startAutoScroll();
    }

    const parentCard = track.closest(".glass");
    parentCard?.addEventListener("mouseenter", stopAutoScroll);
    parentCard?.addEventListener("mouseleave", startAutoScroll);

    return () => {
      stopAutoScroll();
      parentCard?.removeEventListener("mouseenter", stopAutoScroll);
      parentCard?.removeEventListener("mouseleave", startAutoScroll);
    };
  }, [photos.length]);

  if (photos.length <= 1) {
    return photos[0] ? <img src={photos[0]} alt={title} loading="lazy" /> : null;
  }

  return (
    <div className="project-card__carousel">
      <div className="project-card__carousel-track" ref={trackRef}>
        {photos.map((photo, i) => (
          <img key={i} src={photo} alt={`${title} - ${i + 1}`} loading="lazy" />
        ))}
      </div>
      <div className="project-card__carousel-dots" ref={dotsRef}>
        {photos.map((_, i) => (
          <span key={i} className={`project-card__carousel-dot${i === 0 ? " is-active" : ""}`} />
        ))}
      </div>
    </div>
  );
}
