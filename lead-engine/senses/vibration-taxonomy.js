export const VIBRATIONS={
 impression:{weight:1,meaning:"thread_seen_in_search"},
 organic_click:{weight:3,meaning:"visitor_touched_thread"},
 content_engaged:{weight:5,meaning:"visitor_stayed_and_explored"},
 internal_click:{weight:6,meaning:"visitor_followed_silk"},
 simulator_start:{weight:9,meaning:"intent_strengthening"},
 simulator_complete:{weight:13,meaning:"qualified_context_created"},
 form_start:{weight:17,meaning:"contact_intent"},
 form_submit:{weight:25,meaning:"lead_created"},
 appointment:{weight:35,meaning:"commercial_contact"},
 quote:{weight:50,meaning:"commercial_opportunity"},
 sale:{weight:100,meaning:"verified_capture"}
};

export function vibration(type,meta={}){
 const v=VIBRATIONS[type];
 if(!v) throw new Error("unknown_vibration");
 return {type,...v,meta,observedAt:new Date().toISOString()};
}
