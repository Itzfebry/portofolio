/* eslint-disable @next/next/no-img-element */
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { saveCertificate } from "../actions";
import type { Certificate } from "@/lib/portfolio-data";

type AdminSaveState = {
  error?: string;
  success?: string;
};

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export function CertificateForm({ certificate }: { certificate?: Certificate }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<AdminSaveState, FormData>(
    saveCertificate,
    {},
  );
  const [dismissed, setDismissed] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(certificate?.file_url ?? null);
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    if (state.success) router.refresh();
  }, [state, router]);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setPreview(certificate?.file_url ?? null);
      setFileName("");
      return;
    }
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      alert("File harus berupa gambar atau PDF.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (file.size > MAX_SIZE) {
      alert("Ukuran file maksimal 2 MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setFileName(`${file.name} · ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => setPreview((event.target?.result as string) ?? null);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const isPdf = certificate?.file_type === "pdf";

  return (
    <form action={formAction} onSubmit={() => setDismissed(false)} className="grid gap-4 md:grid-cols-2">
      <input name="id" type="hidden" value={certificate?.id ?? ""} />
      <input name="existing_file_url" type="hidden" value={certificate?.file_url ?? ""} />

      <label className="md:col-span-1">
        <span className="mb-2 block text-sm text-zinc-300">Nama sertifikat</span>
        <input
          name="title"
          required
          defaultValue={certificate?.title ?? ""}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
          placeholder="Belajar Dasar Pemrograman Web"
        />
      </label>

      <label className="md:col-span-1">
        <span className="mb-2 block text-sm text-zinc-300">Penerbit</span>
        <input
          name="issuer"
          required
          defaultValue={certificate?.issuer ?? ""}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
          placeholder="Dicoding, Google, Dicoding..."
        />
      </label>

      <label className="md:col-span-1">
        <span className="mb-2 block text-sm text-zinc-300">Tanggal / tahun terbit</span>
        <input
          name="issued_at"
          defaultValue={certificate?.issued_at ?? ""}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
          placeholder="Maret 2025"
        />
      </label>

      <label className="md:col-span-1">
        <span className="mb-2 block text-sm text-zinc-300">ID kredensial (opsional)</span>
        <input
          name="credential_id"
          defaultValue={certificate?.credential_id ?? ""}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
          placeholder="FC-12345-XY"
        />
      </label>

      <label className="md:col-span-1">
        <span className="mb-2 block text-sm text-zinc-300">Kategori</span>
        <input
          name="category"
          defaultValue={certificate?.category ?? "Lainnya"}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
          placeholder="Frontend, Cloud, Data..."
        />
      </label>

      <label className="md:col-span-1">
        <span className="mb-2 block text-sm text-zinc-300">Urutan tampil</span>
        <input
          name="sort_order"
          type="number"
          defaultValue={certificate?.sort_order ?? 0}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
        />
      </label>

      <div className="md:col-span-2 grid gap-4 sm:grid-cols-[1.1fr_.9fr]">
        <div>
          <span className="mb-2 block text-sm text-zinc-300">
            File sertifikat (maksimal 2 MB — gambar atau PDF)
          </span>
          <input
            ref={inputRef}
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif,application/pdf"
            onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
            className="block w-full cursor-pointer rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-500 file:px-3 file:py-1.5 file:font-semibold file:text-slate-950"
          />
          <p className="mt-2 text-xs text-zinc-500">
            {fileName || (certificate ? "Biarkan kosong untuk mempertahankan file." : "Belum ada file dipilih.")}
          </p>
        </div>

        <div className="flex items-center justify-center overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950">
          {preview ? (
            preview.toLowerCase().includes(".pdf") || (!isPdf && preview.startsWith("data:application")) ? (
              <object data={preview} type="application/pdf" className="h-40 w-full">
                <span className="p-4 text-xs text-zinc-400">Pratinjau PDF tidak tersedia.</span>
              </object>
            ) : (
              <img src={preview} alt="Pratinjau sertifikat" className="h-40 w-full object-contain" />
            )
          ) : certificate ? (
            <a
              href={certificate.file_url}
              target="_blank"
              rel="noreferrer"
              className="p-4 text-sm text-emerald-300 underline"
            >
              Buka file saat ini {isPdf ? "(PDF)" : "(gambar)"}
            </a>
          ) : (
            <span className="p-4 text-xs text-zinc-500">Pratinjau file</span>
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        <button
          disabled={isPending}
          type="submit"
          className="rounded-xl bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "Memproses..." : certificate ? "Perbarui sertifikat" : "Simpan sertifikat"}
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
