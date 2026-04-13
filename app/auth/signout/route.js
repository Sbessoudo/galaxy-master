import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function POST(request) {
  // CSRF guard: verify request comes from our own origin
  const headersList = await headers()
  const origin = headersList.get('origin')
  const host = headersList.get('host')

  if (origin && host && !origin.endsWith(host)) {
    return new Response('Forbidden', { status: 403 })
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) console.error('Sign-out error:', error.message)

  redirect('/login')
}
