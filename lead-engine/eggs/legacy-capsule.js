import crypto from "node:crypto";

export function legacyCapsuleManifest(items=[]){
  const normalized=items.map((item,index)=>({
    id:item.id||`legacy-${index+1}`,
    kind:item.kind||"document",
    title:item.title||null,
    format:item.format||null,
    bytes:Number(item.bytes)||null,
    checksum:item.checksum||null,
    required:item.required===true
  }));
  const digest=crypto.createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
  return {version:1,items:normalized,digest,contains_secrets:false};
}

export function capsuleReadiness(manifest){
  const required=manifest.items.filter(x=>x.required);
  const missing=required.filter(x=>!x.checksum||!x.format);
  return {ready:missing.length===0,missing:missing.map(x=>x.id),digest:manifest.digest};
}
