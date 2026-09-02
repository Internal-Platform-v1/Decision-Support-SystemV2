/* DSS V2 — REUSABLE GUIDE ENGINE
   Functional logic derived from the working Debtor Update per BOL guide.
   Styling is intentionally not carried over from the old DSS.
*/
(function() {
  "use strict";

const NODES = {
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

  const TEMPLATE_COLLECTION = "billing_dispute_general_template";
  const MAX_STEPS = 8;
  const state = { currentKey:"start", path:[], history:[], finalText:"", pathExpanded:false };
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
  const nodeText = n => n?.text || n?.question || "";
  const choices = n => Array.isArray(n?.choices) ? n.choices : [];
  const isFinal = n => !!n?.action || (!choices(n).length && !n?.next);

  function setTemplate(id,text) { const el=$(id); if(!el)return; el.textContent=text||""; el.classList.toggle("empty",!text); }
  function clearTemplates() { setTemplate("suggestedComment",""); setTemplate("suggestedCorrCode",""); setTemplate("suggestedEmail",""); }

  async function loadTemplates(recommendation) {
    clearTemplates();
    const db=window.db;
    if(!db || !recommendation) return;
    const norm=String(recommendation).toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"");
    const ids={comment:`comment__${norm}`,corr:`corr__${norm}`,email:`email__${norm}`};
    try {
      const [a,b,c]=await Promise.all([db.collection(TEMPLATE_COLLECTION).doc(ids.comment).get(),db.collection(TEMPLATE_COLLECTION).doc(ids.corr).get(),db.collection(TEMPLATE_COLLECTION).doc(ids.email).get()]);
      setTemplate("suggestedComment",a.exists ? (a.data().text||""):"");
      setTemplate("suggestedCorrCode",b.exists ? (b.data().text||""):"");
      setTemplate("suggestedEmail",c.exists ? (c.data().text||""):"");
    } catch(e) { console.warn("Guide templates unavailable:",e); }
  }

  function copyTemplate(id,btn) { const el=$(id); if(!el || el.classList.contains("empty")) return; navigator.clipboard?.writeText(el.innerText.trim()).then(()=>{ const old=btn.textContent; btn.textContent="Copied"; btn.classList.add("copied"); setTimeout(()=>{btn.textContent=old;btn.classList.remove("copied")},1400); }).catch(()=>{}); }

  function progress() {
    const pct = state.finalText ? 100 : Math.min(95, Math.round((state.path.length / MAX_STEPS) * 100));
    const fill = $("progressFill");
    if (fill) fill.style.width = pct + "%";

    $("progressText").textContent = state.finalText
      ? "Recommendation ready"
      : state.path.length
        ? "Flow in progress"
        : "Not started";

    $("metricSteps").textContent = state.path.length;
    $("metricAnswer").textContent = state.path.length ? state.path[state.path.length - 1].answer : "—";
    $("statusText").textContent = state.finalText ? "Completed" : state.path.length ? "Working" : "Ready";
  }

  function renderPath() {
    const box = $("pathBox");
    if (!box) return;

    const host = box.closest(".side-card") || box.parentElement;
    if (!host) return;

    host.classList.add("path-card");

    /* --------------------------------------------------------
       UPDATE EXPANDED STATE ON THE ACTUAL CARD
       -------------------------------------------------------- */
    host.classList.toggle("path-expanded", state.pathExpanded);

    if (!host.dataset.pathHoverBound) {
        host.dataset.pathHoverBound = "true";

        host.addEventListener("mouseenter", () => {
            if (state.path.length > 1) {
                state.pathExpanded = true;
                renderPath();
            }
        });

        host.addEventListener("mouseleave", () => {
            if (state.pathExpanded) {
                state.pathExpanded = false;
                renderPath();
            }
        });
    }

    /* --------------------------------------------------------
       NO PATH
       -------------------------------------------------------- */
    if (!state.path.length) {
        host.classList.remove("path-expanded");
        host.style.height = "170px";

        box.className = "path-empty";
        box.innerHTML =
            "No steps selected yet. The full path will appear here as you move through the steps.";

        return;
    }

    const lastIndex = state.path.length - 1;

    /* --------------------------------------------------------
       SHOW ONLY CURRENT STEP WHEN COLLAPSED
       SHOW ALL STEPS WHEN HOVERED
       -------------------------------------------------------- */
    const visiblePath = state.pathExpanded
        ? state.path
        : [state.path[lastIndex]];

    box.className = state.pathExpanded
        ? "path-list is-expanded"
        : "path-list is-collapsed";

    /* --------------------------------------------------------
       RENDER PATH ITEMS
       -------------------------------------------------------- */
    box.innerHTML = visiblePath.map((x) => {
        const i = state.path.indexOf(x);

        const active =
            i === lastIndex &&
            !state.finalText;

        const finalActive =
            state.finalText &&
            (
                x.nextKey === "__final__" ||
                isFinal(NODES[x.nextKey])
            );

        return `
            <div class="path-item">
                <button
                    class="path-jump ${active || finalActive ? "active" : ""}"
                    data-index="${i}"
                    type="button"
                >
                    <div class="path-step">
                        Step ${i + 1}
                    </div>

                    <div class="path-question">
                        ${esc(x.question)}
                    </div>

                    <div class="path-answer">
                        → ${esc(x.answer)}
                    </div>
                </button>
            </div>
        `;
    }).join("");

    /* --------------------------------------------------------
       MEASURE THE ACTUAL CARD CONTENT
       -------------------------------------------------------- */

    if (state.pathExpanded && state.path.length > 1) {

        /*
         * Temporarily remove the fixed height so the browser
         * can calculate the real content height.
         */
        host.style.height = "auto";

        requestAnimationFrame(() => {

            const requiredHeight = host.scrollHeight;

            /*
             * Add a tiny amount of breathing room so the last
             * path item never touches the bottom edge.
             */
            const finalHeight = requiredHeight + 2;

            /*
             * Set the measured height so CSS can animate
             * from the collapsed height to the real height.
             */
            host.style.height = `${finalHeight}px`;
        });

    } else {

        /*
         * Normal collapsed state.
         */
        host.style.height = "170px";
    }

    /* --------------------------------------------------------
       PATH JUMP BUTTONS
       -------------------------------------------------------- */
    box.querySelectorAll(".path-jump").forEach(btn => {
        btn.addEventListener("click", () => {
            jumpTo(Number(btn.dataset.index));
        });
    });
}

  function updateRecommendation(text, final) {
    const box = $("recommendationBox");
    if (!box) return;
    box.className = final ? "recommendation" : "recommendation empty";
    box.innerHTML = final ? esc(text).replace(/\n/g, "<br>") : "No recommendations yet.<br>Follow the flow to reach the final instruction.";
  }

  function renderFinal(finalNode) {
    const text = finalNode.action || nodeText(finalNode) || "";
    const note = finalNode.note || "";

    state.finalText = text;
    state.currentKey = "__final__";

    progress();
    renderPath();
    updateRecommendation(text, true);
    loadTemplates(text);

    $("stageCard").innerHTML = `
      <div class="stage-top">
        <span class="stage-badge"><i class="fa-solid fa-circle-check"></i> Flow Complete</span>
        <span class="stage-badge alt"><i class="fa-solid fa-lightbulb"></i> Final instruction</span>
      </div>
      <div class="final-card">
        <div class="final-badge"><i class="fa-solid fa-check"></i> Recommended Action</div>
        <div class="final-title">Use this handling outcome</div>
        <div class="final-text">${esc(text)}</div>
        ${note ? `<div class="final-note">${esc(note)}</div>` : ""}
        <div class="final-actions">
          <button class="action-btn" id="finalBack" type="button">Go Back</button>
          <button class="action-btn primary" id="finalRestart" type="button">Start Over</button>
        </div>
      </div>`;

    $("finalBack").onclick = goBack;
    $("finalRestart").onclick = restart;
  }

  function renderStart(node) {
    const ch = choices(node);
    const continueChoice = ch[0];
    const reminder = node.note || "";

    const choiceHtml = continueChoice ? `
      <button class="choice start-choice" data-next="${esc(continueChoice.next || "")}" data-label="${esc(continueChoice.label || "")}" data-action="${esc(continueChoice.action || "")}" data-note="${esc(continueChoice.note || "")}" type="button">
        <div class="choice-icon"><i class="${continueChoice.icon || "fa-solid fa-arrow-right"}"></i></div>
        <div class="choice-body">
          <div class="choice-title">${esc(continueChoice.label || "Continue")}</div>
          <div class="choice-desc">${esc(continueChoice.desc || "Start the decision flow.")}</div>
        </div>
      </button>` : "";

    $("stageCard").innerHTML = `
      <div class="stage-top">
        <span class="stage-badge"><i class="fa-solid fa-circle-dot"></i> Getting Started</span>
        <button class="save-guide-button" id="saveGuide" type="button"><i class="fa-regular fa-star"></i> Save Guide</button>
      </div>
      <div class="question-wrap start-card">
        <div class="question-card">
          <div class="question-label"><i class="fa-solid fa-share-nodes"></i> Current Step</div>
          <div class="question-text">${esc(nodeText(node))}</div>
          ${node.help ? `<div class="question-help">${esc(node.help).replace(/\n/g, "<br>")}</div>` : ""}
          ${reminder ? `<div class="note-card"><div class="note-head"><i class="fa-solid fa-bell"></i> Reminder</div><div class="note-body">${esc(reminder)}</div></div>` : ""}
        </div>
        <div class="choices">${choiceHtml}</div>
      </div>
      <div class="decision-footer">
        <div class="footer-step">DECISION GUIDE<strong>Ready to begin</strong></div>
        <div class="decision-actions"><button class="action-btn primary" id="startContinue" type="button">Continue <i class="fa-solid fa-arrow-right"></i></button></div>
      </div>`;

    const choice = $("stageCard").querySelector(".choice");
    if (choice) choice.addEventListener("click", () => choose(choice, node));
    $("startContinue")?.addEventListener("click", () => choice?.click());
    $("saveGuide")?.addEventListener("click", saveGuide);

    progress();
    renderPath();
  }

  function renderNode(key) {
    state.currentKey = key;
    state.finalText = "";
    clearTemplates();
    updateRecommendation("", false);

    const n = NODES[key];
    if (!n) {
      $("stageCard").innerHTML = `<div class="question-wrap"><div class="question-card"><div class="question-text">Guide step not found</div></div></div>`;
      return;
    }

    if (key === "start") {
      renderStart(n);
      return;
    }

    if (isFinal(n)) {
      renderFinal(n);
      return;
    }

    const idx = state.path.findIndex(x => x.fromKey === key);
    const prev = state.path.findIndex(x => x.nextKey === key);
    const step = idx >= 0 ? idx + 1 : prev >= 0 ? prev + 2 : state.path.length + 1;
    const ch = choices(n);

    const choicesHtml = ch.map(c => `
      <button class="choice" data-next="${esc(c.next || "")}" data-label="${esc(c.label || "")}" data-action="${esc(c.action || "")}" data-note="${esc(c.note || "")}" type="button">
        <div class="choice-icon"><i class="${c.icon || "fa-solid fa-circle"}"></i></div>
        <div class="choice-body">
          <div class="choice-title">${esc(c.label || "")}</div>
          <div class="choice-desc">${esc(c.desc || "Continue to the next step.")}</div>
        </div>
      </button>`).join("");

    const image = n.image ? `<div class="question-image" id="questionImage"><img src="${esc(n.image)}" alt="Guide reference image" loading="lazy"></div>` : "";

    $("stageCard").innerHTML = `
      <div class="stage-top">
        <span class="stage-badge"><i class="fa-solid fa-route"></i> Guided Decision</span>
        <span class="stage-badge alt"><i class="fa-solid fa-list-ol"></i> Step ${step}</span>
      </div>
      <div class="question-wrap">
        <div class="question-card">
          <div class="question-label"><i class="fa-solid fa-circle-nodes"></i> Decision Point</div>
          <div class="question-text">${esc(nodeText(n))}</div>
          ${n.help ? `<div class="question-help">${esc(n.help).replace(/\n/g, "<br>")}</div>` : ""}
          ${n.note ? `<div class="note-card"><div class="note-head"><i class="fa-solid fa-bell"></i> Reminder</div><div class="note-body">${esc(n.note)}</div></div>` : ""}
          ${image}
        </div>
        <div class="choices">${choicesHtml}</div>
      </div>
      <div class="decision-footer">
        <div class="footer-step">DECISION GUIDE<strong>Currently on step ${step}</strong></div>
        <div class="decision-actions">
          <button class="action-btn" id="inlineBack" type="button">Go Back</button>
          <button class="action-btn primary" id="inlineRestart" type="button">Start Over</button>
        </div>
      </div>`;

    $("inlineBack").onclick = goBack;
    $("inlineRestart").onclick = restart;
    if ($("questionImage")) $("questionImage").onclick = () => openImageModal(n.image);
    $("stageCard").querySelectorAll(".choice").forEach(btn => btn.addEventListener("click", () => choose(btn, n)));

    progress();
    renderPath();
  }

  function choose(btn, node) {
    const next = btn.dataset.next;
    const label = btn.dataset.label;
    const action = btn.dataset.action;
    const note = btn.dataset.note;

    /*
     * The INTRO / START screen is not part of the
     * decision path.
     *
     * Therefore clicking "Continue" from the intro
     * should NOT create a Selected Path step.
     */
    if (state.currentKey === "start") {
        state.currentKey = next;
        state.finalText = "";
        clearTemplates();
        updateRecommendation("", false);

        renderNode(next);
        return;
    }

    /*
     * If the user changes an earlier decision,
     * remove everything after that decision.
     */
    const existing = state.path.findIndex(
        x => x.fromKey === state.currentKey
    );

    if (existing >= 0) {
        state.path = state.path.slice(0, existing);
    }

    /*
     * Prevent duplicate / stale path entries when
     * navigating back into an existing branch.
     */
    const reached = state.path.findIndex(
        x => x.nextKey === state.currentKey
    );

    if (existing < 0 && reached >= 0) {
        state.path = state.path.slice(0, reached + 1);
    }

    /*
     * Save history before adding the new decision.
     */
    state.history.push({
        key: state.currentKey,
        path: [...state.path]
    });

    /*
     * Add ONLY real decision steps.
     *
     * The "start" intro never reaches this section.
     */
    state.path.push({
        question: nodeText(node),
        answer: label,
        fromKey: state.currentKey,
        nextKey: action ? "__final__" : next,
        finalNode: action
            ? { action, note }
            : null
    });

    btn.classList.add("selected");

    progress();
    renderPath();

    /*
     * Continue to the selected answer.
     */
    setTimeout(() => {
        if (action) {
            renderFinal({ action, note });
        } else {
            renderNode(next);
        }
    }, 100);
}

  function goBack() {
    clearTemplates();
    state.finalText = "";
    updateRecommendation("", false);

    if (state.currentKey === "__final__") {
      const i = state.path.findIndex(x => x.nextKey === "__final__" || isFinal(NODES[x.nextKey]));
      if (i < 0) return renderNode("start");
      state.path = state.path.slice(0, i);
      return renderNode(i === 0 ? "start" : state.path[i - 1].nextKey);
    }

    const i = state.path.findIndex(x => x.fromKey === state.currentKey);
    if (i >= 0) {
      state.path = state.path.slice(0, i);
      return renderNode(i === 0 ? "start" : state.path[i - 1].nextKey);
    }

    const j = state.path.findIndex(x => x.nextKey === state.currentKey);
    if (j >= 0) return renderNode(state.path[j].fromKey);

    renderNode("start");
  }

  function restart() {
    state.path = [];
    state.history = [];
    state.finalText = "";
    state.pathExpanded = false;
    state.currentKey = "start";
    clearTemplates();
    updateRecommendation("", false);
    renderNode("start");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

function jumpTo(i) {
    const x = state.path[i];
    if (!x) return;

    /*
     * Remove any later decisions.
     * The clicked step becomes the current point
     * in the decision flow.
     */
    state.path = state.path.slice(0, i + 1);

    /*
     * Clear the final recommendation because we're
     * going back into the decision flow.
     */
    state.finalText = "";

    /*
     * Clear templates/recommendation from the previous
     * final state.
     */
    clearTemplates();
    updateRecommendation("", false);

    /*
     * IMPORTANT:
     *
     * x.fromKey is the node represented by this
     * Selected Path item.
     *
     * Do NOT use x.nextKey here.
     */
    renderNode(x.fromKey);
}

  function saveGuide() {
    const key = "savedGuides";
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(key) || "[]"); } catch (_) {}
    const guide = { title: "Debtor Update per BOL", url: window.location.pathname };
    const exists = saved.some(x => x.url === guide.url);
    saved = exists ? saved.filter(x => x.url !== guide.url) : [...saved, guide];
    localStorage.setItem(key, JSON.stringify(saved));

    const btn = $("saveGuide");
    if (btn) {
      btn.innerHTML = exists ? '<i class="fa-regular fa-star"></i> Save Guide' : '<i class="fa-solid fa-star"></i> Saved';
      btn.classList.toggle("saved", !exists);
    }
  }


  function showToast(message) {
    const toast = $("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__guideToastTimer);
    window.__guideToastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
  }

  function bindTemplateButtons() {
    document.querySelectorAll(".template-copy").forEach((button) => {
      button.addEventListener("click", () => {
        copyTemplate(button.dataset.target, button);
      });
    });

    document.querySelectorAll(".template-link").forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.target;
        if (target) {
          window.location.href = target;
        } else {
          showToast("Reference tool link is not configured yet.");
        }
      });
    });
  }

  function openImageModal(src) {
    const modal = $("imageModal");
    const image = $("imageModalImg");
    if (!modal || !image || !src) return;
    image.src = src;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeImageModal() {
    const modal = $("imageModal");
    const image = $("imageModalImg");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (image) image.removeAttribute("src");
  }

  function init() {
    // Render the guide first. Optional helper controls must never prevent
    // the decision flow from appearing.
    renderNode("start");

    $("restartGuide")?.addEventListener("click", restart);
    $("backToGroup")?.addEventListener("click", () => history.back());

    bindTemplateButtons();

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeImageModal();
    });

    $("imageModal")?.addEventListener("click", (event) => {
      if (event.target.id === "imageModal") closeImageModal();
    });

    window.guideEngine = {
      restart,
      goBack,
      openImageModal,
      closeImageModal
    };
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
