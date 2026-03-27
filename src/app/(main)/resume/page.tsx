import { getUser } from "@/lib/supabase/auth.server";
import { getUserDocuments } from "@/lib/supabase/queries/documents";
import DocumentSection from "@/components/resume/DocumentSection";
import GitLinkSection from "@/components/resume/GitLinkSection";

export default async function ResumePage() {
  const user = await getUser();
  const userId = user!.id;

  const documents = await getUserDocuments(userId);
  const resumes = documents.filter((d) => d.type === "resume");
  const portfolios = documents.filter((d) => d.type === "portfolio");
  const gitDocs = documents.filter((d) => d.type === "git");

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10 space-y-10">
      <div>
        <h1 className="text-xl font-semibold">문서 관리</h1>
        <p className="text-sm text-muted-foreground mt-1">
          업로드된 문서는 모의 인터뷰에 자동으로 사용됩니다. 이력서는 필수입니다.
        </p>
      </div>

      <DocumentSection
        type="resume"
        title="이력서 / 경력기술서"
        description="PDF 또는 DOCX · 최대 10MB · 필수"
        required
        documents={resumes}
      />

      <DocumentSection
        type="portfolio"
        title="포트폴리오"
        description="PDF 또는 DOCX · 최대 10MB · 선택사항"
        documents={portfolios}
      />

      <GitLinkSection documents={gitDocs} />
    </div>
  );
}
