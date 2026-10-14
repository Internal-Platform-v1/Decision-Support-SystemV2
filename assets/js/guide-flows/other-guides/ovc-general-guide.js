/* =========================================================
   OVC — GENERAL GUIDELINE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "ovc-general-guide",
  title: "OVC — General Guideline",
  startNode: "start",
  templateCollection: "ovc_general_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "OVC General Guide",
    help: "Use this guide to determine the appropriate handling of an Overcharge Claim (OVC) dispute, including payment status, timeline, OVC form, and dispute type routing.",
    choices: [
      {
        label: "Continue",
        next: "check_invoice_paid",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the OVC dispute resolution process."
      }
    ]
  },

  check_invoice_paid: {
    text: "Is the invoice paid and closed?",
    help: "Determine payment status of the invoice before proceeding.",
    choices: [
      {
        label: "Yes",
        next: "paid_closed",
        icon: "fa-solid fa-circle-check",
        desc: "Invoice is already paid and closed."
      },
      {
        label: "No",
        next: "not_paid_closed",
        icon: "fa-solid fa-circle-xmark",
        desc: "Invoice is still open or unpaid."
      }
    ]
  },

  paid_closed: {
    text: "Is it within 180 + 7 days?",
    help: "Check the dispute filing timeline according to item 438.",
    choices: [
      {
        label: "Yes",
        next: "within_days",
        icon: "fa-regular fa-calendar-check",
        desc: "Within the 180+7 day filing window."
      },
      {
        label: "No",
        next: "billers_error",
        icon: "fa-regular fa-calendar-times",
        desc: "Outside the 180+7 day window."
      }
    ]
  },

  billers_error: {
    text: "Is it a biller's error?",
    help: "Determine if the billing error is attributable to FedEx (biller).",
    choices: [
      {
        label: "Yes",
        next: "within_days",
        icon: "fa-solid fa-bug",
        desc: "Error is a biller's error – timeline exception allowed."
      },
      {
        label: "No",
        next: "not_billers_error",
        icon: "fa-solid fa-thumbs-down",
        desc: "Not a biller's error – strict timeline applies."
      }
    ]
  },

  not_billers_error: {
    text: "Deny the claim. Claims should be filed within 180+7 days per item 438.",
    help: "Claim denied due to untimely filing and no biller error.",
    choices: []
  },

  not_paid_closed: {
    text: "Move the case to the appropriate queue (BD or PRICING).",
    help: "Invoice is open/unpaid – route to Billing Dispute or Pricing queue.",
    choices: []
  },

  within_days: {
    text: "Is there an OVC form provided?",
    help: "Check if customer has submitted the OVC (Overcharge Claim) form.",
    choices: [
      {
        label: "Yes",
        next: "type_of_dispute",
        icon: "fa-solid fa-file-pdf",
        desc: "OVC form is provided – proceed to dispute type."
      },
      {
        label: "No",
        next: "ask_for_form",
        icon: "fa-solid fa-envelope",
        desc: "No OVC form – request it from customer."
      }
    ]
  },

  ask_for_form: {
    text: "Respond to the customer and ask for the OVC form.",
    help: "Customer must submit an OVC form to proceed with dispute.",
    choices: []
  },

  type_of_dispute: {
    text: "Review Claim. What is the type of dispute?",
    help: "Select the category that matches the customer’s claim.",
    choices: [
      {
        label: "Priority Plus Shipment",
        next: "priority_plus",
        icon: "fa-solid fa-truck-fast",
        desc: "Dispute related to Priority Plus service."
      },
      {
        label: "Intra-Canada Shipment",
        next: "intra_canada",
        icon: "fa-solid fa-maple-leaf",
        desc: "Domestic Canada shipment dispute."
      },
      {
        label: "Inspected Shipment",
        next: "inspected_shipment",
        icon: "fa-solid fa-clipboard-list",
        desc: "Shipment that was inspected."
      },
      {
        label: "Reweigh Concern",
        next: "reweigh_concern",
        icon: "fa-solid fa-scale-balanced",
        desc: "Weight or reweigh discrepancy."
      },
      {
        label: "Billing Dispute Concern",
        next: "billing_dispute",
        icon: "fa-solid fa-file-invoice-dollar",
        desc: "General billing dispute."
      },
      {
        label: "Pricing Concern",
        next: "pricing_concern",
        icon: "fa-solid fa-tag",
        desc: "Pricing or rate application issue."
      },
      {
        label: "International Shipment",
        next: "international_shipment",
        icon: "fa-solid fa-globe",
        desc: "Cross-border or international shipment."
      },
      {
        label: "Detention / Redelivery / Limited Access / Port",
        next: "detention_cases",
        icon: "fa-solid fa-clock",
        desc: "Accessorial charges like detention, redelivery."
      },
      {
        label: "GTE / GAMD and CDW",
        next: "otc_gems_cow",
        icon: "fa-solid fa-shield",
        desc: "Guaranteed service, GAMD, or CDW disputes."
      }
    ]
  },

  priority_plus: {
    text: "Send dispute to Priorityplus@fedex.com using OSV email. Is the dispute accepted by the Reviewing Party?",
    help: "Escalate to Priority Plus team and await acceptance.",
    choices: [
      {
        label: "Yes",
        next: "process_on_tms",
        icon: "fa-solid fa-circle-check",
        desc: "Dispute accepted – proceed to process on TFMS."
      },
      {
        label: "No",
        next: "educate_customer",
        icon: "fa-solid fa-circle-xmark",
        desc: "Dispute rejected – educate customer."
      }
    ]
  },

  intra_canada: {
    text: "Send dispute to Domesticrates@fedex.com using OSV email. Is the dispute accepted by the Reviewing Party?",
    help: "Escalate to Domestic Rates team.",
    choices: [
      {
        label: "Yes",
        next: "process_on_tms",
        icon: "fa-solid fa-circle-check",
        desc: "Dispute accepted – proceed to process on TFMS."
      },
      {
        label: "No",
        next: "educate_customer",
        icon: "fa-solid fa-circle-xmark",
        desc: "Dispute rejected – educate customer."
      }
    ]
  },

  inspected_shipment: {
    text: "Send dispute to Freightresearch@fedex.com using OSV email. Is the dispute accepted by the Reviewing Party?",
    help: "Escalate to Freight Research team.",
    choices: [
      {
        label: "Yes",
        next: "process_on_tms",
        icon: "fa-solid fa-circle-check",
        desc: "Dispute accepted – proceed to process on TFMS."
      },
      {
        label: "No",
        next: "educate_customer",
        icon: "fa-solid fa-circle-xmark",
        desc: "Dispute rejected – educate customer."
      }
    ]
  },

  reweigh_concern: {
    text: "Follow Reweigh Process and use FBC to calculate the credit. Did we pull up the claim amount after autorating?",
    help: "Apply reweigh process, then check if claim amount was auto-rated.",
    choices: [
      {
        label: "Yes",
        next: "final_note",
        icon: "fa-solid fa-circle-check",
        desc: "Claim amount pulled – proceed with processing."
      },
      {
        label: "No",
        next: "final_notes",
        icon: "fa-solid fa-circle-xmark",
        desc: "Claim amount not pulled – educate customer with note."
      }
    ]
  },

  billing_dispute: {
    text: "Follow Billing Dispute Process and use FBC to calculate the credit. Did we pull up the claim amount after autorating?",
    help: "Apply billing dispute process, then check auto-rating result.",
    choices: [
      {
        label: "Yes",
        next: "final_note",
        icon: "fa-solid fa-circle-check",
        desc: "Claim amount pulled – proceed with processing."
      },
      {
        label: "No",
        next: "final_notes",
        icon: "fa-solid fa-circle-xmark",
        desc: "Claim amount not pulled – educate customer with note."
      }
    ]
  },

  pricing_concern: {
    text: "Follow Pricing Process and use FBC to calculate the credit. Did we pull up the claim amount after autorating?",
    help: "Apply pricing process, then check auto-rating result.",
    choices: [
      {
        label: "Yes",
        next: "final_note",
        icon: "fa-solid fa-circle-check",
        desc: "Claim amount pulled – proceed with processing."
      },
      {
        label: "No",
        next: "final_notes",
        icon: "fa-solid fa-circle-xmark",
        desc: "Claim amount not pulled – educate customer with note."
      }
    ]
  },

  international_shipment: {
    text: "Send dispute to Tina Stewart and Andrea Staats email. Is the dispute accepted by the Reviewing Party?",
    help: "Escalate to designated international contacts.",
    choices: [
      {
        label: "Yes",
        next: "process_on_tms",
        icon: "fa-solid fa-circle-check",
        desc: "Dispute accepted – proceed to process on TFMS."
      },
      {
        label: "No",
        next: "educate_customer",
        icon: "fa-solid fa-circle-xmark",
        desc: "Dispute rejected – educate customer."
      }
    ]
  },

  detention_cases: {
    text: "Move the case to SBL Emails queue and add 'OVC+Dispute' on the subject line. Is the dispute accepted by the Reviewing Party?",
    help: "Route to SBL Emails queue with proper subject.",
    choices: [
      {
        label: "Yes",
        next: "process_on_tms",
        icon: "fa-solid fa-circle-check",
        desc: "Dispute accepted – proceed to process on TFMS."
      },
      {
        label: "No",
        next: "educate_customer",
        icon: "fa-solid fa-circle-xmark",
        desc: "Dispute rejected – educate customer."
      }
    ]
  },

  otc_gems_cow: {
    text: "Move the case to FXF Guaranteed Service Dispute Queue. Is the dispute accepted by the Reviewing Party?",
    help: "Route to Guaranteed Service dispute queue.",
    choices: [
      {
        label: "Yes",
        next: "process_on_tms",
        icon: "fa-solid fa-circle-check",
        desc: "Dispute accepted – proceed to process on TFMS."
      },
      {
        label: "No",
        next: "educate_customer",
        icon: "fa-solid fa-circle-xmark",
        desc: "Dispute rejected – educate customer."
      }
    ]
  },

  process_on_tms: {
    text: "Go ahead and process the claim on TFMS.",
    help: "Process the accepted claim in TFMS system.",
    choices: []
  },

  educate_customer: {
    text: "Educate the customer accordingly.",
    help: "Provide explanation and guidance to customer.",
    choices: []
  },

  final_note: {
    text: "Go ahead and process the claim on TFMS.\n\nNOTE: For Billing Incorrectly PROs, correction needs to be done on FBC.",
    textHtml: "Go ahead and process the claim on TFMS.<br><br><em>NOTE: For Billing Incorrectly PROs, correction needs to be done on FBC.</em>",
    help: "Process claim with special note for billing incorrectly PROs.",
    choices: []
  },

  final_notes: {
    text: "Educate the customer accordingly.\n\nNOTE: For Billing Incorrectly PROs, correction needs to be done on FBC.",
    textHtml: "Educate the customer accordingly.<br><br><em>NOTE: For Billing Incorrectly PROs, correction needs to be done on FBC.</em>",
    help: "Educate customer with note about FBC correction.",
    choices: []
  }

};
