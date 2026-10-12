"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  /** Elemen pemicu (thumbnail) — fokus dikembalikan ke sini saat lightbox tutup. */
  const triggerRef = useRef<HTMLElement | null>(null);

  const openAt = (i: number) => {
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIndex(i);
  };

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

  // Focus management lightbox: fokus masuk ke tombol Tutup saat dibuka,
  // Tab dikunci di dalam dialog (trap), dan fokus kembali ke thumbnail
  // saat ditutup — supaya pengguna keyboard tidak tersesat di belakang modal.
  useEffect(() => {
    if (index === null) {
      triggerRef.current?.focus();
      return;
    }

    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = dialog.querySelectorAll<HTMLElement>("button, [href]");
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index]);

  if (total === 0) return null;

  const ratio = ratios[index ?? 0] || "";

  // Dimensi intrinsic foto di lightbox: ikut rasio asli bila tersedia,
  // supaya object-contain + aspect-ratio CSS tidak melawan atribut img.
  const [ratioW, ratioH] = ratio.split("/").map((value) => Number(value));
  const hasValidRatio = Number.isFinite(ratioW) && Number.isFinite(ratioH) && ratioW > 0 && ratioH > 0;
  const lightboxWidth = hasValidRatio ? Math.round(ratioW * 100) : 1600;
  const lightboxHeight = hasValidRatio ? Math.round(ratioH * 100) : 1000;

  return (
    <>
      <div className="pdetail-gallery mt-6">
        {photos.map((photo, i) => (
          <figure key={`${photo}-${i}`}>
            <button
              type="button"
              className="pdetail-gallery__zoom"
              onClick={() => openAt(i)}
              aria-label={`Perbesar foto ${i + 1} dari ${title}`}
            >
              <Image
                src={photo}
                alt={`${title} — foto ${i + 1}`}
                width={640}
                height={400}
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </button>
          </figure>
        ))}
      </div>

      {index !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${index + 1} dari ${total} — ${title}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            ref={closeRef}
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
            <Image
              src={photos[index]}
              alt={`${title} — foto ${index + 1}`}
              width={lightboxWidth}
              height={lightboxHeight}
              className="max-h-[82vh] max-w-[92vw] rounded-xl object-contain"
              style={ratio ? { aspectRatio: ratio } : undefined}
              sizes="92vw"
              priority
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
