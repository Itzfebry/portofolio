/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type ProjectGalleryProps = {
  photos: string[];
  /** Rasio asli tiap foto ("16/9", "9/16", ...), selaras dengan `photos`. */
  ratios?: string[];
  title: string;
};

/**
 * Galeri foto project: thumbnail grid seragam (crop tengah), klik untuk buka
 * lightbox yang menampilkan foto utuh tanpa crop + navigasi keyboard.
 */
export default function ProjectGallery({ photos, ratios = [], title }: ProjectGalleryProps) {
  const total = photos.length;
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setIndex((current) => (current === null ? current : (current + delta + total) % total)),
    [total],
  );

  useEffect(() => {
    if (index === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };

    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [index, close, step]);

  if (total === 0) return null;

  const ratio = ratios[index ?? 0] || "";

  return (
    <>
      <div className="pdetail-gallery mt-6">
        {photos.map((photo, i) => (
          <figure key={`${photo}-${i}`}>
            <button
              type="button"
              className="pdetail-gallery__zoom"
              onClick={() => setIndex(i)}
              aria-label={`Perbesar foto ${i + 1} dari ${title}`}
            >
              <img src={photo} alt={`${title} — foto ${i + 1}`} loading="lazy" />
            </button>
          </figure>
        ))}
      </div>

      {index !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${index + 1} dari ${total} — ${title}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Tutup lightbox"
            className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-black/60 p-2 text-zinc-300 transition hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              step(-1);
            }}
            aria-label="Foto sebelumnya"
            className="absolute left-3 z-10 rounded-full border border-white/15 bg-black/60 p-2.5 text-zinc-300 transition hover:text-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              step(1);
            }}
            aria-label="Foto berikutnya"
            className="absolute right-3 z-10 rounded-full border border-white/15 bg-black/60 p-2.5 text-zinc-300 transition hover:text-white"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            className="flex max-h-full max-w-full flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={photos[index]}
              alt={`${title} — foto ${index + 1}`}
              className="max-h-[82vh] max-w-[92vw] rounded-xl object-contain"
              style={ratio ? { aspectRatio: ratio } : undefined}
            />
            <p className="mt-3 text-center font-mono text-xs tracking-[.15em] text-zinc-400">
              {index + 1} / {total}
              {ratio ? ` · ${ratio}` : ""}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
