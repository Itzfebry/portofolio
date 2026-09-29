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

const listeners = new Set<() => void>();

let entered = false;

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

/**
 * Kembalikan ke state awal. Dipanggil saat <OpeningScreen /> unmount, supaya
 * kunjungan berikutnya ke beranda menahan entrance lagi (hero dan splash
 * unmount bersamaan, jadi tidak ada yang tertingal pada state lama).
 */
export function resetEntered(): void {
  if (!entered) return;
  entered = false;
  document.documentElement.classList.remove("is-entered");
}
