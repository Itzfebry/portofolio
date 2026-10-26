"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

import type { Certificate } from "@/lib/portfolio-data";

type Props = { items: Certificate[] };

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/**
 * Carousel sertifikat biasa: Embla memegang penuh drag/momentum/snap dan
 * menggeser container flex — kartu tidak pernah di-transform manual.
 * Slide lebih sempit dari viewport (lihat `.cert-deck__slide`), jadi kartu
 * tetangga ikut terlihat menyamping dan diberi class `cert-card--side`
 * (blur + redup) lewat CSS. Tanpa posisi absolut yang saling menumpuk,
 * tak ada bug tumpang-tindih/stack 3D.
 */
export default function CertificateCarousel({ items }: Props) {
  const total = items.length;
  const [active, setActive] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: total > 1, align: "center" });

  const onSelect = useCallback(() => {
    if (emblaApi) setActive(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // Sinkron awal tidak perlu: Embla selalu mulai di snap 0 = state `active`
    // awal. Cukup dengarkan perubahan berikutnya.
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const go = useCallback(
    (step: number) => {
      if (!emblaApi) return;
      if (step > 0) emblaApi.scrollNext();
      else emblaApi.scrollPrev();
    },
    [emblaApi],
  );

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  if (!total) {
    return (
      <div className="cert-empty glass rounded-3xl p-9 text-center">
        <p className="section-index justify-center">Certificates</p>
        <p className="mt-5 text-zinc-400">Belum ada sertifikat yang dipublikasikan.</p>
      </div>
    );
  }

  const activeIndex = ((active % total) + total) % total;
  const current = items[activeIndex];

  return (
    <div className="cert-carousel">
      <div
        ref={emblaRef}
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
      >
        {/* Embla: container = anak pertama root, slides = anak container. */}
        <div className="cert-deck__container">
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <div key={item.id} className="cert-deck__slide">
              <article
                className={`cert-card glass rgb-ring ${isActive ? "" : "cert-card--side"}`}
                aria-hidden={!isActive}
                // React 19: inert mencegah fokus/interaksi di kartu blur.
                inert={!isActive}
                aria-label={`${index + 1} dari ${total}: ${item.title}`}
              >
                <div className="cert-card__media">
                  {item.file_type === "pdf" ? (
                    item.preview_url ? (
                      // Preview JPEG halaman-1 — PDF tidak bisa dirender di
                      // <iframe> pada Chrome Android & Safari iOS.
                      <Image src={item.preview_url} alt={item.title} width={1200} height={800} quality={60} sizes="(max-width: 768px) 92vw, 720px" />
                    ) : (
                      <iframe
                        className="cert-card__frame"
                        src={`${item.file_url}#toolbar=0&view=FitH`}
                        title={item.title}
                        loading="lazy"
                      />
                    )
                  ) : (
                    <Image src={item.file_url} alt={item.title} width={1200} height={800} quality={60} sizes="(max-width: 768px) 92vw, 720px" />
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
            </div>
          );
        })}
        </div>
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
              onClick={() => scrollTo(index)}
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
