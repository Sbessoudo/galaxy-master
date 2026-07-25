# Design PL-02: Fiche détaillée d'une planète

## Data Model
Tables :
- `planets` : `id`, `name`, `color`, `type`, `active`, `description`
- `astronauts` : `id`, `first_name`, `last_name`, `photo_url`, `active`, `planet_id`
- `contributions` : `astronaut_id`, `season_id`, `points_awarded`
- `grades` : `min_points`, `name`, `icon`, `color`
- `bonus_points` : `planet_id`, `season_id`, `points`, `label`, `date`
- `seasons` : `id`, `name`

## Query Strategy / Server Actions

```js
// app/(protected)/planets/[id]/page.jsx
import { notFound } from 'next/navigation'

export default async function PlanetDetailPage({ params }) {
  const supabase = createServerComponentClient({ cookies })

  const { data: planet } = await supabase
    .from('planets')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!planet) notFound()

  const { data: members } = await supabase
    .from('astronauts')
    .select('id, first_name, last_name, photo_url, active')
    .eq('planet_id', params.id)
    .order('last_name')

  // Points lifetime et saison par membre
  const memberStats = await Promise.all(members.map(async (member) => {
    const { data: allContribs } = await supabase
      .from('contributions')
      .select('points_awarded, season_id')
      .eq('astronaut_id', member.id)

    const lifetimePts = allContribs.reduce((s, c) => s + c.points_awarded, 0)
    const seasonPts = allContribs
      .filter(c => c.season_id === activeSeason?.id)
      .reduce((s, c) => s + c.points_awarded, 0)
    const seasonContribs = allContribs.filter(c => c.season_id === activeSeason?.id).length

    return { ...member, lifetimePts, seasonPts, seasonContribs }
  }))

  // Bonus history
  const { data: bonusHistory } = await supabase
    .from('bonus_points')
    .select('points, label, date, season_id, seasons(name)')
    .eq('planet_id', params.id)
    .order('date', { ascending: false })

  return <PlanetDetailView planet={planet} members={memberStats} bonusHistory={bonusHistory} grades={grades} />
}
```

## UI Components
- `app/(protected)/planets/[id]/page.jsx` — Server Component
- `components/planets/PlanetDetailView.jsx`
  - `<PlanetHeader planet>` — nom, rond coloré, type badge, statut badge
  - `<MembersTable members grades>` — tableau membres
    - Photo (avec fallback initiales), nom (lien AS-02), grade avec icône, pts lifetime, pts saison, nb contribs saison
  - `<BonusHistoryList bonusHistory>` — liste des bonus
    - Libellé, date, montant (vert si positif, rouge si négatif), saison

## Route
`/planets/[id]` → `app/(protected)/planets/[id]/page.jsx`

## Technical Decisions
- `notFound()` si planète inexistante
- Grade calculé depuis lifetime points

## Edge Cases
- Planète sans membres → afficher "Aucun membre"
- Bonus négatif → afficher en rouge avec signe "-"
- Membre inactif → afficher en grisé
