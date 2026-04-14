'use client'

import { useState } from 'react'

export default function ProfilForm({ astronaut }) {
  const [form, setForm] = useState({
    first_name: astronaut?.first_name ?? '',
    last_name:  astronaut?.last_name  ?? '',
    role_title: astronaut?.role_title ?? '',
    photo_url:  astronaut?.photo_url  ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setStatus(null)
    try {
      const res = await fetch('/api/profil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur inconnue')
      setStatus({ type: 'success', msg: 'Profil mis à jour ✓' })
    } catch (err) {
      setStatus({ type: 'error', msg: err.message })
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.6rem',
    background: 'var(--color-surface-container-high)',
    border: '1px solid rgb(255 255 255 / 0.08)',
    color: 'var(--color-on-surface)', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
    outline: 'none',
  }
  const labelStyle = {
    display: 'block', fontFamily: 'var(--font-label)', fontSize: '0.65rem',
    color: 'var(--color-on-surface-variant)', letterSpacing: '0.1em',
    textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 700,
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Prénom</label>
          <input value={form.first_name} onChange={set('first_name')} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Nom</label>
          <input value={form.last_name} onChange={set('last_name')} style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Titre / rôle</label>
        <input value={form.role_title} onChange={set('role_title')}
               placeholder="ex: Senior Designer" style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle}>Photo (URL)</label>
        <input type="url" value={form.photo_url} onChange={set('photo_url')}
               placeholder="https://…" style={inputStyle} />

        {/* Preview */}
        {form.photo_url && (
          <div className="mt-3 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.photo_url} alt="Aperçu"
                 className="w-16 h-16 rounded-2xl object-cover"
                 style={{ border: '2px solid var(--color-primary)' }}
                 onError={e => { e.target.style.display = 'none' }}
            />
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)' }}>
              Aperçu de ta photo de profil
            </p>
          </div>
        )}
      </div>

      {status && (
        <div className="rounded-xl p-3 flex items-center gap-2"
             style={{
               background: status.type === 'success' ? 'rgb(74 222 128 / 0.1)' : 'rgb(255 100 100 / 0.1)',
               border: `1px solid ${status.type === 'success' ? 'rgb(74 222 128 / 0.3)' : 'rgb(255 100 100 / 0.3)'}`,
             }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: status.type === 'success' ? 'var(--color-success)' : 'var(--color-error)' }}>
            {status.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', color: status.type === 'success' ? 'var(--color-success)' : 'var(--color-error)' }}>
            {status.msg}
          </p>
        </div>
      )}

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? (
          <span className="material-symbols-outlined" style={{ fontSize: '1rem', animation: 'spin 1s linear infinite' }}>progress_activity</span>
        ) : (
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>save</span>
        )}
        {saving ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  )
}
