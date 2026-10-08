/* =========================================================
   WEIGHING SERVICE FEE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "weighing-service-guide",
  title: "Weighing Service Fee",
  startNode: "start",
  templateCollection: "weighing_service_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Weighing Service Fee - Handling Guide",
    help: "Use this guide to review weighing service fee disputes and determine whether the fee is valid, should be removed, or should be routed for pricing review.",
    note: "Always review the Bill of Lading, invoice details, service request information, and any origin service center confirmation before making a final decision.",
    choices: [
      {
        label: "Continue",
        next: "start_dispute_type",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Weighing Service Fee decision flow."
      }
    ]
  },

  start_dispute_type: {
    text: "What is the customer's dispute?",
    help: "Select the type of weighing service fee dispute being reviewed.",
    choices: [
      {
        label: "Validity",
        next: "validity_bol_check",
        icon: "fa-solid fa-circle-check",
        desc: "Review whether the weighing service fee is valid."
      },
      {
        label: "Rates",
        next: "final_rates",
        icon: "fa-solid fa-percent",
        desc: "Customer is disputing the rate."
      }
    ]
  },

  final_rates: {
    text: "Move the case to Pricing Small for further review. Make sure to include a complete internal comment.",
    choices: []
  },

  validity_bol_check: {
    text: "Was the weighing service requested on the Bill of Lading?",
    help: "Check the BOL to confirm whether the weighing service was requested.",
    choices: [
      {
        label: "Yes",
        next: "final_fee_valid_bol",
        icon: "fa-solid fa-circle-check",
        desc: "The service was requested on the BOL."
      },
      {
        label: "No",
        next: "verify_origin_service_center",
        icon: "fa-solid fa-circle-xmark",
        desc: "The service is not shown on the BOL."
      }
    ]
  },

  final_fee_valid_bol: {
    text: "Advise the customer that the fee is valid because the weighing service was requested on the Bill of Lading.",
    choices: []
  },

  verify_origin_service_center: {
    text: "Send an email to the origin service center to verify whether the weighing service was requested.",
    help: "Confirm with the origin service center before making the final decision.",
    note: "Once the verification email has been sent, continue to the next step after receiving or reviewing the service center response.",
    choices: [
      {
        label: "Continue",
        next: "service_requested_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after sending the verification email."
      }
    ]
  },

  service_requested_check: {
    text: "Did the origin service center confirm that the weighing service was requested?",
    help: "Use the service center response to determine whether the fee should remain or be removed.",
    choices: [
      {
        label: "Yes",
        next: "final_fee_valid_service_requested",
        icon: "fa-solid fa-circle-check",
        desc: "The service was requested."
      },
      {
        label: "No",
        next: "final_remove_fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "The service was not requested."
      }
    ]
  },

  final_fee_valid_service_requested: {
    text: "Advise the customer that the fee is valid because the weighing service was requested.",
    choices: []
  },

  final_remove_fee: {
    text: "Remove the fee because the weighing service was not requested.",
    choices: []
  }

};
