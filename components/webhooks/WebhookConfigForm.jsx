'use client'

import { useState } from 'react'

export default function WebhookConfigForm({ initial }) {
  const [url, setUrl]         = useState(initial?.url ?? '')
  const [enabled, setEnabled] = useState(initial?.enabled ?? true)
  const [saving, setSaving]   = useState(false)
  const [testing, setTesting] = useState(false)
  const [status, setStatus]   = useState(null) // { type: 'success'|'error', msg }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setStatus(null)
    try {
      const res = await fetch('/api/webhooks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, enabled }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur inconnue')
      setStatus({ type: 'success', msg: 'Configuration sauvegardée.' })
    } catch (err) {
      setStatus({ type: 'error', msg: err.message })
    } finally {
      setSaving(false)
    }
  }

  async function handleTest() {
    setTesting(true)
    setStatus(null)
    try {
      const res = await fetch('/api/webhooks/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur inconnue')
      setStatus({ type: 'success', msg: 'Message test envoyé sur Slack ✅' })
    } catch (err) {
      setStatus({ type: 'error', msg: err.message })
    } finally {
      setTesting(false)
    }
  }

  const isValidUrl = url === '' || url.startsWith('https://hooks.slack.com/')

  return (
    <form onSubmit={handleSave} className="space-y-6">

      {/* URL field */}
      <div>
        <label style={{
          display: 'block',
          fontFamily: 'var(--font-label)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--color-on-surface)',
          marginBottom: '0.5rem',
        }}>
          URL du Webhook Slack
        </label>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://hooks.slack.com/services/…"
          className="input w-full"
          style={!isValidUrl ? { borderColor: 'var(--color-error)' } : {}}
        />
        {!isValidUrl && (
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-error)', marginTop: '0.3rem' }}>
            L&apos;URL doit commencer par https://hooks.slack.com/
          </p>
        )}
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', marginTop: '0.35rem' }}>
          Slack App → Incoming Webhooks → Add New Webhook to Workspace
        </p>
      </div>

      {/* Enable toggle */}
      <div className="flex items-center justify-between rounded-xl p-4"
           style={{ background: 'var(--color-surface-container-high)' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-on-surface)' }}>
            Webhook actif
          </p>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', marginTop: '0.15rem' }}>
            Désactiver pour suspendre toutes les notifications sans supprimer l&apos;URL
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEnabled(v => !v)}
          style={{
            width: '3rem',
            height: '1.6rem',
            borderRadius: '999px',
            background: enabled ? 'var(--color-primary)' : 'var(--color-surface-container-highest)',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background 0.2s',
            flexShrink: 0,
          }}
          aria-checked={enabled}
          role="switch"
        >
          <span style={{
            position: 'absolute',
            top: '0.2rem',
            left: enabled ? 'calc(100% - 1.4rem)' : '0.2rem',
            width: '1.2rem',
            height: '1.2rem',
            borderRadius: '50%',
            background: enabled ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
            transition: 'left 0.2s',
          }} />
        </button>
      </div>

      {/* Events info */}
      <div className="rounded-xl p-4" style={{ background: 'rgb(144 147 255 / 0.08)', border: '1px solid rgb(144 147 255 / 0.15)' }}>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
          Événements notifiés
        </p>
        <ul style={{ fontFamily: 'var(--font-label)', fontSize: '0.7rem', color: 'var(--color-on-surface-variant)', lineHeight: 1.7, paddingLeft: '1rem' }}>
          <li>🚀 Contribution enregistrée (astronaute, type, points)</li>
          <li>✨ Première contribution d&apos;un astronaute (×2 pts)</li>
          <li>🎯 Première contribution de la saison (+25 pts)</li>
          <li>🏆 Trophée attribué (astronaute ou planète)</li>
        </ul>
      </div>

      {/* Status feedback */}
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

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || !isValidUrl}
          className="btn-primary"
        >
          {saving ? (
            <span className="material-symbols-outlined" style={{ fontSize: '1rem', animation: 'spin 1s linear infinite' }}>progress_activity</span>
          ) : (
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>save</span>
          )}
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>

        <button
          type="button"
          onClick={handleTest}
          disabled={testing || !url}
          className="btn-secondary"
        >
          {testing ? (
            <span className="material-symbols-outlined" style={{ fontSize: '1rem', animation: 'spin 1s linear infinite' }}>progress_activity</span>
          ) : (
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>send</span>
          )}
          {testing ? 'Envoi…' : 'Tester'}
        </button>
      </div>
    </form>
  )
}
