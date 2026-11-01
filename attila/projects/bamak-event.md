# Bamak Event — Attila project integration

Project ID: `bamak-event`
Business: photobooth / photomaton rental and event services.
Scope: separate from the historic BAMAK grocery business and from other project data.

## Previously discussed technical context (not yet independently verified)
- Existing photobooth back office hosted on an OVH VPS.
- Remote visibility: booth heartbeat, camera, printer, Wi-Fi, Windows, upload queue and last contact.
- Back-office features: booth configuration, PIN, photo gallery and QR sharing.
- Remote restart commands for booth/application; actual protocol and authorization require verification.
- Attila API integration discussed historically; no live connectivity is assumed.

## Proposed read-only adapter contracts
- `BOOTH_STATUS`: authorized booth health, last heartbeat, printer/camera availability.
- `EVENT_BOOKINGS`: authorized event schedule, booking state and delivery requirements.
- `PHOTO_DELIVERY`: aggregate queue and delivery status, without ingesting private photos.
- `COMMERCIAL_METRICS`: qualified inquiries, quotes, confirmed bookings and realized revenue.

## Safety and next checks
- No device restart, remote configuration change, message, payment, photo access or publication without explicit scoped authorization.
- Do not embed credentials or personal gallery content in project memory or logs.
- Confirm actual VPS endpoint, API protocol, authenticated identity, and current deployment before enabling executors.
- Keep this project in PRE_FLIGHT / read-only mode until verified.
