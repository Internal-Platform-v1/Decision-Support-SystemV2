/* =========================================================
   ALL SHORTS GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "all-shorts-guide",
  title: "All Shorts Guide",
  startNode: "start",
  templateCollection: "all_shorts_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "All Shorts Guide",
    help: "Handle All Short and Partial Short disputes by reviewing shipment history, claim status, LOA documentation, and piece/pallet counts to determine the correct resolution path.",
    choices: [
      {
        label: "Continue",
        next: "allshorts_request",
        icon: "fa-solid fa-arrow-right",
        desc: "Identify the request type."
      }
    ]
  },

  allshorts_request: {
    text: "What is the request?",
    help: "Determine if the dispute is for All Short or Partial Short.",
    choices: [
      {
        label: "All Short",
        next: "allshorts_billing_type",
        icon: "fa-solid fa-boxes",
        desc: "All Short dispute – no freight delivered."
      },
      {
        label: "Partial Short",
        next: "partialshort_start",
        icon: "fa-solid fa-box-open",
        desc: "Partial Short dispute – some freight delivered."
      }
    ]
  },

  /* ==================== ALL SHORT FLOW ==================== */

  allshorts_billing_type: {
    text: "Select the billing type:",
    help: "Identify the billing type of the shipment to follow the correct process.",
    choices: [
      {
        label: "Prepaid / 3rd Party / All Short (Open/Paid)",
        next: "allshorts_prepaid",
        icon: "fa-solid fa-credit-card",
        desc: "Prepaid or 3rd Party billing."
      },
      {
        label: "Collect / 3rd Party / All Short (Paid)",
        next: "allshorts_collect_paid",
        icon: "fa-solid fa-hand-holding-dollar",
        desc: "Collect or 3rd Party billing (Paid)."
      },
      {
        label: "Collect / 3rd Party / All Short (Open)",
        next: "allshorts_collect_open",
        icon: "fa-solid fa-file-invoice",
        desc: "Collect/3rd Party All Short with open status."
      }
    ]
  },

  /* ===== Prepaid / 3rd Party (Open/Paid) ===== */

  allshorts_prepaid: {
    text: "Check the Shipment History. Has a claim already been filed?",
    help: "Review the shipment history to determine if a claim has been filed.",
    choices: [
      {
        label: "YES – Claim already filed",
        next: "allshorts_claim_exists",
        icon: "fa-solid fa-file-lines",
        desc: "Claim exists; refer customer to claims."
      },
      {
        label: "NO – No claim filed",
        next: "allshorts_no_claim",
        icon: "fa-solid fa-circle-plus",
        desc: "No claim; direct customer to file."
      }
    ]
  },

  /* ===== Collect / 3rd Party (Paid) ===== */

  allshorts_collect_paid: {
    text: "Check the Shipment History. Has a claim already been filed?",
    help: "Review the shipment history to determine if a claim has been filed.",
    choices: [
      {
        label: "YES – Claim already filed",
        next: "allshorts_claim_exists",
        icon: "fa-solid fa-file-lines",
        desc: "Claim exists; refer customer to claims."
      },
      {
        label: "NO – No claim filed",
        next: "allshorts_no_claim",
        icon: "fa-solid fa-circle-plus",
        desc: "No claim; direct customer to file."
      }
    ]
  },

  allshorts_claim_exists: {
    text: "Reply to the customer:\nPlease be advised that PRO XXXXXX with Claim#0021110862 is being reviewed by the claims department. For updates, kindly reach out to file.freightclaim@fedex.com or contact Cargo Claims at 800-308-3963.",
    help: "Inform the customer that their claim is under review and provide contact information.",
    note: "Escalation Process for Claims - if customer states that they already processed a claim but didn't receive any update after it, forward the iSell email to Barbara, do not copy the customer, do not copy freightclaim email.",
    choices: []
  },

  allshorts_no_claim: {
    text: "Reply to the customer:\nFor further assistance, please submit a claim request via file.freightclaim@fedex.com or contact Cargo Claims at 800-308-3963.",
    help: "Direct the customer to submit a claim request.",
    note: "Escalation Process for Claims - if customer states that they already processed a claim but didn't receive any update after it, forward the iSell email to Barbara, do not copy the customer, do not copy freightclaim email.",
    choices: []
  },

  /* ===== Collect / 3rd Party (Open) – Who sent the dispute? ===== */

  allshorts_collect_open: {
    text: "Who sent the dispute?",
    help: "Identify who initiated the dispute to determine the correct response.",
    choices: [
      {
        label: "Sales Representative",
        next: "allshorts_sales_rep",
        icon: "fa-solid fa-user-tie",
        desc: "Dispute from Sales Representative."
      },
      {
        label: "Shipper / Consignee / Third Party",
        next: "allshorts_customer",
        icon: "fa-solid fa-user",
        desc: "Dispute from Shipper/Consignee/Third Party."
      }
    ]
  },

  /* ===== Sales Representative Path ===== */

  allshorts_sales_rep: {
    text: "Is there a LOA from Shipper stating that no freight or only 1 freight was shipped to the Consignee?",
    help: "Check if a Letter of Authority exists confirming shipment details.",
    choices: [
      {
        label: "YES – LOA exists",
        next: "allshorts_sales_loa_yes",
        icon: "fa-solid fa-check-circle",
        desc: "LOA exists; advise VOID request."
      },
      {
        label: "NO – LOA not available",
        next: "allshorts_sales_loa_no",
        icon: "fa-solid fa-circle-xmark",
        desc: "Request LOA from Shipper."
      }
    ]
  },

  allshorts_sales_loa_yes: {
    text: "Advise the Sales Representative that they can submit a VOID request and image the LOA under BOL for PRO XXXXXXXX.",
    help: "Sales Rep can submit VOID request with LOA attached.",
    choices: []
  },

  allshorts_sales_loa_no: {
    text: "Reply to the Sales Representative:\nPlease request for an LOA from the Shipper confirming that no freight was shipped for (Consignee name and address) on (include ship date). Once that is received you can submit a VOID request and image the LOA under BOL for PRO XXXXXXXX.",
    help: "Request LOA from Shipper before proceeding with VOID request.",
    choices: []
  },

  /* ===== Shipper/Consignee/Third Party Path ===== */

  allshorts_customer: {
    text: "Is there a LOA from Shipper stating that no freight or only 1 freight was shipped to the Consignee?",
    help: "Check if a Letter of Authority exists confirming shipment details.",
    choices: [
      {
        label: "YES – LOA exists",
        next: "allshorts_customer_loa_yes",
        icon: "fa-solid fa-check-circle",
        desc: "LOA exists; process request."
      },
      {
        label: "NO – LOA not available",
        next: "allshorts_customer_loa_no",
        icon: "fa-solid fa-circle-xmark",
        desc: "Request confirmation from customer."
      }
    ]
  },

  /* ===== YES – LOA exists ===== */

  allshorts_customer_loa_yes: {
    text: "Forward to imaging@fedex.com and request to image under BL for all PROs involved.",
    help: "Send the LOA to imaging@fedex.com to be imaged under the Bill of Lading for all PROs involved.",
    choices: [
      {
        label: "Continue",
        next: "allshorts_customer_loa_yes_comment",
        icon: "fa-solid fa-arrow-right",
        desc: "Enter FBC comment."
      }
    ]
  },

  allshorts_customer_loa_yes_comment: {
    text: "Once LOA is imaged, enter FBC Comment:\nVS-BLER-CASE#-PER COMPANY POLICY, REMOVE CHARGES ON FREIGHT PREPAID/COLLECT AND IS COMPLETE ALL SHORT PER DR. LOA ON FILE",
    help: "Enter the FBC comment after LOA is imaged.",
    choices: [
      {
        label: "Continue",
        next: "allshorts_customer_loa_yes_moveq",
        icon: "fa-solid fa-arrow-right",
        desc: "Enter VOID in queue and move Q."
      }
    ]
  },

  allshorts_customer_loa_yes_moveq: {
    text: "Enter VOID in the QUEUE field then click MOVE Q.",
    help: "Move the PRO to the VOID queue.",
    choices: [
      {
        label: "Continue",
        next: "allshorts_customer_loa_yes_pend",
        icon: "fa-solid fa-arrow-right",
        desc: "Pend the case."
      }
    ]
  },

  allshorts_customer_loa_yes_pend: {
    text: "Pend the case. Review PRO every day, once VOID is approved. Advise customer charges have been removed.",
    help: "Pend the case and monitor daily until VOID is approved.",
    choices: []
  },

  /* ===== NO – LOA not available ===== */

  allshorts_customer_loa_no: {
    text: "Select the appropriate reply for the customer.",
    help: "Choose the appropriate reply based on the customer's situation.",
    noteHtml: `
      <div style="margin-bottom:10px;">
        <strong>Option 1 – No freight shipped:</strong><br>
        To further process your request, please send us a confirmation stating that no freight was shipped for (Consignee name and address) on (include ship date) for PRO XXXXXXXX.
      </div>
      <div style="margin-bottom:10px;">
        <strong>Option 2 – Only 1 shipment (different BOL signatures):</strong><br>
        To further process your request, please send us a confirmation stating you shipped only one shipment for (Consignee name and address) on (include ship date) as the driver signature is different at the bottom of each BOL which means that 2 BOL's were tendered to FedEx.
      </div>
      <div style="margin-bottom:10px;">
        <strong>Option 3 – Only 1 shipment (different DR signatures):</strong><br>
        To further process your request, please send us a confirmation stating you shipped only one shipment for (Consignee name and address) on (include ship date) as the both DR's had different signatures which means both freighters were delivered and received.
      </div>`,
    choices: [
      {
        label: "Continue",
        next: "allshorts_customer_loa_yes",
        icon: "fa-solid fa-arrow-right",
        desc: "Once LOA is received, follow this."
      }
    ]
  },

  allshorts_customer_loa_received: {
    text: "Once LOA is received follow this:\nProceed with processing the request based on the confirmation received.",
    help: "Continue with the appropriate action once LOA is received.",
    choices: []
  },

  /* ==================== PARTIAL SHORT FLOW ==================== */

  partialshort_start: {
    text: "Check the number of PCS/pallets delivered and the total weight.",
    help: "Verify the delivered pieces/pallets and total weight from the delivery receipt.",
    choices: [
      {
        label: "Continue",
        next: "partialshort_calc_weight",
        icon: "fa-solid fa-arrow-right",
        desc: "Calculate weight per piece/pallet."
      }
    ]
  },

  partialshort_calc_weight: {
    text: "Determine the weight per piece or per pallet by dividing the total shipment weight by the total number of pieces or pallets.",
    help: "Calculate the weight per unit based on the original shipment weight and total pieces/pallets.",
    choices: [
      {
        label: "Continue",
        next: "partialshort_multiply",
        icon: "fa-solid fa-arrow-right",
        desc: "Calculate total delivered weight."
      }
    ]
  },

  partialshort_multiply: {
    text: "Multiply the number of delivered pieces or pallets by the corresponding weight per piece or pallet to determine the total delivered weight.",
    help: "Calculate the total delivered weight based on delivered units.",
    choices: [
      {
        label: "Continue",
        next: "partialshort_final",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply final recommendation."
      }
    ]
  },

  partialshort_final: {
    text: "Update the piece/pallet count and total weight on the invoice to reflect the delivered items only.",
    help: "Update the invoice with the corrected piece count and weight based on delivered items.",
    choices: []
  }

};
