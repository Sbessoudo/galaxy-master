'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const RANK_LABEL  = ['1er', '2e', '3e', '4e']
const RANK_COLOR  = ['#ffd700', '#c0c0c0', '#cd7f32', 'rgba(255,255,255,0.5)']
const RANK_SHADOW = ['0 0 12px #ffd70080', '0 0 8px #c0c0c060', '0 0 8px #cd7f3260', 'none']

// Square canvas: 900×900 → circles are always perfect circles
const CX = 450
const CY = 450

const ORBIT_CONFIG = [
  { size: 100, orbitR: 145 }, // rank 1 — closest, biggest
  { size:  82, orbitR: 240 }, // rank 2
  { size:  68, orbitR: 325 }, // rank 3
  { size:  56, orbitR: 408 }, // rank 4 — farthest, smallest
]

// Angles in degrees (0 = top, clockwise)
const ANGLES = [315, 45, 225, 135]

// Stars precomputed — no recompute on render
const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: (i * 137.5) % 100,
  y: (i * 97.3) % 100,
  size: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
  opacity: 0.12 + (i % 7) * 0.06,
}))

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

  return (
    <div>
      {/* ── Square canvas — perfect circles guaranteed ─────── */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: '100%', maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ position: 'absolute', inset: 0 }}>

          {/* Stars */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', borderRadius: '1rem' }}>
            {STARS.map(s => (
              <div key={s.id} style={{
                position: 'absolute',
                left: `${s.x}%`, top: `${s.y}%`,
                width: `${s.size}px`, height: `${s.size}px`,
                borderRadius: '50%', background: '#fff', opacity: s.opacity,
              }} />
            ))}
          </div>

          {/* SVG: orbit rings (circles in a square viewBox → always round) */}
          <svg
            viewBox="0 0 900 900"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            {ORBIT_CONFIG.map((cfg, i) => (
              <circle key={i}
                cx={CX} cy={CY} r={cfg.orbitR}
                fill="none"
                stroke={ranked[i] ? `${ranked[i].color}22` : 'rgba(255,255,255,0.06)'}
                strokeWidth="1"
                strokeDasharray="4 10"
              />
            ))}
            {/* Sun corona */}
            <circle cx={CX} cy={CY} r="56" fill="rgba(255,179,71,0.07)" />
            <circle cx={CX} cy={CY} r="46" fill="rgba(255,179,71,0.12)" />
          </svg>

          {/* Sun */}
          <div style={{
            position: 'absolute',
            left: `${(CX / 900) * 100}%`,
            top:  `${(CY / 900) * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: '72px', height: '72px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, #fff7c0, #ffb347 35%, #ff6b00 65%, #cc3300)',
            boxShadow: '0 0 0 14px rgba(255,179,71,0.07), 0 0 0 32px rgba(255,107,0,0.03), 0 0 70px rgba(255,179,71,0.5)',
            zIndex: 10,
          }} />

          {/* Planets */}
          {ranked.map((planet, i) => {
            const cfg = ORBIT_CONFIG[i]
            if (!cfg) return null

            const rad = (ANGLES[i] * Math.PI) / 180
            const px  = CX + cfg.orbitR * Math.sin(rad)
            const py  = CY - cfg.orbitR * Math.cos(rad)

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
                     top:  `${(py / 900) * 100}%`,
                     transform: 'translate(-50%, -50%)',
                     zIndex: 20,
                     textDecoration: 'none',
                     cursor: 'pointer',
                   }}>

                {/* Atmosphere halo */}
                <div style={{
                  position: 'absolute',
                  inset: `-${cfg.size * 0.3}px`,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${planet.color}28 0%, transparent 70%)`,
                  opacity: isHov ? 1 : 0.5,
                  transition: 'opacity 0.3s',
                  pointerEvents: 'none',
                }} />

                {/* Planet sphere */}
                <div style={{
                  width:  `${cfg.size}px`,
                  height: `${cfg.size}px`,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: planet.color,
                  boxShadow: `0 0 ${isHov ? 44 : 22}px ${isHov ? planet.color : planet.color + '55'}, inset -4px -4px 12px rgba(0,0,0,0.4)`,
                  transition: 'box-shadow 0.25s',
                  position: 'relative',
                  flexShrink: 0,
                }}>
                  {planet.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={planet.photo_url} alt={planet.name}
                         style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  )}
                </div>

                {/* Rank badge */}
                <div style={{
                  position: 'absolute',
                  top: '-22px', left: '50%',
                  transform: 'translateX(-50%)',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900, fontSize: '0.72rem',
                  color: RANK_COLOR[i],
                  textShadow: RANK_SHADOW[i],
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}>
                  {RANK_LABEL[i]}
                </div>

                {/* Hover tooltip */}
                {isHov && (
                  <div style={{
                    position: 'absolute',
                    bottom: `${cfg.size + 14}px`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(6,14,32,0.94)',
                    backdropFilter: 'blur(14px)',
                    border: `1px solid ${planet.color}40`,
                    borderRadius: '0.75rem',
                    padding: '0.6rem 0.9rem',
                    whiteSpace: 'nowrap',
                    zIndex: 50,
                    boxShadow: `0 4px 28px ${planet.color}30`,
                    pointerEvents: 'none',
                  }}>
                    <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.85rem', color: '#fff', marginBottom: '0.15rem' }}>
                      {planet.name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '1.1rem', color: planet.color, lineHeight: 1 }}>
                      {pts.toLocaleString('fr-FR')} pts
                    </p>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.58rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.2rem' }}>
                      {planet.memberCount ?? 0} astronautes
                    </p>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </div>

    </div>
  )
}
