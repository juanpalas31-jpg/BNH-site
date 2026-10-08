/** Attila mission checkpoint journal: private-host append-only acknowledgements.
 * Metadata only. This is not a replacement for a transactional database.
 * Use a single supervisor per workspace; do not place the journal in a public directory.
 */
import {open,mkdir,readFile} from 'node:fs/promises';
import {dirname} from 'node:path';
const ID=/^[A-Za-z0-9_-]{1,64}$/;
export async function appendMissionCheckpoint(path,{workspaceId,missionId,status}={}){
 if(!path||!ID.test(workspaceId)||!ID.test(missionId)||!['DONE','BLOCKED'].includes(status))throw Error('INVALID_CHECKPOINT');
 await mkdir(dirname(path),{recursive:true,mode:0o700});
 const file=await open(path,'a',0o600);
 try{await file.writeFile(JSON.stringify({v:1,workspaceId,missionId,status})+'\n');await file.sync();}
 finally{await file.close();}
 return {recorded:true,missionId,status};
}
export async function readMissionCheckpoints(path,workspaceId){
 if(!path||!ID.test(workspaceId))throw Error('INVALID_CHECKPOINT_QUERY');
 let data;
 try{data=await readFile(path,'utf8');}catch(e){if(e.code==='ENOENT')return new Map();throw e;}
 if(data.length>10*1024*1024)throw Error('CHECKPOINT_JOURNAL_TOO_LARGE');
 const result=new Map();
 const lines=data.split('\n');
 for(let i=0;i<lines.length;i++){
  const line=lines[i];if(!line)continue;
  let entry;try{entry=JSON.parse(line);}catch(e){throw Error('CORRUPT_CHECKPOINT_JOURNAL');}
  if(entry.v!==1||entry.workspaceId!==workspaceId||!ID.test(entry.missionId)||!['DONE','BLOCKED'].includes(entry.status))throw Error('INVALID_CHECKPOINT_ENTRY');
  result.set(entry.missionId,entry.status);
 }
 return result;
}
