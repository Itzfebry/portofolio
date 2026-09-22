"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

import GatewayFlow from "@/components/ui/gateway-flow";
import type { Profile, SocialLink } from "@/lib/portfolio-data";

type Stat = { value: string; label: string };

type HeroSceneProps = {
  profile: Profile;
  socialLinks: SocialLink[];
  stats: Stat[];
};

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="arrow h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.2" />
    </svg>
  );
}

export default function HeroScene({ profile, socialLinks, stats }: HeroSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (reduced || touch) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const apply = () => {
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;

      section.style.setProperty("--ry", `${(currentX * 9).toFixed(3)}deg`);
      section.style.setProperty("--rx", `${(-currentY * 7).toFixed(3)}deg`);
      section.style.setProperty("--px", `${(currentX * 26).toFixed(2)}px`);
      section.style.setProperty("--py", `${(currentY * 18).toFixed(2)}px`);

      if (Math.abs(targetX - currentX) > 0.0008 || Math.abs(targetY - currentY) > 0.0008) {
        frame = requestAnimationFrame(apply);
      } else {
        frame = 0;
      }
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = section.getBoundingClientRect();
      targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      start();
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
      start();
    };

    section.addEventListener("pointermove", handlePointerMove, { passive: true });
    section.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", handlePointerLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const words = profile.name.trim().split(/\s+/);
  const lastName = words.length > 1 ? (words.pop() as string) : words[0];
  const firstName = words.join(" ") || lastName;

  return (
    <section id="top" ref={sectionRef} className="hero">
      <div className="hero__backdrop" aria-hidden="true">
        <div className="hero__atmosphere" />
        <GatewayFlow className="pointer-events-none absolute inset-0 h-full w-full opacity-40" density={0.8} opacity={0.55} speed={0.3} />
        <div className="floor" />
        <div className="orb orb--cyan" />
        <div className="orb orb--violet" />
        <div className="orb orb--pink" />
      </div>

      <div className="hero__grid">
        <div className="hero__copy">
          <p className="hero__eyebrow hero-anim" style={{ "--d": "0.1s" } as CSSProperties}>
            <span className="pulse-dot" aria-hidden="true" />
            {profile.headline || profile.role}
          </p>

          <h1 className="hero__title">
            <span className="hero__line">
              <span style={{ "--d": "0.18s" } as CSSProperties}>{firstName}</span>
            </span>
            <span className="hero__line hero__line--accent">
              <span style={{ "--d": "0.34s" } as CSSProperties}>{lastName}</span>
            </span>
          </h1>

          <p className="hero__role hero-anim" style={{ "--d": "0.6s" } as CSSProperties}>
            <strong>{profile.role}</strong> — Junior Web &amp; Mobile Developer
          </p>

          <p className="hero__lead hero-anim" style={{ "--d": "0.72s" } as CSSProperties}>
            Building responsive web and mobile experiences with a focus on clean interfaces, practical
            functionality, and user-centered design.
          </p>

          <div className="hero__cta hero-anim" style={{ "--d": "0.84s" } as CSSProperties}>
            <a href="#projects" className="btn btn-primary">
              View my projects <ArrowUpRight />
            </a>
            <a href="#contact" className="btn btn-ghost">
              Contact me
            </a>
          </div>

          <div className="hero__stats hero-anim" style={{ "--d": "0.96s" } as CSSProperties}>
            {stats.map((stat) => (
              <div key={stat.label} className="stat">
                <p className="stat__value">{stat.value}</p>
                <p className="stat__label">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="hero__meta hero-anim" style={{ "--d": "1.08s" } as CSSProperties}>
            <span className="flex items-center gap-2">
              <PinIcon />
              {profile.location}
            </span>
            <span className="dot" aria-hidden="true" />
            <span className="flex flex-wrap items-center gap-4">
              {socialLinks.map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </span>
          </div>
        </div>

        <div className="hero__scene-wrap">
          <div className="hero__scene">
            <div className="scene__halo" aria-hidden="true" />
            <div className="scene__frame" aria-hidden="true" />
            <div className="scene__orbit scene__orbit--a" aria-hidden="true" />
            <div className="scene__orbit scene__orbit--b" aria-hidden="true" />

            <div className="portrait-stage">
              <Image
                src="/images/Febry.png"
                alt={`${profile.name}, ${profile.role}`}
                width={520}
                height={780}
                priority
                sizes="(max-width: 1024px) 70vw, 420px"
              />
            </div>

            <div className="glass hero-chip hero-chip--tl" style={{ "--z": "120px" } as CSSProperties}>
              <span className="pulse-dot" aria-hidden="true" />
              Open to work
            </div>
            <div className="glass hero-chip hero-chip--br" style={{ "--z": "140px" } as CSSProperties}>
              Web · Mobile · UI
            </div>
            <div className="glass hero-chip hero-chip--mr" style={{ "--z": "90px" } as CSSProperties}>
              {profile.role}
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span className="scroll-cue__track" />
        Scroll
      </div>
    </section>
  );
}
