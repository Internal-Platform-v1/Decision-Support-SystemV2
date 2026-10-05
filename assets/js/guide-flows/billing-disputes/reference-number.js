/* =========================================================
   REFERENCE NUMBER — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "reference-number",
  title: "Reference Number",
  startNode: "start",
  templateCollection: "reference_number_template"
};

window.GUIDE_NODES = {

start: {
  text: "Reference Number - General Guide",
  help: "Use this guide to add, edit, or delete reference numbers on the PRO and determine the correct follow-up action after the correction is completed.",
  note: "Always review the customer request, BOL or supporting document, existing reference numbers, correction code, and invoice delivery request before proceeding.",
  choices: [
    {
      label: "Continue",
      next: "root",
      icon: "fa-solid fa-arrow-right",
      desc: "Start the Reference Number decision flow."
    }
  ]
},

  root: {
    text: "What is the request?",
    help: "Choose the type of reference number request.",
    choices: [
      {
        label: "ADD",
        next: "add_intro_example",
        icon: "fa-solid fa-plus",
        desc: "Use the add reference number flow."
      },
      {
        label: "EDIT",
        next: "edit_intro_example",
        icon: "fa-solid fa-pen-to-square",
        desc: "Use the edit reference number flow."
      },
      {
        label: "DELETE",
        next: "delete_intro_example",
        icon: "fa-solid fa-trash",
        desc: "Use the delete reference number flow."
      }
    ]
  },

  /* =========================================================
     ADD FLOW
  ========================================================= */

  add_intro_example: {
    text: "Add Reference Number",
    help: "This flow will guide you through adding a new reference number on the PRO.",
    choices: [
      {
        label: "Continue",
        next: "add_step1",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the add reference number guide."
      }
    ]
  },

  add_step1: {
    text: "Open the Reference Edits screen.",
    help: "CAPS > System - Reference Edits > Menu - Processing > Application - Edit Corrections",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/add-step-1.png",
    choices: [
      {
        label: "Continue",
        next: "add_step2",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  add_step2: {
    text: "The Reference Edits screen will open.",
    help: "Use this screen to begin adding the new reference entry.",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/add-step-2.png",
    choices: [
      {
        label: "Continue",
        next: "add_step3",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  add_step3: {
    text: "Enter the Type and Reference Number, then click Add/Update.",
    help: "a. Enter the Type\nb. Enter the Reference Number\nc. Click Add/Update",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/add-step-3.png",
    choices: [
      {
        label: "Continue",
        next: "add_step4",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  add_step4: {
    text: "Click Submit at the top of the screen.",
    help: "After adding the new reference entry, click Submit to proceed.",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/add-step-4.png",
    choices: [
      {
        label: "Continue",
        next: "add_step5",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  add_step5: {
    text: "Enter CORR in HU/Keyword.",
    help: "Move back to the correction flow and enter CORR in HU/Keyword.",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/add-step-5.png",
    choices: [
      {
        label: "Continue",
        next: "add_step6",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  add_step6: {
    text: "Tab over to the correction code field.",
    help: "Move to the correction code field to identify the correct code for the reference number change.",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/add-step-6.png",
    choices: [
      {
        label: "Continue",
        next: "add_step7",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  add_step7: {
    text: "Enter the correction code.",
    help: "EREF - if you are adding, updating, or removing the Reference No. per the BOL or any document provided by the customer at the time of pickup.\n\nCUSI - if you are adding, updating, or removing the Reference No. but not the BOL, or another document provided during pickup by the customer.",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/add-step-7.png",
    choices: [
      {
        label: "Continue",
        next: "add_step8",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

add_step8: {
  text: "DO NOT AUTO-RATE",
  note: "DO NOT AUTO-RATE\n\nAuto-rating will override the manual changes made during the correction process. When this happens:\n\n• The reference updates (add/update/delete) may be removed\n• The changes will not push through in the system\n• The request may need to be redone, causing delays",
  choices: [
    {
      label: "Continue",
      next: "add_step9",
      icon: "fa-solid fa-arrow-right",
      desc: "Proceed after reviewing the reminder."
    }
  ]
},

  add_step9: {
    text: "Enter the required comment.",
    help: "VS-BLER-CASE#-ADDED\nPO/BL/SID/LOAD/SNBR NUMBER PER BOL",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/add-step-9.png",
    choices: [
      {
        label: "Continue",
        next: "add_step10",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

add_step10: {
  text: "Select Accept All or F6 to complete the request.",
  help: "At the top of Corrections, select Accept All or F6. This completes the request.",
  image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/add-step-10.png",
  choices: [
    {
      label: "Continue",
      next: "demand_invoice_q1",
      icon: "fa-solid fa-arrow-right",
      desc: "Proceed to Step 11: Demand Invoice."
    }
  ]
},

  /* =========================================================
     EDIT FLOW
  ========================================================= */

  edit_intro_example: {
    text: "Edit Reference Number",
    help: "This flow will guide you through updating an existing reference number on the PRO.",
    choices: [
      {
        label: "Continue",
        next: "edit_step1",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the edit reference number guide."
      }
    ]
  },

  edit_step1: {
    text: "Open the Reference Edits screen.",
    help: "CAPS > System - Reference Edits > Menu - Processing > Application - Edit Corrections",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/edit-step-1.png",
    choices: [
      {
        label: "Continue",
        next: "edit_step2",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  edit_step2: {
    text: "Select the reference number to be changed on the Freight Bill box.",
    help: "When the Reference Edit screen opens, select the reference number that needs to be changed in the Reference Number(s) on Freight Bill box.",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/edit-step-2.png",
    choices: [
      {
        label: "Continue",
        next: "edit_step3",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  edit_step3: {
    text: "Enter the new Reference Number.",
    help: "Type the correct replacement value in the reference number field.",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/edit-step-3.png",
    choices: [
      {
        label: "Continue",
        next: "edit_step4",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  edit_step4: {
    text: "Select Add/Update and then click Submit.",
    help: "After updating the value, click Add/Update and then click the Submit icon at the top of the screen.",
    note: "When updating multiple reference numbers on one PRO, repeat the edit process one reference number at a time before clicking Submit.",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/edit-step-4.png",
    choices: [
      {
        label: "Continue",
        next: "edit_step5",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  edit_step5: {
    text: "Enter CORR in HU/Keyword.",
    help: "Move back to the correction flow and enter CORR in HU/Keyword.",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/edit-step-5.png",
    choices: [
      {
        label: "Continue",
        next: "edit_step6",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  edit_step6: {
    text: "Tab over and enter the correction code.",
    help: "EREF - if you are adding, updating, or removing the Reference No. per the BOL or any document provided by the customer at the time of pickup.\n\nCUSI - if you are adding, updating, or removing the Reference No. but not the BOL, or another document provided during pickup by the customer.",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/edit-step-6.png",
    choices: [
      {
        label: "Continue",
        next: "edit_step7",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

edit_step7: {
  text: "DO NOT AUTO-RATE",
  note: "DO NOT AUTO-RATE\n\nAuto-rating will override the manual changes made during the correction process. When this happens:\n\n• The reference updates (add/update/delete) may be removed\n• The changes will not push through in the system\n• The request may need to be redone, causing delays",
  choices: [
    {
      label: "Continue",
      next: "edit_step8",
      icon: "fa-solid fa-arrow-right",
      desc: "Proceed after reviewing the reminder."
    }
  ]
},

  edit_step8: {
    text: "Enter the required comment.",
    help: "VS-BLER-CASE#-ADDED\nPO/BL/SID/LOAD/SNBR NUMBER PER BOL",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/edit-step-8.png",
    choices: [
      {
        label: "Continue",
        next: "edit_step9",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

edit_step9: {
  text: "Select Accept All or F6 to complete the request.",
  help: "At the top of Corrections, select Accept All or F6. This completes the request.",
  image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/edit-step-9.png",
  choices: [
    {
      label: "Continue",
      next: "demand_invoice_q1",
      icon: "fa-solid fa-arrow-right",
      desc: "Proceed to Step 11: Demand Invoice."
    }
  ]
},

  /* =========================================================
     DELETE FLOW
  ========================================================= */

  delete_intro_example: {
    text: "Delete Reference Number",
    help: "This flow will guide you through removing an existing reference number from the PRO.",
    choices: [
      {
        label: "Continue",
        next: "delete_step1",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the delete reference number guide."
      }
    ]
  },

  delete_step1: {
    text: "Open the Reference Edits screen.",
    help: "CAPS > System - Reference Edits > Menu - Processing > Application - Edit Corrections",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/delete-step-1.png",
    choices: [
      {
        label: "Continue",
        next: "delete_step2",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  delete_step2: {
    text: "The Reference Edits screen will open.",
    help: "Use this screen to locate the reference entry that needs to be removed.",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/delete-step-2.png",
    choices: [
      {
        label: "Continue",
        next: "delete_step3",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  delete_step3: {
    text: "Select the reference number that needs to be deleted.",
    help: "Highlight the correct reference number from the Freight Bill box before removing it.",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/delete-step-3.png",
    choices: [
      {
        label: "Continue",
        next: "delete_step4",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  delete_step4: {
    text: "Delete the reference number and submit the request.",
    help: "Remove the selected reference number, then submit the correction request.",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/delete-step-4.png",
    choices: [
      {
        label: "Continue",
        next: "delete_step5",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  delete_step5: {
    text: "Enter CORR in HU/Keyword.",
    help: "Move back to the correction flow and enter CORR in HU/Keyword.",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/delete-step-5.png",
    choices: [
      {
        label: "Continue",
        next: "delete_step6",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  delete_step6: {
    text: "Tab over and enter the correction code.",
    help: "EREF - if you are adding, updating, or removing the Reference No. per the BOL or any document provided by the customer at the time of pickup.\n\nCUSI - if you are adding, updating, or removing the Reference No. but not the BOL, or another document provided during pickup by the customer.",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/delete-step-6.png",
    choices: [
      {
        label: "Continue",
        next: "delete_step7",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

delete_step7: {
  text: "DO NOT AUTO-RATE",
  note: "DO NOT AUTO-RATE\n\nAuto-rating will override the manual changes made during the correction process. When this happens:\n\n• The reference updates (add/update/delete) may be removed\n• The changes will not push through in the system\n• The request may need to be redone, causing delays",
  choices: [
    {
      label: "Continue",
      next: "delete_step8",
      icon: "fa-solid fa-arrow-right",
      desc: "Proceed after reviewing the reminder."
    }
  ]
},

  delete_step8: {
    text: "Enter the required comment.",
    help: "VS-BLER-CASE#-DELETED\nPO/BL/SID/LOAD/SNBR NUMBER PER BOL",
    image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/delete-step-8.png",
    choices: [
      {
        label: "Continue",
        next: "delete_step9",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

delete_step9: {
  text: "Select Accept All or F6 to complete the request.",
  help: "At the top of Corrections, select Accept All or F6. This completes the request.",
  image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/delete-step-9.png",
  choices: [
    {
      label: "Continue",
      next: "demand_invoice_q1",
      icon: "fa-solid fa-arrow-right",
      desc: "Proceed to Step 11: Demand Invoice."
    }
  ]
},


/* =========================================================
   STEP 11 - DEMAND INVOICE
========================================================= */

demand_invoice_q1: {
  text: "11. Demand Invoice",
  help: "After adding the reference number, did the customer request to send the invoice via email and provide a specific email address?",
  choices: [
    {
      label: "YES",
      next: "demand_invoice_q2",
      icon: "fa-solid fa-circle-check",
      desc: "The customer requested the invoice to be sent by email."
    },
    {
      label: "NO",
      action: "No need to clone the case. Just update the reference number. The invoice will automatically be sent within 24–48 hours after the correction. Close the case as APPROVED. No need to move to Invoice Reprint.",
      icon: "fa-solid fa-circle-xmark",
      desc: "No email request was provided."
    }
  ]
},

demand_invoice_q2: {
  text: "Is their Invoice Group set to EMAIL, and is the invoice being sent to the same email address that the customer provided?",
  help: "Confirm both the Invoice Group and the email address before deciding the next action.",
  choices: [
    {
      label: "YES",
      action: "Advise the customer that the Reference Number requested was added on the PRO and the updated invoice will be sent to them within 24–48 hours. Close the case as APPROVED since both concerns were addressed.",
      icon: "fa-solid fa-circle-check",
      desc: "Invoice Group is EMAIL and the email address matches."
    },
    {
      label: "NO",
      action: `Clone the case for credit and assign the PARENT CASE to Invoice Reprint.

Leave an Internal Comment stating:
“Billing Disputes has updated the PRO with the Ref Edit requested and customer is needing a new invoice sent to them via email to (“add the email address we need to send it to”).”

Assign the cloned case under your name for credit.

NOTE: Make sure to do a warm transfer to the customer once you move the case to Invoice Reprint.`,
      icon: "fa-solid fa-circle-xmark",
      desc: "Invoice Group is not EMAIL or the email address does not match."
    },
    {
      label: "How to check Invoicing Setup / Invoice Group of customer's account",
      next: "demand_invoice_step_check_group_1",
      icon: "fa-solid fa-magnifying-glass",
      desc: "Open the helper steps."
    }
  ]
},

/* =========================================================
   HELPER STEPS
========================================================= */

demand_invoice_step_check_group_1: {
  text: "1. Go to Customer Profile and click Invoice Profile.",
  help: "Open the customer's Invoice Profile to check the Invoicing Setup / Invoice Group.",
  image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/demand-invoice-check-step1.png",
  choices: [
    {
      label: "Continue",
      next: "demand_invoice_step_check_group_2",
      icon: "fa-solid fa-arrow-right",
      desc: "Go to the next helper step."
    }
  ]
},

demand_invoice_step_check_group_2: {
  text: "2. Check the Invoice Group of the account.",
  help: "Review the Invoice Group shown on the account and confirm whether it is set to an email invoice/print group.",
  image: "guides/Billing%20Dispute%20Guides/reference-number/reference-number-guide/demand-invoice-check-step2.png",
  note: `Sample EMAIL Invoice/Print Groups

EREG    EDA
EMU     EMIA
EMI     ENAO
EBDA (Email Balance Due)
EPST (Email Past Due)`,
  choices: [
    {
      label: "Back to decision",
      next: "demand_invoice_q2",
      icon: "fa-solid fa-arrow-left",
      desc: "Return to the main decision."
    }
  ]
}
};
