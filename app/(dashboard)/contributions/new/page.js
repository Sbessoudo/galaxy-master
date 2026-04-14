import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ContributionForm from '@/components/contributions/ContributionForm'

export const dynamic = 'force-dynamic'

export default async function NouvelleContributionPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }

  if (profile?.role !== 'admin') redirect('/contributions')

  const params = await searchParams
  const defaultAstronautId = params?.astronaut ?? null

  const [{ data: astronautes }, { data: types }] = await Promise.all([
    supabase.from('astronauts').select('id, first_name, last_name, planets(name)').eq('active', true).order('last_name'),
    supabase.from('contribution_types').select('id, name, base_points, category').eq('active', true).order('name'),
  ])

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/contributions"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', fontFamily: 'var(--font-label)', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
          Contributions
        </Link>
        <span style={{ color: 'var(--color-on-surface-variant)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
          Enregistrer une contribution
        </h1>
      </div>
      <div className="rounded-xl p-6" style={{ background: 'var(--color-surface-container)' }}>
        <ContributionForm
          astronautes={astronautes ?? []}
          types={types ?? []}
          defaultAstronautId={defaultAstronautId}
        />
      </div>
    </div>
  )
}
