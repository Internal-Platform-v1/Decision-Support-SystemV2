/* =========================================================
   STORAGE FEE GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "storage-fee-guide",
  title: "Storage Fee Guide",
  startNode: "start",
  templateCollection: "storage_fee_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Storage Fee Guide",
    help: "When freight is held in FedEx possession by reason or act or omission of Shipper/Consignee or Owner, or for custom clearance or inspection, such freight will be considered stored and charges per shipment will apply.",
    choices: [
      {
        label: "Continue",
        next: "storage_check_documents",
        icon: "fa-solid fa-arrow-right",
        desc: "Begin storage fee validation process."
      }
    ]
  },

  storage_check_documents: {
    text: "Are there any supporting documents (typically under CC or BL), such as a Legal Notice of Refusal or On‑Hand Freight?",
    help: "Check Cargo Care and the Bill of Lading for any supporting documents.",
    choices: [
      {
        label: "YES – Documents exist",
        next: "storage_dispute_type",
        icon: "fa-solid fa-check-circle",
        desc: "Documents support the storage fee."
      },
      {
        label: "NO – No documents found",
        next: "storage_no_documents",
        icon: "fa-solid fa-file-circle-exclamation",
        desc: "No supporting documents found."
      }
    ]
  },

  /* ===== DISPUTE TYPE ===== */
  storage_dispute_type: {
    text: "What is the customer's dispute regarding the storage fee?",
    help: "Identify the type of dispute to follow the correct resolution path.",
    choices: [
      {
        label: "VALIDITY / NEED MORE INFO",
        next: "storage_validity",
        icon: "fa-solid fa-circle-question",
        desc: "Fee is valid; advise customer."
      },
      {
        label: "CALCULATION",
        next: "storage_calculation",
        icon: "fa-solid fa-calculator",
        desc: "Customer disputes the calculation."
      },
      {
        label: "FEDEX FAULT",
        next: "storage_fedex_fault",
        icon: "fa-solid fa-triangle-exclamation",
        desc: "Customer claims it's FedEx's fault."
      }
    ]
  },

  /* ===== VALIDITY / NEED MORE INFO ===== */
  storage_validity: {
    text: "Advise the customer regarding the storage fee in accordance with the FXF Rules Tariff. See sample response below:",
    help: "Provide the sample response template to the customer explaining the storage fee policy.",
    noteHtml: `<div style="margin-top:12px; padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #e2e8f0; white-space:pre-wrap;"><strong>Sample response template:</strong>

Hello,

My name is [######], and I am here to assist you with your dispute.

The storage fee on Invoice [##########] has been reviewed and deemed valid based on the supporting documents on file. Additionally, when freight is held in FedEx's possession due to the act or omission of the shipper, consignee, or owner, or for customs clearance or inspection, such freight will be considered stored, and charges per shipment will apply.

For more information on storage fees, please refer to our FXF 100-W Rules Tariff, Item 910.

Thank you for choosing FedEx, and we hope you have a great day.
FedEx Freight, Inc. – Invoicing Solutions</div>`,
    choices: []
  },

  /* ===== CALCULATION FLOW ===== */
  storage_calculation: {
    text: "Review Sample PRO: 8487660392",
    help: "Review the sample calculation and compare with the PRO.",
    noteHtml: `<div style="margin-top:12px; padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #e2e8f0; white-space:pre-wrap;"><strong>Sample PRO: 8487660392</strong>

Weight is 1,500LBS
Per Cargo Care, On Hand notice was sent on 1/30/2026 (FRI)
Delivery date: 02/09/2026
Length of time the freight was stored: 5 days
  a. Storage fees start at 12:01 the first business day after the notice is sent.
  b. Storage is not charged for the day the freight is delivered.
  c. Storage is not charged on non-business days.

$6.03 per cwt. per each 24 hours, subject to the following minimum and maximum charges:
a. Minimum charge, LTL, $59.00 per shipment per each 24 hours, but not less than $210.00 per shipment -> 2026 rate per FXF Rules Tariff

Calculation:
1,500 (weight) / 100 = 15 CWT
15 x $6.03 = $90.45
$90.45 x 5 days = $452.25 STORAGE FEE</div>`,
    choices: [
      {
        label: "Continue",
        next: "storage_calculation_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Verify if the calculation is correct."
      }
    ]
  },

  storage_calculation_check: {
    text: "Is the storage fee calculation on the PRO correct?",
    help: "Compare the PRO's storage fee with the calculated amount.",
    choices: [
      {
        label: "YES – Calculation is correct",
        next: "storage_calculation_yes",
        icon: "fa-solid fa-check-circle",
        desc: "Advise customer accordingly."
      },
      {
        label: "NO – Calculation is incorrect",
        next: "storage_calculation_no",
        icon: "fa-solid fa-pen-to-square",
        desc: "Manually update the fee."
      }
    ]
  },

  storage_calculation_yes: {
    text: "Advise the customer accordingly and provide the calculation.",
    help: "Provide the customer with the calculation breakdown showing how the storage fee was determined.",
    choices: []
  },

  storage_calculation_no: {
    text: "Manually update the fee per the correct calculation.",
    help: "Recalculate the storage fee using the correct formula and update the PRO.",
    choices: []
  },

  /* ===== FEDEX FAULT FLOW ===== */
  storage_fedex_fault: {
    text: "Contact the destination center to verify and confirm if this is indeed FedEx's fault.",
    help: "Reach out to the destination center for confirmation.",
    choices: [
      {
        label: "Continue",
        next: "storage_fedex_fault_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check center confirmation."
      }
    ]
  },

  storage_fedex_fault_check: {
    text: "Did the center confirm that it was FedEx's fault?",
    help: "Verify the center's response regarding fault.",
    choices: [
      {
        label: "YES – FedEx fault confirmed",
        next: "storage_fedex_fault_yes",
        icon: "fa-solid fa-check-circle",
        desc: "Reach out to TL for write-off approval."
      },
      {
        label: "NO – Not FedEx's fault",
        next: "storage_fedex_fault_no",
        icon: "fa-solid fa-circle-xmark",
        desc: "Advise customer fee is valid."
      }
    ]
  },

  storage_fedex_fault_yes: {
    text: "Reach out to your TL for write-off approval.",
    help: "Contact your team lead to approve the write-off for the storage fee.",
    choices: []
  },

  storage_fedex_fault_no: {
    text: "Advise the customer that the Storage fee is valid and provide the response of the center.",
    help: "Inform the customer that the storage fee is valid based on the center's confirmation.",
    choices: []
  },

  /* ===== NO FLOW (CORRECTED) ===== */
  storage_no_documents: {
    text: "Reach out to the destination center first to verify the storage fee and request the backup documents to support the validity of the storage fee.",
    help: "Contact the destination center to obtain supporting documents.",
    choices: [
      {
        label: "Continue",
        next: "storage_no_documents_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check if center provided documents."
      }
    ]
  },

  storage_no_documents_check: {
    text: "Has the center provided any supporting documents?",
    help: "Verify if the center has supplied supporting documentation.",
    choices: [
      {
        label: "YES – Documents provided",
        next: "storage_no_documents_yes",
        icon: "fa-solid fa-check-circle",
        desc: "Fee is valid; advise customer."
      },
      {
        label: "NO – No documents provided",
        next: "storage_no_documents_no",
        icon: "fa-solid fa-circle-xmark",
        desc: "Remove the Storage fee."
      }
    ]
  },

  storage_no_documents_yes: {
    text: "Storage fee is valid. Advise the customer accordingly.",
    help: "Inform the customer that the storage fee is valid based on the supporting documents.",
    choices: []
  },

  storage_no_documents_no: {
    text: "Remove the Storage fee.",
    help: "No supporting documentation exists to justify the storage fee. Remove the fee from the invoice.",
    choices: []
  }

};
