import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import BonusPointsSection from '@/components/planetes/BonusPointsSection'
import TropheeActions from '@/components/trophees/TropheeActions'

export const dynamic = 'force-dynamic'

const TYPE_LABEL = { main: 'Principale', newcomers: 'Recrues', arbiters: 'Arbitres' }

export default async function PlaneteDetailPage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: planete },
    { data: activeSeason },
    { data: { user } },
  ] = await Promise.all([
    supabase.from('planets').select('*').eq('id', id).single(),
    supabase.from('seasons').select('id, name').eq('active', true).single(),
    supabase.auth.getUser(),
  ])

  if (!planete) notFound()

  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }
  const isAdmin = profile?.role === 'admin'

  const { data: astronauts } = await supabase
    .from('astronauts')
    .select('id, first_name, last_name, role_title, total_points, grades(name, icon)')
    .eq('planet_id', id)
    .eq('active', true)
    .order('total_points', { ascending: false })

  let seasonPts = 0
  let bonusPoints = []
  if (activeSeason) {
    const [{ data: sp }, { data: bp }] = await Promise.all([
      supabase
        .from('planet_season_points')
        .select('total_points')
        .eq('planet_id', id)
        .eq('season_id', activeSeason.id)
        .single(),
      supabase
        .from('bonus_points')
        .select('id, label, points, date')
        .eq('planet_id', id)
        .eq('season_id', activeSeason.id)
        .order('date', { ascending: false }),
    ])
    seasonPts = sp?.total_points ?? 0
    bonusPoints = bp ?? []
  }

  const { data: trophies } = await supabase
    .from('trophies')
    .select('id, awarded_at, notes, trophy_types(name, icon)')
    .eq('planet_id', id)
    .order('awarded_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto">

      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/planetes"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', fontFamily: 'var(--font-label)', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
          Retour aux planètes
        </Link>
        {isAdmin && (
          <Link href={`/config/planetes/${planete.id}`} className="btn-ghost"
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.72rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>edit</span>
            Modifier
          </Link>
        )}
      </div>

      {/* Hero */}
      <div className="rounded-xl p-6 mb-6 flex items-center gap-6"
           style={{ background: 'var(--color-surface-container)', borderTop: `2px solid ${planete.color}`, boxShadow: `0 4px 40px -8px ${planete.color}30` }}>

        <div className="relative w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden"
             style={{ background: planete.photo_url ? 'transparent' : planete.color, boxShadow: `0 0 24px -4px ${planete.color}` }}>
          {planete.photo_url
            ? <Image src={planete.photo_url} alt={planete.name} fill className="object-cover" unoptimized />
            : <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '2.5rem', opacity: 0.9 }}>public</span>
          }
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge" style={{ background: `${planete.color}20`, color: planete.color }}>
              {TYPE_LABEL[planete.type]}
            </span>
            {!planete.active && (
              <span className="badge" style={{ background: 'var(--color-surface-container-highest)', color: 'var(--color-on-surface-variant)' }}>Inactive</span>
            )}
          </div>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.1 }}>
            {planete.name}
          </h1>
          {planete.description && (
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {planete.description}
            </p>
          )}
          {planete.mantra && (
            <p style={{
              fontFamily: 'var(--font-headline)', fontSize: '0.85rem', fontStyle: 'italic',
              color: planete.color, marginTop: '0.5rem', lineHeight: 1.4,
            }}>
              &ldquo;{planete.mantra}&rdquo;
            </p>
          )}
        </div>

        <div className="flex gap-6 flex-shrink-0">
          <div className="text-center">
            <p style={{ fontFamily: 'var(--font-headline)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
              {astronauts?.length ?? 0}
            </p>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Membres</p>
          </div>
          {activeSeason && (
            <div className="text-center">
              <p style={{ fontFamily: 'var(--font-headline)', fontSize: '1.8rem', fontWeight: 800, color: planete.color }}>
                {seasonPts.toLocaleString('fr-FR')}
              </p>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pts saison</p>
            </div>
          )}
        </div>
      </div>

      {/* Members */}
      <div className="rounded-xl p-5" style={{ background: 'var(--color-surface-container)' }}>
        <div className="flex items-center justify-between mb-4">
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Astronautes ({astronauts?.length ?? 0})
          </p>
          {isAdmin && (
            <Link href="/astronautes/new" className="btn-ghost" style={{ padding: '0.3rem 0.7rem', fontSize: '0.7rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>person_add</span>
              Ajouter
            </Link>
          )}
        </div>

        {!astronauts?.length ? (
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.85rem', padding: '1rem 0' }}>
            Aucun astronaute dans cette planète.
          </p>
        ) : (
          <div className="space-y-2">
            {astronauts.map((a, i) => (
              <Link key={a.id} href={`/astronautes/${a.id}`}
                    className="planet-card"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--color-surface-container-highest)', textDecoration: 'none' }}>
                <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.75rem', fontWeight: 800, color: i < 3 ? planete.color : 'var(--color-on-surface-variant)', width: '1rem', textAlign: 'center', flexShrink: 0 }}>
                  {i + 1}
                </span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                     style={{ background: planete.color + '30' }}>
                  <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.75rem', fontWeight: 700, color: planete.color }}>
                    {a.first_name[0]}{a.last_name[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                    {a.first_name} {a.last_name}
                  </p>
                  {a.role_title && (
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)' }}>{a.role_title}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p style={{ fontFamily: 'var(--font-headline)', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
                    {a.total_points.toLocaleString('fr-FR')} pts
                  </p>
                  {a.grades && (
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)' }}>
                      {a.grades.icon} {a.grades.name}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Trophées */}
      {(trophies?.length > 0 || isAdmin) && (
        <div className="rounded-xl p-5 mt-4" style={{ background: 'var(--color-surface-container)' }}>
          <div className="flex items-center justify-between mb-4">
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Trophées ({trophies?.length ?? 0})
            </p>
            {isAdmin && (
              <Link href={`/trophees/new?planet=${id}`} className="btn-ghost"
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
                  {isAdmin && <TropheeActions id={t.id} redirectTo={`/planetes/${id}`} />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bonus Points */}
      <div className="mt-4">
        <BonusPointsSection
          planetId={planete.id}
          seasonId={activeSeason?.id ?? null}
          bonusPoints={bonusPoints}
          planetColor={planete.color}
          isAdmin={isAdmin}
        />
      </div>

    </div>
  )
}
