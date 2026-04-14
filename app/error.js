'use client'

export default function GlobalError({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center"
         style={{ background: 'var(--color-background)' }}>
      <div className="text-center max-w-md px-6">
        <span className="material-symbols-outlined mb-4"
              style={{ color: 'var(--color-primary)', fontSize: '3rem', display: 'block' }}>
          error
        </span>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-on-surface)', marginBottom: '0.5rem' }}>
          Une erreur est survenue
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          {error?.message || 'Erreur inattendue. Réessaie ou contacte un administrateur.'}
        </p>
        <button onClick={reset} className="btn-primary">
          Réessayer
        </button>
      </div>
    </div>
  )
}
