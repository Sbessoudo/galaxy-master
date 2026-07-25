# Proposal AU-02: Déconnexion

## Summary
Bouton de déconnexion permanent dans le header, appelant Supabase signOut et redirigeant vers `/login`.

## Motivation
Les utilisateurs doivent pouvoir se déconnecter depuis n'importe quelle page de l'application. La déconnexion efface la session côté serveur et côté client pour éviter tout accès résiduel.

## Proposed Solution
Un bouton "Déconnexion" dans le header de l'application (layout partagé). Au clic, une Server Action appelle `supabase.auth.signOut()`, efface les cookies de session, et redirige vers `/login`.

## Scope
### In scope
- Bouton de déconnexion dans le header (visible sur toutes les pages authentifiées)
- Server Action `signOut` effaçant la session Supabase
- Redirection vers `/login` après déconnexion
- Effacement des cookies de session

### Out of scope
- Confirmation de déconnexion (action directe, pas de modale)
- Déconnexion de tous les appareils (single device logout uniquement)
- Notification de déconnexion automatique (inactivité)
