import type { AnalysisOutput, UserProfileContext } from "./analysis";

export interface InterviewAgentOutput {
  message: string;
  type: "question" | "followup" | "closing";
  current_depth: number;
  next_question_id: string | null;
  is_last: boolean;
}

const PERSONA_INSTRUCTIONS = {
  startup: `당신은 스타트업의 실무진 면접관입니다.
- 격식보다는 실용성을 중시합니다.
- 직설적이고 구체적인 답변을 원합니다.
- "실제로 어떻게 했나요?", "왜 그 방법을 선택했나요?" 같은 질문을 좋아합니다.
- 말투는 친근하되 날카롭습니다.`,

  enterprise: `당신은 대기업 인사팀 면접관입니다.
- 체계적이고 형식적인 면접 진행을 선호합니다.
- STAR 기법(상황-과제-행동-결과)에 맞춘 답변을 선호합니다.
- 조직 적합성, 팀워크, 커뮤니케이션 능력을 중시합니다.
- 말투는 정중하고 공식적입니다.`,

  pressure: `당신은 압박 면접관입니다.
- 지원자의 한계를 테스트하는 것이 목표입니다.
- 답변에 의문을 제기하고 반박합니다.
- "정말요? 그게 최선이었나요?", "다른 방법은 없었나요?" 같은 추가 질문을 합니다.
- 말투는 날카롭고 집요합니다.`,
};

export function buildInterviewSystemPrompt(params: {
  persona: "startup" | "enterprise" | "pressure";
  jdText: string;
  resumeTexts: string[];
  analysisJson: AnalysisOutput;
  remainingSeconds: number;
  totalSeconds: number;
  userProfile?: UserProfileContext;
}): string {
  const { persona, jdText, resumeTexts, analysisJson, remainingSeconds, totalSeconds, userProfile } = params;

  const isClosingPhase = remainingSeconds < totalSeconds * 0.2;
  const remainingMinutes = Math.floor(remainingSeconds / 60);

  // resumeTexts already contains labeled sections (e.g. "[이력서: ...]\n...", "[포트폴리오: ...]\n...")
  const resumeSection =
    resumeTexts.length > 0
      ? resumeTexts.join("\n\n")
      : "제출된 문서가 없습니다.";

  const profileSection = userProfile
    ? `### 지원자 프로필
- 직군: ${userProfile.jobCategory ?? "미입력"}
- 경력: ${userProfile.yearsOfExperience != null ? `${userProfile.yearsOfExperience}년` : "미입력"}
- 기술 스택: ${userProfile.techStack.length > 0 ? userProfile.techStack.join(", ") : "미입력"}
- 보유 스킬: ${userProfile.skills.length > 0 ? userProfile.skills.join(", ") : "미입력"}`
    : "";

  return `${PERSONA_INSTRUCTIONS[persona]}

## 면접 컨텍스트

### JD
${jdText || (userProfile?.jobCategory ? `${userProfile.jobCategory} 직군 면접` : "일반 IT 직무 면접")}
${profileSection ? `\n${profileSection}` : ""}

### 이력서
${resumeSection}

### 사전 분석 결과
${JSON.stringify(analysisJson, null, 2)}

## 면접 진행 규칙
1. 준비된 질문 세트(analysisJson.questions)를 순서대로 진행하세요.
2. 각 답변 후 필요 시 follow-up 질문을 1~2개 추가할 수 있습니다 (최대 depth 4).
3. 잔여 시간: ${remainingMinutes}분 남음.
${isClosingPhase ? "⚠️ 잔여 시간이 20% 미만입니다. 마무리 질문(closing)으로 전환하세요." : ""}
4. 한 번에 하나의 질문만 하세요.
5. 답변을 경청하고 자연스럽게 다음 질문으로 이어가세요.

## 출력 형식 (반드시 유효한 JSON만 반환, 마크다운 코드 블록 없이)
{
  "message": "면접관이 말할 내용 (질문 또는 반응 + 다음 질문)",
  "type": "question | followup | closing",
  "current_depth": 0,
  "next_question_id": "q2",
  "is_last": false
}`;
}

