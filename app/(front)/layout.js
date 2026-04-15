import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import HubNav from '@/components/hub/HubNav'
import PreviewBanner from '@/components/hub/PreviewBanner'
import ThemeToggle from '@/components/ui/ThemeToggle'

export const dynamic = 'force-dynamic'

export default async function FrontLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('full_name, avatar_url, role').eq('id', user.id).single()

  const isAdmin = profile?.role === 'admin' || profile?.role === 'observer'

  const { data: astronaut } = await supabase
    .from('astronauts')
    .select('first_name, last_name, photo_url, grades(name, icon)')
    .eq('user_id', user.id)
    .maybeSingle()

  const displayName = astronaut?.first_name
    ?? profile?.full_name
    ?? user.email
    ?? '?'

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>

      {/* Ambient orbs */}
      <div className="orb-primary w-[80%] h-[60%] top-[-30%] left-[-20%] fixed pointer-events-none" style={{ opacity: 0.3 }} />
      <div className="orb-tertiary w-[60%] h-[50%] bottom-[-20%] right-[-15%] fixed pointer-events-none" style={{ opacity: 0.2 }} />

      {/* Preview banner — client component reads ?preview itself */}
      <PreviewBanner isAdmin={isAdmin} astronautName={displayName} />

      {/* Top nav */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6"
              style={{
                background: 'color-mix(in srgb, var(--color-background) 80%, transparent)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgb(255 255 255 / 0.06)',
              }}>

        <Link href="/hub"
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginRight: '2rem' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-on-primary)', fontSize: '1rem' }}>rocket_launch</span>
          </div>
          <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-on-surface)', letterSpacing: '0.08em' }}>
            ELEVEN GALAXY
          </span>
        </Link>

        {/* HubNav reads ?preview from URL itself */}
        <HubNav />

        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />

        {/* User pill — astronauts only */}
        {!isAdmin && (
          <div className="flex items-center gap-3">
            <Link href="/hub/profil" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                   style={{ background: 'var(--color-primary-container)' }}>
                {astronaut?.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={astronaut.photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.7rem', color: 'var(--color-on-primary-container)' }}>
                    {displayName[0].toUpperCase()}
                  </span>
                )}
              </div>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', color: 'var(--color-on-surface)', fontWeight: 600 }}>
                {displayName}
              </span>
              {astronaut?.grades && (
                <span style={{ fontSize: '0.9rem' }}>{astronaut.grades.icon}</span>
              )}
            </Link>

            <form action="/auth/signout" method="post">
              <button type="submit" style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-on-surface-variant)', display: 'flex', alignItems: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>logout</span>
              </button>
            </form>
          </div>
        )}
        </div>{/* end ml-auto */}
      </header>

      <main className="relative z-10 pt-16 min-h-screen">
        {children}
      </main>
    </div>
  )
}
