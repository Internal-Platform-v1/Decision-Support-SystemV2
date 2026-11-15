/* ============================================================
   USER GUIDE STORE  —  Firestore-backed, per-employee
   Collection: user_guide_data/{empId}
   Falls back to localStorage when:
     - no employee is signed in
     - Firestore is unavailable
   ============================================================ */

(function () {
  "use strict";

  const COLLECTION     = "user_guide_data";
  const LS_USAGE       = "guideUsageCounts";
  const LS_HISTORY     = "guideHistory";
  const LS_FAVS        = "guideFavorites";
  const LS_OWNER       = "guideDataOwner";
  const MAX_HISTORY    = 100;

  function getStoredUser() {
    try {
      const raw = localStorage.getItem("bd_logged_in_user");
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  function getEmpId() {
    const u = getStoredUser();
    if (!u) return "";
    return String(u.empId || u.employeeId || u.emp_id || "").trim();
  }

  function firestore() {
    if (window.firebase && firebase.apps && firebase.apps.length) {
      return window.db || firebase.firestore();
    }
    return null;
  }

  function readLocal() {
    let usage = {}, history = [], favorites = {};
    try { usage     = JSON.parse(localStorage.getItem(LS_USAGE)   || "{}") || {}; } catch (_) {}
    try { history   = JSON.parse(localStorage.getItem(LS_HISTORY) || "[]") || []; } catch (_) {}
    try { favorites = JSON.parse(localStorage.getItem(LS_FAVS)    || "{}") || {}; } catch (_) {}
    if (!Array.isArray(history)) history = [];
    return { usage, history, favorites };
  }

  function writeLocal(data) {
    try { localStorage.setItem(LS_USAGE,   JSON.stringify(data.usage     || {})); } catch (_) {}
    try { localStorage.setItem(LS_HISTORY, JSON.stringify(data.history   || [])); } catch (_) {}
    try { localStorage.setItem(LS_FAVS,    JSON.stringify(data.favorites || {})); } catch (_) {}
  }

  function getLocalOwner() {
    try { return localStorage.getItem(LS_OWNER) || ""; } catch (_) { return ""; }
  }
  function setLocalOwner(empId) {
    try { localStorage.setItem(LS_OWNER, empId || ""); } catch (_) {}
  }

  const UserGuideStore = {
    empId: "",
    data: { usage: {}, history: [], favorites: {} },
    ready: false,
    _promise: null,

    /* ---- init ---- */
    init() {
      this.empId = getEmpId();
      return this.load();
    },

    /* ---- full reload (used after user switches) ---- */
    reset() {
      this._promise = null;
      this.ready = false;
      this.data = { usage: {}, history: [], favorites: {} };
      return this.init();
    },

    /* ---- promise resolves when data is ready ---- */
    load() {
      if (this._promise) return this._promise;

      this._promise = (async () => {
        if (!this.empId) {
          const owner = getLocalOwner();
          this.data = owner ? { usage: {}, history: [], favorites: {} } : readLocal();
          this.ready = true;
          return this.data;
        }

        const db = firestore();
        if (!db) {
          this.data = readLocal();
          this.ready = true;
          return this.data;
        }

        try {
          const snap = await db.collection(COLLECTION).doc(this.empId).get();

          if (snap.exists) {
            const d = snap.data() || {};
            this.data = {
              usage:     d.usage     && typeof d.usage     === "object" ? d.usage     : {},
              history:   Array.isArray(d.history)                       ? d.history   : [],
              favorites: d.favorites && typeof d.favorites === "object" ? d.favorites : {}
            };
          } else {
            const owner = getLocalOwner();
            const local = readLocal();

            if (owner === "" || owner === this.empId) {
              this.data = local;
              setLocalOwner(this.empId);
              this._saveAll();
            } else {
              this.data = { usage: {}, history: [], favorites: {} };
              setLocalOwner(this.empId);
            }
          }
        } catch (err) {
          console.warn("[UserGuideStore] Firestore read failed, using local:", err.code || err.message);
          this.data = readLocal();
        }

        this.ready = true;
        writeLocal(this.data);
        return this.data;
      })();

      return this._promise;
    },

    /* ---- persist whole doc (fire-and-forget) ---- */
    _saveAll() {
      if (!this.empId) return Promise.resolve();
      const db = firestore();
      if (!db) return Promise.resolve();

      const payload = {
        usage:     this.data.usage     || {},
        history:   this.data.history   || [],
        favorites: this.data.favorites || {},
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      return db.collection(COLLECTION).doc(this.empId)
        .set(payload, { merge: true })
        .catch((err) => console.warn("[UserGuideStore] write failed:", err.code || err.message));
    },

    /* ---- track a guide open ---- */
    async trackOpen(title, url) {
      if (!url) return;
      await this.load();

      const t   = title || "Untitled Guide";
      const now = Date.now();

      const u = this.data.usage[url] || { title: t, count: 0 };
      u.title    = t;
      u.count    = (Number(u.count) || 0) + 1;
      u.lastUsed = now;
      this.data.usage[url] = u;

      this.data.history.push({ title: t, url, timestamp: now });
      if (this.data.history.length > MAX_HISTORY) {
        this.data.history.splice(0, this.data.history.length - MAX_HISTORY);
      }

      writeLocal(this.data);
      return this._saveAll();
    },

    /* ---- toggle favorite ---- */
    async toggleFavorite(title, url) {
      if (!url) return false;
      await this.load();

      const t = title || "Untitled Guide";

      let added;
      if (this.data.favorites[url]) {
        delete this.data.favorites[url];
        added = false;
      } else {
        this.data.favorites[url] = { title: t, timestamp: Date.now() };
        added = true;
      }

      writeLocal(this.data);
      this._saveAll();
      return added;
    },

    /* ---- read helpers ---- */
    getMostUsed() {
      return Object.keys(this.data.usage).map((url) => ({
        url,
        title: this.data.usage[url]?.title || "Untitled Guide",
        count: Number(this.data.usage[url]?.count) || 0
      })).sort((a, b) => b.count - a.count);
    },

    getHistory() {
      return this.data.history.slice().reverse();
    },

    getFavoriteList() {
      return Object.keys(this.data.favorites).map((url) => ({
        url,
        title: this.data.favorites[url]?.title || "Untitled Guide",
        timestamp: Number(this.data.favorites[url]?.timestamp) || 0
      })).sort((a, b) => b.timestamp - a.timestamp);
    }
  };

  window.UserGuideStore = UserGuideStore;
})();
