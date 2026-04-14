import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AstronauteActions from '@/components/astronautes/AstronauteActions'
import InviteButton from '@/components/astronautes/InviteButton'
import ImpersonateButton from '@/components/astronautes/ImpersonateButton'
import ContributionActions from '@/components/contributions/ContributionActions'
import TropheeActions from '@/components/trophees/TropheeActions'
import { GRADE_LEVELS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

function GradeProgress({ totalPoints }) {
  const sorted = [...GRADE_LEVELS].sort((a, b) => a.min_points - b.min_points)
  const currentIdx = sorted.findLastIndex(g => g.min_points <= totalPoints)
  const current = sorted[currentIdx]
  const next = sorted[currentIdx + 1] ?? null

  const pct = next
    ? Math.min(100, Math.round(((totalPoints - current.min_points) / (next.min_points - current.min_points)) * 100))
    : 100

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-on-surface)' }}>
          {current.icon} {current.name}
        </span>
        {next ? (
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)' }}>
            {next.min_points - totalPoints} pts → {next.icon} {next.name}
          </span>
        ) : (
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)' }}>
            Grade maximum atteint
          </span>
        )}
      </div>
      <div style={{ height: '6px', borderRadius: '999px', background: 'var(--color-surface-container-highest)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: '999px',
          background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-container))',
          transition: 'width 0.3s ease',
        }} />
      </div>
      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', marginTop: '0.3rem', textAlign: 'right' }}>
        {pct}%
      </p>
    </div>
  )
}

export default async function AstronauteDetailPage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: astronaute }, { data: { user } }] = await Promise.all([
    supabase
      .from('astronauts')
      .select('*, planets(id, name, color), grades(name, icon, color)')
      .eq('id', id)
      .single(),

    supabase.auth.getUser(),
  ])

  if (!astronaute) notFound()

  const [{ data: profile }, { data: contributions }, { data: trophies }] = await Promise.all([
    user
      ? supabase.from('profiles').select('role').eq('id', user.id).single()
      : Promise.resolve({ data: null }),
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

  const isAdmin = profile?.role === 'admin'

  return (
    <div className="max-w-3xl">

      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/astronautes"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', fontFamily: 'var(--font-label)', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
          Retour aux astronautes
        </Link>
        {isAdmin && (
          <div className="flex items-center gap-2 flex-wrap">
            <ImpersonateButton
              astronauteId={id}
              name={`${astronaute.first_name} ${astronaute.last_name}`}
              hasAccount={!!astronaute.user_id}
            />
            <InviteButton
              astronauteId={id}
              email={astronaute.email}
              hasAccount={!!astronaute.user_id}
            />
            <Link href={`/astronautes/${id}/edit`} className="btn-ghost"
                  style={{ padding: '0.4rem 0.9rem', fontSize: '0.72rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>edit</span>
              Modifier
            </Link>
            <AstronauteActions astronaute={astronaute} />
          </div>
        )}
      </div>

      {/* Hero */}
      <div className="rounded-xl p-6 mb-6"
           style={{
             background: 'var(--color-surface-container)',
             borderTop: `2px solid ${astronaute.planets?.color ?? 'var(--color-primary)'}`,
             opacity: astronaute.active ? 1 : 0.75,
           }}>

        <div className="flex items-start gap-5 mb-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
               style={{ background: astronaute.planets?.color ? `${astronaute.planets.color}30` : 'var(--color-surface-container-highest)' }}>
            <span style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 800, color: astronaute.planets?.color ?? 'var(--color-on-surface-variant)' }}>
              {astronaute.first_name[0]}{astronaute.last_name[0]}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {astronaute.planets && (
                <span className="badge" style={{ background: `${astronaute.planets.color}20`, color: astronaute.planets.color }}>
                  {astronaute.planets.name}
                </span>
              )}
              {!astronaute.active && (
                <span className="badge" style={{ background: 'var(--color-surface-container-highest)', color: 'var(--color-on-surface-variant)' }}>Inactif</span>
              )}
            </div>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.1 }}>
              {astronaute.first_name} {astronaute.last_name}
            </h1>
            {astronaute.role_title && (
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                {astronaute.role_title}
              </p>
            )}
            {astronaute.arrival_date && (
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', marginTop: '0.3rem' }}>
                Arrivée · {new Date(astronaute.arrival_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
              </p>
            )}
          </div>

          <div className="text-right flex-shrink-0">
            <p style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1 }}>
              {astronaute.total_points.toLocaleString('fr-FR')}
            </p>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Points totaux
            </p>
          </div>
        </div>

        <div className="pt-4" style={{ borderTop: '1px solid rgb(255 255 255 / 0.05)' }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>
            Progression du grade
          </p>
          <GradeProgress totalPoints={astronaute.total_points} />
        </div>
      </div>

      {/* Trophées */}
      {(trophies?.length > 0 || isAdmin) && (
        <div className="rounded-xl p-5 mb-4" style={{ background: 'var(--color-surface-container)' }}>
          <div className="flex items-center justify-between mb-4">
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Trophées ({trophies?.length ?? 0})
            </p>
            {isAdmin && (
              <Link href={`/trophees/new?astronaut=${id}`} className="btn-ghost"
                    style={{ padding: '0.3rem 0.7rem', fontSize: '0.7rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>add</span>
                Attribuer
              </Link>
            )}
          </div>
          {!trophies?.length ? (
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.85rem', padding: '0.5rem 0' }}>
              Aucun trophée attribué.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {trophies.map(t => (
                <div key={t.id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 0.75rem', borderRadius: '0.75rem',
                  background: 'var(--color-surface-container-highest)',
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{t.trophy_types?.icon}</span>
                  <div>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                      {t.trophy_types?.name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)' }}>
                      {new Date(t.awarded_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  {isAdmin && <TropheeActions id={t.id} redirectTo={`/astronautes/${id}`} />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contributions */}
      <div className="rounded-xl p-5" style={{ background: 'var(--color-surface-container)' }}>
        <div className="flex items-center justify-between mb-4">
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Contributions ({contributions?.length ?? 0})
          </p>
          {isAdmin && (
            <Link href={`/contributions/new?astronaut=${id}`} className="btn-ghost"
                  style={{ padding: '0.3rem 0.7rem', fontSize: '0.7rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>add</span>
              Ajouter
            </Link>
          )}
        </div>

        {!contributions?.length ? (
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.85rem', padding: '0.5rem 0' }}>
            Aucune contribution enregistrée.
          </p>
        ) : (
          <div className="space-y-2">
            {contributions.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.6rem', background: 'var(--color-surface-container-highest)' }}>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                    {c.contribution_types?.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)' }}>
                    {new Date(c.date).toLocaleDateString('fr-FR')}
                    {c.is_first_ever && ' · ×2 première'}
                    {c.is_first_season && ' · +25 saison'}
                  </p>
                </div>
                <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.9rem', fontWeight: 800, color: astronaute.planets?.color ?? 'var(--color-primary)' }}>
                  +{c.points_awarded}
                </span>
                {isAdmin && <ContributionActions id={c.id} redirectTo={`/astronautes/${id}`} />}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
