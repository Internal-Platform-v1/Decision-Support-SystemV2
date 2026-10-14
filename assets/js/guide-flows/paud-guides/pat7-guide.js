/* =========================================================
   PAT7 GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "pat7-guide",
  title: "PAT7 Guide",
  startNode: "start",
  templateCollection: "pat7_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "PAT7 - Special Invoice Review Guide",
    help: "Use this guide to review special invoice handling for EOIR, Lockheed Martin, Sikorsky Aircraft, United Launch Alliance, NOAR Alaska/Hawaii bills, and Amcoat Ind.",
    note: "Always review the BOL, account details, terms, bill-to information, consignee/shipper details, reference information, and PO requirements before allowing the bill to invoice.",
    choices: [
      {
        label: "Continue",
        next: "whose_invoice_reviewing",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the special invoice review decision flow."
      }
    ]
  },

  whose_invoice_reviewing: {
    text: "Whose invoice are you reviewing?",
    choices: [
      {
        label: "Invoices for EOIR – Executive Office for Immigration Review",
        next: "eoir_bol_imaged_check",
        icon: "fa-solid fa-building-columns",
        desc: "Review invoice handling for EOIR-related shipments."
      },
      {
        label: "Lockheed Martin",
        next: "lockheed_bol_imaged_check",
        icon: "fa-solid fa-plane",
        desc: "Review invoice handling for Lockheed Martin shipments."
      },
      {
        label: "Sikorsky Aircraft",
        next: "sikorsky_bol_imaged_check",
        icon: "fa-solid fa-helicopter",
        desc: "Review invoice handling for Sikorsky Aircraft shipments."
      },
      {
        label: "United Launch Alliance (ULA)",
        next: "ula_bol_imaged_check",
        icon: "fa-solid fa-rocket",
        desc: "Review invoice handling for United Launch Alliance shipments."
      },
      {
        label: "Bills with NOAR moving to Alaska (AK) or Hawaii (HI)",
        next: "noar_bol_imaged_check",
        icon: "fa-solid fa-map-location-dot",
        desc: "Review bills with NOAR moving to Alaska or Hawaii."
      },
      {
        label: "Amcoat Ind",
        next: "amcoat_billing_account",
        icon: "fa-solid fa-industry",
        desc: "Review invoice handling for Amcoat Ind."
      }
    ]
  },

  /* =========================================================
     EOIR – EXECUTIVE OFFICE FOR IMMIGRATION REVIEW FLOW
  ========================================================= */

  eoir_bol_imaged_check: {
    text: "Is BOL already imaged?",
    choices: [
      {
        label: "Yes",
        next: "eoir_deliver_before_invoice",
        icon: "fa-solid fa-circle-check",
        desc: "BOL is already imaged."
      },
      {
        label: "No",
        next: "final_eoir_do_not_release",
        icon: "fa-solid fa-circle-xmark",
        desc: "BOL is not yet imaged."
      }
    ]
  },

  final_eoir_do_not_release: {
    text: "DO NOT RELEASE THE PRO FROM THE QUEUE. LEAVE PRO IN PAT7 QUEUE UNTIL BOL IS ON IMAGE – UPDATING EVERY PRO TO TRUE DEBTOR REQUIRES BOL REVIEW.",
    choices: []
  },

  eoir_deliver_before_invoice: {
    text: "The shipments must be delivered prior to invoicing.",
    choices: [
      {
        label: "Review the BOL",
        next: "eoir_us_attorney_check",
        icon: "fa-solid fa-file-lines",
        desc: "Proceed to review the BOL."
      }
    ]
  },

  eoir_us_attorney_check: {
    text: "Does the BOL indicate US Attorney as the consignee instead of EOIR?",
    choices: [
      {
        label: "Yes",
        next: "final_eoir_update_third_party",
        icon: "fa-solid fa-circle-check",
        desc: "US Attorney is shown as consignee instead of EOIR."
      },
      {
        label: "No",
        next: "eoir_review_correct_billing",
        icon: "fa-solid fa-circle-xmark",
        desc: "US Attorney is not shown as consignee."
      }
    ]
  },

  final_eoir_update_third_party: {
    text: "Update the 3rd party to 682112956. US Attorney ships from the same warehouse as EOIR, but EOIR is not responsible for the bills.",
    choices: []
  },

  eoir_review_correct_billing: {
    text: "Review the BOL for correct billing.",
    choices: [
      {
        label: "Continue",
        next: "eoir_terms_correct_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check if the billing terms are correct."
      }
    ]
  },

  eoir_terms_correct_check: {
    text: "Are the terms correct?",
    choices: [
      {
        label: "No",
        next: "final_eoir_update_terms_per_bol",
        icon: "fa-solid fa-circle-xmark",
        desc: "Terms are not correct."
      },
      {
        label: "Yes",
        next: "final_eoir_review_account_numbers",
        icon: "fa-solid fa-circle-check",
        desc: "Terms are correct."
      }
    ]
  },

  final_eoir_update_terms_per_bol: {
    text: "Update the terms per BOL.",
    choices: []
  },

  final_eoir_review_account_numbers: {
    text: "If terms are correct, agent will need to review any account numbers listed. If the account matches, update the consignee. If it does not match, but the account number listed is linked to an ABT, update the bill with the ABT tied to the account.",
    note: "Check for proper account numbers and not names of individuals. Check to see if surcharges are on delivery receipt. Change any surcharges to follow terms.",
    choices: []
  },

  /* =========================================================
     LOCKHEED MARTIN FLOW
  ========================================================= */

  lockheed_bol_imaged_check: {
    text: "Is BOL already imaged?",
    choices: [
      {
        label: "No",
        next: "final_lockheed_do_not_release",
        icon: "fa-solid fa-circle-xmark",
        desc: "BOL is not yet imaged."
      },
      {
        label: "Yes",
        next: "lockheed_deliver_before_invoice",
        icon: "fa-solid fa-circle-check",
        desc: "BOL is already imaged."
      }
    ]
  },

  final_lockheed_do_not_release: {
    text: "DO NOT RELEASE THE PRO FROM THE QUEUE. LEAVE PRO IN PAT7 QUEUE UNTIL BOL IS ON IMAGE – UPDATING EVERY PRO TO TRUE DEBTOR REQUIRES BOL REVIEW.",
    choices: []
  },

  lockheed_deliver_before_invoice: {
    text: "The shipments must be delivered prior to invoicing.",
    choices: [
      {
        label: "Review the BOL",
        next: "lockheed_shipper_consignee_check",
        icon: "fa-solid fa-file-lines",
        desc: "Proceed to review the BOL."
      }
    ]
  },

  lockheed_shipper_consignee_check: {
    text: "Is Lockheed Martin either the Shipper or the Consignee?",
    choices: [
      {
        label: "No, it is a Third party",
        next: "lockheed_third_party_terms_match",
        icon: "fa-solid fa-users",
        desc: "Lockheed Martin is listed as a third party."
      },
      {
        label: "Yes",
        next: "lockheed_shipper_consignee_terms_match",
        icon: "fa-solid fa-circle-check",
        desc: "Lockheed Martin is either the shipper or consignee."
      }
    ]
  },

  lockheed_third_party_terms_match: {
    text: "Agent will need to make sure the terms match.",
    choices: [
      {
        label: "Continue",
        next: "lockheed_find_division_number",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with bill-to and division number review."
      }
    ]
  },

  lockheed_find_division_number: {
    text: "Agent will need to look for the division number listed on the BOL and update the bill-to section by typing over the EDI information.",
    choices: [
      {
        label: "Continue",
        next: "lockheed_add_inv_corr_accr",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with invoice keyword and correction code action."
      }
    ]
  },

  lockheed_shipper_consignee_terms_match: {
    text: "Agent will need to make sure the terms match to allow ABT to follow.",
    choices: [
      {
        label: "Continue",
        next: "lockheed_update_terms_as_needed",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with terms update."
      }
    ]
  },

  lockheed_update_terms_as_needed: {
    text: "Update terms as necessary.",
    choices: [
      {
        label: "Continue",
        next: "lockheed_bill_to_division_number",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue to check the bill-to division number."
      }
    ]
  },

  lockheed_bill_to_division_number: {
    text: "In the bill-to section on the bill of lading, there will be a division number listed.",
    note: "Division number will be located in the Bank Code field in the Alias Profile.",
    choices: [
      {
        label: "Continue",
        next: "lockheed_verify_alias_profile",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with Alias Profile verification."
      }
    ]
  },

  lockheed_verify_alias_profile: {
    text: "Agent will need to pull up the consignee location in the Alias Profile and verify if the division number is the same. From the Customer Profile screen, click the face with the black mask to access the Alias Profile.",
    choices: [
      {
        label: "Continue",
        next: "lockheed_location_division_match_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check if the location division matches."
      }
    ]
  },

  lockheed_location_division_match_check: {
    text: "Does the location division match?",
    choices: [
      {
        label: "Yes",
        next: "final_lockheed_post_bill_corr_cusl",
        icon: "fa-solid fa-circle-check",
        desc: "Location division matches."
      },
      {
        label: "No",
        next: "lockheed_verify_consignee_division",
        icon: "fa-solid fa-circle-xmark",
        desc: "Location division does not match."
      }
    ]
  },

  final_lockheed_post_bill_corr_cusl: {
    text: "Agent can post the bill with CORR CUSL or ETMS.",
    choices: []
  },

  lockheed_verify_consignee_division: {
    text: "Agent will verify the division number on the consignee by accessing the Alias Profile from the customer profile screen.",
    choices: [
      {
        label: "Continue",
        next: "lockheed_update_bill_to_division",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with bill-to division update."
      }
    ]
  },

  lockheed_update_bill_to_division: {
    text: "Agent needs to update the bill-to field with the division number from the bill of lading in Freight Bill Corrections by typing over the EDI information.",
    note: "If the consignee division does not match the BOL or is blank, leave it as is, but ensure the bill-to division ID on FBC is available.",
    choices: [
      {
        label: "Continue",
        next: "lockheed_add_inv_corr_accr",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with invoice keyword and correction code action."
      }
    ]
  },

  lockheed_add_inv_corr_accr: {
    text: "Add keyword INV to force the bill to invoice and use CORR ACCR.",
    choices: [
      {
        label: "Continue",
        next: "lockheed_open_reference_edit",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue to Reference Edit Screen."
      }
    ]
  },

  lockheed_open_reference_edit: {
    text: "Prior to hitting Accept All F6, agent will need to open the Reference Edit Screen.",
    choices: [
      {
        label: "Continue",
        next: "lockheed_accept_all_f6",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with Reference Edit Screen handling."
      }
    ]
  },

  lockheed_accept_all_f6: {
    text: "Once the Reference Edit Screen is open, hit Accept All F6 to post. After the bill posts, refresh the Reference Edit screen to show the updated bill-to with the division number.",
    choices: [
      {
        label: "Continue",
        next: "lockheed_add_reference_number",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with adding reference number."
      }
    ]
  },

  lockheed_add_reference_number: {
    text: "Agent will add a Reference Number with CR as the Customer Reference and in the Reference Number field type the Division used with the bill-to account, then hit Add/Update and Accept.",
    choices: [
      {
        label: "Continue",
        next: "lockheed_po_reference_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check if there is a PO reference on the BOL."
      }
    ]
  },

  lockheed_po_reference_check: {
    text: "Is there a PO# reference on the BOL?",
    choices: [
      {
        label: "Yes",
        next: "final_lockheed_add_po_invoice",
        icon: "fa-solid fa-circle-check",
        desc: "PO reference is present on the BOL."
      },
      {
        label: "No",
        next: "final_lockheed_no_po_entered",
        icon: "fa-solid fa-circle-xmark",
        desc: "No PO reference is present on the BOL."
      }
    ]
  },

  final_lockheed_add_po_invoice: {
    text: "Agent needs to add the PO# on the invoice.",
    choices: []
  },

  final_lockheed_no_po_entered: {
    text: "If there is no PO# present on the BOL, agent will not enter anything for the PO field. Bills of lading that have a BOL# starting with “AE” usually will not have a PO#.",
    choices: []
  },

  /* =========================================================
     SIKORSKY AIRCRAFT FLOW
  ========================================================= */

  sikorsky_bol_imaged_check: {
    text: "Is BOL already imaged?",
    choices: [
      {
        label: "No",
        next: "final_sikorsky_do_not_release",
        icon: "fa-solid fa-circle-xmark",
        desc: "BOL is not yet imaged."
      },
      {
        label: "Yes",
        next: "sikorsky_deliver_before_invoice",
        icon: "fa-solid fa-circle-check",
        desc: "BOL is already imaged."
      }
    ]
  },

  final_sikorsky_do_not_release: {
    text: "DO NOT RELEASE THE PRO FROM THE QUEUE. LEAVE PRO IN PAT7 QUEUE UNTIL BOL IS ON IMAGE – UPDATING EVERY PRO TO TRUE DEBTOR REQUIRES BOL REVIEW.",
    choices: []
  },

  sikorsky_deliver_before_invoice: {
    text: "The shipments must be delivered prior to invoicing.",
    choices: [
      {
        label: "Review the BOL",
        next: "sikorsky_red_code_check",
        icon: "fa-solid fa-file-lines",
        desc: "Proceed to review the BOL."
      }
    ]
  },

  sikorsky_red_code_check: {
    text: "Does either the Consignee or Shipper show to be a red code?",
    choices: [
      {
        label: "Yes",
        next: "sikorsky_use_location_listing",
        icon: "fa-solid fa-circle-check",
        desc: "Either consignee or shipper shows as a red code."
      },
      {
        label: "No",
        next: "sikorsky_review_correct_billing",
        icon: "fa-solid fa-circle-xmark",
        desc: "Neither consignee nor shipper shows as a red code."
      }
    ]
  },

  sikorsky_use_location_listing: {
    text: "Agent will use the corresponding location listing with division to find a better account code.",
    choices: [
      {
        label: "Continue",
        next: "sikorsky_pat7_account_found_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check if an account can be located using the PAT7 list."
      }
    ]
  },

  sikorsky_pat7_account_found_check: {
    text: "Were you able to locate an account using the PAT7 list?",
    choices: [
      {
        label: "No",
        next: "sikorsky_account_search",
        icon: "fa-solid fa-circle-xmark",
        desc: "No account was located using the PAT7 list."
      },
      {
        label: "Yes",
        next: "sikorsky_account_found_update",
        icon: "fa-solid fa-circle-check",
        desc: "Account was located using the PAT7 list."
      }
    ]
  },

  sikorsky_review_correct_billing: {
    text: "Agent will review the bill of lading for correct billing.",
    choices: [
      {
        label: "Continue",
        next: "sikorsky_account_search",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with Account Search."
      }
    ]
  },

  sikorsky_account_search: {
    text: "Agent will need to search using the Account Search in the Account Establishment and Maintenance menu.",
    choices: [
      {
        label: "Continue",
        next: "sikorsky_account_found_update",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue once the account is found."
      }
    ]
  },

  sikorsky_account_found_update: {
    text: "Once an account is found, use the account. Update the Consignee or Shipper account found. Update the terms if necessary. Add INV Keyword and CORR ACCR.",
    choices: [
      {
        label: "Continue",
        next: "sikorsky_open_reference_edit",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue to Reference Edit Screen."
      }
    ]
  },

  sikorsky_open_reference_edit: {
    text: "Prior to hitting Accept All F6, agent will need to open the Reference Edit Screen.",
    choices: [
      {
        label: "Continue",
        next: "sikorsky_accept_all_f6",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with Reference Edit Screen handling."
      }
    ]
  },

  sikorsky_accept_all_f6: {
    text: "Once the Reference Edit Screen is open, hit Accept All F6 to post. Agent will need to enter the PO# from the bill of lading into the Reference Edit screen if it was not entered during the billing process.",
    choices: [
      {
        label: "Continue",
        next: "sikorsky_po_reference_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check if there is a PO reference on the BOL."
      }
    ]
  },

  sikorsky_po_reference_check: {
    text: "Is there a PO# reference on the BOL?",
    choices: [
      {
        label: "Yes",
        next: "final_sikorsky_add_po_invoice",
        icon: "fa-solid fa-circle-check",
        desc: "PO reference is present on the BOL."
      },
      {
        label: "No",
        next: "final_sikorsky_no_po_entered",
        icon: "fa-solid fa-circle-xmark",
        desc: "No PO reference is present on the BOL."
      }
    ]
  },

  final_sikorsky_add_po_invoice: {
    text: "Agent needs to add the PO# on the invoice.",
    choices: []
  },

  final_sikorsky_no_po_entered: {
    text: "If there is no PO# present on the BOL, agent will not enter anything for the PO field. Bills of lading that have a BOL# starting with “AE” usually will not have a PO#.",
    choices: []
  },

  /* =========================================================
     UNITED LAUNCH ALLIANCE / ULA FLOW
  ========================================================= */

  ula_bol_imaged_check: {
    text: "Is BOL already imaged?",
    choices: [
      {
        label: "No",
        next: "final_ula_do_not_release",
        icon: "fa-solid fa-circle-xmark",
        desc: "BOL is not yet imaged."
      },
      {
        label: "Yes",
        next: "ula_shipment_delivered_check",
        icon: "fa-solid fa-circle-check",
        desc: "BOL is already imaged."
      }
    ]
  },

  final_ula_do_not_release: {
    text: "DO NOT RELEASE THE PRO FROM THE QUEUE. LEAVE PRO IN PAT7 QUEUE UNTIL BOL IS ON IMAGE – UPDATING EVERY PRO TO TRUE DEBTOR REQUIRES BOL REVIEW.",
    choices: []
  },

  ula_shipment_delivered_check: {
    text: "Is the shipment already delivered?",
    choices: [
      {
        label: "No",
        next: "ula_review_bol_correct_billing_not_delivered",
        icon: "fa-solid fa-circle-xmark",
        desc: "Shipment is not yet delivered."
      },
      {
        label: "Yes",
        next: "ula_review_bol_correct_billing_delivered",
        icon: "fa-solid fa-circle-check",
        desc: "Shipment is already delivered."
      }
    ]
  },

  ula_review_bol_correct_billing_not_delivered: {
    text: "Agent will review the bill of lading for correct billing.",
    choices: [
      {
        label: "Continue",
        next: "ula_account_search_not_delivered",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with Account Search."
      }
    ]
  },

  ula_review_bol_correct_billing_delivered: {
    text: "Agent will review the bill of lading for correct billing.",
    choices: [
      {
        label: "Continue",
        next: "ula_account_search_delivered",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with Account Search."
      }
    ]
  },

  ula_account_search_not_delivered: {
    text: "Agent will need to search using the Account Search in the Account Establishment and Maintenance menu.",
    choices: [
      {
        label: "Continue",
        next: "ula_account_found_not_delivered",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue once the account is found."
      }
    ]
  },

  ula_account_search_delivered: {
    text: "Agent will need to search using the Account Search in the Account Establishment and Maintenance menu.",
    choices: [
      {
        label: "Continue",
        next: "ula_account_found_delivered",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue once the account is found."
      }
    ]
  },

  ula_account_found_not_delivered: {
    text: "Once an account is found, use the account. Update the Consignee or Shipper account found. Update the terms if necessary. Add INV Keyword and CORR ACCR.",
    note: "If you notice that the account number address is not the same as the BOL address, since the shipment has not delivered, the agent will type over the consignee address to make it match the BOL address.",
    choices: [
      {
        label: "Continue",
        next: "ula_open_reference_edit_not_delivered",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue to Reference Edit Screen."
      }
    ]
  },

  ula_account_found_delivered: {
    text: "Once an account is found, use the account. Update the Consignee or Shipper account found. Update the terms if necessary. Add INV Keyword and CORR ACCR.",
    choices: [
      {
        label: "Continue",
        next: "ula_open_reference_edit_delivered",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue to Reference Edit Screen."
      }
    ]
  },

  ula_open_reference_edit_not_delivered: {
    text: "Prior to hitting Accept All F6, agent will need to open the Reference Edit Screen.",
    choices: [
      {
        label: "Continue",
        next: "ula_accept_all_f6_not_delivered",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with Reference Edit Screen handling."
      }
    ]
  },

  ula_open_reference_edit_delivered: {
    text: "Prior to hitting Accept All F6, agent will need to open the Reference Edit Screen.",
    choices: [
      {
        label: "Continue",
        next: "ula_accept_all_f6_delivered",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with Reference Edit Screen handling."
      }
    ]
  },

  ula_accept_all_f6_not_delivered: {
    text: "Once the Reference Edit Screen is open, hit Accept All F6 to post. Agent will need to enter the PO# from the bill of lading into the Reference Edit screen if it was not entered during the billing process.",
    choices: [
      {
        label: "Continue",
        next: "ula_po_reference_check_not_delivered",
        icon: "fa-solid fa-arrow-right",
        desc: "Check if there is a PO reference on the BOL."
      }
    ]
  },

  ula_accept_all_f6_delivered: {
    text: "Once the Reference Edit Screen is open, hit Accept All F6 to post. Agent will need to enter the PO# from the bill of lading into the Reference Edit screen if it was not entered during the billing process.",
    choices: [
      {
        label: "Continue",
        next: "ula_po_reference_check_delivered",
        icon: "fa-solid fa-arrow-right",
        desc: "Check if there is a PO reference on the BOL."
      }
    ]
  },

  ula_po_reference_check_not_delivered: {
    text: "Is there a PO# reference on the BOL?",
    choices: [
      {
        label: "Yes",
        next: "final_ula_add_po_invoice_not_delivered",
        icon: "fa-solid fa-circle-check",
        desc: "PO reference is present on the BOL."
      },
      {
        label: "No",
        next: "final_ula_no_po_entered_not_delivered",
        icon: "fa-solid fa-circle-xmark",
        desc: "No PO reference is present on the BOL."
      }
    ]
  },

  ula_po_reference_check_delivered: {
    text: "Is there a PO# reference on the BOL?",
    choices: [
      {
        label: "Yes",
        next: "final_ula_add_po_invoice_delivered",
        icon: "fa-solid fa-circle-check",
        desc: "PO reference is present on the BOL."
      },
      {
        label: "No",
        next: "final_ula_no_po_entered_delivered",
        icon: "fa-solid fa-circle-xmark",
        desc: "No PO reference is present on the BOL."
      }
    ]
  },

  final_ula_add_po_invoice_not_delivered: {
    text: "Agent needs to add the PO# on the invoice.",
    choices: []
  },

  final_ula_add_po_invoice_delivered: {
    text: "Agent needs to add the PO# on the invoice.",
    choices: []
  },

  final_ula_no_po_entered_not_delivered: {
    text: "If there is no PO# present on the BOL, agent will not enter anything for the PO field. Bills of lading that have a BOL# starting with “AE” usually will not have a PO#.",
    choices: []
  },

  final_ula_no_po_entered_delivered: {
    text: "If there is no PO# present on the BOL, agent will not enter anything for the PO field. Bills of lading that have a BOL# starting with “AE” usually will not have a PO#.",
    choices: []
  },

  /* =========================================================
     NOAR MOVING TO ALASKA OR HAWAII FLOW
  ========================================================= */

  noar_bol_imaged_check: {
    text: "Is BOL already imaged?",
    choices: [
      {
        label: "No",
        next: "final_noar_do_not_release",
        icon: "fa-solid fa-circle-xmark",
        desc: "BOL is not yet imaged."
      },
      {
        label: "Yes",
        next: "noar_deliver_before_invoice",
        icon: "fa-solid fa-circle-check",
        desc: "BOL is already imaged."
      }
    ]
  },

  final_noar_do_not_release: {
    text: "DO NOT RELEASE THE PRO FROM THE QUEUE. LEAVE PRO IN PAT7 QUEUE UNTIL BOL IS ON IMAGE – UPDATING EVERY PRO TO TRUE DEBTOR REQUIRES BOL REVIEW.",
    choices: []
  },

  noar_deliver_before_invoice: {
    text: "The shipments must be delivered prior to invoicing.",
    choices: [
      {
        label: "Continue",
        next: "noar_review_bol_correct_billing",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with BOL review."
      }
    ]
  },

  noar_review_bol_correct_billing: {
    text: "Agent will review the bill of lading for correct billing.",
    choices: [
      {
        label: "Continue",
        next: "noar_verify_division_number",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with division number verification."
      }
    ]
  },

  noar_verify_division_number: {
    text: "AK and HI bills cannot be auto-rated, so the agent will only need to verify the correct division number from the bill of lading matches the shipper or consignee account code.",
    choices: [
      {
        label: "Continue",
        next: "noar_division_number_match_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check if the division number matches."
      }
    ]
  },

  noar_division_number_match_check: {
    text: "Does the division number match?",
    choices: [
      {
        label: "Yes",
        next: "final_noar_post_bill_corr_accr",
        icon: "fa-solid fa-circle-check",
        desc: "Division number matches."
      },
      {
        label: "No",
        next: "noar_update_bill_to_division",
        icon: "fa-solid fa-circle-xmark",
        desc: "Division number does not match."
      }
    ]
  },

  final_noar_post_bill_corr_accr: {
    text: "If the division number matches, agent will just post the bill with CORR ACCR.",
    choices: []
  },

  noar_update_bill_to_division: {
    text: "If the division number on the BOL does not match the shipper/consignee, or the bill is a true third party shipment, agent will overtype the EDI information in the bill-to field with the division number from the BOL.",
    choices: [
      {
        label: "Continue",
        next: "noar_add_inv_corr_accr",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with invoice keyword and correction code action."
      }
    ]
  },

  noar_add_inv_corr_accr: {
    text: "Add the INV keyword and use correction code CORR ACCR.",
    choices: [
      {
        label: "Continue",
        next: "noar_open_reference_edit",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue to Reference Edit Screen."
      }
    ]
  },

  noar_open_reference_edit: {
    text: "Prior to clicking Accept ALL F6 to post, agent will need to click the Reference Edit screen.",
    choices: [
      {
        label: "Continue",
        next: "noar_accept_all_f6",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with Reference Edit Screen handling."
      }
    ]
  },

  noar_accept_all_f6: {
    text: "Once the Reference Edit Screen is open, hit Accept All F6 to post. After the bill posts, refresh the Reference Edit screen to show the updated bill-to with the division number.",
    choices: [
      {
        label: "Continue",
        next: "noar_add_reference_number",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue with adding reference number."
      }
    ]
  },

  noar_add_reference_number: {
    text: "Agent will add a Reference Number with CR as the Customer Reference and in the Reference Number field type the Division used with the bill-to account, then hit Add/Update and Accept.",
    choices: [
      {
        label: "Continue",
        next: "noar_po_reference_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check if there is a PO reference on the BOL."
      }
    ]
  },

  noar_po_reference_check: {
    text: "Is there a PO# reference on the BOL?",
    choices: [
      {
        label: "Yes",
        next: "final_noar_add_po_invoice",
        icon: "fa-solid fa-circle-check",
        desc: "PO reference is present on the BOL."
      },
      {
        label: "No",
        next: "final_noar_no_po_entered",
        icon: "fa-solid fa-circle-xmark",
        desc: "No PO reference is present on the BOL."
      }
    ]
  },

  final_noar_add_po_invoice: {
    text: "Agent needs to add the PO# on the invoice.",
    choices: []
  },

  final_noar_no_po_entered: {
    text: "If there is no PO# present on the BOL, agent will not enter anything for the PO field. Bills of lading that have a BOL# starting with “AE” usually will not have a PO#.",
    choices: []
  },

  /* =========================================================
     AMCOAT IND FLOW
  ========================================================= */

  amcoat_billing_account: {
    text: "Billing using account# 295302291.",
    choices: [
      {
        label: "Continue",
        next: "amcoat_residential_fee_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue to Residential fee review."
      }
    ]
  },

  amcoat_residential_fee_check: {
    text: "Is there a Residential fee billed on the invoice?",
    choices: [
      {
        label: "No",
        next: "amcoat_no_residential_fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "No Residential fee is billed on the invoice."
      },
      {
        label: "Yes",
        next: "final_amcoat_remove_residential_charge",
        icon: "fa-solid fa-circle-check",
        desc: "Residential fee is billed on the invoice."
      }
    ]
  },

  final_amcoat_remove_residential_charge: {
    text: "Remove Residential charges as location is not a residence but is across from a residential neighborhood.",
    choices: []
  },

  amcoat_no_residential_fee: {
    text: "If there is not RESD present, please have the agents do a CORR VRFY to post from the queue.",
    choices: [
      {
        label: "Continue",
        next: "amcoat_invoice_billing_correct_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue to verify invoice billing."
      }
    ]
  },

  amcoat_invoice_billing_correct_check: {
    text: "Is the invoice billing correctly per BOL?",
    choices: [
      {
        label: "Yes",
        next: "final_amcoat_post_corr_govr",
        icon: "fa-solid fa-circle-check",
        desc: "Invoice is billing correctly per BOL."
      },
      {
        label: "No",
        next: "amcoat_verify_terms",
        icon: "fa-solid fa-circle-xmark",
        desc: "Invoice is not billing correctly per BOL."
      }
    ]
  },

  final_amcoat_post_corr_govr: {
    text: "If PRO is already billing correctly and no update even on Ref Edit to be made, just do CORR GOVR and post the bill.",
    choices: []
  },

  amcoat_verify_terms: {
    text: "Verify the terms. What is the terms per BOL?",
    choices: [
      {
        label: "Prepaid/Collect",
        next: "amcoat_prepaid_collect_lockheed_check",
        icon: "fa-solid fa-file-invoice",
        desc: "Terms per BOL are Prepaid or Collect."
      },
      {
        label: "Third Party",
        next: "final_amcoat_true_third_party",
        icon: "fa-solid fa-users",
        desc: "Terms per BOL are Third Party."
      }
    ]
  },

  amcoat_prepaid_collect_lockheed_check: {
    text: "If Lockheed related to Shipper/Consignee and BOL shows Division #, check the Alias Profile of Shipper/Consignee if same division# is listed. Does the division number match?",
    choices: [
      {
        label: "Yes",
        next: "final_amcoat_division_matches",
        icon: "fa-solid fa-circle-check",
        desc: "Division number matches."
      },
      {
        label: "No",
        next: "final_amcoat_division_not_match",
        icon: "fa-solid fa-circle-xmark",
        desc: "Division number does not match."
      }
    ]
  },

  final_amcoat_division_matches: {
    text: "If division matches and terms are correct, use CORR GOVR.",
    choices: []
  },

  final_amcoat_division_not_match: {
    text: "If division number does not match Alias Profile of SC or CC versus BOL, add the division number to the bill-to name on FBC. Add INV keyword and CORR GOVR. Since bill-to is overtyped with the division number as CR through Reference Edit, add PO# if listed on BOL.",
    choices: []
  },

  final_amcoat_true_third_party: {
    text: "If True 3rd party and BOL shows Division # for Lockheed, add the division number to the bill-to name on FBC. Add INV keyword and CORR GOVR. Since bill-to is overtyped with the division number as CR through Reference Edit, add PO# if listed on BOL.",
    choices: []
  }

};
