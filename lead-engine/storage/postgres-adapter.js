import { StorageAdapter } from './adapter.js';
import { sanitizeAttilaState } from './attilla-state-sanitizer.js';

/**
 * Portable PostgreSQL adapter.
 * Receives an injected query(sql, params) function so the engine is not tied
 * to Neon, Supabase, Vercel Postgres or any specific client library.
 */
export class PostgresStorageAdapter extends StorageAdapter {
  constructor({ query }) { super(); if(typeof query!=='function') throw new Error('query function required'); this.query=query; }

  async saveLead(l){
    await this.query(`INSERT INTO leads (lead_id,tenant_id,project_id,session_id,nom,telephone,email,code_postal,source,canal,campagne,utm_source,utm_medium,utm_campaign,received_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      ON CONFLICT (lead_id) DO NOTHING`,
      [l.lead_id,l.tenant_id,l.project_id,l.session_id||null,l.nom||null,l.telephone||null,l.email||null,l.code_postal||null,l.source||null,l.canal||null,l.campagne||null,l.utm_source||null,l.utm_medium||null,l.utm_campaign||null,l.received_at]);
    return {ok:true,id:l.lead_id};
  }

  async saveEvent(e){
    await this.query(`INSERT INTO events (event_id,tenant_id,project_id,session_id,event,path,source,canal,campagne,local_day,local_hour,target,duration_seconds,browser_timestamp,received_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      ON CONFLICT (event_id) DO NOTHING`,
      [e.event_id,e.tenant_id,e.project_id,e.session_id||null,e.event||null,e.path||null,e.source||null,e.canal||null,e.campagne||null,e.local_day||null,e.local_hour??null,e.target||null,e.duration_seconds??e.duration_sec??null,e.browser_timestamp||null,e.received_at]);
    return {ok:true,id:e.event_id};
  }

  async saveAttilaState(input){
    const s=sanitizeAttilaState(input);
    await this.query(`INSERT INTO attila_states (tenant_id,project_id,identity,posture,posture_since,state,schema_version,updated_at)
      VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8)
      ON CONFLICT (tenant_id,project_id) DO UPDATE SET
        identity=EXCLUDED.identity,posture=EXCLUDED.posture,posture_since=EXCLUDED.posture_since,
        state=EXCLUDED.state,schema_version=EXCLUDED.schema_version,updated_at=EXCLUDED.updated_at`,
      [input.tenant_id||'bnh',input.project_id||'bnh-site',s.identity,s.posture,s.posture_since||null,JSON.stringify(s),s.schema_version,s.updated_at]);
    return {ok:true,tenant_id:input.tenant_id||'bnh',project_id:input.project_id||'bnh-site',posture:s.posture};
  }

  async loadAttilaState(tenantId='bnh',projectId='bnh-site'){
    const r=await this.query('SELECT state FROM attila_states WHERE tenant_id=$1 AND project_id=$2 LIMIT 1',[tenantId,projectId]);
    const rows=r?.rows||r||[];
    return rows[0]?.state||null;
  }

  async healthcheck(){ const r=await this.query('SELECT 1 AS ok',[]); return {ok:Boolean(r),provider:'postgres'}; }
  async exportLeads(t,p){ const r=await this.query('SELECT * FROM leads WHERE tenant_id=$1 AND project_id=$2 ORDER BY received_at',[t,p]); return r.rows||r; }
  async exportEvents(t,p){ const r=await this.query('SELECT * FROM events WHERE tenant_id=$1 AND project_id=$2 ORDER BY received_at',[t,p]); return r.rows||r; }
}
