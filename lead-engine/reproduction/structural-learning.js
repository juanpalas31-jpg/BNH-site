const ALLOWED_FIELDS = new Set([
  'event_taxonomy',
  'security_policy_version',
  'storage_contract_version',
  'backup_policy_version',
  'conversion_model_version',
  'validated_patterns'
]);

export function buildStructuralInheritance(source = {}) {
  const inherited = { schema_version: 1 };

  for (const [key, value] of Object.entries(source)) {
    if (ALLOWED_FIELDS.has(key)) inherited[key] = value;
  }

  return inherited;
}

export function assertNoTenantData(payload = {}) {
  const forbidden = new Set([
    'leads','events','customers','contacts','emails','phones',
    'credentials','tokens','secrets','private_notes',
    'password','passwords','api_key','api_keys','private_key','private_keys',
    'raw_leads','customer_pii'
  ]);
  const violations=[];
  const walk=(value,path=[])=>{
    if(!value||typeof value!=='object') return;
    if(Array.isArray(value)){ value.forEach((v,i)=>walk(v,[...path,String(i)])); return; }
    for(const [key,val] of Object.entries(value)){
      const normalized=String(key).toLowerCase();
      const next=[...path,key];
      if(forbidden.has(normalized)) violations.push(next.join('.'));
      walk(val,next);
    }
  };
  walk(payload);
  return { ok: violations.length === 0, violations:[...new Set(violations)] };
}
