/**
 * Supabase Auth helper functions.
 *
 * Server-side functions (getSession, getUser):
 *   Use in Server Components, API Routes, and Server Actions only.
 *
 * Client-side functions (signInWithGoogle, signOut):
 *   Use in Client Components only ('use client').
 */

import type { Session, User } from '@supabase/supabase-js'

// ============================================================
// Server-side helpers
// Use in Server Components, API Routes, Server Actions
// ============================================================

/**
 * Returns the current session from server context.
 * Returns null if the user is not authenticated.
 */
export async function getSession(): Promise<Session | null> {
  const { createClient } = await import('./server')
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
 * Prefer this over getSession() when you only need user data
 * (getUser() validates the JWT with the Supabase Auth server).
 */
export async function getUser(): Promise<User | null> {
  const { createClient } = await import('./server')
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    // auth/session-missing is expected for unauthenticated users — not a real error
    if (error.code === 'session_missing') return null
    throw new Error(`Failed to get user: ${error.message}. Please try signing in again.`)
  }

  return data.user
}

// ============================================================
// Client-side helpers
// Use in Client Components ('use client') only
// ============================================================

/**
 * Initiates Google OAuth sign-in flow.
 * Redirects the user to Google's consent screen.
 */
export async function signInWithGoogle(): Promise<void> {
  const { createClient } = await import('./client')
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    throw new Error(`Google sign-in failed: ${error.message}. Please try again.`)
  }
}

/**
 * Signs the current user out and clears the session.
 */
export async function signOut(): Promise<void> {
  const { createClient } = await import('./client')
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(`Sign-out failed: ${error.message}. Please try again.`)
  }
}
