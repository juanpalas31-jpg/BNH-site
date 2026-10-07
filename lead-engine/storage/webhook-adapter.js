import { StorageAdapter } from './adapter.js';

export class WebhookStorageAdapter extends StorageAdapter {
  constructor({ url }) { super(); this.url = url; }
  async post(record) {
    if (!this.url) throw new Error('Webhook storage not configured');
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),8000);
    let response;
    try{
      response=await fetch(this.url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(record),signal:controller.signal});
    }catch(error){
      if(error?.name==='AbortError') throw new Error('Webhook storage timeout');
      throw error;
    }finally{clearTimeout(timeout);}
    const result = await response.json().catch(()=>({}));
    if (!response.ok || result.ok !== true) throw new Error(result.error || 'Webhook storage rejected record');
    return result;
  }
  async saveLead(lead){ return this.post(lead); }
  async saveEvent(event){ return this.post(event); }
  async healthcheck(){ return {ok:Boolean(this.url),provider:'webhook'}; }
}
