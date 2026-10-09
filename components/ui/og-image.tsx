import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactElement } from "react";

import { SITE_NAME, SITE_URL } from "@/lib/site";

export const ogImageSize = {
  width: 1200,
  height: 630,
} as const;

export const ogImageAlt = "ItzFebryHcx — Portofolio Mochammad Ginata Febryansyah, Frontend Developer";

const fontFile = await readFile(
  join(process.cwd(), "node_modules", "next", "dist", "compiled", "@vercel", "og", "Geist-Regular.ttf"),
);

export const ogImageFonts = [
  {
    name: "Geist",
    data: fontFile,
    weight: 400 as const,
    style: "normal" as const,
  },
];

export function renderOgImage(): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #09090b 0%, #0b1224 55%, #134e4a 100%)",
        color: "#ffffff",
        fontFamily: "Geist",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: 30, letterSpacing: 6, color: "#67e8f9" }}>{SITE_NAME}</div>
        <div style={{ fontSize: 76, lineHeight: 1.05, fontWeight: 700 }}>
          Mochammad Ginata Febryansyah
        </div>
        <div style={{ fontSize: 34, color: "#a1a1aa" }}>
          Frontend Developer — Next.js, Laravel, Flutter
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 28, color: "#e4e4e7" }}>{SITE_URL.replace("https://", "")}</div>
        <div style={{ display: "flex", gap: 14 }}>
          <div
            style={{
              fontSize: 24,
              padding: "10px 22px",
              borderRadius: 999,
              border: "2px solid rgba(255,255,255,0.25)",
              color: "#e4e4e7",
            }}
          >
            Web · Mobile · UI/UX
          </div>
        </div>
      </div>
    </div>
  );
}
