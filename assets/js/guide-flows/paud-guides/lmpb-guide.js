/* =========================================================
   LMPB (LUMPER FEE) GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "lmpb-guide",
  title: "LMPB (Lumper Fee) Guide",
  startNode: "start",
  templateCollection: "lmpb_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "LMPB (Lumper Fee) Guide",
    help: "Use this guide to properly add Lumper fees (LMPB for 3rd party, LMPP for prepaid) for customers who use Lumper services for Sort & Segregation at destination centers, and to handle declines when Sort & Segregate charges already exist or when bills are unworkable.",
    choices: [
      {
        label: "Continue",
        next: "paud_explanation",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Lumper fee dispute resolution process."
      }
    ]
  },

  paud_explanation: {
    text: "PAUD LMPB was setup to add Lumper charges to common customers who use Lumper services when performing their Sort and Segregation at the destination center. Agent will be adding keywords LMPB if the shipment is a 3rd party move, or LMPP if the shipment is a prepaid move to bill the shipper. If the shipment already contains Sort & Segregate charges, agent will follow the Decline process – decline the request and provide comment why it was declined.",
    help: "Overview of Lumper fee purpose and keyword usage.",
    image: "guides/PAUD%20Guides/lmpb-guide/images/lmpb-image1.png",
    choices: [
      {
        label: "Continue",
        next: "check_sseg_condition",
        icon: "fa-solid fa-arrow-right",
        desc: "Review reminder and check for Sort & Segregate charges."
      }
    ]
  },

  check_sseg_condition: {
    text: "Does the bill have any Sort & Segregate charges or unworkable errors?",
    help: "Select the condition that applies to the current bill.",
    choices: [
      {
        label: "No Sort & Segregate – bill is workable",
        next: "check_initial_request",
        icon: "fa-solid fa-check-circle",
        desc: "Proceed to check initial LMPB request."
      },
      {
        label: "Sort & Segregate already on bill",
        next: "decline_sseg",
        icon: "fa-solid fa-ban",
        desc: "Decline request – fee cannot be added."
      },
      {
        label: "Bill has errors (Manual Rate or 50+ lines)",
        next: "move_to_vend",
        icon: "fa-solid fa-exclamation-triangle",
        desc: "Move bill to VEND queue."
      }
    ]
  },

  decline_sseg: {
    text: "Decline the request. Provide comment: 'Cannot add the fee lmpb/sseg is already on the bill'.",
    help: "Final action when Sort & Segregate charges already exist.",
    choices: []
  },

  move_to_vend: {
    text: "Move the bill to VEND queue. Select the appropriate error type:",
    help: "Unworkable bills must be routed to VEND with proper handling.",
    choices: [
      {
        label: "Manual Rate Error – Follow OS1",
        next: "vend_manual",
        icon: "fa-solid fa-calculator",
        desc: "Handle per OS1 job aid."
      },
      {
        label: "50+ Line Error – Follow 50+ lines job aid",
        next: "vend_lines",
        icon: "fa-solid fa-table-list",
        desc: "Handle per 50+ lines job aid."
      }
    ]
  },

  vend_manual: {
    text: "Move to VEND and follow OS1 for any error messages.",
    help: "Manual rate error handling.",
    choices: []
  },

  vend_lines: {
    text: "Move to VEND and follow the 50+ lines job aid.",
    help: "High line count handling.",
    choices: []
  },

  check_initial_request: {
    text: "Check the initial request in LMPB.",
    help: "Review the customer's Lumper fee request details.",
    image: "guides/PAUD%20Guides/lmpb-guide/images/lmpb-image3.png",
    choices: [
      {
        label: "Continue",
        next: "ask_terms",
        icon: "fa-solid fa-arrow-right",
        desc: "Determine billing terms per BOL."
      }
    ]
  },

  ask_terms: {
    text: "What is terms per BOL?",
    help: "Identify whether the shipment is Prepaid or True 3rd party to select correct Lumper keyword.",
    choices: [
      {
        label: "Prepaid",
        next: "final_prepaid",
        icon: "fa-solid fa-truck",
        desc: "Prepaid shipment – use LMPP."
      },
      {
        label: "True 3rd party",
        next: "final_third_party",
        icon: "fa-solid fa-building",
        desc: "3rd party shipment – use LMPB."
      }
    ]
  },

  final_prepaid: {
    text: "Add LMPP. Click autorate. Add CORR ACC and click Accept All.",
    help: "Final recommendation for Prepaid Lumper fee.",
    choices: []
  },

  final_third_party: {
    text: "Add LMPB. Click autorate. Add CORR ACC and click Accept All.",
    help: "Final recommendation for True 3rd party Lumper fee.",
    choices: []
  }

};
