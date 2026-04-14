import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import AstronauteForm from '@/components/astronautes/AstronauteForm'

export const dynamic = 'force-dynamic'

export default async function EditAstronautePage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }

  if (profile?.role !== 'admin') redirect(`/astronautes/${id}`)

  const [{ data: astronaute }, { data: planetes }] = await Promise.all([
    supabase.from('astronauts').select('*').eq('id', id).single(),
    supabase.from('planets').select('id, name, color').eq('active', true).order('sort_order'),
  ])

  if (!astronaute) notFound()

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href={`/astronautes/${id}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', fontFamily: 'var(--font-label)', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
          {astronaute.first_name} {astronaute.last_name}
        </Link>
        <span style={{ color: 'var(--color-on-surface-variant)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
          Modifier
        </h1>
      </div>
      <div className="rounded-xl p-6" style={{ background: 'var(--color-surface-container)' }}>
        <AstronauteForm astronaute={astronaute} planetes={planetes ?? []} />
      </div>
    </div>
  )
}
