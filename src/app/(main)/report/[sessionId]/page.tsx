import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/supabase/auth.server";
import { getSession } from "@/lib/supabase/queries/sessions";
import { getReport } from "@/lib/supabase/queries/reports";
import type { ReportJson } from "@/lib/supabase/queries/reports";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GenerateReportButton from "@/components/report/GenerateReportButton";

const SCORE_LABELS: Record<string, string> = {
  logic: "논리성",
  specificity: "구체성",
  job_fit: "직무 적합성",
};

function ScoreBadge({ score }: { score: number }) {
  const variant =
    score >= 80 ? "default" : score >= 60 ? "secondary" : "outline";
  return <Badge variant={variant}>{score}점</Badge>;
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{score}</span>
    </div>
  );
}

interface ReportPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { sessionId } = await params;

  const user = await getUser();
  if (!user) redirect("/login");

  const session = await getSession(sessionId);
  if (!session || session.user_id !== user.id) notFound();

  const report = await getReport(sessionId);

  // No report yet — show generation UI
  if (!report || !report.report_json) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-12 flex flex-col items-center gap-6 text-center">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">피드백 리포트 생성</h1>
          <p className="text-sm text-muted-foreground">
            면접 대화를 분석해 점수와 피드백을 생성합니다. 1~2분 정도 소요될 수 있어요.
          </p>
        </div>
        <GenerateReportButton sessionId={sessionId} />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/interview">면접 목록으로</Link>
        </Button>
      </div>
    );
  }

  const data: ReportJson = report.report_json;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">피드백 리포트</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(report.created_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-3xl font-bold tabular-nums text-primary">{data.total_score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">종합 평가</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{data.summary}</p>
        </CardContent>
      </Card>

      {/* Top 3 improvements */}
      {data.top3_improvements.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">핵심 개선 포인트</CardTitle>
            <CardDescription className="text-xs">가장 집중해서 개선할 3가지</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.top3_improvements.map((item, i) => (
              <div key={item.question_id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive/10 text-destructive text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium">{item.reason}</span>
                </div>
                <p className="text-sm text-muted-foreground pl-7">{item.improvement}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Per-answer breakdown */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold">답변별 분석</h2>
        {data.answers.map((answer) => (
          <Card key={answer.question_id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm font-medium leading-relaxed">
                  {answer.question}
                </CardTitle>
                <ScoreBadge score={answer.average} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User answer */}
              <div className="rounded-lg bg-primary/5 px-3 py-2 text-sm text-muted-foreground">
                {answer.answer}
              </div>

              {/* Scores */}
              <div className="space-y-2">
                {(["logic", "specificity", "job_fit"] as const).map((key) => (
                  <div key={key} className="grid grid-cols-[5rem_1fr] items-center gap-2">
                    <span className="text-xs text-muted-foreground">{SCORE_LABELS[key]}</span>
                    <ScoreBar score={answer.scores[key]} />
                  </div>
                ))}
              </div>

              <Separator />

              {/* Feedback */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">피드백</p>
                <p className="text-sm leading-relaxed">{answer.feedback}</p>
              </div>

              {/* Model answer */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">모범 답안</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{answer.model_answer}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Retry questions */}
      {data.retry_questions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">다시 도전해볼 질문</CardTitle>
            <CardDescription className="text-xs">새 면접에서 집중적으로 연습해보세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.retry_questions.map((q) => (
              <div key={q.question_id} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>{q.question}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Footer actions */}
      <div className="flex gap-2 pt-2">
        <Button variant="outline" asChild className="flex-1">
          <Link href="/interview">면접 목록으로</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href="/interview">새 면접 시작</Link>
        </Button>
      </div>
    </div>
  );
}
