/* =========================================================
   PRO NUMBER SUFFIX GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "pro-no-suffix",
  title: "Pro Number Suffix Guide",
  startNode: "start",
  templateCollection: "pro_no_suffix_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Pro Number Suffix Guide",
    help: "Use this guide to identify the correct handling based on the PRO number suffix.",
    note: "Supported suffixes: C0, D0, Y0, F0, S0, -01",
    choices: [
      {
        label: "Continue",
        next: "pro_suffix",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Pro Number Suffix guide."
      }
    ]
  },

  pro_suffix: {
    text: "What is the Pro number suffix?",
    help: "Select the suffix shown on the PRO number before proceeding.",
    choices: [
      {
        label: "F0",
        next: "f0_claim_filed",
        icon: "fa-solid fa-file-circle-xmark",
        desc: "Dead Over Freight."
      },
      {
        label: "D0",
        next: "d0_invoice_amount",
        icon: "fa-solid fa-file-invoice-dollar",
        desc: "Check if the invoice has an amount."
      },
      {
        label: "C0",
        next: "c0_company_business",
        icon: "fa-solid fa-building",
        desc: "Company Business."
      },
      {
        label: "Y0",
        next: "y0_standard_recovery",
        icon: "fa-solid fa-recycle",
        desc: "Salvage."
      },
      {
        label: "01 & 02",
        next: "suffix_01_02_non_revenue",
        icon: "fa-solid fa-hashtag",
        desc: "Non-Revenue PRO related to the Master Revenue PRO."
      }
    ]
  },

  /* =========================
     F0 (DEAD OVER FREIGHT)
  ========================= */

  f0_claim_filed: {
    text: "Has a claim been filed?",
    help: "Check whether a claim has already been filed for the F0 Dead Over Freight PRO.",
    choices: [
      {
        label: "Yes",
        next: "f0_customer_received_reply",
        icon: "fa-solid fa-circle-check",
        desc: "A claim has been filed."
      },
      {
        label: "No",
        next: "f0_forward_filefreightclaim",
        icon: "fa-solid fa-circle-xmark",
        desc: "No claim has been filed."
      }
    ]
  },

  f0_customer_received_reply: {
    text: "Has the customer received a reply?",
    help: "Check whether the customer already received a reply from file.freightclaim@fedex.com.",
    choices: [
      {
        label: "Yes",
        next: "f0_customer_received_reply_yes",
        icon: "fa-solid fa-circle-check",
        desc: "The customer already received a reply."
      },
      {
        label: "No",
        next: "f0_customer_received_reply_no",
        icon: "fa-solid fa-circle-xmark",
        desc: "The customer has not received a reply yet."
      }
    ]
  },

  f0_customer_received_reply_yes: {
    text: "If the customer has already received a reply from file.freightclaim@fedex.com, advise the customer accordingly.",
    help: "Since the customer already received a reply, no additional forwarding is needed.",
    choices: []
  },

  f0_customer_received_reply_no: {
    text: "Send an email to the Training team who will forward the case.",
    help: "Escalate the case to the Training team so they can forward it correctly.",
    choices: []
  },

  f0_forward_filefreightclaim: {
    text: "Forward the case to file.freightclaim@fedex.com.",
    help: "If no claim has been filed yet, forward the case to the freight claim email.",
    choices: []
  },

  /* =========================
     D0
  ========================= */

  d0_invoice_amount: {
    text: "Does the invoice have an amount?",
    help: "Check whether the D0 invoice has a balance or amount shown.",
    choices: [
      {
        label: "Yes",
        next: "d0_submit_void_queue",
        icon: "fa-solid fa-circle-check",
        desc: "The invoice has an amount."
      },
      {
        label: "No",
        next: "d0_disregard_invoice",
        icon: "fa-solid fa-circle-xmark",
        desc: "The invoice has no amount."
      }
    ]
  },

  d0_submit_void_queue: {
    text: "Submit the Pro to VOID queue.",
    help: "If the invoice has an amount, the PRO should be submitted to the VOID queue.",
    choices: []
  },

  d0_disregard_invoice: {
    text: "Advise the customer to disregard the invoice since Pro has no Balance.",
    help: "No VOID submission is needed when the PRO has no balance.",
    choices: []
  },

  /* =========================
     C0 (COMPANY BUSINESS)
  ========================= */

  c0_company_business: {
    text: "BOL shows Bill To FedEx Company Business?",
    help: "Check the BOL and confirm whether the shipment is billed to FedEx Company Business.",
    note: "If the PRO is R0, check BOL and if it states Company Business, update to bill FEDEX (Prepaid/Collect) then send to VOID. If it does not state that it is for a company business shipment, reach out to center to confirm.",
    choices: [
      {
        label: "Yes",
        next: "c0_submit_void_company_business",
        icon: "fa-solid fa-circle-check",
        desc: "The BOL shows Bill To FedEx Company Business."
      },
      {
        label: "No",
        next: "c0_send_email_center",
        icon: "fa-solid fa-circle-xmark",
        desc: "The BOL does not clearly show FedEx Company Business."
      }
    ]
  },

  c0_submit_void_company_business: {
    text: "Submit the Pro to VOID queue. COMPANY BUSINESS NON-REVENUE.",
    help: "Use this when the shipment is confirmed as Company Business.",
    choices: []
  },

  c0_send_email_center: {
    text: "Send an email to the Center to confirm if the shipment is a Company Business Shipment.",
    help: "Confirmation from the Center is needed before proceeding.",
    choices: []
  },

  /* =========================
     Y0 (SALVAGE)
  ========================= */

  y0_standard_recovery: {
    text: "Standard Recovery bill; Non Revenue. Must have a Previous R0 or F0 version.",
    help: "Y0 PROs are salvage-related non-revenue bills and should have a previous R0 or F0 version.",
    choices: [
      {
        label: "Continue",
        next: "y0_customer_disputes",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed with salvage handling."
      }
    ]
  },

  y0_customer_disputes: {
    text: "If the customer disputes the R0 pro,",
    help: "Follow the proper salvage or prior-version validation when the customer disputes the related R0 PRO.",
    choices: []
  },

  /* =========================
     01 & 02
  ========================= */

  suffix_01_02_non_revenue: {
    text: "Non-Revenue PRO that is related to the Master Revenue PRO. Review the master pro.",
    help: "Use the master revenue PRO as reference when handling suffix 01 and 02.",
    choices: []
  }

};
