"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

import GatewayFlow from "@/components/ui/gateway-flow";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import ScrambleText from "@/components/ui/scramble-text";
import TiltCard from "@/components/ui/tilt-card";
import type { Profile, SocialLink } from "@/lib/portfolio-data";

type Stat = { value: string; label: string };

const ROLE_TEXT = "Junior Web & Mobile Developer";
const WHATSAPP_URL = "https://wa.me/6287786445013";
const ROLE_GRADIENT =
  "linear-gradient(100deg, #ffffff 0%, #67e8f9 34%, #a78bfa 66%, #f9a8d4 100%)";

type HeroSceneProps = {
  profile: Profile;
  socialLinks: SocialLink[];
  stats: Stat[];
};

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

/**
 * Splits a line of the name into word groups of animated characters.
 * `--i` drives the staggered entrance; `--count` lets the accent line map
 * its gradient across every character of the word.
 */
function LineChars({ text }: { text: string }) {
  let index = 0;
  const chars = Array.from(text).filter((char) => char.trim() !== "");
  const count = chars.length;

  return (
    <span className="hero__chars" style={{ "--count": String(count) } as CSSProperties}>
      {text.split(/(\s+)/).map((part, partIndex) =>
        part.trim() === "" ? (
          <span key={`gap-${partIndex}`} className="hero__space">
            {part}
          </span>
        ) : (
          <span key={`word-${partIndex}`} className="hero__word">
            {Array.from(part).map((char, charIndex) => {
              const i = index++;
              const pos = count > 1 ? (i * 100) / (count - 1) : 0;
              return (
                <span
                  key={`char-${partIndex}-${charIndex}`}
                  className="hero__char"
                  style={
                    {
                      "--i": String(i),
                      "--pos": `${pos.toFixed(2)}%`,
                    } as CSSProperties
                  }
                >
                  <span className="hero__char-in">{char}</span>
                </span>
              );
            })}
          </span>
        ),
      )}
    </span>
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

  // Show the profile role as a static prefix only when it adds information
  // (i.e. it is not the very same text the decode animation resolves into).
  const roleLabel = profile.role.trim();
  const showRolePrefix =
    roleLabel.length > 0 && roleLabel.toLowerCase() !== ROLE_TEXT.toLowerCase();

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
            <span className="hero__line" style={{ "--base": "0.16s" } as CSSProperties}>
              <LineChars text={firstName} />
            </span>
            <span
              className="hero__line hero__line--accent"
              style={{ "--base": "0.34s" } as CSSProperties}
            >
              <LineChars text={lastName} />
            </span>
          </h1>

          <p className="hero__role hero-anim" style={{ "--d": "0.6s" } as CSSProperties}>
            {showRolePrefix ? (
              <>
                <strong>{roleLabel}</strong>
                <span className="role-sep" aria-hidden="true">
                  —
                </span>
              </>
            ) : null}
            <ScrambleText
              className="role-decode"
              text={ROLE_TEXT}
              delay={950}
              speed={38}
              gradient={ROLE_GRADIENT}
            />
          </p>

          <p className="hero__lead hero-anim" style={{ "--d": "0.72s" } as CSSProperties}>
            Building responsive web and mobile experiences with a focus on clean interfaces, practical
            functionality, and user-centered design.
          </p>

          <div className="hero__cta hero-anim" style={{ "--d": "0.84s" } as CSSProperties}>
            <LiquidMetalButton
              label="View my projects"
              variant="light"
              onClick={() => scrollToSection("projects")}
            />
            <LiquidMetalButton
              label="Contact me"
              labelColor="#ffffff"
              labelWeight={700}
              onClick={() => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")}
            />
          </div>

          <div className="hero__stats hero-anim" style={{ "--d": "0.96s" } as CSSProperties}>
            {stats.map((stat, index) => (
              <TiltCard key={stat.label} className="stat" max={12}>
                <p className="stat__value">
                  <ScrambleText
                    text={stat.value}
                    delay={1150 + index * 220}
                    speed={75}
                    gradient="linear-gradient(120deg, #ffffff 0%, #67e8f9 100%)"
                  />
                </p>
                <p className="stat__label">{stat.label}</p>
              </TiltCard>
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
