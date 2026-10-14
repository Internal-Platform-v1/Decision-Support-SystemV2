/* =========================================================
   REWEIGH — GENERAL GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "reweigh-general-guide",
  title: "Reweigh — General Guide",
  startNode: "start",
  templateCollection: "reweigh_general_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Reweigh - General Guide",
    help: "Use this guide to resolve customer disputes related to reweigh charges, including requests to remove or apply a reweigh, pallet weight issues, reweigh certificates, and non‑weight-related disputes.",
    choices: [
      {
        label: "Continue",
        next: "dispute_type",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the reweigh dispute resolution process."
      }
    ]
  },

  dispute_type: {
    text: "What is the dispute of the customer?",
    help: "Identify the primary nature of the customer's reweigh dispute.",
    choices: [
      {
        label: "Weight of the shipment (request to remove reweigh and bill it back per BOL weight)",
        next: "remove_reweigh_root",
        icon: "fa-solid fa-scale-balanced",
        desc: "Customer wants to remove reweigh and use BOL weight."
      },
      {
        label: "Weight of the shipment (request is to apply reweigh)",
        next: "apply_reweigh_root",
        icon: "fa-solid fa-weight-hanging",
        desc: "Customer wants to apply the reweighed weight."
      },
      {
        label: "Pallet Weight",
        next: "pallet_weight",
        icon: "fa-solid fa-pallet",
        desc: "Dispute about pallet weight."
      },
      {
        label: "Reweigh Certificate",
        next: "reweigh_certificate",
        icon: "fa-solid fa-file-certificate",
        desc: "Issue with the reweigh certificate document."
      },
      {
        label: "Others (not Weight Related)",
        next: "others_not_weight",
        icon: "fa-solid fa-question-circle",
        desc: "Dispute not related to weight."
      }
    ]
  },

  /* ==================== REMOVE REWEIGH ==================== */

  remove_reweigh_root: {
    text: "Was the shipment reweighed?",
    help: "Confirm if a reweigh event actually occurred on this shipment.",
    choices: [
      {
        label: "YES",
        next: "remove_reweigh_delivered",
        icon: "fa-solid fa-circle-check",
        desc: "Shipment was reweighed."
      },
      {
        label: "NO",
        next: "remove_reweigh_not_reweighed",
        icon: "fa-solid fa-times-circle",
        desc: "Shipment was not reweighed."
      }
    ]
  },

  remove_reweigh_not_reweighed: {
    text: "If customer is disputing the weight but shipment was not reweighed, move the case to Billing Dispute.",
    help: "No reweigh occurred – route to Billing Dispute queue.",
    choices: []
  },

  remove_reweigh_delivered: {
    text: "Was the shipment delivered?",
    help: "Check delivery status before processing reweigh reversal.",
    choices: [
      {
        label: "YES",
        next: "remove_reweigh_validity_check",
        icon: "fa-solid fa-circle-check",
        desc: "Shipment delivered."
      },
      {
        label: "NO",
        next: "pend_not_delivered",
        icon: "fa-solid fa-hourglass-half",
        desc: "Shipment not yet delivered."
      }
    ]
  },

  pend_not_delivered: {
    text: "Pend the case since shipment has not been delivered and respond to the customer: \"This request has been received and will be reviewed once the shipment is delivered. Thank you for your patience during the interim.\"",
    help: "Wait for delivery before processing reweigh dispute.",
    choices: []
  },

  remove_reweigh_validity_check: {
    text: "Was the Reweigh valid and done correctly?",
    help: "Determine if the reweigh procedure followed proper standards.",
    choices: [
      {
        label: "YES",
        next: "remove_reweigh_customer_doc",
        icon: "fa-solid fa-circle-check",
        desc: "Reweigh was valid/correct."
      },
      {
        label: "NO",
        next: "remove_reweigh_invalid_root",
        icon: "fa-solid fa-times-circle",
        desc: "Reweigh was invalid due to error."
      }
    ]
  },

  remove_reweigh_customer_doc: {
    text: "Did the customer provide a document and claim that the reweigh is inaccurate?",
    help: "Check if customer submitted evidence challenging the reweigh.",
    choices: [
      {
        label: "YES",
        next: "remove_reweigh_doc_valid",
        icon: "fa-solid fa-file-pdf",
        desc: "Customer provided document and claims inaccuracy."
      },
      {
        label: "NO",
        next: "remove_reweigh_no_doc_revnj",
        icon: "fa-solid fa-file-excel",
        desc: "No document provided."
      }
    ]
  },

  remove_reweigh_doc_valid: {
    text: "Was the document valid and can be used to reverse the reweigh?",
    help: "Assess if the customer's documentation supports reversing the reweigh.",
    choices: [
      {
        label: "YES",
        next: "remove_reweigh_doc_outcome",
        icon: "fa-solid fa-circle-check",
        desc: "Document is valid and supports reversal."
      },
      {
        label: "NO",
        next: "remove_reweigh_doc_invalid_revnj",
        icon: "fa-solid fa-times-circle",
        desc: "Document is invalid or insufficient."
      }
    ]
  },

  remove_reweigh_doc_outcome: {
    text: "If reweigh will be reversed, will the invoice amount increase or decrease?",
    help: "Determine net financial impact before proceeding.",
    choices: [
      {
        label: "Increase",
        next: "increase_warn_litro",
        icon: "fa-solid fa-arrow-up",
        desc: "Invoice amount will increase."
      },
      {
        label: "Decrease",
        next: "correction_litro",
        icon: "fa-solid fa-arrow-down",
        desc: "Invoice amount will decrease."
      }
    ]
  },

  increase_warn_litro: {
    text: "Advise the customer that reversing the reweigh will result in an increased invoice amount. Did the customer agree to proceed?",
    help: "Obtain customer consent before increasing invoice.",
    choices: [
      {
        label: "Customer Agrees",
        next: "correction_litro",
        icon: "fa-solid fa-handshake",
        desc: "Customer accepts increase."
      },
      {
        label: "Customer Declines",
        next: "case_denied",
        icon: "fa-solid fa-thumbs-down",
        desc: "Customer refuses increase."
      }
    ]
  },

  correction_litro: {
    text: "Proceed with the Correction following LITRO.",
    help: "Apply correction using LITRO process.",
    choices: []
  },

  case_denied: {
    text: "Close the case as Denied.",
    help: "Customer declined the increase – case denied.",
    choices: []
  },

  remove_reweigh_doc_invalid_revnj: {
    text: "Try to upload the case in FPAD. Is the customer eligible for Courtesy Adjustment (REVNJ)?",
    help: "Check FPAD for courtesy adjustment eligibility.",
    choices: [
      {
        label: "YES",
        next: "revnj_reverse",
        icon: "fa-solid fa-circle-check",
        desc: "Eligible for REVNJ."
      },
      {
        label: "NO",
        next: "request_valid_doc",
        icon: "fa-solid fa-circle-xmark",
        desc: "Not eligible – request valid document."
      }
    ]
  },

  remove_reweigh_no_doc_revnj: {
    text: "Per FPAD BOT, is the customer eligible for Courtesy Adjustment (REVNJ)?",
    help: "Check FPAD BOT for courtesy adjustment eligibility without customer document.",
    choices: [
      {
        label: "YES",
        next: "revnj_reverse",
        icon: "fa-solid fa-circle-check",
        desc: "Eligible for REVNJ."
      },
      {
        label: "NO",
        next: "request_valid_doc",
        icon: "fa-solid fa-circle-xmark",
        desc: "Not eligible – request valid document."
      }
    ]
  },

  revnj_reverse: {
    text: "Reverse the Reweigh per REVNJ Process.",
    help: "Apply courtesy adjustment to reverse reweigh.",
    choices: []
  },

  request_valid_doc: {
    text: "Advise the customer that the reweigh is valid and the document they provided is invalid. Request documentation supporting the BOL weight.",
    help: "Customer must provide valid supporting document.",
    choices: []
  },

  remove_reweigh_invalid_root: {
    text: "What is the Reweigh Code that makes the Reweigh invalid?",
    help: "Select the specific error code for the invalid reweigh.",
    choices: [
      {
        label: "NDOCO - No reweigh certificate imaged",
        next: "ndoco_branch",
        icon: "fa-solid fa-image",
        desc: "Missing reweigh certificate."
      },
      {
        label: "BILLO - Incorrect biller weight entry",
        next: "billo_branch",
        icon: "fa-solid fa-keyboard",
        desc: "Wrong weight entered by biller."
      },
      {
        label: "RERRO - Service Center processed incorrectly",
        next: "rerro_branch",
        icon: "fa-solid fa-building",
        desc: "Service Center error."
      },
      {
        label: "MIXDO - Freight were mixed up during reweigh",
        next: "mixdo_branch",
        icon: "fa-solid fa-arrows-spin",
        desc: "Freight mix‑up during reweigh."
      }
    ]
  },

  ndoco_branch: {
    text: "If reweigh will be reversed, will the invoice amount increase or decrease?",
    help: "Determine financial impact for NDOCO case.",
    choices: [
      {
        label: "Increase",
        next: "increase_warn_ndoco",
        icon: "fa-solid fa-arrow-up",
        desc: "Invoice amount will increase."
      },
      {
        label: "Decrease",
        next: "correction_ndoco",
        icon: "fa-solid fa-arrow-down",
        desc: "Invoice amount will decrease."
      }
    ]
  },

  increase_warn_ndoco: {
    text: "Advise the customer that reversing the reweigh will increase the invoice. Did the customer agree?",
    help: "Obtain customer consent for increase.",
    choices: [
      {
        label: "Customer Agrees",
        next: "correction_ndoco",
        icon: "fa-solid fa-handshake",
        desc: "Customer accepts increase."
      },
      {
        label: "Customer Declines",
        next: "case_denied",
        icon: "fa-solid fa-thumbs-down",
        desc: "Customer refuses increase."
      }
    ]
  },

  correction_ndoco: {
    text: "Proceed with the Correction following NDOCO.",
    help: "Apply correction using NDOCO process.",
    choices: []
  },

  billo_branch: {
    text: "If reweigh will be reversed, will the invoice amount increase or decrease?",
    help: "Determine financial impact for BILLO case.",
    choices: [
      {
        label: "Increase",
        next: "increase_warn_billo",
        icon: "fa-solid fa-arrow-up",
        desc: "Invoice amount will increase."
      },
      {
        label: "Decrease",
        next: "correction_billo",
        icon: "fa-solid fa-arrow-down",
        desc: "Invoice amount will decrease."
      }
    ]
  },

  increase_warn_billo: {
    text: "Advise customer about increased invoice. Did the customer agree?",
    help: "Obtain customer consent for increase.",
    choices: [
      {
        label: "Customer Agrees",
        next: "correction_billo",
        icon: "fa-solid fa-handshake",
        desc: "Customer accepts increase."
      },
      {
        label: "Customer Declines",
        next: "case_denied",
        icon: "fa-solid fa-thumbs-down",
        desc: "Customer refuses increase."
      }
    ]
  },

  correction_billo: {
    text: "Proceed with the Correction following BILLO.",
    help: "Apply correction using BILLO process.",
    choices: []
  },

  rerro_branch: {
    text: "Choose one below that matches your case:",
    help: "Select the specific RERRO sub‑category.",
    choices: [
      {
        label: "Reweigh Certificate Error - weights switched",
        next: "rerro_cert_error",
        icon: "fa-solid fa-arrow-right-arrow-left",
        desc: "Weights switched on certificate."
      },
      {
        label: "Confirmation from Service Center/Freight Analysis Manager that reweigh was done incorrectly",
        next: "rerro_fam",
        icon: "fa-solid fa-check-double",
        desc: "Official confirmation of error."
      }
    ]
  },

  rerro_cert_error: {
    text: "If reweigh will be reversed, will invoice increase or decrease?",
    help: "Determine financial impact for RERRO certificate error.",
    choices: [
      {
        label: "Increase",
        next: "increase_warn_rerro",
        icon: "fa-solid fa-arrow-up",
        desc: "Invoice amount will increase."
      },
      {
        label: "Decrease",
        next: "correction_rerro",
        icon: "fa-solid fa-arrow-down",
        desc: "Invoice amount will decrease."
      }
    ]
  },

  increase_warn_rerro: {
    text: "Advise customer about increased invoice. Did the customer agree?",
    help: "Obtain customer consent for increase.",
    choices: [
      {
        label: "Customer Agrees",
        next: "correction_rerro",
        icon: "fa-solid fa-handshake",
        desc: "Customer accepts increase."
      },
      {
        label: "Customer Declines",
        next: "case_denied",
        icon: "fa-solid fa-thumbs-down",
        desc: "Customer refuses increase."
      }
    ]
  },

  correction_rerro: {
    text: "Proceed with the Correction following RERRO.",
    help: "Apply correction using RERRO process.",
    choices: []
  },

  rerro_fam: {
    text: "Proceed with reversing the Reweigh following RERRO.",
    help: "Reverse reweigh based on Service Center/FAM confirmation.",
    choices: []
  },

  mixdo_branch: {
    text: "Aside from checking the BOL of the disputed pro and another pro where it was mixed up, you may also send an email to the Reweigh Service Center to confirm the issue.",
    help: "Gather additional confirmation for freight mix‑up.",
    choices: [
      {
        label: "Continue",
        next: "mixdo_branch_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after confirmation."
      }
    ]
  },

  mixdo_branch_final: {
    text: "Proceed with the Correction following the appropriate reweigh Code based on the reason.",
    help: "Apply correction using the correct reweigh code for mix‑up.",
    choices: []
  },

  /* ==================== APPLY REWEIGH ==================== */

  apply_reweigh_root: {
    text: "Was the shipment reweighed?",
    help: "Confirm if a reweigh event occurred before applying it.",
    choices: [
      {
        label: "YES",
        next: "apply_reweigh_delivered",
        icon: "fa-solid fa-circle-check",
        desc: "Shipment was reweighed."
      },
      {
        label: "NO",
        next: "apply_reweigh_not_reweighed",
        icon: "fa-solid fa-times-circle",
        desc: "Shipment was not reweighed."
      }
    ]
  },

  apply_reweigh_not_reweighed: {
    text: "Deny the request and advise that the shipment was not reweighed.",
    help: "No reweigh exists – cannot apply it.",
    choices: []
  },

  apply_reweigh_delivered: {
    text: "Was the shipment delivered?",
    help: "Delivery must be confirmed before applying reweigh.",
    choices: [
      {
        label: "YES",
        next: "apply_reweigh_reason",
        icon: "fa-solid fa-circle-check",
        desc: "Shipment delivered."
      },
      {
        label: "NO",
        next: "pend_not_delivered",
        icon: "fa-solid fa-hourglass-half",
        desc: "Shipment not yet delivered – pend."
      }
    ]
  },

  apply_reweigh_reason: {
    text: "What is the reason why Reweigh was not applied? Is there any comment stating the reweigh is invalid?",
    help: "Identify why reweigh hasn't been applied yet.",
    choices: [
      {
        label: "YES",
        next: "apply_reweigh_invalid_comment",
        icon: "fa-solid fa-triangle-exclamation",
        desc: "Invalid reason/comment exists."
      },
      {
        label: "NO",
        next: "apply_reweigh_compare_hu",
        icon: "fa-solid fa-clipboard-list",
        desc: "No invalidity comment – compare handling units."
      }
    ]
  },

  apply_reweigh_invalid_comment: {
    text: "Advise customer that the reweigh was invalid and cannot be applied. Request documentation supporting the reweighed weight.",
    help: "Invalid reweigh – require valid documentation.",
    choices: []
  },

  apply_reweigh_compare_hu: {
    text: "Do the handling units on the Reweigh Cert and BOL not match?",
    help: "Check for handling unit mismatch.",
    choices: [
      {
        label: "YES",
        next: "apply_reweigh_invalid_hu",
        icon: "fa-solid fa-circle-check",
        desc: "Handling units do not match."
      },
      {
        label: "NO",
        next: "apply_reweigh_weight_diff",
        icon: "fa-solid fa-weight-scale",
        desc: "Handling units match – check weight difference."
      }
    ]
  },

  apply_reweigh_invalid_hu: {
    text: "Advise customer the reweigh was invalid (HU mismatch). Request documentation supporting the reweighed weight.",
    help: "Handling unit mismatch invalidates reweigh.",
    choices: []
  },

  apply_reweigh_weight_diff: {
    text: "Is there a big difference between BOL weight and reweighed weight?",
    help: "Evaluate percentage variance.",
    choices: [
      {
        label: "YES (26%+)",
        next: "apply_reweigh_invalid_big_diff",
        icon: "fa-solid fa-chart-line",
        desc: "Variance >25% – invalid."
      },
      {
        label: "NO (25% or less)",
        next: "apply_reweigh_proceed",
        icon: "fa-solid fa-circle-check",
        desc: "Variance ≤25% – valid."
      }
    ]
  },

  apply_reweigh_invalid_big_diff: {
    text: "Reweigh is invalid due to large variance. Request documentation supporting the reweighed weight.",
    help: "Large variance invalidates reweigh.",
    choices: []
  },

  apply_reweigh_proceed: {
    text: "Proceed and apply the Reweighed weight.",
    help: "Valid reweigh – apply to invoice.",
    choices: []
  },

  /* ==================== OTHER DISPUTE TYPES ==================== */

  pallet_weight: {
    text: "Move to Billing Dispute for further assistance",
    help: "Pallet weight disputes are handled by Billing Dispute team.",
    choices: []
  },

  reweigh_certificate: {
    text: "Move the case to Invoice Reprint.",
    help: "Reweigh certificate issues go to Invoice Reprint team.",
    choices: []
  },

  others_not_weight: {
    text: "Move the case to the appropriate queue based on the dispute.",
    help: "Non‑weight disputes should be routed to correct specialty queue.",
    choices: []
  }

};
