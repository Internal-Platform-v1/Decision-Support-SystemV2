/* ============================================================
   ADMIN ANNOUNCEMENTS MANAGEMENT
   ============================================================ */

(() => {
  "use strict";

  const COLLECTION = "announcements";

  const CATEGORIES = [
    { key: "general",   label: "📢 Announcements",       icon: "fa-solid fa-bullhorn" },
    { key: "whats_new", label: "✨ What's New?",         icon: "fa-solid fa-wand-magic-sparkles" },
    { key: "reminders", label: "⚠ Important Reminders",  icon: "fa-solid fa-triangle-exclamation" },
    { key: "issues",    label: "🐞 Known Issues",        icon: "fa-solid fa-bug" },
    { key: "guides",    label: "📚 New Guides Added",    icon: "fa-solid fa-book-open" }
  ];

  const DEFAULTS = {
    general:   { eyebrow: "SYSTEM UPDATE",      title: "EBS System Maintenance",          date: "May 25, 2025 from 1:00 AM – 5:00 AM PST.", message: "Some EBS features may be unavailable during this time.\nPlease plan your tasks accordingly.", button: "View All Updates" },
    whats_new: { eyebrow: "WHAT'S NEW",         title: "New Feature Release",             date: "Available now",                            message: "Explore the latest features added to the Decision Support System.",                          button: "See What's New" },
    reminders: { eyebrow: "IMPORTANT REMINDER", title: "Action Required",                 date: "Please review before the deadline.",       message: "Make sure you're aware of the latest policies and requirements.",                            button: "View Reminder" },
    issues:    { eyebrow: "KNOWN ISSUE",        title: "System Issue Being Investigated", date: "Reported recently",                        message: "We are aware of the issue and are working on a fix.",                                         button: "View Details" },
    guides:    { eyebrow: "NEW GUIDES",         title: "New Guides Available",            date: "Recently added",                           message: "Check out the newly published guides and resources.",                                        button: "Browse New Guides" }
  };

  const state = {
    posts: {},
    activeCat: null,
    isNew: false,
    saving: false,
    filterCategory: "",
    filterStatus: "all"
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

  function categoryIcon(key) {
    const c = CATEGORIES.find(c => c.key === key);
    return c ? c.icon : "fa-solid fa-bullhorn";
  }

  function relativeTime(ts) {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = Date.now() - date.getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return "just now";
    if (min < 60) return `${min}m ago`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  /* ------------------------------------------------------------
     Load posts
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
            published: data.published === true,
            updatedAt: data.updatedAt || null,
            exists:  true
          };
        } else {
          state.posts[catKey] = {
            ...DEFAULTS[catKey],
            published: false,
            updatedAt: null,
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

    const fCat = state.filterCategory;
    const fStatus = state.filterStatus;

    const entries = CATEGORIES
      .filter(c => !fCat || c.key === fCat)
      .map(c => ({ cat: c, data: state.posts[c.key] }))
      .filter(({ data }) => {
        if (fStatus === "published") return data.published === true;
        if (fStatus === "draft") return data.published !== true;
        return true;
      });

    if (title) {
      if (fCat) title.textContent = categoryLabel(fCat);
      else if (fStatus === "published") title.textContent = "Published";
      else if (fStatus === "draft") title.textContent = "Drafts";
      else title.textContent = "All Announcements";
    }
    if (count) count.textContent = `${entries.length} post${entries.length === 1 ? "" : "s"}`;

    if (!entries.length) {
      list.innerHTML = `<p class="at-empty">No announcements match this filter. Click "New Announcement" to create one.</p>`;
      return;
    }

    list.innerHTML = entries.map(({ cat, data }) => {
      const isActive = state.activeCat === cat.key && !state.isNew;
      let statusClass = "empty";
      let statusText = "Not saved";
      if (data.exists && data.published) { statusClass = "published"; statusText = "Published"; }
      else if (data.exists && !data.published) { statusClass = "draft"; statusText = "Draft"; }

      const updated = data.updatedAt ? relativeTime(data.updatedAt) : "";
      return `
        <button type="button" class="at-post-item${isActive ? " is-active" : ""}" data-cat="${esc(cat.key)}">
          <strong>${esc(data.title || "(Untitled)")}</strong>
          <small>${esc((data.message || "").slice(0, 80))}${(data.message || "").length > 80 ? "…" : ""}</small>
          <div>
            <span class="at-post-tag">${esc(cat.label)}</span>
            <span class="at-post-status ${statusClass}">${statusText}</span>
          </div>
          <div class="at-post-meta">
            <span><i class="fa-regular fa-calendar"></i> ${esc(data.date || "—")}</span>
            ${updated ? `<span><i class="fa-regular fa-clock"></i> ${updated}</span>` : ""}
          </div>
        </button>
      `;
    }).join("");

    list.querySelectorAll("[data-cat]").forEach(btn => {
      btn.addEventListener("click", () => selectPost(btn.dataset.cat));
    });
  }

  /* ------------------------------------------------------------
     Select post
     ------------------------------------------------------------ */
  function selectPost(catKey) {
    state.activeCat = catKey;
    state.isNew = false;

    const data = state.posts[catKey];
    if (!data) return;

    fillEditor({ ...data, category: catKey });

    const editorTitle = $("atEditorTitle");
    const editorSubtitle = $("atEditorSubtitle");
    const editorEyebrow = $("atEditorEyebrow");
    const deleteBtn = $("atDelete");

    if (editorTitle) editorTitle.textContent = data.title || "(Untitled)";
    if (editorSubtitle) {
      const status = data.exists ? (data.published ? "Published" : "Draft") : "Not saved";
      editorSubtitle.textContent = `${categoryLabel(catKey)} · ${status}`;
    }
    if (editorEyebrow) editorEyebrow.textContent = "EDIT ANNOUNCEMENT";
    if (deleteBtn) deleteBtn.hidden = !data.exists;

    showEditor(true);
    updatePreview();
    updateCharCounts();
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
    if (editorSubtitle) editorSubtitle.textContent = "Fill in the fields below and click Publish or Save Draft.";
    if (editorEyebrow) editorEyebrow.textContent = "CREATE ANNOUNCEMENT";
    if (deleteBtn) deleteBtn.hidden = true;
    if (docIds) docIds.textContent = "";

    showEditor(true);
    updatePreview();
    updateCharCounts();
    renderPostList();
  }

  /* ------------------------------------------------------------
     Fill / read editor
     ------------------------------------------------------------ */
  function fillEditor(data) {
    if ($("atCategory")) $("atCategory").value = data.category || "general";
    if ($("atTitle"))    $("atTitle").value    = data.title   || "";
    if ($("atDate"))     $("atDate").value     = data.date    || "";
    if ($("atMessage"))  $("atMessage").value  = data.message || "";
    if ($("atButton"))   $("atButton").value   = data.button  || "";

    // Handle the new Priority Pills
    let currentPriority = data.eyebrow || "Normal";
    // Fallback: If old data had "SYSTEM UPDATE", default to Normal
    if (!["Normal", "Important", "Urgent"].includes(currentPriority)) {
        currentPriority = "Normal";
    }
    
    if ($("atEyebrow")) $("atEyebrow").value = currentPriority;
    
    // Update the visual radio buttons
    document.querySelectorAll('.priority-pill').forEach(p => p.classList.remove('active'));
    const radio = document.querySelector(`input[name="priority"][value="${currentPriority}"]`);
    if (radio) {
        radio.checked = true;
        radio.closest('.priority-pill').classList.add('active');
    }
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
     Live preview
     ------------------------------------------------------------ */
  function updatePreview() {
    const data = readEditor();

    const icon = $("atPreviewIcon");
    if (icon) icon.className = categoryIcon(data.category);

    if ($("atPreviewEyebrow")) $("atPreviewEyebrow").textContent = data.eyebrow || "SYSTEM UPDATE";
    if ($("atPreviewTitle"))   $("atPreviewTitle").textContent   = data.title   || "(Title required)";
    
    // Format date nicely
    let displayDate = data.date || "—";
    if (data.date && data.date.includes("T")) {
      const dateObj = new Date(data.date);
      displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
                    " at " + 
                    dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    if ($("atPreviewDate")) $("atPreviewDate").textContent = displayDate;
    
    if ($("atPreviewMessage")) $("atPreviewMessage").textContent = data.message || "Message will appear here.";
  }

  /* ------------------------------------------------------------
     Character counts
     ------------------------------------------------------------ */
  function updateCharCounts() {
    setCount("atEyebrow", "atEyebrowCount", 24);
    setCount("atTitle", "atTitleCount", 60);
    setCount("atMessage", "atMessageCount", 500); // Changed from 180 to 500
    setCount("atButton", "atButtonCount", 24);
  }

  function setCount(inputId, countId, max) {
    const input = $(inputId);
    const el = $(countId);
    if (!input || !el) return;
    const len = input.value.length;
    el.textContent = `${len} / ${max}`;
    el.classList.toggle("is-warn", len >= max * 0.85 && len < max);
    el.classList.toggle("is-max", len >= max);
  }

  /* ------------------------------------------------------------
     Save / Publish
     ------------------------------------------------------------ */
  async function savePost(publish) {
    if (state.saving) return;

    const db = firestore();
    if (!db) { showToast("Firestore is not initialized.", true); return; }

    const data = readEditor();
    if (!data.title) { showToast("Title is required.", true); return; }
    if (!data.category) { showToast("Category is required.", true); return; }

    state.saving = true;
    const draftBtn = $("atSaveDraft");
    const publishBtn = $("atPublish");
    if (draftBtn) draftBtn.disabled = true;
    if (publishBtn) publishBtn.disabled = true;

    try {
      const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection(COLLECTION).doc(data.category).set({
        category: data.category,
        eyebrow: data.eyebrow,
        title: data.title,
        date: data.date,
        message: data.message,
        button: data.button,
        published: publish === true,
        updatedAt: serverTimestamp
      }, { merge: true });

      state.posts[data.category] = {
        eyebrow: data.eyebrow,
        title: data.title,
        date: data.date,
        message: data.message,
        button: data.button,
        published: publish === true,
        updatedAt: new Date(),
        exists: true
      };

      state.activeCat = data.category;
      state.isNew = false;

      renderPostList();
      selectPost(data.category);
      showToast(publish ? "Announcement published." : "Draft saved.");
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
      if (draftBtn) draftBtn.disabled = false;
      if (publishBtn) publishBtn.disabled = false;
    }
  }

  async function deletePost() {
    if (!state.activeCat || state.isNew) return;
    if (!confirm("Delete this announcement? The banner will revert to the default content for this category.")) return;

    const db = firestore();
    if (!db) { showToast("Firestore is not initialized.", true); return; }

    const catKey = state.activeCat;

    try {
      await db.collection(COLLECTION).doc(catKey).delete();

      state.posts[catKey] = { ...DEFAULTS[catKey], published: false, updatedAt: null, exists: false };

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

  function resetEditor() {
    if (state.isNew) { startNew(); return; }
    if (!state.activeCat) return;
    const data = state.posts[state.activeCat];
    if (!data) return;
    fillEditor({ ...data, category: state.activeCat });
    updatePreview();
    updateCharCounts();
    showToast("Editor reset to last saved values.");
  }

  /* ------------------------------------------------------------
     Bind
     ------------------------------------------------------------ */
  function bindLiveUpdates() {
    ["atEyebrow", "atTitle", "atDate", "atMessage", "atButton", "atCategory"].forEach(id => {
      const el = $(id);
      if (!el) return;
      el.addEventListener("input", () => {
        updatePreview();
        updateCharCounts();
      });
      el.addEventListener("change", () => {
        updatePreview();
      });
    });
  }

  function init() {
    const catFilter = $("atCategoryFilter");
    if (catFilter) {
      catFilter.addEventListener("change", () => {
        state.filterCategory = catFilter.value;
        renderPostList();
      });
    }

    const statusFilter = $("atStatusFilter");
    if (statusFilter) {
      statusFilter.addEventListener("change", () => {
        state.filterStatus = statusFilter.value;
        renderPostList();
      });
    }

    $("atAddNew")?.addEventListener("click", startNew);
    $("atSaveDraft")?.addEventListener("click", () => savePost(false));
    $("atPublish")?.addEventListener("click", () => savePost(true));
    $("atReset")?.addEventListener("click", resetEditor);
    $("atDelete")?.addEventListener("click", deletePost);

    bindLiveUpdates();
    loadAllPosts();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
