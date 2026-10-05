/* =========================================================
   DEBTOR UPDATE PER RVSL — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "debtor-update-per-rvsl",
  title: "Debtor Update per RVSL",
  startNode: "start",
  templateCollection: "debtor_update_per_rvsl_template"
};

window.GUIDE_NODES = {

start:{
  text:"RVSL — Debtor Reversal Guide",
  help:"Use this guide to determine if an RVSL should be processed based on payment status, shipment age, and refusing party.",
  note:"Always review BOL, F9 comments, Cargo Care images, and debtor relationship before proceeding.",
  choices:[
    {
      label:"Continue",
      next:"check_paid",
      icon:"fa-solid fa-arrow-right",
      desc:"Start the RVSL decision flow."
    }
  ]
},

/* ================= PRO PAID ================= */

check_paid:{
  text:"Is the PRO paid and closed?",
  choices:[
    {label:"Yes",next:"deny_paid",icon:"fa-solid fa-circle-check",desc:"PRO is already paid and closed."},
    {label:"No",next:"check_year",icon:"fa-solid fa-circle-xmark",desc:"PRO is not yet paid or still open."}
  ]
},

deny_paid:{
  text:"DENY. Advise that PRO is already paid and closed and reversal cannot be processed.",
  choices:[]
},

/* ================= AGE CHECK ================= */

check_year:{
  text:"Is it over a year?",
  choices:[
    {label:"Yes",next:"deny_year",icon:"fa-solid fa-calendar-xmark",desc:"Shipment is over one year old."},
    {label:"No",next:"check_fxf",icon:"fa-solid fa-calendar-check",desc:"Shipment is within one year."}
  ]
},

deny_year:{
  text:`DENY. Advise that PRO is over a year old and reversal cannot be processed.

NOTE: Check F9 comments first if customer was previously assisted before it became over a year old.`,
  choices:[]
},

/* ================= FXF SHIPPER ================= */

check_fxf:{
  text:"Is the shipper a FedEx Freight center, dock, or FedEx location (FXF address)?",
  choices:[
    {label:"Yes",next:"identify_true_shipper",icon:"fa-solid fa-location-dot",desc:"Shipper appears to be an FXF location."},
    {label:"No",next:"refusing_party",icon:"fa-solid fa-circle-xmark",desc:"Regular shipper."}
  ]
},

identify_true_shipper:{
  text:`The PRO may have been a reconsignment or returned shipment.

Steps:
1. Review BOL
2. Check Cargo Care images
3. If unclear, email origin center`,
  choices:[]
},

/* ================= REFUSING PARTY ================= */

refusing_party:{
  text:"Who is the refusing party?",
  choices:[
    {label:"Shipper",next:"shipper_refusal",icon:"fa-solid fa-warehouse",desc:"Shipper is refusing charges."},
    {label:"Consignee / 3rd Party Related",next:"consignee_section7",icon:"fa-solid fa-user-tag",desc:"Consignee or related party refusing."},
    {label:"3rd Party",next:"third_related_shipper",icon:"fa-solid fa-building-user",desc:"Third party refusing charges."},
    {label:"Collector",next:"collector_debtor",icon:"fa-solid fa-headset",desc:"Request coming from collector."}
  ]
},

/* ================= SHIPPER ================= */

shipper_refusal:{
  text:`Advise that the shipper is the ultimate responsible party and cannot refuse freight charges.

2x4 comment:
VS-BLER-CASE#-ADVISED CUSTOMER THAT SHIPPER CANNOT REFUSE ANY FREIGHT CHARGES`,
  choices:[]
},

/* ================= CONSIGNEE ================= */

consignee_section7:{
  text:"Is Section 7 on BOL signed?",
  choices:[
    {label:"Yes",next:"deny_section7",icon:"fa-solid fa-signature",desc:"Section 7 is signed."},
    {label:"No",next:"shipment_age_180",icon:"fa-solid fa-circle-xmark",desc:"Section 7 is not signed."}
  ]
},

deny_section7:{
  text:`DENY. No updates without LOA from a different debtor.

2x4 comment:
VS-BLER-CASE#-SECTION 7 SIGNED. NEED LOA FROM DIFFERENT DEBTOR`,
  choices:[]
},

shipment_age_180:{
  text:"Is shipment more than 180 days but less than 365 days?",
  choices:[
    {label:"Yes",next:"rebill_shipper",icon:"fa-solid fa-circle-check",desc:"Eligible to rebill shipper."},
    {label:"No",next:"advise_consignee",icon:"fa-solid fa-circle-xmark",desc:"Not within rebill window."}
  ]
},

rebill_shipper:{
  text:"Proceed to rebill the Shipper in attempt to get paid.",
  choices:[
    {label:"Continue",next:"rebill_comment",icon:"fa-solid fa-arrow-right",desc:"Proceed to rebill instruction."}
  ]
},

