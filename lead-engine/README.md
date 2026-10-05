# Lead Engine — architecture portable

Ce dossier décrit le moteur de collecte et de suivi indépendamment de BNH.

## Principes
- BNH est un tenant/client, pas le moteur.
- Les leads et événements ont des identifiants stables.
- La base primaire doit être exportable et restaurable.
- Google Sheets est une vue/export, jamais l'unique source de vérité.
- Aucun secret n'est stocké dans Git.
- Une migration de fournisseur ne doit pas changer le format métier.

## Contrat de données
### Lead
tenant_id, project_id, lead_id, session_id, received_at, nom, telephone, email, code_postal, source, canal, campagne, utm_source, utm_medium, utm_campaign, content_page, statut, date_rdv, resultat, montant_devis, ca_signe.

### Event
tenant_id, project_id, event_id, session_id, received_at, browser_timestamp, path, event, source, canal, campagne, local_day, local_hour, target, duration_sec.

## Configuration initiale
tenant_id: bnh
project_id: bnh-site

## Migration
1. Conserver le webhook Apps Script actuel tant que le nouveau stockage n'est pas validé.
2. Brancher une base primaire exportable derrière les API serveur.
3. Écrire simultanément dans l'ancien circuit pendant les tests.
4. Vérifier intégrité, doublons et restauration.
5. Basculer la base primaire puis garder Sheets comme export/tableau de bord.
6. Supprimer la dépendance Apps Script seulement après validation.

## Sauvegarde/restauration
Prévoir exports structurés (CSV/JSON), schéma versionné, procédure de restauration et contrôle périodique de restauration.
