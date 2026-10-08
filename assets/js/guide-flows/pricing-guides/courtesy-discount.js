/* =========================================================
   COURTESY DISCOUNT — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "courtesy-discount",
  title: "Courtesy Discount",
  startNode: "start",
  templateCollection: "courtesy_discount_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Courtesy Discount",
    help: "Use this guide when handling customer requests for Courtesy Discounts.",
    note: "REMINDER: Please ensure that the customer has already been advised to contact 1-800-GOFEDEX before proceeding with any courtesy discount to TEAM LEADS. Our goal is to educate customers on setting up their account with LTL Freight pricing, rather than relying on courtesy discount. Courtesy discounts should only be considered as a last option, not the first.",
    choices: [
      {
        label: "Continue",
        next: "dispute_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to evaluate the request."
      }
    ]
  },

  dispute_check: {
    text: "Customer disputes invoice amount AND BRAP shows LD – default rates applied?",
    help: "Check if the invoice is using default rates and customer is disputing.",
    choices: [
      {
        label: "Yes",
        next: "verify_pricing",
        icon: "fa-solid fa-circle-check",
        desc: "Verify if pricing exists."
      },
      {
        label: "No",
        next: "standard_billing",
        icon: "fa-solid fa-circle-xmark",
        desc: "Follow standard billing process."
      }
    ]
  },

  standard_billing: {
    text: "Follow standard billing process",
    help: "No courtesy discount needed.",
    choices: []
  },

  verify_pricing: {
    text: "Verify if customer's account has freight pricing (check ALL ID Levels)",
    help: "Check all levels for existing pricing.",
    choices: [
      {
        label: "Continue",
        next: "pricing_found_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after checking pricing."
      }
    ]
  },

  pricing_found_check: {
    text: "Was pricing found?",
    choices: [
      {
        label: "Yes",
        next: "apply_pricing",
        icon: "fa-solid fa-circle-check",
        desc: "Pricing exists."
      },
      {
        label: "No",
        next: "invoice_amount_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "No pricing found."
      }
    ]
  },

  apply_pricing: {
    text: "Courtesy discount NOT applicable - Apply the LTL Pricing linked to account",
    help: "Use existing pricing instead of courtesy discount.",
    choices: []
  },

  invoice_amount_check: {
    text: "Is invoice amount ≥ $1,500?",
    choices: [
      {
        label: "Yes",
        next: "invoice_open_check",
        icon: "fa-solid fa-circle-check",
        desc: "Invoice ≥ $1,500"
      },
      {
        label: "No",
        next: "one_time_discount",
        icon: "fa-solid fa-circle-xmark",
        desc: "Invoice < $1,500"
      }
    ]
  },

  one_time_discount: {
    text: "Invoice < $1,500 are not subjected to qualified for a One - Time Courtesy Discount",
    help: "Small invoices are handled differently.",
    note: "NOTE: Exception allowed ONLY courtesy discount will CLOSE the invoice",
    choices: []
  },

  invoice_open_check: {
    text: "Is freight invoice OPEN? (Not Paid / Not Closed)",
    choices: [
      {
        label: "Yes",
        next: "multiple_pro_check",
        icon: "fa-solid fa-circle-check",
        desc: "Invoice is open."
      },
      {
        label: "No",
        next: "invoice_closed",
        icon: "fa-solid fa-circle-xmark",
        desc: "Invoice is closed."
      }
    ]
  },

  invoice_closed: {
    text: "Invoice that are paid and closed we can no longer provide a courtesy discount.",
    choices: []
  },

  multiple_pro_check: {
    text: "Is the request for MULTIPLE PROs?",
    choices: [
      {
        label: "Yes",
        next: "not_allowed_multiple",
        icon: "fa-solid fa-circle-check",
        desc: "Multiple PROs."
      },
      {
        label: "No",
        next: "existing_discount_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Single PRO."
      }
    ]
  },

  not_allowed_multiple: {
    text: "Courtesy discount NOT allowed",
    choices: []
  },

  existing_discount_check: {
    text: "Has a Courtesy Discount JM60/55/50/40 already been applied?",
    choices: [
      {
        label: "Yes",
        next: "cannot_issue_another",
        icon: "fa-solid fa-circle-check",
        desc: "Already discounted."
      },
      {
        label: "No",
        next: "determine_shipment",
        icon: "fa-solid fa-circle-xmark",
        desc: "No discount yet."
      }
    ]
  },

  cannot_issue_another: {
    text: "Cannot issue another discount",
    choices: []
  },

  determine_shipment: {
    text: "Determine shipment type",
    help: "Identify shipment lane to determine max discount.",
    choices: [
      {
        label: "US–US",
        next: "us_us_discount",
        icon: "fa-solid fa-truck",
        desc: "Domestic shipment."
      },
      {
        label: "US–CA / CA–US",
        next: "cross_border_discount",
        icon: "fa-solid fa-earth-americas",
        desc: "Cross-border shipment."
      }
    ]
  },

  us_us_discount: {
    text: "US–US Shipment → Max discount: 60%",
    choices: [
      {
        label: "Continue",
        next: "higher_request_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to validation."
      }
    ]
  },

  cross_border_discount: {
    text: "US–CA / CA–US Shipment → Max discount: 40%",
    choices: [
      {
        label: "Continue",
        next: "higher_request_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to validation."
      }
    ]
  },

  higher_request_check: {
    text: "Customer requesting higher than allowed?",
    choices: [
      {
        label: "Yes",
        next: "advise_sales",
        icon: "fa-solid fa-circle-check",
        desc: "Higher than allowed."
      },
      {
        label: "No",
        next: "send_approval",
        icon: "fa-solid fa-circle-xmark",
        desc: "Within allowed range."
      }
    ]
  },

  advise_sales: {
    text: "Advise customer to call 1-800-GOFEDEX to speak with Sales Representative to set up pricing",
    choices: []
  },

  send_approval: {
    text: "Send approval request for Courtesy Discount",
    choices: []
  }

};
