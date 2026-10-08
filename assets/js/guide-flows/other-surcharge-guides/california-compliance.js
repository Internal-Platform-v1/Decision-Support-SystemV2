/* =========================================================
   CALIFORNIA COMPLIANCE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "california-compliance",
  title: "California Compliance",
  startNode: "start",
  templateCollection: "california_compliance_template"
};

window.GUIDE_NODES = {

  start: {
    text: "California Compliance Surcharge (CCSC)",
    help: "Review whether the shipment is moving to, from, or within California before applying or removing the surcharge.",
    choices: [
      {
        label: "Continue",
        next: "california_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the California Compliance Surcharge guide."
      }
    ]
  },

  california_check: {
    text: "Is the shipment moving TO, FROM, or WITHIN California?",
    help: "Check the shipment origin and destination details before proceeding.",
    choices: [
      {
        label: "Yes",
        next: "apply_ccsc",
        icon: "fa-solid fa-circle-check",
        desc: "The shipment is moving to, from, or within California."
      },
      {
        label: "No",
        next: "remove_ccsc",
        icon: "fa-solid fa-circle-xmark",
        desc: "The shipment is not moving to, from, or within California."
      }
    ]
  },

  apply_ccsc: {
    text: "Apply $26.50 CCSC per shipment (2026 Tariff Rates Item-748)",
    help: "Apply the California Compliance Surcharge when the shipment is moving to, from, or within California.",
    note: "Note: It depends on the shipment date; use the effective date of the tariff rules at that time.",
    image: "guides/Other%20Surcharge%20Guides/california-compliance/california-compliance-image.png",
    choices: []
  },

  remove_ccsc: {
    text: "Remove the California Compliance Fee per FXF Rules Tariff Item 748.",
    help: "Remove the surcharge when the shipment is not moving to, from, or within California.",
    choices: []
  }

};
