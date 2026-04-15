import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ContributionTypeActions from '@/components/contributions/ContributionTypeActions'

const SCOPE_LABEL = { individual: '👤 Individuel', planet: '🌍 Planète', both: '↕ Les deux' }
function ScopeBadge({ scope }) {
  if (!scope || scope === 'individual') return null
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

const CATEGORY_LABEL = {
  challenge: 'Challenge', bonus: 'Bonus', content: 'Contenu',
  community: 'Communauté', speaking: 'Prise de parole', teaching: 'Formation',
  project: 'Projet', general: 'Général',
}

export default async function ConfigContributionsPage() {
  const supabase = await createClient()

  const { data: types } = await supabase
    .from('contribution_types')
    .select('*')
    .order('category')
    .order('name')

  const grouped = (types ?? []).reduce((acc, t) => {
    const cat = t.category ?? 'general'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(t)
    return acc
  }, {})

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
            Configuration
          </p>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.1 }}>
            Types de contribution
          </h1>
        </div>
        <Link href="/config/contributions/new" className="btn-primary">
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
          Nouveau type
        </Link>
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="mb-6">
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '0.25rem' }}>
            {CATEGORY_LABEL[cat] ?? cat}
          </p>
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-surface-container)' }}>
            {items.map((t, i) => (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                borderBottom: i < items.length - 1 ? '1px solid rgb(255 255 255 / 0.04)' : 'none',
                opacity: t.active ? 1 : 0.45,
              }}>
                <div className="flex-1 min-w-0">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                      {t.name}
                    </p>
                    <ScopeBadge scope={t.scope} />
                    {!t.active && <span style={{ fontSize: '0.6rem', color: 'var(--color-on-surface-variant)' }}>· inactif</span>}
                  </div>
                  {t.description && (
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)' }}>{t.description}</p>
                  )}
                </div>
                <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)', flexShrink: 0 }}>
                  {t.base_points} pts
                </span>
                <Link href={`/config/contributions/${t.id}`} className="btn-ghost"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>edit</span>
                </Link>
                <ContributionTypeActions id={t.id} name={t.name} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
