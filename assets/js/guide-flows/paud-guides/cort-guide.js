/* =========================================================
   CORT – RECONSIGNMENT GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "cort-guide",
  title: "CORT – Reconsignment Guide",
  startNode: "start",
  templateCollection: "cort_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "CORT Guide",
    help: "CORT typically comes from reconsignment from CRAU. Review CORT requests, verify new pro numbers, validate weight and piece count, and ensure correct customer center billing.",
    choices: [
      {
        label: "Continue",
        next: "cort_intro",
        icon: "fa-solid fa-arrow-right",
        desc: "Begin CORT review process."
      }
    ]
  },

  cort_intro: {
    text: "Typically Request you will get on CORT are like this:",
    image: "guides/PAUD%20Guides/cort-guide/images/cort-image1.png",
    help: "Review the CORT request carefully to understand the reconsignment scenario.",
    choices: [
      {
        label: "Continue",
        next: "cort_verify_newp",
        icon: "fa-solid fa-arrow-right",
        desc: "Verify new pro number."
      }
    ]
  },

  cort_verify_newp: {
    text: "Verify new pro # has been cut. Select freight bill inquiry to get NEWP from the signature field.",
    image: "guides/PAUD%20Guides/cort-guide/images/cort-image2.png",
    help: "Check the signature field or freight bill inquiry to locate the NEWP (new pro number) that was cut for the reconsignment.",
    choices: [
      {
        label: "Continue",
        next: "cort_check_weights",
        icon: "fa-solid fa-arrow-right",
        desc: "Check weight and piece count."
      }
    ]
  },

  cort_check_weights: {
    text: "On FBI make sure to check that the weight and piece count is the same as the original pro. Check to make sure that the new pro was billed from the correct customer center. Everything must match before we go to next step.",
    help: "Verify that the weight and piece count match the original PRO. Also confirm the new PRO was billed from the correct customer center.",
    choices: [
      {
        label: "YES – Weights match",
        next: "cort_scan_accessorials",
        icon: "fa-solid fa-circle-check",
        desc: "Weights and piece count match."
      },
      {
        label: "NO – Weights don't match",
        next: "cort_verify_reweigh",
        icon: "fa-solid fa-triangle-exclamation",
        desc: "Weights do not match; investigate."
      }
    ]
  },

  cort_verify_reweigh: {
    text: "If weights do not match, verify if a reweigh was done.",
    help: "Check if a reweigh was performed on the shipment. This may affect the weight validation.",
    choices: [
      {
        label: "YES – Reweigh was done",
        next: "cort_scan_accessorials",
        icon: "fa-solid fa-circle-check",
        desc: "Reweigh completed; proceed."
      },
      {
        label: "NO – No reweigh done",
        next: "cort_investigate_reconsignment",
        icon: "fa-solid fa-circle-exclamation",
        desc: "Investigate possible partial reconsignment."
      }
    ]
  },

  cort_investigate_reconsignment: {
    text: "If no reweigh was done and weight does not match, this must be investigated. This could be a partial reconsignment. If so, the original pro must be stopped in transit and two new pro #'s will need to be cut, one to show the actual pieces and weight being sent to the original consignee and a new pro showing where the other part of the freight is being sent.",
    help: "Stop the original PRO in transit and cut two new PRO numbers—one for the original consignee and one for the diverted portion.",
    choices: [
      {
        label: "Continue",
        next: "cort_scan_accessorials",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after handling reconsignment."
      }
    ]
  },

  cort_scan_accessorials: {
    text: "If everything matches up, scan the hu/keyword line for any accessorials that were going to be applied. Next, scan hu/keyword line for NEWP keyword.",
    help: "Review the hu/keyword line for accessorial charges and check for the NEWP keyword.",
    choices: [
      {
        label: "Continue",
        next: "cort_check_newp",
        icon: "fa-solid fa-arrow-right",
        desc: "Check and update NEWP keyword."
      }
    ]
  },

  cort_check_newp: {
    text: "If not already entered, go to the hu/keyword field and type in NEWP and after system moves you over to description field type in the new pro # that was cut. If the system has auto-populated OLDP keyword in error, you will need the OLDP keyword updated to NEWP.",
    help: "Add NEWP keyword with the new PRO number, or correct OLDP to NEWP if populated in error.",
    choices: [
      {
        label: "NEWP not entered – Add it",
        next: "cort_add_newp",
        icon: "fa-solid fa-plus-circle",
        desc: "Add NEWP keyword with new PRO number."
      },
      {
        label: "OLDP populated in error – Update",
        next: "cort_update_oldp",
        icon: "fa-solid fa-pen-to-square",
        desc: "Change OLDP to NEWP."
      },
      {
        label: "NEWP already correct",
        next: "cort_auto_rate",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed to AUTO RATE."
      }
    ]
  },

  cort_add_newp: {
    text: "Type NEWP – system tabs over to description field – enter the new pro number.",
    help: "Enter NEWP in the hu/keyword field and the new PRO number in the description field.",
    choices: [
      {
        label: "Continue",
        next: "cort_auto_rate",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to AUTO RATE."
      }
    ]
  },

  cort_update_oldp: {
    text: "Update OLDP keyword to NEWP and enter the new pro number in the description field.",
    help: "Change the incorrect OLDP keyword to NEWP and add the new PRO number.",
    choices: [
      {
        label: "Continue",
        next: "cort_auto_rate",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to AUTO RATE."
      }
    ]
  },

  cort_auto_rate: {
    text: "AUTO RATE",
    help: "Apply AUTO RATE to finalize the correction.",
    choices: []
  }

};
