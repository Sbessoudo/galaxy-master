'use client'

import Link from 'next/link'

export default function DashboardError({ error, reset }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <span className="material-symbols-outlined mb-4"
              style={{ color: 'var(--color-primary)', fontSize: '2.5rem', display: 'block' }}>
          warning
        </span>
        <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-on-surface)', marginBottom: '0.5rem' }}>
          Quelque chose s'est mal passé
        </h2>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          {error?.message || 'Erreur inattendue sur cette page.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary">Réessayer</button>
          <Link href="/" className="btn-ghost">Retour au dashboard</Link>
        </div>
      </div>
    </div>
  )
}
