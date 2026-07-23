# Tasks AS-06: Import en masse d'astronautes

## Implementation Checklist

### Dépendances
- [ ] Installer `xlsx` (SheetJS) : `npm install xlsx`

### Server / Data Layer
- [ ] Créer `app/astronauts/import/actions.js` avec `importAstronauts(formData)` Server Action
- [ ] Parser le fichier .xlsx avec SheetJS
- [ ] Valider les colonnes attendues (Prénom, Nom obligatoires)
- [ ] Résoudre les noms de planètes en planet_id (case-insensitive)
- [ ] Vérifier les doublons en base (LOWER(first_name) + LOWER(last_name))
- [ ] INSERT les lignes valides
- [ ] Retourner le rapport { created, skippedInvalid, skippedDuplicates }

### UI Components
- [ ] Créer `app/astronauts/import/page.jsx` (protégé admin)
- [ ] Créer `components/astronauts/ImportForm.jsx`
  - [ ] Zone de drop/upload (accepte .xlsx uniquement)
  - [ ] Prévisualisation du tableau parsé (avant confirmation)
  - [ ] Bouton "Confirmer l'import" + "Annuler"
- [ ] Créer `components/astronauts/ImportReport.jsx` (affiche le résultat post-import)

### Navigation
- [ ] Ajouter bouton "Importer depuis Excel" sur /astronauts (admin only)

### Tests
- [ ] Test : parsing d'un fichier .xlsx valide → tableau d'objets correct
- [ ] Test : fichier avec colonnes manquantes → erreur de format
- [ ] Test Server Action : 20 lignes valides → 20 créés
- [ ] Test Server Action : doublon existant → ignoré dans le rapport
- [ ] Test Server Action : ligne sans prénom → ignorée dans le rapport

### Validation
- [ ] Vérifier que les astronautes existants ne sont pas modifiés
- [ ] Vérifier le rapport de résultat avec des erreurs mixtes (invalides + doublons)
- [ ] Vérifier qu'un fichier .csv est refusé avant parsing
