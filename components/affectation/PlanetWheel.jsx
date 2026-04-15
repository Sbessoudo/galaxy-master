'use client'

import { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ── Maths / helpers ──────────────────────────────────────────────────────────

/** Wheel of Fortune easing: fast start, very long slow deceleration */
function easeOutWheelOfFortune(t) { return 1 - Math.pow(1 - t, 5) }

/** Fisher-Yates shuffle (returns new array) */
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Split each planet into SPLITS equal sub-slices, then optionally shuffle them.
 * Returns array of { planet, weight } sub-sector entries.
 */
const SPLITS = 4   // each planet appears 4× on the wheel as equal mini-slices

function buildSubSectors(planets, weights, mode = 'ordered') {
  const subs = []
  if (mode === 'interleaved') {
    // Round-robin A B C D A B C D … → evenly distributed static preview
    for (let i = 0; i < SPLITS; i++) {
      planets.forEach(p => subs.push({ planet: p, weight: (weights[p.id] ?? 10) / SPLITS }))
    }
  } else {
    planets.forEach(p => {
      const w = weights[p.id] ?? 10
      for (let i = 0; i < SPLITS; i++) subs.push({ planet: p, weight: w / SPLITS })
    })
    if (mode === 'shuffled') return shuffle(subs)
  }
  return subs
}

/** Build sector descriptors from pre-built sub-sector array */
function buildSectors(subSectors) {
  const total = subSectors.reduce((s, sub) => s + sub.weight, 0)
  let cum = 0
  return subSectors.map(sub => {
    const span = (sub.weight / total) * Math.PI * 2
    const s    = { planet: sub.planet, start: cum, end: cum + span, mid: cum + span / 2 }
    cum += span
    return s
  })
}

/** Weighted random pick from sub-sectors array */
function pickWinner(subSectors) {
  const total = subSectors.reduce((s, sub) => s + sub.weight, 0)
  let r = Math.random() * total
  for (const sub of subSectors) {
    r -= sub.weight
    if (r <= 0) return sub.planet
  }
  return subSectors[subSectors.length - 1].planet
}

/** Parse a hex color like #rrggbb into { r, g, b } */
function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex)
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 100, g: 100, b: 255 }
}

// ── Canvas draw ──────────────────────────────────────────────────────────────

