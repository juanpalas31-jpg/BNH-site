// SPIDER ENGINE / ATTILA — CODE OBSERVATION V1
// Exercice 1 : VISITES UNIQUEMENT.
// Seuil de sortie : 1 000 pageviews observées. Au seuil, maintenance puis nouvel exercice.
export const OBSERVATION_MODE = Object.freeze({
  id: "OBSERVATION_VISITS_V1",
  active: true,
  project: "TOILE_DOR",
  ownerEngine: "SPIDER_ENGINE",
  observerAgent: "ATTILA",
  metric: "PAGEVIEWS",
  target: 1000,
  onTarget: "MAINTENANCE",
  ignore: ["CLICKS","OUTBOUND_CLICKS","LEADS","SALES","REVENUE"],
  environments: ["production"],
  rules: {
    mutateSiteDuringObservation: false,
    optimizeFromClicks: false,
    optimizeFromSales: false,
    salesAreBonusOnly: true,
    reportOnlyObservedData: true,
    neverInventHistoricalData: true,
    stopObservationAtTarget: true,
    enterMaintenanceAtTarget: true
  }
});
