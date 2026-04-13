import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default async function DashboardLayout({ children }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, role')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      <Sidebar role={profile?.role} />

      <div className="ml-64 flex flex-col min-h-screen">
        <Header user={profile} />

        {/* Main content — below fixed header */}
        <main className="flex-1 pt-16 relative overflow-hidden">
          {/* Celestial background orbs */}
          <div className="orb-primary w-[60%] h-[60%] top-[-20%] left-[-10%]" />
          <div className="orb-tertiary w-[50%] h-[50%] bottom-[-10%] right-[-10%]" />

          <div className="relative z-10 p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