function drawWheel(canvas, sectors, rotation, images = {}) {
  const ctx  = canvas.getContext('2d')
  const W    = canvas.width
  const H    = canvas.height
  const cx   = W / 2
  const cy   = H / 2
  const R    = Math.min(W, H) / 2 - 12
  const HUB  = 32

  ctx.clearRect(0, 0, W, H)

  // Sectors
  sectors.forEach(s => {
    const start = s.start + rotation - Math.PI / 2
    const end   = s.end   + rotation - Math.PI / 2
    const { r, g, b } = hexToRgb(s.planet.color)

    const grad = ctx.createRadialGradient(cx, cy, HUB, cx, cy, R)
    grad.addColorStop(0, `rgba(${r},${g},${b},0.75)`)
    grad.addColorStop(1, `rgba(${r},${g},${b},1)`)

    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, R, start, end)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()
  })

  // Separator lines
  sectors.forEach(s => {
    const angle = s.start + rotation - Math.PI / 2
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(angle) * HUB, cy + Math.sin(angle) * HUB)
    ctx.lineTo(cx + Math.cos(angle) * R,   cy + Math.sin(angle) * R)
    ctx.strokeStyle = 'rgba(6,14,32,0.7)'
    ctx.lineWidth = 2
    ctx.stroke()
  })

  // Sector labels + photos
  sectors.forEach(s => {
    const mid = s.mid + rotation - Math.PI / 2
    const lr  = R * 0.65
    const lx  = cx + Math.cos(mid) * lr
    const ly  = cy + Math.sin(mid) * lr
    const img     = images[s.planet.id]
    const PHOTO_R = Math.max(14, Math.min(20, R * 0.1))

    ctx.save()
    ctx.translate(lx, ly)
    ctx.rotate(mid + Math.PI / 2)
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'

    if (img) {
      // Circular photo clip — centered in sector, no label
      ctx.save()
      ctx.beginPath()
      ctx.arc(0, 0, PHOTO_R, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(img, -PHOTO_R, -PHOTO_R, PHOTO_R * 2, PHOTO_R * 2)
      ctx.restore()

      // Thin border ring
      ctx.beginPath()
      ctx.arc(0, 0, PHOTO_R, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
    // No text fallback — color alone identifies the sector

    ctx.restore()
  })

  // Outer border — subtle
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Center hub
  const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, HUB)
  hubGrad.addColorStop(0, '#1e2a47')
  hubGrad.addColorStop(1, '#060e20')  // canvas — fixed dark hub, not theme-sensitive
  ctx.beginPath()
  ctx.arc(cx, cy, HUB, 0, Math.PI * 2)
  ctx.fillStyle = hubGrad
  ctx.fill()
  ctx.strokeStyle = 'rgba(144,147,255,0.2)'
  ctx.lineWidth   = 2
  ctx.stroke()

  ctx.font         = `${HUB * 0.95}px serif`
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowBlur   = 0
  ctx.fillText('🚀', cx, cy + 1)
}

// ── Main component ───────────────────────────────────────────────────────────

const CANVAS_SIZE = 520

export default function PlanetWheel({ planets, astronauts, isAdmin, asteroideId }) {
  const router     = useRouter()
  const canvasRef   = useRef(null)
  const animRef     = useRef(null)
  const rotRef      = useRef(0)
  const imagesRef   = useRef({})        // { planetId: HTMLImageElement }
  const sectorsRef  = useRef([])        // current sectors used for animation

  const [selectedId,  setSelectedId]  = useState('')
  const [weights,     setWeights]     = useState(() =>
    Object.fromEntries(planets.map(p => [p.id, 10]))
  )
  const [excluded,    setExcluded]    = useState(() => new Set())   // planet ids excluded from wheel
  const [spinning,    setSpinning]    = useState(false)
  const [result,      setResult]      = useState(null)    // Planet | null
  const [confirmed,   setConfirmed]   = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState(null)
  const [drawTick,    setDrawTick]    = useState(0)       // bump to trigger re-draw

  const activePlanets = useMemo(() => planets.filter(p => !excluded.has(p.id)), [planets, excluded])
  // Static display: interleaved (round-robin) so sectors are visually mixed even before spin
  const sectors = useMemo(
    () => buildSectors(buildSubSectors(activePlanets, weights, 'interleaved')),
    [activePlanets, weights]
  )

  // Preload planet photos
  useEffect(() => {
    planets.forEach(p => {
      if (!p.photo_url || imagesRef.current[p.id]) return
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = p.photo_url
      img.onload = () => { imagesRef.current[p.id] = img; setDrawTick(Date.now()) }
    })
  }, [planets])

  // Keep sectorsRef in sync with static display sectors
  useEffect(() => { sectorsRef.current = sectors }, [sectors])

  // Re-draw when sectors change or animation ticks
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawWheel(canvas, sectorsRef.current, rotRef.current, imagesRef.current)
  }, [sectors, drawTick])

  // Spin
  const spin = useCallback(() => {
    if (spinning) return
    setResult(null)
    setConfirmed(false)
    setError(null)

    if (activePlanets.length < 1) return

    // Shuffle sub-sectors for this spin → planets split into 4 mini-slices, randomly mixed
    const subSectors    = buildSubSectors(activePlanets, weights, 'shuffled')
    const spinSectors   = buildSectors(subSectors)
    sectorsRef.current  = spinSectors
    setDrawTick(Date.now())   // redraw with shuffled layout immediately

    const winner       = pickWinner(subSectors)
    // Pick the first sub-sector belonging to the winner as the landing target
    const winnerSector = spinSectors.find(s => s.planet.id === winner.id)

    // Wheel of Fortune: 3-4 full turns (slower feel) + precise final offset
    const fullTurns   = (3 + Math.floor(Math.random() * 2)) * Math.PI * 2
    const finalOff    = ((Math.PI * 2) - (winnerSector.mid % (Math.PI * 2))) % (Math.PI * 2)
    const targetDelta = fullTurns + finalOff

    const startRot  = rotRef.current
    const startTime = performance.now()
    const duration  = 9000 + Math.random() * 3000  // 9–12s, slow Wheel of Fortune pace

    setSpinning(true)

    function frame(now) {
      const t = Math.min((now - startTime) / duration, 1)
      rotRef.current = startRot + targetDelta * easeOutWheelOfFortune(t)
      if (canvasRef.current) drawWheel(canvasRef.current, sectorsRef.current, rotRef.current, imagesRef.current)
      setDrawTick(t)

      if (t < 1) {
        animRef.current = requestAnimationFrame(frame)
      } else {
        rotRef.current = startRot + targetDelta
        setDrawTick(Date.now())
        setSpinning(false)
        setResult(winner)
      }
    }

    animRef.current = requestAnimationFrame(frame)
  }, [spinning, activePlanets, weights])

  // Confirm assignment
  async function confirm() {
    if (!result || !selectedId) return
    setSaving(true)
    setError(null)
    const res  = await fetch(`/api/astronautes/${selectedId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planet_id: result.id }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSaving(false); return }
    setConfirmed(true)
    setSaving(false)
    router.refresh()
  }

  function reset() {
    setResult(null)
    setConfirmed(false)
    setSelectedId('')
  }

  const selected = astronauts.find(a => a.id === selectedId)

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: 'calc(100vh - 8rem)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* ── Page title ────────────────────────────────────────────── */}
      <div className="text-center mb-8">
        <h1 style={{
          fontFamily: 'var(--font-headline)', fontSize: '2.2rem', fontWeight: 900,
          color: 'var(--color-on-surface)', lineHeight: 1,
        }}>
          Roue des Planètes
        </h1>
        <p style={{
          fontFamily: 'var(--font-label)', fontSize: '0.72rem',
          color: 'var(--color-on-surface-variant)', marginTop: '0.5rem',
          letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>
          Tournez la roue pour affecter un astronaute à sa planète
        </p>
      </div>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 items-start justify-center">

        {/* ── Left panel : astronaut + sliders ──────────────────── */}
        <div className="flex flex-col gap-4 w-full lg:w-72 flex-shrink-0">

          {/* Astronaut selector */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--color-surface-container)' }}>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Astronaute à affecter
            </p>
            {astronauts.length === 0 ? (
              <div className="rounded-xl p-4 text-center"
                   style={{ background: 'var(--color-surface-container-highest)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: 'var(--color-on-surface-variant)', display: 'block', marginBottom: '0.4rem' }}>person_off</span>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', color: 'var(--color-on-surface-variant)' }}>
                  Aucun astronaute dans l&apos;astéroïde.
                </p>
              </div>
            ) : (
              <select
                value={selectedId}
                onChange={e => { setSelectedId(e.target.value); setResult(null); setConfirmed(false) }}
                disabled={spinning}
                style={{
                  width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.6rem',
                  background: 'var(--color-surface-container-highest)',
                  border: '1px solid rgb(255 255 255 / 0.08)',
                  color: selectedId ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)',
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none', cursor: 'pointer',
                }}
              >
                <option value="">— Choisir un astronaute —</option>
                {astronauts.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.first_name} {a.last_name}
                  </option>
                ))}
              </select>
            )}

            {/* Selected astronaut card */}
            {selected && (
              <div className="mt-3 flex items-center gap-3 p-3 rounded-xl"
                   style={{ background: 'var(--color-surface-container-highest)' }}>
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                     style={{ background: selected.planets?.color ? `${selected.planets.color}30` : 'var(--color-primary-container)' }}>
                  {selected.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={selected.photo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '0.9rem', color: selected.planets?.color ?? 'var(--color-primary)' }}>
                      {selected.first_name[0]}{selected.last_name[0]}
                    </span>
                  )}
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-label)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-on-surface)' }}>
                    {selected.first_name} {selected.last_name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.62rem', color: 'var(--color-on-surface-variant)' }}>
                    {selected.planets ? selected.planets.name : 'Sans planète'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Weight sliders — admin only */}
          {isAdmin && (
            <div className="rounded-2xl p-5" style={{ background: 'var(--color-surface-container)' }}>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Probabilités par planète
              </p>
              <div className="space-y-4">
                {planets.map(p => {
                  const isExcluded = excluded.has(p.id)
                  const w     = weights[p.id] ?? 10
                  const total = activePlanets.reduce((s, pl) => s + (weights[pl.id] ?? 10), 0)
                  const pct   = !isExcluded && total > 0 ? Math.round((w / total) * 100) : 0
                  return (
                    <div key={p.id} style={{ opacity: isExcluded ? 0.45 : 1, transition: 'opacity 0.2s' }}>
                      {/* Row : toggle switch + name + probability % */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {/* Toggle switch */}
                          <button
                            role="switch"
                            aria-checked={!isExcluded}
                            onClick={() => {
                              setExcluded(prev => {
                                const next = new Set(prev)
                                next.has(p.id) ? next.delete(p.id) : next.add(p.id)
                                return next
                              })
                              setResult(null)
                            }}
                            disabled={spinning}
                            style={{
                              width: '32px', height: '18px', borderRadius: '999px', flexShrink: 0,
                              background: isExcluded ? 'var(--color-surface-container-highest)' : p.color,
                              border: `1.5px solid ${isExcluded ? 'rgb(255 255 255 / 0.1)' : p.color}`,
                              cursor: spinning ? 'not-allowed' : 'pointer',
                              position: 'relative', transition: 'background 0.2s, border-color 0.2s',
                              padding: 0, outline: 'none',
                              boxShadow: isExcluded ? 'none' : `0 0 8px ${p.color}60`,
                            }}
                          >
                            <span style={{
                              position: 'absolute', top: '2px',
                              left: isExcluded ? '2px' : '14px',
                              width: '12px', height: '12px', borderRadius: '50%',
                              background: isExcluded ? 'rgb(255 255 255 / 0.3)' : '#fff',
                              transition: 'left 0.18s ease',
                              display: 'block',
                            }} />
                          </button>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                          <span style={{
                            fontFamily: 'var(--font-label)', fontSize: '0.75rem', fontWeight: 600,
                            color: isExcluded ? 'var(--color-on-surface-variant)' : 'var(--color-on-surface)',
                          }}>
                            {p.name}
                          </span>
                        </div>
                        <span style={{
                          fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.78rem',
                          color: isExcluded ? 'var(--color-on-surface-variant)' : p.color,
                        }}>
                          {isExcluded ? 'off' : `${pct} %`}
                        </span>
                      </div>

                      {/* Slider — weight 1-100 */}
                      <input
                        type="range" min="1" max="100"
                        value={w}
                        onChange={e => setWeights(prev => ({ ...prev, [p.id]: parseInt(e.target.value) }))}
                        disabled={spinning || isExcluded}
                        style={{
                          width: '100%', height: '6px', borderRadius: '999px',
                          appearance: 'none', outline: 'none',
                          cursor: spinning || isExcluded ? 'not-allowed' : 'pointer',
                          background: isExcluded
                            ? 'var(--color-surface-container-highest)'
                            : `linear-gradient(90deg, ${p.color} ${w}%, var(--color-surface-container-highest) ${w}%)`,
                        }}
                      />
                    </div>
                  )
                })}
              </div>
              <button
                onClick={() => { setWeights(Object.fromEntries(planets.map(p => [p.id, 10]))); setExcluded(new Set()) }}
                disabled={spinning}
                style={{
                  marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-label)', fontSize: '0.65rem',
                  color: 'var(--color-on-surface-variant)', textDecoration: 'underline',
                }}
              >
                Réinitialiser (toutes équilibrées)
              </button>
            </div>
          )}
        </div>

        {/* ── Center : wheel + spin button ──────────────────────── */}
        <div className="flex flex-col items-center gap-6 flex-1">

          {/* Wheel container */}
          <div style={{ position: 'relative', width: CANVAS_SIZE, height: CANVAS_SIZE }}>

            {/* Pointer — fixed triangle at top */}
            <div style={{
              position: 'absolute', top: '-2px', left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              width: 0, height: 0,
              borderLeft: '14px solid transparent',
              borderRight: '14px solid transparent',
              borderTop: '32px solid var(--color-primary)',
              filter: 'drop-shadow(0 0 8px var(--color-primary))',
            }} />

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              style={{ display: 'block', borderRadius: '50%' }}
            />

            {/* Result overlay — flashes the winner */}
            {result && !confirmed && (
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                boxShadow: `0 0 30px 6px ${result.color}30`,
                pointerEvents: 'none',
                transition: 'box-shadow 0.5s ease',
              }} />
            )}
          </div>

          {/* Spin button */}
          {!confirmed && (
            <button
              onClick={!selectedId ? undefined : spin}
              disabled={spinning || !selectedId || activePlanets.length < 1}
              style={{
                padding: '1.1rem 3.5rem',
                borderRadius: '999px',
                background: spinning
                  ? 'var(--color-surface-container-high)'
                  : !selectedId
                    ? 'var(--color-surface-container)'
                    : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-fixed))',
                color: spinning || !selectedId ? 'var(--color-on-surface-variant)' : 'var(--color-on-primary)',
                fontFamily: 'var(--font-headline)',
                fontSize: '1.4rem',
                fontWeight: 900,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: spinning || !selectedId ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: spinning || !selectedId ? 'none' : '0 0 40px -8px var(--color-primary)',
                transform: spinning ? 'scale(0.97)' : 'scale(1)',
              }}
            >
              {spinning ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  En orbite…
                </span>
              ) : !selectedId ? (
                '← Choisir un astronaute'
              ) : (
                '🚀 Lancer la roue'
              )}
            </button>
          )}

          {/* Result card */}
          {result && (
            <div className="rounded-2xl p-6 w-full max-w-sm text-center"
                 style={{
                   background: `${result.color}18`,
                   border: `2px solid ${result.color}60`,
                   boxShadow: `0 8px 48px -8px ${result.color}50`,
                   animation: 'result-appear 0.4s ease',
                 }}>
              {!confirmed ? (
                <>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: result.color, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Planète assignée
                  </p>
                  <p style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 900, color: result.color, lineHeight: 1, marginBottom: '0.25rem' }}>
                    {result.name}
                  </p>
                  {result.description && (
                    <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.82rem', marginBottom: '1rem' }}>
                      {result.description}
                    </p>
                  )}

                  {error && (
                    <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', fontFamily: 'var(--font-label)', marginBottom: '0.75rem' }}>
                      {error}
                    </p>
                  )}

                  {isAdmin && (
                    <div className="flex gap-3 justify-center mt-4">
                      <button onClick={confirm} disabled={saving}
                              style={{
                                padding: '0.65rem 1.5rem', borderRadius: '999px',
                                background: result.color, color: 'var(--color-on-primary)',
                                fontFamily: 'var(--font-label)', fontWeight: 700, fontSize: '0.85rem',
                                border: 'none', cursor: saving ? 'wait' : 'pointer',
                                boxShadow: `0 0 20px -4px ${result.color}`,
                              }}>
                        {saving ? 'Assignation…' : '✓ Confirmer l\'affectation'}
                      </button>
                      <button onClick={reset}
                              style={{
                                padding: '0.65rem 1rem', borderRadius: '999px',
                                background: 'var(--color-surface-container-highest)',
                                color: 'var(--color-on-surface-variant)',
                                fontFamily: 'var(--font-label)', fontWeight: 600, fontSize: '0.85rem',
                                border: 'none', cursor: 'pointer',
                              }}>
                        Relancer
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p style={{ fontSize: '2.5rem', lineHeight: 1, marginBottom: '0.5rem' }}>🎉</p>
                  <p style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 900, color: result.color, lineHeight: 1.2 }}>
                    Bienvenue dans la {result.name} !
                  </p>
                  {selected && (
                    <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                      {selected.first_name} {selected.last_name} a rejoint l&apos;équipage.
                    </p>
                  )}
                  <button onClick={reset}
                          style={{
                            marginTop: '1rem', padding: '0.55rem 1.25rem', borderRadius: '999px',
                            background: 'var(--color-surface-container-highest)',
                            color: 'var(--color-on-surface-variant)',
                            fontFamily: 'var(--font-label)', fontWeight: 600, fontSize: '0.82rem',
                            border: 'none', cursor: 'pointer',
                          }}>
                    Affecter un autre astronaute
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes result-appear {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        input[type=range]::-webkit-slider-thumb {
          appearance: none;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: var(--color-secondary);
          cursor: pointer;
          box-shadow: 0 0 6px var(--color-secondary);
        }
      `}</style>
    </div>
  )
}
