/* =========================================================
   DISCOUNT - AMC GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "discount-amc-guide",
  title: "Discount - AMC Guide",
  startNode: "start",
  templateCollection: "discount_amc_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "DISCOUNT - AMC General Guide",
    help: "Follow the decision flow to validate billing account, best pricing, agreement exceptions, and AMC-related handling.",
    choices: [
      {
        label: "Continue",
        next: "discount_bol_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Discount / AMC flow."
      }
    ]
  },

  discount_bol_check: {
    text: "Are we billing the correct account per BOL?",
    help: "Validate first if the account currently billed matches the correct account based on the BOL.",
    choices: [
      {
        label: "Yes",
        next: "discount_best_account_check",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed to next validation."
      },
      {
        label: "No",
        next: "final_discount_fix_bol",
        icon: "fa-solid fa-circle-xmark",
        desc: "Account is incorrect per BOL."
      }
    ]
  },

  final_discount_fix_bol: {
    text: "Find an account and bill the correct debtor per BOL. Advise the customer accordingly.",
    choices: []
  },

  discount_best_account_check: {
    text: "Are we billing the best account of the customer?",
    help: "Check if there is a better account with more favorable pricing.",
    choices: [
      {
        label: "Yes",
        next: "discount_check_agreement",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed to agreement validation."
      },
      {
        label: "No",
        next: "final_discount_find_better_account",
        icon: "fa-solid fa-circle-xmark",
        desc: "Better pricing account exists."
      }
    ]
  },

  final_discount_find_better_account: {
    text: "Find an account with better pricing and bill it.",
    choices: []
  },

  discount_check_agreement: {
    text: "Check the customer's agreement.",
    help: "Review the customer’s agreement and verify pricing using ePRS.",
    note: "Check ePRS for customer agreement and pricing validation\nchecking-eprs.html",
    choices: [
      {
        label: "Continue",
        next: "discount_exception_effective",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to pricing exception validation."
      }
    ]
  },

  discount_exception_effective: {
    text: "Does the customer have pricing exception effective at the time of shipment?",
    choices: [
      {
        label: "Yes",
        next: "discount_yes_exception_branch",
        icon: "fa-solid fa-circle-check",
        desc: "Exception exists."
      },
      {
        label: "No",
        next: "discount_no_exception_branch",
        icon: "fa-solid fa-circle-xmark",
        desc: "No exception exists."
      }
    ]
  },

  discount_yes_exception_branch: {
    text: "Which situation applies?",
    choices: [
      {
        label: "Exception applies",
        next: "discount_read_exception",
        icon: "fa-solid fa-circle-check",
        desc: "Exception is valid for shipment."
      },
      {
        label: "Exception does not apply",
        next: "discount_quote_verify",
        icon: "fa-solid fa-circle-xmark",
        desc: "Verify using quote."
      }
    ]
  },

  discount_read_exception: {
    text: "Read and understand the exception if it applies to the shipment.",
    choices: [
      {
        label: "Continue",
        next: "discount_amc_sample",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to AMC validation."
      }
    ]
  },

  discount_amc_sample: {
    text: "AMC sample review",
    note: "Sample PRO 8920117706\nBase rate of $867.90\nIf 88.5% discount applied → $104.15\nAMC = $122.33\nSystem applied DMCF so net charge will not go below AMC",
    choices: [
      {
        label: "Continue",
        next: "final_discount_eprt_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to next step."
      }
    ]
  },

  final_discount_eprt_check: {
    text: "Verify if ePRT is needed by following the ePRT guideline.",
    choices: []
  },

  discount_quote_verify: {
    text: "Run a quote to verify pricing.",
    choices: [
      {
        label: "Correct pricing returned",
        next: "final_discount_manual_rate",
        icon: "fa-solid fa-circle-check",
        desc: "Quote matches expected pricing."
      },
      {
        label: "Incorrect pricing returned",
        next: "final_discount_eprt_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Pricing needs validation."
      }
    ]
  },

  final_discount_manual_rate: {
    text: "Send an email to the Training Team for approval to manually rate the invoice.",
    choices: []
  },

  discount_no_exception_branch: {
    text: "Which scenario applies?",
    choices: [
      {
        label: "Later agreement published",
        next: "discount_later_agreement",
        icon: "fa-solid fa-file-signature",
        desc: "Agreement created after shipment."
      },
      {
        label: "Exception before & after shipment",
        next: "discount_before_after_exception",
        icon: "fa-solid fa-calendar-check",
        desc: "Check for pricing gap."
      }
    ]
  },

  discount_later_agreement: {
    text: "Is agreement effective within 180 days from ship date?",
    choices: [
      {
        label: "Yes",
        next: "final_discount_apply_exception",
        icon: "fa-solid fa-circle-check",
        desc: "Within 180 days."
      },
      {
        label: "No",
        next: "final_discount_inform_customer",
        icon: "fa-solid fa-circle-xmark",
        desc: "Beyond 180 days."
      }
    ]
  },

  final_discount_apply_exception: {
    text: "Apply the pricing exception.",
    choices: []
  },

  final_discount_inform_customer: {
    text: "Inform the customer appropriately regarding their pricing details.",
    choices: []
  },

  discount_before_after_exception: {
    text: "Does the customer have exception before and after shipment?",
    choices: [
      {
        label: "Yes",
        next: "discount_verify_gap",
        icon: "fa-solid fa-circle-check",
        desc: "Check gap."
      },
      {
        label: "No",
        next: "final_discount_inform_customer",
        icon: "fa-solid fa-circle-xmark",
        desc: "No valid exception."
      }
    ]
  },

  discount_verify_gap: {
    text: "Is the pricing gap less than 14 days?",
    choices: [
      {
        label: "Yes",
        next: "final_discount_rerate_direct",
        icon: "fa-solid fa-circle-check",
        desc: "Short gap."
      },
      {
        label: "No",
        next: "discount_gap_more_2weeks",
        icon: "fa-solid fa-circle-xmark",
        desc: "Long gap."
      }
    ]
  },

  final_discount_rerate_direct: {
    text: "Go ahead and rerate without asking for approval.",
    choices: []
  },

  discount_gap_more_2weeks: {
    text: "Who are you talking to?",
    choices: [
      {
        label: "Customer",
        next: "final_discount_customer_escalation",
        icon: "fa-solid fa-user",
        desc: "Customer interaction."
      },
      {
        label: "Sales Representative",
        next: "final_discount_sales_instruction",
        icon: "fa-solid fa-user-tie",
        desc: "Sales interaction."
      }
    ]
  },

  final_discount_customer_escalation: {
    text: "Send an email to the Training Team. They will coordinate with the Sales Rep for rerate request.",
    choices: []
  },

  final_discount_sales_instruction: {
    text: "Advise the Sales Rep to complete a Back Date Form and submit a rerate request.",
    choices: []
  }

};