rebill_comment:{
  text:`2x4 comment:

VS-BLER-CASE#-BILLED SHIPPER IN ATTEMPT OF PAYMENT. DO NOT UPDATE WITHOUT LOA FROM NEW DEBTOR.

CORR ACCR (do not add RVSL keyword)`,
  choices:[]
},

advise_consignee:{
  text:`Advise Consignee that PRO is billing correctly per BOL.

If they insist, instruct them to request LOA from shipper.`,
  choices:[]
},

/* ================= THIRD PARTY ================= */

third_related_shipper:{
  text:"Is the refusing 3rd party related to the Shipper?",
  choices:[
    {label:"Yes",next:"third_abt_check",icon:"fa-solid fa-circle-check",desc:"Related to shipper."},
    {label:"No",next:"true_third_party",icon:"fa-solid fa-circle-xmark",desc:"Not related to shipper."}
  ]
},

third_abt_check:{
  text:"Does the shipper account have ABT?",
  choices:[
    {label:"Yes",next:"abt_verify",icon:"fa-solid fa-circle-check",desc:"Has ABT."},
    {label:"No",next:"remove_3rd",icon:"fa-solid fa-circle-xmark",desc:"No ABT."}
  ]
},

abt_verify:{
  text:`Check if ABT was added AFTER shipment.

If yes → find another shipper code without ABT.`,
  choices:[]
},

remove_3rd:{
  text:"Remove the 3rd party and bill the Shipper directly.",
  choices:[]
},

true_third_party:{
  text:"Is it a true 3rd party?",
  choices:[
    {label:"Yes",next:"bol_conflict",icon:"fa-solid fa-circle-check",desc:"True 3rd party."},
    {label:"No",next:"third_abt_check",icon:"fa-solid fa-circle-xmark",desc:"Not true 3rd party."}
  ]
},

bol_conflict:{
  text:"Is there conflicting info on the BOL?",
  choices:[
    {label:"Yes",next:"bill_shipper",icon:"fa-solid fa-triangle-exclamation",desc:"Conflicting billing info."},
    {label:"No",next:"loa_check",icon:"fa-solid fa-circle-xmark",desc:"No conflict."}
  ]
},

bill_shipper:{
  text:"Do not follow BOL terms. Bill Shipper as ultimate debtor.",
  choices:[]
},

loa_check:{
  text:"Is there an imaged LOA?",
  choices:[
    {label:"Yes",next:"loa_valid",icon:"fa-solid fa-file-circle-check",desc:"LOA is available."},
    {label:"No",next:"inform_true3p",icon:"fa-solid fa-file-circle-xmark",desc:"No LOA found."}
  ]
},

loa_valid:{
  text:`Advise:

PRO XXXXX is billing per attached LOA.

New LOA is required from new debtor to rebill.`,
  choices:[]
},

inform_true3p:{
  text:`Inform 3rd party they are correct debtor per BOL.

If they insist → bill Shipper via RVSL.`,
  choices:[]
},

/* ================= COLLECTOR ================= */

collector_debtor:{
  text:"Who is the debtor per BOL?",
  choices:[
    {label:"Shipper",next:"collector_shipper",icon:"fa-solid fa-warehouse",desc:"Shipper is debtor."},
    {label:"Consignee / Related 3rd Party",next:"collector_section7",icon:"fa-solid fa-user-tag",desc:"Consignee or related party is debtor."},
    {label:"3rd Party",next:"collector_collect_term",icon:"fa-solid fa-building-user",desc:"3rd party is debtor."}
  ]
},

collector_shipper:{
  text:"Advise shipper cannot refuse freight charges.",
  choices:[]
},

collector_section7:{
  text:"Is Section 7 signed?",
  choices:[
    {label:"Yes",next:"collector_deny",icon:"fa-solid fa-signature",desc:"Section 7 signed."},
    {label:"No",next:"collector_rebill",icon:"fa-solid fa-circle-xmark",desc:"Section 7 not signed."}
  ]
},

collector_deny:{
  text:"DENY. No updates without LOA from different debtor.",
  choices:[]
},

collector_rebill:{
  text:"Proceed to bill Shipper in attempt to get paid.",
  choices:[
    {label:"Continue",next:"collector_comment",icon:"fa-solid fa-arrow-right",desc:"Proceed to rebill instruction."}
  ]
},

collector_comment:{
  text:`2x4 comment:

VS-BLER-CASE#-BILLED SHIPPER IN ATTEMPT OF PAYMENT. DO NOT UPDATE WITHOUT LOA FROM NEW DEBTOR.

CORR ACCR (do not add RVSL keyword)`,
  choices:[]
},

collector_collect_term:{
  text:"Is BOL term Collect?",
  choices:[
    {label:"Yes",next:"collector_rebill_consignee",icon:"fa-solid fa-circle-check",desc:"Collect term."},
    {label:"No",next:"third_related_shipper",icon:"fa-solid fa-circle-xmark",desc:"Not collect term."}
  ]
},

collector_rebill_consignee:{
  text:"Rebill to Consignee in attempt of payment.",
  choices:[]
}

};
