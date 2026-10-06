const DEFAULT_WEIGHTS={
  perseverance:0.20,
  resourcefulness:0.18,
  responsibility:0.18,
  learning_drive:0.16,
  constructive_action:0.16,
  community_contribution:0.12
};

export function evaluateAnnobonCandidate(candidate={},weights=DEFAULT_WEIGHTS){
  if(candidate.adult!==true) return {eligible:false,reason:"adult_required"};
  if(candidate.consent!==true) return {eligible:false,reason:"consent_required"};
  if(candidate.on_annobon!==true) return {eligible:false,reason:"annobon_required"};

  let weighted=0,total=0;
  for(const [key,w] of Object.entries(weights)){
    const value=Math.max(0,Math.min(1,Number(candidate.evidence?.[key])||0));
    weighted+=value*w; total+=w;
  }
  return {
    eligible:true,
    evidence_score:total?weighted/total:0,
    decision:"human_review_required",
    automatic_selection:false,
    protected_traits_used:false
  };
}
