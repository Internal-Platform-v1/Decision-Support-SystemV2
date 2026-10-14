/* =========================================================
   PRO VALIDATION GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "information-validation-guide",
  title: "Verifying Tracking Number Guide",
  startNode: "start",
  templateCollection: "information_validation_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "PRO Validation Guide",
    help: "Use this guide to locate and validate a PRO number when it cannot be found in FBC or FBI, including tracking via fedex.com and determining whether the shipment is Freight or Parcel.",
    choices: [
      {
        label: "Continue",
        next: "pro_intro",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the PRO validation process."
      }
    ]
  },

  pro_intro: {
    text: "Can you open the PRO in FBC?",
    help: "Check if the PRO number exists in Freight Bill Copy (FBC) system.",
    choices: [
      {
        label: "Yes",
        next: "fbc_yes",
        icon: "fa-solid fa-circle-check",
        desc: "PRO found in FBC."
      },
      {
        label: "No",
        next: "check_fbi",
        icon: "fa-solid fa-circle-xmark",
        desc: "PRO not found in FBC – check FBI."
      }
    ]
  },

  fbc_yes: {
    text: "You may review the Invoice accordingly since it is a valid freight shipment.",
    help: "PRO exists in FBC – proceed with normal review.",
    choices: []
  },

  check_fbi: {
    text: "Can you open the PRO in FBI?",
    help: "Check if the PRO exists in Freight Billing Information (FBI) system.",
    choices: [
      {
        label: "Yes",
        next: "fbi_yes",
        icon: "fa-solid fa-circle-check",
        desc: "PRO found in FBI."
      },
      {
        label: "No",
        next: "fbi_no",
        icon: "fa-solid fa-circle-xmark",
        desc: "PRO not found in FBI – use fedex.com tracking."
      }
    ]
  },

  fbi_yes: {
    text: "Check the PRO if it is an AO Pro. If it is, update the RO in FBC to AO.",
    help: "PRO exists in FBI – verify if it's an AO (Agent Origin) PRO and update accordingly.",
    choices: []
  },

  fbi_no: {
    text: "Go to fedex.com and hover your mouse in United States, select English.",
    help: "Access fedex.com tracking for PRO lookup.",
    choices: [
      {
        label: "Proceed",
        next: "enter_tracking",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue to tracking number entry."
      }
    ]
  },

  enter_tracking: {
    text: "Put the tracking number in tracking number field to search the PRO number provided.",
    help: "Enter the PRO as a tracking number on fedex.com.",
    choices: [
      {
        label: "Next",
        next: "valid_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check validity of the PRO."
      }
    ]
  },

  valid_check: {
    text: "Is it valid?",
    help: "Determine if the PRO returns a valid tracking result.",
    choices: [
      {
        label: "Yes",
        next: "track_pro",
        icon: "fa-solid fa-circle-check",
        desc: "PRO is valid – track it."
      },
      {
        label: "No",
        next: "invalid_pro",
        icon: "fa-solid fa-circle-xmark",
        desc: "PRO is invalid – advise customer."
      }
    ]
  },

  invalid_pro: {
    text: "Advise the customer that the Invoice number provided is invalid and ask the correct Pro number so we can assist accordingly.",
    help: "Customer provided an incorrect PRO – request correct number.",
    choices: []
  },

  track_pro: {
    text: "Once you tracked the PRO number, go to Services in Shipment facts and check the Service type.",
    help: "Identify whether the shipment is Freight or Parcel.",
    choices: [
      {
        label: "Freight",
        next: "freight_flow",
        icon: "fa-solid fa-truck",
        desc: "Service type is Freight."
      },
      {
        label: "Parcel",
        next: "parcel_flow",
        icon: "fa-solid fa-box",
        desc: "Service type is Parcel."
      }
    ]
  },

  parcel_flow: {
    text: "If the service is included in the types of Parcel shipment, forward the email to billing@fedex.com since the invoice is a parcel PRO.",
    help: "Parcel shipments are handled by the billing team.",
    choices: []
  },

  freight_flow: {
    text: "Proceed to the next step if the service type is Freight.",
    help: "Freight shipment – continue to delivery status check.",
    choices: [
      {
        label: "Next",
        next: "delivered_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check delivery status."
      }
    ]
  },

  delivered_check: {
    text: "Has the shipment already been delivered?",
    help: "Determine delivery status before attempting invoice pull.",
    choices: [
      {
        label: "Yes",
        next: "delivered_issue",
        icon: "fa-solid fa-circle-check",
        desc: "Shipment delivered but invoice not found."
      },
      {
        label: "No",
        next: "pending_shipment",
        icon: "fa-solid fa-hourglass-half",
        desc: "Shipment not yet delivered."
      }
    ]
  },

  pending_shipment: {
    text: "If not yet delivered, it is a Pending shipment reason why you cannot pull up the Invoice. Advise the customer they will need to contact their local service center for update.",
    help: "Pending shipments cannot be invoiced until delivery.",
    choices: []
  },

  delivered_issue: {
    text: "If delivered but cannot pull up on FBC/FBI, send an email to Origin service center and provide the sample templates.",
    help: "Delivered but missing in systems – request investigation.",
    choices: [
      {
        label: "Show Template",
        next: "info_validation",
        icon: "fa-solid fa-envelope",
        desc: "Open email template for service center."
      }
    ]
  },

  info_validation: {
    text: "Information Validation Request — Email Template",
    help: "Use this template when emailing the Origin service center about a delivered shipment that cannot be located in FBC/FBI.",
    noteHtml: `<div style="font-size:13px; line-height:1.6; color:#20245c;">

<h2 style="margin:0 0 12px; font-size:16px; color:#4d148c;">📄 Information Validation Request</h2>

<p style="margin:0 0 10px;">Hi,</p>

<p style="margin:0 0 10px;">We are from Freight Revenue Services and are currently reviewing the above PRO. This shipment was picked up by your service center and moved to the destination center.</p>

<p style="margin:0 0 10px;">The customer is disputing the delivery, stating that the freight was delivered to a different address than what is listed on the Bill of Lading (BOL).</p>

<hr style="border:0; border-top:1px solid #e2e8f0; margin:14px 0;">

<h3 style="margin:0 0 8px; font-size:14px; color:#4d148c;">Request for Validation</h3>

<p style="margin:0 0 10px;">Please investigate and clarify why the shipment was not delivered to the BOL address below:</p>

<p style="margin:0 0 10px;"><strong>BOL CONSIGNEE ADDRESS:</strong><br>
Absolute Procurement<br>
9445 Southwest Ridder Road<br>
Wilsonville, OR 97070</p>

<hr style="border:0; border-top:1px solid #e2e8f0; margin:14px 0;">

<h3 style="margin:0 0 8px; font-size:14px; color:#4d148c;">Observed Delivery Details</h3>

<p style="margin:0 0 10px;">Based on the POD and invoice, the consignee address reflects:</p>

<p style="margin:0 0 10px;"><strong>ABSOLUTE COMPFORT HEATING</strong><br>
15886 Park Place Ct<br>
Oregon City, OR 97045-1144</p>

<hr style="border:0; border-top:1px solid #e2e8f0; margin:14px 0;">

<h3 style="margin:0 0 8px; font-size:14px; color:#4d148c;">Customer Dispute</h3>

<p style="margin:0 0 10px;">(Insert customer's exact dispute statement here)</p>

<hr style="border:0; border-top:1px solid #e2e8f0; margin:14px 0;">

<h3 style="margin:0 0 8px; font-size:14px; color:#4d148c;">Additional Details</h3>

<p style="margin:0 0 8px;">Please include any relevant findings such as:</p>

<ul style="margin:0 0 10px; padding-left:20px;">
  <li>Supporting documentation or absence of documentation</li>
  <li>Delivery instructions received</li>
  <li>Any reconsignment or address change</li>
  <li>Actions already taken</li>
  <li>Additional research or verification</li>
</ul>

<hr style="border:0; border-top:1px solid #e2e8f0; margin:14px 0;">

<p style="margin:0;">Thank you.</p>

</div>`,
    choices: []
  }

};
