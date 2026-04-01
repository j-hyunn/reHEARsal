"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/supabase/auth.server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { encrypt } from "@/lib/crypto";
import { DEFAULT_MODEL } from "@/lib/ai-config";
import { SUPPORTED_MODELS, type SupportedModelId } from "@/lib/models";

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

// Gemini API 키 유효성 검사 (저장 전 호출)
// /v1beta/models 조회 API로 가볍게 검증 — 토큰 소모 없음
async function validateGeminiApiKey(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    return res.ok;
  } catch {
    return false;
  }
}

// 현재 API 설정 조회 (키는 마스킹, 모델명만 반환)
export async function getApiSettingsAction(): Promise<{
  hasCustomKey: boolean;
  model: string;
}> {
  const user = await getUser();
  if (!user) return { hasCustomKey: false, model: DEFAULT_MODEL };

  const supabase = await createClient();
  const { data } = await supabase
    .from("user_api_settings")
    .select("api_key_enc, model")
    .eq("user_id", user.id)
    .single();

  return {
    hasCustomKey: !!data?.api_key_enc,
    model: data?.model ?? DEFAULT_MODEL,
  };
}

// API 키 저장 (유효성 검사 → AES-256 암호화 → upsert)
export async function saveApiKeyAction(
  apiKey: string,
  model: SupportedModelId
): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { error: "로그인이 필요합니다. 다시 로그인해주세요." };

  const trimmed = apiKey.trim();
  if (!trimmed) return { error: "API 키를 입력해주세요." };
  if (!SUPPORTED_MODELS.find((m) => m.id === model)) {
    return { error: "지원하지 않는 모델입니다." };
  }

  // 저장 전 유효성 검사
  const isValid = await validateGeminiApiKey(trimmed);
  if (!isValid) {
    return {
      error: "유효하지 않은 API 키입니다. Google AI Studio에서 키를 확인해주세요.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("user_api_settings").upsert(
    {
      user_id: user.id,
      api_key_enc: encrypt(trimmed),
      model,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return { error: `저장에 실패했습니다: ${error.message}` };
  }

  revalidatePath("/settings");
  return {};
}

// 모델만 변경 (키는 유지)
export async function updateModelAction(
  model: SupportedModelId
): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { error: "로그인이 필요합니다. 다시 로그인해주세요." };

  if (!SUPPORTED_MODELS.find((m) => m.id === model)) {
    return { error: "지원하지 않는 모델입니다." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("user_api_settings")
    .update({ model, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);

  if (error) {
    return { error: `저장에 실패했습니다: ${error.message}` };
  }

  revalidatePath("/settings");
  return {};
}

// API 키 삭제 (기본값으로 초기화)
export async function deleteApiKeyAction(): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { error: "로그인이 필요합니다. 다시 로그인해주세요." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("user_api_settings")
    .upsert(
      {
        user_id: user.id,
        api_key_enc: null,
        model: DEFAULT_MODEL,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    return { error: `삭제에 실패했습니다: ${error.message}` };
  }

  revalidatePath("/settings");
  return {};
}
