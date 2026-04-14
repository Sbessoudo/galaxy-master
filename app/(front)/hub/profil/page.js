import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfilForm from '@/components/hub/ProfilForm'
import { GRADE_LEVELS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function HubProfilPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('email, full_name, role').eq('id', user.id).single()

  const previewId = (await searchParams)?.preview ?? null
  const isPreview = previewId && (profile?.role === 'admin' || profile?.role === 'observer')

  const { data: astronaut } = await supabase
    .from('astronauts')
    .select('*, planets(name, color), grades(name, icon, color)')
    .eq(isPreview ? 'id' : 'user_id', isPreview ? previewId : user.id)
    .maybeSingle()

  // Grade progress
  const totalPoints = astronaut?.total_points ?? 0
  const sorted = [...GRADE_LEVELS].sort((a, b) => a.min_points - b.min_points)
  const currentIdx = sorted.findLastIndex(g => g.min_points <= totalPoints)
  const current = sorted[currentIdx]
  const next = sorted[currentIdx + 1] ?? null
  const pct = next
    ? Math.min(100, Math.round(((totalPoints - current.min_points) / (next.min_points - current.min_points)) * 100))
    : 100

  const color = astronaut?.planets?.color ?? 'var(--color-primary)'

  return (
    <div className="px-6 py-10 max-w-2xl mx-auto">

      <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-on-surface)', marginBottom: '2rem', lineHeight: 1 }}>
        Mon Profil
      </h1>

      {/* Stats card */}
      {astronaut && (
        <div className="rounded-2xl p-6 mb-8 flex items-center gap-6"
             style={{
               background: 'var(--color-surface-container)',
               borderTop: `2px solid ${color}`,
               boxShadow: `0 8px 48px -8px ${color}20`,
             }}>

          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0"
               style={{ background: `${color}20` }}>
            {astronaut.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={astronaut.photo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 900, color }}>
                {astronaut.first_name[0]}{astronaut.last_name[0]}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {astronaut.planets && (
                <span className="badge" style={{ background: `${color}20`, color }}>
                  {astronaut.planets.name}
                </span>
              )}
              {astronaut.grades && (
                <span className="badge" style={{ background: 'var(--color-surface-container-highest)', color: 'var(--color-on-surface)' }}>
                  {astronaut.grades.icon} {astronaut.grades.name}
                </span>
              )}
            </div>
            <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.1 }}>
              {astronaut.first_name} {astronaut.last_name}
            </h2>
            {astronaut.role_title && (
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                {astronaut.role_title}
              </p>
            )}
          </div>

          {/* Points */}
          <div className="text-right flex-shrink-0">
            <p style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 900, color, lineHeight: 1 }}>
              {totalPoints.toLocaleString('fr-FR')}
            </p>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              points totaux
            </p>
          </div>
        </div>
      )}

      {/* Grade progress */}
      {astronaut && (
        <div className="rounded-2xl p-5 mb-8" style={{ background: 'var(--color-surface-container)' }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Progression du grade
          </p>
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-on-surface)' }}>
              {current?.icon} {current?.name}
            </span>
            {next ? (
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.7rem', color: 'var(--color-on-surface-variant)' }}>
                {(next.min_points - totalPoints).toLocaleString('fr-FR')} pts → {next.icon} {next.name}
              </span>
            ) : (
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.7rem', color: 'var(--color-on-surface-variant)' }}>
                Grade maximum 🎖️
              </span>
            )}
          </div>
          <div style={{ height: '10px', borderRadius: '999px', background: 'var(--color-surface-container-highest)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`, borderRadius: '999px',
              background: `linear-gradient(90deg, ${color}, ${color}80)`,
              boxShadow: `0 0 8px ${color}`,
              transition: 'width 0.8s ease',
            }} />
          </div>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', marginTop: '0.4rem', textAlign: 'right' }}>
            {pct}%
          </p>
        </div>
      )}

      {/* Edit form */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--color-surface-container)' }}>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
          Modifier mes informations
        </p>

        {astronaut ? (
          <ProfilForm astronaut={astronaut} />
        ) : (
          <div className="text-center py-6">
            <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--color-on-surface-variant)', display: 'block', marginBottom: '0.5rem' }}>
              link_off
            </span>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.85rem' }}>
              Ton compte n&apos;est pas encore lié à un astronaute.
            </p>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
              Connecté avec : {profile?.email}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
