export default function Header({ user, title }) {
  return (
    <header className="fixed top-0 right-0 left-64 z-40 h-16 flex items-center justify-between px-8"
            style={{
              background: 'rgb(2 20 37 / 0.85)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgb(255 255 255 / 0.08)',
            }}>

      {/* Page title (injected per page) */}
      <div className="flex items-center gap-3">
        {title && (
          <h2 className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-label)', color: 'var(--color-on-surface-variant)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {title}
          </h2>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* User avatar */}
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:block"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-on-surface-variant)' }}>
              {user.full_name || user.email}
            </span>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name || 'Avatar'}
                   className="w-8 h-8 rounded-full object-cover ring-2"
                   style={{ ringColor: 'var(--color-primary)' }} />
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
