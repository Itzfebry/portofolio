"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

import type { Certificate } from "@/lib/portfolio-data";

/** Berapa banyak kartu yang terlihat menumpuk di belakang kartu aktif. */
const STACK_VISIBLE = 3;
/** Geser minimum (px) sebelum drag dihitung sebagai slide. */
const SWIPE_PX = 48;

type Props = { items: Certificate[] };

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/** Wrap aman: daftar bisa berkurang (hapus dari admin) tanpa reset state. */
function wrap(index: number, total: number) {
  if (!total) return 0;
  return ((index % total) + total) % total;
}

/**
 * Carousel sertifikat bergaya stack: kartu aktif di depan, kartu berikutnya
 * menumpuk miring ke samping kanan, dan navigasi menggeser tumpukan itu ke
 * tengah (slide samping).
 */
export default function CertificateCarousel({ items }: Props) {
  const [active, setActive] = useState(0);
  const pointer = useRef<{ id: number; x: number } | null>(null);
  const total = items.length;

  if (!total) {
    return (
      <div className="cert-empty glass rounded-3xl p-9 text-center">
        <p className="section-index justify-center">Certificates</p>
        <p className="mt-5 text-zinc-400">Belum ada sertifikat yang dipublikasikan.</p>
      </div>
    );
  }

  const activeIndex = wrap(active, total);

  const go = (step: number) => setActive((current) => current + step);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointer.current = { id: event.pointerId, x: event.clientX };
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointer.current;
    pointer.current = null;
    if (!start || start.id !== event.pointerId) return;
    const delta = event.clientX - start.x;
    if (Math.abs(delta) < SWIPE_PX) return;
    go(delta < 0 ? 1 : -1);
  };

  const current = items[activeIndex];

  return (
    <div className="cert-carousel">
      <div
        className="cert-deck"
        role="group"
        aria-roledescription="carousel"
        aria-label="Daftar sertifikat"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            go(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            go(-1);
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointer.current = null;
        }}
      >
        {items.map((item, index) => {
          const offset = (index - activeIndex + total) % total;
          const hidden = offset > STACK_VISIBLE;

          const style = {
            "--offset": offset,
            zIndex: total - offset,
            transform: hidden
              ? "translate3d(64%, 0, 0) scale(.86)"
              : `translate3d(${offset * 4.5}%, ${offset * 1.6}px, 0) scale(${1 - offset * 0.05}) rotate(${offset * 1.4}deg)`,
            opacity: hidden ? 0 : 1 - offset * 0.16,
            pointerEvents: offset === 0 ? "auto" : "none",
          } as CSSProperties;

          return (
            <article
              key={item.id}
              className={`cert-card glass rgb-ring ${offset !== 0 ? "cert-card--stacked" : ""}`}
              style={style}
              aria-hidden={offset !== 0}
              aria-label={`${index + 1} dari ${total}: ${item.title}`}
            >
              <div className="cert-card__media">
                {item.file_type === "pdf" ? (
                  item.preview_url ? (
                    // Preview JPEG halaman-1 — PDF tidak bisa dirender di
                    // <iframe> pada Chrome Android & Safari iOS.
                    <Image src={item.preview_url} alt={item.title} width={1200} height={800} sizes="(max-width: 768px) 92vw, 720px" />
                  ) : (
                    <iframe
                      className="cert-card__frame"
                      src={`${item.file_url}#toolbar=0&view=FitH`}
                      title={item.title}
                      loading="lazy"
                    />
                  )
                ) : (
                  <Image src={item.file_url} alt={item.title} width={1200} height={800} sizes="(max-width: 768px) 92vw, 720px" />
                )}
                <span className="cert-card__badge">{item.file_type === "pdf" ? "PDF" : "Sertifikat"}</span>
              </div>

              <div className="cert-card__body">
                <p className="cert-card__cat">{item.category}</p>
                <h3 className="cert-card__title">{item.title}</h3>
                <p className="cert-card__meta">
                  {item.issuer}
                  {item.issued_at ? ` · ${item.issued_at}` : ""}
                  {item.credential_id ? ` · ID ${item.credential_id}` : ""}
                </p>
                <a
                  className="link-arrow cert-card__open"
                  href={item.file_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Buka file <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      <div className="cert-controls">
        <button type="button" className="cert-btn" onClick={() => go(-1)} aria-label="Sertifikat sebelumnya">
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="cert-dots">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`cert-dot ${index === activeIndex ? "is-active" : ""}`}
              onClick={() => setActive(index)}
              aria-label={`Ke sertifikat ${index + 1}`}
              aria-current={index === activeIndex}
            />
          ))}
        </div>

        <button type="button" className="cert-btn" onClick={() => go(1)} aria-label="Sertifikat berikutnya">
          <ChevronRight className="h-5 w-5" />
        </button>

        <p className="cert-counter" aria-live="polite">
          {pad(activeIndex + 1)} <span>/</span> {pad(total)}
          <span className="cert-counter__title"> — {current.title}</span>
        </p>
      </div>
    </div>
  );
}
