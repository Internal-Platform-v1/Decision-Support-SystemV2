/* ============================================================
   ADMIN TEMPLATES MANAGEMENT
   admin-console/admin-templates/admin-templates.js
   ============================================================ */

(() => {
  "use strict";

  console.log("[AT] script starting");

  const CONFIG = {
    manifest: () => Array.isArray(window.GUIDE_FLOW_MANIFEST) ? window.GUIDE_FLOW_MANIFEST : []
  };

  function resolveFlowPath(path) {
    const p = String(path || "").trim();
    if (!p) return p;
    if (p.startsWith("/") || /^[a-z]+:\/\//i.test(p)) return p;
    const root = window.GUIDE_FLOW_REPO_ROOT || "/";
    return root.replace(/\/+$/, "/") + p.replace(/^\/+/, "");
  }

  const state = {
    guides: [],
    flowCache: {},
    activeGuideId: "",
    activeRecommendationKey: "",
    recommendations: [],
    loadedTemplates: { comment: "", corr: "", email: "" },
    graph: null,
    expanded: new Set(),
    activePathKeys: new Set(),
    view: "list",
    savedLeaves: new Set(),
    zoom: 1,
    panX: 20,
    panY: 20,
    renderInProgress: false,
    isFullscreen: false,
    hoverNodeKey: null,
    fsEditorOffset: { x: 0, y: 0 }
  };

  const $ = id => document.getElementById(id);

  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  function normalizeRecommendation(text) {
    return String(text || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
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
    window.GUIDE_CONFIG = undefined;
    window.GUIDE_NODES  = undefined;

    try {
      await injectScriptOnce(resolveFlowPath(guide.flowPath));
    } catch (err) {
      window.GUIDE_CONFIG = prevConfig;
      window.GUIDE_NODES  = prevNodes;
      throw err;
    }

    const snapshot = {
      config: window.GUIDE_CONFIG || {},
      nodes: window.GUIDE_NODES || {}
    };

    window.GUIDE_CONFIG = prevConfig;
    window.GUIDE_NODES  = prevNodes;

    if (!Object.keys(snapshot.nodes).length) {
      throw new Error("Guide flow loaded but no GUIDE_NODES were found.");
    }

    state.flowCache[guide.id] = snapshot;
    return snapshot;
  }

  function extractRecommendations(nodes) {
    const out = [];
    Object.entries(nodes).forEach(([key, node]) => {
      if (!isFinalNode(node)) return;
      const text = finalTextOf(node);
      if (!text) return;
      out.push({ key, label: text, normalized: normalizeRecommendation(text) });
    });
    out.sort((a, b) => a.label.localeCompare(b.label));
    return out;
  }

  function buildGraph(nodes, startKey) {
    const graph = {
      rootKey: startKey,
      nodes: new Map(),
      edges: [],
      edgeSet: new Set(),
      adjOut: new Map()
    };

    function ensure(key, parentKey, choiceLabel) {
      if (!graph.nodes.has(key)) {
        const node = nodes[key] || {};
        graph.nodes.set(key, {
          key,
          node,
          label: finalTextOf(node) || node?.text || node?.question || key,
          isLeaf: isFinalNode(node),
          parentKeys: []
        });
      }
      if (parentKey != null) {
        const sig = `${parentKey}→${key}`;
        if (!graph.edgeSet.has(sig)) {
          graph.edgeSet.add(sig);
          graph.nodes.get(key).parentKeys.push(parentKey);
          graph.edges.push({ from: parentKey, to: key, choiceLabel: choiceLabel || "" });
          if (!graph.adjOut.has(parentKey)) graph.adjOut.set(parentKey, []);
          graph.adjOut.get(parentKey).push(key);
        }
      }
      return graph.nodes.get(key);
    }

    ensure(startKey, null, "");

    const queue = [startKey];
    const seen = new Set([startKey]);
    let safety = 0;
    while (queue.length) {
      if (++safety > 10000) break;
      const key = queue.shift();
      const node = nodes[key];
      if (!node) continue;
      const choices = Array.isArray(node.choices) ? node.choices : [];
      choices.forEach(choice => {
        const next = choice.next;
        if (!next || !nodes[next]) return;
        ensure(next, key, choice.label);
        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      });
    }

    return graph;
  }

  const NODE_W = 170;
  const NODE_H = 42;
  const COL_GAP = 60;
  const ROW_GAP = 12;
  const MAX_VISIBLE = 300;

  function computeVisible(graph) {
    if (!graph) return new Set();
    const visible = new Set();
    const adj = graph.adjOut;
    const queue = [graph.rootKey];
    let safety = 0;
    while (queue.length) {
      if (++safety > MAX_VISIBLE * 4) break;
      const key = queue.shift();
      if (visible.has(key)) continue;
      visible.add(key);
      if (visible.size >= MAX_VISIBLE) break;
      const isExpanded = (key === graph.rootKey) || state.expanded.has(key);
      if (!isExpanded) continue;
      (adj.get(key) || []).forEach(k => {
        if (!visible.has(k)) queue.push(k);
      });
    }
    return visible;
  }

  function layoutGraph(graph) {
    const positions = new Map();
    const visible = computeVisible(graph);
    if (!visible.size) return { positions, visible };

    const adj = graph.adjOut;
    const depth = new Map();
    depth.set(graph.rootKey, 0);
    const bfs = [graph.rootKey];
    const bfsSeen = new Set([graph.rootKey]);
    let safety = 0;
    while (bfs.length) {
      if (++safety > MAX_VISIBLE * 4) break;
      const k = bfs.shift();
      const d = depth.get(k) || 0;
      (adj.get(k) || []).forEach(nk => {
        if (!visible.has(nk)) return;
        if (!depth.has(nk)) depth.set(nk, d + 1);
        if (!bfsSeen.has(nk)) { bfsSeen.add(nk); bfs.push(nk); }
      });
    }

    const buckets = new Map();
    visible.forEach(k => {
      const d = depth.has(k) ? depth.get(k) : 0;
      if (!buckets.has(d)) buckets.set(d, []);
      buckets.get(d).push(k);
    });

    const depths = Array.from(buckets.keys()).sort((a, b) => a - b);
    let maxRows = 0;
    depths.forEach(d => { maxRows = Math.max(maxRows, buckets.get(d).length); });
    const totalH = maxRows * (NODE_H + ROW_GAP);

    depths.forEach(d => {
      const keys = buckets.get(d);
      const x = d * (NODE_W + COL_GAP);
      const startY = (totalH - keys.length * (NODE_H + ROW_GAP)) / 2;
      keys.forEach((k, i) => {
        positions.set(k, { x, y: startY + i * (NODE_H + ROW_GAP) });
      });
    });

    return { positions, visible };
  }

  function truncate(str, max) {
    const s = String(str || "");
    if (s.length <= max) return s;
    return s.slice(0, max - 1).trim() + "…";
  }

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
        <small><code>${esc(r.key)}</code> · ${esc(r.normalized)}</small>
      </button>
    `).join("");

    list.querySelectorAll("[data-rec-key]").forEach(btn => {
      btn.addEventListener("click", () => selectRecommendation(btn.dataset.recKey));
    });
  }

  function renderChart() {
    if (state.renderInProgress) return;
    state.renderInProgress = true;
    try {
      const svg = $("atChartSvg");
      const host = $("atChartHost");
      const vp = $("atChartViewport");
      if (!svg || !host || !vp) return;

      if (!state.graph) {
        svg.innerHTML = "";
        host.querySelector(".at-chart-empty")?.remove();
        const empty = document.createElement("div");
        empty.className = "at-chart-empty";
        empty.textContent = "Select a guide to load the flow chart.";
        host.appendChild(empty);
        return;
      }
      host.querySelector(".at-chart-empty")?.remove();

      const { positions, visible } = layoutGraph(state.graph);

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      positions.forEach(({ x, y }, key) => {
        if (!visible.has(key)) return;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + NODE_W);
        maxY = Math.max(maxY, y + NODE_H);
      });
      if (!isFinite(minX)) { minX = 0; minY = 0; maxX = NODE_W; maxY = NODE_H; }

      const rect = vp.getBoundingClientRect();
      const vw = Math.max(320, rect.width);
      const vh = Math.max(240, rect.height);
      const pad = 30;
      const contentW = maxX - minX;
      const contentH = maxY - minY;
      const baseScale = Math.min(
        (vw - pad * 2) / Math.max(1, contentW),
        (vh - pad * 2) / Math.max(1, contentH),
        1
      );
      const scale = baseScale * state.zoom;
      const tx = state.panX + (vw - contentW * scale) / 2 - minX * scale;
      const ty = state.panY + (vh - contentH * scale) / 2 - minY * scale;

      const edges = [];
      const nodes = [];
      const drawnEdge = new Set();

      state.graph.edges.forEach(e => {
        if (!visible.has(e.from) || !visible.has(e.to)) return;
        const sig = `${e.from}→${e.to}`;
        if (drawnEdge.has(sig)) return;
        drawnEdge.add(sig);
        const p1 = positions.get(e.from);
        const p2 = positions.get(e.to);
        if (!p1 || !p2) return;
        const x1 = p1.x + NODE_W;
        const y1 = p1.y + NODE_H / 2;
        const x2 = p2.x;
        const y2 = p2.y + NODE_H / 2;
        const midX = (x1 + x2) / 2;
        const path = `M${x1},${y1} C${midX},${y1} ${midX},${y2} ${x2},${y2}`;
        const isActive = state.activePathKeys.has(e.from) && state.activePathKeys.has(e.to);
        edges.push(`<path class="at-edge${isActive ? " is-active" : ""}" d="${path}" />`);
      });

      positions.forEach(({ x, y }, key) => {
        if (!visible.has(key)) return;
        const meta = state.graph.nodes.get(key);
        if (!meta) return;
        const isRoot = key === state.graph.rootKey;
        const isLeaf = meta.isLeaf;
        const isSaved = state.savedLeaves.has(key);
        const isActive = state.activeRecommendationKey === key;
        const isExpanded = (key === state.graph.rootKey) || state.expanded.has(key);
        const hasKids = (state.graph.adjOut.get(key) || []).length > 0;

        const classes = [
          "at-node",
          isRoot ? "at-node-start" : "",
          isLeaf ? "at-node-leaf" : "",
          isLeaf && isSaved ? "is-saved" : "",
          isLeaf && isActive ? "is-active" : "",
          hasKids && !isExpanded ? "at-node-collapsed" : ""
        ].filter(Boolean).join(" ");

        const title = isRoot ? "Start" : truncate(meta.label, 24);
        const metaText = isLeaf
          ? (isSaved ? "Templates saved" : "Edit templates")
          : (hasKids ? (isExpanded ? "Click to collapse" : "Click to expand") : "");

        nodes.push(`
          <g class="${classes}" data-node-key="${esc(key)}" transform="translate(${x},${y})">
            <rect x="0" y="0" width="${NODE_W}" height="${NODE_H}" rx="9" ry="9"
                  stroke-width="${isRoot ? 0 : 1}" />
            <text class="at-node-title" x="11" y="18">${esc(title)}</text>
            <text class="at-node-meta" x="11" y="31">${esc(metaText)}</text>
            ${hasKids
              ? `<text class="at-node-toggle" x="${NODE_W - 14}" y="${NODE_H - 11}" text-anchor="middle">${isExpanded ? "−" : "+"}</text>`
              : ""}
          </g>
        `);
      });

      svg.innerHTML = `
        <g transform="translate(${tx},${ty}) scale(${scale})">
          ${edges.join("")}
          ${nodes.join("")}
        </g>
      `;

      svg.querySelectorAll("[data-node-key]").forEach(g => {
        g.addEventListener("click", (event) => {
          event.stopPropagation();
          handleChartNodeClick(g.dataset.nodeKey);
        });
        g.addEventListener("mouseenter", (event) => {
          showHoverTip(g.dataset.nodeKey, event);
        });
        g.addEventListener("mousemove", (event) => {
          positionHoverTip(event);
        });
        g.addEventListener("mouseleave", () => {
          hideHoverTip();
        });
      });
    } finally {
      state.renderInProgress = false;
    }
  }

  function handleChartNodeClick(key) {
    const meta = state.graph?.nodes.get(key);
    if (!meta) return;

    if (meta.isLeaf) {
      selectRecommendation(key);
      if (state.isFullscreen) {
        openFullscreenEditor(key);
      }
      return;
    }

    if (state.expanded.has(key)) state.expanded.delete(key);
    else state.expanded.add(key);
    renderChart();

    if (state.isFullscreen) {
      openFullscreenNodePreview(key);
    } else {
      showNodePreview(key);
    }
  }

  function computeActivePathTo(key) {
    const path = new Set();
    if (!state.graph) return path;
    const adj = state.graph.adjOut;
    const queue = [{ k: state.graph.rootKey, chain: [state.graph.rootKey] }];
    const visited = new Set();
    let safety = 0;
    while (queue.length) {
      if (++safety > 5000) break;
      const { k, chain } = queue.shift();
      if (k === key) {
        chain.forEach(n => path.add(n));
        return path;
      }
      if (visited.has(k)) continue;
      visited.add(k);
      (adj.get(k) || []).forEach(nk => {
        if (!visited.has(nk)) queue.push({ k: nk, chain: [...chain, nk] });
      });
    }
    return path;
  }

  function ensurePathExpandedTo(key) {
    const path = computeActivePathTo(key);
    path.forEach(k => {
      const meta = state.graph?.nodes.get(k);
      if (meta && !meta.isLeaf) state.expanded.add(k);
    });
    return path;
  }

  function selectRecommendation(key) {
    if (!key) return;
    state.activeRecommendationKey = key;

    document.querySelectorAll(".at-rec-item").forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.recKey === key);
    });

    if (state.view === "chart" && state.graph) {
      const path = ensurePathExpandedTo(key);
      state.activePathKeys = path;
      renderChart();
    }

    loadRecommendationTemplates();
  }

  function showNodePreview(key) {
    const meta = state.graph?.nodes.get(key);
    const preview = $("atNodePreview");
    const editorBody = $("atEditorBody");
    const placeholder = $("atEditorPlaceholder");
    const editorTitle = $("atEditorTitle");
    const editorSubtitle = $("atEditorSubtitle");
    if (!meta || !preview) return;

    if (editorTitle) editorTitle.textContent = truncate(meta.label, 60);
    if (editorSubtitle) editorSubtitle.textContent = `Node key: ${key}`;
    if (editorBody) editorBody.hidden = true;
    if (placeholder) placeholder.hidden = true;
    preview.hidden = false;

    const node = meta.node || {};
    const choices = Array.isArray(node.choices) ? node.choices : [];

    const choicesHtml = choices.length
      ? `<div class="at-np-choices-title">Choices</div>` + choices.map(c => `
          <div class="at-np-choice">
            <div class="at-np-choice-icon">→</div>
            <div class="at-np-choice-body">
              <strong>${esc(c.label || "")}</strong>
              ${c.desc ? `<small>${esc(c.desc)}</small>` : ""}
              <code>→ ${esc(c.next || "(final)")}</code>
            </div>
          </div>
        `).join("")
      : `<div class="at-np-choices-title">This node is terminal</div>`;

    preview.innerHTML = `
      <span class="at-np-eyebrow">NODE PREVIEW</span>
      <h3>${esc(node.text || node.question || "(no text)")}</h3>
      ${node.help ? `<p class="at-np-help">${esc(node.help)}</p>` : ""}
      <div class="at-np-meta">
        <span><strong>Key:</strong> <code>${esc(key)}</code></span>
        <span><strong>Type:</strong> ${meta.isLeaf ? "Final" : "Decision"}</span>
        <span><strong>Choices:</strong> ${choices.length}</span>
      </div>
      ${choicesHtml}
    `;
  }

  function clearNodePreview() {
    const preview = $("atNodePreview");
    if (preview) { preview.hidden = true; preview.innerHTML = ""; }
  }

  function showEditor(show) {
    const body = $("atEditorBody");
    const ph = $("atEditorPlaceholder");
    const preview = $("atNodePreview");
    if (body) body.hidden = !show;
    if (ph) ph.hidden = show;
    if (preview && show) { preview.hidden = true; preview.innerHTML = ""; }
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

  async function loadRecommendationTemplates() {
    const guide = state.guides.find(g => g.id === state.activeGuideId);
    const rec = state.recommendations.find(r => r.key === state.activeRecommendationKey);
    if (!guide || !rec) return;

    const db = firestore();
    if (!db) { showToast("Firestore is not initialized.", true); return; }

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
    syncFullscreenEditorLoading();

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

      const anySaved = !!(state.loadedTemplates.comment || state.loadedTemplates.corr || state.loadedTemplates.email);
      if (anySaved) state.savedLeaves.add(rec.key);
      else state.savedLeaves.delete(rec.key);

      syncFullscreenEditorValues(state.loadedTemplates);
      if (state.view === "chart") renderChart();
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
      syncFullscreenEditorValues({ comment: "", corr: "", email: "" });
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

  async function precheckSavedTemplates() {
    const guide = state.guides.find(g => g.id === state.activeGuideId);
    const db = firestore();
    if (!guide || !db) return;
    state.savedLeaves = new Set();
    try {
      const snap = await db.collection(guide.templateCollection).get();
      const present = new Set();
      snap.docs.forEach(doc => {
        const data = doc.data() || {};
        if (!data.text) return;
        const m = doc.id.match(/^(comment|corr|email)__(.+)$/);
        if (!m) return;
        present.add(m[2]);
      });
      state.recommendations.forEach(r => {
        if (present.has(r.normalized)) state.savedLeaves.add(r.key);
      });
      if (state.view === "chart") renderChart();
    } catch (err) {
      console.info("Precheck skipped:", err.code || err.message);
    }
  }

  async function saveTemplates() {
    const guide = state.guides.find(g => g.id === state.activeGuideId);
    const rec = state.recommendations.find(r => r.key === state.activeRecommendationKey);
    if (!guide || !rec) return;

    const db = firestore();
    if (!db) { showToast("Firestore is not initialized.", true); return; }

    const fsOpen = !!$("atFsEditor");
    const payload = fsOpen
      ? {
          comment: ($("fsComment")?.value || "").trim(),
          corr:    ($("fsCorr")?.value || "").trim(),
          email:   ($("fsEmail")?.value || "").trim()
        }
      : {
          comment: ($("atComment")?.value || "").trim(),
          corr:    ($("atCorr")?.value || "").trim(),
          email:   ($("atEmail")?.value || "").trim()
        };

    const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();
    const btn1 = $("atSave");
    const btn2 = $("fsSave");
    if (btn1) btn1.disabled = true;
    if (btn2) btn2.disabled = true;

    try {
      const coll = db.collection(guide.templateCollection);
      await Promise.all([
        coll.doc(`comment__${rec.normalized}`).set(
          { text: payload.comment, updatedAt: serverTimestamp, updatedBy: "admin" }, { merge: true }),
        coll.doc(`corr__${rec.normalized}`).set(
          { text: payload.corr, updatedAt: serverTimestamp, updatedBy: "admin" }, { merge: true }),
        coll.doc(`email__${rec.normalized}`).set(
          { text: payload.email, updatedAt: serverTimestamp, updatedBy: "admin" }, { merge: true })
      ]);
      state.loadedTemplates = { ...payload };
      if (payload.comment || payload.corr || payload.email) state.savedLeaves.add(rec.key);
      else state.savedLeaves.delete(rec.key);
      fillEditor(state.loadedTemplates);
      syncFullscreenEditorValues(state.loadedTemplates);
      if (state.view === "chart") renderChart();
      showToast("Templates saved.");
    } catch (err) {
      console.error(err);
      showToast(
        err.code === "permission-denied" ? "Firestore denied the save." : "Unable to save templates.",
        true
      );
    } finally {
      if (btn1) btn1.disabled = false;
      if (btn2) btn2.disabled = false;
    }
  }

  function resetEditor() {
    fillEditor(state.loadedTemplates);
    syncFullscreenEditorValues(state.loadedTemplates);
    showToast("Editor reset to last saved values.");
  }

  async function onGuideChange() {
    const select = $("atGuideSelect");
    const guideId = select ? select.value : "";
    if (!guideId) {
      state.activeGuideId = "";
      state.recommendations = [];
      state.activeRecommendationKey = "";
      state.graph = null;
      state.expanded = new Set();
      state.activePathKeys = new Set();
      state.savedLeaves = new Set();
      renderRecommendationList();
      if (state.view === "chart") renderChart();
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
    state.savedLeaves = new Set();
    delete state.flowCache[guideId];

    const meta = $("atGuideMeta");
    if (meta) meta.textContent = "Loading flow…";

    try {
      const flow = await loadGuideFlow(guide);
      state.recommendations = extractRecommendations(flow.nodes);
      state.graph = buildGraph(flow.nodes, flow.config.startNode || "start");

      state.expanded = new Set([state.graph.rootKey]);
      (state.graph.adjOut.get(state.graph.rootKey) || []).forEach(k => {
        const m = state.graph.nodes.get(k);
        if (m && !m.isLeaf) state.expanded.add(k);
      });
      state.activePathKeys = new Set();

      try {
        const saved = JSON.parse(localStorage.getItem("at_pan") || "null");
        if (saved && typeof saved === "object") {
          state.zoom = Number(saved.zoom) || 1;
          state.panX = Number(saved.panX) || 20;
          state.panY = Number(saved.panY) || 20;
        } else {
          resetPanZoom();
        }
      } catch (_) {
        resetPanZoom();
      }

      if (meta) {
        meta.textContent =
          `${state.recommendations.length} final recommendation${state.recommendations.length === 1 ? "" : "s"} · collection: ${guide.templateCollection}`;
      }

      renderRecommendationList();

      let preferredView = "list";
      try {
        const saved = localStorage.getItem("at_view");
        if (saved === "chart" || saved === "list") preferredView = saved;
      } catch (_) {}
      if (preferredView !== state.view) {
        setView(preferredView);
      } else if (state.view === "chart") {
        renderChart();
      }

      showEditor(false);
      clearNodePreview();
      setEditorHeader("No recommendation selected",
        "Pick a recommendation on the left to edit its templates.");
      setDocIdsDisplay("");

      precheckSavedTemplates();
    } catch (err) {
      console.error(err);
      if (meta) meta.textContent = "Flow could not be loaded.";
      state.recommendations = [];
      state.graph = null;
      renderRecommendationList();
      if (state.view === "chart") renderChart();
      showToast(err.message || "Failed to load guide flow.", true);
    }
  }

  function setView(view) {
    state.view = view === "chart" ? "chart" : "list";
    try { localStorage.setItem("at_view", state.view); } catch (_) {}

    document.querySelectorAll(".at-view-btn").forEach(btn => {
      btn.setAttribute("aria-selected", String(btn.dataset.view === state.view));
    });

    const list = $("atRecommendationList");
    const chart = $("atChartHost");
    const leftEyebrow = $("atLeftEyebrow");
    const leftTitle = $("atLeftTitle");

    if (list) list.hidden = state.view === "chart";
    if (chart) chart.hidden = state.view !== "chart";

    if (leftEyebrow) leftEyebrow.textContent = state.view === "chart" ? "GUIDE FLOW" : "FINAL RECOMMENDATIONS";
    if (leftTitle) leftTitle.textContent = state.view === "chart" ? "Visual decision tree" : "Select a recommendation";

    if (state.view === "chart") {
      if (state.graph) {
        requestAnimationFrame(() => renderChart());
      } else {
        requestAnimationFrame(() => {
          const svg = $("atChartSvg");
          const host = $("atChartHost");
          if (svg) svg.innerHTML = "";
          if (host) {
            host.querySelector(".at-chart-empty")?.remove();
            const empty = document.createElement("div");
            empty.className = "at-chart-empty";
            empty.textContent = "Select a guide to load the flow chart.";
            host.appendChild(empty);
          }
        });
      }
    }
  }

  /* ------------------------------------------------------------
     HOVER TOOLTIP
     Lives on document.body normally. When the chart host is in
     fullscreen, we move it INSIDE the host so it renders on top.
     ------------------------------------------------------------ */
  function ensureHoverTip() {
    let tip = $("atHoverTip");
    if (tip) return tip;
    tip = document.createElement("div");
    tip.id = "atHoverTip";
    tip.className = "at-hover-tip";
    tip.hidden = true;
    document.body.appendChild(tip);
    return tip;
  }

  function reparentHoverTip() {
    const tip = ensureHoverTip();
    const host = $("atChartHost");
    const desiredParent = state.isFullscreen && host ? host : document.body;
    if (tip.parentElement !== desiredParent) {
      desiredParent.appendChild(tip);
    }
    tip.classList.toggle("is-in-host", state.isFullscreen);
  }

  function showHoverTip(key, event) {
    const meta = state.graph?.nodes.get(key);
    if (!meta) return;
    const node = meta.node || {};
    const choices = Array.isArray(node.choices) ? node.choices : [];

    const choicesHtml = choices.length
      ? `<div class="at-tip-choices-title">Choices (${choices.length})</div>` +
        choices.map(c => `
          <div class="at-tip-choice">
            <div class="at-tip-choice-label">${esc(c.label || "")}</div>
            ${c.desc ? `<div class="at-tip-choice-desc">${esc(c.desc)}</div>` : ""}
            <code>→ ${esc(c.next || "(final)")}</code>
          </div>
        `).join("")
      : `<div class="at-tip-choices-title">Terminal node</div>`;

    const tip = ensureHoverTip();
    reparentHoverTip();
    tip.innerHTML = `
      <div class="at-tip-head">
        <span class="at-tip-badge ${meta.isLeaf ? "leaf" : "decision"}">${meta.isLeaf ? "FINAL" : "DECISION"}</span>
        <code class="at-tip-key">${esc(key)}</code>
      </div>
      <div class="at-tip-text">${esc(node.text || node.question || "(no text)")}</div>
      ${node.help ? `<div class="at-tip-help">${esc(node.help).replace(/\n/g, "<br>")}</div>` : ""}
      ${node.note ? `<div class="at-tip-note">${esc(node.note).replace(/\n/g, "<br>")}</div>` : ""}
      ${choicesHtml}
    `;
    tip.hidden = false;
    state.hoverNodeKey = key;
    positionHoverTip(event);
  }

  function positionHoverTip(event) {
    const tip = $("atHoverTip");
    if (!tip || tip.hidden) return;
    const pad = 14;

    if (state.isFullscreen) {
      // Position relative to the chart host.
      const host = $("atChartHost");
      if (!host) return;
      const hostRect = host.getBoundingClientRect();
      const w = tip.offsetWidth;
      const h = tip.offsetHeight;
      let x = (event?.clientX || 0) - hostRect.left + pad;
      let y = (event?.clientY || 0) - hostRect.top + pad;
      const maxX = hostRect.width - w - pad;
      const maxY = hostRect.height - h - pad;
      if (x > maxX) x = Math.max(pad, (event?.clientX || 0) - hostRect.left - w - pad);
      if (y > maxY) y = Math.max(pad, (event?.clientY || 0) - hostRect.top - h - pad);
      tip.style.left = x + "px";
      tip.style.top = y + "px";
    } else {
      const w = tip.offsetWidth;
      const h = tip.offsetHeight;
      let x = (event?.clientX || 0) + pad;
      let y = (event?.clientY || 0) + pad;
      const maxX = window.innerWidth - w - pad;
      const maxY = window.innerHeight - h - pad;
      if (x > maxX) x = Math.max(pad, (event?.clientX || 0) - w - pad);
      if (y > maxY) y = Math.max(pad, (event?.clientY || 0) - h - pad);
      tip.style.left = x + "px";
      tip.style.top = y + "px";
    }
  }

  function hideHoverTip() {
    const tip = $("atHoverTip");
    if (!tip) return;
    tip.hidden = true;
    state.hoverNodeKey = null;
  }

  /* ------------------------------------------------------------
     FULLSCREEN
     ------------------------------------------------------------ */
  function toggleFullscreen() {
    const host = $("atChartHost");
    if (!host) return;

    const isFull = document.fullscreenElement === host ||
                   document.webkitFullscreenElement === host;

    if (isFull) {
      (document.exitFullscreen || document.webkitExitFullscreen || function(){}).call(document);
    } else {
      const req = host.requestFullscreen || host.webkitRequestFullscreen;
      if (req) {
        req.call(host).catch(err => {
          console.warn("[AT] fullscreen failed:", err);
          showToast("Fullscreen not available in this browser.", true);
        });
      } else {
        showToast("Fullscreen not available in this browser.", true);
      }
    }
  }

  function updateFullscreenButton() {
    const btn = $("atFullscreen");
    if (!btn) return;
    const host = $("atChartHost");
    const isFull = document.fullscreenElement === host ||
                   document.webkitFullscreenElement === host;
    state.isFullscreen = isFull;
    btn.setAttribute("aria-label", isFull ? "Exit fullscreen" : "Enter fullscreen");
    btn.innerHTML = isFull ? "Exit ⤢" : "Fullscreen ⤢";
  }

  function onFullscreenChange() {
    updateFullscreenButton();
    reparentHoverTip();
    hideHoverTip();
    if (!state.isFullscreen) {
      closeFullscreenEditor();
      closeFullscreenNodePreview();
    }
    setTimeout(() => {
      if (state.view === "chart" && state.graph) renderChart();
    }, 60);
  }

  /* ------------------------------------------------------------
     FULLSCREEN — INLINE EDITOR OVERLAY (draggable)
     ------------------------------------------------------------ */
  function openFullscreenEditor(key) {
    const host = $("atChartHost");
    if (!host) return;
    const rec = state.recommendations.find(r => r.key === key);
    if (!rec) return;

    closeFullscreenEditor();

    const overlay = document.createElement("div");
    overlay.className = "at-fs-editor";
    overlay.id = "atFsEditor";
    overlay.innerHTML = `
      <div class="at-fs-editor-panel" role="dialog" aria-modal="true" id="fsPanel" style="transform: translate(${state.fsEditorOffset.x}px, ${state.fsEditorOffset.y}px);">
        <div class="at-fs-editor-head" id="fsDragHandle" style="cursor: grab;">
          <div>
            <div class="at-fs-editor-eyebrow">EDIT TEMPLATES · DRAG HEADER TO MOVE</div>
            <h3 class="at-fs-editor-title">${esc(rec.label)}</h3>
            <code class="at-fs-editor-key">${esc(rec.normalized)}</code>
          </div>
          <button type="button" class="at-fs-editor-close" id="fsClose" aria-label="Close editor">✕</button>
        </div>
        <div class="at-fs-editor-body">
          <label class="at-fs-field">
            <span>Suggested Comment</span>
            <textarea id="fsComment" rows="4" placeholder="Comment text…"></textarea>
          </label>
          <label class="at-fs-field">
            <span>Suggested CORR Code</span>
            <textarea id="fsCorr" rows="3" placeholder="CORR code text…"></textarea>
          </label>
          <label class="at-fs-field">
            <span>Suggested Email</span>
            <textarea id="fsEmail" rows="5" placeholder="Email body…"></textarea>
          </label>
        </div>
        <div class="at-fs-editor-foot">
          <span class="at-fs-editor-ids">comment__${esc(rec.normalized)} · corr__${esc(rec.normalized)} · email__${esc(rec.normalized)}</span>
          <div class="at-fs-editor-actions">
            <button type="button" class="at-btn ghost" id="fsReset">Reset</button>
            <button type="button" class="at-btn primary" id="fsSave">Save</button>
          </div>
        </div>
      </div>
    `;
    host.appendChild(overlay);

    $("fsClose")?.addEventListener("click", closeFullscreenEditor);
    overlay.addEventListener("click", e => {
      if (e.target === overlay) closeFullscreenEditor();
    });
    $("fsSave")?.addEventListener("click", saveTemplates);
    $("fsReset")?.addEventListener("click", () => {
      syncFullscreenEditorValues(state.loadedTemplates);
      showToast("Editor reset to last saved values.");
    });

    setupDragForPanel($("fsPanel"), $("fsDragHandle"));

    syncFullscreenEditorValues(state.loadedTemplates);
  }

  function setupDragForPanel(panel, handle) {
    if (!panel || !handle) return;
    let dragging = false;
    let startX = 0, startY = 0, startOffX = 0, startOffY = 0;

    handle.addEventListener("mousedown", (e) => {
      if (e.target.closest("button")) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startOffX = state.fsEditorOffset.x;
      startOffY = state.fsEditorOffset.y;
      handle.style.cursor = "grabbing";
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      state.fsEditorOffset.x = startOffX + dx;
      state.fsEditorOffset.y = startOffY + dy;
      panel.style.transform =
        `translate(${state.fsEditorOffset.x}px, ${state.fsEditorOffset.y}px)`;
    });

    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      handle.style.cursor = "grab";
    });
  }

  function syncFullscreenEditorLoading() {
    const c = $("fsComment"); const k = $("fsCorr"); const e = $("fsEmail");
    if (c) { c.value = "Loading…"; c.disabled = true; }
    if (k) { k.value = "Loading…"; k.disabled = true; }
    if (e) { e.value = "Loading…"; e.disabled = true; }
  }

  function syncFullscreenEditorValues({ comment, corr, email }) {
    const c = $("fsComment"); const k = $("fsCorr"); const e = $("fsEmail");
    if (c) { c.value = comment || ""; c.disabled = false; }
    if (k) { k.value = corr    || ""; k.disabled = false; }
    if (e) { e.value = email   || ""; e.disabled = false; }
  }

  function closeFullscreenEditor() {
    const el = $("atFsEditor");
    if (el) el.remove();
  }

  /* ------------------------------------------------------------
     FULLSCREEN — NODE PREVIEW OVERLAY
     ------------------------------------------------------------ */
  function openFullscreenNodePreview(key) {
    const host = $("atChartHost");
    if (!host) return;
    const meta = state.graph?.nodes.get(key);
    if (!meta) return;

    closeFullscreenNodePreview();

    const node = meta.node || {};
    const choices = Array.isArray(node.choices) ? node.choices : [];

    const choicesHtml = choices.length
      ? `<div class="at-fs-np-choices-title">Choices</div>` + choices.map(c => `
          <div class="at-fs-np-choice">
            <strong>${esc(c.label || "")}</strong>
            ${c.desc ? `<small>${esc(c.desc)}</small>` : ""}
            <code>→ ${esc(c.next || "(final)")}</code>
          </div>
        `).join("")
      : `<div class="at-fs-np-choices-title">Terminal node</div>`;

    const overlay = document.createElement("div");
    overlay.className = "at-fs-editor";
    overlay.id = "atFsNodePreview";
    overlay.innerHTML = `
      <div class="at-fs-editor-panel" role="dialog" aria-modal="true">
        <div class="at-fs-editor-head">
          <div>
            <div class="at-fs-editor-eyebrow">NODE PREVIEW</div>
            <h3 class="at-fs-editor-title">${esc(node.text || node.question || "(no text)")}</h3>
            <code class="at-fs-editor-key">${esc(key)}</code>
          </div>
          <button type="button" class="at-fs-editor-close" id="fsNpClose" aria-label="Close preview">✕</button>
        </div>
        <div class="at-fs-editor-body">
          ${node.help ? `<p class="at-fs-np-help">${esc(node.help).replace(/\n/g, "<br>")}</p>` : ""}
          ${node.note ? `<div class="at-fs-np-note">${esc(node.note).replace(/\n/g, "<br>")}</div>` : ""}
          ${choicesHtml}
        </div>
      </div>
    `;
    host.appendChild(overlay);

    $("fsNpClose")?.addEventListener("click", closeFullscreenNodePreview);
    overlay.addEventListener("click", e => {
      if (e.target === overlay) closeFullscreenNodePreview();
    });
  }

  function closeFullscreenNodePreview() {
    const el = $("atFsNodePreview");
    if (el) el.remove();
  }

  /* ------------------------------------------------------------
     PAN / ZOOM
     ------------------------------------------------------------ */
  function setupPanZoom() {
    const vp = $("atChartViewport");
    if (!vp) return;

    let dragging = false;
    let startX = 0, startY = 0, startPanX = 0, startPanY = 0;
    let rafId = 0;

    vp.addEventListener("mousedown", e => {
      if (e.target.closest(".at-node")) return;
      if (e.target.closest(".at-fs-editor")) return;
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      startPanX = state.panX; startPanY = state.panY;
      vp.classList.add("is-dragging");
    });
    window.addEventListener("mousemove", e => {
      if (!dragging) return;
      state.panX = startPanX + (e.clientX - startX);
      state.panY = startPanY + (e.clientY - startY);
      if (rafId) return;
      rafId = requestAnimationFrame(() => { rafId = 0; renderChart(); });
    });
    window.addEventListener("mouseup", () => {
      dragging = false;
      vp.classList.remove("is-dragging");
      try {
        localStorage.setItem("at_pan", JSON.stringify({
          zoom: state.zoom, panX: state.panX, panY: state.panY
        }));
      } catch (_) {}
    });

    vp.addEventListener("wheel", e => {
      if (state.view !== "chart") return;
      if (e.target.closest(".at-fs-editor")) return;
      e.preventDefault();
      const direction = e.deltaY > 0 ? 0.9 : 1.1;
      state.zoom = Math.max(0.35, Math.min(2.4, state.zoom * direction));
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        renderChart();
        try {
          localStorage.setItem("at_pan", JSON.stringify({
            zoom: state.zoom, panX: state.panX, panY: state.panY
          }));
        } catch (_) {}
      });
    }, { passive: false });
  }

  function resetPanZoom() {
    state.zoom = 1;
    state.panX = 20;
    state.panY = 20;
  }

  function setupChartControls() {
    $("atZoomIn")?.addEventListener("click", () => { state.zoom = Math.min(2.4, state.zoom * 1.2); renderChart(); });
    $("atZoomOut")?.addEventListener("click", () => { state.zoom = Math.max(0.35, state.zoom / 1.2); renderChart(); });
    $("atZoomReset")?.addEventListener("click", () => { resetPanZoom(); renderChart(); });
    $("atExpandAll")?.addEventListener("click", () => {
      if (!state.graph) return;
      state.graph.nodes.forEach((meta, key) => {
        if (!meta.isLeaf) state.expanded.add(key);
      });
      renderChart();
    });
    $("atCollapseAll")?.addEventListener("click", () => {
      if (!state.graph) return;
      state.expanded = new Set([state.graph.rootKey]);
      state.activePathKeys = new Set();
      renderChart();
    });
    $("atFullscreen")?.addEventListener("click", toggleFullscreen);

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
  }

  function init() {
    state.view = "list";
    populateGuideSelect();

    document.querySelectorAll(".at-view-btn").forEach(btn => {
      btn.addEventListener("click", () => setView(btn.dataset.view));
    });
    setView("list");

    const select = $("atGuideSelect");
    if (select) select.addEventListener("change", onGuideChange);

    const save = $("atSave");
    if (save) save.addEventListener("click", saveTemplates);

    const reset = $("atReset");
    if (reset) reset.addEventListener("click", resetEditor);

    setupPanZoom();
    setupChartControls();

    let resizeT;
    window.addEventListener("resize", () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        if (state.view === "chart" && state.graph) renderChart();
      }, 120);
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        hideHoverTip();
        closeFullscreenEditor();
        closeFullscreenNodePreview();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
