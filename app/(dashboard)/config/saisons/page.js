import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import SaisonActions from './SaisonActions'

export const dynamic = 'force-dynamic'

export default async function SaisonsPage() {
  const supabase = await createClient()
  const { data: saisons } = await supabase
    .from('seasons')
    .select('*')
    .order('start_date', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p style={{
            fontFamily: 'var(--font-label)',
            fontSize: '0.6rem',
            color: 'var(--color-tertiary)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}>
            Configuration
          </p>
          <h1 style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--color-on-surface)',
            lineHeight: 1.1,
          }}>
            Saisons
          </h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem', marginTop: '0.4rem' }}>
            Une seule saison active à la fois. Les points planètes se réinitialisent à chaque activation.
          </p>
        </div>
        <Link href="/config/saisons/new" className="btn-primary">
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
          Nouvelle saison
        </Link>
      </div>

      {/* List */}
      {!saisons?.length ? (
        <div className="rounded-xl p-12 text-center card"
             style={{ background: 'var(--color-surface-container)' }}>
          <span className="material-symbols-outlined mb-3" style={{ color: 'var(--color-tertiary)', fontSize: '2.5rem', display: 'block' }}>
            calendar_month
          </span>
          <p style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Aucune saison configurée
          </p>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>
            Crée ta première saison pour commencer à enregistrer des contributions.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {saisons.map((saison) => (
            <SaisonRow key={saison.id} saison={saison} />
          ))}
        </div>
      )}
    </div>
  )
}

function SaisonRow({ saison }) {
  const start = new Date(saison.start_date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
  const end = new Date(saison.end_date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })

  return (
    <div className="rounded-xl p-5 flex items-center gap-5"
         style={{
           background: 'var(--color-surface-container)',
           borderTop: saison.active ? '2px solid var(--color-tertiary)' : '2px solid transparent',
         }}>

      {/* Icon */}
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
           style={{ background: saison.active ? 'rgb(255 177 72 / 0.12)' : 'var(--color-surface-container-highest)' }}>
        <span className="material-symbols-outlined"
              style={{ color: saison.active ? 'var(--color-tertiary)' : 'var(--color-on-surface-variant)', fontSize: '1.1rem' }}>
          calendar_month
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--color-on-surface)', fontSize: '0.95rem' }}>
            {saison.name}
          </p>
          {saison.active && <span className="badge badge-tertiary">Active</span>}
        </div>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.7rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.05em' }}>
          {start} → {end}
        </p>
      </div>

      {/* Actions */}
      <SaisonActions saison={saison} />
    </div>
  )
}
