/* =========================================================
   COD (COLLECT ON DELIVERY) GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "cod-guide",
  title: "COD (Collect on Delivery) Guide",
  startNode: "start",
  templateCollection: "cod_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "COD (Collect on Delivery) – General Guide",
    help: "Follow this guide to add or remove COD based on BOL, LOA/CBL, imaged documents, and correction validity.",
    choices: [
      {
        label: "Continue",
        next: "actual_request",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the COD decision guide."
      }
    ]
  },

  actual_request: {
    text: "What is the actual request?",
    help: "Choose whether the request is to add COD per the original bill of lading or remove COD per LOA/CBL.",
    choices: [
      {
        label: "Adding a COD per the Original Bill of Lading",
        next: "add_cod_valid",
        icon: "fa-solid fa-plus",
        desc: "Use this path when COD needs to be added based on the original BOL."
      },
      {
        label: "Removing the COD per LOA/CBL",
        next: "remove_cod_valid",
        icon: "fa-solid fa-minus",
        desc: "Use this path when COD needs to be removed based on LOA/CBL."
      }
    ]
  },

  /* ================= ADD COD BRANCH ================= */

  add_cod_valid: {
    text: "Is the added COD charge valid?",
    help: "Validate if the BOL supports the COD amount and all required COD information is present.",
    choices: [
      {
        label: "Yes, Valid",
        next: "add_pull_cbl",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with BOL validation and COD entry."
      },
      {
        label: "Not Valid",
        next: "add_not_valid_missing_info",
        icon: "fa-solid fa-circle-xmark",
        desc: "Follow the decline process when required COD information is missing."
      }
    ]
  },

  add_not_valid_missing_info: {
    text: "Not Valid — required COD information is missing.",
    help: "Decline the request if one or more required COD details are missing.",
    note: "Correction request must provide all COD info that needs to be added to the Freight Bill:\n\n• COD Amount\n• COD Fee Prepaid or Collect\n• Type of Funds Acceptable: Certified check, company check, or Cash\n• Complete Remit to Address\n\nIf correction request is missing one or all of the information, the correction request MUST BE DECLINED.",
    choices: [
      {
        label: "Continue",
        next: "add_not_valid_remit_missing",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the decline comment process."
      }
    ]
  },

  add_not_valid_remit_missing: {
    text: "Pro is missing the Remit To address.",
    help: "Declined comments should state the missing information clearly.",
    note: "Use this declined comment:\n\nDECLINED — CORRECTION REQUEST IS REQUIRED TO SUPPLY ALL THE COD INFO. THIS REQUEST IS MISSING THE REMIT TO ADDRESS. PLEASE RE-ENTER AND SUPPLY ALL REQUIRED INFO.",
    image: "guides/PAUD%20Guides/cod-guide/images/9.png",
    choices: [
      {
        label: "Continue",
        next: "add_not_valid_add_comment",
        icon: "fa-solid fa-arrow-right",
        desc: "Add the declined comment."
      }
    ]
  },

  add_not_valid_add_comment: {
    text: "After entering the declined comment, select the ADD button.",
    help: "Make sure the declined comment is added before closing the comment screen.",
    image: "guides/PAUD%20Guides/cod-guide/images/10.png",
    choices: [
      {
        label: "Continue",
        next: "add_not_valid_close",
        icon: "fa-solid fa-arrow-right",
        desc: "Close the comment screen."
      }
    ]
  },

  add_not_valid_close: {
    text: "Then select the Close button.",
    help: "After saving the declined comment, close the comment maintenance window.",
    choices: [
      {
        label: "Continue",
        next: "add_not_valid_decline_request",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to decline the correction request."
      }
    ]
  },

  add_not_valid_decline_request: {
    text: "Click Declined and put the comment on F6 comments.",
    help: "Use the decline popup and reference the F6 comment.",
    note: "Decline popup comment:\n\nDECLINED — SEE F6 COMMENTS",
    image: "guides/PAUD%20Guides/cod-guide/images/11.png",
    choices: [
      {
        label: "Continue",
        action: "Decline the correction request and use: DECLINED — SEE F6 COMMENTS. Make sure the detailed declined reason is already added in F6 comments.",
        icon: "fa-solid fa-circle-check",
        desc: "Finish the Not Valid decline flow."
      }
    ]
  },

  add_pull_cbl: {
    text: "Pull the CBL up in EDM.",
    help: "Open the imaged CBL/BOL and verify the COD details before adding the request.",
    choices: [
      {
        label: "Continue",
        next: "add_locate_cod_info",
        icon: "fa-solid fa-arrow-right",
        desc: "Locate the COD information on the bill."
      }
    ]
  },

  add_locate_cod_info: {
    text: "Locate the COD information.",
    help: "Check the bill image and confirm the COD amount and required COD instructions.",
    choices: [
      {
        label: "Continue",
        next: "add_check_bol_validation",
        icon: "fa-solid fa-arrow-right",
        desc: "Validate the COD details from the BOL."
      }
    ]
  },

  add_check_bol_validation: {
    text: "Check BOL for the validation of COD.",
    help: "The correction request must provide all COD information that needs to be added to the freight bill.",
    note: "Correction request must provide all COD information required to add COD to the Freight Bill:\n\n• COD Amount\n• COD Fee Prepaid or Collect\n• Type of Funds Accepted: Certified check, company check, or cash\n• Complete Remit To Address",
    image: "guides/PAUD%20Guides/cod-guide/images/4.png",
    choices: [
      {
        label: "All information is provided",
        next: "add_add_cod_description",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with adding the COD request."
      },
      {
        label: "Information is missing",
        action: "Decline the request because all required COD information was not provided on the BOL.",
        icon: "fa-solid fa-circle-xmark",
        desc: "Decline due to missing COD information."
      }
    ]
  },

  add_add_cod_description: {
    text: "Backspace to clear the COD description box and enter the correct COD amount.",
    help: "Do not enter decimals. Example: if the COD amount is $560.00, enter it as 56000.",
    image: "guides/PAUD%20Guides/cod-guide/images/5.png",
    choices: [
      {
        label: "Continue",
        next: "add_hit_enter_amount",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to enter the COD amount."
      }
    ]
  },

  add_hit_enter_amount: {
    text: "Hit Enter and enter the amount of the COD.",
    help: "Confirm the COD amount entry before proceeding.",
    image: "guides/PAUD%20Guides/cod-guide/images/6.png",
    choices: [
      {
        label: "Continue",
        next: "add_accept_twice",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed with autorate and accept steps."
      }
    ]
  },

  add_accept_twice: {
    text: "Hit ENTER again, then AUTO RATE TWICE and ACCEPT ALL.",
    help: "All COD updates require the bill to be auto rated twice.",
    choices: [
      {
        label: "Continue",
        next: "add_scroll_corr_ecod",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the HU/Keyword line."
      }
    ]
  },

  add_scroll_corr_ecod: {
    text: "Scroll down to the last line in the HU/Keyword field and type CORR ECOD.",
    help: "Use CORR ECOD as the keyword line for this correction.",
    image: "guides/PAUD%20Guides/cod-guide/images/7.png",
    choices: [
      {
        label: "Continue",
        next: "add_accept_all_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Finish the correction."
      }
    ]
  },

  add_accept_all_final: {
    action: "Select ACCEPT ALL F6 to complete the COD addition.",
    note: "Final check: Make sure the COD amount and COD fee details are correct before completing the update.",
    image: "guides/PAUD%20Guides/cod-guide/images/8.png"
  },

  /* ================= REMOVE COD BRANCH ================= */

  remove_cod_valid: {
    text: "Is it valid for removal?",
    help: "Validate if COD can be removed based on the LOA/CBL and imaged supporting documents.",
    choices: [
      {
        label: "Continue",
        next: "remove_pull_documents",
        icon: "fa-solid fa-arrow-right",
        desc: "Pull all imaged documents for review."
      }
    ]
  },

  remove_pull_documents: {
    text: "Pull all imaged documents.",
    help: "Review the CBL/LOA and all available paperwork before removing COD.",
    choices: [
      {
        label: "Continue",
        next: "remove_confirmation_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Confirm if the corrected document supports COD removal."
      }
    ]
  },

  remove_confirmation_check: {
    text: "Does the corrected Bill of Lading or Letter of Authority confirm removal of the COD?",
    help: "We cannot update this freight bill until the corrected bill of lading or letter of authority confirms COD removal.",
    choices: [
      {
        label: "Yes, imaged and valid",
        next: "remove_valid_requirements",
        icon: "fa-solid fa-circle-check",
        desc: "The corrected BOL/LOA is imaged and confirms removal."
      },
      {
        label: "No, LOA is not imaged at time of review",
        next: "remove_no_loa_not_imaged",
        icon: "fa-solid fa-circle-xmark",
        desc: "Decline until the corrected document is imaged."
      },
      {
        label: "Letter of Authority does not state to remove COD",
        next: "remove_no_loa_not_clear",
        icon: "fa-solid fa-triangle-exclamation",
        desc: "Decline because the LOA does not clearly authorize COD removal."
      }
    ]
  },

  remove_no_loa_not_imaged: {
    text: "LOA is not imaged at the time of review.",
    help: "The correction request must be declined if the LOA/CBL authorizing COD removal is not imaged at the time of review.",
    note: "Declined comment:\n\nDECLINED — WE MUST CONFIRM BY REVIEWING THE IMAGED CBL OR LOA AUTHORIZING THE COD BE REMOVED FROM THE INVOICE BEFORE WE CAN COMPLETE THE UPDATE. PLEASE RE-ENTER REQUEST AFTER PAPERWORK IS IMAGED.",
    image: "guides/PAUD%20Guides/cod-guide/images/15.png",
    choices: [
      {
        label: "Continue",
        action: "Decline the request because the LOA/CBL authorizing COD removal is not imaged. Use the declined comment shown in the reminder.",
        icon: "fa-solid fa-circle-check",
        desc: "Finish the not-imaged decline path."
      }
    ]
  },

  remove_no_loa_not_clear: {
    text: "The Letter of Authority does not state to remove the COD.",
    help: "Decline the request if the LOA or corrected BOL does not clearly state that the COD should be removed.",
    note: "Declined comment:\n\nDECLINED — CURRENT IMAGED LETTER OF AUTHORITY / CORRECTED BILL OF LADING DOES NOT FOLLOW OUR REQUIRED GUIDELINES AND SPECIFICALLY SAY TO REMOVE THE COD. IT MUST BE VERY CLEAR THAT THEY ARE WANTING THE COD REMOVED FROM THE FREIGHT BILL.",
    choices: [
      {
        label: "Continue",
        action: "Decline the request because the imaged LOA/corrected BOL does not clearly state to remove the COD.",
        icon: "fa-solid fa-circle-check",
        desc: "Finish the unclear-LOA decline path."
      }
    ]
  },

  remove_valid_requirements: {
    text: "Verify that the COD removal requirements were met.",
    help: "Confirm both requirements before removing the COD.",
    note: "Requirements:\n1. Letter of Authority was imaged at the time of correction review.\n2. Letter of Authority specifically states that the COD is not supposed to be a COD shipment.\n\nIf valid, LOA/CBL status must be NOT a COD shipment, and the Letter of Authority must come from the shipper of the freight.",
    image: "guides/PAUD%20Guides/cod-guide/images/12.png",
    choices: [
      {
        label: "Requirements met",
        next: "remove_body_keyword_lines",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with removing the COD from the invoice."
      },
      {
        label: "Requirements not met",
        action: "Decline the request because the Letter of Authority or corrected Bill of Lading does not clearly confirm COD removal.",
        icon: "fa-solid fa-circle-xmark",
        desc: "Decline due to incomplete or invalid support."
      }
    ]
  },

  remove_body_keyword_lines: {
    text: "Go to the body of the bill in the HU/keyword lines.",
    help: "Use the HU/keyword lines to remove the COD fee from the invoice.",
    choices: [
      {
        label: "Continue",
        next: "remove_delete_cod_keywords",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to delete COD keywords."
      }
    ]
  },

  remove_delete_cod_keywords: {
    text: "Delete all COD keyword lines.",
    help: "Click each keyword line and select Delete Line to remove all COD-related keywords.",
    note: "Remove the following COD keywords if present:\n• COD\n• CCACCR\n• REM1\n• REM2\n• REM4\n• COD Fee Prepaid (CFP) or Collect (CFC)",
    image: "guides/PAUD%20Guides/cod-guide/images/13.png",
    choices: [
      {
        label: "Continue",
        next: "remove_confirm_delete_popup",
        icon: "fa-solid fa-arrow-right",
        desc: "Confirm deletion popup."
      }
    ]
  },

  remove_confirm_delete_popup: {
    text: "Confirm the remove keyword popup.",
    help: "When removing the COD amount line, a popup box appears asking you to confirm removal of the COD amount line.",
    image: "guides/PAUD%20Guides/cod-guide/images/14.png",
    choices: [
      {
        label: "Continue",
        next: "remove_fee_and_corr",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed with fee and correction line."
      }
    ]
  },

  remove_fee_and_corr: {
    text: "Add a fee correction since it was not a FedEx error.",
    help: "Enter the correction keyword and prepare the bill for autorating.",
    note: "Select the last line in HU/Keyword and type keyword CRFP.\nSelect Tab — the fee amount will be added when the pro is auto rated.\nNext line type CORR LOA.",
    choices: [
      {
        label: "Continue",
        next: "remove_final_accept",
        icon: "fa-solid fa-arrow-right",
        desc: "Complete autorate and acceptance."
      }
    ]
  },

  remove_final_accept: {
    action: "Auto rate twice, then ACCEPT ALL.",
    note: "This completes the COD removal process after all COD keywords are removed and the required correction keywords are entered."
  }

};
