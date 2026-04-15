'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeCtx = createContext({ theme: 'system', setTheme: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('system')

  // Load saved preference — already applied to <html> by inline script, just sync state
  useEffect(() => {
    const saved = localStorage.getItem('theme') ?? 'system'
    setThemeState(saved)
  }, [])

  // Apply to <html> on every change (initial load already handled by inline script)
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }
  }, [theme])

  // Listen for system preference changes when in "system" mode
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => { /* re-render triggers CSS to re-evaluate */ setThemeState('system') }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = (t) => {
    setThemeState(t)
    localStorage.setItem('theme', t)
  }

  return <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
