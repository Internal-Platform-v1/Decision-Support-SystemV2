/* =========================================================
   SORT & SEGREGATE GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "sort-and-segregate-guide",
  title: "Sort & Segregate Guide",
  startNode: "start",
  templateCollection: "sort_and_segregate_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Sort and Segregate Dispute",
    help: "Start by checking if sort and segregate is noted or requested on the BOL.",
    choices: [
      {
        label: "Continue",
        next: "bol_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Begin validation."
      }
    ]
  },

  bol_check: {
    text: "Is sort and seg noted or requested on BOL?",
    choices: [
      {
        label: "Yes",
        next: "bol_keyword_ssgo_check",
        icon: "fa-solid fa-circle-check",
        desc: "Sort and segregate is noted or requested on the BOL."
      },
      {
        label: "No",
        next: "dr_marked_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "No sort and segregate instruction is noted on the BOL."
      }
    ]
  },

  bol_keyword_ssgo_check: {
    text: "Is the keyword is SSGO?",
    choices: [
      {
        label: "Yes",
        action: "Advise customer that sort and seg is valid as requested on BOL",
        icon: "fa-solid fa-circle-check",
        desc: "The keyword is already SSGO."
      },
      {
        label: "No",
        action: "If disputing keyword is SSGD, SSGP or SSGC, update it to SSGO and advise the customer that fee were rebilled to the correct debtor per BOL. CORR EACC must be use.",
        icon: "fa-solid fa-circle-xmark",
        desc: "Update the keyword to SSGO and rebill to the correct debtor per BOL."
      }
    ]
  },

  dr_marked_check: {
    text: "Is the sort and seg marked and signed on DR?",
    choices: [
      {
        label: "Yes",
        next: "dr_keyword_ssgd_or_ssgc",
        icon: "fa-solid fa-circle-check",
        desc: "Sort and segregate is marked and signed on the DR."
      },
      {
        label: "No, It was marked but not sign",
        next: "unsigned_dr_dispute_check",
        icon: "fa-solid fa-file-circle-question",
        desc: "It was marked but not signed on the DR."
      }
    ]
  },

  unsigned_dr_dispute_check: {
    text: "Unsigned DR",
    help: "Use this path when sort and segregate was marked but not signed on the DR.",
    choices: [
      {
        label: "Dispute is rebill per LOA",
        action: "If the dispute is rebill per LOA, Please proceed.",
        icon: "fa-solid fa-file-signature",
        desc: "Proceed if the dispute is supported by LOA."
      },
      {
        label: "Consignee disputes prepaid/3PL billing",
        action: "If the disputing party is the consignee and stating that fee must be bill to prepaid/3PL, Please advise customer the fee is billing correctly to consignee per DR and LOA is needed from acceptance party.",
        icon: "fa-solid fa-building-user",
        desc: "Fee is billing correctly to consignee per DR."
      },
      {
        label: "Dispute is validity of the surcharge",
        action: "If the dispute is validity of the surcharge, Remove the fee and use CORR NACC",
        icon: "fa-solid fa-circle-xmark",
        desc: "Remove the fee using NACC."
      }
    ]
  },

  dr_keyword_ssgd_or_ssgc: {
    text: "Is the key word for sort and seg fee is SSGD or SSGC?",
    choices: [
      {
        label: "Yes",
        action: "Advise customer that fee is valid per DR.",
        icon: "fa-solid fa-circle-check",
        desc: "The DR supports the current keyword."
      },
      {
        label: "No, Its SSGP",
        next: "shipper_billing_mask_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "The keyword is SSGP."
      }
    ]
  },

  shipper_billing_mask_check: {
    text: "Check the billing mask of the shipper's",
    help: "Review the shipper billing mask before deciding whether the current keyword is valid.",
    choices: [
      {
        label: "Continue",
        next: "shipper_comment_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to billing mask validation."
      }
    ]
  },

  shipper_comment_check: {
    text: "Is there a comment stated \"all accessorial or specifically for sort and seg must be bill to their account/shipper?\"",
    choices: [
      {
        label: "Yes",
        action: "Advised customer that fee is valid per DR and billing correctly to PREPAID per shipper billing mask",
        icon: "fa-solid fa-circle-check",
        desc: "Billing mask supports prepaid billing to the shipper."
      },
      {
        label: "No",
        action: "Change SSGP to SSGC per DR. CORR EACC must be use.",
        icon: "fa-solid fa-circle-xmark",
        desc: "Update the keyword to SSGC and use EACC."
      }
    ]
  },

  reopened_case_review: {
    text: "Reopened Case Review",
    help: "Use this when the case was reopened and the customer insists that sort and seg was not performed.",
    choices: [
      {
        label: "Continue",
        action: "If the case reopened and customer is insisted that sort and seg wasnt performed. Send an email to the service center to do a further review.",
        icon: "fa-solid fa-envelope",
        desc: "Request further review from the service center."
      }
    ]
  }

};
