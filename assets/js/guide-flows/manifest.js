/* ============================================================
   GUIDE FLOW MANIFEST
   All guide flows, grouped by category.

   flowPath values are ABSOLUTE from the site root because
   admin-templates.html lives at /admin-console/admin-templates/.
   ============================================================ */

window.GUIDE_FLOW_REPO_ROOT = "/Decision-Support-SystemV2/";

window.GUIDE_FLOW_MANIFEST = [

  /* ---------------------------------------------------------
     BILLING DISPUTES
     --------------------------------------------------------- */
  {
    id: "debtor-update-per-bol",
    title: "Debtor Update per BOL",
    category: "Billing Disputes",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/billing-disputes/debtor-update-per-bol.js",
    templateCollection: "debtor_update_per_bol_template"
  },
  {
    id: "debtor-update-per-loa",
    title: "Debtor Update per LOA",
    category: "Billing Disputes",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/billing-disputes/debtor-update-per-loa.js",
    templateCollection: "debtor_update_per_loa_template"
  },
  {
    id: "debtor-update-per-rvsl",
    title: "Debtor Update per RVSL",
    category: "Billing Disputes",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/billing-disputes/debtor-update-per-rvsl.js",
    templateCollection: "debtor_update_per_rvsl_template"
  },
  {
    id: "reference-number",
    title: "Reference Number",
    category: "Billing Disputes",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/billing-disputes/reference-number.js",
    templateCollection: "reference_number_template"
  },
  {
    id: "service-level-type",
    title: "Service Level / Type Update per BOL",
    category: "Billing Disputes",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/billing-disputes/service-level-type.js",
    templateCollection: "service_level_type_template"
  },
  {
    id: "weight-update-per-bol",
    title: "Weight Update per BOL",
    category: "Billing Disputes",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/billing-disputes/weight-update-per-bol.js",
    templateCollection: "weight_update_per_bol_template"
  },

  /* ---------------------------------------------------------
     ACCOUNT HANDLING
     --------------------------------------------------------- */
  {
    id: "account-creation-steps",
    title: "Steps on How to Create an Account",
    category: "Account Handling",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/account-handling-guides/account-creation-steps.js",
    templateCollection: "account_creation_steps_template"
  },
  {
    id: "creating-customer-account",
    title: "Creating Customer's Account",
    category: "Account Handling",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/account-handling-guides/creating-customer-account.js",
    templateCollection: "creating_customer_account_template"
  },
  {
    id: "handling-notactive-guide",
    title: "Handling Inactive Account",
    category: "Account Handling",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/account-handling-guides/handling-notactive-guide.js",
    templateCollection: "handling_notactive_guide_template"
  },
  {
    id: "searching-account-guide",
    title: "Searching for Account Guide",
    category: "Account Handling",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/account-handling-guides/searching-account-guide.js",
    templateCollection: "searching_account_guide_template"
  },
  {
    id: "updating-pt-scacbu-guide",
    title: "Updating SCAC/BU Guide",
    category: "Account Handling",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/account-handling-guides/updating-pt-scacbu-guide.js",
    templateCollection: "updating_pt_scacbu_guide_template"
  },

  /* ---------------------------------------------------------
     PRICING
     --------------------------------------------------------- */
  {
    id: "base-rater",
    title: "Base Rater",
    category: "Pricing",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/pricing-guides/base-rater.js",
    templateCollection: "base_rater_template"
  },
  {
    id: "checking-eprs",
    title: "Checking EPRS",
    category: "Pricing",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/pricing-guides/checking-eprs.js",
    templateCollection: "checking_eprs_template"
  },
  {
    id: "courtesy-discount",
    title: "Courtesy Discount",
    category: "Pricing",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/pricing-guides/courtesy-discount.js",
    templateCollection: "courtesy_discount_template"
  },
  {
    id: "discount-amc-guide",
    title: "Discount - AMC Guide",
    category: "Pricing",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/pricing-guides/discount-amc-guide.js",
    templateCollection: "discount_amc_guide_template"
  },
  {
    id: "eprt-guide",
    title: "ePRT Guide",
    category: "Pricing",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/pricing-guides/eprt-guide.js",
    templateCollection: "eprt_guide_template"
  },
  {
    id: "eprt-submission",
    title: "ePRT Submission",
    category: "Pricing",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/pricing-guides/eprt-submission.js",
    templateCollection: "eprt_submission_template"
  },
  {
    id: "fuel-guide",
    title: "Fuel Guide",
    category: "Pricing",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/pricing-guides/fuel-guide.js",
    templateCollection: "fuel_guide_template"
  },
  {
    id: "surcharge-guide",
    title: "Surcharge Guide",
    category: "Pricing",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/pricing-guides/surcharge-guide.js",
    templateCollection: "surcharge_guide_template"
  },

  /* ---------------------------------------------------------
     PAUD
     --------------------------------------------------------- */
  {
    id: "bloa-guide",
    title: "BLOA Guide – Accessorial & Terms Validation",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/bloa-guide.js",
    templateCollection: "bloa_guide_template"
  },
  {
    id: "cod-guide",
    title: "COD (Collect on Delivery) Guide",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/cod-guide.js",
    templateCollection: "cod_guide_template"
  },
  {
    id: "cort-guide",
    title: "CORT – Reconsignment Guide",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/cort-guide.js",
    templateCollection: "cort_guide_template"
  },
  {
    id: "crau-guide",
    title: "CRAU — Request Decision Guide",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/crau-guide.js",
    templateCollection: "crau_guide_template"
  },
  {
    id: "hot-ehot-queue-guide",
    title: "HOT – EHOT Queue Requests Guide",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/hot-ehot-queue-guide.js",
    templateCollection: "hot_ehot_queue_guide_template"
  },
  {
    id: "irt-vsat-guide",
    title: "IRT/VSAT – Queue Guide",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/irt-vsat-guide.js",
    templateCollection: "irt_vsat_guide_template"
  },
  {
    id: "irt1-po-number-division-guide",
    title: "IRT1 – PO Number & Division Validation",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/irt1-po-number-division-guide.js",
    templateCollection: "irt1_po_number_division_guide_template"
  },
  {
    id: "ispd-guide",
    title: "Invalid Consignee/Shipper Account (ISPD)",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/ispd-guide.js",
    templateCollection: "ispd_guide_template"
  },
  {
    id: "lmpb-guide",
    title: "LMPB (Lumper Fee) Guide",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/lmpb-guide.js",
    templateCollection: "lmpb_guide_template"
  },
  {
    id: "pars-guide",
    title: "PARS – Parker Hannifin Queue Guide",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/pars-guide.js",
    templateCollection: "pars_guide_template"
  },
  {
    id: "pat7-guide",
    title: "PAT7 Guide",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/pat7-guide.js",
    templateCollection: "pat7_guide_template"
  },
  {
    id: "pat8-guide",
    title: "PAT8 – Multi-Company Queue Guide",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/pat8-guide.js",
    templateCollection: "pat8_guide_template"
  },
  {
    id: "paud-fpay-guide",
    title: "PAUD-FPAY Guide",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/paud-fpay-guide.js",
    templateCollection: "paud_fpay_guide_template"
  },
  {
    id: "paud-tpkn-guide",
    title: "PAUD / TPKN Guide",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/paud-tpkn-guide.js",
    templateCollection: "paud_tpkn_guide_template"
  },
  {
    id: "region-and-ehot-queue",
    title: "Regions and EHOT Queue Guide",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/region-and-ehot-queue.js",
    templateCollection: "region_and_ehot_queue_template"
  },
  {
    id: "saf2-guide",
    title: "SAF2 Guide – NMFC, Reweigh & Weight Validation",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/saf2-guide.js",
    templateCollection: "saf2_guide_template"
  },
  {
    id: "tphi-guide",
    title: "TPHI Guide",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/tphi-guide.js",
    templateCollection: "tphi_guide_template"
  },
  {
    id: "tplo-guide",
    title: "TPLO Guide",
    category: "PAUD",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/paud-guides/tplo-guide.js",
    templateCollection: "tplo_guide_template"
  },

  /* ---------------------------------------------------------
     OTHER SURCHARGES
     --------------------------------------------------------- */
  {
    id: "california-compliance",
    title: "California Compliance",
    category: "Other Surcharges",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-surcharge-guides/california-compliance.js",
    templateCollection: "california_compliance_template"
  },
  {
    id: "canadian-custom-inspection-fee",
    title: "Canadian Custom Inspection Fee",
    category: "Other Surcharges",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-surcharge-guides/canadian-custom-inspection-fee.js",
    templateCollection: "canadian_custom_inspection_fee_template"
  },
  {
    id: "canadian-surcharge-guide",
    title: "Canadian Surcharge Guide",
    category: "Other Surcharges",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-surcharge-guides/canadian-surcharge-guide.js",
    templateCollection: "canadian_surcharge_guide_template"
  },
  {
    id: "cross-border-processing-fee",
    title: "Cross-Border Processing Fee",
    category: "Other Surcharges",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-surcharge-guides/cross-border-processing-fee.js",
    templateCollection: "cross_border_processing_fee_template"
  },
  {
    id: "high-cost-fee",
    title: "High Cost Fee",
    category: "Other Surcharges",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-surcharge-guides/high-cost-fee.js",
    templateCollection: "high_cost_fee_template"
  },
  {
    id: "lumper-fee-guide",
    title: "Lumper Fee Guide",
    category: "Other Surcharges",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-surcharge-guides/lumper-fee-guide.js",
    templateCollection: "lumper_fee_guide_template"
  },
  {
    id: "nost-guide",
    title: "NOST Guide",
    category: "Other Surcharges",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-surcharge-guides/nost-guide.js",
    templateCollection: "nost_guide_template"
  },
  {
    id: "notify-fee-guide",
    title: "Notify Fee Guide",
    category: "Other Surcharges",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-surcharge-guides/notify-fee-guide.js",
    templateCollection: "notify_fee_guide_template"
  },
  {
    id: "peak-surcharge-fee",
    title: "Peak Surcharge Fee",
    category: "Other Surcharges",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-surcharge-guides/peak-surcharge-fee.js",
    templateCollection: "peak_surcharge_fee_template"
  },
  {
    id: "redelivery-handling-guide",
    title: "Redelivery Handling Guide",
    category: "Other Surcharges",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-surcharge-guides/redelivery-handling-guide.js",
    templateCollection: "redelivery_handling_guide_template"
  },
  {
    id: "sort-and-segregate-guide",
    title: "Sort & Segregate Guide",
    category: "Other Surcharges",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-surcharge-guides/sort-and-segregate-guide.js",
    templateCollection: "sort_and_segregate_guide_template"
  },
  {
    id: "storage-fee-guide",
    title: "Storage Fee Guide",
    category: "Other Surcharges",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-surcharge-guides/storage-fee-guide.js",
    templateCollection: "storage_fee_guide_template"
  },
  {
    id: "weighing-service-guide",
    title: "Weighing Service Fee",
    category: "Other Surcharges",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-surcharge-guides/weighing-service-guide.js",
    templateCollection: "weighing_service_guide_template"
  },
  {
    id: "zip-service-charge",
    title: "Zip Service Charge",
    category: "Other Surcharges",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-surcharge-guides/zip-service-charge.js",
    templateCollection: "zip_service_charge_template"
  },

  /* ---------------------------------------------------------
     OTHER GUIDES
     --------------------------------------------------------- */
  {
    id: "all-shorts-guide",
    title: "All Shorts Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/all-shorts-guide.js",
    templateCollection: "all_shorts_guide_template"
  },
  {
    id: "class-update-guide",
    title: "Class Update Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/class-update-guide.js",
    templateCollection: "class_update_guide_template"
  },
  {
    id: "correction-code-guide",
    title: "Correction Code Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/correction-code-guide.js",
    templateCollection: "correction_code_guide_template"
  },
  {
    id: "demand-invoice-guide",
    title: "Demand Invoice Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/demand-invoice-guide.js",
    templateCollection: "demand_invoice_guide_template"
  },
  {
    id: "employee-discount-guide",
    title: "Employee Discount Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/employee-discount-guide.js",
    templateCollection: "employee_discount_guide_template"
  },
  {
    id: "fedex-direct-guide",
    title: "FedEx Direct Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/fedex-direct-guide.js",
    templateCollection: "fedex_direct_guide_template"
  },
  {
    id: "handling-fee-guide",
    title: "Handling Fee Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/handling-fee-guide.js",
    templateCollection: "handling_fee_guide_template"
  },
  {
    id: "inbond-fee-guide",
    title: "Inbond Fee Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/inbond-fee-guide.js",
    templateCollection: "inbond_fee_guide_template"
  },
  {
    id: "information-validation-guide",
    title: "Verifying Tracking Number Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/information-validation-guide.js",
    templateCollection: "information_validation_guide_template"
  },
  {
    id: "ispi-guide",
    title: "ISPI — Mass Adjustment Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/ispi-guide.js",
    templateCollection: "ispi_guide_template"
  },
  {
    id: "keep-or-remove-payment-guide",
    title: "Keep or Remove Payment Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/keep-or-remove-payment-guide.js",
    templateCollection: "keep_or_remove_payment_guide_template"
  },
  {
    id: "missing-docs-guide",
    title: "Missing Documents Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/missing-docs-guide.js",
    templateCollection: "missing_docs_guide_template"
  },
  {
    id: "ovc-general-guide",
    title: "OVC — General Guideline",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/ovc-general-guide.js",
    templateCollection: "ovc_general_guide_template"
  },
  {
    id: "priority-plus-guide",
    title: "Expedited Shipment / Priority Plus Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/priority-plus-guide.js",
    templateCollection: "priority_plus_guide_template"
  },
  {
    id: "pro-no-suffix",
    title: "Pro Number Suffix Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/pro-no-suffix.js",
    templateCollection: "pro_no_suffix_guide_template"
  },
  {
    id: "rate-volume-guide",
    title: "Rate & Volume Quote Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/rate-volume-guide.js",
    templateCollection: "rate_volume_guide_template"
  },
  {
    id: "recycled-pro-guide",
    title: "Recycled Pro Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/recycled-pro-guide.js",
    templateCollection: "recycled_pro_guide_template"
  },
  {
    id: "rerate-treatment-process-guide",
    title: "Rerate Treatment Process Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/rerate-treatment-process-guide.js",
    templateCollection: "rerate_treatment_process_guide_template"
  },
  {
    id: "reweigh-general-guide",
    title: "Reweigh — General Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/reweigh-general-guide.js",
    templateCollection: "reweigh_general_guide_template"
  },
  {
    id: "sales-write-off-guide",
    title: "Sales Write-Off Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/sales-write-off-guide.js",
    templateCollection: "sales_write_off_guide_template"
  },
  {
    id: "shave-a-day-guide",
    title: "Shave a Day Guide / Early Delivery Fee",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/shave-a-day-guide.js",
    templateCollection: "shave_a_day_guide_template"
  },
  {
    id: "void-and-wo-guide",
    title: "Void and Write Off Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/void-and-wo-guide.js",
    templateCollection: "void_and_wo_guide_template"
  },
  {
    id: "volume-application",
    title: "Volume Application Guide",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/volume-application.js",
    templateCollection: "volume_application_guide_template"
  },
  {
    id: "wo-process-caps-guide",
    title: "Write-off in CAPS — Step by Step Procedure",
    category: "Other Guides",
    flowPath: window.GUIDE_FLOW_REPO_ROOT + "assets/js/guide-flows/other-guides/wo-process-caps-guide.js",
    templateCollection: "wo_process_caps_guide_template"
  }

];
