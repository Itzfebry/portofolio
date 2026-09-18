import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function Home() {
  const status = isSupabaseConfigured ? "Terhubung ke Supabase" : "Belum terhubung";

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-12 text-white">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-emerald-400">
          Supabase
        </p>
        <h1 className="text-3xl font-bold">Status koneksi</h1>

        <div className="mt-6 rounded-xl border border-zinc-700 bg-zinc-950/70 p-4">
          <p className="text-lg font-medium">{status}</p>
          <p className="mt-2 text-sm text-zinc-400">
            {supabase
              ? "Env Supabase berhasil dibaca dan client siap digunakan."
              : "Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY sudah tersedia di .env.local."}
          </p>
        </div>
      </div>
    </main>
  );
}
