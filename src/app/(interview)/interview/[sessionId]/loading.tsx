import { Loader2Icon } from "lucide-react";

export default function InterviewSessionLoading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">면접을 준비하고 있어요...</p>
    </div>
  );
}
