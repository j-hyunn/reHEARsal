"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface StartInterviewButtonProps {
  hasResume: boolean;
}

export default function StartInterviewButton({ hasResume }: StartInterviewButtonProps) {
  return (
    <Button
      size="lg"
      disabled={!hasResume}
      className="w-full"
      render={hasResume ? <Link href="/setup" /> : <button />}
    >
      새 면접 시작하기
    </Button>
  );
}
