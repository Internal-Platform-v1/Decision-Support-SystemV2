/* ============================================================
   DSS V2 — SHARED FOOTER BEHAVIOR
   Feedback + Get Help (New Request / My Requests)
   No auth — Firestore rules allow public read/write.
   ============================================================ */

(function () {
  "use strict";

  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDjaMdeh0Cgx00hzDyZOi54fDkR81wnxJU",
    authDomain: "bdgg-database.firebaseapp.com",
    projectId: "bdgg-database",
    storageBucket: "bdgg-database.appspot.com",
    messagingSenderId: "43574975434",
    appId: "1:43574975434:web:4c79e581267fdfcc6ccd33"
  };

  const FIREBASE_SCRIPTS = [
    "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js",
    "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js"
  ];

  const STORAGE_IDS = "dss_help_ids";
  const STORAGE_SEEN = "dss_help_seen";

  const ratingLabels = {
    1: "Poor",
    2: "Needs improvement",
    3: "Good",
    4: "Very good",
    5: "Excellent"
  };

  const statusLabels = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed"
  };

  let selectedRating = 0;
  let activeModal = null;
  let lastFocusedElement = null;
  let firebaseReadyPromise = null;
  let initialized = false;

  /* ---------- Firebase loader ---------- */
  function getFirebase() {
    return typeof window.firebase !== "undefined" ? window.firebase : null;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      const existing = document.querySelector('script[src="' + src + '"]');
      if (existing && existing.dataset.fbLoaded === "1") {
        resolve();
        return;
      }

      const script = existing || document.createElement("script");
      if (!existing) {
        script.src = src;
        script.async = true;
        document.head.appendChild(script);
      }

      script.addEventListener("load", function () {
        script.dataset.fbLoaded = "1";
        resolve();
      }, { once: true });

      script.addEventListener("error", function () {
        reject(new Error("Unable to load " + src));
      }, { once: true });
    });
  }

  function ensureFirebase() {
    if (firebaseReadyPromise) return firebaseReadyPromise;

    firebaseReadyPromise = (async function () {
      try {
        if (!getFirebase()) await loadScript(FIREBASE_SCRIPTS[0]);
        if (!getFirebase()) throw new Error("Firebase SDK is unavailable.");
        if (typeof firebase.firestore !== "function") await loadScript(FIREBASE_SCRIPTS[1]);
        if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
        return firebase;
      } catch (error) {
        firebaseReadyPromise = null;
        throw error;
      }
    })();

    return firebaseReadyPromise;
  }

  /* ---------- Date helpers ---------- */
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
    if (!date) return "";
    const diffMs = Date.now() - date.getTime();
    const min = Math.floor(diffMs / 60000);
    if (min < 1) return "Just now";
    if (min < 60) return min + "m ago";
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return hrs + "h ago";
    const days = Math.floor(hrs / 24);
    if (days < 7) return days + "d ago";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ---------- localStorage helpers ---------- */
  function getStoredHelpIds() {
    try {
      const raw = localStorage.getItem(STORAGE_IDS);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.filter(Boolean) : [];
    } catch (_) {
      return [];
    }
  }

  function saveHelpId(id) {
    if (!id) return;
    const ids = getStoredHelpIds();
    if (ids.includes(id)) return;
    ids.unshift(id);
    try {
      localStorage.setItem(STORAGE_IDS, JSON.stringify(ids.slice(0, 50)));
    } catch (_) { /* storage full or blocked — ignore */ }
  }

  function getSeenMap() {
    try {
      const raw = localStorage.getItem(STORAGE_SEEN);
      const obj = raw ? JSON.parse(raw) : {};
      return obj && typeof obj === "object" ? obj : {};
    } catch (_) {
      return {};
    }
  }

  function markAsSeen(ids) {
    if (!ids || !ids.length) return;
    const seen = getSeenMap();
    const now = Date.now();
    ids.forEach(function (id) { seen[id] = now; });
    try {
      localStorage.setItem(STORAGE_SEEN, JSON.stringify(seen));
    } catch (_) { /* ignore */ }
  }

  function isUnread(doc) {
    if (!doc.adminReply) return false;
    const seenAt = getSeenMap()[doc.id] || 0;
    const repliedAt = doc.adminReplyAt ? doc.adminReplyAt.getTime() : 0;
    return repliedAt > seenAt;
  }

  /* ---------- UI helpers ---------- */
  function getPageContext() {
    const pageTitle =
      document.title ||
      document.querySelector("h1")?.textContent?.trim() ||
      "DSS V2";
    return {
      page: window.location.pathname || "/",
      pageTitle: pageTitle.trim()
    };
  }

  function setStatus(elementId, message, type) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.hidden = !message;
    el.textContent = message;
    el.className = "modal-status" + (type ? " " + type : "");
  }

  function setButtonLoading(button, loading, loadingText) {
    if (!button) return;
    if (loading) {
      button.dataset.originalText = button.querySelector("span")?.textContent || "";
      button.disabled = true;
      const span = button.querySelector("span");
      if (span) span.textContent = loadingText || "Sending...";
    } else {
      button.disabled = false;
      const span = button.querySelector("span");
      if (span && button.dataset.originalText) span.textContent = button.dataset.originalText;
    }
  }

  function openModal(modalId, trigger) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    lastFocusedElement = trigger || document.activeElement;
    activeModal = modal;

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("footer-modal-open");

    requestAnimationFrame(function () {
      modal.classList.add("is-open");
    });

    const firstFocusable = modal.querySelector("button, input, textarea, select");
    if (firstFocusable) {
      setTimeout(function () { firstFocusable.focus(); }, 30);
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.classList.add("is-closing");
    modal.setAttribute("aria-hidden", "true");

    setTimeout(function () {
      modal.hidden = true;
      modal.classList.remove("is-closing");
    }, 210);

    document.body.classList.remove("footer-modal-open");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      setTimeout(function () { lastFocusedElement.focus(); }, 20);
    }

    activeModal = null;
  }

  function resetFeedbackForm() {
    const form = document.getElementById("feedbackForm");
    if (form) form.reset();

    selectedRating = 0;

    document.querySelectorAll(".rating-star").forEach(function (star) {
      star.classList.remove("is-selected");
      star.setAttribute("aria-checked", "false");
    });

    const caption = document.getElementById("ratingCaption");
    if (caption) caption.textContent = "Select a rating";

    const count = document.getElementById("feedbackCharCount");
    if (count) count.textContent = "0/1000";

    setStatus("feedbackStatus", "", "");
  }

  function resetHelpForm() {
    const form = document.getElementById("helpForm");
    if (form) form.reset();

    const count = document.getElementById("helpCharCount");
    if (count) count.textContent = "0/1500";

    setStatus("helpStatus", "", "");
  }

  /* ---------- Rating ---------- */
  function setupRating() {
    const stars = Array.from(document.querySelectorAll(".rating-star"));
    stars.forEach(function (star) {
      star.addEventListener("mouseenter", function () {
        const value = Number(star.dataset.rating || 0);
        stars.forEach(function (item) {
          item.classList.toggle("is-selected", Number(item.dataset.rating || 0) <= value);
        });
      });

      star.addEventListener("mouseleave", function () {
        stars.forEach(function (item) {
          item.classList.toggle("is-selected", Number(item.dataset.rating || 0) <= selectedRating);
        });
      });

      star.addEventListener("click", function () {
        selectedRating = Number(star.dataset.rating || 0);
        stars.forEach(function (item) {
          const value = Number(item.dataset.rating || 0);
          const selected = value <= selectedRating;
          item.classList.toggle("is-selected", selected);
          item.setAttribute("aria-checked", String(value === selectedRating));
        });
        const caption = document.getElementById("ratingCaption");
        if (caption) caption.textContent = ratingLabels[selectedRating] || "Selected";
        setStatus("feedbackStatus", "", "");
      });
    });
  }

  /* ---------- Character counters ---------- */
  function setupCharacterCounter(textareaId, counterId, max) {
    const textarea = document.getElementById(textareaId);
    const counter = document.getElementById(counterId);
    if (!textarea || !counter) return;

    function update() {
      counter.textContent = String(textarea.value.length) + "/" + String(max);
    }
    textarea.addEventListener("input", update);
    update();
  }

  /* ---------- Firestore error copy ---------- */
  function describeFirestoreError(error) {
    if (!error) return "Unable to complete the request right now.";
    console.error("DSS V2 footer Firestore error:", error);

    const code = String(error.code || "").toLowerCase();
    if (code.includes("permission-denied")) return "The request reached Firestore, but permission was denied. Please contact the DSS administrator.";
    if (code.includes("failed-precondition") && String(error.message || "").toLowerCase().includes("offline")) return "The DSS connection is currently offline. Please check your connection and try again.";
    if (code.includes("unavailable")) return "Firestore is temporarily unavailable. Please try again in a moment.";
    if (code.includes("network")) return "The network connection is unavailable. Please try again.";
    return "Unable to send this request right now. Please try again.";
  }

  /* ---------- Submit: feedback ---------- */
  async function sendFeedback(event) {
    event.preventDefault();

    const statusId = "feedbackStatus";
    const button = document.getElementById("sendFeedbackBtn");
    const comment = document.getElementById("feedbackText")?.value.trim() || "";
    const name = document.getElementById("feedbackName")?.value.trim() || "";

    if (!selectedRating) {
      setStatus(statusId, "Please select a rating first.", "error");
      return;
    }
    if (!comment) {
      setStatus(statusId, "Please enter your feedback.", "error");
      document.getElementById("feedbackText")?.focus();
      return;
    }

    setButtonLoading(button, true, "Sending...");

    try {
      const fb = await ensureFirebase();
      const page = getPageContext();

      await fb.firestore().collection("feedback").add({
        name: name,
        rating: selectedRating,
        comment: comment,
        page: page.page,
        pageTitle: page.pageTitle,
        createdAt: fb.firestore.FieldValue.serverTimestamp()
      });

      setStatus(statusId, "Thank you. Your feedback was sent successfully.", "success");
      setButtonLoading(button, false);

      setTimeout(function () {
        resetFeedbackForm();
        closeModal("feedbackModal");
      }, 900);
    } catch (error) {
      setButtonLoading(button, false);
      setStatus(statusId, describeFirestoreError(error), "error");
    }
  }

  /* ---------- Submit: help ---------- */
  async function sendHelpRequest(event) {
    event.preventDefault();

    const statusId = "helpStatus";
    const button = document.getElementById("sendHelpBtn");
    const name = document.getElementById("helpName")?.value.trim() || "";
    const category = document.getElementById("helpCategory")?.value.trim() || "";
    const subject = document.getElementById("helpSubject")?.value.trim() || "";
    const message = document.getElementById("helpMessage")?.value.trim() || "";

    if (!category) {
      setStatus(statusId, "Please select a help category.", "error");
      document.getElementById("helpCategory")?.focus();
      return;
    }
    if (!subject) {
      setStatus(statusId, "Please enter a subject.", "error");
      document.getElementById("helpSubject")?.focus();
      return;
    }
    if (!message) {
      setStatus(statusId, "Please describe the issue.", "error");
      document.getElementById("helpMessage")?.focus();
      return;
    }

    setButtonLoading(button, true, "Sending...");

    try {
      const fb = await ensureFirebase();
      const page = getPageContext();

      const ref = await fb.firestore().collection("help_requests").add({
        name: name,
        category: category,
        subject: subject,
        message: message,
        page: page.page,
        pageTitle: page.pageTitle,
        status: "open",
        createdAt: fb.firestore.FieldValue.serverTimestamp()
      });

      saveHelpId(ref.id);

      setStatus(statusId, "Your help request was sent successfully.", "success");
      setButtonLoading(button, false);

      setTimeout(function () {
        resetHelpForm();
        closeModal("helpModal");
      }, 900);
    } catch (error) {
      setButtonLoading(button, false);
      setStatus(statusId, describeFirestoreError(error), "error");
    }
  }

  /* ---------- Tabs ---------- */
  function openHelpTab(tab) {
    document.querySelectorAll(".help-tab").forEach(function (btn) {
      const isActive = btn.dataset.helpTab === tab;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    document.querySelectorAll("[data-help-panel]").forEach(function (panel) {
      panel.hidden = panel.dataset.helpPanel !== tab;
    });

    if (tab === "mine") loadMyRequests();
  }

  /* ---------- Load: my requests ---------- */
  async function loadMyRequests() {
    const list = document.getElementById("myRequestsList");
    if (!list) return;

    const ids = getStoredHelpIds();

    if (!ids.length) {
      list.innerHTML =
        '<div class="my-requests-empty">' +
          "<strong>No requests yet</strong>" +
          "You haven't submitted any help requests from this browser. " +
          "Use the New Request tab to send one." +
        "</div>";
      updateHelpBadge();
      return;
    }

    list.innerHTML = '<div class="my-requests-loading">Loading your requests…</div>';

    try {
      const fb = await ensureFirebase();
      const db = fb.firestore();

      const snap = await db.collection("help_requests")
        .where(fb.firestore.FieldPath.documentId(), "in", ids.slice(0, 30))
        .get();

      const items = snap.docs.map(function (doc) {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: toDate(data.createdAt),
          adminReplyAt: toDate(data.adminReplyAt)
        };
      });

      items.sort(function (a, b) {
        return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
      });

      if (!items.length) {
        list.innerHTML =
          '<div class="my-requests-empty">' +
            "<strong>No requests found</strong>" +
            "The requests stored in this browser are no longer available." +
          "</div>";
        updateHelpBadge();
        return;
      }

      list.innerHTML = items.map(renderMyRequestCard).join("");

      // Mark visible replies as read now that they've been shown
      markAsSeen(items.map(function (i) { return i.id; }));
      updateHelpBadge();
    } catch (error) {
      console.error("[footer] failed to load my requests:", error);
      list.innerHTML =
        '<div class="my-requests-empty">' +
          "<strong>Couldn't load your requests</strong>" +
          "Check your connection and try again." +
        "</div>";
    }
  }

  function renderMyRequestCard(item) {
    const status = statusLabels[item.status] ? item.status : "open";
    const statusText = statusLabels[status];
    const category = item.category || "Other";
    const subject = item.subject || "(no subject)";
    const message = item.message || "";
    const createdLabel = formatRelative(item.createdAt);

    let replyHtml = "";
    if (item.adminReply) {
      const repliedLabel = item.adminReplyAt ? formatRelative(item.adminReplyAt) : "";
      replyHtml =
        '<div class="my-request-reply">' +
          '<span class="my-request-reply-label">Reply from DSS team</span>' +
          "<p>" + escapeHtml(item.adminReply) + "</p>" +
          (repliedLabel ? '<span class="my-request-reply-time">' + escapeHtml(repliedLabel) + "</span>" : "") +
        "</div>";
    }

    return (
      '<article class="my-request-card">' +
        '<div class="my-request-card-head">' +
          '<div class="my-request-card-title">' + escapeHtml(subject) + "</div>" +
          '<span class="my-request-card-date">' + escapeHtml(createdLabel) + "</span>" +
        "</div>" +
        '<div class="my-request-card-meta">' +
          '<span class="my-request-category">' + escapeHtml(category) + "</span>" +
          '<span class="my-request-status is-' + status + '">' + escapeHtml(statusText) + "</span>" +
        "</div>" +
        '<p class="my-request-card-message">' + escapeHtml(message) + "</p>" +
        replyHtml +
      "</article>"
    );
  }

  /* ---------- Badge on footer + tab ---------- */
  async function updateHelpBadge() {
    const tabBadge = document.getElementById("helpTabBadge");
    const footerBadge = document.getElementById("footerHelpBadge");

    function setBadge(count) {
      [tabBadge, footerBadge].forEach(function (el) {
        if (!el) return;
        if (count > 0) {
          el.textContent = String(count);
          el.hidden = false;
        } else {
          el.hidden = true;
        }
      });
    }

    const ids = getStoredHelpIds();
    if (!ids.length) {
      setBadge(0);
      return;
    }

    try {
      const fb = await ensureFirebase();
      const db = fb.firestore();

      const snap = await db.collection("help_requests")
        .where(fb.firestore.FieldPath.documentId(), "in", ids.slice(0, 30))
        .get();

      let count = 0;
      snap.docs.forEach(function (doc) {
        const data = doc.data();
        if (!data.adminReply) return;
        const seenAt = getSeenMap()[doc.id] || 0;
        const repliedAt = data.adminReplyAt?.toDate
          ? data.adminReplyAt.toDate().getTime()
          : 0;
        if (repliedAt > seenAt) count += 1;
      });

      setBadge(count);
    } catch (error) {
      console.warn("[footer] badge update failed:", error);
      setBadge(0);
    }
  }

  /* ---------- Focus trap ---------- */
  function trapFocus(event) {
    if (!activeModal || event.key !== "Tab") return;

    const focusables = Array.from(
      activeModal.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])'
      )
    ).filter(function (element) {
      return element.offsetParent !== null;
    });

    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape" && activeModal) {
      closeModal(activeModal.id);
      return;
    }
    trapFocus(event);
  }

  /* ---------- Wire it all up ---------- */
  function setupModalEvents() {
    const feedbackBtn = document.getElementById("footerFeedbackBtn");
    const helpBtn = document.getElementById("footerHelpBtn");

    if (feedbackBtn) {
      feedbackBtn.addEventListener("click", function () {
        resetFeedbackForm();
        openModal("feedbackModal", feedbackBtn);
      });
    }

    if (helpBtn) {
      helpBtn.addEventListener("click", function () {
        resetHelpForm();
        openHelpTab("new");
        openModal("helpModal", helpBtn);
      });
    }

    document.querySelectorAll("[data-close-modal]").forEach(function (element) {
      element.addEventListener("click", function () {
        closeModal(element.dataset.closeModal);
      });
    });

    // Tabs
    document.querySelectorAll(".help-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openHelpTab(btn.dataset.helpTab);
      });
    });

    const feedbackForm = document.getElementById("feedbackForm");
    if (feedbackForm) feedbackForm.addEventListener("submit", sendFeedback);

    const helpForm = document.getElementById("helpForm");
    if (helpForm) helpForm.addEventListener("submit", sendHelpRequest);

    document.addEventListener("keydown", handleKeydown);
  }

  function init() {
    if (initialized) return;
    initialized = true;

    setupModalEvents();
    setupRating();
    setupCharacterCounter("feedbackText", "feedbackCharCount", 1000);
    setupCharacterCounter("helpMessage", "helpCharCount", 1500);

    // Background check for unread admin replies
    updateHelpBadge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  document.addEventListener("footerLoaded", function () {
    init();
  }, { once: true });

})();
