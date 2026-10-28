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
    general:   { eyebrow: "Normal", title: "", date: "", message: "", button: "View All Updates" },
    whats_new: { eyebrow: "Normal", title: "", date: "", message: "", button: "See What's New" },
    reminders: { eyebrow: "Important", title: "", date: "", message: "", button: "View Reminder" },
    issues:    { eyebrow: "Urgent", title: "", date: "", message: "", button: "View Details" },
    guides:    { eyebrow: "Normal", title: "", date: "", message: "", button: "Browse New Guides" }
  };

  const state = {
    posts: [],           // Now an array of objects instead of a single object
    activeId: null,      // Tracks the unique Firestore ID
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
     Load posts (Fetches ALL documents in the collection)
     ------------------------------------------------------------ */
  async function loadAllPosts() {
    const db = firestore();
    if (!db) {
      showToast("Firestore is not initialized.", true);
      return;
    }

    try {
      const snap = await db.collection(COLLECTION).get();
      
      state.posts = [];
      snap.forEach(doc => {
        const data = doc.data();
        state.posts.push({
          id: doc.id,
          category: data.category || "general",
          eyebrow: data.eyebrow || "Normal",
          title: data.title || "(Untitled)",
          date: data.date || "",
          message: data.message || "",
          button: data.button || "",
          published: data.published === true,
          updatedAt: data.updatedAt || null,
          exists: true
        });
      });

      // Sort by newest first
      state.posts.sort((a, b) => {
        const timeA = a.updatedAt ? (a.updatedAt.toMillis ? a.updatedAt.toMillis() : new Date(a.updatedAt).getTime()) : 0;
        const timeB = b.updatedAt ? (b.updatedAt.toMillis ? b.updatedAt.toMillis() : new Date(b.updatedAt).getTime()) : 0;
        return timeB - timeA;
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

    // Filter the flat array of posts
    const entries = state.posts.filter(post => {
      if (fCat && post.category !== fCat) return false;
      if (fStatus === "published" && post.published !== true) return false;
      if (fStatus === "draft" && post.published === true) return false;
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

    list.innerHTML = entries.map((post) => {
      const isActive = state.activeId === post.id && !state.isNew;
      let statusClass = post.published ? "published" : "draft";
      let statusText = post.published ? "Published" : "Draft";

      const updated = post.updatedAt ? relativeTime(post.updatedAt) : "";
      return `
        <button type="button" class="at-post-item${isActive ? " is-active" : ""}" data-id="${esc(post.id)}">
          <strong>${esc(post.title)}</strong>
          <small>${esc((post.message || "").slice(0, 80))}${(post.message || "").length > 80 ? "…" : ""}</small>
          <div>
            <span class="at-post-tag">${esc(categoryLabel(post.category))}</span>
            <span class="at-post-status ${statusClass}">${statusText}</span>
          </div>
          <div class="at-post-meta">
            <span><i class="fa-regular fa-calendar"></i> ${esc(post.date || "—")}</span>
            ${updated ? `<span><i class="fa-regular fa-clock"></i> ${updated}</span>` : ""}
          </div>
        </button>
      `;
    }).join("");

    list.querySelectorAll("[data-id]").forEach(btn => {
      btn.addEventListener("click", () => selectPost(btn.dataset.id));
    });
  }

  /* ------------------------------------------------------------
     Select post
     ------------------------------------------------------------ */
  function selectPost(id) {
    state.activeId = id;
    state.isNew = false;

    const post = state.posts.find(p => p.id === id);
    if (!post) return;

    fillEditor(post);

    const editorTitle = $("atEditorTitle");
    const editorSubtitle = $("atEditorSubtitle");
    const editorEyebrow = $("atEditorEyebrow");
    const deleteBtn = $("atDelete");

    if (editorTitle) editorTitle.textContent = post.title || "(Untitled)";
    if (editorSubtitle) {
      const status = post.published ? "Published" : "Draft";
      editorSubtitle.textContent = `${categoryLabel(post.category)} · ${status}`;
    }
    if (editorEyebrow) editorEyebrow.textContent = "EDIT ANNOUNCEMENT";
    if (deleteBtn) deleteBtn.hidden = false;

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
    state.activeId = null;

    fillEditor({
      category: "general",
      eyebrow: "Normal",
      title: "",
      date: "",
      message: "",
      button: ""
    });

    const editorTitle = $("atEditorTitle");
    const editorSubtitle = $("atEditorSubtitle");
    const editorEyebrow = $("atEditorEyebrow");
    const deleteBtn = $("atDelete");

    if (editorTitle) editorTitle.textContent = "New Announcement";
    if (editorSubtitle) editorSubtitle.textContent = "Fill in the fields below and click Publish or Save Draft.";
    if (editorEyebrow) editorEyebrow.textContent = "CREATE ANNOUNCEMENT";
    if (deleteBtn) deleteBtn.hidden = true;

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

    let currentPriority = data.eyebrow || "Normal";
    if (!["Normal", "Important", "Urgent"].includes(currentPriority)) {
        currentPriority = "Normal";
    }
    
    if ($("atEyebrow")) $("atEyebrow").value = currentPriority;
    
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
    setCount("atMessage", "atMessageCount", 500);
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
      const payload = {
        category: data.category,
        eyebrow: data.eyebrow,
        title: data.title,
        date: data.date,
        message: data.message,
        button: data.button,
        published: publish === true,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      if (state.isNew) {
        // Generate a new unique document ID
        await db.collection(COLLECTION).add(payload);
      } else {
        // Update the existing document by its unique ID
        await db.collection(COLLECTION).doc(state.activeId).set(payload, { merge: true });
      }

      state.isNew = false;
      await loadAllPosts(); // Reload the list from database
      showToast(publish ? "Announcement published." : "Draft saved.");

    } catch (err) {
      console.error(err);
      showToast("Unable to save announcement.", true);
    } finally {
      state.saving = false;
      if (draftBtn) draftBtn.disabled = false;
      if (publishBtn) publishBtn.disabled = false;
    }
  }

  async function deletePost() {
    if (!state.activeId || state.isNew) return;
    if (!confirm("Delete this announcement?")) return;

    const db = firestore();
    if (!db) { showToast("Firestore is not initialized.", true); return; }

    try {
      await db.collection(COLLECTION).doc(state.activeId).delete();
      
      state.activeId = null;
      state.isNew = false;

      showEditor(false);
      const editorTitle = $("atEditorTitle");
      const editorSubtitle = $("atEditorSubtitle");
      if (editorTitle) editorTitle.textContent = "No announcement selected";
      if (editorSubtitle) editorSubtitle.textContent = "Select an announcement on the left, or create a new one.";
      
      const deleteBtn = $("atDelete");
      if (deleteBtn) deleteBtn.hidden = true;

      await loadAllPosts();
      showToast("Announcement deleted.");
    } catch (err) {
      console.error(err);
      showToast("Unable to delete announcement.", true);
    }
  }

  function resetEditor() {
    if (state.isNew) { startNew(); return; }
    if (!state.activeId) return;
    const post = state.posts.find(p => p.id === state.activeId);
    if (!post) return;
    fillEditor(post);
    updatePreview();
    updateCharCounts();
    showToast("Editor reset to last saved values.");
  }

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
