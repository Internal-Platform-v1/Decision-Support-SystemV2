/* =========================================================
   VOID AND WRITE OFF GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "void-and-wo-guide",
  title: "Void and Write Off Guide",
  startNode: "start",
  templateCollection: "void_and_wo_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Void and Write Off Guide",
    help: "Review the case type first, then follow the correct path for service center or driver error, Grainger rebill timing, voiding, surcharge removal, or write-off handling.",
    choices: [
      {
        label: "Continue",
        next: "case_type",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Void and Write Off decision guide."
      }
    ]
  },

  case_type: {
    text: "Which type of case are you working on?",
    help: "Choose the path that matches the issue you are handling.",
    choices: [
      {
        label: "Service Center / Driver Error",
        next: "service_error_q1",
        icon: "fa-solid fa-truck-fast",
        desc: "Use this path for service center or driver's error cases."
      },
      {
        label: "Grainger Rebill After 180 Days",
        next: "grainger_q1",
        icon: "fa-solid fa-file-invoice-dollar",
        desc: "Use this path for Grainger rebill requests after 180 days from ship date."
      }
    ]
  },

  service_error_q1: {
    text: "Is the issue due to a service center or driver's error?",
    help: "Confirm whether the problem was caused by a service center or driver's error before proceeding.",
    choices: [
      {
        label: "Yes",
        next: "service_error_q2",
        icon: "fa-solid fa-circle-check",
        desc: "The issue is due to a service center or driver's error."
      },
      {
        label: "No",
        next: "service_regular_process",
        icon: "fa-solid fa-circle-xmark",
        desc: "The issue is not due to a service center or driver's error."
      }
    ]
  },

  service_regular_process: {
    text: "Resolve as per regular process.",
    help: "This case does not qualify for this path.",
    choices: []
  },

  service_error_q2: {
    text: "Is the fee valid or should it be removed?",
    help: "Determine whether the fee should remain or be removed.",
    choices: [
      {
        label: "Yes",
        next: "follow_regular_billing",
        icon: "fa-solid fa-circle-check",
        desc: "The fee is valid."
      },
      {
        label: "No",
        next: "single_surcharge_q",
        icon: "fa-solid fa-circle-xmark",
        desc: "The fee should be removed."
      }
    ]
  },

  follow_regular_billing: {
    text: "Follow regular billing process.",
    help: "Proceed using the normal billing steps.",
    choices: []
  },

  single_surcharge_q: {
    text: "Is there only 1 surcharge on the AO PRO, and it's invalid?",
    help: "Check whether there is only one surcharge on the AO PRO and that surcharge is invalid.",
    choices: [
      {
        label: "Yes",
        next: "void_pro_only_surcharge",
        icon: "fa-solid fa-circle-check",
        desc: "There is only one surcharge and it is invalid."
      },
      {
        label: "No",
        next: "multi_surcharge_q",
        icon: "fa-solid fa-circle-xmark",
        desc: "There is more than one surcharge or the situation is different."
      }
    ]
  },

  void_pro_only_surcharge: {
    text: "VOID the PRO (proceed with voiding process).",
    help: "Since the only surcharge is invalid, continue with the voiding process.",
    choices: [
      {
        label: "Continue",
        next: "valid_writeoff_q",
        icon: "fa-solid fa-arrow-right",
        desc: "Move to the next review step."
      }
    ]
  },

  multi_surcharge_q: {
    text: "Is there more than 1 surcharge on the AO PRO, and surcharge 1 is invalid?",
    help: "Review whether multiple surcharges exist and whether surcharge 1 is the invalid one.",
    choices: [
      {
        label: "Yes",
        next: "remove_surcharge_one",
        icon: "fa-solid fa-circle-check",
        desc: "There are multiple surcharges and surcharge 1 is invalid."
      },
      {
        label: "No",
        next: "pro_paid_or_closed_q",
        icon: "fa-solid fa-circle-xmark",
        desc: "This does not match the multiple surcharge scenario."
      }
    ]
  },

  remove_surcharge_one: {
    text: "Remove surcharge 1; Leave other surcharges intact.",
    help: "Only the invalid surcharge should be removed.",
    choices: [
      {
        label: "Continue",
        next: "valid_writeoff_q",
        icon: "fa-solid fa-arrow-right",
        desc: "Move to the next review step."
      }
    ]
  },

  pro_paid_or_closed_q: {
    text: "Is the PRO paid or closed?",
    help: "Check the current status of the PRO.",
    choices: [
      {
        label: "Yes",
        next: "cannot_void_use_writeoff",
        icon: "fa-solid fa-circle-check",
        desc: "The PRO is already paid or closed."
      },
      {
        label: "No",
        next: "proceed_with_voiding",
        icon: "fa-solid fa-circle-xmark",
        desc: "The PRO is not paid or closed."
      }
    ]
  },

  cannot_void_use_writeoff: {
    text: "Cannot VOID the PRO. Resolve using write-off.",
    help: "Since the PRO is paid or closed, continue through the write-off path.",
    choices: [
      {
        label: "Continue",
        next: "valid_writeoff_q",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to write-off validation."
      }
    ]
  },

  proceed_with_voiding: {
    text: "Proceed with voiding.",
    help: "Continue the case through the voiding process.",
    choices: [
      {
        label: "Continue",
        next: "valid_writeoff_q",
        icon: "fa-solid fa-arrow-right",
        desc: "Move to the next review step."
      }
    ]
  },

  grainger_q1: {
    text: "Is the request to rebill to Grainger after 180 days from the ship date?",
    help: "Confirm whether the request is for a Grainger rebill after 180 days.",
    choices: [
      {
        label: "Yes",
        next: "grainger_q2",
        icon: "fa-solid fa-circle-check",
        desc: "The request is after 180 days from the ship date."
      },
      {
        label: "No",
        next: "grainger_regular_rebill",
        icon: "fa-solid fa-circle-xmark",
        desc: "The request is not after 180 days."
      }
    ]
  },

  grainger_regular_rebill: {
    text: "Proceed with regular rebilling process.",
    help: "Follow the normal rebilling process for this case.",
    choices: []
  },

  grainger_q2: {
    text: "Is the PRO correctly rebilled to Grainger per LOA or agreement?",
    help: "Verify that the rebill follows the LOA or agreement terms.",
    choices: [
      {
        label: "Yes",
        next: "rebill_to_grainger",
        icon: "fa-solid fa-circle-check",
        desc: "The rebill is correctly handled per LOA or agreement."
      },
      {
        label: "No",
        next: "grainger_q3",
        icon: "fa-solid fa-circle-xmark",
        desc: "The rebill was not correctly handled."
      }
    ]
  },

  rebill_to_grainger: {
    text: "Rebill to Grainger and proceed.",
    help: "Proceed with the rebill based on the LOA or agreement.",
    choices: []
  },

  grainger_q3: {
    text: "Has the PRO been incorrectly billed to another company after 180 days?",
    help: "Check whether the PRO was billed to another company instead of Grainger after 180 days.",
    choices: [
      {
        label: "Yes",
        next: "writeoff_or_void_pro",
        icon: "fa-solid fa-circle-check",
        desc: "The PRO was incorrectly billed to another company after 180 days."
      },
      {
        label: "No",
        next: "grainger_regular_billing_procedure",
        icon: "fa-solid fa-circle-xmark",
        desc: "The PRO was not incorrectly billed to another company after 180 days."
      }
    ]
  },

  writeoff_or_void_pro: {
    text: "Write-off or VOID the PRO.",
    help: "Use the appropriate resolution based on the case details.",
    choices: [
      {
        label: "Continue",
        next: "valid_writeoff_q",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to write-off validation."
      }
    ]
  },

  grainger_regular_billing_procedure: {
    text: "Resolve as per regular billing procedure.",
    help: "Use the standard billing procedure for this case.",
    choices: []
  },

  valid_writeoff_q: {
    text: "Is this a valid write-off case (fee removal, over a year old, or contract issue)?",
    help: "Confirm that the case qualifies for write-off.",
    choices: [
      {
        label: "Yes",
        next: "paid_partially_fully_q",
        icon: "fa-solid fa-circle-check",
        desc: "The case qualifies for write-off."
      },
      {
        label: "No",
        next: "normal_billing_or_dispute",
        icon: "fa-solid fa-circle-xmark",
        desc: "The case does not qualify for write-off."
      }
    ]
  },

  normal_billing_or_dispute: {
    text: "Resolve using normal billing or dispute process.",
    help: "This case should not be handled through write-off.",
    choices: []
  },

  paid_partially_fully_q: {
    text: "Has the PRO been paid (partially or fully)?",
    help: "Check whether payment has already been applied to the PRO.",
    choices: [
      {
        label: "Yes",
        next: "remove_payment_before_writeoff",
        icon: "fa-solid fa-circle-check",
        desc: "Payment has been applied to the PRO."
      },
      {
        label: "No",
        next: "proceed_with_writeoff_process",
        icon: "fa-solid fa-circle-xmark",
        desc: "No payment has been applied to the PRO."
      }
    ]
  },

  remove_payment_before_writeoff: {
    text: "Remove payment before write-off.",
    help: "Any applied payment must be removed before continuing.",
    choices: [
      {
        label: "Continue",
        next: "supervisor_payment_removal_q",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to payment removal approval."
      }
    ]
  },

  proceed_with_writeoff_process: {
    text: "Proceed with write-off process.",
    help: "No payment needs to be removed, so continue with write-off handling.",
    choices: [
      {
        label: "Continue",
        next: "writeoff_success_q",
        icon: "fa-solid fa-arrow-right",
        desc: "Move to final status confirmation."
      }
    ]
  },

  supervisor_payment_removal_q: {
    text: "Is the payment to be removed approved by the supervisor?",
    help: "Confirm supervisor approval before removing the payment.",
    choices: [
      {
        label: "Yes",
        next: "remove_payment_and_writeoff",
        icon: "fa-solid fa-circle-check",
        desc: "Supervisor approval has been received."
      },
      {
        label: "No",
        next: "email_supervisor_approval",
        icon: "fa-solid fa-circle-xmark",
        desc: "Supervisor approval has not yet been received."
      }
    ]
  },

  remove_payment_and_writeoff: {
    text: "Remove payment and proceed with write-off process.",
    help: "Once approval is confirmed, remove the payment and continue.",
    choices: [
      {
        label: "Continue",
        next: "writeoff_success_q",
        icon: "fa-solid fa-arrow-right",
        desc: "Move to final status confirmation."
      }
    ]
  },

  email_supervisor_approval: {
    text: "Email supervisor to approve payment removal.",
    help: "Supervisor approval is required before the payment can be removed.",
    choices: [
      {
        label: "Continue",
        next: "writeoff_amount_q",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to write-off amount review."
      }
    ]
  },

  writeoff_amount_q: {
    text: "Is the write-off amount greater than $2,000?",
    help: "Check the total write-off amount before continuing.",
    choices: [
      {
        label: "Yes",
        next: "team_kurt_approval",
        icon: "fa-solid fa-circle-check",
        desc: "The write-off amount is greater than $2,000."
      },
      {
        label: "No",
        next: "writeoff_after_supervisor_approval",
        icon: "fa-solid fa-circle-xmark",
        desc: "The write-off amount is $2,000 or less."
      }
    ]
  },

  team_kurt_approval: {
    text: "Send to TEAM KURT Write-off Request for approval.",
    help: "Large write-off amounts require TEAM KURT approval.",
    choices: [
      {
        label: "Continue",
        next: "writeoff_success_q",
        icon: "fa-solid fa-arrow-right",
        desc: "Move to final status confirmation after approval."
      }
    ]
  },

  writeoff_after_supervisor_approval: {
    text: "Proceed with write-off process after supervisor approval.",
    help: "Once approval is complete, continue with the write-off process.",
    choices: [
      {
        label: "Continue",
        next: "writeoff_success_q",
        icon: "fa-solid fa-arrow-right",
        desc: "Move to final status confirmation."
      }
    ]
  },

  writeoff_success_q: {
    text: "Is the PRO voided or written off successfully?",
    help: "Confirm whether the void or write-off has been completed successfully.",
    choices: [
      {
        label: "Yes",
        next: "inform_customer",
        icon: "fa-solid fa-circle-check",
        desc: "The PRO was successfully voided or written off."
      },
      {
        label: "No",
        next: "pend_and_followup",
        icon: "fa-solid fa-circle-xmark",
        desc: "The process is not yet complete."
      }
    ]
  },

  inform_customer: {
    text: "Inform customer of charges removed.",
    help: "Notify the customer once the charges have been successfully removed.",
    choices: []
  },

  pend_and_followup: {
    text: "Pend case and follow up until completed.",
    help: "Keep the case pending and continue follow-up until the process is complete.",
    choices: []
  }

};
