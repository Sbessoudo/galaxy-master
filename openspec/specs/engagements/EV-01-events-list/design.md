# Design EV-01: Liste des événements

## Data Model
Tables :
- `events` : id, name, date, type_id, description
- `event_types` : id, name
- `event_participants` : event_id, astronaut_id
- `astronauts` : id, first_name, last_name

## Query Strategy / Server Actions

```js
const { data: events } = await supabase
  .from('events')
  .select(`
    id, name, date, description,
    event_types (name),
    event_participants (
      astronaut_id,
      astronauts (first_name, last_name)
    )
  `)
  .order('date', { ascending: false })
```

## UI Components
- `app/(protected)/events/page.jsx` — Server Component
- `components/events/EventsTable.jsx`
  - `<EventRow event isAdmin>` — Client Component (état déplié/replié)
    - Ligne principale : nom, date, type, count participants, chevron
    - Ligne dépliée : grid des participants (avatar + nom)
    - Boutons Modifier / Supprimer (admin)

```jsx
function EventRow({ event, isAdmin }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <tr onClick={() => setOpen(!open)} className="cursor-pointer hover:bg-gray-50">
        <td>{event.name}</td>
        <td>{formatDate(event.date)}</td>
        <td>{event.event_types.name}</td>
        <td>{event.event_participants.length}</td>
        <td>{isAdmin && <ActionsMenu />}</td>
        <td><ChevronIcon open={open} /></td>
      </tr>
      {open && (
        <tr>
          <td colSpan={6}>
            <div className="grid grid-cols-4 gap-2 p-4">
              {event.event_participants.map(p => (
                <span key={p.astronaut_id}>{p.astronauts.first_name} {p.astronauts.last_name}</span>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
```

## Route
`/events` → `app/(protected)/events/page.jsx`

## Technical Decisions
- Charger tous les participants côté serveur (pas de lazy load)
- Lignes dépliables en Client Component (état local)

## Edge Cases
- Événement sans participants → dépliage vide
- Tri par date avec fois identiques → ordre de création comme second critère
