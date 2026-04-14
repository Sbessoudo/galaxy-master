'use client'

import { useState } from 'react'

export default function InviteButton({ astronauteId, email, hasAccount }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState(null)

  if (!email) {
    return (
      <span style={{
        fontFamily: 'var(--font-label)', fontSize: '0.65rem',
        color: 'var(--color-on-surface-variant)', fontStyle: 'italic',
      }}>
        Email requis pour inviter
      </span>
    )
  }

  async function handleInvite() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/astronautes/${astronauteId}/invite`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex items-center gap-1.5"
           style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', color: 'var(--color-success)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>check_circle</span>
        Invitation envoyée à {email}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleInvite}
        disabled={loading}
        className="btn-ghost"
        style={{ padding: '0.4rem 0.9rem', fontSize: '0.72rem' }}
      >
        {loading ? (
          <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', animation: 'spin 1s linear infinite' }}>progress_activity</span>
        ) : (
          <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>
            {hasAccount ? 'send' : 'mark_email_unread'}
          </span>
        )}
        {loading ? 'Envoi…' : hasAccount ? 'Renvoyer l\'invitation' : 'Envoyer l\'invitation'}
      </button>
      {error && (
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-error)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
