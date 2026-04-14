'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function PreviewBanner({ isAdmin, astronautName }) {
  const searchParams = useSearchParams()
  const previewId    = searchParams.get('preview')

  if (!isAdmin || !previewId) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-1.5"
         style={{ background: 'var(--color-tertiary)', color: 'var(--color-on-tertiary)' }}>
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>visibility</span>
        <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', fontWeight: 700 }}>
          Mode aperçu — vue de {astronautName ?? 'l\'astronaute'}
        </span>
      </div>
      <Link href="/" style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-on-tertiary)', textDecoration: 'underline' }}>
        ← Retour au back-office
      </Link>
    </div>
  )
}
