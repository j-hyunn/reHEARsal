"use server";

import { getUser } from "@/lib/supabase/auth.server";
import { upsertPersonaSetting } from "@/lib/supabase/queries/personaSettings";
import type { Persona } from "@/lib/supabase/queries/personaSettings";

export async function savePersonaSettingAction(
  persona: Persona,
  customInstructions: string
): Promise<{ success: true } | { error: string }> {
  const user = await getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  try {
    await upsertPersonaSetting(user.id, persona, customInstructions);
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "저장 중 오류가 발생했습니다." };
  }
}
