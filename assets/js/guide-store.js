/* ============================================================
   GUIDE STORE — single source of truth for guide URLs
   - localStorage = live runtime cache (synchronous, same as before)
   - Firestore    = background sync (hydrate on load, flush on nav)
   - auto-tracks guide page opens

   READ-BUDGET GUARDS (NEW):
     • HYDRATE_TTL_MS  — skip Firestore re-read if hydrated recently
     • MAX_HISTORY / MAX_FAVORITES / MAX_USAGE — bound the doc size
     • dirty flag — skip no-op writes on pagehide / flushSync
   ============================================================ */
(function () {
  "use strict";

  const LS_HISTORY     = "guideHistory";
  const LS_USAGE       = "guideUsageCounts";
  const LS_FAVS        = "guideFavorites";
  const LS_OWNER       = "guideDataOwner";
  const LS_HYDRATED_AT = "guideDataHydratedAt";   // NEW
  const COLLECTION     = "user_guide_data";

  const MAX_HISTORY    = 100;
  const MAX_FAVORITES  = 100;                     // NEW
  const MAX_USAGE      = 200;                     // NEW
  const SYNC_DEBOUNCE  = 250;
  const HYDRATE_TTL_MS = 5 * 60 * 1000;           // NEW: 5 minutes

  /* ---------- canonicalizer ---------- */
  function canonicalGuideUrl(rawUrl, baseUrl) {
    if (!rawUrl) return "";
    let u;
    try { u = new URL(String(rawUrl), baseUrl || document.baseURI); }
    catch (e) { return String(rawUrl); }
    const path = u.pathname.split("/").map(function (seg) {
      try { return encodeURIComponent(decodeURIComponent(seg)); }
      catch (e) { return seg; }
    }).join("/");
    return u.origin + path;
  }

  /* ---------- low-level storage ---------- */
  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (e) { return fallback; }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }

  /* ---------- bounded-payload helpers (NEW) ---------- */
  function trimHistory(arr) {
    if (!Array.isArray(arr)) return [];
    if (arr.length <= MAX_HISTORY) return arr;
    return arr.slice(arr.length - MAX_HISTORY);
  }
  function trimFavorites(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return {};
    const keys = Object.keys(obj);
    if (keys.length <= MAX_FAVORITES) return obj;
    const sorted = keys
      .map(function (k) { return { k: k, ts: Number(obj[k] && obj[k].timestamp) || 0 }; })
      .sort(function (a, b) { return b.ts - a.ts; })
      .slice(0, MAX_FAVORITES);
    const out = {};
    sorted.forEach(function (x) { out[x.k] = obj[x.k]; });
    return out;
  }
  function trimUsage(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return {};
    const keys = Object.keys(obj);
    if (keys.length <= MAX_USAGE) return obj;
    const sorted = keys
      .map(function (k) { return { k: k, c: Number(obj[k] && obj[k].count) || 0 }; })
      .sort(function (a, b) { return b.c - a.c; })
      .slice(0, MAX_USAGE);
    const out = {};
    sorted.forEach(function (x) { out[x.k] = obj[x.k]; });
    return out;
  }

  /* ---------- firestore plumbing ---------- */
  function getEmpId() {
    try {
      const raw = localStorage.getItem("bd_logged_in_user");
      if (!raw) return "";
      const u = JSON.parse(raw);
      return String(u.empId || u.employeeId || u.emp_id || "").trim();
    } catch (_) { return ""; }
  }
  function firestore() {
    if (window.firebase && firebase.apps && firebase.apps.length) {
      return window.db || firebase.firestore();
    }
    return null;
  }

  let hydrating    = false;
  let pendingSync  = false;
  let syncTimer    = null;
  let queuedWrites = [];
  let dirty        = false;   // NEW: skip no-op writes

  function scheduleSync() {
    if (hydrating) { pendingSync = true; return; }
    const empId = getEmpId();
    if (!empId) return;
    const db = firestore();
    if (!db) return;

    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () {
      syncTimer = null;
      doWrite();
    }, SYNC_DEBOUNCE);
  }

  function doWrite() {
    if (!dirty) return Promise.resolve();           // NEW: no-op if nothing changed
    const empId = getEmpId();
    if (!empId) return Promise.resolve();
    const db = firestore();
    if (!db) return Promise.resolve();

    dirty = false;

    const payload = {
      usage:      trimUsage(readJSON(LS_USAGE, {})),
      history:    trimHistory(readJSON(LS_HISTORY, [])),
      favorites:  trimFavorites(readJSON(LS_FAVS, {})),
      modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    return db.collection(COLLECTION).doc(empId)
      .set(payload, { merge: true })
      .catch(function (err) {
        dirty = true;                                // NEW: allow retry
        console.warn("[GuideStore] write failed:", err.code || err.message);
      });
  }

  function flushSync() {
    if (syncTimer) { clearTimeout(syncTimer); syncTimer = null; }
    return doWrite();
  }

  /* ---------- hydrate from Firestore ---------- */
  let hydratePromise = null;

  function hydrate(force) {
    // If a hydrate is in flight or already done, reuse it (unless forced)
    if (hydratePromise && !force) return hydratePromise;

    const empId = getEmpId();
    if (!empId) { hydratePromise = Promise.resolve(); return hydratePromise; }

    // Owner switch → wipe local data
    let owner = "";
    try { owner = localStorage.getItem(LS_OWNER) || ""; } catch (_) {}
    if (owner && owner !== empId) {
      try {
        localStorage.removeItem(LS_USAGE);
        localStorage.removeItem(LS_HISTORY);
        localStorage.removeItem(LS_FAVS);
        localStorage.removeItem(LS_HYDRATED_AT);
      } catch (_) {}
    }
    try { localStorage.setItem(LS_OWNER, empId); } catch (_) {}

    const db = firestore();
    if (!db) { hydratePromise = Promise.resolve(); return hydratePromise; }

    // ---- NEW: TTL guard — skip Firestore read if we hydrated recently ----
    if (!force) {
      try {
        const last = Number(localStorage.getItem(LS_HYDRATED_AT)) || 0;
        const sameOwner = (localStorage.getItem(LS_OWNER) || "") === empId;
        if (sameOwner && last && (Date.now() - last) < HYDRATE_TTL_MS) {
          hydratePromise = Promise.resolve();
          // Fire ready so renderers re-run against the local cache
          window.dispatchEvent(new CustomEvent("guidestore:ready"));
          return hydratePromise;
        }
      } catch (_) {}
    }

    hydrating = true;
    let firestoreExisted = false;

    hydratePromise = db.collection(COLLECTION).doc(empId).get()
      .then(function (snap) {
        if (!snap.exists) return;
        firestoreExisted = true;
        const d = snap.data() || {};
        writeJSON(LS_USAGE,   trimUsage(d.usage       || {}));
        writeJSON(LS_HISTORY, trimHistory(d.history   || []));
        writeJSON(LS_FAVS,    trimFavorites(d.favorites || {}));
        try { localStorage.setItem(LS_HYDRATED_AT, String(Date.now())); } catch (_) {}
      })
      .catch(function (err) {
        console.warn("[GuideStore] hydrate failed:", err.code || err.message);
      })
      .then(function () {
        hydrating = false;

        const replay = queuedWrites.slice();
        queuedWrites = [];
        replay.forEach(function (w) {
          if (w.type === "history") pushHistory(w.title, w.url, true);
          if (w.type === "usage")   bumpUsage(w.title, w.url, true);
          if (w.type === "fav")     toggleFavorite(w.title, w.url, true);
        });

        const localHasData =
          Object.keys(readJSON(LS_USAGE, {})).length > 0 ||
          (readJSON(LS_HISTORY, []) || []).length > 0 ||
          Object.keys(readJSON(LS_FAVS, {})).length > 0;

        if (!firestoreExisted && localHasData) scheduleSync();
        if (replay.length > 0 || pendingSync) {
          pendingSync = false;
          scheduleSync();
        }

        window.dispatchEvent(new CustomEvent("guidestore:ready"));
      });

    return hydratePromise;
  }

  /* ---------- writers ---------- */

  function pushHistory(title, rawUrl, replaying) {
    const url = canonicalGuideUrl(rawUrl);
    if (!url) return;

    let history = readJSON(LS_HISTORY, []);
    if (!Array.isArray(history)) history = [];
    history.push({ title: title || "Untitled Guide", url: url, timestamp: Date.now() });
    history = trimHistory(history);
    writeJSON(LS_HISTORY, history);

    if (hydrating && !replaying) {
      queuedWrites.push({ type: "history", title: title || "Untitled Guide", url: url });
    } else if (!hydrating) {
      dirty = true;                            // NEW
      scheduleSync();
    }
  }

  function bumpUsage(title, rawUrl, replaying) {
    const url = canonicalGuideUrl(rawUrl);
    if (!url) return;

    const usage = readJSON(LS_USAGE, {});
    const safe = usage && typeof usage === "object" && !Array.isArray(usage) ? usage : {};
    if (!safe[url]) safe[url] = { title: title || "Untitled Guide", count: 0 };
    safe[url].title = title || safe[url].title || "Untitled Guide";
    safe[url].count = (Number(safe[url].count) || 0) + 1;
    writeJSON(LS_USAGE, trimUsage(safe));

    if (hydrating && !replaying) {
      queuedWrites.push({ type: "usage", title: title || "Untitled Guide", url: url });
    } else if (!hydrating) {
      dirty = true;                            // NEW
      scheduleSync();
    }
  }

  function trackOpen(title, rawUrl) {
    pushHistory(title, rawUrl);
    bumpUsage(title, rawUrl);
    return flushSync();
  }

  function readFavorites() {
    const favs = readJSON(LS_FAVS, {});
    return favs && typeof favs === "object" && !Array.isArray(favs) ? favs : {};
  }
  function writeFavorites(favs) { return writeJSON(LS_FAVS, favs || {}); }

  function isFavorite(rawUrl) {
    const url = canonicalGuideUrl(rawUrl);
    if (!url) return false;
    return !!readFavorites()[url];
  }

  function toggleFavorite(title, rawUrl, replaying) {
    const url = canonicalGuideUrl(rawUrl);
    if (!url) return false;

    let favs = readFavorites();
    let added;
    if (favs[url]) { delete favs[url]; added = false; }
    else {
      favs[url] = { title: title || "Untitled Guide", url: url, timestamp: Date.now() };
      added = true;
      favs = trimFavorites(favs);              // NEW: cap favorites count
    }
    writeFavorites(favs);

    if (hydrating && !replaying) {
      queuedWrites.push({ type: "fav", title: title || "Untitled Guide", url: url });
    } else if (!hydrating) {
      dirty = true;                            // NEW
      flushSync();
    }
    return added;
  }

  /* ---------- readers ---------- */

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
        merged[canonical] = { title: entry.title || "Untitled Guide", url: canonical, count: 0 };
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
        merged[canonical] = { title: entry.title || "Untitled Guide", url: canonical, timestamp: ts };
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
    getFavoriteList:   getFavoriteList,
    hydrate:           hydrate,
    refresh:           function () { return hydrate(true); },   // NEW: force re-read
    flushSync:         flushSync
  };

  /* ---------- auto-track guide page opens ---------- */
  (function autoTrackGuidePage() {
    function isGuidePage() {
      var p = location.pathname.toLowerCase();
      return /\/guides\/[^\/]+\/[^\/]+\/[^\/]+\.html$/.test(p);
    }

    function extractTitle() {
      var t = (document.title || "").trim();
      t = t.replace(/\s*[\|·–—-]\s*(Decision Support System|DSS V2?|BD Tools|FedEx.*)$/i, "").trim();
      if (t) return t;
      var h1 = document.querySelector("h1");
      if (h1 && h1.textContent.trim()) return h1.textContent.trim();
      var slug = location.pathname.split("/").pop().replace(/\.html$/i, "");
      return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, function(c) { return c.toUpperCase(); });
    }

    function alreadyTrackedRecently(canon) {
      try {
        var hist = getHistory();
        if (!hist.length) return false;
        var top = hist[0];
        return top.url === canon && (Date.now() - top.timestamp) < 30000;
      } catch (_) { return false; }
    }

    var fired = false;
    function fire() {
      if (fired) return;
      if (!isGuidePage()) return;
      fired = true;

      hydrate().then(function () {
        try {
          var canon = canonicalGuideUrl(location.href);
          if (alreadyTrackedRecently(canon)) return;
          trackOpen(extractTitle(), location.href);
        } catch (_) {}
      });
    }

    function schedule() { setTimeout(fire, 250); }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", schedule, { once: true });
    } else {
      schedule();
    }
  })();

  /* ---------- auto-hydrate on load + on user switch ---------- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { hydrate(); }, { once: true });
  } else {
    hydrate();
  }

  document.addEventListener("bdtools:user-changed", function () {
    hydratePromise = null;
    hydrate(true);   // NEW: force re-read on user switch
  });

  window.addEventListener("pagehide", function () {
    try { flushSync(); } catch (_) {}
  });
})();
