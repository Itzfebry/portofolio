"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Link identik dengan navbar beranda (`site-nav.tsx`), hanya targetnya
 * di-prepend `/` supaya dari halaman mana pun langsung kembali ke section
 * yang benar di beranda.
 */
const LINKS = [
  { id: "about", label: "About", href: "/#about" },
  { id: "skills", label: "Skills", href: "/#skills" },
  { id: "projects", label: "Projects", href: "/#projects" },
  { id: "experience", label: "Experience", href: "/#experience" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

const SCROLLED_AT = 24;

/**
 * Nav untuk halaman di luar beranda (/certificate, /project, /project/[slug]).
 * Isi & gaya sama persis dengan navbar beranda (`.site-nav`), hanya href-nya
 * berupa route beranda `/#section`.
 */
export default function SubNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLLED_AT);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="site-nav__bar">
        <Link href="/" className="site-nav__brand" onClick={() => setOpen(false)}>
          <Image
            src="/images/favcion.png"
            alt=""
            width={48}
            height={48}
            className="site-nav__mark"
          />
          Portfolio
        </Link>

        <nav className="site-nav__links" aria-label="Sections">
          {LINKS.map((link) => (
            <Link key={link.id} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-nav__actions">
          <button
            type="button"
            className="site-nav__toggle"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="site-nav__progress" />

      {open && (
        <nav className="site-nav__mobile" aria-label="Mobile sections">
          {LINKS.map((link) => (
            <Link key={link.id} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
