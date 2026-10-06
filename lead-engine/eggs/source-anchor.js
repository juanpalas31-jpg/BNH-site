import crypto from "node:crypto";

const h=v=>crypto.createHash("sha256").update(String(v)).digest("hex");

export function createSourceAnchor({lineage_id,founder_public_commitment,protocol_version="SLP-draft-0.2"}={}){
  if(!lineage_id||!founder_public_commitment) throw new Error("missing_source_anchor_fields");
  const payload={lineage_id,founder_public_commitment,protocol_version};
  return {...payload,anchor_hash:h(JSON.stringify(payload))};
}

export function verifySourceAnchor(anchor={}){
  const {anchor_hash,...payload}=anchor;
  return Boolean(anchor_hash)&&h(JSON.stringify(payload))===anchor_hash;
}

export function sourceConnection({anchor_valid=false,lineage_proof=false,authorized_branch=false}={}){
  return {
    connected:anchor_valid===true&&lineage_proof===true&&authorized_branch===true,
    requires_all_three:true,
    automatic_hatch:false
  };
}
