/* ============================================================
   ADMIN ANNOUNCEMENTS MANAGEMENT
   Firestore: collection "announcements"
   Each category has its own doc id: general, whats_new, reminders, issues, guides
   ============================================================ */

(() => {
  "use strict";

  const COLLECTION = "announcements";

  const CATEGORIES = [
    { key: "general",   label: "📢 Announcements",       defaultEyebrow: "SYSTEM UPDATE" },
    { key: "whats_new", label: "✨ What's New?",         defaultEyebrow: "WHAT'S NEW" },
    { key: "reminders", label: "⚠ Important Reminders",  defaultEyebrow: "IMPORTANT REMINDER" },
    { key: "issues",    label: "🐞 Known Issues",        defaultEyebrow: "KNOWN ISSUE" },
    { key: "guides",    label: "📚 New Guides Added",    defaultEyebrow: "NEW GUIDES" }
  ];

  const DEFAULTS = {
    general:   { eyebrow: "SYSTEM UPDATE",      title: "EBS System Maintenance",           date: "May 25, 2025 from 1:00 AM – 5:00 AM PST.", message: "Some EBS features may be unavailable during this time.\nPlease plan your tasks accordingly.", button: "View All Updates" },
    whats_new: { eyebrow: "WHAT'S NEW",         title: "New Feature Release",              date: "Available now",                            message: "Explore the latest features added to the Decision Support System.",                          button: "See What's New" },
    reminders: { eyebrow: "IMPORTANT REMINDER", title: "Action Required",                  date: "Please review before the deadline.",       message: "Make sure you're aware of the latest policies and requirements.",                            button: "View Reminder" },
    issues:    { eyebrow: "KNOWN ISSUE",        title: "System Issue Being Investigated",  date: "Reported recently",                        message: "We are aware of the issue and are working on a fix.",                                         button: "View Details" },
    guides:    { eyebrow: "NEW GUIDES",         title: "New Guides Available",             date: "Recently added",                           message: "Check out the newly published guides and resources.",                                        button: "Browse New Guides" }
  };

  const state = {
    posts: {},             // { [catKey]: data }
    activeCat: null,       // currently selected category key
    isNew: false,
    saving: false,
    filter: ""
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

  function categoryLabel(key) {
    const c = CATEGORIES.find(c => c.key === key);
    return c ? c.label : key;
  }

  /* ------------------------------------------------------------
     Load all docs
     ------------------------------------------------------------ */
  async function loadAllPosts() {
    const db = firestore();
    if (!db) {
      showToast("Firestore is not initialized.", true);
      renderPostList();
      return;
    }

    try {
      const results = await Promise.all(
        CATEGORIES.map(c => db.collection(COLLECTION).doc(c.key).get().catch(() => null))
      );

      state.posts = {};
      results.forEach((snap, i) => {
        const catKey = CATEGORIES[i].key;
        if (snap && snap.exists) {
          const data = snap.data() || {};
          state.posts[catKey] = {
            eyebrow: data.eyebrow || DEFAULTS[catKey].eyebrow,
            title:   data.title   || DEFAULTS[catKey].title,
            date:    data.date    || DEFAULTS[catKey].date,
            message: data.message || DEFAULTS[catKey].message,
            button:  data.button  || DEFAULTS[catKey].button,
            exists:  true,
            updatedAt: data.updatedAt || null
          };
        } else {
          state.posts[catKey] = {
            ...DEFAULTS[catKey],
            exists: false
          };
        }
      });

      renderPostList();
    } catch (err) {
      console.error(err);
      showToast("Unable to load announcements.", true);
    }
  }

  /* ------------------------------------------------------------
     Render list
     ------------------------------------------------------------ */
  function renderPostList() {
    const list = $("atPostList");
    const count = $("atPostCount");
    const title = $("atLeftTitle");
    if (!list) return;

    const filter = state.filter;
    const entries = CATEGORIES
      .filter(c => !filter || c.key === filter)
      .map(c => ({ cat: c, data: state.posts[c.key] }));

    if (title) title.textContent = filter ? categoryLabel(filter) : "All Announcements";
    if (count) count.textContent = `${entries.length} post${entries.length === 1 ? "" : "s"}`;

    if (!entries.length) {
      list.innerHTML = `<p class="at-empty">No announcements posted yet. Click "New Announcement" to create one.</p>`;
      return;
    }

    list.innerHTML = entries.map(({ cat, data }) => {
      const isActive = state.activeCat === cat.key && !state.isNew;
      return `
        <button type="button" class="at-post-item${isActive ? " is-active" : ""}" data-cat="${esc(cat.key)}">
          <strong>${esc(data.title || "(Untitled)")}</strong>
          <small>${esc(data.message || "").slice(0, 80)}${(data.message || "").length > 80 ? "…" : ""}</small>
          <span class="at-post-tag">${esc(cat.label)}</span>
          <div class="at-post-meta">
            <span><i class="fa-regular fa-calendar"></i> ${esc(data.date || "—")}</span>
            ${data.exists ? `<span><i class="fa-solid fa-circle" style="color:#18a558;font-size:7px;"></i> Published</span>` : `<span><i class="fa-regular fa-circle" style="color:#8b95a7;font-size:7px;"></i> Not saved</span>`}
          </div>
        </button>
      `;
    }).join("");

    list.querySelectorAll("[data-cat]").forEach(btn => {
      btn.addEventListener("click", () => selectPost(btn.dataset.cat));
    });
  }

  /* ------------------------------------------------------------
     Select a post for editing
     ------------------------------------------------------------ */
  function selectPost(catKey) {
    state.activeCat = catKey;
    state.isNew = false;

    const data = state.posts[catKey];
    if (!data) return;

    fillEditor({
      ...data,
      category: catKey
    });

    const editorTitle = $("atEditorTitle");
    const editorSubtitle = $("atEditorSubtitle");
    const editorEyebrow = $("atEditorEyebrow");
    const deleteBtn = $("atDelete");

    if (editorTitle) editorTitle.textContent = data.title || "(Untitled)";
    if (editorSubtitle) editorSubtitle.textContent = categoryLabel(catKey);
    if (editorEyebrow) editorEyebrow.textContent = "EDIT ANNOUNCEMENT";
    if (deleteBtn) deleteBtn.hidden = !data.exists;

    showEditor(true);
    renderPostList();
  }

  /* ------------------------------------------------------------
     New announcement
     ------------------------------------------------------------ */
  function startNew() {
    state.isNew = true;
    state.activeCat = null;

    fillEditor({
      category: "general",
      eyebrow: DEFAULTS.general.eyebrow,
      title: "",
      date: "",
      message: "",
      button: ""
    });

    const editorTitle = $("atEditorTitle");
    const editorSubtitle = $("atEditorSubtitle");
    const editorEyebrow = $("atEditorEyebrow");
    const deleteBtn = $("atDelete");
    const docIds = $("atDocIds");

    if (editorTitle) editorTitle.textContent = "New Announcement";
    if (editorSubtitle) editorSubtitle.textContent = "Fill in the fields below and click Save.";
    if (editorEyebrow) editorEyebrow.textContent = "CREATE ANNOUNCEMENT";
    if (deleteBtn) deleteBtn.hidden = true;
    if (docIds) docIds.textContent = "";

    showEditor(true);
    renderPostList();
  }

  /* ------------------------------------------------------------
     Editor fill / read
     ------------------------------------------------------------ */
  function fillEditor(data) {
    if ($("atCategory")) $("atCategory").value = data.category || "general";
    if ($("atEyebrow"))  $("atEyebrow").value  = data.eyebrow || "";
    if ($("atTitle"))    $("atTitle").value    = data.title   || "";
    if ($("atDate"))     $("atDate").value     = data.date    || "";
    if ($("atMessage"))  $("atMessage").value  = data.message || "";
    if ($("atButton"))   $("atButton").value   = data.button  || "";
  }

  function readEditor() {
    return {
      category: ($("atCategory")?.value || "general"),
      eyebrow:  ($("atEyebrow")?.value || "").trim(),
      title:    ($("atTitle")?.value || "").trim(),
      date:     ($("atDate")?.value || "").trim(),
      message:  ($("atMessage")?.value || "").trim(),
      button:   ($("atButton")?.value || "").trim()
    };
  }

  function showEditor(show) {
    const body = $("atEditorBody");
    const ph = $("atEditorPlaceholder");
    if (body) body.hidden = !show;
    if (ph) ph.hidden = show;
  }

  /* ------------------------------------------------------------
     Save
     ------------------------------------------------------------ */
  async function savePost() {
    if (state.saving) return;

    const db = firestore();
    if (!db) { showToast("Firestore is not initialized.", true); return; }

    const data = readEditor();
    if (!data.title) { showToast("Title is required.", true); return; }
    if (!data.category) { showToast("Category is required.", true); return; }

    state.saving = true;
    const btn = $("atSave");
    if (btn) btn.disabled = true;

    try {
      const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection(COLLECTION).doc(data.category).set({
        category: data.category,
        eyebrow: data.eyebrow,
        title: data.title,
        date: data.date,
        message: data.message,
        button: data.button,
        updatedAt: serverTimestamp
      }, { merge: true });

      // Update local state
      state.posts[data.category] = {
        eyebrow: data.eyebrow,
        title: data.title,
        date: data.date,
        message: data.message,
        button: data.button,
        exists: true,
        updatedAt: new Date()
      };

      state.activeCat = data.category;
      state.isNew = false;

      renderPostList();
      selectPost(data.category);
      showToast("Announcement saved.");
    } catch (err) {
      console.error(err);
      showToast(
        err.code === "permission-denied"
          ? "Firestore denied the save."
          : "Unable to save announcement.",
        true
      );
    } finally {
      state.saving = false;
      if (btn) btn.disabled = false;
    }
  }

  /* ------------------------------------------------------------
     Delete
     ------------------------------------------------------------ */
  async function deletePost() {
    if (!state.activeCat || state.isNew) return;
    if (!confirm("Delete this announcement? The banner will revert to the default content for this category.")) return;

    const db = firestore();
    if (!db) { showToast("Firestore is not initialized.", true); return; }

    const catKey = state.activeCat;

    try {
      await db.collection(COLLECTION).doc(catKey).delete();

      // Revert to default in local state
      state.posts[catKey] = {
        ...DEFAULTS[catKey],
        exists: false
      };

      state.activeCat = null;
      state.isNew = false;

      showEditor(false);
      const editorTitle = $("atEditorTitle");
      const editorSubtitle = $("atEditorSubtitle");
      if (editorTitle) editorTitle.textContent = "No announcement selected";
      if (editorSubtitle) editorSubtitle.textContent = "Select an announcement on the left, or create a new one.";
      const deleteBtn = $("atDelete");
      if (deleteBtn) deleteBtn.hidden = true;

      renderPostList();
      showToast("Announcement deleted.");
    } catch (err) {
      console.error(err);
      showToast(
        err.code === "permission-denied"
          ? "Firestore denied the delete."
          : "Unable to delete announcement.",
        true
      );
    }
  }

  /* ------------------------------------------------------------
     Reset editor to last saved values
     ------------------------------------------------------------ */
  function resetEditor() {
    if (state.isNew) {
      startNew();
      return;
    }
    if (!state.activeCat) return;

    const data = state.posts[state.activeCat];
    if (!data) return;

    fillEditor({
      ...data,
      category: state.activeCat
    });
    showToast("Editor reset to last saved values.");
  }

  /* ------------------------------------------------------------
     Bind UI
     ------------------------------------------------------------ */
  function init() {
    // Filter select
    const filterSelect = $("atCategoryFilter");
    if (filterSelect) {
      filterSelect.addEventListener("change", () => {
        state.filter = filterSelect.value;
        renderPostList();
      });
    }

    // New announcement button
    const addBtn = $("atAddNew");
    if (addBtn) addBtn.addEventListener("click", startNew);

    // Save / Reset / Delete
    const saveBtn = $("atSave");
    if (saveBtn) saveBtn.addEventListener("click", savePost);

    const resetBtn = $("atReset");
    if (resetBtn) resetBtn.addEventListener("click", resetEditor);

    const deleteBtn = $("atDelete");
    if (deleteBtn) deleteBtn.addEventListener("click", deletePost);

    // Load data
    loadAllPosts();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
