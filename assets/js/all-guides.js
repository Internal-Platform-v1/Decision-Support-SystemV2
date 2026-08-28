/* ============================================================
   DSS V2 — ALL GUIDES SCRIPT
   Static-site implementation.

   IMPORTANT:
   - No guide-data.json.
   - No database is required for the guide library.
   - Uses the existing window.GUIDE_REGISTRY when available.
   - Adds the V2 six workspace groups + All = 7 filters.
   - Preserves guide usage/history keys already used by DSS.
   ============================================================ */

(function(){
  "use strict";

  const GROUPS = {
    all: {
      label: "All Guides",
      icon: "fa-layer-group"
    },
    billing: {
      label: "Billing Dispute",
      icon: "fa-file-invoice-dollar"
    },
    pricing: {
      label: "Pricing General",
      icon: "fa-tags"
    },
    surcharge: {
      label: "Surcharges",
      icon: "fa-receipt"
    },
    account: {
      label: "Account Handling",
      icon: "fa-user-gear"
    },
    paud: {
      label: "PAUD Queue",
      icon: "fa-diagram-project"
    },
    other: {
      label: "Other Operational",
      icon: "fa-toolbox"
    }
  };

  const GROUP_ROUTES = {
    billing: "guides/Billing%20Dispute%20Guides/",
    pricing: "guides/Pricing%20Guides/",
    surcharge: "guides/Other%20Surcharge%20Guides/",
    account: "guides/Account%20Handling%20Guides/",
    paud: "guides/PAUD%20Guides/",
    other: "guides/Other%20Guides/"
  };

  /*
   * Existing registry routes that already point to root-level files
   * must stay root-level. Older registry entries that were authored
   * relative to a group page are resolved here.
   */
  const ROUTE_OVERRIDES = {
    "BD — General Guide": "guides/Billing%20Dispute%20Guides/BD%20GENERAL%20GUIDE.html",
    "LOA — Rebill Guide": "guides/Billing%20Dispute%20Guides/Rebill%20per%20LOA%20General%20Guide.html",
    "RVSL — Debtor Update Guide": "guides/Billing%20Dispute%20Guides/rvsl-guide.html",
    "Weight Update per BOL Guide": "guides/Billing%20Dispute%20Guides/weight-update-per-bol-guide.html",
    "Service Level/Type Guide": "guides/Billing%20Dispute%20Guides/service-level-type-guide.html",
    "Reference Number Guide": "guides/Billing%20Dispute%20Guides/reference-number-guide.html",

    "Fuel Guide": "guides/Pricing%20Guides/pricing-guides-list/fuel-guide.html",
    "Surcharge Pricing Guide": "guides/Pricing%20Guides/pricing-guides-list/surcharge-guide.html",
    "ePRT Guide": "guides/Pricing%20Guides/pricing-guides-list/eprt-guide.html",
    "ePRT Submission Guide": "guides/Pricing%20Guides/pricing-guides-list/eprt-submission.html",
    "Checking EPRS Guide": "guides/Pricing%20Guides/pricing-guides-list/checking-eprs.html",
    "Base Rater Guide": "guides/Pricing%20Guides/pricing-guides-list/base-rater.html",
    "Discount AMC Guide": "guides/Pricing%20Guides/pricing-guides-list/discount-amc-guide.html",

    "California Compliance Guide": "guides/Other%20Surcharge%20Guides/other-surcharges/california-compliance.html",
    "Canadian Custom Inspection Fee Guide": "guides/Other%20Surcharge%20Guides/other-surcharges/canadian-custom-inspection-fee.html",
    "Canadian Surcharge Guide": "guides/Other%20Surcharge%20Guides/other-surcharges/canadian-surcharge-guide.html",
    "Courtesy Discount Guide": "guides/Other%20Surcharge%20Guides/other-surcharges/courtesy-discount.html",
    "Cross Border Processing Fee Guide": "guides/Other%20Surcharge%20Guides/other-surcharges/cross-border-processing-fee.html",
    "High Cost Fee Guide": "guides/Other%20Surcharge%20Guides/other-surcharges/high-cost-fee.html",
    "NOST Guide": "guides/Other%20Surcharge%20Guides/other-surcharges/nost-guide.html",
    "Peak Surcharge Fee Guide": "guides/Other%20Surcharge%20Guides/other-surcharges/peak-surcharge-fee.html",
    "Weighing Service Guide": "guides/Other%20Surcharge%20Guides/other-surcharges/weighing-service-guide.html",
    "ZIP Service Charge Guide": "guides/Other%20Surcharge%20Guides/other-surcharges/zip-service-charge.html",
    "Sort & Segregate Guide": "guides/Other%20Surcharge%20Guides/sort-and-segregate-guide.html",
    "Notify Fee Guide": "guides/Other%20Surcharge%20Guides/notify-fee-guide.html",

    "Account Creation Steps": "guides/Account%20Handling%20Guides/account-handling-guides-list/account-creation-steps.html",
    "Creating Customer Account Guide": "guides/Account%20Handling%20Guides/account-handling-guides-list/creating-customer-account.html",
    "Handling Not Active Account Guide": "guides/Account%20Handling%20Guides/account-handling-guides-list/handling-notactive-guide.html",
    "Searching Account Guide": "guides/Account%20Handling%20Guides/account-handling-guides-list/searching-account-guide.html",
    "Updating PT / SCACBU Guide": "guides/Account%20Handling%20Guides/account-handling-guides-list/updating-pt-scacbu-guide.html",

    "Regions and EHOT Queue Guide": "guides/PAUD%20Guides/region-and-ehot-queue.html",
    "TPLO Guide": "guides/PAUD%20Guides/tplo-guide.html",
    "TPHI Guide": "guides/PAUD%20Guides/tphi-guide.html",
    "PAUD / TPKN Guide": "guides/PAUD%20Guides/paud-tpkn-guide.html",
    "CRAU — Request Decision Guide": "guides/PAUD%20Guides/crau-guide.html",
    "PAUD-FPAY Guide": "guides/PAUD%20Guides/paud-fpay-guide.html",
    "COD (Collect on Delivery) Guide": "guides/PAUD%20Guides/cod-guide.html",
    "Invalid Consignee/Shipper Account (ISPD)": "guides/PAUD%20Guides/ispd-guide.html",
    "LMPB (Lumper Fee) Guide": "guides/PAUD%20Guides/lmpb-guide.html",
    "IRT1–PO Number & Division Validation": "guides/PAUD%20Guides/irt1-po-number-division-guide.html",
    "IRT/VSAT – Queue Guide": "guides/PAUD%20Guides/irt-vsat-guide.html",
    "SAF2 Guide – NMFC, Reweigh & Weight Validation": "guides/PAUD%20Guides/saf2-guide.html",
    "BLOA Guide – Accessorial & Terms Validation": "guides/PAUD%20Guides/bloa-guide.html",
    "PAT8 – Multi-Company Queue Guide": "guides/PAUD%20Guides/pat8-guide.html",
    "PARS – Parker Hannifin Queue Guide": "guides/PAUD%20Guides/pars-guide.html",
    "CORT – Reconsignment Guide": "guides/PAUD%20Guides/cort-guide.html",
    "HOT – EHOT Queue Requests": "guides/PAUD%20Guides/hot-ehot-queue-guide.html"
  };

  /*
   * Extra current V2 operational guides that are not guaranteed
   * to be present in older registry snapshots.
   */
  const EXTRA_GUIDES = [
    ["OVC — General Guideline","OVC GENERAL GUIDE.html","Official OVC guideline for handling customer claims and disputes.","other","fa-shield-halved"],
    ["Reweigh — General Guide","Reweigh General Guide.html","Decision guide for reweigh disputes and corrections.","other","fa-weight-scale"],
    ["Correction Code Guide","Correction Code Guide.html","Decision tree to determine the correct CORR CODE.","other","fa-wand-magic-sparkles"],
    ["FedEx Direct Guide","FedEx Direct Guide.html","Decision tree for FedEx Direct disputes and validation.","other","fa-road"],
    ["Class Update Guide","class-update-guide.html","Decision tree for handling Class Update requests.","other","fa-layer-group"],
    ["Rate & Volume Quote Guide","rate-volume-guide.html","Decision tree for validating LTL and Volume Quotes.","other","fa-sack-dollar"],
    ["Shave a Day Guide/Early Delivery Fee","shave-a-day-guide.html","Verify SHAD fee concerns, service level details, delivery status, and the correct action.","other","fa-calendar-day"],
    ["Verifying Tracking Number Guide","information-validation-guide.html","Guide for validating freight information and tracking details.","other","fa-barcode"],
    ["Missing Documents Guide","missing-docs-guide.html","Guide for requesting missing BOL and supporting documents.","other","fa-file-circle-exclamation"],
    ["Keep or Remove Payment Guide","keep_or_remove_payment_guide_fixed.html","Determine whether to keep or remove payments based on LOA, billing corrections, and pricing scenarios.","other","fa-money-bill-transfer"],
    ["Demand Invoice Guide","demand-invoice-guide.html","Structured decision flow for demand invoice cases, PRO checks, resend scenarios, and invoice types.","other","fa-file-invoice"],
    ["Recycled Pro Guide","recycled-pro-guide.html","Identify recycled PRO issues, validate version history, and apply the correct resolution steps.","other","fa-recycle"],
    ["Employee Discount Guide","employee-discount-guide.html","Validate employee discount eligibility and determine the correct billing handling.","other","fa-percent"],
    ["Void and Write Off Guide","void-and-wo-guide.html","Decision flow for service errors, rebill scenarios, surcharge handling, PRO voiding, and write-off processing.","other","fa-file-circle-xmark"],
    ["Pro Number Suffix Guide","pro-no-suffix.html","Identify correct handling based on PRO number suffix and non-revenue scenarios.","other","fa-list-ol"],
    ["Volume Application Guide","volume-application.html","Review, validate, and process volume application requests.","other","fa-box-open"],
    ["PAT7 Guide","pat7-guide.html","Review special invoice handling and PAT7 queue requirements.","other","fa-clipboard-check"],
    ["Expedited Shipment / Priority Plus Guide","priority-plus-guide.html","Review Priority Plus or Expedited Shipment disputes and service validation.","other","fa-gauge-high"],
    ["Rerate Treatment Process Guide","rerate-treatment-process-guide.html","Determine correct rerate handling based on PRO age, pricing status, billing corrections, and rebill needs.","other","fa-rotate"],
    ["Inbond Fee Guide","inbond-fee-guide.html","Validate Inbond fee disputes using BOL documentation and Cargo Care indicators.","other","fa-hand-holding-dollar"],
    ["Handling Fee Guide","handling-fee-guide.html","Validate Handling fee disputes using usage and supporting documentation.","other","fa-hand"],
    ["ISPI — Mass Adjustment Guide","ispi-guide.html","Process mass adjustments including PRO entry, account changes, approvals, and final processing.","other","fa-arrows-rotate"],
    ["All Shorts Guide","all-shorts-guide.html","Handle All Short and Partial Short disputes using shipment history and supporting documentation.","other","fa-boxes"],
    ["Sales Write-Off Guide","sales-write-off-guide.html","Review Sales Write-Off requests, debtor eligibility, approval thresholds, and processing.","other","fa-pen-to-square"],
    ["Write-off in CAPS — Step by Step Procedure","wo-process-caps-guide.html","Step-by-step CAPS write-off workflow including PRO entry, reason codes, comments, responses, and closure.","other","fa-file-circle-xmark"],

    /* Current group-page cards shown in the V2 group screenshots */
    ["Debtor Update per BOL","guides/Billing%20Dispute%20Guides/BD%20GENERAL%20GUIDE.html","Follow BOL terms to determine the correct debtor and ensure accurate billing setup.","billing","fa-file-invoice-dollar"],
    ["Debtor Update per LOA","guides/Billing%20Dispute%20Guides/Rebill%20per%20LOA%20General%20Guide.html","Use LOA to evaluate debtor update requests and determine the correct billing action.","billing","fa-rotate"],
    ["Debtor Update per Reversal/Refusal","guides/Billing%20Dispute%20Guides/rvsl-guide.html","Evaluate reversal/refusal cases and determine the correct debtor and billing action.","billing","fa-arrow-right-arrow-left"],
    ["Weight Update per BOL","guides/Billing%20Dispute%20Guides/weight-update-per-bol-guide.html","Evaluate BOL-based weight and pallet discrepancies to determine the correct action or routing.","billing","fa-weight-hanging"],
    ["Service Level/Type Update per BOL","guides/Billing%20Dispute%20Guides/service-level-type-guide.html","Evaluate service level disputes to confirm correct rating based on BOL and system data.","billing","fa-truck-fast"],
    ["Reference Number Update — Add/Edit/Delete","guides/Billing%20Dispute%20Guides/reference-number-guide.html","Manage reference number updates and ensure correct correction processing and invoice handling.","billing","fa-hashtag"],

    ["Fuel Guide","guides/Pricing%20Guides/pricing-guides-list/fuel-guide.html","Review fuel-related pricing disputes using the correct guide and validation steps.","pricing","fa-gas-pump"],
    ["Surcharge Guide","guides/Pricing%20Guides/pricing-guides-list/surcharge-guide.html","Check surcharge disputes and verify the correct supporting logic before responding.","pricing","fa-receipt"],
    ["ePRT Guide","guides/Pricing%20Guides/pricing-guides-list/eprt-guide.html","Use ePRT guidance when pricing results need exception handling or escalation review.","pricing","fa-file-lines"],
    ["ePRT Submission","guides/Pricing%20Guides/pricing-guides-list/eprt-submission.html","Open the submission workflow when the case requires formal ePRT routing.","pricing","fa-paper-plane"],
    ["Checking EPRS","guides/Pricing%20Guides/pricing-guides-list/checking-eprs.html","Validate customer agreement and pricing setup using the EPRS reference tool.","pricing","fa-magnifying-glass"],
    ["Base Rater","guides/Pricing%20Guides/pricing-guides-list/base-rater.html","Open the base rating tool when pricing needs direct rate validation support.","pricing","fa-calculator"],
    ["Discount — AMC Guide","guides/Pricing%20Guides/pricing-guides-list/discount-amc-guide.html","Follow the premium decision flow for agreement checks, pricing exceptions, AMC handling, and rerate direction.","pricing","fa-tags"],
    ["Courtesy Discount Guide","guides/Pricing%20Guides/pricing-guides-list/courtesy-discount.html","Review courtesy discount concerns and determine the correct pricing action.","pricing","fa-hand-holding-dollar"],

    ["High Cost Fee","guides/Other%20Surcharge%20Guides/other-surcharges/high-cost-fee.html","Review high cost fee concerns and validate the appropriate surcharge handling.","surcharge","fa-dollar-sign"],
    ["Peak Surcharge Fee","guides/Other%20Surcharge%20Guides/other-surcharges/peak-surcharge-fee.html","Review peak surcharge concerns and determine the correct handling for period-based charges.","surcharge","fa-chart-line"],
    ["California Compliance","guides/Other%20Surcharge%20Guides/other-surcharges/california-compliance.html","Review surcharge concerns tied to California compliance requirements and validation.","surcharge","fa-scale-balanced"],
    ["Zip Service Charge","guides/Other%20Surcharge%20Guides/other-surcharges/zip-service-charge.html","Validate location-based service charges and determine the appropriate surcharge action.","surcharge","fa-location-dot"],
    ["Cross-Border Processing Fee","guides/Other%20Surcharge%20Guides/other-surcharges/cross-border-processing-fee.html","Review international processing fee concerns and validate the applicable surcharge.","surcharge","fa-globe"],
    ["Canadian Custom Inspection Fee","guides/Other%20Surcharge%20Guides/other-surcharges/canadian-custom-inspection-fee.html","Review Canadian inspection-related surcharge concerns and validate the applicable fee.","surcharge","fa-file-invoice"],
    ["Canadian Surcharge Guide","guides/Other%20Surcharge%20Guides/other-surcharges/canadian-surcharge-guide.html","Review Canadian surcharge concerns and determine the correct pricing action.","surcharge","fa-map-location-dot"],
    ["Weighing Service Fee","guides/Other%20Surcharge%20Guides/other-surcharges/weighing-service-guide.html","Validate weighing service fee disputes and determine whether the charge should remain or be removed.","surcharge","fa-weight-scale"],
    ["NOST Guide","guides/Other%20Surcharge%20Guides/other-surcharges/nost-guide.html","Review NOST disputes, pickup request validation, shipment history, and correct action.","surcharge","fa-shield-halved"],
    ["Sort & Segregate Guide","guides/Other%20Surcharge%20Guides/sort-and-segregate-guide.html","Validate Sort & Segregate disputes and determine the correct surcharge handling.","surcharge","fa-shuffle"],
    ["Notify Fee Guide","guides/Other%20Surcharge%20Guides/notify-fee-guide.html","Validate Notify Fee disputes and determine whether the charge should remain or be removed.","surcharge","fa-bell"],
    ["Lumper Fee Guide","guides/Other%20Surcharge%20Guides/other-surcharges/lumper-fee-guide.html","Handle lumper fee disputes and validate the appropriate surcharge response.","surcharge","fa-box"],
    ["Storage Fee Guide","guides/Other%20Surcharge%20Guides/other-surcharges/storage-fee-guide.html","Validate storage fee disputes, calculations, supporting documents, and FedEx fault claims.","surcharge","fa-warehouse"],
    ["Redelivery Handling Guide","guides/Other%20Surcharge%20Guides/other-surcharges/redelivery-handling-guide.html","Review second delivery attempts, receiving conditions, and surcharge-related handling.","surcharge","fa-truck-ramp-box"],

    ["Handling Inactive Account","guides/Account%20Handling%20Guides/account-handling-guides-list/handling-notactive-guide.html","Validate inactive, archived, deleted, or do-not-use account handling and determine the correct next action.","account","fa-user-xmark"],
    ["Creating Customer's Account","guides/Account%20Handling%20Guides/account-handling-guides-list/creating-customer-account.html","Follow the correct setup process when creating a new customer account.","account","fa-user-plus"],
    ["Steps on How to Create an Account","guides/Account%20Handling%20Guides/account-handling-guides-list/account-creation-steps.html","Use the structured account creation walkthrough for complete setup processing.","account","fa-list-check"],
    ["Searching for Account Guide","guides/Account%20Handling%20Guides/account-handling-guides-list/searching-account-guide.html","Locate and validate the correct customer account before proceeding.","account","fa-magnifying-glass"],
    ["Updating SCAC/BU Guide","guides/Account%20Handling%20Guides/account-handling-guides-list/updating-pt-scacbu-guide.html","Validate SCAC/BU update requests and determine the correct account correction steps.","account","fa-sliders"],

    ["Regions and EHOT Queue","guides/PAUD%20Guides/region-and-ehot-queue.html","Review and process region and EHOT queue requests including account, accessorial, and service updates.","paud","fa-earth-americas"],
    ["TPLO Guide","guides/PAUD%20Guides/tplo-guide.html","Handle TPLO requests including SPOC validation, account mapping, and special routing.","paud","fa-sitemap"],
    ["TPHI Guide","guides/PAUD%20Guides/tphi-guide.html","Follow TEMP-SYS matching to correctly map charge accounts and select the proper debtor.","paud","fa-diagram-project"],
    ["PAUD / TPKN Guide","guides/PAUD%20Guides/paud-tpkn-guide.html","Handle Shipper Code replacement requests including account validation, auto-rating, and corrections.","paud","fa-boxes-stacked"],
    ["CRAU — Request Decision Guide","guides/PAUD%20Guides/crau-guide.html","Review CRAU requests, validation checks, request details, and the correct next action.","paud","fa-network-wired"],
    ["PAUD-FPAY Guide","guides/PAUD%20Guides/paud-fpay-guide.html","Handle payment-related PAUD-FPAY requests with account validation and workflow review.","paud","fa-credit-card"],
    ["COD (Collect on Delivery) Guide","guides/PAUD%20Guides/cod-guide.html","Add or remove COD using BOL validation, LOA/CBL support, keywords, and autorating steps.","paud","fa-money-bill-transfer"],
    ["Invalid Consignee/Shipper Account (ISPD)","guides/PAUD%20Guides/ispd-guide.html","Review ISPD requests, validate shipper or consignee account discrepancies, and apply the correct correction path.","paud","fa-user-xmark"],
    ["LMPB (Lumper Fee) Guide","guides/PAUD%20Guides/lmpb-guide.html","Handle Lumper fee requests, validation, and correct routing for PAUD queue processing.","paud","fa-hand-holding-dollar"],
    ["IRT1 — PO Number & Division Validation","guides/PAUD%20Guides/irt1-po-number-division-guide.html","Validate PO number and division information and determine the correct billing action.","paud","fa-hashtag"],
    ["IRT/VSAT — Queue Guide","guides/PAUD%20Guides/irt-vsat-guide.html","Handle IRT/VSAT queue cases through validation, account mapping, and correction codes.","paud","fa-list-check"],
    ["SAF2 Guide — NMFC, Reweigh & Weight Validation","guides/PAUD%20Guides/saf2-guide.html","Validate NMFC classifications, pallet and tare weights, and determine the correct billing correction.","paud","fa-scale-balanced"],
    ["BLOA Guide — Accessorial & Terms Validation","guides/PAUD%20Guides/bloa-guide.html","Validate accessorial terms against the LOA and determine the correct billing action.","paud","fa-file-signature"],
    ["PAT8 — Multi-Company Queue Guide","guides/PAUD%20Guides/pat8-guide.html","Handle multi-company queue requests and validate the applicable accessorial or account correction.","paud","fa-building"],
    ["PARS — Parker Hannifin Queue Guide","guides/PAUD%20Guides/pars-guide.html","Validate Parker Hannifin debtor handling, shipment updates, and correction requirements.","paud","fa-user-check"],
    ["CORT — Reconsignment Guide","guides/PAUD%20Guides/cort-guide.html","Handle reconsignment requests and validate weight, piece count, customer center, and rate requirements.","paud","fa-rotate"],
    ["HOT — EHOT Queue Requests","guides/PAUD%20Guides/hot-ehot-queue-guide.html","Handle HOT/EHOT requests including storage disputes, shipment detail updates, routing, redelivery, and related processing.","paud","fa-fire"]
  ];

  const iconFallbacks = {
    billing:"fa-file-invoice-dollar",
    pricing:"fa-tags",
    surcharge:"fa-receipt",
    account:"fa-user-gear",
    paud:"fa-diagram-project",
    other:"fa-toolbox"
  };

  const GROUP_BY_REGISTRY_CATEGORY = {
    billing:"billing",
    pricing:"pricing",
    surcharge:"surcharge",
    account:"account",
    service:"other",
    claims:"other",
    rebill:"billing",
    reweigh:"other",
    correction:"other"
  };

  const els = {};

  let allGuides = [];
  let activeGroup = "all";
  let searchTerm = "";
  let sortAZ = true;

  function $(id){ return document.getElementById(id); }

  function getHistory(){
    try{
      return JSON.parse(localStorage.getItem("guideHistory")) || [];
    }catch(e){ return []; }
  }

  function getUsage(){
    try{
      return JSON.parse(localStorage.getItem("guideUsageCounts")) || {};
    }catch(e){ return {}; }
  }

  function saveHistory(history){
    try{ localStorage.setItem("guideHistory",JSON.stringify(history)); }catch(e){}
  }

  function saveUsage(usage){
    try{ localStorage.setItem("guideUsageCounts",JSON.stringify(usage)); }catch(e){}
  }

  function trackGuide(guide){
    const url = guide.url;
    if(!url) return;

    const history = getHistory();
    history.push({
      title:guide.title,
      url:url,
      timestamp:Date.now()
    });

    if(history.length > 100){
      history.splice(0,history.length-100);
    }

    saveHistory(history);

    const usage = getUsage();
    if(!usage[url]){
      usage[url] = {
        title:guide.title,
        count:0
      };
    }
    usage[url].title = guide.title;
    usage[url].count += 1;
    saveUsage(usage);
  }

  function getFavorites(){
    try{
      return JSON.parse(localStorage.getItem("guideFavorites")) || {};
    }catch(e){ return {}; }
  }

  function saveFavorites(favs){
    try{ localStorage.setItem("guideFavorites",JSON.stringify(favs)); }catch(e){}
  }

  function normalizeText(value){
    return String(value || "")
      .toLowerCase()
      .replace(/[–—]/g,"-")
      .replace(/\s+/g," ")
      .trim();
  }

  function inferGroup(item){
    if(item.__group && GROUPS[item.__group]) return item.__group;

    const title = normalizeText(item.title);
    const url = normalizeText(item.url);

    if(
      title.includes("paud") ||
      title.includes("tplo") ||
      title.includes("tphi") ||
      title.includes("tpkn") ||
      title.includes("crau") ||
      title.includes("pat8") ||
      title.includes("pars") ||
      title.includes("cort") ||
      title.includes("ehot") ||
      title.includes("irt1") ||
      title.includes("irt/vsat") ||
      title.includes("saf2") ||
      title.includes("bloa") ||
      url.includes("paud")
    ) return "paud";

    if(
      title.includes("surcharge") ||
      title.includes("fee") && (
        title.includes("cost") ||
        title.includes("peak") ||
        title.includes("weigh") ||
        title.includes("storage") ||
        title.includes("redelivery") ||
        title.includes("notify") ||
        title.includes("lumper")
      ) ||
      url.includes("other-surcharge")
    ) return "surcharge";

    if(
      title.includes("account") ||
      title.includes("scac") ||
      title.includes("inactive") ||
      title.includes("customer's account") ||
      url.includes("account-handling")
    ) return "account";

    if(
      title.includes("pricing") ||
      title.includes("fuel") ||
      title.includes("eprt") ||
      title.includes("rater") ||
      title.includes("volume quote") ||
      title.includes("discount") ||
      title.includes("courtesy") ||
      url.includes("pricing-guides")
    ) return "pricing";

    if(
      title.includes("debtor") ||
      title.includes("billing") ||
      title.includes("payment") ||
      title.includes("invoice") ||
      title.includes("write off") ||
      title.includes("write-off") ||
      title.includes("rerate") ||
      title.includes("reference number")
    ) return "billing";

    return "other";
  }

  function resolveUrl(item, group){
    if(ROUTE_OVERRIDES[item.title]) return ROUTE_OVERRIDES[item.title];

    let url = String(item.url || "").trim();
    if(!url) return "";

    if(url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/") || url.startsWith("guides/")){
      return url;
    }

    if(group === "other") return url;

    return GROUP_ROUTES[group] + url;
  }

  function makeGuide(raw){
    const title = raw.title || raw.name || "Untitled Guide";
    const group = inferGroup({
      title:title,
      url:raw.url,
      __group:raw.__group,
      category:raw.category
    });

    const icon = raw.icon || iconFallbacks[group] || "fa-file-lines";
    const description =
      raw.description ||
      "Use this Decision Support System guide to review the case and determine the correct workflow.";

    return {
      id:raw.id || normalizeText(title).replace(/[^a-z0-9]+/g,"-"),
      title:title,
      description:description,
      badge:raw.badge || GROUPS[group].label,
      icon:icon,
      group:group,
      url:resolveUrl(raw,group),
      keywords:Array.isArray(raw.keywords) ? raw.keywords : [],
      type:raw.type || "node-guide"
    };
  }

  function buildRegistryGuides(){
    const registry = Array.isArray(window.GUIDE_REGISTRY)
      ? window.GUIDE_REGISTRY
      : [];

    return registry.map(makeGuide);
  }

  function buildExtraGuides(){
    return EXTRA_GUIDES.map(function(row){
      return makeGuide({
        title:row[0],
        url:row[1],
        description:row[2],
        __group:row[3],
        icon:row[4],
        badge:GROUPS[row[3]] ? GROUPS[row[3]].label : "Guide"
      });
    });
  }

  function dedupeKey(title){
    return normalizeText(title)
      .replace(/\bguide(s)?\b/g, "")
      .replace(/\bguideline(s)?\b/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function dedupeGuides(items){
    const seen = new Set();
    const result = [];

    items.forEach(function(item){
      const key = dedupeKey(item.title);
      if(!key || seen.has(key)) return;
      seen.add(key);
      result.push(item);
    });

    return result;
  }

  function prepareGuides(){
    const registry = buildRegistryGuides();
    const extras = buildExtraGuides();

    /*
     * Extras are first so the current V2 group-page naming/route
     * wins when an older registry snapshot contains the same title.
     */
    allGuides = dedupeGuides(
      extras.concat(registry)
    );

    els.totalGuides.textContent = allGuides.length;

    Object.keys(GROUPS).forEach(function(group){
      const count = group === "all"
        ? allGuides.length
        : allGuides.filter(function(g){ return g.group === group; }).length;

      const counter = $("count-" + group);
      if(counter) counter.textContent = count;
    });
  }

  function matchesSearch(guide){
    if(!searchTerm) return true;

    const haystack = normalizeText([
      guide.title,
      guide.description,
      guide.badge,
      guide.group,
      guide.keywords.join(" ")
    ].join(" "));

    return haystack.includes(searchTerm);
  }

  function getVisibleGuides(){
    let list = allGuides.filter(function(guide){
      const groupMatch =
        activeGroup === "all" ||
        guide.group === activeGroup;

      return groupMatch && matchesSearch(guide);
    });

    list.sort(function(a,b){
      if(sortAZ){
        return a.title.localeCompare(b.title,undefined,{sensitivity:"base"});
      }
      return b.title.localeCompare(a.title,undefined,{sensitivity:"base"});
    });

    return list;
  }

  function escapeHtml(value){
    return String(value || "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  function render(){
    const visible = getVisibleGuides();
    const favorites = getFavorites();

    els.guideGrid.innerHTML = visible.map(function(guide){
      const favorite = !!favorites[guide.id];

      return `
        <article class="guide-card group-${escapeHtml(guide.group)}" data-id="${escapeHtml(guide.id)}">
          <button
            class="favorite-button ${favorite ? "active" : ""}"
            type="button"
            data-favorite="${escapeHtml(guide.id)}"
            aria-label="${favorite ? "Remove from" : "Add to"} favorites: ${escapeHtml(guide.title)}"
            title="${favorite ? "Remove from favorites" : "Add to favorites"}"
          >
            <i class="fa-${favorite ? "solid" : "regular"} fa-star"></i>
          </button>

          <div class="guide-top">
            <span class="guide-group">
              <i class="fa-solid ${escapeHtml(GROUPS[guide.group].icon)}"></i>
              ${escapeHtml(GROUPS[guide.group].label)}
            </span>
            <span class="guide-icon">
              <i class="fa-solid ${escapeHtml(guide.icon)}"></i>
            </span>
          </div>

          <h3>${escapeHtml(guide.title)}</h3>

          <p class="description">
            ${escapeHtml(guide.description)}
          </p>

          <div class="guide-footer">
            <span class="guide-badge">
              <i class="fa-solid ${escapeHtml(guide.icon)}"></i>
              ${escapeHtml(guide.badge)}
            </span>

            <button
              type="button"
              class="open-guide"
              data-open-guide="${escapeHtml(guide.id)}"
              ${guide.url ? "" : "disabled"}
            >
              Open Guide
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </article>
      `;
    }).join("");

    const total = allGuides.length;
    const count = visible.length;
    const groupLabel = GROUPS[activeGroup].label;

    if(searchTerm && activeGroup !== "all"){
      els.resultsText.textContent =
        `Showing ${count} of ${total} guides · ${groupLabel} · Search: “${searchTerm}”`;
    }else if(searchTerm){
      els.resultsText.textContent =
        `Showing ${count} of ${total} guides · Search: “${searchTerm}”`;
    }else if(activeGroup !== "all"){
      els.resultsText.textContent =
        `Showing ${count} ${groupLabel.toLowerCase()} guides`;
    }else{
      els.resultsText.textContent =
        `Showing all ${total} guides`;
    }

    els.libraryTitle.textContent =
      activeGroup === "all"
        ? "All Decision Guides"
        : GROUPS[activeGroup].label + " Guides";

    els.activeFilterPill.hidden = activeGroup === "all";
    els.activeFilterName.textContent = groupLabel;

    els.noResults.hidden = visible.length !== 0;

    document.querySelectorAll(".category-filter").forEach(function(button){
      button.classList.toggle(
        "active",
        button.dataset.group === activeGroup
      );
    });

    if(visible.length){
      els.guideGrid.scrollIntoView({behavior:"smooth",block:"start"});
    }
  }

  function setGroup(group){
    if(!GROUPS[group]) group = "all";
    activeGroup = group;
    render();
  }

  function setSearch(value){
    searchTerm = normalizeText(value);
    els.guideSearch.value = value || "";
    els.clearSearch.classList.toggle("visible",!!searchTerm);
    render();
  }

  function openGuide(guide){
    if(!guide || !guide.url){
      showToast("This guide does not have a valid route yet.");
      return;
    }

    trackGuide(guide);
    window.location.href = guide.url;
  }

  function showToast(message){
    els.toast.textContent = message;
    els.toast.classList.add("show");
    clearTimeout(window.__allGuidesToastTimer);

    window.__allGuidesToastTimer = setTimeout(function(){
      els.toast.classList.remove("show");
    },1900);
  }

  function toggleFavorite(id){
    const favorites = getFavorites();
    const guide = allGuides.find(function(item){ return item.id === id; });
    if(!guide) return;

    if(favorites[id]){
      delete favorites[id];
      showToast("Removed from Favorites");
    }else{
      favorites[id] = {
        title:guide.title,
        url:guide.url,
        timestamp:Date.now()
      };
      showToast("Added to Favorites");
    }

    saveFavorites(favorites);
    render();
  }

  function initSearch(){
    els.guideSearch.addEventListener("input",function(){
      setSearch(this.value);
    });

    els.guideSearch.addEventListener("keydown",function(event){
      if(event.key === "Enter"){
        event.preventDefault();
        setSearch(this.value);
      }
    });

    els.searchButton.addEventListener("click",function(){
      setSearch(els.guideSearch.value);
      els.guideLibrary.scrollIntoView({
        behavior:"smooth",
        block:"start"
      });
      els.guideSearch.focus({preventScroll:true});
    });

    els.clearSearch.addEventListener("click",function(){
      setSearch("");
      els.guideSearch.focus();
    });

    els.resetSearch.addEventListener("click",function(){
      activeGroup = "all";
      setSearch("");
      window.scrollTo({top:0,behavior:"smooth"});
    });
  }

  function initFilters(){
    document.querySelectorAll(".category-filter").forEach(function(button){
      button.addEventListener("click",function(){
        setGroup(button.dataset.group);
      });
    });

    els.clearFilter.addEventListener("click",function(){
      setGroup("all");
    });
  }

  function initSort(){
    els.sortButton.addEventListener("click",function(){
      sortAZ = !sortAZ;

      const icon = els.sortButton.querySelector("i");
      const text = els.sortButton.querySelector("span");

      if(sortAZ){
        icon.className = "fa-solid fa-arrow-down-a-z";
        text.textContent = "Sort A–Z";
      }else{
        icon.className = "fa-solid fa-arrow-up-z-a";
        text.textContent = "Sort Z–A";
      }

      render();
    });
  }

  function initDelegatedCards(){
    els.guideGrid.addEventListener("click",function(event){
      const favoriteButton = event.target.closest("[data-favorite]");
      if(favoriteButton){
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(favoriteButton.dataset.favorite);
        return;
      }

      const openButton = event.target.closest("[data-open-guide]");
      if(openButton){
        event.preventDefault();
        event.stopPropagation();

        const guide = allGuides.find(function(item){
          return item.id === openButton.dataset.openGuide;
        });

        openGuide(guide);
      }
    });
  }

  /*
   * Shared header global search.
   * This is deliberately compatible with the existing V2 header,
   * which can call window.performSearch(value).
   */
  window.performSearch = function(value){
    setSearch(value || "");

    els.guideLibrary.scrollIntoView({
      behavior:"smooth",
      block:"start"
    });

    setTimeout(function(){
      els.guideSearch.focus({preventScroll:true});
    },250);
  };

  function cacheElements(){
    els.guideSearch = $("guideSearch");
    els.clearSearch = $("clearSearch");
    els.searchButton = $("searchButton");
    els.guideGrid = $("guideGrid");
    els.guideLibrary = $("guideLibrary");
    els.resultsText = $("resultsText");
    els.libraryTitle = $("libraryTitle");
    els.totalGuides = $("totalGuides");
    els.activeFilterPill = $("activeFilterPill");
    els.activeFilterName = $("activeFilterName");
    els.clearFilter = $("clearFilter");
    els.sortButton = $("sortButton");
    els.noResults = $("noResults");
    els.resetSearch = $("resetSearch");
    els.toast = $("toast");
  }

  function init(){
    cacheElements();

    prepareGuides();
    initSearch();
    initFilters();
    initSort();
    initDelegatedCards();
    render();

    /*
     * If the shared header emits a search event, use the same library.
     */
    document.addEventListener("bdtools:search",function(event){
      setSearch(
        event.detail && event.detail.value
          ? event.detail.value
          : ""
      );
      els.guideLibrary.scrollIntoView({
        behavior:"smooth",
        block:"start"
      });
    });

    /*
     * Allow footer/header Explore All Guides actions to safely
     * remain on this page.
     */
    document.addEventListener("bdtools:explore-guides",function(){
      els.guideLibrary.scrollIntoView({
        behavior:"smooth",
        block:"start"
      });
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded",init);
  }else{
    init();
  }

})();
