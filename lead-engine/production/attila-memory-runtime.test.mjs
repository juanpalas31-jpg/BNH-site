import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {executeMemoryCycle} from './attila-memory-runtime.mjs';
async function setup(){const dir=await mkdtemp(join(tmpdir(),'attila-memory-'));return {dir,queuePath:join(dir,'queue.json'),statePath:join(dir,'state.json'),reportPath:join(dir,'report.json'),workspaceId:'family'};}
test('executes independent cycle and persists deduplication state',async()=>{
 const o=await setup();try{
 const task={id:'mission1',workspaceId:'family',action:'VERIFY_INTEGRITY',payload:{expectedSha256:'a'.repeat(64),actualSha256:'a'.repeat(64)}};
 await writeFile(o.queuePath,JSON.stringify([task]));
 await executeMemoryCycle(o);
 const state=JSON.parse(await readFile(o.statePath,'utf8'));assert.equal(state.sequence,1);
 await executeMemoryCycle(o);
 const again=JSON.parse(await readFile(o.statePath,'utf8'));assert.equal(again.sequence,1);
 const report=JSON.parse(await readFile(o.reportPath,'utf8'));assert.equal(report.outcomes[0].status,'DUPLICATE_SKIPPED');
 }finally{await rm(o.dir,{recursive:true,force:true});}
});
test('refuses content resembling private transcript before writing state',async()=>{
 const o=await setup();try{
 await writeFile(o.queuePath,JSON.stringify([{id:'mission1',workspaceId:'family',action:'PLAN_RECOVERY',transcript:'secret'}]));
 await assert.rejects(()=>executeMemoryCycle(o),/INVALID_MISSION_SCHEMA/);
 await assert.rejects(()=>readFile(o.statePath,'utf8'),{code:'ENOENT'});
 }finally{await rm(o.dir,{recursive:true,force:true});}
});
test('rejects cross-workspace tasks',async()=>{
 const o=await setup();try{
 await writeFile(o.queuePath,JSON.stringify([{id:'mission1',workspaceId:'other',action:'PLAN_RECOVERY'}]));
 await assert.rejects(()=>executeMemoryCycle(o),/INVALID_TASK/);
 }finally{await rm(o.dir,{recursive:true,force:true});}
});
