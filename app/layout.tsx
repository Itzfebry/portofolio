import type { Metadata } from "next";
import { Manrope, Unbounded, Fraunces } from "next/font/google";

import { SITE_LANG, SITE_LOCALE, SITE_NAME, SITE_URL } from "@/lib/site";
import { SPLASH_SESSION_KEY } from "@/lib/splash-session";

import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-artistic",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-name",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-artistic-italic",
  display: "swap",
});

const DESCRIPTION =
  "Portofolio Mochammad Ginata Febryansyah (ItzFebryHcx), Frontend Developer dari Bondowoso, Indonesia. " +
  "Karya web app, mobile app, dan UI/UX berbasis Next.js, Laravel, Flutter, dan Supabase.";

/**
 * Pre-paint gate untuk splash screen.
 *
 * Splash hanya tayang sekali per sesi browser. Kalau sesi ini sudah menonton
 * splash, script inline ini (sinkron saat parse <head>, sebelum paint) menyetel
 * dua class di <html>:
 *
 *  - `is-entered`  → membuka seluruh entrance hero sejak paint pertama, jadi
 *                    konten tidak pernah tersembunyi menunggu hydration.
 *  - `splash-skip` → menyembunyikan splash yang sudah ter-render di HTML SSR
 *                    lewat CSS, sehingga tidak ada flash splash lalu hilang.
 *
 * React tidak tahu-menahu soal class tambahan ini; `suppressHydrationWarning`
 * pada <html> di bawah mencegah React mempertanyakan mismatch kelas tersebut.
 */
const splashGateScript = `(function(){try{if(sessionStorage.getItem(${JSON.stringify(
  SPLASH_SESSION_KEY,
)})==="1"){var h=document.documentElement;h.classList.add("is-entered","splash-skip");}}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ItzFebryHcx | Portofolio — Mochammad Ginata Febryansyah",
    template: "%s | ItzFebryHcx",
  },
  description: DESCRIPTION,
  keywords: [
    "ItzFebryHcx",
    "Mochammad Ginata Febryansyah",
    "portofolio frontend developer",
    "developer Bondowoso",
    "web developer Indonesia",
    "Next.js developer Indonesia",
    "Laravel developer",
    "Flutter developer",
    "UI UX designer",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: "Mochammad Ginata Febryansyah", url: SITE_URL }],
  creator: "Mochammad Ginata Febryansyah",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "ItzFebryHcx | Portofolio",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "ItzFebryHcx | Portofolio",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE_LANG} className="h-full antialiased" suppressHydrationWarning>
      <body className={`min-h-full bg-zinc-950 text-white ${unbounded.variable} ${manrope.variable} ${fraunces.variable}`}>
        {/* Preconnect diangkat React 19 ke <head>; kalau tidak, browser tetap
            memakainya — link preconnect sah berada di body. */}
        <link rel="preconnect" href="https://cdn.simpleicons.org" crossOrigin="" />
        {/* Gate splash: harus dieksekusi sinkron saat parse, SEBELUM markup
            splash/hero di bawahnya selesai di-parse — jadi sebelum paint
            pertama. Taruh di awal body, bukan memakai next/script
            beforeInteractive (inline di situ dieksekusi nanti lewat antrean
            self.__next_s, terlambat untuk gate ini). */}
        <script dangerouslySetInnerHTML={{ __html: splashGateScript }} />
        {children}
      </body>
    </html>
  );
}
