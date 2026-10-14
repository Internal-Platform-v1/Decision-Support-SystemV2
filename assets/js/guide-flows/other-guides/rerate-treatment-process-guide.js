/* =========================================================
   RERATE TREATMENT PROCESS GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "rerate-treatment-process-guide",
  title: "Rerate Treatment Process Guide",
  startNode: "start",
  templateCollection: "rerate_treatment_process_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Rerate Treatment Process Guide",
    help: "Use this guide to determine the correct rerate treatment based on PRO age (Less than a Year and Over a Year Shipment), pricing involvement, debtor/account update requests, billing errors, LOA rebill requests, and surcharge handling.",
    note: "Always confirm the PRO age, case reason, pricing status, requested correction type, billing accuracy, LOA support, and whether the request affects rate, debtor, account, shipment details, or surcharges before proceeding.",
    choices: [
      {
        label: "Continue",
        next: "pro_less_than_year_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Rerate Treatment Process decision flow."
      }
    ]
  },

  pro_less_than_year_check: {
    text: "Is the Pro less than a year old?",
    help: "Check the age of the PRO before proceeding.",
    choices: [
      {
        label: "Yes",
        next: "final_less_than_year_guidelines",
        icon: "fa-solid fa-circle-check",
        desc: "PRO is less than a year old."
      },
      {
        label: "No",
        next: "pro_more_than_year_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "PRO is not less than a year old."
      }
    ]
  },

  final_less_than_year_guidelines: {
    text: "If Pricing is pulled, proceed with the correction. If default applies, still proceed with the correction. Let the customer dispute for the rates on a different case. If the case reopens because the customer is disputing the rates, advise them to create a new case for the new dispute. Once received, move the new case to Pricing Sub queue.",
    help: "Follow the less-than-a-year guidelines for pricing and default rates.",
    choices: []
  },

  pro_more_than_year_check: {
    text: "Is the Pro more than a Year Shipment?",
    help: "Confirm that the PRO is more than a year old before continuing.",
    choices: [
      {
        label: "Yes",
        next: "different_debtor_over_year_check",
        icon: "fa-solid fa-circle-check",
        desc: "PRO is more than a year old."
      },
      {
        label: "No",
        next: "final_less_than_year_guidelines_from_more_than_year",
        icon: "fa-solid fa-circle-xmark",
        desc: "PRO is not more than a year old."
      }
    ]
  },

  final_less_than_year_guidelines_from_more_than_year: {
    text: "If pro is less than a year then follow below guidelines. If Pricing is pulled, proceed with the correction. If default applies, still proceed with the correction. Let the customer dispute for the rates on a different case. If the case reopens because the customer is disputing the rates, advise them to create a new case for the new dispute. Once received, move the new case to Pricing Sub queue.",
    help: "Follow the less-than-a-year guidelines when the PRO is not over a year old.",
    choices: []
  },

  different_debtor_over_year_check: {
    text: "Is the request to bill a different debtor due to incorrect billing for over a year?",
    help: "Determine whether the request is to bill a different debtor due to incorrect billing over a year old.",
    choices: [
      {
        label: "Yes",
        next: "final_submit_writeoff_totalsat",
        icon: "fa-solid fa-circle-check",
        desc: "Request is to bill a different debtor due to incorrect billing for over a year."
      },
      {
        label: "No",
        next: "update_account_same_debtor_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Request is not to bill a different debtor due to incorrect billing for over a year."
      }
    ]
  },

  final_submit_writeoff_totalsat: {
    text: "Submit a write-off using the TOTALSAT reason. Send the write-off request to your supervisor for amounts under $2,000.00. For amounts over $2,000.00, use the write-off form for FedEx manager approval.",
    help: "Submit write-off using the TOTALSAT reason with the correct approval path.",
    choices: []
  },

  update_account_same_debtor_check: {
    text: "Is the request to update the account, or to bill the same debtor using a better account?",
    help: "Determine whether the request involves updating the account or billing the same debtor on a better account.",
    choices: [
      {
        label: "Yes",
        next: "pricing_fall_off_check",
        icon: "fa-solid fa-circle-check",
        desc: "Request is to update the account or bill the same debtor using a better account."
      },
      {
        label: "No",
        next: "billing_errors_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Request is not to update the account or bill the same debtor using a better account."
      }
    ]
  },

  pricing_fall_off_check: {
    text: "Did the pricing fall off (Default Rates)?",
    help: "Check whether the pricing fell off and default rates now apply.",
    choices: [
      {
        label: "Yes",
        next: "final_move_pricing_small_queue",
        icon: "fa-solid fa-circle-check",
        desc: "Pricing fell off or default rates apply."
      },
      {
        label: "No",
        next: "final_proceed_with_update",
        icon: "fa-solid fa-circle-xmark",
        desc: "Pricing did not fall off."
      }
    ]
  },

  final_move_pricing_small_queue: {
    text: "Move to case to Pricing Small Queue.",
    help: "Move the case to the Pricing Small Queue.",
    choices: []
  },

  final_proceed_with_update: {
    text: "Proceed with the update.",
    help: "Proceed with the requested account update.",
    choices: []
  },

  billing_errors_check: {
    text: "Does this request involve correcting billing errors for the items listed such as class, weight, service level, etc.?",
    help: "Determine whether the request involves correcting listed billing errors.",
    choices: [
      {
        label: "Yes",
        next: "final_correct_billing_errors",
        icon: "fa-solid fa-circle-check",
        desc: "Request involves correcting billing errors."
      },
      {
        label: "No",
        next: "loa_rebill_correct_billing_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Request does not involve correcting listed billing errors."
      }
    ]
  },

  final_correct_billing_errors: {
    text: "Proceed with the correction per the BOL if pricing appears after autorating the PRO. If no discount is applied after autorating, move the case to the small pricing queue.",
    help: "Correct billing per BOL if pricing appears; otherwise move to small pricing queue.",
    choices: []
  },

  loa_rebill_correct_billing_check: {
    text: "Is the PRO billed correctly, and is the request to rebill per LOA?",
    help: "Determine whether the PRO is billed correctly and the request is a standard LOA rebill.",
    choices: [
      {
        label: "Yes",
        next: "final_process_rebill_per_loa",
        icon: "fa-solid fa-circle-check",
        desc: "PRO is billed correctly and request is to rebill per LOA."
      },
      {
        label: "No",
        next: "surcharge_rebill_per_loa",
        icon: "fa-solid fa-circle-xmark",
        desc: "PRO is not billed correctly or request is not a standard LOA rebill."
      }
    ]
  },

  final_process_rebill_per_loa: {
    text: "Process the request and autorate the PRO. If the rates appear after autorating, proceed with the request. However, if pricing falls off, move the case to the small pricing queue. Provide detailed internal comments explaining why the case was moved to the pricing small queue.",
    help: "Autorate the PRO; if pricing falls off, move to small pricing queue with detailed comments.",
    choices: []
  },

  surcharge_rebill_per_loa: {
    text: "Request is to rebill surcharges per LOA.",
    help: "Continue with surcharge rebill handling per LOA.",
    choices: [
      {
        label: "Continue",
        next: "final_attempt_autorate_surcharge_rebill",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with surcharge rebill handling."
      }
    ]
  },

  final_attempt_autorate_surcharge_rebill: {
    text: "Attempt to auto-rate the PRO and ensure that the existing discount remains on the PRO. If the rates stay the same, proceed with the surcharge rebill per LOA. However, if the discount is removed or pricing changes, do not proceed with the rebill. Instead, move the case to the small pricing queue and provide detailed internal comments explaining why the case was moved to the small pricing queue.",
    help: "Autorate and preserve discount; if discount removed or pricing changes, move to small pricing queue.",
    choices: []
  }

};
