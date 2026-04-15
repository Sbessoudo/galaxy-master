import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PlaneteEditForm from '@/components/planetes/PlaneteEditForm'

export const dynamic = 'force-dynamic'

export default async function EditPlanetePage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: planete } = await supabase.from('planets').select('*').eq('id', id).single()
  if (!planete) notFound()

  return (
    <div className="max-w-lg mx-auto">
      <Link href="/config/planetes"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', fontFamily: 'var(--font-label)', marginBottom: '1.25rem', textDecoration: 'none' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
        Retour aux planètes
      </Link>

      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
        Configuration · Planètes
      </p>
      <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-on-surface)', marginBottom: '2rem' }}>
        Modifier · {planete.name}
      </h1>

      <PlaneteEditForm planete={planete} backHref="/config/planetes" />
    </div>
  )
}
