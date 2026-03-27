/**
 * Server-side auth helpers.
 * Use in Server Components, API Routes, and Server Actions only.
 * Do NOT import this file from Client Components.
 */

import type { Session, User } from '@supabase/supabase-js'
import { createClient } from './server'

/**
 * Returns the current session from server context.
 * Returns null if the user is not authenticated.
 */
export async function getSession(): Promise<Session | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw new Error(`Failed to get session: ${error.message}. Please try signing in again.`)
  }

  return data.session
}

/**
 * Returns the current authenticated user from server context.
 * Returns null if the user is not authenticated.
 * Prefer this over getSession() — getUser() validates the JWT with Supabase Auth server.
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    // Any auth error here means no valid session — treat as unauthenticated
    return null
  }

  return data.user
}
