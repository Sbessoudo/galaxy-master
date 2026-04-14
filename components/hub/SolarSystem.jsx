'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const RANK_LABEL  = ['1er', '2e', '3e', '4e']
const RANK_COLOR  = ['#ffd700', '#c0c0c0', '#cd7f32', 'rgba(255,255,255,0.5)']
const RANK_SHADOW = ['0 0 12px #ffd70080', '0 0 8px #c0c0c060', '0 0 8px #cd7f3260', 'none']

// Static orbit positions (angle in degrees from top, distance from center)
const ORBIT_CONFIG = [
  { size: 96,  orbitR: 115 }, // rank 1 — closest, biggest
  { size: 78,  orbitR: 200 }, // rank 2
  { size: 64,  orbitR: 278 }, // rank 3
  { size: 54,  orbitR: 348 }, // rank 4 — farthest, smallest
]

// Distribute planets around the sun (angles in degrees)
const ANGLES = [315, 45, 225, 135]

export default function SolarSystem({ planets, activeSeason }) {
  const [hovered, setHovered] = useState(null)
  const searchParams = useSearchParams()
  const previewId    = searchParams.get('preview')
  const planetHref   = (id) => previewId ? `/hub/planetes/${id}?preview=${previewId}` : `/hub/planetes/${id}`

  const ranked = [...planets].sort((a, b) => {
    const pA = activeSeason ? (a.planet_season_points?.find(p => p.season_id === activeSeason.id)?.total_points ?? 0) : 0
    const pB = activeSeason ? (b.planet_season_points?.find(p => p.season_id === activeSeason.id)?.total_points ?? 0) : 0
    return pB - pA
  })

  const maxPts = Math.max(1, ...ranked.map(p =>
    activeSeason ? (p.planet_season_points?.find(sp => sp.season_id === activeSeason.id)?.total_points ?? 0) : 0
  ))

  // Canvas: 900×620, sun at center
  const CX = 450
  const CY = 310

  return (
    <div style={{ width: '100%', display: 'flex', gap: '1.5rem', alignItems: 'stretch' }}>

      {/* Solar system canvas */}
      <div style={{ position: 'relative', flex: '1 1 0', minWidth: 0, paddingBottom: '68.89%', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>

          {/* Stars */}
          <Stars />

          {/* SVG layer: orbit rings + planet connections */}
          <svg viewBox="0 0 900 620" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>

            {/* Orbit rings */}
            {ORBIT_CONFIG.map((cfg, i) => (
              <circle key={i}
                cx={CX} cy={CY}
                r={cfg.orbitR}
                fill="none"
                stroke={ranked[i] ? `${ranked[i].color}25` : 'rgba(255,255,255,0.06)'}
                strokeWidth="1"
                strokeDasharray="4 8"
              />
            ))}

            {/* Sun corona rings */}
            <circle cx={CX} cy={CY} r="52" fill="rgba(255,179,71,0.06)" />
            <circle cx={CX} cy={CY} r="44" fill="rgba(255,179,71,0.10)" />
          </svg>

          {/* Sun */}
          <div style={{
            position: 'absolute',
            left: `${(CX / 900) * 100}%`,
            top:  `${(CY / 620) * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: '72px', height: '72px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, #fff7c0, #ffb347 35%, #ff6b00 65%, #cc3300)',
            boxShadow: '0 0 0 12px rgba(255,179,71,0.08), 0 0 0 28px rgba(255,107,0,0.04), 0 0 60px rgba(255,179,71,0.5)',
            zIndex: 10,
            flexShrink: 0,
          }} />

          {/* Planets */}
          {ranked.map((planet, i) => {
            const cfg   = ORBIT_CONFIG[i]
            if (!cfg) return null

            const angleDeg = ANGLES[i] ?? (i * 90)
            const angleRad = (angleDeg * Math.PI) / 180
            const px = CX + cfg.orbitR * Math.sin(angleRad)
            const py = CY - cfg.orbitR * Math.cos(angleRad)

            const pts   = activeSeason
              ? (planet.planet_season_points?.find(sp => sp.season_id === activeSeason.id)?.total_points ?? 0)
              : 0
            const isHov = hovered === planet.id

            return (
              <Link key={planet.id}
                   href={planetHref(planet.id)}
                   onMouseEnter={() => setHovered(planet.id)}
                   onMouseLeave={() => setHovered(null)}
                   style={{
                     position: 'absolute',
                     left: `${(px / 900) * 100}%`,
                     top:  `${(py / 620) * 100}%`,
                     transform: 'translate(-50%, -50%)',
                     zIndex: 20,
                     cursor: 'pointer',
                     textDecoration: 'none',
                   }}>

                {/* Atmosphere halo */}
                <div style={{
                  position: 'absolute',
                  inset: `-${cfg.size * 0.25}px`,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${planet.color}25 0%, transparent 70%)`,
                  transition: 'opacity 0.3s',
                  opacity: isHov ? 1 : 0.5,
                  pointerEvents: 'none',
                }} />

                {/* Planet sphere */}
                <div style={{
                  width: `${cfg.size}px`,
                  height: `${cfg.size}px`,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: planet.color,
                  boxShadow: `0 0 ${isHov ? 40 : 20}px ${isHov ? planet.color : planet.color + '60'}, inset -4px -4px 12px rgba(0,0,0,0.4)`,
                  transition: 'box-shadow 0.3s',
                  position: 'relative',
                  flexShrink: 0,
                }}>
                  {planet.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={planet.photo_url}
                      alt={planet.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    />
                  )}
                </div>

                {/* Rank badge */}
                <div style={{
                  position: 'absolute',
                  top: '-22px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900,
                  fontSize: '0.75rem',
                  color: RANK_COLOR[i],
                  textShadow: RANK_SHADOW[i],
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}>
                  {RANK_LABEL[i]}
                </div>

                {/* Hover tooltip */}
                {isHov && (
                  <div onClick={e => e.stopPropagation()} style={{
                    position: 'absolute',
                    bottom: `${cfg.size + 14}px`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(6,14,32,0.92)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${planet.color}40`,
                    borderRadius: '0.75rem',
                    padding: '0.6rem 0.9rem',
                    whiteSpace: 'nowrap',
                    zIndex: 50,
                    boxShadow: `0 4px 24px ${planet.color}30`,
                    pointerEvents: 'none',
                  }}>
                    <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.85rem', color: '#fff', marginBottom: '0.2rem' }}>
                      {planet.name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '1.1rem', color: planet.color, lineHeight: 1 }}>
                      {pts.toLocaleString('fr-FR')} pts
                    </p>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>
                      {planet.astronauts?.[0]?.count ?? 0} astronautes
                    </p>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Right stat cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '220px', flexShrink: 0, justifyContent: 'center' }}>
        {ranked.map((planet, i) => {
          const pts   = activeSeason
            ? (planet.planet_season_points?.find(sp => sp.season_id === activeSeason.id)?.total_points ?? 0)
            : 0
          const pct   = Math.round((pts / maxPts) * 100)
          const count = planet.astronauts?.[0]?.count ?? 0

          return (
            <Link key={planet.id}
                 href={planetHref(planet.id)}
                 style={{
                   background: 'var(--color-surface-container)',
                   borderRadius: '1rem',
                   padding: '1rem',
                   border: `1px solid ${planet.color}20`,
                   boxShadow: i === 0 ? `0 4px 24px -4px ${planet.color}30` : 'none',
                   textDecoration: 'none',
                   display: 'block',
                   transition: 'opacity 0.15s',
                 }}
                 className="hover:opacity-80">

              <div className="flex items-center gap-2 mb-3">
                {/* Mini planet */}
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  background: planet.color,
                  boxShadow: `0 0 12px ${planet.color}60`,
                  overflow: 'hidden',
                }}>
                  {planet.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={planet.photo_url} alt={planet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '0.85rem', color: '#fff', lineHeight: 1.2 }} className="truncate">
                    {planet.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)' }}>
                    {count} astronaute{count !== 1 ? 's' : ''}
                  </p>
                </div>
                <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '0.75rem', color: RANK_COLOR[i], textShadow: RANK_SHADOW[i], flexShrink: 0 }}>
                  {RANK_LABEL[i]}
                </span>
              </div>

              {/* Points */}
              <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '1.5rem', color: planet.color, lineHeight: 1, marginBottom: '0.5rem' }}>
                {pts.toLocaleString('fr-FR')}
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400, marginLeft: '0.3rem' }}>pts</span>
              </p>

              {/* Bar */}
              <div style={{ height: '4px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pct}%`, borderRadius: '999px',
                  background: planet.color,
                  boxShadow: `0 0 6px ${planet.color}`,
                }} />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function Stars() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: (i * 137.5) % 100,
    y: (i * 97.3) % 100,
    size: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
    opacity: 0.15 + (i % 7) * 0.07,
  }))

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.x}%`, top: `${s.y}%`,
          width: `${s.size}px`, height: `${s.size}px`,
          borderRadius: '50%',
          background: '#ffffff',
          opacity: s.opacity,
        }} />
      ))}
    </div>
  )
}
