/* =========================================================
   RATE & VOLUME QUOTE GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "rate-volume-guide",
  title: "Rate & Volume Quote Guide",
  startNode: "start",
  templateCollection: "rate_volume_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Rate Application per BOL Guide",
    help: "Use this guide to validate LTL Quote or Volume Quote handling based on the quote noted per BOL.",
    note: "Always review the BOL, ACCOPS, quote details, shipment details, and applicable system updates before deciding the next action.",
    choices: [
      {
        label: "Continue",
        next: "rate_volume_intro",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Rate Application per BOL decision flow."
      }
    ]
  },

  rate_volume_intro: {
    text: "What quote is noted per BOL?",
    choices: [
      {
        label: "LTL Quote",
        next: "ltl_noted_check",
        icon: "fa-solid fa-file-invoice-dollar",
        desc: "BOL shows an LTL Quote."
      },
      {
        label: "Volume Quote",
        next: "volume_noted_check",
        icon: "fa-solid fa-boxes-stacked",
        desc: "BOL shows a Volume Quote."
      }
    ]
  },

  /* ================= LTL FLOW ================= */

  ltl_noted_check: {
    text: "Is the LTL Rate Quote noted on BOL?",
    choices: [
      {
        label: "Yes",
        next: "check_capl_keyword",
        icon: "fa-solid fa-circle-check",
        desc: "LTL Rate Quote is noted on BOL."
      },
      {
        label: "No",
        next: "final_ltl_not_noted_result",
        icon: "fa-solid fa-circle-xmark",
        desc: "LTL Rate Quote is not noted on BOL."
      }
    ]
  },

  final_ltl_not_noted_result: {
    text: "Advise customer that LTL rate quote cannot be applied since not noted on BOL. See sample templates response on OS.",
    choices: []
  },

  check_capl_keyword: {
    text: "Check if Pro has CAPL keyword.",
    choices: [
      {
        label: "Yes",
        next: "final_move_to_inspection_review",
        icon: "fa-solid fa-circle-check",
        desc: "PRO has CAPL keyword."
      },
      {
        label: "No",
        next: "class_match_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "PRO does not have CAPL keyword."
      }
    ]
  },

  final_move_to_inspection_review: {
    text: "Move to Inspection Review.",
    choices: []
  },

  class_match_check: {
    text: "Access the LTL Rate Quote ID in ACCOPS. Is the CLASS match on the FBC/FBI?",
    choices: [
      {
        label: "Yes",
        next: "weight_match_check",
        icon: "fa-solid fa-circle-check",
        desc: "CLASS matches on the FBC/FBI."
      },
      {
        label: "No",
        next: "pro_inspected_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "CLASS does not match on the FBC/FBI."
      }
    ]
  },

  pro_inspected_check: {
    text: "Is the Pro inspected?",
    choices: [
      {
        label: "Yes",
        next: "final_reclass_result",
        icon: "fa-solid fa-circle-check",
        desc: "PRO was inspected."
      },
      {
        label: "No",
        next: "update_class_per_bol",
        icon: "fa-solid fa-circle-xmark",
        desc: "PRO was not inspected."
      }
    ]
  },

  final_reclass_result: {
    text: "Advise customer that quote cannot be applied due to reclassification since the shipment was inspected. If disputing re-class, clone the case and move parent case to Inspection Review.",
    choices: []
  },

  update_class_per_bol: {
    text: "Update class per BOL. Does rate match in ACCOPS after update?",
    choices: [
      {
        label: "Yes",
        next: "final_invoice_updated_result",
        icon: "fa-solid fa-circle-check",
        desc: "Rate matches in ACCOPS after update."
      },
      {
        label: "No",
        next: "weight_match_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Rate does not match in ACCOPS after update."
      }
    ]
  },

  weight_match_check: {
    text: "Does the weight in ACCOPS match the Pro?",
    choices: [
      {
        label: "Yes",
        next: "zip_match_check",
        icon: "fa-solid fa-circle-check",
        desc: "Weight in ACCOPS matches the PRO."
      },
      {
        label: "No",
        next: "reweigh_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Weight in ACCOPS does not match the PRO."
      }
    ]
  },

  reweigh_check: {
    text: "Was the Pro reweighed?",
    choices: [
      {
        label: "Yes",
        next: "final_reweigh_result",
        icon: "fa-solid fa-circle-check",
        desc: "PRO was reweighed."
      },
      {
        label: "No",
        next: "update_weight_per_bol",
        icon: "fa-solid fa-circle-xmark",
        desc: "PRO was not reweighed."
      }
    ]
  },

  final_reweigh_result: {
    text: "Advise customer that quote cannot be applied due to new reweighed weight. If disputing, clone case and move parent case to Reweigh Review.",
    choices: []
  },

  update_weight_per_bol: {
    text: "Update weight per BOL. Does rate match in ACCOPS after update?",
    choices: [
      {
        label: "Yes",
        next: "final_invoice_updated_result",
        icon: "fa-solid fa-circle-check",
        desc: "Rate matches in ACCOPS after update."
      },
      {
        label: "No",
        next: "zip_match_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Rate does not match in ACCOPS after update."
      }
    ]
  },

  zip_match_check: {
    text: "Do shipper and consignee zip codes match ACCOPS?",
    choices: [
      {
        label: "Yes",
        next: "debtor_match_check",
        icon: "fa-solid fa-circle-check",
        desc: "Shipper and consignee zip codes match ACCOPS."
      },
      {
        label: "No",
        next: "final_zip_mismatch_result",
        icon: "fa-solid fa-circle-xmark",
        desc: "Shipper and consignee zip codes do not match ACCOPS."
      }
    ]
  },

  final_zip_mismatch_result: {
    text: "Advise customer that quote cannot be applied due to different pickup/delivery zip code than quoted.",
    choices: []
  },

  debtor_match_check: {
    text: "Does the debtor on ACCOPS match the Pro?",
    choices: [
      {
        label: "Yes",
        next: "accessorial_check",
        icon: "fa-solid fa-circle-check",
        desc: "Debtor on ACCOPS matches the PRO."
      },
      {
        label: "No",
        next: "billing_correct_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Debtor on ACCOPS does not match the PRO."
      }
    ]
  },

  billing_correct_check: {
    text: "Is the Pro billed correctly per BOL?",
    choices: [
      {
        label: "Yes",
        next: "final_billing_updated_result",
        icon: "fa-solid fa-circle-check",
        desc: "PRO is billed correctly per BOL."
      },
      {
        label: "No",
        next: "final_update_bill_autorate",
        icon: "fa-solid fa-circle-xmark",
        desc: "PRO is not billed correctly per BOL."
      }
    ]
  },

  final_billing_updated_result: {
    text: "Billing updated to correct party per BOL.",
    choices: []
  },

  final_update_bill_autorate: {
    text: "Update bill per BOL then autorate. If rate matches, advise customer. If not, move to Pricing.",
    choices: []
  },

  accessorial_check: {
    text: "Do linehaul and fuel match the quote ID?",
    choices: [
      {
        label: "Yes",
        next: "final_invoice_rated_correctly",
        icon: "fa-solid fa-circle-check",
        desc: "Linehaul and fuel match the quote ID."
      },
      {
        label: "No",
        next: "service_level_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Linehaul and fuel do not match the quote ID."
      }
    ]
  },

  final_invoice_rated_correctly: {
    text: "Advise customer invoice is rated correctly per quote ID noted on BOL.",
    choices: []
  },

  service_level_check: {
    text: "What is the current service level?",
    choices: [
      {
        label: "Economy",
        next: "final_move_to_pricing_result",
        icon: "fa-solid fa-truck",
        desc: "Current service level is Economy."
      },
      {
        label: "Priority",
        next: "attempt_update_economy",
        icon: "fa-solid fa-truck-fast",
        desc: "Current service level is Priority."
      }
    ]
  },

  attempt_update_economy: {
    text: "Attempt update to Economy. Does rate match after update?",
    choices: [
      {
        label: "Yes",
        next: "final_service_updated_success",
        icon: "fa-solid fa-circle-check",
        desc: "Rate matches after update."
      },
      {
        label: "No",
        next: "final_move_to_pricing_result",
        icon: "fa-solid fa-circle-xmark",
        desc: "Rate does not match after update."
      }
    ]
  },

  final_service_updated_success: {
    text: "Proceed with updating service level to Economy and advise customer that quote ID has been applied.",
    choices: []
  },

  final_invoice_updated_result: {
    text: "Invoice updated to apply correct rate per quote ID noted on BOL.",
    choices: []
  },

  final_move_to_pricing_result: {
    text: "Move case to Pricing 10 Pros or less subqueue due to rate mismatch per quote noted on BOL.",
    choices: []
  },

  /* ================= VOLUME FLOW ================= */

  volume_noted_check: {
    text: "Is the Volume quote noted on BOL?",
    choices: [
      {
        label: "Yes",
        next: "volume_minimum_check",
        icon: "fa-solid fa-circle-check",
        desc: "Volume quote is noted on BOL."
      },
      {
        label: "No",
        next: "customer_requested_tls_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Volume quote is not noted on BOL."
      }
    ]
  },

  customer_requested_tls_check: {
    text: "Did customer request Volume/TLS rate to apply?",
    choices: [
      {
        label: "Yes",
        next: "pull_volume_quote",
        icon: "fa-solid fa-circle-check",
        desc: "Customer requested Volume/TLS rate to apply."
      },
      {
        label: "No",
        next: "final_tls_apply_result",
        icon: "fa-solid fa-circle-xmark",
        desc: "Customer did not request Volume/TLS rate to apply."
      }
    ]
  },

  final_tls_apply_result: {
    text: "Advise customer that TLS rate will apply as charge fee per FXF 100 Rules Tariff Item 759.",
    choices: []
  },

  volume_minimum_check: {
    text: "Does shipment meet minimum 2,500 lbs or 7 linear feet?",
    choices: [
      {
        label: "Yes",
        next: "pull_volume_quote",
        icon: "fa-solid fa-circle-check",
        desc: "Shipment meets minimum 2,500 lbs or 7 linear feet."
      },
      {
        label: "No",
        next: "final_volume_below_minimum_result",
        icon: "fa-solid fa-circle-xmark",
        desc: "Shipment does not meet minimum requirement."
      }
    ]
  },

  final_volume_below_minimum_result: {
    text: "Volume Quote should not apply if below 2,500 lbs or 7 linear ft. Advise customer.",
    choices: []
  },

  pull_volume_quote: {
    text: "Do origin and destination zip codes (or service center IDs) match the Volume quote?",
    choices: [
      {
        label: "Yes",
        next: "shipment_date_check",
        icon: "fa-solid fa-circle-check",
        desc: "Origin and destination zip codes or service center IDs match the Volume quote."
      },
      {
        label: "No",
        next: "final_volume_zip_mismatch_result",
        icon: "fa-solid fa-circle-xmark",
        desc: "Origin and destination zip codes or service center IDs do not match the Volume quote."
      }
    ]
  },

  final_volume_zip_mismatch_result: {
    text: "Advise customer that Volume quote cannot apply due to origin/destination zip mismatch.",
    choices: []
  },

  shipment_date_check: {
    text: "Is shipment date within quote effective date range?",
    choices: [
      {
        label: "Yes",
        next: "volume_weight_linear_check",
        icon: "fa-solid fa-circle-check",
        desc: "Shipment date is within quote effective date range."
      },
      {
        label: "No",
        next: "final_volume_date_outside_result",
        icon: "fa-solid fa-circle-xmark",
        desc: "Shipment date is outside quote effective date range."
      }
    ]
  },

  final_volume_date_outside_result: {
    text: "Advise customer shipment date falls outside effective quote date.",
    choices: []
  },

  volume_weight_linear_check: {
    text: "Is weight and linear feet within quoted range?",
    choices: [
      {
        label: "Yes",
        next: "final_apply_volume_quote",
        icon: "fa-solid fa-circle-check",
        desc: "Weight and linear feet are within quoted range."
      },
      {
        label: "No",
        next: "final_overflow_charges_result",
        icon: "fa-solid fa-circle-xmark",
        desc: "Weight and linear feet are outside quoted range."
      }
    ]
  },

  final_overflow_charges_result: {
    text: "Quote applies plus overflow charges. Calculate overflow using overflow calculator.",
    choices: []
  },

  final_apply_volume_quote: {
    text: "Access Volume quote application and apply Volume quote.",
    textHtml: `Access Volume quote application and apply Volume quote.<br><br><a href="guides/Other%20Guides/volume-application/volume-application.html" target="_blank" rel="noopener noreferrer" class="guide-link" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:999px; background:linear-gradient(135deg,#4d148c,#6d28d9); color:#fff; font-weight:800; font-size:12px; text-decoration:none;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open Volume Quote Application</a>`,
    choices: []
  }

};
