import Link from "next/link";
import { getUser } from "@/lib/supabase/auth.server";
import { getUserDocuments } from "@/lib/supabase/queries/documents";
import { getUserSessions } from "@/lib/supabase/queries/sessions";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import StartInterviewButton from "@/components/common/StartInterviewButton";
import type { InterviewSession } from "@/lib/supabase/queries/sessions";

const PERSONA_LABELS: Record<string, string> = {
  startup: "스타트업 실무진",
  enterprise: "대기업 인사팀",
  pressure: "압박 면접관",
};

const STATUS_LABELS: Record<string, string> = {
  in_progress: "진행 중",
  completed: "완료",
  abandoned: "중단",
};

function SessionCard({ session }: { session: InterviewSession }) {
  const isInProgress = session.status === "in_progress";
  const isCompleted = session.status === "completed";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="text-sm">
            {session.persona ? PERSONA_LABELS[session.persona] : "면접"}
            {session.duration_minutes && (
              <span className="ml-1.5 font-normal text-muted-foreground">
                · {session.duration_minutes}분
              </span>
            )}
          </span>
          <Badge
            variant={
              isCompleted ? "default" : isInProgress ? "secondary" : "outline"
            }
          >
            {session.status ? STATUS_LABELS[session.status] : "-"}
          </Badge>
        </CardTitle>
        <CardDescription>
          {new Date(session.created_at).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </CardDescription>
      </CardHeader>
      {(isInProgress || isCompleted) && (
        <CardContent className="flex justify-end">
          {isInProgress && (
            <Link
              href={`/interview/${session.id}`}
              className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              이어하기
            </Link>
          )}
          {isCompleted && (
            <Link
              href={`/report/${session.id}`}
              className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
            >
              리포트 보기
            </Link>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default async function InterviewPage() {
  const user = await getUser();
  const userId = user!.id;

  const [documents, sessions] = await Promise.all([
    getUserDocuments(userId),
    getUserSessions(userId),
  ]);

  const hasResume = documents.some((d) => d.type === "resume");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 space-y-8">
      {/* Start new interview */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">모의 인터뷰</h1>
          <p className="text-sm text-muted-foreground">
            {hasResume
              ? "JD와 페르소나를 설정하고 면접을 시작하세요."
              : "이력서를 먼저 업로드해야 면접을 시작할 수 있습니다."}
          </p>
        </div>
        <StartInterviewButton hasResume={hasResume} documents={documents} />
      </div>

      {/* Interview history */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold">면접 기록</h2>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            아직 면접 기록이 없습니다.
          </p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
