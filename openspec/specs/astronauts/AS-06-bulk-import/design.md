# Design AS-06: Import en masse d'astronautes

## Data Model

Table cible : `astronauts`
Opération : INSERT multiple (pas d'upsert)
Détection doublon : SELECT WHERE first_name = X AND last_name = Y

## Library

Utiliser `xlsx` (SheetJS) pour lire le fichier Excel côté serveur.
```
npm install xlsx
```

## Flow Technique

```
1. Client upload le fichier .xlsx (multipart/form-data)
2. Server Action lit le fichier avec SheetJS
3. Parse les lignes → tableau d'objets { firstName, lastName, roleTitle, planetName, arrivalDate }
4. Résoudre les noms de planètes en planet_id (SELECT FROM planets WHERE name = X)
5. Vérifier les doublons en base (SELECT FROM astronauts WHERE first_name = X AND last_name = Y)
6. INSERT les lignes valides et non dupliquées
7. Retourner { created: N, skippedInvalid: [...], skippedDuplicates: [...] }
```

## UI Components

- `app/astronauts/import/page.jsx` — Server Component (protégé admin)
- `components/astronauts/ImportForm.jsx` — Client Component
  - Upload zone (.xlsx uniquement)
  - Prévisualisation du tableau avant confirmation
  - Bouton "Importer" + bouton "Annuler"
- `components/astronauts/ImportReport.jsx` — affiche le rapport après import

## Route
`/astronauts/import` → `app/astronauts/import/page.jsx`

## Technical Decisions

- **Pas de streaming** : volume max estimé à ~200 lignes, traitement synchrone suffisant
- **Doublon par nom exact** : comparaison case-insensitive (LOWER)
- **Planète par nom** : si le nom de planète du fichier ne correspond à aucune planète active, la ligne est créée sans planète (planet_id = null) avec un warning dans le rapport

## Edge Cases

- Fichier vide → message "Le fichier ne contient aucune ligne"
- Colonne manquante (ex: pas de colonne "Prénom") → erreur de format avant prévisualisation
- Date d'arrivée malformée → ignorer la date, créer l'astronaute sans date d'arrivée + warning
