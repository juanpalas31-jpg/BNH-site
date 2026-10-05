import { StorageAdapter } from './adapter.js';

/**
 * Portable PostgreSQL adapter.
 * Receives an injected query(sql, params) function so the engine is not tied
 * to Neon, Supabase, Vercel Postgres or any specific client library.
 */
export class PostgresStorageAdapter extends StorageAdapter {
  constructor({ query }) { super(); if(typeof query!=='function') throw new Error('query function required'); this.query=query; }

  async saveLead(l){
    await this.query(`INSERT INTO leads (lead_id,tenant_id,project_id,session_id,content_page,nom,telephone,email,code_postal,source,canal,campagne,utm_source,utm_medium,utm_campaign,received_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      ON CONFLICT (lead_id) DO NOTHING`,
      [l.lead_id,l.tenant_id,l.project_id,l.session_id||null,l.content_page||null,l.nom||null,l.telephone||null,l.email||null,l.code_postal||null,l.source||null,l.canal||null,l.campagne||null,l.utm_source||null,l.utm_medium||null,l.utm_campaign||null,l.received_at]);
    return {ok:true,id:l.lead_id};
  }

  async saveEvent(e){
    await this.query(`INSERT INTO events (event_id,tenant_id,project_id,session_id,event,path,source,canal,campagne,local_day,local_hour,target,duration_sec,browser_timestamp,received_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      ON CONFLICT (event_id) DO NOTHING`,
      [e.event_id,e.tenant_id,e.project_id,e.session_id||null,e.event||null,e.path||null,e.source||null,e.canal||null,e.campagne||null,e.local_day||null,e.local_hour??null,e.target||null,e.duration_sec||null,e.browser_timestamp||null,e.received_at]);
    return {ok:true,id:e.event_id};
  }

  async healthcheck(){ const r=await this.query('SELECT 1 AS ok',[]); return {ok:Boolean(r),provider:'postgres'}; }
  async exportLeads(t,p){ const r=await this.query('SELECT * FROM leads WHERE tenant_id=$1 AND project_id=$2 ORDER BY received_at',[t,p]); return r.rows||r; }
  async exportEvents(t,p){ const r=await this.query('SELECT * FROM events WHERE tenant_id=$1 AND project_id=$2 ORDER BY received_at',[t,p]); return r.rows||r; }
}
