# Design AD-03: Adaptation mobile

## Data Model
Aucune modification de données — responsive pur CSS/JS.

## Query Strategy / Server Actions
Aucune — adapation visuelle uniquement.

## UI Components

### Layout responsive
```jsx
// app/(protected)/layout.jsx
'use client' // si état sidebarOpen nécessaire
export default function ProtectedLayout({ children, role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 transform transition-transform md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar role={role} onNavigate={() => setSidebarOpen(false)} />
      </aside>
      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header mobile */}
        <header className="md:hidden flex items-center h-14 px-4 border-b">
          <button onClick={() => setSidebarOpen(true)}>
            <HamburgerIcon className="w-6 h-6" />
          </button>
          <span className="ml-3 font-semibold">Galaxy Master</span>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
```

### Tableaux scrollables
```jsx
// Wrapper pour tous les tableaux
<div className="overflow-x-auto -mx-4 md:mx-0">
  <table className="min-w-full">...</table>
</div>
```

## Route
`app/(protected)/layout.jsx` — modifié pour le responsive

## Technical Decisions
- Transition CSS transform (slide-in) pour la sidebar mobile
- Breakpoint `md` (768px) pour desktop vs mobile
- `onNavigate` callback dans `<Sidebar>` pour fermer au clic d'un lien

## Edge Cases
- iOS Safari : `100vh` bug → utiliser `h-screen` avec `overflow-hidden`
- Overflow horizontal des tableaux → wrapper `overflow-x-auto`
- Arrière-plan scrollable avec sidebar ouverte → `overflow-hidden` sur body quand sidebar ouverte
