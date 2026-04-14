import { createClient } from '@/lib/supabase/server'
import UtilisateurRoleToggle from '@/components/utilisateurs/UtilisateurRoleToggle'

export const dynamic = 'force-dynamic'

export default async function UtilisateursPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: utilisateurs } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url, role, created_at')
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-3xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p style={{
            fontFamily: 'var(--font-label)',
            fontSize: '0.6rem',
            color: 'var(--color-tertiary)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}>
            Configuration
          </p>
          <h1 style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--color-on-surface)',
            lineHeight: 1.1,
          }}>
            Utilisateurs
          </h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem', marginTop: '0.4rem' }}>
            Gérez les accès et rôles des membres de Galaxy Master.
          </p>
        </div>
      </div>

      {/* Onboarding info */}
      <div className="rounded-xl p-4 mb-6 flex items-start gap-3"
           style={{ background: 'rgb(172 199 255 / 0.08)', border: '1px solid rgb(172 199 255 / 0.15)' }}>
        <span className="material-symbols-outlined flex-shrink-0" style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginTop: '0.1rem' }}>
          info
        </span>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', lineHeight: 1.6 }}>
          Les comptes sont créés automatiquement lors de la première connexion Google.
          Partagez l&apos;URL de l&apos;application au nouveau membre — son compte apparaîtra ici avec le rôle <strong>Observateur</strong> par défaut.
          Vous pourrez ensuite le promouvoir Administrateur si nécessaire.
        </p>
      </div>

      {/* List */}
      {!utilisateurs?.length ? (
        <div className="rounded-xl p-12 text-center card"
             style={{ background: 'var(--color-surface-container)' }}>
          <span className="material-symbols-outlined mb-3" style={{ color: 'var(--color-tertiary)', fontSize: '2.5rem', display: 'block' }}>
            manage_accounts
          </span>
          <p style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', fontWeight: 700 }}>
            Aucun utilisateur
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {utilisateurs.map((u) => (
            <UtilisateurRow key={u.id} user={u} currentUserId={user.id} />
          ))}
        </div>
      )}
    </div>
  )
}

function UtilisateurRow({ user, currentUserId }) {
  const createdAt = new Date(user.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
  const initials = user.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : user.email[0].toUpperCase()

  const isAdmin = user.role === 'admin'

  return (
    <div className="rounded-xl p-5 flex items-center gap-4"
         style={{ background: 'var(--color-surface-container)' }}>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
           style={{ background: 'var(--color-primary-container)' }}>
        {user.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar_url} alt={user.full_name || user.email}
               className="w-full h-full object-cover" />
        ) : (
          <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-on-primary-container)' }}>
            {initials}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--color-on-surface)', fontSize: '0.95rem' }}
             className="truncate">
            {user.full_name || '—'}
          </p>
          <span className={isAdmin ? 'badge badge-primary' : 'badge'}
                style={!isAdmin ? { background: 'var(--color-surface-container-highest)', color: 'var(--color-on-surface-variant)' } : {}}>
            {isAdmin ? 'Administrateur' : 'Observateur'}
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', color: 'var(--color-on-surface-variant)', letterSpacing: '0.02em' }}
           className="truncate">
          {user.email}
          <span style={{ marginLeft: '0.75rem', opacity: 0.6 }}>· Inscrit le {createdAt}</span>
        </p>
      </div>

      {/* Role toggle */}
      <UtilisateurRoleToggle user={user} currentUserId={currentUserId} />
    </div>
  )
}
