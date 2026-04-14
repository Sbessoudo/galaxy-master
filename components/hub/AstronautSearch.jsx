'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

export default function AstronautSearch({ astronauts }) {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const previewId    = searchParams.get('preview')
  const initialQ     = searchParams.get('q') ?? ''

  const [query, setQuery]         = useState(initialQ)
  const [open, setOpen]           = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef(null)
  const listRef  = useRef(null)

  const href = (id) => previewId ? `/hub/astronautes/${id}?preview=${previewId}` : `/hub/astronautes/${id}`

  // Sync query to URL (debounced)
  const syncUrl = useCallback((q) => {
    const params = new URLSearchParams(searchParams.toString())
    if (q) params.set('q', q)
    else params.delete('q')
    router.replace(`/hub/astronautes?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  // Debounce URL sync
  useEffect(() => {
    const t = setTimeout(() => syncUrl(query.trim()), 300)
    return () => clearTimeout(t)
  }, [query, syncUrl])

  const q = query.trim().toLowerCase()
  const suggestions = q.length < 1 ? [] : astronauts.filter(a => {
    const full = `${a.first_name} ${a.last_name}`.toLowerCase()
    const role = (a.role_title ?? '').toLowerCase()
    const planet = (a.planets?.name ?? '').toLowerCase()
    return full.includes(q) || role.includes(q) || planet.includes(q)
  }).slice(0, 8)

  // Open dropdown if initial query from URL
  useEffect(() => {
    if (initialQ) setOpen(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close on outside click
  useEffect(() => {
    function onDown(e) {
      if (!inputRef.current?.contains(e.target) && !listRef.current?.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  function onKeyDown(e) {
    if (!open || !suggestions.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIdx(-1)
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      window.location.href = href(suggestions[activeIdx].id)
    }
  }

  return (
    <div style={{ position: 'relative', maxWidth: '420px', margin: '0 auto 2.5rem' }}>

      {/* Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        background: 'var(--color-surface-container)',
        border: `1px solid ${open && suggestions.length ? 'var(--color-secondary)' : 'rgb(255 255 255 / 0.08)'}`,
        borderRadius: open && suggestions.length ? '0.75rem 0.75rem 0 0' : '0.75rem',
        padding: '0.6rem 1rem',
        transition: 'border-color 0.15s, border-radius 0.1s',
        boxShadow: open && suggestions.length ? '0 0 0 1px var(--color-secondary)30' : 'none',
      }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--color-on-surface-variant)', fontSize: '1.1rem', flexShrink: 0 }}>
          search
        </span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Rechercher un astronaute…"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setActiveIdx(-1) }}
          onFocus={() => { if (query) setOpen(true) }}
          onKeyDown={onKeyDown}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--color-on-surface)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); setActiveIdx(-1); syncUrl(''); inputRef.current?.focus() }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-on-surface-variant)', display: 'flex', padding: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>close</span>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <div ref={listRef}
             style={{
               position: 'absolute',
               top: '100%',
               left: 0, right: 0,
               background: 'var(--color-surface-container)',
               border: '1px solid var(--color-secondary)',
               borderTop: '1px solid rgb(255 255 255 / 0.06)',
               borderRadius: '0 0 0.75rem 0.75rem',
               overflow: 'hidden',
               zIndex: 100,
               boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
             }}>
          {suggestions.map((a, i) => {
            const color = a.planets?.color ?? 'var(--color-primary)'
            const full  = `${a.first_name} ${a.last_name}`
            const isActive = i === activeIdx

            return (
              <Link key={a.id}
                    href={href(a.id)}
                    onMouseEnter={() => setActiveIdx(i)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.6rem 1rem',
                      textDecoration: 'none',
                      background: isActive ? 'rgb(144 147 255 / 0.1)' : 'transparent',
                      borderLeft: isActive ? '2px solid var(--color-secondary)' : '2px solid transparent',
                      transition: 'background 0.1s',
                    }}>

                {/* Avatar */}
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  background: `${color}30`,
                  overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {a.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.7rem', color }}>
                      {a.first_name[0]}{a.last_name?.[0] ?? ''}
                    </span>
                  )}
                </div>

                {/* Name + role */}
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: 'var(--font-label)', fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-on-surface)', lineHeight: 1.2 }}>
                    <Highlight text={full} query={q} />
                  </p>
                  {a.role_title && (
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)' }} className="truncate">
                      {a.role_title}
                    </p>
                  )}
                </div>

                {/* Planet dot */}
                {a.planets && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
                    <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)' }}>
                      {a.planets.name}
                    </span>
                  </div>
                )}

                {/* Points */}
                <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.8rem', color, flexShrink: 0 }}>
                  {a.total_points.toLocaleString('fr-FR')}
                </span>
              </Link>
            )
          })}

          {/* Footer hint */}
          <div style={{ padding: '0.4rem 1rem', borderTop: '1px solid rgb(255 255 255 / 0.04)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', color: 'var(--color-on-surface-variant)' }}>
              ↑↓ naviguer · ↵ ouvrir · Esc fermer
            </span>
          </div>
        </div>
      )}

      {/* No results */}
      {open && q.length >= 1 && suggestions.length === 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--color-surface-container)',
          border: '1px solid rgb(255 255 255 / 0.06)',
          borderTop: 'none',
          borderRadius: '0 0 0.75rem 0.75rem',
          padding: '0.75rem 1rem',
          zIndex: 100,
        }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.78rem', color: 'var(--color-on-surface-variant)' }}>
            Aucun astronaute trouvé pour « {query} »
          </p>
        </div>
      )}
    </div>
  )
}

// Highlight matching substring
function Highlight({ text, query }) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: 'var(--color-secondary)', fontWeight: 900 }}>
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  )
}
