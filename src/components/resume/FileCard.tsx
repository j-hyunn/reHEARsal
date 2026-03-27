"use client";

import { useTransition } from "react";
import { FileTextIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteDocumentAction } from "@/app/(main)/resume/actions";
import type { UserDocument } from "@/lib/supabase/queries/documents";

interface FileCardProps {
  document: UserDocument;
  label: string;
}

export default function FileCard({ document, label }: FileCardProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteDocumentAction(document.id, document.file_url ?? "");
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${label}이(가) 삭제되었습니다.`);
      }
    });
  }

  const fileName = document.file_name ?? document.file_url?.split("/").pop() ?? "파일";
  const uploadedAt = new Date(document.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="shadow-none">
      <CardContent className="flex items-center gap-3 pl-4 pr-1 py-1">
        <FileTextIcon className="size-5 shrink-0 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{fileName}</p>
          <p className="text-xs text-muted-foreground">{uploadedAt}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isPending}
          className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2Icon className="size-4" />
          <span className="sr-only">삭제</span>
        </Button>
      </CardContent>
    </Card>
  );
}
