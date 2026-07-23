# Astronauts (Collaborators) Management

## Purpose

Gérer le référentiel des collaborateurs (astronautes), suivre leur progression individuelle et avoir accès à leur historique complet de contributions. Les points d'un astronaute sont cumulatifs à vie et ne sont jamais remis à zéro.

## Requirements

- Le système DOIT afficher la liste de tous les collaborateurs avec : nom complet, rôle/titre, équipe, date d'arrivée, points totaux, nombre de contributions, grade actuel (badge coloré).
- Le système DOIT permettre le filtrage de la liste par statut actif/inactif.
- Le système DOIT afficher la fiche détaillée d'un collaborateur : identité, points totaux, grade actuel, points restants pour le prochain grade, historique chronologique de toutes ses contributions.
- Le système DOIT permettre à un administrateur de créer un collaborateur (prénom, nom, rôle optionnel, équipe optionnelle, date d'arrivée optionnelle, statut actif).
- Le système DOIT permettre à un administrateur de modifier les informations d'un collaborateur.
- Le système DOIT permettre à un administrateur de désactiver un collaborateur.
- Le système DOIT exclure les collaborateurs inactifs des sélecteurs et des calculs d'engagement.
- Le système DOIT conserver l'historique des contributions d'un collaborateur désactivé.
- Le système NE DOIT JAMAIS remettre à zéro les points cumulatifs d'un collaborateur.
- Le système DOIT permettre l'import de collaborateurs en masse via un fichier Excel (sans écraser les données existantes).

## Scenarios

### Liste des collaborateurs actifs

```gherkin
GIVEN des collaborateurs actifs et inactifs existent
WHEN un utilisateur consulte la liste des astronautes
THEN les collaborateurs actifs sont affichés par défaut
AND chaque ligne affiche nom, rôle, équipe, date d'arrivée, points, contributions et grade
```

### Fiche détaillée d'un collaborateur

```gherkin
GIVEN Alice a accumulé 350 points et 12 contributions
AND le prochain grade est "Captain" à 500 points
WHEN un utilisateur consulte la fiche d'Alice
THEN il voit ses 350 points et son grade actuel "Commander"
AND il voit "150 points pour atteindre Captain"
AND il voit l'historique chronologique de ses 12 contributions
```

### Désactivation d'un collaborateur

```gherkin
GIVEN un administrateur désactive Bob qui a 200 points et 8 contributions
WHEN un utilisateur cherche Bob dans un sélecteur de collaborateur
THEN Bob n'apparaît pas dans les résultats de recherche
AND les 200 points et 8 contributions de Bob restent enregistrés dans l'historique
```

### Import en masse

```gherkin
GIVEN un administrateur importe un fichier Excel contenant 20 collaborateurs
WHEN l'import est terminé
THEN 20 nouveaux profils sont créés
AND les collaborateurs déjà existants ne sont pas modifiés
```
