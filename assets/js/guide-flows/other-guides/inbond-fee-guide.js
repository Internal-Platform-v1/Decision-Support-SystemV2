/* =========================================================
   INBOND FEE GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "inbond-fee-guide",
  title: "Inbond Fee Guide",
  startNode: "start",
  templateCollection: "inbond_fee_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Inbond Fee Guide",
    help: "Validate Inbond fee disputes by reviewing BOL documentation, Cargo Care indicators, and Pro comments to determine if removal or validation is the appropriate action.",
    choices: [
      {
        label: "Continue",
        next: "inbond_dispute_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Begin fee validation process."
      }
    ]
  },

  inbond_dispute_check: {
    text: "Is the customer disputing the Inbond fee?",
    help: "Determine if the customer is challenging the fee.",
    choices: [
      {
        label: "YES – Customer is disputing",
        next: "inbond_check_document",
        icon: "fa-solid fa-triangle-exclamation",
        desc: "Customer disputes the Inbond fee."
      },
      {
        label: "NO – No dispute",
        next: "inbond_fee_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Fee is valid; advise customer."
      }
    ]
  },

  inbond_check_document: {
    text: "Is there any document on the BOL or in Cargo Care indicating that a shipment is in-bond?",
    help: "Check the Bill of Lading image and Cargo Care records for any reference to in-bond status.",
    choices: [
      {
        label: "YES – Document exists",
        next: "inbond_fee_valid",
        icon: "fa-solid fa-file-circle-check",
        desc: "Documentation supports the fee."
      },
      {
        label: "NO – No document found",
        next: "inbond_check_comment",
        icon: "fa-solid fa-file-circle-exclamation",
        desc: "Check Pro comments for notes."
      }
    ]
  },

  inbond_check_comment: {
    text: "Are there any comments or notes indicating that the shipment is in-bond?",
    help: "Review the Pro comments for any remarks that support the Inbond fee.",
    choices: [
      {
        label: "YES – Comments exist",
        next: "inbond_fee_valid",
        icon: "fa-solid fa-comment-dots",
        desc: "Comments support the fee."
      },
      {
        label: "NO – No comments found",
        next: "inbond_remove_fee",
        icon: "fa-solid fa-circle-minus",
        desc: "No support for fee; proceed with removal."
      }
    ]
  },

  inbond_fee_valid: {
    text: "Advise the customer that the fee is valid. You may provide the documents as a proof that the Inbond fee is valid.",
    help: "Provide the supporting documentation (BOL, Cargo Care, or Pro comments) to the customer as proof.",
    choices: []
  },

  inbond_remove_fee: {
    text: "You may proceed on removing the Inbond fee as there is no any document or comments on the Pro to support the Inbond fee.",
    help: "Remove the Inbond fee from the invoice. No supporting documentation exists to justify the charge.",
    choices: []
  }

};