export function buildFirstQuestionPrompt(analysisJson: AnalysisOutput): string {
  return `위 시스템 프롬프트에 따라 면접을 시작하세요.
첫 번째 질문(${analysisJson.questions[0]?.id ?? "q1"})으로 면접을 시작하세요.
자연스러운 인사말과 함께 첫 질문을 해주세요.
JSON 형식으로만 응답하세요.`;
}

export function buildSkipPrompt(): string {
  return `지원자가 이 질문을 건너뛰기로 했습니다.
자연스럽게 "알겠습니다"라고 짧게 말하고, 다음 질문으로 바로 넘어가세요.
JSON 형식으로만 응답하세요. type은 "question"으로 설정하세요.`;
}

export function buildHintPrompt(params: {
  currentQuestion: string;
  questionIntent: string;
  goodAnswerTips: string;
  resumeTexts: string[];
  recentMessages: Array<{ role: string; content: string }>;
  userProfile?: UserProfileContext;
}): string {
  const { currentQuestion, questionIntent, goodAnswerTips, resumeTexts, recentMessages, userProfile } = params;

  const documentSection =
    resumeTexts.length > 0
      ? resumeTexts.join("\n\n")
      : "제출된 문서가 없습니다.";

  const conversationContext =
    recentMessages.length > 0
      ? recentMessages
          .map((m) => `[${m.role === "interviewer" ? "면접관" : "지원자"}] ${m.content}`)
          .join("\n\n")
      : "";

  const profileSection = userProfile
    ? `지원자 역량 참고 정보 (답변 난이도·깊이 조정 용도로만 사용, 답변 내용에 직접 포함 금지):
- 직군: ${userProfile.jobCategory ?? "미입력"}
- 경력: ${userProfile.yearsOfExperience != null ? `${userProfile.yearsOfExperience}년` : "미입력"}
- 기술 스택: ${userProfile.techStack.join(", ") || "미입력"}
- 보유 스킬: ${userProfile.skills.join(", ") || "미입력"}`
    : "";

  return `당신은 IT 직무 면접 코치입니다. 아래 질문에 대한 모범 답안을 작성해주세요.

## 현재 질문
${currentQuestion}

## 질문 의도
${questionIntent}

## 좋은 답변 포인트
${goodAnswerTips}
${conversationContext ? `\n## 직전 대화 흐름 (맥락 파악용)\n${conversationContext}` : ""}

## 지원자 제출 문서 (이력서 / 포트폴리오 / GitHub)
${documentSection}

${profileSection}

## 지시사항
- 모범 답안은 반드시 위 지원자 제출 문서에 실제로 기재된 내용만을 근거로 작성하세요.
- 문서에 없는 상황, 수치, 프로젝트, 경험은 절대로 만들어내거나 예측하지 마세요.
- 문서에서 활용할 내용이 부족하면, 있는 내용만으로 답변을 구성하고 그 이상은 추가하지 마세요.
- 지원자 역량 참고 정보(직군, 경력, 기술 스택, 보유 스킬)는 답변의 난이도와 표현 깊이를 조정하는 데만 활용하고, 답변 본문에 직접 언급하거나 내용의 근거로 사용하지 마세요.
- STAR 기법(상황-과제-행동-결과)을 문서 내용 범위 안에서 활용하세요.
- 실제 면접에서 바로 사용할 수 있는 자연스러운 한국어 답변이어야 합니다.
- 200~400자 내외로 작성하세요.
- 답변 텍스트만 반환하세요. JSON, 마크다운, 머릿말 없이.`;
}

export function buildRespondPrompt(userAnswer: string): string {
  return `지원자의 답변: "${userAnswer}"

위 답변을 바탕으로 다음 중 하나를 선택하세요:
1. 답변이 충분하면 → 다음 질문으로 이동 (type: "question")
2. 답변이 불충분하거나 더 깊은 탐색이 필요하면 → 추가 질문 (type: "followup")
3. 잔여 시간이 부족하면 → 마무리 질문 (type: "closing")

JSON 형식으로만 응답하세요.`;
}
