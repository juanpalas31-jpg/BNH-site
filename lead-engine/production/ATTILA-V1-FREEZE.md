# ATTILA V1 INTEGRATION FREEZE

Status: CODE-INTEGRATED V1.

V1 core:
- integrated Attila runtime
- mission state machine
- evidence-gated mission runner
- durable mission adapter for PostgreSQL
- mission resume boundary
- turnkey client mission
- consent-based invitation mission
- API mission/forge boundary
- NanoTila guardian policy
- photobooth control/readiness boundary
- structural-learning return path
- V1 green-space integration harness

Production proof still depends on deployment environment:
- PostgreSQL schema must actually be applied to the configured production database.
- External registrar/hosting/ads/analytics connectors require authorized provider connections.
- Provider-required 2FA, CAPTCHA, banking or legal confirmation remains human/provider controlled.
- No external purchase, publication or ad spend is claimed without provider evidence.

Freeze rule:
Do not add new V1 organs before integration defects and deployment evidence are addressed.
New capabilities belong to V1.x/V2.
