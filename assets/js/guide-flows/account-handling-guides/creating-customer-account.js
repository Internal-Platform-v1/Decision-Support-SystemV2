/* =========================================================
   CREATING CUSTOMER'S ACCOUNT — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "creating-customer-account",
  title: "Creating Customer's Account",
  startNode: "start",
  templateCollection: "creating_customer_account_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Creating Customer's Account - General Guide",
    help: "Use this guide to determine when a customer account can be created, when an existing account should be used, and when supervisor approval or account reactivation is required.",
    note: "Always check for an existing account code first. Review archived, deleted, or Do Not Use account status before proceeding with account creation.",
    choices: [
      {
        label: "Continue",
        next: "acc_intro",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the customer account creation flow."
      }
    ]
  },

  acc_intro: {
    text: "Is there an existing account code for the customer?",
    help: "Search first if the customer already has an account code before creating a new one.",
    choices: [
      {
        label: "Yes",
        next: "check_archived",
        icon: "fa-solid fa-circle-check",
        desc: "Customer has an existing account code."
      },
      {
        label: "No",
        next: "account_search",
        icon: "fa-solid fa-circle-xmark",
        desc: "No existing account code was found."
      }
    ]
  },

  check_archived: {
    text: "Is the account archived or deleted?",
    help: "Check the account status and comments before deciding whether to reactivate or continue reviewing the account.",
    choices: [
      {
        label: "Yes",
        next: "check_queue",
        icon: "fa-solid fa-box-archive",
        desc: "Account is archived or deleted."
      },
      {
        label: "No",
        next: "check_dnu",
        icon: "fa-solid fa-circle-xmark",
        desc: "Account is not archived or deleted."
      }
    ]
  },

  check_queue: {
    text: "Are you working from Salesforce queue or PAUD queue?",
    help: "Select the queue where the case is being handled.",
    choices: [
      {
        label: "Salesforce",
        next: "salesforce_review",
        icon: "fa-brands fa-salesforce",
        desc: "Case is being handled from Salesforce."
      },
      {
        label: "PAUD",
        next: "paud_review",
        icon: "fa-solid fa-list-check",
        desc: "Case is being handled from PAUD queue."
      }
    ]
  },

  salesforce_review: {
    text: "Review the comments to identify why the account was archived or deleted.\n\nIf no reason is stated, or if the reason is Low Revenue Location, clone the case and move the parent case to Account Processing. Account Processing will review the request and reactivate the account.",
    choices: []
  },

  paud_review: {
    text: "Review the comments to identify why the account was archived or deleted.",
    help: "If no reason is stated, or if the reason is Low Revenue Location, send a reactivation request using your FedEx email.",
    note: "Send the request to frevsoltm@fedex.com. Once the case is created, move the case to Account Processing. Account Processing will review the request and reactivate the account.",
    choices: [
      {
        label: "View Sample Email",
        next: "email_template",
        icon: "fa-solid fa-envelope-open-text",
        desc: "Open the sample account reactivation email."
      }
    ]
  },

  email_template: {
    text: "Sample Email Template",
    help: "Use this sample when requesting reactivation of a deleted or archived account.",
    noteHtml: `<b>Subject:</b> Request to Reactivate a Deleted/Archived Account - Account ##########<br><br>Hi Team,<br><br>May we request your assistance in reactivating account ########## that is currently Deleted/Archived to avoid creating a duplicate account.<br><br>In case this request is denied, please confirm if we may proceed with creating a new account for this company for billing purposes.<br><br>or<br><br>May we request your assistance in reactivating account ############ that is currently Deleted/Archived to avoid creating a duplicate account. In case this request is denied, please confirm if we can create an account for this company per Service Center request that we received from PAUD ____________.<br><br>Thank you.`,
    choices: []
  },

  check_dnu: {
    text: "Is the account flagged as Do Not Use?",
    help: "Check if the account has a DNU flag before using the existing account number.",
    choices: [
      {
        label: "Yes",
        next: "dnu_action",
        icon: "fa-solid fa-ban",
        desc: "Account is flagged as Do Not Use."
      },
      {
        label: "No",
        next: "final_use_existing_account",
        icon: "fa-solid fa-circle-check",
        desc: "Account can be used if applicable."
      }
    ]
  },

  dnu_action: {
    text: "If the account does not have a specific reason why it was flagged as Do Not Use, send an email to your supervisor and request for the account to be unflagged.",
    choices: []
  },

  final_use_existing_account: {
    text: "Proceed with using the existing account number, if applicable.",
    choices: []
  },

  account_search: {
    text: "Search the customer's shipment history through Shipment Inquiry.",
    help: "Use Shipment Inquiry to verify if the customer location has enough shipment history before requesting approval to create an account.",
    note: "On Citrix, open Shipment Inquiry Web.",
    image: "guides/Account%20Handling%20Guides/creating-customer-account/images/Step1.jpg",
    choices: [
      {
        label: "Next",
        next: "open_customer",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the Customer search step."
      }
    ]
  },

  open_customer: {
    text: "Once Shipment Inquiry Web is opened, click the Customer button.",
    image: "guides/Account%20Handling%20Guides/creating-customer-account/images/Step2.png",
    choices: [
      {
        label: "Next",
        next: "remove_origin",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to remove the origin."
      }
    ]
  },

  remove_origin: {
    text: "Remove the ORIGIN value and leave the field blank.",
    image: "guides/Account%20Handling%20Guides/creating-customer-account/images/Step3.png",
    choices: [
      {
        label: "Next",
        next: "change_date",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to update the date range."
      }
    ]
  },

  change_date: {
    text: "Update the Date field to the time period you want to review.",
    help: "Recommended: change the date range to 3 months.",
    image: "guides/Account%20Handling%20Guides/creating-customer-account/images/Step4.png",
    choices: [
      {
        label: "Next",
        next: "trace_type",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to update the trace type."
      }
    ]
  },

  trace_type: {
    text: "Change the Trace Type to S/C/B, then press TAB.",
    help: "S/C/B stands for Shipper, Consignee, and Bill To.",
    image: "guides/Account%20Handling%20Guides/creating-customer-account/images/Step5.png",
    choices: [
      {
        label: "Next",
        next: "enter_name",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to enter the customer name."
      }
    ]
  },

  enter_name: {
    text: "Type the beginning of the Shipper, Consignee, or Bill To name.",
    help: "Example: enter the first few characters of the company name.",
    image: "guides/Account%20Handling%20Guides/creating-customer-account/images/Step6.png",
    choices: [
      {
        label: "Next",
        next: "enter_address",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to enter the address details."
      }
    ]
  },

  enter_address: {
    text: "Enter the beginning of the address, city, state, and ZIP Code.",
    image: "guides/Account%20Handling%20Guides/creating-customer-account/images/Step7.png",
    choices: [
      {
        label: "Next",
        next: "search_volume",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to search for shipment volume."
      }
    ]
  },

  search_volume: {
    text: "Press ENTER to search for shipment volume for the customer's address.",
    image: "guides/Account%20Handling%20Guides/creating-customer-account/images/Step8.png",
    choices: [
      {
        label: "Next",
        next: "volume_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to review shipment volume."
      }
    ]
  },

  volume_check: {
    text: "Does the customer's location have at least 5 shipments over a 3-month period?",
    help: "Use the shipment history result to determine if the customer location qualifies for account creation review.",
    choices: [
      {
        label: "Yes",
        next: "supervisor_approval_yes",
        icon: "fa-solid fa-circle-check",
        desc: "Location has at least 5 shipments."
      },
      {
        label: "No",
        next: "charge_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Location has fewer than 5 shipments."
      }
    ]
  },

  supervisor_approval_yes: {
    text: "Ask approval from your supervisor before creating the account.",
    help: "Provide all steps you completed to verify that account creation is possible.",
    noteHtml: `<b>Upon requesting approval, you can review the account creation guide:</b><br><a href="guides/Account%20Handling%20Guides/account-creation-steps/account-creation-steps.html" target="_blank" class="guide-link">Open Account Creation Steps</a><br><br><div class="reminder-box"><b>REMINDER:</b><br>Any escalation about incorrect account creation will be considered valid.</div><br><div class="note-box"><b>NOTE:</b><br>If the supervisor allows the agent to create the account and take note of it, the supervisor should still validate if the account is correctly created. If incorrect, the supervisor should coach the agent and delete or flag the account right away.</div>`,
    choices: [
      {
        label: "Next",
        next: "rebill_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after supervisor approval review."
      }
    ]
  },

  charge_check: {
    text: "Is there a charge that needs to be billed to the customer?",
    help: "Confirm if there is a billing need before requesting supervisor approval for account creation.",
    choices: [
      {
        label: "Yes",
        next: "supervisor_approval_no",
        icon: "fa-solid fa-circle-check",
        desc: "There is a charge that needs to be billed."
      },
      {
        label: "No",
        next: "supervisor_approval_no",
        icon: "fa-solid fa-circle-xmark",
        desc: "There is no charge that needs to be billed."
      }
    ]
  },

  supervisor_approval_no: {
    text: "Ask approval from your supervisor before creating the account.",
    help: "Provide all steps you completed to verify that account creation is possible, even if the shipment volume does not meet the 5-shipment threshold.",
    noteHtml: `<b>Upon requesting approval, you can review the account creation guide:</b><br><a href="guides/Account%20Handling%20Guides/account-creation-steps/account-creation-steps.html" target="_blank" class="guide-link">Open Account Creation Steps</a><br><br><div class="reminder-box"><b>REMINDER:</b><br>Any escalation about incorrect account creation will be considered valid.</div>`,
    choices: [
      {
        label: "Next",
        next: "rebill_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after supervisor approval review."
      }
    ]
  },

  rebill_check: {
    text: "Does the balance increase after the rebill and auto-rating?",
    help: "Check the updated balance after rebill and auto-rating before finalizing the invoice update.",
    choices: [
      {
        label: "Yes",
        next: "final_update_invoice_allowed",
        icon: "fa-solid fa-circle-check",
        desc: "The balance increases after rebill and auto-rating."
      },
      {
        label: "No",
        next: "final_update_invoice_proceed",
        icon: "fa-solid fa-circle-xmark",
        desc: "The balance does not increase after rebill and auto-rating."
      }
    ]
  },

  final_update_invoice_allowed: {
    text: "You can still proceed with updating the invoice.",
    choices: []
  },

  final_update_invoice_proceed: {
    text: "Proceed with updating the invoice.",
    choices: []
  }

};
