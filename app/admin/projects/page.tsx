import { requireAdminSession } from "@/lib/admin";
import { getPortfolioData } from "@/lib/portfolio-data";

import { ProjectForm } from "./ProjectForm";
import { ProjectList } from "./ProjectList";

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
        <div className="mt-6">
          <ProjectForm />
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
        <h2 className="text-xl font-semibold">Daftar proyek</h2>
        <div className="mt-5">
          <ProjectList projects={data.projects} />
        </div>
      </section>
    </div>
  );
}
