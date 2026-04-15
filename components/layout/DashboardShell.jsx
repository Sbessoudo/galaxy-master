'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Header from './Header'

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'

export default function DashboardShell({ user, role, children }) {
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [collapsed,   setCollapsed]   = useState(false)
  const [isDesktop,   setIsDesktop]   = useState(true)
  const pathname    = usePathname()
  const sidebarRef  = useRef(null)
  const lastFocusRef = useRef(null)

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Track desktop breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Focus trap + Escape for mobile drawer
  useEffect(() => {
    if (!mobileOpen) return
    // Save currently focused element to restore on close
    lastFocusRef.current = document.activeElement
    // Focus first focusable element in sidebar
    const el = sidebarRef.current?.querySelector(FOCUSABLE)
    el?.focus()

    function handleKeyDown(e) {
      if (e.key === 'Escape') { setMobileOpen(false); return }
      if (e.key !== 'Tab') return
      const focusable = [...(sidebarRef.current?.querySelectorAll(FOCUSABLE) ?? [])]
      if (!focusable.length) return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      lastFocusRef.current?.focus()
    }
  }, [mobileOpen])

  // Persist collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) setCollapsed(saved === 'true')
  }, [])
  const toggleCollapsed = () => setCollapsed(v => {
    localStorage.setItem('sidebar-collapsed', String(!v))
    return !v
  })

  const sidebarW = collapsed ? 64 : 256   // px

  return (
    <>
      {/* Skip link — visible on focus only */}
      <a href="#main-content"
         className="sr-only focus:not-sr-only"
         style={{
           position: 'fixed', top: '0.5rem', left: '50%', transform: 'translateX(-50%)',
           zIndex: 9999, padding: '0.5rem 1.25rem', borderRadius: '999px',
           background: 'var(--color-primary)', color: 'var(--color-on-primary)',
           fontFamily: 'var(--font-label)', fontWeight: 700, fontSize: '0.8rem',
           textDecoration: 'none', whiteSpace: 'nowrap',
         }}>
        Aller au contenu principal
      </a>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          onKeyDown={e => e.key === 'Enter' && setMobileOpen(false)}
          role="presentation"
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* Sidebar — always visible on desktop, drawer on mobile */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: sidebarW, transition: 'width 0.25s ease, transform 0.2s ease-in-out' }}
        aria-hidden={!mobileOpen && !isDesktop}
      >
        <Sidebar role={role} collapsed={collapsed} onClose={() => setMobileOpen(false)} />
      </div>

      {/* Collapse toggle — floating pill at sidebar edge, desktop only */}
      <button
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Développer le menu' : 'Réduire le menu'}
        aria-expanded={!collapsed}
        className="hidden lg:flex items-center justify-center"
        style={{
          position: 'fixed', top: '1rem', left: sidebarW + 6, zIndex: 60,
          width: '24px', height: '24px', borderRadius: '50%',
          background: 'var(--color-surface-container-high)',
          border: '1px solid rgb(255 255 255 / 0.12)',
          cursor: 'pointer', transition: 'left 0.25s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        <span aria-hidden="true" className="material-symbols-outlined"
              style={{ fontSize: '0.9rem', color: 'var(--color-on-surface-variant)',
                       transform: collapsed ? 'rotate(180deg)' : 'none',
                       transition: 'transform 0.25s ease', display: 'block', lineHeight: 1 }}>
          chevron_left
        </span>
      </button>

      {/* Main content — shifts with sidebar on desktop only */}
      <div id="main-content" className="flex flex-col min-h-screen"
           style={{ marginLeft: isDesktop ? sidebarW : 0, transition: 'margin-left 0.25s ease' }}
      >
        <Header user={user} onMenuToggle={() => setMobileOpen(v => !v)} mobileOpen={mobileOpen} />
        {children}
      </div>
    </>
  )
}
