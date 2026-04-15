'use client'

import { useTheme } from './ThemeProvider'

const OPTIONS = [
  { value: 'light',  icon: 'light_mode',  title: 'Clair' },
  { value: 'system', icon: 'computer',    title: 'Système' },
  { value: 'dark',   icon: 'dark_mode',   title: 'Sombre' },
]

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: 'var(--color-surface-container-high)',
      borderRadius: '999px',
      padding: '3px',
      gap: '2px',
    }}>
      {OPTIONS.map(({ value, icon, title }) => {
        const active = theme === value
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            title={title}
            style={{
              width: '28px', height: '28px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: active ? 'var(--color-surface-container-highest)' : 'transparent',
              transition: 'background 0.15s',
              boxShadow: active ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            <span className="material-symbols-outlined" style={{
              fontSize: '0.95rem',
              color: active ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)',
              transition: 'color 0.15s',
            }}>
              {icon}
            </span>
          </button>
        )
      })}
    </div>
  )
}
