/**
 * Loading state untuk navigasi client-side antar route.
 * Server component murni — tanpa JS tambahan, cuma spinner CSS.
 */
export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center bg-zinc-950"
      role="status"
      aria-label="Memuat halaman"
    >
      <div className="flex flex-col items-center gap-4">
        <span
          aria-hidden="true"
          className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-cyan-300"
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">Memuat</p>
      </div>
    </div>
  );
}
