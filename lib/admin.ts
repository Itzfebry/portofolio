import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_ACCESS_WORD = "itzfebryhcx23";
const ADMIN_ACCESS_PIN = "230826";
const ADMIN_SESSION_COOKIE = "portfolio_admin_session";
const ADMIN_SESSION_VALUE = createHash("sha256")
  .update(`${ADMIN_ACCESS_WORD}:${ADMIN_ACCESS_PIN}`)
  .digest("hex");

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (session !== ADMIN_SESSION_VALUE) {
    redirect("/admin/login");
  }

  return { id: "password-admin" };
}
