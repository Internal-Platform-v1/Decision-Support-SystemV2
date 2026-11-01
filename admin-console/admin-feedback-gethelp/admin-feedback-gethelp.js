/* ============================================================
   DSS V2 — ADMIN · FEEDBACK & GET HELP
   Reads:  feedback, help_requests  (Firestore)
   Writes: help_requests.status
   ============================================================ */
(() => {
  "use strict";

  /* ---------- Config ---------- */
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDjaMdeh0Cgx00hzDyZOi54fKDr8KwnxJU",
    authDomain: "bdgg-database.firebaseapp.com",
    projectId: "bdgg-database",
    storageBucket: "bdgg-database.appspot.com",
    messagingSenderId: "43574975434",
    appId: "1:43574975434:web:4c79e581267fdfcc6ccd33"
  };

  const FIREBASE_SCRIPTS = [
    "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js",
    "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js",
    "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js"
  ];

  const PAGE_SIZE = 100;

  const RATING_LABELS = {
    1: "Poor", 2: "Needs improvement", 3: "Good", 4: "Very good", 5: "Excellent"
  };
  const STATUS_LABELS = {
    open: "Open", in_progress: "In Progress", resolved: "Resolved", closed: "Closed"
  };
  const STATUS_ORDER = ["open", "in_progress", "resolved", "closed"];

  /* ---------- State ---------- */
  const state = {
    activeTab: "feedback",
    firebase: null,
    feedback: {
      items: [], cursor: null, hasMore: false, loading: false, loaded: false
    },
    help: {
      items: [], cursor: null, hasMore: false, loading: false, loaded: false
    },
    filters: {
      feedback: { search: "", rating: "", sort: "newest" },
      help: { search: "", category: "", status: "", sort: "newest" }
    }
  };

  /* ---------- Firebase loader ---------- */
  function getFirebase() {
    return typeof window.firebase !== "undefined" ? window.firebase : null;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (getFirebase()) return resolve();
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error("Unable to load Firebase SDK."));
      document.head.appendChild(s);
    });
  }

  async function ensureFirebase() {
    if (state.firebase) return state.firebase;

    if (!getFirebase()) await loadScript(FIREBASE_SCRIPTS[0]);
    if (!getFirebase()) throw new Error("Firebase SDK unavailable.");
    if (typeof firebase.auth !== "function") await loadScript(FIREBASE_SCRIPTS[1]);
    if (typeof firebase.firestore !== "function") await loadScript(FIREBASE_SCRIPTS[2]);
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);

    state.firebase = firebase;
    return firebase;
  }

  function waitForAuth(fb, timeout = 6000) {
    const auth = fb.auth();
    if (auth.currentUser) return Promise.resolve(auth.currentUser);
    return new Promise((resolve, reject) => {
      let settled = false;
      const unsub = auth.onAuthStateChanged((user) => {
        if (settled) return;
        settled = true;
        unsub();
        user ? resolve(user) : reject(new Error("AUTH_REQUIRED"));
      });
      setTimeout(() => {
        if (settled) return;
        settled = true;
        unsub();
        reject(new Error("AUTH_TIMEOUT"));
      }, timeout);
    });
  }

  /* ---------- Helpers ---------- */
  function initials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "—";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts.at(-1)[0]).toUpperCase();
  }

  function toDate(ts) {
    if (!ts) return null;
    if (ts instanceof Date) return ts;
    if (typeof ts.toDate === "function") return ts.toDate();
    if (typeof ts.seconds === "number") return new Date(ts.seconds * 1000);
    if (typeof ts === "number") return new Date(ts);
    const d = new Date(ts);
    return isNaN(d.getTime()) ? null : d;
  }

  function formatRelative(date) {
    if (!date) return "—";
    const diffMs = Date.now() - date.getTime();
    const min = Math.floor(diffMs / 60000);
    if (min < 1) return "Just now";
    if (min < 60) return `${min}m ago`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function formatFullDate(date) {
    if (!date) return "—";
    return date.toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit"
    });
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function starsHtml(rating) {
    const n = Math.round(Number(rating) || 0);
    return Array.from({ length: 5 }, (_, i) =>
      `<span class="fb-star${i < n ? " is-filled" : ""}" aria-hidden="true">★</span>`
    ).join("");
  }

  function statusOf(item) {
    return STATUS_LABELS[item.status] ? item.status : "open";
  }

  function showToast(message, type = "success") {
    const el = document.getElementById("fbToast");
    if (!el) return;
    el.textContent = message;
    el.className = `fb-toast is-visible${type === "error" ? " is-error" : type === "success" ? " is-success" : ""}`;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      el.className = "fb-toast";
    }, 2600);
  }

  function describeError(error) {
    if (!error) return "Something went wrong.";
    const code = String(error.code || "").toLowerCase();
    if (code.includes("permission-denied")) return "Permission denied. Ask your administrator to grant read access.";
    if (code.includes("unauthenticated")) return "Your session expired. Please sign in again.";
    if (code.includes("unavailable") || code.includes("network")) return "Network unavailable. Please try again.";
    return error.message || "Something went wrong.";
  }

  function debounce(fn, wait = 220) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  /* ---------- Data loading ---------- */
  function renderLoadingInto(listId, label) {
    const el = document.getElementById(listId);
    if (el) {
      el.innerHTML = `
        <div class="fb-loading">
          <div class="fb-spinner" aria-hidden="true"></div>
          <span>Loading ${label}…</span>
        </div>`;
    }
  }

  function renderErrorInto(listId, label) {
    const el = document.getElementById(listId);
    if (el) {
      el.innerHTML = `
        <div class="fb-empty">
          <div class="fb-empty-icon"><svg viewBox="0 0 24 24"><path d="M12 9v4"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="9"/></svg></div>
          <strong>Couldn't load ${label}</strong>
          <p>Check your connection, make sure you're signed in, then tap Refresh.</p>
        </div>`;
    }
  }

  async function loadFeedback(more = false) {
    const bucket = state.feedback;
    if (bucket.loading) return;
    bucket.loading = true;

    if (!more && !bucket.loaded) renderLoadingInto("fbFeedbackList", "feedback");

    try {
      const fb = await ensureFirebase();
      await waitForAuth(fb);
      const db = fb.firestore();

      let q = db.collection("feedback").orderBy("createdAt", "desc").limit(PAGE_SIZE);
      if (more && bucket.cursor) q = q.startAfter(bucket.cursor);

      const snap = await q.get();
      const items = snap.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data, createdAt: toDate(data.createdAt) };
      });

      bucket.items = more ? bucket.items.concat(items) : items;
      bucket.cursor = snap.docs[snap.docs.length - 1] || null;
      bucket.hasMore = snap.docs.length === PAGE_SIZE;
      bucket.loaded = true;
    } catch (error) {
      console.error("[admin-feedback] feedback load failed:", error);
      showToast(describeError(error), "error");
      if (!more) {
        bucket.loaded = true;
        renderErrorInto("fbFeedbackList", "feedback");
      }
    } finally {
      bucket.loading = false;
      renderFeedback();
      updateStats();
      updateTabCounts();
    }
  }

  async function loadHelp(more = false) {
    const bucket = state.help;
    if (bucket.loading) return;
    bucket.loading = true;

    if (!more && !bucket.loaded) renderLoadingInto("fbHelpList", "help requests");

    try {
      const fb = await ensureFirebase();
      await waitForAuth(fb);
      const db = fb.firestore();

      let q = db.collection("help_requests").orderBy("createdAt", "desc").limit(PAGE_SIZE);
      if (more && bucket.cursor) q = q.startAfter(bucket.cursor);

      const snap = await q.get();
      const items = snap.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data, createdAt: toDate(data.createdAt) };
      });

      bucket.items = more ? bucket.items.concat(items) : items;
      bucket.cursor = snap.docs[snap.docs.length - 1] || null;
      bucket.hasMore = snap.docs.length === PAGE_SIZE;
      bucket.loaded = true;
    } catch (error) {
      console.error("[admin-feedback] help load failed:", error);
      showToast(describeError(error), "error");
      if (!more) {
        bucket.loaded = true;
        renderErrorInto("fbHelpList", "help requests");
      }
    } finally {
      bucket.loading = false;
      renderHelp();
      updateStats();
      updateTabCounts();
    }
  }

  /* ---------- Filtering / sorting ---------- */
  function matchesSearch(haystacks, query) {
    if (!query) return true;
    const q = query.toLowerCase();
    return haystacks.some((value) => String(value || "").toLowerCase().includes(q));
  }

  function getFilteredFeedback() {
    const f = state.filters.feedback;
    let items = state.feedback.items.filter((item) => {
      if (f.rating && String(item.rating) !== String(f.rating)) return false;
      return matchesSearch([item.name, item.email, item.comment, item.pageTitle], f.search);
    });

    switch (f.sort) {
      case "oldest": items.sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0)); break;
      case "highest": items.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)); break;
      case "lowest": items.sort((a, b) => (Number(a.rating) || 0) - (Number(b.rating) || 0)); break;
      default: items.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    }
    return items;
  }

  function getFilteredHelp() {
    const f = state.filters.help;
    let items = state.help.items.filter((item) => {
      if (f.category && item.category !== f.category) return false;
      if (f.status && statusOf(item) !== f.status) return false;
      return matchesSearch([item.name, item.email, item.subject, item.message], f.search);
    });

    switch (f.sort) {
      case "oldest": items.sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0)); break;
      default: items.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    }
    return items;
  }

  /* ---------- Rendering: feedback ---------- */
  function renderFeedback() {
    const list = document.getElementById("fbFeedbackList");
    if (!list) return;

    const bucket = state.feedback;
    if (!bucket.loaded) {
      if (!bucket.loading) renderLoadingInto("fbFeedbackList", "feedback");
      return;
    }

    const items = getFilteredFeedback();

    if (!items.length) {
      const hasData = bucket.items.length > 0;
      list.innerHTML = `
        <div class="fb-empty">
          <div class="fb-empty-icon"><svg viewBox="0 0 24 24"><path d="M20 11.2c0 3.8-3.7 6.8-8.3 6.8-1 0-2-.1-2.9-.4L4 20l1.1-3.2C3.8 15.6 3 13.9 3 12c0-3.8 3.7-6.8 8.3-6.8S20 7.4 20 11.2Z"/></svg></div>
          <strong>${hasData ? "No feedback matches your filters" : "No feedback yet"}</strong>
          <p>${hasData
            ? "Try clearing the search or rating filter."
            : "Feedback submitted through the DSS V2 footer will appear here."}</p>
        </div>`;
    } else {
      list.innerHTML = items.map(renderFeedbackCard).join("");
    }

    document.querySelectorAll("#fbFeedbackList [data-id]").forEach((card) => {
      card.addEventListener("click", () => openDrawer("feedback", card.dataset.id));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDrawer("feedback", card.dataset.id);
        }
      });
    });

    const loadMore = document.getElementById("fbFeedbackLoadMore");
    if (loadMore) loadMore.hidden = !bucket.hasMore;
  }

  function renderFeedbackCard(item) {
    const rating = Number(item.rating) || 0;
    const name = item.name || "Anonymous";
    const email = item.email || "No email";
    const comment = item.comment || "";
    const pageTitle = item.pageTitle || "Unknown page";
    const createdLabel = formatRelative(item.createdAt);

    return `
      <article class="fb-card" data-id="${escapeHtml(item.id)}" role="button" tabindex="0">
        <div class="fb-card-avatar">${escapeHtml(initials(name))}</div>
        <div class="fb-card-main">
          <div class="fb-card-top">
            <strong class="fb-card-name">${escapeHtml(name)}</strong>
            <span class="fb-card-date">${escapeHtml(createdLabel)}</span>
          </div>
          <div class="fb-card-meta">
            <span class="fb-rating-stars" aria-label="${rating} of 5 stars">${starsHtml(rating)}</span>
            <span class="fb-card-email">${escapeHtml(email)}</span>
          </div>
          <p class="fb-card-preview">${escapeHtml(comment)}</p>
          <div class="fb-card-footer">
            <span class="fb-badge fb-badge-page">${escapeHtml(pageTitle)}</span>
          </div>
        </div>
      </article>`;
  }

  /* ---------- Rendering: help ---------- */
  function renderHelp() {
    const list = document.getElementById("fbHelpList");
    if (!list) return;

    const bucket = state.help;
    if (!bucket.loaded) {
      if (!bucket.loading) renderLoadingInto("fbHelpList", "help requests");
      return;
    }

    const items = getFilteredHelp();

    if (!items.length) {
      const hasData = bucket.items.length > 0;
      list.innerHTML = `
        <div class="fb-empty">
          <div class="fb-empty-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M9.7 9.2a2.5 2.5 0 0 1 4.8 1c0 1.9-2.5 2.1-2.5 3.6"/><path d="M12 17.1h.01"/></svg></div>
          <strong>${hasData ? "No help requests match your filters" : "No help requests yet"}</strong>
          <p>${hasData
            ? "Try clearing the search, category, or status filter."
            : "Help requests submitted through the DSS V2 footer will appear here."}</p>
        </div>`;
    } else {
      list.innerHTML = items.map(renderHelpCard).join("");
    }

    document.querySelectorAll("#fbHelpList [data-id]").forEach((card) => {
      card.addEventListener("click", () => openDrawer("help", card.dataset.id));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDrawer("help", card.dataset.id);
        }
      });
    });

    const loadMore = document.getElementById("fbHelpLoadMore");
    if (loadMore) loadMore.hidden = !bucket.hasMore;
  }

  function renderHelpCard(item) {
    const status = statusOf(item);
    const name = item.name || "Unknown user";
    const email = item.email || "";
    const subject = item.subject || "(no subject)";
    const message = item.message || "";
    const category = item.category || "Other";
    const createdLabel = formatRelative(item.createdAt);

    return `
      <article class="fb-card" data-id="${escapeHtml(item.id)}" role="button" tabindex="0">
        <div class="fb-card-avatar">${escapeHtml(initials(name))}</div>
        <div class="fb-card-main">
          <div class="fb-card-top">
            <strong class="fb-card-name">${escapeHtml(subject)}</strong>
            <span class="fb-card-date">${escapeHtml(createdLabel)}</span>
          </div>
          <div class="fb-card-meta">
            <span class="fb-card-user">${escapeHtml(name)}</span>
            ${email ? `<span class="fb-card-email">${escapeHtml(email)}</span>` : ""}
          </div>
          <p class="fb-card-preview">${escapeHtml(message)}</p>
          <div class="fb-card-footer">
            <span class="fb-badge fb-badge-category">${escapeHtml(category)}</span>
            <span class="fb-badge fb-badge-status fb-badge-status-${status}">${escapeHtml(STATUS_LABELS[status])}</span>
          </div>
        </div>
      </article>`;
  }

  /* ============================================================
     DETAIL DRAWER
     ============================================================ */
  function openDrawer(type, id) {
    const source = type === "feedback" ? state.feedback.items : state.help.items;
    const item = source.find((x) => x.id === id);
    if (!item) return;

    const drawer = document.getElementById("fbDrawer");
    const avatar = document.getElementById("fbDrawerAvatar");
    const kicker = document.getElementById("fbDrawerKicker");
    const title = document.getElementById("fbDrawerTitle");
    const sub = document.getElementById("fbDrawerSub");
    const body = document.getElementById("fbDrawerBody");
    if (!drawer || !body) return;

    avatar.textContent = initials(item.name || "?");
    kicker.textContent = type === "feedback" ? "FEEDBACK" : "HELP REQUEST";

    if (type === "feedback") {
      title.textContent = item.name || "Anonymous";
      sub.textContent = item.email || "No email provided";
      body.innerHTML = renderFeedbackDrawer(item);
    } else {
      title.textContent = item.subject || "(no subject)";
      sub.textContent = item.name || "Unknown user";
      body.innerHTML = renderHelpDrawer(item);
      bindHelpStatusActions(item);
    }

    drawer.hidden = false;
    drawer.setAttribute("aria-hidden", "false");
    // force reflow so the transition kicks in
    void drawer.offsetHeight;
    drawer.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    const drawer = document.getElementById("fbDrawer");
    if (!drawer || !drawer.classList.contains("is-open")) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => {
      if (!drawer.classList.contains("is-open")) drawer.hidden = true;
    }, 260);
  }

  function renderFeedbackDrawer(item) {
    const rating = Number(item.rating) || 0;
    const name = item.name || "Anonymous";
    const email = item.email || "—";
    const pageTitle = item.pageTitle || "Unknown page";
    const pageUrl = item.pageUrl || "";
    const submitted = formatFullDate(item.createdAt);
    const comment = item.comment || "No comment provided.";

    return `
      <div class="fb-detail-rating">
        <span class="fb-rating-stars" aria-label="${rating} of 5 stars">${starsHtml(rating)}</span>
        <div>
          <strong>${rating}/5</strong>
          <span>${escapeHtml(RATING_LABELS[rating] || "Unrated")}</span>
        </div>
      </div>

      <dl class="fb-detail-list">
        <div><dt>Name</dt><dd>${escapeHtml(name)}</dd></div>
        <div><dt>Email</dt><dd>${escapeHtml(email)}</dd></div>
        <div><dt>Page</dt><dd>${escapeHtml(pageTitle)}${pageUrl ? `<br><code>${escapeHtml(pageUrl)}</code>` : ""}</dd></div>
        <div><dt>Submitted</dt><dd>${escapeHtml(submitted)}</dd></div>
      </dl>

      <div class="fb-detail-block">
        <label>Comment</label>
        <p>${escapeHtml(comment)}</p>
      </div>`;
  }

  function renderHelpDrawer(item) {
    const status = statusOf(item);
    const name = item.name || "Unknown user";
    const email = item.email || "—";
    const category = item.category || "Other";
    const pageTitle = item.pageTitle || "Unknown page";
    const pageUrl = item.pageUrl || "";
    const submitted = formatFullDate(item.createdAt);
    const message = item.message || "No message provided.";

    return `
      <div class="fb-detail-status-group">
        <span class="fb-badge fb-badge-category">${escapeHtml(category)}</span>
        <span class="fb-badge fb-badge-status fb-badge-status-${status}">${escapeHtml(STATUS_LABELS[status])}</span>
      </div>

      <dl class="fb-detail-list">
        <div><dt>Name</dt><dd>${escapeHtml(name)}</dd></div>
        <div><dt>Email</dt><dd>${escapeHtml(email)}</dd></div>
        <div><dt>Category</dt><dd>${escapeHtml(category)}</dd></div>
        <div><dt>Page</dt><dd>${escapeHtml(pageTitle)}${pageUrl ? `<br><code>${escapeHtml(pageUrl)}</code>` : ""}</dd></div>
        <div><dt>Submitted</dt><dd>${escapeHtml(submitted)}</dd></div>
      </dl>

      <div class="fb-detail-block">
        <label>Message</label>
        <p>${escapeHtml(message)}</p>
      </div>

      <div class="fb-detail-block">
        <label>Update status</label>
        <div class="fb-status-actions" data-status-actions>
          ${STATUS_ORDER.map((s) => `
            <button type="button" class="fb-status-btn${s === status ? " is-active" : ""}" data-status="${s}">
              ${escapeHtml(STATUS_LABELS[s])}
            </button>
          `).join("")}
        </div>
        <p class="fb-status-hint" data-status-hint>Changing the status updates the record in Firestore.</p>
      </div>`;
  }

  function bindHelpStatusActions(item) {
    const container = document.querySelector("#fbDrawerBody [data-status-actions]");
    if (!container) return;
    const hint = document.querySelector("#fbDrawerBody [data-status-hint]");
    const current = item.status || statusOf(item);

    container.querySelectorAll("[data-status]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const next = btn.dataset.status;
        if (next === current || btn.disabled) return;

        container.querySelectorAll("button").forEach((b) => (b.disabled = true));
        if (hint) hint.textContent = "Saving…";

        try {
          const fb = await ensureFirebase();
          await waitForAuth(fb);
          await fb.firestore().collection("help_requests").doc(item.id).update({
            status: next,
            updatedAt: fb.firestore.FieldValue.serverTimestamp()
          });

          // update local model
          item.status = next;

          // update buttons
          container.querySelectorAll("[data-status]").forEach((b) => {
            b.classList.toggle("is-active", b.dataset.status === next);
          });

          // update badge in drawer
          const group = document.querySelector("#fbDrawerBody .fb-detail-status-group");
          const badge = group && group.querySelector(".fb-badge-status");
          if (badge) {
            badge.className = `fb-badge fb-badge-status fb-badge-status-${next}`;
            badge.textContent = STATUS_LABELS[next] || next;
          }

          if (hint) hint.textContent = `Status set to ${STATUS_LABELS[next]}.`;
          showToast(`Status updated to ${STATUS_LABELS[next]}.`, "success");

          // re-render list + stats to keep everything consistent
          renderHelp();
          updateStats();
        } catch (error) {
          console.error("[admin-feedback] status update failed:", error);
          if (hint) hint.textContent = "Could not save. Please try again.";
          showToast(describeError(error), "error");
          // revert active button
          container.querySelectorAll("[data-status]").forEach((b) => {
            b.classList.toggle("is-active", b.dataset.status === current);
          });
        } finally {
          container.querySelectorAll("button").forEach((b) => (b.disabled = false));
        }
      });
    });
  }

  /* ---------- Stats + tab counts ---------- */
  function updateStats() {
    const fbItems = state.feedback.items;
    const fbLoaded = state.feedback.loaded;

    const totalEl = document.getElementById("statTotalFeedback");
    if (totalEl) totalEl.textContent = fbLoaded ? fbItems.length : "—";

    const ratings = fbItems.map((i) => Number(i.rating)).filter((n) => n > 0);
    const avgEl = document.getElementById("statAvgRating");
    const avgHint = document.getElementById("statAvgHint");
    if (avgEl) {
      if (ratings.length) {
        const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        avgEl.textContent = avg.toFixed(1);
        if (avgHint) {
          avgHint.textContent = `Based on ${ratings.length} rating${ratings.length === 1 ? "" : "s"}`;
        }
      } else {
        avgEl.textContent = "—";
        if (avgHint) avgHint.textContent = "No data yet";
      }
    }

    const helpItems = state.help.items;
    const helpLoaded = state.help.loaded;
    const openCount = helpItems.filter((i) => {
      const s = statusOf(i);
      return s === "open" || s === "in_progress";
    }).length;
    const resolvedCount = helpItems.filter((i) => statusOf(i) === "resolved").length;

    const openEl = document.getElementById("statOpenHelp");
    if (openEl) openEl.textContent = helpLoaded ? openCount : "—";

    const resolvedEl = document.getElementById("statResolvedHelp");
    if (resolvedEl) resolvedEl.textContent = helpLoaded ? resolvedCount : "—";
  }

  function updateTabCounts() {
    const fCount = document.getElementById("tabCountFeedback");
    const hCount = document.getElementById("tabCountHelp");
    if (fCount) fCount.textContent = state.feedback.loaded ? state.feedback.items.length : 0;
    if (hCount) hCount.textContent = state.help.loaded ? state.help.items.length : 0;
  }

  /* ---------- Tabs ---------- */
  function switchTab(tab) {
    if (state.activeTab === tab) return;
    state.activeTab = tab;

    document.querySelectorAll(".fb-tab").forEach((btn) => {
      const active = btn.dataset.tab === tab;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
    document.querySelectorAll(".fb-panel").forEach((panel) => {
      panel.hidden = panel.dataset.panel !== tab;
    });
  }

  /* ---------- Refresh ---------- */
  async function refreshAll() {
    const btn = document.getElementById("fbRefreshBtn");
    if (btn) btn.disabled = true;

    // reset both buckets
    state.feedback.items = [];
    state.feedback.cursor = null;
    state.feedback.loaded = false;
    state.help.items = [];
    state.help.cursor = null;
    state.help.loaded = false;

    try {
      await Promise.all([loadFeedback(), loadHelp()]);
      showToast("Data refreshed.", "success");
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  /* ---------- Export CSV ---------- */
  function toCsvValue(v) {
    const s = String(v == null ? "" : v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }

  function downloadCsv(filename, rows) {
    const csv = rows.map((r) => r.map(toCsvValue).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportCsv() {
    const stamp = new Date().toISOString().slice(0, 10);

    if (state.activeTab === "feedback") {
      const items = getFilteredFeedback();
      if (!items.length) {
        showToast("No feedback to export.", "error");
        return;
      }
      const rows = [["Name", "Email", "Rating", "Page", "Comment", "Submitted"]];
      items.forEach((i) => rows.push([
        i.name || "",
        i.email || "",
        i.rating || "",
        i.pageTitle || "",
        i.comment || "",
        i.createdAt ? formatFullDate(i.createdAt) : ""
      ]));
      downloadCsv(`feedback-${stamp}.csv`, rows);
    } else {
      const items = getFilteredHelp();
      if (!items.length) {
        showToast("No help requests to export.", "error");
        return;
      }
      const rows = [["Name", "Email", "Subject", "Category", "Status", "Page", "Message", "Submitted"]];
      items.forEach((i) => rows.push([
        i.name || "",
        i.email || "",
        i.subject || "",
        i.category || "",
        STATUS_LABELS[statusOf(i)] || "",
        i.pageTitle || "",
        i.message || "",
        i.createdAt ? formatFullDate(i.createdAt) : ""
      ]));
      downloadCsv(`help-requests-${stamp}.csv`, rows);
    }
    showToast("Export ready.", "success");
  }

  /* ---------- Event wiring ---------- */
  function bindEvents() {
    // Tabs
    document.querySelectorAll(".fb-tab").forEach((btn) => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });

    // Feedback filters
    const fbSearch = document.getElementById("fbFeedbackSearch");
    const fbRating = document.getElementById("fbFeedbackRating");
    const fbSort = document.getElementById("fbFeedbackSort");

    if (fbSearch) {
      fbSearch.addEventListener("input", debounce(() => {
        state.filters.feedback.search = fbSearch.value.trim();
        renderFeedback();
      }));
    }
    if (fbRating) {
      fbRating.addEventListener("change", () => {
        state.filters.feedback.rating = fbRating.value;
        renderFeedback();
      });
    }
    if (fbSort) {
      fbSort.addEventListener("change", () => {
        state.filters.feedback.sort = fbSort.value;
        renderFeedback();
      });
    }

    // Help filters
    const hSearch = document.getElementById("fbHelpSearch");
    const hCategory = document.getElementById("fbHelpCategory");
    const hStatus = document.getElementById("fbHelpStatus");
    const hSort = document.getElementById("fbHelpSort");

    if (hSearch) {
      hSearch.addEventListener("input", debounce(() => {
        state.filters.help.search = hSearch.value.trim();
        renderHelp();
      }));
    }
    if (hCategory) {
      hCategory.addEventListener("change", () => {
        state.filters.help.category = hCategory.value;
        renderHelp();
      });
    }
    if (hStatus) {
      hStatus.addEventListener("change", () => {
        state.filters.help.status = hStatus.value;
        renderHelp();
      });
    }
    if (hSort) {
      hSort.addEventListener("change", () => {
        state.filters.help.sort = hSort.value;
        renderHelp();
      });
    }

    // Load more
    const fbMore = document.getElementById("fbFeedbackLoadMore");
    if (fbMore) fbMore.addEventListener("click", () => loadFeedback(true));
    const hMore = document.getElementById("fbHelpLoadMore");
    if (hMore) hMore.addEventListener("click", () => loadHelp(true));

    // Refresh / export
    const refreshBtn = document.getElementById("fbRefreshBtn");
    if (refreshBtn) refreshBtn.addEventListener("click", refreshAll);
    const exportBtn = document.getElementById("fbExportBtn");
    if (exportBtn) exportBtn.addEventListener("click", exportCsv);

    // Drawer close (backdrop + X)
    document.querySelectorAll("[data-close-drawer]").forEach((el) => {
      el.addEventListener("click", closeDrawer);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });
  }

  /* ---------- Init ---------- */
  function init() {
    bindEvents();
    // Kick both loads in parallel so stats + tab counts populate
    loadFeedback();
    loadHelp();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
