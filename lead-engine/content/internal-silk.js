const LINKS={
 "dpe-electricite-changement-2026":["comprendre-dpe-a-g","ameliorer-dpe-logement-travaux"],
 "comprendre-dpe-a-g":["dpe-f-g-consequences-proprietaire","ameliorer-dpe-logement-travaux"],
 "dpe-f-g-consequences-proprietaire":["dpe-obligatoire-vente-location-2026","ameliorer-dpe-logement-travaux"],
 "dpe-obligatoire-vente-location-2026":["comprendre-dpe-a-g","dpe-f-g-consequences-proprietaire"],
 "ameliorer-dpe-logement-travaux":["dpe-electricite-changement-2026","comprendre-dpe-a-g"]
};

export function internalSilk(slug){
 return {slug,related:LINKS[slug]||[],cta:"bilan_residentiel_gratuit",maxContextualLinks:3};
}
