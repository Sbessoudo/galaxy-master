import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import PlanetWheel      from '@/components/affectation/PlanetWheel'

export const dynamic = 'force-dynamic'

export default async function AffectationPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  const isAdmin = profile?.role === 'admin'

  // Only main planets are targets; only newcomers (astéroïde) are selectable
  const [{ data: planets }, { data: asteroide }] = await Promise.all([
    supabase
      .from('planets')
      .select('id, name, description, color, photo_url, type')
      .eq('active', true)
      .eq('type', 'main')
      .order('sort_order', { ascending: true }),
    supabase
      .from('planets')
      .select('id')
      .eq('type', 'newcomers')
      .eq('active', true)
      .single(),
  ])

  // Astronauts selectable = those on the newcomers planet only
  const { data: astronauts } = asteroide
    ? await supabase
        .from('astronauts')
        .select('id, first_name, last_name, photo_url, planet_id, planets(name, color)')
        .eq('active', true)
        .eq('planet_id', asteroide.id)
        .order('last_name')
    : { data: [] }

  if (!planets?.length) {
    return (
      <div className="max-w-lg mx-auto text-center py-24">
        <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--color-on-surface-variant)', display: 'block', marginBottom: '1rem' }}>public_off</span>
        <p style={{ fontFamily: 'var(--font-label)', color: 'var(--color-on-surface-variant)' }}>
          Aucune planète principale active. Créez des planètes de type « Principale » d&apos;abord.
        </p>
      </div>
    )
  }

  if (!asteroide) {
    return (
      <div className="max-w-lg mx-auto text-center py-24">
        <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--color-on-surface-variant)', display: 'block', marginBottom: '1rem' }}>emergency_home</span>
        <p style={{ fontFamily: 'var(--font-label)', color: 'var(--color-on-surface-variant)' }}>
          Aucune planète de type « Recrues » (astéroïde) configurée.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PlanetWheel
        planets={planets ?? []}
        astronauts={astronauts ?? []}
        isAdmin={isAdmin}
        asteroideId={asteroide.id}
      />
    </div>
  )
}
