// SPIDER ENGINE / ATTILA — OBSERVATION V1
// État exécutable de l'exercice Toile d'Or : VISITES UNIQUEMENT.
export const OBSERVATION_MODE = Object.freeze({
  id: "OBSERVATION_VISITS_V1",
  active: true,
  state: "OBSERVATION",
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

export function observationStatus(pageviews) {
  const visits = Math.max(0, Number(pageviews) || 0);
  const reached = visits >= OBSERVATION_MODE.target;
  return Object.freeze({
    exercise: 1,
    state: reached ? "MAINTENANCE" : "OBSERVATION",
    pageviews: visits,
    target: OBSERVATION_MODE.target,
    remaining: Math.max(0, OBSERVATION_MODE.target - visits),
    progressPercent: Math.min(100, (visits / OBSERVATION_MODE.target) * 100),
    freezeOptimizations: !reached,
    maintenanceRequired: reached
  });
}
