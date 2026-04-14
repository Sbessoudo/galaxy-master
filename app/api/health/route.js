import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('seasons').select('id', { head: true, count: 'exact' })
    if (error) throw error
    return NextResponse.json({ status: 'ok', db: 'connected', ts: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json(
      { status: 'error', db: 'unreachable', message: err.message },
      { status: 503 }
    )
  }
}
