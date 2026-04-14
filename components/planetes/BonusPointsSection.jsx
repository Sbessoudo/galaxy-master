'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const CHALLENGE_PRESETS = [
  { label: '1er du challenge', points: 100 },
  { label: '2ème du challenge', points: 75 },
  { label: '3ème du challenge', points: 50 },
  { label: '4ème du challenge', points: 25 },
]

export default function BonusPointsSection({ planetId, seasonId, bonusPoints, planetColor, isAdmin }) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [custom, setCustom] = useState({ label: '', points: '' })
  const [error, setError] = useState(null)

  async function addBonus(label, points) {
    setError(null)
    setLoading(true)
    const res = await fetch(`/api/planetes/${planetId}/bonus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, points, season_id: seasonId }),
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error)
    } else {
      setShowForm(false)
      setCustom({ label: '', points: '' })
      router.refresh()
    }
    setLoading(false)
  }

  function submitCustom() {
    const pts = parseInt(custom.points)
    if (!custom.label.trim() || !pts || pts <= 0) {
      setError('Libellé et points requis')
      return
    }
    addBonus(custom.label.trim(), pts)
  }

  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--color-surface-container)' }}>

      <div className="flex items-center justify-between mb-4">
        <p style={{
          fontFamily: 'var(--font-label)', fontSize: '0.65rem',
          color: 'var(--color-on-surface-variant)', letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          Points bonus · saison ({bonusPoints.length})
        </p>
        {isAdmin && !showForm && (
          <button onClick={() => setShowForm(true)} className="btn-ghost"
                  style={{ padding: '0.3rem 0.7rem', fontSize: '0.7rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>add</span>
            Ajouter
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <div className="mb-4 p-4 rounded-lg" style={{ background: 'var(--color-surface-container-highest)' }}>

          <p style={{
            fontFamily: 'var(--font-label)', fontSize: '0.6rem',
            color: 'var(--color-on-surface-variant)', letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: '0.6rem',
          }}>
            Classement challenge
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {CHALLENGE_PRESETS.map(p => (
              <button key={p.label} onClick={() => addBonus(p.label, p.points)} disabled={loading}
                      style={{
                        padding: '0.4rem 0.9rem', borderRadius: '0.5rem',
                        background: `${planetColor}20`, color: planetColor,
                        fontFamily: 'var(--font-label)', fontSize: '0.72rem', fontWeight: 700,
                        border: `1px solid ${planetColor}40`, cursor: 'pointer',
                        opacity: loading ? 0.6 : 1,
                      }}>
                {p.label} · +{p.points}
              </button>
            ))}
          </div>

          <p style={{
            fontFamily: 'var(--font-label)', fontSize: '0.6rem',
            color: 'var(--color-on-surface-variant)', letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: '0.5rem',
          }}>
            Personnalisé
          </p>
          <div className="flex gap-2 flex-wrap">
            <input
              value={custom.label}
              onChange={e => setCustom(f => ({ ...f, label: e.target.value }))}
              placeholder="Libellé"
              style={{
                flex: 1, minWidth: '140px', padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                background: 'var(--color-surface-container)', border: '1px solid rgb(255 255 255 / 0.1)',
                color: 'var(--color-on-surface)', fontFamily: 'var(--font-body)', fontSize: '0.82rem',
                outline: 'none',
              }}
            />
            <input
              type="number" min="1"
              value={custom.points}
              onChange={e => setCustom(f => ({ ...f, points: e.target.value }))}
              placeholder="Pts"
              style={{
                width: '80px', padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                background: 'var(--color-surface-container)', border: '1px solid rgb(255 255 255 / 0.1)',
                color: 'var(--color-on-surface)', fontFamily: 'var(--font-body)', fontSize: '0.82rem',
                outline: 'none',
              }}
            />
            <button onClick={submitCustom} disabled={loading} className="btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.78rem' }}>
              Ajouter
            </button>
            <button onClick={() => { setShowForm(false); setCustom({ label: '', points: '' }); setError(null) }}
                    className="btn-ghost" style={{ padding: '0.5rem 0.75rem', fontSize: '0.78rem' }}>
              Annuler
            </button>
          </div>

          {error && (
            <p style={{ color: 'var(--color-error, #f87171)', fontSize: '0.75rem', marginTop: '0.5rem', fontFamily: 'var(--font-label)' }}>
              {error}
            </p>
          )}
        </div>
      )}

      {!bonusPoints.length ? (
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.85rem', padding: '0.5rem 0' }}>
          {seasonId ? 'Aucun bonus pour cette saison.' : 'Aucune saison active.'}
        </p>
      ) : (
        <div className="space-y-2">
          {bonusPoints.map(b => (
            <div key={b.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.6rem 0.75rem', borderRadius: '0.6rem',
              background: 'var(--color-surface-container-highest)',
            }}>
              <div>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                  {b.label}
                </p>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)' }}>
                  {new Date(b.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.95rem', fontWeight: 800, color: planetColor }}>
                +{b.points} pts
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
