/* =========================================================
   SEARCHING FOR ACCOUNT GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "searching-account-guide",
  title: "Searching for Account Guide",
  startNode: "start",
  templateCollection: "searching_account_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Searching for Customer's Account - General Guide",
    help: "Use this guide to search, review, and validate customer accounts in AEM, ECIS, and related account tools.",
    note: "Always review the account type, billing relationship, ABT/CAC status, invoice group, account color, pricing, and payment history before selecting or updating an account.",
    choices: [
      {
        label: "Continue",
        next: "dual_intro",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the account search decision flow."
      }
    ]
  },

  dual_intro: {
    text: "Is the account a dual account, meaning both Parcel and Freight?",
    help: "Select Yes if the provided account is a dual Parcel/Freight account such as CACS or CACFUS.",
    choices: [
      {
        label: "Yes",
        next: "dual_yes_flow",
        icon: "fa-solid fa-circle-check",
        desc: "Customer provided a dual Parcel/Freight account."
      },
      {
        label: "No",
        next: "dual_search_start",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed with normal Freight account search."
      }
    ]
  },

  /* ================= FREIGHT ACCOUNT SEARCH ================= */

  dual_search_start: {
    text: "Open Citrix.",
    help: "Use Citrix to access the account search tools.",
    noteHtml: `<a href="https://fdxworkspace.fedex.com/Citrix/StoreWeb/" target="_blank" class="guide-link">Open Citrix</a>`,
    choices: [
      {
        label: "Continue",
        next: "dual_open_aem",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after opening Citrix."
      }
    ]
  },

  dual_open_aem: {
    text: "Open Account Establishment and Maintenance.",
    help: "This is the tool used to search and review customer account details.",
    choices: [
      {
        label: "Continue",
        next: "dual_customer_search",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after opening AEM."
      }
    ]
  },

  dual_customer_search: {
    text: "Click Customer Account Search.",
    choices: [
      {
        label: "Continue",
        next: "dual_search_minimal",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to search using minimal information."
      }
    ]
  },

  dual_search_minimal: {
    text: "Search using minimal customer information.",
    help: "Use the first 3 to 4 characters of the address, state, ZIP, or city to widen the search results.",
    choices: [
      {
        label: "Continue",
        next: "dual_results_found",
        icon: "fa-solid fa-magnifying-glass",
        desc: "Proceed after running the account search."
      }
    ]
  },

  dual_results_found: {
    text: "Did search results appear?",
    help: "Confirm whether AEM returned possible account matches.",
    choices: [
      {
        label: "Yes",
        next: "dual_third_party_check",
        icon: "fa-solid fa-circle-check",
        desc: "Search results appeared."
      },
      {
        label: "No",
        next: "final_dual_adjust_date",
        icon: "fa-solid fa-circle-xmark",
        desc: "No search results appeared."
      }
    ]
  },

  final_dual_adjust_date: {
    text: "Adjust the search date range, then search again. AEM only shows the last 6 months by default.",
    choices: []
  },

  dual_third_party_check: {
    text: "Is there a 3rd Party or Bill-To involved?",
    help: "Check whether the account search involves a third-party billing relationship.",
    choices: [
      {
        label: "Yes",
        next: "dual_review_codes",
        icon: "fa-solid fa-building-user",
        desc: "A 3rd Party or Bill-To is involved."
      },
      {
        label: "No",
        next: "dual_select_best",
        icon: "fa-solid fa-user-check",
        desc: "No 3rd Party or Bill-To is involved."
      }
    ]
  },

  dual_select_best: {
    text: "Select the best account based on account attributes.",
    help: "Review pricing, invoice group, payment history, account type, and account status before selecting an account.",
    choices: [
      {
        label: "Continue",
        next: "dual_review_results",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to review the selected account."
      }
    ]
  },

  dual_review_codes: {
    text: "Review existing Shipper and Consignee codes for ABT relationship.",
    help: "Check whether the existing Shipper or Consignee account has an ABT that matches the 3rd Party.",
    choices: [
      {
        label: "Continue",
        next: "dual_abt_match",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to ABT relationship check."
      }
    ]
  },

  dual_abt_match: {
    text: "Does the Shipper or Consignee have an ABT matching the 3rd Party?",
    choices: [
      {
        label: "Yes",
        next: "final_dual_refresh_terms",
        icon: "fa-solid fa-circle-check",
        desc: "ABT matches the 3rd Party."
      },
      {
        label: "No",
        next: "dual_search_shipper",
        icon: "fa-solid fa-circle-xmark",
        desc: "No matching ABT was found."
      }
    ]
  },

  final_dual_refresh_terms: {
    text: "Update or refresh the terms to pull up the ABT.",
    choices: []
  },

  dual_search_shipper: {
    text: "Search using the 3rd Party name and Shipper address.",
    help: "Use this search when no matching ABT is found on the current Shipper or Consignee code.",
    choices: [
      {
        label: "Continue",
        next: "dual_better_shipper",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after searching for a better Shipper code."
      }
    ]
  },

  dual_better_shipper: {
    text: "Was a better Shipper code found with the correct ABT?",
    choices: [
      {
        label: "Yes",
        next: "final_dual_update_sc",
        icon: "fa-solid fa-circle-check",
        desc: "A better Shipper code with correct ABT was found."
      },
      {
        label: "No",
        next: "dual_search_consignee",
        icon: "fa-solid fa-circle-xmark",
        desc: "No better Shipper code was found."
      }
    ]
  },

  final_dual_update_sc: {
    text: "Update the Shipper Code to pull the correct ABT.",
    choices: []
  },

  dual_search_consignee: {
    text: "Search using the 3rd Party name and Consignee address.",
    choices: [
      {
        label: "Continue",
        next: "dual_better_consignee",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after searching for a better Consignee code."
      }
    ]
  },

  dual_better_consignee: {
    text: "Was a better Consignee code found with the correct ABT?",
    choices: [
      {
        label: "Yes",
        next: "final_dual_update_cc",
        icon: "fa-solid fa-circle-check",
        desc: "A better Consignee code with correct ABT was found."
      },
      {
        label: "No",
        next: "dual_check_3pl",
        icon: "fa-solid fa-circle-xmark",
        desc: "No better Consignee code was found."
      }
    ]
  },

  final_dual_update_cc: {
    text: "Update the Consignee Code to pull the correct ABT.",
    choices: []
  },

  dual_check_3pl: {
    text: "Does the 3rd Party look like a 3PL or FPA?",
    help: "Check if the 3rd Party appears to be a logistics provider, freight payment agency, or similar billing party.",
    choices: [
      {
        label: "Yes",
        next: "dual_search_3pl",
        icon: "fa-solid fa-circle-check",
        desc: "The 3rd Party appears to be 3PL or FPA."
      },
      {
        label: "No",
        next: "dual_true_third",
        icon: "fa-solid fa-circle-xmark",
        desc: "The 3rd Party does not appear to be 3PL or FPA."
      }
    ]
  },

  dual_search_3pl: {
    text: "Search using only the 3PL address.",
    help: "Use the 3PL address to check if multiple companies are listed in care of the same party.",
    choices: [
      {
        label: "Continue",
        next: "dual_multiple_companies",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after searching by 3PL address."
      }
    ]
  },

  dual_multiple_companies: {
    text: "Are there multiple companies in care of the 3PL?",
    choices: [
      {
        label: "Yes",
        next: "dual_confirm_3pl",
        icon: "fa-solid fa-circle-check",
        desc: "Multiple companies are in care of the 3PL."
      },
      {
        label: "No",
        next: "dual_true_third",
        icon: "fa-solid fa-circle-xmark",
        desc: "No multiple company relationship was found."
      }
    ]
  },

  dual_confirm_3pl: {
    text: "Confirm the 3PL relationship.",
    help: "Use the search result to confirm that the 3rd Party is acting as a 3PL or FPA.",
    choices: [
      {
        label: "Continue",
        next: "dual_determine_terms",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to determine billing terms."
      }
    ]
  },

  dual_true_third: {
    text: "Treat the account as a True 3rd Party.",
    choices: [
      {
        label: "Continue",
        next: "dual_determine_terms",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to determine billing terms."
      }
    ]
  },

  dual_determine_terms: {
    text: "Determine the correct billing terms.",
    help: "Use the billing relationship to determine the correct terms.",
    noteHtml: `<ul><li>If related to Shipper, use <b>Prepaid</b>.</li><li>If related to Consignee, use <b>Collect</b>.</li><li>If unrelated to both, use <b>Prepaid</b>.</li></ul>`,
    choices: [
      {
        label: "Continue",
        next: "dual_review_results",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to review the account results."
      }
    ]
  },

  dual_review_results: {
    text: "Review the account results.",
    help: "Review the account information carefully before selecting the account.",
    choices: [
      {
        label: "Continue",
        next: "dual_check_type",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to check the account type."
      }
    ]
  },

  dual_check_type: {
    text: "Check the account type.",
    help: "S means Shipping account. B means Billing account.",
    choices: [
      {
        label: "Continue",
        next: "dual_check_color",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to check the account color."
      }
    ]
  },

  dual_check_color: {
    text: "Check the account color.",
    help: "Use the account color to help determine which account is preferred.",
    choices: [
      {
        label: "TEAL",
        next: "dual_open_profile",
        icon: "fa-solid fa-star",
        desc: "Preferred account because it has pricing."
      },
      {
        label: "WHITE",
        next: "dual_open_profile",
        icon: "fa-regular fa-circle",
        desc: "No pricing. Use only if needed."
      }
    ]
  },

  dual_open_profile: {
    text: "Open the Account Profile.",
    help: "Review the profile to validate account quality and billing setup.",
    choices: [
      {
        label: "Continue",
        next: "dual_abt_cac",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to ABT and CAC validation."
      }
    ]
  },

  dual_abt_cac: {
    text: "Does the account have both ABT and CAC?",
    choices: [
      {
        label: "Yes",
        next: "final_dual_good_account",
        icon: "fa-solid fa-circle-check",
        desc: "Account has ABT and CAC."
      },
      {
        label: "No",
        next: "dual_check_invoice",
        icon: "fa-solid fa-circle-xmark",
        desc: "Account does not have both ABT and CAC."
      }
    ]
  },

  final_dual_good_account: {
    text: "Good account. You may proceed with using this account, if applicable.",
    choices: []
  },

  dual_check_invoice: {
    text: "Check the Invoice Profile.",
    help: "Review the invoice group before deciding if the account should be used.",
    choices: [
      {
        label: "Continue",
        next: "dual_invoice_group",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to validate the invoice group."
      }
    ]
  },

  dual_invoice_group: {
    text: "Is the Invoice Group valid?",
    help: "REGI is considered a good account. UEST or PSTL should be avoided if possible.",
    choices: [
      {
        label: "Yes - REGI / Good Account",
        next: "final_dual_good_account",
        icon: "fa-solid fa-circle-check",
        desc: "Invoice Group is valid."
      },
      {
        label: "No - UEST / PSTL",
        next: "final_dual_avoid_account",
        icon: "fa-solid fa-circle-xmark",
        desc: "Invoice Group should be avoided."
      }
    ]
  },

  final_dual_avoid_account: {
    text: "UEST or PSTL account. Avoid this account if possible.",
    choices: []
  },

  /* ================= DUAL PARCEL/FREIGHT ACCOUNT FLOW ================= */

  dual_yes_flow: {
    text: "Customer provided an account that is CACS or CACFUS.",
    help: "Use this path when the account is a dual Parcel/Freight account.",
    choices: [
      {
        label: "Continue",
        next: "dual_need_verification",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to verification check."
      }
    ]
  },

  dual_need_verification: {
    text: "Do you need an alternate mailing address or account verification?",
    help: "Use ECIS when Freight account information needs to be compared with Express information.",
    choices: [
      {
        label: "Yes",
        next: "dual_open_ecis",
        icon: "fa-solid fa-circle-check",
        desc: "Verification is needed."
      },
      {
        label: "No",
        next: "final_dual_continue_normal",
        icon: "fa-solid fa-circle-xmark",
        desc: "No alternate mailing address or verification is needed."
      }
    ]
  },

  final_dual_continue_normal: {
    text: "Continue the normal process for handling the account provided by the customer.",
    choices: []
  },

  dual_open_ecis: {
    text: "Open ECIS.",
    help: "Use ECIS to review Express account information for dual accounts.",
    noteHtml: `<a href="https://ecis.prod.cloud.fedex.com/ecis/" target="_blank" class="guide-link">Open ECIS</a>`,
    choices: [
      {
        label: "Continue",
        next: "dual_ecis_login",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after opening ECIS."
      }
    ]
  },

  dual_ecis_login: {
    text: "Log in using your Employee ID and LDAP password.",
    choices: [
      {
        label: "Continue",
        next: "dual_ecis_home",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after logging in."
      }
    ]
  },

  dual_ecis_home: {
    text: "Go to the ECIS Home Page.",
    choices: [
      {
        label: "Continue",
        next: "dual_enter_account",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to quick search."
      }
    ]
  },

  dual_enter_account: {
    text: "Enter the account number in Quick Search.",
    choices: [
      {
        label: "Continue",
        next: "dual_account_info",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after searching the account."
      }
    ]
  },

  dual_account_info: {
    text: "Review the displayed account information.",
    choices: [
      {
        label: "Continue",
        next: "dual_compare_express",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to compare Express information."
      }
    ]
  },

  dual_compare_express: {
    text: "Compare the Express information, including name and billing address.",
    help: "Compare ECIS Express information against the Freight account information in ACCOPS.",
    choices: [
      {
        label: "Continue",
        next: "dual_express_diff",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after comparing the account information."
      }
    ]
  },

  dual_express_diff: {
    text: "Does the Express information differ from the Freight account in ACCOPS?",
    choices: [
      {
        label: "Yes",
        next: "dual_search_freight",
        icon: "fa-solid fa-circle-check",
        desc: "Express information is different."
      },
      {
        label: "No",
        next: "final_dual_use_existing",
        icon: "fa-solid fa-circle-xmark",
        desc: "Express and Freight information match."
      }
    ]
  },

  final_dual_use_existing: {
    text: "Use the existing Freight account information.",
    choices: []
  },

  dual_search_freight: {
    text: "Use the name or address from ECIS to search for a Freight account in AEM.",
    choices: [
      {
        label: "Continue",
        next: "dual_identify_relationship",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after searching for the Freight account."
      }
    ]
  },

  dual_identify_relationship: {
    text: "Identify the billing relationship.",
    help: "Determine whether the matching account should be treated as Shipper, Consignee, or 3rd Party.",
    choices: [
      {
        label: "Continue",
        next: "dual_billing_type",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to select the billing type."
      }
    ]
  },

  dual_billing_type: {
    text: "What type of billing relationship applies?",
    choices: [
      {
        label: "Shipper Account",
        next: "dual_shipper_account",
        icon: "fa-solid fa-warehouse",
        desc: "Account is related to the Shipper."
      },
      {
        label: "Consignee Account",
        next: "dual_consignee_account",
        icon: "fa-solid fa-location-dot",
        desc: "Account is related to the Consignee."
      },
      {
        label: "3rd Party Account",
        next: "final_dual_third_party_account",
        icon: "fa-solid fa-building-user",
        desc: "Account is used as 3rd Party or Bill-To."
      }
    ]
  },

  dual_shipper_account: {
    text: "Check the terms for the Shipper account.",
    choices: [
      {
        label: "Continue",
        next: "final_dual_prepaid",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to prepaid handling."
      }
    ]
  },

  final_dual_prepaid: {
    text: "Use Prepaid terms. The invoice is billed to the ABT if the Shipper account has an ABT, or billed directly to the Shipper if there is no ABT.",
    choices: []
  },

  dual_consignee_account: {
    text: "Check the terms for the Consignee account.",
    choices: [
      {
        label: "Continue",
        next: "final_dual_collect",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to collect handling."
      }
    ]
  },

  final_dual_collect: {
    text: "Use Collect terms. The invoice is billed to the ABT if the Consignee account has an ABT, or billed directly to the Consignee if there is no ABT.",
    choices: []
  },

  final_dual_third_party_account: {
    text: "Use the Bill-To information for the correct invoice destination.",
    choices: []
  }

};
