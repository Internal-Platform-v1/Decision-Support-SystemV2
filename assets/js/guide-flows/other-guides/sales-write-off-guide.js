/* =========================================================
   SALES WRITE-OFF GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "sales-write-off-guide",
  title: "Sales Write-Off Guide",
  startNode: "start",
  templateCollection: "sales_write_off_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Sales Write-Off Guide",
    help: "Review Sales Write-Off requests by reading case details, validating PRO information, checking debtor eligibility, and following approval thresholds for write-off processing.",
    choices: [
      {
        label: "Continue",
        next: "sales_writeoff_reminder",
        icon: "fa-solid fa-arrow-right",
        desc: "Review case details and reminders."
      }
    ]
  },

  sales_writeoff_reminder: {
    text: "Review the case details, feed, or attachment of the reason for the write-off to make sure there is enough information to go forward.",
    help: "Read the request thoroughly before proceeding.",
    noteHtml: `<div style="margin-top:12px; padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #e2e8f0; white-space:pre-wrap;"><strong>REMINDER:</strong>
Read the request on case details, feed or attachment of the reason for the write-off to make sure there is enough information to go forward.</div>`,
    choices: [
      {
        label: "Continue",
        next: "sales_writeoff_dispute_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check if case contains multiple disputes."
      }
    ]
  },

  sales_writeoff_dispute_check: {
    text: "Does the case contain 2 different disputes for multiple PROs or a single PRO?",
    help: "Determine if the case has multiple dispute types.",
    noteHtml: `<div style="margin-top:12px; padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #e2e8f0; white-space:pre-wrap;"><strong>Sample:</strong>
PRO 1 is about ACCS and PRO 2 is about Reweigh</div>`,
    choices: [
      {
        label: "YES – Multiple disputes",
        next: "sales_writeoff_dispute_yes",
        icon: "fa-solid fa-circle-exclamation",
        desc: "Case contains 2 different disputes."
      },
      {
        label: "NO – Single dispute",
        next: "sales_writeoff_dispute_no",
        icon: "fa-solid fa-check-circle",
        desc: "Case has one dispute type."
      }
    ]
  },

  /* ===== YES – Multiple Disputes ===== */

  sales_writeoff_dispute_yes: {
    text: "Deny the case and advise the Sales Rep to file 2 separate cases since they have 2 different disputes.\n\nOR\n\nAddress the concern on the 1st PRO and deny the 2nd concern for the 2nd PRO. Advise them to submit a separate case for the 2nd PRO.",
    help: "Handle multiple disputes by either denying the entire case or addressing one PRO and denying the other.",
    choices: [
      {
        label: "Continue",
        next: "sales_writeoff_dispute_yes_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to final recommendation."
      }
    ]
  },

  sales_writeoff_dispute_yes_final: {
    text: "Once you have completed all your research and have decided to decline the write-off request. Go back to Shine case so you can update comments, close it and complete all necessary updates.",
    help: "Decline the write-off request and update the Shine case accordingly.",
    choices: []
  },

  /* ===== NO – Single Dispute ===== */

  sales_writeoff_dispute_no: {
    text: "Using the PRO number found in the description, go to the freight bill inquiry (FBI) screen. Check FBI to make sure you have a valid PRO number and no correction or write off has already been done. Make sure the item that is being requested is present on the PRO.",
    help: "Validate the PRO number and verify no correction or write-off has been completed.",
    choices: [
      {
        label: "Continue",
        next: "sales_writeoff_fee_adjustable",
        icon: "fa-solid fa-arrow-right",
        desc: "Check if the fee can be adjusted normally."
      }
    ]
  },

  sales_writeoff_fee_adjustable: {
    text: "Is the fee invalid, or would you be able to adjust the PRO through the usual process?",
    help: "Determine if the fee can be corrected through normal procedures.",
    choices: [
      {
        label: "YES – Fee can be adjusted normally",
        next: "sales_writeoff_fee_adjustable_yes",
        icon: "fa-solid fa-check-circle",
        desc: "Proceed with correction."
      },
      {
        label: "NO – Fee cannot be adjusted normally",
        next: "sales_writeoff_debtor_eligible",
        icon: "fa-solid fa-circle-xmark",
        desc: "Check debtor eligibility."
      }
    ]
  },

  sales_writeoff_fee_adjustable_yes: {
    text: "Proceed with the necessary correction and respond to the customer based on the correction that has been made.",
    help: "Apply the correction and respond to the customer.",
    choices: []
  },

  sales_writeoff_debtor_eligible: {
    text: "Is the debtor still eligible for a write-off?",
    help: "Check the accounts revenue/comment to see how many write-offs this customer has already had for this reason.",
    noteHtml: `<div style="margin-top:12px; padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #e2e8f0; white-space:pre-wrap;"><strong>ELIGIBILITY RULES:</strong>
• Max is 3 per Issue Category (Example: Liftgate dispute, Class Dispute, Weight Dispute, other accessorial)
• If customer filed a dispute for the same Issue Category but for multiple PROs that is more than 3, you can make your own decision if you will approve the write off for all pros or just limit them to 3.
• If all 3 pros or more were written off in one case, we can already deny the succeeding write off requests for the same Issue type filed on a different case.</div>`,
    choices: [
      {
        label: "YES – Eligible",
        next: "sales_writeoff_amount_check",
        icon: "fa-solid fa-check-circle",
        desc: "Check the write-off amount."
      },
      {
        label: "NO – Not eligible",
        next: "sales_writeoff_debtor_eligible_no",
        icon: "fa-solid fa-circle-xmark",
        desc: "Decline the write-off request."
      }
    ]
  },

  sales_writeoff_debtor_eligible_no: {
    text: "Review all required information thoroughly. Once you have determined that the write-off request should be declined, go back to Shine case so you can update comments, close it and complete all necessary updates.",
    help: "Decline the write-off request and update the Shine case accordingly.",
    choices: []
  },

  sales_writeoff_amount_check: {
    text: "Is the write-off request less than $500.00?",
    help: "Check the write-off amount to determine approval requirements.",
    choices: [
      {
        label: "YES – Under $500",
        next: "sales_writeoff_amount_under_500",
        icon: "fa-solid fa-check-circle",
        desc: "No supervisor approval required."
      },
      {
        label: "NO – $500 or more",
        next: "sales_writeoff_amount_between_500_2000",
        icon: "fa-solid fa-circle-xmark",
        desc: "Check if more than $500 but less than $2,000."
      }
    ]
  },

  sales_writeoff_amount_under_500: {
    text: "No supervisor approval is required. You may proceed with the decision.",
    help: "Proceed with the write-off without approval.",
    noteHtml: `<div style="margin-top:12px; padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #e2e8f0; white-space:pre-wrap;"><strong>FOLLOW PROCESSING WRITE-OFF IN CAPS:</strong>
      <a href="guides/Other%20Guides/wo-process-caps-guide/wo-process-caps-guide.html" target="_blank" style="color:#4D148C; font-weight:700; display:inline-block; margin-top:8px;">
        <i class="fa-solid fa-arrow-right"></i> Open WO Process CAPS Guide
      </a>
    </div>`,
    choices: []
  },

  sales_writeoff_amount_between_500_2000: {
    text: "Is the write-off request more than $500.00 but less than $2,000.00?",
    help: "Determine the approval tier for the write-off amount.",
    choices: [
      {
        label: "YES – Between $500 and $2,000",
        next: "sales_writeoff_amount_between_500_2000_approved",
        icon: "fa-solid fa-check-circle",
        desc: "TL approval required."
      },
      {
        label: "NO – $2,000 or more",
        next: "sales_writeoff_amount_over_2000",
        icon: "fa-solid fa-circle-xmark",
        desc: "TL and KURT approval required."
      }
    ]
  },

  sales_writeoff_amount_between_500_2000_approved: {
    text: "Send the write-off approval request to your TL via Outlook email.\n\nIf approved, proceed with the write-off.\n\nNot approved? Review all required information thoroughly. Once you have determined that the write-off request should be declined, go back to Shine case so you can update comments, close it and complete all necessary updates.",
    help: "Obtain TL approval or decline the request.",
    noteHtml: `<div style="margin-top:12px; padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #e2e8f0; white-space:pre-wrap;"><strong>FOLLOW PROCESSING WRITE-OFF IN CAPS:</strong>
      <a href="guides/Other%20Guides/wo-process-caps-guide/wo-process-caps-guide.html" target="_blank" style="color:#4D148C; font-weight:700; display:inline-block; margin-top:8px;">
        <i class="fa-solid fa-arrow-right"></i> Open WO Process CAPS Guide
      </a>
    </div>`,
    choices: []
  },

  sales_writeoff_amount_over_2000: {
    text: "If the write-off request is more than $2,000, send the write-off approval request to your TL via Outlook email for submission to KURT.\n\nIf approved, proceed with the write-off.\n\nNot approved? Review all required information thoroughly. Once you have determined that the write-off request should be declined, go back to Shine case so you can update comments, close it and complete all necessary updates.",
    help: "Obtain TL and KURT approval or decline the request.",
    noteHtml: `<div style="margin-top:12px; padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #e2e8f0; white-space:pre-wrap;"><strong>FOLLOW PROCESSING WRITE-OFF IN CAPS:</strong>
      <a href="guides/Other%20Guides/wo-process-caps-guide/wo-process-caps-guide.html" target="_blank" style="color:#4D148C; font-weight:700; display:inline-block; margin-top:8px;">
        <i class="fa-solid fa-arrow-right"></i> Open WO Process CAPS Guide
      </a>
    </div>`,
    choices: []
  }

};
