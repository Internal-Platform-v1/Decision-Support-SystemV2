/* =========================================================
   PEAK SURCHARGE FEE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "peak-surcharge-fee",
  title: "Peak Surcharge Fee",
  startNode: "start",
  templateCollection: "peak_surcharge_fee_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Check Shipment Date",
    help: "Start by confirming whether the shipment falls within the surcharge period.",
    choices: [
      {
        label: "Continue",
        next: "surcharge_period_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to validate the shipment date."
      }
    ]
  },

  surcharge_period_check: {
    text: "Is the shipment within the surcharge period (July 5, 2021 onward)?",
    help: "Check whether the shipment date falls within the applicable Peak/Demand surcharge period.",
    choices: [
      {
        label: "Yes",
        next: "verify_bol_zip",
        icon: "fa-solid fa-circle-check",
        desc: "The shipment is within the surcharge period."
      },
      {
        label: "No",
        next: "no_peak_surcharge",
        icon: "fa-solid fa-circle-xmark",
        desc: "The shipment is outside the surcharge period."
      }
    ]
  },

  no_peak_surcharge: {
    text: "No Peak/Demand Surcharge applicable.",
    help: "The surcharge does not apply because the shipment is outside the effective period.",
    choices: []
  },

  verify_bol_zip: {
    text: "Verify Zip Code BOL (Shipper/Consignee)",
    help: "Review the BOL and confirm the shipper or consignee ZIP code.",
    choices: [
      {
        label: "Continue",
        next: "zip_correct_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after reviewing the BOL ZIP code."
      }
    ]
  },

  zip_correct_check: {
    text: "Is ZIP correct?",
    help: "Confirm whether the ZIP code listed on the shipment is correct.",
    choices: [
      {
        label: "Yes",
        next: "check_peak_zip_list",
        icon: "fa-solid fa-circle-check",
        desc: "The ZIP code is correct."
      },
      {
        label: "No",
        next: "google_verify_zip",
        icon: "fa-solid fa-circle-xmark",
        desc: "The ZIP code needs to be corrected."
      }
    ]
  },

  google_verify_zip: {
    text: "Google Search / Verify correct ZIP Code",
    help: "Search and confirm the correct ZIP code before continuing.",
    choices: [
      {
        label: "Continue",
        next: "update_zip_fbc",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after identifying the correct ZIP code."
      }
    ]
  },

  update_zip_fbc: {
    text: "Updated correct ZIP in FBC",
    help: "Update the corrected ZIP code in FBC, then continue the review.",
    choices: [
      {
        label: "Continue",
        next: "check_peak_zip_list",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after updating the ZIP code."
      }
    ]
  },

  check_peak_zip_list: {
    text: "Check Zip against Demand/Peak ZIP list",
    help: "Validate the shipment ZIP against the applicable Demand/Peak ZIP list.",
    choices: [
      {
        label: "Continue",
        next: "zip_listed_tariff_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after reviewing the ZIP list."
      }
    ]
  },

  zip_listed_tariff_check: {
    text: "Is ZIP listed in the FXF Tariff Item 380?",
    help: "Confirm whether the ZIP is included in the current FXF Demand/Peak surcharge list.",
    noteHtml: `<a href="https://www.fedex.com/en-us/shipping/rate-changes/demand-surcharges.html" target="_blank" rel="noopener noreferrer" style="color:#1d4ed8; font-weight:900; text-decoration:none;">📄 Open FXF Tariff Item 380</a>`,
    choices: [
      {
        label: "Yes",
        next: "reconsigned_check",
        icon: "fa-solid fa-circle-check",
        desc: "The ZIP is listed in Tariff Item 380."
      },
      {
        label: "No",
        next: "removed_demand_zip_not_listed",
        icon: "fa-solid fa-circle-xmark",
        desc: "The ZIP is not listed in Tariff Item 380."
      }
    ]
  },

  removed_demand_zip_not_listed: {
    text: "Removed Demand Surcharge (CORR SYSM)",
    help: "Remove the surcharge because the ZIP is not listed in Tariff Item 380.",
    note: "VS-ACCS-CASE#-REMOVED DEMAND SURCHARGE PER ZIP NOT LISTED ON TARIFF ITEM-380",
    choices: []
  },

  reconsigned_check: {
    text: "Was the shipment reconsigned?",
    help: "Check whether the shipment was reconsigned.",
    choices: [
      {
        label: "Yes",
        next: "removed_demand_reconsigned",
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

  removed_demand_reconsigned: {
    text: "Removed Demand Surcharge",
    help: "Final handling instruction reached.",
    choices: []
  },

  dock_pickup_check: {
    text: "Was the shipment dock picked up?",
    help: "Check whether the shipment was handled as dock pickup.",
    choices: [
      {
        label: "Yes",
        next: "demand_valid_dock_pickup",
        icon: "fa-solid fa-circle-check",
        desc: "The shipment was dock pickup."
      },
      {
        label: "No",
        next: "determine_tier_classification",
        icon: "fa-solid fa-circle-xmark",
        desc: "The shipment was not dock pickup."
      }
    ]
  },

  demand_valid_dock_pickup: {
    text: "Demand Surcharge is valid",
    help: "The surcharge is valid for this shipment.",
    choices: []
  },

  determine_tier_classification: {
    text: "Determine Tier Classification",
    help: "Identify the applicable Peak/Demand surcharge tier.",
    choices: [
      {
        label: "Continue",
        next: "verify_charge_code",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after determining the surcharge tier."
      }
    ]
  },

  verify_charge_code: {
    text: "Verify Charge Code (Peak / DS Keyword)",
    help: "Review the Peak or Demand surcharge code applied to the shipment.",
    choices: [
      {
        label: "Continue",
        next: "duplicate_or_incorrect_tier_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after reviewing the charge code."
      }
    ]
  },

  duplicate_or_incorrect_tier_check: {
    text: "Is surcharge duplicated or incorrect tier?",
    help: "Confirm whether the surcharge is duplicated or the wrong tier was used.",
    choices: [
      {
        label: "Yes",
        next: "remove_correct_surcharge",
        icon: "fa-solid fa-circle-check",
        desc: "The surcharge is duplicated or incorrect."
      },
      {
        label: "No",
        next: "fee_valid_leave_charge",
        icon: "fa-solid fa-circle-xmark",
        desc: "The surcharge is valid."
      }
    ]
  },

  remove_correct_surcharge: {
    text: "Remove / Correct Surcharge (CORR SYSM)",
    help: "Remove or correct the invalid surcharge.",
    note: "VS-ACCS-CASE#-REMOVED DUPLICATE DEMAND SURCHARGE",
    choices: []
  },

  fee_valid_leave_charge: {
    text: "The fee is valid. Leave the charge and advise the customer accordingly.",
    help: "The surcharge is valid and should remain on the shipment.",
    note: "VS-ACCS-CASE#-DEMAND SURCHARGE VALID PER ZIP LIST",
    choices: []
  }

};
