import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from '@/lib/constants'
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  let formData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file) return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })

  if (!ALLOWED_IMAGE_TYPES.includes(file.type))
    return NextResponse.json({ error: 'Format non supporté (jpg, png, webp, svg)' }, { status: 400 })

  if (file.size > MAX_FILE_SIZE_BYTES)
    return NextResponse.json({ error: `Fichier trop lourd (max ${MAX_FILE_SIZE_BYTES / 1024 / 1024} Mo)` }, { status: 400 })

  const ext = file.name.split('.').pop()
  const path = `${id}/icon.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from('planet-images')
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage
    .from('planet-images')
    .getPublicUrl(path)

  const photo_url = `${publicUrl}?t=${Date.now()}`

  const { data, error } = await supabase
    .from('planets').update({ photo_url }).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ photo_url: data.photo_url })
}
