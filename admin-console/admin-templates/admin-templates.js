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

  function resolveFlowPath(path) {
    const p = String(path || "").trim();
    if (!p) return p;
    if (p.startsWith("/") || /^[a-z]+:\/\//i.test(p)) return p;
    const root = window.GUIDE_FLOW_REPO_ROOT || "/";
    return root.replace(/\/+$/, "/") + p.replace(/^\/+/, "");
  }

  /* ------------------------------------------------------------
     STATE
     ------------------------------------------------------------ */
  const state = {
    guides: [],
    flowCache: {},
    activeGuideId: "",
    activeRecommendationKey: "",
    recommendations: [],
    loadedTemplates: { comment: "", corr: "", email: "" },
    firebaseReady: false,

    graph: null,
    expanded: new Set(),
    activePathKeys: new Set(),
    view: "list",
    savedLeaves: new Set(),

    zoom: 1,
    panX: 20,
    panY: 20
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

  /* ------------------------------------------------------------
     FLOW LOADING
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

  /* ------------------------------------------------------------
     EXTRACT FINAL RECOMMENDATIONS (LIST VIEW)
     ------------------------------------------------------------ */
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

  /* ------------------------------------------------------------
     BUILD GRAPH (deduped edges — DAG-safe)
     ------------------------------------------------------------ */
  function buildGraph(nodes, startKey) {
    const graph = {
      rootKey: startKey,
      nodes: new Map(),
      edges: [],
      edgeSet: new Set()   // "from→to" dedupe
    };

    function ensure(key, parentKey, choiceLabel) {
      if (!graph.nodes.has(key)) {
        const node = nodes[key] || {};
        graph.nodes.set(key, {
          key,
          node,
          label: finalTextOf(node) || node?.text || node?.question || key,
          meta: isFinalNode(node) ? "Final" : `${(node.choices || []).length} choice${(node.choices || []).length === 1 ? "" : "s"}`,
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
        }
      }
      return graph.nodes.get(key);
    }

    ensure(startKey, null, "");

    const queue = [startKey];
    const seen = new Set([startKey]);
    while (queue.length) {
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

  /* ------------------------------------------------------------
     VISIBILITY + LAYOUT (cycle-safe, DAG-safe)
     ------------------------------------------------------------ */
  const NODE_W = 190;
  const NODE_H = 46;
  const H_GAP = 26;
  const V_GAP = 14;

  function computeVisibleSubtree(graph) {
    const visible = new Set();
    if (!graph) return visible;

    // Deduplicated adjacency for visibility walking.
    const adj = new Map();
    graph.edges.forEach(e => {
      if (!adj.has(e.from)) adj.set(e.from, []);
      adj.get(e.from).push(e.to);
    });
    adj.forEach(arr => {
      const seen = new Set();
      for (let i = arr.length - 1; i >= 0; i--) {
        if (seen.has(arr[i])) arr.splice(i, 1);
        else seen.add(arr[i]);
      }
    });

    function walk(key, parentExpanded) {
      if (visible.has(key)) return;
      visible.add(key);
      if (!parentExpanded) return;
      const kids = adj.get(key) || [];
      kids.forEach(k => walk(k, state.expanded.has(key)));
    }
    walk(graph.rootKey, true);
    return visible;
  }

  function layoutGraph(graph) {
    const positions = new Map();
    const visible = computeVisibleSubtree(graph);

    // Deduplicated child resolution + cache.
    const childCache = new Map();
    const childrenOf = (key) => {
      if (childCache.has(key)) return childCache.get(key);
      const seen = new Set();
      const out = [];
      graph.edges.forEach(e => {
        if (e.from !== key) return;
        if (!visible.has(e.to)) return;
        if (seen.has(e.to)) return;
        seen.add(e.to);
        out.push(e.to);
      });
      childCache.set(key, out);
      return out;
    };

    // Cycle-safe, memoised subtree height.
    const heights = new Map();
    const inStack = new Set();
    function heightOf(key) {
      if (heights.has(key)) return heights.get(key);
      if (inStack.has(key)) return NODE_H;
      inStack.add(key);
      const kids = childrenOf(key);
      let h;
      if (!kids.length) {
        h = NODE_H;
      } else {
        const sum = kids.reduce((acc, k) => acc + heightOf(k), 0) + V_GAP * (kids.length - 1);
        h = Math.max(NODE_H, sum);
      }
      inStack.delete(key);
      heights.set(key, h);
      return h;
    }

    // Place each node exactly once (DAG nodes appear once).
    const placed = new Set();
    function place(key, x, y) {
      if (placed.has(key)) return;
      placed.add(key);
      positions.set(key, { x, y });
      const kids = childrenOf(key);
      if (!kids.length) return;
      const totalH = kids.reduce((acc, k) => acc + heightOf(k), 0) + V_GAP * (kids.length - 1);
      let cursorY = y + heightOf(key) / 2 - totalH / 2;
      kids.forEach(k => {
        const childH = heightOf(k);
        const childY = cursorY + childH / 2;
        place(k, x + NODE_W + H_GAP, childY);
        cursorY += childH + V_GAP;
      });
    }

    heightOf(graph.rootKey);
    place(graph.rootKey, 0, 0);

    return { positions, heights, visible };
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
     RENDER — LIST VIEW
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
        <small><code>${esc(r.key)}</code> · ${esc(r.normalized)}</small>
      </button>
    `).join("");

    list.querySelectorAll("[data-rec-key]").forEach(btn => {
      btn.addEventListener("click", () => selectRecommendation(btn.dataset.recKey));
    });
  }

  /* ------------------------------------------------------------
     RENDER — CHART VIEW
     ------------------------------------------------------------ */
  function renderChart() {
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
    const pad = 40;
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

    // Edges — dedupe at draw time too, in case cache holds a pre-dedupe graph.
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
      const isExpanded = state.expanded.has(key);
      const hasKids = state.graph.edges.some(e => e.from === key);

      const classes = [
        "at-node",
        isRoot ? "at-node-start" : "",
        isLeaf ? "at-node-leaf" : "",
        isLeaf && isSaved ? "is-saved" : "",
        isLeaf && isActive ? "is-active" : "",
        hasKids && !isExpanded ? "at-node-collapsed" : ""
      ].filter(Boolean).join(" ");

      const title = isRoot ? "Start" : truncate(meta.label, 26);
      const metaText = isLeaf
        ? (isSaved ? "Templates saved" : "Edit templates")
        : (hasKids ? (isExpanded ? "Click to collapse" : "Click to expand") : "");

      nodes.push(`
        <g class="${classes}" data-node-key="${esc(key)}" transform="translate(${x},${y})">
          <rect x="0" y="0" width="${NODE_W}" height="${NODE_H}" rx="10" ry="10"
                stroke-width="${isRoot ? 0 : 1}" />
          <text class="at-node-title" x="12" y="19">${esc(title)}</text>
          <text class="at-node-meta" x="12" y="33">${esc(metaText)}</text>
          ${hasKids
            ? `<text class="at-node-toggle" x="${NODE_W - 16}" y="${NODE_H - 12}" text-anchor="middle">${isExpanded ? "−" : "+"}</text>`
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
    });
  }

  function truncate(str, max) {
    const s = String(str || "");
    if (s.length <= max) return s;
    return s.slice(0, max - 1).trim() + "…";
  }

  /* ------------------------------------------------------------
     CHART INTERACTION
     ------------------------------------------------------------ */
  function handleChartNodeClick(key) {
    const meta = state.graph?.nodes.get(key);
    if (!meta) return;

    if (meta.isLeaf) {
      selectRecommendation(key);
      return;
    }

    if (state.expanded.has(key)) state.expanded.delete(key);
    else state.expanded.add(key);
    renderChart();
    showNodePreview(key);
  }

  function computeActivePathTo(key) {
    const path = new Set();
    if (!state.graph) return path;
    const queue = [{ k: state.graph.rootKey, chain: [state.graph.rootKey] }];
    const visited = new Set();
    while (queue.length) {
      const { k, chain } = queue.shift();
      if (k === key) {
        chain.forEach(n => path.add(n));
        return path;
      }
      if (visited.has(k)) continue;
      visited.add(k);
      state.graph.edges.filter(e => e.from === k).forEach(e => {
        if (!visited.has(e.to)) queue.push({ k: e.to, chain: [...chain, e.to] });
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

  /* ------------------------------------------------------------
     SELECT RECOMMENDATION
     ------------------------------------------------------------ */
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

  /* ------------------------------------------------------------
     NODE PREVIEW (middle nodes)
     ------------------------------------------------------------ */
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

  /* ------------------------------------------------------------
     EDITOR VISIBILITY
     ------------------------------------------------------------ */
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

  /* ------------------------------------------------------------
     LOAD TEMPLATES FOR RECOMMENDATION
     ------------------------------------------------------------ */
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
     PRE-CHECK WHICH LEAVES ALREADY HAVE TEMPLATES
     ------------------------------------------------------------ */
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

  /* ------------------------------------------------------------
     SAVE / RESET
     ------------------------------------------------------------ */
  async function saveTemplates() {
    const guide = state.guides.find(g => g.id === state.activeGuideId);
    const rec = state.recommendations.find(r => r.key === state.activeRecommendationKey);
    if (!guide || !rec) return;

    const db = firestore();
    if (!db) { showToast("Firestore is not initialized.", true); return; }

    const payload = {
      comment: ($("atComment")?.value || "").trim(),
      corr:    ($("atCorr")?.value || "").trim(),
      email:   ($("atEmail")?.value || "").trim()
    };

    const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();
    const button = $("atSave");
    if (button) button.disabled = true;

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
      if (state.view === "chart") renderChart();
      showToast("Templates saved.");
    } catch (err) {
      console.error(err);
      showToast(
        err.code === "permission-denied" ? "Firestore denied the save." : "Unable to save templates.",
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
    // Force graph rebuild with dedupe even if cache holds an old graph.
    delete state.flowCache[guideId];

    const meta = $("atGuideMeta");
    if (meta) meta.textContent = "Loading flow…";

    try {
      const flow = await loadGuideFlow(guide);
      state.recommendations = extractRecommendations(flow.nodes);
      state.graph = buildGraph(flow.nodes, flow.config.startNode || "start");
      state.expanded = new Set([state.graph.rootKey]);
      state.activePathKeys = new Set();

      if (meta) {
        meta.textContent =
          `${state.recommendations.length} final recommendation${state.recommendations.length === 1 ? "" : "s"} · collection: ${guide.templateCollection}`;
      }

      renderRecommendationList();
      if (state.view === "chart") {
        resetPanZoom();
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

  /* ------------------------------------------------------------
     VIEW TOGGLE
     ------------------------------------------------------------ */
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
      requestAnimationFrame(() => renderChart());
    }
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
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        renderChart();
      });
    });
    window.addEventListener("mouseup", () => {
      dragging = false;
      vp.classList.remove("is-dragging");
    });

    vp.addEventListener("wheel", e => {
      if (state.view !== "chart") return;
      e.preventDefault();
      const direction = e.deltaY > 0 ? 0.9 : 1.1;
      state.zoom = Math.max(0.35, Math.min(2.4, state.zoom * direction));
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        renderChart();
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
  }

  /* ------------------------------------------------------------
     BOOT
     ------------------------------------------------------------ */
  function init() {
    populateGuideSelect();

    try {
      const saved = localStorage.getItem("at_view");
      state.view = saved === "chart" ? "chart" : "list";
    } catch (_) { state.view = "list"; }

    document.querySelectorAll(".at-view-btn").forEach(btn => {
      btn.addEventListener("click", () => setView(btn.dataset.view));
    });
    setView(state.view);

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
        if (state.view === "chart") renderChart();
      }, 120);
    });

    state.firebaseReady = !!firestore();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
