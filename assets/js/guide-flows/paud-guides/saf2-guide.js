/* =========================================================
   SAF2 GUIDE – NMFC, REWEIGH & WEIGHT VALIDATION — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "saf2-guide",
  title: "SAF2 Guide – NMFC, Reweigh & Weight Validation",
  startNode: "start",
  templateCollection: "saf2_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "SAF2 Guide",
    help: "Use this guide to review Airgas and Harte Hanks bills for correct NMFC application, pallet weight, and tare weight validation.",
    choices: [
      {
        label: "Continue",
        next: "saf2_intro",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the SAF2 review process."
      }
    ]
  },

  saf2_intro: {
    text: "Overview & Reminders",
    help: "",
    noteHtml: `<div style="margin-bottom:14px;"><div style="font-weight:800; font-size:13px; color:#475569; margin-bottom:10px;">⚠ REMINDERS</div><ul style="margin:0; padding-left:18px;"><li>PAUD SAF2 is an audit trap queue to review bills for customer Airgas for the correct NMFC application and pallet weight/tare weight.</li><li>The agent will be reviewing the bills of lading to match the bill to the item shipped as Airgas has NMFC specific pricing in their agreement.</li><li>PAUD SAF2 will contain bills for Harte Hanks and Airgas.</li><li>Agent will need to sort the queue by clicking the SORT tab and choosing REQUESTS and DEBTOR/SHIPPER SORT. This will sort the queue alphabetically by the Debtor name.</li></ul></div><div style="margin-top:16px;"><div style="font-weight:800; font-size:13px; margin-bottom:10px;">📌 NOTE</div><p>Always verify the reweigh certificate and the BOL match the bill details before proceeding with any corrections.</p></div>`,
    choices: [
      {
        label: "Continue",
        next: "open_first_pro",
        icon: "fa-solid fa-arrow-right",
        desc: "Open the first pro in the SAF2 queue."
      }
    ]
  },

  open_first_pro: {
    text: "Open the first pro on the SAF2 Queue.",
    help: "Select the first available pro after sorting the queue.",
    image: "guides/PAUD%20Guides/saf2-guide/images/saf2-image1.png",
    choices: [
      {
        label: "Continue",
        next: "review_request",
        icon: "fa-solid fa-arrow-right",
        desc: "Review the pre-populated request."
      }
    ]
  },

  review_request: {
    text: "The pre-populated request will already be in the description box.",
    help: "Review the request details before validating the documentation.",
    image: "guides/PAUD%20Guides/saf2-guide/images/saf2-image2.png",
    choices: [
      {
        label: "Continue",
        next: "rewe_keyword_question",
        icon: "fa-solid fa-arrow-right",
        desc: "Check for REWE keyword."
      }
    ]
  },

  /* --- REWE keyword question --- */

  rewe_keyword_question: {
    text: "Is there a REWE keyword on the body of FBC?",
    help: "Select the appropriate option based on the presence of REWE and reweigh certificate.",
    choices: [
      {
        label: "Yes, BUT UNDELIVERED OR BOL NOT IMAGED, OR REWE CERT NOT ON IMAGE",
        next: "rewe_yes_undelivered",
        icon: "fa-solid fa-circle-exclamation",
        desc: "No BOL/REWE imaged or undelivered."
      },
      {
        label: "YES. with reweight certificate",
        next: "rewe_yes_with_cert",
        icon: "fa-solid fa-check-circle",
        desc: "REWE present and reweigh certificate available."
      },
      {
        label: "No. But there is a reweight certificate",
        next: "rewe_no_but_cert",
        icon: "fa-solid fa-file-lines",
        desc: "No REWE but reweigh certificate exists."
      },
      {
        label: "No and No reweight certificate.",
        next: "rewe_no_no_cert",
        icon: "fa-solid fa-file-circle-xmark",
        desc: "No REWE and no reweigh certificate."
      },
      {
        label: "Yes but getting 50 Lines Error",
        next: "fifty_lines_error",
        icon: "fa-solid fa-triangle-exclamation",
        desc: "REWE present but 50+ line error."
      }
    ]
  },

  /* --- Option 1: Undelivered / No BOL --- */

  rewe_yes_undelivered: {
    text: "Move on to another pro since there's no BOL/REWE imaged or still undelivered. This is the usual step however you may save the pro number on your tracker and check the pro for 3 days if it's already delivered; if not, proceed on sending an email to Ms. Tin to proceed on sending it to our client.",
    help: "No further action on this pro at this time.",
    choices: []
  },

  /* --- Option 2: YES with reweigh certificate --- */

  rewe_yes_with_cert: {
    text: "Is NMFC matching the BOL?",
    help: "Verify the NMFC on the bill against the Bill of Lading.",
    choices: [
      {
        label: "Yes",
        next: "rewe_yes_cert_plwt",
        icon: "fa-solid fa-check",
        desc: "NMFC matches."
      },
      {
        label: "No",
        next: "rewe_yes_cert_update_nmfc",
        icon: "fa-solid fa-pen",
        desc: "NMFC needs correction."
      }
    ]
  },

  rewe_yes_cert_update_nmfc: {
    text: "Update the NMFC matching NMFC per BOL.",
    help: "Correct the NMFC to match the BOL.",
    choices: [
      {
        label: "Continue",
        next: "rewe_yes_cert_plwt",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to PLWT check."
      }
    ]
  },

  rewe_yes_cert_plwt: {
    text: "Is there a PLWT keyword on the body of the bill?",
    help: "Check for the PLWT (pallet weight) keyword.",
    choices: [
      {
        label: "Yes",
        next: "rewe_yes_cert_pallet_match",
        icon: "fa-solid fa-check",
        desc: "PLWT present."
      },
      {
        label: "No",
        next: "rewe_yes_cert_add_plwt",
        icon: "fa-solid fa-plus",
        desc: "PLWT missing – add it."
      }
    ]
  },

  rewe_yes_cert_add_plwt: {
    text: "Add PLWT keyword on the FBC and the correct pallet weight per BOL.",
    note: "Pallet Weight in the body of the bill should have the correct weight. TARE WEIGHT 0*40 = 0 - system will automatically enter 50 lbs/skid. If 1 skid, will update to 50 lbs. If 2 skids, 100 lbs, etc.\nb. TARE WEIGHT 1*40 = 40 - ensure that correct weight per skid is updated. If 1 skid, then should be 40 lbs. If 2 skids, 80 lbs, etc.",
    help: "Add PLWT with the correct pallet weight based on tare weight indicator.",
    choices: [
      {
        label: "Continue",
        next: "rewe_yes_cert_total",
        icon: "fa-solid fa-arrow-right",
        desc: "Validate pallet weight."
      }
    ]
  },

  rewe_yes_cert_pallet_match: {
    text: "Validate the pallet weight if it matches the pallet weight per BOL. Does it match?",
    help: "Compare the PLWT weight on the bill with the BOL.",
    choices: [
      {
        label: "Yes",
        next: "rewe_yes_cert_total",
        icon: "fa-solid fa-check",
        desc: "Pallet weight matches."
      },
      {
        label: "No",
        next: "rewe_yes_cert_update_pallet",
        icon: "fa-solid fa-pen",
        desc: "Update pallet weight."
      }
    ]
  },

  rewe_yes_cert_update_pallet: {
    text: "Update the pallet weight to match per BOL.",
    note: "Pallet Weight in the body of the bill should have the correct weight. TARE WEIGHT 0*40 = 0 - system will automatically enter 50 lbs/skid. If 1 skid, will update to 50 lbs. If 2 skids, 100 lbs, etc.\nb. TARE WEIGHT 1*40 = 40 - ensure that correct weight per skid is updated. If 1 skid, then should be 40 lbs. If 2 skids, 80 lbs, etc.",
    help: "Correct the pallet weight based on tare weight indicator.",
    choices: [
      {
        label: "Continue",
        next: "rewe_yes_cert_total",
        icon: "fa-solid fa-arrow-right",
        desc: "Check total weight."
      }
    ]
  },

  rewe_yes_cert_total: {
    text: "Does the total actual verified weight on the reweigh certificate match the total weight per FBC?",
    help: "Verify total weight against the reweigh certificate.",
    choices: [
      {
        label: "Yes",
        next: "rewe_yes_cert_total_yes",
        icon: "fa-solid fa-check-circle",
        desc: "Weights match – use VRFY."
      },
      {
        label: "No",
        next: "rewe_yes_cert_total_no",
        icon: "fa-solid fa-arrow-right",
        desc: "Weights differ – adjust."
      }
    ]
  },

  rewe_yes_cert_total_yes: {
    text: "If After Review of BOL, if there are NO CHANGES:\nEnter Correction Comment: VS-SAF2-AUDT - NACA RELEASING PRO FROM SAF2 QUEUE 3\nEnter Keyword CORR\nEnter Description VRFY\nClick Accept All - F6\nMove to Next Pro to Work",
    help: "Final action – use VRFY and accept all.",
    choices: []
  },

  rewe_yes_cert_total_no: {
    text: "MOVE OR DEDUCT THE EXTRA WEIGHT TO PRODUCT WEIGHT, FOR REWEIGHED SHIPMENTS.\n\nOnce auto-rated, make sure the total weight matches the weight amount on the reweigh certificate.\n\nCorrection code CORR EWPD (only if the billing was not correct from the beginning).\nOtherwise, agent will use CORR CUSI and Accept All F6 to post.",
    help: "Adjust product weight to match reweigh certificate, then use appropriate correction code.",
    choices: []
  },

  /* --- Option 3: No, but there is a reweigh certificate --- */

  rewe_no_but_cert: {
    text: "Is NMFC matching the BOL?",
    help: "Verify the NMFC on the bill against the Bill of Lading.",
    choices: [
      {
        label: "Yes",
        next: "rewe_no_cert_plwt",
        icon: "fa-solid fa-check",
        desc: "NMFC matches."
      },
      {
        label: "No",
        next: "rewe_no_cert_update_nmfc",
        icon: "fa-solid fa-pen",
        desc: "NMFC needs correction."
      }
    ]
  },

  rewe_no_cert_update_nmfc: {
    text: "Update the NMFC matching NMFC per BOL.",
    help: "Correct the NMFC to match the BOL.",
    choices: [
      {
        label: "Continue",
        next: "rewe_no_cert_plwt",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to PLWT check."
      }
    ]
  },

  rewe_no_cert_plwt: {
    text: "Is there a PLWT keyword on the body of the bill?",
    help: "Check for the PLWT (pallet weight) keyword.",
    choices: [
      {
        label: "Yes",
        next: "rewe_no_cert_pallet_match",
        icon: "fa-solid fa-check",
        desc: "PLWT present."
      },
      {
        label: "No",
        next: "rewe_no_cert_add_plwt",
        icon: "fa-solid fa-plus",
        desc: "PLWT missing – add it."
      }
    ]
  },

  rewe_no_cert_add_plwt: {
    text: "Add PLWT keyword on the FBC and the correct pallet weight per BOL.\n\nNOTE:\na. Pallet Weight in the body of the bill should have the correct weight. TARE WEIGHT 0*40 = 0 - system will automatically enter 50 lbs/skid. If 1 skid, will update to 50 lbs. If 2 skids, 100 lbs, etc.\nb. TARE WEIGHT 1*40 = 40 - ensure that correct weight per skid is updated. If 1 skid, then should be 40 lbs. If 2 skids, 80 lbs, etc.",
    help: "Add PLWT with the correct pallet weight based on tare weight indicator.",
    choices: [
      {
        label: "Continue",
        next: "rewe_no_cert_pallet_match",
        icon: "fa-solid fa-arrow-right",
        desc: "Validate pallet weight."
      }
    ]
  },

  rewe_no_cert_pallet_match: {
    text: "Validate the pallet weight if it matches the pallet weight per BOL. Does it match?",
    help: "Compare the PLWT weight on the bill with the BOL.",
    choices: [
      {
        label: "Yes",
        next: "rewe_no_cert_total",
        icon: "fa-solid fa-check",
        desc: "Pallet weight matches."
      },
      {
        label: "No",
        next: "rewe_no_cert_update_pallet",
        icon: "fa-solid fa-pen",
        desc: "Update pallet weight."
      }
    ]
  },

  rewe_no_cert_update_pallet: {
    text: "Update the pallet weight to match per BOL.\n\nNOTE:\na. Pallet Weight in the body of the bill should have the correct weight. TARE WEIGHT 0*40 = 0 - system will automatically enter 50 lbs/skid. If 1 skid, will update to 50 lbs. If 2 skids, 100 lbs, etc.\nb. TARE WEIGHT 1*40 = 40 - ensure that correct weight per skid is updated. If 1 skid, then should be 40 lbs. If 2 skids, 80 lbs, etc.",
    help: "Correct the pallet weight based on tare weight indicator.",
    choices: [
      {
        label: "Continue",
        next: "rewe_no_cert_total",
        icon: "fa-solid fa-arrow-right",
        desc: "Check total weight."
      }
    ]
  },

  rewe_no_cert_total: {
    text: "Does the total actual verified weight on the reweigh certificate match the total weight per FBC?",
    help: "Verify total weight against the reweigh certificate.",
    choices: [
      {
        label: "Yes",
        next: "rewe_no_cert_total_yes",
        icon: "fa-solid fa-check-circle",
        desc: "Weights match – use VRPY."
      },
      {
        label: "No",
        next: "rewe_no_cert_total_no",
        icon: "fa-solid fa-arrow-right",
        desc: "Weights differ – adjust."
      }
    ]
  },

  rewe_no_cert_total_yes: {
    text: "If After Review of BOL, if there are NO CHANGES:\nEnter Correction Comment VS-SAF2-AUDIT - NOAC RELEASING PRO FROM SAF2 QUEUE 3\nEnter Keyword CORR\nEnter Description VRPY\nClick Accept All - FG\nMove to Next Pro to Work",
    help: "Final action – use VRPY and accept all.",
    choices: []
  },

  rewe_no_cert_total_no: {
    text: "MOVE OR DEDUCT THE EXTRA WEIGHT TO PRODUCT WEIGHT, FOR REWEIGHED SHIPMENTS.\n\nOnce auto-rated, make sure the total weight matches the weight amount on the reweigh certificate.\n\nCorrection code CORR EWPD (only if the billing was not correct from the beginning).\nOtherwise, agent will use CORR CUSI and Accept All FG to post.",
    help: "Adjust product weight to match reweigh certificate, then use appropriate correction code.",
    choices: []
  },

  /* --- Option 4: No and No reweigh certificate --- */

  rewe_no_no_cert: {
    text: "Is NMFC matching the BOL?",
    help: "Verify the NMFC on the bill against the Bill of Lading.",
    choices: [
      {
        label: "Yes",
        next: "rewe_no_no_cert_plwt",
        icon: "fa-solid fa-check",
        desc: "NMFC matches."
      },
      {
        label: "No",
        next: "rewe_no_no_cert_update_nmfc",
        icon: "fa-solid fa-pen",
        desc: "NMFC needs correction."
      }
    ]
  },

  rewe_no_no_cert_update_nmfc: {
    text: "Update the NMFC matching NMFC per BOL.",
    help: "Correct the NMFC to match the BOL.",
    choices: [
      {
        label: "Continue",
        next: "rewe_no_no_cert_plwt",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to PLWT check."
      }
    ]
  },

  rewe_no_no_cert_plwt: {
    text: "Is there a PLWT keyword on the body of the bill?",
    help: "Check for the PLWT (pallet weight) keyword.",
    choices: [
      {
        label: "Yes",
        next: "rewe_no_no_cert_pallet_match",
        icon: "fa-solid fa-check",
        desc: "PLWT present."
      },
      {
        label: "No",
        next: "rewe_no_no_cert_add_plwt",
        icon: "fa-solid fa-plus",
        desc: "PLWT missing – add it."
      }
    ]
  },

  rewe_no_no_cert_add_plwt: {
    text: "Add PLWT keyword on the FBC and the correct pallet weight per BOL.",
    note: "Pallet Weight in the body of the bill should have the correct weight. TARE WEIGHT 0*40 = 0 - system will automatically enter 50 lbs/skid. If 1 skid, will update to 50 lbs. If 2 skids, 100 lbs, etc.\nb. TARE WEIGHT 1*40 = 40 - ensure that correct weight per skid is updated. If 1 skid, then should be 40 lbs. If 2 skids, 80 lbs, etc.",
    help: "Add PLWT with the correct pallet weight based on tare weight indicator.",
    choices: [
      {
        label: "Continue",
        next: "rewe_no_no_cert_pallet_match",
        icon: "fa-solid fa-arrow-right",
        desc: "Validate pallet weight."
      }
    ]
  },

  rewe_no_no_cert_pallet_match: {
    text: "Validate the pallet weight if it matches the pallet weight per BOL. Does it match?",
    help: "Compare the PLWT weight on the bill with the BOL.",
    choices: [
      {
        label: "Yes",
        next: "rewe_no_no_cert_total",
        icon: "fa-solid fa-check",
        desc: "Pallet weight matches."
      },
      {
        label: "No",
        next: "rewe_no_no_cert_update_pallet",
        icon: "fa-solid fa-pen",
        desc: "Update pallet weight."
      }
    ]
  },

  rewe_no_no_cert_update_pallet: {
    text: "Update the pallet weight to match per BOL.",
    note: "Pallet Weight in the body of the bill should have the correct weight. TARE WEIGHT 0*40 = 0 - system will automatically enter 50 lbs/skid. If 1 skid, will update to 50 lbs. If 2 skids, 100 lbs, etc.\nb. TARE WEIGHT 1*40 = 40 - ensure that correct weight per skid is updated. If 1 skid, then should be 40 lbs. If 2 skids, 80 lbs, etc.",
    help: "Correct the pallet weight based on tare weight indicator.",
    choices: [
      {
        label: "Continue",
        next: "rewe_no_no_cert_total",
        icon: "fa-solid fa-arrow-right",
        desc: "Check total weight."
      }
    ]
  },

  rewe_no_no_cert_total: {
    text: "Does the weight per BOL matches the the total weight per FBC? (Note: Since no reweigh certificate, use the BOL weight for verification.)",
    help: "If no reweigh certificate, compare total weight against the BOL.",
    choices: [
      {
        label: "Yes",
        next: "rewe_no_no_cert_total_yes",
        icon: "fa-solid fa-check-circle",
        desc: "Weights match – use VIRF."
      },
      {
        label: "No",
        next: "rewe_no_no_cert_total_no",
        icon: "fa-solid fa-arrow-right",
        desc: "Weights differ – adjust."
      }
    ]
  },

  rewe_no_no_cert_total_yes: {
    text: "If After Review of BOL, if there are NO CHANGES:\nEnter Correction Comment VS-SAF2-AUDT - NOAC RELEASING PRO FROM SAF2 QUEUE 3\nEnter Keyword CORR\nEnter Description VIRF\nClick Accept All - F6\nMove to Next Pro to Work",
    help: "Final action – use VIRF and accept all.",
    choices: []
  },

  rewe_no_no_cert_total_no: {
    text: "MOVE OR DEDUCT THE EXTRA WEIGHT TO PRODUCT WEIGHT.\n\nOnce auto-rated, make sure the total weight matches the weight amount on the reweigh certificate (or BOL if no reweigh cert).\n\nCorrection code CORR EWPD (only if the billing was not correct from the beginning).\nOtherwise, agent will use CORR CUSI and Accept All F6 to post.",
    help: "Adjust product weight to match the correct total, then use appropriate correction code.",
    choices: []
  },

  /* --- Existing 50 Lines Error flow --- */

  fifty_lines_error: {
    text: "Is the pro delivered?",
    help: "Determine whether the shipment has already been delivered.",
    choices: [
      {
        label: "Yes",
        next: "remove_blue_lines",
        icon: "fa-solid fa-check-circle",
        desc: "Begin reducing bill lines."
      },
      {
        label: "No",
        next: "fifty_lines_not_delivered",
        icon: "fa-solid fa-clock",
        desc: "Leave pro in SAF2 queue."
      }
    ]
  },

  fifty_lines_not_delivered: {
    text: "Leave Pro in SAF2 Queue until Shipment has been Delivered.",
    help: "No action taken; recheck later.",
    choices: []
  },

  remove_blue_lines: {
    text: "Remove any BLUE lines that may have populated at the bottom of the bill first.",
    help: "Blue lines should be removed before any additional troubleshooting.",
    image: "guides/PAUD%20Guides/saf2-guide/images/saf2-image9.png",
    choices: [
      {
        label: "Continue",
        next: "autorate_50_lines",
        icon: "fa-solid fa-arrow-right",
        desc: "Attempt autorate."
      }
    ]
  },

  autorate_50_lines: {
    text: "Try to autorate to see if this removes the 50+ line error. If not, proceed with the next steps.",
    help: "Autorating may automatically resolve the line count issue.",
    choices: [
      {
        label: "Continue",
        next: "remove_unnecessary_lines",
        icon: "fa-solid fa-arrow-right",
        desc: "Review removable lines."
      }
    ]
  },

  remove_unnecessary_lines: {
    text: "Remove any lines that are no longer necessary.",
    help: "Remove unnecessary billing lines to reduce total line count.",
    image: "guides/PAUD%20Guides/saf2-guide/images/saf2-image10.png",
    choices: [
      {
        label: "Next Example",
        next: "remove_unnecessary_lines_2",
        icon: "fa-solid fa-arrow-right",
        desc: "View additional examples."
      }
    ]
  },

  remove_unnecessary_lines_2: {
    text: "Example of removable line.",
    image: "guides/PAUD%20Guides/saf2-guide/images/saf2-image11.png",
    choices: [
      {
        label: "Next Example",
        next: "remove_unnecessary_lines_3",
        icon: "fa-solid fa-arrow-right"
      }
    ]
  },

  remove_unnecessary_lines_3: {
    text: "Example of removable line.",
    image: "guides/PAUD%20Guides/saf2-guide/images/saf2-image12.png",
    choices: [
      {
        label: "Next Example",
        next: "remove_unnecessary_lines_4",
        icon: "fa-solid fa-arrow-right"
      }
    ]
  },

  remove_unnecessary_lines_4: {
    text: "Example of removable line.",
    image: "guides/PAUD%20Guides/saf2-guide/images/saf2-image13.png",
    choices: [
      {
        label: "Next Example",
        next: "remove_unnecessary_lines_5",
        icon: "fa-solid fa-arrow-right"
      }
    ]
  },

  remove_unnecessary_lines_5: {
    text: "Example of removable line.",
    image: "guides/PAUD%20Guides/saf2-guide/images/saf2-image14.png",
    choices: [
      {
        label: "Next Example",
        next: "remove_unnecessary_lines_6",
        icon: "fa-solid fa-arrow-right"
      }
    ]
  },

  remove_unnecessary_lines_6: {
    text: "Example of removable line.",
    image: "guides/PAUD%20Guides/saf2-guide/images/saf2-image15.png",
    choices: [
      {
        label: "Continue",
        next: "remove_unnecessary_lines_7",
        icon: "fa-solid fa-arrow-right"
      }
    ]
  },

  remove_unnecessary_lines_7: {
    text: "Final example of removable lines.",
    image: "guides/PAUD%20Guides/saf2-guide/images/saf2-image16.png",
    choices: [
      {
        label: "Continue",
        next: "final_50_lines_resolution",
        icon: "fa-solid fa-arrow-right"
      }
    ]
  },

  final_50_lines_resolution: {
    text: "Once enough unnecessary lines have been removed and the bill can be successfully autorated, complete the billing update and post the shipment using the appropriate correction code.",
    help: "Final action after resolving the 50+ line error.",
    choices: []
  }

};
