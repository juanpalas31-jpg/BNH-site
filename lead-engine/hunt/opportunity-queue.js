export function buildOpportunityQueue(opportunities = []) {
  const bestBySession = new Map();

  for (const o of opportunities) {
    if (!o?.session_id || !o?.tenant_id || !o?.project_id) continue;
    const key = `${o.tenant_id}|${o.project_id}|${o.session_id}`;
    const current = bestBySession.get(key);
    if (!current || Number(o.score || 0) > Number(current.score || 0)) bestBySession.set(key, o);
  }

  return [...bestBySession.values()]
    .filter(o => o.intent === 'high' || o.intent === 'medium')
    .sort((a,b) => Number(b.score || 0) - Number(a.score || 0))
    .map((o,index) => ({
      ...o,
      priority: index + 1,
      queue_key: `${o.tenant_id}:${o.project_id}:${o.session_id}`
    }));
}

export function nextOpportunity(queue = [], tenantId, projectId) {
  return queue.find(o => o.tenant_id === tenantId && o.project_id === projectId) || null;
}
