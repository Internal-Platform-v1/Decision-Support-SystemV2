/* ============================================================
   GUIDE FLOW MANIFEST
   Maps each guide id → its flow script path and Firestore
   template collection.

   IMPORTANT: flowPath must be an ABSOLUTE path from the site
   root (e.g. "/Decision-Support-SystemV2/assets/js/...").
   Relative paths will 404 because admin-templates.html lives
   at /admin-console/admin-templates/.
   ============================================================ */

window.GUIDE_FLOW_REPO_ROOT = "/Decision-Support-SystemV2/";

window.GUIDE_FLOW_MANIFEST = [
  {
    id: "debtor-update-per-bol",
    title: "Debtor Update per BOL",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/billing-disputes/debtor-update-per-bol.js",
    templateCollection: "debtor_update_per_bol_template"
  }
];
