/* =========================================================
   NOTIFY FEE GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "notify-fee-guide",
  title: "Notify Fee Guide",
  startNode: "start",
  templateCollection: "notify_fee_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Notify Fee",
    help: "Start by identifying where the request came from before proceeding.",
    choices: [
      {
        label: "Continue",
        next: "request_source",
        icon: "fa-solid fa-arrow-right",
        desc: "Begin notify fee validation."
      }
    ]
  },

  request_source: {
    text: "Who the request came from?",
    help: "Identify the origin of the request.",
    choices: [
      {
        label: "FXF Solutions (FXF OPCO - RMV NTFY)",
        next: "remove_ntfy_nacc",
        icon: "fa-solid fa-envelope",
        desc: "Request came from FXF Solutions with proper subject."
      },
      {
        label: "Freight Sales / AE / Manager",
        next: "deny_sales",
        icon: "fa-solid fa-user-tie",
        desc: "Request came from Sales."
      },
      {
        label: "Other / Missing Subject",
        next: "appointment_check",
        icon: "fa-solid fa-circle-question",
        desc: "Subject does not include required info."
      }
    ]
  },

  remove_ntfy_nacc: {
    text: "Remove the NTFY fee using CORR NACC.",
    help: "Use proper comment format when removing the fee.",
    note: "VS-ACCS-CASE#-REMOVED NTFY FEE PER SOLUTIONS REQUEST",
    choices: []
  },

  deny_sales: {
    text: "Follow Denial Response to Sales.",
    help: "Notify Sales that request cannot be processed.",
    choices: []
  },

  appointment_check: {
    text: "Is there an appointment instruction on DR?",
    help: "Check Dispatch Remarks for appointment instruction.",
    choices: [
      {
        label: "Yes",
        next: "check_account_profile",
        icon: "fa-solid fa-circle-check",
        desc: "Appointment instruction exists."
      },
      {
        label: "No",
        next: "remove_ntfy_opsd",
        icon: "fa-solid fa-circle-xmark",
        desc: "No appointment instruction found."
      }
    ]
  },

  remove_ntfy_opsd: {
    text: "Remove the NTFY fee using CORR OPSD.",
    help: "Use OPSD when no appointment instruction is found.",
    choices: []
  },

  check_account_profile: {
    text: "Pull-up consignees account profile and check billing mask and receiving mask.",
    help: "Verify appointment-related coding on the account.",
    choices: [
      {
        label: "Continue",
        next: "account_coded",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to validation."
      }
    ]
  },

  account_coded: {
    text: "Is account coded for appointment?",
    help: "Check if the account is properly coded for appointment or call prior delivery.",
    choices: [
      {
        label: "Yes",
        next: "valid_ntfy_account",
        icon: "fa-solid fa-circle-check",
        desc: "Account is coded."
      },
      {
        label: "No",
        next: "check_account_comments",
        icon: "fa-solid fa-circle-xmark",
        desc: "Account is not coded."
      }
    ]
  },

  valid_ntfy_account: {
    text: "Advise customer that notify fee is valid per consignees account it was coded for appointment or call prior delivery is required.",
    help: "Use this when the consignee account supports the notify fee.",
    choices: [
      {
        label: "Continue",
        next: "customer_insist",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed if the customer still insists the fee should be removed."
      }
    ]
  },

  check_account_comments: {
    text: "Check the appointment comment on consignees account profile.",
    help: "Look for statements about appointment requirement.",
    choices: [
      {
        label: "Continue",
        next: "appointment_statement",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to validation."
      }
    ]
  },

  appointment_statement: {
    text: "Is there statement about appointment required?",
    help: "Check if there is a statement in the account comments about appointment or call prior delivery.",
    choices: [
      {
        label: "Yes",
        next: "valid_ntfy_statement",
        icon: "fa-solid fa-circle-check",
        desc: "Statement confirms appointment is required."
      },
      {
        label: "No",
        next: "check_bol",
        icon: "fa-solid fa-circle-xmark",
        desc: "No appointment statement found."
      },
      {
        label: "Only Phone number",
        next: "phone_number_receiving_mask",
        icon: "fa-solid fa-phone",
        desc: "Only a phone number is shown in the account comments."
      }
    ]
  },

  valid_ntfy_statement: {
    text: "Advise customer that notify fee is valid per consignees account it was coded for appointment or call prior delivery is required.",
    help: "Use this when the account comments confirm appointment or call prior delivery is required.",
    choices: [
      {
        label: "Continue",
        next: "customer_insist",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed if the customer still insists the fee should be removed."
      }
    ]
  },

  phone_number_receiving_mask: {
    text: "Check the Receiving mask if the APPT box is marked/flagged.",
    help: "If the account comment only shows a phone number, review the Receiving mask and verify whether the APPT box is marked or flagged.",
    image: "guides/Other%20Surcharge%20Guides/notify-fee-guide/images/notify_recvmask.png",
    choices: [
      {
        label: "Continue",
        next: "appt_box_receiving_mask_from_phone",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to verify the APPT box on the Receiving mask."
      }
    ]
  },

  appt_box_receiving_mask_from_phone: {
    text: "Is the APPT box is marked/flagged on receiving mask?",
    help: "Check the Receiving mask after reviewing the phone number note.",
    choices: [
      {
        label: "Yes",
        next: "valid_ntfy_bol",
        icon: "fa-solid fa-circle-check",
        desc: "APPT box is marked or flagged on the Receiving mask."
      },
      {
        label: "No",
        next: "check_bol",
        icon: "fa-solid fa-circle-xmark",
        desc: "APPT box is not marked or flagged on the Receiving mask."
      }
    ]
  },

  check_bol: {
    text: "Check the BOL. Is there's an instruction noted regarding setting up an appointment or call prior delivery?",
    help: "Verify BOL instructions before deciding whether the notify fee is valid.",
    choices: [
      {
        label: "Yes",
        next: "valid_ntfy_bol",
        icon: "fa-solid fa-circle-check",
        desc: "BOL confirms appointment or call prior delivery."
      },
      {
        label: "No",
        next: "consignee_digits",
        icon: "fa-solid fa-circle-xmark",
        desc: "No BOL instruction found."
      }
    ]
  },

  valid_ntfy_bol: {
    text: "Advise customer that notify fee is valid as appointment or call prior delivery is requested on BOL.",
    help: "Use this when the BOL supports the notify fee.",
    choices: [
      {
        label: "Continue",
        next: "customer_insist",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed if the customer still insists the fee should be removed."
      }
    ]
  },

  customer_insist: {
    text: "If customer insisted that fee should be remove, check the account comments if one time courtesy is already provided.",
    help: "Validate whether a one-time courtesy has already been used before removing the fee.",
    choices: [
      {
        label: "Yes",
        next: "courtesy_exists",
        icon: "fa-solid fa-circle-check",
        desc: "A comment about one-time courtesy already exists."
      },
      {
        label: "No",
        next: "apply_courtesy",
        icon: "fa-solid fa-circle-xmark",
        desc: "No one-time courtesy comment exists yet."
      }
    ]
  },

  courtesy_exists: {
    text: "Reiterate your initial response and advise customer to contact their service center to remove the code on their account regarding setting up an appointment.",
    help: "Use this when a one-time courtesy was already provided before.",
    choices: [
      {
        label: "Continue",
        next: "constant_reopen_sop",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed if customer still insists on removal."
      }
    ]
  },

  constant_reopen_sop: {
    text: "If customer insists removal and cannot be removed through Write Off, follow Constant Reopen SOP.",
    help: "Use this when customer continues insisting after courtesy has already been used.",
    choices: []
  },

  apply_courtesy: {
    text: "Process one time courtesy through write off and advise customer that fee is valid therefore, one time courtesy will be issue and will be noted on their account.",
    help: "Apply the one-time courtesy when it has not yet been provided.",
    choices: [
      {
        label: "Continue",
        next: "comment_courtesy",
        icon: "fa-solid fa-arrow-right",
        desc: "Add the required account comment."
      }
    ]
  },

  comment_courtesy: {
    text: "Enter comment in the account (General Information) - VS-ACCS-CASE#-REMOVED NTFY AS ONE TIME COURTESY",
    help: "Document the courtesy action in the account comments.",
    choices: []
  },

  consignee_digits: {
    text: "Is the consignee code is only 6digits?",
    help: "Validate the consignee account structure.",
    choices: [
      {
        label: "Yes",
        next: "search_better_account_step",
        icon: "fa-solid fa-circle-check",
        desc: "Search for a better account."
      },
      {
        label: "No",
        next: "residential_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to the next validation."
      }
    ]
  },

  search_better_account_step: {
    text: "Search for a better account.",
    help: "Look for a valid and active consignee account.",
    choices: [
      {
        label: "Continue",
        next: "better_account_question",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after searching."
      }
    ]
  },

  better_account_question: {
    text: "Is there a better account?",
    help: "Confirm whether a valid account was found.",
    choices: [
      {
        label: "Yes",
        next: "check_account_profile",
        icon: "fa-solid fa-circle-check",
        desc: "A better account is available."
      },
      {
        label: "No",
        next: "remove_ntfy_sysm",
        icon: "fa-solid fa-circle-xmark",
        desc: "No better account found."
      }
    ]
  },

  remove_ntfy_sysm: {
    text: "Removed the notify fee. Use CORR SYSM (OPSO if added by the biller).",
    help: "Apply the correct correction code when removing the notify fee.",
    choices: []
  },

  residential_check: {
    text: "Is the Pro is being charged for residential, limited access or FXFD?",
    help: "Check for other valid charges on the shipment.",
    choices: [
      {
        label: "Yes",
        next: "remove_ntfy_opsd_sysm",
        icon: "fa-solid fa-circle-check",
        desc: "Another valid charge applies."
      },
      {
        label: "No",
        next: "liftgate_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to liftgate check."
      }
    ]
  },

  remove_ntfy_opsd_sysm: {
    text: "Removed the notify fee. Use CORR OPSO/OPSD/SYSM depending who added it.",
    help: "Apply the proper removal code depending on who added the fee.",
    choices: []
  },

  liftgate_check: {
    text: "Is the Pro is being charged for liftgate fee?",
    help: "Check whether the shipment has a liftgate-related charge.",
    choices: [
      {
        label: "Yes",
        next: "remove_ntfy_liftgate",
        icon: "fa-solid fa-circle-check",
        desc: "Liftgate applies."
      },
      {
        label: "No",
        next: "fbi_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to FBI comment validation."
      }
    ]
  },

  remove_ntfy_liftgate: {
    text: "Removed the notify fee. CORR code should be based upon who added the fee. Use FBC comments: VS-ACCS-CASE#-REMOVED NTFY FOR CARRIER CONVENIENCE AS LIFTGATE WAS PERFORMED",
    help: "Use this when notify fee should be removed because liftgate was performed.",
    choices: []
  },

  fbi_check: {
    text: "Check FBI comments where Center will confirm the fee invalid per their error.",
    help: "Validate through FBI comments if the fee was added in error.",
    choices: [
      {
        label: "Yes",
        next: "remove_ntfy_fbi",
        icon: "fa-solid fa-circle-check",
        desc: "FBI comments confirm the fee is invalid."
      },
      {
        label: "No",
        next: "remove_ntfy_final",
        icon: "fa-solid fa-circle-xmark",
        desc: "No FBI confirmation found."
      }
    ]
  },

  remove_ntfy_fbi: {
    text: "Remove the notify fee using CORR OPSO/OPSD",
    help: "Use this when FBI comments confirm the fee is invalid.",
    choices: []
  },

  remove_ntfy_final: {
    text: "Remove the notify fee use CORR CODE depends on who added the fee.",
    help: "Finalize correction using the appropriate code.",
    choices: []
  }

};
