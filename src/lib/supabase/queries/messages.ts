import { createClient } from '@/lib/supabase/server'

export type MessageRole = 'interviewer' | 'user'

export interface InterviewMessage {
  id: string
  session_id: string
  role: MessageRole
  content: string | null
  depth: number
  question_id: string | null
  created_at: string
}

export interface CreateMessageInput {
  session_id: string
  role: MessageRole
  content: string
  depth?: number
  question_id?: string
}

/**
 * Saves a single message to the conversation history.
 * Called after each user answer and each interviewer question.
 */
export async function createMessage(input: CreateMessageInput): Promise<InterviewMessage> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('interview_messages')
    .insert({
      depth: 0,
      question_id: null,
      ...input,
    })
    .select()
    .single()

  if (error) {
    throw new Error(
      `Failed to save message: ${error.message}. Your answer may not have been recorded — please try again.`
    )
  }

  return data
}

/**
 * Returns all messages for a given session, ordered chronologically.
 * Only accessible if the session belongs to the current user (enforced by RLS).
 */
export async function getSessionMessages(sessionId: string): Promise<InterviewMessage[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('interview_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(
      `Failed to load conversation: ${error.message}. Please refresh the page.`
    )
  }

  return data
}
