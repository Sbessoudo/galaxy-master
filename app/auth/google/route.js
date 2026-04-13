import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function POST(request) {
  const supabase = await createClient()
  const origin = new URL(request.url).origin

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    console.error('Google OAuth error:', error.message)
    redirect('/login?error=oauth')
  }

  redirect(data.url)
}
