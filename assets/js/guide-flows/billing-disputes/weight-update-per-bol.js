/* =========================================================
   WEIGHT UPDATE PER BOL — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "weight-update-per-bol",
  title: "Weight Update per BOL",
  startNode: "start",
  templateCollection: "weight_update_per_bol_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Weight Update per BOL - General Guide",
    help: "Use this guide to route weight-related disputes correctly based on the customer’s concern, bill details, reweigh documentation, BOL weight, and pallet weight information.",
    note: "Always review the BOL, bill body, available certificates, and supporting documents before deciding where the case should be handled.",
    choices: [
      {
        label: "Continue",
        next: "bol_intro",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Reweigh / Weight Update decision flow."
      }
    ]
  },

  bol_intro: {
    text: "What is the customer's dispute?",
    choices: [
      { label: "Deficit Weight", next: "bol_deficit", icon: "fa-solid fa-scale-balanced", desc: "Customer is disputing deficit weight." },
      { label: "Pallet Rates", next: "bol_pallet_rates", icon: "fa-solid fa-pallet", desc: "Customer is disputing pallet rates." },
      { label: "Weight Update", next: "bol_weight_update", icon: "fa-solid fa-weight-scale", desc: "Customer is requesting or disputing a weight update." },
      { label: "Pallet Weight", next: "bol_pallet_weight", icon: "fa-solid fa-boxes-stacked", desc: "Customer is disputing pallet weight handling." }
    ]
  },

  bol_deficit: {
    text: "Send 'Deficit Weight Dispute Email Template' on OS.",
    choices: []
  },

  bol_pallet_rates: {
    text: "Move the case to Pricing Queue.",
    choices: []
  },

  bol_weight_update: {
    text: "Check the body of the bill.",
    help: "Review the bill body for existing handling indicators before deciding where the case should go.",
    choices: [
      { label: "ADIM / CAPL / CCD present", next: "bol_freight_review", icon: "fa-solid fa-clipboard-check", desc: "Bill contains ADIM, CAPL, or CCD." },
      { label: "TLX / TLS / CONT present", next: "bol_dispute_resolution", icon: "fa-solid fa-file-circle-exclamation", desc: "Bill contains TLX, TLS, or CONT." },
      { label: "Reweigh Certificate available", next: "bol_reweigh_review", icon: "fa-solid fa-certificate", desc: "A reweigh certificate is available." },
      { label: "None of the above", next: "bol_weight_noted", icon: "fa-solid fa-circle-question", desc: "No listed indicator is present." }
    ]
  },

  bol_freight_review: {
    text: "Move the case to Freight Inspection Review.",
    choices: []
  },

  bol_dispute_resolution: {
    text: "Move the case to Dispute Resolution.",
    choices: []
  },

  bol_reweigh_review: {
    text: "Move the case to Reweigh Review.",
    choices: []
  },

  bol_weight_noted: {
    text: "Was the weight noted on BOL?",
    help: "Check whether the BOL clearly shows the shipment weight.",
    choices: [
      { label: "Yes", next: "bol_customer_request", icon: "fa-solid fa-circle-check", desc: "Weight is noted on the BOL." },
      { label: "No", next: "bol_request_docs", icon: "fa-solid fa-circle-xmark", desc: "Weight is not noted on the BOL." }
    ]
  },

  bol_customer_request: {
    text: "Is the customer requesting to apply the weight per BOL?",
    choices: [
      { label: "Yes", next: "bol_apply_weight", icon: "fa-solid fa-circle-check", desc: "Customer wants the BOL weight applied." },
      { label: "No", next: "bol_request_docs", icon: "fa-solid fa-circle-xmark", desc: "Customer is not requesting BOL weight application." }
    ]
  },

  bol_apply_weight: {
    text: "Apply weight per BOL.",
    choices: []
  },

  bol_request_docs: {
    text: "Ask for supporting documents showing the correct weight of the item shipped.",
    choices: []
  },

  bol_pallet_weight: {
    text: "Was pallet weight noted on BOL?",
    help: "Check whether the pallet weight is specifically documented on the BOL.",
    choices: [
      { label: "Yes", next: "bol_deduct_pallet", icon: "fa-solid fa-circle-check", desc: "Pallet weight is noted on the BOL." },
      { label: "No", next: "bol_customer_exception", icon: "fa-solid fa-circle-xmark", desc: "Pallet weight is not noted on the BOL." }
    ]
  },

  bol_deduct_pallet: {
    text: "Deduct the pallet weight from the item weight. Total weight should include pallet weight.",
    choices: []
  },

  bol_customer_exception: {
    text: "Did the customer mention anything regarding pallet weight exception?",
    choices: [
      { label: "No", next: "bol_advise_not_noted", icon: "fa-solid fa-circle-xmark", desc: "No pallet weight exception was mentioned." },
      { label: "Yes", next: "bol_move_pricing", icon: "fa-solid fa-circle-check", desc: "Customer mentioned a pallet weight exception." }
    ]
  },

  bol_advise_not_noted: {
    text: "Advise customer that pallet weight is not noted on BOL.",
    choices: []
  },

  bol_move_pricing: {
    text: "Move the case to Pricing Queue.",
    choices: []
  }

};
