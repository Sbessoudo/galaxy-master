import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import SolarSystem from '@/components/hub/SolarSystem'

export const dynamic = 'force-dynamic'

const RANK_LABEL = ['1er', '2e', '3e', '4e']
const RANK_COLOR = ['#ffd700', '#c0c0c0', '#cd7f32', 'rgba(255,255,255,0.45)']

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
    seasonPts: activeSeason
      ? (p.planet_season_points?.find(sp => sp.season_id === activeSeason.id)?.total_points ?? 0)
      : 0,
  }))

  const mainPlanets  = withCount.filter(p => p.type === 'main').sort((a, b) => b.seasonPts - a.seasonPts)
  const otherPlanets = withCount.filter(p => p.type !== 'main')
  const maxPts       = mainPlanets[0]?.seasonPts || 1

  return (
    <div className="px-6 pt-6 pb-10" style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* Header */}
      <div className="mb-8">
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem' }}>
          {activeSeason ? activeSeason.name : 'Aucune saison active'}
        </p>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-on-surface)', lineHeight: 1 }}>
          Classement des Planètes
        </h1>
      </div>

      {/* Main layout — solar system + leaderboard side by side */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Solar system */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={<div style={{ height: '400px' }} />}>
            <SolarSystem planets={mainPlanets} activeSeason={activeSeason} />
          </Suspense>
        </div>

        {/* Leaderboard panel */}
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">

          {/* Rankings */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--color-surface-container)' }}>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.58rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Classement saison
            </p>
            <div className="space-y-1">
              {mainPlanets.map((p, i) => {
                const pct = maxPts > 0 ? Math.max(4, Math.round((p.seasonPts / maxPts) * 100)) : 4
                return (
                  <Link key={p.id} href={`/hub/planetes/${p.id}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem',
                                 padding: '0.6rem 0', textDecoration: 'none',
                                 borderTop: i > 0 ? '1px solid rgb(255 255 255 / 0.05)' : 'none' }}>
                    <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '0.85rem',
                                   color: RANK_COLOR[i], width: '1.5rem', textAlign: 'center', flexShrink: 0 }}>
                      {RANK_LABEL[i]}
                    </span>
                    <div className="w-9 h-9 rounded-xl flex-shrink-0 overflow-hidden"
                         style={{ background: p.color, boxShadow: `0 0 10px ${p.color}50` }}>
                      {p.photo_url
                        ? <Image src={p.photo_url} alt={p.name} width={36} height={36} className="object-cover w-full h-full" unoptimized />
                        : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p style={{ fontFamily: 'var(--font-label)', fontWeight: 700, fontSize: '0.8rem',
                                    color: 'var(--color-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.name}
                        </p>
                        <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.78rem',
                                       color: p.color, flexShrink: 0, marginLeft: '0.5rem' }}>
                          {p.seasonPts.toLocaleString('fr-FR')} pts
                        </span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: p.color }} />
                      </div>
                      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.58rem', color: 'var(--color-on-surface-variant)', marginTop: '0.2rem' }}>
                        {p.memberCount} astronaute{p.memberCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Other planets */}
          {otherPlanets.length > 0 && (
            <div className="rounded-2xl p-5" style={{ background: 'var(--color-surface-container)' }}>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.58rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Autres planètes
              </p>
              <div className="space-y-2">
                {otherPlanets.map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 overflow-hidden"
                         style={{ background: p.color }}>
                      {p.photo_url
                        ? <Image src={p.photo_url} alt={p.name} width={32} height={32} className="object-cover w-full h-full" unoptimized />
                        : null}
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-label)', fontWeight: 600, fontSize: '0.78rem', color: 'var(--color-on-surface)' }}>{p.name}</p>
                      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.58rem', color: 'var(--color-on-surface-variant)' }}>
                        {p.memberCount} astronaute{p.memberCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
