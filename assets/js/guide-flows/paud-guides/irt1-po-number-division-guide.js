/* =========================================================
   IRT1 – PO NUMBER & DIVISION VALIDATION — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "irt1-po-number-division-guide",
  title: "IRT1 – PO Number & Division Validation",
  startNode: "start",
  templateCollection: "irt1_po_number_division_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "IRT1 - General Guide",
    help: "Use this guide to determine whether the PO number and division information on the BOL are valid and how to update billing terms or account numbers.",
    choices: [
      {
        label: "Continue",
        next: "prepopulated_description",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the IRT1 validation guide."
      }
    ]
  },

  prepopulated_description: {
    text: "The pre‑populated request will already be in the description box:",
    help: "Below is a screenshot of the pre‑filled description as it appears in the system.",
    image: "guides/PAUD%20Guides/irt1-po-number-division-guide/images/prepopulated_description.png",
    choices: [
      {
        label: "Continue",
        next: "review_bol_po_division",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to review the BOL."
      }
    ]
  },

  review_bol_po_division: {
    text: "Review BOL for PO number and division information.",
    help: "Examine the Bill of Lading to locate the PO number and division details.",
    choices: [
      {
        label: "Continue",
        next: "is_valid_update",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to validation step."
      }
    ]
  },

  is_valid_update: {
    text: "Does it validate for updating the PO number and division information?",
    help: "Determine whether the PO and division info on the BOL are correct and can be used.",
    choices: [
      {
        label: "Yes, Valid",
        next: "valid_options",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed to options based on billing scenario."
      },
      {
        label: "No, not valid",
        next: "decline_process",
        icon: "fa-solid fa-circle-xmark",
        desc: "Go directly to Decline process – final recommendation."
      }
    ]
  },

  decline_process: {
    text: "If terms are correct and the PO# was not billed, follow the Decline process – CORR VRFY THE PRO, then you may add the PO# on the reference edit screen.",
    help: "Final recommendation for invalid PO/division. No further steps.",
    images: [
      "guides/PAUD%20Guides/irt1-po-number-division-guide/images/decline_process_step1.png",
      "guides/PAUD%20Guides/irt1-po-number-division-guide/images/decline_process_step2.png"
    ],
    choices: []
  },

  /* ========== YES, VALID – FOUR OPTIONS ========== */

  valid_options: {
    text: "Select the billing scenario that matches the shipment:",
    help: "Choose the appropriate option to proceed with the correct correction steps.",
    choices: [
      {
        label: "Prepaid",
        next: "prepaid_step1",
        icon: "fa-solid fa-truck",
        desc: "Shipment billed as Prepaid."
      },
      {
        label: "Collect",
        next: "collect_step1",
        icon: "fa-solid fa-hand-holding-usd",
        desc: "Shipment billed as Collect."
      },
      {
        label: "3rd Party",
        next: "third_party_step1",
        icon: "fa-solid fa-building",
        desc: "Shipment billed to a 3rd party."
      },
      {
        label: "Terms, BT, and PO# are all entered correctly",
        next: "correct_terms_step1",
        icon: "fa-solid fa-check-double",
        desc: "All fields correct – proceed to verification."
      }
    ]
  },

  /* ---------- PREPAID OPTION ---------- */

  prepaid_step1: {
    text: "If terms are prepaid, change to collect and accept. If system prompts for a correction code, use FEDI. Then pull up PRO on a separate reference edit corrections screen & update the PO#.",
    help: "Step 1 of 3 for Prepaid scenario.",
    choices: [
      {
        label: "Continue",
        next: "prepaid_step2",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to verify shipper account."
      }
    ]
  },

  prepaid_step2: {
    text: "If shipment is prepaid and HD Supply Facilities Maintenance is the shipper, make sure the bill‑to account shows as 420141505. If the billing to account is White Cap account 420139942, update to acct 420141505.",
    help: "Step 2 of 3 for Prepaid scenario. Two screenshots below show the account verification process.",
    images: [
      "guides/PAUD%20Guides/irt1-po-number-division-guide/images/irt1-image-2.png",
      "guides/PAUD%20Guides/irt1-po-number-division-guide/images/irt1-image-3.png"
    ],
    choices: [
      {
        label: "Continue",
        next: "prepaid_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to final recommendation."
      }
    ]
  },

  prepaid_final: {
    text: "If the billing to account is White Cap account 420139942, update to acct 420141505. Accept All / Use correction code CEDI.",
    help: "Final step for Prepaid scenario.",
    image: "guides/PAUD%20Guides/irt1-po-number-division-guide/images/irt1-image-4.png",
    choices: []
  },

  /* ---------- COLLECT OPTION ---------- */

  collect_step1: {
    text: "If PO# matches the MRO/FM/Blue Book division billing, check terms. If the consignee is a HD Supply MRO/FM/Blue Book location, make sure terms are collect to allow correct EDI transmit.",
    help: "Step 1 of 2 for Collect scenario. Two screenshots below illustrate the consignee and terms check.",
    images: [
      "guides/PAUD%20Guides/irt1-po-number-division-guide/images/irt1-image-5.png",
      "guides/PAUD%20Guides/irt1-po-number-division-guide/images/irt1-image-6.png"
    ],
    choices: [
      {
        label: "Continue",
        next: "collect_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to final recommendation."
      }
    ]
  },

  collect_final: {
    text: "Change the terms to Prepaid, say NO when asked if you want to update the Bill‑to Information. Corr Fedi.",
    help: "Final step for Collect scenario.",
    image: "guides/PAUD%20Guides/irt1-po-number-division-guide/images/irt1-image-7.png",
    choices: []
  },

  /* ---------- 3RD PARTY OPTION ---------- */

  third_party_step1: {
    text: "If shipment is a true third party, terms should be prepaid and requires the HD Supply PO#.",
    help: "Step 1 of 3 for 3rd Party scenario.",
    image: "guides/PAUD%20Guides/irt1-po-number-division-guide/images/irt1-image-8.png",
    choices: [
      {
        label: "Continue",
        next: "third_party_step2",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to update PO#."
      }
    ]
  },

  third_party_step2: {
    text: "Put the HD Supply PO in the reference edit.",
    help: "Step 2 of 3 for 3rd Party scenario.",
    image: "guides/PAUD%20Guides/irt1-po-number-division-guide/images/irt1-image-9.png",
    choices: [
      {
        label: "Continue",
        next: "third_party_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to final recommendation."
      }
    ]
  },

  third_party_final: {
    text: "Use correction code FEDI if system prompts for a correction code. Then enter the PO# on the reference edit screen.",
    help: "Final step for 3rd Party scenario.",
    image: "guides/PAUD%20Guides/irt1-po-number-division-guide/images/irt1-image-10.png",
    choices: []
  },

  /* ---------- TERMS, BT, AND PO# ALL CORRECT ---------- */

  correct_terms_step1: {
    text: "If terms, BT, and PO# are all entered correctly, CORR VRFY THE PRO to post the bill.",
    help: "Step 1 of 2 for all‑correct scenario. Three screenshots below show the verification and correction steps.",
    images: [
      "guides/PAUD%20Guides/irt1-po-number-division-guide/images/irt1-image-11.png",
      "guides/PAUD%20Guides/irt1-po-number-division-guide/images/irt1-image-12.png",
      "guides/PAUD%20Guides/irt1-po-number-division-guide/images/irt1-image-13.png"
    ],
    choices: [
      {
        label: "Continue",
        next: "correct_terms_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to final recommendation."
      }
    ]
  },

  correct_terms_final: {
    text: "Follow the Decline process – CORR VRFY THE PRO to post the bill.",
    help: "Final step for all‑correct scenario.",
    image: "guides/PAUD%20Guides/irt1-po-number-division-guide/images/irt1-image-14.png",
    choices: []
  }

};
