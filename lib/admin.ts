import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Kata sandi admin TIDAK ditulis di repo. Isi `ADMIN_ACCESS_WORD` di
 * `.env.local` (lokal) dan environment variables Vercel (produksi).
 * Tanpa env, seluruh area admin otomatis terkunci.
 */
const ADMIN_ACCESS_WORD = process.env.ADMIN_ACCESS_WORD;

const ADMIN_SESSION_COOKIE = "portfolio_admin_session";

export { ADMIN_SESSION_COOKIE };

/**
 * Nilai cookie diturunkan dari kata sandi lewat hash ber-salt, sehingga
 * bisa diverifikasi stateless tanpa menyimpan sesi di database.
 * Ganti kata sandi = seluruh sesi lama otomatis mati.
 */
export function adminSessionValue(): string | null {
  if (!ADMIN_ACCESS_WORD) return null;
  return createHash("sha256")
    .update(`portfolio-admin:${ADMIN_ACCESS_WORD}`)
    .digest("hex");
}

export async function requireAdminSession() {
  const expected = adminSessionValue();
  // Env belum diisi = admin terkunci penuh. Redirect (bukan throw) supaya
  // build Next tetap mengenali route ini sebagai dynamic, bukan error.
  if (!expected) {
    redirect("/admin/login");
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (session !== expected) {
    redirect("/admin/login");
  }

  return { id: "password-admin" };
}

/** Non-redirecting session check — used by the layout to hide the sidebar. */
export async function hasAdminSession() {
  const expected = adminSessionValue();
  if (!expected) return false;

  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value === expected;
}
