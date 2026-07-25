# Design PL-03: Ajouter des points bonus à une planète

## Data Model
Table `bonus_points` :
- `id` uuid DEFAULT gen_random_uuid()
- `planet_id` uuid FK → planets.id
- `season_id` uuid FK → seasons.id
- `points` int (NOT NULL, CHECK (points != 0))
- `label` text NOT NULL
- `date` date NOT NULL
- `created_at` timestamptz DEFAULT now()

## Query Strategy / Server Actions

### Server Action : `app/actions/planets.js`
```js
'use server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function addBonusPoints(formData) {
  const supabase = createServerActionClient({ cookies })

  // Vérifier rôle admin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile.role !== 'admin') throw new Error('Unauthorized')

  // Saison active
  const { data: season } = await supabase.from('seasons').select('id').eq('active', true).single()
  if (!season) throw new Error('Aucune saison active')

  const planet_id = formData.get('planet_id')
  const points = parseInt(formData.get('points'))
  const label = formData.get('label')
  const date = formData.get('date')

  if (!points || points === 0) throw new Error('Le montant ne peut pas être 0')
  if (!label?.trim()) throw new Error('Le libellé est obligatoire')

  const { error } = await supabase.from('bonus_points').insert({
    planet_id,
    season_id: season.id,
    points,
    label: label.trim(),
    date,
  })

  if (error) throw error
  revalidatePath('/planets')
  revalidatePath(`/planets/${planet_id}`)
}
```

## UI Components
- `app/(protected)/planets/bonus/page.jsx` ou modale depuis `/planets`
- `components/planets/BonusPointsForm.jsx`
  - `<PlanetSelect>` — select toutes les planètes actives
  - `<input type="number">` — montant (accepte négatif, validation !== 0)
  - `<input type="text">` — libellé (required)
  - `<input type="date">` — date (default: today)
  - Message erreur si aucune saison active
  - Bouton "Enregistrer" (désactivé si aucune saison)

## Route
- `/planets/bonus` → `app/(protected)/planets/bonus/page.jsx`
- Ou modale accessible depuis la liste des planètes

## Technical Decisions
- Vérification du rôle admin côté serveur (Server Action)
- `revalidatePath` pour invalider le cache des pages planètes
- La mise à jour de `planet_season_points` est calculée à la volée depuis `bonus_points` (pas de dénormalisation)

## Edge Cases
- `points = 0` → erreur de validation
- Saison inactive → formulaire désactivé avec message
- Planète inexistante → erreur FK Supabase
- `label` vide ou espaces seuls → validation `.trim()`
