import type { Metadata } from "next";
import { Manrope, Unbounded, Fraunces } from "next/font/google";

import { SITE_LANG, SITE_LOCALE, SITE_NAME, SITE_URL } from "@/lib/site";

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
    <html lang={SITE_LANG} className="h-full antialiased">
      <body className={`min-h-full bg-zinc-950 text-white ${unbounded.variable} ${manrope.variable} ${fraunces.variable}`}>
        {children}
      </body>
    </html>
  );
}
