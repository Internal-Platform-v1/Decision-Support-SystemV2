/* =========================================================
   EMPLOYEE DISCOUNT GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "employee-discount-guide",
  title: "Employee Discount Guide",
  startNode: "start",
  templateCollection: "employee_discount_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Click Continue if the request is to apply Employee Discount",
    help: "Start validating the employee discount request.",
    choices: [
      {
        label: "Continue",
        next: "check_bol",
        icon: "fa-solid fa-arrow-right",
        desc: "Start validating the employee discount request."
      }
    ]
  },

  check_bol: {
    text: "Check the BOL and verify if there is an indication that the employee shall receive a specific discount for this shipment.",
    image: "guides/Other%20Guides/employee-discount-guide/images/bol-reference.png",
    help: "Review the BOL for employee discount indicators.",
    choices: [
      {
        label: "Continue",
        next: "check_invoice_discount",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after reviewing the BOL."
      }
    ]
  },

  check_invoice_discount: {
    text: "If there is, check the body of the bill and verify if that specific discount is already applied to the invoice.",
    help: "Check whether the discount shown on the BOL is already applied to the invoice.",
    choices: [
      {
        label: "Discount Already Applied",
        next: "discount_applied",
        icon: "fa-solid fa-circle-check",
        desc: "Discount is already reflected on the invoice."
      },
      {
        label: "No / Different Discount",
        next: "send_training_email",
        icon: "fa-solid fa-circle-xmark",
        desc: "Discount is missing or incorrect."
      }
    ]
  },

  /* ================= ALREADY APPLIED ================= */

  discount_applied: {
    text: "Advise the associate/customer that the employee discount is already applied on the invoice.",
    help: "Use this when the discount is already correctly applied.",
    choices: []
  },

  /* ================= NOT APPLIED ================= */

  send_training_email: {
    text: "Send an email to Training Team SME who will forward it to the Team Lead who will confirm if the customer is indeed a FedEx employee and if they are eligible for a FedEx discount.",
    help: "Escalate to Training Team SME for eligibility confirmation.",
    choices: [
      {
        label: "Continue",
        next: "apply_discount",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed after confirmation from Team Lead."
      }
    ]
  },

  apply_discount: {
    text: "Once confirmed by the Team Lead, proceed with applying 75% discount on the invoice. Use CORR SACA.",
    help: "Apply the 75% employee discount using CORR SACA.",
    choices: []
  }

};
