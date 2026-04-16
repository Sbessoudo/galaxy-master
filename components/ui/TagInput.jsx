'use client'

import { useState } from 'react'

/**
 * TagInput — free-text tag array input
 * props: label, tags (string[]), onChange(newTags), placeholder
 */
export default function TagInput({ label, tags = [], onChange, placeholder = 'Ajouter…' }) {
  const [input, setInput] = useState('')

  function add() {
    const val = input.trim()
    if (!val || tags.includes(val)) { setInput(''); return }
    onChange([...tags, val])
    setInput('')
  }

  function remove(tag) {
    onChange(tags.filter(t => t !== tag))
  }

  function onKey(e) {
    if (e.key === 'Enter') { e.preventDefault(); add() }
    if (e.key === 'Backspace' && !input && tags.length) {
      remove(tags[tags.length - 1])
    }
  }

  return (
    <div>
      {label && (
        <label style={{
          display: 'block', fontFamily: 'var(--font-label)', fontSize: '0.65rem',
          color: 'var(--color-on-surface-variant)', letterSpacing: '0.1em',
          textTransform: 'uppercase', marginBottom: '0.35rem',
        }}>
          {label}
        </label>
      )}

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center',
        padding: '0.45rem 0.75rem', borderRadius: '0.5rem', minHeight: '2.4rem',
        background: 'var(--color-surface-container-highest)',
        border: '1px solid rgb(255 255 255 / 0.08)',
      }}>
        {tags.map(tag => (
          <span key={tag} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.2rem 0.55rem', borderRadius: '999px',
            background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
            color: 'var(--color-primary)',
            fontFamily: 'var(--font-label)', fontSize: '0.72rem', fontWeight: 500,
          }}>
            {tag}
            <button type="button" onClick={() => remove(tag)}
                    aria-label={`Retirer ${tag}`}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, color: 'inherit', opacity: 0.7 }}>
              ×
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => { if (input.trim()) add() }}
          placeholder={tags.length === 0 ? placeholder : ''}
          style={{
            flex: 1, minWidth: '8rem', background: 'none', border: 'none', outline: 'none',
            color: 'var(--color-on-surface)', fontFamily: 'var(--font-body)', fontSize: '0.875rem',
          }}
        />
      </div>
      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', marginTop: '0.25rem' }}>
        Entrée pour valider · Backspace pour supprimer le dernier
      </p>
    </div>
  )
}
