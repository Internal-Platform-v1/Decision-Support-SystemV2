/* =========================================================
   LUMPER FEE GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "lumper-fee-guide",
  title: "Lumper Fee Guide",
  startNode: "start",
  templateCollection: "lumper_fee_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Lumper Fee - Handling Guide",
    help: "A lumper service is a third-party service that provides loading and/or unloading services at Customer's or Consignee's facility.",
    choices: [
      {
        label: "Continue",
        next: "lumper_note",
        icon: "fa-solid fa-arrow-right",
        desc: "View reminder note."
      }
    ]
  },

  lumper_note: {
    text: "Default Debtor: Freight Terms",
    help: "Review the overrides and Lumper service codes before proceeding.",
    noteHtml: `<div style="margin-bottom:10px;"><strong>NOTE: Overrides Sort and segregate fee</strong></div>
           <div style="margin-bottom:12px; padding:12px; border-radius:10px; background:#f8fafc; border:1px solid #e2e8f0;">
             <table style="width:100%; border-collapse:collapse; font-size:13px;">
               <thead>
                 <tr style="border-bottom:2px solid #cbd5e1;">
                   <th style="text-align:left; padding:6px 8px;"><strong>Keyword/Code</strong></th>
                   <th style="text-align:left; padding:6px 8px;"><strong>LUMPER SERVICE</strong></th>
                 </tr>
               </thead>
               <tbody>
                 <tr style="border-bottom:1px solid #e2e8f0;">
                   <td style="padding:6px 8px; font-weight:700;">LMPB</td>
                   <td style="padding:6px 8px;">Lumper Service</td>
                 </tr>
                 <tr style="border-bottom:1px solid #e2e8f0;">
                   <td style="padding:6px 8px; font-weight:700;">LMPP</td>
                   <td style="padding:6px 8px;">Lumper Service Prepaid</td>
                 </tr>
                 <tr>
                   <td style="padding:6px 8px; font-weight:700;">LMPC</td>
                   <td style="padding:6px 8px;">Lumper Service Collect</td>
                 </tr>
               </tbody>
             </table>
           </div>
           <div style="margin-top:12px;">
           </div>`,
    choices: [
      {
        label: "Continue",
        next: "lumper_fee_dispute_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to dispute validation."
      }
    ]
  },

  lumper_fee_dispute_check: {
    text: "Is the customer disputing the fee?",
    help: "Determine if the customer is challenging the Lumper fee.",
    choices: [
      {
        label: "YES – Customer is disputing",
        next: "lumper_fee_backup_check",
        icon: "fa-solid fa-triangle-exclamation",
        desc: "Customer disputes the Lumper fee."
      },
      {
        label: "NO – No dispute",
        next: "lumper_fee_explain_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Explain what the service is and confirm fee is valid."
      }
    ]
  },

  lumper_fee_backup_check: {
    text: "Is the customer asking for backup documents to support the fee?",
    help: "Check if the customer is requesting backup documentation for the Lumper fee.",
    choices: [
      {
        label: "YES – Requesting backup documents",
        next: "lumper_fee_backup_no",
        icon: "fa-solid fa-file-circle-question",
        desc: "Customer requests backup documentation."
      },
      {
        label: "NO – Not requesting backup",
        next: "lumper_fee_explain_valid_backup",
        icon: "fa-solid fa-check-circle",
        desc: "Explain the service and confirm fee is valid."
      }
    ]
  },

  lumper_fee_backup_no: {
    text: "Advise the customer that we do not have backup documentation for the fee. Instead, explain what the service is (see FXF Rules Tariff Item 579) and confirm that the fee is valid, as the shipper/consignee required the service for pickup/delivery.",
    help: "Provide the response template to the customer.",
    noteHtml: `<div style="margin-top:12px; padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #e2e8f0; white-space:pre-wrap;"><strong>Sample response template:</strong>

Hello,

Thank you for reaching out with your invoicing question.

At this time, we do not have backup documentation available for the Lumper fee on PRO xxxxx. However, this charge is valid, as it reflects a requested service. Specifically, this fee applies to services required by the shipper/consignee for pickup and/or delivery.

For more details, please refer to FXF Rules Tariff Item 579, which outlines the applicable service and charges.

If you have any additional questions, please feel free to reach out.

Thank you for choosing FedEx, FedEx Freight Inc - Invoicing Solutions</div>`,
    choices: []
  },

  lumper_fee_explain_valid_backup: {
    text: "Advise the customer what the service is (see FXF Rules Tariff Item 579) and confirm that the fee is valid, as the shipper/consignee required the service for pickup/delivery.",
    help: "Provide the response template to the customer.",
    noteHtml: `<div style="margin-top:12px; padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #e2e8f0; white-space:pre-wrap;"><strong>Sample response template:</strong>

Hello,

Thank you for reaching out with your invoicing question.

I have reviewed Lumper fee on PRO xxxx and it is valid, as it reflects a requested service. Specifically, this fee applies to services required by the shipper/consignee for pickup and/or delivery.

For more details, please refer to FXF Rules Tariff Item 579, which outlines the applicable service and charges.

If you have any additional questions, please feel free to reach out.

Thank you for choosing FedEx, FedEx Freight Inc - Invoicing Solutions</div>`,
    choices: []
  },

  lumper_fee_explain_valid: {
    text: "Advise the customer what the service is (see FXF Rules Tariff Item 579) and confirm that the fee is valid, as the shipper/consignee required the service for pickup/delivery.",
    help: "Provide the response template to the customer.",
    noteHtml: `<div style="margin-top:12px; padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #e2e8f0; white-space:pre-wrap;"><strong>Sample response template:</strong>

Hello,

Thank you for reaching out with your invoicing question.

I have reviewed Lumper fee on PRO xxxx and it is valid, as it reflects a requested service. Specifically, this fee applies to services required by the shipper/consignee for pickup and/or delivery.

For more details, please refer to FXF Rules Tariff Item 579, which outlines the applicable service and charges.

If you have any additional questions, please feel free to reach out.

Thank you for choosing FedEx, FedEx Freight Inc - Invoicing Solutions</div>`,
    choices: []
  }

};
