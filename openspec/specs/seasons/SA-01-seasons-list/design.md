# Design SA-01: Liste des saisons

## Data Model
Table `seasons` : id, name, start_date, end_date, active, created_at

## Query Strategy / Server Actions

```js
const { data: seasons } = await supabase
  .from('seasons')
  .select('*')
  .order('start_date', { ascending: false })
```

## UI Components
- `app/(protected)/config/seasons/page.jsx`
- `components/seasons/SeasonsTable.jsx`
  - Colonnes : nom, date début, date fin, statut, actions
  - Badge "Active" (vert) ou "Inactive" (gris)
  - Bouton "Activer" si !season.active (admin)
  - Bouton "Supprimer" si !season.active (admin)
  - Bouton "Nouvelle saison" → `/config/seasons/new`

## Route
`/config/seasons` → `app/(protected)/config/seasons/page.jsx`

## Technical Decisions
- Données entièrement côté serveur (Server Component)
- Formatage des dates en français

## Edge Cases
- Aucune saison → message "Aucune saison créée" + bouton créer
- Aucune saison active → toutes les saisons ont le bouton "Activer"
