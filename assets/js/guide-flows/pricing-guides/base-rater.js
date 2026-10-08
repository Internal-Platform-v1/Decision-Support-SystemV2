/* =========================================================
   BASE RATER — FLOW CONFIG + NODES
   Step-by-step guide. Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "base-rater",
  title: "Base Rater",
  startNode: "start",
  templateCollection: "base_rater_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Base Rater — Step-by-Step Guide",
    help: "Use this guide to access the CZAR Rater, identify the required shipment information, apply FAK class logic, itemize weight correctly, and select the correct tariff to verify base rates.",
    note: "If the correct base rater is not available in CZAR Rater, email the Training Team / SMEs with complete shipment details so they can verify the correct CWT rate.",
    choices: [
      {
        label: "Continue",
        next: "step_check_email",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Base Rater process."
      }
    ]
  },

  /* ================= ACCOUNT SETUP ================= */

  step_check_email: {
    text: "1. Check your setup email",
    help: "Check your email for a message from AdminManager@smc3.com.",
    choices: [
      {
        label: "Continue",
        next: "step_create_password",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_create_password: {
    text: "2. Create your CZAR Rater password",
    help: "Open the CZAR Rater website and follow the instructions to create or change your password.\n\nhttps://czarlite.smc3.com/Rater/",
    choices: [
      {
        label: "Continue",
        next: "step_login",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_login: {
    text: "3. Log in using the new password",
    help: "Once the password is changed, log in using the new password.",
    choices: [
      {
        label: "Continue",
        next: "step_confirm_interface",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_confirm_interface: {
    text: "4. Confirm the web interface",
    help: "After login, the website will bring you to the Czarlite Web Interface.",
    choices: [
      {
        label: "Continue",
        next: "step_open_pro",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to using the CZAR Rater."
      }
    ]
  },

  /* ================= HOW TO USE THE CZAR RATER ================= */

  step_open_pro: {
    text: "1. Open the PRO in FBI",
    help: "Open the PRO in FBI and identify the shipment information needed for the rater.",
    choices: [
      {
        label: "Continue",
        next: "step_city_lookup",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_city_lookup: {
    text: "2. Complete City Lookup",
    help: "Enter the required ZIP codes:\n\n• Origin — Shipper's ZIP Code\n• Destination — Consignee's ZIP Code",
    choices: [
      {
        label: "Continue",
        next: "step_class",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_class: {
    text: "3. Enter the correct class",
    help: "If Pricing involves FAK Rates, enter the class that applies to the customer's class group.\n\nExample:\nIf the agreement states that Class 100 applies to shipments with Class 055, 060, 077, and 090, enter Class 100 instead of the actual class listed on the BOL.",
    choices: [
      {
        label: "Continue",
        next: "step_weight",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_weight: {
    text: "4. Enter the weight",
    help: "Enter the weight per line item.\n\nNote:\nIf the shipment contains multiple line items, click \"Add New Row\" and itemize the weight and class per line item.",
    choices: [
      {
        label: "Continue",
        next: "step_rate_family",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_rate_family: {
    text: "5. Select the rate family",
    help: "Select LTL as the Rate Family.",
    choices: [
      {
        label: "Continue",
        next: "step_tariff",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_tariff: {
    text: "6. Select the available tariff",
    action: "Select the rater used in the customer's agreement, including the applicable year.\n\nExamples:\nFXF 1000 Eff 11/01/2010\nor\nCZARLITE Eff 02/01/2010\n\nIMPORTANT:\nIf the correct base rater is not available, send an email to the Training Team / SMEs and include all shipment details so they can verify the correct CWT rate.\n\nCompleted:\nUse the correct shipment ZIPs, class, itemized weight, rate family, and tariff year to verify the base rate accurately."
  }

};
