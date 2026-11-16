/* ============================================================
   GUIDE STORE — single source of truth for guide URLs
   - localStorage = live runtime cache (synchronous, same as before)
   - Firestore    = background sync (hydrate on load, sync on write)
   ============================================================ */
(function () {
  "use strict";

  const LS_HISTORY     = "guideHistory";
  const LS_USAGE       = "guideUsageCounts";
  const LS_FAVS        = "guideFavorites";
  const LS_OWNER       = "guideDataOwner";
  const COLLECTION     = "user_guide_data";
  const MAX_HISTORY    = 100;
  const SYNC_DEBOUNCE  = 250;

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

  let hydrating = false;
  let pendingSync = false;
  let syncTimer = null;
  let queuedWrites = [];

  function scheduleSync() {
    if (hydrating) {
      pendingSync = true;
      return;
    }
    const empId = getEmpId();
    if (!empId) return;
    const db = firestore();
    if (!db) return;

    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () {
      const payload = {
        usage:     readJSON(LS_USAGE, {}),
        history:   readJSON(LS_HISTORY, []),
        favorites: readJSON(LS_FAVS, {}),
        modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      db.collection(COLLECTION).doc(empId).set(payload, { merge: true })
        .catch(function (err) {
          console.warn("[GuideStore] sync failed:", err.code || err.message);
        });
    }, SYNC_DEBOUNCE);
  }
   
  /* ---------- force-immediate Firestore write ---------- */
  function flushSync() {
    if (syncTimer) {
      clearTimeout(syncTimer);
      syncTimer = null;
    }
    const empId = getEmpId();
    if (!empId) return Promise.resolve();
    const db = firestore();
    if (!db) return Promise.resolve();

    const payload = {
      usage:     readJSON(LS_USAGE, {}),
      history:   readJSON(LS_HISTORY, []),
      favorites: readJSON(LS_FAVS, {}),
      modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    return db.collection(COLLECTION).doc(empId)
      .set(payload, { merge: true })
      .catch(function (err) {
        console.warn("[GuideStore] flushSync failed:", err.code || err.message);
      });
  }
   
  /* ---------- hydrate from Firestore ---------- */
  let hydratePromise = null;

  function hydrate() {
    if (hydratePromise) return hydratePromise;

    const empId = getEmpId();
    if (!empId) {
      hydratePromise = Promise.resolve();
      return hydratePromise;
    }

    // Owner check — clear stale local cache from a different employee
    let owner = "";
    try { owner = localStorage.getItem(LS_OWNER) || ""; } catch (_) {}
    if (owner && owner !== empId) {
      try {
        localStorage.removeItem(LS_USAGE);
        localStorage.removeItem(LS_HISTORY);
        localStorage.removeItem(LS_FAVS);
      } catch (_) {}
    }
    try { localStorage.setItem(LS_OWNER, empId); } catch (_) {}

    const db = firestore();
    if (!db) {
      hydratePromise = Promise.resolve();
      return hydratePromise;
    }

    hydrating = true;
    let firestoreExisted = false;

    hydratePromise = db.collection(COLLECTION).doc(empId).get()
      .then(function (snap) {
        if (!snap.exists) return;
        firestoreExisted = true;
        const d = snap.data() || {};
        writeJSON(LS_USAGE,   d.usage     || {});
        writeJSON(LS_HISTORY, d.history   || []);
        writeJSON(LS_FAVS,    d.favorites || {});
      })
      .catch(function (err) {
        console.warn("[GuideStore] hydrate failed:", err.code || err.message);
      })
      .then(function () {
        hydrating = false;

        // Replay queued writes on top of the hydrated state
        const replay = queuedWrites.slice();
        queuedWrites = [];
        replay.forEach(function (w) {
          if (w.type === "history") pushHistory(w.title, w.url);
          if (w.type === "usage")   bumpUsage(w.title, w.url);
          if (w.type === "fav")     toggleFavorite(w.title, w.url);
        });

        // If Firestore didn't exist yet, seed it from local
        const localHasData =
          Object.keys(readJSON(LS_USAGE, {})).length > 0 ||
          (readJSON(LS_HISTORY, []) || []).length > 0 ||
          Object.keys(readJSON(LS_FAVS, {})).length > 0;

        if (!firestoreExisted && localHasData) {
          scheduleSync();
        }
        if (replay.length > 0 || pendingSync) {
          pendingSync = false;
          scheduleSync();
        }

        // Tell the dashboard to re-render with hydrated data
        window.dispatchEvent(new CustomEvent("guidestore:ready"));
      });

    return hydratePromise;
  }

  /* ---------- writers ---------- */

  function pushHistory(title, rawUrl) {
    const url = canonicalGuideUrl(rawUrl);
    if (!url) return;

    if (hydrating) {
      queuedWrites.push({ type: "history", title: title || "Untitled Guide", url: url });
      return;
    }

    let history = readJSON(LS_HISTORY, []);
    if (!Array.isArray(history)) history = [];
    history.push({ title: title || "Untitled Guide", url: url, timestamp: Date.now() });
    if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY);
    writeJSON(LS_HISTORY, history);
    scheduleSync();
  }

  function bumpUsage(title, rawUrl) {
    const url = canonicalGuideUrl(rawUrl);
    if (!url) return;

    if (hydrating) {
      queuedWrites.push({ type: "usage", title: title || "Untitled Guide", url: url });
      return;
    }

    const usage = readJSON(LS_USAGE, {});
    const safe = usage && typeof usage === "object" && !Array.isArray(usage) ? usage : {};
    if (!safe[url]) safe[url] = { title: title || "Untitled Guide", count: 0 };
    safe[url].title = title || safe[url].title || "Untitled Guide";
    safe[url].count = (Number(safe[url].count) || 0) + 1;
    writeJSON(LS_USAGE, safe);
    scheduleSync();
  }

function trackOpen(title, rawUrl) {
  pushHistory(title, rawUrl);
  bumpUsage(title, rawUrl);
  return flushSync();
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

    if (hydrating) {
      queuedWrites.push({ type: "fav", title: title || "Untitled Guide", url: url });
      return false;
    }

    const favs = readFavorites();
    let added;
    if (favs[url]) { delete favs[url]; added = false; }
    else { favs[url] = { title: title || "Untitled Guide", url: url, timestamp: Date.now() }; added = true; }
    writeFavorites(favs);
    scheduleSync();
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
    hydrate:           hydrate,           // ← exposed for dashboard use
   flushSync:         flushSync 
  };

  /* ---------- auto-hydrate on load + on user switch ---------- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hydrate, { once: true });
  } else {
    hydrate();
  }

  document.addEventListener("bdtools:user-changed", function () {
    hydratePromise = null;   // allow re-hydrate
    hydrate();
  });
})();
