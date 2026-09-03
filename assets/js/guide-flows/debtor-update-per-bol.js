(function () {
  "use strict";

  window.GUIDE_CONFIG = {
    id: "debtor-update-per-bol",
    title: "Debtor Update per BOL",
    startNode: "start",
    templateCollection: "debtor_update_per_bol_template"
  };

  window.GUIDE_NODES = {
    start: {
      text: "Debtor Update per BOL - General Guide",
      help: "Select the correct billing setup shown on the BOL to determine the appropriate dispute handling process.",
      note: "Always review the BOL, invoice details, billing terms, account number, bill-to section, and account relationship before proceeding.",
      choices: [{ label: "Continue", next: "start_billing_term", icon: "fa-solid fa-arrow-right", desc: "Start the Debtor Update per BOL decision flow." }]
    },
    start_billing_term: {
      text: "What is the shipment billing term?",
      help: "Choose the billing setup shown on the BOL.",
      choices: [
        { label: "Prepaid", next: "prepaid", icon: "fa-solid fa-truck-fast", desc: "Shipment is billed prepaid." },
        { label: "Collect", next: "collect", icon: "fa-solid fa-hand-holding-dollar", desc: "Shipment is billed collect." },
        { label: "Third Party", next: "third_party_root", icon: "fa-solid fa-building-user", desc: "Shipment is billed to a third party." },
        { label: "No Terms", next: "noterms", icon: "fa-solid fa-file-circle-question", desc: "No billing terms are clearly shown." }
      ]
    },
    prepaid: {
      text: "Is there an Account No. noted on BOL?",
      help: "Check whether an account number is written on the BOL for the prepaid shipment.",
      choices: [
        { label: "Yes", next: "prepaid_instruction_check", icon: "fa-solid fa-circle-check", desc: "An account number is present on the BOL." },
        { label: "No", next: "final_prepaid_no_account", icon: "fa-solid fa-circle-xmark", desc: "No account number is noted." }
      ]
    },
    final_prepaid_no_account: { text: "Bill the PRO to the Shipper per terms noted on BOL.", choices: [] },
    prepaid_instruction_check: {
      text: "Is there a clear instruction to bill that account number, or is it mentioned in the Bill-To section?",
      help: "Check if the BOL clearly instructs billing to the account number.",
      choices: [
        { label: "Yes", next: "prepaid_account_type", icon: "fa-solid fa-circle-check", desc: "There is a clear billing instruction." },
        { label: "No", next: "final_prepaid_random_account_loa", icon: "fa-solid fa-circle-xmark", desc: "The account appears randomly listed." }
      ]
    },
    final_prepaid_random_account_loa: { text: "If an account number is listed randomly on the BOL and has no instruction to bill it, and no relation to the shipper or consignee, terms will trump and LOA is needed to update to the random account number listed on the BOL.", choices: [] },
    prepaid_account_type: {
      text: "Is the account a billing or shipping account?",
      choices: [
        { label: "Billing", next: "prepaid_billing_relation", icon: "fa-solid fa-file-invoice-dollar", desc: "Account is a billing account." },
        { label: "Shipping", next: "prepaid_shipping_relation", icon: "fa-solid fa-box", desc: "Account is a shipping account." }
      ]
    },
    prepaid_billing_relation: {
      text: "Is the account no. related to the shipper?",
      choices: [
        { label: "Yes", next: "final_prepaid_billing_shipper", icon: "fa-solid fa-circle-check", desc: "Billing account is related to the shipper." },
        { label: "No - Account related to Consignee", next: "prepaid_consignee_initial_billed", icon: "fa-solid fa-location-dot", desc: "Account is related to the consignee." },
        { label: "No - Account is a True 3rd Party", next: "prepaid_true3pty_initial_billed", icon: "fa-solid fa-building", desc: "Account is a true third-party account." }
      ]
    },
    final_prepaid_billing_shipper: { text: "Proceed with rebilling the account no. per BOL.", note: "Make sure to check the shipper code. If it has ABT, look for a different shipping account with ABT that matches the account number noted on the BOL.", choices: [] },
    prepaid_shipping_relation: {
      text: "Is the account no. related to the shipper?",
      choices: [
        { label: "Yes", next: "prepaid_shipper_address_match", icon: "fa-solid fa-circle-check", desc: "Shipping account is related to the shipper." },
        { label: "No - Account related to Consignee", next: "prepaid_consignee_initial_billed", icon: "fa-solid fa-location-dot", desc: "Account is related to consignee." },
        { label: "No - Account is a True 3rd Party", next: "prepaid_true3pty_initial_billed", icon: "fa-solid fa-building", desc: "Account is true third party." }
      ]
    },
    prepaid_shipper_address_match: {
      text: "Does the account's address match the shipper's according to the BOL?",
      choices: [
        { label: "Yes", next: "final_prepaid_shipper_update_code", icon: "fa-solid fa-circle-check", desc: "Address matches the shipper." },
        { label: "No", next: "final_prepaid_shipper_find_abt", icon: "fa-solid fa-circle-xmark", desc: "Address does not match." }
      ]
    },
    final_prepaid_shipper_update_code: { text: "Update the shipper code using the account noted on the BOL.", note: "Make sure the company name is same or related to the shipper. If not, look for a billing account using the account information.", choices: [] },
    final_prepaid_shipper_find_abt: { text: "Look for a shipper's shipping account with ABT that shows the same information as the account. If none, look for a billing account using the account's information. If no billing account is found, bill the shipper.", choices: [] },
    prepaid_consignee_initial_billed: {
      text: "Who was initially billed on the PRO?",
      choices: [
        { label: "Shipper - per Terms on BOL", next: "prepaid_consignee_shipper_terms", icon: "fa-solid fa-file-signature", desc: "PRO was billed to shipper per terms." },
        { label: "Account no. per BOL", next: "prepaid_consignee_account_billed", icon: "fa-solid fa-credit-card", desc: "PRO was billed to account number per BOL." },
        { label: "Random company not noted on the BOL", next: "prepaid_consignee_random_loa", icon: "fa-solid fa-circle-question", desc: "Billed party is not shipper, consignee, or bill-to." }
      ]
    },
    prepaid_consignee_shipper_terms: {
      text: "Does the account's address match the Consignee address according to the BOL?",
      choices: [
        { label: "Yes", next: "final_prepaid_consignee_update_code", icon: "fa-solid fa-circle-check", desc: "Address matches consignee." },
        { label: "No", next: "final_prepaid_consignee_find_account", icon: "fa-solid fa-circle-xmark", desc: "Address does not match consignee." }
      ]
    },
    final_prepaid_consignee_update_code: { text: "Update the consignee code using the account noted on the BOL.", note: "Make sure the company name is same or related to the consignee. If not, look for a billing account using the account information.", choices: [] },
    final_prepaid_consignee_find_account: { text: "Look for a billing account using the account's information and update the terms to collect. If no billing account is found, bill the Consignee per account number noted in the BT section in attempt of payment.", choices: [] },
    prepaid_consignee_account_billed: {
      text: "Who is the disputing party?",
      choices: [
        { label: "Account no.", next: "final_prepaid_consignee_account_owner", icon: "fa-solid fa-user", desc: "Account owner is disputing." },
        { label: "Shipper", next: "final_prepaid_consignee_shipper_dispute", icon: "fa-solid fa-warehouse", desc: "Shipper is disputing." },
        { label: "Random company not noted on the BOL", next: "final_prepaid_consignee_random_billed", icon: "fa-solid fa-circle-question", desc: "Random company is disputing." }
      ]
    },
    final_prepaid_consignee_account_owner: { text: "If the disputing party is the Account no. owner and the request is to bill the shipper, bill it to prepaid per conflicting information on BOL.", choices: [] },
    final_prepaid_consignee_shipper_dispute: { text: "Proceed in billing prepaid per Terms noted on BOL without correction fee. Send to imaging for reference.", choices: [] },
    final_prepaid_consignee_random_billed: { text: "Check if account was ever billed on this PRO. If not yet, bill the account. If account was previously billed, bill prepaid per conflicting information on the BOL.", choices: [] },
    prepaid_consignee_random_loa: {
      text: "Do we have LOA on file?",
      choices: [
        { label: "Yes", next: "prepaid_consignee_loa_valid", icon: "fa-solid fa-file-circle-check", desc: "LOA is available." },
        { label: "No", next: "final_prepaid_consignee_no_loa", icon: "fa-solid fa-file-circle-xmark", desc: "No LOA is available." }
      ]
    },
    prepaid_consignee_loa_valid: {
      text: "Is the LOA valid or not?",
      choices: [
        { label: "Yes", next: "final_prepaid_consignee_loa_valid", icon: "fa-solid fa-circle-check", desc: "LOA is valid." },
        { label: "No", next: "prepaid_consignee_account_ever_billed", icon: "fa-solid fa-circle-xmark", desc: "LOA is not valid." }
      ]
    },
    final_prepaid_consignee_loa_valid: { text: "This is billing correctly to random company per LOA. LOA from different / accepting party is needed.", choices: [] },
    prepaid_consignee_account_ever_billed: {
      text: "Was the account number ever billed on the PRO?",
      choices: [
        { label: "Yes", next: "prepaid_consignee_disputes_before_remove", icon: "fa-solid fa-circle-check", desc: "Account was previously billed." },
        { label: "No", next: "final_prepaid_consignee_bill_account_collect", icon: "fa-solid fa-circle-xmark", desc: "Account was not previously billed." }
      ]
    },
    prepaid_consignee_disputes_before_remove: {
      text: "Did we receive disputes from consignee/account before to remove them from this bill?",
      choices: [
        { label: "Yes", next: "final_prepaid_consignee_bill_prepaid_conflict", icon: "fa-solid fa-circle-check", desc: "There was a prior dispute." },
        { label: "No", next: "final_prepaid_consignee_bill_account_collect", icon: "fa-solid fa-circle-xmark", desc: "No prior dispute." }
      ]
    },
    final_prepaid_consignee_bill_prepaid_conflict: { text: "Bill it to prepaid per conflicting information on BOL.", choices: [] },
    final_prepaid_consignee_bill_account_collect: { text: "Bill it to the account number then change the terms to collect.", note: "Make sure the address is same and company name is same or related to the consignee. If not, look for a billing account using the account information.", choices: [] },
    final_prepaid_consignee_no_loa: { text: "Look for a billing account using the account's information and update the terms to collect. If no billing account is found, bill the Consignee per account number noted in the BT section.", choices: [] },
    prepaid_true3pty_initial_billed: {
      text: "Who was initially billed on the PRO?",
      choices: [
        { label: "Shipper - per Terms on BOL", next: "final_prepaid_true3pty_shipper_terms", icon: "fa-solid fa-file-signature", desc: "PRO was billed to shipper per terms." },
        { label: "Account no. per BOL", next: "final_prepaid_true3pty_account_billed", icon: "fa-solid fa-credit-card", desc: "PRO was billed to account number per BOL." },
        { label: "Random company not the shipper, consignee or bill-to", next: "prepaid_true3pty_random_loa", icon: "fa-solid fa-circle-question", desc: "PRO was billed to random company." }
      ]
    },
    final_prepaid_true3pty_shipper_terms: { text: "Proceed in billing account no. per account no. noted on BOL.", note: "Make sure that the account on the BOL was never billed. If it was previously billed, an LOA is needed from the account.", choices: [] },
    final_prepaid_true3pty_account_billed: { text: "Bill Shipper per conflicting information noted on the BOL.", choices: [] },
    prepaid_true3pty_random_loa: {
      text: "Do we have LOA on file?",
      choices: [
        { label: "Yes", next: "prepaid_true3pty_loa_valid", icon: "fa-solid fa-file-circle-check", desc: "LOA is available." },
        { label: "No", next: "final_prepaid_true3pty_no_loa", icon: "fa-solid fa-file-circle-xmark", desc: "No LOA is available." }
      ]
    },
    prepaid_true3pty_loa_valid: {
      text: "Is the LOA valid or not?",
      choices: [
        { label: "Yes", next: "final_prepaid_true3pty_loa_valid", icon: "fa-solid fa-circle-check", desc: "LOA is valid." },
        { label: "No", next: "prepaid_true3pty_account_ever_billed", icon: "fa-solid fa-circle-xmark", desc: "LOA is not valid." }
      ]
    },
    final_prepaid_true3pty_loa_valid: { text: "This is billing correctly to random company per LOA. LOA from different / accepting party is needed.", choices: [] },
    prepaid_true3pty_account_ever_billed: {
      text: "Was the account number ever billed on the PRO?",
      choices: [
        { label: "Yes", next: "prepaid_true3pty_disputes_before_remove", icon: "fa-solid fa-circle-check", desc: "Account was previously billed." },
        { label: "No", next: "final_prepaid_true3pty_bill_account", icon: "fa-solid fa-circle-xmark", desc: "Account was not previously billed." }
      ]
    },
    prepaid_true3pty_disputes_before_remove: {
      text: "Did we receive disputes from account before to remove them from this bill?",
      choices: [
        { label: "Yes", next: "final_prepaid_true3pty_bill_collect_terms", icon: "fa-solid fa-circle-check", desc: "There was a prior dispute." },
        { label: "No", next: "final_prepaid_true3pty_bill_account", icon: "fa-solid fa-circle-xmark", desc: "No prior dispute." }
      ]
    },
    final_prepaid_true3pty_bill_collect_terms: { text: "Bill it to collect per terms noted on the BOL.", choices: [] },
    final_prepaid_true3pty_bill_account: { text: "Bill it to the account number.", note: "Since account is related to shipper, look for shipping account with ABT. If none, manually add bill-to. Make sure terms is prepaid.", choices: [] },
    final_prepaid_true3pty_no_loa: { text: "Look for a billing account using the account's information. If no billing account is found, bill the shipper per terms noted on BOL.", choices: [] },
    collect: {
      text: "Is there an Account No. noted on BOL?",
      help: "Check whether an account number is noted for the collect shipment.",
      choices: [
        { label: "Yes", next: "collect_instruction_check", icon: "fa-solid fa-circle-check", desc: "An account number is present on the BOL." },
        { label: "No", next: "final_collect_no_account", icon: "fa-solid fa-circle-xmark", desc: "No account number is noted." }
      ]
    },
    final_collect_no_account: { text: "Bill the PRO to the Consignee per terms noted on BOL.", choices: [] },
    collect_instruction_check: {
      text: "Is there a clear instruction to bill that account number, or is it mentioned in the Bill-To section?",
      choices: [
        { label: "Yes", next: "collect_account_type", icon: "fa-solid fa-circle-check", desc: "There is clear billing instruction." },
        { label: "No", next: "final_collect_random_account_loa", icon: "fa-solid fa-circle-xmark", desc: "No clear billing instruction." }
      ]
    },
    final_collect_random_account_loa: { text: "If an account number is listed randomly on the BOL and has no instruction to bill it and no relation to the shipper or consignee, terms will trump and LOA is needed to update to the random account number listed on the BOL.", choices: [] },
    collect_account_type: {
      text: "Is the account a billing or shipping account?",
      choices: [
        { label: "Billing", next: "collect_billing_relation", icon: "fa-solid fa-file-invoice-dollar", desc: "Account is a billing account." },
        { label: "Shipping", next: "collect_shipping_relation", icon: "fa-solid fa-box", desc: "Account is a shipping account." }
      ]
    },
    collect_billing_relation: {
      text: "Is the account no. related to the Consignee?",
      choices: [
        { label: "Yes", next: "final_collect_billing_consignee", icon: "fa-solid fa-circle-check", desc: "Billing account is related to consignee." },
        { label: "No - Account related to Shipper", next: "collect_shipper_initial_billed", icon: "fa-solid fa-warehouse", desc: "Account is related to shipper." },
        { label: "No - Account is a True 3rd Party", next: "collect_true3pty_initial_billed", icon: "fa-solid fa-building", desc: "Account is true third party." }
      ]
    },
    final_collect_billing_consignee: { text: "Proceed with rebilling the account no. per BOL.", note: "Make sure to check consignee code. If it has ABT, look for a different shipping account with ABT that matches the account number noted on the BOL.", choices: [] },
    collect_shipping_relation: {
      text: "Is the account no. related to the Consignee?",
      choices: [
        { label: "Yes", next: "collect_consignee_address_match", icon: "fa-solid fa-circle-check", desc: "Shipping account is related to consignee." },
        { label: "No - Account related to Shipper", next: "collect_shipper_initial_billed", icon: "fa-solid fa-warehouse", desc: "Account is related to shipper." },
        { label: "No - Account is a True 3rd Party", next: "collect_true3pty_initial_billed", icon: "fa-solid fa-building", desc: "Account is true third party." }
      ]
    },
    collect_consignee_address_match: {
      text: "Does the account's address match the Consignee's according to the BOL?",
      choices: [
        { label: "Yes", next: "final_collect_consignee_update_code", icon: "fa-solid fa-circle-check", desc: "Address matches consignee." },
        { label: "No", next: "final_collect_consignee_find_abt", icon: "fa-solid fa-circle-xmark", desc: "Address does not match consignee." }
      ]
    },
    final_collect_consignee_update_code: { text: "Update the consignee code using the account noted on the BOL.", note: "Make sure the company name is same or related to the consignee. If not, look for a billing account using the account information.", choices: [] },
    final_collect_consignee_find_abt: { text: "Look for a consignee's shipping account with ABT that shows the same information as the account. If none, look for a billing account using the account information. If no billing account is found, bill collect.", choices: [] },
    collect_shipper_initial_billed: {
      text: "Who was initially billed on the PRO?",
      choices: [
        { label: "Collect - per Terms on BOL", next: "final_collect_shipper_collect_terms", icon: "fa-solid fa-file-signature", desc: "PRO was billed collect per terms." },
        { label: "Prepaid", next: "collect_shipper_prepaid_path", icon: "fa-solid fa-truck-fast", desc: "PRO was billed prepaid." },
        { label: "Random company not the shipper, consignee or bill-to", next: "collect_shipper_random_loa", icon: "fa-solid fa-circle-question", desc: "PRO was billed to random company." }
      ]
    },
    final_collect_shipper_collect_terms: { text: "Proceed with rebilling the account no. per BOL. Update the terms if necessary. Example: Update to Prepaid if account is related to the Consignee. Check if account is ABT of the shipper or look for another shipping account with ABT.", choices: [] },
    collect_shipper_prepaid_path: {
      text: "Is the billing account number per BOL a good account or is there another good billing account number to bill?",
      choices: [
        { label: "Yes", next: "final_collect_shipper_prepaid_good_account", icon: "fa-solid fa-circle-check", desc: "Good billing account is available." },
        { label: "No", next: "final_collect_shipper_prepaid_no_account", icon: "fa-solid fa-circle-xmark", desc: "No good billing account is available." }
      ]
    },
    final_collect_shipper_prepaid_good_account: { text: "Bill it to the billing account per BOL.", note: "Make sure that the account on the BOL was never billed. If it was previously billed, bill it to collect per terms noted on the BOL.", choices: [] },
    final_collect_shipper_prepaid_no_account: { text: "Bill it to collect per terms noted on the BOL.", note: "Check if consignee was billed before. If yes, this is billing correctly to prepaid. An LOA is needed.", choices: [] },
    collect_shipper_random_loa: {
      text: "Do we have LOA on file?",
      choices: [
        { label: "Yes", next: "collect_shipper_loa_valid", icon: "fa-solid fa-file-circle-check", desc: "LOA is available." },
        { label: "No", next: "final_collect_shipper_no_loa", icon: "fa-solid fa-file-circle-xmark", desc: "No LOA is available." }
      ]
    },
    collect_shipper_loa_valid: {
      text: "Is the LOA valid or not?",
      choices: [
        { label: "Yes", next: "final_collect_shipper_loa_valid", icon: "fa-solid fa-circle-check", desc: "LOA is valid." },
        { label: "No", next: "collect_shipper_account_ever_billed", icon: "fa-solid fa-circle-xmark", desc: "LOA is not valid." }
      ]
    },
    final_collect_shipper_loa_valid: { text: "This is billing correctly to random company per LOA. LOA from different / accepting party is needed.", choices: [] },
    collect_shipper_account_ever_billed: {
      text: "Was the account number ever billed on the PRO?",
      choices: [
        { label: "Yes", next: "collect_shipper_disputes_before_remove", icon: "fa-solid fa-circle-check", desc: "Account was previously billed." },
        { label: "No", next: "final_collect_shipper_bill_account_prepaid", icon: "fa-solid fa-circle-xmark", desc: "Account was not previously billed." }
      ]
    },
    collect_shipper_disputes_before_remove: {
      text: "Did we receive disputes from shipper/account before to remove them from this bill?",
      choices: [
        { label: "Yes", next: "final_collect_shipper_bill_collect_terms", icon: "fa-solid fa-circle-check", desc: "There was a prior dispute." },
        { label: "No", next: "final_collect_shipper_bill_account_prepaid", icon: "fa-solid fa-circle-xmark", desc: "No prior dispute." }
      ]
    },
    final_collect_shipper_bill_collect_terms: { text: "Bill it to collect per terms noted on the BOL.", choices: [] },
    final_collect_shipper_bill_account_prepaid: { text: "Bill it to the account number. Make sure that terms is prepaid.", note: "Since account is related to shipper, look for shipping account with ABT. If none, manually add bill-to.", choices: [] },
    final_collect_shipper_no_loa: { text: "Look for a billing account using the account's information and update the terms to collect. If no billing account is found, bill the Consignee per account number noted in the BT section.", choices: [] },
    collect_true3pty_initial_billed: {
      text: "Who was initially billed on the PRO?",
      choices: [
        { label: "Collect - per Terms on BOL", next: "final_collect_true3pty_collect_terms", icon: "fa-solid fa-file-signature", desc: "PRO was billed collect per terms." },
        { label: "Account no. per BOL", next: "final_collect_true3pty_account_billed", icon: "fa-solid fa-credit-card", desc: "PRO was billed to account number per BOL." },
        { label: "Random company not the shipper, consignee or bill-to", next: "collect_true3pty_random_loa", icon: "fa-solid fa-circle-question", desc: "PRO was billed to random company." }
      ]
    },
    final_collect_true3pty_collect_terms: { text: "Proceed in billing account no. per account no. noted on BOL.", note: "Make sure that the account on the BOL was never billed. If it was previously billed, an LOA is needed from the account.", choices: [] },
    final_collect_true3pty_account_billed: { text: "Bill Collect per terms noted on the BOL.", choices: [] },
    collect_true3pty_random_loa: {
      text: "Do we have LOA on file?",
      choices: [
        { label: "Yes", next: "collect_true3pty_loa_valid", icon: "fa-solid fa-file-circle-check", desc: "LOA is available." },
        { label: "No", next: "final_collect_true3pty_no_loa", icon: "fa-solid fa-file-circle-xmark", desc: "No LOA is available." }
      ]
    },
    collect_true3pty_loa_valid: {
      text: "Is the LOA valid or not?",
      choices: [
        { label: "Yes", next: "final_collect_true3pty_loa_valid", icon: "fa-solid fa-circle-check", desc: "LOA is valid." },
        { label: "No", next: "collect_true3pty_account_ever_billed", icon: "fa-solid fa-circle-xmark", desc: "LOA is not valid." }
      ]
    },
    final_collect_true3pty_loa_valid: { text: "This is billing correctly to random company per LOA. LOA from different / accepting party is needed.", choices: [] },
    collect_true3pty_account_ever_billed: {
      text: "Was the account number ever billed on the PRO?",
      choices: [
        { label: "Yes", next: "collect_true3pty_disputes_before_remove", icon: "fa-solid fa-circle-check", desc: "Account was previously billed." },
        { label: "No", next: "final_collect_true3pty_bill_account", icon: "fa-solid fa-circle-xmark", desc: "Account was not previously billed." }
      ]
    },
    collect_true3pty_disputes_before_remove: {
      text: "Did we receive disputes from account before to remove them from this bill?",
      choices: [
        { label: "Yes", next: "final_collect_true3pty_bill_collect_terms", icon: "fa-solid fa-circle-check", desc: "There was a prior dispute." },
        { label: "No", next: "final_collect_true3pty_bill_account", icon: "fa-solid fa-circle-xmark", desc: "No prior dispute." }
      ]
    },
    final_collect_true3pty_bill_collect_terms: { text: "Bill it to collect per terms noted on the BOL.", choices: [] },
    final_collect_true3pty_bill_account: { text: "Bill it to the account number. Update the terms to P since BT is true 3pty.", choices: [] },
    final_collect_true3pty_no_loa: { text: "Look for a billing account using the account's information. If no billing account is found, bill collect per terms noted on BOL.", choices: [] },
    third_party_root: {
      text: "Is there an Account No. noted on the BOL?",
      help: "Use this branch when the billing term is Third Party.",
      choices: [
        { label: "Yes", next: "tp_instruction_check", icon: "fa-solid fa-circle-check", desc: "An account number is noted on the BOL." },
        { label: "No", next: "final_tp_no_account_default", icon: "fa-solid fa-circle-xmark", desc: "No account number is noted." }
      ]
    },
    final_tp_no_account_default: { text: "Bill it to default terms.\nUS to US & US to CA = Prepaid\nCA to US = Collect", choices: [] },
    tp_instruction_check: {
      text: "Is there a clear instruction to bill that account number, or is it mentioned in the Bill-To section?",
      choices: [
        { label: "Yes", next: "tp_account_type", icon: "fa-solid fa-circle-check", desc: "There is clear billing instruction." },
        { label: "No", next: "final_tp_random_account_loa", icon: "fa-solid fa-circle-xmark", desc: "No clear billing instruction." }
      ]
    },
    final_tp_random_account_loa: { text: "If an account number is listed in the center or random part of the BOL and has instruction to bill it and no relation to the shipper or consignee, terms will trump and LOA is needed in order to update to the random account no. listed on the BOL.", choices: [] },
    tp_account_type: {
      text: "Is the account a billing or shipping account?",
      choices: [
        { label: "Billing", next: "tp_billing_true3pty_check", icon: "fa-solid fa-file-invoice-dollar", desc: "Account is a billing account." },
        { label: "Shipping", next: "tp_shipping_true3pty_check", icon: "fa-solid fa-box", desc: "Account is a shipping account." }
      ]
    },
    tp_billing_true3pty_check: {
      text: "Is the account a true 3pty or 3pty?",
      choices: [
        { label: "3pty - Related to Shipper", next: "final_tp_billing_related_shipper", icon: "fa-solid fa-warehouse", desc: "3rd party is related to shipper." },
        { label: "3pty - Related to Collect", next: "final_tp_billing_related_collect", icon: "fa-solid fa-location-dot", desc: "3rd party is related to collect/consignee." },
        { label: "True 3pty", next: "tp_billing_true3pty_initial", icon: "fa-solid fa-building", desc: "True third party." }
      ]
    },
    final_tp_billing_related_shipper: { text: "Proceed with rebilling the account no. per BOL. Update the terms if necessary. Example: Update to Prepaid since account is related to shipper and check for an account with ABT.", choices: [] },
    final_tp_billing_related_collect: { text: "Proceed with rebilling the account no. per BOL. Update the terms if necessary. Example: Update to Collect since account is related to consignee and check for an account with ABT.", choices: [] },
    tp_billing_true3pty_initial: {
      text: "Who was initially billed on the PRO?",
      choices: [
        { label: "Prepaid", next: "final_tp_true3pty_prepaid", icon: "fa-solid fa-truck-fast", desc: "PRO was billed prepaid." },
        { label: "Collect", next: "final_tp_true3pty_collect", icon: "fa-solid fa-hand-holding-dollar", desc: "PRO was billed collect." },
        { label: "Account number noted", next: "final_tp_true3pty_account_noted", icon: "fa-solid fa-credit-card", desc: "PRO was billed to account number." }
      ]
    },
    final_tp_true3pty_prepaid: { text: "Check if account per BOL was previously billed.\n\nIf no, proceed with rebilling the account no. per BOL. Update the terms if necessary. Example: Update to Prepaid if account is related to the Shipper or True 3rd party. Check if account is ABT of the Shipper or Consignee.\n\nIf yes, this is billing correctly to shipper. An LOA is needed from new debtor.", choices: [] },
    final_tp_true3pty_collect: { text: "Check if account per BOL was previously billed.\n\nIf no, proceed with rebilling the account no. per BOL. Update the terms if necessary. Example: Update to Prepaid if account is related to the Shipper or True 3rd party. Collect if related to the Consignee. Check if account is ABT of the Shipper or Consignee.\n\nIf yes, bill it to shipper in attempt of payment.", choices: [] },
    final_tp_true3pty_account_noted: { text: "Check if this is the first time they are making a dispute.\n\nIf yes, educate the customer that this is billing correctly.\n\nIf no, bill it to shipper in attempt of payment.", choices: [] },
    tp_shipping_true3pty_check: {
      text: "Is the account a true 3pty or 3pty?",
      choices: [
        { label: "3pty - Related to Shipper", next: "final_tp_shipping_related_shipper", icon: "fa-solid fa-warehouse", desc: "3rd party is related to shipper." },
        { label: "3pty - Related to Collect", next: "final_tp_shipping_related_collect", icon: "fa-solid fa-location-dot", desc: "3rd party is related to collect/consignee." },
        { label: "True 3pty", next: "tp_shipping_true3pty_initial", icon: "fa-solid fa-building", desc: "True third party." }
      ]
    },
    final_tp_shipping_related_shipper: { text: "Use the account and update the Shipper Section then change the Terms to Prepaid.", note: "If account information is a true 3pty, search for a valid BT account that can be billed. If no available account, advise customer that account cannot be billed since it is inactive or not a valid BT account. If it is a shipping account with an ABT, bill it to the ABT of the shipping account.", choices: [] },
    final_tp_shipping_related_collect: { text: "Use the account and update the Consignee Section then change the Terms to Collect.", note: "If account information is a true 3pty, search for a valid BT account that can be billed. If no available account, advise customer that account cannot be billed since it is inactive or not a valid BT account. If it is a shipping account with an ABT, bill it to the ABT of the shipping account.", choices: [] },
    tp_shipping_true3pty_initial: {
      text: "Who was initially billed on the PRO?",
      choices: [
        { label: "Prepaid", next: "final_tp_shipping_true3pty_prepaid", icon: "fa-solid fa-truck-fast", desc: "PRO was billed prepaid." },
        { label: "Collect", next: "final_tp_shipping_true3pty_collect", icon: "fa-solid fa-hand-holding-dollar", desc: "PRO was billed collect." },
        { label: "Account number noted", next: "final_tp_shipping_true3pty_account_noted", icon: "fa-solid fa-credit-card", desc: "PRO was billed to account number." }
      ]
    },
    final_tp_shipping_true3pty_prepaid: { text: "Check if account/account information per BOL was previously billed.\n\nIf no, look for a billing account using the account information then proceed with rebilling the account no. per BOL. Update the terms if necessary. Example: Update to Prepaid if account is related to the Shipper or True 3rd party. Check if account is ABT of the Shipper.\n\nIf yes, this is billing correctly to shipper. An LOA is needed from new debtor.", choices: [] },
    final_tp_shipping_true3pty_collect: { text: "Check if account/account information per BOL was previously billed.\n\nIf no, look for a billing account using the account information then proceed with rebilling the account no. per BOL. Update the terms if necessary. Example: Update to Collect if account is related to the Consignee or True 3rd party. Check if account is ABT of the Consignee.\n\nIf yes, bill it to shipper in attempt of payment.", choices: [] },
    final_tp_shipping_true3pty_account_noted: { text: "Check if this is the first time they are making a dispute.\n\nIf yes, educate the customer that this is billing correctly.\n\nIf no, bill it to shipper in attempt of payment.", choices: [] },
    noterms: {
      text: "Is there an Account No. noted on BOL?",
      help: "Use this branch when no billing terms are clearly shown on the BOL.",
      choices: [
        { label: "Yes", next: "noterms_instruction_check", icon: "fa-solid fa-circle-check", desc: "An account number is present." },
        { label: "No", next: "final_noterms_default", icon: "fa-solid fa-circle-xmark", desc: "No account number is present." }
      ]
    },
    final_noterms_default: { text: "Bill it to default terms.\nUS to US & US to CA = Prepaid\nCA to US = Collect", choices: [] },
    noterms_instruction_check: {
      text: "Is there a clear instruction to bill that account number, or is it mentioned in the Bill-To section?",
      choices: [
        { label: "Yes", next: "noterms_account_type", icon: "fa-solid fa-circle-check", desc: "There is clear billing instruction." },
        { label: "No", next: "final_noterms_random_account_loa", icon: "fa-solid fa-circle-xmark", desc: "No clear billing instruction." }
      ]
    },
    final_noterms_random_account_loa: { text: "If an account number is listed in the center or random part of the BOL and has instruction to bill it and no relation to the shipper or consignee, terms will trump and LOA is needed in order to update to the random account no. listed on the BOL.", choices: [] },
    noterms_account_type: {
      text: "Is the account a billing or shipping account?",
      choices: [
        { label: "Billing", next: "noterms_billing_true3pty_check", icon: "fa-solid fa-file-invoice-dollar", desc: "Account is a billing account." },
        { label: "Shipping", next: "noterms_shipping_true3pty_check", icon: "fa-solid fa-box", desc: "Account is a shipping account." }
      ]
    },
    noterms_billing_true3pty_check: {
      text: "Is the account a true 3pty or 3pty?",
      choices: [
        { label: "3pty - Related to Shipper", next: "final_noterms_billing_related_shipper", icon: "fa-solid fa-warehouse", desc: "3rd party is related to shipper." },
        { label: "3pty - Related to Collect", next: "final_noterms_billing_related_collect", icon: "fa-solid fa-location-dot", desc: "3rd party is related to collect/consignee." },
        { label: "True 3pty", next: "noterms_true3pty_initial", icon: "fa-solid fa-building", desc: "True third party." }
      ]
    },
    final_noterms_billing_related_shipper: { text: "Proceed with rebilling the account no. per BOL. Update the terms if necessary. Example: Update to Prepaid since account is related to shipper and check for an account with ABT.", choices: [] },
    final_noterms_billing_related_collect: { text: "Proceed with rebilling the account no. per BOL. Update the terms if necessary. Example: Update to Collect since account is related to consignee and check for an account with ABT.", choices: [] },
    noterms_true3pty_initial: {
      text: "Who was initially billed on the PRO?",
      choices: [
        { label: "Prepaid", next: "final_noterms_true3pty_prepaid", icon: "fa-solid fa-truck-fast", desc: "PRO was billed prepaid." },
        { label: "Collect", next: "final_noterms_true3pty_collect", icon: "fa-solid fa-hand-holding-dollar", desc: "PRO was billed collect." },
        { label: "Account number noted", next: "final_noterms_true3pty_account_noted", icon: "fa-solid fa-credit-card", desc: "PRO was billed to account number." }
      ]
    },
    final_noterms_true3pty_prepaid: { text: "Check if account per BOL was previously billed.\n\nIf no, proceed with rebilling the account no. per BOL. Update the terms if necessary. Example: Update to Prepaid if account is related to the Shipper or True 3rd party. Check if account is ABT of the Shipper or Consignee.\n\nIf yes, this is billing correctly to shipper. An LOA is needed from new debtor.", choices: [] },
    final_noterms_true3pty_collect: { text: "Check if account per BOL was previously billed.\n\nIf no, proceed with rebilling the account no. per BOL. Update the terms if necessary. Example: Update to Prepaid if account is related to the Shipper or True 3rd party. Collect if related to the Consignee. Check if account is ABT of the Shipper or Consignee.\n\nIf yes, bill it to shipper in attempt of payment.", choices: [] },
    final_noterms_true3pty_account_noted: { text: "Check if this is the first time they are making a dispute.\n\nIf yes, educate the customer that this is billing correctly.\n\nIf no, bill it to shipper in attempt of payment.", choices: [] },
    noterms_shipping_true3pty_check: {
      text: "Is the account a true 3pty or 3pty?",
      choices: [
        { label: "3pty - Related to Shipper", next: "final_noterms_shipping_related_shipper", icon: "fa-solid fa-warehouse", desc: "3rd party is related to shipper." },
        { label: "3pty - Related to Collect", next: "final_noterms_shipping_related_collect", icon: "fa-solid fa-location-dot", desc: "3rd party is related to collect/consignee." },
        { label: "True 3pty", next: "noterms_shipping_true3pty_initial", icon: "fa-solid fa-building", desc: "True third party." }
      ]
    },
    final_noterms_shipping_related_shipper: { text: "Use the account and update the Shipper Section then change the Terms to Prepaid.", note: "If account information is a true 3pty, search for a valid BT account that can be billed. If no available account, advise customer that account cannot be billed since it is inactive or not a valid BT account. If it is a shipping account with an ABT, bill it to the ABT of the shipping account.", choices: [] },
    final_noterms_shipping_related_collect: { text: "Use the account and update the Consignee Section then change the Terms to Collect.", note: "If account information is a true 3pty, search for a valid BT account that can be billed. If no available account, advise customer that account cannot be billed since it is inactive or not a valid BT account. If it is a shipping account with an ABT, bill it to the ABT of the shipping account.", choices: [] },
    noterms_shipping_true3pty_initial: {
      text: "Who was initially billed on the PRO?",
      choices: [
        { label: "Prepaid", next: "final_noterms_shipping_true3pty_prepaid", icon: "fa-solid fa-truck-fast", desc: "PRO was billed prepaid." },
        { label: "Collect", next: "final_noterms_shipping_true3pty_collect", icon: "fa-solid fa-hand-holding-dollar", desc: "PRO was billed collect." },
        { label: "Account number noted", next: "final_noterms_shipping_true3pty_account_noted", icon: "fa-solid fa-credit-card", desc: "PRO was billed to account number." }
      ]
    },
    final_noterms_shipping_true3pty_prepaid: { text: "Check if account/account information per BOL was previously billed.\n\nIf no, look for a billing account using the account information then proceed with rebilling the account no. per BOL. Update the terms if necessary. Example: Update to Prepaid if account is related to the Shipper or True 3rd party. Check if account is ABT of the Shipper.\n\nIf yes, this is billing correctly to shipper. An LOA is needed from new debtor.", choices: [] },
    final_noterms_shipping_true3pty_collect: { text: "Check if account/account information per BOL was previously billed.\n\nIf no, look for a billing account using the account information then proceed with rebilling the account no. per BOL. Update the terms if necessary. Example: Update to Collect if account is related to the Consignee or True 3rd party. Check if account is ABT of the Consignee.\n\nIf yes, bill it to shipper in attempt of payment.", choices: [] },
    final_noterms_shipping_true3pty_account_noted: { text: "Check if this is the first time they are making a dispute.\n\nIf yes, educate the customer that this is billing correctly.\n\nIf no, bill it to shipper in attempt of payment.", choices: [] }
  };
