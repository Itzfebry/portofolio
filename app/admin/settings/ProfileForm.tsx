"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { saveProfile, type AdminSaveState } from "../actions";

type ProfileFormProps = {
  profile: {
    name: string;
    role: string;
    location: string;
    email: string;
    bio: string;
    headline: string;
  };
};

const initialState: AdminSaveState = {};

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    saveProfile,
    initialState,
  );
  const [isNoticeDismissed, setIsNoticeDismissed] = useState(false);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <form
      action={formAction}
      onSubmit={() => setIsNoticeDismissed(false)}
      className="mt-5 grid gap-4 md:grid-cols-2"
    >
      <label>
        <span className="mb-2 block text-sm text-zinc-300">Nama</span>
        <input name="name" defaultValue={profile.name} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" />
      </label>
      <label>
        <span className="mb-2 block text-sm text-zinc-300">Peran</span>
        <input name="role" defaultValue={profile.role} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" />
      </label>
      <label>
        <span className="mb-2 block text-sm text-zinc-300">Lokasi</span>
        <input name="location" defaultValue={profile.location} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" />
      </label>
      <label>
        <span className="mb-2 block text-sm text-zinc-300">Email</span>
        <input name="email" type="email" defaultValue={profile.email} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" />
      </label>
      <label className="md:col-span-2">
        <span className="mb-2 block text-sm text-zinc-300">Judul utama</span>
        <input name="headline" defaultValue={profile.headline} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" />
      </label>
      <label className="md:col-span-2">
        <span className="mb-2 block text-sm text-zinc-300">Biodata</span>
        <textarea name="bio" rows={4} defaultValue={profile.bio} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-emerald-400" />
      </label>
      <div className="md:col-span-2 flex justify-end">
        <button disabled={isPending} type="submit" className="rounded-xl bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60">
          {isPending ? "Menyimpan..." : "Simpan profil"}
        </button>
      </div>

      {!isNoticeDismissed && (state.success || state.error) ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm" role="presentation">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="profile-save-notice-title"
            className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl shadow-black/50"
          >
            <div className={state.success ? "text-emerald-300" : "text-red-300"}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-current text-2xl">
                {state.success ? "✓" : "!"}
              </div>
              <h3 id="profile-save-notice-title" className="mt-4 text-xl font-semibold text-white">
                {state.success ? "Berhasil disimpan" : "Penyimpanan gagal"}
              </h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              {state.success ?? state.error}
            </p>
            <button
              type="button"
              onClick={() => setIsNoticeDismissed(true)}
              className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Tutup
            </button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
