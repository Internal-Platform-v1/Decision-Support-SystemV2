/* ============================================================
   GUIDE STORE — single source of truth for guide URLs
   Shared by all-guides.js, group-guides.js, guide.js,
   script.js, my-guides.js.

   Responsibilities:
   - canonicalize any guide URL to one stable form
   - read/write guideHistory, guideUsageCounts, guideFavorites
   - dedupe by canonical URL on read

   Load this BEFORE any other DSS script.
   ============================================================ */
(function () {
  "use strict";

  const LS_HISTORY = "guideHistory";
  const LS_USAGE   = "guideUsageCounts";
  const LS_FAVS    = "guideFavorites";

  /* ---------- canonicalizer ---------- */
  function canonicalGuideUrl(rawUrl, baseUrl) {
    if (!rawUrl) return "";
    let u;
    try {
      u = new URL(String(rawUrl), baseUrl || document.baseURI);
    } catch (e) {
      return String(rawUrl);
    }
    const path = u.pathname
      .split("/")
      .map(function (seg) {
        try { return encodeURIComponent(decodeURIComponent(seg)); }
        catch (e) { return seg; }
      })
      .join("/");
    return u.origin + path;
  }

  /* ---------- low-level storage ---------- */
  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (parsed == null) return fallback;
      return parsed;
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }

  /* ---------- writers ---------- */

  function pushHistory(title, rawUrl) {
    const url = canonicalGuideUrl(rawUrl);
    if (!url) return;

    let history = readJSON(LS_HISTORY, []);
    if (!Array.isArray(history)) history = [];

    history.push({
      title: title || "Untitled Guide",
      url: url,
      timestamp: Date.now()
    });
    if (history.length > 100) history.splice(0, history.length - 100);

    writeJSON(LS_HISTORY, history);
  }

  function bumpUsage(title, rawUrl) {
    const url = canonicalGuideUrl(rawUrl);
    if (!url) return;

    const usage = readJSON(LS_USAGE, {});
    const safe = usage && typeof usage === "object" && !Array.isArray(usage) ? usage : {};

    if (!safe[url]) safe[url] = { title: title || "Untitled Guide", count: 0 };
    safe[url].title = title || safe[url].title || "Untitled Guide";
    safe[url].count = (Number(safe[url].count) || 0) + 1;

    writeJSON(LS_USAGE, safe);
  }

  function trackOpen(title, rawUrl) {
    pushHistory(title, rawUrl);
    bumpUsage(title, rawUrl);
  }

  /* ---------- favorites ---------- */

  function readFavorites() {
    const favs = readJSON(LS_FAVS, {});
    return favs && typeof favs === "object" && !Array.isArray(favs) ? favs : {};
  }

  function writeFavorites(favs) {
    return writeJSON(LS_FAVS, favs || {});
  }

  function isFavorite(rawUrl) {
    const url = canonicalGuideUrl(rawUrl);
    if (!url) return false;
    return !!readFavorites()[url];
  }

  function toggleFavorite(title, rawUrl) {
    const url = canonicalGuideUrl(rawUrl);
    if (!url) return false;

    const favs = readFavorites();
    let added;

    if (favs[url]) {
      delete favs[url];
      added = false;
    } else {
      favs[url] = {
        title: title || "Untitled Guide",
        url: url,
        timestamp: Date.now()
      };
      added = true;
    }

    writeFavorites(favs);
    return added;
  }

  /* ---------- readers (dedupe by canonical URL) ---------- */

  function getHistory() {
    const raw = readJSON(LS_HISTORY, []);
    if (!Array.isArray(raw)) return [];

    const seen = new Set();
    const out = [];

    const sorted = raw
      .filter(function (h) { return h && h.url; })
      .map(function (h) {
        return {
          title: h.title || "Untitled Guide",
          url: canonicalGuideUrl(h.url),
          timestamp: Number(h.timestamp) || 0
        };
      })
      .sort(function (a, b) { return b.timestamp - a.timestamp; });

    sorted.forEach(function (h) {
      if (!h.url || seen.has(h.url)) return;
      seen.add(h.url);
      out.push(h);
    });

    return out;
  }

  function getUsage() {
    const raw = readJSON(LS_USAGE, {});
    const safe = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
    const merged = {};

    Object.keys(safe).forEach(function (url) {
      const canonical = canonicalGuideUrl(url);
      if (!canonical) return;

      const entry = safe[url] || {};
      if (!merged[canonical]) {
        merged[canonical] = {
          title: entry.title || "Untitled Guide",
          url: canonical,
          count: 0
        };
      }
      merged[canonical].count += Number(entry.count) || 0;
    });

    return merged;
  }

  function getMostUsed() {
    const usage = getUsage();
    return Object.keys(usage)
      .map(function (url) { return usage[url]; })
      .filter(function (g) { return g.url && g.title; })
      .sort(function (a, b) {
        if (b.count !== a.count) return b.count - a.count;
        return a.title.localeCompare(b.title);
      });
  }

  function getFavoriteList() {
    const favs = readFavorites();
    const merged = {};

    Object.keys(favs).forEach(function (url) {
      const canonical = canonicalGuideUrl(url);
      if (!canonical) return;

      const entry = favs[url] || {};
      const ts = Number(entry.timestamp) || 0;

      if (!merged[canonical] || merged[canonical].timestamp < ts) {
        merged[canonical] = {
          title: entry.title || "Untitled Guide",
          url: canonical,
          timestamp: ts
        };
      }
    });

    return Object.keys(merged)
      .map(function (url) { return merged[url]; })
      .filter(function (g) { return g.url && g.title; })
      .sort(function (a, b) { return b.timestamp - a.timestamp; });
  }

  /* ---------- export ---------- */
  window.GuideStore = {
    canonicalGuideUrl: canonicalGuideUrl,
    trackOpen:         trackOpen,
    pushHistory:       pushHistory,
    bumpUsage:         bumpUsage,
    isFavorite:        isFavorite,
    toggleFavorite:    toggleFavorite,
    readFavorites:     readFavorites,
    writeFavorites:    writeFavorites,
    getHistory:        getHistory,
    getUsage:          getUsage,
    getMostUsed:       getMostUsed,
    getFavoriteList:   getFavoriteList
  };
})();
