/** Attila future-market DNA — architecture only; no autonomous execution. */
export const ATTILA_FUTURE_MARKETS_DNA = Object.freeze({
  version: '1.0.0',
  engine: 'Spider Engine',
  priority_project: 'bnh-site',
  rules: Object.freeze({
    separate_projects: true,
    research_and_design_only: true,
    autonomous_publish: false,
    autonomous_prospecting: false,
    autonomous_contact: false,
    autonomous_spend: false,
    cross_project_personal_data_sharing: false,
    require_human_approval_for_activation: true,
    no_fabricated_market_data: true
  }),
  reserves: Object.freeze([
    Object.freeze({
      id: 'frozen-home-delivery',
      market: 'Livraison de produits surgelés à domicile',
      status: 'DORMANT',
      workstreams: Object.freeze(['demande et concurrence', 'segments clients', 'contenus SEO', 'logistique et chaîne du froid', 'économie unitaire', 'cadre réglementaire']),
      activation: 'EXPLICIT_HUMAN_APPROVAL'
    }),
    Object.freeze({
      id: 'real-estate',
      market: 'Immobilier',
      status: 'DORMANT',
      workstreams: Object.freeze(['marchés locaux', 'vendeurs acheteurs bailleurs', 'contenus SEO', 'qualification', 'modèles économiques', 'carte professionnelle et RGPD']),
      activation: 'EXPLICIT_HUMAN_APPROVAL'
    })
  ])
});
export function listAttilaReserveMarkets() {
  return ATTILA_FUTURE_MARKETS_DNA.reserves.map(({id,market,status,workstreams})=>({id,market,status,workstreams:[...workstreams]}));
}
