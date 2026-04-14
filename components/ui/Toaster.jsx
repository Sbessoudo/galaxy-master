'use client'

import { useEffect, useState, useCallback } from 'react'
import { _registerToastEmitter } from '@/lib/toast'

let _id = 0

const TYPE_STYLES = {
  success: {
    border: 'var(--color-primary)',
    icon: 'check_circle',
    iconColor: 'var(--color-primary)',
  },
  error: {
    border: 'var(--color-error, #f87171)',
    icon: 'error',
    iconColor: 'var(--color-error, #f87171)',
  },
  info: {
    border: 'var(--color-tertiary)',
    icon: 'info',
    iconColor: 'var(--color-tertiary)',
  },
}

export default function Toaster() {
  const [toasts, setToasts] = useState([])

  const emit = useCallback((toast) => {
    const id = ++_id
    setToasts(prev => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  useEffect(() => {
    _registerToastEmitter(emit)
    return () => _registerToastEmitter(null)
  }, [emit])

  if (!toasts.length) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      pointerEvents: 'none',
    }}>
      {toasts.map((t) => {
        const style = TYPE_STYLES[t.type] ?? TYPE_STYLES.info
        return (
          <div key={t.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            background: 'var(--color-surface-container-high, #1e2130)',
            border: `1px solid ${style.border}55`,
            borderLeft: `3px solid ${style.border}`,
            boxShadow: '0 4px 24px rgb(0 0 0 / 0.4)',
            minWidth: '240px',
            maxWidth: '380px',
            pointerEvents: 'auto',
            animation: 'toast-in 0.2s ease',
          }}>
            <span className="material-symbols-outlined" style={{ color: style.iconColor, fontSize: '1.1rem', flexShrink: 0 }}>
              {style.icon}
            </span>
            <p style={{
              fontFamily: 'var(--font-label)',
              fontSize: '0.8rem',
              color: 'var(--color-on-surface)',
              lineHeight: 1.4,
              flex: 1,
            }}>
              {t.message}
            </p>
            <button
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '0.1rem',
                color: 'var(--color-on-surface-variant)', flexShrink: 0,
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>close</span>
            </button>
          </div>
        )
      })}

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(0.5rem); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
