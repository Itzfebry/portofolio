import { requireAdminSession } from "@/lib/admin";
import { getCertificates } from "@/lib/portfolio-data";

import { CertificateForm } from "./CertificateForm";
import { CertificateList } from "./CertificateList";

export default async function AdminCertificatesPage() {
  await requireAdminSession();
  const certificates = await getCertificates();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-400">Sertifikat</p>
        <h1 className="mt-2 text-3xl font-bold">Kelola sertifikat untuk halaman /certificate</h1>
        <p className="mt-2 text-sm text-zinc-400">
          File maksimal 2 MB — gambar (JPG/PNG/WebP) atau PDF.
        </p>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
        <h2 className="text-xl font-semibold">Tambah atau ubah sertifikat</h2>
        <div className="mt-6">
          <CertificateForm />
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
        <h2 className="text-xl font-semibold">Daftar sertifikat</h2>
        <div className="mt-5">
          <CertificateList certificates={certificates} />
        </div>
      </section>
    </div>
  );
}
