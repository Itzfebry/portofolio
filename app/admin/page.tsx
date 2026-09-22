import Link from "next/link";

import { requireAdminSession } from "@/lib/admin";
import { getPortfolioData } from "@/lib/portfolio-data";

import { signOutAdmin } from "./actions";

export default async function AdminPage() {
  await requireAdminSession();
  const data = await getPortfolioData();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-400">Dasbor</p>
          <h1 className="mt-2 text-3xl font-bold">Ringkasan portofolio</h1>
        </div>

        <form action={signOutAdmin}>
          <button
            type="submit"
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-emerald-400 hover:text-white"
          >
            Keluar
          </button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Proyek" value={String(data.projects.length)} href="/admin/projects" />
        <StatCard label="Keahlian" value={String(data.skills.length)} href="/admin/content" />
        <StatCard label="Pengalaman" value={String(data.experiences.length)} href="/admin/content" />
        <StatCard label="Layanan" value={String(data.services.length)} href="/admin/content" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <h2 className="text-lg font-semibold">Ringkasan proyek unggulan</h2>
          <div className="mt-4 space-y-4">
            {data.projects.slice(0, 3).map((project) => (
              <div key={project.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{project.title}</h3>
                    <p className="text-sm text-zinc-400">{project.summary}</p>
                  </div>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300 uppercase tracking-[0.2em]">
                    {project.status === "published" ? "Dipublikasikan" : "Draf"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <h2 className="text-lg font-semibold">Aksi cepat</h2>
          <div className="mt-4 space-y-3">
            <Link
              className="block rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 transition hover:border-emerald-400"
              href="/admin/projects"
            >
              Tambah atau ubah proyek
            </Link>
            <Link
              className="block rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 transition hover:border-emerald-400"
              href="/admin/content"
            >
              Kelola keahlian dan pengalaman
            </Link>
            <Link
              className="block rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 transition hover:border-emerald-400"
              href="/admin/settings"
            >
              Ubah profil dan tautan
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 transition hover:border-emerald-400">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </Link>
  );
}
