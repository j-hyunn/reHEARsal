export const SUPPORTED_MODELS = [
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash (기본)" },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { id: "gemini-3.1-pro-preview", label: "Gemini 3.1 Pro Preview" },
] as const;

export type SupportedModelId = (typeof SUPPORTED_MODELS)[number]["id"];
