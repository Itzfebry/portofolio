"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { deleteProject } from "../actions";
import type { Project } from "@/lib/portfolio-data";

import { ProjectForm } from "./ProjectForm";

type AdminSaveState = {
  error?: string;
  success?: string;
};

export function ProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<AdminSaveState, FormData>(
    deleteProject,
    {},
  );
  const [dismissed, setDismissed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (state.success) router.refresh();
  }, [router, state.success]);

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          {editingId === project.id ? (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Edit: {project.title}</h3>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  Batal
                </button>
              </div>
              <ProjectForm project={project} />
            </div>
          ) : (
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                <p className="text-sm text-zinc-400">{project.role ?? "Fullstack"}</p>
                {project.photos && project.photos.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {project.photos.slice(0, 3).map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt=""
                        className="h-10 w-10 rounded-lg border border-zinc-700 object-cover"
                      />
                    ))}
                    {project.photos.length > 3 && (
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-xs text-zinc-400">
                        +{project.photos.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs uppercase tracking-[0.2em] text-zinc-300">
                  {project.status === "published" ? "Dipublikasikan" : "Draf"}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingId(project.id)}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-200 transition hover:border-emerald-400/50 hover:text-white"
                >
                  Edit
                </button>
                <form
                  action={formAction}
                  onSubmit={(e) => {
                    setDismissed(false);
                    if (!window.confirm("Hapus proyek ini?")) {
                      e.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="projectId" value={project.id} />
                  <button
                    disabled={isPending}
                    type="submit"
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/20 disabled:opacity-60"
                  >
                    Hapus
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      ))}

      {!dismissed && (state.success || state.error) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl">
            <div className={state.success ? "text-emerald-300" : "text-red-300"}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-current text-2xl">
                {state.success ? "✓" : "!"}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                {state.success ? "Berhasil dihapus" : "Penghapusan gagal"}
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
    </div>
  );
}
