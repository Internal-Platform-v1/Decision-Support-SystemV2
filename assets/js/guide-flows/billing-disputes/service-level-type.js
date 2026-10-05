/* =========================================================
   SERVICE LEVEL / TYPE UPDATE PER BOL — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "service-level-type",
  title: "Service Level / Type Update per BOL",
  startNode: "start",
  templateCollection: "service_level_type_template"
};

window.GUIDE_NODES = {

start:{
  text:"Service Level / Type Update per BOL",
  help:"Use this guide to determine if the service level should be updated based on delay, BOL, and FBC rating.",
  note:"Always check Expected Delivery Date, Actual Delivery Date, BOL service level, and FBC service rating.",
  choices:[
    {
      label:"Continue",
      next:"root",
      icon:"fa-solid fa-arrow-right",
      desc:"Start the Service Level decision flow."
    }
  ]
},

root:{
  text:"What is the concern?",
  choices:[
    {label:"Delayed Delivery Dispute",next:"delay_check_dates",icon:"fa-solid fa-clock",desc:"Customer is disputing delayed delivery."},
    {label:"Service Type Mismatch",next:"service_check_fbc",icon:"fa-solid fa-file-circle-exclamation",desc:"Service level/type does not match the request or BOL."}
  ]
},

/* ================= DELAY FLOW ================= */

delay_check_dates:{
  text:"Check the Expected Delivery Date and the Actual Delivery Date.",
  choices:[
    {label:"Continue",next:"delay_3days",icon:"fa-solid fa-arrow-right",desc:"Proceed to delay validation."}
  ]
},

delay_3days:{
  text:"Was the shipment delivered 3 or more business days after the Expected Delivery Date?",
  choices:[
    {label:"Yes",next:"delay_service_level",icon:"fa-solid fa-circle-check",desc:"Shipment was delayed 3 or more business days."},
    {label:"No",next:"delay_within_standard",icon:"fa-solid fa-circle-xmark",desc:"Shipment was delivered within standard timeframe."}
  ]
},

delay_within_standard:{
  text:"Advise customer that shipment was delivered within the standard delivery timeframe depending on their location.",
  choices:[]
},

delay_service_level:{
  text:"What is the current service level of the PRO?",
  choices:[
    {label:"Priority",next:"delay_priority_action",icon:"fa-solid fa-bolt",desc:"Current service level is Priority."},
    {label:"Economy",next:"delay_economy_action",icon:"fa-solid fa-box",desc:"Current service level is Economy."}
  ]
},

delay_priority_action:{
  text:"Send an email to the service center to confirm why the shipment was delayed.",
  choices:[
    {label:"Continue",next:"delay_reason_check",icon:"fa-solid fa-arrow-right",desc:"Proceed after service center confirmation."}
  ]
},

delay_reason_check:{
  text:"What was the reason for the delay?",
  choices:[
    {label:"Service Center Delay",next:"delay_sc_fault",icon:"fa-solid fa-building",desc:"Delay was caused by the service center."},
    {label:"Customer Delay",next:"delay_customer_fault",icon:"fa-solid fa-user",desc:"Delay was caused by the customer."}
  ]
},

delay_sc_fault:{
  text:`If the service center confirmed that the reason of the delay is on their end, change the service level to Economy and advise the service center to process the write-off of the difference on their end.

Example:
Invoice amount if rated Priority is $300
Invoice amount if rated Economy is $250
Difference to be written off is $50`,
  choices:[]
},

delay_customer_fault:{
  text:"If the reason of the delay is on the customer end, advise the customer accordingly.",
  choices:[]
},

delay_economy_action:{
  text:"Send an email to Training team / SME so we can send to team lead to confirm what relief can be provided.",
  choices:[
    {label:"Continue",next:"delay_customer_request",icon:"fa-solid fa-arrow-right",desc:"Proceed to customer request check."}
  ]
},

