'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/lib/toast'

export default function ContributionTypeActions({ id, name }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function del() {
    if (!confirm(`Supprimer le type "${name}" ?`)) return
    setLoading(true)
    const res = await fetch(`/api/contribution-types/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      toast.error(data.error ?? 'Erreur lors de la suppression.')
    } else {
      toast.success(`Type « ${name} » supprimé.`)
    }
    router.refresh()
    setLoading(false)
  }

  return (
    <button onClick={del} disabled={loading}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0.3rem', borderRadius: '0.5rem', flexShrink: 0,
              color: 'var(--color-on-surface-variant)', transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-on-surface-variant)'}>
      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>delete</span>
    </button>
  )
}
