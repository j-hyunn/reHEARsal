"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/index";
import type { UserDocument } from "@/lib/supabase/queries/documents";

interface NewInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documents: UserDocument[];
}

type JdInputMode = "link" | "text";

export default function NewInterviewDialog({
  open,
  onOpenChange,
  documents,
}: NewInterviewDialogProps) {
  const router = useRouter();

  // JD
  const [jdMode, setJdMode] = useState<JdInputMode>("link");
  const [jdLink, setJdLink] = useState("");
  const [jdText, setJdText] = useState("");

  // Documents (Single select for now as per "Select" request)
  const [resumeId, setResumeId] = useState("");
  const [portfolioId, setPortfolioId] = useState("");
  const [githubId, setGithubId] = useState("");

  // Optional
  const [referenceLink, setReferenceLink] = useState("");

  const resumes = documents.filter((d) => d.type === "resume");
  const portfolios = documents.filter((d) => d.type === "portfolio");
  const githubDocs = documents.filter((d) => d.type === "git");

  // Determine if JD is filled
  const jdFilled =
    jdMode === "link" ? jdLink.trim().length > 0 : jdText.trim().length > 0;

  // All required fields filled
  const canStart = jdFilled && resumeId !== "" && portfolioId !== "";

  function handleReset() {
    setJdMode("link");
    setJdLink("");
    setJdText("");
    setResumeId("");
    setPortfolioId("");
    setGithubId("");
    setReferenceLink("");
  }

  function handleOpenChange(next: boolean) {
    if (!next) handleReset();
    onOpenChange(next);
  }

  function handleStart() {
    if (!canStart) return;

    const params = new URLSearchParams();
    params.set("resumeId", resumeId);
    params.set("portfolioId", portfolioId);
    if (jdMode === "link") {
      params.set("jdLink", jdLink);
    } else {
      params.set("jdText", jdText);
    }
    if (githubId) {
      const doc = githubDocs.find((d) => d.id === githubId);
      if (doc?.file_url) params.set("githubUrl", doc.file_url);
    }
    if (referenceLink.trim()) params.set("referenceLink", referenceLink.trim());

    router.push(`/setup?${params.toString()}`);
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새 면접 추가하기</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* 1. JD */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                지원 포지션 JD
                <span className="ml-1 text-xs text-muted-foreground font-normal">
                  (선택)
                </span>
              </label>
              <div className="flex rounded-md border overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setJdMode("link")}
                  className={cn(
                    "px-3 py-1.5 transition-colors",
                    jdMode === "link"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  )}
                >
                  링크
                </button>
                <button
                  type="button"
                  onClick={() => setJdMode("text")}
                  className={cn(
                    "px-3 py-1.5 transition-colors",
                    jdMode === "text"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  )}
                >
                  직접 입력
                </button>
              </div>
            </div>

            {jdMode === "text" ? (
              <Textarea
                placeholder="JD 내용을 여기에 붙여넣으세요."
                rows={5}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
              />
            ) : (
              <Input
                type="url"
                placeholder="https://example.com/job-description"
                value={jdLink}
                onChange={(e) => setJdLink(e.target.value)}
              />
            )}
          </section>

          {/* 2. Resume */}
          <section className="space-y-2">
            <label className="text-sm font-medium">
              이력서 / 경력기술서
              <span className="ml-1 text-xs text-destructive font-normal">
                *필수
              </span>
            </label>
            {resumes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                저장된 이력서가 없습니다. 문서 관리에서 먼저 업로드해 주세요.
              </p>
            ) : (
              <Select value={resumeId} onValueChange={setResumeId}>
                <SelectTrigger>
                  <SelectValue placeholder="이력서를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.file_name ?? doc.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </section>

          {/* 3. Portfolio */}
          <section className="space-y-2">
            <label className="text-sm font-medium">
              포트폴리오
              <span className="ml-1 text-xs text-destructive font-normal">
                *필수
              </span>
            </label>
            {portfolios.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                저장된 포트폴리오가 없습니다. 문서 관리에서 먼저 업로드해 주세요.
              </p>
            ) : (
              <Select value={portfolioId} onValueChange={setPortfolioId}>
                <SelectTrigger>
                  <SelectValue placeholder="포트폴리오를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {portfolios.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.file_name ?? doc.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </section>

          {/* 4. GitHub */}
          <section className="space-y-2">
            <label className="text-sm font-medium">
              GitHub 링크
              <span className="ml-1 text-xs text-muted-foreground font-normal">
                (선택)
              </span>
            </label>
            {githubDocs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                저장된 GitHub 링크가 없습니다.
              </p>
            ) : (
              <Select value={githubId} onValueChange={setGithubId}>
                <SelectTrigger>
                  <SelectValue placeholder="GitHub 링크를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {githubDocs.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.file_url ?? doc.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </section>

          {/* 5. Reference link */}
          <section className="space-y-2">
            <label className="text-sm font-medium">
              참고 자료
              <span className="ml-1 text-xs text-muted-foreground font-normal">
                (선택)
              </span>
            </label>
            <Input
              type="url"
              placeholder="https://example.com/reference"
              value={referenceLink}
              onChange={(e) => setReferenceLink(e.target.value)}
            />
          </section>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleStart} disabled={!canStart}>
            면접 시작하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
