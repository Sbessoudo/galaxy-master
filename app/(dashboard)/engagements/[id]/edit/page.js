import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import EngagementForm from '@/components/engagements/EngagementForm'

export const dynamic = 'force-dynamic'

export default async function EditEngagementPage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }

  if (profile?.role !== 'admin') redirect(`/engagements/${id}`)

  const [{ data: event }, { data: eventTypes }] = await Promise.all([
    supabase.from('events').select('*').eq('id', id).single(),
    supabase.from('event_types').select('id, name').eq('active', true).order('name'),
  ])

  if (!event) notFound()

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href={`/engagements/${id}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', fontFamily: 'var(--font-label)', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
          {event.name}
        </Link>
        <span style={{ color: 'var(--color-on-surface-variant)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
          Modifier
        </h1>
      </div>
      <div className="rounded-xl p-6" style={{ background: 'var(--color-surface-container)' }}>
        <EngagementForm event={event} eventTypes={eventTypes ?? []} />
      </div>
    </div>
  )
}
