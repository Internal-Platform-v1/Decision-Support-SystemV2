/* =========================================================
   BLOA GUIDE – ACCESSORIAL & TERMS VALIDATION — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "bloa-guide",
  title: "BLOA Guide – Accessorial & Terms Validation",
  startNode: "start",
  templateCollection: "bloa_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "BLOA - Handling Guide",
    help: "Follow request to change any surcharges billed collect to prepaid (vice versa). Accessorial should always match the terms per the letter of authority covering the bill to. Surcharges refer to all collect surcharges (LIFC, IDC, DUNC).",
    noteHtml: `<div style="margin-bottom:14px;"><div style="font-weight:800; font-size:13px; color:#475569; margin-bottom:10px;">⚠ NOTE</div><p>If BOL AND DR are NOT on image, DO NOT RELEASE THE PRO FROM THE QUEUE. LEAVE PRO IN BLOA QUEUE UNTIL ALL DOCUMENTS ARE ON IMAGE – UPDATING ACCESSORIALS TO TRUE DEBTOR BASED ON BLANKET LETTER OF AUTHORITY ON FILE REQUIRES BOL AND DR REVIEW – THIS IS THE NEW PROCESS.</p></div>`,
    choices: [
      {
        label: "Continue",
        next: "bloa_reminder",
        icon: "fa-solid fa-arrow-right",
        desc: "View reminders for special accounts and system issues."
      }
    ]
  },

  bloa_reminder: {
    text: "REMINDER: For Special Accounts, move them to their respective queues.",
    help: "Submit support requests or call help desk for outages.",
    image: "guides/PAUD%20Guides/bloa-guide/images/bloa-image1.png",
    choices: [
      {
        label: "Continue",
        next: "bloa_prepopulated",
        icon: "fa-solid fa-arrow-right",
        desc: "View pre-populated request."
      }
    ]
  },

  bloa_prepopulated: {
    text: "The pre-populated request will already be in the description box.",
    help: "Review the request before validating documentation.",
    image: "guides/PAUD%20Guides/bloa-guide/images/bloa-image2.png",
    choices: [
      {
        label: "Continue",
        next: "bloa_docs_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check for BOL, DR, and Blanket LOA."
      }
    ]
  },

  bloa_docs_check: {
    text: "Review BOL, DR and Blanket LOA for valid documentation. Is there any BOL, DR and Blanket LOA on file imaged?",
    help: "Select the appropriate option based on available documents.",
    choices: [
      {
        label: "Accessorial Charges and Terms are already billing correctly",
        next: "bloa_option1",
        icon: "fa-solid fa-check-circle",
        desc: "No changes needed."
      },
      {
        label: "Driver Spotted on Blanket LOA",
        next: "bloa_option2",
        icon: "fa-solid fa-truck",
        desc: "Driver spotted exception."
      },
      {
        label: "Delivery Receipt (DR) IS NOT on Image",
        next: "bloa_option3",
        icon: "fa-solid fa-file-circle-xmark",
        desc: "Missing DR."
      },
      {
        label: "Delivery Receipt (DR) is imaged",
        next: "bloa_option4",
        icon: "fa-solid fa-file-image",
        desc: "DR available."
      },
      {
        label: "Blanket LOA is imaged",
        next: "bloa_option5",
        icon: "fa-solid fa-file-lines",
        desc: "LOA available."
      }
    ]
  },

  /* ================= OPTION 1: Already billing correctly ================= */

  bloa_option1: {
    text: "Accessorial Charges and Terms are already billing correctly.",
    help: "Confirm all accessorials are billing correctly per BLOA on file.",
    choices: [
      {
        label: "Continue",
        next: "bloa_option1_action",
        icon: "fa-solid fa-arrow-right",
        desc: "View recommended action."
      }
    ]
  },

  bloa_option1_action: {
    text: "Enter Correction Comment 'VS-BLOA-AUDT – NOAC RELEASING **DRIVER SPOTTED** PRO FROM BLOA QUEUE'. Follow the Decline process – decline the request and provide comment why it was declined, then move to the next pro.",
    help: "Decline the request and move on.",
    choices: [
      {
        label: "Move to Next Pro",
        next: "bloa_end",
        icon: "fa-solid fa-forward-step",
        desc: "Proceed to next pro in queue."
      }
    ]
  },

  /* ================= OPTION 2: Driver Spotted on Blanket LOA ================= */

  bloa_option2: {
    text: "Driver Spotted on Blanket LOA. Confirm all accessorials are billing correctly per BLOA on file.",
    help: "Update any accessorials following BLOA guidelines.",
    choices: [
      {
        label: "Continue",
        next: "bloa_option2_update",
        icon: "fa-solid fa-arrow-right",
        desc: "Update accessorials if needed."
      }
    ]
  },

  bloa_option2_update: {
    text: "Update any accessorials at time of review following BLOA guidelines.",
    help: "Make necessary changes to match terms.",
    choices: [
      {
        label: "Continue",
        next: "bloa_driver_spotted_info",
        icon: "fa-solid fa-arrow-right",
        desc: "Review driver spotted exception."
      }
    ]
  },

  bloa_driver_spotted_info: {
    text: "Shipment states **DRIVER SPOTTED** in Signed Field (located in Top Right Corner of FBI).",
    image: "guides/PAUD%20Guides/bloa-guide/images/bloa-image3.png",
    help: "Driver spotted shipments are an exception – no need to hold for DR.",
    choices: [
      {
        label: "Continue",
        next: "bloa_driver_spotted_exception",
        icon: "fa-solid fa-arrow-right",
        desc: "Learn about exception handling."
      }
    ]
  },

  bloa_driver_spotted_exception: {
    text: "**DRIVER SPOTTED** Shipments are an Exception to Holding a Pro while waiting for DR. Trailers are dropped at Customer Location for Unloading so Accessorials at Time of Delivery WILL NOT occur.",
    help: "Follow the decline process.",
    choices: [
      {
        label: "Continue",
        next: "bloa_option2_decline",
        icon: "fa-solid fa-arrow-right",
        desc: "Decline the request."
      }
    ]
  },

  bloa_option2_decline: {
    text: "Follow the Decline process – decline the request and provide comment why it was declined, then move to the next pro. Enter Correction Comment: VS-BLOA-AUDT – NOAC RELEASING **DRIVER SPOTTED** PRO FROM BLOA QUEUE.",
    help: "Decline and move on.",
    choices: [
      {
        label: "Move to Next Pro",
        next: "bloa_end",
        icon: "fa-solid fa-forward-step",
        desc: "Proceed to next pro."
      }
    ]
  },

  /* ================= OPTION 3: DR NOT on Image ================= */

  bloa_option3: {
    text: "Delivery Receipt (DR) IS NOT on Image. Is the pro delivered or undelivered?",
    help: "Select delivery status.",
    choices: [
      {
        label: "Delivered",
        next: "bloa_delivered_no_dr",
        icon: "fa-solid fa-check-circle",
        desc: "Request DR from destination SC."
      },
      {
        label: "Undelivered",
        next: "bloa_undelivered_no_dr",
        icon: "fa-solid fa-clock",
        desc: "Leave in queue and move on."
      }
    ]
  },

  bloa_delivered_no_dr: {
    text: "Must Email Destination Service Center OSD Department and Request DR to be Imaged Immediately. Locate 3-digit Alpha Code of Destination Service Center from Freight Bill Corrections or Freight Bill Inquiry Screen.",
    image: "guides/PAUD%20Guides/bloa-guide/images/bloa-image4.png",
    help: "Use the format shown in the image to email the request.",
    choices: [
      {
        label: "Continue",
        next: "bloa_end",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after requesting DR."
      }
    ]
  },

  bloa_undelivered_no_dr: {
    text: "Leave the pro in BLOA queue and put comment in FBC: 'Pro is not yet delivered'. Proceed to the next pro number.",
    help: "Do not release the pro until delivered.",
    choices: [
      {
        label: "Move to Next Pro",
        next: "bloa_end",
        icon: "fa-solid fa-forward-step",
        desc: "Work next pro."
      }
    ]
  },

  /* ================= OPTION 4: DR is imaged ================= */

  bloa_option4: {
    text: "Delivery Receipt (DR) is imaged. Check the BOL for the correct terms. Proceed to check the relationship of bill to match the terms.",
    help: "Scroll down to look for collect or prepaid accessorial charges.",
    choices: [
      {
        label: "Continue",
        next: "bloa_check_accessorials",
        icon: "fa-solid fa-arrow-right",
        desc: "Review accessorial charges."
      }
    ]
  },

  bloa_check_accessorials: {
    text: "Scroll down to look for the collect or prepaid accessorial charges.",
    image: "guides/PAUD%20Guides/bloa-guide/images/bloa-image5.png",
    help: "Identify which accessorials do not match the terms.",
    choices: [
      {
        label: "Continue",
        next: "bloa_fix_idc",
        icon: "fa-solid fa-arrow-right",
        desc: "Example fix for IDC."
      }
    ]
  },

  bloa_fix_idc: {
    text: "In this scenario the only accessorial that doesn't match the term is IDC. Change the IDC to IDP and autorate.",
    image: "guides/PAUD%20Guides/bloa-guide/images/bloa-image6.png",
    help: "Update the accessorial code and recalc.",
    choices: [
      {
        label: "Continue",
        next: "bloa_option4_correction",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply correction code."
      }
    ]
  },

  bloa_option4_correction: {
    text: "Put your correction code comments - VS-BLOA-AUDT + [Agent’s Correction Comment]. Use CORR ETMS and Accept All or F6.",
    help: "Post the changes.",
    choices: [
      {
        label: "Accept All (F6)",
        next: "bloa_end",
        icon: "fa-solid fa-check-double",
        desc: "Post and move to next pro."
      }
    ]
  },

  /* ================= OPTION 5: Blanket LOA is imaged ================= */

  bloa_option5: {
    text: "Blanket LOA is imaged. Does the surcharge valid for rebilling per Blanket LOA?",
    image: "guides/PAUD%20Guides/bloa-guide/images/bloa-image7.png",
    help: "Determine if surcharge can be rebilled.",
    choices: [
      {
        label: "Yes",
        next: "bloa_loa_yes",
        icon: "fa-solid fa-check-circle",
        desc: "Update accessorials to prepaid."
      },
      {
        label: "No",
        next: "bloa_loa_no",
        icon: "fa-solid fa-circle-xmark",
        desc: "Decline the request."
      }
    ]
  },

  bloa_loa_yes: {
    text: "Scroll down and find either a lift gate or inside delivery to update to prepaid. Sometimes you will have to change both in one bill.",
    image: "guides/PAUD%20Guides/bloa-guide/images/bloa-image8.png",
    help: "Update accessorials as needed.",
    choices: [
      {
        label: "Continue",
        next: "bloa_loa_yes_correction",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply correction code."
      }
    ]
  },

  bloa_loa_yes_correction: {
    text: "Put your correction code comments - VS-BLOA-AUDT + [Agent’s Correction Comment]. Use CORR ETMS and Accept All or F6.",
    help: "Post the changes.",
    choices: [
      {
        label: "Accept All (F6)",
        next: "bloa_end",
        icon: "fa-solid fa-check-double",
        desc: "Post and move to next pro."
      }
    ]
  },

  bloa_loa_no: {
    text: "Follow the Decline process – decline the request and provide comment why it was declined. Enter Correction Comment: VS-BLOA-AUDT – NOAC RELEASING PRO FROM BLOA QUEUE. Move to Next Pro to Work.",
    help: "Decline and move on.",
    choices: [
      {
        label: "Move to Next Pro",
        next: "bloa_end",
        icon: "fa-solid fa-forward-step",
        desc: "Work next pro."
      }
    ]
  },

  /* ================= TERMINAL NODE ================= */

  bloa_end: {
    text: "BLOA review complete for this pro. Continue with next pro in queue.",
    help: "Return to queue and select next pro.",
    choices: []
  }

};
