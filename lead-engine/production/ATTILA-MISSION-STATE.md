# Attila mission state machine

INTAKE -> CONSENT -> DISCOVERY -> DESIGN -> BUILD -> TEST -> APPROVAL -> PUBLISH -> GROW -> GUARD -> HANDOFF -> CLOSE.

A phase advances only with verified evidence. Consent, payment/spend authority and publication authority are separate concepts.

Human intervention is expected when an external provider requires banking confirmation, CAPTCHA, 2FA, legal acceptance or another non-delegable step.

The mission dashboard exposes the current phase, blockers, approvals, evidence, artifacts, guardians and next action so Attila cannot truthfully claim a later phase before the earlier one is evidenced.
