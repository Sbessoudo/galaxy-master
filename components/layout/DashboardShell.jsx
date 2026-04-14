'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Header from './Header'

export default function DashboardShell({ user, role, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* Sidebar — always visible on desktop, drawer on mobile */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-in-out lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar role={role} onClose={() => setMobileOpen(false)} />
      </div>

      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header user={user} onMenuToggle={() => setMobileOpen(v => !v)} />
        {children}
      </div>
    </>
  )
}
