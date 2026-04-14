'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/lib/toast'

export default function UtilisateurRoleToggle({ user, currentUserId }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const isSelf = user.id === currentUserId
  const isAdmin = user.role === 'admin'
  const nextRole = isAdmin ? 'observer' : 'admin'
  const label = isAdmin ? 'Rétrograder → Observateur' : 'Promouvoir → Administrateur'

  async function handleToggle() {
    if (isSelf) return
    if (!confirm(`Changer le rôle de ${user.full_name || user.email} vers « ${nextRole} » ?`)) return

    setBusy(true)
    const res = await fetch(`/api/utilisateurs/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: nextRole }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      toast.error(data.error ?? 'Erreur lors de la modification.')
      setBusy(false)
      return
    }

    toast.success(`Rôle de ${user.full_name || user.email} mis à jour → ${nextRole}.`)
    router.refresh()
  }

  if (isSelf) {
    return (
      <span style={{
        fontSize: '0.7rem',
        color: 'var(--color-on-surface-variant)',
        fontStyle: 'italic',
        fontFamily: 'var(--font-label)',
      }}>
        Vous
      </span>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={busy}
      title={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.25rem 0.6rem',
        borderRadius: '0.4rem',
        border: '1px solid',
        borderColor: isAdmin ? 'var(--color-error)' : 'var(--color-primary)',
        background: 'transparent',
        color: isAdmin ? 'var(--color-error)' : 'var(--color-primary)',
        fontSize: '0.7rem',
        fontFamily: 'var(--font-label)',
        fontWeight: 600,
        letterSpacing: '0.05em',
        cursor: busy ? 'wait' : 'pointer',
        opacity: busy ? 0.6 : 1,
        whiteSpace: 'nowrap',
      }}>
      <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>
        {isAdmin ? 'arrow_downward' : 'arrow_upward'}
      </span>
      {isAdmin ? 'Rétrograder' : 'Promouvoir'}
    </button>
  )
}
