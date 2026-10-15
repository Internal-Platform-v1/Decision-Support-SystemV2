/* ============================================================
   MY GUIDES — Most Used / Recent Activity / Favorites
   Uses the same .list-row markup as the index page.
   Items are laid out in a 3-column grid by CSS.
   Driven by <body data-view="most-used|recent|favorites">
   ============================================================ */

(function () {
  "use strict";

  const LS_USAGE   = "guideUsageCounts";
  const LS_HISTORY = "guideHistory";
  const LS_FAVS    = "guideFavorites";

  const VIEW = document.body.dataset.view || "most-used";

  const META = {
    "most-used": {
      pageTitle: "Most Used Guides",
      empty:     "No usage yet — open a guide from the dashboard or a group page to start tracking."
    },
    "recent": {
      pageTitle: "Recent Activity",
      empty:     "Nothing here yet — your recently opened guides will appear here."
    },
    "favorites": {
      pageTitle: "Favorites",
      empty:     "No favorites yet — click the ☆ on any guide to save it here."
    }
  };


  /* ---------- helpers ---------- */

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (e) { return fallback; }
  }

  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function escapeAttr(v) {
    return String(v || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalize(v) {
    return String(v || "").toLowerCase()
      .replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
  }


  /* ---------- per-guide icon (mirrors all-guides.js CATALOG) ---------- */

  function guideIconFromUrl(url) {
    const u = String(url || "").toLowerCase();

    /* Billing Dispute */
    if (/debtor-update-per-bol/.test(u))         return "fa-file-invoice-dollar";
    if (/debtor-update-per-loa/.test(u))         return "fa-file-signature";
    if (/debtor-update-per-rvsl/.test(u))        return "fa-right-left";
    if (/weight-update-per-bol/.test(u))         return "fa-weight-scale";
    if (/service-level-type/.test(u))            return "fa-truck-fast";
    if (/reference-number/.test(u))              return "fa-dollar-sign";

    /* Pricing General */
    if (/fuel-guide/.test(u))                    return "fa-gas-pump";
    if (/surcharge-guide/.test(u))               return "fa-receipt";
    if (/eprt-guide/.test(u))                    return "fa-file-lines";
    if (/eprt-submission/.test(u))               return "fa-paper-plane";
    if (/checking-eprs/.test(u))                 return "fa-magnifying-glass";
    if (/base-rater/.test(u))                    return "fa-calculator";
    if (/discount-amc-guide/.test(u))            return "fa-tags";
    if (/courtesy-discount/.test(u))             return "fa-hand-holding-dollar";

    /* Surcharges */
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

    /* Account Handling */
    if (/handling-notactive-guide/.test(u))      return "fa-user-xmark";
    if (/creating-customer-account/.test(u))     return "fa-user-plus";
    if (/account-creation-steps/.test(u))        return "fa-list-check";
    if (/searching-account-guide/.test(u))       return "fa-user-magnifying-glass";
    if (/updating-pt-scacbu-guide/.test(u))      return "fa-list-check";

    /* PAUD Queue */
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

    /* Other Operational */
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


  /* ---------- category tag + color ---------- */

  function categoryFor(url) {
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


  /* ---------- data readers ---------- */

  function getMostUsed() {
    const u = readJSON(LS_USAGE, {});
    return Object.keys(u)
      .map(function (url) {
        return {
          url: url,
          title: u[url]?.title || "Untitled Guide",
          count: Number(u[url]?.count) || 0
        };
      })
      .filter(function (g) { return g.url && g.title; })
      .sort(function (a, b) {
        if (b.count !== a.count) return b.count - a.count;
        return a.title.localeCompare(b.title);
      });
  }

  function getRecent() {
    const h = readJSON(LS_HISTORY, []);
    if (!Array.isArray(h)) return [];
    const sorted = h
      .filter(function (i) { return i && i.url && i.title; })
      .sort(function (a, b) { return Number(b.timestamp || 0) - Number(a.timestamp || 0); });
    const seen = new Set();
    const out = [];
    sorted.forEach(function (i) {
      if (seen.has(i.url)) return;
      seen.add(i.url);
      out.push(i);
    });
    return out;
  }

  function getFavorites() {
    const f = readJSON(LS_FAVS, {});
    return Object.keys(f)
      .map(function (url) {
        return {
          url: url,
          title: f[url]?.title || "Untitled Guide",
          timestamp: Number(f[url]?.timestamp) || 0
        };
      })
      .filter(function (g) { return g.url && g.title; })
      .sort(function (a, b) { return b.timestamp - a.timestamp; });
  }

  function currentItems() {
    if (VIEW === "most-used") return getMostUsed();
    if (VIEW === "recent")    return getRecent();
    if (VIEW === "favorites") return getFavorites();
    return [];
  }


  /* ---------- writers ---------- */

  function trackAndOpen(url, title) {
    if (!url) return;
    const safeTitle = title || "Untitled Guide";

    const h = readJSON(LS_HISTORY, []);
    h.push({ title: safeTitle, url: url, timestamp: Date.now() });
    if (h.length > 100) h.splice(0, h.length - 100);
    writeJSON(LS_HISTORY, h);

    const u = readJSON(LS_USAGE, {});
    if (!u[url]) u[url] = { title: safeTitle, count: 0 };
    u[url].title = safeTitle;
    u[url].count = (Number(u[url].count) || 0) + 1;
    writeJSON(LS_USAGE, u);

    window.location.href = url;
  }

  function toggleFavorite(url, title) {
    if (!url) return false;
    const f = readJSON(LS_FAVS, {});
    let added;
    if (f[url]) {
      delete f[url];
      added = false;
    } else {
      f[url] = { title: title || "Untitled Guide", url: url, timestamp: Date.now() };
      added = true;
    }
    writeJSON(LS_FAVS, f);
    return added;
  }


  /* ---------- state ---------- */

  const state = { items: [], search: "" };
  const els = {};


  /* ---------- renderers ---------- */

  function renderMostUsed(item, index, favorites) {
    const cat   = categoryFor(item.url);
    const icon  = guideIconFromUrl(item.url);
    const isFav = !!favorites[item.url];

    return (
      '<div class="list-row clickable"' +
        ' data-url="'  + escapeAttr(item.url)   + '"' +
        ' data-name="' + escapeAttr(item.title) + '">' +

        '<span class="rank ' + cat.color + '" aria-hidden="true">' +
          '<i class="fa-solid ' + icon + '"></i>' +
        '</span>' +

        '<span class="row-name">' + escapeAttr(item.title) + '</span>' +

        '<span class="tag ' + (cat.color === "orange" ? "orange" : "") + '">' +
          escapeAttr(cat.tag) +
        '</span>' +

        '<button class="star' + (isFav ? " active" : "") + '"' +
          ' type="button" aria-label="Favorite"' +
          ' data-fav-url="' + escapeAttr(item.url) + '">' +
          (isFav ? "★" : "☆") +
        '</button>' +

      '</div>'
    );
  }

  function renderRecent(item) {
    const cat  = categoryFor(item.url);
    const icon = guideIconFromUrl(item.url);

    return (
      '<div class="list-row clickable"' +
        ' data-url="'  + escapeAttr(item.url)   + '"' +
        ' data-name="' + escapeAttr(item.title) + '">' +

        '<span class="recent-icon ' + cat.color + '" aria-hidden="true">' +
          '<i class="fa-solid ' + icon + '"></i>' +
        '</span>' +

        '<span class="row-name">' + escapeAttr(item.title) + '</span>' +
        '<span class="recent-time">' + escapeAttr(relativeTime(item.timestamp)) + '</span>' +
        '<span class="row-chevron">›</span>' +

      '</div>'
    );
  }

  function renderFavorites(item) {
    const cat  = categoryFor(item.url);
    const icon = guideIconFromUrl(item.url);

    return (
      '<div class="list-row clickable"' +
        ' data-url="'  + escapeAttr(item.url)   + '"' +
        ' data-name="' + escapeAttr(item.title) + '">' +

        '<span class="recent-icon ' + cat.color + '" aria-hidden="true">' +
          '<i class="fa-solid ' + icon + '"></i>' +
        '</span>' +

        '<span class="row-name">' + escapeAttr(item.title) + '</span>' +

        '<span class="tag ' + (cat.color === "orange" ? "orange" : "") + '">' +
          escapeAttr(cat.tag) +
        '</span>' +

        '<button class="star active" type="button"' +
          ' aria-label="Remove favorite"' +
          ' data-fav-url="' + escapeAttr(item.url) + '">★</button>' +

      '</div>'
    );
  }


  /* ---------- render ---------- */

  function render() {
    const favorites = readJSON(LS_FAVS, {});
    const q = normalize(state.search);

    let list = state.items;
    if (q) {
      list = list.filter(function (item) {
        return normalize(item.title).includes(q);
      });
    }

    if (els.resultsText) {
      els.resultsText.textContent = q
        ? "Showing " + list.length + " of " + state.items.length +
          " · \u201C" + state.search + "\u201D"
        : "Showing " + list.length + " guide" + (list.length === 1 ? "" : "s");
    }

    if (els.clearSearch) els.clearSearch.hidden = !q;

    if (!list.length) {
      if (els.list) els.list.innerHTML = "";
      if (els.noResults) els.noResults.hidden = false;
      if (els.noResultsCopy) {
        els.noResultsCopy.textContent = q
          ? "No matching guides."
          : META[VIEW].empty;
      }
      return;
    }

    if (els.noResults) els.noResults.hidden = true;

    if (els.list) {
      els.list.innerHTML = list.map(function (item, i) {
        if (VIEW === "most-used") return renderMostUsed(item, i, favorites);
        if (VIEW === "recent")    return renderRecent(item);
        if (VIEW === "favorites") return renderFavorites(item);
        return "";
      }).join("");
    }
  }

  function updateCounts() {
    const em = document.getElementById("count-most");
    const er = document.getElementById("count-recent");
    const ef = document.getElementById("count-fav");

    if (em) em.textContent = getMostUsed().length;
    if (er) er.textContent = getRecent().length;
    if (ef) ef.textContent = getFavorites().length;
  }


  /* ---------- init ---------- */

  function init() {
    document.title = META[VIEW].pageTitle + " | BD Tools";

    els.list          = document.getElementById("myGuidesList");
    els.resultsText   = document.getElementById("resultsText");
    els.clearSearch   = document.getElementById("clearSearch");
    els.noResults     = document.getElementById("noResults");
    els.noResultsCopy = document.getElementById("noResultsCopy");

    const titleEl = document.getElementById("libraryTitle");
    if (titleEl) titleEl.textContent = META[VIEW].pageTitle;

    state.items = currentItems();
    updateCounts();
    render();

    document.querySelectorAll(".stat-card[data-view]").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.view === VIEW);

      btn.addEventListener("click", function () {
        const target = this.dataset.view;
        if (target === VIEW) return;
        const page = {
          "most-used": "most-used-guides.html",
          "recent":    "recent-activity.html",
          "favorites": "favorites.html"
        }[target];
        if (page) window.location.href = page;
      });
    });

    const input     = document.getElementById("guideSearch");
    const searchBtn = document.getElementById("searchButton");

    if (input) {
      input.addEventListener("input", function () {
        state.search = this.value.trim();
        render();
      });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          state.search = this.value.trim();
          render();
        }
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", function () {
        if (input) {
          state.search = input.value.trim();
          render();
        }
      });
    }

    if (els.clearSearch) {
      els.clearSearch.addEventListener("click", function () {
        state.search = "";
        if (input) input.value = "";
        render();
      });
    }

    if (els.list) {
      els.list.addEventListener("click", function (event) {
        const favBtn = event.target.closest(".star[data-fav-url]");
        if (favBtn) {
          event.preventDefault();
          event.stopPropagation();
          const url  = favBtn.dataset.favUrl;
          const item = state.items.find(function (i) { return i.url === url; });
          toggleFavorite(url, item?.title);

          if (VIEW === "favorites") state.items = currentItems();
          updateCounts();
          render();
          return;
        }

        const row = event.target.closest(".list-row.clickable");
        if (row) {
          event.preventDefault();
          trackAndOpen(row.dataset.url, row.dataset.name);
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
