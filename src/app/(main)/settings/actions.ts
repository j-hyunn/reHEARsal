"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/supabase/auth.server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ActionResult {
  error?: string;
}

export async function updateDisplayNameAction(
  displayName: string
): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { error: "로그인이 필요합니다. 다시 로그인해주세요." };

  const trimmed = displayName.trim();
  if (!trimmed) return { error: "이름을 입력해주세요." };
  if (trimmed.length > 50) return { error: "이름은 50자 이하여야 합니다." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { full_name: trimmed },
  });

  if (error) {
    return { error: `이름 변경에 실패했습니다: ${error.message}. 다시 시도해주세요.` };
  }

  revalidatePath("/settings");
  return {};
}

export async function deleteAccountAction(): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { error: "로그인이 필요합니다. 다시 로그인해주세요." };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    return { error: `계정 삭제에 실패했습니다: ${error.message}. 다시 시도해주세요.` };
  }

  return {};
}
