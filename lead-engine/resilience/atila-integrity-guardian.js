import {createHash} from "node:crypto";
const digest=v=>createHash("sha256").update(String(v)).digest("hex");

export function buildIntegrityManifest(files=[]){
 return files.map(f=>({path:f.path,sha256:digest(f.content||""),bytes:Buffer.byteLength(String(f.content||""))}))
  .sort((a,b)=>a.path.localeCompare(b.path));
}
export function verifyIntegrity(files=[],manifest=[]){
 const expected=new Map(manifest.map(x=>[x.path,x]));
 const changed=[],missing=[],unknown=[];
 for(const f of files){const e=expected.get(f.path);if(!e){unknown.push(f.path);continue;}
  const actual=digest(f.content||"");if(actual!==e.sha256)changed.push({path:f.path,expected:e.sha256,actual});expected.delete(f.path);}
 for(const path of expected.keys())missing.push(path);
 return {ok:changed.length===0&&missing.length===0,changed,missing,unknown,
  restore_allowed:false,requires_owner_proof:changed.length>0||missing.length>0};
}
export function restorationDecision({integrity={},owner_verified=false,clean_snapshot=false}={}){
 if(integrity.ok)return {action:"NONE",reason:"HEALTHY"};
 if(!owner_verified)return {action:"QUARANTINE",reason:"OWNER_PROOF_REQUIRED"};
 if(!clean_snapshot)return {action:"HOLD",reason:"VERIFIED_CLEAN_SNAPSHOT_REQUIRED"};
 return {action:"RESTORE_FROM_VERIFIED_SNAPSHOT",automatic:false,requires_final_owner_confirmation:true};
}