delay_customer_request:{
  text:"Did the customer proactively ask to remove all charges to their account?",
  choices:[
    {label:"Yes",next:"delay_writeoff",icon:"fa-solid fa-circle-check",desc:"Customer requested removal of all charges."},
    {label:"No",next:"delay_end",icon:"fa-solid fa-circle-xmark",desc:"No charge removal requested."}
  ]
},

delay_writeoff:{
  text:"If customer proactively asked to remove all charges to their account, process it through write-off but ask approval from your Supervisor.",
  choices:[]
},

delay_end:{
  text:"No further service level update action is required.",
  choices:[]
},

/* ================= SERVICE TYPE FLOW ================= */

service_check_fbc:{
  text:"Pull up the PRO on FBC and check what is the current service level.",
  choices:[
    {label:"Continue",next:"service_volume_check",icon:"fa-solid fa-arrow-right",desc:"Proceed to service level validation."}
  ]
},

service_volume_check:{
  text:"Is the PRO rated as Volume Quote TLX/TLS?",
  choices:[
    {label:"Yes",next:"service_move_dispute",icon:"fa-solid fa-circle-check",desc:"PRO is rated as Volume Quote TLX/TLS."},
    {label:"No",next:"service_match_check",icon:"fa-solid fa-circle-xmark",desc:"PRO is not rated as Volume Quote TLX/TLS."}
  ]
},

service_move_dispute:{
  text:"Move the case to Dispute Resolution.",
  note:"If the case is already under DR, advise customer that PRO is rated as Volume Quote and it will override the service.",
  choices:[]
},

service_match_check:{
  text:"Is the service level on FBC matching what is being requested?",
  choices:[
    {label:"Yes",next:"service_already_correct",icon:"fa-solid fa-circle-check",desc:"Service level already matches the request."},
    {label:"No",next:"service_review_bol",icon:"fa-solid fa-circle-xmark",desc:"Service level does not match the request."}
  ]
},

service_already_correct:{
  text:"Advise customer that the invoice is already rated correctly based on the requested service level.",
  choices:[]
},

service_review_bol:{
  text:"Pull up and review the BOL.",
  note:"NOTE: FXFE is not Economy. This means FedEx Freight East.",
  choices:[
    {label:"Continue",next:"service_check_bol",icon:"fa-solid fa-arrow-right",desc:"Proceed to identify the service level noted on BOL."}
  ]
},

service_check_bol:{
  text:"What is the service level noted on BOL?",
  choices:[
    {label:"Economy / ECON / FXNL / National",next:"service_correct_econ",icon:"fa-solid fa-box",desc:"BOL shows Economy-related service level."},
    {label:"Priority / PRTY / FXFR",next:"service_correct_priority",icon:"fa-solid fa-bolt",desc:"BOL shows Priority-related service level."},
    {label:"No service level noted at all",next:"service_no_bol",icon:"fa-solid fa-file-circle-question",desc:"No service level is written on the BOL."}
  ]
},

service_correct_econ:{
  text:"Advise customer that PRO is rated correctly as Economy since it was noted/requested on BOL.",
  choices:[
    {label:"Continue",next:"service_fbc_mismatch_update",icon:"fa-solid fa-arrow-right",desc:"Proceed if FBC does not match the BOL service level."}
  ]
},

service_correct_priority:{
  text:"Advise customer that PRO is rated correctly as Priority since it was noted/requested on BOL.",
  choices:[
    {label:"Continue",next:"service_fbc_mismatch_update",icon:"fa-solid fa-arrow-right",desc:"Proceed if FBC does not match the BOL service level."}
  ]
},

service_no_bol:{
  text:"PRO # is rated correctly as Priority since the service level was not listed on BOL per FXF Rules Tariff Item 188 Section 2.",
  choices:[
    {label:"Continue",next:"service_reopened_case_note",icon:"fa-solid fa-arrow-right",desc:"Proceed to reopened case guidance."}
  ]
},

