'use client'

import { useState, useMemo, useRef } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const RANK_LABEL  = ['1er', '2e', '3e', '4e']
const RANK_COLOR  = ['#ffd700', '#c0c0c0', '#cd7f32', 'rgba(255,255,255,0.5)']
const RANK_SHADOW = ['0 0 12px #ffd70080', '0 0 8px #c0c0c060', '0 0 8px #cd7f3260', 'none']

const ORBIT_CONFIG = [
  { size: 90,  orbitR: 88,  duration: 12 }, // rank 1 — closest, fastest
  { size: 74,  orbitR: 148, duration: 20 }, // rank 2
  { size: 60,  orbitR: 204, duration: 30 }, // rank 3
  { size: 50,  orbitR: 256, duration: 42 }, // rank 4 — farthest, slowest
]

const INITIAL_ANGLES_DEG = [315, 45, 225, 135]

// Canvas: square, half-size = max orbit + planet radius + padding
const CANVAS_HALF = ORBIT_CONFIG[ORBIT_CONFIG.length - 1].orbitR
  + ORBIT_CONFIG[0].size / 2
  + 36
const CANVAS_SIZE = CANVAS_HALF * 2 // 732

const SAFE_COLOR_RE = /^#[0-9a-fA-F]{3,8}$|^rgba?\(|^hsl/
const safeColor = (c) => SAFE_COLOR_RE.test(c ?? '') ? c : '#888888'

const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i, x: (i * 137.5) % 100, y: (i * 97.3) % 100,
  size: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
  opacity: 0.10 + (i % 7) * 0.055,
}))

// ── Orbiting planet — x/y computed from angle, no rotation on planet div ──
function OrbitingPlanet({ planet, cfg, initAngleDeg, rankIndex, planetHref, hovered, setHovered }) {
  const initAngleRad = initAngleDeg * (Math.PI / 180)
  const angleRef = useRef(initAngleRad)
  const x = useMotionValue(Math.sin(initAngleRad) * cfg.orbitR)
  const y = useMotionValue(-Math.cos(initAngleRad) * cfg.orbitR)

  useAnimationFrame((_, delta) => {
    const msPerRev = cfg.duration * 1000
    angleRef.current += (delta / msPerRev) * (2 * Math.PI)
    x.set(Math.sin(angleRef.current) * cfg.orbitR)
    y.set(-Math.cos(angleRef.current) * cfg.orbitR)
  })

  const isHov   = hovered === planet.id
  const color   = safeColor(planet.color)
  const pts     = planet._pts

  return (
    // Anchor at canvas center (50%, 50%), then offset by x/y motion values
    <motion.div
      style={{
        position: 'absolute',
        left: '50%', top: '50%',
        x, y,
        translateX: '-50%',
        translateY: '-50%',
        zIndex: isHov ? 40 : 20,
      }}
    >
      <Link
        href={planetHref(planet.id)}
        aria-label={`${planet.name} — ${pts.toLocaleString('fr-FR')} pts`}
        onMouseEnter={() => setHovered(planet.id)}
        onMouseLeave={() => setHovered(null)}
        style={{ display: 'block', textDecoration: 'none', cursor: 'pointer', position: 'relative' }}
      >
        {/* Atmosphere halo */}
        <div style={{
          position: 'absolute',
          inset: `-${cfg.size * 0.3}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}28 0%, transparent 70%)`,
          opacity: isHov ? 1 : 0.5,
          transition: 'opacity 0.3s',
          pointerEvents: 'none',
        }} />

        {/* Planet sphere */}
        <div style={{
          width: `${cfg.size}px`, height: `${cfg.size}px`,
          borderRadius: '50%',
          overflow: 'hidden',
          background: color,
          boxShadow: `0 0 ${isHov ? 40 : 18}px ${isHov ? color : color + '50'}, inset -3px -3px 10px rgba(0,0,0,0.35)`,
          transition: 'box-shadow 0.25s',
          flexShrink: 0,
        }}>
          {planet.photo_url?.startsWith('https://') && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={planet.photo_url} alt={planet.name}
                 style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          )}
        </div>

        {/* Rank badge — always upright */}
        <div style={{
          position: 'absolute',
          top: '-20px', left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-headline)',
          fontWeight: 900, fontSize: '0.7rem',
          color: RANK_COLOR[rankIndex],
          textShadow: RANK_SHADOW[rankIndex],
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          {RANK_LABEL[rankIndex]}
        </div>

        {/* Hover tooltip */}
        {isHov && (
          <div style={{
            position: 'absolute',
            bottom: `${cfg.size + 12}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--color-surface-container-highest)',
            backdropFilter: 'blur(14px)',
            border: `1px solid ${color}40`,
            borderRadius: '0.75rem',
            padding: '0.55rem 0.85rem',
            whiteSpace: 'nowrap',
            zIndex: 50,
            boxShadow: `0 4px 28px ${color}30`,
            pointerEvents: 'none',
          }}>
            <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.82rem', color: '#fff', marginBottom: '0.1rem' }}>
              {planet.name}
            </p>
            <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '1.05rem', color, lineHeight: 1 }}>
              {pts.toLocaleString('fr-FR')} pts
            </p>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.15rem' }}>
              {planet.memberCount ?? 0} astronautes
            </p>
          </div>
        )}
      </Link>
    </motion.div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function SolarSystem({ planets = [], activeSeason }) {
  const [hovered, setHovered]  = useState(null)
  const searchParams = useSearchParams()
  const previewId    = searchParams.get('preview')

  const planetHref = (id) => previewId
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

  return (
    <div style={{ width: '100%', maxWidth: `${CANVAS_SIZE}px` }}>
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

          {/* SVG orbit rings — square viewBox → perfect circles */}
          <svg
            viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            {ORBIT_CONFIG.map((cfg, i) => (
              <circle key={cfg.orbitR}
                cx={CANVAS_HALF} cy={CANVAS_HALF} r={cfg.orbitR}
                fill="none"
                stroke={ranked[i] ? `${safeColor(ranked[i].color)}20` : 'rgba(255,255,255,0.05)'}
                strokeWidth="1"
                strokeDasharray="3 9"
              />
            ))}
            <circle cx={CANVAS_HALF} cy={CANVAS_HALF} r="52" fill="rgba(255,179,71,0.07)" />
            <circle cx={CANVAS_HALF} cy={CANVAS_HALF} r="42" fill="rgba(255,179,71,0.13)" />
          </svg>

          {/* Sun */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 32%, #fff7c0, #ffb347 32%, #ff6b00 62%, #cc3300)',
            boxShadow: '0 0 0 12px rgba(255,179,71,0.07), 0 0 0 28px rgba(255,107,0,0.03), 0 0 60px rgba(255,179,71,0.55)',
            zIndex: 10,
          }} />

          {/* Orbiting planets */}
          {ranked.map((planet, i) => {
            const cfg = ORBIT_CONFIG[i]
            if (!cfg) return null
            return (
              <OrbitingPlanet
                key={planet.id}
                planet={planet}
                cfg={cfg}
                initAngleDeg={INITIAL_ANGLES_DEG[i] ?? i * 90}
                rankIndex={i}
                planetHref={planetHref}
                hovered={hovered}
                setHovered={setHovered}
              />
            )
          })}

        </div>
      </div>
    </div>
  )
}
