import {validateMission} from './attila-mission-schema.js';
/** Attila headless runtime (Node >=20, ESM).
 * Operates independently of Jarvis. Requires a PRIVATE host and private task input.
 * This runner only handles metadata checks; never put recordings or transcripts in tasks.
 * One process per workspace; scheduler/supervisor supplied by deployment.
 */
import {readFile,writeFile,rename,mkdir,open} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {createMemoryWorker,runMemoryQueue} from './attila-memory-worker.js';
const safeId=s=>typeof s==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(s);
const MAX_BYTES=1024*1024;
async function readJson(path,fallback){
 try{const f=await open(path,'r');try{const stat=await f.stat();if(stat.size>MAX_BYTES)throw Error('INPUT_TOO_LARGE');return JSON.parse(await f.readFile('utf8'));}finally{await f.close();}}
 catch(e){if(e.code==='ENOENT')return fallback;throw e;}
}
async function atomicJson(path,data){
 await mkdir(dirname(path),{recursive:true,mode:0o700});
 const temp=path+'.tmp-'+process.pid;
 try{await writeFile(temp,JSON.stringify(data),{encoding:'utf8',mode:0o600,flag:'wx'});await rename(temp,path);}
 catch(e){try{const {unlink}=await import('node:fs/promises');await unlink(temp);}catch{}throw e;}
}
export async function executeMemoryCycle({workspaceId,queuePath,statePath,reportPath}={}){
 if(!safeId(workspaceId)||!queuePath||!statePath||!reportPath)throw Error('INVALID_CONFIGURATION');
 const paths=[queuePath,statePath,reportPath].map(p=>resolve(p));
 if(new Set(paths).size!==3)throw Error('PATH_COLLISION');
 const [tasks,previous]=await Promise.all([readJson(paths[0],[]),readJson(paths[1],null)]);
 if(!Array.isArray(tasks)||tasks.length>1000)throw Error('INVALID_QUEUE');
 const state=previous??createMemoryWorker({workspaceId});
 if(state.workspaceId!==workspaceId||!Array.isArray(state.processedIds)||!Array.isArray(state.history))throw Error('INVALID_STATE');
 // Validate every task using an explicit metadata-only allowlist.
 for(const task of tasks)validateMission(task,workspaceId);
 const {worker,outcomes,remaining}=runMemoryQueue(state,tasks,{maxPerRun:25});
 // Fail-closed: do not consume queue automatically; duplicate IDs are skipped on subsequent runs.
 // This allows operators to reconcile a crash without losing queued tasks.
 await atomicJson(paths[1],worker);
 await atomicJson(paths[2],{workspaceId,processed:outcomes.length,remaining,outcomes,privateDataStored:false,
  note:'CHECKS_ONLY_NO_VAULT_OR_REAL_STORAGE'});
 return {processed:outcomes.length,remaining,reportPath:paths[2]};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+resolve(process.argv[1])).href){
 const [workspaceId,queuePath,statePath,reportPath]=process.argv.slice(2);
 executeMemoryCycle({workspaceId,queuePath,statePath,reportPath})
  .then(r=>{process.stdout.write(JSON.stringify({processed:r.processed,remaining:r.remaining})+'\n');})
  .catch(e=>{process.stderr.write('ATTILA_CYCLE_FAILED:'+e.message+'\n');process.exitCode=1;});
}
