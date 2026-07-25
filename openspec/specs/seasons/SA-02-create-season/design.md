# Design SA-02: Créer une saison

## Data Model
Table `seasons` : INSERT (name, start_date, end_date, active=false)

## Query Strategy / Server Actions

```js
export async function createSeason(formData) {
  // Auth admin
  const name = formData.get('name')?.trim()
  const start_date = formData.get('start_date')
  const end_date = formData.get('end_date')

  if (!name || !start_date || !end_date) throw new Error('Tous les champs sont obligatoires')
  if (new Date(end_date) <= new Date(start_date)) {
    throw new Error('La date de fin doit être après la date de début')
  }

  await supabase.from('seasons').insert({ name, start_date, end_date, active: false })
  revalidatePath('/config/seasons')
  redirect('/config/seasons')
}
```

## UI Components
- `app/(protected)/config/seasons/new/page.jsx`
- `components/seasons/SeasonForm.jsx`
  - Input text nom (required)
  - Date picker start_date (required)
  - Date picker end_date (required, min = start_date + 1 jour)
  - Erreur inline si end <= start
  - Bouton "Créer la saison"

## Route
`/config/seasons/new` → `app/(protected)/config/seasons/new/page.jsx`

## Technical Decisions
- Validation côté client (min sur date picker) ET côté serveur (Server Action)
- active=false hardcodé, pas de champ dans le formulaire

## Edge Cases
- Nom identique à une saison existante → pas de contrainte UNIQUE sur name (saisons peuvent avoir le même nom)
- Dates identiques (start = end) → erreur "La date de fin doit être après la date de début"
