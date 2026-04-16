import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ParticipationPanel from '@/components/engagements/ParticipationPanel'

export const dynamic = 'force-dynamic'

export default async function EngagementDetailPage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: event }, { data: { user } }] = await Promise.all([
    supabase
      .from('events')
      .select('*, event_types(name)')
      .eq('id', id)
      .single(),
    supabase.auth.getUser(),
  ])

  if (!event) notFound()

  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }
  const isAdmin = profile?.role === 'admin'

  const [{ data: astronautes }, { data: participants }] = await Promise.all([
    supabase
      .from('astronauts')
      .select('id, first_name, last_name, photo_url, planet_id, planets(id, name, color)')
      .eq('active', true)
      .order('last_name'),
    supabase
      .from('event_participants')
      .select('astronaut_id, points_awarded')
      .eq('event_id', id),
  ])

  const presentIds    = (participants ?? []).map(p => p.astronaut_id)
  const initialPoints = Object.fromEntries(
    (participants ?? []).map(p => [p.astronaut_id, p.points_awarded ?? 0])
  )

  return (
    <div className="max-w-2xl mx-auto">

      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/engagements"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', fontFamily: 'var(--font-label)', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
          Events
        </Link>
        {isAdmin && (
          <Link href={`/engagements/${id}/edit`} className="btn-ghost"
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.72rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>edit</span>
            Modifier
          </Link>
        )}
      </div>

      {/* Hero */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--color-surface-container)' }}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-center w-14 rounded-xl py-2" style={{ background: 'var(--color-primary)15' }}>
            <p style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
              {new Date(event.date).getDate()}
            </p>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {new Date(event.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div>
            {event.event_types && (
              <span className="badge" style={{ marginBottom: '0.3rem', display: 'inline-block' }}>
                {event.event_types.name}
              </span>
            )}
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.1 }}>
              {event.name}
            </h1>
            {event.description && (
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {event.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Participation */}
      <div className="rounded-xl p-5" style={{ background: 'var(--color-surface-container)' }}>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          {isAdmin ? 'Gestion des présences' : 'Présences'}
        </p>
        <ParticipationPanel
          eventId={id}
          astronautes={astronautes ?? []}
          presentIds={presentIds}
          isAdmin={isAdmin}
          initialPoints={initialPoints}
        />
      </div>

    </div>
  )
}
