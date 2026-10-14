# Spider Engine — module Radio Vintage

Ce module est une spécification technique centrale pour le projet indépendant **Toile d’Or**. Il ne charge aucun lecteur audio sur le site BNH et ne mélange pas les données des deux activités.

## Contrat du module

- **Projet cible** : `Toile-d-or` uniquement.
- **Interface** : `vintage-radio.js`, sur la branche de développement `stripe-test-preview`.
- **Lecteur de compilation** : `gallery-playlist.js`.
- **Catalogue des flux Internet** : `radio-stations.js`.
- **Déclenchement** : lecture après clic explicite du visiteur, jamais automatique au chargement.
- **Commandes** : marche/arrêt, station suivante, volume 0–100 %.
- **Sécurité** : flux HTTPS uniquement, pas d'URL de station arbitraire injectée par le visiteur.
- **Droits** : activer seulement les stations autorisant l'intégration sur un site commercial et les enregistrements sous licence commerciale compatible, après conservation des preuves.
- **Résilience** : erreur réseau ou flux indisponible → état arrêté, sans casser la galerie.
- **Isolation** : aucun flux audio, cookie, statistique ou script Toile d’Or n'est injecté dans BNH.

## Statut au 14 octobre 2026

Le moteur et l'interface sont codés sur la branche de développement de Toile d’Or. Aucun flux musical n'est encore certifié ni activé. La publication en production attend la validation fonctionnelle et juridique.

## Critères de recette

1. La page BNH demeure inchangée visuellement et fonctionnellement.
2. Le visiteur de Toile d’Or peut allumer/éteindre la radio, changer de station et régler le volume.
3. Le volume est conservé au changement de station.
4. La radio ne joue rien avant une interaction explicite.
5. Aucun média non autorisé n'est activé.
6. La radio ne bloque pas les pages, les liens Vinted ou les paiements.
