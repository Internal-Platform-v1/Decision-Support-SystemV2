/* =========================================================
   HOT – EHOT QUEUE REQUESTS GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "hot-ehot-queue-guide",
  title: "HOT – EHOT Queue Requests Guide",
  startNode: "start",
  templateCollection: "hot_ehot_queue_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "HOT Guide",
    help: "HOT/HO2 are typical requests moved from EHOT queues. Review the correction request, verify information, update as needed, and re-rate.",
    choices: [
      {
        label: "Continue",
        next: "hot_request",
        icon: "fa-solid fa-arrow-right",
        desc: "Identify the request type."
      }
    ]
  },

  hot_request: {
    text: "What is the request?",
    help: "READ REQUEST IN THE CORRECTION REQUEST BOX, VERIFY, UPDATE INFORMATION AND RE-RATE. HOT/HO2 are typical requests moved from EHOT queues.",
    choices: [
      {
        label: "Storage Dispute",
        next: "hot_storage_dispute",
        icon: "fa-solid fa-warehouse",
        desc: "Move to STOR Queue for processing."
      },
      {
        label: "Updating Shipment Details",
        next: "hot_update_details",
        icon: "fa-solid fa-pen-to-square",
        desc: "Update HAZMAT lines, cylinder count, skid count and weight."
      },
      {
        label: "Changing origin and destination",
        next: "hot_change_od",
        icon: "fa-solid fa-arrows-up-down",
        desc: "Update consignee terminal and destination."
      },
      {
        label: "International Pros",
        next: "hot_international",
        icon: "fa-solid fa-globe",
        desc: "Move to correct queue (AK, HI, PR, VI, MEX)."
      },
      {
        label: "Redelivery Charge Removal",
        next: "hot_redelivery",
        icon: "fa-solid fa-truck-arrow-right",
        desc: "Remove redelivery charges per BOL or decline."
      },
      {
        label: "ADD NEWP",
        next: "hot_add_newp",
        icon: "fa-solid fa-plus-circle",
        desc: "Move RECON PRO to RECS Queue."
      },
      {
        label: "GAMD REQUEST",
        next: "hot_gamd",
        icon: "fa-solid fa-clock",
        desc: "Decline and email expeditedrefund@fedex.com."
      },
      {
        label: "INBO/INBC",
        next: "hot_inbo",
        icon: "fa-solid fa-border-all",
        desc: "Update with service center address."
      },
      {
        label: "Change Shipping Date",
        next: "hot_change_date",
        icon: "fa-solid fa-calendar-day",
        desc: "Decline – corrections cannot change ship date."
      },
      {
        label: "Remove on hand charges",
        next: "hot_onhand",
        icon: "fa-solid fa-hand",
        desc: "Verify out or move to STOR Queue."
      }
    ]
  },

  /* ==================== OPTION 1: STORAGE DISPUTE ==================== */

  hot_storage_dispute: {
    text: "Move to STOR Queue",
    help: "Storage disputes should be moved to the STOR Queue for processing.",
    choices: []
  },

  /* ==================== OPTION 2: UPDATING SHIPMENT DETAILS ==================== */

  hot_update_details: {
    text: "Verify Pro against BOL. Is it valid for updating?",
    help: "Check if the BOL supports the requested changes.",
    choices: [
      {
        label: "YES – Valid",
        next: "hot_update_valid",
        icon: "fa-solid fa-circle-check",
        desc: "Update per BOL."
      },
      {
        label: "NO – Not valid",
        next: "hot_update_invalid",
        icon: "fa-solid fa-circle-xmark",
        desc: "Decline request."
      }
    ]
  },

  hot_update_valid: {
    text: "Update Pro per the Skid, HU, weight, Class, and NMFC per the BOL. CORR EWPD",
    help: "Update all shipment details to match the BOL and apply CORR EWPD.",
    choices: []
  },

  hot_update_invalid: {
    text: "Not valid per documents or BOL. Decline Request",
    help: "Decline the request as the BOL does not support the changes.",
    choices: []
  },

  /* ==================== OPTION 3: CHANGING ORIGIN AND DESTINATION ==================== */

  hot_change_od: {
    text: "Example: Consignee (Destination). 'CHANGE CONSIGNEE TERMINAL TO WNP NOT SHV -- PER OBL --'",
    image: "guides/PAUD%20Guides/hot-ehot-queue-guide/images/hot-image1.png",
    help: "Review the correction request for destination changes.",
    choices: [
      {
        label: "Continue",
        next: "hot_od_verify_account",
        icon: "fa-solid fa-arrow-right",
        desc: "Verify consignee address."
      }
    ]
  },

  hot_od_verify_account: {
    text: "Verify Consignee address against BOL and search for the Correct Account Number (Account Establishment & Maintenance).",
    help: "Search for the correct account number in Account Establishment & Maintenance.",
    choices: [
      {
        label: "YES – Account found",
        next: "hot_od_found",
        icon: "fa-solid fa-circle-check",
        desc: "Update with existing account."
      },
      {
        label: "NO – Account not found",
        next: "hot_od_review_history",
        icon: "fa-solid fa-magnifying-glass",
        desc: "Review shipment history for service center."
      }
    ]
  },

  hot_od_found: {
    text: "Update consignee address per BOL. CORR ECD.",
    help: "Apply CORR ECD to update the consignee address.",
    choices: []
  },

  hot_od_review_history: {
    text: "Review shipment history to identify the correct destination service center.",
    help: "Check the shipment history to determine the correct destination service center.",
    choices: [
      {
        label: "Continue",
        next: "hot_od_confirm_sc",
        icon: "fa-solid fa-arrow-right",
        desc: "Confirm service center."
      }
    ]
  },

  hot_od_confirm_sc: {
    text: "Confirm to the service center – Once service center confirmed. Proceed on changing the DEST.",
    help: "Confirm the service center, then update the destination.",
    choices: [
      {
        label: "Continue",
        next: "hot_od_click_dest",
        icon: "fa-solid fa-arrow-right",
        desc: "Click DEST to update."
      }
    ]
  },

  hot_od_click_dest: {
    text: "Click DEST at top of Correction Screen to update PRO.",
    image: "guides/PAUD%20Guides/hot-ehot-queue-guide/images/hot-image2.png",
    help: "Click the DEST button on the Correction Screen.",
    choices: [
      {
        label: "Continue",
        next: "hot_od_fbi_dest",
        icon: "fa-solid fa-arrow-right",
        desc: "Click DEST on FBI."
      }
    ]
  },

  hot_od_fbi_dest: {
    text: "CLICK DEST ON FBI.",
    image: "guides/PAUD%20Guides/hot-ehot-queue-guide/images/hot-image3.png",
    help: "Click DEST in the Freight Bill Inquiry screen.",
    choices: [
      {
        label: "Continue",
        next: "hot_od_box_pop",
        icon: "fa-solid fa-arrow-right",
        desc: "Box will pop open."
      }
    ]
  },

  hot_od_box_pop: {
    text: "Box will pop open.",
    image: "guides/PAUD%20Guides/hot-ehot-queue-guide/images/hot-image4.png",
    help: "A pop-up box will appear for destination entry.",
    choices: [
      {
        label: "Continue",
        next: "hot_od_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply final correction."
      }
    ]
  },

  hot_od_final: {
    text: "Pro should now be updated with correct DEST. CORR SYSM.",
    image: "guides/PAUD%20Guides/hot-ehot-queue-guide/images/hot-image5.png",
    help: "Apply CORR SYSM to finalize the destination update.",
    choices: []
  },

  /* ==================== OPTION 4: INTERNATIONAL PROS ==================== */

  hot_international: {
    text: "Move to correct Queue for processing.\n• Alaska – AK\n• Hawaii – HI\n• Puerto Rico – PR\n• Virgin Island – VI\n• Mexico – MEX",
    help: "Route the PRO to the appropriate international queue.",
    choices: []
  },

  /* ==================== OPTION 5: REDELIVERY CHARGE REMOVAL ==================== */

  hot_redelivery: {
    text: "Check BOL for delivery remarks for Del times or Closing.",
    help: "Review the BOL for any delivery time or closing remarks.",
    choices: [
      {
        label: "Continue",
        next: "hot_redelivery_calendar",
        icon: "fa-solid fa-arrow-right",
        desc: "Check Con Billing Mask."
      }
    ]
  },

  hot_redelivery_calendar: {
    text: "Check Cons Billing Mask weekly Calendar.",
    help: "Verify the Cons Billing Mask calendar for delivery availability.",
    choices: [
      {
        label: "VALID – Fee should be removed",
        next: "hot_redelivery_remove",
        icon: "fa-solid fa-circle-check",
        desc: "Remove redelivery charge."
      },
      {
        label: "NOT VALID – Fee should remain",
        next: "hot_redelivery_decline",
        icon: "fa-solid fa-circle-xmark",
        desc: "Decline with reason."
      }
    ]
  },

  hot_redelivery_remove: {
    text: "If DR on image look at times driver noted. CORR – NACC – if looks like it is an error and need removed.",
    help: "Apply CORR NACC to remove the redelivery charge if it was billed in error.",
    choices: []
  },

  hot_redelivery_decline: {
    text: "DECLINED – And note reason for decline. Such as: BOL states delivery time or close date as (whatever bol has listed) or Per Con Billing Mask (marked day as closed or times can deliver)",
    help: "Decline the request with a clear explanation based on BOL or Con Billing Mask.",
    choices: []
  },

  /* ==================== OPTION 6: ADD NEWP ==================== */

  hot_add_newp: {
    text: "If you receive a RECON Pro in HOT, please move it to the RECS Queue.",
    help: "RECON PROs should be routed to the RECS Queue for processing.",
    choices: []
  },

  /* ==================== OPTION 7: GAMD REQUEST ==================== */

  hot_gamd: {
    text: "'REMOVE GUARANTEE FOR 10:30 - SC CAN NOT DO 10:30 GUARANTEE FOR FORT MOHAVE -- PER OTHER - SC CAN NOT DO GUARANTEES FOR THE FORT MOHAVE'",
    image: "guides/PAUD%20Guides/hot-ehot-queue-guide/images/hot-image6.png",
    help: "Review the GAMD request to remove the guarantee.",
    choices: [
      {
        label: "Continue",
        next: "hot_gamd_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Decline and send email."
      }
    ]
  },

  hot_gamd_final: {
    text: "Decline request with comments: DCLN-sent to expeditedrefund@fedex.com for review. Send email to expeditedrefund@fedex.com with 'GAMD HOT' and pro number on subject line.",
    help: "Decline the GAMD request and escalate to expeditedrefund@fedex.com.",
    choices: []
  },

  /* ==================== OPTION 8: INBO/INBC ==================== */

  hot_inbo: {
    text: "You will see this a lot with CA to US or US to CA shipment that involve boarding crossing.",
    image: "guides/PAUD%20Guides/hot-ehot-queue-guide/images/hot-image7.png",
    help: "Review INBO/INBC requests for border crossing shipments.",
    choices: [
      {
        label: "Continue",
        next: "hot_inbo_address",
        icon: "fa-solid fa-arrow-right",
        desc: "Look up service center address."
      }
    ]
  },

  hot_inbo_address: {
    text: "In this instance they are asking to use service center address.\n• Need to look up the address provided in Account Establishment & Maintenance\n• Look to see if there is already an account for the Name being requested.\n• If there is no USE FedEx Service Center account",
    image: "guides/PAUD%20Guides/hot-ehot-queue-guide/images/hot-image8.png",
    help: "Check Account Establishment & Maintenance for the service center address.",
    choices: [
      {
        label: "Continue",
        next: "hot_inbo_update",
        icon: "fa-solid fa-arrow-right",
        desc: "Update as requested."
      }
    ]
  },

  hot_inbo_update: {
    text: "Update as requested.",
    image: "guides/PAUD%20Guides/hot-ehot-queue-guide/images/hot-image9.png",
    help: "Apply the requested INBO/INBC updates.",
    choices: [
      {
        label: "Continue",
        next: "hot_inbo_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply final correction."
      }
    ]
  },

  hot_inbo_final: {
    text: "INBO/INBC should be on the PRO to:",
    image: "guides/PAUD%20Guides/hot-ehot-queue-guide/images/hot-image10.png",
    help: "Ensure INBO/INBC is correctly applied to the PRO.",
    choices: []
  },

  /* ==================== OPTION 9: CHANGE SHIPPING DATE ==================== */

  hot_change_date: {
    text: "Correction does not have access to change this info. Correction request will need to be declined with the following comments:\nDECLINED SHIPDATE CANNOT BE CHANGED BY CORRECTIONS.",
    image: "guides/PAUD%20Guides/hot-ehot-queue-guide/images/hot-image11.png",
    help: "Corrections cannot change shipping dates. Decline the request.",
    choices: []
  },

  /* ==================== OPTION 10: REMOVE ON HAND CHARGES ==================== */

  hot_onhand: {
    text: "If you notice there is an On Hand Notice on image. This is to add storage. So in this case I would just verify out. If storage had been added move to STOR Queue for processing.",
    help: "If On Hand Notice exists, it's for storage. If storage was added, move to STOR Queue.",
    choices: []
  }

};
