/**
 * Centralized environment variable management.
 * Follows security rules: some variables are server-only.
 */
export const env = {
  // Server-only
  googleApiKey: process.env.GOOGLE_API_KEY!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,

  // Client-allowed (prefixed with NEXT_PUBLIC_)
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
} as const;
