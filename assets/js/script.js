/* ============================================================
   CURRENT USER NAME
   ============================================================ */

function updateDashboardUserName(profile) {
  const nameElement = document.getElementById("currentUserName");
  if (!nameElement) return;

  const displayName = profile?.displayName || window.currentUserProfile?.displayName;
  if (!displayName) return;

  const firstName = displayName.trim().split(/\s+/)[0];
  nameElement.textContent = firstName;

  if (typeof window.bdToolsUserReady === "function") {
    window.bdToolsUserReady();
  }
}

document.addEventListener("currentUserProfileLoaded", function (event) {
  updateDashboardUserName(event.detail);
});

document.addEventListener("DOMContentLoaded", function () {
  updateDashboardUserName(window.currentUserProfile);
});


/* =========================================================
   BD TOOLS — MAIN DASHBOARD JS
   ========================================================= */

"use strict";

const Store = window.GuideStore;

const TOTAL_GUIDE_COUNT = 75;
const TOTAL_TOOLS_COUNT = 6;

const LS_USAGE   = "guideUsageCounts";
const LS_HISTORY = "guideHistory";
const LS_FAVS    = "guideFavorites";


/* ---------------------------------------------------------
   Storage helpers (fallback)
   --------------------------------------------------------- */

function readJSONFallback(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : parsed;
  } catch (e) { return fallback; }
}

function writeJSONFallback(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}


/* ---------------------------------------------------------
   Per-guide icon
   --------------------------------------------------------- */

