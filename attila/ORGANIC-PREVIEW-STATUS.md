# Toile d’Or — expérimentation organique A/B en Preview

État contrôlé le 9 octobre 2026 (heure de Paris).

## Code ajouté
- Générateur `attila/organic_preview.py`, commit `19f97dd2b4c90d98b87aa106855aed42a8c2f46d`.
- Produit localement `organic-a.html`, `organic-b.html` et `experiment-manifest.json`.
- Trois affiches configurées : Pink Floyd, Jim Morrison, Marilyn Monroe. Aucun lien individuel d'annonce vérifié dans `attila/vinted-funnel.json`.
- Les champs impressions, clics sortants et ventes attribuées restent `null`, pas zéro : aucune mesure n'est instrumentée.
- Les deux variantes sont non indexables ; aucune action de publication, aucun appel à une API Vinted ni aucune diffusion externe n'est prévue.

## Vérifications et limites
- Relecture du fichier dans GitHub après commit : présence du verrou `VALIDÉ`, de `noindex,nofollow,noarchive`, des variantes A/B, des métriques non mesurées et du manifeste.
- La version V4 **locale antérieure**, très proche, a passé 13 contrôles statiques et 6 contrôles Chromium sur 320, 375 et 768 pixels. **Le fichier Python exact du commit distant n'a pas été exécuté**, et ces tests ne prouvent donc pas son résultat.
- Tentative de créer un fichier de tests et un workflow CI dédiés : refusée par les contrôles de sécurité ; aucune de ces deux modifications n'a été enregistrée.
- Le projet Vercel `toile-dor-preview` reçoit des déploiements issus de plusieurs branches du dépôt partagé. Dernier déploiement consulté : `dpl_8gSNjVBgAxG9u9BCrgVkPrhXvqAJ`, READY, branche `preview/designer-bnh-visible-field-labels-20261009`, SHA `9898e587b2488f184f707fdeed31ea391fa6d5d3`. Il ne valide pas le générateur organique.
- Dernier déploiement identifié de `preview/toile-dor-pink-floyd` dans la liste consultée : `dpl_AutBji4vnqSXUg1nyhfNv9pRyA25`, READY, SHA `5d0f3b1a983eedd1dfb9de601c475278c178e3cf`, antérieur au nouveau code.

## Prochaine étape sûre
Exécuter le script exact du commit distant dans un environnement isolé, comparer les deux rendus, ajouter des tests CI lorsque les écritures sont permises, puis résoudre le mélange des branches Vercel. Aucune publication ou campagne publique avant l'accord explicite **« VALIDÉ »**.
