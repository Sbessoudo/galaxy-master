import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import TropheeTypeActions from '@/components/trophees/TropheeTypeActions'

const SCOPE_LABEL = { individual: '👤 Individuel', planet: '🌍 Planète', both: '↕ Les deux' }
function ScopeBadge({ scope }) {
  if (!scope || scope === 'both') return null
  return (
    <span style={{
      fontSize: '0.58rem', fontFamily: 'var(--font-label)', fontWeight: 600,
      padding: '0.1rem 0.4rem', borderRadius: '0.25rem',
      background: scope === 'planet' ? 'rgb(255 177 72 / 0.15)' : 'rgb(172 199 255 / 0.15)',
      color: scope === 'planet' ? 'var(--color-tertiary)' : 'var(--color-primary)',
      letterSpacing: '0.05em',
    }}>
      {SCOPE_LABEL[scope]}
    </span>
  )
}

export const dynamic = 'force-dynamic'

export default async function ConfigTropheesPage() {
  const supabase = await createClient()

  const { data: types } = await supabase
    .from('trophy_types')
    .select('*')
    .order('name')

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
            Configuration
          </p>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.1 }}>
            Types de trophée
          </h1>
        </div>
        <Link href="/config/trophees/new" className="btn-primary">
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
          Nouveau type
        </Link>
      </div>

      {!types?.length ? (
        <div className="rounded-xl p-12 text-center" style={{ background: 'var(--color-surface-container)' }}>
          <span className="material-symbols-outlined mb-3" style={{ color: 'var(--color-secondary)', fontSize: '2.5rem', display: 'block' }}>emoji_events</span>
          <p style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', fontWeight: 700 }}>
            Aucun type de trophée
          </p>
          <Link href="/config/trophees/new" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
            Créer le premier
          </Link>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-surface-container)' }}>
          {types.map((t, i) => (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
              borderBottom: i < types.length - 1 ? '1px solid rgb(255 255 255 / 0.04)' : 'none',
              opacity: t.active ? 1 : 0.45,
            }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: 'var(--color-surface-container-highest)', fontSize: '1.4rem' }}>
                {t.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                    {t.name}
                  </p>
                  <ScopeBadge scope={t.scope} />
                  {!t.active && <span style={{ fontSize: '0.6rem', color: 'var(--color-on-surface-variant)' }}>· inactif</span>}
                </div>
                {t.description && (
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)' }}>
                    {t.description}
                  </p>
                )}
              </div>
              <Link href={`/config/trophees/${t.id}`} className="btn-ghost"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>edit</span>
              </Link>
              <TropheeTypeActions id={t.id} name={t.name} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
