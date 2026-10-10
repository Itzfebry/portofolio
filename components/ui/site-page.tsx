import type { ReactNode } from "react";

import LiquidGlassShell from "@/components/ui/liquid-glass-shell";
import SectionBg from "@/components/ui/section-bg";
import SubNav from "@/components/ui/sub-nav";
import SaberGlow from "@/components/ui/saber-glow";

type SitePageProps = {
  children: ReactNode;
  /**
   * `home`   → latar sama persis dengan beranda (SectionBg grid).
   * `saber`  → latar beda: medan saber (rotasi random + pulse opacity).
   */
  variant?: "home" | "saber";
  /** Seed agar rotasi saber tiap halaman tidak sama. */
  seed?: number;
  footerName: string;
  footerNote?: string;
};

/**
 * Shell halaman publik baru (/certificate, /project, /project/[slug]).
 * Konsep & gaya sama dengan beranda: nav kaca melayang, `.section` sheet,
 * section-head, footer. Bedanya hanya latar.
 */
export default function SitePage({
  children,
  variant = "home",
  seed = 3,
  footerName,
  footerNote = "Next.js · Tailwind CSS · Supabase",
}: SitePageProps) {
  const isSaber = variant === "saber";

  return (
    <>
      <SubNav />
      <LiquidGlassShell>
        <main className="relative text-white">
          <section className={`section section--page ${isSaber ? "section--saber" : ""}`}>
            {isSaber ? (
              <SaberGlow seed={seed} beams={7} className="saber-field" />
            ) : (
              <SectionBg variant="grid" hue={190} speed={0.25} className="absolute inset-0 opacity-60" />
            )}

            <div className="relative z-10">{children}</div>
          </section>

          <footer className="site-footer">
            <div className="site-footer__inner">
              <p>
                © {new Date().getFullYear()} {footerName}
              </p>
              <p className="hidden sm:block">{footerNote}</p>
              <BackToTop />
            </div>
          </footer>
        </main>
      </LiquidGlassShell>
    </>
  );
}

function BackToTop() {
  return (
    <a href="#top" className="link-arrow text-zinc-400 hover:text-white">
      Back to top
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="arrow h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" />
      </svg>
    </a>
  );
}
