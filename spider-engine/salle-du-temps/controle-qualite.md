# Protocole qualité — Salle du Temps

## Objectif
Chaque module doit être traçable depuis sa demande initiale jusqu'à son contrôle, sans confusion entre création du fichier, exécution des tests et publication.

## États autorisés
- `knowledge_requested_not_yet_built` : sujet demandé, aucun guide construit.
- `guide_preview_created` : guide créé en branche Preview, pas de publication autorisée.
- `review_pending` : contrôle technique ou réglementaire nécessaire.
- `reviewed` : revue documentée avec preuves et limites.
- `approved_for_release` : uniquement après accord explicite « VALIDÉ ».

## Contrôles avant présentation
1. Relire le registre JSON et vérifier les identifiants uniques.
2. Vérifier les fichiers référencés et les liens de navigation.
3. Vérifier les liens de formulaire, l'accessibilité et les balises Preview.
4. Exécuter les scripts localement ou en CI ; conserver la sortie exacte.
5. Tester sur navigateur mobile et ordinateur ; noter les défauts.
6. Pour les conseils à risques (électricité, plomberie, propulsion), vérifier les sources et demander la revue d'un professionnel compétent.
7. Conserver un rapport daté distinguant « contrôlé », « non exécuté » et « à corriger ».

## Barrière de publication
Aucune fusion ni publication commerciale sans l'autorisation exacte « VALIDÉ ». Un commit sur la branche Preview n'est pas une mise en production.

## Limites
Ce dépôt ne collecte pas automatiquement toutes les conversations ChatGPT. Attila et Spider Engine désignent ici une organisation documentaire et des scripts, pas un agent autonome en exécution permanente.
