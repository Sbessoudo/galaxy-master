import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function HubPlaneteDetailPage({ params, searchParams }) {
  const { id }    = await params
  const previewId = (await searchParams)?.preview ?? null
  const backHref  = previewId ? `/hub?preview=${previewId}` : '/hub'

  const supabase = await createClient()

  const [
    { data: planet },
    { data: activeSeason },
  ] = await Promise.all([
    supabase
      .from('planets')
      .select('*, planet_season_points(total_points, season_id), trophies(id, awarded_at, notes, trophy_types(name, icon))')
      .eq('id', id)
      .single(),
    supabase.from('seasons').select('id, name').eq('active', true).single(),
  ])

  if (!planet) notFound()

  const { data: astronauts } = await supabase
    .from('astronauts')
    .select('id, first_name, last_name, role_title, photo_url, total_points, grades(name, icon)')
    .eq('planet_id', id)
    .eq('active', true)
    .order('total_points', { ascending: false })

  const seasonPts = activeSeason
    ? (planet.planet_season_points?.find(p => p.season_id === activeSeason.id)?.total_points ?? 0)
    : 0

  const color = planet.color ?? 'var(--color-primary)'

  const astronautHref = (aId) => previewId
    ? `/hub/astronautes/${aId}?preview=${previewId}`
    : `/hub/astronautes/${aId}`

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">

      {/* Back */}
      <Link href={backHref}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', fontFamily: 'var(--font-label)', textDecoration: 'none', marginBottom: '2rem' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
        Retour au classement
      </Link>

      {/* Hero */}
      <div className="rounded-2xl overflow-hidden mb-6"
           style={{
             background: 'var(--color-surface-container)',
             borderTop: `3px solid ${color}`,
             boxShadow: `0 12px 60px -12px ${color}30`,
           }}>

        {/* Photo banner */}
        <div className="relative w-full h-52 flex items-center justify-center"
             style={{ background: `linear-gradient(135deg, ${color}18, ${color}06)` }}>
          {planet.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={planet.photo_url} alt={planet.name}
                 className="w-36 h-36 rounded-2xl object-cover"
                 style={{ border: `3px solid ${color}`, boxShadow: `0 0 40px ${color}50` }} />
          ) : (
            <div className="w-36 h-36 rounded-2xl flex items-center justify-center"
                 style={{ background: `${color}20`, border: `3px solid ${color}40` }}>
              <span className="material-symbols-outlined" style={{ color, fontSize: '3rem', opacity: 0.8 }}>public</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.1 }}>
                {planet.name}
              </h1>
              {planet.description && (
                <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem', marginTop: '0.4rem', maxWidth: '40ch' }}>
                  {planet.description}
                </p>
              )}
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', marginTop: '0.5rem' }}>
                {astronauts?.length ?? 0} astronaute{(astronauts?.length ?? 0) !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Season points */}
            <div className="text-right flex-shrink-0 ml-6">
              <p style={{ fontFamily: 'var(--font-headline)', fontSize: '2.8rem', fontWeight: 900, color, lineHeight: 1 }}>
                {seasonPts.toLocaleString('fr-FR')}
              </p>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                pts {activeSeason ? activeSeason.name : 'saison'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trophées */}
      {planet.trophies?.length > 0 && (
        <div className="rounded-2xl p-5 mb-5" style={{ background: 'var(--color-surface-container)' }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Trophées ({planet.trophies.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {planet.trophies.map(t => (
              <div key={t.id} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                   style={{ background: 'var(--color-surface-container-highest)' }}>
                <span style={{ fontSize: '1.2rem' }}>{t.trophy_types?.icon}</span>
                <div>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                    {t.trophy_types?.name}
                  </p>
                  {t.notes && (
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)' }}>
                      {t.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Équipage */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--color-surface-container)' }}>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Équipage ({astronauts?.length ?? 0})
        </p>

        {!astronauts?.length ? (
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.85rem' }}>Aucun astronaute assigné.</p>
        ) : (
          <div className="space-y-2">
            {astronauts.map((a, i) => (
              <Link key={a.id} href={astronautHref(a.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--color-surface-container-highest)', textDecoration: 'none', transition: 'background 0.15s' }}
                    className="hover:opacity-80">

                {/* Rank */}
                <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '0.8rem', color: i === 0 ? '#ffd700' : 'var(--color-on-surface-variant)', width: '28px', flexShrink: 0, textAlign: 'center' }}>
                  {i + 1}
                </span>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                     style={{ background: `${color}30` }}>
                  {a.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.9rem', color }}>
                      {a.first_name[0]}{a.last_name[0]}
                    </span>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: 'var(--font-label)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-on-surface)' }}>
                    {a.first_name} {a.last_name}
                    {a.grades?.icon && <span style={{ marginLeft: '0.4rem' }}>{a.grades.icon}</span>}
                  </p>
                  {a.role_title && (
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)' }} className="truncate">
                      {a.role_title}
                    </p>
                  )}
                </div>

                {/* Points */}
                <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '1rem', color, flexShrink: 0 }}>
                  {a.total_points.toLocaleString('fr-FR')} pts
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
