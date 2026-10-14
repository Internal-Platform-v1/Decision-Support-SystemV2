/* =========================================================
   SHAVE A DAY GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "shave-a-day-guide",
  title: "Shave a Day Guide / Early Delivery Fee",
  startNode: "start",
  templateCollection: "shave_a_day_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Shave a Day/Early Delivery Fee - Handling Guide",
    help: "Use this guide to validate SHAD fee disputes and service level upgrade requests from Economy to Priority.",
    note: "Always review the BOL, service level, delivery status, LOA request, and whether the SHAD fee was correctly applied before deciding the next action.",
    choices: [
      {
        label: "Continue",
        next: "shad_intro",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Shave a Day decision flow."
      }
    ]
  },

  shad_intro: {
    text: "What is the customer's concern?",
    choices: [
      {
        label: "Asking what the fee is for",
        next: "final_shad_fee_explanation",
        icon: "fa-solid fa-circle-question",
        desc: "Customer is asking why the SHAD fee was applied."
      },
      {
        label: "SHAD fee Dispute",
        next: "loa_request_check",
        icon: "fa-solid fa-file-circle-exclamation",
        desc: "Customer is disputing the SHAD fee."
      },
      {
        label: "Upgrade the service type to PRIORITY",
        next: "shipment_delivered_check",
        icon: "fa-solid fa-truck-fast",
        desc: "Customer is requesting service type update from Economy to Priority."
      }
    ]
  },

  /* ================= SHAD FEE EXPLANATION ================= */

  final_shad_fee_explanation: {
    text: "SHAVE A DAY fee is applied when the service level is upgraded from ECONOMY to PRIORITY. Per Rules Tariff, this is also referred to as Early Delivery.",
    choices: []
  },

  /* ================= SHAD FEE DISPUTE FLOW ================= */

  loa_request_check: {
    text: "Is there a LOA requesting for Early delivery or to update the service level from ECON to PRIO?",
    choices: [
      {
        label: "Yes",
        next: "final_shad_fee_valid_with_loa",
        icon: "fa-solid fa-circle-check",
        desc: "LOA is available requesting Early Delivery or service level update to Priority."
      },
      {
        label: "No",
        next: "final_remove_shad_fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "No LOA is available requesting Early Delivery or service level update to Priority."
      }
    ]
  },

  final_shad_fee_valid_with_loa: {
    text: "If a LOA on file is available stating to update the service level from ECONOMY to PRIORITY, then the Shave a Day fee is valid.",
    choices: []
  },

  final_remove_shad_fee: {
    text: "SHAD fee is not valid. Remove the fee.",
    choices: []
  },

  /* ================= SERVICE TYPE UPGRADE FLOW ================= */

  shipment_delivered_check: {
    text: "Is the shipment already delivered?",
    choices: [
      {
        label: "Yes",
        next: "final_no_longer_eligible_for_upgrade",
        icon: "fa-solid fa-circle-check",
        desc: "Shipment has already been delivered."
      },
      {
        label: "No",
        next: "bol_economy_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Shipment has not been delivered yet."
      }
    ]
  },

  final_no_longer_eligible_for_upgrade: {
    text: "No longer eligible for the upgrade.",
    choices: []
  },

  bol_economy_check: {
    text: "Was the service type noted on BOL ECONOMY?",
    choices: [
      {
        label: "Yes",
        next: "final_update_to_priority_add_shad",
        icon: "fa-solid fa-circle-check",
        desc: "Service type noted on BOL is Economy."
      },
      {
        label: "No",
        next: "final_update_to_priority_per_bol",
        icon: "fa-solid fa-circle-xmark",
        desc: "Service type noted on BOL is not Economy."
      }
    ]
  },

  final_update_to_priority_add_shad: {
    text: "The invoice is eligible to be updated to PRIORITY. Make sure to add SHAD fee.",
    choices: []
  },

  final_update_to_priority_per_bol: {
    text: "If PRIORITY was noted on BOL, update the service type to PRIORITY per BOL.",
    choices: []
  }

};
