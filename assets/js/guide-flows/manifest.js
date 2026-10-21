/* ============================================================
   GUIDE FLOW MANIFEST
   Maps each guide id → its flow script path and Firestore
   template collection.

   THIS FILE IS AUTO-GENERATED — do not edit by hand.
   Run `node tools/build-guide-manifest.js` from the repo root
   after adding or removing any guide flow file.

   flowPath values are ABSOLUTE from the site root because
   admin-templates.html lives at /admin-console/admin-templates/.
   ============================================================ */

window.GUIDE_FLOW_REPO_ROOT = "/Decision-Support-SystemV2/";

window.GUIDE_FLOW_MANIFEST = [
  {
    id: "debtor-update-per-bol",
    title: "Debtor Update per BOL",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/billing-disputes/debtor-update-per-bol.js",
    templateCollection: "debtor_update_per_bol_template"
  },
  {
    id: "debtor-update-per-loa",
    title: "Debtor Update per LOA",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/billing-disputes/debtor-update-per-loa.js",
    templateCollection: "debtor_update_per_loa_template"
  },
  {
    id: "debtor-update-per-rvsl",
    title: "Debtor Update per RVSL",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/billing-disputes/debtor-update-per-rvsl.js",
    templateCollection: "debtor_update_per_rvsl_template"
  },
  {
    id: "reference-number",
    title: "Reference Number",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/billing-disputes/reference-number.js",
    templateCollection: "reference_number_template"
  },
  {
    id: "service-level-type",
    title: "Service Level / Type Update per BOL",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/billing-disputes/service-level-type.js",
    templateCollection: "service_level_type_template"
  },
  {
    id: "weight-update-per-bol",
    title: "Weight Update per BOL",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/billing-disputes/weight-update-per-bol.js",
    templateCollection: "weight_update_per_bol_template"
  }
];
