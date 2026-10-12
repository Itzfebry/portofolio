import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-zinc-950 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/80">404</p>
      <h1 className="text-3xl font-bold tracking-tight text-white">Halaman tidak ditemukan</h1>
      <p className="max-w-md text-sm leading-6 text-zinc-400">
        Halaman yang kamu cari tidak ada, sudah dipindahkan, atau proyeknya belum
        dipublikasikan.
      </p>
      <Link
        href="/"
        className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:border-cyan-300/50 hover:bg-white/10"
      >
        Kembali ke beranda
      </Link>
    </main>
  );
}
