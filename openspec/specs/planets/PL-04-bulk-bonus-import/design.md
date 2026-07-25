# Design PL-04: Import points bonus en masse (Excel)

## Data Model
Identique à PL-03 — insert dans `bonus_points`.

## Query Strategy / Server Actions

### Route API : `app/api/planets/bonus-import/route.js`
```js
import * as XLSX from 'xlsx'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies })

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile.role !== 'admin') return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const formData = await req.formData()
  const file = formData.get('file')
  if (!file) return Response.json({ error: 'No file' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet)

  // Charger les planètes pour matching
  const { data: planets } = await supabase.from('planets').select('id, name')
  const planetMap = Object.fromEntries(planets.map(p => [p.name.toLowerCase(), p.id]))

  // Saison active
  const { data: season } = await supabase.from('seasons').select('id').eq('active', true).single()

  const results = rows.map((row, i) => {
    const planetId = planetMap[String(row['Planète'] ?? '').toLowerCase().trim()]
    const points = parseInt(row['Points'])
    const label = String(row['Libellé'] ?? '').trim()
    const date = row['Date']

    const errors = []
    if (!planetId) errors.push(`Planète "${row['Planète']}" introuvable`)
    if (!points || points === 0) errors.push('Points invalides ou 0')
    if (!label) errors.push('Libellé vide')
    if (!date) errors.push('Date manquante')

    return { row: i + 2, planetId, points, label, date, errors, valid: errors.length === 0 }
  })

  return Response.json({ results, seasonId: season?.id })
}

// POST /confirm → insert les lignes valides
```

## UI Components
- `app/(protected)/planets/bonus/import/page.jsx`
  - `<FileUpload>` — drag & drop ou browse .xlsx
  - `<ImportPreviewTable results>` — tableau de prévisualisation
    - Lignes valides en vert, erreurs en rouge
    - Colonnes : #, Planète, Points, Libellé, Date, Statut
  - Bouton "Confirmer l'import" (désactivé si 0 lignes valides)
  - Résumé : "X lignes valides, Y erreurs"

## Route
- `/planets/bonus/import` → `app/(protected)/planets/bonus/import/page.jsx`
- `POST /api/planets/bonus-import` → parsing + validation
- `POST /api/planets/bonus-import/confirm` → insert

## Technical Decisions
- Library `xlsx` (SheetJS) pour le parsing Excel côté Node.js
- Matching nom planète case-insensitive
- Two-step : parse+validate → confirm+insert

## Edge Cases
- Fichier non .xlsx → message d'erreur format
- Colonne manquante → erreur sur toutes les lignes
- Date en format Excel (numérique) → convertir via `XLSX.SSF.format`
- Plus de 1000 lignes → batch insert par 100
