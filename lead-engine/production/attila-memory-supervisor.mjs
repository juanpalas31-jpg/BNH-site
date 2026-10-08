/** Attila autonomous supervisor: private single-host polling and crash-safe lock.
 * Requires Node >=20 and a private, trusted filesystem. Never stores media.
 * Lock is exclusive; stale locks require human intervention (fail closed).
 */
import {open,unlink,mkdir} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {executeMemoryCycle} from './attila-memory-runtime.mjs';
const positive=(x,min,max)=>Number.isInteger(x)&&x>=min&&x<=max;
export async function withExclusiveLock(lockPath,fn){
 if(typeof lockPath!=='string'||!lockPath)throw Error('INVALID_LOCK_PATH');
 const path=resolve(lockPath);
 await mkdir(dirname(path),{recursive:true,mode:0o700});
 let lock;
 try{lock=await open(path,'wx',0o600);}
 catch(e){if(e.code==='EEXIST')throw Error('ATTILA_ALREADY_RUNNING_OR_STALE_LOCK');throw e;}
 try{
  await lock.writeFile(JSON.stringify({pid:process.pid,createdAt:new Date().toISOString()}));
  await lock.sync();
  return await fn();
 }finally{
  await lock.close();
  await unlink(path);
 }
}
export async function superviseMemory({workspaceId,queuePath,statePath,reportPath,lockPath,intervalMs=60000,maxCycles=1,signal}={}){
 if(!positive(intervalMs,1000,3600000)||!positive(maxCycles,1,1000000))throw Error('INVALID_SCHEDULE');
 const required=[queuePath,statePath,reportPath,lockPath];
 if(required.some(x=>typeof x!=='string'||!x)||new Set(required.map(resolve)).size!==4)throw Error('INVALID_PATHS');
 return withExclusiveLock(lockPath,async()=>{
  const results=[];
  for(let i=0;i<maxCycles;i++){
   if(signal?.aborted)break;
   // Fail closed: errors abort the supervisor and leave the queue untouched.
   results.push(await executeMemoryCycle({workspaceId,queuePath,statePath,reportPath}));
   if(i+1<maxCycles)await new Promise((done,reject)=>{
    const timer=setTimeout(()=>{signal?.removeEventListener('abort',onAbort);done();},intervalMs);
    function onAbort(){clearTimeout(timer);signal?.removeEventListener('abort',onAbort);done();}
    signal?.addEventListener('abort',onAbort,{once:true});
   });
  }
  return {cycles:results.length,stopped:!!signal?.aborted,mode:'METADATA_CHECKS_ONLY'};
 });
}
if(process.argv[1]&&import.meta.url===new URL('file://'+resolve(process.argv[1])).href){
 const [workspaceId,queuePath,statePath,reportPath,lockPath]=process.argv.slice(2);
 const controller=new AbortController();
 process.on('SIGINT',()=>controller.abort());
 process.on('SIGTERM',()=>controller.abort());
 superviseMemory({workspaceId,queuePath,statePath,reportPath,lockPath,maxCycles:1000000,signal:controller.signal})
  .then(r=>process.stdout.write(JSON.stringify(r)+'\n'))
  .catch(e=>{process.stderr.write('ATTILA_SUPERVISOR_FAILED:'+e.message+'\n');process.exitCode=1;});
}
