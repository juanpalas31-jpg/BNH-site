import {createHash,randomBytes,timingSafeEqual} from "node:crypto";
const H=v=>createHash("sha256").update(String(v)).digest("hex");
const now=()=>Date.now();

export function createHostChallenge({host_id="OWNER",ttl_ms=120000}={}){
 const nonce=randomBytes(32).toString("hex"),issued_at=now();
 return {host_id,nonce,issued_at,expires_at:issued_at+ttl_ms,purpose:"ATILA_HOST_PROOF"};
}
export function verifyHostProof({challenge,proof,trusted={}}={}){
 const reasons=[];
 if(!challenge||!proof) return {ok:false,reasons:["MISSING_PROOF"]};
 if(now()>Number(challenge.expires_at||0)) reasons.push("EXPIRED_CHALLENGE");
 if(proof.nonce!==challenge.nonce) reasons.push("NONCE_MISMATCH");
 if(proof.host_id!==challenge.host_id) reasons.push("HOST_MISMATCH");
 if(!trusted.device_keys?.includes(proof.device_key_id)) reasons.push("UNTRUSTED_DEVICE");
 if(!proof.signature_verified) reasons.push("SIGNATURE_NOT_VERIFIED");
 if(proof.replayed) reasons.push("REPLAY_DETECTED");
 const factors=[
  proof.passkey_verified===true,
  proof.hardware_key_verified===true,
  proof.local_biometric_gate===true
 ].filter(Boolean).length;
 if(factors<2) reasons.push("INSUFFICIENT_FACTORS");
 return {ok:reasons.length===0,reasons,factors,host_id:challenge.host_id,
  session_fingerprint:H(challenge.nonce+":"+proof.device_key_id)};
}
export function constantTimeTokenMatch(a="",b=""){
 const x=Buffer.from(H(a)),y=Buffer.from(H(b));
 return x.length===y.length&&timingSafeEqual(x,y);
}
export function hostSecurityMode({failed_attempts=0,anomaly_score=0,verified=false}={}){
 if(verified) return "HOST_VERIFIED";
 if(failed_attempts>=5||anomaly_score>=.85) return "LOCKDOWN";
 if(failed_attempts>=2||anomaly_score>=.55) return "HOST_CHALLENGE_HARDENED";
 return "HOST_CHALLENGE";
}
export const HOST_INVARIANTS=Object.freeze({
 raw_biometric_storage:false,raw_dna_storage:false,raw_blood_data_storage:false,
 local_biometric_verification_only:true,cryptographic_proof_only:true,
 least_privilege:true,anti_replay:true,revocation_required:true,
 recovery_requires_separate_offline_factor:true
});
