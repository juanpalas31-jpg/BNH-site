export function articleToThread(article={}){
 if(!article.slug) throw new Error("slug_required");
 return {
  threadId:`content:${article.slug}`,
  entryType:"organic_article",
  intent:article.intent||"informational",
  destination:article.cta||"bilan_residentiel_gratuit",
  events:["page_view","content_engaged","simulator_start","form_start","form_submit"],
  qualifiedBusinessOutcome:["appointment","quote","sale"],
  publicationAutomatic:false
 };
}
