# Spec AS-01: Liste des astronautes

## Purpose
Permettre à tout utilisateur connecté de consulter la liste de tous les collaborateurs avec leurs indicateurs clés, et de filtrer par statut actif/inactif.

## Requirements

- Le système DOIT afficher la liste de tous les astronautes dans un tableau.
- Le système DOIT afficher par ligne : nom complet, rôle/titre, planète d'appartenance, date d'arrivée, points totaux (lifetime), nombre de contributions, grade actuel (badge coloré avec emoji).
- Le système DOIT afficher les astronautes actifs par défaut.
- Le système DOIT permettre de filtrer la liste pour n'afficher que les astronautes inactifs.
- Le système DOIT permettre de filtrer pour afficher tous les astronautes (actifs + inactifs).
- Le système DOIT permettre le tri par colonne (nom, points, contributions, grade).
- Le système DOIT rendre chaque ligne cliquable et rediriger vers la fiche détaillée de l'astronaute (AS-02).
- Le système DOIT afficher un état vide explicite si aucun astronaute ne correspond au filtre.

## Scenarios

### Affichage par défaut

```gherkin
GIVEN plusieurs astronautes actifs et inactifs existent en base
WHEN un utilisateur accède à /astronauts
THEN seuls les astronautes actifs sont affichés
AND chaque ligne affiche : nom, rôle, planète, date d'arrivée, points lifetime, nb contributions, badge de grade
```

### Filtre inactifs

```gherkin
GIVEN un utilisateur sur /astronauts avec le filtre "Actifs" sélectionné
WHEN il bascule le filtre sur "Inactifs"
THEN seuls les astronautes désactivés apparaissent dans la liste
```

### Navigation vers la fiche

```gherkin
GIVEN la liste des astronautes est affichée
WHEN l'utilisateur clique sur la ligne d'Alice
THEN il est redirigé vers /astronauts/[id-alice]
```

### État vide

```gherkin
GIVEN aucun astronaute inactif n'existe
WHEN l'utilisateur filtre sur "Inactifs"
THEN un message "Aucun astronaute inactif" est affiché
```
