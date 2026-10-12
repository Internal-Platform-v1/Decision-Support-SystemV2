/* =========================================================
   PAT8 – MULTI-COMPANY QUEUE GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "pat8-guide",
  title: "PAT8 – Multi-Company Queue Guide",
  startNode: "start",
  templateCollection: "pat8_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "PAT8 Guide",
    help: "PAUD PAT8 will contain bills for the different companies. Open Each Pro to Review in PAUD PAT8 Queue.",
    noteHtml: `<div style="margin-bottom:14px;"><div style="font-weight:800; font-size:13px; color:#475569; margin-bottom:10px;">⚠ REMINDER – IMPORTANT INFORMATION AND CHANGES TO PAUD PAT8 QUEUE</div><ul style="margin:0; padding-left:18px;"><li>IF Bill of Lading (BOL) is NOT on image, DO NOT RELEASE THE PRO FROM THE QUEUE. LEAVE PRO IN PAT8 QUEUE UNTIL BOL IS ON IMAGE – UPDATING EVERY PRO TO TRUE DEBTOR REQUIRES BOL REVIEW – THIS IS THE NEW PROCESS.</li><li>Effective immediately, ALL UPDATES MADE BY AGENT IN PAT8 AND ALL OTHER SPECIAL ACCOUNT PAUD QUEUES MUST BEGIN WITH VS-[QUEUE]-AUDT FOLLOWING CORRECTION COMMENT AT THE END or BEGINNING OF ORIGINAL CORRECTION REQUEST – VS-PAT8-AUDT + [Agent’s Correction Comment]</li><li>Again, the Name of Queue each Pro is Worked FROM MUST BE NOTATED in Agent’s Correction Comment, either at the beginning or the end of the original Correction Queue Comment as seen in the examples below. Either format is acceptable.</li><li>Every time a pro is opened in PAT8 Queue (or any other Special Accounts PAUD Queue) to determine if all backup documents are on image OR billing correctly, BEFORE Closing Pro out of FBC, Enter Comments (F9) – this will be part of the Audit Process.</li></ul></div>`,
    choices: [
      {
        label: "Continue",
        next: "pat8_prepopulated",
        icon: "fa-solid fa-arrow-right",
        desc: "View pre-populated request."
      }
    ]
  },

  pat8_prepopulated: {
    text: "The pre-populated request will already be in the description box.",
    image: "guides/PAUD%20Guides/pat8-guide/images/pat8-image1.png",
    help: "Review the request before validating documentation.",
    choices: [
      {
        label: "Continue",
        next: "pat8_company_select",
        icon: "fa-solid fa-arrow-right",
        desc: "Identify the company."
      }
    ]
  },

  pat8_company_select: {
    text: "Review BOL and the request if you can proceed on updating the invoice. Who is the company you are working on?",
    help: "Select the appropriate option based on the company and correction request.",
    choices: [
      {
        label: "EMERSON",
        next: "pat8_emerson",
        icon: "fa-solid fa-building",
        desc: "Emerson – SID# validation and correction."
      },
      {
        label: "Update terms to pull ABT (PILGRIMS)",
        next: "pat8_pilgrims",
        icon: "fa-solid fa-truck-ramp-box",
        desc: "PILGRIMS – terms update."
      },
      {
        label: "Correcting NMFC (HARTE HANKS)",
        next: "pat8_harte_hanks",
        icon: "fa-solid fa-scale-balanced",
        desc: "Harte Hanks – NMFC correction."
      },
      {
        label: "STPS or STPL (TOP VALUE FABRICS)",
        next: "pat8_top_value",
        icon: "fa-solid fa-tags",
        desc: "Top Value Fabrics – STPS/STPL keyword handling."
      },
      {
        label: "Accessorial Charges are REMOVED per Correction Comment",
        next: "pat8_accessorial_remove",
        icon: "fa-solid fa-circle-minus",
        desc: "Accessorial removal validation."
      }
    ]
  },

  /* ==================== OPTION 1: EMERSON ==================== */

  pat8_emerson: {
    text: "EMERSON – Is it billing correctly per BOL?",
    image: "guides/PAUD%20Guides/pat8-guide/images/pat8-image2.png",
    help: "Verify terms and SID# format.",
    choices: [
      {
        label: "YES – Billing correct",
        next: "pat8_emerson_yes",
        icon: "fa-solid fa-check-circle",
        desc: "SID# matches BOL."
      },
      {
        label: "NO – SID# incorrect",
        next: "pat8_emerson_no",
        icon: "fa-solid fa-pen-to-square",
        desc: "Correct SID# in CAPS."
      }
    ]
  },

  pat8_emerson_yes: {
    text: "Verify terms and make sure the 'SID' number (bill of lading number) is correct. Emerson has a special format for their SID#. It is always 10 digits and starts with a '1' and 9 numeric. Agent will also override the auto bill to and use the appropriate Emerson Supply Chain Optimization bill to on the bill of lading.",
    image: "guides/PAUD%20Guides/pat8-guide/images/pat8-image3.png",
    help: "From the Freight Bill Correction Screen, agent can click on Reference Edit to verify the number matches what is on the bill of lading.",
    choices: [
      {
        label: "Continue",
        next: "pat8_emerson_yes_ref",
        icon: "fa-solid fa-arrow-right",
        desc: "Verify Reference Edit."
      }
    ]
  },

  pat8_emerson_yes_ref: {
    text: "From the Freight Bill Correction Screen, agent can click on Reference Edit to verify the number matches what is on the bill of lading.",
    image: "guides/PAUD%20Guides/pat8-guide/images/pat8-image4.png",
    help: "If the SID# number matches what is entered as BL#, agent will do a CORR VRFY and Accept ALL F6 to post.",
    choices: [
      {
        label: "Recommended Action",
        next: "pat8_emerson_final_match",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply CORR VRFY."
      }
    ]
  },

  pat8_emerson_final_match: {
    text: "If the SID# number matches what is entered as BL#, agent will do a CORR VRFY and Accept ALL F6 to post.",
    help: "No further changes needed.",
    choices: []
  },

  pat8_emerson_no: {
    text: "Will have to back out of the Reference Edit screen and pull it up separately in the Reference Edit Function in CAPS to add the correct SID#.",
    help: "CAPS comes up, change SYSTEM from CUSTOMER RESEARCH, In MENU select PROCESSING, and under Application choose EDIT CORRECTIONS.",
    choices: [
      {
        label: "Continue",
        next: "pat8_emerson_caps1",
        icon: "fa-solid fa-arrow-right",
        desc: "Open CAPS."
      }
    ]
  },

  pat8_emerson_caps1: {
    text: "CAPS comes up, change SYSTEM from CUSTOMER RESEARCH, In MENU select PROCESSING, and under Application choose EDIT CORRECTIONS.",
    image: "guides/PAUD%20Guides/pat8-guide/images/pat8-image5.png",
    choices: [
      {
        label: "Continue",
        next: "pat8_emerson_caps2",
        icon: "fa-solid fa-arrow-right",
        desc: "Add BL field."
      }
    ]
  },

  pat8_emerson_caps2: {
    text: "Go to 'Fields Type' and put in 'BL' and click the ADD button, tab to 'Reference Number' and type in the 10 digit SID#.",
    image: "guides/PAUD%20Guides/pat8-guide/images/pat8-image6.png",
    choices: [
      {
        label: "Continue",
        next: "pat8_emerson_caps3",
        icon: "fa-solid fa-arrow-right",
        desc: "Submit."
      }
    ]
  },

  pat8_emerson_caps3: {
    text: "Tab to 'Reference Number' and type in the 10 digit SID#, then click on 'Add/Update' then click on 'Submit' (it is the very last icon that looks like a hand with a sheet of paper). If agent hovers over it, it will show 'Submit'.",
    image: "guides/PAUD%20Guides/pat8-guide/images/pat8-image7.png",
    choices: [
      {
        label: "Continue",
        next: "pat8_emerson_final_fix",
        icon: "fa-solid fa-arrow-right",
        desc: "Return to FBC."
      }
    ]
  },

  pat8_emerson_final_fix: {
    text: "Return to Freight Bill Corrections Screen, verify the changes took by selecting the Reference Edits button, and then CORR CUSI and ACCEPT ALL F6 to Post.",
    image: "guides/PAUD%20Guides/pat8-guide/images/pat8-image8.png",
    help: "Correction complete.",
    choices: []
  },

  /* ==================== OPTION 2: PILGRIMS ==================== */

  pat8_pilgrims: {
    text: "PILGRIMS – Check BOL if it's invalid or valid for updating terms?",
    image: "guides/PAUD%20Guides/pat8-guide/images/pat8-image9.png",
    help: "Review the BOL to determine if terms should be updated.",
    choices: [
      {
        label: "VALID – Update terms per BOL",
        next: "pat8_pilgrims_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Proceed with update."
      },
      {
        label: "INVALID – Billing correct, release pro",
        next: "pat8_pilgrims_invalid",
        icon: "fa-solid fa-circle-xmark",
        desc: "No changes needed."
      }
    ]
  },

  pat8_pilgrims_valid: {
    text: "Terms are Updated per BOL. Click Autorater. Add NOAR. Enter Correction Comment: VS-PAT8-AUDT + Specific Correction Comment. Enter Description ACCR Non-Biller Error. Enter Description ETMS Biller Error. Click Accept All – F6.",
    image: "guides/PAUD%20Guides/pat8-guide/images/pat8-image10.png",
    help: "Update complete.",
    choices: []
  },

  pat8_pilgrims_invalid: {
    text: "Pro is Billing Correctly, Release Pro. After Review of BOL, if there are NO CHANGES: a. Enter Correction Comment: VS-PAT8-AUDT – NOAC; b. RELEASING PRO FROM PAT8 QUEUE Enter Keyword; c. CORR VRFY Click Accept All; d. Move to Next Pro to Work.",
    help: "No correction needed.",
    choices: []
  },

  /* ==================== OPTION 3: HARTE HANKS ==================== */

  pat8_harte_hanks: {
    text: "HARTE HANKS – Bills are worked first in/first out, so when the agents start working, they should be able to click on the first bill in the queue.",
    help: "Agent will need to scroll below to find the company name for example: Harte Hanks.",
    choices: [
      {
        label: "Continue",
        next: "pat8_hh_scroll",
        icon: "fa-solid fa-arrow-right",
        desc: "Locate Harte Hanks bill."
      }
    ]
  },

  pat8_hh_scroll: {
    text: "Agent will need to scroll below to find the company name for example: Harte Hanks.",
    image: "guides/PAUD%20Guides/pat8-guide/images/pat8-image11.png",
    choices: [
      {
        label: "Continue",
        next: "pat8_hh_open",
        icon: "fa-solid fa-arrow-right",
        desc: "Open the bill."
      }
    ]
  },

  pat8_hh_open: {
    text: "When the agent comes to the first Harte Hanks bill, open the bill by double clicking or highlighting the bill and choosing the select option.",
    image: "guides/PAUD%20Guides/pat8-guide/images/pat8-image12.png",
    choices: [
      {
        label: "Continue",
        next: "pat8_hh_bol",
        icon: "fa-solid fa-arrow-right",
        desc: "Open BOL."
      }
    ]
  },

  pat8_hh_bol: {
    text: "Once the bill is open, the agent will need to open the bill of lading to audit for the correct NMFC.",
    image: "guides/PAUD%20Guides/pat8-guide/images/pat8-image13.png",
    choices: [
      {
        label: "Continue",
        next: "pat8_hh_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check NMFC."
      }
    ]
  },

  pat8_hh_check: {
    text: "Does NMFC and SUB are correct and matching?",
    help: "Verify against the BOL.",
    choices: [
      {
        label: "YES – Correct",
        next: "pat8_hh_yes",
        icon: "fa-solid fa-circle-check",
        desc: "No correction needed."
      },
      {
        label: "NO – Needs update",
        next: "pat8_hh_no",
        icon: "fa-solid fa-pen-to-square",
        desc: "Update NMFC."
      }
    ]
  },

  pat8_hh_yes: {
    text: "If the bill is correctly billed with appropriate NMFC and SUB, agent will just need to CORR VRFY and Accept All F6 to post.",
    help: "Billing correct.",
    choices: []
  },

  pat8_hh_no: {
    text: "Need to update the NMFC to 161700-03 for class 55 to match the bill of lading.",
    image: "guides/PAUD%20Guides/pat8-guide/images/pat8-image14.png",
    help: "Recommended Action: Since the correct NMFC and SUB was listed on the bill of lading, the agent will use CORR EWPD as the correction code (Error Weight Pieces Description). If the NMFC and SUB were not listed and with ABOL agent will use correction code CORR CUSI, and Accept All F6 to post.",
    choices: [
      {
        label: "Continue",
        next: "pat8_hh_fix",
        icon: "fa-solid fa-arrow-right",
        desc: "View final recommendation."
      }
    ]
  },

  pat8_hh_fix: {
    text: "Use CORR EWPD (if NMFC listed on BOL) or CORR CUSI (if not listed). Accept All F6 to post.",
    image: "guides/PAUD%20Guides/pat8-guide/images/pat8-image15.png",
    help: "Correction complete.",
    choices: []
  },

  /* ==================== OPTION 4: TOP VALUE FABRICS ==================== */

  pat8_top_value: {
    text: "TOP VALUE FABRICS – Bills are worked first in/first out, so when the agents start working, they should be able to click on the first bill in the queue.",
    help: "Open the bill of lading to review for correct billing, and to verify if the STPS or STPL keywords are present.",
    choices: [
      {
        label: "Continue",
        next: "pat8_tv_bol",
        icon: "fa-solid fa-arrow-right",
        desc: "Open BOL."
      }
    ]
  },

  pat8_tv_bol: {
    text: "Open the bill of lading to review for correct billing, and to verify if the STPS or STPL keywords are present.",
    image: "guides/PAUD%20Guides/pat8-guide/images/pat8-image16.png",
    help: "Second image reference.",
    noteHtml: `<img src="guides/PAUD%20Guides/pat8-guide/images/pat8-image17.png" alt="STPS STPL example" style="max-width:100%; margin-top:8px; border-radius:12px;">`,
    choices: [
      {
        label: "Continue",
        next: "pat8_tv_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check for STPS/STPL."
      }
    ]
  },

  pat8_tv_check: {
    text: "Review the body of the freight bill to see if either keyword (STPS or STPL). Does the STPL or STPS is NOTED in the BOL?",
    help: "If one of the keywords is on the bill of lading, but not in the body of the bill, add the keyword into the body of the bill.",
    choices: [
      {
        label: "YES – Keyword on BOL but missing in body",
        next: "pat8_tv_yes",
        icon: "fa-solid fa-circle-check",
        desc: "Add keyword."
      },
      {
        label: "NO – Billing correct, no keyword needed",
        next: "pat8_tv_no",
        icon: "fa-solid fa-circle-xmark",
        desc: "Release pro."
      }
    ]
  },

  pat8_tv_yes: {
    text: "If one of the keywords is on the bill of lading, but not in the body of the bill, add the keyword into the body of the bill.",
    image: "guides/PAUD%20Guides/pat8-guide/images/pat8-image18.png",
    help: "Recommended Action: Add correction request of CORR CUSI and Accept All F6 to post. Note: It will need auto-rate the freight bill to rate with pallet rates (there are times that the Rate line will change to FLAT, depending on the weight).",
    choices: []
  },

  pat8_tv_no: {
    text: "If the billing is correct per the bill of lading, and there is no STPS or STPL keyword, agent will need to CORR VRFY and Accept All F6 to post.",
    help: "No correction needed.",
    choices: []
  },

  /* ==================== OPTION 5: Accessorial Charges REMOVED ==================== */

  pat8_accessorial_remove: {
    text: "Accessorial Charges are REMOVED per Correction Comment. Is it valid for removal per Delivery Receipt?",
    help: "Determine validity from DR.",
    choices: [
      {
        label: "YES – Valid removal",
        next: "pat8_acc_yes",
        icon: "fa-solid fa-circle-check",
        desc: "Fee not performed."
      },
      {
        label: "NO – Not valid for removal",
        next: "pat8_acc_no",
        icon: "fa-solid fa-circle-xmark",
        desc: "Fee was performed."
      }
    ]
  },

  pat8_acc_yes: {
    text: "Fee is valid for removal - Not checked per DR and not performed. Enter Description NACC Click Accept All – F6. Move to Next Pro to Work.",
    help: "Remove accessorial charge.",
    choices: []
  },

  pat8_acc_no: {
    text: "If it is not valid for removal seen in Delivery receipt, Acoops and was performed:<br><br>• a. Enter Correction Comment: VS-PAT8-AUDT – NOAC<br>• b. RELEASING PRO FROM PAT8 QUEUE Enter Keyword<br>• c. CORR VRFY Click Accept All<br>• d. Move to Next Pro to Work.",
    help: "Decline removal.",
    choices: []
  }

};
