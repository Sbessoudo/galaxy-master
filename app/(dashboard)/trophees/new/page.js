import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import TropheeForm from '@/components/trophees/TropheeForm'

export const dynamic = 'force-dynamic'

export default async function NouveauTropheePage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }

  if (profile?.role !== 'admin') redirect('/trophees')

  const params = await searchParams
  const defaultAstronautId = params?.astronaut ?? null
  const defaultPlanetId    = params?.planet    ?? null

  const [{ data: trophyTypes }, { data: astronautes }, { data: planetes }] = await Promise.all([
    supabase.from('trophy_types').select('id, name, icon, description').eq('active', true).order('name'),
    supabase.from('astronauts').select('id, first_name, last_name, planets(name)').eq('active', true).order('last_name'),
    supabase.from('planets').select('id, name').eq('active', true).order('sort_order'),
  ])

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/trophees"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', fontFamily: 'var(--font-label)', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
          Trophées
        </Link>
        <span style={{ color: 'var(--color-on-surface-variant)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
          Attribuer un trophée
        </h1>
      </div>
      <div className="rounded-xl p-6" style={{ background: 'var(--color-surface-container)' }}>
        <TropheeForm
          trophyTypes={trophyTypes ?? []}
          astronautes={astronautes ?? []}
          planetes={planetes ?? []}
          defaultAstronautId={defaultAstronautId}
          defaultPlanetId={defaultPlanetId}
        />
      </div>
    </div>
  )
}
