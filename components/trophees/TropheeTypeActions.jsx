'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/lib/toast'

export default function TropheeTypeActions({ id, name }) {
  const router  = useRouter()
  const [busy, setBusy] = useState(false)

  async function handleDelete() {
    if (!confirm(`Supprimer le type « ${name} » ?\nImpossible s'il est utilisé par des trophées existants.`)) return
    setBusy(true)

    const res = await fetch(`/api/trophy-types/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      toast.error(data.error ?? 'Erreur lors de la suppression.')
      setBusy(false)
      return
    }

    toast.success(`Type de trophée « ${name} » supprimé.`)
    router.refresh()
  }

  return (
    <button onClick={handleDelete} disabled={busy}
            title="Supprimer"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '2rem', height: '2rem', borderRadius: '0.4rem', border: 'none',
              background: 'transparent', cursor: busy ? 'wait' : 'pointer',
              color: 'var(--color-error, #f87171)', flexShrink: 0,
            }}>
      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>delete</span>
    </button>
  )
}
