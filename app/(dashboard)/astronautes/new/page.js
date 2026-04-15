import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AstronauteForm from '@/components/astronautes/AstronauteForm'

export const dynamic = 'force-dynamic'

export default async function NouvelAstronautePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }

  if (profile?.role !== 'admin') redirect('/astronautes')

  const { data: planetes } = await supabase
    .from('planets').select('id, name, color').eq('active', true).order('sort_order')

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/astronautes"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', fontFamily: 'var(--font-label)', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
          Astronautes
        </Link>
        <span style={{ color: 'var(--color-on-surface-variant)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
          Nouvel astronaute
        </h1>
      </div>
      <div className="rounded-xl p-6" style={{ background: 'var(--color-surface-container)' }}>
        <AstronauteForm planetes={planetes ?? []} />
      </div>
    </div>
  )
}
