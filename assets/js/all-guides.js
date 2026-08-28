/* ============================================================
   DSS V2 — ALL GUIDES
   Static library: no JSON fetch, no API, no database dependency.
   The guide registry lives in this file so GitHub Pages can serve
   the page as a completely static site.
   ============================================================ */
(function () {
  "use strict";

  const GUIDES = [
  {
    "title": "Debtor Update per BOL",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Billing Dispute Guides/BD GENERAL GUIDE.html",
    "keywords": "debtor update per bol billing dispute bol debtor billing general",
    "group": "Billing Dispute",
    "category": "billing",
    "icon": "fa-solid fa-file-invoice-dollar",
    "groupLabel": "Billing Dispute"
  },
  {
    "title": "Debtor Update per LOA",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Billing Dispute Guides/Rebill per LOA General Guide.html",
    "keywords": "debtor update per loa rebill loa 3pl fpay collector billing",
    "group": "Billing Dispute",
    "category": "billing",
    "icon": "fa-solid fa-rotate",
    "groupLabel": "Billing Dispute"
  },
  {
    "title": "Debtor Update per Reversal/Refusal",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Billing Dispute Guides/rvsl-guide.html",
    "keywords": "debtor update reversal refusal rvsl billing reversal refusal rebill denial",
    "group": "Billing Dispute",
    "category": "billing",
    "icon": "fa-solid fa-arrow-right-arrow-left",
    "groupLabel": "Billing Dispute"
  },
  {
    "title": "Weight Update per BOL",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Billing Dispute Guides/weight-update-per-bol-guide.html",
    "keywords": "weight update per bol weight reweigh dispute pallet billing",
    "group": "Billing Dispute",
    "category": "billing",
    "icon": "fa-solid fa-weight-hanging",
    "groupLabel": "Billing Dispute"
  },
  {
    "title": "Service Level/Type Update per BOL",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Billing Dispute Guides/service-level-type-guide.html",
    "keywords": "service level type update bol service validation rating billing",
    "group": "Billing Dispute",
    "category": "billing",
    "icon": "fa-solid fa-truck-fast",
    "groupLabel": "Billing Dispute"
  },
  {
    "title": "Reference Number Update - Add/Edit/Delete",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Billing Dispute Guides/reference-number-guide.html",
    "keywords": "reference number update add edit delete demand invoice billing reference",
    "group": "Billing Dispute",
    "category": "billing",
    "icon": "fa-solid fa-hashtag",
    "groupLabel": "Billing Dispute"
  },
  {
    "title": "Fuel Guide",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Pricing Guides/fuel-guide.html",
    "keywords": "fuel pricing guide dispute charge review",
    "group": "Pricing",
    "category": "pricing",
    "icon": "fa-solid fa-gas-pump quick-svg",
    "groupLabel": "Pricing"
  },
  {
    "title": "Surcharge Guide",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Pricing Guides/surcharge-guide.html",
    "keywords": "surcharge pricing guide review validation dispute",
    "group": "Pricing",
    "category": "pricing",
    "icon": "fa-solid fa-receipt quick-svg",
    "groupLabel": "Pricing"
  },
  {
    "title": "ePRT Guide",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Pricing Guides/eprt-guide.html",
    "keywords": "eprt guide exception escalation review pricing",
    "group": "Pricing",
    "category": "pricing",
    "icon": "fa-solid fa-file-lines quick-svg",
    "groupLabel": "Pricing"
  },
  {
    "title": "ePRT Submission",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Pricing Guides/eprt-submission.html",
    "keywords": "eprt submission routing escalation submit",
    "group": "Pricing",
    "category": "pricing",
    "icon": "fa-solid fa-paper-plane quick-svg",
    "groupLabel": "Pricing"
  },
  {
    "title": "Checking EPRS",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Pricing Guides/checking-eprs.html",
    "keywords": "checking eprs agreement pricing setup validation tool",
    "group": "Pricing",
    "category": "pricing",
    "icon": "fa-solid fa-magnifying-glass quick-svg",
    "groupLabel": "Pricing"
  },
  {
    "title": "Base Rater",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Pricing Guides/base-rater.html",
    "keywords": "base rater rate validation pricing tool",
    "group": "Pricing",
    "category": "pricing",
    "icon": "fa-solid fa-calculator quick-svg",
    "groupLabel": "Pricing"
  },
  {
    "title": "Discount - AMC Guide",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Pricing Guides/discount-amc-guide.html",
    "keywords": "discount amc pricing agreement exception rerate guide",
    "group": "Pricing",
    "category": "pricing",
    "icon": "fa-solid fa-tags quick-svg",
    "groupLabel": "Pricing"
  },
  {
    "title": "Courtesy Discount",
    "description": "Open this guide for the workflow and handling steps that match your case.",
    "small": "",
    "url": "guides/Pricing Guides/courtesy-discount.html",
    "keywords": "courtesy discount surcharge guide adjustment pricing",
    "group": "Pricing",
    "category": "pricing",
    "icon": "fa-solid fa-hand-holding-dollar quick-svg",
    "groupLabel": "Pricing"
  },
  {
    "title": "High Cost Fee",
    "description": "Open the guide for high cost fee review, related surcharge questions, and supporting validation steps.",
    "small": "Use this when the concern involves high cost fee review or validation.",
    "url": "guides/Other Surcharge Guides/high-cost-fee.html",
    "keywords": "high cost fee surcharge pricing guide charge",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-money-bill-wave",
    "groupLabel": "Other Surcharges"
  },
  {
    "title": "Peak Surcharge Fee",
    "description": "Review peak surcharge concerns and open the correct guide for temporary or period-based surcharge questions.",
    "small": "Helpful for peak period charge review and surcharge validation.",
    "url": "guides/Other Surcharge Guides/peak-surcharge-fee.html",
    "keywords": "peak surcharge fee seasonal charge pricing guide",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-chart-line",
    "groupLabel": "Other Surcharges"
  },
  {
    "title": "California Compliance",
    "description": "Open the California compliance guide for surcharge concerns tied to compliance requirements or charge validation.",
    "small": "Helpful for compliance-related surcharge review and guidance.",
    "url": "guides/Other Surcharge Guides/california-compliance.html",
    "keywords": "california compliance surcharge legal regulation guide",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-scale-balanced",
    "groupLabel": "Other Surcharges"
  },
  {
    "title": "Zip Service Charge",
    "description": "Use this guide when the concern is tied to zip service charge validation, location-based review, or surcharge logic.",
    "small": "Best for zip-based service charge review and related guidance.",
    "url": "guides/Other Surcharge Guides/zip-service-charge.html",
    "keywords": "zip service charge surcharge zone location guide",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-location-dot",
    "groupLabel": "Other Surcharges"
  },
  {
    "title": "Cross-Border Processing Fee",
    "description": "Open this guide for cross-border processing fee concerns, international surcharge review, and next-step validation.",
    "small": "Use this for international or cross-border surcharge fee review.",
    "url": "guides/Other Surcharge Guides/cross-border-processing-fee.html",
    "keywords": "cross border processing fee international surcharge guide",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-globe",
    "groupLabel": "Other Surcharges"
  },
  {
    "title": "Canadian Custom Inspection Fee",
    "description": "Review Canadian custom inspection fee concerns with the correct guide for inspection-related surcharge validation.",
    "small": "Use this for Canada inspection-related surcharge questions and validation.",
    "url": "guides/Other Surcharge Guides/canadian-custom-inspection-fee.html",
    "keywords": "canadian custom inspection fee canada surcharge guide inspection",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-box-open",
    "groupLabel": "Other Surcharges"
  },
  {
    "title": "Canadian Surcharge Guide",
    "description": "Open the Canadian surcharge guide for Canada-related surcharge review, validation, and the correct next pricing action.",
    "small": "Use this for Canadian surcharge concerns, charge review, and related guidance.",
    "url": "guides/Other Surcharge Guides/canadian-surcharge-guide.html",
    "keywords": "canadian surcharge guide canada surcharge pricing customs border",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-flag",
    "groupLabel": "Other Surcharges"
  },
  {
    "title": "Weighing Service Fee",
    "description": "Use this guide to validate weighing service fee disputes and determine if the charge should be applied or removed.",
    "small": "Best for verifying if weighing service was requested and validating the fee.",
    "url": "guides/Other Surcharge Guides/weighing-service-guide.html",
    "keywords": "weighing service fee weight charge validation bol service guide",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-weight-scale",
    "groupLabel": "Other Surcharges"
  },
  {
    "title": "NOST Guide",
    "description": "Structured guide for NOST disputes including pickup request validation, dashboard review, shipment history checks, courtesy handling, and void or account correction actions.",
    "small": "Use this for NOST dispute handling, courtesy review, account correction, and RQD1 void processing.",
    "url": "guides/Other Surcharge Guides/nost-guide.html",
    "keywords": "nost non optional service transfer no service time pickup request dashboard dispute surcharge charge validation rqd1 void account correction",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-bell",
    "groupLabel": "Other Surcharges"
  },
  {
    "title": "Sort & Segregate Guide",
    "description": "Decision tree for validating Sort & Segregate disputes and determining the correct surcharge handling.",
    "small": "Use this for sort and segregate fee review, validation, and correct keep-or-remove handling.",
    "url": "guides/Other Surcharge Guides/sort-and-segregate-guide.html",
    "keywords": "sort segregate sort and segregate fee surcharge charge validation handling dispute pricing",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-shuffle",
    "groupLabel": "Other Surcharges"
  },
  {
    "title": "Notify Fee Guide",
    "description": "Decision tree for handling Notify Fee disputes and validating whether the notification charge should stay or be removed.",
    "small": "Use this for notify charge validation, dispute handling, and final surcharge action.",
    "url": "guides/Other Surcharge Guides/notify-fee-guide.html",
    "keywords": "notify fee surcharge notification phone call consignee shipper charge validation dispute",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-phone-volume",
    "groupLabel": "Other Surcharges"
  },
  {
    "title": "Lumper Fee Guide",
    "description": "Handle Lumper fee disputes (LMPB, LMPP, LMPC) by explaining the service per FXF Rules Tariff Item 579 and providing appropriate responses based on whether the customer is disputing the fee or requesting backup documentation.",
    "small": "Best for Lumper fee disputes, Sort & Segregate fee validation, backup documentation requests, and customer communication using FXF Rules Tariff Item 579.",
    "url": "guides/Other Surcharge Guides/lumper-fee-guide.html",
    "keywords": "lumper fee sort segregate lmpp lmpb lmpc override dispute backup documents tariff 579 lumper service",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-hand-holding-heart",
    "groupLabel": "Other Surcharges"
  },
  {
    "title": "Storage Fee Guide",
    "description": "Validate storage fee disputes by reviewing supporting documents (Legal Notice of Refusal or On-Hand Freight), verifying fee calculations per FXF Rules Tariff, and handling FedEx fault claims through destination center confirmation.",
    "small": "Best for storage fee disputes, calculation validation, On-Hand Notice review, FedEx fault claims, and removal handling.",
    "url": "guides/Other Surcharge Guides/storage-fee-guide.html",
    "keywords": "storage fee dispute calculation fedex fault on hand notice legal refusal supporting documents tariff 910",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-warehouse",
    "groupLabel": "Other Surcharges"
  },
  {
    "title": "Redelivery Handling Guide",
    "description": "Validate redelivery fee disputes by reviewing second delivery attempts, appointment requirements, receiving conditions, customer refusal reasons, and carrier failures to determine if the fee should be kept or removed.",
    "small": "Best for redelivery fee disputes, second attempt validation, appointment checks, receiving condition review, customer refusal handling, carrier failure scenarios, and keep-or-remove decision making.",
    "url": "guides/Other Surcharge Guides/redelivery-fee-guide.html",
    "keywords": "redelivery fee second attempt appointment dockspace liftgate straight truck bobtail rear load receiving closed refused carrier failure salvage reconsignment billing error state of emergency weather",
    "group": "Other Surcharges",
    "category": "surcharge",
    "icon": "fa-solid fa-truck-arrow-right",
    "groupLabel": "Other Surcharges"
  },
  {
    "title": "Handling Inactive Account",
    "description": "Open this guide when the concern involves inactive, archived, deleted, or do-not-use account handling and the correct next action.",
    "small": "Use this when validating account status and next handling steps.",
    "url": "guides/Account Handling Guides/handling-notactive-guide.html",
    "keywords": "",
    "group": "Account Handling",
    "category": "account",
    "icon": "fa-solid fa-user-xmark",
    "groupLabel": "Account Handling"
  },
  {
    "title": "Creating Customer's Account",
    "description": "Use this guide when the request involves creating a new customer account and following the correct setup process.",
    "small": "Best for new customer account setup and related handling steps.",
    "url": "guides/Account Handling Guides/creating-customer-account.html",
    "keywords": "",
    "group": "Account Handling",
    "category": "account",
    "icon": "fa-solid fa-user-plus",
    "groupLabel": "Account Handling"
  },
  {
    "title": "Steps on How to Create an Account",
    "description": "Open this guide for a step-by-step account creation process when you need a more structured setup walkthrough.",
    "small": "Helpful for guided account setup and complete creation flow review.",
    "url": "guides/Account Handling Guides/account-creation-steps.html",
    "keywords": "",
    "group": "Account Handling",
    "category": "account",
    "icon": "fa-solid fa-list-check",
    "groupLabel": "Account Handling"
  },
  {
    "title": "Searching for Account Guide",
    "description": "Use this guide when the concern involves locating, validating, or reviewing the correct customer account before proceeding.",
    "small": "Use this when you need to search and confirm the correct account first.",
    "url": "guides/Account Handling Guides/searching-account-guide.html",
    "keywords": "",
    "group": "Account Handling",
    "category": "account",
    "icon": "fa-solid fa-magnifying-glass",
    "groupLabel": "Account Handling"
  },
  {
    "title": "Updating SCAC/BU Guide",
    "description": "Open this guide when the request involves SCAC/BU updates, validation, or the correct next correction step.",
    "small": "Best for SCAC/BU correction, validation, and update handling.",
    "url": "guides/Account Handling Guides/updating-bt-scacbu-guide.html",
    "keywords": "",
    "group": "Account Handling",
    "category": "account",
    "icon": "fa-solid fa-code-branch",
    "groupLabel": "Account Handling"
  },
  {
    "title": "Regions and EHOT Queue Guide",
    "description": "Use this guide to review, validate, and process region and EHOT queue requests including account, accessorial, service type, and related updates.",
    "small": "Best for EHOT queue requests, account setup validation, shipment volume checks, and related service updates.",
    "url": "guides/PAUD Queue Guides/region-and-ehot-queue.html",
    "keywords": "regions ehot queue region routing account validation location paud queue",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-earth-americas",
    "groupLabel": "PAUD Queue"
  },
  {
    "title": "TPLO Guide",
    "description": "Use this guide for TPLO requests including SPOC validation, account mapping, special account routing, and proper billing handling.",
    "small": "Best for account relationship checks, SPOC routing, and CORR ACCR billing actions.",
    "url": "guides/PAUD Queue Guides/tplo-guide.html",
    "keywords": "tplo bill to shipper consignee spoc validation account mapping routing paud queue",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-sitemap",
    "groupLabel": "PAUD Queue"
  },
  {
    "title": "TPHI Guide",
    "description": "Follow the TEMP-SYS matching process to correctly map charge accounts and ensure proper debtor selection.",
    "small": "Covers account validation, archived/invalid debtor handling, and proper mapping steps.",
    "url": "guides/PAUD Queue Guides/tphi-guide.html",
    "keywords": "tphi temp sys match charge account to account temp audit auto matching process paud queue",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-diagram-project",
    "groupLabel": "PAUD Queue"
  },
  {
    "title": "PAUD / TPKN Guide",
    "description": "Follow the step-by-step process for replacing Shipper Code requests including account validation, auto-rating, and correction handling.",
    "small": "Covers queue movement, NOAR scenarios, pricing checks, and correction steps.",
    "url": "guides/PAUD Queue Guides/paud-tpkn-guide.html",
    "keywords": "paud tpkn correction request account check auto rate noar shipper consignee paud queue",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-boxes-stacked",
    "groupLabel": "PAUD Queue"
  },
  {
    "title": "CRAU — Request Decision Guide",
    "description": "Use this guide for CRAU requests, validation checks, request review, and the correct next action based on the case details.",
    "small": "Best for CRAU request handling, validation, queue review, and processing decisions.",
    "url": "guides/PAUD Queue Guides/crau-guide.html",
    "keywords": "crau cra u request decision guide collection validation shipment review request paud queue",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-network-wired",
    "groupLabel": "PAUD Queue"
  },
  {
    "title": "PAUD-FPAY Guide",
    "description": "Open the PAUD-FPAY guide for payment-related handling, validation checks, account review, and proper workflow decisions.",
    "small": "Best for payment queue review, account validation, and structured PAUD-FPAY decision handling.",
    "url": "guides/PAUD Queue Guides/PAUD FPAY Guide.html",
    "keywords": "paud fpay payment billing account validation financial payment paud queue",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-credit-card",
    "groupLabel": "PAUD Queue"
  },
  {
    "title": "COD (Collect on Delivery) Guide",
    "description": "Follow this guide to add or remove COD based on original BOL validation, required COD details, LOA/CBL support, keyword handling, and final autorating steps.",
    "small": "Best for COD validation, adding COD charges, removing COD via LOA, keyword cleanup, and billing correction handling.",
    "url": "guides/PAUD Queue Guides/cod-guide.html",
    "keywords": "cod collect on delivery add remove cod loa cbl remit amount correction paud queue",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-money-bill-transfer",
    "groupLabel": "PAUD Queue"
  },
  {
    "title": "Invalid Consignee/Shipper Account (ISPD)",
    "description": "Follow this guide to review ISPD queue requests, validate shipper or consignee account discrepancies, and apply the correct ACCR correction path.",
    "small": "Best for invalid shipper or consignee account review, BOL validation, AEM account checks, and ACCR correction handling.",
    "url": "guides/PAUD Queue Guides/ispd-guide.html",
    "keywords": "ispd invalid consignee shipper account accops freight corrections bol edm aem accf accr paud queue",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-user-xmark",
    "groupLabel": "PAUD Queue"
  },
  {
    "title": "LMPB (Lumper Fee) Guide",
    "description": "Use this guide to add Lumper fees (LMPB for 3rd party, LMPP for prepaid) for Sort & Segregation, handle declines when SSEG already exists, and apply CORR ACC correction.",
    "small": "Best for Lumper fee requests, Sort & Segregate validation, prepaid/3rd party handling, and CORR ACC correction.",
    "url": "guides/PAUD Queue Guides/lmpb-guide.html",
    "keywords": "lmpb lumper fee sort segregate prepaid third party correction paud queue",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-hand-holding-heart",
    "groupLabel": "PAUD Queue"
  },
  {
    "title": "IRT1 – PO Number & Division Validation",
    "description": "Follow a structured decision flow to validate PO number and division information on the BOL. Select from Prepaid, Collect, 3rd Party, or all-correct scenarios to update billing terms, correct account numbers, add missing PO numbers, or apply the Decline process when terms are correct but the PO was not billed.",
    "small": "Best for IRT1 queue handling, division validation, billing term updates, account corrections (White Cap → HD Supply), and correction code selection (FEDI, CEDI, VRFY).",
    "url": "guides/PAUD Queue Guides/irt1-guide.html",
    "keywords": "irt1 po number division validation prepaid collect third party fedi cedi correction code paud queue",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-hashtag",
    "groupLabel": "PAUD Queue"
  },
  {
    "title": "IRT/VSAT – Queue Guide",
    "description": "Follow structured steps for Grainger (NOAR deletion and CAPL remark), Rio Bravo (consignee correction), and Hino (account mapping and term updates) to ensure accurate billing and proper correction code application.",
    "small": "Best for IRT/VSAT queue handling, Grainger NOAR/CAPL corrections, Rio Bravo consignee updates, Hino account mapping, and correction code selection (VRFY, CAE, ACCR).",
    "url": "guides/PAUD Queue Guides/irt-vsat-guide.html",
    "keywords": "irt vsat grainger rio bravo hino noar capl correction corr vrfy corr cae corr accr consignee account update",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-file-pen",
    "groupLabel": "PAUD Queue"
  },
  {
    "title": "SAF2 Guide – NMFC, Reweigh & Weight Validation",
    "description": "Follow a structured decision flow to validate NMFC classifications, pallet and tare weights, reweigh certificates, and billing corrections for Airgas and Harte Hanks shipments.",
    "small": "Best for Airgas and Harte Hanks audit review, NMFC validation, pallet and tare weight verification, reweigh certificate processing, 50-line error handling, and correction code selection (VRFY, EWPD, CUSI).",
    "url": "guides/PAUD Queue Guides/saf2-guide.html",
    "keywords": "saf2 airgas harte hanks nmfc reweigh certificate pallet weight tare weight rewe correction code corr ewpd corr cusi corr vrfy paud queue",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-scale-balanced",
    "groupLabel": "PAUD Queue"
  },
  {
    "title": "BLOA Guide – Accessorial & Terms Validation",
    "description": "Follow request to change any surcharges billed collect to prepaid (vice versa). Accessorial should always match the terms per the letter of authority covering the bill to. Surcharges refer to all collect surcharges (LIFC, IDC, DUNC).",
    "small": "Best for BLOA queue handling, accessorial term matching, Driver Spotted exceptions, missing DR handling, and CORR ETMS corrections.",
    "url": "guides/PAUD Queue Guides/bloa-guide.html",
    "keywords": "bloa letter of authority accessorial surcharges lifc idc dunc prepaid collect driver spotted delivery receipt blanket loa corr etms paud queue",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-file-signature",
    "groupLabel": "PAUD Queue"
  },
  {
    "title": "PAT8 – Multi-Company Queue Guide",
    "description": "PAUD PAT8 contains bills for different companies. Follow structured steps for EMERSON (SID# validation), PILGRIMS (terms update), Harte Hanks (NMFC correction), Top Value Fabrics (STPS/STPL keywords), and accessorial removal requests.",
    "small": "Best for EMERSON SID# corrections, PILGRIMS terms updates, Harte Hanks NMFC corrections, Top Value Fabrics keyword handling, and accessorial removal validation.",
    "url": "guides/PAUD Queue Guides/pat8-guide.html",
    "keywords": "pat8 emerson sid pilgrims harte hanks top value fabrics stps stpl accessorial removal correction queue paud",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-building",
    "groupLabel": "PAUD Queue"
  },
  {
    "title": "PARS – Parker Hannifin Queue Guide",
    "description": "Validate Parker Hannifin as the debtor per the Bill of Lading, update the consignee to account 105188579, compare Prepaid vs Collect rates to apply the lesser charge (only when Parker is both shipper and consignee), and apply CORR VRFY, CORR CUSI, or decline handling based on BOL verification and address matching.",
    "small": "Best for Parker Hannifin queue handling, consignee updates, prepaid/collect rate comparisons, and correction code selection (VRFY, CUSI, ETMS).",
    "url": "guides/PAUD Queue Guides/pars-guide.html",
    "keywords": "pars parker hannifin debtor consignee account update terms prepaid collect correction queue validation",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-user-check",
    "groupLabel": "PAUD Queue"
  },
  {
    "title": "CORT – Reconsignment Guide",
    "description": "Use this guide for CORT requests from reconsignment. Verify weight and piece count match the original pro, validate the correct customer center, handle NEWP keyword for new pro numbers, and apply AUTO RATE.",
    "small": "Best for CORT reconsignment handling, NEWP keyword validation, weight and piece count matching, and partial reconsignment investigation.",
    "url": "guides/PAUD Queue Guides/cort-guide.html",
    "keywords": "cort reconsignment newp oldp weight piece count customer center auto rate fbi freight bill inquiry",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-arrows-rotate",
    "groupLabel": "PAUD Queue"
  },
  {
    "title": "HOT – EHOT Queue Requests Guide",
    "description": "Use this guide for HOT/HO2 requests moved from EHOT queues. Handle storage disputes, shipment detail updates (HAZMAT, cylinder count, skid count, weight), origin/destination changes, international routing, redelivery removal, GAMD requests, INBO/INBC border shipments, and queue routing for RECON and STOR.",
    "small": "Best for HOT queue handling, storage disputes, shipment detail corrections, destination updates, international routing, fee removal, GAMD escalation, INBO/INBC border shipments, and RECON/STOR queue routing.",
    "url": "guides/PAUD Queue Guides/hot-guide.html",
    "keywords": "hot ho2 ehot storage dispute shipment details origin destination international redelivery gamd inbo inbc shipping date on hand",
    "group": "PAUD Queue",
    "category": "paud",
    "icon": "fa-solid fa-fire",
    "groupLabel": "PAUD Queue"
  },
  {
    "title": "OVC — General Guideline",
    "description": "Official OVC guideline for handling customer claims and disputes.",
    "small": "Use this for OVC claim handling and requirement checks.",
    "url": "guides/Other Guides/OVC GENERAL GUIDE.html",
    "keywords": "ovc claim dispute handling",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-shield",
    "groupLabel": "Other"
  },
  {
    "title": "Reweigh — General Guide",
    "description": "Decision guide for reweigh disputes and corrections.",
    "small": "Use this for weight disputes and reweigh validation.",
    "url": "guides/Other Guides/Reweigh General Guide.html",
    "keywords": "reweigh weight dispute correction",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-arrows-up-down-left-right",
    "groupLabel": "Other"
  },
  {
    "title": "Correction Code Guide",
    "description": "Decision tree to determine the correct CORR CODE.",
    "small": "Use this for selecting the correct correction code.",
    "url": "guides/Other Guides/Correction Code Guide.html",
    "keywords": "correction code decision tree",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-wand-magic-sparkles",
    "groupLabel": "Other"
  },
  {
    "title": "FedEx Direct Guide",
    "description": "Decision tree for FedEx Direct disputes and validation.",
    "small": "Use this for FedEx Direct dispute handling.",
    "url": "guides/Other Guides/FedEx Direct Guide.html",
    "keywords": "fedex direct dispute validation",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-road",
    "groupLabel": "Other"
  },
  {
    "title": "Class Update Guide",
    "description": "Decision tree for handling Class Update requests.",
    "small": "Use this for class correction requests.",
    "url": "guides/Other Guides/class-update-guide.html",
    "keywords": "class update correction request",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-layer-group",
    "groupLabel": "Other"
  },
  {
    "title": "Rate & Volume Quote Guide",
    "description": "Decision tree for validating LTL and Volume Quotes.",
    "small": "Use this for quote validation and rate disputes.",
    "url": "guides/Other Guides/rate-volume-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-sack-dollar",
    "groupLabel": "Other"
  },
  {
    "title": "Shave a Day Guide/Early Delivery Fee",
    "description": "Use this guide to verify SHAD fee concerns, confirm LOA and service level details, check delivery status, and decide whether to validate the fee, remove it, or update the shipment service type.",
    "small": "Best for SHAD fee disputes, Economy to Priority service upgrades, Early Delivery validation, and service level correction handling.",
    "url": "guides/Other Guides/shave-a-day-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-calendar-day",
    "groupLabel": "Other"
  },
  {
    "title": "Verifying Tracking Number Guide",
    "description": "Guide for validating freight information.",
    "small": "Use this for delivery and tracking validation.",
    "url": "guides/Other Guides/information-validation-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-magnifying-glass-location",
    "groupLabel": "Other"
  },
  {
    "title": "Missing Documents Guide",
    "description": "Guide for requesting missing documents.",
    "small": "Use this for missing BOL and document requests.",
    "url": "guides/Other Guides/missing-docs-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-file-lines",
    "groupLabel": "Other"
  },
  {
    "title": "Keep or Remove Payment Guide",
    "description": "Determine whether to keep or remove payments based on LOA, billing corrections, and pricing scenarios.",
    "small": "Covers LOA correction requests, billing errors, and pricing/reweigh handling with clear decision steps.",
    "url": "guides/Other Guides/keep_or_remove_payment_guide_fixed.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-scale-balanced",
    "groupLabel": "Other"
  },
  {
    "title": "Demand Invoice Guide",
    "description": "Follow a structured decision flow for demand invoice cases including PRO posted checks, queue handling, resend scenarios, and invoice types.",
    "small": "Covers resend invoice, duplicate invoice handling, PRO posted logic, and queue escalation steps.",
    "url": "guides/Other Guides/demand-invoice-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-file-invoice",
    "groupLabel": "Other"
  },
  {
    "title": "Recycled Pro Guide",
    "description": "Use this guide to identify recycled PRO issues, validate version history, and apply the correct resolution steps.",
    "small": "Best for handling recycled PRO cases and validating old shipment versions.",
    "url": "guides/Other Guides/recycled-pro-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-recycle",
    "groupLabel": "Other"
  },
  {
    "title": "Employee Discount Guide",
    "description": "Use this guide to validate employee discount eligibility and determine if the discount should be applied or confirmed.",
    "small": "Best for handling employee discount requests and verifying invoice application.",
    "url": "guides/Other Guides/employee-discount-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-percent",
    "groupLabel": "Other"
  },
  {
    "title": "Void and Write Off Guide",
    "description": "Follow a structured decision flow for service errors, Grainger rebill scenarios, surcharge handling, PRO voiding, and write-off processing.",
    "small": "Best for handling void requests, surcharge removal, Grainger rebill cases, and full write-off processes.",
    "url": "guides/Other Guides/void-and-wo-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-file-circle-xmark",
    "groupLabel": "Other"
  },
  {
    "title": "Pro Number Suffix Guide",
    "description": "Use this guide to identify the correct handling based on PRO number suffix including F0, D0, C0, Y0, and non-revenue scenarios.",
    "small": "Best for handling dead freight, VOID queue cases, company business shipments, salvage, and master PRO validation.",
    "url": "guides/Other Guides/pro-no-suffix.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-list-ol",
    "groupLabel": "Other"
  },
  {
    "title": "Volume Application Guide",
    "description": "Use this guide to review, validate, and process volume application requests with the correct checks and handling steps.",
    "small": "Best for handling volume application requests, validation steps, and proper processing workflow.",
    "url": "guides/Other Guides/volume-application.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-box-open",
    "groupLabel": "Other"
  },
  {
    "title": "PAT7 Guide",
    "description": "Use this guide to review special invoice handling for EOIR, Lockheed Martin, Sikorsky Aircraft, United Launch Alliance, NOAR Alaska/Hawaii bills, and Amcoat Ind.",
    "small": "Best for PAT7 queue review, BOL imaging checks, special invoice billing, reference edit handling, PO validation, and correct invoice posting actions.",
    "url": "guides/Other Guides/pat7-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-clipboard-check",
    "groupLabel": "Other"
  },
  {
    "title": "Expedited Shipment / Priority Plus Guide",
    "description": "Use this guide to review FXF Priority Plus or Expedited Shipment disputes, validate whether the concern is rate or service related, and confirm BOL or LOA support.",
    "small": "Best for Priority Plus fee validation, FXFP service upgrades, BOL request checks, LOA support review, and Service Center follow-up handling.",
    "url": "guides/Other Guides/priority-plus-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-gauge-high",
    "groupLabel": "Other"
  },
  {
    "title": "Rerate Treatment Process Guide",
    "description": "Use this guide to determine the correct rerate handling based on PRO age, pricing status, debtor or account updates, billing corrections, LOA rebills, and surcharge rebill requests.",
    "small": "Best for rerate treatment decisions, over-one-year shipment review, write-off routing, pricing fall-off checks, billing error corrections, and small pricing queue handling.",
    "url": "guides/Other Guides/rerate-treatment-process-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-file-invoice-dollar",
    "groupLabel": "Other"
  },
  {
    "title": "Inbond Fee Guide",
    "description": "Use this guide to validate Inbond fee disputes by reviewing BOL documentation, Cargo Care indicators, and Pro comments to determine if removal or validation is the appropriate action.",
    "small": "Best for Inbond fee disputes, BOL document checks, Cargo Care review, and keep-or-remove decision handling.",
    "url": "guides/Other Guides/inbond-fee-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-hand-holding-dollar",
    "groupLabel": "Other"
  },
  {
    "title": "Handling Fee Guide",
    "description": "Use this guide to validate Handling fee disputes by reviewing liftgate usage, loading/unloading requirements, assembly requests, and supporting documentation to determine if removal or validation is the appropriate action.",
    "small": "Best for Handling fee disputes, liftgate usage verification, loading/unloading validation, assembly request review, and keep-or-remove decision handling.",
    "url": "guides/Other Guides/handling-fee-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-hand",
    "groupLabel": "Other"
  },
  {
    "title": "ISPI — Mass Adjustment Guide",
    "description": "Follow a structured step‑by‑step process for mass adjustments in iSPI, including PRO entry, invalid number removal, account changes, approval limit checks, and final processing.",
    "small": "Best for mass account updates, bill‑to corrections, shipper/consignee changes, and rebilling up to 500 PROs at once.",
    "url": "guides/Other Guides/ispi-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-arrows-rotate",
    "groupLabel": "Other"
  },
  {
    "title": "All Shorts Guide",
    "description": "Use this guide to handle All Short and Partial Short disputes. Review shipment history, claim status, LOA documentation, and piece/pallet counts to determine the correct resolution path for each case.",
    "small": "Best for All Short and Partial Short disputes, claim status verification, LOA handling, Sales Representative escalation, and weight/piece count corrections.",
    "url": "guides/Other Guides/all-shorts-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-boxes",
    "groupLabel": "Other"
  },
  {
    "title": "Sales Write-Off Guide",
    "description": "Review Sales Write-Off requests by reading case details, validating PRO information, checking debtor eligibility, and following approval thresholds ($500 and $2,000) for write-off processing.",
    "small": "Best for sales write-off requests, multiple dispute handling, debtor eligibility checks, and approval processing with TL and KURT.",
    "url": "guides/Other Guides/sales-write-off-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-pen-to-square",
    "groupLabel": "Other"
  },
  {
    "title": "Write-off in CAPS- Step by Step Procedure",
    "description": "Step-by-step guide to process write-offs in CAPS, from selecting the correct Business Unit, entering PROs and reason codes, adding FBC comments, responding to sales reps, and closing the case.",
    "small": "Best for handling write-off requests, CAPS workflow, PRO entry, reason codes, FBC comments, sales rep responses, and case closure.",
    "url": "guides/Other Guides/wo-process-caps-guide.html",
    "keywords": "",
    "group": "Other",
    "category": "other",
    "icon": "fa-solid fa-file-circle-xmark",
    "groupLabel": "Other"
  }
];

  const GROUP_META = {
    billing: { label: "Billing Dispute", icon: "fa-solid fa-file-invoice", accent: "purple" },
    pricing: { label: "Pricing", icon: "fa-solid fa-receipt", accent: "orange" },
    surcharge: { label: "Surcharges", icon: "fa-solid fa-money-bill-wave", accent: "blue" },
    account: { label: "Account Handling", icon: "fa-solid fa-user-gear", accent: "green" },
    paud: { label: "PAUD Queue", icon: "fa-solid fa-layer-group", accent: "indigo" },
    other: { label: "Other", icon: "fa-solid fa-toolbox", accent: "pink" }
  };

  const HISTORY_KEY = "guideHistory";
  const USAGE_KEY = "guideUsageCounts";
  let activeFilter = "all";
  let searchTerm = "";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const normalize = value => String(value || "").toLowerCase().trim();

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
    catch { return []; }
  }

  function saveHistory(items) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(items)); } catch {}
  }

  function recordGuideOpen(guide) {
    const history = getHistory();
    history.push({ title: guide.title, url: guide.url, timestamp: Date.now() });
    if (history.length > 100) history.splice(0, history.length - 100);
    saveHistory(history);

    try {
      const usage = JSON.parse(localStorage.getItem(USAGE_KEY)) || {};
      usage[guide.url] = usage[guide.url] || { title: guide.title, count: 0 };
      usage[guide.url].title = guide.title;
      usage[guide.url].count += 1;
      localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
    } catch {}
  }

  function guideMatches(guide) {
    const groupMatch = activeFilter === "all" || guide.category === activeFilter;
    if (!groupMatch) return false;
    if (!searchTerm) return true;
    const haystack = normalize([
      guide.title, guide.description, guide.small, guide.keywords, guide.group
    ].join(" "));
    return haystack.includes(normalize(searchTerm));
  }

  function createCard(guide) {
    const meta = GROUP_META[guide.category] || GROUP_META.other;
    const description = guide.description || "Open this guide for the workflow and handling steps that match your case.";
    return `
      <article class="guide-card group-${guide.category}" tabindex="0" role="link"
        data-url="${escapeHtml(guide.url)}" data-title="${escapeHtml(guide.title)}">
        <div class="card-top">
          <div class="guide-icon"><i class="${escapeHtml(guide.icon || meta.icon)}"></i></div>
          <span class="group-badge">${escapeHtml(meta.label)}</span>
        </div>
        <h3>${escapeHtml(guide.title)}</h3>
        <p>${escapeHtml(description)}</p>
        <div class="card-bottom">
          <span class="open-guide">Open guide <i class="fa-solid fa-arrow-right"></i></span>
        </div>
      </article>`;
  }

  function render() {
    const grid = $("#guideGrid");
    if (!grid) return;

    const visible = GUIDES.filter(guideMatches);
    grid.innerHTML = visible.map(createCard).join("");

    const noResults = $("#noResults");
    if (noResults) noResults.hidden = visible.length !== 0;

    const total = GUIDES.length;
    const searchCount = $("#searchCount");
    if (searchCount) searchCount.textContent = `${visible.length} ${visible.length === 1 ? "guide" : "guides"} ${searchTerm || activeFilter !== "all" ? "shown" : "available"}`;

    const results = $("#resultsText");
    if (results) {
      results.textContent = searchTerm || activeFilter !== "all"
        ? `Showing ${visible.length} of ${total} guides.`
        : `Browse all ${total} guides across the DSS.`;
    }

    const status = $("#libraryStatus");
    if (status) {
      const label = activeFilter === "all" ? "All guide groups" : (GROUP_META[activeFilter]?.label || "Selected group");
      status.innerHTML = `<i class="fa-solid fa-circle-info"></i><span>${searchTerm ? `Searching for <strong>${escapeHtml(searchTerm)}</strong> · ` : ""}${label} · ${visible.length} ${visible.length === 1 ? "guide" : "guides"}</span>`;
    }

    const heroTotal = $("#heroTotal");
    if (heroTotal) heroTotal.textContent = total;

    const clear = $("#clearAllGuideSearch");
    if (clear) clear.classList.toggle("visible", Boolean(searchTerm));

    $$("[data-count]").forEach(el => {
      const count = GUIDES.filter(g => g.category === el.dataset.count).length;
      el.textContent = count;
    });
    const allCount = $("[data-count-all]");
    if (allCount) allCount.textContent = total;

    $$(".guide-card").forEach(card => {
      card.addEventListener("click", () => openGuide(card));
      card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openGuide(card);
        }
      });
    });
  }

  function openGuide(card) {
    const url = card?.dataset?.url;
    if (!url) return;
    const guide = GUIDES.find(item => item.url === url);
    if (guide) recordGuideOpen(guide);
    window.location.href = url;
  }

  function applySearch(value) {
    searchTerm = String(value || "").trim();
    render();
  }

  function setFilter(filter) {
    activeFilter = filter || "all";
    $$(".filter-chip").forEach(button => button.classList.toggle("active", button.dataset.filter === activeFilter));
    render();
  }

  function resetAll() {
    activeFilter = "all";
    searchTerm = "";
    const input = $("#allGuideSearch");
    if (input) input.value = "";
    $$(".filter-chip").forEach(button => button.classList.toggle("active", button.dataset.filter === "all"));
    render();
    if (input) input.focus();
  }

  function init() {
    const input = $("#allGuideSearch");
    const clear = $("#clearAllGuideSearch");
    const searchButton = $("#searchButton");

    if (input) input.addEventListener("input", event => applySearch(event.target.value));
    if (clear) clear.addEventListener("click", () => { input.value = ""; applySearch(""); input.focus(); });
    if (searchButton) searchButton.addEventListener("click", () => { applySearch(input?.value || ""); input?.focus(); });

    $$(".filter-chip").forEach(button => button.addEventListener("click", () => setFilter(button.dataset.filter)));
    $("#clearFilters")?.addEventListener("click", resetAll);
    $("#emptyReset")?.addEventListener("click", resetAll);

    document.addEventListener("keydown", event => {
      if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
        event.preventDefault();
        input?.focus();
      }
      if (event.key === "Escape" && document.activeElement === input && input.value) {
        input.value = "";
        applySearch("");
      }
    });

    render();
  }

  window.performAllGuidesSearch = applySearch;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
