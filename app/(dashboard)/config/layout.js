import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Server-side guard: all /config/* routes are admin-only
export default async function ConfigLayout({ children }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return children
}
