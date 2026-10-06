export function reconstructionPlan(egg, environment={}) {
  const supported = new Set(environment.capabilities || []);
  const stages = [
    ["verify_integrity", []],
    ["read_dna_manifest", ["filesystem"]],
    ["restore_structural_memory", ["filesystem"]],
    ["establish_private_identity_binding", ["cryptography"]],
    ["initialize_local_spider", ["runtime"]],
    ["discover_compatible_optional_organs", ["runtime"]],
    ["request_guardian_acceptance_if_required", ["communications"]]
  ];
  return stages.map(([stage, needs]) => ({
    stage,
    requirements: needs,
    ready: needs.every(x => supported.has(x)),
    consequential: false
  }));
}
