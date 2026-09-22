import Link from "next/link";

import { signOutAdmin } from "./actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row">
        <aside className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 lg:max-w-xs">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-400">Portfolio</p>
            <h1 className="mt-2 text-2xl font-bold">Administrasi</h1>
          </div>

          <nav className="space-y-2 text-sm text-zinc-300">
            <Link className="block rounded-xl border border-zinc-800 px-3 py-2 transition hover:border-emerald-400 hover:text-white" href="/admin">
              Ringkasan
            </Link>
            <Link className="block rounded-xl border border-zinc-800 px-3 py-2 transition hover:border-emerald-400 hover:text-white" href="/admin/projects">
              Proyek
            </Link>
            <Link className="block rounded-xl border border-zinc-800 px-3 py-2 transition hover:border-emerald-400 hover:text-white" href="/admin/content">
              Konten
            </Link>
            <Link className="block rounded-xl border border-zinc-800 px-3 py-2 transition hover:border-emerald-400 hover:text-white" href="/admin/settings">
              Pengaturan
            </Link>
          </nav>

          <form action={signOutAdmin} className="mt-10">
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-emerald-400"
            >
              Keluar
            </button>
          </form>
        </aside>

        <main className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl shadow-zinc-950/50">
          {children}
        </main>
      </div>
    </div>
  );
}
