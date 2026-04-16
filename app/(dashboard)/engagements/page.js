import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import EngagementActions from '@/components/engagements/EngagementActions'

export const dynamic = 'force-dynamic'

const ENGAGEMENT_THRESHOLD = 0.5 // 50 %

export default async function EngagementsPage() {
  const supabase = await createClient()
  const { data: { user } = {} } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }
  const isAdmin = profile?.role === 'admin'

  // Season + events + astronauts in parallel
  const [
    { data: activeSeason },
    { data: allAstronauts },
  ] = await Promise.all([
    supabase.from('seasons').select('id, name').eq('active', true).single(),
    supabase
      .from('astronauts')
      .select('id, first_name, last_name, photo_url, planets(name, color)')
      .eq('active', true)
      .order('last_name'),
  ])

  // Events for active season (or all if no season)
  let eventsQuery = supabase
    .from('events')
    .select('id, name, date, description, season_id, event_types(name), event_participants(count)')
    .order('date', { ascending: false })
  if (activeSeason) eventsQuery = eventsQuery.eq('season_id', activeSeason.id)
  const { data: events } = await eventsQuery

  // Season events only (for rate calculation)
  const seasonEvents = activeSeason
    ? (events ?? []).filter(e => e.season_id === activeSeason.id)
    : []
  const totalSeasonEvents = seasonEvents.length

  // All participations for season events
  let participationMap = {} // astronaut_id → count of events attended
  if (totalSeasonEvents > 0) {
    const { data: parts } = await supabase
      .from('event_participants')
      .select('astronaut_id, event_id')
      .in('event_id', seasonEvents.map(e => e.id))

    for (const p of (parts ?? [])) {
      participationMap[p.astronaut_id] = (participationMap[p.astronaut_id] ?? 0) + 1
    }
  }

  // Build engagement status per astronaut
  const astronautsWithRate = (allAstronauts ?? []).map(a => {
    const attended = participationMap[a.id] ?? 0
    const rate     = totalSeasonEvents > 0 ? attended / totalSeasonEvents : 0
    return { ...a, attended, rate, engaged: rate >= ENGAGEMENT_THRESHOLD }
  })

  const engaged    = astronautsWithRate.filter(a => a.engaged)
  const notEngaged = astronautsWithRate.filter(a => !a.engaged)
  const globalRate = allAstronauts?.length
    ? Math.round((engaged.length / allAstronauts.length) * 100)
    : 0

  // Per-planet engagement
  const byPlanet = {}
  for (const a of astronautsWithRate) {
    const key   = a.planets?.name ?? 'Sans planète'
    const color = a.planets?.color ?? 'var(--color-on-surface-variant)'
    if (!byPlanet[key]) byPlanet[key] = { color, total: 0, engaged: 0 }
    byPlanet[key].total++
    if (a.engaged) byPlanet[key].engaged++
  }

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.1 }}>
            Events
          </h1>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', color: 'var(--color-on-surface-variant)', marginTop: '0.4rem' }}>
            Astronaute engagé = présent à ≥ 50 % des events de la saison
            {activeSeason && <span style={{ color: 'var(--color-secondary)' }}> · {activeSeason.name}</span>}
          </p>
        </div>
        {isAdmin && (
          <Link href="/engagements/new" className="btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
            Créer un event
          </Link>
        )}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Taux d'engagement"
          value={totalSeasonEvents === 0 ? '—' : `${globalRate} %`}
          sub={`${engaged.length} / ${allAstronauts?.length ?? 0} astronautes`}
          accent="var(--color-tertiary)"
          icon="insights"
        />
        <KpiCard
          label="Events cette saison"
          value={totalSeasonEvents}
          sub={`${(events?.length ?? 0) - totalSeasonEvents} hors saison`}
          accent="var(--color-secondary)"
          icon="event"
        />
        <KpiCard
          label="Astronautes engagés"
          value={engaged.length}
          sub={`≥ 50 % de présence`}
          accent="var(--color-success)"
          icon="check_circle"
        />
        <KpiCard
          label="Non engagés"
          value={notEngaged.length}
          sub={`< 50 % de présence`}
          accent="var(--color-primary)"
          icon="warning"
        />
      </div>

      {/* Per-planet breakdown */}
      {Object.keys(byPlanet).length > 0 && (
        <div className="rounded-xl p-5 mb-8" style={{ background: 'var(--color-surface-container)' }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Taux par planète
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(byPlanet).map(([name, { color, total, engaged: eng }]) => {
              const pct = total > 0 ? Math.round((eng / total) * 100) : 0
              return (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', color: 'var(--color-on-surface)', fontWeight: 600 }}>{name}</span>
                      <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.75rem', fontWeight: 800, color }}>{pct} %</span>
                    </div>
                    <div style={{ height: '4px', borderRadius: '999px', background: 'var(--color-surface-container-highest)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '999px' }} />
                    </div>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', color: 'var(--color-on-surface-variant)', marginTop: '0.2rem' }}>
                      {eng} / {total} engagés
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Astronaut engagement status */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-surface-container)' }}>
          <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid rgb(255 255 255 / 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Statut par astronaute
            </p>
            {totalSeasonEvents === 0 && (
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)' }}>
                Aucun event cette saison
              </span>
            )}
          </div>
          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {[...astronautsWithRate].sort((a, b) => b.rate - a.rate).map((a, i, arr) => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.55rem 1rem',
                borderBottom: i < arr.length - 1 ? '1px solid rgb(255 255 255 / 0.03)' : 'none',
              }}>
                {/* Avatar */}
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: `${a.planets?.color ?? 'var(--color-primary)'}30`,
                  overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {a.photo_url
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={a.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-headline)', fontWeight: 800, color: a.planets?.color ?? 'var(--color-primary)' }}>
                        {a.first_name[0]}{a.last_name?.[0] ?? ''}
                      </span>
                  }
                </div>

                {/* Name */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-on-surface)', lineHeight: 1.2 }} className="truncate">
                    {a.first_name} {a.last_name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', color: 'var(--color-on-surface-variant)' }}>
                    {a.attended} / {totalSeasonEvents} events
                  </p>
                </div>

                {/* Rate bar */}
                <div style={{ width: '60px', flexShrink: 0 }}>
                  <div style={{ height: '3px', borderRadius: '999px', background: 'var(--color-surface-container-highest)', overflow: 'hidden', marginBottom: '0.2rem' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.round(a.rate * 100)}%`,
                      background: a.engaged ? 'var(--color-success)' : 'var(--color-primary)',
                      borderRadius: '999px',
                    }} />
                  </div>
                  <p style={{ fontFamily: 'var(--font-headline)', fontSize: '0.65rem', fontWeight: 800, color: a.engaged ? 'var(--color-success)' : 'var(--color-on-surface-variant)', textAlign: 'right' }}>
                    {Math.round(a.rate * 100)} %
                  </p>
                </div>

                {/* Badge */}
                <span style={{
                  flexShrink: 0, fontSize: '0.85rem',
                  filter: a.engaged ? 'none' : 'grayscale(1) opacity(0.3)',
                }}>
                  {a.engaged ? '✅' : '○'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Events list */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-surface-container)' }}>
          <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid rgb(255 255 255 / 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Events · {events?.length ?? 0} au total
            </p>
          </div>
          {!events?.length ? (
            <div className="p-8 text-center">
              <span className="material-symbols-outlined mb-2" style={{ color: 'var(--color-secondary)', fontSize: '2rem', display: 'block' }}>event</span>
              <p style={{ fontFamily: 'var(--font-label)', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem' }}>
                Aucun event
              </p>
              {isAdmin && (
                <Link href="/engagements/new" className="btn-primary" style={{ display: 'inline-flex', marginTop: '0.75rem' }}>
                  Créer le premier
                </Link>
              )}
            </div>
          ) : (
            <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {events.map((e, i) => {
                const count = e.event_participants?.[0]?.count ?? 0
                const pct   = allAstronauts?.length
                  ? Math.round((count / allAstronauts.length) * 100)
                  : 0
                return (
                  <div key={e.id} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 1rem',
                    borderBottom: i < events.length - 1 ? '1px solid rgb(255 255 255 / 0.04)' : 'none',
                  }}>
                    {/* Date */}
                    <div style={{ flexShrink: 0, textAlign: 'center', width: '36px' }}>
                      <p style={{ fontFamily: 'var(--font-headline)', fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                        {new Date(e.date).getDate()}
                      </p>
                      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.5rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {new Date(e.date).toLocaleDateString('fr-FR', { month: 'short' })}
                      </p>
                    </div>

                    {/* Name */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-on-surface)' }} className="truncate">
                        {e.name}
                      </p>
                      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)' }}>
                        {e.event_types?.name ?? 'Sans type'}
                      </p>
                    </div>

                    {/* Participation */}
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <p style={{ fontFamily: 'var(--font-headline)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
                        {count} <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', fontWeight: 400, color: 'var(--color-on-surface-variant)' }}>présents</span>
                      </p>
                      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', color: pct >= 50 ? 'var(--color-success)' : 'var(--color-on-surface-variant)' }}>
                        {pct} % du groupe
                      </p>
                    </div>

                    {/* Actions */}
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                        <Link href={`/engagements/${e.id}`} className="btn-ghost"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.65rem' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.8rem' }}>how_to_reg</span>
                        </Link>
                        <Link href={`/engagements/${e.id}/edit`} className="btn-ghost"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.65rem' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.8rem' }}>edit</span>
                        </Link>
                        <EngagementActions id={e.id} name={e.name} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, value, sub, accent, icon }) {
  return (
    <div style={{
      background: 'var(--color-surface-container)',
      borderRadius: '1rem',
      padding: '1.25rem',
      borderTop: `2px solid ${accent}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {label}
        </p>
        <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: accent }}>{icon}</span>
      </div>
      <p style={{ fontFamily: 'var(--font-headline)', fontSize: '1.8rem', fontWeight: 900, color: accent, lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', marginTop: '0.3rem' }}>
        {sub}
      </p>
    </div>
  )
}
