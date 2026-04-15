'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const mainNav = [
  { href: '/',               icon: 'dashboard',      label: 'Dashboard' },
  { href: '/planetes',       icon: 'public',         label: 'Planètes' },
  { href: '/astronautes',    icon: 'group',          label: 'Astronautes' },
  { href: '/affectation',    icon: 'casino',         label: 'Roue des planètes' },
  { href: '/contributions',  icon: 'rocket_launch',  label: 'Contributions' },
  { href: '/engagements',    icon: 'event',          label: 'Engagements' },
  { href: '/trophees',       icon: 'emoji_events',   label: 'Trophées' },
]

const configNav = [
  { href: '/config/planetes',       icon: 'public',         label: 'Planètes' },
  { href: '/config/contributions',  icon: 'category',       label: 'Types contrib.' },
  { href: '/config/engagements',    icon: 'event_note',     label: 'Types event' },
  { href: '/config/grades',         icon: 'military_tech',  label: 'Grades' },
  { href: '/config/saisons',        icon: 'calendar_month', label: 'Saisons' },
  { href: '/config/trophees',       icon: 'emoji_events',   label: 'Trophées' },
  { href: '/config/utilisateurs',   icon: 'manage_accounts',label: 'Utilisateurs' },
  { href: '/config/webhooks',       icon: 'webhook',        label: 'Webhooks' },
]

export default function Sidebar({ role, collapsed = false, onClose }) {
  const pathname = usePathname()

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  // Nav item: icon-only when collapsed, icon+label when expanded
  const NavItem = ({ href, icon, label }) => {
    const active = isActive(href)
    return (
      <Link
        href={href}
        aria-label={collapsed ? label : undefined}
        aria-current={active ? 'page' : undefined}
        className={active ? 'nav-item-active' : 'nav-item'}
        style={collapsed ? { justifyContent: 'center', padding: '0.55rem 0' } : {}}
      >
        <span aria-hidden="true" className="material-symbols-outlined">{icon}</span>
        {!collapsed && label}
      </Link>
    )
  }

  return (
    <aside aria-label="Menu principal"
           className="h-screen flex flex-col overflow-y-auto overflow-x-hidden"
           style={{ background: 'var(--color-surface-container-low)', width: '100%' }}>

      {/* Logo — sticky so always visible when nav scrolls */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--color-surface-container-low)',
        borderBottom: '1px solid var(--color-outline-variant)',
        height: '4rem', display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: collapsed ? 0 : '0 1rem',
        flexShrink: 0,
      }}>
        {/* Close button — mobile only */}
        {onClose && (
          <button onClick={onClose}
                  aria-label="Fermer le menu"
                  className="lg:hidden absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--color-surface-container)', border: 'none', cursor: 'pointer' }}>
            <span aria-hidden="true" className="material-symbols-outlined" style={{ color: 'var(--color-on-surface-variant)', fontSize: '1rem' }}>close</span>
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden', minWidth: 0 }}>
          <div aria-hidden="true" className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))' }}>
            <span aria-hidden="true" className="material-symbols-outlined"
                  style={{ color: 'var(--color-on-primary)', fontSize: '1.1rem' }}>
              rocket_launch
            </span>
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', minWidth: 0 }}>
              <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '0.85rem',
                          color: 'var(--color-on-surface)', letterSpacing: '0.1em', whiteSpace: 'nowrap',
                          lineHeight: 1, margin: 0 }}>
                GALAXY MASTER
              </p>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', marginTop: '0.2rem',
                          color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em',
                          textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Galactic HR Admin
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main nav */}
      <nav aria-label="Navigation principale" className="flex-1 space-y-0.5 px-2">
        {mainNav.map(({ href, icon, label }) => (
          <NavItem key={href} href={href} icon={icon} label={label} />
        ))}

        {/* Config section — admin only */}
        {role === 'admin' && (
          <nav aria-label="Configuration">
            {!collapsed && (
              <div className="pt-6 pb-2 px-4">
                <p aria-hidden="true" style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Configuration
                </p>
              </div>
            )}
            {collapsed && <div aria-hidden="true" style={{ height: '1px', margin: '0.75rem 0.5rem', background: 'rgb(255 255 255 / 0.06)' }} />}
            {configNav.map(({ href, icon, label }) => (
              <NavItem key={href} href={href} icon={icon} label={label} />
            ))}
          </nav>
        )}
      </nav>

      {/* Bottom — settings + logout + collapse toggle */}
      <div className="px-2 pb-4 pt-4" style={{ borderTop: '1px solid var(--color-outline-variant)' }}>
        <Link href="/parametres"
              aria-label={collapsed ? 'Paramètres' : undefined}
              className="nav-item"
              style={collapsed ? { justifyContent: 'center', padding: '0.55rem 0' } : {}}>
          <span aria-hidden="true" className="material-symbols-outlined">settings</span>
          {!collapsed && 'Paramètres'}
        </Link>
        <form action="/auth/signout" method="post">
          <button type="submit"
                  aria-label={collapsed ? 'Déconnexion' : undefined}
                  className="nav-item w-full text-left"
                  style={collapsed ? { justifyContent: 'center', padding: '0.55rem 0' } : {}}>
            <span aria-hidden="true" className="material-symbols-outlined">logout</span>
            {!collapsed && 'Déconnexion'}
          </button>
        </form>

      </div>
    </aside>
  )
}
