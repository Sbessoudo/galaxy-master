# Proposal AS-06: Import en masse d'astronautes

## Summary
Permettre à un administrateur d'importer une liste de collaborateurs depuis un fichier Excel pour créer plusieurs profils en une seule opération.

## Motivation
Lors de l'initialisation de la plateforme ou d'une mise à jour groupée (fin de période, réorganisation), créer les profils un à un est trop lent. Un import Excel permet de gagner du temps significativement.

## Proposed Solution
Une interface d'upload de fichier Excel (.xlsx) avec prévisualisation des lignes à importer avant confirmation. L'import est additif : il crée les nouveaux astronautes sans écraser les existants. Un rapport de résultat est affiché après import.

## Scope

### In scope
- Upload d'un fichier .xlsx
- Format attendu : colonnes Prénom, Nom, Rôle, Planète (nom), Date d'arrivée
- Prévisualisation des lignes avant confirmation
- Création des astronautes valides
- Rapport : nb créés, nb ignorés (invalides), liste des erreurs par ligne

### Out of scope
- Mise à jour d'astronautes existants via import (pas d'upsert)
- Import CSV
- Import depuis un système RH externe (v2)
