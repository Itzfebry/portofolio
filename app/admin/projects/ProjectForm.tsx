"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { saveProject } from "../actions";
import type { Project } from "@/lib/portfolio-data";

type AdminSaveState = {
  error?: string;
  success?: string;
};

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<AdminSaveState, FormData>(
    saveProject,
    {},
  );
  const [dismissed, setDismissed] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>(project?.photos ?? []);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);

  useEffect(() => {
    if (state.success) {
      router.refresh();
      setPhotoPreviews(project?.photos ?? []);
      setNewPhotos([]);
    }
  }, [router, state.success, project?.photos]);

  const handlePhotoChange = (index: number, file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }
    if (file.size > 500 * 1024) {
      alert("Ukuran foto maksimal 500KB.");
      return;
    }
    const updated = [...newPhotos];
    updated[index] = file;
    setNewPhotos(updated);
    const reader = new FileReader();
    reader.onload = (e) => {
      const previews = [...photoPreviews];
      previews[index] = e.target?.result as string;
      setPhotoPreviews(previews);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (index: number) => {
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
    setNewPhotos(newPhotos.filter((_, i) => i !== index));
  };

  const existingPhotosJson = JSON.stringify(
    photoPreviews.filter((p) => p.startsWith("http")),
  );

  return (
    <form action={formAction} onSubmit={() => setDismissed(false)} className="grid gap-4 md:grid-cols-2">
      <input name="id" type="hidden" value={project?.id ?? ""} />
      <input name="existing_photos" type="hidden" value={existingPhotosJson} />

      <label className="md:col-span-1">
        <span className="mb-2 block text-sm text-zinc-300">Judul proyek</span>
        <input
          name="title"
          required
          defaultValue={project?.title ?? ""}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
          placeholder="Judul proyek"
        />
      </label>

      <label className="md:col-span-1">
        <span className="mb-2 block text-sm text-zinc-300">Slug URL</span>
        <input
          name="slug"
          defaultValue={project?.slug ?? ""}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
          placeholder="project-slug"
        />
      </label>

      <label className="md:col-span-1">
        <span className="mb-2 block text-sm text-zinc-300">Role</span>
        <input
          name="role"
          defaultValue={project?.role ?? "Fullstack"}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
          placeholder="Fullstack"
        />
      </label>

      <label className="md:col-span-1">
        <span className="mb-2 block text-sm text-zinc-300">Status</span>
        <select
          name="status"
          defaultValue={project?.status ?? "published"}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
        >
          <option value="published">Dipublikasikan</option>
          <option value="draft">Draf</option>
        </select>
      </label>

      <label className="md:col-span-2">
        <span className="mb-2 block text-sm text-zinc-300">Ringkasan</span>
        <input
          name="summary"
          required
          defaultValue={project?.summary ?? ""}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
          placeholder="Ringkasan singkat"
        />
      </label>

      <label className="md:col-span-2">
        <span className="mb-2 block text-sm text-zinc-300">Deskripsi</span>
        <textarea
          name="description"
          required
          rows={5}
          defaultValue={project?.description ?? ""}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
          placeholder="Detail proyek"
        />
      </label>

      <label className="md:col-span-1">
        <span className="mb-2 block text-sm text-zinc-300">URL demo</span>
        <input
          name="live_url"
          type="url"
          defaultValue={project?.live_url ?? ""}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
          placeholder="https://"
        />
      </label>

      <label className="md:col-span-1">
        <span className="mb-2 block text-sm text-zinc-300">URL GitHub</span>
        <input
          name="github_url"
          type="url"
          defaultValue={project?.github_url ?? ""}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
          placeholder="https://github.com"
        />
      </label>

      <label className="md:col-span-2">
        <span className="mb-2 block text-sm text-zinc-300">Teknologi</span>
        <input
          name="technologies"
          defaultValue={project?.technologies?.join(", ") ?? ""}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
          placeholder="Next.js, Supabase, PostgreSQL"
        />
      </label>

      <label className="md:col-span-2">
        <span className="mb-2 block text-sm text-zinc-300">
          Foto proyek (maks 5 foto, maks 500KB per foto)
        </span>
        <div className="grid gap-3 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="relative">
              {photoPreviews[i] ? (
                <div className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-700">
                  <img src={photoPreviews[i]} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute right-1 top-1 rounded-full bg-red-500/80 p-1 text-white opacity-0 transition group-hover:opacity-100"
                    aria-label={`Hapus foto ${i + 1}`}
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 transition hover:border-emerald-400/50 hover:bg-zinc-900">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhotoChange(i, e.target.files?.[0] ?? null)}
                  />
                  <span className="text-xs text-zinc-500">+ Foto</span>
                </label>
              )}
            </div>
          ))}
        </div>
      </label>

      <label className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 md:col-span-1">
        <input
          name="featured"
          type="checkbox"
          defaultChecked={project?.featured ?? false}
          className="h-4 w-4 accent-emerald-500"
        />
        Proyek unggulan
      </label>

      <div className="md:col-span-2">
        <button
          disabled={isPending}
          type="submit"
          className="rounded-xl bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "Memproses..." : project ? "Perbarui proyek" : "Simpan proyek"}
        </button>
      </div>

      {!dismissed && (state.success || state.error) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm md:col-span-2">
          <div role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl">
            <div className={state.success ? "text-emerald-300" : "text-red-300"}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-current text-2xl">
                {state.success ? "✓" : "!"}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                {state.success ? "Berhasil disimpan" : "Penyimpanan gagal"}
              </h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-300">{state.success ?? state.error}</p>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
