/**
 * Kunci sessionStorage yang menandai "splash sudah pernah ditonton pada sesi
 * browser ini".
 *
 * Dipakai di dua tempat yang harus selalu sepakat:
 *  - lib/entrance.ts   → sisi React (markSplashSeen / hasSplashInSession)
 *  - app/layout.tsx    → inline pre-paint script yang membaca kunci ini sebelum
 *                        React hydration, supaya splash tidak sempat flash lalu
 *                        hilang pada sesi yang sudah menonton.
 *
 * Karena itu konstanta ini diekspor dari satu berkas sumber, bukan diduplikasi
 * sebagai string literal.
 */
export const SPLASH_SESSION_KEY = "portfolio:splash-seen";
