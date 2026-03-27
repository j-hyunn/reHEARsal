"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import NewInterviewDialog from "@/components/interview/NewInterviewDialog";
import type { UserDocument } from "@/lib/supabase/queries/documents";

interface StartInterviewButtonProps {
  hasResume: boolean;
  documents: UserDocument[];
}

export default function StartInterviewButton({
  hasResume,
  documents,
}: StartInterviewButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        disabled={!hasResume}
        onClick={() => setOpen(true)}
      >
        새 면접 추가하기
      </Button>

      {hasResume && (
        <NewInterviewDialog
          open={open}
          onOpenChange={setOpen}
          documents={documents}
        />
      )}
    </>
  );
}
