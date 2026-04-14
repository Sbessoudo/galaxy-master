'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const RANK_LABEL  = ['1er', '2e', '3e', '4e']
const RANK_COLOR  = ['#ffd700', '#c0c0c0', '#cd7f32', 'rgba(255,255,255,0.5)']
const RANK_SHADOW = ['0 0 12px #ffd70080', '0 0 8px #c0c0c060', '0 0 8px #cd7f3260', 'none']

// Orbits — closer to center, each with its own speed
const ORBIT_CONFIG = [
  { size: 88,  orbitR: 100, duration: 12 }, // rank 1 — closest, fastest
  { size: 72,  orbitR: 168, duration: 20 }, // rank 2
  { size: 58,  orbitR: 232, duration: 30 }, // rank 3
  { size: 48,  orbitR: 290, duration: 42 }, // rank 4 — farthest, slowest
]

// Initial angles so planets start spread out nicely
const INITIAL_ANGLES = [315, 45, 225, 135]

const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: (i * 137.5) % 100,
  y: (i * 97.3) % 100,
  size: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
  opacity: 0.10 + (i % 7) * 0.055,
}))

export default function SolarSystem({ planets = [], activeSeason }) {
  const [hovered, setHovered] = useState(null)
  const searchParams = useSearchParams()
  const previewId    = searchParams.get('preview')
  const planetHref   = (id) => previewId
    ? `/hub/planetes/${id}?preview=${encodeURIComponent(previewId)}`
    : `/hub/planetes/${id}`

  const ranked = useMemo(() =>
    [...planets]
      .map(p => ({
        ...p,
        _pts: activeSeason
          ? (p.planet_season_points?.find(sp => sp.season_id === activeSeason.id)?.total_points ?? 0)
          : 0,
      }))
      .sort((a, b) => b._pts - a._pts),
  [planets, activeSeason])

  // Canvas size: the max orbit radius + largest planet half + some padding
  const canvasHalf = ORBIT_CONFIG[ORBIT_CONFIG.length - 1].orbitR
    + ORBIT_CONFIG[0].size / 2
    + 32  // padding
  const canvasSize = canvasHalf * 2  // ~684

  return (
    <div style={{ width: '100%', maxWidth: '680px', margin: '0 auto' }}>

      {/* Square canvas — aspect ratio locked via paddingBottom trick */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
        <div style={{ position: 'absolute', inset: 0 }}>

          {/* Stars */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {STARS.map(s => (
              <div key={s.id} style={{
                position: 'absolute',
                left: `${s.x}%`, top: `${s.y}%`,
                width: `${s.size}px`, height: `${s.size}px`,
                borderRadius: '50%', background: '#fff', opacity: s.opacity,
              }} />
            ))}
          </div>

          {/* SVG — orbit rings (square viewBox = perfect circles always) */}
          <svg
            viewBox={`0 0 ${canvasSize} ${canvasSize}`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            {ORBIT_CONFIG.map((cfg, i) => (
              <circle key={cfg.orbitR}
                cx={canvasHalf} cy={canvasHalf}
                r={cfg.orbitR}
                fill="none"
                stroke={ranked[i] ? `${ranked[i].color}20` : 'rgba(255,255,255,0.05)'}
                strokeWidth="1"
                strokeDasharray="3 9"
              />
            ))}
            {/* Sun corona halos */}
            <circle cx={canvasHalf} cy={canvasHalf} r="52" fill="rgba(255,179,71,0.07)" />
            <circle cx={canvasHalf} cy={canvasHalf} r="42" fill="rgba(255,179,71,0.12)" />
          </svg>

          {/* Sun — centered via percentage */}
          <div style={{
            position: 'absolute',
            left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '64px', height: '64px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 32%, #fff7c0, #ffb347 32%, #ff6b00 62%, #cc3300)',
            boxShadow: '0 0 0 12px rgba(255,179,71,0.07), 0 0 0 28px rgba(255,107,0,0.03), 0 0 60px rgba(255,179,71,0.55)',
            zIndex: 10,
          }} />

          {/* Planets — orbit arm technique */}
          {ranked.map((planet, i) => {
            const cfg      = ORBIT_CONFIG[i]
            if (!cfg) return null

            const pts      = planet._pts
            const isHov    = hovered === planet.id
            const initDeg  = INITIAL_ANGLES[i] ?? i * 90

            // Orbit arm: centered at sun, rotates 360° continuously
            // Planet counter-rotates so it stays upright
            return (
              <div key={planet.id} style={{
                position: 'absolute',
                left: '50%', top: '50%',
                width: 0, height: 0,
                // Arm starts pointing "up" (negative Y); initDeg offsets start position
                transform: `rotate(${initDeg}deg)`,
              }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: cfg.duration, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    // Arm: zero width, height = orbitR, origin at sun center
                    width: 0,
                    height: `${cfg.orbitR}px`,
                    top: `-${cfg.orbitR}px`,
                    left: 0,
                    transformOrigin: `0px ${cfg.orbitR}px`,
                  }}
                >
                  {/* Planet — counter-rotate to stay upright, positioned at arm tip */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: cfg.duration, repeat: Infinity, ease: 'linear' }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      transform: `translate(-50%, -50%) rotate(-${initDeg}deg)`,
                      zIndex: isHov ? 40 : 20,
                    }}
                  >
                    <Link
                      href={planetHref(planet.id)}
                      onMouseEnter={() => setHovered(planet.id)}
                      onMouseLeave={() => setHovered(null)}
                      style={{ display: 'block', textDecoration: 'none', cursor: 'pointer', position: 'relative' }}
                    >
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
                        boxShadow: `0 0 ${isHov ? 40 : 18}px ${isHov ? planet.color : planet.color + '50'}, inset -3px -3px 10px rgba(0,0,0,0.35)`,
                        transition: 'box-shadow 0.25s',
                        flexShrink: 0,
                      }}>
                        {planet.photo_url?.startsWith('https://') && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={planet.photo_url} alt={planet.name}
                               style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        )}
                      </div>

                      {/* Rank badge */}
                      <div style={{
                        position: 'absolute',
                        top: '-20px', left: '50%',
                        transform: 'translateX(-50%)',
                        fontFamily: 'var(--font-headline)',
                        fontWeight: 900, fontSize: '0.7rem',
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
                          bottom: `${cfg.size + 12}px`,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(6,14,32,0.94)',
                          backdropFilter: 'blur(14px)',
                          border: `1px solid ${planet.color}40`,
                          borderRadius: '0.75rem',
                          padding: '0.55rem 0.85rem',
                          whiteSpace: 'nowrap',
                          zIndex: 50,
                          boxShadow: `0 4px 28px ${planet.color}30`,
                          pointerEvents: 'none',
                        }}>
                          <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.82rem', color: '#fff', marginBottom: '0.1rem' }}>
                            {planet.name}
                          </p>
                          <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '1.05rem', color: planet.color, lineHeight: 1 }}>
                            {pts.toLocaleString('fr-FR')} pts
                          </p>
                          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.15rem' }}>
                            {planet.memberCount ?? 0} astronautes
                          </p>
                        </div>
                      )}
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            )
          })}

        </div>
      </div>
    </div>
  )
}
