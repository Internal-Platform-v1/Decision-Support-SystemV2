/* =========================================================
   HANDLING FEE GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "handling-fee-guide",
  title: "Handling Fee Guide",
  startNode: "start",
  templateCollection: "handling_fee_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Handling Fee Guide",
    help: "Validate Handling fee disputes by reviewing liftgate usage, loading/unloading requirements, assembly requests, and supporting documentation to determine if removal or validation is the appropriate action.",
    choices: [
      {
        label: "Continue",
        next: "handling_dispute_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Begin fee validation process."
      }
    ]
  },

  handling_dispute_check: {
    text: "Is the customer disputing the Handling fee?",
    help: "Determine if the customer is challenging the fee.",
    choices: [
      {
        label: "NO – No dispute",
        next: "handling_educate_no_dispute",
        icon: "fa-solid fa-check-circle",
        desc: "Educate customer on what the fee is for."
      },
      {
        label: "YES – Customer is disputing",
        next: "handling_liftgate_check",
        icon: "fa-solid fa-triangle-exclamation",
        desc: "Customer disputes the Handling fee."
      }
    ]
  },

  handling_educate_no_dispute: {
    text: "Educate the customer what the Handling fee is for.",
    help: "Provide a clear explanation of the Handling fee purpose.",
    choices: [
      {
        label: "Continue",
        next: "handling_liftgate_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check liftgate usage."
      }
    ]
  },

  handling_liftgate_check: {
    text: "Is liftgate used on Loading and unloading of the shipment?",
    help: "Verify if a liftgate was required and used for loading and/or unloading.",
    choices: [
      {
        label: "NO – Liftgate not used",
        next: "handling_check_comments",
        icon: "fa-solid fa-circle-xmark",
        desc: "Check for comments and assembly request."
      },
      {
        label: "YES – Liftgate used",
        next: "handling_valid_fee",
        icon: "fa-solid fa-truck-ramp-box",
        desc: "Fee is valid; educate customer."
      }
    ]
  },

  handling_valid_fee: {
    text: "The fee is valid. Please educate the customer.\n\nLoading:\nPlease be advised that the driver who pickup the shipment had to load with a liftgate and since he had to handle the freight, Handling loading charge was also billed. The fee is valid per FXF Rules Tariff 759 Section 12.2. Loading/Unloading: Pricing and terms of services related to FedEx Freight Volume Services assume that loading and unloading will be performed by Consignor or Consignee respectively. Should Carrier be required to perform loading or unloading services at origin or destination, an additional charge of $321.00 per hour or fraction thereof, subject to a minimum charge of $321.00, for loading and/or unloading will apply per incident.\n\nUnloading:\nPlease be advised that the driver who delivered the shipment had to unload with a liftgate and since he had to handle the freight, Handling unloading charge was also billed. The fee is valid per FXF Rules Tariff 759 Section 12.2. Loading/Unloading: Pricing and terms of services related to FedEx Freight Volume Services assume that loading and unloading will be performed by Consignor or Consignee respectively. Should Carrier be required to perform loading or unloading services at origin or destination, an additional charge of $321.00 per hour or fraction thereof, subject to a minimum charge of $321.00, for loading and/or unloading will apply per incident.",
    help: "The fee is valid. Provide the FXF Rules Tariff 759 Section 12.2 explanation to the customer.",
    choices: []
  },

  handling_check_comments: {
    text: "Check for comments and documents. Is there a request to assemble the shipment at point of Origin?",
    help: "Review comments and documents for any assembly request at origin.",
    choices: [
      {
        label: "YES – Assembly requested",
        next: "handling_valid_fee",
        icon: "fa-solid fa-check-circle",
        desc: "Fee is valid; educate customer."
      },
      {
        label: "NO – No assembly request",
        next: "handling_remove_fee",
        icon: "fa-solid fa-circle-minus",
        desc: "No support for fee; remove it."
      }
    ]
  },

  handling_remove_fee: {
    text: "Remove the Handling fee as there is no document to support it.",
    help: "No supporting documentation exists to justify the Handling fee. Remove the fee from the invoice.",
    choices: []
  }

};
