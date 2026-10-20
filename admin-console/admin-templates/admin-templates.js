/* ============================================================
   ADMIN TEMPLATES MANAGEMENT
   admin-console/admin-templates/admin-templates.js
   ============================================================ */

(() => {
  "use strict";

  /* ------------------------------------------------------------
     CONFIG
     ------------------------------------------------------------ */
  const CONFIG = {
    manifest: () => Array.isArray(window.GUIDE_FLOW_MANIFEST) ? window.GUIDE_FLOW_MANIFEST : []
  };

  /* ------------------------------------------------------------
     STATE
     ------------------------------------------------------------ */
  const state = {
    guides: [],            // manifest entries
    flowCache: {},         // { guideId: { config, nodes } }
    activeGuideId: "",
    activeRecommendationKey: "",  // node key
    recommendations: [],   // [{ key, label, normalized }]
    loadedTemplates: { comment: "", corr: "", email: "" },
    firebaseReady: false
  };

  /* ------------------------------------------------------------
     HELPERS
     ------------------------------------------------------------ */
  const $ = id => document.getElementById(id);

  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  // Must match guide.js EXACTLY so the doc ids line up.
  function normalizeRecommendation(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function isFinalNode(node) {
    if (!node) return false;
    if (node.action) return true;
    const choices = Array.isArray(node.choices) ? node.choices : [];
    return choices.length === 0 && !node.next;
  }

  function finalTextOf(node) {
    return String(node?.action || node?.text || node?.question || "").trim();
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
     FLOW LOADING
     Injects a guide flow script and snapshots window.GUIDE_CONFIG /
     window.GUIDE_NODES without permanently clobbering global state
     (so we can load multiple guides in one session).
     ------------------------------------------------------------ */
  const loadedScriptPaths = new Set();

  function injectScriptOnce(src) {
    if (loadedScriptPaths.has(src)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const el = document.createElement("script");
      el.src = src;
      el.async = false;
      el.onload = () => { loadedScriptPaths.add(src); resolve(); };
      el.onerror = () => reject(new Error(`Failed to load flow script: ${src}`));
      document.head.appendChild(el);
    });
  }

  async function loadGuideFlow(guide) {
    if (!guide || !guide.flowPath) throw new Error("Guide flow path is missing.");

    if (state.flowCache[guide.id]) return state.flowCache[guide.id];

    const prevConfig = window.GUIDE_CONFIG;
    const prevNodes  = window.GUIDE_NODES;

    // Reset so a stale global doesn't leak in.
    window.GUIDE_CONFIG = undefined;
    window.GUIDE_NODES  = undefined;

    try {
      await injectScriptOnce(guide.flowPath);
    } finally {
      // Snapshot before restoring.
    }

    const snapshot = {
      config: window.GUIDE_CONFIG || {},
      nodes: window.GUIDE_NODES || {}
    };

    // Restore previous globals so subsequent guide loads start clean.
    window.GUIDE_CONFIG = prevConfig;
    window.GUIDE_NODES  = prevNodes;

    if (!Object.keys(snapshot.nodes).length) {
      throw new Error("Guide flow loaded but no GUIDE_NODES were found.");
    }

    state.flowCache[guide.id] = snapshot;
    return snapshot;
  }

  /* ------------------------------------------------------------
     EXTRACT FINAL RECOMMENDATIONS
     ------------------------------------------------------------ */
  function extractRecommendations(nodes) {
    const results = [];
    Object.entries(nodes).forEach(([key, node]) => {
      if (!isFinalNode(node)) return;
      const text = finalTextOf(node);
      if (!text) return;
      results.push({
        key,
        label: text,
        normalized: normalizeRecommendation(text)
      });
    });
    // Stable, alphabetical for predictable UX.
    results.sort((a, b) => a.label.localeCompare(b.label));
    return results;
  }

  /* ------------------------------------------------------------
     RENDER — GUIDE DROPDOWN
     ------------------------------------------------------------ */
  function populateGuideSelect() {
    const select = $("atGuideSelect");
    if (!select) return;

    const guides = CONFIG.manifest();
    state.guides = guides;

    if (!guides.length) {
      select.innerHTML = `<option value="">No guides registered in manifest</option>`;
      select.disabled = true;
      return;
    }

    select.innerHTML = `<option value="">— Select a guide —</option>` + guides.map(g =>
      `<option value="${esc(g.id)}">${esc(g.title || g.id)}</option>`
    ).join("");
    select.disabled = false;
  }

  /* ------------------------------------------------------------
     RENDER — RECOMMENDATION LIST
     ------------------------------------------------------------ */
  function renderRecommendationList() {
    const list = $("atRecommendationList");
    const count = $("atRecommendationCount");
    if (!list) return;

    const recs = state.recommendations;

    if (count) count.textContent = recs.length ? `${recs.length} found` : "—";

    if (!recs.length) {
      list.innerHTML = `<p class="at-empty">No final recommendations found for this guide.</p>`;
      return;
    }

    list.innerHTML = recs.map(r => `
      <button type="button"
              class="at-rec-item${r.key === state.activeRecommendationKey ? " is-active" : ""}"
              data-rec-key="${esc(r.key)}">
        <strong>${esc(r.label)}</strong>
        <small>${esc(r.normalized)}</small>
      </button>
    `).join("");

    list.querySelectorAll("[data-rec-key]").forEach(btn => {
      btn.addEventListener("click", () => selectRecommendation(btn.dataset.recKey));
    });
  }

  /* ------------------------------------------------------------
     EDITOR VISIBILITY
     ------------------------------------------------------------ */
  function showEditor(show) {
    const body = $("atEditorBody");
    const ph = $("atEditorPlaceholder");
    if (body) body.hidden = !show;
    if (ph) ph.hidden = show;
  }

  function setEditorHeader(title, subtitle) {
    const t = $("atEditorTitle");
    const s = $("atEditorSubtitle");
    if (t) t.textContent = title;
    if (s) s.textContent = subtitle;
  }

  function setDocIdsDisplay(normalized) {
    const el = $("atDocIds");
    if (!el) return;
    if (!normalized) { el.textContent = ""; return; }
    el.textContent = `IDs: comment__${normalized} · corr__${normalized} · email__${normalized}`;
  }

  /* ------------------------------------------------------------
     LOAD TEMPLATES FOR RECOMMENDATION
     ------------------------------------------------------------ */
  async function loadRecommendationTemplates() {
    const guide = state.guides.find(g => g.id === state.activeGuideId);
    const rec = state.recommendations.find(r => r.key === state.activeRecommendationKey);

    if (!guide || !rec) return;

    const db = firestore();
    if (!db) {
      showToast("Firestore is not initialized.", true);
      return;
    }

    setEditorHeader(rec.label, `Editing templates for "${rec.label}"`);
    setDocIdsDisplay(rec.normalized);
    showEditor(true);

    const $c = $("atComment");
    const $k = $("atCorr");
    const $e = $("atEmail");
    if ($c) { $c.value = "Loading…"; $c.disabled = true; }
    if ($k) { $k.value = "Loading…"; $k.disabled = true; }
    if ($e) { $e.value = "Loading…"; $e.disabled = true; }
    setButtonsDisabled(true);

    try {
      const coll = db.collection(guide.templateCollection);
      const [c, k, e] = await Promise.all([
        coll.doc(`comment__${rec.normalized}`).get(),
        coll.doc(`corr__${rec.normalized}`).get(),
        coll.doc(`email__${rec.normalized}`).get()
      ]);
      state.loadedTemplates = {
        comment: c.exists ? (c.data().text || "") : "",
        corr:    k.exists ? (k.data().text || "") : "",
        email:   e.exists ? (e.data().text || "") : ""
      };
      fillEditor(state.loadedTemplates);
      setButtonsDisabled(false);
    } catch (err) {
      console.error(err);
      showToast(
        err.code === "permission-denied"
          ? "Firestore denied reading these templates."
          : "Unable to load templates.",
        true
      );
      fillEditor({ comment: "", corr: "", email: "" });
      setButtonsDisabled(false);
    }
  }

  function fillEditor({ comment, corr, email }) {
    const $c = $("atComment");
    const $k = $("atCorr");
    const $e = $("atEmail");
    if ($c) { $c.value = comment || ""; $c.disabled = false; }
    if ($k) { $k.value = corr    || ""; $k.disabled = false; }
    if ($e) { $e.value = email   || ""; $e.disabled = false; }
  }

  function setButtonsDisabled(disabled) {
    const save = $("atSave");
    const reset = $("atReset");
    if (save) save.disabled = disabled;
    if (reset) reset.disabled = disabled;
  }

  /* ------------------------------------------------------------
     SELECT RECOMMENDATION
     ------------------------------------------------------------ */
  function selectRecommendation(key) {
    if (!key) return;
    state.activeRecommendationKey = key;
    // Reflect selection in the list.
    document.querySelectorAll(".at-rec-item").forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.recKey === key);
    });
    loadRecommendationTemplates();
  }

  /* ------------------------------------------------------------
     SAVE / RESET
     ------------------------------------------------------------ */
  async function saveTemplates() {
    const guide = state.guides.find(g => g.id === state.activeGuideId);
    const rec = state.recommendations.find(r => r.key === state.activeRecommendationKey);
    if (!guide || !rec) return;

    const db = firestore();
    if (!db) {
      showToast("Firestore is not initialized.", true);
      return;
    }

    const payload = {
      comment: ($("atComment")?.value || "").trim(),
      corr:    ($("atCorr")?.value || "").trim(),
      email:   ($("atEmail")?.value || "").trim()
    };

    // Firestore rejects empty strings in doc.set if using FieldValue.serverTimestamp,
    // so we store the text as-is (empty string is allowed for a { text: "" } doc).
    const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();

    const button = $("atSave");
    if (button) button.disabled = true;

    try {
      const coll = db.collection(guide.templateCollection);
      await Promise.all([
        coll.doc(`comment__${rec.normalized}`).set(
          { text: payload.comment, updatedAt: serverTimestamp, updatedBy: "admin" },
          { merge: true }
        ),
        coll.doc(`corr__${rec.normalized}`).set(
          { text: payload.corr, updatedAt: serverTimestamp, updatedBy: "admin" },
          { merge: true }
        ),
        coll.doc(`email__${rec.normalized}`).set(
          { text: payload.email, updatedAt: serverTimestamp, updatedBy: "admin" },
          { merge: true }
        )
      ]);
      state.loadedTemplates = { ...payload };
      showToast("Templates saved.");
    } catch (err) {
      console.error(err);
      showToast(
        err.code === "permission-denied"
          ? "Firestore denied the save."
          : "Unable to save templates.",
        true
      );
    } finally {
      if (button) button.disabled = false;
    }
  }

  function resetEditor() {
    fillEditor(state.loadedTemplates);
    showToast("Editor reset to last saved values.");
  }

  /* ------------------------------------------------------------
     GUIDE CHANGE
     ------------------------------------------------------------ */
  async function onGuideChange() {
    const select = $("atGuideSelect");
    const guideId = select ? select.value : "";
    if (!guideId) {
      state.activeGuideId = "";
      state.recommendations = [];
      state.activeRecommendationKey = "";
      renderRecommendationList();
      showEditor(false);
      setEditorHeader("No recommendation selected",
        "Pick a recommendation on the left to edit its templates.");
      setDocIdsDisplay("");
      return;
    }

    const guide = state.guides.find(g => g.id === guideId);
    if (!guide) return;

    state.activeGuideId = guideId;
    state.recommendations = [];
    state.activeRecommendationKey = "";

    const meta = $("atGuideMeta");
    if (meta) meta.textContent = "Loading flow…";

    try {
      const flow = await loadGuideFlow(guide);
      state.recommendations = extractRecommendations(flow.nodes);
      if (meta) {
        meta.textContent =
          `${state.recommendations.length} final recommendation${state.recommendations.length === 1 ? "" : "s"} · collection: ${guide.templateCollection}`;
      }
      renderRecommendationList();
      showEditor(false);
      setEditorHeader("No recommendation selected",
        "Pick a recommendation on the left to edit its templates.");
      setDocIdsDisplay("");
    } catch (err) {
      console.error(err);
      if (meta) meta.textContent = "Flow could not be loaded.";
      state.recommendations = [];
      renderRecommendationList();
      showToast(err.message || "Failed to load guide flow.", true);
    }
  }

  /* ------------------------------------------------------------
     BOOT
     ------------------------------------------------------------ */
  function init() {
    populateGuideSelect();

    const select = $("atGuideSelect");
    if (select) select.addEventListener("change", onGuideChange);

    const save = $("atSave");
    if (save) save.addEventListener("click", saveTemplates);

    const reset = $("atReset");
    if (reset) reset.addEventListener("click", resetEditor);

    state.firebaseReady = !!firestore();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
