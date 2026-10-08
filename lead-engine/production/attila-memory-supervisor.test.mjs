import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {withExclusiveLock,superviseMemory} from './attila-memory-supervisor.mjs';
const paths=async()=>{const dir=await mkdtemp(join(tmpdir(),'attila-supervisor-'));return {dir,workspaceId:'family',queuePath:join(dir,'queue.json'),statePath:join(dir,'state.json'),reportPath:join(dir,'report.json'),lockPath:join(dir,'agent.lock')}};
test('exclusive lock rejects concurrent runs and releases afterward',async()=>{
 const p=await paths();try{
 await withExclusiveLock(p.lockPath,async()=>{
  await assert.rejects(()=>withExclusiveLock(p.lockPath,async()=>{}),/ATTILA_ALREADY_RUNNING/);
 });
 await withExclusiveLock(p.lockPath,async()=>{});
 }finally{await rm(p.dir,{recursive:true,force:true});}
});
test('supervisor performs independent cycle and produces report',async()=>{
 const p=await paths();try{
 await writeFile(p.queuePath,JSON.stringify([{id:'m1',workspaceId:'family',action:'PLAN_RECOVERY',payload:{encryptedBackupVerified:false}}]));
 const result=await superviseMemory({...p,maxCycles:1});
 assert.equal(result.cycles,1);
 const report=JSON.parse(await readFile(p.reportPath,'utf8'));
 assert.equal(report.processed,1);
 assert.equal(report.outcomes[0].status,'REVIEW_OR_BLOCKED');
 }finally{await rm(p.dir,{recursive:true,force:true});}
});
test('stale lock fails closed',async()=>{
 const p=await paths();try{
 await writeFile(p.lockPath,'stale');
 await assert.rejects(()=>superviseMemory({...p,maxCycles:1}),/ATTILA_ALREADY_RUNNING_OR_STALE_LOCK/);
 }finally{await rm(p.dir,{recursive:true,force:true});}
});
