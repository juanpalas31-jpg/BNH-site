import { StorageAdapter } from './adapter.js';

export class WebhookStorageAdapter extends StorageAdapter {
  constructor({ url }) { super(); this.url = url; }
  async post(record) {
    if (!this.url) throw new Error('Webhook storage not configured');
    const response = await fetch(this.url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(record)});
    const result = await response.json().catch(()=>({}));
    if (!response.ok || result.ok !== true) throw new Error(result.error || 'Webhook storage rejected record');
    return result;
  }
  async saveLead(lead){ return this.post(lead); }
  async saveEvent(event){ return this.post(event); }
  async healthcheck(){ return {ok:Boolean(this.url),provider:'webhook'}; }
}
