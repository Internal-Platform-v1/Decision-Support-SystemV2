/* =========================================================
   RECYCLED PRO GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "recycled-pro-guide",
  title: "Recycled Pro Guide",
  startNode: "start",
  templateCollection: "recycled_pro_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Recycled PRO — Validation Process",
    help: "Start the recycled PRO validation process.",
    choices: [
      {
        label: "Continue",
        next: "pull_up_pro",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the recycled PRO validation process."
      }
    ]
  },

  pull_up_pro: {
    text: "Pull up the PRO in Freight Bill Inquiry. You will see that the PRO is a recently shipped PRO by the date that is listed next to the Terms.",
    help: "Locate the PRO and note the recent shipment date next to the Terms.",
    choices: [
      {
        label: "Continue",
        next: "click_history_icon",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the History Icon step."
      }
    ]
  },

  click_history_icon: {
    text: `Then you will click the History Icon <img src="guides/Other%20Guides/recycled-pro-guide/images/history-icon.png" style="height:54px; width:auto; margin-left:8px; vertical-align:middle; border-radius:6px;">`,
    help: "Click the History Icon to view the PRO version history.",
    choices: [
      {
        label: "Continue",
        next: "freight_bill_variables",
        icon: "fa-solid fa-arrow-right",
        desc: "Open the Freight Bill Variables page."
      }
    ]
  },

  freight_bill_variables: {
    text: "This will take you to a Freight Bill Variables page and you will see that there is old dates listed that are years and years old.",
    image: "guides/Other%20Guides/recycled-pro-guide/images/freight-bill-variables.png",
    help: "Review the old dates and version history on the Freight Bill Variables page.",
    choices: [
      {
        label: "Continue",
        next: "ar_payment_ref_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after reviewing the old dates and version history."
      }
    ]
  },

  ar_payment_ref_check: {
    text: "Recycled PROs like this will show very old AR PAYMENT/REF information.",
    help: "Check for very old AR PAYMENT/REF information associated with the PRO.",
    choices: [
      {
        label: "Continue",
        next: "manual_rate_invoice",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the invoice comparison step."
      }
    ]
  },

  manual_rate_invoice: {
    text: "If there is a previous adjustment on PRO, manually rate the Invoice to the previous version to reclose the bill.",
    help: "If a previous adjustment exists, manually rate the invoice to the previous version.",
    choices: [
      {
        label: "Continue",
        next: "email_origin_center",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to the origin center email instruction."
      }
    ]
  },

  email_origin_center: {
    text: "For the mean time, send an email to the Origin Center to provide the issue regarding the recycled PRO and request for a new PRO for the most recent shipment. If the recycled PRO has an old version that you can use as reference, you can manually update the PRO matching the information of the old version.",
    help: "Send an email to the Origin Center regarding the recycled PRO and request a new PRO for the most recent shipment. If there is an old version available, manually update the PRO using the old version information as reference.",
    choices: []
  }

};
