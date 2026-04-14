'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const PRESET_COLORS = [
  '#ff8c98', '#9093ff', '#ffb148', '#4ade80',
  '#38bdf8', '#f472b6', '#a78bfa', '#fb923c',
]

const TYPE_OPTIONS = [
  { value: 'main',      label: 'Principale',   desc: 'Participe au classement général' },
  { value: 'newcomers', label: 'Recrues',       desc: 'Astronautes en attente d\'assignation' },
  { value: 'arbiters',  label: 'Arbitres',      desc: 'Hors compétition' },
]

export default function NewPlanetePage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', description: '', color: '#9093ff', type: 'main', sort_order: 0 })
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

    const res = await fetch('/api/planetes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/config/planetes')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Erreur lors de la création')
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    background: 'var(--color-surface-container-highest)',
    color: 'var(--color-on-surface)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    border: 'none',
    outline: 'none',
  }

  return (
    <div className="max-w-lg">

      <div className="mb-8">
        <Link href="/config/planetes"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', fontFamily: 'var(--font-label)', marginBottom: '1.25rem', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
          Retour aux planètes
        </Link>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
          Configuration · Planètes
        </p>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
          Nouvelle planète
        </h1>
      </div>

      <form onSubmit={submit} className="rounded-xl p-6 space-y-5"
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
            Nom *
          </label>
          <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                 placeholder="Ex : Mercure" required style={inputStyle}
                 onFocus={e => e.target.style.boxShadow = '0 0 0 2px var(--color-secondary)'}
                 onBlur={e => e.target.style.boxShadow = 'none'} />
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Description <span style={{ opacity: 0.5 }}>(optionnel)</span>
          </label>
          <input type="text" value={form.description} onChange={e => set('description', e.target.value)}
                 placeholder="Ex : L'équipe des pionniers" style={inputStyle}
                 onFocus={e => e.target.style.boxShadow = '0 0 0 2px var(--color-secondary)'}
                 onBlur={e => e.target.style.boxShadow = 'none'} />
        </div>

        {/* Type */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Type *
          </label>
          <div className="space-y-2">
            {TYPE_OPTIONS.map(({ value, label, desc }) => (
              <label key={value}
                     className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                     style={{
                       background: form.type === value ? 'rgb(144 147 255 / 0.1)' : 'var(--color-surface-container-highest)',
                       border: form.type === value ? '1px solid rgb(144 147 255 / 0.3)' : '1px solid transparent',
                     }}>
                <input type="radio" name="type" value={value} checked={form.type === value}
                       onChange={() => set('type', value)} style={{ accentColor: 'var(--color-secondary)' }} />
                <div>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--color-on-surface-variant)' }}>{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Couleur */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Couleur
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            {PRESET_COLORS.map(color => (
              <button key={color} type="button" onClick={() => set('color', color)}
                      style={{
                        width: '2rem', height: '2rem',
                        borderRadius: '50%',
                        background: color,
                        border: form.color === color ? '3px solid white' : '3px solid transparent',
                        cursor: 'pointer',
                        boxShadow: form.color === color ? `0 0 12px ${color}` : 'none',
                        transition: 'all 0.15s',
                      }} />
            ))}
            <input type="color" value={form.color} onChange={e => set('color', e.target.value)}
                   style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'none' }} />
          </div>
        </div>

        {/* Ordre */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Ordre d'affichage
          </label>
          <input type="number" min="0" max="10" value={form.sort_order}
                 onChange={e => set('sort_order', parseInt(e.target.value) || 0)}
                 style={{ ...inputStyle, width: '6rem' }}
                 onFocus={e => e.target.style.boxShadow = '0 0 0 2px var(--color-secondary)'}
                 onBlur={e => e.target.style.boxShadow = 'none'} />
        </div>

        {/* Preview */}
        <div className="rounded-xl p-4 flex items-center gap-3"
             style={{ background: 'var(--color-surface-container-highest)' }}>
          <div className="w-10 h-10 rounded-xl flex-shrink-0"
               style={{ background: form.color, boxShadow: `0 0 20px -5px ${form.color}` }} />
          <div>
            <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--color-on-surface)', fontSize: '0.95rem' }}>
              {form.name || 'Nom de la planète'}
            </p>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.7rem', color: 'var(--color-on-surface-variant)' }}>
              {TYPE_OPTIONS.find(t => t.value === form.type)?.label}
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            {loading ? 'Création...' : 'Créer la planète'}
          </button>
          <Link href="/config/planetes" className="btn-ghost" style={{ justifyContent: 'center' }}>
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
