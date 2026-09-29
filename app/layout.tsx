import type { Metadata } from "next";
import { Manrope, Unbounded, Fraunces } from "next/font/google";

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

export const metadata: Metadata = {
  title: {
    default: "ItzFebryHcx | Portfolio",
    template: "%s | ItzFebryHcx",
  },
  description: "Portfolio website with editable CMS sections and admin dashboard.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`min-h-full bg-zinc-950 text-white ${unbounded.variable} ${manrope.variable} ${fraunces.variable}`}>
        {children}
      </body>
    </html>
  );
}
