'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function PlaneteActions({ planete }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const canDelete = planete.type !== 'newcomers' && planete.type !== 'arbiters'

  async function toggleActive() {
    const action = planete.active ? 'désactiver' : 'réactiver'
    if (!confirm(`Voulez-vous ${action} "${planete.name}" ?`)) return
    setLoading(true)
    await fetch(`/api/planetes/${planete.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !planete.active }),
    })
    router.refresh()
    setLoading(false)
  }

  async function deletePlanete() {
    if (!confirm(`Supprimer définitivement "${planete.name}" ?`)) return
    setLoading(true)
    const res = await fetch(`/api/planetes/${planete.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      alert(data.error)
    }
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <button onClick={toggleActive} disabled={loading}
              className="btn-ghost"
              style={{ padding: '0.35rem 0.8rem', fontSize: '0.72rem' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>
          {planete.active ? 'visibility_off' : 'visibility'}
        </span>
        {planete.active ? 'Désactiver' : 'Réactiver'}
      </button>
      {canDelete && (
        <button onClick={deletePlanete} disabled={loading}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.35rem', borderRadius: '0.5rem', color: 'var(--color-on-surface-variant)', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-on-surface-variant)'}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>delete</span>
        </button>
      )}
    </div>
  )
}
