import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl shadow-zinc-950/60">
        <p className="text-xs uppercase tracking-[0.32em] text-emerald-400">Akses aman</p>
        <h1 className="mt-3 text-3xl font-bold">Masuk administrasi</h1>
        <p className="mt-2 text-sm text-zinc-400">Gunakan kata sandi atau PIN untuk melanjutkan.</p>

        <LoginForm />
      </div>
    </main>
  );
}
