import { createClient } from "@supabase/supabase-js";

/**
 * Non-cookie Supabase client for public, read-only data.
 *
 * Using `next/headers` cookies would force every public route into dynamic
 * rendering. This client keeps the anon role (same access as an anonymous
 * visitor), so pages can be prerendered and revalidated statically — better
 * TTFB for crawlers and visitors.
 */
export function createPublicSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}
