"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import DocumentSection from "@/components/resume/DocumentSection";
import GitLinkSection from "@/components/resume/GitLinkSection";
import type { UserDocument } from "@/lib/supabase/queries/documents";

interface DocumentStepProps {
  documents: UserDocument[];
  onBack: () => void;
}

export default function DocumentStep({ documents, onBack }: DocumentStepProps) {
  const router = useRouter();

  const resumeDocs = documents.filter((d) => d.type === "resume");
  const portfolioDocs = documents.filter((d) => d.type === "portfolio");
  const gitDocs = documents.filter((d) => d.type === "git");

  function handleFinish() {
    router.push("/interview");
  }

  return (
    <div className="space-y-8">
      <DocumentSection
        type="resume"
        title="이력서 / 경력기술서"
        description="PDF · 최대 10MB"
        documents={resumeDocs}
      />

      <DocumentSection
        type="portfolio"
        title="포트폴리오"
        description="PDF · 최대 20MB"
        documents={portfolioDocs}
      />

      <GitLinkSection documents={gitDocs} />

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          ← 이전
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleFinish}>
            건너뛰기
          </Button>
          <Button onClick={handleFinish}>완료</Button>
        </div>
      </div>
    </div>
  );
}
