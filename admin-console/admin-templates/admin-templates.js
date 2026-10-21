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
    renderInProgress: false
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
    console.log("[AT] buildGraph starting, node count:", Object.keys(nodes).length);
    const t0 = performance.now();

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
      if (++safety > 10000) {
        console.warn("[AT] buildGraph safety break at 10000 iterations");
        break;
      }
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

    console.log(
      "[AT] buildGraph done in",
      (performance.now() - t0).toFixed(1) + "ms",
      "| nodes:", graph.nodes.size,
      "| edges:", graph.edges.length
    );
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
      if (++safety > MAX_VISIBLE * 4) {
        console.warn("[AT] computeVisible safety break");
        break;
      }
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
    const t0 = performance.now();
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
      if (++safety > MAX_VISIBLE * 4) {
        console.warn("[AT] layoutGraph BFS safety break");
        break;
      }
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

    console.log(
      "[AT] layoutGraph done in",
      (performance.now() - t0).toFixed(1) + "ms",
      "| visible:", visible.size
    );
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
    if (state.renderInProgress) {
      console.warn("[AT] renderChart re-entry blocked");
      return;
    }
    state.renderInProgress = true;
    try {
      const t0 = performance.now();
      console.log("[AT] renderChart starting");

      const svg = $("atChartSvg");
      const host = $("atChartHost");
      const vp = $("atChartViewport");
      if (!svg || !host || !vp) {
        console.warn("[AT] renderChart: missing DOM elements");
        return;
      }

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
      });

      console.log(
        "[AT] renderChart done in",
        (performance.now() - t0).toFixed(1) + "ms",
        "| drawn nodes:", nodes.length, "| edges:", edges.length
      );
    } finally {
      state.renderInProgress = false;
    }
  }

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

  async function precheckSavedTemplates() {
    console.log("[AT] precheckSavedTemplates starting");
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
      console.log("[AT] precheckSavedTemplates done, savedLeaves:", state.savedLeaves.size);
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

      // Expand root AND its immediate children so the initial chart shows
      // the first decision level (Prepaid / Collect / Third Party / No Terms).
      state.expanded = new Set([state.graph.rootKey]);
      (state.graph.adjOut.get(state.graph.rootKey) || []).forEach(k => {
        const m = state.graph.nodes.get(k);
        if (m && !m.isLeaf) state.expanded.add(k);
      });
      state.activePathKeys = new Set();

      // Restore pan/zoom from last session (safe — no render triggered here).
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

      // Restore the user's last view only now that the graph exists.
      let preferredView = "list";
      try {
        const saved = localStorage.getItem("at_view");
        if (saved === "chart" || saved === "list") preferredView = saved;
      } catch (_) {}
      if (preferredView !== state.view) {
        setView(preferredView);
      } else if (state.view === "chart") {
        // Same view but graph just changed — rerender.
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
    console.log("[AT] setView:", view);
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
        requestAnimationFrame(() => {
          console.log("[AT] rAF renderChart firing");
          renderChart();
        });
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
  }

  function init() {
    console.log("[AT] init starting");

    // Force list view on boot — chart requires a graph to render.
    // The user's last view preference is restored in onGuideChange(),
    // after the graph has been built, so there's no render-before-graph race.
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

    console.log("[AT] init done");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