service_reopened_case_note:{
  text:"If the case reopened and customer is claiming that service level was covered by the FedEx stamp, check previous shipments to locate the common service level of the customer then update the service level per previous shipment.",
  choices:[
    {label:"Continue",next:"service_fbc_mismatch_update",icon:"fa-solid fa-arrow-right",desc:"Proceed to FBC update steps if service level needs to be updated."}
  ]
},

service_fbc_mismatch_update:{
  text:"If service level noted on BOL doesn't match the service level on FBC, follow step below on how to update service level on FBC.",
  choices:[
    {label:"Continue",next:"service_update_steps",icon:"fa-solid fa-arrow-right",desc:"Open the FBC update steps."}
  ]
},

/* ================= UPDATE FLOW WITH IMAGES ================= */

service_update_steps:{
  text:"Click the service level on FBC. See image below.",
  help:"Select the service level field in FBC to begin updating it.",
  image:"guides/Billing%20Dispute%20Guides/service-level-type/images/service-level-field.png",
  choices:[
    {label:"Continue",next:"service_update_screen",icon:"fa-solid fa-arrow-right",desc:"Proceed to the service selection screen."}
  ]
},

service_update_screen:{
  text:"This will open a new screen.",
  help:"Click the arrows next to the current service until the correct one is found, then click it so it will highlight blue.",
  image:"guides/Billing%20Dispute%20Guides/service-level-type/images/select-service-screen.jpg",
  choices:[
    {label:"Continue",next:"service_priority_to_economy_exception",icon:"fa-solid fa-arrow-right",desc:"Proceed to exception handling step."}
  ]
},

service_priority_to_economy_exception:{
  text:"When updating service level from Priority to Economy but no ECON option appears, follow the step below.",
  choices:[
    {label:"Continue",next:"service_ctrl_alt_p",icon:"fa-solid fa-arrow-right",desc:"Proceed to the service type workaround."}
  ]
},

service_ctrl_alt_p:{
  text:"Try CTRL + ALT + P to change the Service Type. Enter ONLY either FXFR or ECON.",
  choices:[
    {label:"Did work",next:"service_comment",icon:"fa-solid fa-circle-check",desc:"The workaround worked."},
    {label:"Didn't work",next:"service_dnu_check",icon:"fa-solid fa-circle-xmark",desc:"The workaround did not work."}
  ]
},

service_dnu_check:{
  text:"Check if either the current Shipper or Consignee was flagged as DNU in error.",
  choices:[
    {label:"Continue",next:"service_fix_account",icon:"fa-solid fa-arrow-right",desc:"Proceed to account correction."}
  ]
},

service_fix_account:{
  text:"If so, search for active account and change the flagged account to an active one.",
  choices:[
    {label:"Continue",next:"service_note_fix",icon:"fa-solid fa-arrow-right",desc:"Proceed after changing the account."}
  ]
},

service_note_fix:{
  text:"Put a note on 2x4 comment on FBC: UPDATED SC/CC TO AN ACTIVE ACCOUNT TO ENABLE ECON OPTION. Use CORR SYSM and accept all.",
  choices:[
    {label:"Continue",next:"service_reopen",icon:"fa-solid fa-arrow-right",desc:"Proceed to reopen the PRO."}
  ]
},

service_reopen:{
  text:"Reopen the PRO and you should be able to update to ECON.",
  choices:[
    {label:"Continue",next:"service_comment",icon:"fa-solid fa-arrow-right",desc:"Proceed to the comment box step."}
  ]
},

service_comment:{
  text:`On the comment box, put:

VS-BLER-CASE#-UPDATED SERVICE LEVEL TO ECONOMY/PRIORITY PER BOL

Click OK. The system will automatically put the CORR EPDC and the 2X4 comment on FBC.

Then autorate and accept all.`,
  help:"Enter the required comment after selecting the correct service level.",
  image:"guides/Billing%20Dispute%20Guides/service-level-type/images/comment-box-step.jpg",
  choices:[]
}

};
