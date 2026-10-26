import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

/** Hostname Supabase dari env; wildcard kalau env belum terisi (build lokal). */
function supabaseHostname(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return "**";
  try {
    return new URL(raw).hostname;
  } catch {
    return "**";
  }
}

const nextConfig: NextConfig = {
  // Paket native/berat dijalankan apa adanya via Node — jangan dibundler.
  serverExternalPackages: ["pdfjs-dist", "@napi-rs/canvas"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      // Foto proyek & sertifikat diambil dari bucket publik Supabase.
      {
        protocol: "https",
        hostname: supabaseHostname(),
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default process.env.ANALYZE === "true"
  ? bundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig;