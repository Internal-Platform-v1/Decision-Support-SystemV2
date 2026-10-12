/* =========================================================
   INVALID CONSIGNEE/SHIPPER ACCOUNT (ISPD) — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "ispd-guide",
  title: "Invalid Consignee/Shipper Account (ISPD)",
  startNode: "start",
  templateCollection: "ispd_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Invalid Consignee/Shipper Account (ISPD)",
    help: "Use this guide to work PROs in the ISPD queue and resolve invalid shipper or consignee account concerns.",
    choices: [
      {
        label: "Continue",
        next: "ispd_start_work",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the ISPD guide."
      }
    ]
  },

  ispd_start_work: {
    text: "How to work the PROs on ISPD Queue.",
    help: "Open the first PRO on the file that you received, then review the freight bill.",
    note: "Workday function: ISPD\n\nACCOPS Freight Corrections Menu:\nEnter ISPD in the keyword ISPD in the queue name field.",
    choices: [
      {
        label: "Continue",
        next: "ispd_open_first_pro",
        icon: "fa-solid fa-arrow-right",
        desc: "Open the first PRO."
      }
    ]
  },

  ispd_open_first_pro: {
    text: "Open the first PRO on the file that you received.",
    help: "Begin with the first PRO from the assigned ISPD file.",
    choices: [
      {
        label: "Continue",
        next: "ispd_review_freight_bill",
        icon: "fa-solid fa-arrow-right",
        desc: "Review the freight bill."
      }
    ]
  },

  ispd_review_freight_bill: {
    text: "Review the Freight Bill.",
    help: "Review the bill details and identify whether the request is for shipper or consignee account correction.",
    choices: [
      {
        label: "Continue",
        next: "ispd_request_type",
        icon: "fa-solid fa-arrow-right",
        desc: "Identify the request."
      }
    ]
  },

  ispd_request_type: {
    text: "What is the request?",
    help: "Choose whether the actual request is for the shipper or consignee.",
    choices: [
      {
        label: "For Shipper",
        next: "ispd_shipper_actual_request",
        icon: "fa-solid fa-truck-ramp-box",
        desc: "Refresh shipper SC code to match the OBL."
      },
      {
        label: "For Consignee",
        next: "ispd_consignee_actual_request",
        icon: "fa-solid fa-warehouse",
        desc: "Refresh consignee code to match the OBL."
      }
    ]
  },

  /* ================= SHIPPER BRANCH ================= */

  ispd_shipper_actual_request: {
    text: "FOR SHIPPER: Actual request",
    help: "RS-ACCT: Please refresh SC code to match information on the OBL.",
    choices: [
      {
        label: "BOL is in EDM",
        next: "ispd_shipper_check_bol",
        icon: "fa-solid fa-circle-check",
        desc: "Check if the BOL matches the shipper name and address on FBI."
      },
      {
        label: "No BOL in EDM",
        next: "ispd_shipper_request_bol",
        icon: "fa-solid fa-circle-xmark",
        desc: "Request the BOL in ISPD."
      }
    ]
  },

  ispd_shipper_request_bol: {
    text: "No BOL in EDM.",
    help: "If no BOL is available in EDM, request it in ISPD for electronic BOL.",
    choices: [
      {
        label: "Continue",
        next: "ispd_shipper_research_discrepancy",
        icon: "fa-solid fa-arrow-right",
        desc: "Research the discrepancy after requesting the BOL."
      }
    ]
  },

  ispd_shipper_check_bol: {
    text: "Check the BOL in EDM.",
    help: "Verify if the BOL is matching the shipper name and address on FBI.",
    choices: [
      {
        label: "Continue",
        next: "ispd_shipper_research_discrepancy",
        icon: "fa-solid fa-arrow-right",
        desc: "Research where the discrepancy is."
      }
    ]
  },

  ispd_shipper_research_discrepancy: {
    text: "Research where the discrepancy is.",
    help: "Identify whether the issue is with the name/address or the account code/location details.",
    note: "Examples include:\n• Wrong name and address\n• Wrong account code\n• Wrong city, state, and ZIP",
    choices: [
      {
        label: "Continue",
        next: "ispd_shipper_profile_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check the customer profile tab."
      }
    ]
  },

  ispd_shipper_profile_check: {
    text: "Check the customer profile tab of the shipper.",
    help: "Use the shipper customer profile tab to verify the correct account and location details.",
    choices: [
      {
        label: "Continue",
        next: "ispd_shipper_compare_bill",
        icon: "fa-solid fa-arrow-right",
        desc: "Compare ACCOPS details with the bill of lading."
      }
    ]
  },

  ispd_shipper_compare_bill: {
    text: "Compare shipper details.",
    help: "Check if the shipper name and address in ACCOPS Corrections is different than what is shown on the Bill of Lading.",
    choices: [
      {
        label: "Shipper code is correct, but name/address is not",
        next: "ispd_shipper_code_correct_name_wrong",
        icon: "fa-solid fa-circle-check",
        desc: "Refresh the shipper code to pull the correct account information."
      },
      {
        label: "Shipper code and name are incorrect / not matching BOL",
        next: "ispd_shipper_code_name_wrong",
        icon: "fa-solid fa-circle-xmark",
        desc: "Check for an account code that matches the BOL or create an account."
      }
    ]
  },

  ispd_shipper_code_correct_name_wrong: {
    text: "Shipper code is correct, but the name and address on the freight bill is not.",
    help: "The shipper code customer profile is correct and matches the bill of lading.",
    action: "Refresh the shipper code to pull the correct account information. After refreshing, you will see the shipper code. This box will pop up and ask if you would like to update the \"Bill To\" fields. Please review the Bill of Lading to see if there is a third-party request. If not, follow terms per OBL. In this case, click Yes to update the Bill To field.\n\nCORR is ACCR.\n\nThen ACCEPT ALL."
  },

  ispd_shipper_code_name_wrong: {
    text: "Shipper code and name are incorrect and not matching the BOL.",
    help: "Proceed by checking for an account code that matches the BOL.",
    action: "Proceed with checking an account code to match the BOL on AEM.\n\n1. Once you see a code matching the BOL, proceed with changing.\n2. If there is no account found in AEM/ISPI, create an account.\n\nCORR is ACCR.\n\nThen ACCEPT ALL."
  },

  /* ================= CONSIGNEE BRANCH ================= */

  ispd_consignee_actual_request: {
    text: "FOR CONSIGNEE: Actual request",
    help: "RS-ACCT: Please refresh CONS code to match information on the OBL.",
    choices: [
      {
        label: "BOL is in EDM",
        next: "ispd_consignee_check_bol",
        icon: "fa-solid fa-circle-check",
        desc: "Check if the BOL matches the consignee name and address on FBI."
      },
      {
        label: "No BOL in EDM",
        next: "ispd_consignee_request_bol",
        icon: "fa-solid fa-circle-xmark",
        desc: "Request the BOL in ISPD."
      }
    ]
  },

  ispd_consignee_request_bol: {
    text: "No BOL in EDM.",
    help: "If no BOL is available in EDM, request it in ISPD for electronic BOL.",
    choices: [
      {
        label: "Continue",
        next: "ispd_consignee_research_discrepancy",
        icon: "fa-solid fa-arrow-right",
        desc: "Research the discrepancy after requesting the BOL."
      }
    ]
  },

  ispd_consignee_check_bol: {
    text: "Check the BOL in EDM.",
    help: "Verify if the BOL is matching the consignee name and address on FBI.",
    choices: [
      {
        label: "Continue",
        next: "ispd_consignee_research_discrepancy",
        icon: "fa-solid fa-arrow-right",
        desc: "Research where the discrepancy is."
      }
    ]
  },

  ispd_consignee_research_discrepancy: {
    text: "Research where the discrepancy is.",
    help: "Identify whether the issue is with the name/address or the account code/location details.",
    note: "Examples include:\n• Wrong name and address\n• Wrong account code\n• Wrong city, state, and ZIP",
    choices: [
      {
        label: "Continue",
        next: "ispd_consignee_profile_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check the customer profile tab."
      }
    ]
  },

  ispd_consignee_profile_check: {
    text: "Check the customer profile tab of the consignee.",
    help: "Use the consignee customer profile tab to verify the correct account and location details.",
    choices: [
      {
        label: "Continue",
        next: "ispd_consignee_compare_bill",
        icon: "fa-solid fa-arrow-right",
        desc: "Compare ACCOPS details with the bill of lading."
      }
    ]
  },

  ispd_consignee_compare_bill: {
    text: "Compare consignee details.",
    help: "Check if the consignee name and address in ACCOPS Corrections is different than what is shown on the Bill of Lading.",
    choices: [
      {
        label: "Consignee code is correct, but name/address is not",
        next: "ispd_consignee_code_correct_name_wrong",
        icon: "fa-solid fa-circle-check",
        desc: "Refresh the consignee code to pull the correct account information."
      },
      {
        label: "Consignee code and name are incorrect / not matching BOL",
        next: "ispd_consignee_code_name_wrong",
        icon: "fa-solid fa-circle-xmark",
        desc: "Check for an account code that matches the BOL or create an account."
      }
    ]
  },

  ispd_consignee_code_correct_name_wrong: {
    text: "Consignee code is correct, but the name and address on the freight bill is not.",
    help: "The consignee code customer profile is correct and matches the bill of lading.",
    action: "Refresh the consignee code to pull the correct account information.\n\nAfter refreshing, check if there is a third-party request per OBL. If yes, update the Bill To field based on the OBL.\n\nCORR is ACCR.\n\nThen ACCEPT ALL."
  },

  ispd_consignee_code_name_wrong: {
    text: "Consignee code and name are incorrect and not matching the BOL.",
    help: "Proceed by checking for an account code that matches the BOL.",
    action: "Proceed with checking an account code to match the BOL on AEM.\n\n1. Once you see a code matching the BOL, proceed with changing.\n2. If there is no account found in AEM/ISPI or in any tools, create an account.\n\nCORR is ACCR.\n\nThen ACCEPT ALL."
  }

};
