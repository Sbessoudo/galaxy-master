import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import EventTypeForm from '@/components/engagements/EventTypeForm'

export const dynamic = 'force-dynamic'

export default async function EditEventTypePage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: type } = await supabase
    .from('event_types')
    .select('*')
    .eq('id', id)
    .single()

  if (!type) notFound()

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/config/engagements"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', fontFamily: 'var(--font-label)', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
          Types d&apos;event
        </Link>
        <span style={{ color: 'var(--color-on-surface-variant)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
          {type.name}
        </h1>
      </div>
      <div className="rounded-xl p-6" style={{ background: 'var(--color-surface-container)' }}>
        <EventTypeForm type={type} />
      </div>
    </div>
  )
}
