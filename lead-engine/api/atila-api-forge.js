const METHODS=new Set(["GET","POST","PUT","PATCH","DELETE"]);

const slug=s=>String(s||"resource").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,48)||"resource";

export function forgeApiContract({need="",resource="",operations=["GET"],visibility="PRIVATE"}={}){
 const name=slug(resource||need);
 const methods=[...new Set(operations.map(x=>String(x).toUpperCase()).filter(x=>METHODS.has(x)))];
 const safeMethods=methods.length?methods:["GET"];

 return {
  capability:"API_FORGE_V1",
  state:"PROPOSAL",
  need:String(need),
  resource:name,
  visibility:visibility==="PUBLIC"?"PUBLIC":"PRIVATE",
  endpoints:safeMethods.map(method=>({
   method,
   path:`/api/atila/${name}`,
   authentication:method==="GET"&&visibility==="PUBLIC"?"RATE_LIMITED_PUBLIC":"OWNER_OR_SERVICE_AUTH",
   validation:"STRICT_SCHEMA",
   audit:true
  })),
  security:{
   generated_credentials:false,
   secrets_in_source:false,
   rate_limit:true,
   input_validation:true,
   audit_log:true,
   sensitive_deployment_requires_owner_gate:true
  },
  next:["GENERATE_IMPLEMENTATION","GENERATE_TESTS","SECURITY_REVIEW","OWNER_GATE_IF_SENSITIVE","DEPLOY","OBSERVE"]
 };
}

export function canDeployForgedApi({contract,owner_verified=false,security_review=false}={}){
 if(!contract||contract.state!=="PROPOSAL") return {ok:false,reason:"INVALID_CONTRACT"};
 if(!security_review) return {ok:false,reason:"SECURITY_REVIEW_REQUIRED"};
 if(contract.visibility!=="PUBLIC"&&!owner_verified) return {ok:false,reason:"OWNER_PROOF_REQUIRED"};
 return {ok:true};
}
