'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const PRESET_ICONS = ['🏆', '🥇', '🥈', '🥉', '🎖️', '🌟', '⭐', '💫', '🚀', '🛸', '🌌', '👑', '⚡', '🔥', '💎', '🎯']

export default function TropheeTypeForm({ trophyType }) {
  const router  = useRouter()
  const isEdit  = !!trophyType

  const [form, setForm] = useState({
    name:        trophyType?.name        ?? '',
    description: trophyType?.description ?? '',
    icon:        trophyType?.icon        ?? '🏆',
    scope:       trophyType?.scope       ?? 'both',
    active:      trophyType?.active      ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      name:        form.name,
      description: form.description || null,
      icon:        form.icon,
      scope:       form.scope,
      active:      form.active,
    }

    const res = await fetch(
      isEdit ? `/api/trophy-types/${trophyType.id}` : '/api/trophy-types',
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

    router.push('/config/trophees')
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

      {/* Icône */}
      <div>
        <label style={labelStyle}>Icône</label>
        <div className="flex items-center gap-3 mb-3">
          <div style={{
            width: '3rem', height: '3rem', borderRadius: '0.75rem', fontSize: '1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            background: 'var(--color-surface-container-highest)',
          }}>
            {form.icon}
          </div>
          <input value={form.icon} onChange={set('icon')} maxLength={4}
                 placeholder="ex: 🏆"
                 style={{ ...inputStyle, width: '6rem' }} />
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_ICONS.map(ico => (
            <button key={ico} type="button"
                    onClick={() => setForm(f => ({ ...f, icon: ico }))}
                    style={{
                      width: '2.25rem', height: '2.25rem', borderRadius: '0.4rem', fontSize: '1.1rem',
                      border: form.icon === ico ? '2px solid var(--color-primary)' : '2px solid transparent',
                      background: 'var(--color-surface-container-highest)', cursor: 'pointer',
                    }}>
              {ico}
            </button>
          ))}
        </div>
      </div>

      {/* Nom */}
      <div>
        <label style={labelStyle}>Nom *</label>
        <input value={form.name} onChange={set('name')} required
               placeholder="ex: MVP du mois, Meilleur speaker…"
               style={inputStyle} />
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description (optionnel)</label>
        <textarea value={form.description} onChange={set('description')} rows={2}
                  placeholder="Critères d'attribution, contexte…"
                  style={{ ...inputStyle, resize: 'vertical' }} />
      </div>

      {/* Scope */}
      <div>
        <label style={labelStyle}>Attribution</label>
        <div className="flex gap-2">
          {[
            { value: 'individual', label: '👤 Individuel', hint: 'Astronautes uniquement' },
            { value: 'planet',     label: '🌍 Planète',    hint: 'Planètes uniquement' },
            { value: 'both',       label: '↕ Les deux',    hint: 'Astronautes et planètes' },
          ].map(({ value, label, hint }) => (
            <button key={value} type="button"
                    onClick={() => setForm(f => ({ ...f, scope: value }))}
                    title={hint}
                    style={{
                      flex: 1, padding: '0.5rem 0.4rem', borderRadius: '0.5rem', fontSize: '0.72rem',
                      fontFamily: 'var(--font-label)', fontWeight: 600, cursor: 'pointer', border: '1px solid',
                      borderColor: form.scope === value ? 'var(--color-primary)' : 'rgb(255 255 255 / 0.08)',
                      background: form.scope === value ? 'rgb(172 199 255 / 0.15)' : 'var(--color-surface-container-highest)',
                      color: form.scope === value ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                    }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Actif */}
      {isEdit && (
        <div className="flex items-center gap-3">
          <input type="checkbox" id="active" checked={form.active}
                 onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                 style={{ width: '1rem', height: '1rem', accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
          <label htmlFor="active" style={{ ...labelStyle, margin: 0, cursor: 'pointer' }}>
            Actif (disponible à l&apos;attribution)
          </label>
        </div>
      )}

      {error && (
        <p style={{ color: 'var(--color-error, #f87171)', fontSize: '0.8rem', fontFamily: 'var(--font-label)' }}>
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer le trophée'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">
          Annuler
        </button>
      </div>

    </form>
  )
}
