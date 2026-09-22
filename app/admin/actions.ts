"use server";

import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { requireAdminSession } from "@/lib/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminLoginState = {
  error?: string;
};

export type AdminSaveState = {
  error?: string;
  success?: string;
};

const ADMIN_ACCESS_WORD = "itzfebryhcx23";
const ADMIN_ACCESS_PIN = "230826";
const ADMIN_SESSION_COOKIE = "portfolio_admin_session";
const ADMIN_SESSION_VALUE = createHash("sha256")
  .update(`${ADMIN_ACCESS_WORD}:${ADMIN_ACCESS_PIN}`)
  .digest("hex");

function getAdminClient(): { client: SupabaseClient } | { error: string } {
  try {
    return { client: createAdminSupabaseClient() };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Konfigurasi database server belum lengkap.",
    };
  }
}

export async function signInAdmin(
  _previousState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const credentialType = String(formData.get("credentialType") ?? "word");
  const secret = String(formData.get("secret") ?? "").trim();

  const isValid =
    (credentialType === "word" && secret === ADMIN_ACCESS_WORD) ||
    (credentialType === "pin" && secret === ADMIN_ACCESS_PIN);

  if (!secret || !isValid) {
    return { error: "Word atau PIN yang dimasukkan salah." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  revalidatePath("/admin");
  redirect("/admin");
}

export async function signOutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);

  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/admin");
  redirect("/admin/login");
}

