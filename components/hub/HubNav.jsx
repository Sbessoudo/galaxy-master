'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const links = [
  { href: '/hub',             label: 'Planètes',   icon: 'public' },
  { href: '/hub/astronautes', label: 'Équipages',  icon: 'group' },
  { href: '/hub/profil',      label: 'Mon profil', icon: 'person' },
]

export default function HubNav() {
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const previewId    = searchParams.get('preview')

  return (
    <nav className="flex items-center gap-1">
      {links.map(({ href, label, icon }) => {
        const active    = href === '/hub' ? pathname === '/hub' : pathname.startsWith(href)
        const finalHref = previewId ? `${href}?preview=${previewId}` : href

        return (
          <Link key={href} href={finalHref}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.4rem 0.6rem', borderRadius: '0.6rem',
                  textDecoration: 'none', fontSize: '0.78rem',
                  fontFamily: 'var(--font-label)', fontWeight: active ? 700 : 500,
                  color: active ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)',
                  background: active ? 'var(--color-surface-container-high)' : 'transparent',
                  transition: 'all 0.15s',
                }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
