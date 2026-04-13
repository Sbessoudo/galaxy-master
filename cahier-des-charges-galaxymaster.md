# Cahier des charges fonctionnel — Galaxy Master

**Rédigé par :** Product Owner
**Date :** Mars 2026
**Version :** 1.0
**Statut :** Document de référence

---

## Sommaire

1. [Contexte et vision produit](#1-contexte-et-vision-produit)
2. [Utilisateurs et rôles](#2-utilisateurs-et-rôles)
3. [Glossaire métier](#3-glossaire-métier)
4. [Lot 1 — Accès à l'application](#4-lot-1--accès-à-lapplication)
5. [Lot 2 — Tableau de bord analytique](#5-lot-2--tableau-de-bord-analytique)
6. [Lot 3 — Gestion des équipes (Planètes)](#6-lot-3--gestion-des-équipes-planètes)
7. [Lot 4 — Gestion des collaborateurs (Astronautes)](#7-lot-4--gestion-des-collaborateurs-astronautes)
8. [Lot 5 — Contributions](#8-lot-5--contributions)
9. [Lot 6 — Engagements](#9-lot-6--engagements)
10. [Lot 7 — Système de grades](#10-lot-7--système-de-grades)
11. [Lot 8 — Saisons](#11-lot-8--saisons)
12. [Lot 9 — Administration et configuration](#12-lot-9--administration-et-configuration)
13. [Règles transversales](#13-règles-transversales)
14. [Parcours utilisateurs clés](#14-parcours-utilisateurs-clés)

---

## 1. Contexte et vision produit

### Problème à résoudre

Aujourd'hui, le suivi des contributions des collaborateurs et de leur participation aux événements internes est géré manuellement — souvent dans des fichiers Excel partagés. Ce mode de fonctionnement génère plusieurs problèmes :

- Les données sont éparpillées, rarement à jour et difficiles à consolider
- Il n'existe aucune vision centralisée en temps réel sur l'engagement de chaque équipe
- Le calcul des points, des classements et des indicateurs de performance est fastidieux et source d'erreurs
- Les administrateurs n'ont pas d'outil adapté pour piloter l'animation de la communauté

### Solution : Galaxy Master

**Galaxy Master** est l'outil de pilotage interne de la plateforme Planets. Il s'adresse aux **administrateurs et responsables** qui ont besoin de :

- Enregistrer et suivre les contributions de chaque collaborateur
- Gérer les événements internes et la participation de chaque équipe
- Calculer automatiquement les points, grades et classements
- Analyser l'engagement en temps réel via un tableau de bord
- Configurer les règles du jeu (types de contributions, niveaux, saisons)

Galaxy Master est le **back-office vivant** de la gamification — là où les données sont saisies, les règles configurées et les résultats analysés.

### Relation avec la plateforme Planets

Galaxy Master et la plateforme Planets (nebula-react / black-hole) sont complémentaires :
- **Galaxy Master** est l'outil des administrateurs : saisie, configuration, pilotage
- **La plateforme Planets** est l'outil des collaborateurs : consultation de leur profil, du classement, de la timeline

---

## 2. Utilisateurs et rôles

### Les acteurs

| Rôle | Qui ? | Ce qu'il peut faire |
|------|-------|---------------------|
| **Administrateur** | Responsable RH, Office Manager, référent animation | Tout créer, modifier, supprimer. Configurer les règles. Gérer les utilisateurs. |
| **Observateur** | Manager, directeur, curious stakeholder | Consulter toutes les données en lecture seule. Aucune modification possible. |

### Règle fondamentale d'accès

> L'application est **entièrement privée**. Tout accès nécessite une connexion. Il n'existe aucune page publique.

### Distinction des droits

| Action | Administrateur | Observateur |
|--------|---------------|-------------|
| Consulter le tableau de bord | ✅ | ✅ |
| Consulter les planètes, astronautes, contributions, engagements | ✅ | ✅ |
| Créer / modifier / supprimer des données | ✅ | ❌ |
| Gérer les grades, saisons, types | ✅ | ❌ |
| Gérer les utilisateurs de l'application | ✅ | ❌ |
| Attribuer des points bonus | ✅ | ❌ |

---

## 3. Glossaire métier

| Terme | Définition |
|-------|-----------|
| **Astronaute** | Un collaborateur de l'entreprise |
| **Planète** | Une équipe ou squad |
| **Contribution** | Une action réalisée par un collaborateur qui lui vaut des points (article, conférence, atelier…) |
| **Type de contribution** | La catégorie d'une contribution, avec sa valeur en points associée |
| **Engagement** | Un événement interne auquel les collaborateurs peuvent participer |
| **Type d'engagement** | La catégorie d'un événement (réunion d'équipe, formation, séminaire…) |
| **Taux d'engagement** | Le pourcentage de collaborateurs ayant participé à au moins la moitié des événements d'une saison |
| **Grade** | Un niveau de reconnaissance visuel, attribué automatiquement selon les points accumulés |
| **Points bonus** | Des points ajoutés (ou retirés) manuellement à une planète, indépendamment des contributions |
| **Saison** | Une période définie (ex : un trimestre) sur laquelle les indicateurs sont calculés |
| **KPI** | Indicateur de performance. Certains types de contributions sont marqués comme KPI pour être inclus dans des rapports spécifiques |

---

## 4. Lot 1 — Accès à l'application

### Objectif

Permettre aux utilisateurs autorisés de se connecter à Galaxy Master et de sécuriser l'accès à toutes les données.

---

### F-01 — Connexion

**En tant qu'** utilisateur autorisé,
**je veux** me connecter avec mon adresse email et mon mot de passe,
**afin d'** accéder à l'application.

**Comportement :**
- L'utilisateur saisit son email et son mot de passe
- En cas de succès, il est redirigé vers le tableau de bord
- En cas d'identifiants incorrects, un message d'erreur est affiché
- Les utilisateurs non connectés qui tentent d'accéder à une page sont redirigés vers la page de connexion

---

### F-02 — Déconnexion

**En tant qu'** utilisateur connecté,
**je veux** me déconnecter,
**afin de** sécuriser mon session sur un poste partagé.

**Comportement :**
- Bouton de déconnexion accessible en permanence depuis l'en-tête
- Après déconnexion : redirection vers la page de connexion, session effacée

---

### F-03 — Persistance de session

**En tant qu'** utilisateur,
**je veux** rester connecté entre deux visites,
**afin de** ne pas avoir à me reconnecter à chaque fois que j'ouvre l'application.

**Règle :** La session est maintenue automatiquement et rafraîchie sans intervention de l'utilisateur.

---

### F-04 — Page de paramètres personnels

**En tant qu'** utilisateur connecté,
**je veux** consulter mes informations de compte,
**afin de** vérifier mon email, mon rôle et mon identifiant.

**Informations affichées :** email, rôle (Administrateur / Observateur), identifiant unique.

---

## 5. Lot 2 — Tableau de bord analytique

### Objectif

Offrir une vision consolidée et en temps réel de l'état de l'engagement sur la plateforme : contributions, points, classements, taux de participation.

---

### F-05 — Vue des indicateurs globaux

**En tant qu'** utilisateur,
**je veux** voir les chiffres clés de la plateforme en un coup d'œil,
**afin d'** évaluer rapidement l'activité globale.

**Indicateurs affichés :**
- Nombre total de collaborateurs actifs
- Nombre total de types de contributions configurés
- Nombre de contributions enregistrées sur la saison en cours
- Moyenne de contributions par collaborateur actif sur la saison

---

### F-06 — Taux d'engagement global

**En tant qu'** utilisateur,
**je veux** connaître le taux d'engagement global de la saison,
**afin de** mesurer si les collaborateurs participent suffisamment aux événements.

**Définition du taux d'engagement :**
> Un collaborateur est considéré "engagé" s'il a participé à au moins la moitié des événements de la saison. Le taux d'engagement = nombre de collaborateurs engagés / nombre total de collaborateurs actifs, exprimé en pourcentage.

**Affichage :**
- Pourcentage global
- Détail du taux par équipe (planète)

---

### F-07 — Classement des équipes par points

**En tant qu'** utilisateur,
**je veux** voir le classement des équipes sur la saison en cours,
**afin de** suivre la compétition inter-équipes.

**Affichage :**
- Graphique à barres avec toutes les planètes
- Points de la saison en cours pour chaque planète
- Les planètes sont triées par ordre décroissant de points

---

### F-08 — Répartition des contributions par type

**En tant qu'** utilisateur,
**je veux** voir comment les contributions se répartissent entre les différents types,
**afin de** comprendre quelles actions sont les plus pratiquées.

**Affichage :**
- Graphique en camembert (donut)
- Chaque portion représente un type de contribution
- Proportionnel au nombre de contributions de chaque type sur la saison

---

### F-09 — Top 5 des contributeurs

**En tant qu'** utilisateur,
**je veux** voir les 5 collaborateurs ayant accumulé le plus de points sur la saison,
**afin de** mettre en avant les plus actifs.

**Affichage :** Prénom/nom, planète, points de la saison, grade actuel.

---

### F-10 — Filtrage par saison

**En tant qu'** utilisateur,
**je veux** que le tableau de bord reflète les données de la saison active,
**afin d'** avoir des chiffres pertinents pour la période en cours.

**Règle :** Si une saison est active, tous les indicateurs du tableau de bord sont automatiquement filtrés sur cette saison. Un badge indique la saison en cours.

---

## 6. Lot 3 — Gestion des équipes (Planètes)

### Objectif

Permettre de visualiser les équipes, leur performance collective, leurs membres et leur progression, et aux administrateurs de les configurer.

---

### F-11 — Vue d'ensemble des équipes

**En tant qu'** utilisateur,
**je veux** consulter la liste de toutes les équipes avec leurs indicateurs clés,
**afin d'** avoir une vision comparative rapide.

**Informations affichées par équipe :**
- Couleur distinctive de l'équipe
- Nom de l'équipe
- Nombre de membres
- Points totaux (toutes saisons confondues)
- Points de la saison en cours
- Nombre total de contributions
- Nombre de contributions de la saison
- Total des points bonus reçus

---

### F-12 — Détail d'une équipe

**En tant qu'** utilisateur,
**je veux** consulter la fiche détaillée d'une équipe,
**afin de** voir ses membres, leurs points individuels et l'historique des points bonus.

**Informations affichées :**
- Liste des membres avec leur nom, points totaux, nombre de contributions et grade actuel
- Historique des points bonus attribués à l'équipe (avec libellé et date)

---

### F-13 — Ajouter des points bonus à une équipe

**En tant qu'** administrateur,
**je veux** attribuer des points bonus (positifs ou négatifs) à une équipe,
**afin de** récompenser ou pénaliser des comportements collectifs qui ne rentrent pas dans le cadre des contributions standard.

**Champs requis :** équipe cible, nombre de points (positif ou négatif), libellé explicatif, date.

**Règle :** Les points bonus s'ajoutent aux points issus des contributions pour calculer le total de l'équipe.

---

### F-14 — Import de points bonus en masse

**En tant qu'** administrateur,
**je veux** importer un fichier Excel pour attribuer des points bonus à plusieurs équipes en une seule opération,
**afin de** gagner du temps lors des opérations périodiques de mise à jour.

---

### F-15 — Créer et configurer une équipe

**En tant qu'** administrateur,
**je veux** créer une nouvelle équipe,
**afin de** refléter l'organisation réelle de l'entreprise.

**Champs :** nom, description (optionnel), couleur distinctive, statut actif/inactif.

---

### F-16 — Modifier ou désactiver une équipe

**En tant qu'** administrateur,
**je veux** modifier les informations d'une équipe ou la désactiver,
**afin de** maintenir le référentiel à jour en cas de restructuration.

**Règle :** Une équipe désactivée n'apparaît plus dans les sélecteurs mais ses données historiques sont conservées.

---

## 7. Lot 4 — Gestion des collaborateurs (Astronautes)

### Objectif

Gérer le référentiel des collaborateurs, suivre leur progression individuelle et avoir accès à leur historique complet.

---

### F-17 — Liste des collaborateurs

**En tant qu'** utilisateur,
**je veux** consulter la liste de tous les collaborateurs,
**afin d'** avoir une vue d'ensemble avec leurs indicateurs clés.

**Informations affichées :**
- Nom complet
- Rôle / titre
- Équipe d'appartenance
- Date d'arrivée dans l'entreprise
- Points totaux
- Nombre de contributions
- Grade actuel (badge coloré avec icône)

**Filtres disponibles :** actif / inactif.

---

### F-18 — Fiche détaillée d'un collaborateur

**En tant qu'** utilisateur,
**je veux** consulter la fiche complète d'un collaborateur,
**afin de** voir son historique de contributions, sa progression et son grade.

**Informations affichées :**
- Informations d'identité (nom, rôle, équipe, date d'arrivée, statut)
- Points totaux accumulés
- Grade actuel avec les points restants pour atteindre le grade suivant
- Historique chronologique de toutes ses contributions (type, date, lieu, points obtenus, commentaires)

---

### F-19 — Ajouter un collaborateur

**En tant qu'** administrateur,
**je veux** créer le profil d'un nouveau collaborateur,
**afin de** l'intégrer dans le système de suivi dès son arrivée.

**Champs :** prénom et nom, rôle/titre (optionnel), équipe d'appartenance (optionnel), date d'arrivée (optionnel), statut actif.

---

### F-20 — Modifier un collaborateur

**En tant qu'** administrateur,
**je veux** modifier les informations d'un collaborateur,
**afin de** les maintenir à jour (changement d'équipe, de rôle, départ…).

---

### F-21 — Désactiver un collaborateur

**En tant qu'** administrateur,
**je veux** désactiver le profil d'un collaborateur qui quitte l'entreprise,
**afin de** l'exclure des calculs actifs sans perdre son historique.

**Règle :** Un collaborateur inactif n'apparaît plus dans les sélecteurs et n'est pas comptabilisé dans les indicateurs d'engagement. Ses contributions passées restent enregistrées.

---

### F-22 — Import de collaborateurs en masse

**En tant qu'** administrateur,
**je veux** importer une liste de collaborateurs depuis un fichier Excel,
**afin de** créer plusieurs profils en une seule opération lors d'une initialisation ou d'une mise à jour groupée.

---

## 8. Lot 5 — Contributions

### Objectif

Enregistrer et suivre toutes les actions des collaborateurs qui ont été valorisées par des points.

---

### F-23 — Liste des contributions

**En tant qu'** utilisateur,
**je veux** consulter l'ensemble des contributions enregistrées,
**afin d'** avoir une vue complète de l'activité de la plateforme.

**Informations affichées :**
- Collaborateur concerné
- Type de contribution
- Date
- Lieu (si renseigné)
- Durée (si renseignée)
- Points attribués
- Commentaires (si renseignés)

**Fonctionnalités de recherche et de tri :** par collaborateur, par type, par date.

---

### F-24 — Enregistrer une contribution

**En tant qu'** administrateur,
**je veux** enregistrer une contribution pour un collaborateur,
**afin de** lui attribuer les points correspondants.

**Champs requis :** collaborateur (recherche par nom), type de contribution, date.
**Champs optionnels :** lieu, durée (en minutes), commentaires libres.

**Règle :** Les points sont déterminés automatiquement par le type de contribution sélectionné. Ils ne sont pas saisis manuellement.

---

### F-25 — Modifier une contribution

**En tant qu'** administrateur,
**je veux** corriger une contribution mal saisie,
**afin de** garantir l'exactitude des données.

---

### F-26 — Supprimer une contribution

**En tant qu'** administrateur,
**je veux** supprimer une contribution enregistrée par erreur,
**afin de** corriger le solde de points du collaborateur concerné.

**Règle :** La suppression recalcule automatiquement les points du collaborateur et de son équipe.

---

### F-27 — Configurer les types de contributions

**En tant qu'** administrateur,
**je veux** définir les types de contributions et leur valeur en points,
**afin d'** adapter le référentiel aux actions que l'entreprise souhaite valoriser.

**Champs :** nom du type, description (optionnel), valeur en points, indicateur KPI (oui/non).

**Exemples de types :** Article de blog (50 pts), Animation d'un atelier (100 pts), Présentation en conférence (200 pts), Revue de code (20 pts).

**Indicateur KPI :** Permet de distinguer les contributions qui entrent dans les rapports de performance de celles qui n'y figurent pas.

---

## 9. Lot 6 — Engagements

### Objectif

Suivre la participation des collaborateurs aux événements internes, pour mesurer le taux d'engagement et valoriser la présence collective.

---

### F-28 — Liste des événements

**En tant qu'** utilisateur,
**je veux** consulter tous les événements organisés,
**afin de** voir l'historique de l'activité événementielle.

**Informations affichées :**
- Nom de l'événement
- Date
- Type d'événement
- Nombre de participants

**Fonctionnalité :** En dépliant un événement, la liste des participants est visible.

---

### F-29 — Créer un événement

**En tant qu'** administrateur,
**je veux** enregistrer un événement,
**afin de** pouvoir suivre qui y a participé.

**Champs requis :** nom de l'événement, date, type d'événement.
**Champs optionnels :** description.
**Lors de la création :** possibilité d'ajouter immédiatement les participants (sélection multiple de collaborateurs).

---

### F-30 — Gérer les participants d'un événement

**En tant qu'** administrateur,
**je veux** ajouter ou retirer des participants à un événement,
**afin de** maintenir une liste de présence exacte.

**Règle :** La liste des participants est modifiable après la création de l'événement. Chaque ajout ou retrait est immédiatement pris en compte dans le calcul du taux d'engagement.

---

### F-31 — Modifier ou supprimer un événement

**En tant qu'** administrateur,
**je veux** corriger ou supprimer un événement,
**afin de** maintenir des données cohérentes.

---

### F-32 — Configurer les types d'événements

**En tant qu'** administrateur,
**je veux** définir les catégories d'événements,
**afin de** pouvoir les classer et les analyser.

**Champs :** nom du type, description (optionnel), statut actif/inactif.

**Exemples :** Réunion d'équipe, Formation, Conférence externe, Séminaire, Afterwork.

---

## 10. Lot 7 — Système de grades

### Objectif

Attribuer automatiquement des niveaux de reconnaissance aux collaborateurs en fonction des points qu'ils ont accumulés, pour donner un sentiment de progression visible.

---

### F-33 — Attribution automatique des grades

**En tant que** collaborateur suivi,
**je veux** qu'un grade me soit automatiquement attribué selon mes points,
**afin d'** avoir une reconnaissance visuelle de ma progression sans que personne n'ait à le faire manuellement.

**Règle de calcul :** Un collaborateur obtient le grade le plus élevé dont le seuil minimum de points est inférieur ou égal à ses points totaux. Si un collaborateur n'atteint aucun seuil, il n'a pas de grade.

**Affichage :** Chaque grade est représenté par un badge coloré avec une icône (emoji) et un nom. Il apparaît sur la fiche du collaborateur, dans la liste des astronautes et dans le tableau de bord.

---

### F-34 — Configurer les grades

**En tant qu'** administrateur,
**je veux** définir les grades et leurs seuils,
**afin d'** adapter la progression aux objectifs de l'entreprise.

**Champs :** nom du grade, seuil minimum de points, couleur distinctive, icône (emoji).

**Règle :** Les grades sont triés du plus bas au plus haut selon leur seuil. Il ne doit pas y avoir de chevauchement.

**Exemples :**
- 🥉 Bronze — à partir de 0 point
- 🥈 Argent — à partir de 50 points
- 🥇 Or — à partir de 150 points
- 💎 Platine — à partir de 300 points

---

### F-35 — Voir le prochain grade à atteindre

**En tant qu'** utilisateur,
**je veux** savoir combien de points il manque à un collaborateur pour atteindre son prochain grade,
**afin de** pouvoir l'encourager à contribuer davantage.

**Affichage :** Sur la fiche d'un collaborateur : grade actuel + "X points pour atteindre [grade suivant]".

---

## 11. Lot 8 — Saisons

### Objectif

Structurer l'activité en périodes définies pour permettre des comparaisons et des analyses sur des intervalles de temps cohérents.

---

### F-36 — Filtrage automatique par saison active

**En tant qu'** utilisateur,
**je veux** que toutes les statistiques du tableau de bord soient automatiquement filtrées sur la saison en cours,
**afin de** voir les données pertinentes pour la période actuelle sans avoir à configurer de filtre manuellement.

**Règle :** Si une saison est active, le tableau de bord, le classement des équipes et les indicateurs d'engagement se basent sur les données comprises entre la date de début et la date de fin de cette saison.

---

### F-37 — Créer une saison

**En tant qu'** administrateur,
**je veux** créer une nouvelle saison,
**afin de** définir la prochaine période de suivi.

**Champs :** nom de la saison, date de début, date de fin.

**Règles :**
- La date de fin doit être postérieure à la date de début
- Une saison peut être créée sans être immédiatement activée

---

### F-38 — Activer une saison

**En tant qu'** administrateur,
**je veux** activer une saison,
**afin que** les calculs et indicateurs se basent sur cette période.

**Règle :** Il ne peut y avoir qu'une seule saison active à la fois. Activer une saison désactive automatiquement la précédente.

---

### F-39 — Supprimer une saison inactive

**En tant qu'** administrateur,
**je veux** supprimer une saison qui n'est plus utile,
**afin de** maintenir un référentiel propre.

**Règle :** Une saison active ne peut pas être supprimée.

---

## 12. Lot 9 — Administration et configuration

### Objectif

Donner aux administrateurs les outils pour gérer les comptes utilisateurs de l'application et maintenir l'ensemble du paramétrage.

---

### F-40 — Gestion des utilisateurs de l'application

**En tant qu'** administrateur,
**je veux** gérer les comptes des personnes qui ont accès à Galaxy Master,
**afin de** contrôler qui peut consulter ou modifier les données.

**Informations affichées :**
- Email, nom complet, rôle actuel, date de création du compte

**Actions disponibles :**
- Modifier le rôle d'un utilisateur (Administrateur ↔ Observateur)
- Créer un accès pour un nouvel utilisateur

---

### F-41 — Navigation structurée

**En tant qu'** utilisateur,
**je veux** disposer d'une navigation claire et persistante,
**afin d'** accéder rapidement à n'importe quelle section de l'application.

**Structure de la navigation (barre latérale) :**

Sections principales :
- Tableau de bord
- Planètes
- Astronautes
- Contributions
- Engagements

Section configuration (accessible aux administrateurs) :
- Configuration des planètes
- Types de contributions
- Types d'événements
- Grades
- Saisons
- Utilisateurs
- Paramètres

**Règle :** Les éléments de configuration ne sont visibles que par les administrateurs.

---

### F-42 — Adaptation mobile

**En tant qu'** utilisateur sur mobile ou tablette,
**je veux** que l'application soit utilisable sur mon appareil,
**afin de** pouvoir consulter les données en déplacement.

**Règle :** La navigation se rétracte automatiquement sur les petits écrans et est accessible via un bouton dédié.

---

### F-43 — Notifications de confirmation

**En tant qu'** administrateur,
**je veux** être informé du succès ou de l'échec de chaque action que j'effectue,
**afin de** savoir si mon action a bien été prise en compte.

**Comportement :**
- Toute création, modification ou suppression déclenche une notification temporaire en bas de l'écran
- En cas de succès : message de confirmation (ex : "Contribution créée")
- En cas d'échec : message d'erreur explicite (ex : "Échec de la création — vérifiez les champs obligatoires")

---

## 13. Règles transversales

### Accès et visibilité

| Règle | Détail |
|-------|--------|
| **Aucune page publique** | Toute l'application nécessite une connexion |
| **Rôle Observateur = lecture seule** | Aucun bouton de création, modification ou suppression n'est affiché aux observateurs |
| **Configuration réservée aux admins** | Les pages de configuration (grades, saisons, types, utilisateurs) sont invisibles pour les observateurs |
| **Données historiques conservées** | La désactivation d'un collaborateur ou d'une équipe ne supprime jamais l'historique |

### Calculs automatiques

| Règle | Détail |
|-------|--------|
| **Points déterminés par le type** | La valeur en points d'une contribution n'est jamais saisie manuellement — elle découle du type sélectionné |
| **Grades calculés automatiquement** | Dès qu'une contribution est enregistrée ou supprimée, le grade du collaborateur est recalculé |
| **Taux d'engagement calculé automatiquement** | Il se met à jour dès qu'un participant est ajouté ou retiré d'un événement |
| **Points d'équipe = contributions + bonus** | Le total d'une équipe est la somme des contributions de ses membres et des points bonus qui lui ont été attribués |
| **Filtre de saison automatique** | Si une saison est active, les indicateurs du tableau de bord et le classement ne portent que sur cette période |

### Cohérence des données

| Règle | Détail |
|-------|--------|
| **Une seule saison active** | Activer une nouvelle saison désactive l'ancienne |
| **Validation des formulaires** | Tous les champs obligatoires sont vérifiés avant envoi. Les erreurs sont affichées de façon inline |
| **Points bonus négatifs autorisés** | Il est possible de déduire des points à une équipe (ex : pénalité) |
| **Import Excel = complément, pas remplacement** | L'import en masse n'écrase pas les données existantes |

---

## 14. Parcours utilisateurs clés

### Parcours 1 — Premiers pas d'un administrateur qui initialise la plateforme

```
1. L'admin se connecte pour la première fois
2. Il accède à "Configuration → Planètes" et crée ses équipes
3. Il accède à "Configuration → Types de contributions" et définit les actions valorisées
   (ex: Article de blog = 50 pts, Workshop = 100 pts)
4. Il accède à "Configuration → Grades" et configure les paliers
   (ex: Bronze 0 pt, Argent 50 pts, Or 150 pts)
5. Il accède à "Configuration → Saisons" et crée la première saison
   (ex: "Q1 2026" du 01/01/2026 au 31/03/2026) puis l'active
6. Il accède à "Astronautes" et importe la liste des collaborateurs via Excel
7. Le tableau de bord affiche désormais des données en temps réel
```

---

### Parcours 2 — Enregistrement d'une contribution

```
1. Alice a publié un article de blog sur le site d'Eleven Labs
2. L'admin accède à "Contributions" et clique sur "Ajouter"
3. Il sélectionne Alice dans le champ collaborateur (recherche par nom)
4. Il sélectionne le type "Article de blog"
5. Il renseigne la date de publication, ajoute un lien dans les commentaires
6. Il valide → Alice reçoit 50 points
7. Sur le tableau de bord : les points de l'équipe d'Alice sont mis à jour,
   son grade est recalculé, elle apparaît dans le classement des contributeurs
```

---

### Parcours 3 — Organisation et suivi d'un événement

```
1. L'équipe organise un atelier interne "Clean Code" le 15 mars
2. L'admin accède à "Engagements" et crée l'événement :
   nom = "Atelier Clean Code", date = 15/03/2026, type = "Formation"
3. Il sélectionne les 8 collaborateurs présents
4. Le lendemain, 2 collaborateurs supplémentaires demandent à être ajoutés
5. L'admin modifie l'événement et ajoute les 2 participants
6. Sur le tableau de bord : le taux d'engagement est recalculé automatiquement
```

---

### Parcours 4 — Consultation en tant qu'observateur

```
1. Un manager (rôle Observateur) se connecte
2. Il consulte le tableau de bord : il voit le classement, le taux d'engagement,
   le top 5 des contributeurs, la répartition des types de contributions
3. Il clique sur "Planètes" pour voir le détail de son équipe
4. Il clique sur "Astronautes" pour voir les grades et points de chaque membre
5. Il n'a aucun bouton "Créer", "Modifier" ou "Supprimer" dans l'interface
```

---

### Parcours 5 — Attribution de points bonus à une équipe

```
1. La planète Donut a organisé un événement exceptionnel non prévu dans le référentiel
2. L'admin accède à la page "Planètes"
3. Sur la ligne de la planète Donut, il clique sur "Ajouter un bonus"
4. Il saisit : +75 points, libellé = "Organisation du Hackathon interne", date = 20/03/2026
5. Le total de points de la planète Donut est immédiatement mis à jour dans le classement
```

---

### Parcours 6 — Changement de saison

```
1. Fin du Q1 2026 approche — l'admin veut démarrer le Q2
2. Il accède à "Configuration → Saisons"
3. Il crée la saison "Q2 2026" avec dates du 01/04/2026 au 30/06/2026
4. Il active la nouvelle saison
5. Le tableau de bord bascule automatiquement sur les données du Q2
6. Les contributions de Q1 sont toujours consultables dans l'historique global
```
