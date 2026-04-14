'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/lib/toast'

export default function EventTypeForm({ type }) {
  const router = useRouter()
  const isEdit = !!type

  const [form, setForm] = useState({
    name:        type?.name        ?? '',
    description: type?.description ?? '',
    active:      type?.active      ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch(
      isEdit ? `/api/event-types/${type.id}` : '/api/event-types',
      { method: isEdit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }
    )

    if (!res.ok) { const d = await res.json(); setError(d.error); setLoading(false); return }
    toast.success(isEdit ? 'Type d\'événement mis à jour.' : 'Type d\'événement créé.')
    router.push('/config/engagements')
    router.refresh()
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
      <div>
        <label style={labelStyle}>Description</label>
        <input value={form.description} onChange={set('description')} style={inputStyle} />
      </div>
      {isEdit && (
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', color: 'var(--color-on-surface)' }}>Actif</span>
        </label>
      )}
      {error && <p style={{ color: 'var(--color-error, #f87171)', fontSize: '0.8rem', fontFamily: 'var(--font-label)' }}>{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer le type'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">Annuler</button>
      </div>
    </form>
  )
}
