import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/auth.server";
import { getSession } from "@/lib/supabase/queries/sessions";
import { getSessionMessages } from "@/lib/supabase/queries/messages";
import InterviewView from "@/components/interview/InterviewView";

interface InterviewPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  const { sessionId } = await params;

  const user = await getUser();
  if (!user) redirect("/login");

  const session = await getSession(sessionId);
  if (!session || session.user_id !== user.id) redirect("/interview");

  let existingMessages: Awaited<ReturnType<typeof getSessionMessages>> = [];
  try {
    existingMessages = await getSessionMessages(sessionId);
  } catch {
    // Non-fatal: missing history only affects the resume flow.
    // The interview can still proceed from scratch.
  }

  return <InterviewView session={session} existingMessages={existingMessages} />;
}
