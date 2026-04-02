import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles the Google OAuth callback from Supabase Auth.
 * Exchanges the authorization code for a session, then redirects:
 * - Success → /upload
 * - Failure → /login?error=true
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=true`);
  }

  const supabase = await createClient();
  const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=true`);
  }

  const user = sessionData.user;
  let isNewUser = false;

  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .upsert(
        {
          user_id: user.id,
          email: user.email ?? null,
          name: (user.user_metadata?.full_name as string) ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select('job_category')
      .single();

    if (profile) {
      isNewUser = profile.job_category === null;
    }
  }

  const isPopup = searchParams.get("popup") === "true";
  if (isPopup) {
    const dest = isNewUser ? `/auth/popup-success?new_user=true` : `/auth/popup-success`;
    return NextResponse.redirect(`${origin}${dest}`);
  }

  return NextResponse.redirect(`${origin}/${isNewUser ? 'onboarding' : 'interview'}`);
}
