import { StorageAdapter, dualWrite } from './adapter.js';

export class DualWriteStorageAdapter extends StorageAdapter {
  constructor({primary,mirror}) { super(); this.primary=primary; this.mirror=mirror; }
  saveLead(record){ return dualWrite({primary:this.primary,mirror:this.mirror,kind:'lead',record}); }
  saveEvent(record){ return dualWrite({primary:this.primary,mirror:this.mirror,kind:'event',record}); }
  healthcheck(){ return this.primary.healthcheck(); }
  exportLeads(t,p){ return this.primary.exportLeads(t,p); }
  exportEvents(t,p){ return this.primary.exportEvents(t,p); }
}
