'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/lib/toast'

const CATEGORIES = [
  { value: 'challenge', label: 'Challenge' },
  { value: 'bonus',     label: 'Bonus' },
  { value: 'content',   label: 'Contenu' },
  { value: 'community', label: 'Communauté' },
  { value: 'speaking',  label: 'Prise de parole' },
  { value: 'teaching',  label: 'Formation' },
  { value: 'project',   label: 'Projet' },
  { value: 'general',   label: 'Général' },
]

export default function ContributionTypeForm({ type }) {
  const router = useRouter()
  const isEdit = !!type

  const [form, setForm] = useState({
    name:        type?.name        ?? '',
    description: type?.description ?? '',
    base_points: type?.base_points ?? '',
    category:    type?.category    ?? 'general',
    scope:       type?.scope       ?? 'individual',
    active:      type?.active      ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setError(null)
    const pts = parseInt(form.base_points)
    if (isNaN(pts) || pts < 0) { setError('Points invalides'); return }
    setLoading(true)

    const res = await fetch(
      isEdit ? `/api/contribution-types/${type.id}` : '/api/contribution-types',
      {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, base_points: pts }),
      }
    )

    if (!res.ok) { const d = await res.json(); setError(d.error); setLoading(false); return }
    toast.success(isEdit ? 'Type de contribution mis à jour.' : 'Type de contribution créé.')
    router.push('/config/contributions')
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Points de base *</label>
          <input type="number" min="0" value={form.base_points} onChange={set('base_points')} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Catégorie</label>
          <select value={form.category} onChange={set('category')} style={{ ...inputStyle, cursor: 'pointer' }}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      </div>
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
