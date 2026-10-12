/* =========================================================
   IRT/VSAT – QUEUE GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "irt-vsat-guide",
  title: "IRT/VSAT – Queue Guide",
  startNode: "start",
  templateCollection: "irt_vsat_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "IRT/VSAT Guide",
    help: "Review BOL for validation of the request. Follow the specific workflow for Grainger, Rio Bravo, or Hino.",
    choices: [
      {
        label: "Continue",
        next: "irt_vsat_requestor",
        icon: "fa-solid fa-arrow-right",
        desc: "Identify the requestor."
      }
    ]
  },

  irt_vsat_requestor: {
    text: "Who is the requestor?",
    help: "Select the appropriate option based on the correction request and BOL validation.",
    choices: [
      {
        label: "GRAINGER",
        next: "irt_grainger_review",
        icon: "fa-solid fa-building",
        desc: "Grainger – NOAR and CAPL remark handling."
      },
      {
        label: "RIO BRAVO",
        next: "irt_rio_context",
        icon: "fa-solid fa-warehouse",
        desc: "Rio Bravo – Freight forwarder consignee correction."
      },
      {
        label: "HINO",
        next: "irt_hino_sample",
        icon: "fa-solid fa-truck",
        desc: "Hino – Account mapping and term updates."
      }
    ]
  },

  /* ==================== OPTION 1: GRAINGER ==================== */

  irt_grainger_review: {
    text: "Review the request of the customer. Example (Grainger).",
    image: "guides/PAUD%20Guides/irt-vsat-guide/images/irt-vsat-image1.png",
    help: "Read the correction request carefully before proceeding.",
    choices: [
      {
        label: "Continue",
        next: "irt_grainger_delete_noar",
        icon: "fa-solid fa-arrow-right",
        desc: "Delete NOAR line."
      }
    ]
  },

  irt_grainger_delete_noar: {
    text: "Review the body of the bill for the keyword NOAR. Highlight the row and click DELETE LINE.",
    image: "guides/PAUD%20Guides/irt-vsat-guide/images/irt-vsat-image2.png",
    help: "Locate and remove the NOAR line before proceeding.",
    choices: [
      {
        label: "Continue",
        next: "irt_grainger_add_remark",
        icon: "fa-solid fa-arrow-right",
        desc: "Add CAPL remark."
      }
    ]
  },

  irt_grainger_add_remark: {
    text: "Review the body of the bill for RMK CAPL WAIVED PER CONTRACT. If this row is not present, add the remark to the bill.",
    image: "guides/PAUD%20Guides/irt-vsat-guide/images/irt-vsat-image3.png",
    help: "Ensure the remark is added to validate the contract waiver.",
    choices: [
      {
        label: "Continue",
        next: "irt_grainger_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply final correction."
      }
    ]
  },

  irt_grainger_final: {
    text: "If NOAR keyword is not present on the PRO (after deletion), click AUTO-RATE. If balance due doesn't change, enter CORR VRFY and ACCEPT ALL. If balance due does change, confirm the PRO rates with pricing and enter CORR CAE and ACCEPT ALL.",
    help: "Apply CORR VRFY if no rate change, or CORR CAE if the rate changes after auto-rating.",
    choices: []
  },

  /* ==================== OPTION 2: RIO BRAVO ==================== */

  irt_rio_context: {
    text: "Example request of Rio Bravo in El Paso TX is a Freight Forward warehouse that many companies use for moving freight from/to Mexico. Because the BOL is populated with Rio Bravo as the consignee name, the invoices that should bill to the company using the warehouse are billing to Rio Bravo in error.",
    image: "guides/PAUD%20Guides/irt-vsat-guide/images/irt-vsat-image4.png",
    help: "Understand that Rio Bravo is a freight forwarder; billing should go to the true consignee.",
    choices: [
      {
        label: "Continue",
        next: "irt_rio_review_bol",
        icon: "fa-solid fa-arrow-right",
        desc: "Review BOL for true consignee."
      }
    ]
  },

  irt_rio_review_bol: {
    text: "Review the bill of lading to confirm the correct consignee name. In this example the true consignee is Haas TCM De Mexico.",
    help: "Verify the true consignee against the BOL before proceeding.",
    choices: [
      {
        label: "Continue",
        next: "irt_rio_valid_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Determine if billing is valid."
      }
    ]
  },

  irt_rio_valid_check: {
    text: "Is it valid per BOL?",
    help: "Check if the current billing matches the BOL requirements.",
    choices: [
      {
        label: "YES – Valid",
        next: "irt_rio_yes",
        icon: "fa-solid fa-check-circle",
        desc: "No updates needed."
      },
      {
        label: "NO – Invalid",
        next: "irt_rio_no",
        icon: "fa-solid fa-circle-xmark",
        desc: "Update consignee."
      }
    ]
  },

  irt_rio_yes: {
    text: "Example: Pro 5058528823. The freight charges for this pro are billed prepaid and there are no surcharges billing collect. This pro should be verified with no updates.",
    image: "guides/PAUD%20Guides/irt-vsat-guide/images/irt-vsat-image5.png",
    help: "No updates have been made. Apply CORR VRFY.",
    choices: [
      {
        label: "Final Recommendation",
        next: "irt_rio_yes_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply CORR VRFY."
      }
    ]
  },

  irt_rio_yes_final: {
    text: "No updates has been made on the pro. CORR VRFY.",
    help: "Use CORR VRFY and Accept All F6 to post.",
    choices: []
  },

  irt_rio_no: {
    text: "Example below is not valid.",
    image: "guides/PAUD%20Guides/irt-vsat-guide/images/irt-vsat-image6.png",
    help: "The current billing does not match the BOL; an update is required.",
    choices: [
      {
        label: "Continue",
        next: "irt_rio_search_account",
        icon: "fa-solid fa-arrow-right",
        desc: "Search for correct account."
      }
    ]
  },

  irt_rio_search_account: {
    text: "Search for a shipping account for the true consignee on the BOL.",
    image: "guides/PAUD%20Guides/irt-vsat-guide/images/irt-vsat-image7.png",
    help: "Locate the correct shipping account for the true consignee.",
    choices: [
      {
        label: "Continue",
        next: "irt_rio_update_consignee",
        icon: "fa-solid fa-arrow-right",
        desc: "Enter account and auto-rate."
      }
    ]
  },

  irt_rio_update_consignee: {
    text: "Enter the correct account number in the consignee field and AUTO RATE.",
    image: "guides/PAUD%20Guides/irt-vsat-guide/images/irt-vsat-image8.png",
    help: "Update the consignee with the correct account number and re-rate the bill.",
    choices: [
      {
        label: "Final Recommendation",
        next: "irt_rio_no_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply CORR ACCR."
      }
    ]
  },

  irt_rio_no_final: {
    text: "Correction code is ACCR. Click ACCEPT ALL.",
    help: "Apply CORR ACCR and Accept All F6 to post.",
    choices: []
  },

  /* ==================== OPTION 3: HINO ==================== */

  irt_hino_sample: {
    text: "HINO sample:",
    image: "guides/PAUD%20Guides/irt-vsat-guide/images/irt-vsat-image9.png",
    help: "Review the HINO sample before proceeding.",
    choices: [
      {
        label: "Continue",
        next: "irt_hino_review_bol",
        icon: "fa-solid fa-arrow-right",
        desc: "Review BOL for account."
      }
    ]
  },

  irt_hino_review_bol: {
    text: "Review BOL for correct bill to account number. Confirm if Hino is the shipper or consignee and update terms if needed.",
    help: "Check the BOL to determine Hino's role and the correct bill-to account.",
    choices: [
      {
        label: "Continue",
        next: "irt_hino_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply final recommendation."
      }
    ]
  },

text: "• A. If BOL states Hino % CH Robinson (CHRLTL), bill to account 848647918 should be used. CORR ACCR\n\n• B. If currently billing per the Bill of lading, use CORR VRFY and ACCEPT ALL.\n\n• C. BOL has BT code which name & address are same as the Consignee's but no %, we used the account # provided.",

};
