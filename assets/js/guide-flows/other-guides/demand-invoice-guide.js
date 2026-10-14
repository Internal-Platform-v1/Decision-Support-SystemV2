/* =========================================================
   DEMAND INVOICE GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "demand-invoice-guide",
  title: "Demand Invoice Guide",
  startNode: "start",
  templateCollection: "demand_invoice_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Demand Invoice - Handling Guide",
    help: "Start with key reminders for handling posted and unposted PROs.",
    noteHtml: `<div style="margin-bottom:14px;"><div style="font-weight:800; font-size:13px; color:#475569; margin-bottom:10px;">⚠ REMINDERS</div><ul style="margin:0; padding-left:18px;"><li>Send invoice ONLY to debtor. For 3PL, send only to 3PL; for FPAY, send to FPAY or customer.</li><li>After corrections, RESEND invoice. For reference changes, RESEND invoice.</li><li>For error messages on posted PROs, check if pending invoice, no open balance, or unposted error.</li><li>For unposted PROs, identify the queue (CORR-Q, RATE-Q, PAUD GOVH/GORR, etc.) and follow escalation.</li></ul></div><div style="margin-top:16px;"><div style="font-weight:800; font-size:13px; margin-bottom:10px;">📌 NOTE</div><p>Always verify whether the PRO is already posted or still unposted before proceeding. Use the flow below to guide your response.</p></div>`,
    choices: [
      {
        label: "Continue to Main Flow",
        next: "posted_unposted_start",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the posted/unposted PRO handling process."
      }
    ]
  },

  posted_unposted_start: {
    text: "Is PRO Posted?",
    help: "Start here to determine whether the PRO is already posted or still unposted.",
    note: "REMINDER: Send ONLY to debtor.\n\n3PL → send to 3PL only\nFPAY → send to FPAY or customer\nAfter corrections → RESEND invoice\nReference change → RESEND invoice",
    choices: [
      {
        label: "Yes",
        next: "posted_request",
        icon: "fa-solid fa-check",
        desc: "PRO is already posted."
      },
      {
        label: "No",
        next: "queue_unposted",
        icon: "fa-solid fa-xmark",
        desc: "PRO is being unposted or not yet posted."
      }
    ]
  },

  /* ==================== POSTED PRO ==================== */

  posted_request: {
    text: "What is request?",
    help: "Choose the request that matches the customer concern on a posted PRO.",
    choices: [
      {
        label: "Error Message Pop up?",
        next: "posted_error_popup",
        icon: "fa-solid fa-triangle-exclamation",
        desc: "Customer sees an error or cannot process the invoice."
      },
      {
        label: "Not Yet Billed?",
        next: "posted_not_yet_billed",
        icon: "fa-solid fa-hourglass-half",
        desc: "Invoice is not yet billed or not yet fully billed."
      },
      {
        label: "Resend Invoice",
        next: "resend_invoice_type",
        icon: "fa-solid fa-paper-plane",
        desc: "Customer is asking for invoice resend."
      },
      {
        label: "Duplicate Invoice #",
        next: "duplicate_invoice_final",
        icon: "fa-solid fa-clone",
        desc: "Customer wants a resend with a unique invoice number."
      }
    ]
  },

  posted_error_popup: {
    text: "Pending Invoice — Replace Request\nNo Open Balance — Closed / Not invoiced\nUnposted Error — Send to TL\nNo Info — Not fully billed — Monitor",
    help: "Use the handling note shown in the flow for error pop-up related concerns.",
    choices: []
  },

  posted_not_yet_billed: {
    text: "Advise: Advise the customer that Pro is still not invoiced and pending to be entered into the system and that you will monitor the PRO, once invoiced, you can proceed with the request.\n\nPend the case and monitor every day.",
    help: "Use this when the invoice is still not billed yet.",
    choices: []
  },

  resend_invoice_type: {
    text: "Check Invoice Type",
    help: "Select the invoice type or invoice group to determine the correct resend handling.",
    choices: [
      {
        label: "Paper",
        next: "paper_invoice_final",
        icon: "fa-solid fa-print",
        desc: "Printed paper invoice request."
      },
      {
        label: "Email",
        next: "email_invoice_final",
        icon: "fa-solid fa-envelope",
        desc: "Email invoice setup is available."
      },
      {
        label: "EDI",
        next: "edi_invoice_final",
        icon: "fa-solid fa-network-wired",
        desc: "EDI account or EDI redrop request."
      }
    ]
  },

  paper_invoice_final: {
    text: "PAPER — only if print setup\n\nSample Paper Invoice/Print Groups below:\nREGI\nBADA\nREGC\nREGU\nCI02\nCI15\n\nNOTE: NO LIMIT PER BATCH (PAPER)",
    help: "Use paper invoice group reference and resend handling.",
    choices: []
  },

  email_invoice_final: {
    text: "EMAIL — only if email setup\n\nSample EMAIL Invoice/Print Groups below:\nEREG\nEMU\nEMC\nEDA\nENA\nEBDA (Email Balance Due)\nEIMAI (Email Past Due)\n\nNOTE: LIMIT PER BATCH (EMAIL)\n25 PROs for invoice only\n15 PROs for invoice with backup docs\n100 PROs total limit via email",
    help: "Use email invoice group reference and resend handling.",
    choices: []
  },

  edi_invoice_final: {
    text: "EDI — only if EDI account\n\nSample EDI Invoice/Print Groups below:\nCI05 EDIU FLXB\nCI06 EDHU FSYN\nCI07 EDXB SRG\nCI09 EWAL SYNF\nEDI FLHD SYNS\nEDIS FLTA WEDH\nEDI7 FLTE WEDI\nEDEA FLTH WEDP\nEDEM FLTX WGVE\n\nNOTE: NO LIMIT PER BATCH (EDI)",
    help: "Use EDI group reference and redrop handling.",
    choices: []
  },

  duplicate_invoice_final: {
    text: "If customer requests to resend the invoice with unique invoice number since they cannot process the same invoice numbers in their system twice, reply",
    note: "Hi,\n\nPlease be advised that there will be no additional characters can be added for FedEx. You can add an alpha on your end to complete the payment process.\n\nThank you,",
    choices: []
  },

  /* ==================== UNPOSTED PRO ==================== */

  queue_unposted: {
    text: "On what QUEUE PRO is being Unposted?",
    help: "Choose the current queue where the unposted PRO is sitting.",
    choices: [
      {
        label: "NO QUEUE",
        next: "no_queue_voided",
        icon: "fa-solid fa-inbox",
        desc: "No queue is currently tagged."
      },
      {
        label: "CORR-Q & SPEC-ERR",
        next: "corr_spec_final",
        icon: "fa-solid fa-screwdriver-wrench",
        desc: "Correction or special error queue."
      },
      {
        label: "RATE-Q / PRICING",
        next: "rate_pricing_reopened",
        icon: "fa-solid fa-scale-balanced",
        desc: "Pricing review queue."
      },
      {
        label: "PAUD GOVH / GORR",
        next: "paud_govh_final",
        icon: "fa-solid fa-building-columns",
        desc: "Government or GORR queue."
      },
      {
        label: "OTHER QUEUE",
        next: "other_queue_final",
        icon: "fa-solid fa-share-nodes",
        desc: "Any other queue not listed above."
      }
    ]
  },

  no_queue_voided: {
    text: "Is it Voided?",
    help: "Check whether the PRO is already voided.",
    choices: [
      {
        label: "Yes",
        next: "voided_yes_final",
        icon: "fa-solid fa-circle-check",
        desc: "PRO is already voided."
      },
      {
        label: "No",
        next: "voided_no_final",
        icon: "fa-solid fa-circle-xmark",
        desc: "PRO is not voided."
      }
    ]
  },

  voided_yes_final: {
    text: "Advised the customer accordingly.",
    help: "Use this when the PRO is already voided.",
    choices: []
  },

  voided_no_final: {
    text: "Open FBC → CORR VRFY → Accept All → Check FBI if posted\n\n2x4 Comment: VS-BLER-CASE#:CORR VRFY TO POST THE",
    help: "Use this internal handling when the PRO is not voided and not sitting on a queue.",
    choices: []
  },

  corr_spec_final: {
    text: "Send an email to TL who will forward it to post the invoice.",
    help: "Use the TL escalation path for CORR-Q and SPEC-ERR.",
    choices: []
  },

  rate_pricing_reopened: {
    text: "If case reopened and customer is still insisting",
    help: "Choose whether this is a reopened pricing case or the initial pricing queue handling.",
    choices: [
      {
        label: "Yes",
        next: "rate_pricing_reopened_final",
        icon: "fa-solid fa-rotate-right",
        desc: "Case was reopened and customer still insists."
      },
      {
        label: "No",
        next: "rate_pricing_initial_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Initial pricing queue status."
      }
    ]
  },

  rate_pricing_initial_final: {
    text: "Advised customer: PRO XXXXXXXX is under rating queue for review and will be posted once rates are verified.",
    help: "Use this for the initial pricing queue response.",
    choices: []
  },

  rate_pricing_reopened_final: {
    text: "Advised customer: The pricing on the shipments is still being reviewed and we want to verify pricing before posting. We apologize for the inconvenience.",
    help: "Use this when the case was reopened and the customer is still insisting.",
    choices: []
  },

  paud_govh_final: {
    text: "Send email to TL for them to escalate to Lenita.Giannini for GOVH and to Shayne.Whealton for GORR and always cc Kendrea Wallace",
    help: "Use this queue escalation instruction for PAUD GOVH / GORR.",
    choices: []
  },

  other_queue_final: {
    text: "Send an email to TL who will send to Team Kurt PAUD to post the invoice",
    help: "Use this when the PRO is in another queue.",
    choices: []
  }

};
