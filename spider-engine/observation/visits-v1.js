// SPIDER ENGINE / ATTILA — CODE OBSERVATION V1
// Mission unique : observer les visites. Aucun clic, lead ou vente n'entre dans le KPI de cet exercice.
export const OBSERVATION_MODE = Object.freeze({
  id: "OBSERVATION_VISITS_V1",
  active: true,
  project: "TOILE_DOR",
  ownerEngine: "SPIDER_ENGINE",
  observerAgent: "ATTILA",
  metric: "PAGEVIEWS",
  ignore: ["CLICKS","OUTBOUND_CLICKS","LEADS","SALES","REVENUE"],
  environments: ["production"],
  rules: {
    mutateSiteDuringObservation: false,
    optimizeFromClicks: false,
    optimizeFromSales: false,
    reportOnlyObservedData: true,
    neverInventHistoricalData: true
  }
});
