import { requireAdminSession } from "@/lib/admin";
import { getPortfolioData } from "@/lib/portfolio-data";

import { deleteProject, saveProject } from "../actions";
import { AdminActionForm } from "../AdminActionForm";

export default async function AdminProjectsPage() {
  await requireAdminSession();
  const data = await getPortfolioData();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-400">Proyek</p>
        <h1 className="mt-2 text-3xl font-bold">Buat dan kelola proyek portofolio</h1>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
        <h2 className="text-xl font-semibold">Tambah atau ubah proyek</h2>

        <AdminActionForm action={saveProject} className="mt-6 grid gap-4 md:grid-cols-2">
          <input name="id" type="hidden" />
          <label className="md:col-span-1">
            <span className="mb-2 block text-sm text-zinc-300">Judul proyek</span>
            <input name="title" required className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="Judul proyek" />
          </label>

          <label className="md:col-span-1">
            <span className="mb-2 block text-sm text-zinc-300">Slug URL</span>
            <input name="slug" className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="project-slug" />
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm text-zinc-300">Ringkasan</span>
            <input name="summary" required className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="Ringkasan singkat" />
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm text-zinc-300">Deskripsi</span>
            <textarea name="description" required rows={5} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="Detail proyek" />
          </label>

          <label className="md:col-span-1">
            <span className="mb-2 block text-sm text-zinc-300">URL demo</span>
            <input name="live_url" type="url" className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="https://" />
          </label>

          <label className="md:col-span-1">
            <span className="mb-2 block text-sm text-zinc-300">URL GitHub</span>
            <input name="github_url" type="url" className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="https://github.com" />
          </label>

          <label className="md:col-span-1">
            <span className="mb-2 block text-sm text-zinc-300">Status</span>
            <select name="status" defaultValue="published" className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400">
              <option value="published">Dipublikasikan</option>
              <option value="draft">Draf</option>
            </select>
          </label>

          <label className="md:col-span-1 flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200">
            <input name="featured" type="checkbox" className="h-4 w-4 accent-emerald-500" />
            Proyek unggulan
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm text-zinc-300">Teknologi</span>
            <input name="technologies" className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="Next.js, Supabase, PostgreSQL" />
          </label>

        </AdminActionForm>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
        <h2 className="text-xl font-semibold">Daftar proyek</h2>
        <div className="mt-5 space-y-4">
          {data.projects.map((project) => (
            <div key={project.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                  <p className="text-sm text-zinc-400">{project.summary}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs uppercase tracking-[0.2em] text-zinc-300">
                    {project.status === "published" ? "Dipublikasikan" : "Draf"}
                  </span>
                  <AdminActionForm action={deleteProject} confirmMessage="Hapus proyek ini?">
                    <input type="hidden" name="projectId" value={project.id} />
                  </AdminActionForm>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
