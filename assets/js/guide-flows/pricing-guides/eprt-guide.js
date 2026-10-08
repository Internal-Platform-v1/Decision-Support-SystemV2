/* =========================================================
   EPRT GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "eprt-guide",
  title: "ePRT Guide",
  startNode: "start",
  templateCollection: "eprt_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "ePRT / Pricing Exception - General Guide",
    help: "Follow this decision flow to validate pricing exception issues, rerating scenarios, CHT updates, and proper ePRT handling.",
    choices: [
      {
        label: "Continue",
        next: "eprt_start",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the pricing exception validation flow."
      }
    ]
  },

  eprt_start: {
    text: "Does the customer have a pricing exception effective at the time of shipment?",
    choices: [
      {
        label: "Yes",
        next: "attempt_rerate",
        icon: "fa-solid fa-circle-check",
        desc: "Customer has an active pricing exception."
      },
      {
        label: "No",
        next: "exception_before_after",
        icon: "fa-solid fa-circle-xmark",
        desc: "No active pricing exception at shipment time."
      }
    ]
  },

  /* ================= EXCEPTION EXISTS ================= */

  attempt_rerate: {
    text: "Attempt to rerate the PRO at the time of shipment.",
    help: "Check if rerating pulls the correct agreement pricing.",
    choices: [
      {
        label: "Continue",
        next: "run_quote",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to rate quote validation."
      }
    ]
  },

  run_quote: {
    text: "Run a rate quote to verify pricing.",
    choices: [
      {
        label: "Rates applied correctly per rate quote",
        next: "final_training_team",
        icon: "fa-solid fa-circle-check",
        desc: "Quote shows correct pricing but rerate failed."
      },
      {
        label: "Rates applied incorrectly per rate quote",
        next: "check_exception",
        icon: "fa-solid fa-circle-xmark",
        desc: "Quote does not match expected pricing."
      }
    ]
  },

  final_training_team: {
    text: "Send an email to the Training Team / SMEs for approval to rerate the invoice.",
    note: "Use this when the Rate Quote shows correct agreement pricing but rerating does not pull the correct rates.",
    choices: []
  },

  /* ================= INCORRECT RATE ================= */

  check_exception: {
    text: "Check the CHT update and ensure the latest hierarchy update is selected.",
    choices: [
      {
        label: "Continue",
        next: "cht_type",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to CHT validation."
      }
    ]
  },

  cht_type: {
    text: "What CHT pricing option was selected?",
    choices: [
      {
        label: "Immediate Inheritance",
        next: "verify_debtor",
        icon: "fa-solid fa-circle-check",
        desc: "Pricing should apply immediately."
      },
      {
        label: "Keep Pricing Until Date",
        next: "final_sales_email",
        icon: "fa-solid fa-circle-xmark",
        desc: "Pricing retained temporarily."
      }
    ]
  },

  /* ================= IMMEDIATE INHERITANCE ================= */

  verify_debtor: {
    text: "Was the debtor account created before the ship date?",
    choices: [
      {
        label: "Yes",
        next: "check_cht_issue",
        icon: "fa-solid fa-circle-check",
        desc: "Debtor existed before shipment."
      },
      {
        label: "No",
        next: "final_rerate_cht",
        icon: "fa-solid fa-circle-xmark",
        desc: "Debtor created after shipment."
      }
    ]
  },

  final_rerate_cht: {
    text: "Rerate the invoice based on the CHT update.",
    choices: []
  },

  check_cht_issue: {
    text: "Check if there is any CHT issue.",
    choices: [
      {
        label: "No CHT Issue",
        next: "eprs_exception",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed to agreement validation."
      },
      {
        label: "CHT Issue Found",
        next: "final_cht_process",
        icon: "fa-solid fa-circle-xmark",
        desc: "CHT issue identified."
      }
    ]
  },

  final_cht_process: {
    text: "Follow the CHT submission process.",
    choices: []
  },

  /* ================= EPRS AGREEMENT ================= */

  eprs_exception: {
    text: "The exception is an ePRS Agreement (Proposal Number).",
    choices: [
      {
        label: "Submit ePRT Ticket",
        next: "submit_ticket",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to ePRT submission."
      }
    ]
  },

  submit_ticket: {
    text: "Submit an ePRT ticket to apply the Proposal Number / ePRS Agreement.",
    note: "If denied, validate the reason before advising the customer.",
    choices: [
      {
        label: "Continue",
        next: "manual_rate",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to final action."
      }
    ]
  },

  manual_rate: {
    text: "Manually rate the invoice to apply the correct pricing.",
    note: "Do not use ePRT for legacy pricing (Contract or Tariff).",
    choices: []
  },

  /* ================= KEEP PRICING ================= */

  final_sales_email: {
    text: "Send an email to the Sales Representative requesting them to update pricing and select Immediate Inheritance.",
    choices: []
  },

  /* ================= NO EXCEPTION ================= */

  exception_before_after: {
    text: "Does the customer have an exception before and after the shipment?",
    choices: [
      {
        label: "Yes",
        next: "verify_gap",
        icon: "fa-solid fa-circle-check",
        desc: "Check pricing gap."
      },
      {
        label: "No",
        next: "new_exception",
        icon: "fa-solid fa-circle-xmark",
        desc: "No prior exception exists."
      }
    ]
  },

  verify_gap: {
    text: "Verify if there is a pricing gap.",
    choices: [
      {
        label: "Gap more than 14 days",
        next: "gap_over_2weeks",
        icon: "fa-solid fa-circle-xmark",
        desc: "Long pricing gap."
      },
      {
        label: "Gap 14 days or less",
        next: "final_rerate_gap",
        icon: "fa-solid fa-circle-check",
        desc: "Short pricing gap."
      }
    ]
  },

  final_rerate_gap: {
    text: "Rerate the invoice without additional approval.",
    choices: []
  },

  gap_over_2weeks: {
    text: "Who are you speaking with?",
    choices: [
      {
        label: "Sales Representative",
        next: "final_sales_backdate",
        icon: "fa-solid fa-user-tie",
        desc: "Sales interaction."
      },
      {
        label: "Customer",
        next: "final_training_forward",
        icon: "fa-solid fa-user",
        desc: "Customer interaction."
      }
    ]
  },

  final_sales_backdate: {
    text: "Advise the Sales Representative to complete a Back Date Form and submit a rerate request.",
    choices: []
  },

  final_training_forward: {
    text: "Send an email to the Training Team for Sales coordination and rerate request.",
    choices: []
  },

  /* ================= NEW AGREEMENT ================= */

  new_exception: {
    text: "Customer later published an agreement with FedEx.",
    choices: [
      {
        label: "Continue",
        next: "effective_date",
        icon: "fa-solid fa-arrow-right",
        desc: "Check agreement effective date."
      }
    ]
  },

  effective_date: {
    text: "Is the agreement effective within 180 days from the ship date?",
    choices: [
      {
        label: "Yes",
        next: "final_apply_exception",
        icon: "fa-solid fa-circle-check",
        desc: "Within allowed timeframe."
      },
      {
        label: "No",
        next: "final_inform_customer",
        icon: "fa-solid fa-circle-xmark",
        desc: "Beyond allowed timeframe."
      }
    ]
  },

  final_apply_exception: {
    text: "Apply the pricing exception.",
    choices: []
  },

  final_inform_customer: {
    text: "Inform the customer appropriately regarding their pricing details.",
    choices: []
  }

};
