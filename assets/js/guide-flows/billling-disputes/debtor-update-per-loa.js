window.GUIDE_CONFIG = {
  id: "debtor-update-per-loa",
  title: "Debtor Update per LOA",
  startNode: "start",
  templateCollection: "debtor_update_per_loa_template"
};
window.GUIDE_NODES = {
  start: {
    text: "Debtor Update per LOA - General Guide",
    help: "Use this guide to determine the correct rebill handling based on the requesting party, debtor setup, LOA details, and billing relationship.",
    note: "Always verify the BOL debtor, new debtor, LOA details, account status, and payment status before proceeding.",
    choices: [
      {
        label: "Continue",
        next: "root",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the LOA rebill decision flow."
      }
    ]
  },

  root: {
    text: "Who is the disputing / requesting party?",
    help: "Select the party requesting the LOA rebill or debtor update.",
    choices: [
      { label: "BOL Debtor", next: "bol_prestart", icon: "fa-solid fa-file-invoice", desc: "The debtor currently shown per BOL is requesting." },
      { label: "New Debtor", next: "new_start", icon: "fa-solid fa-user-plus", desc: "A new debtor is requesting or accepting billing." },
      { label: "3PL", next: "tpl_start", icon: "fa-solid fa-building-user", desc: "The request involves a third-party logistics billing setup." },
      { label: "FPAY", next: "fpay_request", icon: "fa-solid fa-money-check-dollar", desc: "The request involves FPAY billing." },
      { label: "Collector", next: "collector_start", icon: "fa-solid fa-headset", desc: "The request is coming from a collector." }
    ]
  },

  bol_prestart: {
    text: "Is the requestor exactly the same company and address per BOL?",
    help: "Compare the requestor information against the company name and address shown on the BOL.",
    choices: [
      { label: "Yes", next: "bol_prestart_advise", icon: "fa-solid fa-circle-check", desc: "Requestor matches the BOL debtor exactly." },
      { label: "No", next: "bol_start", icon: "fa-solid fa-circle-xmark", desc: "Requestor does not exactly match the BOL debtor." }
    ]
  },

  bol_prestart_advise: {
    text: "Advise customer that PRO is billing correctly per BOL. Was LOA provided from the new debtor?",
    help: "If the PRO is billing correctly per BOL, LOA from the new debtor is required before changing the billing party.",
    choices: [
      { label: "Yes", next: "follow_process", icon: "fa-solid fa-file-circle-check", desc: "LOA was provided." },
      { label: "No", next: "follow_process_no", icon: "fa-solid fa-file-circle-xmark", desc: "LOA was not provided." }
    ]
  },

  follow_process: {
    text: "Follow process for NEW DEBTOR update.",
    choices: []
  },

  follow_process_no: {
    text: "Insist that PRO is billing correctly per BOL. No updates can be made without LOA from the new debtor.",
    choices: []
  },

  bol_start: {
    text: "Same company but different mailing address and Pricing / BRAP?",
    help: "Check if the company is related but the mailing address and pricing setup differ.",
    choices: [
      { label: "Yes", next: "bol_account_name", icon: "fa-solid fa-circle-check", desc: "Criteria appears to match." },
      { label: "No", next: "bol_per_debtor", icon: "fa-solid fa-circle-xmark", desc: "Criteria does not match." }
    ]
  },

  bol_per_debtor: {
    text: "If one of the criteria is not met, use per debtor for better billing.",
    choices: []
  },

  bol_account_name: {
    text: "Is the account name the same or related to the debtor?",
    choices: [
      { label: "Yes", next: "bol_mailing_diff", icon: "fa-solid fa-circle-check", desc: "Account name is same or related." },
      { label: "No", next: "bol_per_debtor", icon: "fa-solid fa-circle-xmark", desc: "Account name is not related." }
    ]
  },

  bol_mailing_diff: {
    text: "Is the mailing address different from the current debtor?",
    choices: [
      { label: "Yes", next: "bol_prau", icon: "fa-solid fa-circle-check", desc: "Mailing address is different." },
      { label: "No", next: "bol_per_debtor", icon: "fa-solid fa-circle-xmark", desc: "Mailing address is not different." }
    ]
  },

  bol_prau: {
    text: "Was the PRAU totally changed?",
    help: "Confirm if the pricing or contract was fully replaced.",
    choices: [
      { label: "Yes", next: "bol_corr_loa", icon: "fa-solid fa-circle-check", desc: "Pricing or contract was replaced." },
      { label: "No", next: "bol_per_debtor", icon: "fa-solid fa-circle-xmark", desc: "PRAU was not totally changed." }
    ]
  },

  bol_corr_loa: {
    text: "CORR LOA with correction fee.",
    choices: []
  },

  new_start: {
    text: "Is the PRO paid and closed?",
    choices: [
      { label: "Yes", next: "new_over_year", icon: "fa-solid fa-circle-check", desc: "PRO is paid and closed." },
      { label: "No", next: "new_credit_hold", icon: "fa-solid fa-circle-xmark", desc: "PRO is not paid and closed." }
    ]
  },

  new_over_year: {
    text: "Is it over a year?",
    choices: [
      { label: "Yes", next: "new_deny_paid_bol", icon: "fa-solid fa-calendar-xmark", desc: "The PRO is over one year old." },
      { label: "No", next: "new_advise_paid", icon: "fa-solid fa-calendar-check", desc: "The PRO is within one year." }
    ]
  },

  new_deny_paid_bol: {
    text: "DENY. Advise that PRO was already paid by the debtor per BOL.",
    choices: []
  },

  new_advise_paid: {
    text: "Advise customer that PRO was already paid and closed by the debtor per BOL.",
    choices: [
      { label: "Continue", next: "new_customer_insist", icon: "fa-solid fa-arrow-right", desc: "Check if customer still insists." }
    ]
  },

  new_customer_insist: {
    text: "Did the customer reply and insist on rebilling per LOA?",
    choices: [
      { label: "Yes", next: "new_rebill_or_keep", icon: "fa-solid fa-circle-check", desc: "Customer insists on rebilling." },
      { label: "No", next: "new_leave_as_is", icon: "fa-solid fa-circle-xmark", desc: "Customer does not insist." }
    ]
  },

  new_rebill_or_keep: {
    text: "Proceed to rebill. Payment from debtor per BOL = REMOVE payment. Payment from accepting party per LOA = KEEP payment.",
    choices: []
  },

  new_leave_as_is: {
    text: "Leave the PRO as is since it is already paid and closed by the debtor per BOL.",
    choices: []
  },

  new_credit_hold: {
    text: "Is the new debtor account on Credit Hold?",
    choices: [
      { label: "Yes", next: "new_deny_credit_hold", icon: "fa-solid fa-triangle-exclamation", desc: "New debtor is on credit hold." },
      { label: "No", next: "new_loa_details", icon: "fa-solid fa-circle-check", desc: "New debtor is not on credit hold." }
    ]
  },

  new_deny_credit_hold: {
    text: "DENY. Advise customer that: At this time, FXF is unable to accept the attached LOA. The invoice will remain billed per the bill of lading received at pick up. If you have questions why the account cannot be billed, please contact credit department at 866-756-3590 opt 4 to speak to an agent. Hours of operation are 7AM to 5PM CST.",
    choices: []
  },

  new_loa_details: {
    text: "Are the LOA details and information complete and accurate?",
    choices: [
      { label: "Yes", next: "new_proceed", icon: "fa-solid fa-circle-check", desc: "LOA details are complete." },
      { label: "No", next: "new_deny_incomplete", icon: "fa-solid fa-circle-xmark", desc: "LOA details are incomplete." }
    ]
  },

  new_proceed: {
    text: "Proceed with the Rebill per LOA.",
    choices: []
  },

  new_deny_incomplete: {
    text: "DENY. Advise to provide complete and accurate LOA details.",
    choices: []
  },

  tpl_start: {
    text: "What is the 3PL request?",
    choices: [
      { label: "Rebill to Shipper/Consignee c/o 3PL", next: "tpl_shipper_check", icon: "fa-solid fa-truck", desc: "Rebill to shipper or consignee care of 3PL." },
      { label: "Rebill to Company C c/o 3PL", next: "tpl_companyc_check", icon: "fa-solid fa-building", desc: "Company C is not shipper or consignee." },
      { label: "Rebill to Company B c/o 3PL", next: "tpl_companyb_check", icon: "fa-solid fa-building", desc: "Rebill Company B care of 3PL." },
      { label: "Rebill to Company A c/o 3PL2", next: "tpl_companya_check", icon: "fa-solid fa-building", desc: "Rebill Company A care of another 3PL." },
      { label: "Bill directly to 3PL", next: "tpl_direct_check", icon: "fa-solid fa-building-user", desc: "Bill directly to the 3PL." }
    ]
  },

  tpl_shipper_check: {
    text: "Is the BOL debtor a 3PL only with no company?",
    choices: [
      { label: "Yes", next: "tpl_corr_accr", icon: "fa-solid fa-circle-check", desc: "BOL debtor is 3PL only." },
      { label: "No", next: "tpl_who_debtor_shipper", icon: "fa-solid fa-circle-xmark", desc: "BOL debtor includes a company." }
    ]
  },

  tpl_corr_accr: {
    text: "CORR ACCR for proper billing.",
    choices: []
  },

  tpl_who_debtor_shipper: {
    text: "Who is the current debtor per BOL?",
    choices: [
      { label: "Shipper/Consignee", next: "tpl_shipper_rebill", icon: "fa-solid fa-user", desc: "Current debtor is shipper or consignee." }
    ]
  },

  tpl_shipper_rebill: {
    text: "Rebill Shipper/Consignee c/o 3PL. CORR ACCR with correction fee.",
    choices: []
  },

  tpl_companyc_check: {
    text: "Is the BOL debtor a 3PL only with no company?",
    choices: [
      { label: "Yes", next: "tpl_auth_corr_fee", icon: "fa-solid fa-circle-check", desc: "BOL debtor is 3PL only." },
      { label: "No", next: "tpl_who_debtor_c", icon: "fa-solid fa-circle-xmark", desc: "BOL debtor includes a company." }
    ]
  },

  tpl_auth_corr_fee: {
    text: "Auth: Per LOA CORR ACCR with correction fee.",
    choices: []
  },

  tpl_who_debtor_c: {
    text: "Who is the current debtor per BOL?",
    choices: [
      { label: "Company C", next: "tpl_companyc_rebill", icon: "fa-solid fa-building", desc: "Company C is current debtor." }
    ]
  },

  tpl_companyc_rebill: {
    text: "Rebill Company C c/o 3PL. CORR LOA with correction fee.",
    choices: []
  },

  tpl_companyb_check: {
    text: "Is the debtor per BOL Company A c/o 3PL?",
    choices: [
      { label: "Yes", next: "tpl_companyb_corr", icon: "fa-solid fa-circle-check", desc: "Debtor per BOL is Company A c/o 3PL." },
      { label: "No", next: "tpl_who_debtor_b", icon: "fa-solid fa-circle-xmark", desc: "Debtor per BOL is not Company A c/o 3PL." }
    ]
  },

  tpl_companyb_corr: {
    text: "CORR LOA with correction fee.",
    choices: []
  },

  tpl_who_debtor_b: {
    text: "Who is the current debtor per BOL?",
    choices: [
      { label: "Company B", next: "tpl_companyb_rebill", icon: "fa-solid fa-building", desc: "Company B is current debtor." }
    ]
  },

  tpl_companyb_rebill: {
    text: "Rebill Company B c/o 3PL. CORR ACCR for proper billing. Note that if the debtor is not an ABT, correction fee applies.",
    choices: []
  },

  tpl_companya_check: {
    text: "Is the debtor per BOL Company A c/o 3PL1?",
    choices: [
      { label: "Yes", next: "tpl_companya_corr", icon: "fa-solid fa-circle-check", desc: "Debtor per BOL is Company A c/o 3PL1." },
      { label: "No", next: "tpl_who_debtor_a", icon: "fa-solid fa-circle-xmark", desc: "Debtor per BOL is not Company A c/o 3PL1." }
    ]
  },

  tpl_companya_corr: {
    text: "CORR LOA with correction fee. Request should come from the new 3PL.",
    note: "Request should come from the new 3PL.",
    choices: []
  },

  tpl_who_debtor_a: {
    text: "Who is the current debtor per BOL?",
    choices: [
      { label: "3PL2", next: "tpl_companya_rebill", icon: "fa-solid fa-building-user", desc: "3PL2 is current debtor." }
    ]
  },

  tpl_companya_rebill: {
    text: "Rebill Company A c/o 3PL2. CORR ACCR for proper billing.",
    choices: []
  },

  tpl_direct_check: {
    text: "Is the debtor per BOL Company A c/o 3PL?",
    choices: [
      { label: "Yes", next: "tpl_direct_corr", icon: "fa-solid fa-circle-check", desc: "Debtor per BOL is Company A c/o 3PL." },
      { label: "No", next: "tpl_who_debtor_direct", icon: "fa-solid fa-circle-xmark", desc: "Debtor per BOL is not Company A c/o 3PL." }
    ]
  },

  tpl_direct_corr: {
    text: "CORR LOA without correction fee.",
    choices: []
  },

  tpl_who_debtor_direct: {
    text: "Who is the current debtor per BOL?",
    choices: [
      { label: "Company A", next: "tpl_direct_rebill", icon: "fa-solid fa-building", desc: "Company A is current debtor." }
    ]
  },

  tpl_direct_rebill: {
    text: "Rebill directly to 3PL. CORR LOA with correction fee.",
    choices: []
  },

  fpay_request: {
    text: "What is the FPAY request?",
    choices: [
      { label: "Rebill to Company A c/o FPAY", next: "fpay_companya_check", icon: "fa-solid fa-building", desc: "Rebill Company A care of FPAY." },
      { label: "Rebill to Company B c/o FPAY", next: "fpay_companyb_check", icon: "fa-solid fa-building", desc: "Rebill Company B care of FPAY." },
      { label: "Rebill to Company A c/o FPAY2", next: "fpay_companya2_check", icon: "fa-solid fa-building", desc: "Rebill Company A care of FPAY2." },
      { label: "Bill directly to FPAY", next: "fpay_direct_check", icon: "fa-solid fa-money-check-dollar", desc: "Bill directly to FPAY." }
    ]
  },

  fpay_companya_check: {
    text: "Is the BOL debtor Company A?",
    choices: [
      { label: "Yes", next: "fpay_companya_accr", icon: "fa-solid fa-circle-check", desc: "BOL debtor is Company A." },
      { label: "No", next: "fpay_companya_who", icon: "fa-solid fa-circle-xmark", desc: "BOL debtor is not Company A." }
    ]
  },

  fpay_companya_accr: {
    text: "CORR ACCR for proper billing.",
    choices: []
  },

  fpay_companya_who: {
    text: "Who is the current debtor per BOL?",
    choices: [
      { label: "Company B", next: "fpay_companya_rebill_as_b", icon: "fa-solid fa-building", desc: "Current debtor is Company B." },
      { label: "Other", next: "fpay_companya_rebill_other", icon: "fa-solid fa-circle-question", desc: "Current debtor is another party." }
    ]
  },

  fpay_companya_rebill_as_b: {
    text: "Company B\n\nRebill Company A c/o FPAY — CORR LOA with correction fee.",
    choices: []
  },

  fpay_companya_rebill_other: {
    text: "Rebill Company A c/o FPAY — CORR LOA with correction fee.",
    choices: []
  },

  fpay_companyb_check: {
    text: "Is the debtor per BOL Company B?",
    choices: [
      { label: "Yes", next: "fpay_companyb_corr", icon: "fa-solid fa-circle-check", desc: "Debtor per BOL is Company B." },
      { label: "No", next: "fpay_companyb_who", icon: "fa-solid fa-circle-xmark", desc: "Debtor per BOL is not Company B." }
    ]
  },

  fpay_companyb_corr: {
    text: "CORR LOA with correction fee.",
    choices: []
  },

  fpay_companyb_who: {
    text: "Who is the current debtor per BOL?",
    choices: [
      { label: "Company A", next: "fpay_companyb_rebill_as_a", icon: "fa-solid fa-building", desc: "Current debtor is Company A." },
      { label: "Other", next: "fpay_companyb_rebill_other", icon: "fa-solid fa-circle-question", desc: "Current debtor is another party." }
    ]
  },

  fpay_companyb_rebill_as_a: {
    text: "Company A\n\nRebill Company B c/o FPAY — CORR LOA with correction fee.",
    choices: []
  },

  fpay_companyb_rebill_other: {
    text: "Rebill Company B c/o FPAY — CORR LOA with correction fee.",
    choices: []
  },

  fpay_companya2_check: {
    text: "Is the debtor per BOL Company A c/o FPAY2?",
    choices: [
      { label: "Yes", next: "fpay_companya2_rebill", icon: "fa-solid fa-circle-check", desc: "Debtor per BOL is Company A c/o FPAY2." },
      { label: "No", next: "fpay_companya2_who", icon: "fa-solid fa-circle-xmark", desc: "Debtor per BOL is not Company A c/o FPAY2." }
    ]
  },

  fpay_companya2_rebill: {
    text: "Rebill Company A c/o FPAY2. CORR ACCR for proper billing.",
    choices: []
  },

  fpay_companya2_who: {
    text: "Who is the current debtor per BOL?",
    choices: [
      { label: "Company A", next: "fpay_companya2_rebill", icon: "fa-solid fa-building", desc: "Current debtor is Company A." },
      { label: "Other", next: "fpay_direct_check", icon: "fa-solid fa-circle-question", desc: "Current debtor is another party." }
    ]
  },

  fpay_direct_check: {
    text: "Is the debtor per BOL Company A?",
    choices: [
      { label: "Yes", next: "fpay_direct_corr", icon: "fa-solid fa-circle-check", desc: "Debtor per BOL is Company A." },
      { label: "No", next: "fpay_direct_who", icon: "fa-solid fa-circle-xmark", desc: "Debtor per BOL is not Company A." }
    ]
  },

  fpay_direct_corr: {
    text: "CORR LOA without correction fee.",
    choices: []
  },

  fpay_direct_who: {
    text: "Who is the current debtor per BOL?",
    choices: [
      { label: "Company A", next: "fpay_direct_rebill_as_a", icon: "fa-solid fa-building", desc: "Current debtor is Company A." },
      { label: "Other", next: "fpay_direct_rebill_other", icon: "fa-solid fa-circle-question", desc: "Current debtor is another party." }
    ]
  },

  fpay_direct_rebill_as_a: {
    text: "Company A\n\nRebill Company A c/o FPAY2. CORR LOA with correction fee.",
    choices: []
  },

  fpay_direct_rebill_other: {
    text: "Rebill directly to FPAY. CORR LOA with correction fee.",
    choices: []
  },

  collector_start: {
    text: "Advise collector that PRO is billing correctly per BOL. Ask LOA from the new debtor.",
    choices: [
      { label: "Continue", next: "collector_loa_check", icon: "fa-solid fa-arrow-right", desc: "Check if LOA was provided." }
    ]
  },

  collector_loa_check: {
    text: "Was LOA provided?",
    choices: [
      { label: "Yes", next: "collector_loa_yes", icon: "fa-solid fa-circle-check", desc: "LOA was provided." },
      { label: "No", next: "collector_loa_no", icon: "fa-solid fa-circle-xmark", desc: "LOA was not provided." }
    ]
  },

  collector_loa_yes: {
    text: "Follow process for NEW DEBTOR update.",
    choices: []
  },

  collector_loa_no: {
    text: "Insist that PRO is billing correctly per BOL. No updates can be made without LOA from the new debtor.",
    choices: []
  }
};
