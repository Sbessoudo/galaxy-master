'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function HubAuthPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Session établie automatiquement depuis le hash URL par Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        subscription.unsubscribe()
        router.replace('/hub')
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe()
        router.replace('/hub')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center"
         style={{ background: 'var(--color-background)' }}>
      <div className="text-center">
        <span className="material-symbols-outlined"
              style={{ fontSize: '2.5rem', color: 'var(--color-primary)', display: 'block', marginBottom: '1rem', animation: 'spin 1s linear infinite' }}>
          progress_activity
        </span>
        <p style={{ fontFamily: 'var(--font-label)', color: 'var(--color-on-surface-variant)', fontSize: '0.85rem' }}>
          Connexion en cours…
        </p>
      </div>
    </div>
  )
}
