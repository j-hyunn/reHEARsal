"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/supabase/auth.client";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);

  // Show error toast when redirected back with ?error=true
  useEffect(() => {
    if (searchParams.get("error") === "true") {
      toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  }, [searchParams]);

  async function handleGoogleLogin() {
    setIsPending(true);
    try {
      await signInWithGoogle();
    } catch {
      toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
      setIsPending(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
      {/* Service identity */}
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          리허설
        </h1>
        <p className="text-base text-muted-foreground">
          JD와 이력서를 아는 AI 면접관과 모의면접
        </p>
      </div>

      {/* Login section */}
      <div className="flex flex-col items-center gap-3">
        <Button
          size="lg"
          onClick={handleGoogleLogin}
          disabled={isPending}
          className="min-w-56 gap-2"
        >
          {/* Google icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="size-4 shrink-0"
            aria-hidden="true"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {isPending ? "로그인 중..." : "Google로 계속하기"}
        </Button>
        <p className="text-sm text-muted-foreground">Google 계정으로 바로 시작</p>
      </div>
    </main>
  );
}
