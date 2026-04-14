'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/lib/toast'

export default function ContributionActions({ id, redirectTo = '/contributions' }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function del() {
    if (!confirm('Supprimer cette contribution ? Les points seront recalculés.')) return
    setLoading(true)

    const res = await fetch(`/api/contributions/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      toast.error(d.error ?? 'Erreur lors de la suppression.')
      setLoading(false)
      return
    }

    toast.success('Contribution supprimée. Points recalculés.')
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <button onClick={del} disabled={loading}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0.35rem', borderRadius: '0.5rem',
              color: 'var(--color-on-surface-variant)', transition: 'color 0.15s',
            }}
            title="Supprimer"
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-on-surface-variant)'}>
      <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>delete</span>
    </button>
  )
}
