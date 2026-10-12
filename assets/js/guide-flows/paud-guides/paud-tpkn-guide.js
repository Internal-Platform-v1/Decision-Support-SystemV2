/* =========================================================
   PAUD / TPKN GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "paud-tpkn-guide",
  title: "PAUD / TPKN Guide",
  startNode: "start",
  templateCollection: "paud_tpkn_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "What is the request?",
    help: "Choose the type of code replacement request.",
    choices: [
      {
        label: "Replace SHIPPER CODE",
        next: "shipper_intro_example",
        icon: "fa-solid fa-truck-fast",
        desc: "Use the shipper replacement flow."
      },
      {
        label: "Replace CONSIGNEE CODE",
        next: "consignee_intro_example",
        icon: "fa-solid fa-building-user",
        desc: "Use the consignee replacement flow."
      }
    ]
  },

  /* ================= SHIPPER BRANCH ================= */

  shipper_intro_example: {
    text: "Replace SHIPPER CODE",
    help: "This is an example of a request to update the Shipper Code.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/replace-shipper-example.png",
    choices: [
      {
        label: "Continue",
        next: "shipper_q1",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the shipper code guide."
      }
    ]
  },

  shipper_q1: {
    text: "Is the current and/or previous debtor included in the list of accounts below?",
    help: "-FedEx Account 91774785\n-LM, LOCKHEED MARTIN\n-PARKER HANNIFIN\n-BAKER HUGHES, BHGE\n-ALL VA, SCHOOLS, UNIVERSITIES, USPS, POST OFFICE, GOV DEPTS, CITY OF, COUNTY OF, MUSEUM, WWTP (WASTE/WATER), L3\n-HD SUPPLY, WHITE CAP\n-Grainger\n-CH Robinson/CHRLTL\n-Echo Global Logistics\n-ULINE\n-Uber Freight",
    choices: [
      {
        label: "YES",
        next: "shipper_account_mapping",
        icon: "fa-solid fa-circle-check",
        desc: "The debtor is in the listed accounts."
      },
      {
        label: "NO",
        next: "shipper_q2",
        icon: "fa-solid fa-circle-xmark",
        desc: "The debtor is not in the listed accounts."
      }
    ]
  },

  shipper_account_mapping: {
    text: "Move the PRO based on the matched listed account.",
    help: "Use the queue mapping based on the matched account.",
    note: "-FedEx Account 91774785 -> move to PATS\n-LM Lockheed Martin -> move to PATT\n-Parker Hannifin -> move to PARS\n-Baker Hughes, BHGE -> move to PCM\n-ALL VA, Schools, Universities, USPS, Post Office, Gov Depts, City Of, County Of, Museum, WTP (Waste/Water), L3 -> move to GOVH\n-HD Supply, White Cap -> move to IRT1\n-Grainger -> move to RQGR\n-CH Robinson / CHRLT -> move to RQCH\n-Echo Global Logistics -> move to RQEG\n-Uber Freight -> move to RQUF\n-Sealed Air -> move to RQSA",
    choices: [
      {
        label: "Finish",
        action: "Move the PRO to the correct queue based on the matched listed account.",
        icon: "fa-solid fa-circle-check",
        desc: "Complete this path."
      }
    ]
  },

  shipper_q2: {
    text: "Are there keywords on the PRO for truckload (TLX, TLS, CAPL), CONT, COD, Storage, Reconsignment, and AD PROs related to Detention and NOST?",
    help: "Review the PRO for these keywords before continuing.",
    choices: [
      {
        label: "YES",
        action: "Update the PRO without auto-rating.",
        icon: "fa-solid fa-pen-to-square",
        desc: "Keyword found."
      },
      {
        label: "NO",
        next: "shipper_q3",
        icon: "fa-solid fa-circle-xmark",
        desc: "No keyword found."
      }
    ]
  },

  shipper_q3: {
    text: "Is the suggested account a good account?",
    help: "Confirm whether the suggested account is valid and can be used.",
    choices: [
      {
        label: "YES",
        next: "shipper_good_account_step1",
        icon: "fa-solid fa-circle-check",
        desc: "The suggested account is good."
      },
      {
        label: "NO",
        next: "shipper_bad_account_reason",
        icon: "fa-solid fa-circle-xmark",
        desc: "The suggested account is not good."
      },
      {
        label: "How to check if the account is good and can be used",
        next: "shipper_account_check_step1",
        icon: "fa-solid fa-magnifying-glass",
        desc: "Open the helper steps."
      }
    ]
  },

  shipper_account_check_step1: {
    text: "1. Click on Invoice Profile.",
    help: "Open the Invoice Profile of the account.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/shipper-account-check-step1.png",
    choices: [
      {
        label: "Continue",
        next: "shipper_account_check_step2",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next helper step."
      }
    ]
  },

  shipper_account_check_step2: {
    text: "2. Check the Invoice Group of the account. Make sure it is not UEST, PSTU, or PSTL.",
    help: "If the Invoice Group is UEST, PSTU, or PSTL, the account should not be used.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/shipper-account-check-step2.png",
    choices: [
      {
        label: "Back to decision",
        next: "shipper_q3",
        icon: "fa-solid fa-arrow-left",
        desc: "Return to the main decision."
      }
    ]
  },

  shipper_good_account_step1: {
    text: "1. Follow the instructions and enter the correct account in the shipper field and use the Enter key.",
    help: "Enter the correct shipper account, then press Enter.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/shipper-step1-enter-account.png",
    choices: [
      {
        label: "Continue",
        next: "shipper_good_account_step2",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the next step."
      }
    ]
  },

  shipper_good_account_step2: {
    text: "2. When you have entered the shipping account and used the Enter key, this window will populate. ALWAYS choose YES.",
    help: "Always choose YES in the prompt window.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/shipper-step2-choose-yes.png",
    choices: [
      {
        label: "Continue",
        next: "shipper_good_account_step3",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the next step."
      }
    ]
  },

  shipper_good_account_step3: {
    text: "3. If the account has an Auto-Bill-To account, it will automatically populate that field for you.",
    help: "Review the Auto-Bill-To field if it auto-populates.",
    choices: [
      {
        label: "Continue",
        next: "shipper_good_account_step4",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the next step."
      }
    ]
  },

  shipper_good_account_step4: {
    text: "4. The next step is to Auto Rate to pull the correct discounts if applicable.",
    help: "Use Auto Rate after entering the correct shipper account.",
    choices: [
      {
        label: "Continue",
        next: "shipper_good_account_step5",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the next step."
      }
    ]
  },

  shipper_good_account_step5: {
    text: "5. Use the Auto Rater Button or Shift+F6.",
    help: "Run Auto Rate before checking for a NOAR pop-up.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/shipper-step5-auto-rate.png",
    choices: [
      {
        label: "Continue",
        next: "shipper_noar_q1",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue after Auto Rate."
      }
    ]
  },

  shipper_noar_q1: {
    text: "Is there a NOAR pop-up?",
    help: "Check whether a NOAR pop-up appears after Auto Rate.",
    choices: [
      {
        label: "YES",
        next: "shipper_noar_balance_decreased",
        icon: "fa-solid fa-circle-check",
        desc: "A NOAR pop-up appeared."
      },
      {
        label: "NO",
        next: "shipper_pricing_pull_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "No NOAR pop-up appeared."
      }
    ]
  },

  shipper_noar_balance_decreased: {
    text: "Has the balance decreased?",
    help: "Check the balance after the NOAR pop-up.",
    choices: [
      {
        label: "YES",
        action: "Continue with the correction. CORR ACCR",
        icon: "fa-solid fa-circle-check",
        desc: "Balance decreased."
      },
      {
        label: "NO",
        next: "shipper_noar_balance_increased_or_same",
        icon: "fa-solid fa-circle-xmark",
        desc: "Balance did not decrease."
      }
    ]
  },

  shipper_noar_balance_increased_or_same: {
    text: "Has the balance increased or didn't change?",
    help: "Use this check when the balance did not decrease.",
    choices: [
      {
        label: "YES",
        action: "Move to TPCL",
        icon: "fa-solid fa-arrow-right-arrow-left",
        desc: "Balance increased or stayed the same."
      },
      {
        label: "NO",
        action: "Continue with the correction. CORR ACCR",
        icon: "fa-solid fa-circle-check",
        desc: "Continue with correction."
      }
    ]
  },

  shipper_pricing_pull_check: {
    text: "Pricing pulls (BRAP - LS, LC, LT). Does the revenue decrease, stay the same, or increase by less than 50%?",
    help: "Review the revenue result after Auto Rate.",
    choices: [
      {
        label: "YES",
        next: "shipper_corr_step6",
        icon: "fa-solid fa-circle-check",
        desc: "Revenue is acceptable."
      },
      {
        label: "NO",
        action: "Move to TPCL",
        icon: "fa-solid fa-arrow-right-arrow-left",
        desc: "Revenue increase is too high."
      }
    ]
  },

  shipper_corr_step6: {
    text: "6. Use the scroll bar on the right side in the body of the correction request to scroll to the bottom of the notes.",
    help: "Go to the correction request notes section.",
    choices: [
      {
        label: "Continue",
        next: "shipper_corr_step7",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the next step."
      }
    ]
  },

  shipper_corr_step7: {
    text: "7. In the first open line in the HU/Keyword Column enter CORR and Tab over to Description Field and enter ACCR.",
    help: "Enter CORR and ACCR exactly as shown.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/shipper-step7-corr-accr.png",
    choices: [
      {
        label: "Continue",
        next: "shipper_corr_step9",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the next step."
      }
    ]
  },

  shipper_corr_step9: {
    text: "9. Auto Rate again using same steps as above to insure the amounts remain the same.",
    help: "Run Auto Rate again and verify the amounts.",
    choices: [
      {
        label: "Continue",
        next: "shipper_corr_step10",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the next step."
      }
    ]
  },

  shipper_corr_step10: {
    text: "10. To complete the correction, use the Accept All button or the F6 function key.",
    help: "Complete the correction using Accept All or F6.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/shipper-step10-accept-all.png",
    choices: [
      {
        label: "Continue",
        next: "shipper_corr_step11",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the final step."
      }
    ]
  },

  shipper_corr_step11: {
    text: "11. When the Correction is complete the next PRO in the queue will automatically populate.",
    help: "This is the expected result after completing the correction.",
    choices: [
      {
        label: "Finish",
        action: "When the Correction is complete the next PRO in the queue will automatically populate.",
        icon: "fa-solid fa-circle-check",
        desc: "Complete this path."
      }
    ]
  },

  shipper_bad_account_reason: {
    text: "Why is the suggested account not a good account?",
    help: "Choose the reason the suggested account cannot be used.",
    choices: [
      {
        label: "Archived / Deleted / Flagged as DNU",
        next: "shipper_bad_account_search_1",
        icon: "fa-solid fa-box-archive",
        desc: "The account is archived, deleted, or flagged as DNU."
      },
      {
        label: "Invoice Group is UEST / PSTU / PSTL",
        next: "shipper_bad_account_search_2",
        icon: "fa-solid fa-file-invoice",
        desc: "The account belongs to an invalid Invoice Group."
      }
    ]
  },

  shipper_bad_account_search_1: {
    text: "1. Search for a better account using AE&M.",
    help: "Look for another usable account.",
    choices: [
      {
        label: "Continue",
        next: "shipper_bad_account_found_1",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after searching."
      }
    ]
  },

  shipper_bad_account_found_1: {
    text: "Did you find a better account?",
    help: "Choose whether a better account was found.",
    choices: [
      {
        label: "YES",
        action: "Use the account and update the PRO accordingly.",
        icon: "fa-solid fa-circle-check",
        desc: "A better account was found."
      },
      {
        label: "NO",
        action: "Move the PRO to TUKN",
        icon: "fa-solid fa-arrow-right-arrow-left",
        desc: "No better account was found."
      }
    ]
  },

  shipper_bad_account_search_2: {
    text: "1. Search for a better account using AE&M.",
    help: "Look for another usable account.",
    choices: [
      {
        label: "Continue",
        next: "shipper_bad_account_found_2",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after searching."
      }
    ]
  },

  shipper_bad_account_found_2: {
    text: "Did you find a better account?",
    help: "Choose whether a better account was found.",
    choices: [
      {
        label: "YES",
        action: "Use the account and update the PRO accordingly.",
        icon: "fa-solid fa-circle-check",
        desc: "A better account was found."
      },
      {
        label: "NO",
        action: "Move the PRO to TUKN",
        icon: "fa-solid fa-arrow-right-arrow-left",
        desc: "No better account was found."
      }
    ]
  },

  /* ================= CONSIGNEE BRANCH ================= */

  consignee_intro_example: {
    text: "Replace CONSIGNEE CODE",
    help: "This is an example of a request to update the Consignee Code.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/replace-consignee-example.png",
    choices: [
      {
        label: "Continue",
        next: "consignee_q1",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the consignee code guide."
      }
    ]
  },

  consignee_q1: {
    text: "Is the current and/or previous debtor included in the list of accounts below?",
    help: "-FedEx Account 91774785\n-LM, LOCKHEED MARTIN\n-PARKER HANNIFIN\n-BAKER HUGHES, BHGE\n-ALL VA, SCHOOLS, UNIVERSITIES, USPS, POST OFFICE, GOV DEPTS, CITY OF, COUNTY OF, MUSEUM, WWTP (WASTE/WATER), L3\n-HD SUPPLY, WHITE CAP\n-Grainger\n-CH Robinson/CHRLTL\n-Echo Global Logistics\n-ULINE\n-Uber Freight\n-Sealed Air",
    choices: [
      {
        label: "YES",
        next: "consignee_account_mapping",
        icon: "fa-solid fa-circle-check",
        desc: "The debtor is in the listed accounts."
      },
      {
        label: "NO",
        next: "consignee_q2",
        icon: "fa-solid fa-circle-xmark",
        desc: "The debtor is not in the listed accounts."
      }
    ]
  },

  consignee_account_mapping: {
    text: "Move the PRO based on the matched listed account.",
    help: "Use the queue mapping based on the matched account.",
    note: "-FedEx Account 91774785 -> move to PATS\n-LM Lockheed Martin -> move to PATT\n-Parker Hannifin -> move to PARS\n-Baker Hughes, BHGE -> move to PCM\n-ALL VA, Schools, Universities, USPS, Post Office, Gov Depts, City Of, County Of, Museum, WTP (Waste/Water), L3 -> move to GOVH\n-HD Supply, White Cap -> move to IRT1\n-Grainger -> move to RQGR\n-CH Robinson / CHRLT -> move to RQCH\n-Echo Global Logistics -> move to RQEG\n-Uline -> move to RQUL",
    choices: [
      {
        label: "Finish",
        action: "Move the PRO to the correct queue based on the matched listed account.",
        icon: "fa-solid fa-circle-check",
        desc: "Complete this path."
      }
    ]
  },

  consignee_q2: {
    text: "Are there keywords on the PRO for truckload (TLX, TLS, CAPL), CONT, COD, Storage, Reconsignment, and AD PROs related to Detention and NOST?",
    help: "Review the PRO for these keywords before continuing.",
    choices: [
      {
        label: "YES",
        action: "Update the PRO without auto-rating.",
        icon: "fa-solid fa-pen-to-square",
        desc: "Keyword found."
      },
      {
        label: "NO",
        next: "consignee_q3",
        icon: "fa-solid fa-circle-xmark",
        desc: "No keyword found."
      }
    ]
  },

  consignee_q3: {
    text: "Is the suggested account a good account?",
    help: "Confirm whether the suggested account is valid and can be used.",
    choices: [
      {
        label: "YES",
        next: "consignee_good_account_step1",
        icon: "fa-solid fa-circle-check",
        desc: "The suggested account is good."
      },
      {
        label: "NO",
        next: "consignee_bad_account_reason",
        icon: "fa-solid fa-circle-xmark",
        desc: "The suggested account is not good."
      },
      {
        label: "How to check if the account is good and can be used",
        next: "consignee_account_check_step1",
        icon: "fa-solid fa-magnifying-glass",
        desc: "Open the helper steps."
      }
    ]
  },

  consignee_account_check_step1: {
    text: "1. Click on Invoice Profile.",
    help: "Open the Invoice Profile of the account.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/shipper-account-check-step1.png",
    choices: [
      {
        label: "Continue",
        next: "consignee_account_check_step2",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next helper step."
      }
    ]
  },

  consignee_account_check_step2: {
    text: "2. Check the Invoice Group of the account. Make sure it is not UEST, PSTU, or PSTL.",
    help: "If the Invoice Group is UEST, PSTU, or PSTL, the account should not be used.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/shipper-account-check-step2.png",
    choices: [
      {
        label: "Back to decision",
        next: "consignee_q3",
        icon: "fa-solid fa-arrow-left",
        desc: "Return to the main decision."
      }
    ]
  },

  consignee_good_account_step1: {
    text: "1. Follow the instructions and enter the correct account in the consignee field and use the Enter key.",
    help: "Enter the correct consignee account, then press Enter.",
    choices: [
      {
        label: "Continue",
        next: "consignee_good_account_step2",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the next step."
      }
    ]
  },

  consignee_good_account_step2: {
    text: "2. If you are changing the consignee code, a window will pop up asking 'Is this a reconsignment?' choose NO.",
    help: "When asked 'Is this a reconsignment?' choose NO.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/consignee-step2-reconsignment-no.jpg",
    choices: [
      {
        label: "Continue",
        next: "consignee_good_account_step3",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the next step."
      }
    ]
  },

  consignee_good_account_step3: {
    text: "3. Another Pop Up will appear and ask 'Do you want to update the Bill To fields?' choose YES.",
    help: "Choose YES on the Bill To fields prompt.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/consignee-step3-billto-yes.png",
    choices: [
      {
        label: "Continue",
        next: "consignee_good_account_step4",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the next step."
      }
    ]
  },

  consignee_good_account_step4: {
    text: "4. Use the Auto Rater Button or Shift+F6.",
    help: "Run Auto Rate before checking for a NOAR pop-up.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/consignee-step4-auto-rate.png",
    choices: [
      {
        label: "Continue",
        next: "consignee_noar_q1",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue after Auto Rate."
      }
    ]
  },

  consignee_noar_q1: {
    text: "Is there a NOAR pop-up?",
    help: "Check whether a NOAR pop-up appears after Auto Rate.",
    choices: [
      {
        label: "YES",
        next: "consignee_noar_balance_decreased",
        icon: "fa-solid fa-circle-check",
        desc: "A NOAR pop-up appeared."
      },
      {
        label: "NO",
        next: "consignee_no_noar_path_picker",
        icon: "fa-solid fa-circle-xmark",
        desc: "No NOAR pop-up appeared."
      }
    ]
  },

  consignee_noar_balance_decreased: {
    text: "Has the balance decreased?",
    help: "Check the balance after the NOAR pop-up.",
    choices: [
      {
        label: "YES",
        action: "Continue with the correction. CORR ACCR",
        icon: "fa-solid fa-circle-check",
        desc: "Balance decreased."
      },
      {
        label: "NO",
        next: "consignee_noar_balance_increased_or_same",
        icon: "fa-solid fa-circle-xmark",
        desc: "Balance did not decrease."
      }
    ]
  },

  consignee_noar_balance_increased_or_same: {
    text: "Has the balance increased or didn't change?",
    help: "Use this check when the balance did not decrease.",
    choices: [
      {
        label: "YES",
        action: "Move to TPCL",
        icon: "fa-solid fa-arrow-right-arrow-left",
        desc: "Balance increased or stayed the same."
      },
      {
        label: "NO",
        action: "Continue with the correction. CORR ACCR",
        icon: "fa-solid fa-circle-check",
        desc: "Continue with correction."
      }
    ]
  },

  consignee_no_noar_path_picker: {
    text: "Choose the scenario that applies after there is no NOAR pop-up.",
    help: "Select the matching pricing scenario.",
    choices: [
      {
        label: "Pricing pulls (BRAP - LS, LC, LT)",
        next: "consignee_pricing_pull_check",
        icon: "fa-solid fa-chart-line",
        desc: "Use this when pricing pulls for LS, LC, or LT."
      },
      {
        label: "Pricing fall (BRAP - LD) rates become default",
        next: "consignee_pricing_default_check",
        icon: "fa-solid fa-tags",
        desc: "Use this when LD rates become default."
      },
      {
        label: "Rate is LD to LD",
        next: "consignee_ld_to_ld_check",
        icon: "fa-solid fa-road",
        desc: "Use this when the rate is LD to LD."
      }
    ]
  },

  consignee_pricing_pull_check: {
    text: "Pricing pulls (BRAP - LS, LC, LT). Does the revenue decrease, stay the same, or increase by less than 50%?",
    help: "Review the revenue result after Auto Rate.",
    choices: [
      {
        label: "YES",
        next: "consignee_corr_step6",
        icon: "fa-solid fa-circle-check",
        desc: "Revenue is acceptable."
      },
      {
        label: "NO",
        action: "Move to TPCL",
        note: "Even if Pricing pulls, if the change is an increase of 50% or more, move to TPCL.",
        icon: "fa-solid fa-arrow-right-arrow-left",
        desc: "Revenue increase is too high."
      }
    ]
  },

  consignee_pricing_default_check: {
    text: "Pricing fall (BRAP - LD) rates become default.",
    help: "Look for a better account first.",
    choices: [
      {
        label: "Continue",
        next: "consignee_pricing_default_search",
        icon: "fa-solid fa-arrow-right",
        desc: "Look for a better account."
      }
    ]
  },

  consignee_pricing_default_search: {
    text: "Have you found a better account?",
    help: "Choose whether a better account was found.",
    choices: [
      {
        label: "YES",
        action: "Update the code and put additional comment on Correction Request",
        icon: "fa-solid fa-circle-check",
        desc: "A better account was found."
      },
      {
        label: "NO",
        action: "If no better account is found and amount changes even by $1, move to TPCL",
        icon: "fa-solid fa-arrow-right-arrow-left",
        desc: "No better account was found."
      }
    ]
  },

  consignee_ld_to_ld_check: {
    text: "Rate is LD to LD. Does revenue decrease, stay the same, or increase by less than 50%?",
    help: "Review the revenue result for LD to LD.",
    choices: [
      {
        label: "YES",
        next: "consignee_corr_step6_ld",
        icon: "fa-solid fa-circle-check",
        desc: "Revenue is acceptable."
      },
      {
        label: "NO",
        action: "Move to TPCL",
        icon: "fa-solid fa-arrow-right-arrow-left",
        desc: "Revenue increase is too high."
      }
    ]
  },

  consignee_corr_step6: {
    text: "6. Use the scroll bar on the right side in the body of the correction request to scroll to the bottom of the notes.",
    help: "Go to the correction request notes section.",
    choices: [
      {
        label: "Continue",
        next: "consignee_corr_step7",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the next step."
      }
    ]
  },

  consignee_corr_step7: {
    text: "7. In the first open line in the HU/Keyword Column Enter CORR and Tab over to Description Field and enter ACCR.",
    help: "Enter CORR and ACCR exactly as shown.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/shipper-step7-corr-accr.png",
    choices: [
      {
        label: "Continue",
        next: "consignee_corr_step9",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the next step."
      }
    ]
  },

  consignee_corr_step9: {
    text: "9. Auto Rate again using same steps as above to insure the amounts remain the same.",
    help: "Run Auto Rate again and verify the amounts.",
    choices: [
      {
        label: "Continue",
        next: "consignee_corr_step10",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the next step."
      }
    ]
  },

  consignee_corr_step10: {
    text: "10. To complete the correction, use the Accept All button or the F6 function key.",
    help: "Complete the correction using Accept All or F6.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/shipper-step10-accept-all.png",
    choices: [
      {
        label: "Continue",
        next: "consignee_corr_step11",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the final step."
      }
    ]
  },

  consignee_corr_step11: {
    text: "11. When the Correction is complete the next PRO in the queue will automatically populate.",
    help: "This is the expected result after completing the correction.",
    choices: [
      {
        label: "Finish",
        action: "When the Correction is complete the next PRO in the queue will automatically populate.",
        icon: "fa-solid fa-circle-check",
        desc: "Complete this path."
      }
    ]
  },

  consignee_corr_step6_ld: {
    text: "6. Use the scroll bar on the right side in the body of the correction request to scroll to the bottom of the notes.",
    help: "Go to the correction request notes section.",
    choices: [
      {
        label: "Continue",
        next: "consignee_corr_step7_ld",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the next step."
      }
    ]
  },

  consignee_corr_step7_ld: {
    text: "7. In the first open line in the HU/Keyword Column Enter CORR and Tab over to Description Field and enter ACCR.",
    help: "Enter CORR and ACCR exactly as shown.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/shipper-step7-corr-accr.png",
    choices: [
      {
        label: "Continue",
        next: "consignee_corr_step9_ld",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the next step."
      }
    ]
  },

  consignee_corr_step9_ld: {
    text: "9. Auto Rate again using same steps as above to insure the amounts remain the same.",
    help: "Run Auto Rate again and verify the amounts.",
    choices: [
      {
        label: "Continue",
        next: "consignee_corr_step10_ld",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the next step."
      }
    ]
  },

  consignee_corr_step10_ld: {
    text: "10. To complete the correction, use the Accept All button or the F6 function key.",
    help: "Complete the correction using Accept All or F6.",
    image: "guides/PAUD%20Guides/paud-tpkn-guide/images/shipper-step10-accept-all.png",
    choices: [
      {
        label: "Continue",
        next: "consignee_corr_step11_ld",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the final step."
      }
    ]
  },

  consignee_corr_step11_ld: {
    text: "11. When the Correction is complete the next PRO in the queue will automatically populate.",
    help: "This is the expected result after completing the correction.",
    choices: [
      {
        label: "Finish",
        action: "When the Correction is complete the next PRO in the queue will automatically populate.",
        icon: "fa-solid fa-circle-check",
        desc: "Complete this path."
      }
    ]
  },

  consignee_bad_account_reason: {
    text: "Why is the suggested account not a good account?",
    help: "Choose the reason the suggested account cannot be used.",
    choices: [
      {
        label: "Archived / Deleted / Flagged as DNU",
        next: "consignee_bad_account_search_1",
        icon: "fa-solid fa-box-archive",
        desc: "The account is archived, deleted, or flagged as DNU."
      },
      {
        label: "Invoice Group is UEST / PSTU / PSTL",
        next: "consignee_bad_account_search_2",
        icon: "fa-solid fa-file-invoice",
        desc: "The account belongs to an invalid Invoice Group."
      }
    ]
  },

  consignee_bad_account_search_1: {
    text: "1. Search for a better account using AE&M.",
    help: "Look for another usable account.",
    choices: [
      {
        label: "Continue",
        next: "consignee_bad_account_found_1",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after searching."
      }
    ]
  },

  consignee_bad_account_found_1: {
    text: "Did you find a better account?",
    help: "Choose whether a better account was found.",
    choices: [
      {
        label: "YES",
        action: "Use the account and update the PRO accordingly.",
        icon: "fa-solid fa-circle-check",
        desc: "A better account was found."
      },
      {
        label: "NO",
        action: "Move the PRO to TUKN",
        icon: "fa-solid fa-arrow-right-arrow-left",
        desc: "No better account was found."
      }
    ]
  },

  consignee_bad_account_search_2: {
    text: "1. Search for a better account using AE&M.",
    help: "Look for another usable account.",
    choices: [
      {
        label: "Continue",
        next: "consignee_bad_account_found_2",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after searching."
      }
    ]
  },

  consignee_bad_account_found_2: {
    text: "Did you find a better account?",
    help: "Choose whether a better account was found.",
    choices: [
      {
        label: "YES",
        action: "Use the account and update the PRO accordingly.",
        icon: "fa-solid fa-circle-check",
        desc: "A better account was found."
      },
      {
        label: "NO",
        action: "Move the PRO to TUKN",
        icon: "fa-solid fa-arrow-right-arrow-left",
        desc: "No better account was found."
      }
    ]
  }

};
