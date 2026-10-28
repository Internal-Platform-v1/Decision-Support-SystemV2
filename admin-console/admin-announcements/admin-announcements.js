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

  const TEMPLATES = {
    general:   { category: "general", eyebrow: "Normal", title: "System Maintenance Notice", message: "The system will be temporarily unavailable due to scheduled maintenance. We apologize for the inconvenience and appreciate your understanding.", button: "View All Updates" },
    whats_new: { category: "whats_new", eyebrow: "Normal", title: "New Feature Release", message: "Explore the latest features added to the Decision Support System.", button: "See What's New" },
    reminders: { category: "reminders", eyebrow: "Important", title: "Action Required", message: "Make sure you're aware of the latest policies and requirements.", button: "View Reminder" },
    issues:    { category: "issues", eyebrow: "Urgent", title: "System Issue Being Investigated", message: "We are aware of the issue and are working on a fix.", button: "View Details" },
    guides:    { category: "guides", eyebrow: "Normal", title: "New Guides Available", message: "Check out the newly published guides and resources.", button: "Browse New Guides" }
  };

  const state = {
    posts: [],
    activeId: null,
    isNew: false,
    saving: false,
    filterCategory: "",
    filterStatus: "all"
  };

  const $ = id => document.getElementById(id);
  let unsubscribePosts = null;

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

  function loadAllPosts() {
    const db = firestore();
    if (!db) {
      showToast("Firestore is not initialized.", true);
      return;
    }

    if (unsubscribePosts) unsubscribePosts();

    unsubscribePosts = db.collection(COLLECTION).onSnapshot(snap => {
      console.log(`[ADMIN] Live Database Sync. Total documents found: ${snap.size}`);
      
      state.posts = [];
      snap.forEach(doc => {
        const data = doc.data();
        
        // Robust type checking for published field
        const isPub = data.published === true || data.published === "true" || data.published === 1;

        state.posts.push({
          id: doc.id,
          category: data.category || "general",
          eyebrow: data.eyebrow || "Normal",
          title: data.title || "(Untitled)",
          date: typeof data.date === "string" ? data.date : "", // Prevent crashes if date is a timestamp
          message: data.message || "",
          button: data.button || "",
          published: isPub,
          updatedAt: data.updatedAt || null,
          exists: true
        });
      });

      state.posts.sort((a, b) => {
        const timeA = a.updatedAt ? (a.updatedAt.toMillis ? a.updatedAt.toMillis() : new Date(a.updatedAt).getTime()) : 0;
        const timeB = b.updatedAt ? (b.updatedAt.toMillis ? b.updatedAt.toMillis() : new Date(b.updatedAt).getTime()) : 0;
        return timeB - timeA;
      });

      renderPostList();
    }, err => {
      console.error("Snapshot error:", err);
      showToast("Unable to load announcements.", true);
    });
  }

  function renderPostList() {
    const list = $("atPostList");
    const count = $("atPostCount");
    const title = $("atLeftTitle");
    if (!list) return;

    const fCat = state.filterCategory;
    const fStatus = state.filterStatus;

    const entries = state.posts.filter(post => {
      if (fCat && post.category !== fCat) return false;
      if (fStatus === "published" && post.published !== true) return false;
      if (fStatus === "draft" && post.published === true) return false;
      return true;
    });

    console.log(`[ADMIN] Rendering ${entries.length} posts based on filters (Cat: '${fCat}', Status: '${fStatus}').`);

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

  function selectPost(id) {
    state.activeId = id;
    state.isNew = false;

    const post = state.posts.find(p => p.id === id);
    if (!post) return;

    fillEditor(post);

    if ($("atEditorTitle")) $("atEditorTitle").textContent = post.title || "(Untitled)";
    if ($("atEditorSubtitle")) {
      const status = post.published ? "Published" : "Draft";
      $("atEditorSubtitle").textContent = `${categoryLabel(post.category)} · ${status}`;
    }
    if ($("atEditorEyebrow")) $("atEditorEyebrow").textContent = "EDIT ANNOUNCEMENT";
    if ($("atDelete")) $("atDelete").hidden = false;
    if ($("atTemplate")) $("atTemplate").value = "none";

    showEditor(true);
    updatePreview();
    updateCharCounts();
    renderPostList();
  }

  function startNew() {
    state.isNew = true;
    state.activeId = null;
    
    // Reset filters so user isn't confused when they save
    state.filterCategory = "";
    state.filterStatus = "all";
    if ($("atCategoryFilter")) $("atCategoryFilter").value = "";
    if ($("atStatusFilter")) $("atStatusFilter").value = "all";
    document.querySelectorAll('.at-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.at-tab[data-status="all"]')?.classList.add('active');

    fillEditor({
      category: "general",
      eyebrow: "Normal",
      title: "",
      date: "",
      message: "",
      button: ""
    });

    if ($("atEditorTitle")) $("atEditorTitle").textContent = "New Announcement";
    if ($("atEditorSubtitle")) $("atEditorSubtitle").textContent = "Fill in the fields below and click Publish or Save Draft.";
    if ($("atEditorEyebrow")) $("atEditorEyebrow").textContent = "CREATE ANNOUNCEMENT";
    if ($("atDelete")) $("atDelete").hidden = true;
    if ($("atTemplate")) $("atTemplate").value = "none";

    showEditor(true);
    updatePreview();
    updateCharCounts();
    renderPostList();
  }

  function fillEditor(data) {
    if ($("atCategory")) $("atCategory").value = data.category || "general";
    if ($("atTitle"))    $("atTitle").value    = data.title   || "";
    
    if ($("atDate")) {
      let safeDate = data.date || "";
      // Prevent DOMException if old data has a weird date format
      if (typeof safeDate !== "string" || (safeDate && !safeDate.includes("T"))) {
        safeDate = ""; 
      }
      $("atDate").value = safeDate;
    }

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

    let savedId = state.activeId;

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

      // IF NEW: create a new document
      if (state.isNew || !state.activeId) {
        console.log("[ADMIN] Attempting to ADD new document...");
        const docRef = await db.collection(COLLECTION).add(payload);
        savedId = docRef.id;
        console.log("[ADMIN] Successfully created new doc:", savedId);
      } else {
        // IF EDITING: update the existing document
        console.log("[ADMIN] Attempting to UPDATE document:", state.activeId);
        await db.collection(COLLECTION).doc(state.activeId).set(payload, { merge: true });
      }

      state.activeId = savedId;
      state.isNew = false;
      
      showToast(publish ? "Announcement published." : "Draft saved.");

    } catch (err) {
      console.error("Save Error:", err);
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
      if ($("atEditorTitle")) $("atEditorTitle").textContent = "No announcement selected";
      if ($("atEditorSubtitle")) $("atEditorSubtitle").textContent = "Select an announcement on the left, or create a new one.";
      if ($("atDelete")) $("atDelete").hidden = true;

      showToast("Announcement deleted.");
    } catch (err) {
      console.error("Delete Error:", err);
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
    
    if ($("atTemplate")) {
      $("atTemplate").addEventListener("change", (e) => {
        const val = e.target.value;
        if (val === "none") return;
        const tpl = TEMPLATES[val];
        if (!tpl) return;

        fillEditor({
          category: tpl.category,
          eyebrow: tpl.eyebrow,
          title: tpl.title,
          date: "",
          message: tpl.message,
          button: tpl.button
        });
        
        updatePreview();
        updateCharCounts();
      });
    }
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
