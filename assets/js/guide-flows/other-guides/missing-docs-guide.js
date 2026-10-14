/* =========================================================
   MISSING DOCUMENTS GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "missing-docs-guide",
  title: "Missing Documents Guide",
  startNode: "start",
  templateCollection: "missing_docs_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Missing Documents Guide",
    help: "Start with key reminders...",
    choices: [
      {
        label: "Continue",
        next: "reminder_intro",
        icon: "fa-solid fa-arrow-right",
        desc: "Open reminders and notes."
      }
    ]
  },

  reminder_intro: {
    text: "Reminders & Notes",
    help: "Review important document lookup...",
    noteHtml: `<div style="margin-bottom:14px;"><div style="font-weight:800; font-size:13px; color:#475569; margin-bottom:10px;">⚠ REMINDERS</div><ul style="margin:0; padding-left:18px;"><li>Ensure that you have attempted to locate the document in Image Viewer: <a href="http://imaging.freight.fedex.com/Viewer/Home.aspx" target="_blank" style="color:#4D148C;text-decoration:none;font-weight:600;">Image Viewer</a></li><li><strong>ATTENTION:</strong> Once a missing document is retrieved, send to <strong>imaging@fedex.com</strong></li><li>For PROs >180 days, access via EDM 1.0: <a href="https://myapps.secure.fedex.com/EDMPortal/" target="_blank">EDM 1.0</a></li><li>For Document Requests for PROs >90 days, proceed to Invoice Reprint.</li></ul></div><div style="margin-top:16px;"><div style="font-weight:800; font-size:13px; margin-bottom:10px;">📌 NOTE</div><p>If customer disputes charges and wants rebill to another party per BOL but BOL missing:</p><ul><li>Utilize previous shipments</li><li>Use Shipper Code, Consignee Code, Bill-To Code, or Origin/Destination</li><li>Prefer paid/closed PROs</li></ul><p><strong>When rebilling, add keyword:</strong></p><div style="background:#fff;border:1px dashed #ccc;padding:10px;border-radius:10px;font-size:12px;">VS-BLER-CASE#-UPDATED BT XXXXXXXX PER PREVIOUS SHIPMENTS<br>E.G. PRO XXXXXXX IN ATTEMPT FOR PAYMENT SINCE NO BOL ON FILE</div></div>`,
    choices: [
      {
        label: "Proceed to Missing Documents Guide",
        next: "missing_docs_intro",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the missing documents flow."
      }
    ]
  },

  missing_docs_intro: {
    text: "What document type is missing?",
    choices: [
      {
        label: "R0 PRO",
        next: "r0_pro",
        icon: "fa-solid fa-file-lines",
        desc: "Proceed with missing document flow for R0 PRO."
      },
      {
        label: "A0 PRO",
        next: "missing_ao_pro_start",
        icon: "fa-solid fa-file-circle-plus",
        desc: "Proceed with missing document flow for A0 PRO."
      }
    ]
  },

  /* ==================== A0 PRO FLOW ==================== */

  missing_ao_pro_start: {
    text: "Do you need to request a document to be imaged under an A0 PRO?",
    choices: [
      {
        label: "Yes",
        next: "ao_imaging_site",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with imaging request steps."
      },
      {
        label: "No",
        next: "ao_address_customer",
        icon: "fa-solid fa-circle-xmark",
        desc: "Address the customer concern accordingly."
      }
    ]
  },

  ao_address_customer: {
    text: "Address the concern of the customer on the A0 PRO accordingly.",
    choices: []
  },

  ao_imaging_site: {
    text: "Go to Image Viewer.",
    noteHtml: `<a href="http://imaging.freight.fedex.com/Viewer/Home.aspx" target="_blank">Open Image Viewer</a>`,
    choices: [
      {
        label: "Continue",
        next: "ao_enter_xref",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to XREF PRO lookup."
      }
    ]
  },

  ao_enter_xref: {
    text: "Enter XREF PRO(s), search XREF PRO numbers, and select ONLY the documents that need to be imaged.",
    image: "guides/Other%20Guides/missing-docs-guide/images/A0.jpg",
    choices: [
      {
        label: "Continue",
        next: "ao_doc_type",
        icon: "fa-solid fa-arrow-right",
        desc: "Choose the document type being submitted."
      }
    ]
  },

  ao_doc_type: {
    text: "What type of document is being submitted?",
    choices: [
      {
        label: "Bill of Lading (BOL)",
        next: "ao_bol_rules",
        icon: "fa-solid fa-file-invoice",
        desc: "Proceed with A0 BOL handling."
      },
      {
        label: "Delivery Receipt (DR)",
        next: "ao_dr_rules",
        icon: "fa-solid fa-file-signature",
        desc: "Proceed with A0 DR handling."
      }
    ]
  },

  ao_bol_rules: {
    text: "Submit the Bill of Lading under the A0 PRO and follow imaging request process accordingly.",
    choices: []
  },

  ao_dr_rules: {
    text: "Submit the Delivery Receipt under the A0 PRO and follow imaging request process accordingly.",
    choices: []
  },

  /* ==================== R0 PRO FLOW ==================== */

  r0_pro: {
    text: "What document type is missing?",
    choices: [
      {
        label: "Bill of Lading (BOL)",
        next: "bol_start",
        icon: "fa-solid fa-file-invoice",
        desc: "Proceed with missing BOL flow."
      },
      {
        label: "Delivery Receipt (DR)",
        next: "dr_delivered",
        icon: "fa-solid fa-file-signature",
        desc: "Proceed with missing DR flow."
      },
      {
        label: "Cargo Care (CC) / Return Delivery Receipt (RD)",
        next: "ccrd_start",
        icon: "fa-solid fa-box-open",
        desc: "Proceed with CC or RD review."
      },
      {
        label: "Inspection Certificate",
        next: "inspection_start",
        icon: "fa-solid fa-magnifying-glass-chart",
        desc: "Proceed with missing inspection flow."
      },
      {
        label: "Reweigh Certificate",
        next: "reweigh_start",
        icon: "fa-solid fa-weight-scale",
        desc: "Proceed with reweigh certificate flow."
      },
      {
        label: "Letter of Authority (LOA) / Letter of Denial (LOD)",
        next: "loa_start",
        icon: "fa-solid fa-file-circle-check",
        desc: "Proceed with LOA or LOD flow."
      }
    ]
  },

  /* ==================== BOL ==================== */

  bol_start: {
    text: "What is the age of the PRO?",
    choices: [
      {
        label: "Less than 30 days",
        next: "bol_less_30",
        icon: "fa-solid fa-calendar-day",
        desc: "Proceed with less than 30 days process."
      },
      {
        label: "More than 30 days but less than 90 days",
        next: "bol_30_90",
        icon: "fa-solid fa-calendar-week",
        desc: "Proceed with 30 to 90 days process."
      },
      {
        label: "More than 90 days",
        next: "bol_over_90",
        icon: "fa-solid fa-calendar-xmark",
        desc: "Proceed with over 90 days process."
      }
    ]
  },

  bol_less_30: {
    text: "Less than 30 Days",
    help: "Always check A–J Guideline before proceeding to BOL Review.",
    note: "📘 View A–J Guideline — refer to the A–J guideline document before proceeding to BOL Review.",
    choices: [
      {
        label: "Continue",
        next: "bol_bol_review_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to BOL review check."
      }
    ]
  },

  bol_bol_review_check: {
    text: "Does the dispute require a BOL Review?",
    choices: [
      {
        label: "Yes",
        next: "bol_customer_provide",
        icon: "fa-solid fa-circle-check",
        desc: "Review of BOL is required."
      },
      {
        label: "No",
        next: "bol_loa_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed without BOL review."
      }
    ]
  },

  bol_customer_provide: {
    text: "Did customer provide a BOL?",
    choices: [
      {
        label: "Yes",
        next: "bol_stamp_check",
        icon: "fa-solid fa-circle-check",
        desc: "Customer provided a BOL."
      },
      {
        label: "No",
        next: "bol_send_email_process",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed with retrieval process."
      }
    ]
  },

  bol_stamp_check: {
    text: "Does the document have FedEx Stamp?",
    choices: [
      {
        label: "Yes",
        next: "bol_debtor_name",
        icon: "fa-solid fa-circle-check",
        desc: "Stamped BOL is available."
      },
      {
        label: "No",
        next: "bol_send_email_process",
        icon: "fa-solid fa-circle-xmark",
        desc: "Document does not have FedEx Stamp."
      }
    ]
  },

  bol_debtor_name: {
    text: "Does it have the debtor’s name?",
    choices: [
      {
        label: "Yes",
        next: "bol_advise_standard",
        icon: "fa-solid fa-circle-check",
        desc: "Debtor's name is shown."
      },
      {
        label: "No",
        next: "bol_no_debtor",
        icon: "fa-solid fa-circle-xmark",
        desc: "Debtor's name is not shown."
      }
    ]
  },

  bol_no_debtor: {
    text: "Is there no debtor’s name?",
    choices: [
      {
        label: "Yes",
        next: "bol_advise_standard",
        icon: "fa-solid fa-circle-check",
        desc: "No debtor name is shown."
      },
      {
        label: "No",
        next: "bol_shipper_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to shipper validation."
      }
    ]
  },

  bol_shipper_check: {
    text: "Is the customer already the shipper?",
    choices: [
      {
        label: "Yes",
        next: "bol_advise_loa_needed",
        icon: "fa-solid fa-circle-check",
        desc: "Customer is the shipper."
      },
      {
        label: "No",
        next: "bol_advise_standard",
        icon: "fa-solid fa-circle-xmark",
        desc: "Use standard BOL response."
      }
    ]
  },

  bol_advise_standard: {
    text: "Advise: The document on file was the only document provided to us at the time of pickup and was used to bill the PRO.",
    choices: []
  },

  bol_advise_loa_needed: {
    text: "Advise: The document on file was the only document provided to us at the time of pickup and was used to bill the PRO. A letter of authorization with a letterhead is needed from a different debtor accepting the shipping charges or an LOA from the new debtor’s email domain.",
    choices: []
  },

  bol_send_email_process: {
    text: "Follow the 3 steps on the Sending Emails process to retrieve the BOL.",
    note: "📩 Follow Sending Emails (Steps 1–3) — refer to the Sending Emails process document for the step-by-step procedure.",
    choices: []
  },

  bol_loa_check: {
    text: "Is the request rebill per LOA?",
    choices: [
      {
        label: "Yes",
        next: "bol_proceed_loa",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with LOA."
      },
      {
        label: "No",
        next: "bol_guideline_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Check the A–J guideline."
      }
    ]
  },

  bol_proceed_loa: {
    text: "Proceed with LOA (No correction fee).",
    choices: []
  },

  bol_guideline_check: {
    text: "Is the dispute included in A-J Guideline?",
    choices: [
      {
        label: "Yes",
        next: "bol_follow_guideline",
        icon: "fa-solid fa-circle-check",
        desc: "Follow the specific A–J guideline."
      },
      {
        label: "No",
        next: "bol_address_dispute",
        icon: "fa-solid fa-circle-xmark",
        desc: "Address the dispute accordingly."
      }
    ]
  },

  bol_follow_guideline: {
    text: "Follow specific A-J guideline based on the customer’s dispute.",
    choices: []
  },

  bol_address_dispute: {
    text: "Address the dispute of the customer accordingly.",
    choices: []
  },

  bol_30_90: {
    text: "Follow General Rule below:",
    help: "1. Send email ONLY to Origin Center Managers or Supervisor and do not copy customer...",
    choices: [
      {
        label: "Continue",
        next: "bol_invoice_90_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to invoice age check."
      }
    ]
  },

  bol_invoice_90_check: {
    text: "Is invoice 90+ days old?",
    choices: [
      {
        label: "Yes",
        next: "bol_invoice_reprint",
        icon: "fa-solid fa-circle-check",
        desc: "Move to Invoice Reprint."
      },
      {
        label: "No",
        next: "bol_follow_30_90",
        icon: "fa-solid fa-circle-xmark",
        desc: "Follow general rule."
      }
    ]
  },

  bol_invoice_reprint: {
    text: "Move to Invoice Reprint.",
    choices: []
  },

  bol_follow_30_90: {
    text: "Follow the general rule for more than 30 days but less than 90 days invoices.",
    choices: []
  },

  bol_over_90: {
    text: "Does the document not retrievable?",
    choices: [
      {
        label: "Yes",
        next: "bol_party_check",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with party validation."
      },
      {
        label: "No",
        next: "bol_invoice_reprint",
        icon: "fa-solid fa-circle-xmark",
        desc: "Move to Invoice Reprint."
      }
    ]
  },

  bol_party_check: {
    text: "Who is the party requesting?",
    choices: [
      {
        label: "Consignee / 3rd Party / 3PL",
        next: "bol_advise_contact_shipper",
        icon: "fa-solid fa-user-group",
        desc: "Advise to contact shipper."
      },
      {
        label: "Shipper",
        next: "bol_shipper_stamp_check",
        icon: "fa-solid fa-user",
        desc: "Proceed with stamped BOL check."
      }
    ]
  },

  bol_advise_contact_shipper: {
    text: "Advise: BOL not on file, requested from center but may no longer be retrievable due to age, ask them to contact shipper for copy with FedEx stamp, and if 90+ days move to Invoice Reprint.",
    choices: []
  },

  bol_shipper_stamp_check: {
    text: "Did they attach BOL with FedEx Stamp?",
    choices: [
      {
        label: "Yes",
        next: "bol_review_stamp",
        icon: "fa-solid fa-circle-check",
        desc: "Review the BOL."
      },
      {
        label: "No",
        next: "bol_no_stamp_advise",
        icon: "fa-solid fa-circle-xmark",
        desc: "Advise customer accordingly."
      }
    ]
  },

  bol_review_stamp: {
    text: "Review the BOL with FedEx Stamp accordingly.",
    choices: []
  },

  bol_no_stamp_advise: {
    text: "Advise: BOL not on file, requested from center, and if 90+ days move to Invoice Reprint.",
    choices: []
  },

  /* ==================== DR ==================== */

  dr_delivered: {
    text: "Was the shipment delivered?",
    choices: [
      {
        label: "Yes",
        next: "dr_review",
        icon: "fa-solid fa-circle-check",
        desc: "Shipment was delivered."
      },
      {
        label: "No",
        next: "dr_not_delivered",
        icon: "fa-solid fa-circle-xmark",
        desc: "Shipment was not delivered."
      }
    ]
  },

  dr_not_delivered: {
    text: "Advise customer freight not delivered. Refer to fedex.com tracking. DR/POD available once delivered and invoiced.",
    choices: []
  },

  dr_review: {
    text: "Does the dispute require a DR Review?",
    choices: [
      {
        label: "Yes",
        next: "dr_spotted",
        icon: "fa-solid fa-circle-check",
        desc: "DR review is required."
      },
      {
        label: "No",
        next: "dr_address",
        icon: "fa-solid fa-circle-xmark",
        desc: "Address dispute accordingly."
      }
    ]
  },

  dr_address: {
    text: "Address the customer dispute accordingly.",
    choices: []
  },

  dr_spotted: {
    text: "Was shipment tagged as SPOTTED or DRIVER SPOTTED?",
    choices: [
      {
        label: "Yes",
        next: "dr_email_sc",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with missing POD email."
      },
      {
        label: "No",
        next: "dr_delivery_fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "Check if it is a delivery fee dispute."
      }
    ]
  },

  dr_delivery_fee: {
    text: "Is this a Delivery Fee Dispute Case?",
    help: "Examples: Liftgate, Inside Delivery, Sort and Segregate.",
    choices: [
      {
        label: "Yes",
        next: "dr_email_sc",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with service center email."
      },
      {
        label: "No",
        next: "dr_follow_sop",
        icon: "fa-solid fa-circle-xmark",
        desc: "Follow standard handling."
      }
    ]
  },

  dr_email_sc: {
    text: "Email destination service center for missing POD.",
    choices: [
      {
        label: "Continue",
        next: "dr_over_60",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to age validation."
      }
    ]
  },

  dr_over_60: {
    text: "Is the shipment over 60 days?",
    choices: [
      {
        label: "Yes",
        next: "dr_remove_dispute",
        icon: "fa-solid fa-circle-check",
        desc: "Remove disputed charges."
      },
      {
        label: "No",
        next: "dr_invoice_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to invoice age check."
      }
    ]
  },

  dr_invoice_check: {
    text: "Is the invoice over 45 days?",
    choices: [
      {
        label: "Yes",
        next: "dr_remove_dispute",
        icon: "fa-solid fa-circle-check",
        desc: "Remove disputed charges."
      },
      {
        label: "No",
        next: "dr_continue_followup",
        icon: "fa-solid fa-circle-xmark",
        desc: "Continue follow-up."
      }
    ]
  },

  dr_remove_dispute: {
    text: "Remove disputed charges due to no POD received within allowed timeframe.",
    choices: []
  },

  dr_continue_followup: {
    text: "Continue to follow up. Track case and follow up weekly. If no response, include District Operations Manager.",
    choices: []
  },

  dr_follow_sop: {
    text: "If DR is not required for review, address dispute accordingly. Follow standard email SOP if needed.",
    choices: []
  },

  /* ==================== CARGO CARE / RETURN DELIVERY ==================== */

  ccrd_start: {
    text: "Does the dispute require a Cargo Care or Return Delivery review?",
    choices: [
      {
        label: "Yes",
        next: "ccrd_invoice_age",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with CC or RD review."
      },
      {
        label: "No",
        next: "ccrd_address",
        icon: "fa-solid fa-circle-xmark",
        desc: "Address the dispute accordingly."
      }
    ]
  },

  ccrd_address: {
    text: "Address the dispute of the customer accordingly.",
    choices: []
  },

  ccrd_invoice_age: {
    text: "What is the age of the invoice?",
    choices: [
      {
        label: "Less than 30 days",
        next: "ccrd_dispute_type",
        icon: "fa-solid fa-calendar-day",
        desc: "Proceed with under 30 days process."
      },
      {
        label: "Over 30 days but less than 90 days",
        next: "ccrd_doc_file",
        icon: "fa-solid fa-calendar-week",
        desc: "Proceed with document lookup."
      },
      {
        label: "Over 90 days",
        next: "ccrd_writeoff",
        icon: "fa-solid fa-calendar-xmark",
        desc: "Proceed with write-off."
      }
    ]
  },

  ccrd_writeoff: {
    text: "If there are no documents to support the fee, proceed with a WRITE-OFF.",
    choices: []
  },

  ccrd_dispute_type: {
    text: "What is the dispute of the customer?",
    choices: [
      {
        label: "Storage Fee",
        next: "ccrd_doc_file",
        icon: "fa-solid fa-boxes-stacked",
        desc: "Proceed with document review."
      },
      {
        label: "Redelivery Fee",
        next: "ccrd_doc_file",
        icon: "fa-solid fa-truck-arrow-right",
        desc: "Proceed with document review."
      }
    ]
  },

  ccrd_doc_file: {
    text: "Is there any supporting document on file?",
    choices: [
      {
        label: "Yes",
        next: "ccrd_validate",
        icon: "fa-solid fa-circle-check",
        desc: "Use document to validate the charge."
      },
      {
        label: "No",
        next: "ccrd_retrieve",
        icon: "fa-solid fa-circle-xmark",
        desc: "Attempt to retrieve the document."
      }
    ]
  },

  ccrd_validate: {
    text: "Use the document to validate the issue or fee. Review FBI comments for additional support. If documentation supports the charge, deny dispute. If documentation does not support the charge, adjust accordingly.",
    choices: []
  },

  ccrd_retrieve: {
    text: "Can the document be retrieved?",
    choices: [
      {
        label: "Yes",
        next: "ccrd_email_imaging",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with retrieval and imaging."
      },
      {
        label: "No",
        next: "ccrd_over_90",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed based on age."
      }
    ]
  },

  ccrd_email_imaging: {
    text: "Email Shannon Document or Imaging Team. Email destination service center to check for related CC or RD. Send immediately to imaging@fedex.com once available.",
    choices: []
  },

  ccrd_over_90: {
    text: "If it is less than 90 days, continue attempting to retrieve the document. However, if it is over 90 days and there are no documents supporting the charge, proceed with WRITE-OFF.",
    choices: []
  },

  /* ==================== INSPECTION ==================== */

  inspection_start: {
    text: "What is the dispute of the customer?",
    choices: [
      {
        label: "Class update per inspection",
        next: "inspect_class_keyword",
        icon: "fa-solid fa-tag",
        desc: "Proceed with class validation."
      },
      {
        label: "Weight/Reweigh Dispute",
        next: "inspect_weight_keyword",
        icon: "fa-solid fa-weight-scale",
        desc: "Proceed with weight or reweigh validation."
      },
      {
        label: "CAPL/CCD/FUVI",
        next: "inspect_keywords",
        icon: "fa-solid fa-code-branch",
        desc: "Proceed with keyword handling."
      },
      {
        label: "Inspection Photo",
        next: "inspect_photo",
        icon: "fa-solid fa-camera",
        desc: "Proceed with photo lookup."
      }
    ]
  },

  inspect_class_keyword: {
    text: "Is there any Inspection Keywords in the body of the bill?",
    choices: [
      {
        label: "Yes",
        next: "inspect_freight_research",
        icon: "fa-solid fa-circle-check",
        desc: "Move to Freight Research."
      },
      {
        label: "No",
        next: "inspect_review_class",
        icon: "fa-solid fa-circle-xmark",
        desc: "Review class per BOL."
      }
    ]
  },

  inspect_review_class: {
    text: "Review the class per BOL and update accordingly.",
    choices: []
  },

  inspect_weight_keyword: {
    text: "Is there any Inspection Keywords in the body of the bill?",
    choices: [
      {
        label: "Yes",
        next: "inspect_weight_type",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with keyword type review."
      },
      {
        label: "No",
        next: "inspect_review_weight",
        icon: "fa-solid fa-circle-xmark",
        desc: "Review weight per BOL."
      }
    ]
  },

  inspect_weight_type: {
    text: "What keyword is present?",
    choices: [
      {
        label: "ADIM",
        next: "inspect_freight_research",
        icon: "fa-solid fa-ruler-combined",
        desc: "Move to Freight Research."
      },
      {
        label: "REWE",
        next: "inspect_rewe_check",
        icon: "fa-solid fa-weight-scale",
        desc: "Proceed with reweigh check."
      }
    ]
  },

  inspect_rewe_check: {
    text: "Is this a weight dispute with REWE keyword?",
    choices: [
      {
        label: "Yes",
        next: "inspect_follow_reweigh",
        icon: "fa-solid fa-circle-check",
        desc: "Follow missing reweigh certificate process."
      },
      {
        label: "No",
        next: "inspect_update_weight",
        icon: "fa-solid fa-circle-xmark",
        desc: "Update weight per BOL."
      }
    ]
  },

  inspect_follow_reweigh: {
    text: "Follow Missing Reweigh Certificate Process.",
    choices: []
  },

  inspect_update_weight: {
    text: "Update weight per BOL.",
    choices: []
  },

  inspect_review_weight: {
    text: "Review the weight per BOL and update accordingly.",
    choices: []
  },

  inspect_keywords: {
    text: "If any of these keywords are present (CAPL, CCD, FUVI), move case to Freight Research – Inspection Review.",
    choices: []
  },

  inspect_photo: {
    text: "Is Inspection Photo available in Shipment History?",
    choices: [
      {
        label: "Yes",
        next: "inspect_freight_research",
        icon: "fa-solid fa-circle-check",
        desc: "Move to Freight Research."
      },
      {
        label: "No",
        next: "inspect_email_terminal",
        icon: "fa-solid fa-circle-xmark",
        desc: "Email inspecting terminal."
      }
    ]
  },

  inspect_email_terminal: {
    text: "Email inspecting terminal (TERM listed on the bill) and request Inspection Photo.",
    choices: []
  },

  inspect_freight_research: {
    text: "Move to Freight Research – Inspection Review.",
    choices: []
  },

  /* ==================== REWEIGH ==================== */

  reweigh_start: {
    text: "Does PRO contain REWE keyword?",
    choices: [
      {
        label: "Yes",
        next: "reweigh_move_review",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with reweigh review."
      },
      {
        label: "No",
        next: "reweigh_customer_dispute",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed with customer dispute validation."
      }
    ]
  },

  reweigh_move_review: {
    text: "Move the case to Reweigh Review (for Non-Reweigh Agent). If already in Reweigh Review, follow Missing Reweigh Certificate process.",
    choices: []
  },

  reweigh_customer_dispute: {
    text: "Is the customer disputing the Reweigh?",
    choices: [
      {
        label: "Yes",
        next: "reweigh_keywords",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with keyword validation."
      },
      {
        label: "No",
        next: "reweigh_regular",
        icon: "fa-solid fa-circle-xmark",
        desc: "Follow regular SOP."
      }
    ]
  },

  reweigh_regular: {
    text: "Follow regular SOP for non-Reweigh dispute.",
    choices: []
  },

  reweigh_keywords: {
    text: "Does PRO contain any Inspection or Reweigh keyword?",
    choices: [
      {
        label: "Yes",
        next: "reweigh_keyword_type",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with keyword type."
      },
      {
        label: "No",
        next: "reweigh_review_weight",
        icon: "fa-solid fa-circle-xmark",
        desc: "Review weight per BOL."
      }
    ]
  },

  reweigh_keyword_type: {
    text: "What Inspection or Reweigh keywords are present?",
    choices: [
      {
        label: "ADIM / SDIM / CAPL / CCD / INSP / VICH",
        next: "reweigh_to_inspection",
        icon: "fa-solid fa-magnifying-glass",
        desc: "Move to Inspection Review."
      },
      {
        label: "REWE / WCHC / OREV / OWGT",
        next: "reweigh_to_reweigh_review",
        icon: "fa-solid fa-weight-scale",
        desc: "Move to Reweigh Review."
      }
    ]
  },

  reweigh_to_inspection: {
    text: "Move to Inspection Review.",
    choices: []
  },

  reweigh_to_reweigh_review: {
    text: "Move the case to Reweigh Review (for Non-Reweigh Agent). If already in Reweigh Review, follow Missing Reweigh Certificate process.",
    choices: []
  },

  reweigh_review_weight: {
    text: "Review weight per BOL and update accordingly.",
    choices: []
  },

  /* ==================== LOA / LOD ==================== */

  loa_start: {
    text: "Are LOA or LOD documents present in EDM?",
    choices: [
      {
        label: "Yes",
        next: "loa_use_doc",
        icon: "fa-solid fa-circle-check",
        desc: "Use document on file."
      },
      {
        label: "No",
        next: "loa_rebill_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed with rebill validation."
      }
    ]
  },

  loa_use_doc: {
    text: "Utilize all documents on Image and proceed according to findings.",
    choices: []
  },

  loa_rebill_check: {
    text: "Was PRO rebilled per LOA or LOD with previous case or via PAUD with no previous case?",
    choices: [
      {
        label: "PRO rebilled via previous case",
        next: "loa_previous_case",
        icon: "fa-solid fa-file-lines",
        desc: "Proceed with previous case path."
      },
      {
        label: "PRO was rebilled via PAUD queue or no previous case",
        next: "loa_paud_path",
        icon: "fa-solid fa-folder-tree",
        desc: "Proceed with PAUD or no previous case path."
      }
    ]
  },

  loa_previous_case: {
    text: "Was PRO rebilled per LOA or LOD via previous case?",
    choices: [
      {
        label: "Yes",
        next: "loa_case_number_check",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with case number validation."
      },
      {
        label: "No",
        next: "loa_update_bol",
        icon: "fa-solid fa-circle-xmark",
        desc: "Update the PRO per BOL."
      }
    ]
  },

  loa_update_bol: {
    text: "Update the PRO per correct debtor on the BOL.",
    choices: []
  },

  loa_case_number_check: {
    text: "Does the case number start with 3 or 4 (9 digits)?",
    choices: [
      {
        label: "Yes",
        next: "loa_contact_tl",
        icon: "fa-solid fa-circle-check",
        desc: "Reach out to TL."
      },
      {
        label: "No",
        next: "loa_valid_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed with LOA validation."
      }
    ]
  },

  loa_contact_tl: {
    text: "Reach out to your TL to retrieve the LOA via ODC.",
    choices: []
  },

  loa_valid_check: {
    text: "Is the request a valid LOA?",
    choices: [
      {
        label: "Yes",
        next: "loa_forwarded_check",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with imaging validation."
      },
      {
        label: "No",
        next: "loa_update_per_bol",
        icon: "fa-solid fa-circle-xmark",
        desc: "Update the PRO per BOL."
      }
    ]
  },

  loa_update_per_bol: {
    text: "Update the PRO per BOL.",
    choices: []
  },

  loa_forwarded_check: {
    text: "Was the LOA request forwarded to imaging@fedex.com?",
    choices: [
      {
        label: "Yes",
        next: "loa_screenshot_check",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with screenshot validation."
      },
      {
        label: "No",
        next: "loa_forward_to_imaging",
        icon: "fa-solid fa-circle-xmark",
        desc: "Forward to imaging."
      }
    ]
  },

  loa_forward_to_imaging: {
    text: "Forward the LOA request to imaging@fedex.com.",
    choices: []
  },

  loa_screenshot_check: {
    text: "Have you taken a screenshot of the request and attached it?",
    choices: [
      {
        label: "Yes",
        next: "loa_month_check",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with age validation."
      },
      {
        label: "No",
        next: "loa_screenshot_action",
        icon: "fa-solid fa-circle-xmark",
        desc: "Take screenshot and attach it."
      }
    ]
  },

  loa_screenshot_action: {
    text: "Screenshot, convert to PDF, and attach it to your response to the customer.",
    choices: []
  },

  loa_month_check: {
    text: "Has it been over a month since the LOA was rebilled and not yet imaged?",
    choices: [
      {
        label: "Yes",
        next: "loa_email_client",
        icon: "fa-solid fa-circle-check",
        desc: "Email the client."
      },
      {
        label: "No",
        next: "loa_wait_imaging",
        icon: "fa-solid fa-circle-xmark",
        desc: "Wait for imaging."
      }
    ]
  },

  loa_email_client: {
    text: "Send an email to ask the client to coordinate with the Imaging Team.",
    choices: []
  },

  loa_wait_imaging: {
    text: "Wait for imaging to process.",
    choices: []
  },

  loa_paud_path: {
    text: "Was PRO rebilled via PAUD Queue or no previous case?",
    choices: [
      {
        label: "Yes",
        next: "loa_2week_check",
        icon: "fa-solid fa-circle-check",
        desc: "Proceed with 2-week check."
      },
      {
        label: "No",
        next: "loa_pend_case",
        icon: "fa-solid fa-circle-xmark",
        desc: "Pend and review weekly."
      }
    ]
  },

  loa_pend_case: {
    text: "Continue to pend the case and review weekly.",
    choices: []
  },

  loa_2week_check: {
    text: "Has it been 2 weeks since the rebill and LOA is still not imaged?",
    choices: [
      {
        label: "Yes",
        next: "loa_email_racf",
        icon: "fa-solid fa-circle-check",
        desc: "Email the RACF owner."
      },
      {
        label: "No",
        next: "loa_wait_week",
        icon: "fa-solid fa-circle-xmark",
        desc: "Wait another week."
      }
    ]
  },

  loa_wait_week: {
    text: "Wait another week and review.",
    choices: []
  },

  loa_email_racf: {
    text: "Send an email to the RACF owner who requested the rebill per LOA and request for the actual LOA from the accepting party.",
    choices: []
  }

};
