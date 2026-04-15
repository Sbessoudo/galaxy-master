import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import TropheeActions from '@/components/trophees/TropheeActions'

export const dynamic = 'force-dynamic'

export default async function TropheesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }
  const isAdmin = profile?.role === 'admin'

  const { data: trophies } = await supabase
    .from('trophies')
    .select(`
      id, awarded_at, notes,
      trophy_types(name, icon, description),
      astronauts(id, first_name, last_name, planets(name, color)),
      planets(id, name, color)
    `)
    .order('awarded_at', { ascending: false })
    .limit(100)

  return (
    <div className="max-w-3xl mx-auto">

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.1 }}>
            Trophées
          </h1>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', color: 'var(--color-on-surface-variant)', marginTop: '0.4rem' }}>
            {trophies?.length ?? 0} attribution{(trophies?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        {isAdmin && (
          <Link href="/trophees/new" className="btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
            Attribuer
          </Link>
        )}
      </div>

      {!trophies?.length ? (
        <div className="rounded-xl p-12 text-center" style={{ background: 'var(--color-surface-container)' }}>
          <span className="material-symbols-outlined mb-3" style={{ color: 'var(--color-secondary)', fontSize: '2.5rem', display: 'block' }}>emoji_events</span>
          <p style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', fontWeight: 700 }}>
            Aucun trophée attribué
          </p>
          {isAdmin && (
            <Link href="/trophees/new" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
              Attribuer le premier
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-surface-container)' }}>
          {trophies.map((t, i) => {
            const recipient = t.astronauts
              ? { label: `${t.astronauts.first_name} ${t.astronauts.last_name}`, sub: t.astronauts.planets?.name, color: t.astronauts.planets?.color, href: `/astronautes/${t.astronauts.id}` }
              : t.planets
              ? { label: t.planets.name, sub: 'Planète', color: t.planets.color, href: `/planetes/${t.planets.id}` }
              : { label: '—', sub: null, color: null, href: null }

            return (
              <div key={t.id}
                   style={{
                     display: 'flex', alignItems: 'center', gap: '0.85rem',
                     padding: '0.85rem 1rem',
                     borderBottom: i < trophies.length - 1 ? '1px solid rgb(255 255 255 / 0.04)' : 'none',
                   }}>

                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                     style={{ background: 'var(--color-surface-container-highest)', fontSize: '1.4rem' }}>
                  {t.trophy_types?.icon ?? '🏆'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                    {t.trophy_types?.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)' }}>
                    {recipient.href ? (
                      <Link href={recipient.href} style={{ color: recipient.color ?? 'var(--color-secondary)', textDecoration: 'none', fontWeight: 600 }}>
                        {recipient.label}
                      </Link>
                    ) : recipient.label}
                    {recipient.sub && <span> · {recipient.sub}</span>}
                  </p>
                  {t.notes && (
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', marginTop: '0.15rem', fontStyle: 'italic' }}>
                      {t.notes.slice(0, 80)}{t.notes.length > 80 ? '…' : ''}
                    </p>
                  )}
                </div>

                {/* Date */}
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', flexShrink: 0 }}>
                  {new Date(t.awarded_at).toLocaleDateString('fr-FR')}
                </span>

                {isAdmin && <TropheeActions id={t.id} />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
