/**
 * Util bersama untuk semua komponen canvas 2D (VortexBg, SectionBg,
 * GatewayFlow).
 */

/**
 * `true` bila halaman sedang scrolling (ditandai class `is-scrolling` di
 * <html> oleh <ScrollFx/>).
 *
 * Canvas yang menggambar viewport penuh tiap frame akan bersaing dengan
 * compositor dan membuat scroll tersendat di device kelas menengah. Dengan
 * menahan frame selama scroll (lalu melanjutkan 200ms setelah berhenti),
 * scroll jadi halus tanpa mengubah tampilan — frame terakhir ditahan, bukan
 * dihapus. Pola asli ada di gateway-flow.tsx; di sini dipusatkan.
 */
export function isPageScrolling(): boolean {
  return document.documentElement.classList.contains("is-scrolling");
}

/**
 * DPR untuk canvas: batasi agar jumlah piksel yang dirender masuk akal.
 *
 * Di desktop (pointer halus) pakai sampai 2 — tajam. Di touch device
 * (pointer coarse) batasi 1.5: device sering punya DPR 3, dan tanpa batas ini
 * kita merender ~4× lebih banyak piksel tiap frame untuk efek glow/garis halus
 * yang manfaatnya nyaris tak terlihat saat di-upscale. Hasil: beban GPU jauh
 * lebih ringan, tampilan praktis identik.
 */
export function canvasDpr(overrideMax?: number): number {
  const dpr = window.devicePixelRatio || 1;
  const coarse =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches;
  const cap = overrideMax ?? (coarse ? 1.5 : 2);
  return Math.min(cap, dpr);
}
