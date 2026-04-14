'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const mainNav = [
  { href: '/',               icon: 'dashboard',      label: 'Dashboard' },
  { href: '/planetes',       icon: 'public',         label: 'Planètes' },
  { href: '/astronautes',    icon: 'group',          label: 'Astronautes' },
  { href: '/contributions',  icon: 'rocket_launch',  label: 'Contributions' },
  { href: '/engagements',    icon: 'event',          label: 'Engagements' },
  { href: '/trophees',       icon: 'emoji_events',   label: 'Trophées' },
]

const configNav = [
  { href: '/config/planetes',       icon: 'public',        label: 'Planètes' },
  { href: '/config/contributions',  icon: 'category',      label: 'Types contrib.' },
  { href: '/config/engagements',    icon: 'event_note',    label: 'Types event' },
  { href: '/config/grades',         icon: 'military_tech', label: 'Grades' },
  { href: '/config/saisons',        icon: 'calendar_month',label: 'Saisons' },
  { href: '/config/trophees',       icon: 'emoji_events',  label: 'Trophées' },
  { href: '/config/utilisateurs',   icon: 'manage_accounts',label: 'Utilisateurs' },
  { href: '/config/webhooks',        icon: 'webhook',        label: 'Webhooks' },
]

export default function Sidebar({ role }) {
  const pathname = usePathname()

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col z-50 overflow-y-auto"
           style={{ background: 'var(--color-surface-container-low)' }}>

      {/* Logo */}
      <div className="px-6 pt-6 pb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))' }}>
            <span className="material-symbols-outlined"
                  style={{ color: 'var(--color-on-primary)', fontSize: '1.25rem' }}>
              rocket_launch
            </span>
          </div>
          <div>
            <h1 className="text-base font-black leading-none"
                style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', letterSpacing: '0.1em' }}>
              GALAXY MASTER
            </h1>
            <p className="text-[10px] mt-0.5"
               style={{ fontFamily: 'var(--font-label)', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Galactic HR Admin
            </p>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-0.5 px-2">
        {mainNav.map(({ href, icon, label }) => (
          <Link key={href} href={href}
                className={isActive(href) ? 'nav-item-active' : 'nav-item'}>
            <span className="material-symbols-outlined">{icon}</span>
            {label}
          </Link>
        ))}

        {/* Config section — admin only */}
        {role === 'admin' && (
          <>
            <div className="pt-6 pb-2 px-4">
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Configuration
              </p>
            </div>
            {configNav.map(({ href, icon, label }) => (
              <Link key={href} href={href}
                    className={isActive(href) ? 'nav-item-active' : 'nav-item'}>
                <span className="material-symbols-outlined">{icon}</span>
                {label}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Bottom links */}
      <div className="px-2 pb-6 pt-4" style={{ borderTop: '1px solid rgb(255 255 255 / 0.05)' }}>
        <Link href="/parametres" className="nav-item">
          <span className="material-symbols-outlined">settings</span>
          Paramètres
        </Link>
        <form action="/auth/signout" method="post">
          <button type="submit" className="nav-item w-full text-left">
            <span className="material-symbols-outlined">logout</span>
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  )
}
