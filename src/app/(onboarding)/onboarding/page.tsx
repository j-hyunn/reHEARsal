import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/auth.server";
import { getUserProfile } from "@/lib/supabase/queries/profiles";
import { getUserDocuments } from "@/lib/supabase/queries/documents";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

export default async function OnboardingPage() {
  const user = await getUser();
  const [profile, documents] = await Promise.all([
    getUserProfile(user!.id),
    getUserDocuments(user!.id),
  ]);

  if (profile?.job_category !== null) {
    redirect("/interview");
  }

  return <OnboardingWizard profile={profile} documents={documents} />;
}
