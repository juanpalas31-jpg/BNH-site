# Attila Digital Vivarium
A simulated digital spider, not biological life or proven consciousness.
Entry: hatchVivarium({ownerId,workspaceId}); vivariumTick(state,{world,stimuli}).
Worlds: NEST, FINANCIAL_MARKETS (paper-only), HABITAT, CONTENT_WEBS.
Internal model: energy, alertness, position, tick age, mode, last 100 observations.
Central cognition: each tick calls runCognitiveCycle and retains brain in the returned state.
No autonomous external actions or financial orders.
State exists only in memory until the caller persists it. Do not expose to public users or use client-supplied identity as authentication. Future: authenticated encrypted storage, scheduled ticks, observability, graphical vivarium, tests and verified deployment.
