import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { Suspense } from 'react'
import SolarSystem from '@/components/hub/SolarSystem'

export const dynamic = 'force-dynamic'

export default async function HubPage() {
  const supabase = await createClient()

  const [{ data: activeSeason }, { data: planets }] = await Promise.all([
    supabase.from('seasons').select('id, name').eq('active', true).single(),
    supabase
      .from('planets')
      .select('id, name, description, color, photo_url, type, planet_season_points(total_points, season_id), astronauts(count)')
      .eq('active', true)
      .order('sort_order', { ascending: true }),
  ])

  const withCount = (planets ?? []).map(p => ({
    ...p,
    memberCount: p.astronauts?.[0]?.count ?? 0,
  }))
  const mainPlanets  = withCount.filter(p => p.type === 'main')
  const otherPlanets = withCount.filter(p => p.type !== 'main')

  return (
    <div className="px-6 pt-6 pb-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1 }}>
            Classement des Planètes
          </h1>
          {activeSeason && (
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginTop: '0.3rem' }}>
              {activeSeason.name}
            </p>
          )}
        </div>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.8rem' }}>
          Points de la saison en cours
        </p>
      </div>

      {/* Solar system — Suspense required by useSearchParams() inside */}
      <Suspense fallback={<div style={{ height: '400px' }} />}>
        <SolarSystem planets={mainPlanets} activeSeason={activeSeason} />
      </Suspense>

      {/* Other planets (newcomers, arbiters) */}
      {otherPlanets.length > 0 && (
        <div className="mt-10">
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Autres planètes
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {otherPlanets.map(planet => {
              const memberCount = planet.memberCount
              return (
                <div key={planet.id} className="rounded-xl p-4 flex items-center gap-3"
                     style={{ background: 'var(--color-surface-container)', border: '1px solid rgb(255 255 255 / 0.04)' }}>
                  <div className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                       style={{ background: planet.color }}>
                    {planet.photo_url
                      ? <Image src={planet.photo_url} alt={planet.name} width={40} height={40} className="object-cover" unoptimized />
                      : <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '1.2rem' }}>public</span>
                    }
                  </div>
                  <div className="flex-1">
                    <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-on-surface)' }}>{planet.name}</p>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)' }}>{memberCount} astronaute{memberCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
