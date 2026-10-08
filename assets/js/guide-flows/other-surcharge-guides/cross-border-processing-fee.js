/* =========================================================
   CROSS-BORDER PROCESSING FEE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "cross-border-processing-fee",
  title: "Cross-Border Processing Fee",
  startNode: "start",
  templateCollection: "cross_border_processing_fee_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Cross-Border Processing Fee (BCFB)",
    help: "Review whether the shipment is moving between the United States and Canada before applying or removing the processing fee.",
    choices: [
      {
        label: "Continue",
        next: "cross_border_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Cross-Border Processing Fee guide."
      }
    ]
  },

  cross_border_check: {
    text: "Is the shipment moving between the United States and Canada?",
    help: "Check the shipment origin and destination to confirm if it is a cross-border movement.",
    choices: [
      {
        label: "Yes",
        next: "apply_cross_border_fee",
        icon: "fa-solid fa-circle-check",
        desc: "The shipment is cross-border."
      },
      {
        label: "No",
        next: "remove_cross_border_fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "The shipment is not cross-border."
      }
    ]
  },

  apply_cross_border_fee: {
    text: "Apply $50.00 processing fee per shipment (2026 Tariff Rates Item-748)",
    help: "Apply the Cross-Border Processing Fee when the shipment moves between the U.S. and Canada.",
    note: "Note: It depends on the shipment date; use the effective date of the tariff rules at that time.",
    image: "guides/Other%20Surcharge%20Guides/cross-border-processing-fee/images/cross-border-processing-image.png",
    choices: []
  },

  remove_cross_border_fee: {
    text: "Remove the Cross-Border Processing Fee per FXF Rules Tariff Item 748.",
    help: "Remove the fee when the shipment is not cross-border.",
    choices: []
  }

};
