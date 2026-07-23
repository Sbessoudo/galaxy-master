# Proposal AS-01: Liste des astronautes

## Summary
Afficher la liste paginée de tous les collaborateurs (astronautes) avec leurs indicateurs clés et un filtre actif/inactif.

## Motivation
Les administrateurs et observateurs ont besoin d'une vue d'ensemble rapide de tous les collaborateurs, leur équipe, leurs points et leur grade actuel, sans avoir à ouvrir chaque fiche individuellement.

## Proposed Solution
Une page `/astronauts` affichant un tableau avec colonnes triables. Un filtre de statut (actif/inactif) permet de basculer l'affichage. Chaque ligne est cliquable et redirige vers la fiche détaillée (AS-02).

## Scope

### In scope
- Affichage de la liste de tous les astronautes
- Colonnes : nom complet, rôle/titre, planète, date d'arrivée, points totaux (lifetime), nombre de contributions, grade actuel (badge)
- Filtre actif / inactif
- Tri par colonne
- Lien vers la fiche détaillée

### Out of scope
- Recherche full-text (hors périmètre v1)
- Export de la liste
- Pagination (tous les collaborateurs sont affichés, volume faible)
