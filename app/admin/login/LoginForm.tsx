'use client';

import { useState } from 'react';
import { useActionState } from 'react';

import { signInAdmin, type AdminLoginState } from '../actions';

export function LoginForm() {
  const [mode, setMode] = useState<'word' | 'pin'>('word');
  const [state, formAction] = useActionState<AdminLoginState, FormData>(
    signInAdmin,
    {},
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="credentialType" value={mode} />

      <div className="rounded-full border border-zinc-700 bg-zinc-950 p-1">
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => setMode('word')}
            className={[
              'rounded-full px-4 py-2 text-sm font-medium transition',
              mode === 'word'
                ? 'bg-emerald-500 text-slate-950'
                : 'text-zinc-300 hover:text-white',
            ].join(' ')}
          >
            Kata sandi
          </button>
          <button
            type="button"
            onClick={() => setMode('pin')}
            className={[
              'rounded-full px-4 py-2 text-sm font-medium transition',
              mode === 'pin'
                ? 'bg-emerald-500 text-slate-950'
                : 'text-zinc-300 hover:text-white',
            ].join(' ')}
          >
            PIN
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300" htmlFor="secret">
          {mode === 'word' ? 'Kata sandi' : 'PIN'}
        </label>
        <input
          id="secret"
          name="secret"
          type="password"
          required
          autoComplete={mode === 'word' ? 'current-password' : 'one-time-code'}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-white outline-none ring-0 transition focus:border-emerald-400"
          placeholder={mode === 'word' ? 'Masukkan kata sandi' : 'Masukkan PIN'}
        />
      </div>

      {state.error ? (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
      >
        Masuk ke administrasi
      </button>
    </form>
  );
}
