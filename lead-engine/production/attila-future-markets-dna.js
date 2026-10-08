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
      id: 'international-financial-markets',
      market: 'Marchés financiers internationaux — trading',
      status: 'DORMANT',
      operating_mode: 'PAPER_TRADING_ONLY',
      principle: 'CAPITAL_PRESERVATION_FIRST',
      workstreams: Object.freeze(['données de marché vérifiées', 'backtesting sans biais de regard vers le futur', 'simulation avec frais et glissement', 'détection de volatilité et liquidité', 'analyse des pertes extrêmes', 'suivi du risque et de la performance nette']),
      safeguards: Object.freeze({
        real_money_orders: false,
        broker_credentials: false,
        leverage: false,
        margin: false,
        short_selling: false,
        autonomous_live_execution: false,
        emergency_stop_on_missing_data: true,
        emergency_stop_on_market_anomaly: true,
        never_promise_passive_income: true,
        human_approval_required_before_any_live_trading: true
      }),
      activation: 'EXPLICIT_HUMAN_APPROVAL_AND_SEPARATE_RISK_REVIEW'
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
