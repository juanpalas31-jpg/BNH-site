# BNH — Production launch gate

The BNH funnel is allowed to receive a real prospect only when every item below is verified on the deployed production instance.

## Code gates — VERIFIED by CI

- Browser submits the lead to `/api/lead` before the external notification relay.
- A failed Spider Engine capture stops the relay and displays a retry message.
- Required lead fields are validated server-side.
- Lead fields and attribution values are sanitized/normalized.
- BNH Opportunity + Attila hunting card are built after successful persistence.
- Consent, requested-assessment intent, session ID and UTM attribution travel with the lead.
- Confirmation redirect uses the active deployment origin.
- Automated BNH funnel contract passes Spider Engine CI.

## Production gates — must be verified live

1. `BNH_SHEETS_WEBHOOK_URL` (or a subsequently approved durable provider) is configured in the production deployment.
2. POST `/api/lead` with a controlled test prospect returns HTTP 200 and `ok:true`.
3. The returned payload identifies tenant `bnh`, project `bnh-site`, a lead ID, storage provider, commercial opportunity and hunting card.
4. The exact test lead exists in the configured storage destination.
5. The external BNH notification arrives once.
6. The browser lands on `/merci.html` on the same production origin.
7. A page-view/event can be persisted through `/api/event`.
8. No duplicate lead is created by one form submission.

## Status vocabulary

- CODE_READY: all repository/CI gates pass.
- PRODUCTION_READY: all live production gates above pass.
- FIRST_PROSPECT_READY: PRODUCTION_READY plus the operator confirms where incoming BNH leads are reviewed and followed up.

Never promote BNH to PRODUCTION_READY from CI evidence alone.
