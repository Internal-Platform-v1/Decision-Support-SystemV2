/* =========================================================
   FUEL GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "fuel-guide",
  title: "Fuel Guide",
  startNode: "start",
  templateCollection: "fuel_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Fuel Pricing - General Guide",
    help: "Follow this decision flow to validate fuel exception, FXF fuel scale, national average, and surcharge exception handling.",
    choices: [
      {
        label: "Continue",
        next: "pricing_exception_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Fuel Surcharge decision flow."
      }
    ]
  },

  pricing_exception_check: {
    text: "Does the customer have a pricing exception?",
    help: "Check if the customer has an active pricing or surcharge exception before validating fuel handling.",
    choices: [
      {
        label: "Yes",
        next: "has_pricing_exception",
        icon: "fa-solid fa-circle-check",
        desc: "Customer has a pricing exception."
      },
      {
        label: "No",
        next: "no_pricing_exception",
        icon: "fa-solid fa-circle-xmark",
        desc: "Customer does not have a pricing exception."
      }
    ]
  },

  has_pricing_exception: {
    text: "Does the customer have their own fuel exception?",
    choices: [
      {
        label: "Yes",
        next: "find_fuel_exception",
        icon: "fa-solid fa-circle-check",
        desc: "Customer has their own fuel exception."
      },
      {
        label: "No, using FXF Fuel Scale",
        next: "fxf_fuel_scale",
        icon: "fa-solid fa-gas-pump",
        desc: "Customer is using the FXF fuel scale."
      }
    ]
  },

  find_fuel_exception: {
    text: "Find the customer's fuel exception.",
    help: "Review the customer’s agreement or pricing setup to locate the applicable fuel exception.",
    choices: [
      {
        label: "Continue",
        next: "verify_correct_fuel",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to fuel validation."
      }
    ]
  },

  verify_correct_fuel: {
    text: "Verify if correct fuel is being applied.",
    choices: [
      {
        label: "Fuel applied correctly",
        next: "final_fuel_correct",
        icon: "fa-solid fa-circle-check",
        desc: "Fuel surcharge is correct."
      },
      {
        label: "Fuel applied incorrectly",
        next: "final_fuel_incorrect",
        icon: "fa-solid fa-circle-xmark",
        desc: "Fuel surcharge is incorrect."
      }
    ]
  },

  final_fuel_correct: {
    text: "Advise the customer accordingly regarding their fuel exception.",
    choices: []
  },

  final_fuel_incorrect: {
    text: "Verify if ePRT is needed.",
    choices: []
  },

  fxf_fuel_scale: {
    text: "Check the national average and apply fuel using FXF Fuel referencing FXF Rules Item 570.",
    help: "Use this path when the customer does not have their own fuel exception and is using the FXF fuel scale.",
    choices: [
      {
        label: "Continue",
        next: "fuel_steps",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to shipment date validation."
      }
    ]
  },

  fuel_steps: {
    text: "Check the shipment date.",
    note: "Fuel announced on Monday takes effect the following Wednesday.",
    choices: [
      {
        label: "Continue",
        next: "fuel_sample",
        icon: "fa-solid fa-arrow-right",
        desc: "Review the fuel date example."
      }
    ]
  },

  fuel_sample: {
    text: "Review the fuel effective date sample.",
    note: "Example:\nShip date: 03/09/2026, Monday\nUse the National Fuel Average from: 03/02/2026, Monday",
    choices: [
      {
        label: "Continue",
        next: "fuel_source",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to fuel source lookup."
      }
    ]
  },

  fuel_source: {
    text: "Find the weekly LTL and TL FXF Fuel Surcharges and National Average.",
    note: "Use this source:\nhttps://www.eia.gov/petroleum/gasdiesel/",
    choices: [
      {
        label: "Continue",
        next: "fuel_diesel",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to diesel history data."
      }
    ]
  },

  fuel_diesel: {
    text: "Select Diesel and open the full history data.",
    choices: [
      {
        label: "Continue",
        next: "fuel_data5",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to downloaded history data."
      }
    ]
  },

  fuel_data5: {
    text: "Download the history file and go to Data 5.",
    note: "Use Data 5 → Weekly U.S. No. 2 Diesel → Column B.",
    choices: [
      {
        label: "Continue",
        next: "fuel_average",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to national fuel average validation."
      }
    ]
  },

  fuel_average: {
    text: "Identify the correct national fuel average for the shipment.",
    note: "Example:\nShip date: 03/09/2026\nNational fuel average date: 03/02/2026\nNational fuel average: 3.897",
    choices: [
      {
        label: "Continue",
        next: "fuel_tariff",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to tariff validation."
      }
    ]
  },

  fuel_tariff: {
    text: "Go to the FXF Rules Tariff effective at the time of shipment and search the FSCL.",
    choices: [
      {
        label: "Continue",
        next: "final_fuel_percent",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to equivalent fuel percentage."
      }
    ]
  },

  final_fuel_percent: {
    text: "Use the first three digits of the fuel average to determine the equivalent fuel percentage.",
    note: "Example:\nFuel average: 3.897\nUse first three digits: 389\nEquivalent Fuel: 34.7%",
    choices: []
  },

  /* ================= NO PRICING EXCEPTION ================= */

  no_pricing_exception: {
    text: "Which situation applies?",
    help: "Choose the scenario that matches the customer’s surcharge exception status.",
    choices: [
      {
        label: "Customer later published an agreement with FedEx",
        next: "published_later",
        icon: "fa-solid fa-file-signature",
        desc: "Agreement was published after shipment."
      },
      {
        label: "Customer has surcharge exception before and after shipment",
        next: "before_after_surcharge",
        icon: "fa-solid fa-calendar-check",
        desc: "Check for surcharge exception gap."
      }
    ]
  },

  published_later: {
    text: "What is the effective date of the agreement?",
    choices: [
      {
        label: "Within 180 days from ship date",
        next: "final_published_within_180",
        icon: "fa-solid fa-circle-check",
        desc: "Agreement is within 180 days."
      },
      {
        label: "More than 180 days from ship date",
        next: "final_published_more_180",
        icon: "fa-solid fa-circle-xmark",
        desc: "Agreement is beyond 180 days."
      }
    ]
  },

  final_published_more_180: {
    text: "Inform the customer appropriately regarding their pricing details.",
    choices: []
  },

  final_published_within_180: {
    text: "Apply the pricing exception.",
    choices: []
  },

  before_after_surcharge: {
    text: "Verify if the customer has a pricing gap.",
    choices: [
      {
        label: "Gap is 14 days or less",
        next: "final_gap_14_or_less",
        icon: "fa-solid fa-circle-check",
        desc: "Pricing gap is within 14 days."
      },
      {
        label: "Gap is 15 days or more",
        next: "gap_15_or_more",
        icon: "fa-solid fa-circle-xmark",
        desc: "Pricing gap is 15 days or more."
      }
    ]
  },

  final_gap_14_or_less: {
    text: "Rerate the invoice without requesting approval since the pricing gap is 14 days or less.",
    choices: []
  },

  gap_15_or_more: {
    text: "Who are you communicating with?",
    choices: [
      {
        label: "Customer",
        next: "final_gap_customer",
        icon: "fa-solid fa-user",
        desc: "You are communicating with the customer."
      },
      {
        label: "Sales Representative",
        next: "final_gap_sales_rep",
        icon: "fa-solid fa-user-tie",
        desc: "You are communicating with the Sales Representative."
      }
    ]
  },

  final_gap_customer: {
    text: "Send an email to the Training Team. They will forward the case to Dustin Carlton. The Sales Rep will submit a Rerate Request.",
    choices: []
  },

  final_gap_sales_rep: {
    text: "Advise the Sales Rep to complete a Back Date Form and submit a Rerate Request.",
    choices: []
  }

};
