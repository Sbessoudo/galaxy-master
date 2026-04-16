import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import EventTypeActions from '@/components/engagements/EventTypeActions'

export const dynamic = 'force-dynamic'

export default async function ConfigEngagementsPage() {
  const supabase = await createClient()
  const [{ data: types }, { data: { user } }] = await Promise.all([
    supabase.from('event_types').select('*').order('name'),
    supabase.auth.getUser(),
  ])
  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }
  const isAdmin = profile?.role === 'admin'

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
            Configuration
          </p>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.1 }}>
            Types d&apos;event
          </h1>
        </div>
        {isAdmin && (
          <Link href="/config/engagements/new" className="btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
            Nouveau type
          </Link>
        )}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-surface-container)' }}>
        {!types?.length ? (
          <p style={{ padding: '2rem', color: 'var(--color-on-surface-variant)', fontSize: '0.85rem', textAlign: 'center' }}>
            Aucun type configuré.
          </p>
        ) : types.map((t, i) => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
            borderBottom: i < types.length - 1 ? '1px solid rgb(255 255 255 / 0.04)' : 'none',
            opacity: t.active ? 1 : 0.45,
          }}>
            <div className="flex-1 min-w-0">
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                {t.name}
                {!t.active && <span style={{ fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', marginLeft: '0.4rem' }}>· inactif</span>}
              </p>
              {t.description && (
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)' }}>{t.description}</p>
              )}
            </div>
            {isAdmin && (
              <Link href={`/config/engagements/${t.id}`} className="btn-ghost"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>edit</span>
              </Link>
            )}
            {isAdmin && <EventTypeActions id={t.id} name={t.name} />}
          </div>
        ))}
      </div>
    </div>
  )
}
