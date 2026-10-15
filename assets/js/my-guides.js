/* ============================================================
   MY GUIDES — Most Used / Recent Activity / Favorites
   Renders into the same .guide-card structure as all-guides.js
   so the three pages visually match the All Guides page.
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
      title:     "Most Used Guides",
      noResults: "Open a guide from the dashboard or a group page to start tracking."
    },
    "recent": {
      title:     "Recent Activity",
      noResults: "Nothing here yet — your recently opened guides will appear here."
    },
    "favorites": {
      title:     "Favorites",
      noResults: "No favorites yet — click the ☆ on any guide to save it here."
    }
  };

  const CATEGORY = {
    billing:   { label: "Billing Dispute",   group: "billing",   icon: "fa-file-invoice-dollar" },
    pricing:   { label: "Pricing General",   group: "pricing",   icon: "fa-tags"                },
    surcharge: { label: "Surcharges",        group: "surcharge", icon: "fa-receipt"             },
    account:   { label: "Account Handling",  group: "account",   icon: "fa-user-gear"           },
    paud:      { label: "PAUD Queue",        group: "paud",      icon: "fa-diagram-project"     },
    other:     { label: "Other Operational", group: "other",     icon: "fa-toolbox"             }
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

  function escapeHtml(v) {
    return String(v || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeText(v) {
    return String(v || "").toLowerCase()
      .replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
  }

  function categoryFor(url) {
    const u = String(url || "");
    if (/Billing%20Dispute|Billing Dispute/i.test(u))     return CATEGORY.billing;
    if (/Pricing/i.test(u))                               return CATEGORY.pricing;
    if (/Surcharge/i.test(u))                             return CATEGORY.surcharge;
    if (/Account%20Handling|Account Handling/i.test(u))   return CATEGORY.account;
    if (/PAUD/i.test(u))                                  return CATEGORY.paud;
    if (/Other%20Guides|Other Guides/i.test(u))           return CATEGORY.other;
    return CATEGORY.billing;
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

  const state = {
    items: [],
    search: "",
    sortAZ: true
  };

  const els = {};


  /* ---------- render ---------- */

  function renderCard(item, favorites) {
    const cat   = categoryFor(item.url);
    const isFav = !!favorites[item.url];

    let description;
    if (VIEW === "most-used") {
      description = "Opened " + item.count + " time" + (item.count === 1 ? "" : "s");
    } else if (VIEW === "recent") {
      description = "Opened " + relativeTime(item.timestamp);
    } else {
      description = "Saved " + relativeTime(item.timestamp);
    }

    return (
      '<article class="guide-card group-' + cat.group + '"' +
        ' data-id="' + escapeHtml(item.url) + '"' +
        ' data-search="' + escapeHtml(normalizeText(item.title + " " + cat.label)) + '"' +
        ' tabindex="0" aria-label="' + escapeHtml(item.title) + '">' +

        '<button class="favorite-button ' + (isFav ? "active" : "") + '"' +
          ' type="button" data-favorite="' + escapeHtml(item.url) + '"' +
          ' aria-label="' + (isFav ? "Remove from" : "Add to") + ' favorites">' +
          (isFav ? "★" : "☆") +
        '</button>' +

        '<div class="guide-top">' +
          '<span class="guide-icon" aria-hidden="true">' +
            '<i class="fa-solid ' + cat.icon + '"></i>' +
          '</span>' +
          '<span class="guide-group">' + escapeHtml(cat.label) + '</span>' +
        '</div>' +

        '<h3>' + escapeHtml(item.title) + '</h3>' +
        '<p class="description">' + escapeHtml(description) + '</p>' +

        '<div class="guide-footer">' +
          '<span class="guide-badge">' +
            '<i class="fa-solid ' + cat.icon + '"></i>' + escapeHtml(cat.label) +
          '</span>' +
          '<button class="open-guide" type="button"' +
            ' data-open-guide="' + escapeHtml(item.url) + '">' +
            'Open <span>→</span>' +
          '</button>' +
        '</div>' +

      '</article>'
    );
  }

  function filtered() {
    let list = state.items.slice();

    if (state.search) {
      const q = normalizeText(state.search);
      list = list.filter(function (item) {
        return normalizeText(item.title).includes(q);
      });
    }

    list.sort(function (a, b) {
      const r = a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
      return state.sortAZ ? r : -r;
    });

    return list;
  }

  function render() {
    const favorites = readJSON(LS_FAVS, {});
    const list = filtered();
    const total = state.items.length;

    els.guideGrid.innerHTML = list.map(function (item) {
      return renderCard(item, favorites);
    }).join("");

    if (state.search) {
      els.resultsText.textContent =
        "Showing " + list.length + " of " + total +
        " · Search: \u201C" + state.search + "\u201D";
    } else {
      els.resultsText.textContent =
        "Showing " + total + " guide" + (total === 1 ? "" : "s");
    }

    els.noResults.hidden = list.length !== 0;
    if (list.length === 0 && els.noResultsCopy) {
      els.noResultsCopy.textContent = META[VIEW].noResults;
    }
    els.clearSearch.hidden = !state.search;
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
    document.title = META[VIEW].title + " | BD Tools";

    els.guideGrid      = document.getElementById("guideGrid");
    els.resultsText    = document.getElementById("resultsText");
    els.clearSearch    = document.getElementById("clearSearch");
    els.sortButton     = document.getElementById("sortButton");
    els.noResults      = document.getElementById("noResults");
    els.noResultsCopy  = document.getElementById("noResultsCopy");

    state.items = currentItems();
    updateCounts();
    render();

    /* Highlight the current view's card */
    document.querySelectorAll(".guide-filter[data-view]").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.view === VIEW);
    });

    /* Navigate between views */
    document.querySelectorAll(".guide-filter[data-view]").forEach(function (btn) {
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

    /* Search */
    const input = document.getElementById("guideSearch");
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

    if (els.sortButton) {
      els.sortButton.addEventListener("click", function () {
        state.sortAZ = !state.sortAZ;
        this.innerHTML = (state.sortAZ ? "Sort A–Z" : "Sort Z–A") + ' <span>↕</span>';
        render();
      });
    }

    /* Grid clicks */
    els.guideGrid.addEventListener("click", function (event) {

      const favBtn = event.target.closest("[data-favorite]");
      if (favBtn) {
        event.preventDefault();
        event.stopPropagation();
        const url = favBtn.dataset.favorite;
        const item = state.items.find(function (i) { return i.url === url; });
        toggleFavorite(url, item?.title);

        if (VIEW === "favorites") {
          state.items = currentItems();
        }
        updateCounts();
        render();
        return;
      }

      const openBtn = event.target.closest("[data-open-guide]");
      if (openBtn) {
        event.preventDefault();
        event.stopPropagation();
        const url = openBtn.dataset.openGuide;
        const item = state.items.find(function (i) { return i.url === url; });
        trackAndOpen(url, item?.title);
        return;
      }

      const card = event.target.closest(".guide-card");
      if (card) {
        const url = card.dataset.id;
        const item = state.items.find(function (i) { return i.url === url; });
        trackAndOpen(url, item?.title);
      }
    });

    els.guideGrid.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest(".guide-card");
      if (!card || event.target.closest("button")) return;
      event.preventDefault();
      const url = card.dataset.id;
      const item = state.items.find(function (i) { return i.url === url; });
      trackAndOpen(url, item?.title);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
