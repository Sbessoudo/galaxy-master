export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2"
            style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}>
          Dashboard
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-on-surface-variant)' }}>
          Bienvenue sur Galaxy Master — le back-office de la plateforme Planets.
        </p>
      </div>

      {/* Placeholder cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Astronautes actifs', value: '—', icon: 'group' },
          { label: 'Contributions (saison)', value: '—', icon: 'rocket_launch' },
          { label: 'Taux d\'engagement', value: '—', icon: 'insights' },
          { label: 'Saison active', value: '—', icon: 'calendar_month' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="rounded-xl p-6"
               style={{ background: 'var(--color-surface-container-high)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined"
                    style={{ color: 'var(--color-primary)' }}>
                {icon}
              </span>
            </div>
            <p className="text-2xl font-black mb-1"
               style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}>
              {value}
            </p>
            <p className="text-xs"
               style={{ fontFamily: 'var(--font-label)', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
