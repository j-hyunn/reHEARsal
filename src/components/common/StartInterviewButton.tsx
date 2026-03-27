"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/index";

interface StartInterviewButtonProps {
  hasResume: boolean;
}

export default function StartInterviewButton({ hasResume }: StartInterviewButtonProps) {
  if (hasResume) {
    return (
      <Link href="/setup" className={cn(buttonVariants({ size: "lg" }), "w-full")}>
        새 면접 시작하기
      </Link>
    );
  }

  return (
    <Button size="lg" disabled className="w-full">
      새 면접 시작하기
    </Button>
  );
}
