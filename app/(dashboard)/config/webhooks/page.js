import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WebhookConfigForm from '@/components/webhooks/WebhookConfigForm'

export const dynamic = 'force-dynamic'

export default async function WebhooksConfigPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const { data: config } = await supabase
    .from('webhook_configs')
    .select('url, enabled, updated_at')
    .eq('name', 'slack')
    .single()

  const lastUpdated = config?.updated_at
    ? new Date(config.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className="max-w-2xl">

      {/* Header */}
      <div className="mb-8">
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
          Webhooks
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem', marginTop: '0.4rem' }}>
          Notifications automatiques vers Slack.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-xl p-6" style={{ background: 'var(--color-surface-container)' }}>

        {/* Slack header */}
        <div className="flex items-center gap-3 mb-6 pb-5"
             style={{ borderBottom: '1px solid rgb(255 255 255 / 0.06)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
               style={{ background: '#4a154b' }}>
            <span style={{ fontSize: '1.3rem' }}>💬</span>
          </div>
          <div className="flex-1">
            <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--color-on-surface)', fontSize: '0.95rem' }}>
              Slack — Incoming Webhook
            </p>
            {lastUpdated && (
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--color-on-surface-variant)', marginTop: '0.1rem' }}>
                Dernière modification : {lastUpdated}
              </p>
            )}
          </div>
          <span className="badge"
                style={config?.enabled && config?.url
                  ? { background: 'rgb(74 222 128 / 0.15)', color: 'var(--color-success)' }
                  : { background: 'var(--color-surface-container-highest)', color: 'var(--color-on-surface-variant)' }
                }>
            {config?.enabled && config?.url ? 'Actif' : 'Inactif'}
          </span>
        </div>

        <WebhookConfigForm initial={config} />
      </div>
    </div>
  )
}
