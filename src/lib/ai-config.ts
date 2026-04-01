import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { decrypt } from "@/lib/crypto";

export const DEFAULT_MODEL = "gemini-2.5-flash";

export interface AiConfig {
  apiKey: string;
  model: string;
  isCustom: boolean;
}

/**
 * 유저의 AI 설정을 조회한다.
 * - user_api_settings에 api_key_enc가 있으면 복호화 후 사용자 키 반환
 * - 없으면 서버 기본 키(GOOGLE_API_KEY) + 기본 모델 반환
 */
export async function getUserAiConfig(userId: string): Promise<AiConfig> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_api_settings")
    .select("api_key_enc, model")
    .eq("user_id", userId)
    .single();

  if (data?.api_key_enc) {
    return {
      apiKey: decrypt(data.api_key_enc),
      model: data.model ?? DEFAULT_MODEL,
      isCustom: true,
    };
  }

  return {
    apiKey: env.googleApiKey,
    model: DEFAULT_MODEL,
    isCustom: false,
  };
}
