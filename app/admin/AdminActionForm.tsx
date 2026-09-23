"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { AdminSaveState } from "./actions";

type AdminAction = (
  previousState: AdminSaveState,
  formData: FormData,
) => Promise<AdminSaveState>;

export function AdminActionForm({
  action,
  children,
  className,
  confirmMessage,
  buttonLabel = "Simpan",
}: {
  action: AdminAction;
  children: React.ReactNode;
  className?: string;
  confirmMessage?: string;
  buttonLabel?: string;
  // NOTE: no encType/method here — React builds the FormData itself for
  // function actions (file inputs are always included) and warns if either
  // attribute is specified.
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<AdminSaveState, FormData>(
    action,
    {},
  );
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        setDismissed(false);
        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      className={className}
    >
      {children}
      <button
        disabled={isPending}
        type="submit"
        className="rounded-xl bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Memproses..." : buttonLabel}
      </button>
      {!dismissed && (state.success || state.error) ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
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
      ) : null}
    </form>
  );
}
