/* ============================================================
   DSS V2 — ALL GUIDES
   Static catalog. No JSON. No database.

   IMPORTANT:
   - This page intentionally owns its guide catalog so it cannot
     silently fall back to the 25 "Other Operational" cards.
   - Routes match the current root/guides/<Group Folder>/ layout.
   - Uses the existing DSS localStorage history, usage and favorites.
   ============================================================ */
(function () {
  "use strict";

  const GROUPS = {
    all:      { label: "All Guides",       color: "purple", icon: "fa-layer-group" },
    billing:  { label: "Billing Dispute", color: "purple", icon: "fa-file-invoice-dollar" },
    pricing:  { label: "Pricing General", color: "orange", icon: "fa-tags" },
    surcharge:{ label: "Surcharges",       color: "blue",   icon: "fa-receipt" },
    account:  { label: "Account Handling", color: "green",  icon: "fa-user-gear" },
    paud:     { label: "PAUD Queue",       color: "indigo", icon: "fa-diagram-project" },
    other:    { label: "Other Operational",color: "pink",   icon: "fa-toolbox" }
  };

  const CATALOG = [
    /* ========================= BILLING DISPUTE — 6 ========================= */
    ["Debtor Update per BOL", "guides/Billing%20Dispute%20Guides/BD%20GENERAL%20GUIDE.html", "Follow BOL terms to determine the correct debtor and ensure accurate billing setup.", "billing", "fa-file-invoice-dollar"],
    ["Debtor Update per LOA", "guides/Billing%20Dispute%20Guides/Rebill%20per%20LOA%20General%20Guide.html", "Use LOA to evaluate debtor update requests and determine the correct billing action.", "billing", "fa-file-signature"],
    ["Debtor Update per Reversal/Refusal", "guides/Billing%20Dispute%20Guides/rvsl-guide.html", "Evaluate reversal or refusal cases and determine the correct debtor and billing action.", "billing", "fa-right-left"],
    ["Weight Update per BOL", "guides/Billing%20Dispute%20Guides/weight-update-per-bol-guide.html", "Evaluate BOL-based weight and pallet discrepancies to determine the correct action or routing.", "billing", "fa-weight-scale"],
    ["Service Level/Type Update per BOL", "guides/Billing%20Dispute%20Guides/service-level-type-guide.html", "Evaluate service level disputes to confirm correct rating based on BOL details.", "billing", "fa-truck-fast"],
    ["Reference Number Update - Add/Edit/Delete", "guides/Billing%20Dispute%20Guides/reference-number-guide.html", "Manage reference number updates and ensure correct correction processing and invoice handling.", "billing", "fa-dollar-sign"],

    /* ========================= PRICING GENERAL — 8 ======================== */
    ["Fuel Guide", "guides/Pricing%20Guides/pricing-guides-list/fuel-guide.html", "Review fuel-related pricing disputes using the correct guide and supporting validation steps.", "pricing", "fa-gas-pump"],
    ["Surcharge Guide", "guides/Pricing%20Guides/pricing-guides-list/surcharge-guide.html", "Check surcharge disputes and verify the correct supporting logic before responding.", "pricing", "fa-receipt"],
    ["ePRT Guide", "guides/Pricing%20Guides/pricing-guides-list/eprt-guide.html", "Use ePRT guidance when pricing results need exception handling or escalation review.", "pricing", "fa-file-lines"],
    ["ePRT Submission", "guides/Pricing%20Guides/pricing-guides-list/eprt-submission.html", "Open the submission page when the case already requires formal ePRT routing.", "pricing", "fa-paper-plane"],
    ["Checking EPRS", "guides/Pricing%20Guides/pricing-guides-list/checking-eprs.html", "Validate customer agreement and pricing setup using the EPRS reference tool.", "pricing", "fa-magnifying-glass"],
    ["Base Rater", "guides/Pricing%20Guides/pricing-guides-list/base-rater.html", "Open the base rating tool when pricing needs direct rate validation support.", "pricing", "fa-calculator"],
    ["Discount - AMC Guide", "guides/Pricing%20Guides/pricing-guides-list/discount-amc-guide.html", "Follow the premium decision flow for agreement checks, pricing exceptions, AMC handling, and rerate direction.", "pricing", "fa-tags"],
    ["Courtesy Discount Guide", "guides/Pricing%20Guides/pricing-guides-list/courtesy-discount.html", "Use this guide when the concern involves courtesy discount handling, review direction, or surcharge-related adjustment support.", "pricing", "fa-hand-holding-dollar"],

    /* ========================= SURCHARGES — 14 ============================= */
    ["High Cost Fee", "guides/Other%20Surcharge%20Guides/other-surcharges/high-cost-fee.html", "Review high cost fee concerns and validate the appropriate surcharge handling.", "surcharge", "fa-dollar-sign"],
    ["Peak Surcharge Fee", "guides/Other%20Surcharge%20Guides/other-surcharges/peak-surcharge-fee.html", "Review peak surcharge concerns and determine the correct handling for period-based charges.", "surcharge", "fa-arrow-trend-up"],
    ["California Compliance", "guides/Other%20Surcharge%20Guides/other-surcharges/california-compliance.html", "Review surcharge concerns tied to California compliance requirements and validation.", "surcharge", "fa-shield-halved"],
    ["Zip Service Charge", "guides/Other%20Surcharge%20Guides/other-surcharges/zip-service-charge.html", "Validate location-based service charges and determine the appropriate surcharge action.", "surcharge", "fa-location-dot"],
    ["Cross-Border Processing Fee", "guides/Other%20Surcharge%20Guides/other-surcharges/cross-border-processing-fee.html", "Review international processing fee concerns and validate the appropriate surcharge handling.", "surcharge", "fa-globe"],
    ["Canadian Custom Inspection Fee", "guides/Other%20Surcharge%20Guides/other-surcharges/canadian-custom-inspection-fee.html", "Review Canadian inspection-related fee concerns and validate the applicable fee.", "surcharge", "fa-list-check"],
    ["Canadian Surcharge Guide", "guides/Other%20Surcharge%20Guides/other-surcharges/canadian-surcharge-guide.html", "Review Canada-related surcharge concerns and determine the correct pricing action.", "surcharge", "fa-table-cells"],
    ["Weighing Service Fee", "guides/Other%20Surcharge%20Guides/other-surcharges/weighing-service-guide.html", "Review weighing service fee disputes and determine whether the charge should remain or be removed.", "surcharge", "fa-weight-scale"],
    ["NOST Guide", "guides/Other%20Surcharge%20Guides/other-surcharges/nost-guide.html", "Review NOST disputes, validate pickup and dashboard details, and determine the correct account action.", "surcharge", "fa-clipboard"],
    ["Sort & Segregate Guide", "guides/Other%20Surcharge%20Guides/sort-and-segregate-guide.html", "Validate Sort & Segregate disputes and determine the correct surcharge handling.", "surcharge", "fa-list"],
    ["Notify Fee Guide", "guides/Other%20Surcharge%20Guides/notify-fee-guide.html", "Validate Notify Fee disputes and determine whether the notification charge should remain or be removed.", "surcharge", "fa-bell"],
    ["Lumper Fee Guide", "guides/Other%20Surcharge%20Guides/other-surcharges/lumper-fee-guide.html", "Handle Lumper fee disputes and validate the appropriate surcharge response and documentation.", "surcharge", "fa-bag-shopping"],
    ["Storage Fee Guide", "guides/Other%20Surcharge%20Guides/other-surcharges/storage-fee-guide.html", "Validate storage fee disputes, calculations, supporting documents, and FedEx fault claims.", "surcharge", "fa-warehouse"],
    ["Redelivery Handling Guide", "guides/Other%20Surcharge%20Guides/other-surcharges/redelivery-handling-guide.html", "Review second delivery attempts, receiving conditions, and customer refusal scenarios to validate the fee.", "surcharge", "fa-truck"],

    /* ========================= ACCOUNT HANDLING — 5 ======================= */
    ["Handling Inactive Account", "guides/Account%20Handling%20Guides/account-handling-guides-list/handling-notactive-guide.html", "Validate inactive, archived, deleted, or do-not-use accounts and determine the correct next action.", "account", "fa-user-xmark"],
    ["Creating Customer's Account", "guides/Account%20Handling%20Guides/account-handling-guides-list/creating-customer-account.html", "Follow the correct setup process when creating a new customer account.", "account", "fa-user-plus"],
    ["Steps on How to Create an Account", "guides/Account%20Handling%20Guides/account-handling-guides-list/account-creation-steps.html", "Follow the structured step-by-step process for complete customer account creation.", "account", "fa-list-check"],
    ["Searching for Account Guide", "guides/Account%20Handling%20Guides/account-handling-guides-list/searching-account-guide.html", "Locate and validate the correct customer account before proceeding with account handling.", "account", "fa-user-magnifying-glass"],
    ["Updating SCAC/BU Guide", "guides/Account%20Handling%20Guides/account-handling-guides-list/updating-pt-scacbu-guide.html", "Validate SCAC/BU update requests and determine the correct correction and update steps.", "account", "fa-list-check"],

    /* ========================= PAUD QUEUE — 17 ============================= */
    ["Regions and EHOT Queue Guide", "guides/PAUD%20Guides/region-and-ehot-queue.html", "Review and process region and EHOT queue requests including account, accessorial, service type, and related updates.", "paud", "fa-globe"],
    ["TPLO Guide", "guides/PAUD%20Guides/tplo-guide.html", "Handle TPLO requests including SPOC validation, account mapping, special account routing, and billing handling.", "paud", "fa-sitemap"],
    ["TPHI Guide", "guides/PAUD%20Guides/tphi-guide.html", "Follow the TEMP-SYS matching process to correctly map charge accounts and ensure proper debtor selection.", "paud", "fa-diagram-project"],
    ["PAUD / TPKN Guide", "guides/PAUD%20Guides/paud-tpkn-guide.html", "Follow the process for replacing Shipper Code requests, including account validation, auto-rating, and corrections.", "paud", "fa-boxes-stacked"],
    ["CRAU — Request Decision Guide", "guides/PAUD%20Guides/crau-guide.html", "Handle CRAU requests through validation checks, request review, and the correct next action.", "paud", "fa-clipboard-list"],
    ["PAUD-FPAY Guide", "guides/PAUD%20Guides/paud-fpay-guide.html", "Review payment-related handling, account validation, and proper PAUD-FPAY workflow decisions.", "paud", "fa-credit-card"],
    ["COD (Collect on Delivery) Guide", "guides/PAUD%20Guides/cod-guide.html", "Handle COD additions or removals using BOL validation, LOA/CLP support, keywords, and automating steps.", "paud", "fa-money-bill-transfer"],
    ["Invalid Consignee/Shipper Account (ISPD)", "guides/PAUD%20Guides/ispd-guide.html", "Review ISPD queue requests, validate account discrepancies, and apply the correct ACR correction path.", "paud", "fa-user-xmark"],
    ["LMPB (Lumper Fee) Guide", "guides/PAUD%20Guides/lmpb-guide.html", "Handle Lumper fee requests, Sort & Segregate validation, prepaid/third-party handling, and CORR ACC processing.", "paud", "fa-hand-holding-dollar"],
    ["IRT1–PO Number & Division Validation", "guides/PAUD%20Guides/irt1-po-number-division-guide.html", "Validate PO number and division information and determine the correct billing terms, account, and correction action.", "paud", "fa-hashtag"],
    ["IRT/VSAT – Queue Guide", "guides/PAUD%20Guides/irt-vsat-guide.html", "Handle Graino, Rio Bravo, and Hino queue cases through validation, account mapping, and correction codes.", "paud", "fa-file-lines"],
    ["SAF2 Guide – NMFC, Reweigh & Weight Validation", "guides/PAUD%20Guides/saf2-guide.html", "Validate NMFC classifications, pallet and tare weights, reweigh certificates, and billing corrections.", "paud", "fa-scale-balanced"],
    ["BLOA Guide – Accessorial & Terms Validation", "guides/PAUD%20Guides/bloa-guide.html", "Validate accessorial terms against the Letter of Authority and determine the correct billing correction.", "paud", "fa-file-signature"],
    ["PAT8 – Multi-Company Queue Guide", "guides/PAUD%20Guides/pat8-guide.html", "Handle EMERSON, FLMRS, Harte Hanks, Two Value Fabrics, and accessorial removal requests.", "paud", "fa-building"],
    ["PARS – Parker Hannifin Queue Guide", "guides/PAUD%20Guides/pars-guide.html", "Validate Parker Hannifin debtor handling, consignee updates, rate comparisons, and correction code selection.", "paud", "fa-user-check"],
    ["CORT – Reconsignment Guide", "guides/PAUD%20Guides/cort-guide.html", "Handle reconsignment requests by validating weight, piece count, customer center, NEWP, and AUTO RATE requirements.", "paud", "fa-rotate"],
    ["HOT – EHOT Queue Requests", "guides/PAUD%20Guides/hot-ehot-queue-guide.html", "Handle HOT/EHOT requests including storage disputes, shipment detail updates, routing, redelivery, GAMD, and REDOT.", "paud", "fa-fire"],

    /* ========================= OTHER OPERATIONAL — 25 ===================== */
    ["OVC — General Guideline", "guides/Other%20Guides/OVC%20GENERAL%20GUIDE.html", "Official OVC guideline for handling customer claims and disputes.", "other", "fa-shield-halved"],
    ["Reweigh — General Guide", "guides/Other%20Guides/Reweigh%20General%20Guide.html", "Decision guide for reweigh disputes and corrections.", "other", "fa-weight-scale"],
    ["Correction Code Guide", "guides/Other%20Guides/Correction%20Code%20Guide.html", "Decision tree to determine the correct CORR CODE.", "other", "fa-wand-magic-sparkles"],
    ["FedEx Direct Guide", "guides/Other%20Guides/FedEx%20Direct%20Guide.html", "Decision tree for FedEx Direct disputes and validation.", "other", "fa-road"],
    ["Class Update Guide", "guides/Other%20Guides/class-update-guide.html", "Decision tree for handling Class Update requests.", "other", "fa-layer-group"],
    ["Rate & Volume Quote Guide", "guides/Other%20Guides/rate-volume-guide.html", "Decision tree for validating LTL and Volume Quotes.", "other", "fa-chart-column"],
    ["Save a Day Guide/Early Delivery Fee", "guides/Other%20Guides/shave-a-day-guide.html", "Verify SHAD fees, LOA and service level details, delivery status, and the correct service correction.", "other", "fa-calendar-day"],
    ["Verifying Tracking Number Guide", "guides/Other%20Guides/information-validation-guide.html", "Guide for validating freight tracking and shipment information.", "other", "fa-magnifying-glass-minus"],
    ["Missing Documents Guide", "guides/Other%20Guides/missing-docs-guide.html", "Guide for requesting missing BOL and supporting documents.", "other", "fa-file-circle-exclamation"],
    ["Keep or Remove Payment Guide", "guides/Other%20Guides/keep_or_remove_payment_guide_fixed.html", "Determine whether to keep or remove payment based on LOA, billing corrections, and pricing scenarios.", "other", "fa-money-bill"],
    ["Demand Invoice Guide", "guides/Other%20Guides/demand-invoice-guide.html", "Structured decision flow for demand invoice cases, PRO checks, resend scenarios, and invoice types.", "other", "fa-file-invoice"],
    ["Recycled Pro Guide", "guides/Other%20Guides/recycled-pro-guide.html", "Identify recycled PRO issues, validate version history, and apply the correct resolution steps.", "other", "fa-recycle"],
    ["Employee Discount Guide", "guides/Other%20Guides/employee-discount-guide.html", "Validate employee discount eligibility and determine the correct billing handling.", "other", "fa-user-tag"],
    ["Void and Write Off Guide", "guides/Other%20Guides/void-and-wo-guide.html", "Follow the workflow for service errors, rebill scenarios, surcharge handling, PRO voiding, and write-offs.", "other", "fa-file-circle-xmark"],
    ["Pro Number Suffix Guide", "guides/Other%20Guides/pro-no-suffix.html", "Identify correct handling based on PRO number suffix, including F0, CO, YO, and non-revenue scenarios.", "other", "fa-list-ol"],
    ["Volume Application Guide", "guides/Other%20Guides/volume-application.html", "Review, validate, and process volume application requests using the correct workflow.", "other", "fa-box-open"],
    ["PAT7 Guide", "guides/Other%20Guides/pat7-guide.html", "Review special invoice handling, BOL imaging, reference edits, PO validation, and invoice posting actions.", "other", "fa-clipboard-check"],
    ["Expedited Shipment / Priority Plus Guide", "guides/Other%20Guides/priority-plus-guide.html", "Review Priority Plus or Expedited Shipment disputes and validate rate, service, BOL, and LOA support.", "other", "fa-gauge-high"],
    ["Rerate Treatment Process Guide", "guides/Other%20Guides/rerate-treatment-process-guide.html", "Determine the correct rerate treatment based on PRO age, pricing status, debtor updates, rebills, and corrections.", "other", "fa-rotate"],
    ["Inbond Fee Guide", "guides/Other%20Guides/inbond-fee-guide.html", "Validate Inbond fee disputes using BOL documentation and Cargo Care indicators.", "other", "fa-hand-holding-dollar"],
    ["Handling Fee Guide", "guides/Other%20Guides/handling-fee-guide.html", "Validate Handling fee disputes involving usage, loading, unloading, assembly, and supporting documents.", "other", "fa-hand"],
    ["ISPI — Mass Adjustment Guide", "guides/Other%20Guides/ispi-guide.html", "Process mass adjustments including PRO entry, account changes, approvals, checks, and final processing.", "other", "fa-arrows-rotate"],
    ["All Shorts Guide", "guides/Other%20Guides/all-shorts-guide.html", "Handle All Short and Partial Short disputes using shipment history, claims, LOA documentation, and piece counts.", "other", "fa-boxes-stacked"],
    ["Sales Write-Off Guide", "guides/Other%20Guides/sales-write-off-guide.html", "Review Sales Write-Off requests, validate PRO and debtor eligibility, and follow approval thresholds.", "other", "fa-file-pen"],
    ["Write-off in CAPS — Step by Step Procedure", "guides/Other%20Guides/wo-process-caps-guide.html", "Process write-offs in CAPS from Business Unit selection and PRO entry through comments, responses, and case closure.", "other", "fa-file-circle-xmark"]
  ];

  const els = {};
  let allGuides = [];
  let activeGroup = "all";
  let searchTerm = "";
  let sortAZ = true;

  function $(id) { return document.getElementById(id); }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[–—]/g, "-")
      .replace(/\s+/g, " ")
      .trim();
  }

  function slug(value) {
    return normalizeText(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getHistory() {
    try { return JSON.parse(localStorage.getItem("guideHistory")) || []; }
    catch (e) { return []; }
  }
  function saveHistory(value) {
    try { localStorage.setItem("guideHistory", JSON.stringify(value)); } catch (e) {}
  }
  function getUsage() {
    try { return JSON.parse(localStorage.getItem("guideUsageCounts")) || {}; }
    catch (e) { return {}; }
  }
  function saveUsage(value) {
    try { localStorage.setItem("guideUsageCounts", JSON.stringify(value)); } catch (e) {}
  }
  function getFavorites() {
    try { return JSON.parse(localStorage.getItem("guideFavorites")) || {}; }
    catch (e) { return {}; }
  }
  function saveFavorites(value) {
    try { localStorage.setItem("guideFavorites", JSON.stringify(value)); } catch (e) {}
  }

  function buildGuides() {
    return CATALOG.map(function (item, index) {
      return {
        id: slug(item[0]) || ("guide-" + index),
        title: item[0],
        url: item[1],
        description: item[2],
        group: item[3],
        icon: item[4],
        badge: GROUPS[item[3]].label,
        keywords: normalizeText(item[0] + " " + item[2] + " " + GROUPS[item[3]].label)
      };
    });
  }

  function trackGuide(guide) {
    const history = getHistory();
    history.push({ title: guide.title, url: guide.url, timestamp: Date.now() });
    if (history.length > 100) history.splice(0, history.length - 100);
    saveHistory(history);

    const usage = getUsage();
    if (!usage[guide.url]) usage[guide.url] = { title: guide.title, count: 0 };
    usage[guide.url].title = guide.title;
    usage[guide.url].count += 1;
    saveUsage(usage);
  }

  function matches(guide) {
    if (!searchTerm) return true;
    return normalizeText(guide.keywords).includes(searchTerm);
  }

  function visibleGuides() {
    const list = allGuides.filter(function (guide) {
      return (activeGroup === "all" || guide.group === activeGroup) && matches(guide);
    });
    list.sort(function (a, b) {
      const result = a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
      return sortAZ ? result : -result;
    });
    return list;
  }

  function showToast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add("show");
    clearTimeout(window.__allGuidesToast);
    window.__allGuidesToast = setTimeout(function () {
      els.toast.classList.remove("show");
    }, 1800);
  }

  function toggleFavorite(id) {
    const favorites = getFavorites();
    const guide = allGuides.find(function (g) { return g.id === id; });
    if (!guide) return;

    if (favorites[id]) {
      delete favorites[id];
      showToast("Removed from Favorites");
    } else {
      favorites[id] = { title: guide.title, url: guide.url, timestamp: Date.now() };
      showToast("Added to Favorites");
    }
    saveFavorites(favorites);
    render();
  }

  function openGuide(guide) {
    if (!guide || !guide.url) {
      showToast("This guide does not have a valid route yet.");
      return;
    }
    trackGuide(guide);
    window.location.href = guide.url;
  }

  function render() {
    const list = visibleGuides();
    const favorites = getFavorites();

    els.guideGrid.innerHTML = list.map(function (guide) {
      const favorite = !!favorites[guide.id];
      const group = GROUPS[guide.group];
      return `
        <article class="guide-card group-${guide.group}" data-id="${escapeHtml(guide.id)}" tabindex="0" aria-label="${escapeHtml(guide.title)}">
          <button class="favorite-button ${favorite ? "active" : ""}" type="button" data-favorite="${escapeHtml(guide.id)}" aria-label="${favorite ? "Remove from" : "Add to"} favorites: ${escapeHtml(guide.title)}">
            ${favorite ? "★" : "☆"}
          </button>

          <div class="guide-top">
            <span class="guide-icon" aria-hidden="true"><i class="fa-solid ${escapeHtml(guide.icon)}"></i></span>
            <span class="guide-group">${escapeHtml(group.label)}</span>
          </div>

          <h3>${escapeHtml(guide.title)}</h3>
          <p class="description">${escapeHtml(guide.description)}</p>

          <div class="guide-footer">
            <span class="guide-badge"><i class="fa-solid ${escapeHtml(guide.icon)}"></i>${escapeHtml(group.label)}</span>
            <button class="open-guide" type="button" data-open-guide="${escapeHtml(guide.id)}">Open <span>→</span></button>
          </div>
        </article>`;
    }).join("");

    const total = allGuides.length;
    const count = list.length;

    els.resultsText.textContent = searchTerm
      ? `Showing ${count} of ${total} guides · Search: “${searchTerm}”`
      : activeGroup !== "all"
        ? `Showing ${count} ${GROUPS[activeGroup].label.toLowerCase()} guides`
        : `Showing all ${total} guides`;

    els.libraryTitle.textContent = activeGroup === "all" ? "All Guides" : GROUPS[activeGroup].label + " Guides";
    els.activeFilterPill.hidden = activeGroup === "all";
    els.activeFilterName.textContent = GROUPS[activeGroup].label;
    els.noResults.hidden = count !== 0;
    els.clearSearch.hidden = !searchTerm;

    document.querySelectorAll(".guide-filter").forEach(function (button) {
      button.classList.toggle("active", button.dataset.group === activeGroup);
    });
  }

  function setSearch(value, scroll) {
    searchTerm = normalizeText(value);
    els.guideSearch.value = value || "";
    render();
    if (scroll) els.guideLibrary.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setGroup(group) {
    activeGroup = GROUPS[group] ? group : "all";
    render();
    els.guideLibrary.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function init() {
    els.guideSearch = $("guideSearch");
    els.searchButton = $("searchButton");
    els.clearSearch = $("clearSearch");
    els.sortButton = $("sortButton");
    els.guideGrid = $("guideGrid");
    els.guideLibrary = $("guideLibrary");
    els.resultsText = $("resultsText");
    els.libraryTitle = $("libraryTitle");
    els.activeFilterPill = $("activeFilterPill");
    els.activeFilterName = $("activeFilterName");
    els.clearFilter = $("clearFilter");
    els.noResults = $("noResults");
    els.resetSearch = $("resetSearch");
    els.toast = $("toast");

    allGuides = buildGuides();

    Object.keys(GROUPS).forEach(function (group) {
      const element = $("count-" + group);
      if (element) {
        element.textContent = group === "all"
          ? allGuides.length
          : allGuides.filter(function (guide) { return guide.group === group; }).length;
      }
    });

    document.querySelectorAll(".guide-filter").forEach(function (button) {
      button.addEventListener("click", function () { setGroup(button.dataset.group); });
    });

    els.guideSearch.addEventListener("input", function () { setSearch(this.value, false); });
    els.guideSearch.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        setSearch(this.value, true);
      }
    });

    els.searchButton.addEventListener("click", function () {
      setSearch(els.guideSearch.value, true);
    });

    els.clearSearch.addEventListener("click", function () {
      setSearch("", false);
      els.guideSearch.focus();
    });

    els.clearFilter.addEventListener("click", function () { setGroup("all"); });

    els.resetSearch.addEventListener("click", function () {
      activeGroup = "all";
      setSearch("", true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    els.sortButton.addEventListener("click", function () {
      sortAZ = !sortAZ;
      this.innerHTML = sortAZ ? "Sort A–Z <span>↕</span>" : "Sort Z–A <span>↕</span>";
      render();
    });

    els.guideGrid.addEventListener("click", function (event) {
      const favorite = event.target.closest("[data-favorite]");
      if (favorite) {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(favorite.dataset.favorite);
        return;
      }

      const open = event.target.closest("[data-open-guide]");
      if (open) {
        event.preventDefault();
        event.stopPropagation();
        openGuide(allGuides.find(function (g) { return g.id === open.dataset.openGuide; }));
        return;
      }

      const card = event.target.closest(".guide-card");
      if (card) openGuide(allGuides.find(function (g) { return g.id === card.dataset.id; }));
    });

    els.guideGrid.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest(".guide-card");
      if (!card || event.target.closest("button")) return;
      event.preventDefault();
      openGuide(allGuides.find(function (g) { return g.id === card.dataset.id; }));
    });

    window.performSearch = function (value) {
      setSearch(value || "", true);
      setTimeout(function () {
        els.guideSearch.focus({ preventScroll: true });
      }, 250);
    };

    document.addEventListener("bdtools:search", function (event) {
      setSearch(event.detail && event.detail.value ? event.detail.value : "", true);
    });

    document.addEventListener("bdtools:explore-guides", function () {
      els.guideLibrary.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
