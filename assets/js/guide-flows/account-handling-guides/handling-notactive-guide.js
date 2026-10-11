/* =========================================================
   HANDLING INACTIVE ACCOUNT — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "handling-notactive-guide",
  title: "Handling Inactive Account",
  startNode: "start",
  templateCollection: "handling_notactive_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Handling Inactive Account Guide",
    help: "Follow the correct path based on the status of the account before updating the invoice or advising the customer.",
    choices: [
      {
        label: "Continue",
        next: "account_status",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Updating SCAC/BU decision guide."
      }
    ]
  },

  account_status: {
    text: "What is the status of the account?",
    help: "Check whether the account is Deleted, Archived, or Flagged as DNU before proceeding.",
    choices: [
      {
        label: "Deleted",
        next: "deleted_find_active",
        icon: "fa-solid fa-trash",
        desc: "Use this path when the account status is Deleted."
      },
      {
        label: "Archived",
        next: "archived_find_active",
        icon: "fa-solid fa-box-archive",
        desc: "Use this path when the account status is Archived."
      },
      {
        label: "Flagged as DNU",
        next: "dnu_check_comments",
        icon: "fa-solid fa-flag",
        desc: "Use this path when the account is flagged as Do Not Use."
      }
    ]
  },

  /* ================= DELETED ================= */

  deleted_find_active: {
    text: "Try to find an active account using the same address.",
    help: "Search for another usable active account using the same address details.",
    note: "Alternatively, ECTS can also be used to search if an Express-only or archived account is provided by the customer.",
    choices: [
      {
        label: "Continue",
        next: "deleted_locate_account",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after checking for another active account."
      }
    ]
  },

  deleted_locate_account: {
    text: "Were you able to locate an account?",
    help: "Confirm whether you found a better active account using the same address.",
    choices: [
      {
        label: "Yes",
        next: "deleted_advise_found_account",
        icon: "fa-solid fa-circle-check",
        desc: "An account was located."
      },
      {
        label: "No",
        next: "deleted_create_new_account",
        icon: "fa-solid fa-circle-xmark",
        desc: "No account was located."
      }
    ]
  },

  deleted_advise_found_account: {
    text: "Do not bill it yet.",
    help: "Advise the customer that the account number they provided is already Deleted. You may advise them that you were able to pull up an account that can bill and confirm if they want to bill it instead.",
    choices: [
      {
        label: "Continue",
        next: "deleted_customer_confirmed",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after advising the customer."
      }
    ]
  },

  deleted_customer_confirmed: {
    text: "Did the customer confirm to bill the account you found?",
    help: "Confirm whether the customer agreed to use the active account you found.",
    choices: [
      {
        label: "Yes",
        next: "deleted_update_invoice",
        icon: "fa-solid fa-circle-check",
        desc: "The customer confirmed to use the account found."
      },
      {
        label: "No",
        next: "deleted_reactivate_request",
        icon: "fa-solid fa-circle-xmark",
        desc: "The customer did not confirm to use the account found."
      }
    ]
  },

  deleted_create_new_account: {
    text: "If no better account is found by the methods above, a new account would need to be created in the Corrections screen.",
    help: "Create a new account in Corrections if no better account can be found.",
    choices: []
  },

  deleted_update_invoice: {
    text: "Proceed on updating the invoice using the account number you pulled up.",
    help: "Use the active account you found and proceed with the invoice update.",
    choices: []
  },

  deleted_reactivate_request: {
    text: "Ask for the reason why.",
    help: "If they gave a reason, clone your case and assign the cloned case to Accounts Processing and request for the account to be reactivated or reinstated. Provide the reason of the customer. Wait for the confirmation from Accounts Processing that the account is already reactivated.",
    choices: []
  },

  /* ================= ARCHIVED ================= */

  archived_find_active: {
    text: "Try to find an active account using the same address.",
    help: "Search for another usable active account using the same address details.",
    note: "Alternatively, ECTS can also be used to search if an Express-only or archived account is provided by the customer.",
    choices: [
      {
        label: "Continue",
        next: "archived_locate_account",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after checking for another active account."
      }
    ]
  },

  archived_locate_account: {
    text: "Were you able to locate an account?",
    help: "Confirm whether you found a better active account using the same address.",
    choices: [
      {
        label: "Yes",
        next: "archived_advise_found_account",
        icon: "fa-solid fa-circle-check",
        desc: "An account was located."
      },
      {
        label: "No",
        next: "archived_create_new_account",
        icon: "fa-solid fa-circle-xmark",
        desc: "No account was located."
      }
    ]
  },

  archived_advise_found_account: {
    text: "Do not bill it yet.",
    help: "Advise the customer that the account number they provided is already Deleted, then advise them that you were able to pull up an account that we can bill and confirm if they want to bill it instead.",
    choices: [
      {
        label: "Continue",
        next: "archived_customer_confirmed",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after advising the customer."
      }
    ]
  },

  archived_customer_confirmed: {
    text: "Did the customer confirm to bill the account you found?",
    help: "Confirm whether the customer agreed to use the active account you found.",
    choices: [
      {
        label: "Yes",
        next: "archived_update_invoice",
        icon: "fa-solid fa-circle-check",
        desc: "The customer confirmed to use the account found."
      },
      {
        label: "No",
        next: "archived_reactivate_request",
        icon: "fa-solid fa-circle-xmark",
        desc: "The customer did not confirm to use the account found."
      }
    ]
  },

  archived_create_new_account: {
    text: "If no better account is found by the methods above, a new account would need to be created in the Corrections screen.",
    help: "Create a new account in Corrections if no better account can be found.",
    choices: []
  },

  archived_update_invoice: {
    text: "Proceed on updating the invoice using the account number you pulled up.",
    help: "Use the active account you found and proceed with the invoice update.",
    choices: []
  },

  archived_reactivate_request: {
    text: "Ask for the reason why.",
    help: "If they gave a reason, clone your case and assign the cloned case to Accounts Processing and request for the account to be reactivated or reinstated. Provide the reason of the customer. Wait for the confirmation from Accounts Processing that the account is already reactivated.",
    choices: []
  },

  /* ================= DNU ================= */

  dnu_check_comments: {
    text: "Check comments for the reason of flagging the account as Do Not Use or any suggested/new account.",
    help: "Review the account comments first before deciding the next billing action.",
    note: "When flagging/unflagging an account, make sure to process it in ISPI, not in CAPS.",
    choices: [
      {
        label: "Continue",
        next: "dnu_suggested_account",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after reviewing the comments."
      }
    ]
  },

  dnu_suggested_account: {
    text: "Is there a suggested account?",
    help: "Check whether the account comments include a suggested or replacement account.",
    choices: [
      {
        label: "Yes",
        next: "dnu_rebill_suggested",
        icon: "fa-solid fa-circle-check",
        desc: "A suggested account is available."
      },
      {
        label: "No",
        next: "dnu_can_unflag",
        icon: "fa-solid fa-circle-xmark",
        desc: "No suggested account is available."
      }
    ]
  },

  dnu_rebill_suggested: {
    text: "Proceed on rebilling the invoice using the suggested account for proper billing.",
    help: "Use the suggested account from the comments and proceed with rebilling.",
    choices: []
  },

  dnu_can_unflag: {
    text: "Based on the account comments, can we unflag the account to bill the invoice?",
    help: "Check the comments carefully before requesting the account to be unflagged.",
    choices: [
      {
        label: "Yes",
        next: "dnu_reach_tl",
        icon: "fa-solid fa-circle-check",
        desc: "The account can be unflagged based on the comments."
      },
      {
        label: "No",
        next: "dnu_advise_customer_flagged",
        icon: "fa-solid fa-circle-xmark",
        desc: "The account should remain flagged as DNU."
      }
    ]
  },

  dnu_reach_tl: {
    text: "Reach out to your TL and request to unflag the account.",
    help: "Once the account is unflagged, proceed with rebilling using the same account.",
    choices: [
      {
        label: "Continue",
        next: "dnu_rebill_unflagged",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after the TL has been contacted."
      }
    ]
  },

  dnu_rebill_unflagged: {
    text: "Proceed on rebilling the invoice using the suggested account for proper billing.",
    help: "Use the account after unflagging is completed and proceed with proper billing.",
    choices: []
  },

  dnu_advise_customer_flagged: {
    text: "Advise the customer that the account is already flagged as DNU and provide the reason why it was flagged.",
    help: "Do not bill the invoice to the DNU account if the comments do not support unflagging.",
    choices: []
  }

};
