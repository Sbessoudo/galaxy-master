import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import PlaneteActions from './PlaneteActions'

export const dynamic = 'force-dynamic'

const TYPE_LABEL = { main: 'Principale', newcomers: 'Recrues', arbiters: 'Arbitres' }
const TYPE_BADGE = { main: 'badge-secondary', newcomers: 'badge-tertiary', arbiters: 'badge-primary' }

export default async function ConfigPlanetesPage() {
  const supabase = await createClient()
  const { data: planetes } = await supabase
    .from('planets')
    .select('*, astronauts(count)')
    .order('sort_order', { ascending: true })

  const total = planetes?.length ?? 0
  const main = planetes?.filter(p => p.type === 'main').length ?? 0
  const newcomers = planetes?.filter(p => p.type === 'newcomers').length ?? 0
  const arbiters = planetes?.filter(p => p.type === 'arbiters').length ?? 0

  const descParts = []
  if (main > 0) descParts.push(`${main} en compétition`)
  if (newcomers > 0) descParts.push(`${newcomers} recrues`)
  if (arbiters > 0) descParts.push(`${arbiters} arbitres`)
  const desc = total === 0
    ? 'Aucune planète configurée.'
    : `${total} planète${total > 1 ? 's' : ''} au total${descParts.length ? ' — ' + descParts.join(', ') : ''}.`

  return (
    <div className="max-w-3xl">

      <div className="flex items-start justify-between mb-8">
        <div>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
            Configuration
          </p>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.1 }}>
            Planètes
          </h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem', marginTop: '0.4rem' }}>
            {desc}
          </p>
        </div>
        <Link href="/config/planetes/new" className="btn-primary">
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
          Nouvelle planète
        </Link>
      </div>

      {!planetes?.length ? (
        <div className="rounded-xl p-12 text-center"
             style={{ background: 'var(--color-surface-container)' }}>
          <span className="material-symbols-outlined mb-3" style={{ color: 'var(--color-secondary)', fontSize: '2.5rem', display: 'block' }}>public</span>
          <p style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Aucune planète configurée
          </p>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>
            Crée les 6 planètes pour commencer.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {planetes.map((planete) => (
            <div key={planete.id}
                 className="rounded-xl p-5 flex items-center gap-4"
                 style={{
                   background: 'var(--color-surface-container)',
                   opacity: planete.active ? 1 : 0.55,
                 }}>

              {/* Avatar */}
              <div className="relative w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                   style={{ background: planete.color, boxShadow: `0 0 20px -5px ${planete.color}80` }}>
                {planete.photo_url
                  ? <Image src={planete.photo_url} alt={planete.name} fill className="object-cover" unoptimized />
                  : <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '1.1rem', opacity: 0.9 }}>public</span>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--color-on-surface)', fontSize: '0.95rem' }}>
                    {planete.name}
                  </p>
                  <span className={`badge ${TYPE_BADGE[planete.type] || 'badge-secondary'}`}>
                    {TYPE_LABEL[planete.type] || planete.type}
                  </span>
                  {!planete.active && <span className="badge" style={{ background: 'var(--color-surface-container-highest)', color: 'var(--color-on-surface-variant)' }}>Inactive</span>}
                </div>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.7rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.05em' }}>
                  {planete.astronauts?.[0]?.count ?? 0} astronaute{planete.astronauts?.[0]?.count !== 1 ? 's' : ''}
                  {planete.description && ` · ${planete.description}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/config/planetes/${planete.id}`}
                      className="btn-ghost"
                      style={{ padding: '0.35rem 0.8rem', fontSize: '0.72rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>edit</span>
                  Éditer
                </Link>
                <PlaneteActions planete={planete} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
