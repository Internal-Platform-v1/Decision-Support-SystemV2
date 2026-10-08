/* =========================================================
   CANADIAN SURCHARGE GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "canadian-surcharge-guide",
  title: "Canadian Surcharge Guide",
  startNode: "start",
  templateCollection: "canadian_surcharge_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Canadian Surcharge - Handling Guide",
    help: "Use this guide to review Canadian surcharge disputes, validate ZIP eligibility, check tariff conditions, and determine the correct action.",
    note: "Always review the shipment year, Shipper ZIP, Consignee ZIP, Canadian surcharge ZIP list, BRAP details, and applicable FXF Rules Tariff before making a decision.",
    choices: [
      {
        label: "Continue",
        next: "start_dispute_type",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Canadian Surcharge decision flow."
      }
    ]
  },

  start_dispute_type: {
    text: "What is the customer's dispute?",
    help: "Select the type of Canadian surcharge dispute being reviewed.",
    choices: [
      {
        label: "Rebill",
        next: "final_rebill",
        icon: "fa-solid fa-rotate",
        desc: "Customer is requesting the fee to be rebilled."
      },
      {
        label: "Validity",
        next: "validity_check",
        icon: "fa-solid fa-circle-check",
        desc: "Review whether the Canadian surcharge is valid."
      },
      {
        label: "Rates",
        next: "final_rates",
        icon: "fa-solid fa-percent",
        desc: "Customer is disputing the rate."
      }
    ]
  },

  final_rebill: {
    text: "Advise the customer that the Canadian surcharge cannot be rebilled to a different debtor because it follows the freight terms.",
    choices: []
  },

  final_rates: {
    text: "Move the case to Pricing Small for further review. Make sure to include a complete internal comment.",
    choices: []
  },

  validity_check: {
    text: "Check if the Shipper or Consignee ZIP is included in the Canadian surcharge ZIP list.",
    help: "Review the official Canadian surcharge ZIP reference before proceeding.",
    noteHtml: `If the shipment is not from 2026, use the FXF Rules Tariff that was effective at the time of shipment.<br><br><a href="https://www.fedex.com/content/dam/fedex/us-united-states/services/Freight_Canadian_surcharge_2026.pdf" target="_blank" style="display:inline-flex; align-items:center; gap:6px; margin-top:10px; font-size:12px; font-weight:800; color:#fff; text-decoration:none; padding:8px 14px; border-radius:999px; background:linear-gradient(135deg,#4d148c,#6d28d9); box-shadow:0 6px 14px rgba(77,20,140,.18);"><i class="fa-solid fa-up-right-from-square" style="font-size:11px;"></i> View Canadian Surcharge ZIP List</a>`,
    choices: [
      {
        label: "Continue",
        next: "zip_in_list",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after reviewing the Canadian surcharge ZIP list."
      }
    ]
  },

  zip_in_list: {
    text: "Is the Shipper or Consignee ZIP included in the list?",
    help: "Choose Yes if either the Shipper ZIP or Consignee ZIP is included in the official Canadian surcharge ZIP list.",
    choices: [
      {
        label: "Yes",
        next: "brap_check",
        icon: "fa-solid fa-circle-check",
        desc: "The ZIP is included in the list."
      },
      {
        label: "No",
        next: "final_remove_surcharge",
        icon: "fa-solid fa-circle-xmark",
        desc: "The ZIP is not included in the list."
      }
    ]
  },

  final_remove_surcharge: {
    text: "Remove the Canadian surcharge because the Shipper or Consignee ZIP is not included in the Canadian surcharge ZIP list.",
    choices: []
  },

  brap_check: {
    text: "Does the BRAP in the body of the bill show FXF PZONE, FXF EZONE, or FXF 1100 rate tariffs?",
    help: "Review the BRAP details in the body of the bill before deciding if the fee should be removed or remain valid.",
    choices: [
      {
        label: "Yes",
        next: "final_remove_fee",
        icon: "fa-solid fa-circle-check",
        desc: "The bill shows FXF PZONE, FXF EZONE, or FXF 1100."
      },
      {
        label: "No",
        next: "final_fee_valid",
        icon: "fa-solid fa-circle-xmark",
        desc: "The fee remains valid."
      }
    ]
  },

  final_remove_fee: {
    text: "Remove the fee per FXF Rules Tariff Item 751.",
    choices: []
  },

  final_fee_valid: {
    text: "Advise the customer that the fee is valid because the Shipper or Consignee ZIP is included in the Canadian surcharge ZIP list.",
    choices: []
  }

};
