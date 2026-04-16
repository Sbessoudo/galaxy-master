'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/lib/toast'

export default function EngagementActions({ id, name }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function del() {
    if (!confirm(`Supprimer l'event "${name}" ?`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/engagements/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        toast.error(d.error ?? 'Erreur lors de la suppression.')
      } else {
        toast.success(`Event « ${name} » supprimé.`)
        router.refresh()
      }
    } catch {
      toast.error('Erreur réseau. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={del} disabled={loading}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.3rem', borderRadius: '0.5rem', color: 'var(--color-on-surface-variant)', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-on-surface-variant)'}>
      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>delete</span>
    </button>
  )
}
