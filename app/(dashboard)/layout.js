import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/layout/DashboardShell'
import Toaster from '@/components/ui/Toaster'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, role, email')
    .eq('id', user.id)
    .single()

  const safeProfile = profile ?? { email: user.email, full_name: null, avatar_url: null, role: 'observer' }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      <DashboardShell user={safeProfile} role={safeProfile.role}>
        {/* Main content — below fixed header */}
        <main className="flex-1 relative overflow-hidden">
          <div className="orb-primary w-[60%] h-[60%] top-[-20%] left-[-10%]" />
          <div className="orb-tertiary w-[50%] h-[50%] bottom-[-10%] right-[-10%]" />
          <div className="relative z-10 p-4 md:p-8">
            {children}
          </div>
          <Toaster />
        </main>
      </DashboardShell>
    </div>
  )
}
