/* =========================================================
   TPLO GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "tplo-guide",
  title: "TPLO Guide",
  startNode: "start",
  templateCollection: "tplo_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "TPLO Guide",
    help: "Follow the decision flow to correctly assign the PRO based on Bill-To type, account validation, and customer/account mapping rules.",
    choices: [
      {
        label: "Continue",
        next: "fbc_request",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the TPLO decision guide."
      }
    ]
  },

  fbc_request: {
    text: "What is the FBC Request?",
    help: "Determine if the Bill-To will be applied to the Shipper (Prepaid) or Consignee (Collect).",
    choices: [
      {
        label: "Shipper (Prepaid)",
        next: "shipper_spoc",
        icon: "fa-solid fa-truck",
        desc: "Add Bill-To for the Shipper."
      },
      {
        label: "Consignee (Collect)",
        next: "consignee_spoc",
        icon: "fa-solid fa-building",
        desc: "Add Bill-To for the Consignee."
      }
    ]
  },

  /* ================= SHIPPER (PREPAID) ================= */

  shipper_spoc: {
    text: "Is it an SPOC account?",
    choices: [
      {
        label: "Yes",
        next: "shipper_spoc_move",
        icon: "fa-solid fa-circle-check",
        desc: "Move to SPOC queue."
      },
      {
        label: "No",
        next: "shipper_update_debtor",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to debtor update check."
      }
    ]
  },

  shipper_spoc_move: {
    text: "Move the PRO to:\n• Grainger — RQGR\n• CHRLTL — RQCH\n• Echo Global Logistics — RQEG\n• Online — RQUL\n• Uber Freight — RQUF\n• Sealed Air — RQSA",
    choices: []
  },

  shipper_update_debtor: {
    text: "Is the request to update the debtor per the BOL to FXF account 91774785?",
    choices: [
      {
        label: "Yes",
        next: "shipper_pat5",
        icon: "fa-solid fa-circle-check",
        desc: "Move to PAT5."
      },
      {
        label: "No",
        next: "shipper_lm",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to LM check."
      }
    ]
  },

  shipper_pat5: {
    text: "Move the PRO to PAT5",
    choices: []
  },

  shipper_lm: {
    text: "Is it for LM (Lockheed Martin)?",
    choices: [
      {
        label: "Yes",
        next: "shipper_pat7",
        icon: "fa-solid fa-circle-check",
        desc: "Move to PAT7."
      },
      {
        label: "No",
        next: "shipper_parker",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to Parker check."
      }
    ]
  },

  shipper_pat7: {
    text: "Move the PRO to PAT7",
    choices: []
  },

  shipper_parker: {
    text: "Is it for Parker Hannifin?",
    choices: [
      {
        label: "Yes",
        next: "shipper_pars",
        icon: "fa-solid fa-circle-check",
        desc: "Move to PARS."
      },
      {
        label: "No",
        next: "shipper_baker",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to Baker Hughes check."
      }
    ]
  },

  shipper_pars: {
    text: "Move the PRO to PARS",
    choices: []
  },

  shipper_baker: {
    text: "Is it for Baker Hughes, BHGE?",
    choices: [
      {
        label: "Yes",
        next: "shipper_pcm",
        icon: "fa-solid fa-circle-check",
        desc: "Move to PCM."
      },
      {
        label: "No",
        next: "shipper_hd",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to HD Supply check."
      }
    ]
  },

  shipper_pcm: {
    text: "Move the PRO to PCM",
    choices: []
  },

  shipper_hd: {
    text: "Is it for HD SUPPLY, WHITE CAP?",
    choices: [
      {
        label: "Yes",
        next: "shipper_irt1",
        icon: "fa-solid fa-circle-check",
        desc: "Move to IRT1."
      },
      {
        label: "No",
        next: "shipper_costco",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to Costco check."
      }
    ]
  },

  shipper_irt1: {
    text: "Move the PRO to IRT1",
    choices: []
  },

  shipper_costco: {
    text: "Is it for COSTCO?",
    choices: [
      {
        label: "Yes",
        next: "shipper_keet",
        icon: "fa-solid fa-circle-check",
        desc: "Move to KEET."
      },
      {
        label: "No",
        next: "shipper_gov_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to government check."
      }
    ]
  },

  shipper_keet: {
    text: "Move the PRO to KEET",
    choices: []
  },

  shipper_gov_check: {
    text: "Is it for ALL VA, SCHOOLS, UNIVERSITIES, USPS, POST OFFICE, GOV DEPTS, CITY OF, COUNTY OF, MUSEUM, WWTP, L3?",
    choices: [
      {
        label: "Yes",
        next: "shipper_govh",
        icon: "fa-solid fa-circle-check",
        desc: "Move to GOVH."
      },
      {
        label: "No",
        next: "shipper_account_relation",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to account relation check."
      }
    ]
  },

  shipper_govh: {
    text: "Move the PRO to GOVH",
    choices: []
  },

  shipper_account_relation: {
    text: "Check the account provided, is it related to the Shipper?",
    choices: [
      {
        label: "Yes",
        next: "shipper_address_match",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed to address match."
      },
      {
        label: "No",
        next: "shipper_lookup_account",
        icon: "fa-solid fa-circle-xmark",
        desc: "Search for a billing account."
      }
    ]
  },

  shipper_address_match: {
    text: "Does the Shipper's address match the Billing account's address?",
    choices: [
      {
        label: "Yes",
        next: "shipper_autorate",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed to autorate."
      },
      {
        label: "No",
        next: "shipper_tukn",
        icon: "fa-solid fa-circle-xmark",
        desc: "Move to TUKN."
      }
    ]
  },

  shipper_tukn: {
    text: "Move the PRO to TUKN",
    choices: []
  },

  shipper_autorate: {
    text: "Proceed on billing the account. Autorate. Did the amount increase or decrease by 50%?",
    choices: [
      {
        label: "Yes",
        next: "shipper_tpcl",
        icon: "fa-solid fa-circle-check",
        desc: "Move to TPCL."
      },
      {
        label: "No",
        next: "shipper_post_invoice",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to post invoice."
      }
    ]
  },

  shipper_tpcl: {
    text: "Move the PRO to TPCL",
    choices: []
  },

  shipper_post_invoice: {
    text: "Proceed on posting the invoice. Use CORR ACCR. Add detailed comments.",
    choices: []
  },

  shipper_lookup_account: {
    text: "Look for a Billing account related to the Shipper. Were you able to pull one?",
    choices: [
      {
        label: "Yes",
        next: "shipper_proceed_account",
        icon: "fa-solid fa-circle-check",
        desc: "Use the found account."
      },
      {
        label: "No",
        next: "shipper_tukn",
        icon: "fa-solid fa-circle-xmark",
        desc: "Move to TUKN."
      }
    ]
  },

  shipper_proceed_account: {
    text: "Proceed on billing the account pulled up. Use CORR ACCR. Add detailed comments.",
    choices: []
  },

  /* ================= CONSIGNEE (COLLECT) ================= */

  consignee_spoc: {
    text: "Is it an SPOC account?",
    choices: [
      {
        label: "Yes",
        next: "consignee_spoc_move",
        icon: "fa-solid fa-circle-check",
        desc: "Move to SPOC queue."
      },
      {
        label: "No",
        next: "consignee_update_debtor",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to debtor update check."
      }
    ]
  },

  consignee_spoc_move: {
    text: "Move the PRO to:\n• Grainger — RQGR\n• CHRLTL — RQCH\n• Echo Global Logistics — RQEG\n• Online — RQUL\n• Uber Freight — RQUF\n• Sealed Air — RQSA",
    choices: []
  },

  consignee_update_debtor: {
    text: "Is the request to update the debtor per the BOL to FXF account 91774785?",
    choices: [
      {
        label: "Yes",
        next: "consignee_pat5",
        icon: "fa-solid fa-circle-check",
        desc: "Move to PAT5."
      },
      {
        label: "No",
        next: "consignee_lm",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to LM check."
      }
    ]
  },

  consignee_pat5: {
    text: "Move the PRO to PAT5",
    choices: []
  },

  consignee_lm: {
    text: "Is it for LM (Lockheed Martin)?",
    choices: [
      {
        label: "Yes",
        next: "consignee_pat7",
        icon: "fa-solid fa-circle-check",
        desc: "Move to PAT7."
      },
      {
        label: "No",
        next: "consignee_parker",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to Parker check."
      }
    ]
  },

  consignee_pat7: {
    text: "Move the PRO to PAT7",
    choices: []
  },

  consignee_parker: {
    text: "Is it for Parker Hannifin?",
    choices: [
      {
        label: "Yes",
        next: "consignee_pars",
        icon: "fa-solid fa-circle-check",
        desc: "Move to PARS."
      },
      {
        label: "No",
        next: "consignee_baker",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to Baker Hughes check."
      }
    ]
  },

  consignee_pars: {
    text: "Move the PRO to PARS",
    choices: []
  },

  consignee_baker: {
    text: "Is it for Baker Hughes, BHGE?",
    choices: [
      {
        label: "Yes",
        next: "consignee_pcm",
        icon: "fa-solid fa-circle-check",
        desc: "Move to PCM."
      },
      {
        label: "No",
        next: "consignee_hd",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to HD Supply check."
      }
    ]
  },

  consignee_pcm: {
    text: "Move the PRO to PCM",
    choices: []
  },

  consignee_hd: {
    text: "Is it for HD SUPPLY, WHITE CAP?",
    choices: [
      {
        label: "Yes",
        next: "consignee_irt1",
        icon: "fa-solid fa-circle-check",
        desc: "Move to IRT1."
      },
      {
        label: "No",
        next: "consignee_costco",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to Costco check."
      }
    ]
  },

  consignee_irt1: {
    text: "Move the PRO to IRT1",
    choices: []
  },

  consignee_costco: {
    text: "Is it for COSTCO?",
    choices: [
      {
        label: "Yes",
        next: "consignee_keet",
        icon: "fa-solid fa-circle-check",
        desc: "Move to KEET."
      },
      {
        label: "No",
        next: "consignee_gov_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to government check."
      }
    ]
  },

  consignee_keet: {
    text: "Move the PRO to KEET",
    choices: []
  },

  consignee_gov_check: {
    text: "Is it for ALL VA, SCHOOLS, UNIVERSITIES, USPS, POST OFFICE, GOV DEPTS, CITY OF, COUNTY OF, MUSEUM, WWTP, L3?",
    choices: [
      {
        label: "Yes",
        next: "consignee_govh",
        icon: "fa-solid fa-circle-check",
        desc: "Move to GOVH."
      },
      {
        label: "No",
        next: "consignee_account_relation",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to account relation check."
      }
    ]
  },

  consignee_govh: {
    text: "Move the PRO to GOVH",
    choices: []
  },

  consignee_account_relation: {
    text: "Check the account provided, is it related to the Consignee?",
    choices: [
      {
        label: "Yes",
        next: "consignee_address_match",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed to address match."
      },
      {
        label: "No",
        next: "consignee_lookup_account",
        icon: "fa-solid fa-circle-xmark",
        desc: "Search for a billing account."
      }
    ]
  },

  consignee_address_match: {
    text: "Does the Consignee's address match the Billing account's address?",
    choices: [
      {
        label: "Yes",
        next: "consignee_autorate",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed to autorate."
      },
      {
        label: "No",
        next: "consignee_tukn",
        icon: "fa-solid fa-circle-xmark",
        desc: "Move to TUKN."
      }
    ]
  },

  consignee_tukn: {
    text: "Move the PRO to TUKN",
    choices: []
  },

  consignee_autorate: {
    text: "Proceed on billing the account. Autorate. Did the amount increase or decrease by 50%?",
    choices: [
      {
        label: "Yes",
        next: "consignee_tpcl",
        icon: "fa-solid fa-circle-check",
        desc: "Move to TPCL."
      },
      {
        label: "No",
        next: "consignee_post_invoice",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to post invoice."
      }
    ]
  },

  consignee_tpcl: {
    text: "Move the PRO to TPCL",
    choices: []
  },

  consignee_post_invoice: {
    text: "Proceed on posting the invoice. Use CORR ACCR. Add detailed comments.",
    choices: []
  },

  consignee_lookup_account: {
    text: "Look for a Billing account related to the Consignee. Were you able to pull one?",
    choices: [
      {
        label: "Yes",
        next: "consignee_proceed_account",
        icon: "fa-solid fa-circle-check",
        desc: "Use the found account."
      },
      {
        label: "No",
        next: "consignee_tukn",
        icon: "fa-solid fa-circle-xmark",
        desc: "Move to TUKN."
      }
    ]
  },

  consignee_proceed_account: {
    text: "Proceed on billing the account pulled up. Use CORR ACCR. Add detailed comments.",
    choices: []
  }

};
