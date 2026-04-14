'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const CATEGORY_LABEL = {
  challenge: 'Challenge', bonus: 'Bonus', content: 'Contenu',
  community: 'Communauté', speaking: 'Prise de parole', teaching: 'Formation', project: 'Projet',
  general: 'Général',
}

export default function ContributionForm({ contribution, astronautes, types, defaultAstronautId }) {
  const router = useRouter()
  const isEdit = !!contribution

  const [form, setForm] = useState({
    astronaut_id:  contribution?.astronaut_id  ?? defaultAstronautId ?? '',
    type_id:       contribution?.type_id       ?? '',
    date:          contribution?.date          ?? new Date().toISOString().split('T')[0],
    location:      contribution?.location      ?? '',
    duration_min:  contribution?.duration_min  ?? '',
    notes:         contribution?.notes         ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  // Only show individual-eligible types (exclude planet-only)
  const eligibleTypes = types.filter(t => !t.scope || t.scope !== 'planet')

  // Group types by category
  const grouped = eligibleTypes.reduce((acc, t) => {
    const cat = t.category ?? 'general'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(t)
    return acc
  }, {})

  const selectedType = types.find(t => t.id === form.type_id)

  async function submit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      astronaut_id: form.astronaut_id,
      type_id:      form.type_id,
      date:         form.date,
      location:     form.location || null,
      duration_min: form.duration_min ? parseInt(form.duration_min) : null,
      notes:        form.notes || null,
    }

    const res = await fetch(
      isEdit ? `/api/contributions/${contribution.id}` : '/api/contributions',
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
    const target = defaultAstronautId
      ? `/astronautes/${defaultAstronautId}`
      : `/contributions`
    router.push(target)
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

      {/* Astronaut — hidden if pre-selected and editing */}
      {!isEdit && (
        <div>
          <label style={labelStyle}>Astronaute *</label>
          <select value={form.astronaut_id} onChange={set('astronaut_id')} required
                  style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="">— Choisir un astronaute —</option>
            {astronautes.map(a => (
              <option key={a.id} value={a.id}>
                {a.first_name} {a.last_name}{a.planets?.name ? ` · ${a.planets.name}` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Type */}
      <div>
        <label style={labelStyle}>Type de contribution *</label>
        <select value={form.type_id} onChange={set('type_id')} required
                style={{ ...inputStyle, cursor: 'pointer' }}>
          <option value="">— Choisir un type —</option>
          {Object.entries(grouped).map(([cat, items]) => (
            <optgroup key={cat} label={CATEGORY_LABEL[cat] ?? cat}>
              {items.map(t => (
                <option key={t.id} value={t.id}>{t.name} · {t.base_points} pts</option>
              ))}
            </optgroup>
          ))}
        </select>
        {selectedType && (
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-primary)', marginTop: '0.35rem' }}>
            Base : {selectedType.base_points} pts
            {!isEdit && <span style={{ color: 'var(--color-on-surface-variant)' }}> · les multiplieurs (1ère contrib., 1ère de saison) s'appliquent automatiquement</span>}
          </p>
        )}
      </div>

      {/* Date */}
      <div>
        <label style={labelStyle}>Date *</label>
        <input type="date" value={form.date} onChange={set('date')} required style={inputStyle} />
      </div>

      {/* Optional fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Lieu (optionnel)</label>
          <input value={form.location} onChange={set('location')} placeholder="ex: Paris, remote…" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Durée en minutes (optionnel)</label>
          <input type="number" min="0" value={form.duration_min} onChange={set('duration_min')}
                 placeholder="ex: 60" style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Notes (optionnel)</label>
        <textarea value={form.notes} onChange={set('notes')} rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }} />
      </div>

      {error && (
        <p style={{ color: 'var(--color-error, #f87171)', fontSize: '0.8rem', fontFamily: 'var(--font-label)' }}>
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Enregistrer la contribution'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">
          Annuler
        </button>
      </div>

    </form>
  )
}
