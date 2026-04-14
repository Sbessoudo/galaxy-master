import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AstronautSearch from '@/components/hub/AstronautSearch'

export const dynamic = 'force-dynamic'

export default async function HubAstronautesPage({ searchParams }) {
  const supabase  = await createClient()
  const previewId = (await searchParams)?.preview ?? null

  const { data: planets } = await supabase
    .from('planets').select('id, name, color').eq('active', true).order('sort_order', { ascending: true })

  const { data: astronauts } = await supabase
    .from('astronauts')
    .select('id, first_name, last_name, role_title, photo_url, total_points, planet_id, planets(name, color), grades(name, icon)')
    .eq('active', true)
    .order('total_points', { ascending: false })

  // Group by planet
  const byPlanet = {}
  for (const a of (astronauts ?? [])) {
    const key = a.planet_id ?? 'none'
    if (!byPlanet[key]) byPlanet[key] = []
    byPlanet[key].push(a)
  }

  const planetOrder = (planets ?? []).map(p => p.id)
  const sorted = [
    ...planetOrder.map(id => ({ planet: planets.find(p => p.id === id), astronauts: byPlanet[id] ?? [] })).filter(g => g.astronauts.length),
    ...(byPlanet['none']?.length ? [{ planet: null, astronauts: byPlanet['none'] }] : []),
  ]

  const href = (id) => previewId ? `/hub/astronautes/${id}?preview=${previewId}` : `/hub/astronautes/${id}`

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">

      <div className="text-center mb-8">
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '3rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1 }}>
          Les Équipages
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.9rem', marginTop: '0.75rem', marginBottom: '2rem' }}>
          {astronauts?.length ?? 0} astronautes actifs
        </p>
        <AstronautSearch astronauts={astronauts ?? []} />
      </div>

      {sorted.map(({ planet, astronauts: members }) => (
        <div key={planet?.id ?? 'none'} className="mb-12">

          {/* Planet header */}
          <div className="flex items-center gap-3 mb-5">
            {planet && (
              <div className="w-4 h-4 rounded-full flex-shrink-0"
                   style={{ background: planet.color, boxShadow: `0 0 8px ${planet.color}` }} />
            )}
            <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '1.1rem', color: planet?.color ?? 'var(--color-on-surface-variant)' }}>
              {planet?.name ?? 'Sans planète'}
            </h2>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)' }}>
              {members.length} membre{members.length !== 1 ? 's' : ''}
            </span>
            <div className="flex-1 h-px" style={{ background: planet ? `${planet.color}30` : 'rgb(255 255 255 / 0.05)' }} />
          </div>

          {/* Astronaut cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {members.map(a => {
              const initials = `${(a.first_name || '?')[0]}${(a.last_name || '?')[0]}`
              const color    = a.planets?.color ?? 'var(--color-primary)'

              return (
                <Link key={a.id} href={href(a.id)}
                      className="rounded-2xl overflow-hidden flex flex-col astronaut-card"
                      style={{
                        background: 'var(--color-surface-container)',
                        border: '1px solid rgb(255 255 255 / 0.04)',
                        textDecoration: 'none',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        '--card-glow': color,
                      }}>

                  {/* Photo */}
                  <div className="relative w-full aspect-square flex items-center justify-center"
                       style={{ background: `${color}18` }}>
                    {a.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.photo_url} alt={`${a.first_name} ${a.last_name}`}
                           className="w-full h-full object-cover absolute inset-0" />
                    ) : (
                      <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '2rem', color }}>
                        {initials}
                      </span>
                    )}

                    {/* Grade badge */}
                    {a.grades?.icon && (
                      <span style={{
                        position: 'absolute', bottom: '0.4rem', right: '0.4rem',
                        fontSize: '1.2rem', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.6))',
                      }}>
                        {a.grades.icon}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p style={{ fontFamily: 'var(--font-label)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-on-surface)', lineHeight: 1.2 }}
                       className="truncate">
                      {a.first_name} {a.last_name}
                    </p>
                    {a.role_title && (
                      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', marginTop: '0.2rem' }}
                         className="truncate">
                        {a.role_title}
                      </p>
                    )}
                    <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.95rem', color, marginTop: '0.5rem' }}>
                      {a.total_points.toLocaleString('fr-FR')} pts
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
