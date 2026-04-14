import { createClient } from '@/lib/supabase/server'

/**
 * Get Slack webhook URL — DB first, env var fallback.
 * Returns null if no URL configured or webhook disabled.
 */
export async function getSlackConfig() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('webhook_configs')
      .select('url, enabled')
      .eq('name', 'slack')
      .single()

    if (data) {
      return { url: data.url || null, enabled: data.enabled }
    }
  } catch {
    // Fall through to env var
  }

  const url = process.env.SLACK_WEBHOOK_URL || null
  return { url, enabled: true }
}

/**
 * Send a Slack webhook message. Non-blocking — never throws.
 * Reads config from DB (with env var fallback).
 */
export async function sendSlackWebhook(message) {
  const { url, enabled } = await getSlackConfig()
  if (!url || !enabled) return

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    })
  } catch {
    // Non-blocking — webhook failure must not fail the caller
  }
}
