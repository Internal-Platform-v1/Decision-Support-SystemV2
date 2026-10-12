/* =========================================================
   REGIONS AND EHOT QUEUE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "region-and-ehot-queue",
  title: "Regions and EHOT Queue Guide",
  startNode: "start",
  templateCollection: "region_and_ehot_queue_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Regions and EHOT Queue Guide",
    help: "Review the request carefully and choose the category that best matches the work needed.",
    note: "Always verify supporting documentation, BOL details, service center comments, and request completeness before proceeding.",
    choices: [
      {
        label: "Continue",
        next: "request_type",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Regions and EHOT Queue guide."
      }
    ]
  },

  request_type: {
    text: "What is the request all about?",
    help: "Select the type of request based on the customer or queue submission.",
    choices: [
      {
        label: "Account Related Request",
        next: "account_related_request",
        icon: "fa-solid fa-id-card",
        desc: "Change, add, or create shipper/consignee accounts."
      },
      {
        label: "Accessorial Related Request",
        next: "accessorial_related_request",
        icon: "fa-solid fa-screwdriver-wrench",
        desc: "Add, remove, rebill, or change an accessorial."
      },
      {
        label: "Class or Weight Related Request",
        next: "class_weight_related_request",
        icon: "fa-solid fa-weight-scale",
        desc: "Correct class or weight details on the pro."
      },
      {
        label: "Service Type Related Request",
        next: "service_type_related_request",
        icon: "fa-solid fa-truck-fast",
        desc: "Update the service type of the pro."
      },
      {
        label: "Rebill Related Request",
        next: "rebill_related_request",
        icon: "fa-solid fa-file-invoice-dollar",
        desc: "Follow debtor general guideline for rebill requests."
      },
      {
        label: "Reference Edit Related Request",
        next: "reference_edit_related_request",
        icon: "fa-solid fa-hashtag",
        desc: "Handle reference edit requests."
      },
      {
        label: "Request to add a Keyword on Pro",
        next: "keyword_related_request",
        icon: "fa-solid fa-keyboard",
        desc: "Add a keyword to the PRO and determine if autorating is affected."
      }
    ]
  },

  /* ================= ACCOUNT RELATED ================= */

  account_related_request: {
    text: "What is the actual Request?",
    help: "Choose the account-related request type.",
    choices: [
      {
        label: "Change Shipper/Consignee Address",
        next: "acct_change_address_match_bol",
        icon: "fa-solid fa-location-dot",
        desc: "Update the shipper or consignee address."
      },
      {
        label: "Add Shipper/Consignee Account",
        next: "acct_add_account_match_bol",
        icon: "fa-solid fa-user-plus",
        desc: "Add a shipper or consignee account."
      },
      {
        label: "Request is to create an account",
        next: "acct_create_account_charge",
        icon: "fa-solid fa-building-circle-check",
        desc: "Create a new account after completing account search process."
      }
    ]
  },

  acct_change_address_match_bol: {
    text: "Are they requesting to change the Shipper/Consignee Address to match the information on BOL?",
    help: "Verify whether the requested change matches the BOL.",
    choices: [
      {
        label: "Yes",
        action: "If the request matches the information on BOL, proceed with the Correction Request",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with the correction request."
      },
      {
        label: "No",
        next: "acct_change_address_reconsignment",
        icon: "fa-solid fa-circle-xmark",
        desc: "Check if the request is related to reconsignment."
      }
    ]
  },

  acct_change_address_reconsignment: {
    text: "Is the request related to a Reconsignment?",
    help: "Use this when the requested address does not match the BOL.",
    choices: [
      {
        label: "Yes",
        action: "Deny the request and advise them to create a new pro if it is related to Reconsignment",
        icon: "fa-solid fa-circle-check",
        desc: "Deny and advise new pro creation."
      },
      {
        label: "No",
        action: "Deny the request stating that the requested Shipper/Consignee information does not match with the BOL",
        icon: "fa-solid fa-circle-xmark",
        desc: "Deny the request."
      }
    ]
  },

  acct_add_account_match_bol: {
    text: "Are they requesting to Add a Shipper/Consignee Account that match the information on BOL",
    help: "Verify whether the requested account addition matches the BOL.",
    choices: [
      {
        label: "Yes",
        action: "If the request matches the information on BOL, proceed with the Correction Request",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with the correction request."
      },
      {
        label: "No",
        next: "acct_add_account_reconsignment",
        icon: "fa-solid fa-circle-xmark",
        desc: "Check if the request is related to reconsignment."
      }
    ]
  },

  acct_add_account_reconsignment: {
    text: "Is the request related to a Reconsignment?",
    help: "Use this when the requested account does not match the BOL.",
    choices: [
      {
        label: "Yes",
        action: "Deny the request and advise them to create a new pro if it is related to Reconsignment",
        icon: "fa-solid fa-circle-check",
        desc: "Deny and advise new pro creation."
      },
      {
        label: "No",
        action: "Deny the request stating that the requested Shipper/Consignee information does not match with the BOL",
        icon: "fa-solid fa-circle-xmark",
        desc: "Deny the request."
      }
    ]
  },

  acct_create_account_charge: {
    text: "Is there a charge to be billed on the newly created account?",
    help: "Check if the account creation request is connected to a charge that needs billing.",
    note: "Make sure that no existing account is available, whether active or not. Follow the Account Search Process thoroughly beforehand.",
    choices: [
      {
        label: "Yes",
        next: "acct_create_existing_location",
        icon: "fa-solid fa-circle-check",
        desc: "There is a charge to be billed."
      },
      {
        label: "No",
        next: "acct_create_search_history",
        icon: "fa-solid fa-circle-xmark",
        desc: "There is no charge to be billed."
      }
    ]
  },

  acct_create_existing_location: {
    text: "Is there an existing account number (active or inactive) for the requested location?",
    help: "Search whether an account already exists for the requested location.",
    choices: [
      {
        label: "Yes",
        next: "acct_create_existing_status",
        icon: "fa-solid fa-circle-check",
        desc: "An existing account was found."
      },
      {
        label: "No",
        action: "Proceed and create an account for the location per request. Make sure to change the Invoice Group to BADA/billing account or REGI(shipping account) in order for the invoice to be generated",
        icon: "fa-solid fa-circle-xmark",
        desc: "Create the requested account."
      }
    ]
  },

  acct_create_existing_status: {
    text: "Is the account no. active or inactive/Archived, Deleted or Flagged as DNU?",
    help: "Determine the status of the existing account.",
    choices: [
      {
        label: "Active",
        action: "Deny the request of creating an account. Instead, use the active account no. found for billing",
        icon: "fa-solid fa-circle-check",
        desc: "Use the active account found."
      },
      {
        label: "Inactive/Archived or Deleted",
        action: "Find the reason why Account is Archived or Deleted.\n\nThen send an email to fxfrevsbltn@fedex.com and request for the account to be reactivated. Provide reason why it needs to be reactivated.\n\nFind the case created and move it to Accounts Processing",
        icon: "fa-solid fa-box-archive",
        desc: "Request reactivation and move the case to Accounts Processing."
      },
      {
        label: "Flagged as DNU",
        next: "acct_create_dnu_suggested",
        icon: "fa-solid fa-flag",
        desc: "Check whether a suggested account can be used."
      }
    ]
  },

  acct_create_dnu_suggested: {
    text: "Is there a suggested account noted on the flagged account?",
    help: "Review the DNU account and check for a suggested replacement account.",
    choices: [
      {
        label: "Yes",
        action: "Check the suggested account if it can be used.",
        icon: "fa-solid fa-circle-check",
        desc: "Review the suggested account."
      },
      {
        label: "No",
        action: "Send an email to your supervisor and request to unflag the account found",
        icon: "fa-solid fa-circle-xmark",
        desc: "Request to unflag the account."
      }
    ]
  },

  acct_create_search_history: {
    text: "Search for Shipment History of a Location through SHIPMENT INQUIRY",
    help: "Follow the shipment inquiry process before creating an account with no charge to bill.",
    choices: [
      {
        label: "Show Steps",
        next: "acct_create_search_steps",
        icon: "fa-solid fa-magnifying-glass",
        desc: "Review the shipment inquiry lookup process."
      }
    ]
  },

  acct_create_search_steps: {
    text: "Shipment Inquiry Search Process",
    help: "Follow the process below to review shipment history for the requested location.",
    note: "A. On Citrix, open Shipment Inquiry Web\nB. Once opened, click on the “Customer” button\n1. Click on Accts Operations\n2. Click on shipment inquiry\n3. Trace/Click on “CUSTOMER”\n4. Then take out the origin and delete",
    image: "guides/PAUD%20Guides/region-and-ehot-queue/images/account-search-step-1.png",
    choices: [
      {
        label: "Continue",
        next: "acct_create_search_steps_2",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the trace by customer search setup."
      }
    ]
  },

  acct_create_search_steps_2: {
    text: "Trace by Customer Search Setup",
    help: "Use the filters below when tracing by consignee/customer.",
    note: "a. On the date move it back to the time period you want-(Changed the date range to 3 months)\nb. Trace Type: Change to consignee “C” then tab\nc. Then type in the beginning of the consignee name\nd. Then beginning of the address\ne. Then city, state, zip\nf. Hit Enter and it searches for the volume for that address",
    image: "guides/PAUD%20Guides/region-and-ehot-queue/images/account-search-step-2.jpg",
    choices: [
      {
        label: "Continue",
        next: "acct_create_search_steps_3_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to shipment volume validation."
      }
    ]
  },

  acct_create_search_steps_3_final: {
    action: "If you find 5 or more shipments to said location for said party then you can create the account, even if they do not have a charge that needs to be invoiced. This search will not be performed on every request received, only requests sent in specifically asking for the account to be setup.",
    note: "Shipment Volume Validation",
    image: "guides/PAUD%20Guides/region-and-ehot-queue/images/account-search-step-3.jpg"
  },

  /* ================= ACCESSORIAL RELATED ================= */

  accessorial_related_request: {
    text: "What is the Request",
    help: "Choose the accessorial request type.",
    choices: [
      {
        label: "Add an Accessorial",
        next: "accessorial_add_support",
        icon: "fa-solid fa-plus",
        desc: "Request is to add an accessorial."
      },
      {
        label: "Remove an Accessorial",
        next: "accessorial_remove_support",
        icon: "fa-solid fa-minus",
        desc: "Request is to remove an accessorial."
      },
      {
        label: "Rebill an Accessorial",
        next: "accessorial_rebill_support",
        icon: "fa-solid fa-file-invoice-dollar",
        desc: "Request is to rebill an accessorial."
      },
      {
        label: "Change Accessorial Type",
        next: "accessorial_change_type_support",
        icon: "fa-solid fa-repeat",
        desc: "Request is to change the accessorial type."
      }
    ]
  },

  accessorial_add_support: {
    text: "Is there any documentation, comment or email from Service Center that will support that validity of the accessorial fee?",
    help: "Check whether the request is supported by documentation.",
    choices: [
      {
        label: "Yes",
        action: "Proceed and Add the Accessorial\n\nCORR ACC - if accessorial is not requested on BOL but still valid\n\nCORR EACC - if accessorial is request on BOL/Billing mask and is valid",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with the accessorial add request."
      },
      {
        label: "No",
        action: "Deny the request and leave a comment stating that fee cannot be added since no documentation that supports the validity of the accessorial fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "Deny the request."
      }
    ]
  },

  accessorial_remove_support: {
    text: "Is there any documentation, comment or email from Service Center that will support that validity of the accessorial fee?",
    help: "Check whether the request is supported by documentation.",
    choices: [
      {
        label: "Yes",
        action: "Proceed and remove the Accessorial fee.\n\nCORR NACC - if accessorial should be removed since it was not performed\n\nCORR EACC - if accessorial should be removed per Instruction or Notes on BOL/Billing mask",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with the accessorial removal request."
      },
      {
        label: "No",
        action: "Deny the request and leave a comment stating that the accessorial is valid and should not be removed.\n\nIf fee is valid but should be removed per Service Center Error, Service Center should request for Write off for the Fee through OPS Write Off",
        icon: "fa-solid fa-circle-xmark",
        desc: "Deny the request."
      }
    ]
  },

  accessorial_rebill_support: {
    text: "Is there any documentation, comment or email from Service Center that will support that validity of the accessorial fee?",
    help: "Check whether the request is supported by documentation.",
    choices: [
      {
        label: "Yes",
        action: "Proceed and rebill the pro per Operations request. This is also applicable if the request is to rebill per LOA even if LOA is not yet imaged",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with the rebill request."
      },
      {
        label: "No",
        action: "Deny request and remove the fee since it is confirmed to be invalid",
        icon: "fa-solid fa-circle-xmark",
        desc: "Remove the invalid fee."
      }
    ]
  },

  accessorial_change_type_support: {
    text: "Is there any documentation, comment or email from Service Center that will support that validity of the accessorial fee?",
    help: "Check whether the request is supported by documentation.",
    choices: [
      {
        label: "Yes",
        action: "Proceed and update the Accessorial fee.\n\nCORR EADL",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with the accessorial type change."
      },
      {
        label: "No",
        action: "Deny the request and leave a comment stating that fee cannot be updated to the requested accessorial since no documentation that supports the validity of the accessorial fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "Deny the request."
      }
    ]
  },

  /* ================= OTHER REQUEST TYPES ================= */

  class_weight_related_request: {
    text: "Is there a documentation, comment or email from Service Center supporting the requested class or weight update?",
    help: "Check if the requested class or weight update is supported by documentation.",
    choices: [
      {
        label: "Yes",
        action: "Proceed with the Correction and update the class/weight of the pro",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with class or weight correction."
      },
      {
        label: "No",
        action: "Deny the request and leave a comment stating that there is no documentation that will support the Class/Weight Change",
        icon: "fa-solid fa-circle-xmark",
        desc: "Deny the request."
      }
    ]
  },

  service_type_related_request: {
    text: "Is there a documentation, comment or email from Service Center supporting the requested Service type update?",
    help: "Check if the requested service type update is supported by documentation.",
    choices: [
      {
        label: "Yes",
        action: "Proceed with the Correction and update the Service Type of the pro",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with service type correction."
      },
      {
        label: "No",
        action: "Deny the request and leave a comment stating that there is no documentation that will support the Service Type Change Request",
        icon: "fa-solid fa-circle-xmark",
        desc: "Deny the request."
      }
    ]
  },

  rebill_related_request: {
    text: "Rebill Related Request",
    help: "Use the debtor general guideline for debtor change requests.",
    choices: [
      {
        label: "Continue",
        action: "Follow Debtor General Guideline for Debtor Change Requests",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed using debtor general guideline."
      }
    ]
  },

  reference_edit_related_request: {
    text: "Reference Edit Related Request",
    help: "Reference edit requests may proceed as long as the request contains complete information.",
    choices: [
      {
        label: "Continue",
        action: "Proceed with the request regarding Reference Edit regardless if there is no document that will support it as long as complete information is provided on the request",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed with reference edit request."
      }
    ]
  },

  keyword_related_request: {
    text: "Will the Keyword affect the Invoice Amount when added and autorated?",
    help: "Determine whether autorating will change the invoice amount after adding the keyword.",
    choices: [
      {
        label: "Yes",
        action: "Proceed with the Correction without Autorating the Pro",
        icon: "fa-solid fa-circle-check",
        desc: "Do not autorate the PRO."
      },
      {
        label: "No",
        action: "Proceed with the Correction and Auto Rate the pro",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed and autorate the PRO."
      }
    ]
  }

};
