const ACTIONS = Object.freeze({
  OBSERVE: 'observe',
  NURTURE: 'continue_nurture',
  PRIORITIZE: 'prioritize_followup'
});

export function decideAction(opportunity, policy = {}) {
  const allowed = new Set(policy.allowed_actions || [ACTIONS.OBSERVE]);

  const desired =
    opportunity.intent === 'high' ? ACTIONS.PRIORITIZE :
    opportunity.intent === 'medium' ? ACTIONS.NURTURE :
    ACTIONS.OBSERVE;

  return {
    desired_action: desired,
    action: allowed.has(desired) ? desired : ACTIONS.OBSERVE,
    authorized: allowed.has(desired),
    reason: allowed.has(desired) ? 'policy_allows' : 'policy_blocks'
  };
}

export function defaultPolicy() {
  return {
    version: 1,
    allowed_actions: [ACTIONS.OBSERVE],
    automatic_contact: false,
    automatic_purchase: false,
    automatic_publication: false
  };
}
