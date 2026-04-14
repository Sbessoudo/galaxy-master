'use client'

export default function ImpersonateButton({ astronauteId, name }) {
  function handlePreview() {
    window.open(`/hub?preview=${astronauteId}`, '_blank')
  }

  return (
    <button
      onClick={handlePreview}
      className="btn-ghost"
      style={{ padding: '0.4rem 0.9rem', fontSize: '0.72rem', color: 'var(--color-tertiary)' }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>visibility</span>
      Voir comme {name?.split(' ')[0]}
    </button>
  )
}
