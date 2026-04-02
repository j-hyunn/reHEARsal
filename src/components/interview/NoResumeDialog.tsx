"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function NoResumeDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-sm [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>이력서가 없습니다</DialogTitle>
          <DialogDescription className="pt-1">
            이력서 또는 경력기술서와 같은 문서가 없으면 면접을 진행할 수
            없습니다. 먼저 문서를 등록해 주세요.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            둘러보기
          </Button>
          <Button size="sm" asChild>
            <Link href="/resume">이력서 등록하기</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