function guideIconFromUrl(url) {
  const u = String(url || "").toLowerCase();
  if (/debtor-update-per-bol/.test(u))         return "fa-file-invoice-dollar";
  if (/debtor-update-per-loa/.test(u))         return "fa-file-signature";
  if (/debtor-update-per-rvsl/.test(u))        return "fa-right-left";
  if (/weight-update-per-bol/.test(u))         return "fa-weight-scale";
  if (/service-level-type/.test(u))            return "fa-truck-fast";
  if (/reference-number/.test(u))              return "fa-dollar-sign";
  if (/fuel-guide/.test(u))                    return "fa-gas-pump";
  if (/surcharge-guide/.test(u))               return "fa-receipt";
  if (/eprt-guide/.test(u))                    return "fa-file-lines";
  if (/eprt-submission/.test(u))               return "fa-paper-plane";
  if (/checking-eprs/.test(u))                 return "fa-magnifying-glass";
  if (/base-rater/.test(u))                    return "fa-calculator";
  if (/discount-amc-guide/.test(u))            return "fa-tags";
  if (/courtesy-discount/.test(u))             return "fa-hand-holding-dollar";
  if (/high-cost-fee/.test(u))                 return "fa-dollar-sign";
  if (/peak-surcharge-fee/.test(u))            return "fa-arrow-trend-up";
  if (/california-compliance/.test(u))         return "fa-shield-halved";
  if (/zip-service-charge/.test(u))            return "fa-location-dot";
  if (/cross-border-processing-fee/.test(u))   return "fa-globe";
  if (/canadian-custom-inspection-fee/.test(u))return "fa-list-check";
  if (/canadian-surcharge-guide/.test(u))      return "fa-table-cells";
  if (/weighing-service-guide/.test(u))        return "fa-weight-scale";
  if (/nost-guide/.test(u))                    return "fa-clipboard";
  if (/sort-and-segregate-guide/.test(u))      return "fa-list";
  if (/notify-fee-guide/.test(u))              return "fa-bell";
  if (/lumper-fee-guide/.test(u))              return "fa-bag-shopping";
  if (/storage-fee-guide/.test(u))             return "fa-warehouse";
  if (/redelivery-handling-guide/.test(u))     return "fa-truck";
  if (/handling-notactive-guide/.test(u))      return "fa-user-xmark";
  if (/creating-customer-account/.test(u))     return "fa-user-plus";
  if (/account-creation-steps/.test(u))        return "fa-list-check";
  if (/searching-account-guide/.test(u))       return "fa-user-magnifying-glass";
  if (/updating-pt-scacbu-guide/.test(u))      return "fa-list-check";
  if (/region-and-ehot-queue/.test(u))         return "fa-globe";
  if (/tplo-guide/.test(u))                    return "fa-sitemap";
  if (/tphi-guide/.test(u))                    return "fa-diagram-project";
  if (/paud-tpkn-guide/.test(u))               return "fa-boxes-stacked";
  if (/crau-guide/.test(u))                    return "fa-clipboard-list";
  if (/paud-fpay-guide/.test(u))               return "fa-credit-card";
  if (/cod-guide/.test(u))                     return "fa-money-bill-transfer";
  if (/ispd-guide/.test(u))                    return "fa-user-xmark";
  if (/lmpb-guide/.test(u))                    return "fa-hand-holding-dollar";
  if (/irt1-po-number-division-guide/.test(u)) return "fa-hashtag";
  if (/irt-vsat-guide/.test(u))                return "fa-file-lines";
  if (/saf2-guide/.test(u))                    return "fa-scale-balanced";
  if (/bloa-guide/.test(u))                    return "fa-file-signature";
  if (/pat8-guide/.test(u))                    return "fa-building";
  if (/pat7-guide/.test(u))                    return "fa-clipboard-check";
  if (/pars-guide/.test(u))                    return "fa-user-check";
  if (/cort-guide/.test(u))                    return "fa-rotate";
  if (/hot-ehot-queue-guide/.test(u))          return "fa-fire";
  if (/ovc-general-guide/.test(u))             return "fa-shield-halved";
  if (/reweigh-general-guide/.test(u))         return "fa-weight-scale";
  if (/correction-code-guide/.test(u))         return "fa-wand-magic-sparkles";
  if (/fedex-direct-guide/.test(u))            return "fa-road";
  if (/class-update-guide/.test(u))            return "fa-layer-group";
  if (/rate-volume-guide/.test(u))             return "fa-chart-column";
  if (/shave-a-day-guide/.test(u))             return "fa-calendar-day";
  if (/information-validation-guide/.test(u))  return "fa-magnifying-glass-minus";
  if (/missing-docs-guide/.test(u))            return "fa-file-circle-exclamation";
  if (/keep-or-remove-payment-guide/.test(u))  return "fa-money-bill";
  if (/demand-invoice-guide/.test(u))          return "fa-file-invoice";
  if (/recycled-pro-guide/.test(u))            return "fa-recycle";
  if (/employee-discount-guide/.test(u))       return "fa-user-tag";
  if (/void-and-wo-guide/.test(u))             return "fa-file-circle-xmark";
  if (/pro-no-suffix/.test(u))                 return "fa-list-ol";
  if (/volume-application/.test(u))            return "fa-box-open";
  if (/priority-plus-guide/.test(u))           return "fa-gauge-high";
  if (/rerate-treatment-process-guide/.test(u))return "fa-rotate";
  if (/inbond-fee-guide/.test(u))              return "fa-hand-holding-dollar";
  if (/handling-fee-guide/.test(u))            return "fa-hand";
  if (/ispi-guide/.test(u))                    return "fa-arrows-rotate";
  if (/all-shorts-guide/.test(u))              return "fa-boxes-stacked";
  if (/sales-write-off-guide/.test(u))         return "fa-file-pen";
  if (/wo-process-caps-guide/.test(u))         return "fa-file-circle-xmark";
  return "fa-file-lines";
}


/* ---------------------------------------------------------
   Category tag + color
   --------------------------------------------------------- */

function categoryFromUrl(url) {
  const u = String(url || "");
  if (/Billing%20Dispute|Billing Dispute/i.test(u))   return { tag: "Billing Dispute",  color: "purple" };
  if (/Pricing/i.test(u))                             return { tag: "Pricing",          color: "orange" };
  if (/Surcharge/i.test(u))                           return { tag: "Surcharges",       color: "blue"   };
  if (/Account%20Handling|Account Handling/i.test(u)) return { tag: "Account Handling", color: "green"  };
  if (/PAUD/i.test(u))                                return { tag: "PAUD Queue",       color: "indigo" };
  if (/Other%20Guides|Other Guides/i.test(u))         return { tag: "Other Operational", color: "pink"  };
  return { tag: "Guide", color: "purple" };
}

