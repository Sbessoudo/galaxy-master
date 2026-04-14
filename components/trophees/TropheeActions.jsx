'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/lib/toast'

export default function TropheeActions({ id, redirectTo }) {
  const router  = useRouter()
  const [busy, setBusy] = useState(false)

  async function handleDelete() {
    if (!confirm('Supprimer ce trophée ?')) return
    setBusy(true)

    const res = await fetch(`/api/trophees/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      toast.error(d.error ?? 'Erreur lors de la suppression.')
      setBusy(false)
      return
    }

    toast.success('Trophée supprimé.')
    if (redirectTo) router.push(redirectTo)
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
