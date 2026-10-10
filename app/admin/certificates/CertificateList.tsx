/* eslint-disable @next/next/no-img-element */
"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { deleteCertificate } from "../actions";
import type { Certificate } from "@/lib/portfolio-data";

import { CertificateForm } from "./CertificateForm";

type AdminSaveState = {
  error?: string;
  success?: string;
};

export function CertificateList({ certificates }: { certificates: Certificate[] }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<AdminSaveState, FormData>(
    deleteCertificate,
    {},
  );
  const [dismissed, setDismissed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (state.success) router.refresh();
  }, [router, state.success]);

  if (certificates.length === 0) {
    return <p className="text-sm text-zinc-500">Belum ada sertifikat.</p>;
  }

  return (
    <div className="space-y-4">
      {certificates.map((certificate) => (
        <div key={certificate.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          {editingId === certificate.id ? (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Edit: {certificate.title}</h3>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  Batal
                </button>
              </div>
              <CertificateForm certificate={certificate} />
            </div>
          ) : (
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950">
                  {certificate.file_type === "image" ? (
                    <img
                      src={certificate.file_url}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[10px] font-semibold tracking-widest text-zinc-400">
                      PDF
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{certificate.title}</h3>
                  <p className="text-sm text-zinc-400">
                    {certificate.issuer}
                    {certificate.issued_at ? ` · ${certificate.issued_at}` : ""}
                    {" · "}
                    {certificate.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={certificate.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400/50 hover:text-white"
                >
                  Buka
                </a>
                <button
                  type="button"
                  onClick={() => setEditingId(certificate.id)}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-200 transition hover:border-emerald-400/50 hover:text-white"
                >
                  Edit
                </button>
                <form
                  action={formAction}
                  onSubmit={(event) => {
                    setDismissed(false);
                    if (!window.confirm("Hapus sertifikat ini?")) {
                      event.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="certificateId" value={certificate.id} />
                  <input type="hidden" name="fileUrl" value={certificate.file_url} />
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
