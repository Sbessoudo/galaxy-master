'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MagicLinkForm() {
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/hub`,
        shouldCreateUser: false, // only existing users
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center py-2">
        <span className="material-symbols-outlined"
              style={{ fontSize: '2rem', color: 'var(--color-success)', display: 'block', marginBottom: '0.5rem' }}>
          mark_email_read
        </span>
        <p style={{ fontFamily: 'var(--font-label)', fontWeight: 700, color: 'var(--color-on-surface)', fontSize: '0.85rem' }}>
          Lien envoyé !
        </p>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', color: 'var(--color-on-surface-variant)', marginTop: '0.3rem' }}>
          Vérifie ta boîte mail — le lien expire dans 1h.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="ton.email@eleven-labs.com"
        style={{
          width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.6rem',
          background: 'var(--color-surface-container-highest)',
          border: '1px solid rgb(255 255 255 / 0.08)',
          color: 'var(--color-on-surface)', fontFamily: 'var(--font-body)', fontSize: '0.875rem',
          outline: 'none',
        }}
      />
      {error && (
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.7rem', color: 'var(--color-error)' }}>
          {error === 'Signups not allowed for otp'
            ? 'Adresse email non reconnue. Contacte un administrateur.'
            : error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || !email}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold"
        style={{
          background: 'var(--color-surface-container-highest)',
          color: loading ? 'var(--color-on-surface-variant)' : 'var(--color-on-surface)',
          fontFamily: 'var(--font-headline)', fontSize: '0.875rem',
          border: '1px solid rgb(255 255 255 / 0.1)',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>
          {loading ? 'progress_activity' : 'mail'}
        </span>
        {loading ? 'Envoi…' : 'Recevoir un lien de connexion'}
      </button>
    </form>
  )
}