function relativeTime(ts) {
  const diff = Date.now() - Number(ts || 0);
  if (!isFinite(diff) || diff < 0) return "just now";
  const s = Math.floor(diff / 1000);
  if (s < 45) return "just now";
  if (s < 90) return "1 min ago";
  const m = Math.floor(s / 60);
  if (m < 60) return m + " mins ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + " hour" + (h === 1 ? "" : "s") + " ago";
  const d = Math.floor(h / 24);
  if (d === 1) return "yesterday";
  if (d < 7) return d + " days ago";
  const w = Math.floor(d / 7);
  if (w < 5) return w + " week" + (w === 1 ? "" : "s") + " ago";
  return new Date(Number(ts)).toLocaleDateString();
}

function escapeAttr(value) {
  return String(value || "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* ---------------------------------------------------------
   Data reads (via GuideStore when available)
   --------------------------------------------------------- */

function getMostUsedList(limit) {
  let items;
  if (Store) items = Store.getMostUsed();
  else {
    const usage = readJSONFallback(LS_USAGE, {});
    items = Object.keys(usage).map(function (url) {
      return { url: url, title: usage[url]?.title || "Untitled Guide", count: Number(usage[url]?.count) || 0 };
    }).sort(function (a, b) { return b.count - a.count; });
  }
  return limit ? items.slice(0, limit) : items;
}

function getRecentList(limit) {
  let items;
  if (Store) items = Store.getHistory();
  else {
    const h = readJSONFallback(LS_HISTORY, []);
    items = Array.isArray(h) ? h.slice().reverse() : [];
  }
  return limit ? items.slice(0, limit) : items;
}

function getFavoriteList(limit) {
  let items;
  if (Store) items = Store.getFavoriteList();
  else {
    const f = readJSONFallback(LS_FAVS, {});
    items = Object.keys(f).map(function (url) {
      return { url: url, title: f[url]?.title || "Untitled Guide", timestamp: Number(f[url]?.timestamp) || 0 };
    });
  }
  return limit ? items.slice(0, limit) : items;
}

function getFavoritesCount() { return getFavoriteList().length; }
function getUniqueHistoryCount() { return getRecentList().length; }


/* ---------------------------------------------------------
   Stat cards
   --------------------------------------------------------- */

function updateStats() {
  const guidesEl    = document.getElementById("statGuides");
  const toolsEl     = document.getElementById("statTools");
  const recentEl    = document.getElementById("statRecent");
  const favoritesEl = document.getElementById("statFavorites");

  if (guidesEl)    guidesEl.textContent    = TOTAL_GUIDE_COUNT;
  if (toolsEl)     toolsEl.textContent     = TOTAL_TOOLS_COUNT;
  if (recentEl)    recentEl.textContent    = getUniqueHistoryCount();
  if (favoritesEl) favoritesEl.textContent = getFavoritesCount();
}


/* ---------------------------------------------------------
   Toast
   --------------------------------------------------------- */

const toast = document.getElementById("toast");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 1800);
}


/* ---------------------------------------------------------
   Panels
   --------------------------------------------------------- */

const mostUsedList  = document.getElementById("mostUsedList");
const recentList    = document.getElementById("recentList");
const favoritesList = document.getElementById("favoritesList");

