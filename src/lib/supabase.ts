import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;
let adminClientKey: string | null = null;

function getSupabaseSecretKey() {
  return process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = getSupabaseSecretKey();

  if (!url || !key) {
    throw new Error(
      "Supabase yapılandırması eksik: NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SECRET_KEY (veya SUPABASE_SERVICE_ROLE_KEY) tanımlanmalıdır.",
    );
  }

  if (!adminClient || adminClientKey !== key) {
    adminClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    adminClientKey = key;
  }

  return adminClient;
}

export const TABLE = "ThoughtNode";
