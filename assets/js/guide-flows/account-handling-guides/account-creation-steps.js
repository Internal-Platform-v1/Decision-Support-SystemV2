/* =========================================================
   ACCOUNT CREATION STEPS — FLOW CONFIG + NODES
   Step-by-step guide with two branch points.
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "account-creation-steps",
  title: "Steps on How to Create an Account",
  startNode: "start",
  templateCollection: "account_creation_steps_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Account Creation Steps",
    help: "Follow these steps in order to create a customer account in the Corrections screen and update the print group.",
    note: "The account number gets created as a temporary account and must be confirmed before updating the print group.",
    choices: [
      {
        label: "Continue",
        next: "step1",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the account creation process."
      }
    ]
  },

  step1: {
    text: "Update the Account",
    help: "Remove the account number and update the name to the Shipper / Consignee / BT account.\n\n⚠ NEVER UPDATE THE ADDRESS.",
    image: "guides/Account%20Handling%20Guides/account-creation-steps/images/step1.png",
    choices: [
      {
        label: "Next",
        next: "step2",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to place the cursor in the Account field."
      }
    ]
  },

  step2: {
    text: "Place Cursor in Account Field",
    help: "Place the cursor in the Shipper / Consignee / BT number field.",
    image: "guides/Account%20Handling%20Guides/account-creation-steps/images/step2.png",
    choices: [
      {
        label: "Next",
        next: "step3",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to remove the account code."
      }
    ]
  },

  step3: {
    text: "Remove the Account Code",
    help: "Use the SPACE BAR to remove the account code.",
    image: "guides/Account%20Handling%20Guides/account-creation-steps/images/step3.png",
    choices: [
      {
        label: "Next",
        next: "step4",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to enter the customer name."
      }
    ]
  },

  step4: {
    text: "Enter the Customer Name",
    help: "Enter the name for the Shipper / Consignee / BT.",
    image: "guides/Account%20Handling%20Guides/account-creation-steps/images/step4.png",
    choices: [
      {
        label: "Next",
        next: "step5",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to enter the complete address."
      }
    ]
  },

  step5: {
    text: "Enter Complete Address",
    help: "Ensure address includes street, city, state, ZIP and country (US).\n\n⚠ Do NOT use a PO BOX.",
    image: "guides/Account%20Handling%20Guides/account-creation-steps/images/step5.png",
    choices: [
      {
        label: "Next",
        next: "step6",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to remove extra numbers."
      }
    ]
  },

  step6: {
    text: "Remove Extra Numbers",
    help: "Remove any numbers after the Country field.",
    image: "guides/Account%20Handling%20Guides/account-creation-steps/images/step6.png",
    choices: [
      {
        label: "Next",
        next: "step7",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to accept changes."
      }
    ]
  },

  step7: {
    text: "Accept Changes",
    help: "Click Accept All or press F6.",
    image: "guides/Account%20Handling%20Guides/account-creation-steps/images/step7.png",
    choices: [
      {
        label: "Next",
        next: "step8",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to confirm the temporary account."
      }
    ]
  },

  step8: {
    text: "Confirm Temporary Account",
    help: "Click YES to create the temporary account.",
    image: "guides/Account%20Handling%20Guides/account-creation-steps/images/step8.png",
    choices: [
      {
        label: "Next",
        next: "step9",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to wait for account creation."
      }
    ]
  },

  step9: {
    text: "Temporary Account Created",
    help: "A new Shipper / Consignee / BT account will appear.\n\nAllow 2–3 minutes for processing.",
    image: "guides/Account%20Handling%20Guides/account-creation-steps/images/step9.png",
    choices: [
      {
        label: "Next",
        next: "step9_copy",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to copy the account number."
      }
    ]
  },

  step9_copy: {
    text: "Copy the Account Number",
    help: "Copy the newly created account number and paste it in your tracker.",
    choices: [
      {
        label: "Next",
        next: "step9_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to check the customer profile."
      }
    ]
  },

  step9_check: {
    text: "Check Customer Profile",
    help: "Does FBC populate the newly created account details when you click the Customer Profile?",
    choices: [
      {
        label: "YES",
        next: "step10",
        icon: "fa-solid fa-circle-check",
        desc: "The account details populate correctly."
      },
      {
        label: "NO",
        next: "step9_wait",
        icon: "fa-solid fa-circle-xmark",
        desc: "The account is still processing."
      }
    ]
  },

  step9_wait: {
    text: "Account Still Processing",
    help: "Skip the PRO or place it on pending.\n\nGo back after 5–10 minutes.\n\n⚠ DO NOT ATTEMPT TO CREATE ANOTHER ACCOUNT.",
    choices: [
      {
        label: "Retry Check",
        next: "step9_check",
        icon: "fa-solid fa-rotate",
        desc: "Return to the customer profile check."
      }
    ]
  },

  step10: {
    text: "Update Print Group",
    help: "Update the PRINT GROUP of the newly created account.\n\nIs the account:",
    choices: [
      {
        label: "Personal / Residential",
        next: "personal_invoice",
        icon: "fa-solid fa-house",
        desc: "Personal or residential account."
      },
      {
        label: "Company / Corporate",
        next: "corp_invoice_profile",
        icon: "fa-solid fa-building",
        desc: "Company or corporate account."
      }
    ]
  },

  personal_invoice: {
    text: "Send Invoice Manually",
    help: "Manually send an invoice using:\n\nREGI – Shipping Code\nBADA – Billing Code\n\nInclude this in your comment.",
    choices: [
      {
        label: "Next",
        next: "refresh_pro",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to refresh the PRO."
      }
    ]
  },

  corp_invoice_profile: {
    text: "Open Invoice Profile",
    help: "Click Invoice Profile.",
    image: "guides/Account%20Handling%20Guides/account-creation-steps/images/stepA.png",
    choices: [
      {
        label: "Next",
        next: "corp_print_group",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to enter the print group."
      }
    ]
  },

  corp_print_group: {
    text: "Enter Invoice / Print Group",
    help: "Enter the new Invoice / Print Group:\n\nREGI (Shipping Code)\nBADA (Billing Code)",
    image: "guides/Account%20Handling%20Guides/account-creation-steps/images/stepB.png",
    choices: [
      {
        label: "Next",
        next: "corp_save",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to save the update."
      }
    ]
  },

  corp_save: {
    text: "Save the Update",
    help: "Click ✓ to save.",
    image: "guides/Account%20Handling%20Guides/account-creation-steps/images/stepC.png",
    choices: [
      {
        label: "Next",
        next: "corp_comment",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to add the comment."
      }
    ]
  },

  corp_comment: {
    text: "Add Comment",
    help: "Click Comments → Add Comment\n\nComment Type: General Information\n\nEnter:\n\nVS-BLER-CASE#-UPDATED PG TO REGI/BADA TO REMOVE FROM TEMP AUDIT",
    image: "guides/Account%20Handling%20Guides/account-creation-steps/images/stepD.jpg",
    choices: [
      {
        label: "Next",
        next: "refresh_pro",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to refresh the PRO."
      }
    ]
  },

  refresh_pro: {
    text: "Refresh the PRO",
    help: "Go back to the PRO and refresh the account by updating the terms.\n\nAdd BT back if there is one so the new print group will reflect.",
    choices: [
      {
        label: "Next",
        next: "correction_request",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to enter the correction request."
      }
    ]
  },

  correction_request: {
    text: "Enter Correction Request",
    action: "Enter the correction request:\n\nVS-BLER-CASE#-CREATED SHIPPER/CONSIGNEE/BT ACCOUNT AS THIS WAS A 6 DIGIT CENTER CODE\n\nCORR ACCR"
  }

};
