# Proposal AD-02: Navigation structurée (sidebar)

## Summary
Sidebar persistante avec toutes les sections de l'application, certaines visibles uniquement par les admins.

## Motivation
La navigation doit refléter les permissions : les observateurs ne voient pas les sections de configuration. Une sidebar persistante assure une navigation rapide.

## Proposed Solution
Sidebar fixe à gauche avec sections groupées. Les sections de config sont filtrées selon le rôle de l'utilisateur (lu depuis le middleware).

## Scope
### In scope
- Sections tous : Dashboard, Planètes, Astronautes, Contributions, Engagements
- Sections admin : Config planètes, Types contributions, Types événements, Grades, Saisons, Utilisateurs, Paramètres
- Lien actif mis en évidence
- Logo en haut de la sidebar

### Out of scope
- Navigation par breadcrumb
- Onglets
