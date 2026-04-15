'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ── API helpers ────────────────────────────────────────────────────────────
async function apiToggle(eventId, astronautId) {
  const res = await fetch(`/api/engagements/${eventId}/participants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ astronaut_id: astronautId }),
  })
  if (!res.ok) throw new Error('API error')
  return res.json() // { present: boolean }
}

async function apiSetPoints(eventId, astronautId, points) {
  const res = await fetch(`/api/engagements/${eventId}/participants`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ astronaut_id: astronautId, points_awarded: points }),
  })
  if (!res.ok) throw new Error('API error')
  return res.json() // { points_awarded: number }
}

// ── Astronaut chip ─────────────────────────────────────────────────────────
function AstronautChip({ astronaut, present, loading, isAdmin, onToggle, points, onPointsSave }) {
  const color    = astronaut.planets?.color ?? 'var(--color-on-surface-variant)'
  const initials = `${astronaut.first_name?.[0] ?? '?'}${astronaut.last_name?.[0] ?? ''}`

  const [editingPts, setEditingPts]   = useState(false)
  const [ptsInput,   setPtsInput]     = useState(String(points ?? 0))
  const [ptsSaving,  setPtsSaving]    = useState(false)

  // Sync input if points prop changes externally
  useState(() => { setPtsInput(String(points ?? 0)) }, [points])

  async function savePts(e) {
    e.stopPropagation()
    const val = parseInt(ptsInput, 10)
    if (isNaN(val) || val < 0) { setEditingPts(false); setPtsInput(String(points ?? 0)); return }
    if (val === (points ?? 0)) { setEditingPts(false); return }
    setPtsSaving(true)
    await onPointsSave(astronaut.id, val)
    setPtsSaving(false)
    setEditingPts(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') savePts(e)
    if (e.key === 'Escape') { setEditingPts(false); setPtsInput(String(points ?? 0)) }
  }

  return (
    <div aria-busy={loading || undefined}
         style={{
           display: 'flex', alignItems: 'center', gap: '0.35rem',
           padding: '0.5rem 0.6rem',
           borderRadius: '0.65rem',
           border: `1px solid ${present ? color + '50' : 'rgb(255 255 255 / 0.05)'}`,
           background: present ? `${color}18` : 'var(--color-surface-container-highest)',
           transition: 'all 0.13s',
           opacity: loading ? 0.5 : 1,
           position: 'relative',
         }}>
      {/* Toggle button (avatar + name) */}
      <button
        onClick={() => isAdmin && onToggle(astronaut.id)}
        disabled={!isAdmin || loading}
        aria-pressed={present}
        aria-label={`${astronaut.first_name} ${astronaut.last_name} — ${present ? 'présent, cliquer pour marquer absent' : 'absent, cliquer pour marquer présent'}`}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          flex: 1, minWidth: 0,
          background: 'none', border: 'none', cursor: isAdmin ? 'pointer' : 'default',
          padding: 0, outline: 'none', textAlign: 'left',
        }}
      >
        {/* Avatar */}
        <div style={{
          width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
          background: present ? `${color}35` : `${color}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: present ? `1.5px solid ${color}60` : '1.5px solid transparent',
          transition: 'all 0.13s',
        }}>
          {astronaut.photo_url?.startsWith('https://') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={astronaut.photo_url} alt={`${astronaut.first_name} ${astronaut.last_name}`}
                 style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          ) : (
            <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.65rem', fontWeight: 800, color: present ? color : 'var(--color-on-surface-variant)' }}>
              {initials}
            </span>
          )}
        </div>

        {/* Name */}
        <p style={{
          fontFamily: 'var(--font-label)', fontWeight: present ? 700 : 500,
          fontSize: '0.72rem', lineHeight: 1.2, flex: 1, minWidth: 0,
          color: present ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {astronaut.first_name} {astronaut.last_name}
        </p>
      </button>

      {/* Points — visible only when present */}
      {present && (
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {isAdmin && editingPts ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <input
                type="number" min="0"
                value={ptsInput}
                aria-label={`Points de participation pour ${astronaut.first_name} ${astronaut.last_name}`}
                onChange={e => setPtsInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={savePts}
                autoFocus
                onClick={e => e.stopPropagation()}
                style={{
                  width: '46px', padding: '0.15rem 0.3rem',
                  background: 'var(--color-surface-container-highest)',
                  border: `1px solid ${color}60`,
                  borderRadius: '0.3rem',
                  color: 'var(--color-on-surface)',
                  fontFamily: 'var(--font-headline)', fontSize: '0.7rem', fontWeight: 800,
                  outline: 'none', textAlign: 'right',
                }}
              />
              {ptsSaving ? (
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', border: `1.5px solid ${color}40`, borderTopColor: color, animation: 'spin 0.6s linear infinite', display: 'inline-block', flexShrink: 0 }} />
              ) : (
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.58rem', color: 'var(--color-on-surface-variant)' }}>pts</span>
              )}
            </div>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); if (isAdmin) { setPtsInput(String(points ?? 0)); setEditingPts(true) } }}
              aria-label={`Points de participation de ${astronaut.first_name} ${astronaut.last_name} : ${points ?? 0}${isAdmin ? ' — cliquer pour modifier' : ''}`}
              style={{
                background: (points ?? 0) > 0 ? `${color}25` : 'rgb(255 255 255 / 0.05)',
                border: `1px solid ${(points ?? 0) > 0 ? color + '40' : 'transparent'}`,
                borderRadius: '999px',
                padding: '0.1rem 0.4rem',
                cursor: isAdmin ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', gap: '0.2rem',
              }}
            >
              <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.65rem', color: (points ?? 0) > 0 ? color : 'var(--color-on-surface-variant)' }}>
                {(points ?? 0) > 0 ? `+${points}` : '0'}
              </span>
              {isAdmin && (
                <span className="material-symbols-outlined" style={{ fontSize: '0.7rem', color: 'var(--color-on-surface-variant)' }}>edit</span>
              )}
            </button>
          )}
        </div>
      )}

      {/* State icon */}
      {loading ? (
        <span aria-hidden="true" style={{
          width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0,
          border: `2px solid ${color}40`, borderTopColor: color,
          animation: 'spin 0.6s linear infinite',
          display: 'inline-block',
        }} />
      ) : (
        <button
          onClick={() => isAdmin && onToggle(astronaut.id)}
          disabled={!isAdmin || loading}
          style={{ background: 'none', border: 'none', cursor: isAdmin ? 'pointer' : 'default', display: 'flex', padding: 0, flexShrink: 0 }}
        >
          <span className="material-symbols-outlined" style={{
            fontSize: '1rem',
            color: present ? color : 'rgb(255 255 255 / 0.12)',
            transition: 'color 0.13s',
          }}>
            {present ? 'check_circle' : 'circle'}
          </span>
        </button>
      )}
    </div>
  )
}

