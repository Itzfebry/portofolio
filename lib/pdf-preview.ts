/**
 * Render halaman pertama PDF menjadi JPEG di server (tanpa browser).
 *
 * Dipakai supaya sertifikat PDF punya preview gambar: Chrome Android dan
 * Safari iOS tidak menampilkan PDF di dalam <iframe>, sehingga kartu
 * sertifikat kosong di HP kalau hanya mengandalkan iframe.
 */

/** Skala maksimal supaya lebar hasil tidak melebihi ~1800px. */
const MAX_SCALE = 2.5;
const TARGET_WIDTH = 1800;

export async function renderPdfFirstPageJpeg(pdf: Uint8Array): Promise<Buffer | null> {
  try {
    const [pdfjs, { createCanvas }] = await Promise.all([
      import("pdfjs-dist/legacy/build/pdf.mjs"),
      import("@napi-rs/canvas"),
    ]);

    const task = pdfjs.getDocument({
      data: pdf,
      useSystemFonts: true,
      useWorkerFetch: false,
    });
    const document = await task.promise;

    try {
      const page = await document.getPage(1);
      const base = page.getViewport({ scale: 1 });
      const scale = Math.min(MAX_SCALE, TARGET_WIDTH / base.width);
      const viewport = page.getViewport({ scale });
      const width = Math.max(1, Math.ceil(viewport.width));
      const height = Math.max(1, Math.ceil(viewport.height));

      const canvas = createCanvas(width, height);
      const context = canvas.getContext("2d");
      // Sebagian PDF punya latar transparan → beri putih supaya teks tetap terbaca.
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);

      // @napi-rs/canvas kompatibel pada runtime; type DOM pdfjs tidak tahu itu.
      await page.render({ canvas: canvas as never, canvasContext: context as never, viewport }).promise;

      return canvas.toBuffer("image/jpeg", 0.85);
    } finally {
      // v6 tidak punya destroy(); cleanup() cukup melepas sumber daya halaman.
      try {
        document.cleanup();
      } catch {
        /* tidak kritis — GC yang menangani sisa memori */
      }
    }
  } catch {
    // PDF rusak/terproteksi → biarkan pemanggil memakai fallback iframe.
    return null;
  }
}
