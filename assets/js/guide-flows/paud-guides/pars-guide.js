/* =========================================================
   PARS – PARKER HANNIFIN QUEUE GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "pars-guide",
  title: "PARS – Parker Hannifin Queue Guide",
  startNode: "start",
  templateCollection: "pars_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "PAT8 Parker Hannifin Guide",
    help: "Process for handling Parker Hannifin-related bills in the PAUD PAT8 queue. Follow the BOL validation and account update steps carefully.",
    choices: [
      {
        label: "Continue",
        next: "parker_prepopulated",
        icon: "fa-solid fa-arrow-right",
        desc: "Open the first bill and review pre-populated comments."
      }
    ]
  },

  parker_prepopulated: {
    text: "When the bill opens, there will be pre-populated comments with instructions on how to process the request.",
    image: "guides/PAUD%20Guides/pars-guide/images/pars-image1.png",
    help: "Read the pre-populated comments carefully—they contain specific handling instructions for this queue.",
    choices: [
      {
        label: "Continue",
        next: "parker_validate",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to validate Parker Hannifin on the BOL."
      }
    ]
  },

  parker_validate: {
    text: "Validate and Verify if Parker Hannifin is on the BOL. Is there a valid document per BOL noted that Parker Hannifin is the debtor or same address?",
    help: "Check the Bill of Lading image to confirm if Parker Hannifin appears as the debtor, consignee, or if the address matches.",
    choices: [
      {
        label: "No – Not Parker",
        next: "parker_no_debtor",
        icon: "fa-solid fa-circle-xmark",
        desc: "BOL doesn't indicate Parker or matching address."
      },
      {
        label: "Yes – Parker is Debtor",
        next: "parker_yes_debtor",
        icon: "fa-solid fa-circle-check",
        desc: "Parker is confirmed as the consignee/debtor per BOL."
      },
      {
        label: "Same Address as Parker",
        next: "parker_same_address",
        icon: "fa-solid fa-address-card",
        desc: "Address matches Parker Hannifin, but shipper is different."
      }
    ]
  },

  /* ==================== OPTION 1: NOT PARKER ==================== */

  parker_no_debtor: {
    text: "No. BOL doesn't tell anything about Parker Hannifin. Address is not for Parker Hannifin. Still check if billing correctly per BOL. Does the BOL imaged?",
    help: "Determine if the BOL image is available to verify billing correctness.",
    choices: [
      {
        label: "YES – BOL is imaged",
        next: "parker_no_yes_bol",
        icon: "fa-solid fa-file-image",
        desc: "Image exists—verify and decline if correct."
      },
      {
        label: "NO – BOL not imaged",
        next: "parker_no_no_bol",
        icon: "fa-solid fa-file-circle-exclamation",
        desc: "Image missing—skip to the next PRO."
      }
    ]
  },

  parker_no_yes_bol: {
    text: "If yes and correctly verified that it is not Parker, follow the Decline process. Add decline comment in correction request field then use CORR VRFY.",
    help: "Action: Enter your decline comment (include VS-PAT8-AUDT), apply CORR VRFY, and Accept All F6 to release the PRO.",
    choices: []
  },

  parker_no_no_bol: {
    text: "If no BOL is imaged, skip to the next PRO.",
    help: "Action: Do not process without BOL. Move to the next PRO in the queue.",
    choices: []
  },

  /* ==================== OPTION 2: PARKER IS DEBTOR ==================== */

  parker_yes_debtor: {
    text: "Yes. Parker is the Debtor per BOL. Proceed on reviewing the pro.",
    noteHtml: `<div style="display:flex; flex-direction:column; gap:8px; margin-top:8px;">
             <img src="guides/PAUD%20Guides/pars-guide/images/pars-image2.png" style="max-width:100%; border-radius:8px;" alt="Review pro 1">
             <img src="guides/PAUD%20Guides/pars-guide/images/pars-image3.png" style="max-width:100%; border-radius:8px;" alt="Review pro 2">
             <img src="guides/PAUD%20Guides/pars-guide/images/pars-image4.png" style="max-width:100%; border-radius:8px;" alt="Review pro 3">
           </div>`,
    help: "Review the PRO details and images before updating the consignee.",
    choices: [
      {
        label: "Continue",
        next: "parker_update_consignee",
        icon: "fa-solid fa-arrow-right",
        desc: "Update the consignee to the correct account."
      }
    ]
  },

  parker_update_consignee: {
    text: "Update the consignee to account requested (105188579). Be sure you are changing to the correct code as the shipments have not been delivered and if you update to the wrong code, the shipment could get mis-routed. This queue is set up because the bill states 'send all prepaid' but is marked as third party—if we don't have to bill Parker Hannifin, we must update the shipment with a valid account number.",
    image: "guides/PAUD%20Guides/pars-guide/images/pars-image5.png",
    help: "Double-check the account code (105188579) before applying. Wrong codes cause routing errors. Also verify the bill condition: 'send all prepaid' vs third-party marking to confirm the update is necessary before proceeding.",
    choices: [
      {
        label: "Continue",
        next: "parker_identify_terms",
        icon: "fa-solid fa-arrow-right",
        desc: "Identify and evaluate the terms."
      }
    ]
  },

  parker_identify_terms: {
    text: "Prior to posting the bill, identify the TERMS. Note: If the terms of the invoice are such that the opposite terms produce a lesser amount, the invoice is updated to reflect the lesser amount. This will only apply if Parker Hannifin is both the shipper and consignee.",
    help: "Check if Parker is both shipper and consignee. If yes, compare Prepaid vs Collect rates—choose the lower one.",
    choices: [
      {
        label: "Continue",
        next: "parker_terms_example",
        icon: "fa-solid fa-arrow-right",
        desc: "View the example rate comparison."
      }
    ]
  },

  parker_terms_example: {
    text: "Example Pro: In this example, the terms changed to collect rated at a lower price ($107.00 at prepaid and $95.11 for inbound collect).",
    image: "guides/PAUD%20Guides/pars-guide/images/pars-image6.png",
    help: "Notice that the Collect rate ($95.11) is lower than the Prepaid rate ($107.00).",
    choices: [
      {
        label: "Continue",
        next: "parker_terms_action",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply the appropriate correction code."
      }
    ]
  },

  parker_terms_action: {
    text: "If after updating the account, and the terms do not produce a lower rate, post the bill as it was originally billed. If they produce a lower rate (e.g., change to Prepaid since it is much lower rate than the collect charge), use CORR CUSI.",
    image: "guides/PAUD%20Guides/pars-guide/images/pars-image7.png",
    help: "If changing terms to the lower rate, apply CORR CUSI and Accept All F6. If no rate change, post as-is with CORR VRFY.",
    choices: []
  },

  /* ==================== OPTION 3: SAME ADDRESS AS PARKER ==================== */

  parker_same_address: {
    text: "Same address with Parker Hannifin. Example Pro# 3620080365 – Terms are Prepaid and Shipper is Cisco.",
    image: "guides/PAUD%20Guides/pars-guide/images/pars-image8.png",
    help: "Even though the address matches, verify the actual consignee and shipper on the BOL.",
    choices: [
      {
        label: "Continue",
        next: "parker_same_validate",
        icon: "fa-solid fa-arrow-right",
        desc: "Audit the BOL to confirm billing party."
      }
    ]
  },

  parker_same_validate: {
    text: "Validate through BOL. An audit of the bill of lading confirms that Parker Hannifin is not the consignee, and the terms are prepaid to bill Cisco.",
    image: "guides/PAUD%20Guides/pars-guide/images/pars-image9.png",
    help: "Confirm that Cisco is the correct bill-to party and Parker is not the debtor.",
    choices: [
      {
        label: "Continue",
        next: "parker_same_action",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply the decline process."
      }
    ]
  },

  parker_same_action: {
    text: "Follow the Decline process – CORR VRFY to post the bill and provide comment why it was declined.",
    help: "Action: Enter decline comment (include VS-PAT8-AUDT), apply CORR VRFY, and Accept All F6 to release the PRO.",
    choices: []
  }

};
