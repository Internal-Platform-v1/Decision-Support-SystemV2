/* =========================================================
   CRAU — REQUEST DECISION GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "crau-guide",
  title: "CRAU — Request Decision Guide",
  startNode: "start",
  templateCollection: "crau_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "CRAU — Request Decision Guide",
    help: "Use this guide to handle CRAU requests involving redelivery removal, debtor changes, account updates, term changes, and reconsignment.",
    note: "Always review the FBC request, BOL, LOA, and any imaged documents before processing.",
    choices: [
      {
        label: "Continue",
        next: "crau_intro",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the CRAU decision guide."
      }
    ]
  },

  crau_intro: {
    text: "What is the Request in FBC?",
    help: "Select the category that matches the customer request for Driver's Collect (CRA U) dispute.",
    choices: [
      {
        label: "REMOVE REDELIVERY/ACCESSORIAL CHARGES",
        next: "crau_remove_redelivery",
        icon: "fa-solid fa-trash-can",
        desc: "Request to remove redelivery or accessorial fees."
      },
      {
        label: "Change of Debtor of Redelivery",
        next: "crau_change_debtor_redelivery",
        icon: "fa-solid fa-arrows-spin",
        desc: "Change debtor for redelivery charges (REDC to REDP)."
      },
      {
        label: "REQUEST TO UPDATE CONSIGNEE ACCOUNT/BILLING ACCOUNT CODE",
        next: "crau_update_account",
        icon: "fa-solid fa-address-card",
        desc: "Update consignee or billing account code."
      },
      {
        label: "REQUEST TO CHANGE TERMS",
        next: "crau_change_terms",
        icon: "fa-solid fa-file-invoice",
        desc: "Change terms prepaid/collect."
      },
      {
        label: "RECONSIGNMENT",
        next: "crau_reconsignment",
        icon: "fa-solid fa-truck-ramp-box",
        desc: "Handle reconsignment requests for CRA U."
      }
    ]
  },

  /* ================= OPTION 1 — REMOVE REDELIVERY / ACCESSORIAL ================= */

  crau_remove_redelivery: {
    text: "What is the actual Request?",
    help: "Choose the specific reason for removal of redelivery/accessorial charges.",
    choices: [
      {
        label: "999 Account / Redelivery performed due to No Appointment",
        next: "opt1_999_validation",
        icon: "fa-solid fa-ban",
        desc: "999 account – appointment required."
      },
      {
        label: "Request to remove the Redelivery fee for Courtesy Credit",
        next: "opt1_courtesy",
        icon: "fa-solid fa-hand-holding-heart",
        desc: "Courtesy credit removal."
      },
      {
        label: "Request to remove redelivery fee because it is for DOCK PICK UP",
        next: "opt1_dock_validation",
        icon: "fa-solid fa-warehouse",
        desc: "Dock pickup validation."
      },
      {
        label: "Request to remove redelivery fee because it is Reconsignment",
        next: "opt1_recons_validation",
        icon: "fa-solid fa-arrow-right-arrow-left",
        desc: "Reconsignment related."
      },
      {
        label: "Request to remove the redelivery fee because Shipment delivered during Holiday",
        next: "opt1_holiday_validation",
        icon: "fa-solid fa-calendar-day",
        desc: "Holiday delivery."
      },
      {
        label: "Request to remove redelivery fee because Driver Arrived Late",
        next: "opt1_driver_validation",
        icon: "fa-solid fa-clock",
        desc: "Driver arrived late."
      }
    ]
  },

  opt1_999_validation: {
    text: "Is there any instruction on BOL or Active Consignee Account that states they require an Appointment?",
    help: "Check BOL and account profile for appointment requirements.",
    choices: [
      {
        label: "Yes – Appointment required",
        next: "opt1_999_yes",
        icon: "fa-solid fa-check-circle",
        desc: "Appointment instruction exists."
      },
      {
        label: "No – No instruction",
        next: "opt1_999_no",
        icon: "fa-solid fa-times-circle",
        desc: "No appointment instruction."
      }
    ]
  },

  opt1_999_yes: {
    text: "Resolution: Remove redelivery fee since BOL/Account requires appointment. Correction Code: OPSD → Accept All.",
    help: "Final action.",
    choices: []
  },

  opt1_999_no: {
    text: "Resolution: Fee is VALID. Declined – Valid fee for redelivery appointment provided per BOL/Billing Mask. Correction Code: CUSI → Partial Approval.",
    help: "Final action.",
    choices: []
  },

  opt1_courtesy: {
    text: "Resolution: We cannot remove any courtesy credit. All courtesy removals must be removed through write-off process. Remove CHGC. Correction Code: CUSI → Partial Approval.",
    help: "Final action.",
    choices: []
  },

  opt1_dock_validation: {
    text: "Validation Process: Is there a Dock Pick Up document imaged proving shipment was picked up at the dock?",
    help: "Look for DPU documentation.",
    choices: [
      {
        label: "Yes – Document available",
        next: "opt1_dock_yes",
        icon: "fa-solid fa-check-circle",
        desc: "Document exists."
      },
      {
        label: "No – No proof",
        next: "opt1_dock_no",
        icon: "fa-solid fa-times-circle",
        desc: "No supporting doc."
      }
    ]
  },

  opt1_dock_yes: {
    text: "Resolution: Remove fee if comment/BOL shows DPU. Correction Code: NACC and Add DPU → Accept All.",
    help: "Final action.",
    choices: []
  },

  opt1_dock_no: {
    text: "Resolution: Redelivery fee is VALID – No supporting document for removal. Remove CHGC. Correction Code: CUSI → Partial Approval.",
    help: "Final action.",
    choices: []
  },

  opt1_recons_validation: {
    text: "Validation Process: Is there any comments or information if LOA covers removal of redelivery?",
    help: "Check for LOA or comments.",
    choices: [
      {
        label: "Yes – Valid info",
        next: "opt1_recons_yes",
        icon: "fa-solid fa-check-circle",
        desc: "Valid info found."
      },
      {
        label: "No – No valid info",
        next: "opt1_recons_no",
        icon: "fa-solid fa-times-circle",
        desc: "No info."
      }
    ]
  },

  opt1_recons_yes: {
    text: "Resolution: Remove the fee if comments justify reconsignment removal. Correction Code: NACC → Accept All.",
    help: "Final action.",
    choices: []
  },

  opt1_recons_no: {
    text: "Resolution: No supporting documents for removal. Remove CHGC. Correction Code: CUSI → Partial Approval.",
    help: "Final action.",
    choices: []
  },

  opt1_holiday_validation: {
    text: "Validation Process: Are the dates of Holiday and initial delivery the same?",
    help: "Check if delivery fell on a national holiday.",
    choices: [
      {
        label: "Yes – Confirmed National Holiday",
        next: "opt1_holiday_yes",
        icon: "fa-solid fa-check-circle",
        desc: "Holiday confirmed."
      },
      {
        label: "No – Not a confirmed holiday",
        next: "opt1_holiday_no",
        icon: "fa-solid fa-times-circle",
        desc: "Not a holiday."
      }
    ]
  },

  opt1_holiday_yes: {
    text: "Resolution: If initial delivery date falls on confirmed National Holiday, remove the fee. Correction Code: OPSD → Accept All.",
    help: "Final action.",
    choices: []
  },

  opt1_holiday_no: {
    text: "Resolution: Not a holiday observed by FedEx. Remove CHGC. Correction Code: CUSI → Partial Approval.",
    help: "Final action.",
    choices: []
  },

  opt1_driver_validation: {
    text: "Validation Process: Does arrival time not match closing time in ACOOPS?",
    help: "Verify time conflict in ACOOPS.",
    choices: [
      {
        label: "Yes – Time conflict exists",
        next: "opt1_driver_yes",
        icon: "fa-solid fa-check-circle",
        desc: "Conflict exists."
      },
      {
        label: "No – No conflict",
        next: "opt1_driver_no",
        icon: "fa-solid fa-times-circle",
        desc: "No conflict."
      }
    ]
  },

  opt1_driver_yes: {
    text: "Resolution: If receiving/appointment comments confirm time issue, remove the fee. Correction Code: OPSD → Accept All.",
    help: "Final action.",
    choices: []
  },

  opt1_driver_no: {
    text: "Resolution: No time conflict in receiving/appointment comments. Leave denial comment. Remove CHGC. Correction Code: CUSI → Partial Approval.",
    help: "Final action.",
    choices: []
  },

  /* ================= OPTION 2 — CHANGE DEBTOR OF REDELIVERY ================= */

  crau_change_debtor_redelivery: {
    text: "What is the actual Request?",
    help: "Select the basis for debtor change.",
    choices: [
      {
        label: "Correction is to change REDC to REDP per BOL",
        next: "crau_redc_to_redp_bol_validation",
        icon: "fa-solid fa-file-lines",
        desc: "Change based on BOL."
      },
      {
        label: "Correction is to change REDC to REDP per LOA",
        next: "crau_redc_to_redp_loa_validation",
        icon: "fa-solid fa-file-signature",
        desc: "Change based on LOA."
      }
    ]
  },

  crau_redc_to_redp_bol_validation: {
    text: "Validation Process: Check the BOL and DR if redelivery fee is prepaid or collect.",
    help: "Verify prepaid/collect indicator.",
    choices: [
      {
        label: "No – No clear request for change",
        next: "crau_redc_bol_no",
        icon: "fa-solid fa-times-circle",
        desc: "No clarity."
      },
      {
        label: "Yes – Fee is prepaid",
        next: "crau_redc_bol_yes",
        icon: "fa-solid fa-check-circle",
        desc: "Prepaid fee."
      }
    ]
  },

  crau_redc_bol_no: {
    text: "Resolution: Declined – No valid information. Remove CHGC. Correction Code: CUSI. Partial Approval.",
    help: "Final action.",
    choices: []
  },

  crau_redc_bol_yes: {
    text: "Resolution: Change redelivery fee to prepaid. Correction Code: EACC → Accept All.",
    help: "Final action.",
    choices: []
  },

  crau_redc_to_redp_loa_validation: {
    text: "Validation Process: Check comment section if LOA information is provided and imaged.",
    help: "Look for LOA details.",
    choices: [
      {
        label: "No – No LOA imaged or information",
        next: "crau_redc_loa_no",
        icon: "fa-solid fa-times-circle",
        desc: "No LOA."
      },
      {
        label: "Yes – LOA is valid",
        next: "crau_redc_loa_yes",
        icon: "fa-solid fa-check-circle",
        desc: "LOA valid."
      }
    ]
  },

  crau_redc_loa_no: {
    text: "Resolution: No LOA imaged or information. Declined. Remove CHGC. Correction Code: CUSI. Partial Approval.",
    help: "Final action.",
    choices: []
  },

  crau_redc_loa_yes: {
    text: "Resolution: Change redelivery fee per LOA. Correction Code: LOA → Accept All.",
    help: "Final action.",
    choices: []
  },

  /* ================= OPTION 3 — UPDATE CONSIGNEE / BILLING ACCOUNT ================= */

  crau_update_account: {
    text: "What is the actual request?",
    help: "Select the account update scenario.",
    choices: [
      {
        label: "Correction Change Consignee account PER LOA",
        next: "opt3_cons_loa_validation",
        icon: "fa-solid fa-file-signature",
        desc: "Consignee change per LOA."
      },
      {
        label: "Correction Change Billing Account PER LOA",
        next: "opt3_bill_loa_validation",
        icon: "fa-solid fa-file-signature",
        desc: "Billing account per LOA."
      },
      {
        label: "Correction Change Consignee account PER BOL",
        next: "opt3_cons_bol_validation",
        icon: "fa-solid fa-file-lines",
        desc: "Consignee per BOL."
      },
      {
        label: "Correction Change Billing Account PER BOL",
        next: "opt3_bill_bol_validation",
        icon: "fa-solid fa-file-lines",
        desc: "Billing per BOL."
      },
      {
        label: "Correction request trying to use a DO NOT USE CODE for prepaid",
        next: "opt3_dnu_prepaid_validation",
        icon: "fa-solid fa-ban",
        desc: "DNU code for prepaid."
      },
      {
        label: "Correction request trying to use a DO NOT USE CODE for consignee",
        next: "opt3_dnu_consignee_validation",
        icon: "fa-solid fa-ban",
        desc: "DNU code for consignee."
      }
    ]
  },

  opt3_cons_loa_validation: {
    text: "Validation: Is there any LOA information provided in the request, comments or LOA imaged?",
    choices: [
      {
        label: "Yes – LOA valid",
        next: "opt3_cons_loa_yes"
      },
      {
        label: "No – No LOA info",
        next: "opt3_cons_loa_no"
      }
    ]
  },

  opt3_cons_loa_yes: {
    text: "Resolution: Change account if LOA information is in comments or LOA imaged. Correction Code: LOA (put CBLP/CBLC) → Accept All.",
    choices: []
  },

  opt3_cons_loa_no: {
    text: "Resolution: Declined – No LOA information on file or comment section. Correction Code: CUSI → Partial Approval.",
    choices: []
  },

  opt3_bill_loa_validation: {
    text: "Validation: Is there any LOA information provided in the request, comments or LOA imaged?",
    choices: [
      {
        label: "Yes – LOA valid",
        next: "opt3_bill_loa_yes"
      },
      {
        label: "No – No LOA info",
        next: "opt3_bill_loa_no"
      }
    ]
  },

  opt3_bill_loa_yes: {
    text: "Resolution: Change billing account if LOA information is in comments or LOA imaged. Correction Code: LOA (put CBLP/CBLC) → Accept All.",
    choices: []
  },

  opt3_bill_loa_no: {
    text: "Resolution: Declined – No LOA information on file or comment section. Correction Code: CUSI → Partial Approval.",
    choices: []
  },

  opt3_cons_bol_validation: {
    text: "Validation: Does the request account consignee code match the BOL?",
    choices: [
      {
        label: "Yes – Matches BOL",
        next: "opt3_cons_bol_yes"
      },
      {
        label: "No – Not same address per BOL",
        next: "opt3_cons_bol_no"
      }
    ]
  },

  opt3_cons_bol_yes: {
    text: "Resolution: Proceed on changing the account number if it is the same address per BOL. Correction Code: CADR (put DNP) → Accept All.",
    choices: []
  },

  opt3_cons_bol_no: {
    text: "Resolution: Declined changing the account number if not same address per BOL. Remove CHGC. Correction Code: CUSI → Partial Approval.",
    choices: []
  },

  opt3_bill_bol_validation: {
    text: "Validation: Does the request account billing code match the BOL?",
    choices: [
      {
        label: "Yes – Matches BOL",
        next: "opt3_bill_bol_yes"
      },
      {
        label: "No – Same consignee address",
        next: "opt3_bill_bol_no"
      }
    ]
  },

  opt3_bill_bol_yes: {
    text: "Resolution: Proceed on changing the account number if it is the same address per BOL. Correction Code: CUSI → Accept All.",
    choices: []
  },

  opt3_bill_bol_no: {
    text: "Resolution: Declined – Consignee account request same billing address as current consignee. Remove CHGC. Correction Code: CUSI → Partial Approval.",
    choices: []
  },

  opt3_dnu_prepaid_validation: {
    text: "Validation: Is the account provided flagged as DNU in customer profile or FBC?",
    choices: [
      {
        label: "Yes – Flagged DNU",
        next: "opt3_dnu_prepaid_yes"
      },
      {
        label: "No – Not flagged",
        next: "opt3_dnu_prepaid_no"
      }
    ]
  },

  opt3_dnu_prepaid_yes: {
    text: "Resolution: If you see other account on AEM, change to that code. Correction Code: CUSI → Accept All.",
    choices: []
  },

  opt3_dnu_prepaid_no: {
    text: "Resolution: Declined request if flagged DO NOT USE and no other account found on AEM. Remove CHGC. Correction Code: CUSI → Partial Approval.",
    choices: []
  },

  opt3_dnu_consignee_validation: {
    text: "Validation: Is the account provided flagged as DNU in customer profile or FBC?",
    choices: [
      {
        label: "Yes – Flagged DNU",
        next: "opt3_dnu_cons_yes"
      },
      {
        label: "No – Not flagged",
        next: "opt3_dnu_cons_no"
      }
    ]
  },

  opt3_dnu_cons_yes: {
    text: "Resolution: If you see other account on AEM, change to that code. Correction Code: CADR (put DNP then your RACF ID) → Accept All.",
    choices: []
  },

  opt3_dnu_cons_no: {
    text: "Resolution: Declined request if flagged DO NOT USE and no other account found on AEM. Remove CHGC. Correction Code: CUSI → Partial Approval.",
    choices: []
  },

  /* ================= OPTION 4 — CHANGE TERMS ================= */

  crau_change_terms: {
    text: "What is the actual request?",
    choices: [
      {
        label: "Correction is to change TERMS prepaid per BOL",
        next: "opt4_prepaid_bol_validation"
      },
      {
        label: "Correction is to change TERMS collect per BOL",
        next: "opt4_collect_bol_validation"
      },
      {
        label: "Correction is to change TERMS prepaid per LOA",
        next: "opt4_prepaid_loa_validation"
      },
      {
        label: "Correction is to change TERMS collect per LOA",
        next: "opt4_collect_loa_validation"
      }
    ]
  },

  opt4_prepaid_bol_validation: {
    text: "Validation Process: Does the terms per BOL show PREPAID?",
    choices: [
      {
        label: "Yes – Marked PREPAID",
        next: "opt4_prepaid_bol_yes"
      },
      {
        label: "No – Not marked PREPAID",
        next: "opt4_prepaid_bol_no"
      }
    ]
  },

  opt4_prepaid_bol_yes: {
    text: "Resolution: Proceed on changing the terms to PREPAID per BOL. Correction Code: ETMS → Accept All.",
    choices: []
  },

  opt4_prepaid_bol_no: {
    text: "Resolution: Declined – Not marked PREPAID per BOL. Remove CHGC. Correction Code: CUSI → Partial Approval.",
    choices: []
  },

  opt4_collect_bol_validation: {
    text: "Validation Process: Does the terms per BOL show COLLECT?",
    choices: [
      {
        label: "Yes – Marked COLLECT",
        next: "opt4_collect_bol_yes"
      },
      {
        label: "No – Not marked COLLECT",
        next: "opt4_collect_bol_no"
      }
    ]
  },

  opt4_collect_bol_yes: {
    text: "Resolution: Proceed on changing the terms to COLLECT per BOL. Correction Code: ETMS → Accept All.",
    choices: []
  },

  opt4_collect_bol_no: {
    text: "Resolution: Declined – Not marked COLLECT per BOL. Remove CHGC. Correction Code: CUSI → Partial Approval.",
    choices: []
  },

  opt4_prepaid_loa_validation: {
    text: "Validation Process: Is there any LOA imaged or LOA information provided?",
    choices: [
      {
        label: "Yes – LOA valid",
        next: "opt4_prepaid_loa_yes"
      },
      {
        label: "No – No LOA info",
        next: "opt4_prepaid_loa_no"
      }
    ]
  },

  opt4_prepaid_loa_yes: {
    text: "Resolution: Proceed on changing the terms if LOA is imaged or information provided. Correction Code: LOA (put CBLP/CBLC) → Accept All.",
    choices: []
  },

  opt4_prepaid_loa_no: {
    text: "Resolution: Declined – No LOA imaged or information provided. Remove CHGC. Correction Code: CUSI → Partial Approval.",
    choices: []
  },

  opt4_collect_loa_validation: {
    text: "Validation Process: Is there any LOA imaged or LOA information provided?",
    choices: [
      {
        label: "Yes – LOA valid",
        next: "opt4_collect_loa_yes"
      },
      {
        label: "No – No LOA info",
        next: "opt4_collect_loa_no"
      }
    ]
  },

  opt4_collect_loa_yes: {
    text: "Resolution: Proceed on changing the terms if LOA is imaged or information provided. Correction Code: LOA (put CBLP/CBLC) → Accept All.",
    choices: []
  },

  opt4_collect_loa_no: {
    text: "Resolution: Declined – No LOA imaged or information provided. Remove CHGC. Correction Code: CUSI → Partial Approval.",
    choices: []
  },

  /* ================= OPTION 5 — RECONSIGNMENT ================= */

  crau_reconsignment: {
    text: "What is the actual request?",
    choices: [
      {
        label: "Prepaid Reconsignment only for CRAU",
        next: "opt5_recon_validation"
      }
    ]
  },

  opt5_recon_validation: {
    text: "Validation Process: Pull PRO in Freight Bill Inquiry. Find NEWP PRO in signature field. Check if it matches both PRO OLDP and NEWP. Does the weight and pieces match?",
    choices: [
      {
        label: "Yes – NEWP valid and matches",
        next: "opt5_recon_yes"
      },
      {
        label: "No – No valid NEWP / mismatch",
        next: "opt5_recon_no"
      }
    ]
  },

  opt5_recon_yes: {
    text: "Resolution: Remove all accessorial charges. Put NEWP on the body of the bill. Correction Code: RECE → Accept All.",
    choices: []
  },

  opt5_recon_no: {
    text: "Validation Process: Is there any signed DR on FBI or NEWP in comment section?",
    choices: [
      {
        label: "No signed DR / No NEWP",
        next: "opt5_recon_decline"
      }
    ]
  },

  opt5_recon_decline: {
    text: "Resolution: Declined the request. NO NEWP. Remove CHGC. Correction Code: CUSI → Partial Approval.",
    choices: []
  }

};
