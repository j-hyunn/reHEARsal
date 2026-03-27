/**
 * Client-side auth helpers.
 * Use in Client Components ('use client') only.
 * Do NOT import this file from Server Components.
 */

import { createClient } from './client'

/**
 * Initiates Google OAuth sign-in flow.
 * Redirects the user to Google's consent screen.
 */
export async function signInWithGoogle(): Promise<void> {
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
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(`Sign-out failed: ${error.message}. Please try again.`)
  }
}
