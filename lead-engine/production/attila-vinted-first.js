/** ATTILA Vinted-first growth policy.
 * Priority: increase owner Vinted sales before activating other marketplaces/projects.
 */
export const VINTED_FIRST_POLICY=Object.freeze({
 priority:1,channel:'VINTED',targets:['2X','3X','4X'],
 acquisition:['SEO_ARTICLES','SEO_LANDING_PAGES','SOCIAL_TRAFFIC'],
 directCheckout:'STRIPE_PAYMENT_LINKS_ONLY_WHEN_OWNER_CONFIGURED',
 secondary:['BILAN_HABITAT','LEBONCOIN','MON_PETIT_MARIN'],
 rule:'PROVE_VINTED_GROWTH_BEFORE_NEXT_CHANNEL'
});
export function chooseGrowthMission({vintedActive=true,verifiedVintedGrowth=false,stripeConfigured=false}={}){
 if(vintedActive!==true)return {mission:'RESTORE_VINTED_BASELINE',priority:1};
 return {mission:'GROW_VINTED',priority:1,seo:true,directCheckout:stripeConfigured===true?'STRIPE_READY':'STRIPE_SETUP_REQUIRED',unlockLeboncoin:verifiedVintedGrowth===true};
}