function parseTechnologies(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function saveProject(
  _previousState: AdminSaveState,
  formData: FormData,
): Promise<AdminSaveState> {
  await requireAdminSession();
  const projectId = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "published");
  const featured = formData.get("featured") === "on";
  const liveUrl = String(formData.get("live_url") ?? "").trim();
  const githubUrl = String(formData.get("github_url") ?? "").trim();
  const technologies = parseTechnologies(formData.get("technologies"));

  if (!title || !summary || !description) {
    return { error: "Judul, ringkasan, dan deskripsi proyek wajib diisi." };
  }

  const admin = getAdminClient();
  if ("error" in admin) return { error: admin.error };
  const supabase = admin.client;
  if (!["published", "draft"].includes(status)) {
    return { error: "Status proyek tidak valid." };
  }
  const slug = String(formData.get("slug") ?? title.toLowerCase().replace(/\s+/g, "-"))
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!slug) {
    return { error: "Slug proyek wajib diisi." };
  }
  const payload = {
    id: projectId || crypto.randomUUID(),
    title,
    slug,
    summary,
    description,
    status,
    featured,
    live_url: liveUrl || null,
    github_url: githubUrl || null,
    technologies,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("projects").upsert(payload, { onConflict: "id" });

  if (error) {
    return { error: error.message || "Proyek tidak dapat disimpan." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { success: "Proyek berhasil disimpan." };
}

export async function deleteProject(
  _previousState: AdminSaveState,
  formData: FormData,
): Promise<AdminSaveState> {
  await requireAdminSession();
  const projectId = String(formData.get("projectId") ?? "").trim();

  if (!projectId) {
    return { error: "Proyek yang akan dihapus tidak ditemukan." };
  }

  const admin = getAdminClient();
  if ("error" in admin) return { error: admin.error };
  const supabase = admin.client;
  const { error } = await supabase.from("projects").delete().eq("id", projectId);

  if (error) {
    return { error: error.message || "Proyek tidak dapat dihapus." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { success: "Proyek berhasil dihapus." };
}

export async function saveSkill(
  _previousState: AdminSaveState,
  formData: FormData,
): Promise<AdminSaveState> {
  await requireAdminSession();
  const title = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "General").trim();
  const parsedLevel = Number(formData.get("level") ?? 80);
  const level = Number.isFinite(parsedLevel) ? Math.min(100, Math.max(0, parsedLevel)) : 80;
  const image = formData.get("image");

  if (!title) {
    return { error: "Nama keahlian wajib diisi." };
  }

  const admin = getAdminClient();
  if ("error" in admin) return { error: admin.error };
  const supabase = admin.client;
  let imageUrl = String(formData.get("image_url") ?? "").trim() || null;

  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) {
      return { error: "File ikon harus berupa gambar." };
    }
    if (image.size > 2 * 1024 * 1024) {
      return { error: "Ukuran gambar maksimal 2 MB." };
    }

    const extension = image.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
    const imagePath = `${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("skill-images")
      .upload(imagePath, image, { contentType: image.type, upsert: false });

    if (uploadError) {
      return { error: uploadError.message || "Gambar ikon tidak dapat diunggah." };
    }

    imageUrl = supabase.storage.from("skill-images").getPublicUrl(imagePath).data.publicUrl;
  }

  const payload = {
    id: String(formData.get("id") ?? crypto.randomUUID()),
    name: title,
    category: category || "General",
    level: Math.min(100, Math.max(0, level)),
    image_url: imageUrl,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("skills").upsert(payload, { onConflict: "id" });

  if (error) {
    return { error: error.message || "Keahlian tidak dapat disimpan." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/content");
  revalidatePath("/");
  return { success: "Keahlian berhasil disimpan." };
}

export async function saveExperience(
  _previousState: AdminSaveState,
  formData: FormData,
): Promise<AdminSaveState> {
  await requireAdminSession();
  const payload = {
    id: String(formData.get("id") ?? crypto.randomUUID()),
    role: String(formData.get("role") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    period: String(formData.get("period") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim() || null,
    updated_at: new Date().toISOString(),
  };

  if (!payload.role || !payload.company || !payload.period || !payload.description) {
    return { error: "Peran, perusahaan, periode, dan deskripsi wajib diisi." };
  }

  const admin = getAdminClient();
  if ("error" in admin) return { error: admin.error };
  const supabase = admin.client;
  const { error } = await supabase.from("experiences").upsert(payload, { onConflict: "id" });

  if (error) {
    return { error: error.message || "Pengalaman tidak dapat disimpan." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/content");
  revalidatePath("/");
  return { success: "Pengalaman berhasil disimpan." };
}

export async function saveEducation(
  _previousState: AdminSaveState,
  formData: FormData,
): Promise<AdminSaveState> {
  await requireAdminSession();
  const payload = {
    id: String(formData.get("id") ?? crypto.randomUUID()),
    institution: String(formData.get("institution") ?? "").trim(),
    degree: String(formData.get("degree") ?? "").trim(),
    field: String(formData.get("field") ?? "").trim(),
    period: String(formData.get("period") ?? "").trim(),
    updated_at: new Date().toISOString(),
  };

  if (!payload.institution || !payload.degree || !payload.field || !payload.period) {
    return { error: "Institusi, gelar, bidang, dan periode wajib diisi." };
  }

  const admin = getAdminClient();
  if ("error" in admin) return { error: admin.error };
  const supabase = admin.client;
  const { error } = await supabase.from("education").upsert(payload, { onConflict: "id" });

  if (error) {
    return { error: error.message || "Pendidikan tidak dapat disimpan." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/content");
  revalidatePath("/");
  return { success: "Pendidikan berhasil disimpan." };
}

export async function saveService(
  _previousState: AdminSaveState,
  formData: FormData,
): Promise<AdminSaveState> {
  await requireAdminSession();
  const payload = {
    id: String(formData.get("id") ?? crypto.randomUUID()),
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim() || null,
    updated_at: new Date().toISOString(),
  };

  if (!payload.title || !payload.description) {
    return { error: "Judul dan deskripsi layanan wajib diisi." };
  }

  const admin = getAdminClient();
  if ("error" in admin) return { error: admin.error };
  const supabase = admin.client;
  const { error } = await supabase.from("services").upsert(payload, { onConflict: "id" });

  if (error) {
    return { error: error.message || "Layanan tidak dapat disimpan." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/content");
  revalidatePath("/");
  return { success: "Layanan berhasil disimpan." };
}

export async function saveProfile(
  _previousState: AdminSaveState,
  formData: FormData,
): Promise<AdminSaveState> {
  await requireAdminSession();
  let supabase;

  try {
    supabase = createAdminSupabaseClient();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Konfigurasi database server belum lengkap.";
    return { error: message };
  }

  const payload = {
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? "").trim() || "Your Name",
    role: String(formData.get("role") ?? "").trim() || "Full-stack developer",
    location: String(formData.get("location") ?? "").trim() || "Indonesia",
    email: String(formData.get("email") ?? "").trim() || "hello@example.com",
    bio: String(formData.get("bio") ?? "").trim() || "I build digital products.",
    headline: String(formData.get("headline") ?? "").trim() || "I design and build thoughtful experiences.",
    updated_at: new Date().toISOString(),
  };

  const { data: existingProfile, error: profileLookupError } = await supabase
    .from("profile")
    .select("id")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (profileLookupError) {
    return {
      error: profileLookupError.message || "Profil tidak dapat dibaca.",
    };
  }

  const profileId = payload.id || existingProfile?.id || crypto.randomUUID();
  const { error } = await supabase
    .from("profile")
    .upsert({ ...payload, id: profileId }, { onConflict: "id" });

  if (error) {
    return { error: error.message || "Profil tidak dapat disimpan." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/settings", "page");
  revalidatePath("/", "page");
  return { success: "Profil berhasil disimpan." };
}

export async function saveSocialLink(
  _previousState: AdminSaveState,
  formData: FormData,
): Promise<AdminSaveState> {
  await requireAdminSession();
  const platform = String(formData.get("platform") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();

  if (!platform && !label && !url) {
    revalidatePath("/admin/settings", "page");
    return { success: "Tidak ada tautan yang diubah." };
  }

  const payload = {
    id: String(formData.get("id") ?? crypto.randomUUID()),
    platform: platform || "Tautan",
    label: label || platform || "Tautan",
    url: url || "#",
    updated_at: new Date().toISOString(),
  };

  const admin = getAdminClient();
  if ("error" in admin) return { error: admin.error };
  const supabase = admin.client;
  const { error } = await supabase.from("social_links").upsert(payload, { onConflict: "id" });

  if (error) {
    return { error: error.message || "Tautan tidak dapat disimpan." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/settings", "page");
  revalidatePath("/", "page");
  return { success: "Tautan berhasil disimpan." };
}

async function deleteAdminRecord(
  table: "social_links" | "skills" | "experiences" | "education" | "services",
  id: string,
  label: string,
): Promise<AdminSaveState> {
  await requireAdminSession();
  if (!id) return { error: `${label} tidak ditemukan.` };
  const admin = getAdminClient();
  if ("error" in admin) return { error: admin.error };
  const { error } = await admin.client.from(table).delete().eq("id", id);
  if (error) return { error: error.message || `${label} tidak dapat dihapus.` };
  revalidatePath("/admin/settings", "page");
  revalidatePath("/admin/content", "page");
  revalidatePath("/", "page");
  return { success: `${label} berhasil dihapus.` };
}

export async function deleteSocialLink(
  _previousState: AdminSaveState,
  formData: FormData,
): Promise<AdminSaveState> {
  return deleteAdminRecord("social_links", String(formData.get("id") ?? "").trim(), "Tautan");
}

export async function deleteSkill(
  _previousState: AdminSaveState,
  formData: FormData,
): Promise<AdminSaveState> {
  return deleteAdminRecord("skills", String(formData.get("id") ?? "").trim(), "Keahlian");
}

export async function deleteExperience(
  _previousState: AdminSaveState,
  formData: FormData,
): Promise<AdminSaveState> {
  return deleteAdminRecord("experiences", String(formData.get("id") ?? "").trim(), "Pengalaman");
}

export async function deleteEducation(
  _previousState: AdminSaveState,
  formData: FormData,
): Promise<AdminSaveState> {
  return deleteAdminRecord("education", String(formData.get("id") ?? "").trim(), "Pendidikan");
}

export async function deleteService(
  _previousState: AdminSaveState,
  formData: FormData,
): Promise<AdminSaveState> {
  return deleteAdminRecord("services", String(formData.get("id") ?? "").trim(), "Layanan");
}
