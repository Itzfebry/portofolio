import { requireAdminSession } from "@/lib/admin";
import { getPortfolioData } from "@/lib/portfolio-data";

import {
  deleteEducation,
  deleteExperience,
  deleteService,
  deleteSkill,
  saveEducation,
  saveExperience,
  saveService,
  saveSkill,
} from "../actions";
import { AdminActionForm } from "../AdminActionForm";

export default async function AdminContentPage() {
  await requireAdminSession();
  const data = await getPortfolioData();

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-400">Konten</p>
        <h1 className="mt-2 text-3xl font-bold">Kelola keahlian, pengalaman, pendidikan, dan layanan</h1>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
        <h2 className="text-xl font-semibold">Keahlian</h2>
        <AdminActionForm action={saveSkill} className="mt-5 grid gap-4 md:grid-cols-4">
          <label className="md:col-span-1">
            <span className="mb-2 block text-sm text-zinc-300">Nama keahlian</span>
            <input name="name" required className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="Next.js" />
          </label>
          <label className="md:col-span-1">
            <span className="mb-2 block text-sm text-zinc-300">Gambar ikon</span>
            <input name="image" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-500 file:px-3 file:py-1.5 file:font-medium file:text-slate-950" />
            <span className="mt-1 block text-xs text-zinc-500">PNG, JPG, WEBP, SVG · maksimal 2 MB</span>
          </label>
          <label className="md:col-span-1">
            <span className="mb-2 block text-sm text-zinc-300">Kategori</span>
            <input name="category" className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="Frontend" />
          </label>
          <label className="md:col-span-1">
            <span className="mb-2 block text-sm text-zinc-300">Tingkat</span>
            <input name="level" type="number" min="0" max="100" defaultValue={90} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" />
          </label>
        </AdminActionForm>

        <div className="mt-5 flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-200">
              {skill.name}
              <AdminActionForm action={deleteSkill} confirmMessage="Hapus keahlian ini?" buttonLabel="Hapus">
                <input type="hidden" name="id" value={skill.id} />
              </AdminActionForm>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
        <h2 className="text-xl font-semibold">Daftar pengalaman</h2>
        <div className="mt-5 space-y-3">
          {data.experiences.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div><p className="font-medium text-white">{item.role}</p><p className="text-sm text-zinc-400">{item.company} · {item.period}</p></div>
              <AdminActionForm action={deleteExperience} confirmMessage="Hapus pengalaman ini?" buttonLabel="Hapus"><input type="hidden" name="id" value={item.id} /></AdminActionForm>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
        <h2 className="text-xl font-semibold">Pengalaman</h2>
        <AdminActionForm action={saveExperience} className="mt-5 grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm text-zinc-300">Peran</span>
            <input name="role" required className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="Pengembang Produk Senior" />
          </label>
          <label>
            <span className="mb-2 block text-sm text-zinc-300">Perusahaan</span>
            <input name="company" required className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="Nama perusahaan" />
          </label>
          <label>
            <span className="mb-2 block text-sm text-zinc-300">Periode</span>
            <input name="period" required className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="2023 - Sekarang" />
          </label>
          <label>
            <span className="mb-2 block text-sm text-zinc-300">Lokasi</span>
            <input name="location" className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="Bondowoso, Indonesia" />
          </label>
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm text-zinc-300">Deskripsi</span>
            <textarea name="description" required rows={4} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="Jelaskan tanggung jawab dan pencapaian Anda." />
          </label>
        </AdminActionForm>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
        <h2 className="text-xl font-semibold">Daftar pendidikan</h2>
        <div className="mt-5 space-y-3">
          {data.education.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div><p className="font-medium text-white">{item.degree}</p><p className="text-sm text-zinc-400">{item.institution} · {item.period}</p></div>
              <AdminActionForm action={deleteEducation} confirmMessage="Hapus pendidikan ini?" buttonLabel="Hapus"><input type="hidden" name="id" value={item.id} /></AdminActionForm>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
        <h2 className="text-xl font-semibold">Pendidikan</h2>
        <AdminActionForm action={saveEducation} className="mt-5 grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm text-zinc-300">Institusi</span>
            <input name="institution" required className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="University" />
          </label>
          <label>
            <span className="mb-2 block text-sm text-zinc-300">Gelar</span>
            <input name="degree" required className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="Sarjana Sains" />
          </label>
          <label>
            <span className="mb-2 block text-sm text-zinc-300">Bidang</span>
            <input name="field" required className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="Ilmu Komputer" />
          </label>
          <label>
            <span className="mb-2 block text-sm text-zinc-300">Period</span>
            <input name="period" required className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="2015 - 2019" />
          </label>
        </AdminActionForm>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
        <h2 className="text-xl font-semibold">Daftar layanan</h2>
        <div className="mt-5 space-y-3">
          {data.services.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div><p className="font-medium text-white">{item.title}</p><p className="text-sm text-zinc-400">{item.price ?? "Harga belum ditentukan"}</p></div>
              <AdminActionForm action={deleteService} confirmMessage="Hapus layanan ini?" buttonLabel="Hapus"><input type="hidden" name="id" value={item.id} /></AdminActionForm>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
        <h2 className="text-xl font-semibold">Layanan</h2>
        <AdminActionForm action={saveService} className="mt-5 grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm text-zinc-300">Judul</span>
            <input name="title" required className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="Product design & development" />
          </label>
          <label>
            <span className="mb-2 block text-sm text-zinc-300">Harga</span>
            <input name="price" className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="From $1,500" />
          </label>
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm text-zinc-300">Deskripsi</span>
            <textarea name="description" required rows={4} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="Jelaskan layanan dan hasil yang dapat diharapkan klien." />
          </label>
        </AdminActionForm>
      </section>
    </div>
  );
}
