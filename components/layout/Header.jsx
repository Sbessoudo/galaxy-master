import Image from 'next/image'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Header({ user, title, onMenuToggle, mobileOpen = false }) {
  return (
    <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 lg:px-8"
            style={{
              background: 'color-mix(in srgb, var(--color-background) 88%, transparent)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 1px 0 0 rgb(255 255 255 / 0.05)',
            }}>

      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg"
            style={{ background: 'var(--color-surface-container)', border: 'none', cursor: 'pointer' }}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            aria-controls="sidebar-nav">
            <span aria-hidden="true" className="material-symbols-outlined" style={{ color: 'var(--color-on-surface-variant)', fontSize: '1.25rem' }}>menu</span>
          </button>
        )}

        {title && (
          <h2 className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-label)', color: 'var(--color-on-surface-variant)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {title}
          </h2>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:block"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-on-surface-variant)' }}>
              {user.full_name || user.email}
            </span>
            {user.avatar_url ? (
              <Image src={user.avatar_url} alt={user.full_name || 'Avatar'}
                     width={32} height={32}
                     className="rounded-full object-cover"
                     style={{ boxShadow: 'var(--shadow-glow-primary)' }} />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                   style={{ background: 'var(--color-primary-container)' }}>
                <span className="material-symbols-outlined text-sm"
                      style={{ color: 'var(--color-primary)' }}>
                  person
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
