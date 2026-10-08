/* =========================================================
   ZIP SERVICE CHARGE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "zip-service-charge",
  title: "Zip Service Charge",
  startNode: "start",
  templateCollection: "zip_service_charge_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Delivery Charge (DC01, DC02, DC03, DC04)",
    help: "Use this guide to validate whether a ZIP Service Delivery Charge applies.",
    choices: [
      {
        label: "Continue",
        next: "zip_area_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Start validation."
      }
    ]
  },

  zip_area_check: {
    text: "Is the delivery ZIP code within a designated surcharge area?",
    help: "Verify if the ZIP falls under a Delivery Charge zone.",
    choices: [
      {
        label: "Yes",
        next: "identify_area",
        icon: "fa-solid fa-circle-check",
        desc: "ZIP is within a surcharge area."
      },
      {
        label: "No",
        next: "remove_delivery_charge",
        icon: "fa-solid fa-circle-xmark",
        desc: "ZIP is not within a surcharge area."
      }
    ]
  },

  remove_delivery_charge: {
    text: "Remove the Delivery Charge applies.",
    help: "No surcharge should be applied.",
    choices: []
  },

  identify_area: {
    text: "Identify the Delivery Area",
    help: "Determine which surcharge zone the ZIP belongs to.",
    choices: [
      {
        label: "Williston / Minot, ND",
        next: "dc01",
        icon: "fa-solid fa-location-dot",
        desc: "DC01 area"
      },
      {
        label: "Midland / Odessa, TX & NM",
        next: "dc02",
        icon: "fa-solid fa-location-dot",
        desc: "DC02 area"
      },
      {
        label: "Navy Pier, Chicago, IL (60611)",
        next: "dc03",
        icon: "fa-solid fa-location-dot",
        desc: "DC03 area"
      },
      {
        label: "Puget Sound, WA",
        next: "dc04",
        icon: "fa-solid fa-location-dot",
        desc: "DC04 area"
      }
    ]
  },

  dc01: {
    text: "Williston / Minot, ND ZIPs",
    help: "Verify if the consignee’s or shipper’s ZIP code is listed.",
    note: "VERIFY if the consignee’s or shipper’s ZIP code is listed in the snippet or in FXF Rules Tariff Item 749.",
    image: "guides/Other%20Surcharge%20Guides/zip-service-charge/images/zip-service-charge-image.png",
    choices: [
      {
        label: "Continue",
        next: "dc01_result",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after verification."
      }
    ]
  },

  dc01_result: {
    text: "Apply $300.00 (DC01) (2026 Tariff Rates Item-748)",
    note: "Note: It depends on the shipment date; use the effective date of the tariff rules at that time.",
    choices: []
  },

  dc02: {
    text: "Midland / Odessa, TX & NM ZIPs",
    help: "Verify if the consignee’s or shipper’s ZIP code is listed.",
    note: "VERIFY if the consignee’s or shipper’s ZIP code is listed in the snippet or in FXF Rules Tariff Item 749.",
    image: "guides/Other%20Surcharge%20Guides/zip-service-charge/images/zip-service-charge-image.png",
    choices: [
      {
        label: "Continue",
        next: "dc02_result",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after verification."
      }
    ]
  },

  dc02_result: {
    text: "Apply $350.00 (DC02) (2026 Tariff Rates Item-748)",
    note: "Note: It depends on the shipment date; use the effective date of the tariff rules at that time.",
    choices: []
  },

  dc03: {
    text: "Navy Pier, Chicago, IL (ZIP 60611)",
    help: "Verify if the consignee’s or shipper’s ZIP code is listed.",
    note: "VERIFY if the consignee’s or shipper’s ZIP code is listed in the snippet or in FXF Rules Tariff Item 749.",
    image: "guides/Other%20Surcharge%20Guides/zip-service-charge/images/zip-service-charge-image.png",
    choices: [
      {
        label: "Continue",
        next: "dc03_result",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after verification."
      }
    ]
  },

  dc03_result: {
    text: "Apply $100.00 (DC03) (2026 Tariff Rates Item-748)",
    note: "Note: It depends on the shipment date; use the effective date of the tariff rules at that time.",
    choices: []
  },

  dc04: {
    text: "Puget Sound, WA ZIPs",
    help: "Verify if the consignee’s or shipper’s ZIP code is listed.",
    note: "VERIFY if the consignee’s or shipper’s ZIP code is listed in the snippet or in FXF Rules Tariff Item 749.",
    image: "guides/Other%20Surcharge%20Guides/zip-service-charge/images/zip-service-charge-image.png",
    choices: [
      {
        label: "Continue",
        next: "dc04_result",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after verification."
      }
    ]
  },

  dc04_result: {
    text: "Apply $424.00 (DC04) (2026 Tariff Rates Item-748)",
    note: "Note: It depends on the shipment date; use the effective date of the tariff rules at that time.",
    choices: []
  }

};
