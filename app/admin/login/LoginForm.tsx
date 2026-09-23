'use client';

import { useState } from 'react';
import { useActionState } from 'react';

import { signInAdmin, type AdminLoginState } from '../actions';

export function LoginForm() {
  const [visible, setVisible] = useState(false);
  const [state, formAction] = useActionState<AdminLoginState, FormData>(
    signInAdmin,
    {},
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="credentialType" value="word" />

      <div className="hack-field">
        <span className="hack-field__prompt" aria-hidden="true">
          $
        </span>
        <input
          id="secret"
          name="secret"
          type={visible ? 'text' : 'password'}
          required
          autoComplete="current-password"
          aria-label="Kata sandi"
          aria-describedby="secret-label"
          placeholder="••••••••••"
        />
        <button
          type="button"
          className="hack-eye"
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? 'sembunyi' : 'lihat'}
        </button>
      </div>

      {state.error ? (
        <p role="alert" className="hack-error">
          [ ERR ] {state.error}
        </p>
      ) : null}

      <button type="submit" className="hack-submit">
        authenticate <span aria-hidden="true">→</span>
      </button>

      <p className="hack-hint">akses terbatas · percakapan terenkripsi</p>
    </form>
  );
}
