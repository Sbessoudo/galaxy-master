/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // ─── Nebula One Color Tokens ────────────────────────────────────────────
      colors: {
        // Surfaces — The Void to The Vessel
        'background':                '#021425',
        'surface':                   '#021425',
        'surface-dim':               '#021425',
        'surface-container-lowest':  '#000f1f',
        'surface-container-low':     '#0a1d2e',
        'surface-container':         '#0f2132',
        'surface-container-high':    '#1a2b3d',
        'surface-container-highest': '#253649',
        'surface-variant':           '#253649',
        'surface-bright':            '#293b4d',
        'surface-tint':              '#acc7ff',

        // Primary — "Starlight"
        'primary':                   '#acc7ff',
        'primary-fixed':             '#d7e2ff',
        'primary-fixed-dim':         '#acc7ff',
        'primary-container':         '#0a4084',
        'on-primary':                '#002f67',
        'on-primary-container':      '#87aef9',
        'on-primary-fixed':          '#001a40',
        'on-primary-fixed-variant':  '#144589',
        'inverse-primary':           '#335da3',

        // Secondary — "Solar Flare"
        'secondary':                 '#ffb2b9',
        'secondary-fixed':           '#ffdadb',
        'secondary-fixed-dim':       '#ffb2b9',
        'secondary-container':       '#b00139',
        'on-secondary':              '#67001e',
        'on-secondary-container':    '#ffbcc1',
        'on-secondary-fixed':        '#40000f',
        'on-secondary-fixed-variant':'#91002e',

        // Tertiary — "Nebula"
        'tertiary':                  '#c8bfff',
        'tertiary-fixed':            '#e5deff',
        'tertiary-fixed-dim':        '#c8bfff',
        'tertiary-container':        '#3f2ca0',
        'on-tertiary':               '#2d128f',
        'on-tertiary-container':     '#afa3ff',
        'on-tertiary-fixed':         '#190064',
        'on-tertiary-fixed-variant': '#4532a6',

        // Error
        'error':                     '#ffb4ab',
        'error-container':           '#93000a',
        'on-error':                  '#690005',
        'on-error-container':        '#ffdad6',

        // On-surfaces
        'on-surface':                '#d2e4fc',
        'on-surface-variant':        '#c3c6d2',
        'on-background':             '#d2e4fc',

        // Outlines
        'outline':                   '#8d909c',
        'outline-variant':           '#434751',

        // Inverse
        'inverse-surface':           '#d2e4fc',
        'inverse-on-surface':        '#203244',
      },

      // ─── Border Radius ───────────────────────────────────────────────────────
      borderRadius: {
        DEFAULT: '0.25rem',
        lg:      '0.5rem',
        xl:      '0.75rem',
        xxl:     '1.5rem',  // Primary CTA buttons ("No 4px border-radius" rule)
        full:    '9999px',
      },

      // ─── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        body:     ['Work Sans', 'sans-serif'],
        label:    ['Work Sans', 'sans-serif'],
      },

      // ─── Box Shadows (ambient, not ink) ─────────────────────────────────────
      boxShadow: {
        'ambient-sm': '0 4px 24px 0 rgba(172, 199, 255, 0.04)',
        'ambient':    '0 8px 48px 0 rgba(172, 199, 255, 0.06)',
        'ambient-lg': '0 16px 64px 0 rgba(172, 199, 255, 0.08)',
        'glow-primary':   '0 0 40px -10px #acc7ff',
        'glow-secondary': '0 0 40px -10px #ffb2b9',
        'glow-tertiary':  '0 0 40px -10px #c8bfff',
      },

      // ─── Background Images (celestial gradients) ─────────────────────────────
      backgroundImage: {
        'gradient-primary':    'linear-gradient(135deg, #acc7ff, #87aef9)',
        'gradient-secondary':  'linear-gradient(135deg, #ffb2b9, #dd3156)',
        'gradient-tertiary':   'linear-gradient(135deg, #c8bfff, #afa3ff)',
        'gradient-progress':   'linear-gradient(90deg, #acc7ff, #c8bfff)',
        'gradient-void':       'radial-gradient(ellipse at top left, rgba(172,199,255,0.10) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
}
