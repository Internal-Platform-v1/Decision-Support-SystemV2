/* =========================================================
   CLASS UPDATE GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "class-update-guide",
  title: "Class Update Guide",
  startNode: "start",
  templateCollection: "class_update_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Class Update General Guide",
    help: "Use this guide to resolve customer requests for class or NMFC updates, either based on a reweighed weight or based on the original Bill of Lading (BOL). Includes handling of FACERT, inspection keywords, density calculations, PCF, and NMFC lookup.",
    choices: [
      {
        label: "Continue",
        next: "class_update_intro",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the class update dispute resolution process."
      }
    ]
  },

  class_update_intro: {
    text: "What is the Class update request?",
    help: "Determine whether the update is driven by a reweighed weight or by the original BOL.",
    choices: [
      {
        label: "CLASS UPDATE PER REWEIGHED WEIGHT",
        next: "class_update_reweigh",
        icon: "fa-solid fa-weight-hanging",
        desc: "Customer requests class update based on reweighed weight."
      },
      {
        label: "CLASS UPDATE PER BOL",
        next: "bol_start",
        icon: "fa-solid fa-file-alt",
        desc: "Customer requests class update based on original BOL."
      }
    ]
  },

  /* ==================== REWEIGHED WEIGHT FLOW ==================== */

  class_update_reweigh: {
    text: "NOTE:\n\nSince REWE is not disputed, focus on the Class Update new PCF per reweighed request using the updated/current commodity weight shown on the body of the bill.",
    help: "The reweigh itself is accepted; only the class needs updating based on the new weight.",
    choices: [
      {
        label: "Continue",
        next: "reweigh_start",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to check FACERT and other documents."
      }
    ]
  },

  reweigh_start: {
    text: "Is FACERT on file? CAPL, CCD or ADM present on the bill?",
    help: "Check for Freight Analysis Certificate (FACERT) or inspection-related keywords (CAPL, CCD, ADM).",
    choices: [
      {
        label: "Yes",
        next: "reweigh_facert_yes",
        icon: "fa-solid fa-circle-check",
        desc: "FACERT or inspection keyword present."
      },
      {
        label: "No",
        next: "reweigh_check_cont_tls",
        icon: "fa-solid fa-circle-xmark",
        desc: "No FACERT or inspection keyword found."
      }
    ]
  },

  reweigh_facert_yes: {
    text: "Move the case to Freight Research Inspection Review. Add CAPL at the beginning of the subject line.",
    help: "Inspection documentation exists – route to Freight Research.",
    choices: []
  },

  reweigh_check_cont_tls: {
    text: "CONT, TLS or TLX present on the body of the bill?",
    help: "Look for container, trailer, or TLX indicators on the invoice.",
    choices: [
      {
        label: "Yes",
        next: "reweigh_move_dispute",
        icon: "fa-solid fa-circle-check",
        desc: "CONT/TLS/TLX present."
      },
      {
        label: "No",
        next: "reweigh_valid_nmfc",
        icon: "fa-solid fa-circle-xmark",
        desc: "No container/trailer indicators."
      }
    ]
  },

  reweigh_move_dispute: {
    text: "Move the case to Dispute Resolution Queue. Add VQ at the beginning of the subject line.",
    help: "Route to Dispute Resolution with VQ prefix.",
    choices: []
  },

  reweigh_valid_nmfc: {
    text: "Is there a valid NMFC on the BOL?",
    help: "Check BOL for a valid NMFC code.",
    choices: [
      {
        label: "Yes",
        next: "reweigh_density_check",
        icon: "fa-solid fa-circle-check",
        desc: "Valid NMFC present."
      },
      {
        label: "No",
        next: "reweigh_lookup_nmfc",
        icon: "fa-solid fa-circle-xmark",
        desc: "No valid NMFC – need to look up."
      }
    ]
  },

  reweigh_lookup_nmfc: {
    text: "Pull up NMFC lookup and try to search for the item description.",
    help: "Use NMFC lookup tool to find the appropriate code.",
    choices: [
      {
        label: "Located NMFC",
        next: "reweigh_density_check",
        icon: "fa-solid fa-check-circle",
        desc: "NMFC found."
      },
      {
        label: "Not Located",
        next: "reweigh_support_docs",
        icon: "fa-solid fa-question-circle",
        desc: "Unable to locate – request docs."
      }
    ]
  },

  reweigh_support_docs: {
    text: "Ask for supporting documents.",
    help: "Customer must provide documentation to determine correct NMFC.",
    choices: []
  },

  reweigh_density_check: {
    text: "Is the NMFC density based?",
    help: "Determine if the NMFC class depends on density (PCF).",
    choices: [
      {
        label: "Yes",
        next: "reweigh_dimensions_check",
        icon: "fa-solid fa-cube",
        desc: "Density-based NMFC."
      },
      {
        label: "No",
        next: "reweigh_apply_nmfc_per_bol",
        icon: "fa-solid fa-tag",
        desc: "Not density-based – apply NMFC directly."
      }
    ]
  },

  reweigh_apply_nmfc_per_bol: {
    text: "No need to calculate the PCF. Apply the NMFC per BOL.",
    help: "For non-density NMFC, use the code as shown on BOL.",
    choices: []
  },

  reweigh_dimensions_check: {
    text: "Dimensions noted on BOL?",
    help: "Check for dimensions (LxWxH) on the BOL.",
    choices: [
      {
        label: "Yes",
        next: "reweigh_calculate_pcf",
        icon: "fa-solid fa-circle-check",
        desc: "Dimensions available – calculate PCF."
      },
      {
        label: "No",
        next: "reweigh_cube_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "No dimensions – check for CUBE."
      }
    ]
  },

  reweigh_cube_check: {
    text: "CUBE/CUBED noted on the body of the bill?",
    help: "Look for total cubic feet notation.",
    choices: [
      {
        label: "Yes",
        next: "reweigh_divide_weight",
        icon: "fa-solid fa-circle-check",
        desc: "CUBE available – divide weight."
      },
      {
        label: "No",
        next: "reweigh_request_dimensions",
        icon: "fa-solid fa-circle-xmark",
        desc: "No dimensions or cube – request docs."
      }
    ]
  },

  reweigh_request_dimensions: {
    text: "Ask for supporting documents showing the dimensions of the shipment.",
    help: "Customer must provide dimensions to calculate density.",
    choices: []
  },

  reweigh_divide_weight: {
    text: "Divide the total weight to the CUBE/CUBED on the body of the bill to get the new PCF.",
    help: "Calculate pounds per cubic foot (PCF) = weight / cube.",
    choices: [
      {
        label: "Continue",
        next: "reweigh_lookup_after_calc",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to NMFC lookup with new PCF."
      }
    ]
  },

  reweigh_calculate_pcf: {
    text: "Calculate the new PCF.",
    help: "PCF = total weight / (L x W x H in cubic feet).",
    choices: [
      {
        label: "Continue",
        next: "reweigh_lookup_after_calc",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to NMFC lookup."
      }
    ]
  },

  reweigh_lookup_after_calc: {
    text: "Pull up the NMFC using NMFC lookup.",
    help: "Find the NMFC item that matches the commodity description.",
    choices: [
      {
        label: "Continue",
        next: "reweigh_subclass_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check subclass based on PCF."
      }
    ]
  },

  reweigh_subclass_check: {
    text: "Check on what subclass the new PCF will fall under.",
    help: "Density-based NMFCs have subclasses determined by PCF range.",
    choices: [
      {
        label: "Continue",
        next: "reweigh_apply_nmfc_invoice",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply the correct subclass."
      }
    ]
  },

  reweigh_apply_nmfc_invoice: {
    text: "Apply the appropriate NMFC on the invoice per new PCF.",
    help: "Update the invoice with the correct NMFC and subclass.",
    choices: []
  },

  /* ==================== BOL FLOW ==================== */

  bol_start: {
    text: "What is the customer's dispute?",
    help: "Identify whether the dispute is about class/NMFC per BOL or FAK rates.",
    choices: [
      {
        label: "Class/NMFC update per BOL",
        next: "bol_facert_check",
        icon: "fa-solid fa-file-alt",
        desc: "Customer wants class/NMFC updated based on BOL."
      },
      {
        label: "FAK Rates",
        next: "bol_move_pricing",
        icon: "fa-solid fa-chart-simple",
        desc: "Freight All Kinds (FAK) rate dispute."
      }
    ]
  },

  bol_move_pricing: {
    text: "Move the case to Pricing Queue.",
    help: "FAK rate disputes are handled by Pricing team.",
    choices: []
  },

  bol_facert_check: {
    text: "Is FACERT available on image and/or Inspection keyword on the body of the bill?",
    help: "Check for FACERT or inspection-related keywords (e.g., 'Inspection').",
    choices: [
      {
        label: "FACERT not imaged and no inspection keyword present",
        next: "bol_class_nmfc_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "No FACERT, no inspection keyword."
      },
      {
        label: "FACERT not imaged but inspection keyword present",
        next: "bol_move_inspection",
        icon: "fa-solid fa-magnifying-glass",
        desc: "Inspection keyword – route to inspection."
      },
      {
        label: "FACERT imaged but no inspection keyword",
        next: "bol_move_inspection",
        icon: "fa-solid fa-image",
        desc: "FACERT present – route to inspection."
      },
      {
        label: "FACERT imaged and inspection keyword present",
        next: "bol_move_inspection",
        icon: "fa-solid fa-check-double",
        desc: "Both present – route to inspection."
      }
    ]
  },

  bol_move_inspection: {
    text: "Move the case to Freight Inspection Review.",
    help: "When FACERT or inspection keyword exists, route to Freight Inspection.",
    choices: []
  },

  bol_class_nmfc_check: {
    text: "Both Class/NMFC noted on BOL?",
    help: "Check if both class and NMFC are written on the BOL.",
    choices: [
      {
        label: "Yes",
        next: "bol_nmfc_valid_check",
        icon: "fa-solid fa-circle-check",
        desc: "Both class and NMFC present."
      },
      {
        label: "No",
        next: "bol_lookup_nmfc",
        icon: "fa-solid fa-circle-xmark",
        desc: "Missing class or NMFC – need lookup."
      }
    ]
  },

  bol_nmfc_valid_check: {
    text: "Is the NMFC valid?",
    help: "Verify the NMFC code against current NMFC database.",
    choices: [
      {
        label: "Yes",
        next: "bol_apply_nmfc",
        icon: "fa-solid fa-check-circle",
        desc: "Valid NMFC – apply it."
      },
      {
        label: "No",
        next: "bol_apply_class_per_bol",
        icon: "fa-solid fa-times-circle",
        desc: "Invalid NMFC – use class instead."
      }
    ]
  },

  bol_apply_class_per_bol: {
    text: "Apply class per BOL. (NMFC supersedes Class)",
    help: "When NMFC is invalid, fall back to the class shown on BOL.",
    choices: []
  },

  bol_apply_nmfc: {
    text: "Apply the NMFC on the Pro. (NMFC supersedes Class)",
    help: "Valid NMFC takes precedence over class.",
    choices: []
  },

  bol_lookup_nmfc: {
    text: "Pull up NMFC lookup and try to search for the item description.",
    help: "Use NMFC lookup tool to find the correct code.",
    choices: [
      {
        label: "Located NMFC",
        next: "bol_density_check",
        icon: "fa-solid fa-check-circle",
        desc: "NMFC found."
      },
      {
        label: "Not Located",
        next: "bol_support_docs",
        icon: "fa-solid fa-question-circle",
        desc: "Not found – request docs."
      }
    ]
  },

  bol_support_docs: {
    text: "Ask for supporting documents.",
    help: "Customer must provide documentation to determine correct NMFC.",
    choices: []
  },

  bol_density_check: {
    text: "Is the NMFC density based?",
    help: "Determine if the NMFC class depends on density (PCF).",
    choices: [
      {
        label: "Yes",
        next: "bol_dimensions_check",
        icon: "fa-solid fa-cube",
        desc: "Density-based NMFC."
      },
      {
        label: "No",
        next: "bol_apply_nmfc_per_bol",
        icon: "fa-solid fa-tag",
        desc: "Not density-based – apply NMFC directly."
      }
    ]
  },

  bol_apply_nmfc_per_bol: {
    text: "No need to calculate the PCF. Apply the NMFC per BOL.",
    help: "For non-density NMFC, use the code as shown on BOL.",
    choices: []
  },

  bol_dimensions_check: {
    text: "Dimensions noted on BOL?",
    help: "Check for dimensions (LxWxH) on the BOL.",
    choices: [
      {
        label: "Yes",
        next: "bol_calculate_pcf",
        icon: "fa-solid fa-circle-check",
        desc: "Dimensions available – calculate PCF."
      },
      {
        label: "No",
        next: "bol_cube_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "No dimensions – check for CUBE."
      }
    ]
  },

  bol_cube_check: {
    text: "CUBE/CUBED noted on the body of the bill?",
    help: "Look for total cubic feet notation.",
    choices: [
      {
        label: "Yes",
        next: "bol_divide_weight",
        icon: "fa-solid fa-circle-check",
        desc: "CUBE available – divide weight."
      },
      {
        label: "No",
        next: "bol_request_dimensions",
        icon: "fa-solid fa-circle-xmark",
        desc: "No dimensions or cube – request docs."
      }
    ]
  },

  bol_request_dimensions: {
    text: "Ask for supporting documents showing the dimensions of the shipment.",
    help: "Customer must provide dimensions to calculate density.",
    choices: []
  },

  bol_divide_weight: {
    text: "Divide the total weight to the CUBE/CUBED on the body of the bill to get the PCF.",
    help: "Calculate PCF = weight / cube.",
    choices: [
      {
        label: "Continue",
        next: "bol_lookup_after_calc",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to NMFC lookup with PCF."
      }
    ]
  },

  bol_calculate_pcf: {
    text: "Calculate the new PCF.",
    help: "PCF = total weight / (L x W x H in cubic feet).",
    choices: [
      {
        label: "Continue",
        next: "bol_lookup_after_calc",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to NMFC lookup."
      }
    ]
  },

  bol_lookup_after_calc: {
    text: "Pull up the NMFC using NMFC lookup.",
    help: "Find the NMFC item that matches the commodity description.",
    choices: [
      {
        label: "Continue",
        next: "bol_subclass_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Check subclass based on PCF."
      }
    ]
  },

  bol_subclass_check: {
    text: "Check on what subclass the PCF will fall under.",
    help: "Density-based NMFCs have subclasses determined by PCF range.",
    choices: [
      {
        label: "Continue",
        next: "bol_apply_nmfc_invoice",
        icon: "fa-solid fa-arrow-right",
        desc: "Apply the correct subclass."
      }
    ]
  },

  bol_apply_nmfc_invoice: {
    text: "Apply the appropriate NMFC on the invoice.",
    help: "Update the invoice with the correct NMFC and subclass.",
    choices: []
  }

};
