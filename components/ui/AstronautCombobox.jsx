'use client'

import { useState, useRef, useEffect, useId } from 'react'

/**
 * AstronautCombobox — searchable astronaut selector for forms.
 *
 * Props:
 *   astronautes  — array of { id, first_name, last_name, planets?: { name, color } }
 *   value        — selected astronaut id (controlled)
 *   onChange(id) — called with the new id string ('' to clear)
 *   required     — bool, for native form validation
 *   inputStyle   — style object applied to the trigger input
 *   placeholder  — override default placeholder
 */
export default function AstronautCombobox({
  astronautes = [],
  value = '',
  onChange,
  required = false,
  inputStyle = {},
  placeholder = 'Rechercher un astronaute…',
}) {
  const uid       = useId()
  const inputRef  = useRef(null)
  const listRef   = useRef(null)

  const [query,     setQuery]     = useState('')
  const [open,      setOpen]      = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)

  // Resolve selected astronaut object from value prop
  const selected = astronautes.find(a => a.id === value) ?? null

  // Filter list — ignore case, match name or planet
  const results = query.trim().length === 0
    ? astronautes
    : astronautes.filter(a => {
        const q = query.toLowerCase()
        return (
          `${a.first_name} ${a.last_name}`.toLowerCase().includes(q) ||
          (a.planets?.name ?? '').toLowerCase().includes(q)
        )
      })

  // Close on outside click
  useEffect(() => {
    function onDown(e) {
      if (!inputRef.current?.closest('[data-combobox]')?.contains(e.target)) {
        setOpen(false)
        setQuery('')
        setActiveIdx(-1)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  // Scroll active item into view
  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const item = listRef.current.children[activeIdx]
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIdx])

  function handleInputChange(e) {
    setQuery(e.target.value)
    setOpen(true)
    setActiveIdx(-1)
    // Clear selection when user starts typing again
    if (value) onChange('')
  }

  function handleSelect(a) {
    onChange(a.id)
    setQuery('')
    setOpen(false)
    setActiveIdx(-1)
    inputRef.current?.blur()
  }

  function handleClear(e) {
    e.stopPropagation()
    onChange('')
    setQuery('')
    setOpen(false)
    setActiveIdx(-1)
    inputRef.current?.focus()
  }

  function handleKeyDown(e) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      handleSelect(results[activeIdx])
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
      setActiveIdx(-1)
    }
  }

  // What the text input displays
  const displayValue = selected && !query
    ? `${selected.first_name} ${selected.last_name}`
    : query

  const showDropdown = open && results.length > 0
  const showNoResult = open && query.trim().length > 0 && results.length === 0

  return (
    <div data-combobox style={{ position: 'relative' }}>

      {/* Hidden native input for required validation */}
      <input
        type="hidden"
        name="astronaut_id_value"
        value={value}
        required={required}
      />

      {/* Text input */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        ...inputStyle,
        padding: '0',
        paddingLeft: '0.75rem',
        paddingRight: '0.4rem',
        border: `1px solid ${open ? 'var(--color-secondary)' : (inputStyle.border ?? 'rgb(255 255 255 / 0.08)')}`,
        boxShadow: open ? '0 0 0 1px var(--color-secondary)30' : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}>
        {/* Planet color dot when selected */}
        {selected && !query ? (
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
            background: selected.planets?.color ?? 'var(--color-on-surface-variant)',
            boxShadow: `0 0 6px ${selected.planets?.color ?? 'transparent'}`,
          }} />
        ) : (
          <span className="material-symbols-outlined" style={{ fontSize: '0.95rem', color: 'var(--color-on-surface-variant)', flexShrink: 0 }}>
            search
          </span>
        )}

        <input
          ref={inputRef}
          id={uid}
          type="text"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={`${uid}-list`}
          aria-activedescendant={activeIdx >= 0 ? `${uid}-opt-${activeIdx}` : undefined}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => { setOpen(true); if (selected) setQuery('') }}
          onKeyDown={handleKeyDown}
          placeholder={selected ? '' : placeholder}
          required={required && !value}
          style={{
            flex: 1,
            background: 'none', border: 'none', outline: 'none',
            color: 'var(--color-on-surface)',
            fontFamily: inputStyle.fontFamily ?? 'var(--font-body)',
            fontSize: inputStyle.fontSize ?? '0.875rem',
            padding: '0.6rem 0',
          }}
        />

        {/* Clear button */}
        {(value || query) && (
          <button
            type="button"
            onMouseDown={handleClear}
            aria-label="Effacer la sélection"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', padding: '0.25rem',
              color: 'var(--color-on-surface-variant)',
              borderRadius: '0.3rem',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>close</span>
          </button>
        )}

        {/* Chevron */}
        <span className="material-symbols-outlined" style={{
          fontSize: '1rem', color: 'var(--color-on-surface-variant)',
          transition: 'transform 0.15s',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          flexShrink: 0,
          marginRight: '0.25rem',
        }}>
          expand_more
        </span>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <ul
          ref={listRef}
          id={`${uid}-list`}
          role="listbox"
          aria-label="Astronautes"
          style={{
            position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0,
            background: 'var(--color-surface-container)',
            border: '1px solid var(--color-secondary)',
            borderRadius: '0.6rem',
            maxHeight: '260px', overflowY: 'auto',
            zIndex: 200,
            listStyle: 'none', margin: 0, padding: '0.3rem',
            boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
          }}
        >
          {results.map((a, i) => {
            const color    = a.planets?.color ?? 'var(--color-on-surface-variant)'
            const isActive = i === activeIdx
            const isSel    = a.id === value
            const initials = `${a.first_name?.[0] ?? '?'}${a.last_name?.[0] ?? ''}`
            const q        = query.trim().toLowerCase()
            const full     = `${a.first_name} ${a.last_name}`

            return (
              <li
                key={a.id}
                id={`${uid}-opt-${i}`}
                role="option"
                aria-selected={isSel}
                onMouseDown={() => handleSelect(a)}
                onMouseEnter={() => setActiveIdx(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.45rem 0.6rem',
                  borderRadius: '0.4rem',
                  cursor: 'pointer',
                  background: isActive ? 'rgb(144 147 255 / 0.1)' : isSel ? `${color}12` : 'transparent',
                  borderLeft: isActive ? '2px solid var(--color-secondary)' : isSel ? `2px solid ${color}60` : '2px solid transparent',
                  transition: 'background 0.1s',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: `${color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: isSel ? `1.5px solid ${color}60` : '1.5px solid transparent',
                }}>
                  {a.photo_url?.startsWith('https://') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.photo_url} alt=""
                         style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.62rem', fontWeight: 800, color }}>
                      {initials}
                    </span>
                  )}
                </div>

                {/* Name */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-label)', fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-on-surface)', lineHeight: 1.2 }}>
                    <Highlight text={full} query={q} highlightColor={color} />
                  </p>
                  {a.planets?.name && (
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color, marginTop: '0.1rem' }}>
                      {a.planets.name}
                    </p>
                  )}
                </div>

                {/* Selected check */}
                {isSel && (
                  <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', color, flexShrink: 0 }}>
                    check
                  </span>
                )}
              </li>
            )
          })}

          {/* Keyboard hint */}
          <li style={{ padding: '0.3rem 0.6rem', borderTop: '1px solid rgb(255 255 255 / 0.04)', marginTop: '0.2rem' }}>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', color: 'var(--color-on-surface-variant)' }}>
              ↑↓ naviguer · ↵ sélectionner · Esc fermer
            </span>
          </li>
        </ul>
      )}

      {/* No results */}
      {showNoResult && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0,
          background: 'var(--color-surface-container)',
          border: '1px solid rgb(255 255 255 / 0.07)',
          borderRadius: '0.6rem', padding: '0.75rem 1rem',
          zIndex: 200,
          boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
        }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.78rem', color: 'var(--color-on-surface-variant)' }}>
            Aucun résultat pour « {query} »
          </p>
        </div>
      )}
    </div>
  )
}

function Highlight({ text, query, highlightColor }) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: highlightColor, fontWeight: 900 }}>
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  )
}
