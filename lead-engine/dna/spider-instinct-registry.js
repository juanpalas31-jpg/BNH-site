// Spider Engine — biologically grounded instinct registry.
// Biological names are traceable labels for software strategies, not claims of sentience.

export const SPIDER_INSTINCTS=Object.freeze({
  SALTICIDAE_STALK:{
    spider:"Salticidae",
    common_name:"Jumping spider",
    biological_pattern:"vision_track_stalk_precision_pounce",
    digital_mode:"ACTIVE_HUNT",
    trigger:["authorized_territory","high_signal_target","direct_search_useful"],
    sequence:["SCAN","LOCK_TARGET","APPROACH","VERIFY","PRIORITIZE"],
    allowed:["read_authorized_sources","score_opportunity","recommend_action"],
    forbidden:["bypass_access","automatic_consequential_contact"]
  },
  LYCOSIDAE_ROAM:{
    spider:"Lycosidae",
    common_name:"Wolf spider",
    biological_pattern:"ground_roaming_low_light_active_hunt",
    digital_mode:"ROAMING_HUNT",
    trigger:["authorized_large_territory","weak_distributed_signals"],
    sequence:["ROAM","SENSE","TRACK","QUALIFY","RETURN_SIGNAL"],
    allowed:["search_authorized_mail","search_authorized_crm","surface_dormant_opportunity"],
    forbidden:["bypass_access","mass_unsolicited_contact"]
  },
  DEINOPIDAE_NIGHT_NET:{
    spider:"Deinopidae",
    common_name:"Ogre-faced / net-casting spider",
    biological_pattern:"nocturnal_low_light_targeted_net_cast",
    digital_mode:"TARGETED_INTERCEPTION",
    trigger:["precise_signal","timing_window","target_crosses_threshold"],
    sequence:["WATCH","AIM","WAIT","CAST","VERIFY_CAPTURE"],
    allowed:["monitor_authorized_events","raise_priority","prepare_recommended_action"],
    forbidden:["automatic_consequential_contact"]
  },
  ATYPUS_AMBUSH:{
    spider:"Atypus affinis",
    common_name:"Purse-web spider",
    biological_pattern:"camouflaged_tube_ambush_vibration_grab_repair",
    digital_mode:"AMBUSH_AND_REPAIR",
    trigger:["known_path","event_vibration","recoverable_break"],
    sequence:["WAIT","DETECT_VIBRATION","CAPTURE_EVENT","PROCESS","REPAIR_PATH"],
    allowed:["process_event","queue_recovery","repair_recoverable_internal_path"],
    forbidden:["silent_destructive_change"]
  },
  BOLAS_LURE:{
    spider:"Bolas spider",
    common_name:"Bolas spider",
    biological_pattern:"specialized_lure_and_precision_capture",
    digital_mode:"ATTRACTION",
    trigger:["consented_campaign","known_segment","attraction_more_efficient_than_roaming"],
    sequence:["MODEL_SEGMENT","PREPARE_ATTRACTION","PUBLISH_IF_AUTHORIZED","MEASURE_RESPONSE"],
    allowed:["recommend_content","measure_campaign"],
    forbidden:["deception","impersonation","unsolicited_contact"]
  },
  PORTIA_TACTICAL:{
    spider:"Portia fimbriata",
    common_name:"Portia jumping spider",
    biological_pattern:"visual_hunt_deceptive_predatory_tactics_detour_like_strategy",
    digital_mode:"TACTICAL_REASONING",
    trigger:["complex_opportunity","multiple_paths","direct_path_low_confidence"],
    sequence:["OBSERVE","SIMULATE_PATHS","CHOOSE_LOW_RISK_PATH","VERIFY","LEARN"],
    allowed:["compare_strategies","recommend_next_best_action"],
    forbidden:["deception_of_people","bypass_access","unapproved_high_risk_action"]
  }
});

export function selectSpiderInstinct(context={}){
 const territory=String(context.territory||"").toUpperCase();
 const precise=Number(context.signal_strength||0)>=80;
 const complex=Number(context.path_count||0)>1;
 const dormant=Boolean(context.dormant_search);
 const knownPath=Boolean(context.known_path);
 if(complex) return SPIDER_INSTINCTS.PORTIA_TACTICAL;
 if(precise) return SPIDER_INSTINCTS.DEINOPIDAE_NIGHT_NET;
 if(dormant && ["MAIL","CRM"].includes(territory)) return SPIDER_INSTINCTS.LYCOSIDAE_ROAM;
 if(knownPath) return SPIDER_INSTINCTS.ATYPUS_AMBUSH;
 return SPIDER_INSTINCTS.SALTICIDAE_STALK;
}

export function instinctDecision(context={}){
 const instinct=selectSpiderInstinct(context);
 return {
   organism:"ATTILA",
   territory:context.territory||"UNKNOWN",
   spider_mode:instinct.spider,
   digital_mode:instinct.digital_mode,
   biological_pattern:instinct.biological_pattern,
   sequence:instinct.sequence,
   automatic_contact:false,
   authorization_required:true,
   synthetic:false
 };
}
