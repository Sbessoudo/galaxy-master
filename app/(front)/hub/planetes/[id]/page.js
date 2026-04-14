import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function HubPlaneteDetailPage({ params, searchParams }) {
  const { id }    = await params
  const previewId = (await searchParams)?.preview ?? null
  const backHref  = previewId ? `/hub?preview=${previewId}` : '/hub'

  if (!UUID_RE.test(id)) notFound()

  const supabase = await createClient()

  // Auth: also checked in (front)/layout.js, kept here for defense-in-depth
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData?.user) redirect('/login')

  const [
    { data: planet, error: planetError },
    { data: activeSeason },
  ] = await Promise.all([
    supabase
      .from('planets')
      .select('*, planet_season_points(total_points, season_id), trophies(id, awarded_at, notes, trophy_types(name, icon))')
      .eq('id', id)
      .single(),
    supabase.from('seasons').select('id, name').eq('active', true).single(),
  ])

  // PGRST116 = row not found → 404; other errors → throw (500)
  if (planetError?.code === 'PGRST116') notFound()
  if (planetError) throw planetError
  if (!planet) notFound()

  const { data: astronauts } = await supabase
    .from('astronauts')
    .select('id, first_name, last_name, role_title, photo_url, total_points, grades(name, icon, color)')
    .eq('planet_id', id)
    .eq('active', true)
    .order('total_points', { ascending: false })

  const seasonPts = activeSeason
    ? (planet.planet_season_points?.find(p => p.season_id === activeSeason.id)?.total_points ?? 0)
    : 0

  const color   = planet.color ?? 'var(--color-primary)'
  const members = astronauts ?? []

  const topPts = Math.max(1, members[0]?.total_points ?? 0)

  const astronautHref = (aId) => previewId
    ? `/hub/astronautes/${aId}?preview=${previewId}`
    : `/hub/astronautes/${aId}`

  const rankColors = ['#ffd700', '#c0c0c0', '#cd7f32']

  return (
    <div className="pb-12 max-w-4xl mx-auto">

      {/* ── Hero banner ─────────────────────────────────────── */}
      <div className="relative mb-8" style={{ minHeight: '280px' }}>

        {/* Background glow layer */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 80% 100% at 50% 0%, ${color}22 0%, transparent 70%)`,
          borderRadius: '0 0 2rem 2rem',
          pointerEvents: 'none',
        }} />

        {/* Back link */}
        <Link href={backHref}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                color: 'var(--color-on-surface-variant)', fontSize: '0.78rem',
                fontFamily: 'var(--font-label)', textDecoration: 'none',
                padding: '1rem 1.5rem', position: 'relative', zIndex: 10,
              }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
          Classement
        </Link>

        {/* Centered planet circle */}
        <div className="flex flex-col items-center" style={{ position: 'relative', zIndex: 10, paddingBottom: '1.5rem' }}>

          {/* Orbit ring decoration */}
          <div style={{
            position: 'relative',
            width: '200px', height: '200px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Outer atmosphere ring */}
            <div style={{
              position: 'absolute', inset: '-16px',
              borderRadius: '50%',
              border: `1px solid ${color}30`,
            }} />
            <div style={{
              position: 'absolute', inset: '-32px',
              borderRadius: '50%',
              border: `1px dashed ${color}15`,
            }} />

            {/* Planet sphere — perfect circle */}
            <div style={{
              width: '160px', height: '160px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: color,
              boxShadow: `0 0 0 4px ${color}30, 0 0 60px ${color}50, inset -6px -6px 20px rgba(0,0,0,0.4)`,
              flexShrink: 0,
            }}>
              {planet.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={planet.photo_url}
                  alt={planet.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '3.5rem' }}>
                    public
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Planet name + description */}
          <h1 style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '2.4rem', fontWeight: 900,
            color: 'var(--color-on-surface)',
            lineHeight: 1, marginTop: '1.25rem', marginBottom: '0.4rem',
            textAlign: 'center',
          }}>
            {planet.name}
          </h1>
          {planet.description && (
            <p style={{
              color: 'var(--color-on-surface-variant)',
              fontSize: '0.875rem', textAlign: 'center',
              maxWidth: '40ch', lineHeight: 1.5,
            }}>
              {planet.description}
            </p>
          )}
        </div>
      </div>

      {/* ── KPI cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 px-6 mb-8">
        {/* Season points */}
        <div className="rounded-2xl p-4 text-center"
             style={{
               background: 'var(--color-surface-container)',
               borderTop: `2px solid ${color}`,
               boxShadow: `0 4px 24px -8px ${color}30`,
             }}>
          <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '2rem', color, lineHeight: 1, marginBottom: '0.3rem' }}>
            {seasonPts.toLocaleString('fr-FR')}
          </p>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            {activeSeason?.name ?? 'Pts saison'}
          </p>
        </div>

        {/* Member count */}
        <div className="rounded-2xl p-4 text-center"
             style={{ background: 'var(--color-surface-container)' }}>
          <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '2rem', color: 'var(--color-on-surface)', lineHeight: 1, marginBottom: '0.3rem' }}>
            {members.length}
          </p>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Astronaute{members.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Trophies count */}
        <div className="rounded-2xl p-4 text-center"
             style={{ background: 'var(--color-surface-container)' }}>
          <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '2rem', color: 'var(--color-tertiary)', lineHeight: 1, marginBottom: '0.3rem' }}>
            {planet.trophies?.length ?? 0}
          </p>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Trophée{(planet.trophies?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* ── Trophées ────────────────────────────────────────── */}
      {planet.trophies?.length > 0 && (
        <div className="rounded-2xl p-5 mb-4 mx-6"
             style={{ background: 'var(--color-surface-container)', borderTop: '2px solid var(--color-tertiary)' }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-tertiary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Trophées
          </p>
          <div className="flex flex-wrap gap-2">
            {planet.trophies.map(t => (
              <div key={t.id}
                   className="flex items-center gap-2 px-3 py-2 rounded-xl"
                   style={{ background: 'var(--color-surface-container-highest)' }}>
                <span style={{ fontSize: '1.25rem' }}>{t.trophy_types?.icon}</span>
                <div>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                    {t.trophy_types?.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.58rem', color: 'var(--color-on-surface-variant)' }}>
                    {t.awarded_at ? new Date(t.awarded_at).toLocaleDateString('fr-FR') : '—'}
                  </p>
                  {t.notes && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', color: 'var(--color-on-surface-variant)', fontStyle: 'italic', marginTop: '0.15rem' }}>
                      {t.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Équipage ────────────────────────────────────────── */}
      <div className="rounded-2xl px-5 pt-5 pb-3 mx-6"
           style={{ background: 'var(--color-surface-container)', borderTop: `2px solid ${color}` }}>

        <div className="flex items-center justify-between mb-4">
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Équipage
          </p>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)' }}>
            Points de vie (total cumulé)
          </p>
        </div>

        {!members.length ? (
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.85rem', paddingBottom: '1rem' }}>
            Aucun astronaute assigné à cette planète.
          </p>
        ) : (
          <div className="space-y-1">
            {members.map((a, i) => {
              const pts      = a.total_points ?? 0
              const pct      = topPts > 0 ? Math.max(4, Math.round((pts / topPts) * 100)) : 4
              const initials = `${(a.first_name || '?')[0]}${(a.last_name || '')[0]}`
              const rankColor = rankColors[i] ?? 'var(--color-on-surface-variant)'

              return (
                <Link key={a.id} href={astronautHref(a.id)}
                      className="crew-row"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.65rem 0.75rem',
                        borderRadius: '0.75rem',
                        textDecoration: 'none',
                        borderTop: i > 0 ? '1px solid rgb(255 255 255 / 0.03)' : 'none',
                      }}>

                  {/* Rank */}
                  <span style={{
                    fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '0.78rem',
                    color: rankColor,
                    width: '24px', flexShrink: 0, textAlign: 'center',
                    textShadow: i < 3 ? `0 0 8px ${rankColor}80` : 'none',
                  }}>
                    {i + 1}
                  </span>

                  {/* Avatar — perfect circle */}
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    overflow: 'hidden', flexShrink: 0,
                    background: `${color}28`,
                    border: i < 3 ? `1.5px solid ${rankColor}60` : `1.5px solid ${color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {a.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.photo_url} alt={`${a.first_name} ${a.last_name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.8rem', color }}>
                        {initials}
                      </span>
                    )}
                  </div>

                  {/* Name + bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p style={{ fontFamily: 'var(--font-label)', fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-on-surface)' }}
                         className="truncate">
                        {a.first_name} {a.last_name}
                      </p>
                      {a.grades?.icon && (
                        <span style={{ fontSize: '0.85rem', flexShrink: 0, lineHeight: 1 }}>{a.grades.icon}</span>
                      )}
                    </div>
                    {a.role_title && (
                      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', marginBottom: '0.25rem' }}
                         className="truncate">
                        {a.role_title}
                      </p>
                    )}
                    {/* Progress bar */}
                    <div style={{ height: '3px', borderRadius: '999px', background: 'rgb(255 255 255 / 0.06)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`, borderRadius: '999px',
                        background: i < 3 ? rankColor : color,
                      }} />
                    </div>
                  </div>

                  {/* Points */}
                  <span style={{
                    fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '0.92rem',
                    color: i < 3 ? rankColor : color,
                    flexShrink: 0,
                  }}>
                    {pts.toLocaleString('fr-FR')}
                    <span style={{ fontFamily: 'var(--font-label)', fontWeight: 400, fontSize: '0.55rem', color: 'var(--color-on-surface-variant)', marginLeft: '0.2rem' }}>pts</span>
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
