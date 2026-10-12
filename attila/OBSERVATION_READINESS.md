# Toile d'Or — protocole d'observation, critères vérifiables

Ce document décrit les conditions d'activation du test 1 sur le déploiement EXISTANT. Ne pas créer un second site, remplacer la galerie photographique ou mélanger les projets.

## État observé le 12 octobre 2026
- Projet Vercel retrouvé : toile-dor-preview (prj_ahlSNMqUIB3CBOM5vYE7jiJ2ZzXY).
- Projet Vercel : live=false, SSO actif, dernier déploiement BLOCKED. Déploiement antérieur READY (non équivalent à une page publique vérifiée).
- Branche de réconciliation : work/toile-dor-reconciliation-20261012.
- build_preview.py utilise sessionStorage pour compter les clics : ces événements ne quittent pas le navigateur, donc aucun rapport central n'est possible à partir de cette implémentation.
- La branche de réconciliation utilise noindex : aucune indexation SEO publique ne doit être annoncée pour cette version.
- Le code de réconciliation montre des cartes sans photographies réelles : ne pas substituer ce code à la galerie photographique d'origine.

## Conditions nécessaires avant de déclarer « observation active »
1. Identifier la version photographique originale et l'URL publique CANONIQUE ; ne pas réinitialiser le déploiement ni l'historique.
2. Préserver les deux liens de test Freud et Bob Marley ; vérifier leur destination effective sans inventer de disponibilité Vinted.
3. Vérifier qu'un collecteur central reçoit un événement page_view et un événement outbound_click avec l'identifiant de l'affiche, horodatage UTC et source UTM, sans nom, e-mail ni IP stockée en clair.
4. Tester la collecte par une visite de test réelle et un clic réel ; lire les événements depuis le système de stockage, pas depuis sessionStorage.
5. Vérifier le tableau de bord avec au minimum visites, visiteurs uniques estimés (définition documentée), clics Freud, clics Bob Marley, origine, jour et heure. Les événements de test doivent être distingués des visites organiques.
6. Vérifier les balises title, description, canonical, robots, sitemap et réponse HTTP de la version publique ; un noindex interdit de présenter le SEO comme opérationnel.
7. Vérifier depuis mobile et ordinateur ; conserver les chiffres déjà enregistrés, sans remettre les compteurs à zéro.

## Règle de compte rendu
Tant que les étapes 3 et 4 ne sont pas réussies, écrire « TRACKING NON VÉRIFIÉ », jamais « tracking opérationnel ». Une absence d'événements vérifiés n'est pas la preuve de zéro visite. Ne pas annoncer 100 visites ou 1000 visiteurs sans extraction horodatée.
