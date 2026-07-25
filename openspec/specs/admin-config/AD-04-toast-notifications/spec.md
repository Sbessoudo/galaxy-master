# Spec AD-04: Notifications toast

## Purpose
Fournir un feedback visuel immédiat à l'utilisateur après chaque action CRUD.

## Requirements
- Le système DOIT afficher un toast vert "succès" après chaque action CRUD réussie
- Le système DOIT afficher un toast rouge "erreur" en cas d'échec
- Le système DOIT afficher le message de l'action dans le toast (ex: "Contribution enregistrée")
- Les toasts DOIVENT disparaître automatiquement après 4 secondes
- Les toasts DOIVENT être empilables (si plusieurs actions rapides)
- Les erreurs de validation DOIVENT être affichées inline sur les formulaires (pas en toast)
- Les toasts NE DOIVENT PAS bloquer le contenu de la page

## Scenarios

### Toast succès
```gherkin
GIVEN un admin enregistre une contribution
WHEN l'action réussit
THEN un toast vert "Contribution enregistrée (150 pts)" apparaît en haut à droite
AND il disparaît après 4 secondes
```

### Toast erreur
```gherkin
GIVEN un admin tente de supprimer un type de contribution utilisé
WHEN l'action échoue
THEN un toast rouge "Ce type est utilisé par 5 contributions" apparaît
AND il disparaît après 4 secondes (ou après clic)
```

### Erreur de validation inline
```gherkin
GIVEN un admin soumet un formulaire avec un champ obligatoire vide
WHEN la validation échoue
THEN le message d'erreur apparaît sous le champ (pas en toast)
AND le champ est mis en évidence (bordure rouge)
```
