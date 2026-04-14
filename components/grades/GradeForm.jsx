'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/lib/toast'

export default function GradeForm({ grade }) {
  const router = useRouter()
  const isEdit = !!grade

  const [form, setForm] = useState({
    name:       grade?.name       ?? '',
    min_points: grade?.min_points ?? '',
    color:      grade?.color      ?? '#acc7ff',
    icon:       grade?.icon       ?? '⭐',
    sort_order: grade?.sort_order ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setError(null)

    const min_points = parseInt(form.min_points)
    if (isNaN(min_points) || min_points < 0) { setError('Seuil invalide (entier ≥ 0)'); return }

    const sort_order = form.sort_order !== '' ? parseInt(form.sort_order) : min_points

    setLoading(true)
    const res = await fetch(
      isEdit ? `/api/grades/${grade.id}` : '/api/grades',
      {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, min_points, sort_order }),
      }
    )

    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      setError(d.error ?? 'Erreur lors de l\'enregistrement')
      setLoading(false)
      return
    }

    toast.success(isEdit ? 'Grade mis à jour.' : 'Grade créé.')
    router.push('/config/grades')
    router.refresh()
  }

  const inputStyle = {
    width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
    background: 'var(--color-surface-container-highest)',
    border: '1px solid rgb(255 255 255 / 0.08)',
    color: 'var(--color-on-surface)',
    fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none',
  }
  const labelStyle = {
    display: 'block', fontFamily: 'var(--font-label)', fontSize: '0.65rem',
    color: 'var(--color-on-surface-variant)',
    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.35rem',
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label style={labelStyle}>Nom du grade *</label>
        <input value={form.name} onChange={set('name')} required style={inputStyle}
               placeholder="ex : Fleet Admiral ★★★" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Seuil minimum (pts) *</label>
          <input type="number" min="0" value={form.min_points} onChange={set('min_points')}
                 required style={inputStyle} placeholder="ex : 15000" />
        </div>
        <div>
          <label style={labelStyle}>Ordre d&apos;affichage</label>
          <input type="number" min="0" value={form.sort_order} onChange={set('sort_order')}
                 style={inputStyle} placeholder="auto = seuil" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Icône (emoji)</label>
          <input value={form.icon} onChange={set('icon')} style={inputStyle}
                 placeholder="ex : 👑" maxLength={4} />
        </div>
        <div>
          <label style={labelStyle}>Couleur</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="color" value={form.color}
                   onChange={set('color')}
                   style={{ width: '2.5rem', height: '2.2rem', padding: '0.15rem', borderRadius: '0.4rem', border: '1px solid rgb(255 255 255 / 0.1)', background: 'var(--color-surface-container-highest)', cursor: 'pointer' }} />
            <input value={form.color} onChange={set('color')} style={{ ...inputStyle, flex: 1 }}
                   placeholder="#acc7ff" />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1rem', borderRadius: '0.6rem', background: 'var(--color-surface-container-highest)' }}>
        <span style={{ fontSize: '1.4rem' }}>{form.icon || '⭐'}</span>
        <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, color: form.color || 'var(--color-primary)', fontSize: '0.95rem' }}>
          {form.name || 'Nom du grade'}
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-label)', fontSize: '0.7rem', color: 'var(--color-on-surface-variant)' }}>
          {form.min_points !== '' ? `à partir de ${form.min_points} pts` : '— pts'}
        </span>
      </div>

      {error && (
        <p style={{ color: 'var(--color-error, #f87171)', fontSize: '0.8rem', fontFamily: 'var(--font-label)' }}>
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer le grade'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">
          Annuler
        </button>
      </div>
    </form>
  )
}
