import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ContributionActions from '@/components/contributions/ContributionActions'

export const dynamic = 'force-dynamic'

export default async function ContributionsPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }
  const isAdmin = profile?.role === 'admin'

  const params = await searchParams
  const search = params?.q ?? ''

  let query = supabase
    .from('contributions')
    .select(`
      id, date, points_awarded, is_first_ever, is_first_season, notes,
      astronauts(id, first_name, last_name, planets(name, color)),
      contribution_types(name, base_points, category)
    `)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(100)

  const { data: contributions } = await query

  // Client-side filtering on astronaut name (server search would need ilike join)
  const filtered = search
    ? contributions?.filter(c => {
        const name = `${c.astronauts?.first_name} ${c.astronauts?.last_name}`.toLowerCase()
        return name.includes(search.toLowerCase())
      })
    : contributions

  return (
    <div className="max-w-4xl">

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.1 }}>
            Contributions
          </h1>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', color: 'var(--color-on-surface-variant)', marginTop: '0.4rem' }}>
            {filtered?.length ?? 0} contribution{(filtered?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        {isAdmin && (
          <Link href="/contributions/new" className="btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
            Enregistrer
          </Link>
        )}
      </div>

      {/* Search */}
      <form className="mb-6">
        <input name="q" defaultValue={search} placeholder="Rechercher par astronaute…"
               style={{
                 width: '100%', maxWidth: '360px', padding: '0.6rem 0.9rem', borderRadius: '0.6rem',
                 background: 'var(--color-surface-container)', border: '1px solid rgb(255 255 255 / 0.08)',
                 color: 'var(--color-on-surface)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none',
               }} />
      </form>

      {!filtered?.length ? (
        <div className="rounded-xl p-12 text-center" style={{ background: 'var(--color-surface-container)' }}>
          <span className="material-symbols-outlined mb-3" style={{ color: 'var(--color-secondary)', fontSize: '2.5rem', display: 'block' }}>rocket_launch</span>
          <p style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', fontWeight: 700 }}>
            Aucune contribution
          </p>
          {isAdmin && (
            <Link href="/contributions/new" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
              Enregistrer la première
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-surface-container)' }}>
          {filtered.map((c, i) => {
            const planet = c.astronauts?.planets
            return (
              <div key={c.id}
                   style={{
                     display: 'flex', alignItems: 'center', gap: '0.85rem',
                     padding: '0.85rem 1rem',
                     borderBottom: i < filtered.length - 1 ? '1px solid rgb(255 255 255 / 0.04)' : 'none',
                   }}>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                     style={{ background: planet?.color ? `${planet.color}30` : 'var(--color-surface-container-highest)' }}>
                  <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.72rem', fontWeight: 700, color: planet?.color ?? 'var(--color-on-surface-variant)' }}>
                    {c.astronauts?.first_name?.[0]}{c.astronauts?.last_name?.[0]}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                    {c.astronauts?.first_name} {c.astronauts?.last_name}
                    {planet && <span style={{ color: planet.color, marginLeft: '0.35rem', fontSize: '0.65rem' }}>· {planet.name}</span>}
                  </p>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)' }}>
                    {c.contribution_types?.name}
                    {c.notes && <span> · {c.notes.slice(0, 60)}{c.notes.length > 60 ? '…' : ''}</span>}
                  </p>
                </div>

                {/* Badges + date */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {c.is_first_ever && (
                    <span className="badge" style={{ background: 'var(--color-primary)20', color: 'var(--color-primary)', fontSize: '0.6rem' }}>×2</span>
                  )}
                  {c.is_first_season && (
                    <span className="badge" style={{ background: 'var(--color-secondary)20', color: 'var(--color-secondary)', fontSize: '0.6rem' }}>+25</span>
                  )}
                  <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)' }}>
                    {new Date(c.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                {/* Points */}
                <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-on-surface)', width: '60px', textAlign: 'right', flexShrink: 0 }}>
                  +{c.points_awarded}
                </span>

                {isAdmin && (
                  <ContributionActions id={c.id} />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
