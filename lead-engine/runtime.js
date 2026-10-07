import { WebhookStorageAdapter } from './storage/webhook-adapter.js';
import { PostgresStorageAdapter } from './storage/postgres-adapter.js';
import { createQueryBridge } from './storage/postgres-query.js';

function httpPostgresExecutor(env){
 const url=env.POSTGRES_QUERY_URL||env.SPIDER_POSTGRES_QUERY_URL;
 const token=env.POSTGRES_QUERY_TOKEN||env.SPIDER_POSTGRES_QUERY_TOKEN;
 if(!url)return null;
 return async(sql,params=[])=>{
  const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json',...(token?{authorization:`Bearer ${token}`}:{})},body:JSON.stringify({sql,params})});
  const data=await r.json().catch(()=>null);
  if(!r.ok||!data)throw new Error('PostgreSQL query endpoint failed');
  return data;
 };
}

export function createRuntimeStorage(env = process.env) {
 const legacy=env.BNH_SHEETS_WEBHOOK_URL?new WebhookStorageAdapter({url:env.BNH_SHEETS_WEBHOOK_URL}):null;
 const execute=httpPostgresExecutor(env);
 if(execute){
  const primary=new PostgresStorageAdapter({query:createQueryBridge(execute)});
  return {primary,mirror:legacy,provider:'postgres',durable_attila:true,missionStorage:primary.missionPersistenceAdapter()};
 }
 if(legacy)return {primary:legacy,mirror:null,provider:'legacy_webhook',durable_attila:false,missionStorage:null};
 return {primary:null,mirror:null,provider:'unconfigured',durable_attila:false,missionStorage:null};
}
