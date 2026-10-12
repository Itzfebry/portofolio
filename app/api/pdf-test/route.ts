import { NextResponse } from "next/server";

import { renderPdfFirstPageJpeg } from "@/lib/pdf-preview";

export const dynamic = "force-dynamic";

/**
 * Tes sementara: render preview PDF dari DB di runtime server yang SAMA
 * dengan server action admin. HAPUS setelah debugging.
 * Akses: header `x-pdf-test` = nilai ADMIN_ACCESS_WORD.
 */
export async function GET(req: Request) {
  if (req.headers.get("x-pdf-test") !== process.env.ADMIN_ACCESS_WORD) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.json({ ok: false, error: "no env" }, { status: 500 });

  const t0 = Date.now();
  const steps: Record<string, unknown> = {};

  try {
    const res = await fetch(`${url}/rest/v1/certificates?select=file_url&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const rows = await res.json();
    const fileUrl = rows?.[0]?.file_url;
    steps.db = { status: res.status, fileUrl };
    if (!fileUrl) return NextResponse.json({ ok: false, steps }, { status: 500 });

    const pdfRes = await fetch(fileUrl);
    steps.fetch = { status: pdfRes.status, type: pdfRes.headers.get("content-type") };
    const bytes = new Uint8Array(await pdfRes.arrayBuffer());
    steps.bytes = bytes.length;

    const result = await renderPdfFirstPageJpeg(bytes);
    steps.render = result.ok ? { ok: true, jpegBytes: result.jpeg.length } : { ok: false, error: result.error };
    steps.ms = Date.now() - t0;

    return NextResponse.json({ ok: result.ok, steps });
  } catch (error) {
    steps.ms = Date.now() - t0;
    steps.uncaught = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    return NextResponse.json({ ok: false, steps }, { status: 500 });
  }
}
