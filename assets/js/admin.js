(function () {
  "use strict";

  const $ = id => document.getElementById(id);
  const db = () => window.db;
  const guides = [{
    id: "debtor-update-per-bol",
    title: "Debtor Update per BOL",
    file: "assets/js/guide-flows/debtor-update-per-bol.js",
    collection: "debtor_update_per_bol_template"
  }];

  let nodes = {};
  let config = { startNode: "start" };
  let currentKey = "start";
  let path = [];
  let selectedGuide = guides[0];
  let currentRecommendation = "";

  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));

  function toast(message) {
    const el = $("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove("show"), 3000);
  }

  function templateMarkup() {
    return `<div class="template-manager">
      <div class="tm-toolbar">
        <select id="tmGuide" aria-label="Select guide">
          ${guides.map(g => `<option value="${g.id}">${esc(g.title)}</option>`).join("")}
        </select>
        <button class="admin-primary-button" id="tmReset" type="button">Start Over</button>
      </div>
      <div class="tm-path" id="tmPath">No decisions selected.</div>
      <div class="tm-question" id="tmQuestion">Loading guide…</div>
      <div class="tm-choices" id="tmChoices"></div>
      <section class="tm-editor" id="tmEditor" hidden>
        <h3 id="tmRecommendation"></h3>
        <label>Suggested Comment<textarea id="tmComment" placeholder="Enter the suggested comment template"></textarea></label>
        <label>CORR Code<textarea id="tmCorr" placeholder="Enter the CORR code"></textarea></label>
        <label>Suggested Email<textarea id="tmEmail" placeholder="Enter the suggested email template"></textarea></label>
        <button class="admin-primary-button" id="tmSave" type="button">Save Suggested Templates</button>
      </section>
    </div>`;
  }

  function parseAssignedObject(source, variableName) {
    const marker = `window.${variableName}`;
    const start = source.indexOf(marker);
    if (start < 0) throw new Error(`${marker} was not found`);
    const equals = source.indexOf("=", start);
    const end = source.lastIndexOf("};");
    if (equals < 0 || end < equals) throw new Error(`Invalid ${variableName} format`);
    return Function(`"use strict"; return (${source.slice(equals + 1, end + 1)});`)();
  }

  async function loadFlow() {
    const response = await fetch(`${selectedGuide.file}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Unable to load ${selectedGuide.title}`);
    const source = await response.text();
    nodes = parseAssignedObject(source, "GUIDE_NODES");
    try { config = parseAssignedObject(source, "GUIDE_CONFIG"); } catch (_) { config = { startNode: "start" }; }
    currentKey = config.startNode || "start";
    path = [];
    renderNode();
  }

  function isFinal(node) {
    return !!node && (!!node.action || (!Array.isArray(node.choices) || node.choices.length === 0) && !node.next);
  }

  function renderNode() {
    const node = nodes[currentKey];
    if (!node) return toast(`Node not found: ${currentKey}`);

    $("tmPath").textContent = path.length
      ? path.map(item => item.label).join("  →  ")
      : "No decisions selected.";
    $("tmQuestion").textContent = node.text || node.question || "";
    $("tmChoices").innerHTML = "";
    $("tmEditor").hidden = !isFinal(node);

    if (isFinal(node)) {
      currentRecommendation = node.action || node.text || node.question || "";
      $("tmRecommendation").textContent = `Final recommendation: ${currentRecommendation}`;
      loadSavedTemplates();
      return;
    }

    (node.choices || []).forEach(choice => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tm-choice";
      button.textContent = choice.label || choice.text || "Continue";
      button.addEventListener("click", () => {
        path.push({ label: button.textContent, key: currentKey });
        currentKey = choice.next || choice.nextKey;
        renderNode();
      });
      $("tmChoices").appendChild(button);
    });
  }

  function normalize(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  }

  async function loadSavedTemplates() {
    $("tmComment").value = "";
    $("tmCorr").value = "";
    $("tmEmail").value = "";
    if (!db()) return;
    try {
      const key = normalize(currentRecommendation);
      const docs = await Promise.all(["comment", "corr", "email"].map(type =>
        db().collection(selectedGuide.collection).doc(`${type}__${key}`).get()
      ));
      ["tmComment", "tmCorr", "tmEmail"].forEach((id, index) => {
        if (docs[index].exists) $(id).value = docs[index].data().text || "";
      });
    } catch (error) {
      toast(`Could not load saved templates: ${error.message}`);
    }
  }

  async function saveTemplates() {
    if (!db()) return toast("Firestore is not initialized");
    if (!currentRecommendation) return toast("Select a final recommendation first");
    try {
      const key = normalize(currentRecommendation);
      const batch = db().batch();
      [["comment", "tmComment"], ["corr", "tmCorr"], ["email", "tmEmail"]].forEach(([type, id]) => {
        batch.set(db().collection(selectedGuide.collection).doc(`${type}__${key}`), {
          text: $(id).value,
          recommendation: currentRecommendation,
          guideId: selectedGuide.id,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
      await batch.commit();
      toast("Suggested templates saved successfully.");
    } catch (error) {
      toast(`Save failed: ${error.message}`);
    }
  }

  function renderSection(section) {
    const titles = {
      overview: "Administrative Workspace",
      templates: "Template Manager",
      users: "User Management",
      announcements: "Announcement Center",
      guides: "Guide Management",
      permissions: "Roles & Permissions",
      settings: "System Settings"
    };
    $("workspaceTitle").textContent = titles[section] || titles.overview;
    $("workspaceDescription").textContent = section === "templates"
      ? "Create and maintain Suggested Comment, CORR Code and Suggested Email templates."
      : "Select a module to manage your Decision Support System.";
    $("workspaceContent").innerHTML = section === "templates"
      ? templateMarkup()
      : `<div class="admin-empty-state"><h3>${esc(titles[section] || "Administrative Workspace")}</h3><p>This module is unchanged.</p></div>`;

    document.querySelectorAll("[data-section]").forEach(button => {
      button.classList.toggle("active", button.dataset.section === section);
    });

    if (section === "templates") {
      $("tmReset").addEventListener("click", () => {
        currentKey = config.startNode || "start";
        path = [];
        currentRecommendation = "";
        renderNode();
      });
      $("tmGuide").addEventListener("change", event => {
        selectedGuide = guides.find(guide => guide.id === event.target.value) || guides[0];
        loadFlow().catch(error => toast(error.message));
      });
      $("tmSave").addEventListener("click", saveTemplates);
      loadFlow().catch(error => toast(error.message));
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-section]").forEach(button => {
      button.addEventListener("click", () => renderSection(button.dataset.section));
    });
    renderSection("overview");
  });
})();
