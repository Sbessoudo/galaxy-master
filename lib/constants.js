// ── Planètes ──────────────────────────────────────────────────────────────────

export const PLANET_TYPES = ['main', 'newcomers', 'arbiters']

export const PLANET_TYPE_LABEL = {
  main:      'Principale',
  newcomers: 'Recrues',
  arbiters:  'Arbitres',
}

export const PLANET_TYPE_BADGE = {
  main:      'badge-secondary',
  newcomers: 'badge-tertiary',
  arbiters:  'badge-primary',
}

export const PLANET_TYPE_OPTIONS = [
  { value: 'main',      label: 'Principale',   desc: 'Participe au classement général' },
  { value: 'newcomers', label: 'Recrues',       desc: 'Astronautes en attente d\'assignation' },
  { value: 'arbiters',  label: 'Arbitres',      desc: 'Hors compétition' },
]

export const PRESET_COLORS = [
  '#ff8c98', '#9093ff', '#ffb148', '#4ade80',
  '#38bdf8', '#f472b6', '#a78bfa', '#fb923c',
]

// ── Uploads ───────────────────────────────────────────────────────────────────

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
]

export const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024 // 2 MB
export const MAX_FILE_SIZE_LABEL = '2 Mo'

// ── Grades ────────────────────────────────────────────────────────────────────

export const GRADE_LEVELS = [
  { name: 'Rookie',               min_points: 0,     icon: '🪐' },
  { name: 'Ensign',               min_points: 50,    icon: '⭐' },
  { name: 'Lieutenant',           min_points: 100,   icon: '🌟' },
  { name: 'Lieutenant Commander', min_points: 200,   icon: '💫' },
  { name: 'Commander',            min_points: 300,   icon: '🚀' },
  { name: 'Captain',              min_points: 500,   icon: '🛸' },
  { name: 'Fleet Captain',        min_points: 750,   icon: '🌌' },
  { name: 'Commodore',            min_points: 1000,  icon: '🔭' },
  { name: 'Rear Admiral',         min_points: 1500,  icon: '🪖' },
  { name: 'Vice Admiral',         min_points: 2000,  icon: '🎖️' },
  { name: 'Admiral',              min_points: 3000,  icon: '⚡' },
  { name: 'Fleet Admiral',        min_points: 5000,  icon: '🏅' },
  { name: 'Fleet Admiral ★★',     min_points: 10000, icon: '🥇' },
  { name: 'Fleet Admiral ★★★',    min_points: 15000, icon: '👑' },
]