function renderLists() {

  /* ---- Most Used ---- */
  if (mostUsedList) {
    const items = getMostUsedList(5);
    if (!items.length) {
      mostUsedList.innerHTML = '<div class="list-row"><span class="row-name">No usage yet — open a guide to start tracking.</span></div>';
    } else {
      mostUsedList.innerHTML = items.map(function (g) {
        const cat = categoryFromUrl(g.url);
        const icon = guideIconFromUrl(g.url);
        return (
          '<div class="list-row clickable" data-name="' + escapeAttr(g.title) + '" data-url="' + escapeAttr(g.url) + '">' +
            '<span class="rank ' + cat.color + '" aria-hidden="true"><i class="fa-solid ' + icon + '"></i></span>' +
            '<span class="row-name">' + escapeAttr(g.title) + '</span>' +
            '<span class="tag ' + (cat.color === "orange" ? "orange" : "") + '">' + escapeAttr(cat.tag) + '</span>' +
            '<button class="star" type="button" aria-label="Favorite" data-fav-url="' + escapeAttr(g.url) + '">☆</button>' +
          '</div>'
        );
      }).join("");
    }
  }

  /* ---- Recent ---- */
  if (recentList) {
    const items = getRecentList(5);
    if (!items.length) {
      recentList.innerHTML = '<div class="list-row"><span class="row-name">Nothing here yet — your recently opened guides will appear here.</span></div>';
    } else {
      recentList.innerHTML = items.map(function (r) {
        const cat = categoryFromUrl(r.url);
        const icon = guideIconFromUrl(r.url);
        return (
          '<div class="list-row clickable" data-name="' + escapeAttr(r.title) + '" data-url="' + escapeAttr(r.url) + '">' +
            '<span class="recent-icon ' + cat.color + '" aria-hidden="true"><i class="fa-solid ' + icon + '"></i></span>' +
            '<span class="row-name">' + escapeAttr(r.title) + '</span>' +
            '<span class="recent-time">' + escapeAttr(relativeTime(r.timestamp)) + '</span>' +
            '<span class="row-chevron">›</span>' +
          '</div>'
        );
      }).join("");
    }
  }

  /* ---- Favorites ---- */
  if (favoritesList) {
    const items = getFavoriteList(5);
    if (!items.length) {
      favoritesList.innerHTML = '<div class="list-row"><span class="row-name">No favorites yet — click the ☆ on any guide to save it.</span></div>';
    } else {
      favoritesList.innerHTML = items.map(function (g) {
        const cat = categoryFromUrl(g.url);
        const icon = guideIconFromUrl(g.url);
        return (
          '<div class="list-row clickable" data-name="' + escapeAttr(g.title) + '" data-url="' + escapeAttr(g.url) + '">' +
            '<span class="recent-icon ' + cat.color + '" aria-hidden="true"><i class="fa-solid ' + icon + '"></i></span>' +
            '<span class="row-name">' + escapeAttr(g.title) + '</span>' +
            '<span class="tag ' + (cat.color === "orange" ? "orange" : "") + '">' + escapeAttr(cat.tag) + '</span>' +
            '<button class="star active" type="button" aria-label="Remove favorite" data-fav-url="' + escapeAttr(g.url) + '">★</button>' +
          '</div>'
        );
      }).join("");
    }
  }

  updateStats();
}

renderLists();


/* ---------------------------------------------------------
   Track + open
   --------------------------------------------------------- */

function trackAndOpen(url, title) {
  if (!url) return;

  if (Store) {
    Store.trackOpen(title, url);
  } else {
    const h = readJSONFallback(LS_HISTORY, []);
    h.push({ title: title || "Untitled Guide", url: url, timestamp: Date.now() });
    if (h.length > 100) h.splice(0, h.length - 100);
    writeJSONFallback(LS_HISTORY, h);

    const u = readJSONFallback(LS_USAGE, {});
    if (!u[url]) u[url] = { title: title || "Untitled Guide", count: 0 };
    u[url].count = (Number(u[url].count) || 0) + 1;
    writeJSONFallback(LS_USAGE, u);
  }

  window.location.href = url;
}

function toggleFavorite(url, title) {
  if (!url) return false;

  let added;
  if (Store) {
    added = Store.toggleFavorite(title, url);
  } else {
    const favs = readJSONFallback(LS_FAVS, {});
    if (favs[url]) { delete favs[url]; added = false; }
    else { favs[url] = { title: title || "Untitled Guide", url: url, timestamp: Date.now() }; added = true; }
    writeJSONFallback(LS_FAVS, favs);
  }

  showToast(added ? "Added to Favorites" : "Removed from Favorites");
  renderLists();
  return added;
}


/* ---------------------------------------------------------
   Quick Access + View All
   --------------------------------------------------------- */

function openGuide(name) {
  const guideRoutes = {
    "Billing Dispute Guides": "guides/Billing%20Dispute%20Guides/billing-dispute-guides.html",
    "Pricing General Guides": "guides/Pricing%20Guides/pricing-guides.html",
    "Surcharges Guide":       "guides/Other%20Surcharge%20Guides/surcharge-guides.html",
    "Account Handling Guide": "guides/Account%20Handling%20Guides/account-handling-guides.html",
    "PAUD Queue's Guide":     "guides/PAUD%20Guides/paud-guides.html",
    "Other Operational Guides": "guides/Other%20Guides/other-guides.html"
  };
  const target = guideRoutes[name];
  if (target) { window.location.href = target; return; }
  showToast("Opening " + name);
}

