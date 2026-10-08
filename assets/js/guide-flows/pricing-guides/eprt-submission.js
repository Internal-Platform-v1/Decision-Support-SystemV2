/* =========================================================
   EPRT SUBMISSION — FLOW CONFIG + NODES
   Step-by-step guide. Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "eprt-submission",
  title: "ePRT Submission",
  startNode: "start",
  templateCollection: "eprt_submission_template"
};

window.GUIDE_NODES = {

  start: {
    text: "ePRT Submission — Step-by-Step Guide",
    help: "Follow these steps in order to create and submit an ePRT ticket through iSell, then pend the Salesforce case with the ticket number.",
    note: "Submit the ePRT request with complete and accurate details. Document the ticket number in Internal Comments so the case can be tracked without delays.",
    choices: [
      {
        label: "Continue",
        next: "step_open_isell",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the ePRT submission process."
      }
    ]
  },

  step_open_isell: {
    text: "Open iSell",
    help: "Go to the iSell portal to begin creating the ePRT ticket.\n\nhttps://isell.my.salesforce.com",
    choices: [
      {
        label: "Continue",
        next: "step_my_cases",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_my_cases: {
    text: "Navigate to My Cases",
    help: "Click My Cases from the top dashboard in iSell.",
    choices: [
      {
        label: "Continue",
        next: "step_new_case",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_new_case: {
    text: "Create a New Case",
    help: "Click New Case to start the request.",
    choices: [
      {
        label: "Continue",
        next: "step_select_pricing",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_select_pricing: {
    text: "Select Pricing Option",
    help: "Choose Pricing.\n\nHovering over the option will show the issues it applies to.",
    choices: [
      {
        label: "Continue",
        next: "step_issue_type",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_issue_type: {
    text: "Choose the Correct Issue Type",
    help: "Select the applicable radio button, then click Next.\n\nIMPORTANT:\nDo not select Non-Sales Pricing Request unless you are a non-sales user.\n\nIn most cases, select Customer Discount Loss or Incorrect Pricing.",
    choices: [
      {
        label: "Continue",
        next: "step_employee_id",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_employee_id: {
    text: "Confirm Employee ID",
    help: "Your employee ID should appear automatically.\n\nConfirm it, then click Next.",
    choices: [
      {
        label: "Continue",
        next: "step_customer_ean",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_customer_ean: {
    text: "Enter Customer EAN",
    help: "Enter the Customer EAN related to the issue, then click Next.",
    choices: [
      {
        label: "Continue",
        next: "step_case_form",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_case_form: {
    text: "Complete the Case Form",
    help: "Fill out the form using the information from the ePRT Ticket Support Form.\n\nREMINDER:\nAll fields marked with * are mandatory. Select the most accurate option available.",
    choices: [
      {
        label: "Continue",
        next: "step_issue_description",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_issue_description: {
    text: "Add the Issue Description",
    help: "Provide clear details about the pricing issue, expected discount, missing exception, or expected surcharge handling.\n\nExample:\nCustomer AWBs for Express SO shipments are not receiving the expected volume discount.\n\nInclude:\n• Expected ED percentage\n• Expected surcharge exception\n• Other agreement details that support the request\n\nDO NOT:\nDo not request full invoice spreadsheet audits through iSell. Provide only a few AWB or PRO examples.",
    choices: [
      {
        label: "Continue",
        next: "step_submit",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_submit: {
    text: "Submit the Case",
    help: "After submission, choose View Case.\n\nYou can then upload files and finish the process.",
    choices: [
      {
        label: "Continue",
        next: "step_case_details",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_case_details: {
    text: "Add Additional Case Details",
    help: "Complete the added case details so the ePRT Team can review the request properly.\n\nRequired details may include:\n• Proposal Number — valid proposal number of the agreement\n• Tracking Numbers — AWBs or PRO numbers, maximum of 5\n• Issue Description — add more detail if needed\n• Files — upload screenshots, PDFs, XLS files, or other support\n\nIMPORTANT:\nDo not enter invoice numbers. Use AWB or PRO tracking numbers only.",
    choices: [
      {
        label: "Continue",
        next: "step_case_review",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_case_review: {
    text: "ePRT Case Review",
    help: "The GPRT team will review the case and may request additional details in the case comments.\n\nOnce all details are provided, the case will be worked or escalated if needed.",
    choices: [
      {
        label: "Continue",
        next: "step_request_updates",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_request_updates: {
    text: "Request Updates",
    help: "To request updates, send an email from OSV and include the Salesforce Case Number.\n\nUpdate email:\npricing_ePRT@corp.ds.fedex.com",
    choices: [
      {
        label: "Continue",
        next: "step_profile_note",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_profile_note: {
    text: "Add a Customer Profile Note",
    help: "Add a Customer Profile note using the correct format.\n\nFormat:\nDATE – VS-PRIC-###### – EPRT TCKT # XXXXX – REASON\n\nExample:\n09/22/22 – VS-PRIC-14599820 – EPRT TCKT #47103 – RVW NOST WAIVED PER AGREEMENT",
    choices: [
      {
        label: "Continue",
        next: "step_pend_case",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the final step."
      }
    ]
  },

  step_pend_case: {
    text: "Pend the Salesforce Case",
    action: "Pend the Salesforce case and include the ePRT Ticket Number in the Internal Comments.\n\nFinal reminder:\nSubmit the ePRT request with complete and accurate details, then document the ticket number properly so the case can be tracked without delays."
  }

};
