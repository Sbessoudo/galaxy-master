'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import FormInput from '@/components/ui/FormInput'
import { PRESET_COLORS, PLANET_TYPE_OPTIONS, MAX_FILE_SIZE_LABEL } from '@/lib/constants'

export default function PlaneteEditForm({ planete }) {
  const router = useRouter()
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    name: planete.name,
    description: planete.description || '',
    mantra: planete.mantra || '',
    color: planete.color,
    type: planete.type,
    sort_order: planete.sort_order,
  })
  const [photoUrl, setPhotoUrl] = useState(planete.photo_url || null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setError(null)
    setSuccess(false)
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`/api/planetes/${planete.id}/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        setPhotoUrl(data.photo_url)
        router.refresh()
      } else {
        setError(data.error)
      }
    } catch {
      setError('Erreur réseau. Réessaie.')
    } finally {
      setUploading(false)
    }
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    const res = await fetch(`/api/planetes/${planete.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    if (res.ok) {
      setSuccess(true)
      router.refresh()
    } else {
      setError(data.error)
    }
    setSaving(false)
  }

  return (
    <form onSubmit={save} className="space-y-6">

      {/* Image upload */}
      <div className="rounded-xl p-5" style={{ background: 'var(--color-surface-container)' }}>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Icône / Image
        </p>
        <div className="flex items-center gap-5">
          {/* Preview */}
          <div className="relative w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden"
               style={{ background: form.color, boxShadow: `0 0 24px -4px ${form.color}` }}>
            {photoUrl ? (
              <Image src={photoUrl} alt={form.name} fill className="object-cover" unoptimized />
            ) : (
              <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '2rem', opacity: 0.8 }}>public</span>
            )}
          </div>

          <div className="flex-1">
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml"
                   onChange={handleUpload} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()}
                    className="btn-ghost" disabled={uploading}
                    style={{ marginBottom: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>
                {uploading ? 'hourglass_empty' : 'upload'}
              </span>
              {uploading ? 'Envoi...' : 'Choisir une image'}
            </button>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)' }}>
              JPG, PNG, WebP ou SVG · Max {MAX_FILE_SIZE_LABEL}
            </p>
            {photoUrl && (
              <button type="button"
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/planetes/${planete.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ photo_url: null }),
                          })
                          if (res.ok) {
                            setPhotoUrl(null)
                            router.refresh()
                          } else {
                            const d = await res.json()
                            setError(d.error || 'Erreur lors de la suppression.')
                          }
                        } catch {
                          setError('Erreur réseau. Réessaie.')
                        }
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontFamily: 'var(--font-label)', fontSize: '0.65rem', marginTop: '0.25rem', padding: 0 }}>
                Supprimer l&apos;image
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="rounded-xl p-5 space-y-4" style={{ background: 'var(--color-surface-container)' }}>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Informations
        </p>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm"
               style={{ background: 'var(--color-error-container)', color: 'var(--color-error)' }}>
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl px-4 py-3 text-sm"
               style={{ background: 'rgb(74 222 128 / 0.1)', color: 'var(--color-success)' }}>
            Modifications enregistrées.
          </div>
        )}

        <FormInput label="Nom *" value={form.name} onChange={e => set('name', e.target.value)} required />

        <FormInput label="Description" optional value={form.description}
                   onChange={e => set('description', e.target.value)}
                   placeholder="Description optionnelle" />

        <FormInput label="Mantra" optional value={form.mantra}
                   onChange={e => set('mantra', e.target.value)}
                   placeholder="La devise de la planète…" />

        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Type" as="select" value={form.type} onChange={e => set('type', e.target.value)}>
            {PLANET_TYPE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </FormInput>
          <FormInput label="Ordre" type="number" min="0" max="10" value={form.sort_order}
                     onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
        </div>

        {/* Color */}
        <div>
          <label className="field-label">Couleur</label>
          <div className="flex items-center gap-3 flex-wrap">
            {PRESET_COLORS.map(color => (
              <button key={color} type="button" onClick={() => set('color', color)}
                      style={{
                        width: '1.75rem', height: '1.75rem', borderRadius: '50%', background: color, border: 'none',
                        outline: form.color === color ? `3px solid white` : '3px solid transparent',
                        outlineOffset: '2px',
                        cursor: 'pointer',
                        boxShadow: form.color === color ? `0 0 12px ${color}` : 'none',
                        transition: 'all 0.15s',
                      }} />
            ))}
            <input type="color" value={form.color} onChange={e => set('color', e.target.value)}
                   title="Couleur personnalisée"
                   style={{ width: '1.75rem', height: '1.75rem', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0 }} />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  )
}
