/* =========================================================
   EXPEDITED SHIPMENT / PRIORITY PLUS GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "priority-plus-guide",
  title: "Expedited Shipment / Priority Plus Guide",
  startNode: "start",
  templateCollection: "priority_plus_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Expedited Shipment / Priority Plus Guide",
    help: "Use this guide to determine whether the customer's dispute is related to rate or service, then validate Priority Plus / Expedited Shipment handling based on invoice rating, BOL request, comments, and LOA support.",
    note: "Always review all available documents such as the BOL, DR, CC, LOA, and shipment comments before confirming whether the Priority Plus fee is valid or should be reviewed further.",
    choices: [
      {
        label: "Continue",
        next: "customer_dispute_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Expedited Shipment / Priority Plus decision flow."
      }
    ]
  },

  customer_dispute_check: {
    text: "What is the customer's dispute?",
    help: "Determine whether the customer is disputing the rate or the service level.",
    choices: [
      {
        label: "Rate",
        next: "rate_invoice_rated_check",
        icon: "fa-solid fa-file-invoice-dollar",
        desc: "Customer is disputing the rate or FXF Priority Plus / Expedited Shipment charge."
      },
      {
        label: "Service",
        next: "service_review_documents",
        icon: "fa-solid fa-truck-fast",
        desc: "Customer is disputing the service level or Priority Plus service request."
      }
    ]
  },

  /* =========================================================
     RATE FLOW
  ========================================================= */

  rate_invoice_rated_check: {
    text: "If invoice is rated as FXF Priority Plus / Expedited Shipment, then proceed with the rate review.",
    help: "Confirm the invoice was rated as FXF Priority Plus / Expedited Shipment.",
    choices: [
      {
        label: "Continue",
        next: "final_rate_customer_contact_fxfp",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with customer instruction for FXFP rate concerns."
      }
    ]
  },

  final_rate_customer_contact_fxfp: {
    text: "If customer has concern about the FXFP rates, have the customer create a case for further review.",
    help: "Direct the customer to create a case for FXFP rate concerns.",
    choices: []
  },

  /* =========================================================
     SERVICE FLOW
  ========================================================= */

  service_review_documents: {
    text: "Review all documents available such as BOL, DR, and CC that will support the service dispute.",
    help: "Collect and review all supporting documents for the service dispute.",
    choices: [
      {
        label: "Continue",
        next: "bol_priority_plus_requested_check",
        icon: "fa-solid fa-file-lines",
        desc: "Check if the BOL supports Priority Plus service."
      }
    ]
  },

  bol_priority_plus_requested_check: {
    text: "Does the BOL show Priority Plus service was requested?",
    help: "Check the BOL for Priority Plus service request.",
    choices: [
      {
        label: "Yes",
        next: "final_priority_plus_valid_bol",
        icon: "fa-solid fa-circle-check",
        desc: "BOL shows Priority Plus service was requested."
      },
      {
        label: "No",
        next: "verify_comments_upgraded_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "BOL does not show Priority Plus service was requested."
      }
    ]
  },

  final_priority_plus_valid_bol: {
    text: "Priority Plus fee (FFPP) is valid.",
    help: "BOL confirms Priority Plus service was requested — the fee is valid.",
    choices: []
  },

  verify_comments_upgraded_check: {
    text: "Verify comments if this was upgraded to FXFP. Review for a supporting update or instruction.",
    help: "Review the shipment comments for a supporting upgrade instruction.",
    choices: [
      {
        label: "Continue",
        next: "loa_upgrade_document_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check if an LOA document supports the upgrade."
      }
    ]
  },

  loa_upgrade_document_check: {
    text: "Is there a LOA document showing the shipment was upgraded to FXFP?",
    help: "Check for an LOA that supports the FXFP upgrade.",
    choices: [
      {
        label: "Yes",
        next: "final_priority_plus_valid_loa",
        icon: "fa-solid fa-circle-check",
        desc: "LOA document shows the shipment was upgraded to FXFP."
      },
      {
        label: "No",
        next: "final_send_to_service_center_review",
        icon: "fa-solid fa-circle-xmark",
        desc: "No LOA document supports the FXFP upgrade."
      }
    ]
  },

  final_priority_plus_valid_loa: {
    text: "Priority Plus fee (FFPP) is valid.",
    help: "LOA confirms the FXFP upgrade — the fee is valid.",
    choices: []
  },

  final_send_to_service_center_review: {
    text: "If no LOA is available but comments show it was upgraded per LOA, send email to the Service Center to retrieve the LOA requested for the FXFP upgrade.",
    help: "Escalate to the Service Center to retrieve the LOA for the FXFP upgrade.",
    choices: []
  }

};
