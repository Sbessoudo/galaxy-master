'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/lib/toast'

export default function SaisonActions({ saison }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function activate() {
    if (!confirm(`Activer "${saison.name}" ? Les points planètes seront réinitialisés.`)) return
    setLoading(true)
    const res = await fetch(`/api/saisons/${saison.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: true }),
    })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      toast.error(d.error ?? 'Erreur lors de l\'activation.')
    } else {
      toast.success(`Saison « ${saison.name} » activée.`)
    }
    router.refresh()
    setLoading(false)
  }

  async function deleteSaison() {
    if (!confirm(`Supprimer "${saison.name}" ? Cette action est irréversible.`)) return
    setLoading(true)
    const res = await fetch(`/api/saisons/${saison.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      toast.error(d.error ?? 'Erreur lors de la suppression.')
    } else {
      toast.success(`Saison « ${saison.name} » supprimée.`)
    }
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {!saison.active && (
        <button onClick={activate} disabled={loading}
                className="btn-ghost"
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.72rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>
            play_circle
          </span>
          Activer
        </button>
      )}
      {!saison.active && (
        <button onClick={deleteSaison} disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.4rem',
                  borderRadius: '0.5rem',
                  color: 'var(--color-on-surface-variant)',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-on-surface-variant)'}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>delete</span>
        </button>
      )}
      {saison.active && (
        <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          En cours
        </span>
      )}
    </div>
  )
}
