/* =========================================================
   FEDEX DIRECT GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "fedex-direct-guide",
  title: "FedEx Direct Guide",
  startNode: "start",
  templateCollection: "fedex_direct_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "FedEx Direct General Guide",
    help: "Use this guide to resolve customer disputes involving FedEx Direct service types and associated surcharges (GTE, IDP, IDC, IPC, IPP, LGOP, LGOC, LIFP, LIFC, LTDD, NCM, NTFY, RESD).",
    choices: [
      {
        label: "Continue",
        next: "dispute_type",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the FedEx Direct dispute resolution process."
      }
    ]
  },

  dispute_type: {
    text: "What is the customer disputing?",
    help: "Identify whether the dispute involves the FedEx Direct service type or related surcharges.",
    choices: [
      {
        label: "FedEx Direct service type (Basic / Basic w/Appt / Standard / Premium)",
        next: "fd_service_type",
        icon: "fa-solid fa-truck",
        desc: "Dispute about the service level itself."
      },
      {
        label: "Customer disputing one of the following surcharges (GTE, IDP, IDC, IPC, IPP, LGOP, LGOC, LIFP, LIFC, LTDD, NCM, NTFY AND RESD)",
        next: "fd_surcharge_intro",
        icon: "fa-solid fa-dollar-sign",
        desc: "Dispute about surcharges added to a FedEx Direct shipment."
      }
    ]
  },

  /* ==================== SERVICE TYPE DISPUTE ==================== */

  fd_service_type: {
    text: "What type of FedEx Direct service is the customer disputing?",
    help: "Select the specific service code as shown on the invoice.",
    choices: [
      {
        label: "FFDB, FFOB – Basic",
        next: "fd_check_bol",
        icon: "fa-solid fa-layer-group",
        desc: "Basic FedEx Direct service."
      },
      {
        label: "FFDR, FFOR – Basic w/Appt",
        next: "fd_check_bol",
        icon: "fa-solid fa-calendar-check",
        desc: "Basic with appointment."
      },
      {
        label: "FFDS, FFOS – Standard",
        next: "fd_check_bol",
        icon: "fa-solid fa-chart-line",
        desc: "Standard FedEx Direct service."
      },
      {
        label: "FFDP – Premium",
        next: "fd_check_bol",
        icon: "fa-solid fa-gem",
        desc: "Premium FedEx Direct service."
      }
    ]
  },

  fd_check_bol: {
    text: "Is FedEx Direct noted on BOL?",
    help: "Check the Bill of Lading for any mention of FedEx Direct service.",
    choices: [
      {
        label: "Yes",
        next: "fd_noted_yes",
        icon: "fa-solid fa-circle-check",
        desc: "BOL shows FedEx Direct."
      },
      {
        label: "No",
        next: "fd_noted_no",
        icon: "fa-solid fa-circle-xmark",
        desc: "BOL does not show FedEx Direct."
      }
    ]
  },

  fd_noted_yes: {
    text: "Advise customer per BOL and that shipment moved as FedEx Direct.",
    help: "BOL confirms FedEx Direct – fee is valid.",
    choices: []
  },

  fd_noted_no: {
    text: "Remove surcharge and advise customer.",
    help: "BOL does not show FedEx Direct – fee should be removed. Select correction reason.",
    choices: [
      {
        label: "Service noted but not performed",
        next: "fd_corr_nacc",
        icon: "fa-solid fa-file-signature",
        desc: "Service was noted on BOL but not actually performed."
      },
      {
        label: "Not noted but billed FXFD",
        next: "fd_corr_ops",
        icon: "fa-solid fa-receipt",
        desc: "Not noted on BOL but billed as FedEx Direct."
      }
    ]
  },

  fd_corr_nacc: {
    text: "CORR NACC – Direct service noted but not performed.",
    help: "Apply correction code NACC when service was documented but not executed.",
    choices: []
  },

  fd_corr_ops: {
    text: "CORR OPSO / OPSD – Direct service not noted but billed.",
    help: "Apply correction code OPSO or OPSD when service was not noted but billed.",
    choices: []
  },

  /* ==================== SURCHARGE DISPUTE ==================== */

  fd_surcharge_intro: {
    text: "Customer disputing surcharges claiming FedEx Direct was already charged.",
    help: "Customer acknowledges FedEx Direct service but disputes additional surcharges.",
    choices: [
      {
        label: "Proceed",
        next: "fd_fbc_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue to verify FedEx Direct service on FBC and BOL."
      }
    ]
  },

  fd_fbc_check: {
    text: "Does FBC contain FFDB/FFOB/FFDR/FFDS/FFDP?",
    help: "Check Freight Bill Copy (FBC) for any FedEx Direct service code.",
    choices: [
      {
        label: "Yes",
        next: "fd_bol_direct",
        icon: "fa-solid fa-circle-check",
        desc: "FBC shows a FedEx Direct service code."
      },
      {
        label: "No",
        next: "fd_bol_direct",
        icon: "fa-solid fa-circle-xmark",
        desc: "FBC does not show a FedEx Direct service code – still check BOL."
      }
    ]
  },

  fd_bol_direct: {
    text: "Is FedEx Direct noted on BOL?",
    help: "Verify BOL for FedEx Direct notation – this overrides FBC check.",
    choices: [
      {
        label: "Yes",
        next: "fd_remove_surcharges",
        icon: "fa-solid fa-circle-check",
        desc: "BOL shows FedEx Direct – surcharges should be removed."
      },
      {
        label: "No",
        next: "fd_advise_not_direct",
        icon: "fa-solid fa-circle-xmark",
        desc: "BOL does not show FedEx Direct – advise customer."
      }
    ]
  },

  fd_remove_surcharges: {
    text: "Remove all related surcharges (GTE, IDP, IDC, IPC, IPP, LGOP, LGOC, LIFP, LIFC, LTDD, NCM, NTFY AND RESD) and use CORR SYSM.",
    help: "When FedEx Direct is confirmed on BOL, all listed surcharges must be removed using correction code SYSM.",
    choices: []
  },

  fd_advise_not_direct: {
    text: "Advise customer shipment was not FedEx Direct.",
    help: "No FedEx Direct notation on BOL – surcharges stand.",
    choices: []
  }

};
