# Design AD-04: Notifications toast

## Data Model
Aucune table — état purement client-side.

## Query Strategy / Server Actions
Aucune query — feedback UI uniquement.

## UI Components

### Implémentation sans librairie externe (Context + useState)

```jsx
// contexts/ToastContext.jsx
'use client'
import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ message, type = 'success', duration = 4000 }) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
```

```jsx
// components/ui/ToastContainer.jsx
function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm
            ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {toast.type === 'success' ? <CheckIcon className="w-5 h-5 shrink-0" /> : <XIcon className="w-5 h-5 shrink-0" />}
          <span>{toast.message}</span>
          <button onClick={() => onRemove(toast.id)} className="ml-auto">
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
```

### Usage dans les formulaires
```jsx
'use client'
import { useToast } from '@/contexts/ToastContext'

function SomeForm() {
  const { addToast } = useToast()

  async function handleSubmit(formData) {
    try {
      await someServerAction(formData)
      addToast({ message: 'Contribution enregistrée', type: 'success' })
    } catch (err) {
      addToast({ message: err.message, type: 'error' })
    }
  }
}
```

### Erreurs inline sur les formulaires
```jsx
// Pattern pour erreur inline
<div className="space-y-1">
  <input
    name="name"
    className={`border rounded-lg px-3 py-2 w-full ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
  />
  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
</div>
```

## Route
`<ToastProvider>` dans `app/(protected)/layout.jsx` (wrapper global)

## Technical Decisions
- Implémentation custom sans librairie (react-hot-toast ou sonner si préféré)
- Context React pour accès universel depuis n'importe quel composant
- `Date.now()` comme ID unique des toasts
- Durée par défaut : 4000ms

## Edge Cases
- Plusieurs toasts simultanés → empilement vertical
- Message très long → tronquer à 200 caractères
- Toast erreur avec message technique → afficher message générique "Une erreur est survenue"
