/* ============================================================
   MY GUIDES — shared logic for the three "View All" pages
   (Most Used / Recent Activity / Favorites)
   Driven by <body data-view="most-used|recent|favorites">
   ============================================================ */

(function () {
  "use strict";

  const LS_USAGE   = "guideUsageCounts";
  const LS_HISTORY = "guideHistory";
  const LS_FAVS    = "guideFavorites";

  const VIEW = document.body.dataset.view || "most-used";

  const TITLES = {
    "most-used": "Most Used Guides",
    "recent":    "Recent Activity",
    "favorites": "Favorites"
  };

  const EMPTY = {
    "most-used": "No usage yet — open a guide from the dashboard or a group page to start tracking.",
    "recent":    "Nothing here yet — your recently opened guides will appear here.",
    "favorites": "No favorites yet — click the ☆ on any guide to save it here."
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

  function escapeAttr(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function categoryFromUrl(url) {
    const u = String(url || "");
    if (/Billing%20Dispute|Billing Dispute/i.test(u)) return { tag: "Billing Dispute",  color: "purple" };
    if (/Pricing/i.test(u))                           return { tag: "Pricing",          color: "orange" };
    if (/Surcharge/i.test(u))                         return { tag: "Surcharges",       color: "blue"   };
    if (/Account%20Handling|Account Handling/i.test(u)) return { tag: "Account Handling", color: "green" };
    if (/PAUD/i.test(u))                              return { tag: "PAUD Queue",       color: "indigo" };
    if (/Other%20Guides|Other Guides/i.test(u))       return { tag: "Other Operational", color: "pink" };
    return { tag: "Guide", color: "purple" };
  }

  function relativeTime(ts) {
    const diff = Date.now() - Number(ts || 0);
    if (!isFinite(diff) || diff < 0) return "just now";
    const sec = Math.floor(diff / 1000);
    if (sec < 45) return "just now";
    if (sec < 90) return "1 min ago";
    const min = Math.floor(sec / 60);
    if (min < 60) return min + " mins ago";
    const hr = Math.floor(min / 60);
    if (hr < 24) return hr + " hour" + (hr === 1 ? "" : "s") + " ago";
    const day = Math.floor(hr / 24);
    if (day === 1) return "yesterday";
    if (day < 7) return day + " days ago";
    const wk = Math.floor(day / 7);
    if (wk < 5) return wk + " week" + (wk === 1 ? "" : "s") + " ago";
    return new Date(Number(ts)).toLocaleDateString();
  }


  /* ---------- data readers ---------- */

  function getMostUsed() {
    const usage = readJSON(LS_USAGE, {});
    return Object.keys(usage)
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
  }

  function getRecent() {
    const history = readJSON(LS_HISTORY, []);
    if (!Array.isArray(history)) return [];
    const sorted = history
      .filter(function (h) { return h && h.url && h.title; })
      .sort(function (a, b) { return Number(b.timestamp || 0) - Number(a.timestamp || 0); });
    const seen = new Set();
    const unique = [];
    sorted.forEach(function (item) {
      if (seen.has(item.url)) return;
      seen.add(item.url);
      unique.push(item);
    });
    return unique;
  }

  function getFavorites() {
    const favs = readJSON(LS_FAVS, {});
    return Object.keys(favs)
      .map(function (url) {
        return {
          url: url,
          title: favs[url]?.title || "Untitled Guide",
          timestamp: Number(favs[url]?.timestamp) || 0
        };
      })
      .filter(function (g) { return g.url && g.title; })
      .sort(function (a, b) { return b.timestamp - a.timestamp; });
  }


  /* ---------- writers ---------- */

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


  /* ---------- renderers ---------- */

  function emptyState() {
    return '<div class="list-row"><span class="row-name">' +
      (EMPTY[VIEW] || "Nothing to show yet.") +
      "</span></div>";
  }

  function renderMostUsed(items) {
    return items.map(function (g, i) {
      const cat = categoryFromUrl(g.url);
      return (
        '<div class="list-row clickable"' +
        ' data-name="' + escapeAttr(g.title) + '"' +
        ' data-url="'  + escapeAttr(g.url)   + '">' +
          '<span class="rank ' + cat.color + '">' +
            String(i + 1).padStart(2, "0") +
          "</span>" +
          '<span class="row-name">' + escapeAttr(g.title) + "</span>" +
          '<span class="tag ' + (cat.color === "orange" ? "orange" : "") + '">' +
            escapeAttr(cat.tag) +
          "</span>" +
          '<span class="recent-time">' +
            g.count + " open" + (g.count === 1 ? "" : "s") +
          "</span>" +
        "</div>"
      );
    }).join("");
  }

  function renderRecent(items) {
    return items.map(function (r) {
      return (
        '<div class="list-row clickable"' +
        ' data-name="' + escapeAttr(r.title) + '"' +
        ' data-url="'  + escapeAttr(r.url)   + '">' +
          '<span class="recent-icon"><span class="document-icon"></span></span>' +
          '<span class="row-name">' + escapeAttr(r.title) + "</span>" +
          '<span class="recent-time">' + escapeAttr(relativeTime(r.timestamp)) + "</span>" +
          '<span class="row-chevron">›</span>' +
        "</div>"
      );
    }).join("");
  }

  function renderFavorites(items) {
    return items.map(function (g) {
      const cat = categoryFromUrl(g.url);
      return (
        '<div class="list-row clickable"' +
        ' data-name="' + escapeAttr(g.title) + '"' +
        ' data-url="'  + escapeAttr(g.url)   + '">' +
          '<span class="rank ' + cat.color + '">★</span>' +
          '<span class="row-name">' + escapeAttr(g.title) + "</span>" +
          '<span class="tag ' + (cat.color === "orange" ? "orange" : "") + '">' +
            escapeAttr(cat.tag) +
          "</span>" +
          '<span class="recent-time">' + escapeAttr(relativeTime(g.timestamp)) + "</span>" +
          '<button class="star active" type="button" aria-label="Remove favorite"' +
            ' data-fav-url="' + escapeAttr(g.url) + '">★</button>' +
        "</div>"
      );
    }).join("");
  }


  /* ---------- init ---------- */

  function init() {
    const heading = document.getElementById("pageTitle");
    const list = document.getElementById("myGuidesList");

    if (heading) heading.textContent = TITLES[VIEW] || "Guides";
    document.title = (TITLES[VIEW] || "Guides") + " | BD Tools";

    let html;
    if (VIEW === "most-used") {
      const items = getMostUsed();
      html = items.length ? renderMostUsed(items) : emptyState();
    } else if (VIEW === "recent") {
      const items = getRecent();
      html = items.length ? renderRecent(items) : emptyState();
    } else if (VIEW === "favorites") {
      const items = getFavorites();
      html = items.length ? renderFavorites(items) : emptyState();
    } else {
      html = emptyState();
    }

    if (list) list.innerHTML = html;

    document.addEventListener("click", function (event) {

      /* Remove favorite (star) */
      const favBtn = event.target.closest(".star[data-fav-url]");
      if (favBtn) {
        event.preventDefault();
        event.stopPropagation();
        const url = favBtn.dataset.favUrl;
        const favs = readJSON(LS_FAVS, {});
        if (favs[url]) {
          delete favs[url];
          writeJSON(LS_FAVS, favs);
        }
        init();
        return;
      }

      /* Open guide */
      const row = event.target.closest(".list-row.clickable");
      if (row) {
        event.preventDefault();
        trackAndOpen(row.dataset.url, row.dataset.name);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
