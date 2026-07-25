# Proposal DB-03: Classement des planètes

## Summary
Graphique à barres affichant les points de saison des 4 planètes principales, triées par ordre décroissant.

## Motivation
Le classement des planètes est le coeur de la gamification. Les équipes doivent pouvoir voir leur position relative en temps quasi-réel pour maintenir l'engagement compétitif.

## Proposed Solution
Graphique à barres horizontal ou vertical basé sur `planet_season_points` pour la saison active. Les planètes Newcomers et Arbiters sont exclues.

## Scope
### In scope
- Graphique à barres des points de saison par planète (type='main' uniquement)
- Trié décroissant (1ère place en haut/gauche)
- Couleur de chaque barre = couleur de la planète (`planets.color`)
- Affichage du score numérique sur chaque barre

### Out of scope
- Évolution dans le temps (pas de graphe linéaire)
- Points lifetime cumulatifs (affichage saison uniquement)
- Animation temps réel
