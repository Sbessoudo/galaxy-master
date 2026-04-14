import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { GRADE_LEVELS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

function GradeProgress({ totalPoints, color }) {
  const sorted = [...GRADE_LEVELS].sort((a, b) => a.min_points - b.min_points)
  const currentIdx = sorted.findLastIndex(g => g.min_points <= totalPoints)
  const current = sorted[currentIdx]
  const next    = sorted[currentIdx + 1] ?? null
  const pct     = next
    ? Math.min(100, Math.round(((totalPoints - current.min_points) / (next.min_points - current.min_points)) * 100))
    : 100

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-on-surface)' }}>
          {current?.icon} {current?.name}
        </span>
        {next ? (
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.7rem', color: 'var(--color-on-surface-variant)' }}>
            encore {(next.min_points - totalPoints).toLocaleString('fr-FR')} pts → {next.icon} {next.name}
          </span>
        ) : (
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.7rem', color: 'var(--color-on-surface-variant)' }}>
            Grade maximum 🎖️
          </span>
        )}
      </div>
      <div style={{ height: '8px', borderRadius: '999px', background: 'var(--color-surface-container-highest)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: '999px',
          background: `linear-gradient(90deg, ${color}, ${color}80)`,
          boxShadow: `0 0 8px ${color}`,
          transition: 'width 0.8s ease',
        }} />
      </div>
      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', marginTop: '0.3rem', textAlign: 'right' }}>
        {pct}%
      </p>
    </div>
  )
}

export default async function HubAstronauteDetailPage({ params, searchParams }) {
  const { id }      = await params
  const previewId   = (await searchParams)?.preview ?? null
  const backHref    = previewId ? `/hub/astronautes?preview=${previewId}` : '/hub/astronautes'

  const supabase = await createClient()

  const [
    { data: astronaut },
    { data: activeSeason },
  ] = await Promise.all([
    supabase
      .from('astronauts')
      .select('*, planets(id, name, color), grades(name, icon, color)')
      .eq('id', id)
      .single(),
    supabase.from('seasons').select('id, name').eq('active', true).single(),
  ])

  if (!astronaut) notFound()

  const [{ data: contributions }, { data: trophies }] = await Promise.all([
    supabase
      .from('contributions')
      .select('id, date, points_awarded, is_first_ever, is_first_season, contribution_types(name)')
      .eq('astronaut_id', id)
      .order('date', { ascending: false })
      .limit(20),
    supabase
      .from('trophies')
      .select('id, awarded_at, notes, trophy_types(name, icon)')
      .eq('astronaut_id', id)
      .order('awarded_at', { ascending: false }),
  ])

  const color = astronaut.planets?.color ?? 'var(--color-primary)'

  // Season points
  let seasonPts = null
  if (activeSeason) {
    const { data: sp } = await supabase
      .from('contributions')
      .select('points_awarded')
      .eq('astronaut_id', id)
      .eq('season_id', activeSeason.id)
    seasonPts = sp?.reduce((s, c) => s + (c.points_awarded ?? 0), 0) ?? 0
  }

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">

      {/* Back */}
      <Link href={backHref}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', fontFamily: 'var(--font-label)', textDecoration: 'none', marginBottom: '2rem' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
        Retour aux équipages
      </Link>

      {/* Hero card */}
      <div className="rounded-2xl overflow-hidden mb-6"
           style={{
             background: 'var(--color-surface-container)',
             borderTop: `3px solid ${color}`,
             boxShadow: `0 12px 60px -12px ${color}30`,
           }}>

        {/* Photo banner */}
        <div className="relative w-full h-48 flex items-center justify-center"
             style={{ background: `linear-gradient(135deg, ${color}20, ${color}08)` }}>
          {astronaut.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={astronaut.photo_url} alt=""
                 className="w-32 h-32 rounded-2xl object-cover"
                 style={{ border: `3px solid ${color}`, boxShadow: `0 0 32px ${color}50` }} />
          ) : (
            <div className="w-32 h-32 rounded-2xl flex items-center justify-center"
                 style={{ background: `${color}20`, border: `3px solid ${color}40` }}>
              <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '3rem', color }}>
                {astronaut.first_name[0]}{astronaut.last_name[0]}
              </span>
            </div>
          )}

          {/* Grade badge overlay */}
          {astronaut.grades?.icon && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                 style={{ background: 'rgba(6,14,32,0.85)', backdropFilter: 'blur(8px)' }}>
              <span style={{ fontSize: '1.1rem' }}>{astronaut.grades.icon}</span>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                {astronaut.grades.name}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              {astronaut.planets && (
                <span className="badge mb-2 inline-block"
                      style={{ background: `${color}20`, color }}>
                  {astronaut.planets.name}
                </span>
              )}
              <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.1 }}>
                {astronaut.first_name} {astronaut.last_name}
              </h1>
              {astronaut.role_title && (
                <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem', marginTop: '0.3rem' }}>
                  {astronaut.role_title}
                </p>
              )}
            </div>

            {/* Points */}
            <div className="text-right flex-shrink-0 ml-4">
              <p style={{ fontFamily: 'var(--font-headline)', fontSize: '2.5rem', fontWeight: 900, color, lineHeight: 1 }}>
                {astronaut.total_points.toLocaleString('fr-FR')}
              </p>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                pts totaux
              </p>
              {seasonPts !== null && (
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', marginTop: '0.25rem' }}>
                  {seasonPts.toLocaleString('fr-FR')} pts cette saison
                </p>
              )}
            </div>
          </div>

          {/* Grade progress */}
          <GradeProgress totalPoints={astronaut.total_points} color={color} />
        </div>
      </div>

      {/* Trophées */}
      {trophies?.length > 0 && (
        <div className="rounded-2xl p-5 mb-5" style={{ background: 'var(--color-surface-container)' }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Trophées ({trophies.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {trophies.map(t => (
              <div key={t.id} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                   style={{ background: 'var(--color-surface-container-highest)' }}>
                <span style={{ fontSize: '1.2rem' }}>{t.trophy_types?.icon}</span>
                <div>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                    {t.trophy_types?.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)' }}>
                    {new Date(t.awarded_at).toLocaleDateString('fr-FR')}
                  </p>
                  {t.notes && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', marginTop: '0.2rem', fontStyle: 'italic' }}>
                      {t.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contributions */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--color-surface-container)' }}>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Contributions ({contributions?.length ?? 0})
        </p>

        {!contributions?.length ? (
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.85rem' }}>Aucune contribution.</p>
        ) : (
          <div className="space-y-2">
            {contributions.map(c => (
              <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                   style={{ background: 'var(--color-surface-container-highest)' }}>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                    {c.contribution_types?.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)' }}>
                    {new Date(c.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {c.is_first_ever && ' · ✨ ×2 première'}
                    {c.is_first_season && ' · 🎯 +25 saison'}
                  </p>
                </div>
                <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.95rem', fontWeight: 800, color, flexShrink: 0 }}>
                  +{c.points_awarded}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
