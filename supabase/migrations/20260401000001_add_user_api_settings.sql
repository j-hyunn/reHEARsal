-- 사용자 BYOK API 설정 테이블
CREATE TABLE user_api_settings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  model       text NOT NULL DEFAULT 'gemini-2.5-flash',
  api_key_enc text,
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_api_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own api settings only"
  ON user_api_settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
