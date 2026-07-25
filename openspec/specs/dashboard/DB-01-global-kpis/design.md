# Design DB-01: KPIs globaux

## Data Model
Tables impliquées :
- `astronauts` : `active` boolean
- `contribution_types` : `active` boolean
- `contributions` : `season_id`
- `seasons` : `id`, `active`

## Query Strategy / Server Actions

### Queries SQL (via Supabase JS SDK)
```js
// 1. Saison active
const { data: activeSeason } = await supabase
  .from('seasons')
  .select('id, name')
  .eq('active', true)
  .single()

// 2. KPIs en parallèle
const [
  { count: activeAstronauts },
  { count: activeContribTypes },
  { count: seasonContribs },
] = await Promise.all([
  supabase.from('astronauts').select('*', { count: 'exact', head: true }).eq('active', true),
  supabase.from('contribution_types').select('*', { count: 'exact', head: true }).eq('active', true),
  activeSeason
    ? supabase.from('contributions').select('*', { count: 'exact', head: true }).eq('season_id', activeSeason.id)
    : Promise.resolve({ count: 0 }),
])

// 3. Moyenne
const avgPerCollab = activeAstronauts > 0
  ? (seasonContribs / activeAstronauts).toFixed(1)
  : '0'
```

## UI Components
- `components/dashboard/KpiGrid.jsx` — grille 2×2 ou 4 colonnes
  - `<KpiCard label icon value>` — carte avec icône, valeur numérique, libellé
    - "Collaborateurs actifs" — icône astronaute — valeur `activeAstronauts`
    - "Types de contributions" — icône tag — valeur `activeContribTypes`
    - "Contributions (saison)" — icône graphe — valeur `seasonContribs`
    - "Moyenne / collaborateur" — icône calculator — valeur `avgPerCollab`

## Route
`/dashboard` → `app/(protected)/dashboard/page.jsx` (contient ce bloc en première section)

## Technical Decisions
- Requêtes en parallèle (`Promise.all`) pour minimiser la latence
- Rendu côté serveur (Server Component) — pas de loading state nécessaire
- Arrondi à 1 décimale pour la moyenne

## Edge Cases
- Division par zéro (0 astronautes actifs) → afficher "0"
- Pas de saison active → `seasonContribs` = 0, badge "Aucune saison"
- Erreur réseau → afficher des tirets "--" à la place des valeurs
