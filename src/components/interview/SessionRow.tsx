"use client";

import Link from "next/link";
import { MoreHorizontalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import type { InterviewSession } from "@/lib/supabase/queries/sessions";

const PERSONA_LABELS: Record<string, string> = {
  explorer: "경험 탐색형",
  pressure: "심층 압박형",
};

const STATUS_LABELS: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  in_progress: { label: "진행 중", variant: "secondary" },
  completed: { label: "완료", variant: "default" },
  abandoned: { label: "중단", variant: "outline" },
};

interface SessionRowProps {
  session: InterviewSession;
}

export default function SessionRow({ session }: SessionRowProps) {
  const status = session.status ? STATUS_LABELS[session.status] : null;
  const isInProgress = session.status === "in_progress";
  const isCompleted = session.status === "completed";

  return (
    <TableRow>
      <TableCell className="font-medium">
        {session.persona ? PERSONA_LABELS[session.persona] : "-"}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {session.duration_minutes ? `${session.duration_minutes}분` : "-"}
      </TableCell>
      <TableCell>
        {status ? (
          <Badge variant={status.variant}>{status.label}</Badge>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(session.created_at).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </TableCell>
      <TableCell className="text-right">
        {isInProgress && (
          <Link
            href={`/interview/${session.id}`}
            className="mr-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            이어하기
          </Link>
        )}
        {isCompleted && (
          <Link
            href={`/report/${session.id}`}
            className="mr-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
          >
            리포트 보기
          </Link>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontalIcon />
              <span className="sr-only">메뉴 열기</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>이름 변경</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">삭제</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
