/* =========================================================
   CORRECTION CODE GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "correction-code-guide",
  title: "Correction Code Guide",
  startNode: "start",
  templateCollection: "correction_code_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Correction Code Guide",
    help: "Identify the correction needed and follow the correct path to determine the proper correction code.",
    note: "Always review the BOL, billing details, debtor/account setup, and shipment context before selecting a correction path.",
    choices: [
      {
        label: "Continue",
        next: "correction_type",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Correction Code decision guide."
      }
    ]
  },

  correction_type: {
    text: "What is the Correction that you are trying to do?",
    help: "Select the type of correction based on the request.",
    choices: [
      {
        label: "Change Terms",
        next: "change_terms_root",
        icon: "fa-solid fa-file-invoice",
        desc: "Update shipment billing terms."
      },
      {
        label: "Change Account Code",
        next: "change_account_root",
        icon: "fa-solid fa-id-card",
        desc: "Update billing account or debtor information."
      },
      {
        label: "Change Class / NMFC / Description / Handling Unit",
        next: "change_class_root",
        icon: "fa-solid fa-boxes-stacked",
        desc: "Update freight class, NMFC, description, or handling unit."
      },
      {
        label: "Change Weight",
        next: "change_weight_root",
        icon: "fa-solid fa-weight-scale",
        desc: "Update shipment weight per BOL."
      },
      {
        label: "Change Service Type",
        action: "EPDC",
        icon: "fa-solid fa-truck-fast",
        desc: "Update shipment service type."
      },
      {
        label: "Reference no Edit",
        next: "reference_edit_root",
        icon: "fa-solid fa-hashtag",
        desc: "Edit shipment reference number."
      },
      {
        label: "Accessorial Update",
        next: "accessorial_update_root",
        icon: "fa-solid fa-screwdriver-wrench",
        desc: "Add, remove, or update an accessorial."
      },
      {
        label: "Pricing Related Update",
        next: "pricing_related_update",
        icon: "fa-solid fa-tags",
        desc: "Pricing-related correction."
      },
      {
        label: "Refreshed terms to pull ABT",
        next: "refresh_terms_pull_abt_intro",
        icon: "fa-solid fa-arrows-rotate",
        desc: "Use this when terms were refreshed so the system can pull the ABT account."
      }
    ]
  },

  /* =========================
     REFRESHED TERMS
  ========================= */

  refresh_terms_pull_abt_intro: {
    text: "Refreshed terms to pull ABT",
    help: "Use this when FBC terms are prepaid/collect and the customer is requesting to pull the shipper's or consignee's ABT, but the system did not pull it so the terms need to be refreshed.",
    note: "FBC terms is prepaid/collect and customer is requesting to pull the shipper's/consignee's ABT. However, the system did not pull it, so you need to refresh the terms to pull the ABT account.\n\nNote: Check shipping's account comment to see when was ABT added.",
    choices: [
      {
        label: "ABT was added after correction",
        next: "refresh_terms_pull_abt_after_correction_bol",
        icon: "fa-solid fa-clock-rotate-left",
        desc: "ABT was added after the correction was already made."
      },
      {
        label: "ABT was added before correction",
        action: "SYSM - because system failed to pull the ABT",
        icon: "fa-solid fa-microchip",
        desc: "System failed to pull the ABT even though it was already available."
      },
      {
        label: "No comment when was ABT added",
        action: "SYSM - Due to system issue",
        icon: "fa-solid fa-circle-question",
        desc: "There is no account comment showing when the ABT was added."
      }
    ]
  },

  refresh_terms_pull_abt_after_correction_bol: {
    text: "Is ABT account or information noted on the BOL?",
    help: "Use this when the ABT was added after the correction and you need to determine whether it was noted on the BOL.",
    choices: [
      {
        label: "Yes",
        action: "ACCR - Since this is not a biller's error and ABT is noted on the BOL",
        icon: "fa-solid fa-circle-check",
        desc: "ABT is noted on the BOL."
      },
      {
        label: "No",
        action: "CUSI - Since this is not a biller's error and ABT is not noted on the BOL",
        icon: "fa-solid fa-circle-xmark",
        desc: "ABT is not noted on the BOL."
      }
    ]
  },

  /* =========================
     CHANGE TERMS
  ========================= */

  change_terms_root: {
    text: "Change Terms",
    help: "Select the basis of the requested terms correction.",
    choices: [
      {
        label: "Per BOL",
        next: "change_terms_per_bol_who",
        icon: "fa-solid fa-file-lines",
        desc: "Terms correction based on the BOL."
      },
      {
        label: "In attempt of payment",
        next: "change_terms_attempt_payment",
        icon: "fa-solid fa-money-bill-wave",
        desc: "Terms correction requested in attempt of payment."
      },
      {
        label: "Per LOA",
        next: "change_terms_per_loa",
        icon: "fa-solid fa-file-signature",
        desc: "Terms correction supported by LOA."
      },
      {
        label: "To pull ABT",
        next: "change_terms_pull_abt",
        icon: "fa-solid fa-code-branch",
        desc: "Terms correction to pull ABT."
      }
    ]
  },

  change_terms_per_bol_who: {
    text: "Who entered the incorrect Terms?",
    help: "Identify who made the incorrect terms entry.",
    choices: [
      {
        label: "Revenue Services Agent / Revenue Quality Agent",
        next: "change_terms_rs_confusing",
        icon: "fa-solid fa-user-gear",
        desc: "Revenue Services or Revenue Quality entered the terms."
      },
      {
        label: "Biller",
        next: "change_terms_biller_confusing",
        icon: "fa-solid fa-user-pen",
        desc: "Biller entered the incorrect terms."
      },
      {
        label: "Customer via ISPI",
        action: "CUSI",
        icon: "fa-solid fa-user-check",
        desc: "Customer entered incorrect terms via ISPI."
      },
      {
        label: "System",
        next: "change_terms_system_note",
        icon: "fa-solid fa-microchip",
        desc: "System entered the incorrect terms."
      },
      {
        label: "Service Center",
        next: "change_terms_service_center",
        icon: "fa-solid fa-building",
        desc: "Service center entered the incorrect terms."
      }
    ]
  },

  change_terms_rs_confusing: {
    text: "Is the BOL confusing or provide conflicting information that can cause confusion to the Agent?",
    help: "Review the BOL content before assigning the correction code.",
    choices: [
      {
        label: "Yes",
        next: "change_terms_rs_followed_process",
        icon: "fa-solid fa-circle-check",
        desc: "The BOL is confusing or inaccurate."
      },
      {
        label: "No",
        action: "CAE - RSA entered incorrect Terms even if BOL is accurate\n\nRQE - RQA entered incorrect Terms even if BOL is accurate",
        icon: "fa-solid fa-circle-xmark",
        desc: "The BOL is accurate."
      }
    ]
  },

  change_terms_rs_followed_process: {
    text: "Did the Agent followed the right process per Rebill per BOL decision Tree?",
    help: "Check if the agent followed the correct rebill-per-BOL process.",
    choices: [
      {
        label: "Yes",
        action: "CUSI - RSA Incorrect Terms since BOL is confusing or inaccurate",
        icon: "fa-solid fa-circle-check",
        desc: "Agent followed the correct process."
      },
      {
        label: "No",
        action: "CAE - RSA entered incorrect Terms even if BOL is accurate\n\nRQE - RQA entered incorrect Terms even if BOL is accurate",
        icon: "fa-solid fa-circle-xmark",
        desc: "Agent did not follow the correct process."
      }
    ]
  },

  change_terms_biller_confusing: {
    text: "Is the BOL confusing or provide conflicting information that can cause confusion to the Biller?",
    help: "Review the BOL and determine if it could mislead the biller.",
    choices: [
      {
        label: "Yes",
        action: "CUSI - Biller entered Incorrect Terms since BOL is confusing or inaccurate",
        icon: "fa-solid fa-circle-check",
        desc: "The BOL is confusing or inaccurate."
      },
      {
        label: "No",
        action: "ETMS - biller entered incorrect Terms even if BOL is accurate",
        icon: "fa-solid fa-circle-xmark",
        desc: "The BOL is accurate."
      }
    ]
  },

  change_terms_system_note: {
    text: "System",
    help: "Use this when the adjustment was system-generated.",
    note: "When adjustment is made by RQB9109 & JXT2382. This will also apply if it falls to CONVRAT and the date is different from either biller, org/dest center, agents adjustment date.",
    choices: [
      {
        label: "Continue",
        action: "SYSM - Change terms due to incorrect TERMS entered by the SYSTEM",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply system correction code."
      }
    ]
  },

  change_terms_service_center: {
    text: "Service Center",
    help: "Choose which service center entered the incorrect terms.",
    choices: [
      {
        label: "Origin SC",
        action: "OPSO - If Origin SC Agent entered incorrect Terms",
        icon: "fa-solid fa-location-arrow",
        desc: "Origin service center made the error."
      },
      {
        label: "Destination SC",
        action: "OPSD - If Destination SC Agent entered incorrect Terms",
        icon: "fa-solid fa-location-dot",
        desc: "Destination service center made the error."
      }
    ]
  },

  change_terms_attempt_payment: {
    text: "In attempt of payment",
    help: "Use this path when terms/account update is being requested to collect payment on a properly billed pro.",
    note: "Pro is billing correctly but Consignee refused to pay for the freight charge, since invoice is more than 6 months, we try to rebill it to Shipper in attempt of payment.",
    choices: [
      {
        label: "Continue",
        action: "CORR ACCR - any update made on Terms or Account in attempt of payment when pro is billing correctly per BOL",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply attempt-of-payment correction."
      }
    ]
  },

  change_terms_per_loa: {
    text: "Per LOA",
    help: "Follow LOA handling when the correction is supported by LOA.",
    choices: [
      {
        label: "Continue",
        action: "Please follow LOA guidelines",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed under LOA process."
      }
    ]
  },

  change_terms_pull_abt: {
    text: "Is ABT noted on the BOL?",
    help: "Check whether ABT is explicitly noted on the BOL.",
    choices: [
      {
        label: "Yes",
        next: "change_terms_pull_abt_yes_path",
        icon: "fa-solid fa-circle-check",
        desc: "ABT is noted on the BOL."
      },
      {
        label: "No",
        next: "change_terms_pull_abt_no_path",
        icon: "fa-solid fa-circle-xmark",
        desc: "ABT is not noted on the BOL."
      }
    ]
  },

  change_terms_pull_abt_yes_path: {
    text: "ABT noted on BOL",
    help: "Choose the scenario that matches the request.",
    choices: [
      {
        label: "ABT is noted within shipper/consignee ABT and biller failed to bill it",
        action: "ECD - since ABT is noted on the BOL and biller failed to bill it.",
        icon: "fa-solid fa-file-circle-check",
        desc: "Biller failed to bill the noted ABT."
      },
      {
        label: "Per BOL terms is Collect and BOL has bill to info within ABT of the shipper; biller billed collect as terms but wrong debtor",
        action: "CUSI - This is not a biller's error and biller billed the correct debtor per BOL",
        icon: "fa-solid fa-user-shield",
        desc: "This is not a biller's error."
      }
    ]
  },

  change_terms_pull_abt_no_path: {
    text: "ABT not noted on BOL",
    help: "Use this when the request is to bill a specific account found to the consignee's ABT even though terms are already billing correctly per BOL.",
    choices: [
      {
        label: "Continue",
        action: "CORR LOA with Corr fee (CBLC)",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply LOA with correction fee."
      }
    ]
  },

  /* =========================
     CHANGE ACCOUNT CODE
  ========================= */

  change_account_root: {
    text: "Change Account Code",
    help: "Select the account-code correction basis.",
    choices: [
      {
        label: "Per BOL",
        next: "change_account_per_bol_reason",
        icon: "fa-solid fa-file-lines",
        desc: "Account code change based on BOL."
      },
      {
        label: "Per LOA",
        next: "change_account_per_loa",
        icon: "fa-solid fa-file-signature",
        desc: "Account code change supported by LOA."
      },
      {
        label: "To pull ABT",
        next: "change_account_pull_abt_intro",
        icon: "fa-solid fa-code-branch",
        desc: "Account code change to pull ABT."
      }
    ]
  },

  change_account_per_bol_reason: {
    text: "Why are you changing an Account code?",
    help: "Choose the scenario that best matches the request.",
    choices: [
      {
        label: "BOL shows an account no. or Bill to Information but was not entered by the Biller",
        next: "change_account_bol_not_entered_confusing",
        icon: "fa-solid fa-file-circle-question",
        desc: "BOL showed the correct info but biller did not enter it."
      },
      {
        label: "Billing correctly per BOL but customer is requesting to use a different account no. for better/proper billing",
        next: "change_account_better_billing_related",
        icon: "fa-solid fa-arrows-rotate",
        desc: "Customer wants better or more proper billing."
      },
      {
        label: "Rebill in attempt of payment",
        next: "change_account_attempt_payment",
        icon: "fa-solid fa-money-bill-wave",
        desc: "Requested to rebill to another account in attempt of payment."
      }
    ]
  },

  change_account_bol_not_entered_confusing: {
    text: "Is the BOL confusing or provide conflicting/incomplete information that can cause confusion to the Biller?",
    help: "Determine if the BOL could have confused the biller.",
    choices: [
      {
        label: "Yes",
        action: "CUSI - used when changing Account Code but should not be taken against the biller since BOL has conflicting information",
        icon: "fa-solid fa-circle-check",
        desc: "The BOL was confusing or conflicting."
      },
      {
        label: "No",
        action: "ECD - used when changing Account Code since Biller entered an incorrect Code not on the BOL or different from what the BOL states",
        note: "Note: Other CORR codes may be applicable depending on who made the adjustment.\n\nCAE - Vendor Agent error\nRQE - RQA Error\nOPSO/OPSD - Center Error\nSYSM - System Error",
        icon: "fa-solid fa-circle-xmark",
        desc: "The BOL was clear."
      }
    ]
  },

  change_account_better_billing_related: {
    text: "Is the account name the same or related to the debtor?",
    help: "Determine whether the requested account is related to the current debtor.",
    choices: [
      {
        label: "Yes",
        next: "change_account_better_billing_address",
        icon: "fa-solid fa-circle-check",
        desc: "Account is same or related to debtor."
      },
      {
        label: "No",
        action: "Please follow LOA guidelines",
        icon: "fa-solid fa-circle-xmark",
        desc: "Account is not related to debtor."
      }
    ]
  },

  change_account_better_billing_address: {
    text: "Is the mailing address different from the current debtor?",
    help: "Compare the requested billing account address with the current debtor.",
    choices: [
      {
        label: "Yes",
        next: "change_account_better_billing_prau",
        icon: "fa-solid fa-circle-check",
        desc: "Mailing address is different."
      },
      {
        label: "No",
        action: "If one of the criteria is not met, use per debtor for better billing. Use ACCR. Send to imaging team for reference",
        icon: "fa-solid fa-circle-xmark",
        desc: "Criteria not met."
      }
    ]
  },

  change_account_better_billing_prau: {
    text: "Was the PRAU TOTALLY changed?",
    help: "Use this when determining whether pricing/contract was fully updated or replaced.",
    note: "If yes, this means, pricing/contract was updated/replaced - LS,LCL LT to LS, LC, LT.\n\nNote: This is not applicable if pricing is LD to LS/LCL/T - Use CORR ACCR with no correction fee - Send to imaging team for reference",
    choices: [
      {
        label: "Yes",
        action: "CORR LOA with correction fee",
        icon: "fa-solid fa-circle-check",
        desc: "PRAU was totally changed."
      },
      {
        label: "No",
        action: "If one of the criteria is not met, use per debtor for better billing. Use ACCR. Send to imaging team for reference",
        icon: "fa-solid fa-circle-xmark",
        desc: "PRAU was not totally changed."
      }
    ]
  },

  change_account_attempt_payment: {
    text: "Rebill in attempt of payment",
    help: "Use this when collector or sales requests rebilling to a different account in attempt of payment even when pro is billing correctly per BOL.",
    note: "Example: Collector or Sales Request to bill to a different account no. in attempt of payment even if pro is billing correctly (terms or account) per BOL",
    choices: [
      {
        label: "Continue",
        action: "CORR ACCR - any update made on Terms or Account in attempt of payment when pro is billing correctly per BOL",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply attempt-of-payment correction."
      }
    ]
  },

  change_account_per_loa: {
    text: "Per LOA",
    help: "Use LOA when the account-code change is supported by LOA.",
    choices: [
      {
        label: "Continue",
        action: "Please follow LOA guidelines",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed under LOA process."
      }
    ]
  },

  change_account_pull_abt_intro: {
    text: "To pull ABT",
    help: "Use this when the request is to bill a billing account found to be a Third Party related to shipper or consignee.",
    note: "Per BOL, Terms is Prepaid/Collect and the Request is to bill a billing account which is found to be a Third Party (related to shipper or consignee). Is the Billing account or information noted on the BOL?",
    choices: [
      {
        label: "Yes",
        next: "change_account_pull_abt_bol_confusing",
        icon: "fa-solid fa-circle-check",
        desc: "Billing account or information is noted on the BOL."
      },
      {
        label: "No",
        next: "change_account_pull_abt_fbc_abt",
        icon: "fa-solid fa-circle-xmark",
        desc: "Billing account or information is not noted on the BOL."
      }
    ]
  },

  change_account_pull_abt_bol_confusing: {
    text: "Is the BOL confusing or provide conflicting/incomplete information that can cause confusion to the Biller?",
    help: "Determine if the BOL could have confused the biller.",
    choices: [
      {
        label: "Yes",
        action: "CUSI - used when changing Account Code but should not be taken against the biller since BOL has conflicting information",
        icon: "fa-solid fa-circle-check",
        desc: "The BOL is conflicting or incomplete."
      },
      {
        label: "No",
        action: "ECD - used when changing Account Code since Biller entered an incorrect Code not on the BOL or different from what the BOL states",
        note: "Note: Other CORR codes may be applicable depending on who made the adjustment.\n\nCAE - Vendor Agent error\nRQE - RQA Error\nOPSO/OPSD - Center Error\nSYSM - System Error",
        icon: "fa-solid fa-circle-xmark",
        desc: "The BOL is clear."
      }
    ]
  },

  change_account_pull_abt_fbc_abt: {
    text: "Does the current shipper/consignee code in FBC has ABT that shows the requested account to be billed?",
    help: "Check the existing code first before searching for another shipping account.",
    choices: [
      {
        label: "Yes",
        next: "change_account_pull_abt_related_terms",
        icon: "fa-solid fa-circle-check",
        desc: "Current code already has ABT."
      },
      {
        label: "No",
        next: "change_account_pull_abt_search_another",
        icon: "fa-solid fa-circle-xmark",
        desc: "Need to search for another shipping account with ABT."
      }
    ]
  },

  change_account_pull_abt_related_terms: {
    text: "Is the requested account related to the terms per BOL?",
    help: "If yes, update the shipper/consignee to pull ABT for proper billing.",
    choices: [
      {
        label: "Yes",
        action: "Update the shipper/consignee account to pull ABT for proper billing per BOL\n\nUse ACCR",
        icon: "fa-solid fa-circle-check",
        desc: "Requested account is related to BOL terms."
      },
      {
        label: "No",
        action: "If one of the criteria is not met, use per debtor for better billing. Use ACCR. Send to imaging team for reference",
        icon: "fa-solid fa-circle-xmark",
        desc: "Requested account is not related to BOL terms."
      }
    ]
  },

  change_account_pull_abt_search_another: {
    text: "Look for another shipping account with ABT and update the shipper/consignee code using the account with ABT for proper billing per BOL.",
    help: "Search A&M and verify whether an account number with ABT is available.",
    choices: [
      {
        label: "There is an account number with ABT found in A&M",
        next: "change_account_pull_abt_found_address",
        icon: "fa-solid fa-circle-check",
        desc: "A usable ABT account was found."
      },
      {
        label: "No account number with ABT found in A&M",
        action: "If one of the criteria is not met, use per debtor for better billing. Use ACCR. Send to imaging team for reference",
        icon: "fa-solid fa-circle-xmark",
        desc: "No usable ABT account found."
      }
    ]
  },

  change_account_pull_abt_found_address: {
    text: "Is the mailing address of the requested billing account different from the current debtor?",
    help: "Check the requested account against the current debtor.",
    choices: [
      {
        label: "Yes",
        next: "change_account_pull_abt_found_prau",
        icon: "fa-solid fa-circle-check",
        desc: "Mailing address is different."
      },
      {
        label: "No",
        action: "If one of the criteria is not met, use per debtor for better billing. Use ACCR. Send to imaging team for reference",
        icon: "fa-solid fa-circle-xmark",
        desc: "Criteria not met."
      }
    ]
  },

  change_account_pull_abt_found_prau: {
    text: "Was the PRAU TOTALLY changed?",
    help: "Use this when determining whether the pricing/contract was fully updated or replaced.",
    note: "If yes, this means, pricing/contract was updated/replaced - LS,LCL LT to LS, LC, LT.\n\nNote: This is not applicable if pricing is LD to LS/LCL/T - Use CORR ACCR with no correction fee - Send to imaging team for reference",
    choices: [
      {
        label: "Yes",
        action: "CORR LOA with correction fee",
        icon: "fa-solid fa-circle-check",
        desc: "PRAU was totally changed."
      },
      {
        label: "No",
        action: "If one of the criteria is not met, use per debtor for better billing. Use ACCR. Send to imaging team for reference",
        icon: "fa-solid fa-circle-xmark",
        desc: "PRAU was not totally changed."
      }
    ]
  },

  /* =========================
     CHANGE CLASS / WEIGHT
  ========================= */

  change_class_root: {
    text: "Change of Class/NMFC/Description/Handling Unit per BOL",
    help: "Determine who entered the incorrect class information.",
    choices: [
      {
        label: "Continue",
        next: "change_class_who",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the class/NMFC/description/handling unit flow."
      }
    ]
  },

  change_weight_root: {
    text: "Change of Weight per BOL",
    help: "Follow the same correction responsibility flow used for class-related updates.",
    choices: [
      {
        label: "Continue",
        next: "change_class_who",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the weight correction flow."
      }
    ]
  },

  change_class_who: {
    text: "Who entered the incorrect Class/Weight?",
    help: "Choose the source of the incorrect class/weight entry.",
    choices: [
      {
        label: "Biller - Initial entry of information",
        next: "change_class_biller_confusing",
        icon: "fa-solid fa-user-pen",
        desc: "Biller entered the incorrect information."
      },
      {
        label: "Revenue Services Agent / Revenue Quality Agent",
        next: "change_class_rs_confusing",
        icon: "fa-solid fa-user-gear",
        desc: "Revenue Services or QA entered the incorrect information."
      },
      {
        label: "Origin/Destination Service Center",
        next: "change_class_service_center",
        icon: "fa-solid fa-building",
        desc: "Service center entered the incorrect information."
      }
    ]
  },

  change_class_biller_confusing: {
    text: "Is the BOL confusing or provide conflicting/incomplete information that can cause confusion to the Biller?",
    help: "Determine if the BOL caused the incorrect entry.",
    choices: [
      {
        label: "Yes",
        action: "CUSI",
        icon: "fa-solid fa-circle-check",
        desc: "The BOL is confusing or incomplete."
      },
      {
        label: "No",
        action: "EWPD",
        icon: "fa-solid fa-circle-xmark",
        desc: "The BOL is clear."
      }
    ]
  },

  change_class_rs_confusing: {
    text: "Is the BOL confusing or provide conflicting/incomplete information that can cause confusion to the Agent?",
    help: "Determine if the BOL caused the incorrect entry.",
    choices: [
      {
        label: "Yes",
        action: "CUSI",
        icon: "fa-solid fa-circle-check",
        desc: "The BOL is confusing or incomplete."
      },
      {
        label: "No",
        action: "CAE - Revenue Services Agent\n\nRQE - Revenue Quality Agent",
        icon: "fa-solid fa-circle-xmark",
        desc: "The BOL is clear."
      }
    ]
  },

  change_class_service_center: {
    text: "Which Service Center entered the incorrect Class?",
    help: "Choose the center responsible for the error.",
    choices: [
      {
        label: "Origin Service Center / Others Service Center",
        action: "OPSO",
        icon: "fa-solid fa-location-arrow",
        desc: "Origin or other service center caused the error."
      },
      {
        label: "Destination Service Center",
        action: "OPSD",
        icon: "fa-solid fa-location-dot",
        desc: "Destination service center caused the error."
      }
    ]
  },

  /* =========================
     REFERENCE NO EDIT
  ========================= */

  reference_edit_root: {
    text: "Reference no Edit",
    help: "Check whether the reference number being updated is noted on the BOL.",
    choices: [
      {
        label: "Continue",
        next: "reference_edit_noted",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the reference-number flow."
      }
    ]
  },

  reference_edit_noted: {
    text: "Is the Reference No. that you updating noted on BOL?",
    help: "Determine whether the reference number appears on the BOL.",
    choices: [
      {
        label: "Yes",
        action: "EREF",
        icon: "fa-solid fa-circle-check",
        desc: "Reference number is noted on the BOL."
      },
      {
        label: "No",
        action: "CUSI",
        icon: "fa-solid fa-circle-xmark",
        desc: "Reference number is not noted on the BOL."
      }
    ]
  },

  /* =========================
     ACCESSORIAL UPDATE
  ========================= */

  accessorial_update_root: {
    text: "What update are your trying to make",
    help: "Select the accessorial update scenario.",
    choices: [
      {
        label: "Adding Accessorial that is not requested on the BOL",
        action: "ACC",
        icon: "fa-solid fa-plus",
        desc: "Add an accessorial not requested on the BOL."
      },
      {
        label: "Changing Accessorial from One type to another",
        action: "EADL",
        note: "Ex. OVRL to XLGH, LIFP to LGOP, RESD to LTDD",
        icon: "fa-solid fa-repeat",
        desc: "Change one accessorial type to another."
      },
      {
        label: "Removing of Accessorial since it was not performed",
        action: "NACC",
        icon: "fa-solid fa-minus",
        desc: "Remove accessorial because service was not performed."
      },
      {
        label: "Adding or Removing Accessorial per Request/Instruction on BOL/Billing Mask or Changing the Debtor of Accessorial per Instruction on BOL/Billing Mask",
        action: "EACC",
        icon: "fa-solid fa-file-pen",
        desc: "Instruction-based accessorial update."
      },
      {
        label: "Removing of Accessorial due to Service Center Error",
        next: "accessorial_sc_error",
        icon: "fa-solid fa-building",
        desc: "Service center error caused the charge."
      },
      {
        label: "Removing of Accessorial due to Revenue Services/Revenue Quality Agent",
        next: "accessorial_rs_error",
        icon: "fa-solid fa-user-gear",
        desc: "Revenue Services or QA caused the charge."
      },
      {
        label: "Debtor Change per LOA",
        action: "LOA - change debtor of accessorial per LOA\nNO CORRECTION FEE",
        icon: "fa-solid fa-file-signature",
        desc: "Change debtor of accessorial per LOA."
      }
    ]
  },

  accessorial_sc_error: {
    text: "Removing of Accessorial due to Service Center Error",
    help: "Choose the service center responsible for the error.",
    choices: [
      {
        label: "Origin Center",
        action: "OPSO - If error was made by Origin Center",
        icon: "fa-solid fa-location-arrow",
        desc: "Origin center caused the error."
      },
      {
        label: "Destination Center",
        action: "OPSD - If error was made by Destination Center",
        icon: "fa-solid fa-location-dot",
        desc: "Destination center caused the error."
      }
    ]
  },

  accessorial_rs_error: {
    text: "Removing of Accessorial due to Revenue Services/Revenue Quality Agent",
    help: "Choose who caused the error.",
    choices: [
      {
        label: "Revenue Services Agent",
        action: "CAE - if error was done by Revenue Services Agent",
        icon: "fa-solid fa-user",
        desc: "Revenue Services Agent caused the error."
      },
      {
        label: "Revenue Quality Agent",
        action: "RQE - if error was done by Revenue Quality Agent",
        icon: "fa-solid fa-user-check",
        desc: "Revenue Quality Agent caused the error."
      }
    ]
  },

  /* =========================
     PRICING RELATED UPDATE
  ========================= */

  pricing_related_update: {
    text: "Pricing Related Update",
    help: "Select the pricing-related correction that matches the update being requested.",
    choices: [
      {
        label: "Autorating or Manual Agreement Exception",
        action: "CORR SYSM – Autorating the PRO or applying agreement exception.",
        icon: "fa-solid fa-robot",
        desc: "Autorate the PRO or apply a manual agreement exception."
      },
      {
        label: "Expired Freight Pricing or Surcharge Exception",
        action: "CORR EXPR – Expired freight pricing or surcharge exception.",
        icon: "fa-solid fa-clock-rotate-left",
        desc: "Use when freight pricing or surcharge pricing has expired."
      },
      {
        label: "Rating correction error by Revenue Services",
        action: "CORR PRCE – Rating correction error by Revenue Services employee.",
        icon: "fa-solid fa-calculator",
        desc: "Use when a Revenue Services employee made a rating correction error."
      },
      {
        label: "General protection of invoice",
        action: "CORR PROT – General protection of invoice.",
        icon: "fa-solid fa-shield-halved",
        desc: "Protect the invoice under general protection handling."
      },
      {
        label: "PRO protected per CHT Hierarchy Update",
        action: "CORR PRHA – PRO protected per CHT hierarchy update.",
        icon: "fa-solid fa-sitemap",
        desc: "Use when the PRO is protected because of a CHT hierarchy update."
      },
      {
        label: "Brand new pricing within 10 days from Ship Date",
        action: "CORR SSDY – Brand new pricing and PRO rerated within 10 days from Ship Date.",
        icon: "fa-solid fa-calendar-days",
        desc: "Use when new pricing is applied within 10 days from ship date."
      },
      {
        label: "Brand new pricing after 10 days from Ship Date",
        action: "CORR YEAR – Brand new pricing and PRO rerated after 10 days from Ship Date.",
        icon: "fa-solid fa-calendar-plus",
        desc: "Use when new pricing is applied after 10 days from ship date."
      }
    ]
  }

};