// ── Planet group ───────────────────────────────────────────────────────────
function PlanetGroup({ planet, members, present, loading, isAdmin, onToggle, onBulk, filter, pointsMap, onPointsSave }) {
  const color        = planet?.color ?? 'var(--color-on-surface-variant)'
  const presentCount = members.filter(a => present.has(a.id)).length
  const total        = members.length
  const pct          = total > 0 ? Math.round((presentCount / total) * 100) : 0
  const allPresent   = presentCount === total
  const anyLoading   = members.some(a => loading.has(a.id))

  const visible = members.filter(a => {
    if (filter === 'présents')  return present.has(a.id)
    if (filter === 'absents')   return !present.has(a.id)
    return true
  })

  if (visible.length === 0) return null

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {/* Planet header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        marginBottom: '0.6rem',
      }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0, boxShadow: `0 0 6px ${color}` }} />
        <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '0.82rem', color, flex: 1 }}>
          {planet?.name ?? 'Sans planète'}
        </span>

        {/* Present count badge */}
        <span style={{
          fontFamily: 'var(--font-label)', fontSize: '0.62rem', fontWeight: 700,
          color: presentCount > 0 ? color : 'var(--color-on-surface-variant)',
          background: presentCount > 0 ? `${color}18` : 'var(--color-surface-container-highest)',
          padding: '0.15rem 0.45rem', borderRadius: '999px',
          border: `1px solid ${presentCount > 0 ? color + '30' : 'transparent'}`,
        }}>
          {presentCount}/{total}
        </span>

        {/* Bulk toggle — admin only */}
        {isAdmin && filter === 'tous' && (
          <button
            onClick={() => onBulk(members.map(a => a.id), !allPresent)}
            disabled={anyLoading}
            title={allPresent ? 'Tout décocher' : 'Tout cocher'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.25rem',
              color: allPresent ? color : 'var(--color-on-surface-variant)',
              fontFamily: 'var(--font-label)', fontSize: '0.62rem',
              padding: '0.2rem 0.4rem', borderRadius: '0.4rem',
              opacity: anyLoading ? 0.5 : 1,
              transition: 'color 0.15s',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>
              {allPresent ? 'deselect' : 'select_all'}
            </span>
            {allPresent ? 'Tout décocher' : 'Tout cocher'}
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ height: '3px', borderRadius: '999px', background: 'rgb(255 255 255 / 0.05)', marginBottom: '0.6rem', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: '999px',
          background: color, transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Chips grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.35rem' }}>
        {visible.map(a => (
          <AstronautChip
            key={a.id}
            astronaut={a}
            present={present.has(a.id)}
            loading={loading.has(a.id)}
            isAdmin={isAdmin}
            onToggle={onToggle}
            points={pointsMap[a.id] ?? 0}
            onPointsSave={onPointsSave}
          />
        ))}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function ParticipationPanel({ eventId, astronautes, presentIds, isAdmin, initialPoints = {} }) {
  const router  = useRouter()
  const [present,   setPresent]   = useState(() => new Set(presentIds))
  const [loading,   setLoading]   = useState(() => new Set())
  const [pointsMap, setPointsMap] = useState(initialPoints) // { astronaut_id: points }
  const [search,    setSearch]    = useState('')
  const [filter,    setFilter]    = useState('tous') // 'tous' | 'présents' | 'absents'
  const [apiError,  setApiError]  = useState(null)

  // Toggle a single astronaut
  const toggle = useCallback(async (id) => {
    if (!isAdmin) return
    setApiError(null)
    setLoading(l => new Set(l).add(id))
    try {
      const data = await apiToggle(eventId, id)
      setPresent(prev => {
        const next = new Set(prev)
        data.present ? next.add(id) : next.delete(id)
        return next
      })
      router.refresh()
    } catch {
      setApiError('Erreur lors de la mise à jour — réessayez.')
    } finally {
      setLoading(l => { const n = new Set(l); n.delete(id); return n })
    }
  }, [eventId, isAdmin, router])

  // Update points for a participant
  const savePoints = useCallback(async (astronautId, pts) => {
    setApiError(null)
    try {
      const data = await apiSetPoints(eventId, astronautId, pts)
      setPointsMap(prev => ({ ...prev, [astronautId]: data.points_awarded }))
      router.refresh()
    } catch {
      setApiError('Erreur lors de la mise à jour des points.')
    }
  }, [eventId, router])

  // Bulk toggle (whole planet) — parallel calls, apply only successes
  const bulkToggle = useCallback(async (ids, targetState) => {
    if (!isAdmin) return
    const toChange = ids.filter(id => present.has(id) !== targetState)
    if (!toChange.length) return

    setApiError(null)
    setLoading(l => { const n = new Set(l); toChange.forEach(id => n.add(id)); return n })
    try {
      const results = await Promise.allSettled(toChange.map(id => apiToggle(eventId, id)))
      const succeeded = toChange.filter((_, i) => results[i].status === 'fulfilled')
      const failed    = toChange.length - succeeded.length

      setPresent(prev => {
        const next = new Set(prev)
        succeeded.forEach(id => targetState ? next.add(id) : next.delete(id))
        return next
      })
      if (failed > 0) setApiError(`${failed} mise(s) à jour ont échoué.`)
      router.refresh()
    } finally {
      setLoading(l => { const n = new Set(l); toChange.forEach(id => n.delete(id)); return n })
    }
  }, [eventId, isAdmin, present, router])

  // Group astronauts by planet
  const groups = useMemo(() => {
    const q = search.trim().toLowerCase()
    const filtered = q
      ? astronautes.filter(a =>
          `${a.first_name} ${a.last_name}`.toLowerCase().includes(q) ||
          (a.planets?.name ?? '').toLowerCase().includes(q)
        )
      : astronautes

    const map = new Map()
    for (const a of filtered) {
      const key = a.planet_id ?? '__none__'
      if (!map.has(key)) map.set(key, { planet: a.planets ?? null, members: [] })
      map.get(key).members.push(a)
    }
    return [...map.values()]
  }, [astronautes, search])

  const presentCount = present.size
  const totalCount   = astronautes.length
  const taux         = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0

  const FILTERS = ['tous', 'présents', 'absents']

  return (
    <div>

      {/* ── Global stats ─────────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.5rem', marginBottom: '1rem',
      }}>
        {[
          { label: 'Présents',    value: presentCount,              color: 'var(--color-primary)' },
          { label: 'Absents',     value: totalCount - presentCount, color: 'var(--color-on-surface-variant)' },
          { label: 'Taux',        value: `${taux}%`,                color: taux >= 50 ? 'var(--color-success)' : 'var(--color-on-surface-variant)' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '0.75rem', borderRadius: '0.75rem',
            background: 'var(--color-surface-container-highest)',
            textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'var(--font-headline)', fontSize: '1.5rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>
              {s.value}
            </p>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.58rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.2rem' }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Global progress bar ──────────────────────────── */}
      <div style={{ height: '4px', borderRadius: '999px', background: 'rgb(255 255 255 / 0.05)', marginBottom: '1rem', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${taux}%`, borderRadius: '999px',
          background: `linear-gradient(90deg, var(--color-primary), var(--color-secondary))`,
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* ── Search + filter tabs ─────────────────────────── */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
        {/* Search */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: '0.4rem',
          background: 'var(--color-surface-container-highest)',
          border: '1px solid rgb(255 255 255 / 0.07)',
          borderRadius: '0.6rem', padding: '0.4rem 0.7rem',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '0.95rem', color: 'var(--color-on-surface-variant)', flexShrink: 0 }}>search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--color-on-surface)', fontFamily: 'var(--font-body)', fontSize: '0.8rem',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: 'var(--color-on-surface-variant)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>close</span>
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--color-surface-container-highest)', borderRadius: '0.6rem', padding: '0.2rem' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? 'var(--color-surface-container)' : 'none',
              border: 'none', cursor: 'pointer',
              padding: '0.3rem 0.6rem', borderRadius: '0.4rem',
              fontFamily: 'var(--font-label)', fontSize: '0.65rem', fontWeight: filter === f ? 700 : 400,
              color: filter === f ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)',
              transition: 'all 0.12s', whiteSpace: 'nowrap',
              textTransform: 'capitalize',
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Planet groups ────────────────────────────────── */}
      {groups.length === 0 ? (
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
          Aucun astronaute trouvé.
        </p>
      ) : (
        groups.map(({ planet, members }) => (
          <PlanetGroup
            key={planet?.id ?? '__none__'}
            planet={planet}
            members={members}
            present={present}
            loading={loading}
            isAdmin={isAdmin}
            onToggle={toggle}
            onBulk={bulkToggle}
            filter={filter}
            pointsMap={pointsMap}
            onPointsSave={savePoints}
          />
        ))
      )}

      {/* API error banner */}
      {apiError && (
        <div style={{
          marginTop: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.6rem',
          background: 'rgb(255 80 80 / 0.1)', border: '1px solid rgb(255 80 80 / 0.25)',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', color: '#ff5050' }}>error</span>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', color: '#ff8080', flex: 1 }}>{apiError}</p>
          <button onClick={() => setApiError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>close</span>
          </button>
        </div>
      )}
    </div>
  )
}
