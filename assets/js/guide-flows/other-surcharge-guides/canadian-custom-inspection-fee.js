/* =========================================================
   CANADIAN CUSTOM INSPECTION FEE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "canadian-custom-inspection-fee",
  title: "Canadian Custom Inspection Fee",
  startNode: "start",
  templateCollection: "canadian_custom_inspection_fee_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Canadian Custom Inspection Fee (CCIN) or CCIC",
    help: "Use this guide when handling customer inquiries or disputes related to Canadian Custom Inspection fees.",
    choices: [
      {
        label: "Continue",
        next: "customer_dispute_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to determine the customer's concern."
      }
    ]
  },

  customer_dispute_check: {
    text: "Customer disputing or asking about CCIN fee?",
    help: "Identify whether the customer inquiry is related to the Canadian Custom Inspection Fee.",
    choices: [
      {
        label: "Yes",
        next: "ccin_explanation",
        icon: "fa-solid fa-circle-check",
        desc: "The customer is asking or disputing the CCIN fee."
      },
      {
        label: "No",
        next: "not_related_ccin",
        icon: "fa-solid fa-circle-xmark",
        desc: "The concern is not related to CCIN."
      }
    ]
  },

  ccin_explanation: {
    text: "Reply to the Customer",
    help: "Provide the standard explanation for the Canadian Custom Inspection Fee.",
    note: "The Canadian Custom Inspection fee is a Random Gateway Inspection fee requested by Canadian customs that was performed at our Gateway terminal prior to clearing customs into Canada. This is a fee that is assessed to FXF LTL from the Canadian Customs and Border Protection agency for an offload from our truck for inspection prior to entering Canada. FedEx Freight has no control over charges incurred as a result of a customs inspection. Please contact your broker for additional information.\n\nNOTE: Please clarify to the customer that FedEx Freight does not control this charge and that they should contact their customs broker for further assistance. Also, provide the Offload Report if it is available or imaged on the PRO.",
    choices: []
  },

  not_related_ccin: {
    text: "Address the customer’s dispute if it is not related to the CCIN.",
    help: "Handle the concern using the appropriate process outside of CCIN handling.",
    choices: []
  }

};
