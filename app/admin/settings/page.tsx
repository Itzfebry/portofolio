import { requireAdminSession } from "@/lib/admin";
import { getPortfolioData } from "@/lib/portfolio-data";

import { deleteSocialLink, saveSocialLink } from "../actions";
import { AdminActionForm } from "../AdminActionForm";
import { ProfileForm } from "./ProfileForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; editSocial?: string }>;
}) {
  await requireAdminSession();
  const data = await getPortfolioData();
  const { error, success, editSocial } = await searchParams;
  const selectedSocial = data.socialLinks.find((link) => link.id === editSocial);

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-400">Pengaturan</p>
        <h1 className="mt-2 text-3xl font-bold">Pengaturan profil dan media sosial</h1>
      </div>

      {error ? (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      {success ? (
        <div role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {success}
        </div>
      ) : null}

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
        <h2 className="text-xl font-semibold">Detail profil</h2>
        <ProfileForm profile={data.profile} />
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
        <h2 className="text-xl font-semibold">Tautan media sosial</h2>
        <AdminActionForm action={saveSocialLink} className="mt-5 grid gap-4 md:grid-cols-3">
          <input name="id" type="hidden" value={selectedSocial?.id ?? ""} />
          <label>
            <span className="mb-2 block text-sm text-zinc-300">Platform</span>
            <input name="platform" defaultValue={selectedSocial?.platform} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="GitHub" />
          </label>
          <label>
            <span className="mb-2 block text-sm text-zinc-300">Label</span>
            <input name="label" defaultValue={selectedSocial?.label} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="GitHub" />
          </label>
          <label>
            <span className="mb-2 block text-sm text-zinc-300">URL</span>
            <input name="url" type="url" defaultValue={selectedSocial?.url === "#" ? "" : selectedSocial?.url} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" placeholder="https://" />
          </label>
        </AdminActionForm>
        {selectedSocial ? <Link href="/admin/settings" className="mt-3 inline-block text-sm text-zinc-400 hover:text-white">Batal edit</Link> : null}
        <div className="mt-6 space-y-3">
          {data.socialLinks.map((link) => (
            <div key={link.id} className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div>
                <p className="font-medium text-white">{link.label}</p>
                <p className="text-sm text-zinc-400">{link.url}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-zinc-700 px-2 py-1 text-xs text-zinc-300">{link.platform}</span>
                <Link href={`/admin/settings?editSocial=${link.id}`} className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 hover:border-emerald-400">Edit</Link>
                <AdminActionForm action={deleteSocialLink} confirmMessage="Hapus tautan ini?" buttonLabel="Hapus">
                  <input type="hidden" name="id" value={link.id} />
                </AdminActionForm>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
