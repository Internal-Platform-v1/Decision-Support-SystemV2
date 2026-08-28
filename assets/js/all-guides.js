/* ============================================================
   DSS V2 — ALL GUIDES
   Static website implementation.

   Uses the existing GUIDE_REGISTRY and keeps the current DSS
   localStorage history / usage / favorites behavior.
   No JSON file. No database.
   ============================================================ */
(function(){
  "use strict";

  const GROUPS = {
    all:{label:"All Guides",icon:"fa-layer-group"},
    billing:{label:"Billing Dispute",icon:"fa-file-invoice-dollar"},
    pricing:{label:"Pricing General",icon:"fa-tags"},
    surcharge:{label:"Surcharges",icon:"fa-receipt"},
    account:{label:"Account Handling",icon:"fa-user-gear"},
    paud:{label:"PAUD Queue",icon:"fa-diagram-project"},
    other:{label:"Other Operational",icon:"fa-toolbox"}
  };

  const GROUP_ROUTES = {
    billing:"guides/Billing%20Dispute%20Guides/",
    pricing:"guides/Pricing%20Guides/",
    surcharge:"guides/Other%20Surcharge%20Guides/",
    account:"guides/Account%20Handling%20Guides/",
    paud:"guides/PAUD%20Guides/",
    other:"guides/Other%20Guides/"
  };

  /* Exact routes for the current static folder structure. */
  const ROUTE_OVERRIDES = {
    "BD — General Guide":"guides/Billing%20Dispute%20Guides/BD%20GENERAL%20GUIDE.html",
    "LOA — Rebill Guide":"guides/Billing%20Dispute%20Guides/Rebill%20per%20LOA%20General%20Guide.html",
    "RVSL — Debtor Update Guide":"guides/Billing%20Dispute%20Guides/rvsl-guide.html",
    "Weight Update per BOL Guide":"guides/Billing%20Dispute%20Guides/weight-update-per-bol-guide.html",
    "Service Level/Type Guide":"guides/Billing%20Dispute%20Guides/service-level-type-guide.html",
    "Reference Number Guide":"guides/Billing%20Dispute%20Guides/reference-number-guide.html",

    "Fuel Guide":"guides/Pricing%20Guides/pricing-guides-list/fuel-guide.html",
    "Surcharge Pricing Guide":"guides/Pricing%20Guides/pricing-guides-list/surcharge-guide.html",
    "ePRT Guide":"guides/Pricing%20Guides/pricing-guides-list/eprt-guide.html",
    "ePRT Submission Guide":"guides/Pricing%20Guides/pricing-guides-list/eprt-submission.html",
    "Checking EPRS Guide":"guides/Pricing%20Guides/pricing-guides-list/checking-eprs.html",
    "Base Rater Guide":"guides/Pricing%20Guides/pricing-guides-list/base-rater.html",
    "Discount AMC Guide":"guides/Pricing%20Guides/pricing-guides-list/discount-amc-guide.html",

    "California Compliance Guide":"guides/Other%20Surcharge%20Guides/other-surcharges/california-compliance.html",
    "Canadian Custom Inspection Fee Guide":"guides/Other%20Surcharge%20Guides/other-surcharges/canadian-custom-inspection-fee.html",
    "Canadian Surcharge Guide":"guides/Other%20Surcharge%20Guides/other-surcharges/canadian-surcharge-guide.html",
    "Courtesy Discount Guide":"guides/Other%20Surcharge%20Guides/other-surcharges/courtesy-discount.html",
    "Cross Border Processing Fee Guide":"guides/Other%20Surcharge%20Guides/other-surcharges/cross-border-processing-fee.html",
    "High Cost Fee Guide":"guides/Other%20Surcharge%20Guides/other-surcharges/high-cost-fee.html",
    "NOST Guide":"guides/Other%20Surcharge%20Guides/other-surcharges/nost-guide.html",
    "Peak Surcharge Fee Guide":"guides/Other%20Surcharge%20Guides/other-surcharges/peak-surcharge-fee.html",
    "Weighing Service Guide":"guides/Other%20Surcharge%20Guides/other-surcharges/weighing-service-guide.html",
    "ZIP Service Charge Guide":"guides/Other%20Surcharge%20Guides/other-surcharges/zip-service-charge.html",
    "Sort & Segregate Guide":"guides/Other%20Surcharge%20Guides/sort-and-segregate-guide.html",
    "Notify Fee Guide":"guides/Other%20Surcharge%20Guides/notify-fee-guide.html",
    "Lumper Fee Guide":"guides/Other%20Surcharge%20Guides/other-surcharges/lumper-fee-guide.html",
    "Storage Fee Guide":"guides/Other%20Surcharge%20Guides/other-surcharges/storage-fee-guide.html",
    "Redelivery Handling Guide":"guides/Other%20Surcharge%20Guides/other-surcharges/redelivery-handling-guide.html",

    "Account Creation Steps":"guides/Account%20Handling%20Guides/account-handling-guides-list/account-creation-steps.html",
    "Creating Customer Account":"guides/Account%20Handling%20Guides/account-handling-guides-list/creating-customer-account.html",
    "Handling Not Active Account Guide":"guides/Account%20Handling%20Guides/account-handling-guides-list/handling-notactive-guide.html",
    "Searching Account Guide":"guides/Account%20Handling%20Guides/account-handling-guides-list/searching-account-guide.html",
    "Updating PT / SCACBU Guide":"guides/Account%20Handling%20Guides/account-handling-guides-list/updating-pt-scacbu-guide.html",

    "Regions and EHOT Queue Guide":"guides/PAUD%20Guides/region-and-ehot-queue.html",
    "TPLO Guide":"guides/PAUD%20Guides/tplo-guide.html",
    "TPHI Guide":"guides/PAUD%20Guides/tphi-guide.html",
    "PAUD / TPKN Guide":"guides/PAUD%20Guides/paud-tpkn-guide.html",
    "CRAU — Request Decision Guide":"guides/PAUD%20Guides/crau-guide.html",
    "PAUD-FPAY Guide":"guides/PAUD%20Guides/paud-fpay-guide.html",
    "COD (Collect on Delivery) Guide":"guides/PAUD%20Guides/cod-guide.html",
    "Invalid Consignee/Shipper Account (ISPD)":"guides/PAUD%20Guides/ispd-guide.html",
    "LMPB (Lumper Fee) Guide":"guides/PAUD%20Guides/lmpb-guide.html",
    "IRT1–PO Number & Division Validation":"guides/PAUD%20Guides/irt1-po-number-division-guide.html",
    "IRT/VSAT – Queue Guide":"guides/PAUD%20Guides/irt-vsat-guide.html",
    "SAF2 Guide – NMFC, Reweigh & Weight Validation":"guides/PAUD%20Guides/saf2-guide.html",
    "BLOA Guide – Accessorial & Terms Validation":"guides/PAUD%20Guides/bloa-guide.html",
    "PAT8 – Multi-Company Queue Guide":"guides/PAUD%20Guides/pat8-guide.html",
    "PARS – Parker Hannifin Queue Guide":"guides/PAUD%20Guides/pars-guide.html",
    "CORT – Reconsignment Guide":"guides/PAUD%20Guides/cort-guide.html",
    "HOT – EHOT Queue Requests":"guides/PAUD%20Guides/hot-ehot-queue-guide.html"
  };

  /* Current V2 Other Operational cards shown in the supplied screenshots. */
  const EXTRA_GUIDES = [
    ["OVC — General Guideline","OVC GENERAL GUIDE.html","Official OVC guideline for handling customer claims and disputes.","other","fa-shield-halved"],
    ["Reweigh — General Guide","Reweigh General Guide.html","Decision guide for reweigh disputes and corrections.","other","fa-weight-scale"],
    ["Correction Code Guide","Correction Code Guide.html","Decision tree to determine the correct CORR CODE.","other","fa-wand-magic-sparkles"],
    ["FedEx Direct Guide","FedEx Direct Guide.html","Decision tree for FedEx Direct disputes and validation.","other","fa-road"],
    ["Class Update Guide","class-update-guide.html","Decision tree for handling Class Update requests.","other","fa-layer-group"],
    ["Rate & Volume Quote Guide","rate-volume-guide.html","Decision tree for validating LTL and Volume Quotes.","other","fa-chart-column"],
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
    ["All Shorts Guide","all-shorts-guide.html","Handle All Short and Partial Short disputes using shipment history and supporting documentation.","other","fa-boxes-stacked"],
    ["Sales Write-Off Guide","sales-write-off-guide.html","Review Sales Write-Off requests, debtor eligibility, approval thresholds, and processing.","other","fa-pen-to-square"],
    ["Write-off in CAPS — Step by Step Procedure","wo-process-caps-guide.html","Step-by-step CAPS write-off workflow including PRO entry, reason codes, comments, responses, and closure.","other","fa-file-circle-xmark"]
  ];

  const GROUP_BY_REGISTRY_CATEGORY = {
    billing:"billing",pricing:"pricing",surcharge:"surcharge",account:"account",
    service:"other",claims:"other",rebill:"billing",reweigh:"other",correction:"other"
  };

  const els={};
  let allGuides=[];
  let activeGroup="all";
  let searchTerm="";
  let sortAZ=true;

  function $(id){return document.getElementById(id)}

  function normalizeText(value){
    return String(value||"").toLowerCase().replace(/[–—]/g,"-").replace(/\s+/g," ").trim();
  }

  function escapeHtml(value){
    return String(value||"")
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
  }

  function getHistory(){try{return JSON.parse(localStorage.getItem("guideHistory"))||[]}catch(e){return[]}}
  function saveHistory(v){try{localStorage.setItem("guideHistory",JSON.stringify(v))}catch(e){}}
  function getUsage(){try{return JSON.parse(localStorage.getItem("guideUsageCounts"))||{}}catch(e){return{}}}
  function saveUsage(v){try{localStorage.setItem("guideUsageCounts",JSON.stringify(v))}catch(e){}}
  function getFavorites(){try{return JSON.parse(localStorage.getItem("guideFavorites"))||{}}catch(e){return{}}}
  function saveFavorites(v){try{localStorage.setItem("guideFavorites",JSON.stringify(v))}catch(e){}}

  function trackGuide(guide){
    const history=getHistory();
    history.push({title:guide.title,url:guide.url,timestamp:Date.now()});
    if(history.length>100) history.splice(0,history.length-100);
    saveHistory(history);

    const usage=getUsage();
    if(!usage[guide.url]) usage[guide.url]={title:guide.title,count:0};
    usage[guide.url].title=guide.title;
    usage[guide.url].count+=1;
    saveUsage(usage);
  }

  function inferGroup(item){
    if(item.__group && GROUPS[item.__group]) return item.__group;
    if(item.category && GROUP_BY_REGISTRY_CATEGORY[item.category]) return GROUP_BY_REGISTRY_CATEGORY[item.category];

    const t=normalizeText(item.title),u=normalizeText(item.url);
    if(/paud|tplo|tphi|tpkn|crau|pat8|pars|cort|ehot|irt1|irt\/vsat|saf2|bloa/.test(t)||u.includes("paud")) return "paud";
    if(t.includes("surcharge") || /high cost|peak|weighing|storage|redelivery|notify|lumper|cross.?border|canadian/.test(t) || u.includes("other-surcharge")) return "surcharge";
    if(/account|scac|inactive|customer's account/.test(t)||u.includes("account-handling")) return "account";
    if(/pricing|fuel|eprt|rater|volume quote|discount|courtesy/.test(t)||u.includes("pricing-guides")) return "pricing";
    if(/debtor|billing|payment|invoice|write.?off|rerate|reference number/.test(t)) return "billing";
    return "other";
  }

  function resolveUrl(item,group){
    if(ROUTE_OVERRIDES[item.title]) return ROUTE_OVERRIDES[item.title];
    let url=String(item.url||"").trim();
    if(!url) return "";
    if(/^https?:\/\//i.test(url)||url.startsWith("/")||url.startsWith("guides/")) return url;
    if(group==="other") return url;
    return GROUP_ROUTES[group]+url;
  }

  function makeGuide(raw){
    const group=inferGroup(raw);
    return {
      id:raw.id||normalizeText(raw.title||raw.name).replace(/[^a-z0-9]+/g,"-"),
      title:raw.title||raw.name||"Untitled Guide",
      description:raw.description||"Use this Decision Support System guide to review the case and determine the correct workflow.",
      badge:raw.badge||GROUPS[group].label,
      icon:raw.icon||GROUPS[group].icon,
      group,
      url:resolveUrl(raw,group),
      keywords:Array.isArray(raw.keywords)?raw.keywords:[]
    };
  }

  function buildGuides(){
    const registry=Array.isArray(window.GUIDE_REGISTRY)?window.GUIDE_REGISTRY:[];
    const registryGuides=registry.map(makeGuide);
    const extras=EXTRA_GUIDES.map(function(r){
      return makeGuide({title:r[0],url:r[1],description:r[2],__group:r[3],icon:r[4],badge:GROUPS[r[3]].label});
    });

    const result=[];
    const seen=new Set();
    extras.concat(registryGuides).forEach(function(g){
      const key=normalizeText(g.title).replace(/\bguide(s)?\b/g,"").replace(/\bguideline(s)?\b/g,"").replace(/[^a-z0-9]+/g," ").trim();
      if(!key||seen.has(key)) return;
      seen.add(key); result.push(g);
    });
    return result;
  }

  function matches(guide){
    if(!searchTerm) return true;
    return normalizeText([guide.title,guide.description,guide.badge,guide.group].concat(guide.keywords).join(" ")).includes(searchTerm);
  }

  function visibleGuides(){
    const list=allGuides.filter(function(g){return (activeGroup==="all"||g.group===activeGroup)&&matches(g)});
    list.sort(function(a,b){
      const n=a.title.localeCompare(b.title,undefined,{sensitivity:"base"});
      return sortAZ?n:-n;
    });
    return list;
  }

  function showToast(message){
    if(!els.toast) return;
    els.toast.textContent=message;
    els.toast.classList.add("show");
    clearTimeout(window.__allGuidesToast);
    window.__allGuidesToast=setTimeout(function(){els.toast.classList.remove("show")},1800);
  }

  function toggleFavorite(id){
    const favs=getFavorites(),guide=allGuides.find(g=>g.id===id);
    if(!guide) return;
    if(favs[id]){delete favs[id];showToast("Removed from Favorites")}
    else{favs[id]={title:guide.title,url:guide.url,timestamp:Date.now()};showToast("Added to Favorites")}
    saveFavorites(favs);render();
  }

  function openGuide(guide){
    if(!guide||!guide.url){showToast("This guide does not have a valid route yet.");return}
    trackGuide(guide);
    window.location.href=guide.url;
  }

  function render(){
    const list=visibleGuides(),favs=getFavorites();
    els.guideGrid.innerHTML=list.map(function(g){
      const favorite=!!favs[g.id];
      return `
        <article class="guide-card group-${escapeHtml(g.group)}" data-id="${escapeHtml(g.id)}" tabindex="0" aria-label="${escapeHtml(g.title)}">
          <button class="favorite-button ${favorite?"active":""}" type="button" data-favorite="${escapeHtml(g.id)}" aria-label="${favorite?"Remove from":"Add to"} favorites: ${escapeHtml(g.title)}">${favorite?"★":"☆"}</button>
          <div class="guide-top">
            <span class="guide-icon"><i class="fa-solid ${escapeHtml(g.icon)}"></i></span>
            <span class="guide-group">${escapeHtml(GROUPS[g.group].label)}</span>
          </div>
          <h3>${escapeHtml(g.title)}</h3>
          <p class="description">${escapeHtml(g.description)}</p>
          <div class="guide-footer">
            <span class="guide-badge"><i class="fa-solid ${escapeHtml(g.icon)}"></i>${escapeHtml(g.badge)}</span>
            <button class="open-guide" type="button" data-open-guide="${escapeHtml(g.id)}">Open <span>→</span></button>
          </div>
        </article>`;
    }).join("");

    const total=allGuides.length,count=list.length;
    els.resultsText.textContent=searchTerm
      ? `Showing ${count} of ${total} guides · Search: “${searchTerm}”`
      : activeGroup!=="all"
        ? `Showing ${count} ${GROUPS[activeGroup].label.toLowerCase()} guides`
        : `Showing all ${total} guides`;

    els.libraryTitle.textContent=activeGroup==="all"?"All Guides":GROUPS[activeGroup].label+" Guides";
    els.activeFilterPill.hidden=activeGroup==="all";
    els.activeFilterName.textContent=GROUPS[activeGroup].label;
    els.noResults.hidden=list.length!==0;
    els.clearSearch.hidden=!searchTerm;

    document.querySelectorAll(".guide-filter").forEach(function(btn){
      btn.classList.toggle("active",btn.dataset.group===activeGroup);
    });
  }

  function setSearch(value,scroll){
    searchTerm=normalizeText(value);
    els.guideSearch.value=value||"";
    render();
    if(scroll) els.guideLibrary.scrollIntoView({behavior:"smooth",block:"start"});
  }

  function setGroup(group){
    activeGroup=GROUPS[group]?group:"all";
    render();
    els.guideLibrary.scrollIntoView({behavior:"smooth",block:"start"});
  }

  function init(){
    els.guideSearch=$("guideSearch");
    els.searchButton=$("searchButton");
    els.clearSearch=$("clearSearch");
    els.sortButton=$("sortButton");
    els.guideGrid=$("guideGrid");
    els.guideLibrary=$("guideLibrary");
    els.resultsText=$("resultsText");
    els.libraryTitle=$("libraryTitle");
    els.activeFilterPill=$("activeFilterPill");
    els.activeFilterName=$("activeFilterName");
    els.clearFilter=$("clearFilter");
    els.noResults=$("noResults");
    els.resetSearch=$("resetSearch");
    els.toast=$("toast");

    allGuides=buildGuides();

    Object.keys(GROUPS).forEach(function(group){
      const el=$("count-"+group);
      if(el) el.textContent=group==="all"?allGuides.length:allGuides.filter(g=>g.group===group).length;
    });

    document.querySelectorAll(".guide-filter").forEach(function(btn){
      btn.addEventListener("click",function(){setGroup(btn.dataset.group)});
    });

    els.guideSearch.addEventListener("input",function(){setSearch(this.value,false)});
    els.guideSearch.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();setSearch(this.value,true)}});
    els.searchButton.addEventListener("click",function(){setSearch(els.guideSearch.value,true)});
    els.clearSearch.addEventListener("click",function(){setSearch("",false);els.guideSearch.focus()});
    els.clearFilter.addEventListener("click",function(){setGroup("all")});
    els.resetSearch.addEventListener("click",function(){activeGroup="all";setSearch("",true);window.scrollTo({top:0,behavior:"smooth"})});

    els.sortButton.addEventListener("click",function(){
      sortAZ=!sortAZ;
      this.innerHTML=sortAZ?"Sort A–Z <span>↕</span>":"Sort Z–A <span>↕</span>";
      render();
    });

    els.guideGrid.addEventListener("click",function(e){
      const fav=e.target.closest("[data-favorite]");
      if(fav){e.preventDefault();e.stopPropagation();toggleFavorite(fav.dataset.favorite);return}
      const open=e.target.closest("[data-open-guide]");
      if(open){e.preventDefault();e.stopPropagation();openGuide(allGuides.find(g=>g.id===open.dataset.openGuide));return}
      const card=e.target.closest(".guide-card");
      if(card) openGuide(allGuides.find(g=>g.id===card.dataset.id));
    });

    els.guideGrid.addEventListener("keydown",function(e){
      if(e.key!=="Enter"&&e.key!==" ") return;
      const card=e.target.closest(".guide-card");
      if(!card||e.target.closest("button")) return;
      e.preventDefault();
      openGuide(allGuides.find(g=>g.id===card.dataset.id));
    });

    /* Shared header global search uses the same search function. */
    window.performSearch=function(value){setSearch(value||"",true);setTimeout(()=>els.guideSearch.focus({preventScroll:true}),250)};
    document.addEventListener("bdtools:search",function(e){setSearch(e.detail&&e.detail.value?e.detail.value:"",true)});
    document.addEventListener("bdtools:explore-guides",function(){els.guideLibrary.scrollIntoView({behavior:"smooth",block:"start"})});

    render();
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
  else init();
})();
