"use client";

import { Button } from "@/components/ui/button";

export default function EndInterviewButton() {
  function handleEnd() {
    window.dispatchEvent(new CustomEvent("interview:end"));
  }

  return (
    <Button size="sm" onClick={handleEnd}>
      면접 종료
    </Button>
  );
}
