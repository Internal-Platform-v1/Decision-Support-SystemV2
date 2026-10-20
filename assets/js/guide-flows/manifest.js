/* ============================================================
   GUIDE FLOW MANIFEST
   Maps each guide id → its flow script path and Firestore
   template collection.

   Admin Templates uses this to:
     1. Load the guide flow file (GUIDE_CONFIG + GUIDE_NODES)
     2. Extract every final recommendation (leaf node)
     3. Read/write comment__/corr__/email__ docs in
        the guide's templateCollection.

   Keep ids in sync with window.GUIDE_REGISTRY (admin-dashboard.html).
   ============================================================ */

window.GUIDE_FLOW_MANIFEST = [
  {
    id: "debtor-update-per-bol",
    title: "Debtor Update per BOL",
    flowPath: "assets/js/guide-flows/billing-disputes/debtor-update-per-bol.js",
    templateCollection: "debtor_update_per_bol_template"
  }
  // Add more guides here as they are created, e.g.:
  // ,{
  //   id: "reweigh-general-guide",
  //   title: "Reweigh — General Guide",
  //   flowPath: "assets/js/guide-flows/billing-disputes/reweigh-general-guide.js",
  //   templateCollection: "reweigh_general_guide_template"
  // }
];
