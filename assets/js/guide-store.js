/* ============================================================
   GUIDE STORE  —  shim over UserGuideStore (Firestore-backed)
   Preserves ALL original exports:
     canonicalGuideUrl, trackOpen, pushHistory, bumpUsage,
     isFavorite, toggleFavorite, readFavorites, writeFavorites,
     getHistory, getUsage, getMostUsed, getFavoriteList

   When UserGuideStore is active (signed-in employee + Firestore
   loaded), all reads and writes go through it. Otherwise the
   original localStorage implementation is used verbatim.
   ============================================================ */
(function () {
  "use strict";

  const LS_HISTORY = "guideHistory";
  const LS_USAGE   = "guideUsageCounts";
  const LS_FAVS    = "guideFavorites";

  /* ---------- canonicalizer (unchanged) ---------- */
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

  /* ---------- low-level storage (unchanged) ---------- */
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

  /* ---------- UserGuideStore gate ---------- */
  function userStoreActive() {
    return Boolean(
      window.UserGuideStore &&
      window.UserGuideStore.ready &&
      window.UserGuideStore.empId
    );
  }

  /* ---------- writers ---------- */

  function pushHistory(title, rawUrl) {
    const url = canonicalGuideUrl(rawUrl);
    if (!url) return;

    if (userStoreActive()) {
      return window.UserGuideStore.pushHistory(title, url);
    }

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

    if (userStoreActive()) {
      return window.UserGuideStore.bumpUsage(title, url);
    }

    const usage = readJSON(LS_USAGE, {});
    const safe = usage && typeof usage === "object" && !Array.isArray(usage) ? usage : {};

    if (!safe[url]) safe[url] = { title: title || "Untitled Guide", count: 0 };
    safe[url].title = title || safe[url].title || "Untitled Guide";
    safe[url].count = (Number(safe[url].count) || 0) + 1;

    writeJSON(LS_USAGE, safe);
  }

  function trackOpen(title, rawUrl) {
    const url = canonicalGuideUrl(rawUrl);
    if (!url) return;

    if (userStoreActive()) {
      return window.UserGuideStore.trackOpen(title, url);
    }

    pushHistory(title, url);
    bumpUsage(title, url);
  }

  /* ---------- favorites ---------- */

  function readFavorites() {
    if (userStoreActive()) {
      const d = window.UserGuideStore.data.favorites;
      return d && typeof d === "object" && !Array.isArray(d) ? d : {};
    }

    const favs = readJSON(LS_FAVS, {});
    return favs && typeof favs === "object" && !Array.isArray(favs) ? favs : {};
  }

  function writeFavorites(favs) {
    if (userStoreActive()) {
      // Rebuild UserGuideStore favorites from the incoming map.
      const us = window.UserGuideStore;
      const rebuilt = {};
      Object.keys(favs || {}).forEach(function (rawUrl) {
        const canon = canonicalGuideUrl(rawUrl);
        if (!canon) return;
        rebuilt[canon] = favs[rawUrl];
      });
      us.data.favorites = rebuilt;
      us._saveAll();
    }
    return writeJSON(LS_FAVS, favs || {});
  }

  function isFavorite(rawUrl) {
    const url = canonicalGuideUrl(rawUrl);
    if (!url) return false;
    return Boolean(readFavorites()[url]);
  }

  function toggleFavorite(title, rawUrl) {
    const url = canonicalGuideUrl(rawUrl);
    if (!url) return false;

    if (userStoreActive()) {
      const us = window.UserGuideStore;
      let added;
      if (us.data.favorites[url]) {
        delete us.data.favorites[url];
        added = false;
      } else {
        us.data.favorites[url] = { title: title || "Untitled Guide", timestamp: Date.now() };
        added = true;
      }
      us._saveAll();
      writeJSON(LS_FAVS, us.data.favorites);
      return added;
    }

    const favs = readFavorites();
    let added;
    if (favs[url]) {
      delete favs[url];
      added = false;
    } else {
      favs[url] = { title: title || "Untitled Guide", url: url, timestamp: Date.now() };
      added = true;
    }
    writeFavorites(favs);
    return added;
  }

  /* ---------- readers (dedupe by canonical URL) ---------- */

  function getHistory() {
    const raw = userStoreActive()
      ? (window.UserGuideStore.getHistory() || [])
      : readJSON(LS_HISTORY, []);

    if (!Array.isArray(raw)) return [];

    const seen = new Set();
    const out  = [];

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
    const raw = userStoreActive()
      ? (window.UserGuideStore.data.usage || {})
      : readJSON(LS_USAGE, {});

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

  /* ---------- export (unchanged shape) ---------- */
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
