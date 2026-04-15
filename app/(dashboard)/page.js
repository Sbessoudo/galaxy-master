import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    : { data: null }
  const isAdmin = profile?.role === 'admin'

  // Base data in parallel
  const [
    { data: activeSeason },
    { count: astronautCount },
    { data: planetes },
  ] = await Promise.all([
    supabase.from('seasons').select('id, name').eq('active', true).single(),
    supabase.from('astronauts').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('planets')
      .select('id, name, color, photo_url, type, planet_season_points(total_points, season_id)')
      .eq('active', true)
      .eq('type', 'main')
      .order('sort_order', { ascending: true }),
  ])

  // Season-dependent data
  let contributionCount  = 0
  let engagementRate     = null
  let topContributors    = []
  let typeBreakdown      = []

  if (activeSeason) {
    const [
      { count: contribCount },
      { data: contributions },
      { data: seasonEvents },
    ] = await Promise.all([
      supabase.from('contributions').select('*', { count: 'exact', head: true }).eq('season_id', activeSeason.id),
      supabase.from('contributions')
        .select('astronaut_id, points_awarded, type_id, contribution_types(name, category)')
        .eq('season_id', activeSeason.id),
      supabase.from('events').select('id').eq('season_id', activeSeason.id),
    ])

    contributionCount = contribCount ?? 0
    const eventCount  = seasonEvents?.length ?? 0

    // Engagement rate = % d'astronautes ayant assisté à ≥ 50% des events de la saison
    if (eventCount > 0 && (astronautCount ?? 0) > 0) {
      const seasonEventIds = (seasonEvents ?? []).map(e => e.id)
      const { data: parts } = await supabase
        .from('event_participants')
        .select('astronaut_id')
        .in('event_id', seasonEventIds)
      const countByAstro = {}
      for (const p of (parts ?? [])) {
        countByAstro[p.astronaut_id] = (countByAstro[p.astronaut_id] ?? 0) + 1
      }
      const engagedCount = Object.values(countByAstro)
        .filter(n => n / eventCount >= 0.5).length
      engagementRate = Math.round((engagedCount / (astronautCount ?? 1)) * 100)
    }

    if (contributions?.length) {
      // F-09 — Top 5 contributors (by season points)
      const byAstronaut = {}
      for (const c of contributions) {
        if (!byAstronaut[c.astronaut_id]) byAstronaut[c.astronaut_id] = 0
        byAstronaut[c.astronaut_id] += c.points_awarded
      }
      const top5Ids = Object.entries(byAstronaut)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id]) => id)

      if (top5Ids.length > 0) {
        const { data: astronauts } = await supabase
          .from('astronauts')
          .select('id, first_name, last_name, photo_url, grades(name, color, icon)')
          .in('id', top5Ids)
        topContributors = top5Ids.map(id => ({
          ...(astronauts?.find(a => a.id === id) ?? { id, first_name: '?', last_name: '' }),
          seasonPts: byAstronaut[id],
        }))
      }

      // F-08 — Contribution breakdown by type
      const byType = {}
      for (const c of contributions) {
        const key = c.type_id
        if (!byType[key]) byType[key] = { name: c.contribution_types?.name ?? 'Inconnu', count: 0, pts: 0 }
        byType[key].count++
        byType[key].pts += c.points_awarded
      }
      typeBreakdown = Object.values(byType)
        .sort((a, b) => b.pts - a.pts)
    }
  }

  // Planet ranking
  const rankedPlanetes = planetes
    ?.map(p => ({
      ...p,
      seasonPts: activeSeason
        ? (p.planet_season_points?.find(sp => sp.season_id === activeSeason.id)?.total_points ?? 0)
        : 0,
    }))
    .sort((a, b) => b.seasonPts - a.seasonPts) ?? []

  const maxPts    = rankedPlanetes[0]?.seasonPts || 1
  const maxTypePts = typeBreakdown[0]?.pts || 1

  const stats = [
    {
      label: 'Astronautes actifs',
      value: astronautCount ?? 0,
      icon: 'group',
      accent: 'var(--color-primary)',
      bg: 'rgb(255 140 152 / 0.12)',
    },
    {
      label: 'Contributions (saison)',
      value: activeSeason ? contributionCount : '—',
      icon: 'rocket_launch',
      accent: 'var(--color-secondary)',
      bg: 'rgb(144 147 255 / 0.12)',
    },
    {
      label: 'Taux d\'engagement',
      value: engagementRate !== null ? `${engagementRate}%` : '—',
      icon: 'insights',
      accent: 'var(--color-tertiary)',
      bg: 'rgb(255 177 72 / 0.12)',
    },
    {
      label: 'Saison active',
      value: activeSeason ? activeSeason.name : 'Aucune',
      icon: 'calendar_month',
      accent: activeSeason ? 'var(--color-success)' : 'var(--color-on-surface-variant)',
      bg: activeSeason ? 'rgb(74 222 128 / 0.10)' : 'var(--color-surface-container-highest)',
      small: true,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">

      {/* Editorial headline */}
      <div className="mb-10">
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-primary)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.75rem' }}>
          Galaxy Master · Live Operations
        </p>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.1, marginBottom: '0.5rem' }}>
          Mission Control,{' '}
          <span style={{ color: 'var(--color-primary)', fontWeight: 400, fontStyle: 'italic' }}>
            votre orbite est stable.
          </span>
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>
          {activeSeason ? `Saison en cours : ${activeSeason.name}` : 'Aucune saison active — configure une saison pour démarrer.'}
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon, accent, bg, small }) => (
          <div key={label} className="rounded-xl p-5"
               style={{ background: 'var(--color-surface-container)', boxShadow: 'var(--shadow-ambient)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4" style={{ background: bg }}>
              <span className="material-symbols-outlined" style={{ color: accent, fontSize: '1rem' }}>{icon}</span>
            </div>
            <p style={{ fontFamily: 'var(--font-headline)', fontSize: small ? '1rem' : '1.8rem', fontWeight: 800, color: 'var(--color-on-surface)', marginBottom: '0.25rem', lineHeight: 1.1 }}>
              {value}
            </p>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.62rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Row 2: Planet ranking + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        {/* Planet ranking */}
        <div className="lg:col-span-2 rounded-xl p-6"
             style={{ background: 'var(--color-surface-container)', borderTop: '2px solid var(--color-secondary)' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-secondary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Classement
              </p>
              <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                Planètes — {activeSeason?.name ?? 'Aucune saison'}
              </h2>
            </div>
            {activeSeason && <span className="badge badge-secondary">Live</span>}
          </div>

          {rankedPlanetes.length === 0 ? (
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.85rem' }}>
              Aucune planète principale configurée.
            </p>
          ) : (
            <div className="space-y-1">
              {rankedPlanetes.map((planete, i) => {
                const pct = maxPts > 0 ? Math.max(4, Math.round((planete.seasonPts / maxPts) * 100)) : 4
                const rankColors = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-tertiary)', 'var(--color-on-surface-variant)']
                return (
                  <div key={planete.id} className="flex items-center gap-4 py-3"
                       style={{ borderTop: i > 0 ? '1px solid rgb(255 255 255 / 0.04)' : 'none' }}>
                    <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.85rem', fontWeight: 800, color: rankColors[i] ?? 'var(--color-on-surface-variant)', width: '1.25rem', textAlign: 'right' }}>
                      {i + 1}
                    </span>
                    <div className="relative w-7 h-7 rounded-lg flex-shrink-0 overflow-hidden"
                         style={{ background: planete.color, boxShadow: `0 0 12px -2px ${planete.color}` }}>
                      {planete.photo_url && (
                        <Image src={planete.photo_url} alt={planete.name} fill className="object-cover" unoptimized />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                          {planete.name}
                        </p>
                        <p style={{ fontFamily: 'var(--font-headline)', fontSize: '0.85rem', fontWeight: 800, color: planete.color }}>
                          {planete.seasonPts.toLocaleString('fr-FR')} pts
                        </p>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: planete.color }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick actions — admins only */}
        {isAdmin && <div className="rounded-xl p-5"
             style={{ background: 'var(--color-surface-container)', borderTop: '2px solid var(--color-primary)' }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Actions rapides
          </p>
          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '1.25rem' }}>
            Raccourcis
          </h2>
          <div className="space-y-2">
            {[
              { label: 'Nouvelle contribution', icon: 'add_circle',  href: '/contributions/new', color: 'var(--color-primary)' },
              { label: 'Ajouter un astronaute', icon: 'person_add',  href: '/astronautes/new',   color: 'var(--color-secondary)' },
              { label: 'Créer un événement',    icon: 'event',       href: '/engagements/new',   color: 'var(--color-tertiary)' },
              { label: 'Attribuer un trophée',  icon: 'emoji_events', href: '/trophees/new',     color: 'var(--color-success)' },
            ].map(({ label, icon, href, color }) => (
              <Link key={label} href={href}
                 className="flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-[1.01]"
                 style={{ background: 'var(--color-surface-container-highest)' }}>
                <span className="material-symbols-outlined" style={{ color, fontSize: '1rem' }}>{icon}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-on-surface)', fontWeight: 500 }}>
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>}

      </div>

      {/* Row 3: Top 5 contributors + Contribution breakdown */}
      {activeSeason && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* F-09 — Top 5 contributors */}
          <div className="rounded-xl p-6"
               style={{ background: 'var(--color-surface-container)', borderTop: '2px solid var(--color-primary)' }}>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Top contributeurs
            </p>
            <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '1.25rem' }}>
              Top 5 — {activeSeason.name}
            </h2>

            {topContributors.length === 0 ? (
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.85rem' }}>
                Aucune contribution enregistrée cette saison.
              </p>
            ) : (
              <div className="space-y-1">
                {topContributors.map((a, i) => {
                  const maxTopPts = topContributors[0]?.seasonPts || 1
                  const pct = Math.max(6, Math.round((a.seasonPts / maxTopPts) * 100))
                  const rankColors = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-tertiary)', 'var(--color-on-surface-variant)', 'var(--color-on-surface-variant)']
                  const initials = `${a.first_name?.[0] ?? ''}${a.last_name?.[0] ?? ''}`.toUpperCase()
                  return (
                    <Link key={a.id} href={`/astronautes/${a.id}`}
                          className="flex items-center gap-3 py-3 group"
                          style={{ borderTop: i > 0 ? '1px solid rgb(255 255 255 / 0.04)' : 'none', textDecoration: 'none' }}>
                      <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.8rem', fontWeight: 800, color: rankColors[i], width: '1rem', textAlign: 'right', flexShrink: 0 }}>
                        {i + 1}
                      </span>
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                           style={{ background: 'var(--color-primary-container)' }}>
                        {a.photo_url ? (
                          <Image src={a.photo_url} alt={`${a.first_name} ${a.last_name}`} width={32} height={32} className="object-cover rounded-full" unoptimized />
                        ) : (
                          <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.7rem', color: 'var(--color-on-primary-container)' }}>
                            {initials}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-on-surface)' }} className="truncate">
                            {a.first_name} {a.last_name}
                            {a.grades && (
                              <span style={{ marginLeft: '0.4rem', fontSize: '0.65rem', color: a.grades.color ?? 'var(--color-on-surface-variant)' }}>
                                {a.grades.icon}
                              </span>
                            )}
                          </p>
                          <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.82rem', fontWeight: 800, color: rankColors[i], flexShrink: 0, marginLeft: '0.5rem' }}>
                            {a.seasonPts.toLocaleString('fr-FR')} pts
                          </span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${pct}%`, background: rankColors[i] }} />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* F-08 — Contribution breakdown by type */}
          <div className="rounded-xl p-6"
               style={{ background: 'var(--color-surface-container)', borderTop: '2px solid var(--color-tertiary)' }}>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-tertiary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Répartition
            </p>
            <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '1.25rem' }}>
              Types de contribution
            </h2>

            {typeBreakdown.length === 0 ? (
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.85rem' }}>
                Aucune contribution enregistrée cette saison.
              </p>
            ) : (
              <div className="space-y-3">
                {typeBreakdown.map((t, i) => {
                  const pct = Math.max(4, Math.round((t.pts / maxTypePts) * 100))
                  const colors = [
                    'var(--color-tertiary)',
                    'var(--color-secondary)',
                    'var(--color-primary)',
                    '#7c9fff',
                    '#b5aaff',
                    '#ffb9c0',
                    '#ffd580',
                    'var(--color-on-surface-variant)',
                  ]
                  const color = colors[i] ?? colors[colors.length - 1]
                  return (
                    <div key={t.name}>
                      <div className="flex items-center justify-between mb-1">
                        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-on-surface)' }} className="truncate pr-2">
                          {t.name}
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                          <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)' }}>
                            {t.count}×
                          </span>
                          <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.72rem', fontWeight: 800, color }}>
                            {t.pts.toLocaleString('fr-FR')} pts
                          </span>
                        </div>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  )
}
