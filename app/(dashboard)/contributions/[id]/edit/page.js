import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import ContributionForm from '@/components/contributions/ContributionForm'

export const dynamic = 'force-dynamic'

export default async function EditContributionPage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }

  if (profile?.role !== 'admin') redirect('/contributions')

  const [{ data: contribution }, { data: types }] = await Promise.all([
    supabase.from('contributions').select('*, astronauts(id, first_name, last_name)').eq('id', id).single(),
    supabase.from('contribution_types').select('id, name, base_points, category').eq('active', true).order('name'),
  ])

  if (!contribution) notFound()

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/contributions"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', fontFamily: 'var(--font-label)', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
          Contributions
        </Link>
        <span style={{ color: 'var(--color-on-surface-variant)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
          Modifier
        </h1>
      </div>

      {/* Context info */}
      <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--color-surface-container)', borderLeft: '3px solid var(--color-primary)' }}>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', color: 'var(--color-on-surface-variant)' }}>
          {contribution.astronauts?.first_name} {contribution.astronauts?.last_name} · {contribution.points_awarded} pts
          {contribution.is_first_ever && ' · ×2 (1ère contrib.)'}
          {contribution.is_first_season && ' · +25 (1ère saison)'}
        </p>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', marginTop: '0.2rem' }}>
          Seuls la date, le lieu, la durée et les notes sont modifiables.
        </p>
      </div>

      <div className="rounded-xl p-6" style={{ background: 'var(--color-surface-container)' }}>
        <ContributionForm contribution={contribution} astronautes={[]} types={types ?? []} />
      </div>
    </div>
  )
}
