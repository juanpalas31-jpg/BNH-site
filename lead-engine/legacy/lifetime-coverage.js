export function lifetimeCoverage(episodes=[]){
 const essential=episodes.filter(e=>e.founder_priority==="ESSENTIAL");
 const protectedEssential=essential.filter(e=>e.fallback_release==="ALWAYS_RELEASE_IF_COMPASSIONATE");
 return {
  total:episodes.length,
  essential:essential.length,
  compassionProtected:protectedEssential.length,
  coverage:essential.length?Number((protectedEssential.length/essential.length).toFixed(2)):1,
  recommendation:protectedEssential.length===essential.length?"OK":"PROTECT_REMAINING_ESSENTIAL_EPISODES"
 };
}
