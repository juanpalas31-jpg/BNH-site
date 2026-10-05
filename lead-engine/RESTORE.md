# Plan de continuité et restauration

Objectif : pouvoir déplacer ou reconstruire le moteur sans perdre les données métier.

## Ce qui doit survivre à un changement de fournisseur
1. Schéma de données versionné dans Git.
2. Configuration des entreprises versionnée sans secrets.
3. Export complet des leads et événements en JSON/CSV.
4. Identifiants stables : tenant_id, project_id, lead_id, event_id, session_id.
5. Procédure de réimport indépendante du fournisseur.

## Contrôles avant bascule
- Compter les leads source et destination.
- Vérifier l'unicité des Lead ID.
- Vérifier les événements reliés aux Session ID.
- Comparer un échantillon de dates, sources, campagnes et coordonnées.
- Tester un export puis une restauration.
- Conserver l'ancien stockage en lecture/secours pendant la validation.

## Règle de sécurité
Aucune suppression de l'ancien circuit avant validation d'une restauration réelle.

## Secrets
Les clés API, mots de passe, webhooks et jetons ne doivent jamais être committés dans Git.
Ils sont injectés au runtime via variables d'environnement et doivent pouvoir être remplacés.
