# Design PL-05: Créer une planète

## Data Model
Table `planets` :
- `id` uuid DEFAULT gen_random_uuid()
- `name` text NOT NULL UNIQUE
- `description` text
- `color` text NOT NULL (format hex #RRGGBB)
- `type` text NOT NULL CHECK (type IN ('main', 'newcomers', 'arbiters'))
- `active` boolean DEFAULT true
- `created_at` timestamptz DEFAULT now()

## Query Strategy / Server Actions

```js
'use server'
export async function createPlanet(formData) {
  const supabase = createServerActionClient({ cookies })

  // Auth check admin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile.role !== 'admin') throw new Error('Unauthorized')

  const name = formData.get('name')?.trim()
  const description = formData.get('description')?.trim() || null
  const color = formData.get('color')
  const type = formData.get('type')
  const active = formData.get('active') === 'true'

  // Validation
  if (!name) throw new Error('Le nom est obligatoire')
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) throw new Error('Format couleur invalide')
  if (!['main', 'newcomers', 'arbiters'].includes(type)) throw new Error('Type invalide')

  const { error } = await supabase.from('planets').insert({ name, description, color, type, active })

  if (error?.code === '23505') throw new Error('Ce nom est déjà utilisé')
  if (error) throw error

  revalidatePath('/planets')
  redirect('/planets')
}
```

## UI Components
- `app/(protected)/planets/new/page.jsx`
- `components/planets/PlanetForm.jsx` (réutilisable pour edit)
  - Input text "Nom" (required)
  - Textarea "Description" (opt)
  - `<input type="color">` avec aperçu du rond coloré
  - Select "Type" : Main / Newcomers / Arbiters
  - Toggle "Actif" (défaut: true)
  - Bouton "Créer la planète"

## Route
`/planets/new` → `app/(protected)/planets/new/page.jsx`

## Technical Decisions
- Contrainte UNIQUE sur `planets.name` en DB (erreur code 23505)
- `<input type="color">` natif HTML pour le color picker (pas de lib)
- Réutiliser `<PlanetForm>` pour la création ET la modification (PL-06)

## Edge Cases
- Nom avec espaces en début/fin → `.trim()`
- Description vide → insérer NULL
- Couleur par défaut si non fournie → `#6366F1` (indigo)
