import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const { data: config } = await supabase
    .from('webhook_configs')
    .select('url, enabled')
    .eq('name', 'slack')
    .single()

  const url = config?.url || process.env.SLACK_WEBHOOK_URL
  if (!url) {
    return NextResponse.json({ error: 'Aucune URL configurée' }, { status: 400 })
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '🧪 *Galaxy Master* — Test webhook Slack ✅' }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Slack a répondu: ${res.status}` }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 502 })
  }
}
