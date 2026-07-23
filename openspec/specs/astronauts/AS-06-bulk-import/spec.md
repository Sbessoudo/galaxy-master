# Spec AS-06: Import en masse d'astronautes

## Purpose
Permettre à un administrateur de créer plusieurs profils d'astronautes en une seule opération via un fichier Excel, sans écraser les données existantes.

## Requirements

- Le système DOIT réserver cette action aux utilisateurs avec le rôle Administrateur.
- Le système DOIT accepter uniquement les fichiers au format .xlsx.
- Le système DOIT attendre les colonnes : Prénom (obligatoire), Nom (obligatoire), Rôle (optionnel), Planète (optionnel), Date d'arrivée (optionnel).
- Le système DOIT afficher une prévisualisation des lignes à importer avant la confirmation.
- Le système DOIT valider chaque ligne (prénom et nom présents) avant import.
- Le système DOIT ignorer les lignes invalides et poursuivre l'import des lignes valides.
- Le système DOIT créer uniquement les astronautes nouveaux (comparaison par prénom + nom exact).
- Le système NE DOIT PAS modifier les astronautes existants via l'import.
- Le système DOIT afficher un rapport après import : nombre de lignes créées, ignorées (invalides), ignorées (déjà existants).

## Scenarios

### Import réussi

```gherkin
GIVEN un fichier Excel avec 20 lignes valides et aucun doublon en base
WHEN un administrateur upload le fichier et confirme l'import
THEN 20 astronautes sont créés en base
AND le rapport affiche "20 créés, 0 ignorés"
```

### Lignes invalides dans le fichier

```gherkin
GIVEN un fichier Excel avec 18 lignes valides et 2 lignes sans nom
WHEN l'administrateur upload et confirme
THEN 18 astronautes sont créés
AND le rapport affiche "18 créés, 2 ignorés (Nom manquant — lignes 5, 12)"
```

### Doublons déjà en base

```gherkin
GIVEN Alice Dupont existe déjà en base
AND le fichier Excel contient une ligne "Alice Dupont"
WHEN l'administrateur importe
THEN Alice Dupont n'est pas dupliquée
AND le rapport affiche "X créés, 1 ignoré (déjà existant)"
```

### Format de fichier invalide

```gherkin
GIVEN un administrateur tente d'uploader un fichier .csv
WHEN il sélectionne le fichier
THEN le système affiche une erreur "Format non supporté. Utilisez un fichier .xlsx"
AND aucun import n'est effectué
```
