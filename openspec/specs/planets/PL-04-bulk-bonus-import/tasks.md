# Tasks PL-04: Import points bonus en masse (Excel)

## Implementation Checklist

### Database / Data Layer
- [ ] Aucune migration nécessaire (utilise `bonus_points` existante)
- [ ] Vérifier que les FKs permettent un insert en masse sans violation

### Dependencies
- [ ] Installer `xlsx` (SheetJS) : `npm install xlsx`

### Server Actions / API Routes
- [ ] Créer `app/api/planets/bonus-import/route.js` (POST — parse + validate)
- [ ] Créer `app/api/planets/bonus-import/confirm/route.js` (POST — insert)
- [ ] Implémenter parsing XLSX avec `XLSX.read` + `sheet_to_json`
- [ ] Implémenter matching nom planète case-insensitive
- [ ] Valider chaque ligne : planète valide, points ≠ 0, label non vide, date présente
- [ ] Retourner les résultats de validation ligne par ligne
- [ ] Insert en batch des lignes valides à la confirmation

### UI Components
- [ ] Créer `app/(protected)/planets/bonus/import/page.jsx`
- [ ] Implémenter `<FileUpload>` avec validation extension .xlsx côté client
- [ ] Appel API de parsing au chargement du fichier
- [ ] Implémenter `<ImportPreviewTable>` avec lignes colorées (vert/rouge)
- [ ] Afficher résumé "X valides, Y erreurs"
- [ ] Bouton "Confirmer" désactivé si 0 lignes valides
- [ ] Toast succès après confirmation

### Navigation
- [ ] Lien "Import Excel" depuis la page bonus ou la liste des planètes

### Tests
- [ ] Test : parsing d'un fichier xlsx valide → 4 résultats valides
- [ ] Test : nom planète inconnu → erreur sur la ligne
- [ ] Test : points = 0 → erreur
- [ ] Test : fichier non xlsx → erreur format
- [ ] Test : confirm → 4 inserts en base

### Validation
- [ ] Tester avec un fichier Excel réel (4 planètes, 4 lignes)
- [ ] Vérifier le rapport d'erreurs sur un fichier partiellement valide
- [ ] Vérifier les bonus dans l'historique après import
