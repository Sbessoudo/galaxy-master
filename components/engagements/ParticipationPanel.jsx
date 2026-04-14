'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

export default function ParticipationPanel({ eventId, astronautes, presentIds, isAdmin, planetColor }) {
  const router = useRouter()
  const [present, setPresent] = useState(new Set(presentIds))
  const [loading, setLoading] = useState(new Set())
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return astronautes.filter(a =>
      `${a.first_name} ${a.last_name}`.toLowerCase().includes(q) ||
      (a.planets?.name ?? '').toLowerCase().includes(q)
    )
  }, [astronautes, search])

  async function toggle(astronautId) {
    if (!isAdmin) return
    setLoading(l => new Set(l).add(astronautId))

    const res = await fetch(`/api/engagements/${eventId}/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ astronaut_id: astronautId }),
    })
    const data = await res.json()

    setPresent(prev => {
      const next = new Set(prev)
      data.present ? next.add(astronautId) : next.delete(astronautId)
      return next
    })
    setLoading(l => { const n = new Set(l); n.delete(astronautId); return n })
    router.refresh()
  }

  return (
    <div>
      {/* Stats */}
      <div className="flex items-center gap-4 mb-5 p-4 rounded-xl" style={{ background: 'var(--color-surface-container-highest)' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-headline)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
            {present.size}
          </p>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Présents
          </p>
        </div>
        <div style={{ width: '1px', height: '2rem', background: 'rgb(255 255 255 / 0.08)' }} />
        <div>
          <p style={{ fontFamily: 'var(--font-headline)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1 }}>
            {astronautes.length}
          </p>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Astronautes
          </p>
        </div>
        {astronautes.length > 0 && (
          <>
            <div style={{ width: '1px', height: '2rem', background: 'rgb(255 255 255 / 0.08)' }} />
            <div>
              <p style={{ fontFamily: 'var(--font-headline)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1 }}>
                {Math.round((present.size / astronautes.length) * 100)}%
              </p>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Taux
              </p>
            </div>
          </>
        )}
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Rechercher un astronaute…"
        style={{
          width: '100%', padding: '0.6rem 0.9rem', borderRadius: '0.6rem', marginBottom: '0.75rem',
          background: 'var(--color-surface-container-highest)', border: '1px solid rgb(255 255 255 / 0.08)',
          color: 'var(--color-on-surface)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none',
        }}
      />

      {/* List */}
      <div className="space-y-1">
        {filtered.map(a => {
          const isPresent = present.has(a.id)
          const isLoading = loading.has(a.id)
          const color = a.planets?.color ?? 'var(--color-on-surface-variant)'

          return (
            <button
              key={a.id}
              onClick={() => toggle(a.id)}
              disabled={!isAdmin || isLoading}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                width: '100%', padding: '0.65rem 0.75rem', borderRadius: '0.65rem',
                background: isPresent ? `${color}15` : 'var(--color-surface-container-highest)',
                border: `1px solid ${isPresent ? color + '40' : 'transparent'}`,
                cursor: isAdmin ? 'pointer' : 'default',
                transition: 'all 0.15s', textAlign: 'left',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '2rem', height: '2rem', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${color}30`,
              }}>
                <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.7rem', fontWeight: 700, color }}>
                  {a.first_name[0]}{a.last_name[0]}
                </span>
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                  {a.first_name} {a.last_name}
                </p>
                {a.planets && (
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color }}>
                    {a.planets.name}
                  </p>
                )}
              </div>

              {/* Status */}
              <span className="material-symbols-outlined" style={{
                fontSize: '1.1rem', flexShrink: 0,
                color: isPresent ? color : 'var(--color-surface-container)',
              }}>
                {isPresent ? 'check_circle' : 'radio_button_unchecked'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
