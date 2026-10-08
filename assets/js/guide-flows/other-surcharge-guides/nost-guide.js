/* =========================================================
   NOST GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "nost-guide",
  title: "NOST Guide",
  startNode: "start",
  templateCollection: "nost_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "NOST DISPUTE",
    help: "Start by reviewing the weekly calendar and pickup setup on the shipper's account profile.",
    image: "guides/Other%20Surcharge%20Guides/nost-guide/images/weekly-calendar.png",
    choices: [
      {
        label: "Continue",
        next: "apption_hours_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Begin NOST validation."
      }
    ]
  },

  apption_hours_check: {
    text: "Is there an operation hours noted on daily pick-up?",
    help: "Check the account profile if operation hours are listed.",
    choices: [
      {
        label: "Yes",
        next: "move_to_rqd1",
        icon: "fa-solid fa-circle-check",
        desc: "Operation hours are present."
      },
      {
        label: "No",
        next: "review_dashboard",
        icon: "fa-solid fa-circle-xmark",
        desc: "No operation hours found."
      }
    ]
  },

  move_to_rqd1: {
    text: "Move the pro under RQD1 QUEUE and enter 2x4 comment.",
    help: "Use proper comment format when moving the pro.",
    note: "VS-NOST-CASE-VOID.PLEASE VOID PRO PER WEEKLY CAL DAILY PICK-UP SCHED.",
    image: "guides/Other%20Surcharge%20Guides/nost-guide/images/rqd1-comment.png",
    choices: []
  },

  review_dashboard: {
    text: "Review the Pro on dashboard.",
    help: "Access dashboard using the provided link to check pickup details.",
    noteHtml: `<a href="http://fxfspot.prod.cloud.fedex.com:8080/spotfire/wp/analysis?file=/FXF/RQ_S%26A/Z_Users/Chase%20King/AnalysisFiles/NOST/nost_stops&waid=9Pr39YRSRkCTO1mndrEPb-13014066fdxijn&wavid=0" target="_blank" style="color:#4D148C; text-decoration:none; font-weight:500; display:inline-flex; align-items:center; gap:6px;"><i class="fa-solid fa-chart-line"></i> Open NOST Dashboard</a>`,
    choices: [
      {
        label: "Continue",
        next: "dashboard_view",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to dashboard validation."
      }
    ]
  },

  dashboard_view: {
    text: "When the request is called into the service center, the dashboard will look like below:",
    image: "guides/Other%20Surcharge%20Guides/nost-guide/images/dashboard-call.png",
    choices: [
      {
        label: "Continue",
        next: "automation_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to automation validation."
      }
    ]
  },

  automation_check: {
    text: "If no automation details appear, it means request was handled through phone call.",
    help: "Check RMK note to identify the agent who handled the call.",
    image: "guides/Other%20Surcharge%20Guides/nost-guide/images/rmk-note.png",
    note: "RMK will show agent and timestamp of call.",
    choices: [
      {
        label: "Continue",
        next: "online_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to online request validation."
      }
    ]
  },

  online_check: {
    text: "When it is set up online, the dashboard will look like below:",
    image: "guides/Other%20Surcharge%20Guides/nost-guide/images/dashboard-online.png",
    note: "If requested via phone/service center, no details will show here.",
    choices: [
      {
        label: "Continue",
        next: "shipment_history",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to shipment validation."
      }
    ]
  },

  shipment_history: {
    text: "Review customer shipment history through Shipper Search in CAPS.",
    help: "Ensure freight was not shipped on the same day.",
    image: "guides/Other%20Surcharge%20Guides/nost-guide/images/caps-search.png",
    choices: [
      {
        label: "Continue",
        next: "same_day_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Validate shipment timing."
      }
    ]
  },

  same_day_check: {
    text: "Is there a same day shipment found on CAPS?",
    choices: [
      {
        label: "Yes",
        next: "move_queue_void",
        icon: "fa-solid fa-circle-check",
        desc: "Shipment exists same day."
      },
      {
        label: "No",
        next: "fee_valid",
        icon: "fa-solid fa-circle-xmark",
        desc: "No shipment found."
      }
    ]
  },

  move_queue_void: {
    text: "Move the Pro to QUEUE RQD1 for void with FBC comment.",
    help: "Use correct voiding comment before processing.",
    image: "guides/Other%20Surcharge%20Guides/nost-guide/images/queue-rqd1.png",
    note: "VS-NOST-CASE-VOID PLEASE VOID NOST",
    choices: [
      {
        label: "Continue",
        next: "pend_case",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to monitoring."
      }
    ]
  },

  pend_case: {
    text: "Pend the case and monitor the Pro from time to time.",
    help: "Once voided, advise customer and close the case.",
    choices: []
  },

  fee_valid: {
    text: "Advise customer that fee is valid.",
    help: "Use the standard template in OS.",
    choices: [
      {
        label: "Continue",
        next: "reopen_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed if case is reopened."
      }
    ]
  },

  reopen_check: {
    text: "If the case is reopened and customer insists, review the account if one time courtesy is already processed.",
    help: "Each country level can receive up to 7 courtesy write-offs.",
    noteHtml: `Each country level can receive up to 7 courtesy write-offs. See reference below:<br><br><a href="https://myfedex.sharepoint.com.mcas.ms/:x:/r/teams/DetentionDisputeSupport/_layouts/15/doc2.aspx?sourcedoc=%7BE6692C4A-9794-446B-AC7C-6FFA38BE7936%7D&file=NOST%20Courtesy%20Write%20Offs.xlsx&fromShare=true&action=default&mobileredirect=true" target="_blank" style="color:#4D148C; text-decoration:none; font-weight:500; display:inline-flex; align-items:center; gap:6px;"><i class="fa-solid fa-file-excel"></i> NOST Courtesy Write-Offs</a>`,
    choices: [
      {
        label: "Continue",
        next: "courtesy_decision",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to courtesy validation."
      }
    ]
  },

  courtesy_decision: {
    text: "Is the charge billed to correct account?",
    help: "Verify whether the NOST charge was billed to the correct account before deciding the next action.",
    choices: [
      {
        label: "Yes",
        next: "courtesy_remove",
        icon: "fa-solid fa-circle-check",
        desc: "The charge is billed to the correct account."
      },
      {
        label: "No",
        next: "update_correct_account",
        icon: "fa-solid fa-circle-xmark",
        desc: "The charge is billed to the wrong account."
      },
      {
        label: "Charge cannot be validated",
        next: "freight_bill_void",
        icon: "fa-solid fa-triangle-exclamation",
        desc: "Unable to validate the charge after review."
      }
    ]
  },

  courtesy_remove: {
    text: "Yes - offer a one-time courtesy removal of the charges.",
    help: "If the charge is billed to the correct account, offer a one-time courtesy removal if eligible.",
    choices: [
      {
        label: "Continue",
        next: "process_courtesy",
        icon: "fa-solid fa-arrow-right",
        desc: "Process the one-time courtesy."
      }
    ]
  },

  process_courtesy: {
    text: "Process one time courtesy for up to 7 NOST charges if found on the account through write off and leave note on the account.",
    help: "Apply courtesy through write off and document the action on the account.",
    choices: [
      {
        label: "Continue",
        next: "courtesy_limit",
        icon: "fa-solid fa-arrow-right",
        desc: "Check if the account already exceeded the courtesy limit."
      }
    ]
  },

  courtesy_limit: {
    text: "If more than 7 NOST charges open on the account - deny the request and advise that we could no longer provide additional courtesy adjustments on their account.",
    help: "Once the account has exceeded 7 courtesy write-offs, no further courtesy can be provided.",
    choices: [
      {
        label: "Continue",
        next: "writeoff_tl_approval",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed if the case is reopened and customer still insists."
      }
    ]
  },

  writeoff_tl_approval: {
    text: "If the case reopened and customer is insisted, send a write off approval to your TL.",
    help: "Escalate to your team leader for approval if the customer keeps insisting after courtesy denial.",
    choices: []
  },

  update_correct_account: {
    text: "Update to the correct account.",
    help: "If the charge is not billed to the correct account, update the original application to the proper billing account.",
    choices: [
      {
        label: "Continue",
        next: "account_updated_comment",
        icon: "fa-solid fa-arrow-right",
        desc: "Add the required account update comment."
      }
    ]
  },

  account_updated_comment: {
    text: "VS-ACCS-(case number) updated NOST charges as original application of account was incorrect - updated to bill XXX account.",
    help: "Document that the NOST charge was updated to the correct billing account.",
    choices: [
      {
        label: "Continue",
        next: "respond_case",
        icon: "fa-solid fa-arrow-right",
        desc: "Respond to the case after updating the account."
      }
    ]
  },

  respond_case: {
    text: "Respond to the case and advise the account has been updated.",
    help: "Notify the customer that the billing account has been corrected.",
    choices: []
  },

  freight_bill_void: {
    text: "If the charge cannot be validated submit a freight bill corrections VOID request (Queue “RQD1”).",
    help: "Use this when the NOST charge cannot be validated after review.",
    note: "VS-ACCS-(case number) please void as NOST cannot be validated",
    image: "guides/Other%20Surcharge%20Guides/nost-guide/images/freight-bill.png",
    choices: [
      {
        label: "Continue",
        next: "pend_case_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Pend the case and monitor until completed."
      }
    ]
  },

  pend_case_final: {
    text: "Pend the case and monitor the Pro from time to time. Once voided, advise the customer and close the case.",
    help: "Monitor the void request until completed, then update the customer and close the case.",
    choices: []
  }

};
