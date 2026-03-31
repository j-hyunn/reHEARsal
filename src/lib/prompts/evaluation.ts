import type { AnalysisOutput } from "./analysis";

export interface EvaluationOutput {
  total_score: number;
  summary: string;
  strengths: string;
  improvements: string;
  answers: Array<{
    question_id: string;
    question: string;
    answer: string;
    scores: {
      logic: number;
      specificity: number;
      job_fit: number;
    };
    average: number;
    feedback: string;
    model_answer: string;
  }>;
  retry_questions: Array<{
    question_id: string;
    question: string;
  }>;
}

interface QaTurn { speaker: "interviewer" | "user"; content: string }
interface QaGroup {
  question_id: string;
  question: string;
  intent: string;
  good_answer_tips: string;
  turns: QaTurn[];
  used_hint: boolean;
  skipped: boolean;
}

export function buildEvaluationPrompt(params: {
  qaGroups: QaGroup[];
  analysisJson: AnalysisOutput;
}): string {
  const { qaGroups, analysisJson } = params;

  const groupedText = qaGroups
    .map((g) => {
      const header = `### [${g.question_id}] ${g.question}
- 질문 의도: ${g.intent}
- 좋은 답변 포인트: ${g.good_answer_tips}
- 모범 답안 참조: ${g.used_hint ? "예" : "아니오"} / 건너뜀: ${g.skipped ? "예" : "아니오"}`;

      const dialogue = g.turns
        .map((t) => `[${t.speaker === "interviewer" ? "면접관" : "지원자"}] ${t.content}`)
        .join("\n");

      return `${header}\n\n${dialogue}`;
    })
    .join("\n\n---\n\n");

  return `당신은 IT 직무 면접 평가 전문가입니다. 아래 질문별 대화 그룹을 분석하고 상세한 피드백 리포트를 생성하세요.

## JD 분석 요약
- 핵심 키워드: ${analysisJson.analysis.jd_keywords.join(", ") || "없음"}
- 강점: ${analysisJson.analysis.strengths.join(", ") || "없음"}
- 부족한 부분: ${analysisJson.analysis.preferred_gaps.join(", ") || "없음"}

## 질문별 대화 그룹
각 그룹은 하나의 메인 질문과 그에 따른 follow-up 및 답변 전체를 포함합니다.

${groupedText}

## 평가 기준
각 질문 그룹의 답변 전체(follow-up 포함)를 종합해 0~100점 평가:
- **logic (논리성)**: 답변의 논리적 구조와 일관성
- **specificity (구체성)**: 구체적인 사례, 수치, 결과 포함 여부
- **job_fit (직무 적합성)**: JD의 요구 역량과의 부합도

## 특수 마커 처리 규칙
- **모범 답안 참조: 예** → 해당 질문의 모든 점수를 최대 40점으로 제한. feedback에 "모범 답안을 참조한 답변입니다" 명시. retry_questions에 포함.
- **건너뜀: 예** → 모든 점수 0점. answer를 "건너뜀"으로. feedback에 "건너뛴 질문입니다" 명시. retry_questions에 포함.

## 지시사항
1. 각 질문 그룹(question_id)마다 answers 항목을 하나씩 생성하세요.
2. 각 질문의 intent와 good_answer_tips를 기준으로 채점하세요.
3. feedback: 각 점수 영역(논리성·구체성·직무 적합성)의 채점 근거를 포함하되, 각 영역을 별도로 나열하지 말고 자연스러운 한 문단으로 작성하세요. 잘한 점과 부족한 점을 균형 있게 서술하고, 마지막 문장에 핵심 개선 방향을 제시하세요.
4. model_answer: 실제 면접에서 사용할 수 있는 수준의 구체적인 모범 답안을 제시하세요. 지원자의 배경(이력서)을 반영해 작성하세요.
5. retry_questions: 다시 연습해볼 질문 목록을 선정하세요.
6. total_score는 모든 답변의 average 점수의 평균입니다.
7. summary: 전체 면접에 대한 종합 평가를 3~5문장으로 작성하세요. 모범 답안 참조·건너뛰기 사용 여부도 언급하세요.
8. strengths: 면접 전반에서 지원자가 잘한 점을 3~5문장으로 서술하세요. 특정 질문을 언급하더라도 전체 흐름 속에서의 강점을 중심으로 작성하세요.
9. improvements: 면접 전반에서 지원자가 개선해야 할 포인트를 3~5문장으로 서술하세요. 부족했던 부분과 구체적인 개선 방향을 중심으로 작성하세요.

## 출력 형식 (반드시 유효한 JSON만 반환, 마크다운 코드 블록 없이)
{
  "total_score": 82,
  "summary": "전체 면접 종합 평가 (3~5문장)",
  "strengths": "면접 전반에서 잘한 점 (3~5문장)",
  "improvements": "면접 전반에서 개선할 점 (3~5문장)",
  "answers": [
    {
      "question_id": "q1",
      "question": "질문 내용",
      "answer": "지원자 답변 요약",
      "scores": { "logic": 85, "specificity": 70, "job_fit": 90 },
      "average": 82,
      "feedback": "이 답변에 대한 피드백",
      "model_answer": "더 나은 답변 예시"
    }
  ],
  "retry_questions": [
    { "question_id": "q3", "question": "질문 내용" }
  ]
}`;
}
