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
 * Untuk kunjungan pertama, `is-entered` dijadwalkan lewat setTimeout (1080ms =
 * DURATION 900 + HOLD 180, sinkron dengan `components/ui/splash-screen.tsx`)
 * alih-alih menunggu React hydration memanggil markEntered(). Tanpa ini, hero
 * ber-`opacity:0` (html:not(.is-entered)) sampai hydration selesai — di device
 * lambat itu menunda LCP beberapa detik. markEntered() tetap dipanggil saat
 * splash mulai keluar; penambahan class idempoten.
 *
 * React tidak tahu-menahu soal class tambahan ini; `suppressHydrationWarning`
 * pada <html> di bawah mencegah React mempertanyakan mismatch kelas tersebut.
 */
const splashGateScript = `(function(){try{var h=document.documentElement,k=${JSON.stringify(
  SPLASH_SESSION_KEY,
)};if(sessionStorage.getItem(k)==="1"){h.classList.add("is-entered","splash-skip");return;}setTimeout(function(){h.classList.add("is-entered");},1080);}catch(e){}})();`;

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
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} crossOrigin="" />
        )}
        {/* Preload the LCP hero image so it starts downloading before JS hydration */}
        <link rel="preload" as="image" href="/_next/image?url=%2Fimages%2FFebry.png&w=1080&q=75" />
        {/* Skip if env has explicit image URL override */}
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} crossOrigin="" />
        )}
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
