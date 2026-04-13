import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function LoginPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/')

  const params = await searchParams
  const errorMsg = params?.error === 'oauth' ? 'Erreur lors de la connexion Google. Réessaie.'
    : params?.error === 'callback' ? 'Erreur d\'authentification. Réessaie.'
    : null

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{ background: 'var(--color-background)' }}>

      {/* Celestial orbs */}
      <div className="orb-primary w-[50%] h-[50%] top-[-10%] left-[-10%]" />
      <div className="orb-tertiary w-[40%] h-[40%] bottom-[-10%] right-[-5%]" />

      <div className="relative z-10 w-full max-w-sm px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xxl mb-4"
               style={{ background: 'var(--color-primary)' }}>
            <span className="material-symbols-outlined"
                  style={{ color: 'var(--color-on-primary)', fontSize: '1.75rem' }}>
              rocket_launch
            </span>
          </div>
          <h1 className="text-2xl font-black mb-1"
              style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}>
            Galaxy Master
          </h1>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.7rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Eleven Labs · Galactic HR Admin
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl p-8" style={{ background: 'var(--color-surface-container-high)' }}>
          <p className="text-center mb-6" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>
            Connecte-toi avec ton compte Google Eleven Labs pour accéder au back-office.
          </p>

          {errorMsg && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-center"
                 style={{ background: 'var(--color-error-container)', color: 'var(--color-error)', fontFamily: 'var(--font-body)' }}>
              {errorMsg}
            </div>
          )}

          <form action="/auth/google" method="post">
            <button type="submit"
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-xxl font-bold transition-transform hover:scale-[1.02] active:scale-95"
                    style={{
                      background: 'var(--color-primary)',
                      color: 'var(--color-on-primary)',
                      fontFamily: 'var(--font-headline)',
                      fontSize: '0.875rem',
                    }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="var(--color-on-primary)"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="var(--color-on-primary)"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="var(--color-on-primary)"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="var(--color-on-primary)"/>
              </svg>
              Connexion avec Google
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs"
           style={{ fontFamily: 'var(--font-label)', color: 'var(--color-on-surface-variant)', letterSpacing: '0.05em' }}>
          Accès réservé aux membres de l'équipe Eleven Labs
        </p>
      </div>
    </div>
  )
}
