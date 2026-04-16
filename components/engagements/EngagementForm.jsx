'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function EngagementForm({ event, eventTypes }) {
  const router = useRouter()
  const isEdit = !!event

  const [form, setForm] = useState({
    name:        event?.name        ?? '',
    date:        event?.date        ?? new Date().toISOString().split('T')[0],
    type_id:     event?.type_id     ?? '',
    description: event?.description ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(
        isEdit ? `/api/engagements/${event.id}` : '/api/engagements',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, type_id: form.type_id || null }),
        }
      )
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d.error ?? 'Une erreur est survenue.')
        return
      }
      const saved = await res.json()
      router.push(`/engagements/${saved.id}`)
    } catch {
      setError('Erreur réseau. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
    background: 'var(--color-surface-container-highest)', border: '1px solid rgb(255 255 255 / 0.08)',
    color: 'var(--color-on-surface)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none',
  }
  const labelStyle = {
    display: 'block', fontFamily: 'var(--font-label)', fontSize: '0.65rem',
    color: 'var(--color-on-surface-variant)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.35rem',
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label style={labelStyle}>Nom *</label>
        <input value={form.name} onChange={set('name')} required style={inputStyle} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Date *</label>
          <input type="date" value={form.date} onChange={set('date')} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Type</label>
          <select value={form.type_id} onChange={set('type_id')} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="">— Sans type —</option>
            {eventTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Description (optionnel)</label>
        <textarea value={form.description} onChange={set('description')} rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      {error && <p style={{ color: 'var(--color-error, #f87171)', fontSize: '0.8rem', fontFamily: 'var(--font-label)' }}>{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Enregistrement…' : isEdit ? 'Enregistrer' : "Créer l'event"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">Annuler</button>
      </div>
    </form>
  )
}
