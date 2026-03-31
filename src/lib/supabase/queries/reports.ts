import { createClient } from '@/lib/supabase/server'

// Mirrors the evaluation_agent output structure from agents.md
export interface AnswerScore {
  logic: number
  specificity: number
  job_fit: number
}

export interface AnswerReport {
  question_id: string
  question: string
  answer: string
  scores: AnswerScore
  average: number
  feedback: string
  model_answer: string
}


export interface RetryQuestion {
  question_id: string
  question: string
}

export interface ReportJson {
  total_score: number
  summary: string
  strengths: string
  improvements: string
  answers: AnswerReport[]
  retry_questions: RetryQuestion[]
}

export interface InterviewReport {
  id: string
  session_id: string
  total_score: number | null
  summary: string | null
  report_json: ReportJson | null
  created_at: string
}

export interface CreateReportInput {
  session_id: string
  total_score: number
  summary: string
  report_json: ReportJson
}

/**
 * Saves the evaluation report for a completed interview session.
 */
export async function createReport(input: CreateReportInput): Promise<InterviewReport> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('interview_reports')
    .insert(input)
    .select()
    .single()

  if (error) {
    throw new Error(
      `Failed to save report: ${error.message}. Please try generating the report again.`
    )
  }

  return data
}

/**
 * Returns the report for a given session.
 * Only accessible if the session belongs to the current user (enforced by RLS).
 * Returns null if no report exists yet.
 */
export async function getReport(sessionId: string): Promise<InterviewReport | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('interview_reports')
    .select('*')
    .eq('session_id', sessionId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Row not found — report not generated yet
    throw new Error(
      `Failed to load report: ${error.message}. Please refresh the page.`
    )
  }

  return data
}
