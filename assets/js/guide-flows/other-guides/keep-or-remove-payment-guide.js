/* =========================================================
   KEEP OR REMOVE PAYMENT GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "keep-or-remove-payment-guide",
  title: "Keep or Remove Payment Guide",
  startNode: "start",
  templateCollection: "keep_or_remove_payment_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Before proceeding, please review the following reminders carefully.",
    help: "These guidelines are critical for correct payment handling decisions.",
    note: "Reminder: Payment Handling Rules\n- Same debtor + same payer → KEEP payment\n- Debtor change + current debtor paid → REMOVE payment\n- Debtor change + new debtor paid → KEEP payment\n- Payment by 3PL (US Bank/Syncada) → ALWAYS ESCALATE\n                              → Notify TL\n(FISA involvement)\n\nReminder: How to Confirm Payment Source\n- Open FBI → Click PAY (money bag)\n- Check \"Check Information\"\n- If blank → Select ALL (OpCo)\n- For Credit Card:\n→ Open Comments\n→ Locate debtor account number",
    choices: [
      {
        label: "Continue",
        next: "paid_closed_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the flow."
      }
    ]
  },

  paid_closed_check: {
    text: "Is the PRO paid and closed?",
    help: "Start here to determine whether the request falls under keep or remove payment handling.",
    choices: [
      {
        label: "Yes",
        next: "request_type",
        icon: "fa-solid fa-check",
        desc: "The PRO is already paid and closed."
      },
      {
        label: "No",
        next: "normal_case",
        icon: "fa-solid fa-xmark",
        desc: "Handle under the normal process."
      }
    ]
  },

  normal_case: {
    text: "Handle as normal case.",
    help: "Final handling instruction reached.",
    choices: []
  },

  request_type: {
    text: "What is the type of Request?",
    help: "Select the request type to continue.",
    choices: [
      {
        label: "LOA Correction Request",
        next: "loa_old",
        icon: "fa-solid fa-file-signature",
        desc: "Request is related to LOA correction."
      },
      {
        label: "FedEx Billing Error",
        next: "billing_correct",
        icon: "fa-solid fa-file-invoice-dollar",
        desc: "Request is due to a billing correction."
      },
      {
        label: "Pricing / Reweigh",
        next: "pricing_within_180",
        icon: "fa-solid fa-scale-balanced",
        desc: "Request is due to pricing or reweigh."
      }
    ]
  },

  /* ==================== LOA CORRECTION ==================== */

  loa_old: {
    text: "Is PRO > 1 year old?",
    help: "Check the PRO age first.",
    choices: [
      {
        label: "Yes",
        next: "loa_deny_old",
        icon: "fa-solid fa-ban",
        desc: "PRO is more than 1 year old."
      },
      {
        label: "No",
        next: "loa_customer_insists",
        icon: "fa-solid fa-arrow-right",
        desc: "PRO is within 1 year."
      }
    ]
  },

  loa_deny_old: {
    text: "DENY (Advise already paid by debtor per BOL)",
    help: "Final handling instruction reached.",
    choices: []
  },

  loa_customer_insists: {
    text: "Customer insists to proceed?",
    help: "Confirm if the customer still wants to continue.",
    choices: [
      {
        label: "Yes",
        next: "loa_who_paid",
        icon: "fa-solid fa-check",
        desc: "Customer wants to proceed."
      },
      {
        label: "No",
        next: "loa_paid_closed",
        icon: "fa-solid fa-xmark",
        desc: "Customer will not proceed."
      }
    ]
  },

  loa_paid_closed: {
    text: "Advise already paid & closed",
    help: "Final handling instruction reached.",
    choices: []
  },

  loa_who_paid: {
    text: "Who made the payment?",
    help: "Identify who made the payment.",
    choices: [
      {
        label: "Current Debtor (per BOL)",
        next: "loa_rebill_remove",
        icon: "fa-solid fa-user-check",
        desc: "Payment was made by the current debtor."
      },
      {
        label: "Accepting Party (per LOA)",
        next: "loa_rebill_keep",
        icon: "fa-solid fa-handshake",
        desc: "Payment was made by the accepting party."
      }
    ]
  },

  loa_rebill_remove: {
    text: "Rebill to accepting party (LOA) then REMOVE payment",
    help: "Final handling instruction reached.",
    choices: []
  },

  loa_rebill_keep: {
    text: "Rebill to accepting party then KEEP payment",
    help: "Final handling instruction reached.",
    choices: []
  },

  /* ==================== FEDEX BILLING ERROR ==================== */

  billing_correct: {
    text: "Correct billing (terms, weight, class, etc.)",
    help: "Complete the billing correction first.",
    choices: [
      {
        label: "Continue",
        next: "billing_result",
        icon: "fa-solid fa-arrow-right",
        desc: "Move to the result after correction."
      }
    ]
  },

  billing_result: {
    text: "Result after correction?",
    help: "Select the result after billing correction.",
    choices: [
      {
        label: "Negative balance",
        next: "billing_refund",
        icon: "fa-solid fa-rotate-left",
        desc: "Negative balance after correction."
      },
      {
        label: "High credit balance",
        next: "billing_escalate",
        icon: "fa-solid fa-triangle-exclamation",
        desc: "High credit balance after correction."
      },
      {
        label: "No changes on the amount",
        next: "billing_close",
        icon: "fa-solid fa-circle-check",
        desc: "Normal balance after correction."
      },
      {
        label: "(PAUD only) Correct PRO per BOL",
        next: "billing_paud",
        icon: "fa-solid fa-file-circle-check",
        desc: "PAUD-only path."
      }
    ]
  },

  billing_refund: {
    text: "Negative balance — Auto refund (No escalation)",
    help: "Final handling instruction reached.",
    choices: []
  },

  billing_escalate: {
    text: "High credit balance — Escalate for approval FedEx Team LEADS",
    help: "Final handling instruction reached.",
    choices: []
  },

  billing_close: {
    text: "No changes on the amount. Respond to the customer accordingly after the correction.",
    help: "Final handling instruction reached.",
    choices: []
  },

  billing_paud: {
    text: "(PAUD only) — Correct PRO per BOL",
    help: "Final handling instruction reached.",
    choices: []
  },

  /* ==================== PRICING / REWEIGH ==================== */

  pricing_within_180: {
    text: "Within 180 days?",
    help: "Check whether the request is within 180 days.",
    choices: [
      {
        label: "Yes",
        next: "pricing_process",
        icon: "fa-solid fa-check",
        desc: "Within 180 days."
      },
      {
        label: "No",
        next: "pricing_deny",
        icon: "fa-solid fa-xmark",
        desc: "Beyond 180 days."
      }
    ]
  },

  pricing_process: {
    text: "Proceed on reviewing the case and treat it as a normal case.",
    help: "Final handling instruction reached.",
    choices: []
  },

  pricing_deny: {
    text: "Deny it if it’s a reweigh dispute; if it’s pricing-related, you may move it to Pricing Small for further review.",
    help: "Final handling instruction reached.",
    choices: []
  }

};
