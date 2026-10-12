/* =========================================================
   UPDATING SCAC/BU GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "updating-pt-scacbu-guide",
  title: "Updating SCAC/BU Guide",
  startNode: "start",
  templateCollection: "updating_pt_scacbu_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Updating SCAC/BU Guide",
    help: "Follow the correct path based on who sent the request, the shipment age, the billing terms, and whether a matching replacement account can be located.",
    choices: [
      {
        label: "Continue",
        next: "who_sent_request",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Updating SCAC/BU decision guide."
      }
    ]
  },

  who_sent_request: {
    text: "Who sent the request?",
    help: "Check whether the request came from the Collector or the Customer.",
    choices: [
      {
        label: "Collector",
        next: "collector_within_year",
        icon: "fa-solid fa-user-tie",
        desc: "Use this path when the request came from the Collector."
      },
      {
        label: "Customer",
        next: "customer_terms",
        icon: "fa-solid fa-user",
        desc: "Use this path when the request came from the Customer."
      }
    ]
  },

  /* ================= COLLECTOR FLOW ================= */

  collector_within_year: {
    text: "Is the shipment within a year?",
    help: "Check the shipment age before proceeding with the requested SCAC correction.",
    choices: [
      {
        label: "Yes",
        next: "collector_within_year_yes",
        icon: "fa-solid fa-circle-check",
        desc: "The shipment is within a year."
      },
      {
        label: "No, over a year.",
        next: "collector_within_year_no",
        icon: "fa-solid fa-circle-xmark",
        desc: "The shipment is over a year old."
      }
    ]
  },

  collector_within_year_yes: {
    text: "Correction can be completed to allow the SCAC requested.",
    help: "This will be completed as an Attempt of payment per Collector.",
    choices: []
  },

  collector_within_year_no: {
    text: "Billing correctly per OBL/LOA on file.",
    help: "We will need a LOA from the debtor of the changes asking for the correction and correction fee would apply. Ask the Collector to send a LOA from the debtor.",
    choices: []
  },

  /* ================= CUSTOMER FLOW ================= */

  customer_terms: {
    text: "What is the terms?",
    help: "Check whether the billing terms are Prepaid, Collect, or Third Party.",
    choices: [
      {
        label: "Prepaid",
        next: "prepaid_find_shipper",
        icon: "fa-solid fa-credit-card",
        desc: "Use this path when the terms are Prepaid."
      },
      {
        label: "Collect",
        next: "collect_find_consignee",
        icon: "fa-solid fa-money-bill-wave",
        desc: "Use this path when the terms are Collect."
      },
      {
        label: "Third Party",
        next: "third_party_type",
        icon: "fa-solid fa-people-arrows",
        desc: "Use this path when the terms are Third Party."
      }
    ]
  },

  /* ================= PREPAID ================= */

  prepaid_find_shipper: {
    text: "Look for another Shipper account that will match the SCAC of the BT account provided by the customer.",
    help: "Search for another shipping account with the correct SCAC/Business Unit match.",
    choices: [
      {
        label: "Continue",
        next: "prepaid_found_shipper",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after checking for another Shipper account."
      }
    ]
  },

  prepaid_found_shipper: {
    text: "Were you able to pull up another shipping account that matches the BT account?",
    help: "Confirm whether a matching replacement Shipper account was found.",
    choices: [
      {
        label: "Yes",
        next: "prepaid_has_pricing",
        icon: "fa-solid fa-circle-check",
        desc: "A matching Shipper account was found."
      },
      {
        label: "No",
        next: "prepaid_no_match_advise",
        icon: "fa-solid fa-circle-xmark",
        desc: "No matching Shipper account was found."
      }
    ]
  },

  prepaid_has_pricing: {
    text: "Does it have a pricing?",
    help: "Check whether the replacement Shipper account has pricing.",
    choices: [
      {
        label: "No",
        next: "prepaid_no_pricing",
        icon: "fa-solid fa-circle-xmark",
        desc: "The account does not have pricing."
      },
      {
        label: "Yes",
        next: "prepaid_use_found_account",
        icon: "fa-solid fa-circle-check",
        desc: "The account has pricing."
      }
    ]
  },

  prepaid_no_pricing: {
    text: "Do not use this account.",
    help: "Advise the customer that the BT account number they provided cannot be used since it does not match the SCAC/Business Unit of the Shipper.",
    choices: []
  },

  prepaid_use_found_account: {
    text: "Proceed on using the shipper account you found.",
    help: "Use the replacement Shipper account for the billing update.",
    choices: []
  },

  prepaid_no_match_advise: {
    text: "Advise the customer that the BT account number they provided cannot be used since it does not match the SCAC/Business Unit of the Shipper.",
    help: "If the customer insists to bill the account provided, proceed with updating to terms which will match the Bill-to's SCAC.",
    choices: [
      {
        label: "Continue",
        next: "prepaid_if_customer_insists",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed if the customer still insists on using the provided account."
      }
    ]
  },

  prepaid_if_customer_insists: {
    text: "If the customer insist to bill the account provided, proceed with updating to terms which will match the Bill-to's SCAC.",
    help: "Update the billing terms only if the customer insists on using the provided account.",
    choices: []
  },

  /* ================= COLLECT ================= */

  collect_find_consignee: {
    text: "Look for another Consignee account that will match the SCAC of the BT account provided by the customer.",
    help: "Search for another Consignee account with the correct SCAC/Business Unit match.",
    choices: [
      {
        label: "Continue",
        next: "collect_found_consignee",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after checking for another Consignee account."
      }
    ]
  },

  collect_found_consignee: {
    text: "Were you able to pull up another consignee account that matches the BT account?",
    help: "Confirm whether a matching replacement Consignee account was found.",
    choices: [
      {
        label: "Yes",
        next: "collect_has_pricing",
        icon: "fa-solid fa-circle-check",
        desc: "A matching Consignee account was found."
      },
      {
        label: "No",
        next: "collect_no_match_advise",
        icon: "fa-solid fa-circle-xmark",
        desc: "No matching Consignee account was found."
      }
    ]
  },

  collect_has_pricing: {
    text: "Does it have a pricing?",
    help: "Check whether the replacement Consignee account has pricing.",
    choices: [
      {
        label: "No",
        next: "collect_no_pricing",
        icon: "fa-solid fa-circle-xmark",
        desc: "The account does not have pricing."
      },
      {
        label: "Yes",
        next: "collect_use_found_account",
        icon: "fa-solid fa-circle-check",
        desc: "The account has pricing."
      }
    ]
  },

  collect_no_pricing: {
    text: "Do not use this account.",
    help: "Advise the customer that the BT account number they provided cannot be used since it does not match the SCAC/Business Unit of the Consignee.",
    choices: []
  },

  collect_use_found_account: {
    text: "Proceed on using the proper account you found.",
    help: "Use the replacement Consignee account for the billing update.",
    choices: []
  },

  collect_no_match_advise: {
    text: "Advise the customer that the BT account number they provided cannot be used since it does not match the SCAC/Business Unit of the Consignee.",
    help: "If the customer insists to bill the account provided, proceed with updating to terms which will match the Bill-to's SCAC.",
    choices: [
      {
        label: "Continue",
        next: "collect_if_customer_insists",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed if the customer still insists on using the provided account."
      }
    ]
  },

  collect_if_customer_insists: {
    text: "If the customer insist to bill the account provided, proceed with updating to terms which will match the Bill-to's SCAC.",
    help: "Update the billing terms only if the customer insists on using the provided account.",
    choices: []
  },

  /* ================= THIRD PARTY ================= */

  third_party_type: {
    text: "Is the Third Party account under the Shipper or Consignee?",
    help: "Determine whether the Third Party request should follow the Shipper or Consignee path.",
    choices: [
      {
        label: "Shipper",
        next: "third_party_shipper_find",
        icon: "fa-solid fa-truck-ramp-box",
        desc: "Use this path when the Third Party account is under the Shipper."
      },
      {
        label: "Consignee",
        next: "third_party_consignee_find",
        icon: "fa-solid fa-box-open",
        desc: "Use this path when the Third Party account is under the Consignee."
      }
    ]
  },

  third_party_shipper_find: {
    text: "Search for another Shipper account that has the same SCAC/BU as the requested account.",
    help: "Look for another shipping account with the same SCAC/Business Unit as the requested account.",
    choices: [
      {
        label: "Continue",
        next: "third_party_shipper_found",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after checking for another Shipper account."
      }
    ]
  },

  third_party_shipper_found: {
    text: "Were you able to pull up another account?",
    help: "Confirm whether another matching Shipper account was found.",
    choices: [
      {
        label: "Yes",
        next: "third_party_shipper_yes",
        icon: "fa-solid fa-circle-check",
        desc: "A matching account was found."
      },
      {
        label: "No",
        next: "third_party_shipper_no",
        icon: "fa-solid fa-circle-xmark",
        desc: "No matching account was found."
      }
    ]
  },

  third_party_shipper_yes: {
    text: "Proceed on updating the shipping account using the account you found.",
    help: "Use the matching Shipper account for the update.",
    choices: []
  },

  third_party_shipper_no: {
    text: "If no other shipping account is found, proceed with updating to terms which will match the Bill-to's SCAC.",
    help: "Update the billing terms if no matching shipping account is available.",
    choices: []
  },

  third_party_consignee_find: {
    text: "Search for another Consignee account that has the same SCAC/BU as the requested account.",
    help: "Look for another Consignee account with the same SCAC/Business Unit as the requested account.",
    choices: [
      {
        label: "Continue",
        next: "third_party_consignee_found",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after checking for another Consignee account."
      }
    ]
  },

  third_party_consignee_found: {
    text: "Were you able to pull up another account?",
    help: "Confirm whether another matching Consignee account was found.",
    choices: [
      {
        label: "Yes",
        next: "third_party_consignee_yes",
        icon: "fa-solid fa-circle-check",
        desc: "A matching account was found."
      },
      {
        label: "No",
        next: "third_party_consignee_no",
        icon: "fa-solid fa-circle-xmark",
        desc: "No matching account was found."
      }
    ]
  },

  third_party_consignee_yes: {
    text: "Proceed on updating the shipping account using the account you found.",
    help: "Use the matching Consignee account for the update.",
    choices: []
  },

  third_party_consignee_no: {
    text: "If no other consignee account is found, proceed with updating to terms which will match the Bill-to's SCAC.",
    help: "Update the billing terms if no matching Consignee account is available.",
    choices: []
  }

};
