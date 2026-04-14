'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/lib/toast'

export default function TropheeForm({ trophyTypes, astronautes, planetes, defaultAstronautId, defaultPlanetId }) {
  const router = useRouter()

  const [form, setForm] = useState({
    type_id:      '',
    target:       defaultAstronautId ? 'astronaut' : defaultPlanetId ? 'planet' : 'astronaut',
    astronaut_id: defaultAstronautId ?? '',
    planet_id:    defaultPlanetId    ?? '',
    notes:        '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  // Filter trophy types based on current target
  const eligibleTypes = trophyTypes.filter(t => {
    if (!t.scope || t.scope === 'both') return true
    if (form.target === 'astronaut') return t.scope === 'individual'
    if (form.target === 'planet')    return t.scope === 'planet'
    return true
  })

  const selectedType = trophyTypes.find(t => t.id === form.type_id)

  async function submit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      type_id:      form.type_id,
      astronaut_id: form.target === 'astronaut' ? form.astronaut_id || null : null,
      planet_id:    form.target === 'planet'    ? form.planet_id    || null : null,
      notes:        form.notes || null,
    }

    const res = await fetch('/api/trophees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error)
      setLoading(false)
      return
    }

    toast.success(`Trophée ${selectedType?.name ? `« ${selectedType.name} »` : ''} attribué.`)
    // Redirect to the detail page of the recipient
    if (form.target === 'astronaut' && form.astronaut_id) {
      router.push(`/astronautes/${form.astronaut_id}`)
    } else if (form.target === 'planet' && form.planet_id) {
      router.push(`/planetes/${form.planet_id}`)
    } else {
      router.push('/trophees')
    }
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

      {/* Type de trophée */}
      <div>
        <label style={labelStyle}>Type de trophée *</label>
        <select value={form.type_id} onChange={set('type_id')} required
                style={{ ...inputStyle, cursor: 'pointer' }}>
          <option value="">— Choisir un trophée —</option>
          {eligibleTypes.map(t => (
            <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
          ))}
        </select>
        {selectedType?.description && (
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', marginTop: '0.35rem' }}>
            {selectedType.description}
          </p>
        )}
      </div>

      {/* Cible : astronaute ou planète */}
      <div>
        <label style={labelStyle}>Attribuer à *</label>
        <div className="flex gap-3 mb-3">
          {['astronaut', 'planet'].map(t => (
            <button key={t} type="button"
                    onClick={() => setForm(f => ({ ...f, target: t, type_id: '' }))}
                    style={{
                      padding: '0.45rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem',
                      fontFamily: 'var(--font-label)', fontWeight: 600, cursor: 'pointer', border: 'none',
                      background: form.target === t ? 'var(--color-primary)' : 'var(--color-surface-container-highest)',
                      color: form.target === t ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                    }}>
              {t === 'astronaut' ? '👤 Astronaute' : '🌍 Planète'}
            </button>
          ))}
        </div>

        {form.target === 'astronaut' && (
          <select value={form.astronaut_id} onChange={set('astronaut_id')} required
                  style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="">— Choisir un astronaute —</option>
            {astronautes.map(a => (
              <option key={a.id} value={a.id}>
                {a.first_name} {a.last_name}{a.planets?.name ? ` · ${a.planets.name}` : ''}
              </option>
            ))}
          </select>
        )}

        {form.target === 'planet' && (
          <select value={form.planet_id} onChange={set('planet_id')} required
                  style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="">— Choisir une planète —</option>
            {planetes.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Notes */}
      <div>
        <label style={labelStyle}>Notes (optionnel)</label>
        <textarea value={form.notes} onChange={set('notes')} rows={3}
                  placeholder="Raison de l'attribution, contexte…"
                  style={{ ...inputStyle, resize: 'vertical' }} />
      </div>

      {error && (
        <p style={{ color: 'var(--color-error, #f87171)', fontSize: '0.8rem', fontFamily: 'var(--font-label)' }}>
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Attribution…' : 'Attribuer le trophée'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">
          Annuler
        </button>
      </div>

    </form>
  )
}
