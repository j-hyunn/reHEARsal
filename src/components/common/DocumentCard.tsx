"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { uploadDocumentAction, deleteDocumentAction } from "@/app/(main)/resume/actions";
import type { UserDocument, DocumentType } from "@/lib/supabase/queries/documents";

interface DocumentCardProps {
  type: DocumentType;
  label: string;
  description: string;
  required?: boolean;
  document: UserDocument | null;
}

export default function DocumentCard({
  type,
  label,
  description,
  required = false,
  document,
}: DocumentCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    startTransition(async () => {
      const result = await uploadDocumentAction(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${label}이(가) 업로드되었습니다.`);
      }
      // Reset input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  function handleDelete() {
    if (!document) return;

    startTransition(async () => {
      const result = await deleteDocumentAction(document.id, document.file_url ?? "");
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${label}이(가) 삭제되었습니다.`);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {label}
          {required && (
            <Badge variant="secondary" className="text-xs">
              필수
            </Badge>
          )}
          {document && (
            <Badge variant="outline" className="text-xs text-green-600 border-green-300">
              업로드됨
            </Badge>
          )}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          {document ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
              className="text-destructive hover:text-destructive"
            >
              {isPending ? "삭제 중..." : "삭제"}
            </Button>
          ) : (
            <>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={handleUpload}
                disabled={isPending}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={isPending}
              >
                {isPending ? "업로드 중..." : "파일 선택"}
              </Button>
            </>
          )}
        </CardAction>
      </CardHeader>
      {document && (
        <CardContent>
          <p className="text-sm text-muted-foreground truncate">
            업로드 완료 ·{" "}
            {new Date(document.created_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
