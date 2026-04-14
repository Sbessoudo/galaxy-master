import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

const TYPE_LABEL = { main: 'Principale', newcomers: 'Recrues', arbiters: 'Arbitres' }

export default async function PlanetesPage() {
  const supabase = await createClient()

  // Get active season
  const { data: activeSeason } = await supabase
    .from('seasons').select('id, name').eq('active', true).single()

  // Get planets with member count and season points
  const { data: planetes } = await supabase
    .from('planets')
    .select(`
      *,
      astronauts(count),
      planet_season_points(total_points, season_id)
    `)
    .eq('active', true)
    .order('sort_order', { ascending: true })

  return (
    <div className="max-w-5xl">

      <div className="flex items-start justify-between mb-8">
        <div>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
            {activeSeason ? `Saison · ${activeSeason.name}` : 'Aucune saison active'}
          </p>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.1 }}>
            Planètes
          </h1>
        </div>
      </div>

      {!planetes?.length ? (
        <div className="rounded-xl p-12 text-center" style={{ background: 'var(--color-surface-container)' }}>
          <span className="material-symbols-outlined mb-3" style={{ color: 'var(--color-secondary)', fontSize: '2.5rem', display: 'block' }}>public</span>
          <p style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Aucune planète configurée
          </p>
          <Link href="/config/planetes/new" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
            Configurer les planètes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {planetes.map((planete) => {
            const memberCount = planete.astronauts?.[0]?.count ?? 0
            const seasonPts = activeSeason
              ? (planete.planet_season_points?.find(p => p.season_id === activeSeason.id)?.total_points ?? 0)
              : null

            return (
              <Link key={planete.id} href={`/planetes/${planete.id}`}
                   className="planet-card rounded-xl p-6 flex flex-col gap-4"
                   style={{
                     background: 'var(--color-surface-container)',
                     borderTop: `2px solid ${planete.color}`,
                     boxShadow: `0 4px 32px -8px ${planete.color}30`,
                     textDecoration: 'none',
                   }}>

                {/* Top */}
                <div className="flex items-start justify-between">
                  <div className="relative w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                       style={{ background: planete.color, boxShadow: `0 0 24px -4px ${planete.color}` }}>
                    {planete.photo_url
                      ? <Image src={planete.photo_url} alt={planete.name} fill className="object-cover" unoptimized />
                      : <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '1.5rem', opacity: 0.9 }}>public</span>
                    }
                  </div>
                  <span className="badge"
                        style={{ background: `${planete.color}20`, color: planete.color }}>
                    {TYPE_LABEL[planete.type] || planete.type}
                  </span>
                </div>

                {/* Name */}
                <div>
                  <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-on-surface)', marginBottom: '0.2rem' }}>
                    {planete.name}
                  </h2>
                  {planete.description && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-on-surface-variant)' }}>
                      {planete.description}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-4 pt-2"
                     style={{ borderTop: '1px solid rgb(255 255 255 / 0.05)' }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
                      {memberCount}
                    </p>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Astronautes
                    </p>
                  </div>
                  {seasonPts !== null && (
                    <div>
                      <p style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 800, color: planete.color }}>
                        {seasonPts.toLocaleString('fr-FR')}
                      </p>
                      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Points saison
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
