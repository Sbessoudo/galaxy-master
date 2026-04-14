import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AstronautesPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }
  const isAdmin = profile?.role === 'admin'

  const params = await searchParams
  const filter = params?.filter ?? 'active'

  let query = supabase
    .from('astronauts')
    .select('id, first_name, last_name, role_title, total_points, active, planets(name, color), grades(name, icon)')
    .order('total_points', { ascending: false })

  if (filter === 'active')    query = query.eq('active', true)
  if (filter === 'inactive')  query = query.eq('active', false)

  const { data: astronautes } = await query

  return (
    <div className="max-w-4xl">

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.1 }}>
            Astronautes
          </h1>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', color: 'var(--color-on-surface-variant)', marginTop: '0.4rem' }}>
            {astronautes?.length ?? 0} astronaute{(astronautes?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        {isAdmin && (
          <Link href="/astronautes/new" className="btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>person_add</span>
            Ajouter
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'active',   label: 'Actifs' },
          { key: 'all',      label: 'Tous' },
          { key: 'inactive', label: 'Inactifs' },
        ].map(({ key, label }) => (
          <Link key={key} href={`/astronautes?filter=${key}`}
                style={{
                  padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.75rem',
                  fontFamily: 'var(--font-label)', textDecoration: 'none', fontWeight: 600,
                  background: filter === key ? 'var(--color-primary)' : 'var(--color-surface-container)',
                  color: filter === key ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                }}>
            {label}
          </Link>
        ))}
      </div>

      {!astronautes?.length ? (
        <div className="rounded-xl p-12 text-center" style={{ background: 'var(--color-surface-container)' }}>
          <span className="material-symbols-outlined mb-3" style={{ color: 'var(--color-secondary)', fontSize: '2.5rem', display: 'block' }}>group</span>
          <p style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', fontWeight: 700 }}>
            Aucun astronaute
          </p>
          {isAdmin && (
            <Link href="/astronautes/new" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
              Ajouter le premier
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-surface-container)' }}>
          {astronautes.map((a, i) => (
            <Link key={a.id} href={`/astronautes/${a.id}`}
                  className="planet-card"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.85rem',
                    padding: '0.85rem 1rem', textDecoration: 'none',
                    borderBottom: i < astronautes.length - 1 ? '1px solid rgb(255 255 255 / 0.04)' : 'none',
                    opacity: a.active ? 1 : 0.5,
                  }}>

              {/* Rank */}
              <span style={{
                fontFamily: 'var(--font-headline)', fontSize: '0.72rem', fontWeight: 800,
                color: i < 3 ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                width: '1.4rem', textAlign: 'center', flexShrink: 0,
              }}>
                {i + 1}
              </span>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                   style={{ background: a.planets?.color ? `${a.planets.color}30` : 'var(--color-surface-container-highest)' }}>
                <span style={{
                  fontFamily: 'var(--font-headline)', fontSize: '0.78rem', fontWeight: 700,
                  color: a.planets?.color ?? 'var(--color-on-surface-variant)',
                }}>
                  {a.first_name[0]}{a.last_name[0]}
                </span>
              </div>

              {/* Name + role */}
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                  {a.first_name} {a.last_name}
                  {!a.active && <span style={{ fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', marginLeft: '0.4rem' }}>· inactif</span>}
                </p>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)' }}>
                  {a.role_title && `${a.role_title} · `}{a.planets?.name ?? 'Sans planète'}
                </p>
              </div>

              {/* Grade + points */}
              <div className="text-right flex-shrink-0">
                <p style={{ fontFamily: 'var(--font-headline)', fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
                  {a.total_points.toLocaleString('fr-FR')} pts
                </p>
                {a.grades && (
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.62rem', color: 'var(--color-on-surface-variant)' }}>
                    {a.grades.icon} {a.grades.name}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
