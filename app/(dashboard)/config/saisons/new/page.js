'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewSaisonPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', start_date: '', end_date: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setError(null)
  }

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/saisons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/config/saisons')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Erreur lors de la création')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">

      {/* Header */}
      <div className="mb-8">
        <Link href="/config/saisons"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', fontFamily: 'var(--font-label)', marginBottom: '1.25rem', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
          Retour aux saisons
        </Link>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-tertiary)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
          Configuration · Saisons
        </p>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
          Nouvelle saison
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={submit}
            className="rounded-xl p-6 space-y-5"
            style={{ background: 'var(--color-surface-container)' }}>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm"
               style={{ background: 'var(--color-error-container)', color: 'var(--color-error)', fontFamily: 'var(--font-body)' }}>
            {error}
          </div>
        )}

        {/* Nom */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Nom de la saison
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Ex : Saison 2025-2026"
            required
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              background: 'var(--color-surface-container-highest)',
              color: 'var(--color-on-surface)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              border: 'none',
              outline: 'none',
            }}
            onFocus={e => e.target.style.boxShadow = '0 0 0 2px var(--color-secondary)'}
            onBlur={e => e.target.style.boxShadow = 'none'}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { field: 'start_date', label: 'Date de début' },
            { field: 'end_date',   label: 'Date de fin' },
          ].map(({ field, label }) => (
            <div key={field}>
              <label style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {label}
              </label>
              <input
                type="date"
                value={form[field]}
                onChange={e => set(field, e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  background: 'var(--color-surface-container-highest)',
                  color: 'var(--color-on-surface)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  border: 'none',
                  outline: 'none',
                  colorScheme: 'dark',
                }}
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px var(--color-secondary)'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
            </div>
          ))}
        </div>

        {/* Info box */}
        <div className="rounded-xl px-4 py-3 flex gap-3"
             style={{ background: 'rgb(144 147 255 / 0.08)' }}>
          <span className="material-symbols-outlined flex-shrink-0" style={{ color: 'var(--color-secondary)', fontSize: '1rem', marginTop: '0.1rem' }}>info</span>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--color-on-surface-variant)', lineHeight: 1.5 }}>
            La saison sera créée en état <strong style={{ color: 'var(--color-on-surface)' }}>inactif</strong>. Active-la depuis la liste pour réinitialiser les points planètes.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            {loading ? 'Création...' : 'Créer la saison'}
          </button>
          <Link href="/config/saisons" className="btn-ghost" style={{ justifyContent: 'center' }}>
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
