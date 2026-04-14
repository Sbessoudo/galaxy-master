'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/lib/toast'

export default function AstronauteActions({ astronaute }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggleActive() {
    const action = astronaute.active ? 'désactiver' : 'réactiver'
    if (!confirm(`Voulez-vous ${action} ${astronaute.first_name} ${astronaute.last_name} ?`)) return
    setLoading(true)

    const res = await fetch(`/api/astronautes/${astronaute.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !astronaute.active }),
    })

    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      toast.error(d.error ?? 'Erreur lors de la mise à jour.')
    } else {
      toast.success(`${astronaute.first_name} ${astronaute.last_name} ${astronaute.active ? 'désactivé(e)' : 'réactivé(e)'}.`)
    }

    router.refresh()
    setLoading(false)
  }

  return (
    <button onClick={toggleActive} disabled={loading} className="btn-ghost"
            style={{ padding: '0.35rem 0.8rem', fontSize: '0.72rem' }}>
      <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>
        {astronaute.active ? 'person_off' : 'person'}
      </span>
      {astronaute.active ? 'Désactiver' : 'Réactiver'}
    </button>
  )
}
