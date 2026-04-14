'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/lib/toast'

export default function AstronauteForm({ astronaute, planetes }) {
  const router = useRouter()
  const isEdit = !!astronaute

  const [form, setForm] = useState({
    first_name:   astronaute?.first_name   ?? '',
    last_name:    astronaute?.last_name    ?? '',
    email:        astronaute?.email        ?? '',
    role_title:   astronaute?.role_title   ?? '',
    planet_id:    astronaute?.planet_id    ?? '',
    arrival_date: astronaute?.arrival_date ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      first_name:   form.first_name.trim(),
      last_name:    form.last_name.trim(),
      email:        form.email.trim() || null,
      role_title:   form.role_title.trim() || null,
      planet_id:    form.planet_id || null,
      arrival_date: form.arrival_date || null,
    }

    const res = await fetch(
      isEdit ? `/api/astronautes/${astronaute.id}` : '/api/astronautes',
      {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    if (!res.ok) {
      const data = await res.json()
      setError(data.error)
      setLoading(false)
      return
    }

    const saved = await res.json()
    toast.success(isEdit ? 'Astronaute mis à jour.' : 'Astronaute créé.')
    router.push(`/astronautes/${saved.id}`)
    router.refresh()
  }

  const inputStyle = {
    width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
    background: 'var(--color-surface-container-highest)',
    border: '1px solid rgb(255 255 255 / 0.08)',
    color: 'var(--color-on-surface)', fontFamily: 'var(--font-body)', fontSize: '0.875rem',
    outline: 'none',
  }
  const labelStyle = {
    display: 'block', fontFamily: 'var(--font-label)', fontSize: '0.65rem',
    color: 'var(--color-on-surface-variant)', letterSpacing: '0.1em',
    textTransform: 'uppercase', marginBottom: '0.35rem',
  }

  return (
    <form onSubmit={submit} className="space-y-5">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Prénom *</label>
          <input value={form.first_name} onChange={set('first_name')} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Nom *</label>
          <input value={form.last_name} onChange={set('last_name')} required style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Email</label>
        <input type="email" value={form.email} onChange={set('email')}
               placeholder="prenom.nom@company.io"
               style={inputStyle} />
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', marginTop: '0.3rem' }}>
          Requis pour envoyer l&apos;invitation à se connecter.
        </p>
      </div>

      <div>
        <label style={labelStyle}>Titre / rôle</label>
        <input value={form.role_title} onChange={set('role_title')} placeholder="ex: Senior Developer"
               style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle}>Planète</label>
        <select value={form.planet_id} onChange={set('planet_id')}
                style={{ ...inputStyle, cursor: 'pointer' }}>
          <option value="">— Aucune planète —</option>
          {planetes.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Date d'arrivée</label>
        <input type="date" value={form.arrival_date} onChange={set('arrival_date')} style={inputStyle} />
      </div>

      {error && (
        <p style={{ color: 'var(--color-error, #f87171)', fontSize: '0.8rem', fontFamily: 'var(--font-label)' }}>
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer l\'astronaute'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">
          Annuler
        </button>
      </div>

    </form>
  )
}
