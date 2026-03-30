# reHEARsal

AI 기반 모의 면접 서비스. JD와 이력서를 분석해 맞춤형 면접 질문을 생성하고, 실시간 대화형 면접 시뮬레이션 및 피드백 리포트를 제공합니다.

**[rehearsal-six.vercel.app](https://rehearsal-six.vercel.app)**

---

## 주요 기능

- **문서 분석**: 이력서, 포트폴리오, GitHub 링크를 업로드하면 AI가 분석해 면접 질문 세트 생성
- **맞춤형 면접**: JD 기반 질문 + 실시간 follow-up 판단
- **페르소나 선택**: 스타트업 실무진 / 대기업 인사팀 / 압박 면접관
- **힌트 & 스킵**: 모범 답안 제시 또는 질문 건너뛰기 (평가에 감점 반영)
- **피드백 리포트**: 답변별 논리성·구체성·직무적합성 점수 + 개선 방향

## 기술 스택

| 영역 | 기술 |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | shadcn/ui |
| AI Agent | Google ADK (TypeScript) |
| AI Model | Gemini 2.5 Flash |
| Database | Supabase |
| Auth | Supabase Auth (Google OAuth) |
| Storage | Supabase Storage |
| Deploy | Vercel |

## 로컬 실행

### 1. 환경 변수 설정

`.env.local` 파일 생성:

```
GOOGLE_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 2. 의존성 설치 및 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인

## 에이전트 플로우

```
[면접 시작]
  analysis_agent → JD + 이력서 분석, 질문 세트 생성

[면접 중]
  interview_agent → 답변 수신, follow-up 판단, 스트리밍 응답

[면접 종료]
  evaluation_agent → 전체 대화 분석, 질문별 점수 및 피드백 리포트 생성
```
