# Proposal PL-04: Import points bonus en masse (Excel)

## Summary
Upload d'un fichier .xlsx pour importer des points bonus en masse sur plusieurs planètes en une seule opération.

## Motivation
Après un challenge de classement, l'admin peut avoir à saisir des bonus pour les 4 planètes d'un coup. L'import Excel évite la saisie répétitive.

## Proposed Solution
Interface d'upload de fichier .xlsx avec colonnes : Planète (nom), Points (entier), Libellé (texte), Date (date). Parsing côté serveur via `xlsx` npm package. Insert additif dans `bonus_points`.

## Scope
### In scope
- Upload fichier .xlsx
- Colonnes attendues : Planète, Points, Libellé, Date
- Validation ligne par ligne avec rapport d'erreurs
- Insert additif (ne remplace pas les données existantes)
- Prévisualisation avant confirmation

### Out of scope
- Import CSV
- Modèle Excel automatiquement téléchargeable
- Remplacement/écrasement des données existantes
