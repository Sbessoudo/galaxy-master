'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { toast } from '@/lib/toast'
import TagInput from '@/components/ui/TagInput'

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
    hobbies:      astronaute?.hobbies      ?? [],
    skills:       astronaute?.skills       ?? [],
  })
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const [photoUrl, setPhotoUrl]     = useState(astronaute?.photo_url ?? null)
  const [uploading, setUploading]   = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const fileInputRef                = useRef(null)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`/api/astronautes/${astronaute.id}/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setUploadError(data.error)
      } else {
        setPhotoUrl(data.photo_url)
        toast.success('Photo mise à jour.')
      }
    } catch {
      setUploadError('Erreur réseau. Réessaie.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

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
      hobbies:      form.hobbies,
      skills:       form.skills,
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

      {/* Photo upload — edit only (needs an id for storage path) */}
      {isEdit && (
        <div>
          <label style={labelStyle}>Photo</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0"
                 style={{ background: 'var(--color-surface-container-highest)' }}>
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined" style={{ color: 'var(--color-on-surface-variant)', fontSize: '1.5rem' }}>person</span>
              )}
            </div>
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
                id="astronaut-photo-input"
              />
              <label htmlFor="astronaut-photo-input"
                     className="btn-ghost"
                     style={{ display: 'inline-flex', cursor: 'pointer', padding: '0.4rem 0.9rem', fontSize: '0.75rem' }}>
                {uploading
                  ? <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', animation: 'spin 1s linear infinite' }}>progress_activity</span>
                  : <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>upload</span>
                }
                {uploading ? 'Upload…' : 'Changer la photo'}
              </label>
              {uploadError && (
                <p style={{ color: 'var(--color-error)', fontSize: '0.7rem', fontFamily: 'var(--font-label)', marginTop: '0.3rem' }}>
                  {uploadError}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

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
        <label style={labelStyle}>Date d&apos;arrivée</label>
        <input type="date" value={form.arrival_date} onChange={set('arrival_date')} style={inputStyle} />
      </div>

      <TagInput
        label="Hobbies"
        tags={form.hobbies}
        onChange={tags => setForm(f => ({ ...f, hobbies: tags }))}
        placeholder="Ex: Photographie, Escalade…"
      />

      <TagInput
        label="Compétences"
        tags={form.skills}
        onChange={tags => setForm(f => ({ ...f, skills: tags }))}
        placeholder="Ex: React, Design, Python…"
      />

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
