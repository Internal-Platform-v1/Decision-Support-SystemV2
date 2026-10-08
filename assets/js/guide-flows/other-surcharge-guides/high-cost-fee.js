/* =========================================================
   HIGH COST FEE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "high-cost-fee",
  title: "High Cost Fee",
  startNode: "start",
  templateCollection: "high_cost_fee_template"
};

window.GUIDE_NODES = {

  start: {
    text: "High-Cost Fee Guide",
    help: "Use this guide to determine whether the High-Cost Fee is valid, needs to be updated, or should be removed.",
    choices: [
      {
        label: "Continue",
        next: "check_bol_zip",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the High-Cost Fee guide."
      }
    ]
  },

  check_bol_zip: {
    text: "Check BOL ZIP Codes",
    help: "Review the ZIP codes listed on the BOL before validating the High-Cost Fee.",
    choices: [
      {
        label: "Continue",
        next: "zip_correct",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to ZIP code validation."
      }
    ]
  },

  zip_correct: {
    text: "Is ZIP CODE Correct?",
    help: "Confirm whether the ZIP code on the shipment is correct.",
    choices: [
      {
        label: "Yes",
        next: "check_tariff_zip_list",
        icon: "fa-solid fa-circle-check",
        desc: "The ZIP code is correct."
      },
      {
        label: "No",
        next: "find_correct_zip",
        icon: "fa-solid fa-circle-xmark",
        desc: "The ZIP code is not correct."
      }
    ]
  },

  check_tariff_zip_list: {
    text: "Check Rules Tariff Item 747 ZIP list",
    help: "Use the official High Cost Service Area ZIP list to confirm whether the ZIP is included.",
    noteHtml: `<a href="https://www.fedex.com/content/dam/fedex/us-united-states/services/High_Cost_Service_Area_ZIPs.pdf" target="_blank" rel="noopener noreferrer" style="color:#1d4ed8; font-weight:900; text-decoration:none;">📄 High Cost Service Area ZIPs PDF</a>`,
    choices: [
      {
        label: "Continue",
        next: "zip_listed_high_cost",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after reviewing the tariff ZIP list."
      }
    ]
  },

  find_correct_zip: {
    text: "Find correct ZIP – Continue",
    help: "Identify the correct ZIP code first, then continue the review.",
    choices: [
      {
        label: "Continue",
        next: "zip_listed_high_cost",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after correcting the ZIP code."
      }
    ]
  },

  zip_listed_high_cost: {
    text: "Is ZIP listed under High Cost Service Area?",
    help: "Check whether the corrected or confirmed ZIP appears in the High Cost Service Area ZIP list.",
    choices: [
      {
        label: "Yes",
        next: "determine_tier",
        icon: "fa-solid fa-circle-check",
        desc: "The ZIP is listed under the High Cost Service Area."
      },
      {
        label: "No",
        next: "remove_high_cost_corr",
        icon: "fa-solid fa-circle-xmark",
        desc: "The ZIP is not listed under the High Cost Service Area."
      }
    ]
  },

  remove_high_cost_corr: {
    text: "Remove High Cost Fee (CORR SYSM)",
    help: "The ZIP is not listed in Rules Tariff 747, so the High Cost Fee should be removed.",
    note: "VS-ACCS-CASE#-REMOVED HIGH COST SERVICE FEE PER ZIP CODE NOT LISTED ON RULES TARIFF 747",
    choices: [
      {
        label: "Continue",
        next: "manual_remove_high_cost",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to manual update instructions."
      }
    ]
  },

  manual_remove_high_cost: {
    text: "Manually remove the high cost fee and do not auto rate the PRO and manually update the Fuel rates.",
    help: "Use the formulas below when manually updating the shipment amount.",
    note: "Rated as (amount) - discount = Total Amount * Fuel Percentage = Transport Fuel Surcharge\n\nBase Rate - discount = Total Amount * Fuel Percentage = Transport Fuel Surcharge",
    choices: []
  },

  determine_tier: {
    text: "Determine Tier level for Origin and/or Destination",
    help: "Identify the applicable High Cost Service Fee tier based on the shipment origin and/or destination ZIP.",
    choices: [
      {
        label: "Continue",
        next: "verify_tier_charges",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to review the applicable tier charges."
      }
    ]
  },

  verify_tier_charges: {
    text: "Verify Tier Charges (Tier 1 - 4)",
    help: "Review the rates and charges for the High Cost Service Area Surcharge per Tier.",
    noteHtml: "<strong>Tier rates:</strong><br>A. Tier 1: $34.00 flat rate<br>B. Tier 2: $68.00 flat rate<br>C. Tier 3: $108.00 flat rate<br>D. Tier 4: $337.00 flat rate",
    choices: [
      {
        label: "Continue",
        next: "reconsigned_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after reviewing the tier charges."
      }
    ]
  },

  reconsigned_check: {
    text: "Was the shipment reconsigned?",
    help: "Check whether the shipment was reconsigned.",
    choices: [
      {
        label: "Yes",
        next: "removed_high_cost_fee",
        icon: "fa-solid fa-circle-check",
        desc: "The shipment was reconsigned."
      },
      {
        label: "No",
        next: "dock_pickup_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "The shipment was not reconsigned."
      }
    ]
  },

  removed_high_cost_fee: {
    text: "Removed the High Cost Fee",
    help: "Final handling instruction reached.",
    choices: []
  },

  dock_pickup_check: {
    text: "Was the shipment dock picked up?",
    help: "Confirm whether the shipment was dock picked up.",
    choices: [
      {
        label: "Yes",
        next: "valid_high_cost_fee",
        icon: "fa-solid fa-circle-check",
        desc: "The shipment was dock picked up."
      },
      {
        label: "No",
        next: "hcd_match_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "The shipment was not dock picked up."
      }
    ]
  },

  hcd_match_check: {
    text: "Does HCD tier billed on invoice match rules tariff?",
    help: "Compare the HCD tier billed on the invoice against the applicable rules tariff.",
    choices: [
      {
        label: "Yes",
        next: "fee_valid_leave_charge",
        icon: "fa-solid fa-circle-check",
        desc: "The billed HCD tier matches the rules tariff."
      },
      {
        label: "No",
        next: "update_tier_keyword",
        icon: "fa-solid fa-circle-xmark",
        desc: "The billed HCD tier does not match the rules tariff."
      }
    ]
  },

  valid_high_cost_fee: {
    text: "Valid High Cost Fee",
    help: "The High Cost Fee is valid and should remain on the shipment.",
    choices: []
  },

  fee_valid_leave_charge: {
    text: "Fee is Valid leave the Charge",
    help: "The High Cost Service Fee is valid per Rules Tariff 747.",
    note: "VS-ACCS-CASE#-HIGH COST SERVICE FEE IS VALID PER RULES TARIFF 747",
    choices: []
  },

  update_tier_keyword: {
    text: "Update Tier / Keyword",
    help: "Update the tier or keyword based on the correct ZIP code listing in Rules Tariff 747.",
    noteHtml: "Example: HC2D → HC1D (CORR SYSM)<br><br>VS-ACCS-CASE#-UPDATED HC2D TO HC1D PER ZIP CODE LISTED IN RULES TARIFF 747",
    choices: []
  }

};
