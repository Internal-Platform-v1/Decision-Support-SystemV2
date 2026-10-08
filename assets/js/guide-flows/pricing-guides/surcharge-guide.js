/* =========================================================
   SURCHARGE GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "surcharge-guide",
  title: "Surcharge Guide",
  startNode: "start",
  templateCollection: "surcharge_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Surcharge Pricing - General Guide",
    help: "Follow this decision flow to validate surcharge billing, account selection, surcharge exceptions, and rerate handling.",
    choices: [
      {
        label: "Continue",
        next: "surcharge_valid_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the surcharge validation flow."
      }
    ]
  },

  surcharge_valid_check: {
    text: "Is the surcharge valid?",
    choices: [
      {
        label: "Yes",
        next: "valid_yes",
        icon: "fa-solid fa-circle-check",
        desc: "Surcharge is valid."
      },
      {
        label: "No",
        next: "final_invalid_remove",
        icon: "fa-solid fa-circle-xmark",
        desc: "Surcharge is invalid."
      }
    ]
  },

  final_invalid_remove: {
    text: "Remove the invalid surcharge and advise the customer accordingly.",
    choices: []
  },

  valid_yes: {
    text: "Is the surcharge billing to the correct party?",
    choices: [
      {
        label: "Yes",
        next: "correct_party",
        icon: "fa-solid fa-circle-check",
        desc: "Surcharge is billed to the correct party."
      },
      {
        label: "No",
        next: "final_update_party",
        icon: "fa-solid fa-circle-xmark",
        desc: "Surcharge is billed to the wrong party."
      }
    ]
  },

  final_update_party: {
    text: "Update the surcharge and bill it to the correct party. Advise the customer accordingly.",
    choices: []
  },

  correct_party: {
    text: "Are we billing the best account of the customer?",
    help: "Check ePRS to confirm if the current account is the best account with the correct pricing setup.",
    choices: [
      {
        label: "Yes",
        next: "check_exception",
        icon: "fa-solid fa-circle-check",
        desc: "Current account is the best account."
      },
      {
        label: "No",
        next: "final_find_better_account",
        icon: "fa-solid fa-circle-xmark",
        desc: "A better rated account may exist."
      }
    ]
  },

  final_find_better_account: {
    text: "Find a better account that has rates.",
    choices: []
  },

  check_exception: {
    text: "Does the customer have a surcharge exception?",
    choices: [
      {
        label: "Yes",
        next: "exception_yes",
        icon: "fa-solid fa-circle-check",
        desc: "Customer has a surcharge exception."
      },
      {
        label: "No",
        next: "exception_none",
        icon: "fa-solid fa-circle-xmark",
        desc: "Customer does not have a surcharge exception."
      }
    ]
  },

  exception_yes: {
    text: "Which situation applies?",
    choices: [
      {
        label: "Exception does not apply after autorating",
        next: "autorate_issue",
        icon: "fa-solid fa-triangle-exclamation",
        desc: "Exception exists but does not apply on the PRO."
      },
      {
        label: "Exception effective at shipment",
        next: "exception_effective",
        icon: "fa-solid fa-calendar-check",
        desc: "Exception was effective at shipment time."
      }
    ]
  },

  autorate_issue: {
    text: "Run a quote to verify whether their pricing is already fixed.",
    choices: [
      {
        label: "Quote pulls correct pricing",
        next: "final_training_email",
        icon: "fa-solid fa-circle-check",
        desc: "Quote shows correct pricing."
      },
      {
        label: "Quote does not pull correct pricing",
        next: "final_verify_eprt",
        icon: "fa-solid fa-circle-xmark",
        desc: "Quote does not show correct pricing."
      }
    ]
  },

  final_verify_eprt: {
    text: "Verify whether ePRT is needed by following the ePRT guideline.",
    choices: []
  },

  final_training_email: {
    text: "Send an email to the Training Team for approval to manually rate the invoice.",
    choices: []
  },

  exception_effective: {
    text: "Read carefully and understand the exception if it can be applied on the PRO.",
    choices: [
      {
        label: "Manually rated accessorial",
        next: "final_manual_apply",
        icon: "fa-solid fa-pen-to-square",
        desc: "Example: Storage or Detention."
      },
      {
        label: "Not manually rated accessorial",
        next: "final_verify_eprt",
        icon: "fa-solid fa-file-circle-question",
        desc: "Validate through ePRT guideline."
      }
    ]
  },

  final_manual_apply: {
    text: "Manually apply the customer's accessorial exception on the PRO.",
    choices: []
  },

  exception_none: {
    text: "Which no-exception scenario applies?",
    choices: [
      {
        label: "Later agreement published",
        next: "published_later",
        icon: "fa-solid fa-file-signature",
        desc: "Customer later published an agreement with FedEx."
      },
      {
        label: "Exception before and after shipment",
        next: "gap_check",
        icon: "fa-solid fa-calendar-check",
        desc: "Customer has exception before and after shipment."
      }
    ]
  },

  published_later: {
    text: "Is the agreement effective within 180 days from the ship date?",
    choices: [
      {
        label: "Yes",
        next: "final_apply_exception",
        icon: "fa-solid fa-circle-check",
        desc: "Agreement is within 180 days."
      },
      {
        label: "No",
        next: "final_inform_customer",
        icon: "fa-solid fa-circle-xmark",
        desc: "Agreement is more than 180 days from ship date."
      }
    ]
  },

  final_inform_customer: {
    text: "Inform the customer appropriately regarding their pricing details.",
    choices: []
  },

  final_apply_exception: {
    text: "Apply the pricing exception.",
    choices: []
  },

  gap_check: {
    text: "Verify if the customer has a pricing gap.",
    choices: [
      {
        label: "Gap is 14 days or less",
        next: "final_rerate_allowed",
        icon: "fa-solid fa-circle-check",
        desc: "Short pricing gap."
      },
      {
        label: "Gap is 15 days or more",
        next: "gap_sales_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Long pricing gap."
      }
    ]
  },

  final_rerate_allowed: {
    text: "You may rerate without asking for approval.",
    choices: []
  },

  gap_sales_check: {
    text: "Are you speaking with the Sales Rep or the Customer?",
    choices: [
      {
        label: "Customer",
        next: "final_email_training",
        icon: "fa-solid fa-user",
        desc: "You are communicating with the customer."
      },
      {
        label: "Sales Rep",
        next: "final_backdate_form",
        icon: "fa-solid fa-user-tie",
        desc: "You are communicating with the Sales Rep."
      }
    ]
  },

  final_email_training: {
    text: "Send an email to the Training Team who will forward the case to Dustin Carlton. The Sales Rep will submit the Rerate Request.",
    choices: []
  },

  final_backdate_form: {
    text: "Advise the Sales Rep to complete a Back Date Form and send a Rerate Request.",
    choices: []
  }

};
