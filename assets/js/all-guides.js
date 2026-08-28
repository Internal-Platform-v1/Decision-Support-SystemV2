/* DSS V2 — ALL GUIDES LIBRARY */
(function(){
  "use strict";

  const GROUP_SOURCES = [
    {url:"billing-dispute-guides.html",group:"Billing Dispute",category:"billing"},
    {url:"pricing-guides.html",group:"Pricing",category:"pricing"},
    {url:"other-surcharges-guide.html",group:"Other Surcharges",category:"surcharge"},
    {url:"account-handling-guides.html",group:"Account Handling",category:"account"},
    {url:"paud-queue-guides.html",group:"PAUD Queue",category:"paud"},
    {url:"other-guides.html",group:"Other",category:"other"}
  ];

  const FALLBACK_GUIDES = [
  {
    "title": "Debtor Update per BOL",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Billing Dispute Guides/BD GENERAL GUIDE.html",
    "keywords": "debtor update per bol billing dispute bol debtor billing general",
    "group": "Billing Dispute",
    "category": "billing",
    "icon": "fa-solid fa-file-invoice-dollar"
  },
  {
    "title": "Debtor Update per LOA",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Billing Dispute Guides/Rebill per LOA General Guide.html",
    "keywords": "debtor update per loa rebill loa 3pl fpay collector billing",
    "group": "Billing Dispute",
    "category": "billing",
    "icon": "fa-solid fa-rotate"
  },
  {
    "title": "Debtor Update per Reversal/Refusal",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Billing Dispute Guides/rvsl-guide.html",
    "keywords": "debtor update reversal refusal rvsl billing reversal refusal rebill denial",
    "group": "Billing Dispute",
    "category": "billing",
    "icon": "fa-solid fa-arrow-right-arrow-left"
  },
  {
    "title": "Weight Update per BOL",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Billing Dispute Guides/weight-update-per-bol-guide.html",
    "keywords": "weight update per bol weight reweigh dispute pallet billing",
    "group": "Billing Dispute",
    "category": "billing",
    "icon": "fa-solid fa-weight-hanging"
  },
  {
    "title": "Service Level/Type Update per BOL",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Billing Dispute Guides/service-level-type-guide.html",
    "keywords": "service level type update bol service validation rating billing",
    "group": "Billing Dispute",
    "category": "billing",
    "icon": "fa-solid fa-truck-fast"
  },
  {
    "title": "Reference Number Update - Add/Edit/Delete",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Billing Dispute Guides/reference-number-guide.html",
    "keywords": "reference number update add edit delete demand invoice billing reference",
    "group": "Billing Dispute",
    "category": "billing",
    "icon": "fa-solid fa-hashtag"
  },
  {
    "title": "Fuel Guide",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "pricing-guides-list/fuel-guide.html",
    "keywords": "fuel pricing guide dispute charge review",
    "group": "Pricing",
    "category": "pricing",
    "icon": "fa-solid fa-gas-pump quick-svg"
  },
  {
    "title": "Surcharge Guide",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "pricing-guides-list/surcharge-guide.html",
    "keywords": "surcharge pricing guide review validation dispute",
    "group": "Pricing",
    "category": "pricing",
    "icon": "fa-solid fa-receipt quick-svg"
  },
  {
    "title": "ePRT Guide",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "pricing-guides-list/eprt-guide.html",
    "keywords": "eprt guide exception escalation review pricing",
    "group": "Pricing",
    "category": "pricing",
    "icon": "fa-solid fa-file-lines quick-svg"
  },
  {
    "title": "ePRT Submission",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "pricing-guides-list/eprt-submission.html",
    "keywords": "eprt submission routing escalation submit",
    "group": "Pricing",
    "category": "pricing",
    "icon": "fa-solid fa-paper-plane quick-svg"
  },
  {
    "title": "Checking EPRS",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "pricing-guides-list/checking-eprs.html",
    "keywords": "checking eprs agreement pricing setup validation tool",
    "group": "Pricing",
    "category": "pricing",
    "icon": "fa-solid fa-magnifying-glass quick-svg"
  },
  {
    "title": "Base Rater",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "pricing-guides-list/base-rater.html",
    "keywords": "base rater rate validation pricing tool",
    "group": "Pricing",
    "category": "pricing",
    "icon": "fa-solid fa-calculator quick-svg"
  },
  {
    "title": "Discount - AMC Guide",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "pricing-guides-list/discount-amc-guide.html",
    "keywords": "discount amc pricing agreement exception rerate guide",
    "group": "Pricing",
    "category": "pricing",
    "icon": "fa-solid fa-tags quick-svg"
  },
  {
    "title": "Courtesy Discount",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "pricing-guides-list/courtesy-discount.html",
    "keywords": "courtesy discount surcharge guide adjustment pricing",
    "group": "Pricing",
    "category": "pricing",
    "icon": "fa-solid fa-hand-holding-dollar quick-svg"
  },
  {
    "title": "High Cost Fee",
    "description": "Open the guide for high cost fee review, related surcharge questions, and supporting validation steps.",
    "small": "Use this when the concern involves high cost fee review or validation.",
    "url": "other-surcharges/high-cost-fee.html",
    "keywords": "",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-money-bill-wave"
  },
  {
    "title": "Peak Surcharge Fee",
    "description": "Review peak surcharge concerns and open the correct guide for temporary or period-based surcharge questions.",
    "small": "Helpful for peak period charge review and surcharge validation.",
    "url": "other-surcharges/peak-surcharge-fee.html",
    "keywords": "",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-chart-line"
  },
  {
    "title": "California Compliance",
    "description": "Open the California compliance guide for surcharge concerns tied to compliance requirements or charge validation.",
    "small": "Helpful for compliance-related surcharge review and guidance.",
    "url": "other-surcharges/california-compliance.html",
    "keywords": "",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-scale-balanced"
  },
  {
    "title": "Zip Service Charge",
    "description": "Use this guide when the concern is tied to zip service charge validation, location-based review, or surcharge logic.",
    "small": "Best for zip-based service charge review and related guidance.",
    "url": "other-surcharges/zip-service-charge.html",
    "keywords": "",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-location-dot"
  },
  {
    "title": "Cross-Border Processing Fee",
    "description": "Open this guide for cross-border processing fee concerns, international surcharge review, and next-step validation.",
    "small": "Use this for international or cross-border surcharge fee review.",
    "url": "other-surcharges/cross-border-processing-fee.html",
    "keywords": "",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-globe"
  },
  {
    "title": "Canadian Custom Inspection Fee",
    "description": "Review Canadian custom inspection fee concerns with the correct guide for inspection-related surcharge validation.",
    "small": "Use this for Canada inspection-related surcharge questions and validation.",
    "url": "other-surcharges/canadian-custom-inspection-fee.html",
    "keywords": "",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-box-open"
  },
  {
    "title": "Canadian Surcharge Guide",
    "description": "Open the Canadian surcharge guide for Canada-related surcharge review, validation, and the correct next pricing action.",
    "small": "Use this for Canadian surcharge concerns, charge review, and related guidance.",
    "url": "other-surcharges/canadian-surcharge-guide.html",
    "keywords": "",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-flag"
  },
  {
    "title": "Weighing Service Fee",
    "description": "Use this guide to validate weighing service fee disputes and determine if the charge should be applied or removed.",
    "small": "Best for verifying if weighing service was requested and validating the fee.",
    "url": "other-surcharges/weighing-service-guide.html",
    "keywords": "",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-weight-scale"
  },
  {
    "title": "NOST Guide",
    "description": "Structured guide for NOST disputes including pickup request validation, dashboard review, shipment history checks, courtesy handling, and void or account correction actions.",
    "small": "Use this for NOST dispute handling, courtesy review, account correction, and RQD1 void processing.",
    "url": "nost-guide.html",
    "keywords": "",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-bell"
  },
  {
    "title": "Sort & Segregate Guide",
    "description": "Decision tree for validating Sort & Segregate disputes and determining the correct surcharge handling.",
    "small": "Use this for sort and segregate fee review, validation, and correct keep-or-remove handling.",
    "url": "sort-and-segregate-guide.html",
    "keywords": "",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-shuffle"
  },
  {
    "title": "Notify Fee Guide",
    "description": "Decision tree for handling Notify Fee disputes and validating whether the notification charge should stay or be removed.",
    "small": "Use this for notify charge validation, dispute handling, and final surcharge action.",
    "url": "notify-fee-guide.html",
    "keywords": "",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-phone-volume"
  },
  {
    "title": "Handling Inactive Account",
    "description": "Open this guide when the concern involves inactive, archived, deleted, or do-not-use account handling and the correct next action.",
    "small": "Use this when validating account status and next handling steps.",
    "url": "account-handling-guides-list/handling-notactive-guide.html",
    "keywords": "",
    "group": "Account Handling",
    "category": "account",
    "icon": "fa-solid fa-user-xmark"
  },
  {
    "title": "Creating Customer's Account",
    "description": "Use this guide when the request involves creating a new customer account and following the correct setup process.",
    "small": "Best for new customer account setup and related handling steps.",
    "url": "account-handling-guides-list/creating-customer-account.html",
    "keywords": "",
    "group": "Account Handling",
    "category": "account",
    "icon": "fa-solid fa-user-plus"
  },
  {
    "title": "Steps on How to Create an Account",
    "description": "Open this guide for a step-by-step account creation process when you need a more structured setup walkthrough.",
    "small": "Helpful for guided account setup and complete creation flow review.",
    "url": "account-handling-guides-list/account-creation-steps.html",
    "keywords": "",
    "group": "Account Handling",
    "category": "account",
    "icon": "fa-solid fa-list-check"
  },
  {
    "title": "Searching for Account Guide",
    "description": "Use this guide when the concern involves locating, validating, or reviewing the correct customer account before proceeding.",
    "small": "Use this when you need to search and confirm the correct account first.",
    "url": "account-handling-guides-list/searching-account-guide.html",
    "keywords": "",
    "group": "Account Handling",
    "category": "account",
    "icon": "fa-solid fa-magnifying-glass"
  },
  {
    "title": "Updating SCAC/BU Guide",
    "description": "Open this guide when the request involves SCAC/BU updates, validation, or the correct next correction step.",
    "small": "Best for SCAC/BU correction, validation, and update handling.",
    "url": "account-handling-guides-list/updating-bt-scacbu-guide.html",
    "keywords": "",
    "group": "Account Handling",
    "category": "account",
    "icon": "fa-solid fa-code-branch"
  },
  {
    "title": "Regions and EHOT Queue Guide",
    "description": "Use this guide to review, validate, and process region and EHOT queue requests including account, accessorial, service type, and related updates.",
    "small": "Best for EHOT queue requests, account setup validation, shipment volume checks, and related service updates.",
    "url": "region-and-ehot-queue.html",
    "keywords": "",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-earth-americas"
  },
  {
    "title": "TPLO Guide",
    "description": "Use this guide for TPLO requests including SPOC validation, account mapping, special account routing, and proper billing handling.",
    "small": "Best for account relationship checks, SPOC routing, and CORR ACCR billing actions.",
    "url": "tplo-guide.html",
    "keywords": "",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-sitemap"
  },
  {
    "title": "TPHI Guide",
    "description": "Follow the TEMP-SYS matching process to correctly map charge accounts and ensure proper debtor selection.",
    "small": "Covers account validation, archived/invalid debtor handling, and proper mapping steps.",
    "url": "tphi-guide.html",
    "keywords": "",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-diagram-project"
  },
  {
    "title": "PAUD / TPKN Guide",
    "description": "Follow the step-by-step process for replacing Shipper Code requests including account validation, auto-rating, and correction handling.",
    "small": "Covers queue movement, NOAR scenarios, pricing checks, and correction steps.",
    "url": "paud-tpkn-guide.html",
    "keywords": "",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-boxes-stacked"
  },
  {
    "title": "CRAU — Request Decision Guide",
    "description": "Use this guide for CRAU requests, validation checks, request review, and the correct next action based on the case details.",
    "small": "Best for CRAU request handling, validation, queue review, and processing decisions.",
    "url": "crau-guide.html",
    "keywords": "",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-network-wired"
  },
  {
    "title": "PAUD-FPAY Guide",
    "description": "Open the PAUD-FPAY guide for payment-related handling, validation checks, account review, and proper workflow decisions.",
    "small": "Best for payment queue review, account validation, and structured PAUD-FPAY decision handling.",
    "url": "paud-fpay-guide.html",
    "keywords": "",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-credit-card"
  },
  {
    "title": "COD (Collect on Delivery) Guide",
    "description": "Follow this guide to add or remove COD based on original BOL validation, required COD details, LOA/CBL support, keyword handling, and final autorating steps.",
    "small": "Best for COD validation, adding COD charges, removing COD via LOA, keyword cleanup, and billing correction handling.",
    "url": "cod-guide.html",
    "keywords": "",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-money-bill-transfer"
  },
  {
    "title": "Invalid Consignee/Shipper Account (ISPD)",
    "description": "Follow this guide to review ISPD queue requests, validate shipper or consignee account discrepancies, and apply the correct ACCR correction path.",
    "small": "Best for invalid shipper or consignee account review, BOL validation, AEM account checks, and ACCR correction handling.",
    "url": "ispd-guide.html",
    "keywords": "",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-user-xmark"
  },
  {
    "title": "OVC — General Guideline",
    "description": "Official OVC guideline for handling customer claims and disputes.",
    "small": "Use this for OVC claim handling and requirement checks.",
    "url": "OVC GENERAL GUIDE.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-shield"
  },
  {
    "title": "Reweigh — General Guide",
    "description": "Decision guide for reweigh disputes and corrections.",
    "small": "Use this for weight disputes and reweigh validation.",
    "url": "Reweigh General Guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-arrows-up-down-left-right"
  },
  {
    "title": "Correction Code Guide",
    "description": "Decision tree to determine the correct CORR CODE.",
    "small": "Use this for selecting the correct correction code.",
    "url": "Correction Code Guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-wand-magic-sparkles"
  },
  {
    "title": "FedEx Direct Guide",
    "description": "Decision tree for FedEx Direct disputes and validation.",
    "small": "Use this for FedEx Direct dispute handling.",
    "url": "FedEx Direct Guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-road"
  },
  {
    "title": "Class Update Guide",
    "description": "Decision tree for handling Class Update requests.",
    "small": "Use this for class correction requests.",
    "url": "class-update-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-layer-group"
  },
  {
    "title": "Rate & Volume Quote Guide",
    "description": "Decision tree for validating LTL and Volume Quotes.",
    "small": "Use this for quote validation and rate disputes.",
    "url": "rate-volume-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-sack-dollar"
  },
  {
    "title": "Shave a Day Guide/Early Delivery Fee",
    "description": "Use this guide to verify SHAD fee concerns, confirm LOA and service level details, check delivery status, and decide whether to validate the fee, remove it, or update the shipment service type.",
    "small": "Best for SHAD fee disputes, Economy to Priority service upgrades, Early Delivery validation, and service level correction handling.",
    "url": "shave-a-day-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-calendar-day"
  },
  {
    "title": "Verifying Tracking Number Guide",
    "description": "Guide for validating freight information.",
    "small": "Use this for delivery and tracking validation.",
    "url": "information-validation-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-magnifying-glass-location"
  },
  {
    "title": "Missing Documents Guide",
    "description": "Guide for requesting missing documents.",
    "small": "Use this for missing BOL and document requests.",
    "url": "missing-docs-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-file-lines"
  },
  {
    "title": "Keep or Remove Payment Guide",
    "description": "Determine whether to keep or remove payments based on LOA, billing corrections, and pricing scenarios.",
    "small": "Covers LOA correction requests, billing errors, and pricing/reweigh handling with clear decision steps.",
    "url": "keep_or_remove_payment_guide_fixed.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-scale-balanced"
  },
  {
    "title": "Demand Invoice Guide",
    "description": "Follow a structured decision flow for demand invoice cases including PRO posted checks, queue handling, resend scenarios, and invoice types.",
    "small": "Covers resend invoice, duplicate invoice handling, PRO posted logic, and queue escalation steps.",
    "url": "demand-invoice-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-file-invoice"
  },
  {
    "title": "Recycled Pro Guide",
    "description": "Use this guide to identify recycled PRO issues, validate version history, and apply the correct resolution steps.",
    "small": "Best for handling recycled PRO cases and validating old shipment versions.",
    "url": "recycled-pro-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-recycle"
  },
  {
    "title": "Employee Discount Guide",
    "description": "Use this guide to validate employee discount eligibility and determine if the discount should be applied or confirmed.",
    "small": "Best for handling employee discount requests and verifying invoice application.",
    "url": "employee-discount-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-percent"
  },
  {
    "title": "Void and Write Off Guide",
    "description": "Follow a structured decision flow for service errors, Grainger rebill scenarios, surcharge handling, PRO voiding, and write-off processing.",
    "small": "Best for handling void requests, surcharge removal, Grainger rebill cases, and full write-off processes.",
    "url": "void-and-wo-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-file-circle-xmark"
  },
  {
    "title": "Pro Number Suffix Guide",
    "description": "Use this guide to identify the correct handling based on PRO number suffix including F0, D0, C0, Y0, and non-revenue scenarios.",
    "small": "Best for handling dead freight, VOID queue cases, company business shipments, salvage, and master PRO validation.",
    "url": "pro-no-suffix.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-list-ol"
  },
  {
    "title": "Volume Application Guide",
    "description": "Use this guide to review, validate, and process volume application requests with the correct checks and handling steps.",
    "small": "Best for handling volume application requests, validation steps, and proper processing workflow.",
    "url": "volume-application.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-box-open"
  },
  {
    "title": "PAT7 Guide",
    "description": "Use this guide to review special invoice handling for EOIR, Lockheed Martin, Sikorsky Aircraft, United Launch Alliance, NOAR Alaska/Hawaii bills, and Amcoat Ind.",
    "small": "Best for PAT7 queue review, BOL imaging checks, special invoice billing, reference edit handling, PO validation, and correct invoice posting actions.",
    "url": "pat7-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-clipboard-check"
  },
  {
    "title": "Expedited Shipment / Priority Plus Guide",
    "description": "Use this guide to review FXF Priority Plus or Expedited Shipment disputes, validate whether the concern is rate or service related, and confirm BOL or LOA support.",
    "small": "Best for Priority Plus fee validation, FXFP service upgrades, BOL request checks, LOA support review, and Service Center follow-up handling.",
    "url": "priority-plus-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-gauge-high"
  },
  {
    "title": "Rerate Treatment Process Guide",
    "description": "Use this guide to determine the correct rerate handling based on PRO age, pricing status, debtor or account updates, billing corrections, LOA rebills, and surcharge rebill requests.",
    "small": "Best for rerate treatment decisions, over-one-year shipment review, write-off routing, pricing fall-off checks, billing error corrections, and small pricing queue handling.",
    "url": "rerate-treatment-process-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-file-invoice-dollar"
  },
  {
    "title": "Inbond Fee Guide",
    "description": "Use this guide to validate Inbond fee disputes by reviewing BOL documentation, Cargo Care indicators, and Pro comments to determine if removal or validation is the appropriate action.",
    "small": "Best for Inbond fee disputes, BOL document checks, Cargo Care review, and keep-or-remove decision handling.",
    "url": "inbond-fee-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-hand-holding-dollar"
  },
  {
    "title": "Handling Fee Guide",
    "description": "Use this guide to validate Handling fee disputes by reviewing liftgate usage, loading/unloading requirements, assembly requests, and supporting documentation to determine if removal or validation is the appropriate action.",
    "small": "Best for Handling fee disputes, liftgate usage verification, loading/unloading validation, assembly request review, and keep-or-remove decision handling.",
    "url": "handling-fee-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-hand"
  },
  {
    "title": "ISPI — Mass Adjustment Guide",
    "description": "Follow a structured step‑by‑step process for mass adjustments in iSPI, including PRO entry, invalid number removal, account changes, approval limit checks, and final processing.",
    "small": "Best for mass account updates, bill‑to corrections, shipper/consignee changes, and rebilling up to 500 PROs at once.",
    "url": "ispi-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-arrows-rotate"
  },
  {
    "title": "All Shorts Guide",
    "description": "Use this guide to handle All Short and Partial Short disputes. Review shipment history, claim status, LOA documentation, and piece/pallet counts to determine the correct resolution path for each case.",
    "small": "Best for All Short and Partial Short disputes, claim status verification, LOA handling, Sales Representative escalation, and weight/piece count corrections.",
    "url": "all-shorts-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-boxes"
  },
  {
    "title": "Sales Write-Off Guide",
    "description": "Review Sales Write-Off requests by reading case details, validating PRO information, checking debtor eligibility, and following approval thresholds ($500 and $2,000) for write-off processing.",
    "small": "Best for sales write-off requests, multiple dispute handling, debtor eligibility checks, and approval processing with TL and KURT.",
    "url": "sales-write-off-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-pen-to-square"
  },
  {
    "title": "Write-off in CAPS- Step by Step Procedure",
    "description": "Step-by-step guide to process write-offs in CAPS, from selecting the correct Business Unit, entering PROs and reason codes, adding FBC comments, responding to sales reps, and closing the case.",
    "small": "Best for handling write-off requests, CAPS workflow, PRO entry, reason codes, FBC comments, sales rep responses, and case closure.",
    "url": "wo-process-caps-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-file-circle-xmark"
  }
];
  let guides = FALLBACK_GUIDES.slice();
  let activeFilter = "all";
  let searchTerm = "";

  const els = {};
  const iconFallback = {billing:"fa-solid fa-scale-balanced",pricing:"fa-solid fa-tags",surcharge:"fa-solid fa-receipt",account:"fa-solid fa-user-gear",paud:"fa-solid fa-diagram-project",other:"fa-solid fa-layer-group"};

  function cleanText(value) {
    return String(value || "").replace(/\s+/g," ").trim();
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  }

  function normalize(value) {
    return cleanText(value).toLowerCase().replace(/&amp;/g,"&");
  }

  function getUrl(card, sourceUrl) {
    const raw = card.getAttribute("data-url") || card.querySelector("a[href]")?.getAttribute("href") || "";
    if (!raw) return "";
    if (/^(https?:|mailto:|tel:|#)/i.test(raw)) return raw;
    return raw.replace(/^\.\//,"");
  }

  function extractGuidesFromHtml(source, htmlText) {
    const doc = new DOMParser().parseFromString(htmlText,"text/html");
    const cards = Array.from(doc.querySelectorAll("#guideGrid .guide-card"));
    return cards.map(card => {
      const title = cleanText(card.querySelector("h3")?.textContent);
      if (!title) return null;
      const desc = cleanText(card.querySelector("p.lead")?.textContent || card.querySelector(".guide-card-content p")?.textContent);
      const small = cleanText(card.querySelector("p.small")?.textContent);
      const keywords = cleanText(card.getAttribute("data-search") || "");
      const iconEl = card.querySelector(".guide-card-icon i, .guide-icon i, .quick-icon i");
      const icon = cleanText(iconEl?.className) || iconFallback[source.category];
      const url = getUrl(card, source.url);
      return {title,description:desc,small,url,keywords,group:source.group,category:source.category,icon};
    }).filter(Boolean);
  }

  async function loadLiveGuides() {
    const results = await Promise.all(GROUP_SOURCES.map(async source => {
      try {
        const response = await fetch(source.url, {cache:"no-store"});
        if (!response.ok) throw new Error(String(response.status));
        return extractGuidesFromHtml(source, await response.text());
      } catch (_) {
        return [];
      }
    }));
    const live = results.flat();
    if (live.length >= 20) guides = dedupe(live);
  }

  function dedupe(list) {
    const seen = new Set();
    return list.filter(item => {
      const key = normalize(item.title) + "|" + normalize(item.url);
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
  }

  function scoreGuide(item, term) {
    if (!term) return 0;
    const title = normalize(item.title), group = normalize(item.group), desc = normalize(item.description), kw = normalize(item.keywords + " " + item.small);
    let score = 0;
    if (title === term) score += 1000;
    if (title.startsWith(term)) score += 400;
    if (title.includes(term)) score += 220;
    if (group.includes(term)) score += 80;
    if (kw.includes(term)) score += 65;
    if (desc.includes(term)) score += 45;
    const words = term.split(/\s+/).filter(Boolean);
    words.forEach(w => { if(title.includes(w)) score += 35; else if(kw.includes(w)) score += 15; else if(desc.includes(w)) score += 8; });
    return score;
  }

  function getMatches() {
    const term = normalize(searchTerm);
    let result = guides.filter(g => activeFilter === "all" || g.category === activeFilter);
    if (term) result = result.filter(g => scoreGuide(g,term) > 0).sort((a,b) => scoreGuide(b,term)-scoreGuide(a,term));
    else result.sort((a,b) => a.group.localeCompare(b.group) || a.title.localeCompare(b.title));
    return result;
  }

  function render() {
    const matches = getMatches();
    els.grid.innerHTML = matches.map((g,i) => cardHtml(g,i)).join("");
    els.loading.hidden = true;
    els.noResults.hidden = matches.length !== 0;
    els.results.textContent = searchTerm || activeFilter !== "all" ? `Showing ${matches.length} guide${matches.length===1?"":"s"}` : `Showing all ${guides.length} guides across every DSS group.`;
    els.searchCount.textContent = `${matches.length} guide${matches.length===1?"":"s"}`;
    updateCounts();
  }

  function cardHtml(g,index) {
    const keywords = normalize(g.keywords).split(/\s+/).filter(Boolean).slice(0,4);
    const icon = escapeHtml(g.icon || iconFallback[g.category]);
    return `<article class="guide-card" style="animation-delay:${Math.min(index,12)*25}ms">
      <div class="card-accent accent-${escapeHtml(g.category)}"></div>
      <div class="card-top">
        <div class="card-icon icon-${escapeHtml(g.category)}"><i class="${icon}"></i></div>
        <span class="card-group">${escapeHtml(g.group)}</span>
      </div>
      <h3>${escapeHtml(g.title)}</h3>
      <p class="card-description">${escapeHtml(g.description || g.small || "Open this guide for the applicable workflow.")}</p>
      <div class="card-keywords">${keywords.map(k=>`<span class="keyword">${escapeHtml(k)}</span>`).join("")}</div>
      <a class="guide-open" href="${escapeHtml(g.url)}">Open Guide <i class="fa-solid fa-arrow-right"></i></a>
    </article>`;
  }

  function updateCounts() {
    document.querySelectorAll("[data-count]").forEach(el => {
      el.textContent = guides.filter(g=>g.category===el.dataset.count).length;
    });
    const all = document.getElementById("allCount"); if(all) all.textContent = guides.length;
  }

  function resetAll() {
    searchTerm = ""; activeFilter = "all"; els.input.value = "";
    els.clearSearch.classList.remove("visible");
    document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("active",b.dataset.filter==="all"));
    render();
  }

  function bind() {
    els.input.addEventListener("input", () => {
      searchTerm = els.input.value.trim();
      els.clearSearch.classList.toggle("visible",!!searchTerm);
      render();
    });
    els.clearSearch.addEventListener("click", () => { els.input.value=""; searchTerm=""; els.clearSearch.classList.remove("visible"); render(); els.input.focus(); });
    document.querySelectorAll(".filter-chip").forEach(button => button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("active",b===button));
      render();
    }));
    els.reset.addEventListener("click", resetAll); els.emptyReset.addEventListener("click", resetAll);
    document.addEventListener("keydown", e => { if(e.key==="/" && !/^(INPUT|TEXTAREA|SELECT)$/i.test(document.activeElement?.tagName||"")) { e.preventDefault(); els.input.focus(); } if(e.key==="Escape" && document.activeElement===els.input) { els.input.value=""; searchTerm=""; els.clearSearch.classList.remove("visible"); render(); } });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    els.grid=document.getElementById("guideGrid"); els.input=document.getElementById("allGuideSearch"); els.clearSearch=document.getElementById("clearAllGuideSearch"); els.results=document.getElementById("resultsText"); els.searchCount=document.getElementById("searchCount"); els.noResults=document.getElementById("noResults"); els.loading=document.getElementById("loadingState"); els.reset=document.getElementById("clearFilters"); els.emptyReset=document.getElementById("emptyReset");
    bind(); updateCounts(); render();
    await loadLiveGuides(); render();
  });
})();
