/* =========================================================
   PAUD-FPAY GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "paud-fpay-guide",
  title: "PAUD-FPAY Guide",
  startNode: "start",
  templateCollection: "paud_fpay_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "PAUD-FPAY Guide",
    help: "Follow the decision flow to determine the TRUE DEBTOR when a Freight Pay and Audit company is involved.",
    note: "Most freight pay and audit companies require that the billing show their client in care of the freight pay and audit company. Example: Cass Logistics requires their customer Emerson % Cass instead of billing just Cass.",
    choices: [
      {
        label: "Continue",
        next: "fpay_intro",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the FPAY debtor determination process."
      }
    ]
  },

  fpay_intro: {
    text: "The purpose of this queue is to determine the TRUE DEBTOR.\n\nMost freight pay and audit companies require that the billing show their client in care of the freight pay and audit company.\n\nExample: Cass Logistics requires their customer Emerson % Cass instead of billing just Cass.",
    help: "Read the introduction, then click START REVIEW to begin the decision flow.",
    choices: [
      {
        label: "START REVIEW",
        next: "root",
        icon: "fa-solid fa-play",
        desc: "Begin the FPAY debtor determination process."
      }
    ]
  },

  root: {
    text: "Is there a BOL imaged on the PRO?",
    choices: [
      {
        label: "YES",
        next: "govt",
        icon: "fa-solid fa-check-circle",
        desc: "BOL is present."
      },
      {
        label: "NO",
        next: "no_bol",
        icon: "fa-solid fa-times-circle",
        desc: "BOL missing."
      }
    ]
  },

  no_bol: {
    text: "DO NOT RELEASE the PRO from FPAY. Leave in queue until BOL is on image. True debtor requires BOL review.",
    choices: []
  },

  govt: {
    text: "Is the PRO a Government Shipment?",
    choices: [
      {
        label: "YES",
        next: "govt_move",
        icon: "fa-solid fa-building-flag",
        desc: "Government shipment."
      },
      {
        label: "NO",
        next: "intl",
        icon: "fa-solid fa-globe",
        desc: "Non‑government."
      }
    ]
  },

  govt_move: {
    text: "Move to PAUD GOVH – GOVT ACCT. Review to update BT code with CUST % FPAY.",
    choices: []
  },

  intl: {
    text: "Is this an International Shipment? (MX, AK, VI, PR)",
    choices: [
      {
        label: "YES",
        next: "intl_move",
        icon: "fa-solid fa-plane",
        desc: "International."
      },
      {
        label: "NO",
        next: "tl",
        icon: "fa-solid fa-truck",
        desc: "Domestic."
      }
    ]
  },

  intl_move: {
    text: "Move PRO to its respective international queue.",
    choices: []
  },

  tl: {
    text: "Does the PRO have Truckload keywords? (CAPL, CCD, TLX, TLS, CONT, EXCL)",
    choices: [
      {
        label: "YES",
        next: "no_autorate",
        icon: "fa-solid fa-truck-fast",
        desc: "Truckload keywords found."
      },
      {
        label: "NO",
        next: "autorate",
        icon: "fa-solid fa-rotate-right",
        desc: "No truckload keywords."
      }
    ]
  },

  no_autorate: {
    text: "Proceed with correction but DO NOT AUTORATE.",
    choices: [
      {
        label: "CONTINUE",
        next: "review_bol",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue without autorating."
      }
    ]
  },

  autorate: {
    text: "Proceed with review and AUTORATE if correction is required.",
    choices: [
      {
        label: "CONTINUE",
        next: "review_bol",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue and autorate if needed."
      }
    ]
  },

  review_bol: {
    text: "Review the BOL to confirm the correct debtor per BOL.",
    choices: [
      {
        label: "CONTINUE",
        next: "fpay_correct_check",
        icon: "fa-solid fa-file-lines",
        desc: "Proceed to debtor verification."
      }
    ]
  },

  fpay_correct_check: {
    text: "Is the PRO billing correctly to an FPAY?",
    choices: [
      {
        label: "YES",
        next: "billing_fpay_direct",
        icon: "fa-solid fa-check-circle",
        desc: "Billing to FPAY correctly."
      },
      {
        label: "NO",
        next: "not_fpay_debtor",
        icon: "fa-solid fa-times-circle",
        desc: "Not billing to correct FPAY."
      }
    ]
  },

  not_fpay_debtor: {
    text: "Correct debtor is not an FPAY and was not billed. Search for the account of the correct debtor per BOL and bill through the regular process.",
    choices: []
  },

  billing_fpay_direct: {
    text: "Is the PRO billing the FPAY company directly?",
    choices: [
      {
        label: "YES",
        next: "direct_fpay_bol_check",
        icon: "fa-solid fa-building",
        desc: "Billing FPAY directly."
      },
      {
        label: "NO",
        next: "percent_fpay_check",
        icon: "fa-solid fa-percent",
        desc: "Billing Company % FPAY."
      }
    ]
  },

  percent_fpay_check: {
    text: "If PRO is billing Company % FPAY, is it the correct company in % FPAY per BOL?",
    choices: [
      {
        label: "YES",
        next: "proceed_post_bill",
        icon: "fa-solid fa-check-circle",
        desc: "Correct % FPAY."
      },
      {
        label: "NO",
        next: "account_search_process",
        icon: "fa-solid fa-magnifying-glass",
        desc: "Incorrect – need account search."
      }
    ]
  },

  direct_fpay_bol_check: {
    text: "If PRO is billing FPAY company directly, is it the correct debtor per BOL?",
    choices: [
      {
        label: "YES",
        next: "bol_states_only_fpay",
        icon: "fa-solid fa-check-circle",
        desc: "Correct direct FPAY."
      },
      {
        label: "NO",
        next: "bol_states_percent",
        icon: "fa-solid fa-arrow-right",
        desc: "BOL states Company % FPAY instead."
      }
    ]
  },

  bol_states_percent: {
    text: "BOL states Company % FPAY.",
    choices: [
      {
        label: "CONTINUE",
        next: "percent_fpay_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to % FPAY check."
      }
    ]
  },

  bol_states_only_fpay: {
    text: "BOL states only the FPAY company.",
    choices: [
      {
        label: "CONTINUE",
        next: "account_search_process",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to account search."
      }
    ]
  },

  proceed_post_bill: {
    text: "Proceed and post the bill.\n\nComment: VS-FPAY-AUDT + Specific Correction Comment (VS-FPAY-AUDT + PRO IS BILLING THE CORRECT COMPANY % FPAY)\nCorrection Code: VRFY",
    choices: []
  },

  account_search_process: {
    text: "Is the FPAY related to the Shipper? (Same name, CAC, Google confirmed)",
    choices: [
      {
        label: "YES",
        next: "shipper_is_correct_debtor",
        icon: "fa-solid fa-truck",
        desc: "Related to shipper."
      },
      {
        label: "NO",
        next: "fpay_consignee_check",
        icon: "fa-solid fa-arrow-down",
        desc: "Check consignee relation."
      }
    ]
  },

  shipper_is_correct_debtor: {
    text: "Is the correct debtor (Shipper % FPAY) the ABT of the Shipper?",
    choices: [
      {
        label: "YES",
        next: "bill_shipper_prepaid",
        icon: "fa-solid fa-check-circle",
        desc: "Shipper % FPAY is ABT."
      },
      {
        label: "NO",
        next: "different_shipper_abt_check",
        icon: "fa-solid fa-magnifying-glass",
        desc: "Check different shipper account."
      }
    ]
  },

  bill_shipper_prepaid: {
    text: "Proceed and bill the Shipper. Change terms to PREPAID to pull its ABT.",
    choices: []
  },

  different_shipper_abt_check: {
    text: "Is there a different Shipper account that has Shipper % FPAY as its ABT?",
    choices: [
      {
        label: "YES",
        next: "update_shipper_code",
        icon: "fa-solid fa-check-circle",
        desc: "Found alternate account."
      },
      {
        label: "NO",
        next: "bill_company_fpay_as_3p",
        icon: "fa-solid fa-truck-ramp-box",
        desc: "No alternate – bill as 3P."
      }
    ]
  },

  update_shipper_code: {
    text: "Use the account found and update the Shipper code to pull the correct BT account as ABT.",
    choices: []
  },

  bill_company_fpay_as_3p: {
    text: "Bill the PRO PREPAID since Company % FPAY is related to the shipper. Then bill Company % FPAY as 3P.",
    choices: []
  },

  fpay_consignee_check: {
    text: "Is the FPAY related to the Consignee? (Same name, CAC, Google confirmed)",
    choices: [
      {
        label: "YES",
        next: "consignee_is_correct_debtor",
        icon: "fa-solid fa-check-circle",
        desc: "Related to consignee."
      },
      {
        label: "NO",
        next: "shipment_history_check",
        icon: "fa-solid fa-clock-rotate-left",
        desc: "Check shipment history."
      }
    ]
  },

  consignee_is_correct_debtor: {
    text: "Is the correct debtor (Consignee % FPAY) the ABT of the Consignee?",
    choices: [
      {
        label: "YES",
        next: "bill_shipper_prepaid",
        icon: "fa-solid fa-check-circle",
        desc: "Consignee % FPAY is ABT."
      },
      {
        label: "NO",
        next: "different_shipper_abt_check",
        icon: "fa-solid fa-magnifying-glass",
        desc: "Check different shipper account."
      }
    ]
  },

  shipment_history_check: {
    text: "Check shipment history of the Shipper and Consignee to see if a Company % FPAY usually pays invoices.",
    choices: [
      {
        label: "FOUND",
        next: "rebill_common_bt",
        icon: "fa-solid fa-check-circle",
        desc: "Common BT found."
      },
      {
        label: "NOT FOUND",
        next: "check_direct_fpay_list",
        icon: "fa-solid fa-list",
        desc: "No common BT – check direct list."
      }
    ]
  },

  rebill_common_bt: {
    text: "A common BT account exists. Proceed with rebilling this account in an attempt of payment.",
    choices: []
  },

  check_direct_fpay_list: {
    text: "If no Company % FPAY was found, check if the PRO is listed under FPAY companies that can be billed directly.",
    choices: [
      {
        label: "FPAY ON LIST",
        next: "rebill_fpay_direct",
        icon: "fa-solid fa-check-circle",
        desc: "On approved list."
      },
      {
        label: "NOT ON LIST",
        next: "rate_quote_check",
        icon: "fa-solid fa-file-invoice-dollar",
        desc: "Not on list – check rate quote."
      }
    ]
  },

  rebill_fpay_direct: {
    text: "FPAY is on the approved list. Proceed and rebill the FPAY company directly.",
    choices: []
  },

  rate_quote_check: {
    text: "Is there a Rate Quote on the BOL that shows the correct debtor?",
    choices: [
      {
        label: "YES",
        next: "bill_per_rate_quote",
        icon: "fa-solid fa-check-circle",
        desc: "Rate quote available."
      },
      {
        label: "NO",
        next: "leave_bill_as_is_vrfy",
        icon: "fa-solid fa-check",
        desc: "No rate quote – leave as is."
      }
    ]
  },

  bill_per_rate_quote: {
    text: "Bill the PRO to the debtor per Rate Quote. Do NOT process as RVSL.",
    choices: []
  },

  leave_bill_as_is_vrfy: {
    text: "Leave the bill as is.\n\nUse CORR VRFY to confirm billing is correct.\nComment: Billing correctly to (Company)/BT per BOL – No better code found.",
    choices: []
  }

};
