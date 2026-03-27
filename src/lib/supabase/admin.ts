import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Admin Supabase client using service role key.
 * Server-side only — never import from client components.
 */
export function createAdminClient() {
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
