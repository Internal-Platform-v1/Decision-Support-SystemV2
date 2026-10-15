/* ============================================================
   CURRENT USER NAME
   ============================================================ */

function updateDashboardUserName(profile) {
  const nameElement = document.getElementById("currentUserName");
  if (!nameElement) return;

  const displayName =
    profile?.displayName || window.currentUserProfile?.displayName;

  if (displayName) {
    const firstName = displayName.trim().split(/\s+/)[0];
    nameElement.textContent = firstName;

    if (typeof window.bdToolsUserReady === "function") {
      window.bdToolsUserReady();
    }
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

const LS_USAGE   = "guideUsageCounts";
const LS_HISTORY = "guideHistory";
const LS_FAVS    = "guideFavorites";

const TOTAL_GUIDE_COUNT = 75;
const TOTAL_TOOLS_COUNT = 6;


/* ---------------------------------------------------------
   Storage helpers
   --------------------------------------------------------- */

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


/* ---------------------------------------------------------
   Category (tag + color + Font Awesome icon) from guide URL
   Icons match what the group pages / all-guides.js use.
   --------------------------------------------------------- */

function categoryFromUrl(url) {
  const u = String(url || "");

  if (/Billing%20Dispute|Billing Dispute/i.test(u))
    return { tag: "Billing Dispute", color: "purple", icon: "fa-file-invoice-dollar" };
  if (/Pricing/i.test(u))
    return { tag: "Pricing", color: "orange", icon: "fa-tags" };
  if (/Surcharge/i.test(u))
    return { tag: "Surcharges", color: "blue", icon: "fa-receipt" };
  if (/Account%20Handling|Account Handling/i.test(u))
    return { tag: "Account Handling", color: "green", icon: "fa-user-gear" };
  if (/PAUD/i.test(u))
    return { tag: "PAUD Queue", color: "indigo", icon: "fa-diagram-project" };
  if (/Other%20Guides|Other Guides/i.test(u))
    return { tag: "Other Operational", color: "pink", icon: "fa-toolbox" };

  return { tag: "Guide", color: "purple", icon: "fa-file-lines" };
}


/* ---------------------------------------------------------
   Relative time
   --------------------------------------------------------- */

function relativeTime(ts) {
  const diff = Date.now() - Number(ts || 0);
  if (!isFinite(diff) || diff < 0) return "just now";

  const sec = Math.floor(diff / 1000);
  if (sec < 45) return "just now";
  if (sec < 90) return "1 min ago";

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} mins ago`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;

  const day = Math.floor(hr / 24);
  if (day === 1) return "yesterday";
  if (day < 7) return `${day} days ago`;

  const wk = Math.floor(day / 7);
  if (wk < 5) return `${wk} week${wk === 1 ? "" : "s"} ago`;

  return new Date(Number(ts)).toLocaleDateString();
}


/* ---------------------------------------------------------
   Escaping
   --------------------------------------------------------- */

function escapeAttr(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* ---------------------------------------------------------
   Data readers
   --------------------------------------------------------- */

function getMostUsed(limit) {
  const usage = readJSON(LS_USAGE, {});
  const list = Object.keys(usage)
    .map(function (url) {
      return {
        url: url,
        title: usage[url]?.title || "Untitled Guide",
        count: Number(usage[url]?.count) || 0
      };
    })
    .filter(function (g) { return g.url && g.title; })
    .sort(function (a, b) {
      if (b.count !== a.count) return b.count - a.count;
      return a.title.localeCompare(b.title);
    });

  return limit ? list.slice(0, limit) : list;
}

function getRecentActivity(limit) {
  const history = readJSON(LS_HISTORY, []);
  if (!Array.isArray(history) || !history.length) return [];

  const sorted = history
    .filter(function (h) { return h && h.url && h.title; })
    .sort(function (a, b) {
      return Number(b.timestamp || 0) - Number(a.timestamp || 0);
    });

  const seen = new Set();
  const unique = [];
  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i];
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    unique.push(item);
    if (limit && unique.length >= limit) break;
  }
  return unique;
}

function getFavoritesList(limit) {
  const favs = readJSON(LS_FAVS, {});
  const list = Object.keys(favs)
    .map(function (url) {
      return {
        url: url,
        title: favs[url]?.title || "Untitled Guide",
        timestamp: Number(favs[url]?.timestamp) || 0
      };
    })
    .filter(function (g) { return g.url && g.title; })
    .sort(function (a, b) { return b.timestamp - a.timestamp; });

  return limit ? list.slice(0, limit) : list;
}

function getFavoritesCount() {
  return Object.keys(readJSON(LS_FAVS, {})).length;
}

function getUniqueHistoryCount() {
  const history = readJSON(LS_HISTORY, []);
  if (!Array.isArray(history)) return 0;

  const seen = new Set();
  history.forEach(function (h) {
    if (h && h.url) seen.add(h.url);
  });
  return seen.size;
}


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
  window.toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 1800);
}


/* ---------------------------------------------------------
   Panels — Most Used / Recent / Favorites
   --------------------------------------------------------- */

const mostUsedList  = document.getElementById("mostUsedList");
const recentList    = document.getElementById("recentList");
const favoritesList = document.getElementById("favoritesList");

function renderLists() {
  const favorites = readJSON(LS_FAVS, {});

  /* ---- Most Used Guides ---- */
  if (mostUsedList) {
    const items = getMostUsed(5);

    if (!items.length) {
      mostUsedList.innerHTML =
        '<div class="list-row"><span class="row-name">' +
        'No usage yet — open a guide to start tracking.' +
        "</span></div>";
    } else {
      mostUsedList.innerHTML = items.map(function (g, i) {
        const cat   = categoryFromUrl(g.url);
        const isFav = !!favorites[g.url];

        return (
          '<div class="list-row clickable"' +
          ' data-name="' + escapeAttr(g.title) + '"' +
          ' data-url="'  + escapeAttr(g.url)   + '">' +

            '<span class="rank ' + cat.color + '">' +
              String(i + 1).padStart(2, "0") +
            "</span>" +

            '<span class="row-name">' + escapeAttr(g.title) + "</span>" +

            '<span class="tag ' +
              (cat.color === "orange" ? "orange" : "") + '">' +
              escapeAttr(cat.tag) +
            "</span>" +

            '<button class="star' + (isFav ? " active" : "") + '"' +
              ' type="button"' +
              ' aria-label="Favorite ' + escapeAttr(g.title) + '"' +
              ' data-fav="' + i + '"' +
              ' data-fav-url="' + escapeAttr(g.url) + '">' +
              (isFav ? "★" : "☆") +
            "</button>" +

          "</div>"
        );
      }).join("");
    }
  }

  /* ---- Recent Activity ---- */
  if (recentList) {
    const items = getRecentActivity(5);

    if (!items.length) {
      recentList.innerHTML =
        '<div class="list-row"><span class="row-name">' +
        'Nothing here yet — your recently opened guides will appear here.' +
        "</span></div>";
    } else {
      recentList.innerHTML = items.map(function (r) {
        const cat = categoryFromUrl(r.url);

        return (
          '<div class="list-row clickable"' +
          ' data-name="' + escapeAttr(r.title) + '"' +
          ' data-url="'  + escapeAttr(r.url)   + '">' +

            '<span class="recent-icon ' + cat.color + '" aria-hidden="true">' +
              '<i class="fa-solid ' + cat.icon + '"></i>' +
            "</span>" +

            '<span class="row-name">' + escapeAttr(r.title) + "</span>" +

            '<span class="recent-time">' +
              escapeAttr(relativeTime(r.timestamp)) +
            "</span>" +

            '<span class="row-chevron">›</span>' +

          "</div>"
        );
      }).join("");
    }
  }

  /* ---- Favorites ---- */
  if (favoritesList) {
    const items = getFavoritesList(5);

    if (!items.length) {
      favoritesList.innerHTML =
        '<div class="list-row"><span class="row-name">' +
        'No favorites yet — click the ☆ on any guide to save it.' +
        "</span></div>";
    } else {
      favoritesList.innerHTML = items.map(function (g) {
        const cat = categoryFromUrl(g.url);

        return (
          '<div class="list-row clickable"' +
          ' data-name="' + escapeAttr(g.title) + '"' +
          ' data-url="'  + escapeAttr(g.url)   + '">' +

            '<span class="recent-icon ' + cat.color + '" aria-hidden="true">' +
              '<i class="fa-solid ' + cat.icon + '"></i>' +
            "</span>" +

            '<span class="row-name">' + escapeAttr(g.title) + "</span>" +

            '<span class="tag ' +
              (cat.color === "orange" ? "orange" : "") + '">' +
              escapeAttr(cat.tag) +
            "</span>" +

            '<button class="star active" type="button"' +
              ' aria-label="Remove favorite"' +
              ' data-fav-url="' + escapeAttr(g.url) + '">★</button>' +

          "</div>"
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

  const safeTitle = title || "Untitled Guide";

  const history = readJSON(LS_HISTORY, []);
  history.push({ title: safeTitle, url: url, timestamp: Date.now() });
  if (history.length > 100) history.splice(0, history.length - 100);
  writeJSON(LS_HISTORY, history);

  const usage = readJSON(LS_USAGE, {});
  if (!usage[url]) usage[url] = { title: safeTitle, count: 0 };
  usage[url].title = safeTitle;
  usage[url].count = (Number(usage[url].count) || 0) + 1;
  writeJSON(LS_USAGE, usage);

  window.location.href = url;
}


/* ---------------------------------------------------------
   Favorite toggle
   --------------------------------------------------------- */

function toggleFavorite(url, title) {
  if (!url) return false;

  const favs = readJSON(LS_FAVS, {});
  let added;

  if (favs[url]) {
    delete favs[url];
    added = false;
    showToast("Removed from Favorites");
  } else {
    favs[url] = {
      title: title || "Untitled Guide",
      url: url,
      timestamp: Date.now()
    };
    added = true;
    showToast("Added to Favorites");
  }

  writeJSON(LS_FAVS, favs);
  renderLists();
  return added;
}


/* ---------------------------------------------------------
   Quick Access cards
   --------------------------------------------------------- */

function openGuide(name) {
  const guideRoutes = {
    "Billing Dispute Guides":
      "guides/Billing%20Dispute%20Guides/billing-dispute-guides.html",
    "Pricing General Guides":
      "guides/Pricing%20Guides/pricing-guides.html",
    "Surcharges Guide":
      "guides/Other%20Surcharge%20Guides/surcharge-guides.html",
    "Account Handling Guide":
      "guides/Account%20Handling%20Guides/account-handling-guides.html",
    "PAUD Queue's Guide":
      "guides/PAUD%20Guides/paud-guides.html",
    "Other Operational Guides":
      "guides/Other%20Guides/other-guides.html"
  };

  const target = guideRoutes[name];
  if (target) { window.location.href = target; return; }

  showToast("Opening " + name);
  console.log("Guide selected:", name);
}

function openGuideLibrary() {
  window.location.href = "all-guides.html";
}
window.openGuideLibrary = openGuideLibrary;


document.querySelectorAll(".quick-card").forEach(function (card) {
  function activate() { openGuide(card.dataset.guide); }

  card.addEventListener("click", function (event) {
    if (event.target.closest(".arrow-btn")) event.stopPropagation();
    activate();
  });

  card.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  });

  const arrow = card.querySelector(".arrow-btn");
  if (arrow) {
    arrow.addEventListener("click", function (event) {
      event.stopPropagation();
      activate();
    });
  }
});


/* ---------------------------------------------------------
   View All / panel actions
   --------------------------------------------------------- */

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

document.addEventListener("bdtools:explore-guides", function () {
  openGuideLibrary();
});


/* ---------------------------------------------------------
   Delegated click — rows + favorites
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
   Search
   --------------------------------------------------------- */

function performSearch(value) {
  const q = String(value || "").trim().toLowerCase();

  if (!q) {
    showToast("Type a guide, tool, or topic to search");
    return;
  }

  const usage = readJSON(LS_USAGE, {});
  const history = readJSON(LS_HISTORY, []);
  const pool = new Set();

  Object.keys(usage).forEach(function (u) {
    if (usage[u]?.title) pool.add(usage[u].title);
  });
  history.forEach(function (h) {
    if (h?.title) pool.add(h.title);
  });
  [
    "Billing Dispute", "Pricing General", "Surcharges",
    "Account Handling", "PAUD Queue", "Other Operational", "All Guides"
  ].forEach(function (l) { pool.add(l); });

  const matches = Array.from(pool).filter(function (item) {
    return item.toLowerCase().includes(q);
  });

  showToast(
    matches.length
      ? matches.length + " result" + (matches.length > 1 ? "s" : "") + " found"
      : "No matching guide found"
  );

  console.log("Search:", q, matches);
}
window.performSearch = performSearch;

const heroSearchBtn = document.getElementById("heroSearchBtn");
const heroSearch    = document.getElementById("heroSearch");

if (heroSearchBtn && heroSearch) {
  heroSearchBtn.addEventListener("click", function () {
    performSearch(heroSearch.value);
  });
  heroSearch.addEventListener("keydown", function (event) {
    if (event.key === "Enter") performSearch(event.target.value);
  });
}


/* ---------------------------------------------------------
   Shared header events
   --------------------------------------------------------- */

document.addEventListener("bdtools:navigation", function (event) {
  const detail = event.detail || {};
  console.log("Navigation:", detail.label || "Navigation", detail);
});

document.addEventListener("bdtools:profile-action", function (event) {
  const detail = event.detail || {};
  const action = detail.action || "profile";
  showToast(action.charAt(0).toUpperCase() + action.slice(1) + " selected");
});

document.addEventListener("bdtools:notifications", function () {
  showToast("Notifications opened");
});

document.addEventListener("bdtools:case-directory", function (event) {
  const detail = event.detail || {};
  showToast((detail.label || "Case Directory") + " selected");
});

document.addEventListener("bdtools:search", function (event) {
  performSearch(event.detail ? event.detail.value : "");
});


/* ---------------------------------------------------------
   Cross-tab sync
   --------------------------------------------------------- */

window.addEventListener("storage", function (event) {
  if (
    event.key === LS_USAGE ||
    event.key === LS_HISTORY ||
    event.key === LS_FAVS
  ) {
    renderLists();
  }
});
