/* ============================================================
   ADMIN ANNOUNCEMENTS MANAGEMENT
   ============================================================ */

(() => {
  "use strict";

  const COLLECTION = "announcements";
  const CATEGORIES = ["general", "whats_new", "reminders", "issues", "guides"];

  const CATEGORY_LABELS = {
    general:   "📢 Announcements",
    whats_new: "✨ What's New?",
    reminders: "⚠ Important Reminders",
    issues:    "🐞 Known Issues",
    guides:    "📚 New Guides Added"
  };

  const DEFAULTS = {
    general: {
      eyebrow: "SYSTEM UPDATE",
      title: "EBS System Maintenance",
      date: "May 25, 2025 from 1:00 AM – 5:00 AM PST.",
      message: "Some EBS features may be unavailable during this time.\nPlease plan your tasks accordingly.",
      button: "View All Updates"
    },
    whats_new: {
      eyebrow: "WHAT'S NEW",
      title: "New Feature Release",
      date: "Available now",
      message: "Explore the latest features added to the Decision Support System.",
      button: "See What's New"
    },
    reminders: {
      eyebrow: "IMPORTANT REMINDER",
      title: "Action Required",
      date: "Please review before the deadline.",
      message: "Make sure you're aware of the latest policies and requirements.",
      button: "View Reminder"
    },
    issues: {
      eyebrow: "KNOWN ISSUE",
      title: "System Issue Being Investigated",
      date: "Reported on May 20, 2025",
      message: "We are aware of the issue and are working on a fix. We apologize for any inconvenience.",
      button: "View Details"
    },
    guides: {
      eyebrow: "NEW GUIDES",
      title: "New Guides Available",
      date: "Recently added",
      message: "Check out the newly published guides and resources.",
      button: "Browse New Guides"
    }
  };

  const state = {
    activeCategory: "general",
    saving: false,
    loaded: {}
  };

  const $ = id => document.getElementById(id);

  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  function showToast(message, isError) {
    const t = $("atToast");
    if (!t) return;
    t.textContent = message;
    t.classList.toggle("error", !!isError);
    t.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => t.classList.remove("show"), 2600);
  }

  function firestore() {
    if (window.firebase && firebase.apps && firebase.apps.length) {
      return window.db || firebase.firestore();
    }
    return null;
  }

  /* ------------------------------------------------------------
     Category selection
     ------------------------------------------------------------ */
  function setActiveCategory(cat) {
    state.activeCategory = cat;

    document.querySelectorAll(".at-rec-item").forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.cat === cat);
    });

    const title = $("atEditorTitle");
    if (title) title.textContent = CATEGORY_LABELS[cat] || cat;

    const docIds = $("atDocIds");
    if (docIds) docIds.textContent = `Firestore: ${COLLECTION}/${cat}`;

    const select = $("atCategorySelect");
    if (select && select.value !== cat) select.value = cat;

    loadCategory(cat);
  }

  /* ------------------------------------------------------------
     Load from Firestore
     ------------------------------------------------------------ */
  async function loadCategory(cat) {
    const db = firestore();
    if (!db) {
      showToast("Firestore is not initialized.", true);
      fillEditor(DEFAULTS[cat]);
      return;
    }

    // Show cached data if we have it
    if (state.loaded[cat]) {
      fillEditor(state.loaded[cat]);
    } else {
      fillEditor(DEFAULTS[cat]);
    }

    try {
      const doc = await db.collection(COLLECTION).doc(cat).get();
      if (doc.exists) {
        const data = doc.data() || {};
        const merged = {
          eyebrow: data.eyebrow || DEFAULTS[cat].eyebrow,
          title:   data.title   || DEFAULTS[cat].title,
          date:    data.date    || DEFAULTS[cat].date,
          message: data.message || DEFAULTS[cat].message,
          button:  data.button  || DEFAULTS[cat].button
        };
        state.loaded[cat] = merged;
        fillEditor(merged);
      } else {
        state.loaded[cat] = { ...DEFAULTS[cat] };
      }
    } catch (err) {
      console.warn("[Announcements] load failed:", err.code || err.message);
    }
  }

  function fillEditor(data) {
    if (!data) return;
    if ($("atEyebrow")) $("atEyebrow").value = data.eyebrow || "";
    if ($("atTitle"))   $("atTitle").value   = data.title   || "";
    if ($("atDate"))    $("atDate").value    = data.date    || "";
    if ($("atMessage")) $("atMessage").value = data.message || "";
    if ($("atButton"))  $("atButton").value  = data.button  || "";
  }

  function readEditor() {
    return {
      eyebrow: ($("atEyebrow")?.value || "").trim(),
      title:   ($("atTitle")?.value || "").trim(),
      date:    ($("atDate")?.value || "").trim(),
      message: ($("atMessage")?.value || "").trim(),
      button:  ($("atButton")?.value || "").trim()
    };
  }

  /* ------------------------------------------------------------
     Save to Firestore
     ------------------------------------------------------------ */
  async function saveCategory() {
    if (state.saving) return;

    const db = firestore();
    if (!db) { showToast("Firestore is not initialized.", true); return; }

    const cat = state.activeCategory;
    const data = readEditor();

    if (!data.title) {
      showToast("Title is required.", true);
      return;
    }

    state.saving = true;
    const btn = $("atSave");
    if (btn) btn.disabled = true;

    try {
      const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection(COLLECTION).doc(cat).set({
        category: cat,
        eyebrow: data.eyebrow,
        title: data.title,
        date: data.date,
        message: data.message,
        button: data.button,
        updatedAt: serverTimestamp
      }, { merge: true });

      state.loaded[cat] = { ...data };
      showToast(`${CATEGORY_LABELS[cat]} saved.`);
    } catch (err) {
      console.error(err);
      showToast(
        err.code === "permission-denied"
          ? "Firestore denied the save."
          : "Unable to save.",
        true
      );
    } finally {
      state.saving = false;
      if (btn) btn.disabled = false;
    }
  }

  function resetCategory() {
    const cat = state.activeCategory;
    fillEditor(state.loaded[cat] || DEFAULTS[cat]);
    showToast("Editor reset to last saved values.");
  }

  /* ------------------------------------------------------------
     Bind UI
     ------------------------------------------------------------ */
  function init() {
    document.querySelectorAll(".at-rec-item").forEach(btn => {
      btn.addEventListener("click", () => setActiveCategory(btn.dataset.cat));
    });

    const select = $("atCategorySelect");
    if (select) {
      select.addEventListener("change", () => setActiveCategory(select.value));
    }

    const saveBtn = $("atSave");
    if (saveBtn) saveBtn.addEventListener("click", saveCategory);

    const resetBtn = $("atReset");
    if (resetBtn) resetBtn.addEventListener("click", resetCategory);

    setActiveCategory("general");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