function openGuideLibrary() { window.location.href = "all-guides.html"; }
window.openGuideLibrary = openGuideLibrary;

document.querySelectorAll(".quick-card").forEach(function (card) {
  function activate() { openGuide(card.dataset.guide); }
  card.addEventListener("click", function (event) {
    if (event.target.closest(".arrow-btn")) event.stopPropagation();
    activate();
  });
  card.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); }
  });
  const arrow = card.querySelector(".arrow-btn");
  if (arrow) arrow.addEventListener("click", function (event) { event.stopPropagation(); activate(); });
});

const VIEW_ALL_ROUTES = {
  "view-all":       "all-guides.html",
  "view-most":      "most-used-guides.html",
  "view-recent":    "recent-activity.html",
  "view-favorites": "favorites.html"
};

document.querySelectorAll("[data-action]").forEach(function (button) {
  button.addEventListener("click", function () {
    const target = VIEW_ALL_ROUTES[button.dataset.action];
    if (target) window.location.href = target;
  });
});

document.addEventListener("bdtools:explore-guides", function () { openGuideLibrary(); });


/* ---------------------------------------------------------
   Delegated click — stars + rows only (no clears on dashboard)
   --------------------------------------------------------- */

document.addEventListener("click", function (event) {

  const fav = event.target.closest(".star");
  if (fav) {
    event.preventDefault();
    event.stopPropagation();
    const row = fav.closest("[data-url]");
    const url = fav.dataset.favUrl || row?.dataset.url;
    const title = row?.dataset.name;
    toggleFavorite(url, title);
    return;
  }

  const row = event.target.closest(".list-row.clickable");
  if (row) {
    event.preventDefault();
    trackAndOpen(row.dataset.url, row.dataset.name);
  }
});


/* ---------------------------------------------------------
   Search + header events
   --------------------------------------------------------- */

function performSearch(value) {
  const q = String(value || "").trim().toLowerCase();
  if (!q) { showToast("Type a guide, tool, or topic to search"); return; }
  const pool = new Set();
  getMostUsedList().forEach(function (g) { pool.add(g.title); });
  getRecentList().forEach(function (g) { pool.add(g.title); });
  ["Billing Dispute","Pricing General","Surcharges","Account Handling","PAUD Queue","Other Operational","All Guides"]
    .forEach(function (l) { pool.add(l); });
  const matches = Array.from(pool).filter(function (i) { return i.toLowerCase().includes(q); });
  showToast(matches.length
    ? matches.length + " result" + (matches.length > 1 ? "s" : "") + " found"
    : "No matching guide found");
}
window.performSearch = performSearch;

const heroSearchBtn = document.getElementById("heroSearchBtn");
const heroSearch    = document.getElementById("heroSearch");
if (heroSearchBtn && heroSearch) {
  heroSearchBtn.addEventListener("click", function () { performSearch(heroSearch.value); });
  heroSearch.addEventListener("keydown", function (event) {
    if (event.key === "Enter") performSearch(event.target.value);
  });
}

document.addEventListener("bdtools:profile-action", function (event) {
  const detail = event.detail || {};
  const action = detail.action || "profile";
  showToast(action.charAt(0).toUpperCase() + action.slice(1) + " selected");
});
document.addEventListener("bdtools:notifications", function () { showToast("Notifications opened"); });
document.addEventListener("bdtools:case-directory", function (event) {
  const detail = event.detail || {};
  showToast((detail.label || "Case Directory") + " selected");
});
document.addEventListener("bdtools:search", function (event) {
  performSearch(event.detail ? event.detail.value : "");
});


window.addEventListener("pageshow", function () {
  if (document.getElementById("mostUsedList") ||
      document.getElementById("recentList") ||
      document.getElementById("favoritesList")) {
    renderLists();
  }
});

window.addEventListener("storage", function (event) {
  if (event.key === LS_USAGE || event.key === LS_HISTORY || event.key === LS_FAVS) {
    renderLists();
  }
});
