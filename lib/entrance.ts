/**
 * Sinyal "hero boleh masuk".
 *
 * Splash screen menutupi halaman selama beberapa detik, tapi animasi masuk di
 * hero dihitung dari saat halaman dimuat — baik yang CSS (`char-in`, `fade-up`,
 * `scene-in`, `role-line-sweep`) maupun yang JS (`OpeningText`, `ScrambleText`).
 * Tanpa penahan, semuanya sudah selesai bermain di balik splash.
 *
 * `<html>` sengaja tidak diberi kelas `is-entered` saat server-render, jadi
 * semuanya tertahan sejak paint pertama. `OpeningScreen` memanggil
 * `markEntered()` tepat saat splash mulai keluar, ketika splash masih opak —
 * begitu ia memudar, hero sudah beranimasi di belakangnya.
 *
 * Tanpa JavaScript kelas itu tidak pernah terpasang; blok `<noscript>` di
 * layout mengembalikan animasi hero seperti semula.
 */

import { SPLASH_SESSION_KEY } from "@/lib/splash-session";

const listeners = new Set<() => void>();

let entered = false;

/**
 * Apakah splash sudah pernah ditonton pada sesi browser ini? (sessionStorage —
 * hilang saat tab ditutup.) Dipakai agar splash hanya tayang sekali per sesi,
 * bukan setiap kali kembali ke beranda. Aman dipanggil saat SSR (false).
 */
export function hasSplashInSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
  } catch {
    return false; // storage diblokir (priv mode) → selalu tayang splash
  }
}

/** Tandai splash sudah ditonton pada sesi ini. */
export function markSplashSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
  } catch {
    /* abaikan */
  }
}

/** Lepas seluruh animasi masuk hero. Aman dipanggil berkali-kali. */
export function markEntered(): void {
  if (entered) return;
  entered = true;
  document.documentElement.classList.add("is-entered");
  listeners.forEach((run) => run());
  listeners.clear();
}

/**
 * Jalankan `fn` sekarang juga kalau hero sudah masuk, atau nanti tepat saat
 * `markEntered()` dipanggil. Berfungsi sebagai unsubscribe.
 */
export function onEnter(fn: () => void): () => void {
  if (entered) {
    fn();
    return () => {};
  }

  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
