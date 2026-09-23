import type { Metadata } from "next";

import "./globals.css";

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
      <body className="min-h-full bg-zinc-950 text-white">{children}</body>
    </html>
  );
}
