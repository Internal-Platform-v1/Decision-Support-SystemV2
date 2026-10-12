/* =========================================================
   TPHI GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "tphi-guide",
  title: "TPHI Guide",
  startNode: "start",
  templateCollection: "tphi_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "TPHI",
    help: "TEMP-SYS MATCH-CHARGE ACCOUNT TO ACCOUNT PER TEMP AUDIT AUTO MATCHING PROCESS",
    note: "NOTE: If account provided is ARCHIVED or FLAGGED as DO NOT USE look for a better account. Ensure that debtor to be use is a good account. If another code is to be use, follow CORR CODE on job aid. If unable to to find a better account move to TPCL.",
    choices: [
      {
        label: "Continue",
        next: "tphi_intro",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the TPHI flow."
      }
    ]
  },

  tphi_intro: {
    text: "TEMP-SYS MATCH-CHARGE ACCOUNT TO ACCOUNT PER TEMP AUDIT AUTO MATCHING PROCESS",
    help: "Follow the decision flow carefully before updating the Bill To account and correction notes.",
    choices: [
      {
        label: "Continue",
        next: "tphi_shipper_related",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the first decision."
      }
    ]
  },

  tphi_shipper_related: {
    text: "Is the shipper account related to bill to?",
    help: "Check whether the shipper account is related to the Bill To account.",
    choices: [
      {
        label: "YES",
        next: "tphi_billto_abt",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed to check whether Bill To is an ABT of the shipper."
      },
      {
        label: "NO",
        next: "tphi_check_bol",
        icon: "fa-solid fa-circle-xmark",
        desc: "Validate first using the BOL."
      }
    ]
  },

  tphi_billto_abt: {
    text: "Is the bill to is an ABT of the shipper?",
    help: "Check whether the Bill To account is set up as an ABT of the shipper.",
    choices: [
      {
        label: "YES",
        next: "tphi_update_terms",
        icon: "fa-solid fa-circle-check",
        desc: "Update the terms based on the ABT relationship."
      },
      {
        label: "NO",
        next: "tphi_correction_request",
        icon: "fa-solid fa-circle-xmark",
        desc: "Skip term update and proceed to the correction request step."
      }
    ]
  },

  tphi_update_terms: {
    text: "Update the terms depending which account has the BT as an ABT",
    help: "Update the terms based on which account has the Bill To as an ABT.",
    choices: [
      {
        label: "Continue",
        next: "tphi_correction_request",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the correction request instructions."
      }
    ]
  },

  tphi_check_bol: {
    text: "Check BOL for validation, Check if the requested code is related per BOL",
    help: "Validate the requested code against the BOL before proceeding.",
    choices: [
      {
        label: "Related / Valid",
        next: "tphi_billto_abt",
        icon: "fa-solid fa-circle-check",
        desc: "Return to the main left-side account flow."
      },
      {
        label: "NO",
        next: "tphi_check_aem",
        icon: "fa-solid fa-circle-xmark",
        desc: "Check AEM for another account that can be used."
      }
    ]
  },

  tphi_check_aem: {
    text: "Check AEM for other account that we can use",
    help: "Search AEM for another usable account.",
    choices: [
      {
        label: "Found account",
        next: "tphi_correction_request",
        icon: "fa-solid fa-circle-check",
        desc: "Use the better account and continue the correction flow."
      },
      {
        label: "None",
        next: "tphi_use_requested_code",
        icon: "fa-solid fa-circle-xmark",
        desc: "No better account found."
      }
    ]
  },

  tphi_use_requested_code: {
    text: "If none, proceed on using the requested code. CORR ACCR must be use.",
    help: "If no better account is found, proceed using the requested code and use CORR ACCR.",
    choices: [
      {
        label: "Continue",
        next: "tphi_scroll_notes",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the notes section."
      }
    ]
  },

  tphi_correction_request: {
    text: "Follow the instructions in the Correction Request comments and enter the correct account in the Bill To field and use the Enter Key.",
    help: "Use the correction request comments, enter the correct Bill To account, then press Enter.",
    choices: [
      {
        label: "Continue",
        next: "tphi_auto_rate_1",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to Auto Rate."
      }
    ]
  },

  tphi_auto_rate_1: {
    text: "Auto Rate to pull the correct discounts if applicable.",
    help: "Run Auto Rate to pull the correct discounts if applicable.",
    choices: [
      {
        label: "Continue",
        next: "tphi_amount_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check the result after Auto Rate."
      }
    ]
  },

  tphi_amount_check: {
    text: "After you Auto Rate and the amounts don’t match or the rates increase by at least 50%, move to TPCL queue.",
    help: "If the amounts do not match or the rates increase by at least 50%, move the case to TPCL. Otherwise continue.",
    choices: [
      {
        label: "Move to TPCL",
        action: "Move to TPCL queue.",
        icon: "fa-solid fa-circle-xmark",
        desc: "Amounts do not match or rate increased by at least 50%."
      },
      {
        label: "Continue",
        next: "tphi_scroll_notes",
        icon: "fa-solid fa-arrow-right",
        desc: "Amounts are acceptable. Continue to the notes section."
      }
    ]
  },

  tphi_scroll_notes: {
    text: "Use the scoll bar on the right side in the body of the correction request to scroll to the bottom of the notes.",
    help: "In the first open line in the HU/Keyword Column Enter CORR. Tab over to Description Field and enter ACCR.",
    image: "guides/PAUD%20Guides/tphi-guide/images/tphi-step-notes.jpg",
    note: "-In the first open line in the HU/Keyword Column Enter CORR\n-Tab over to Description Field and enter ACCR-",
    choices: [
      {
        label: "Continue",
        next: "tphi_auto_rate_2",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to auto rate again."
      }
    ]
  },

  tphi_auto_rate_2: {
    text: "Auto Rate again –using same steps as above to insure the amounts remain the same.",
    help: "To complete the correction- use the Accept All Button or the F6 function Key. When the Correction is complete the next pro in the queue will automatically populate.",
    choices: [
      {
        label: "Continue",
        next: "tphi_final_result",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the final result check."
      }
    ]
  },

  tphi_final_result: {
    text: "If you auto-rate and get the following pop up, remove the NOAR and auto-rate again.",
    help: "If balance decreases, continue with the correction. CORR ACCR. If balance increases or doesn’t change, move to TPCL.",
    choices: [
      {
        label: "Balance decreases",
        action: "Continue with the correction. CORR ACCR.",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with the correction."
      },
      {
        label: "Balance increases or doesn’t change",
        action: "Move to TPCL.",
        icon: "fa-solid fa-circle-xmark",
        desc: "Move the case to TPCL."
      }
    ]
  }

};
