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

/**
 * Jarak minimum antar frame canvas (ms). Canvas dekoratif viewport-penuh
 * (VortexBg, GatewayFlow) tidak butuh 60fps: di touch device dibatasi ~30fps
 * supaya loop latar tidak menyaingi hydration/LCP di main thread. Desktop
 * (pointer halus) tetap tanpa batas — 60fps.
 */
export function canvasFrameInterval(): number {
  const coarse =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches;
  return coarse ? 1000 / 30 : 0;
}

/**
 * Jalankan `cb` saat main thread sengang — setelah window `load`, lewat
 * `requestIdleCallback` bila ada (timeout sebagai jaring pengaman). Dipakai
 * untuk menunda frame pertama canvas latar hero supaya tidak berkompetisi
 * dengan hydration dan cat pertama (LCP).
 */
export function scheduleCanvasStart(cb: () => void): number {
  const runIdle = () => {
    const idle = (
      window as unknown as {
        requestIdleCallback?: (c: () => void, o?: { timeout: number }) => number;
      }
    ).requestIdleCallback;
    if (typeof idle === "function") idle(cb, { timeout: 900 });
    else window.setTimeout(cb, 220);
  };
  if (document.readyState === "complete") {
    runIdle();
    return 0;
  }
  const onLoad = () => runIdle();
  window.addEventListener("load", onLoad, { once: true });
  return -1;
}
