"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/supabase/auth.server";
import { upsertUserProfile } from "@/lib/supabase/queries/profiles";

export interface ProfileActionResult {
  error?: string;
}

export interface SaveProfileInput {
  job_category: string | null;
  years_of_experience: number | null;
  tech_stack: string[];
  skills: string[];
}

export async function saveProfileAction(
  input: SaveProfileInput
): Promise<ProfileActionResult> {
  const user = await getUser();
  if (!user) return { error: "로그인이 필요합니다. 다시 로그인해주세요." };

  await upsertUserProfile({
    user_id: user.id,
    job_category: input.job_category,
    years_of_experience: input.years_of_experience,
    tech_stack: input.tech_stack,
    skills: input.skills,
  });

  revalidatePath("/profile");
  return {};
}
