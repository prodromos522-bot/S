import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only: uses the service-role key, which must never reach the browser.
// The browser never talks to Supabase directly — every read/write goes through
// a createServerFn (see orders.functions.ts), so there is no anon key or RLS
// policy to manage for the client side at all.
let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) throw new Error("Supabase is not configured");

  if (!client) client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}
