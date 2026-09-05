/* DSS V2 — REUSABLE GUIDE ENGINE
   Functional logic for all decision guides.
   Individual guide flows are loaded separately.
*/

(function () {
  "use strict";

  /*
   * The individual guide-flow file must be loaded
   * before this guide.js file.
   *
   * Example:
   * assets/js/guide-flows/debtor-update-per-bol.js
   */

const GUIDE_CONFIG = window.GUIDE_CONFIG || {};
const NODES = window.GUIDE_NODES || {};

const TEMPLATE_COLLECTION = GUIDE_CONFIG.templateCollection;

  const MAX_STEPS = 8;

  const state = {
    currentKey: GUIDE_CONFIG.startNode || "start",
    path: [],
    history: [],
    finalText: "",
    pathExpanded: false
  };

  const $ = id => document.getElementById(id);

  const esc = value =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const nodeText = n => n?.text || n?.question || "";
  const choices = n => Array.isArray(n?.choices) ? n.choices : [];
  const isFinal = n => !!n?.action || (!choices(n).length && !n?.next);

  function setTemplate(id,text) { const el=$(id); if(!el)return; el.textContent=text||""; el.classList.toggle("empty",!text); }
  function clearTemplates() { setTemplate("suggestedComment",""); setTemplate("suggestedCorrCode",""); setTemplate("suggestedEmail",""); }

  async function loadTemplates(recommendation) {
    clearTemplates();
    const db=window.db;
    if(!db || !recommendation) return;
    const norm=String(recommendation).toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"");
    const ids={comment:`comment__${norm}`,corr:`corr__${norm}`,email:`email__${norm}`};
    try {
      const [a,b,c]=await Promise.all([db.collection(TEMPLATE_COLLECTION).doc(ids.comment).get(),db.collection(TEMPLATE_COLLECTION).doc(ids.corr).get(),db.collection(TEMPLATE_COLLECTION).doc(ids.email).get()]);
      setTemplate("suggestedComment",a.exists ? (a.data().text||""):"");
      setTemplate("suggestedCorrCode",b.exists ? (b.data().text||""):"");
      setTemplate("suggestedEmail",c.exists ? (c.data().text||""):"");
    } catch(e) { console.warn("Guide templates unavailable:",e); }
  }

  function copyTemplate(id,btn) { const el=$(id); if(!el || el.classList.contains("empty")) return; navigator.clipboard?.writeText(el.innerText.trim()).then(()=>{ const old=btn.textContent; btn.textContent="Copied"; btn.classList.add("copied"); setTimeout(()=>{btn.textContent=old;btn.classList.remove("copied")},1400); }).catch(()=>{}); }

  function progress() {
    const pct = state.finalText ? 100 : Math.min(95, Math.round((state.path.length / MAX_STEPS) * 100));
    const fill = $("progressFill");
    if (fill) fill.style.width = pct + "%";

    $("progressText").textContent = state.finalText
      ? "Recommendation ready"
      : state.path.length
        ? "Flow in progress"
        : "Not started";

    $("metricSteps").textContent = state.path.length;
    $("metricAnswer").textContent = state.path.length ? state.path[state.path.length - 1].answer : "—";
    $("statusText").textContent = state.finalText ? "Completed" : state.path.length ? "Working" : "Ready";
  }

  function renderPath() {
    const box = $("pathBox");
    if (!box) return;

    const host = box.closest(".side-card") || box.parentElement;
    if (!host) return;

    host.classList.add("path-card");

    /* --------------------------------------------------------
       UPDATE EXPANDED STATE ON THE ACTUAL CARD
       -------------------------------------------------------- */
    host.classList.toggle("path-expanded", state.pathExpanded);

    if (!host.dataset.pathHoverBound) {
        host.dataset.pathHoverBound = "true";

        host.addEventListener("mouseenter", () => {
            if (state.path.length > 1) {
                state.pathExpanded = true;
                renderPath();
            }
        });

        host.addEventListener("mouseleave", () => {
            if (state.pathExpanded) {
                state.pathExpanded = false;
                renderPath();
            }
        });
    }

    /* --------------------------------------------------------
       NO PATH
       -------------------------------------------------------- */
    if (!state.path.length) {
        host.classList.remove("path-expanded");
        host.style.height = "170px";

        box.className = "path-empty";
        box.innerHTML =
            "No steps selected yet. The full path will appear here as you move through the steps.";

        return;
    }

    const lastIndex = state.path.length - 1;

    /* --------------------------------------------------------
       SHOW ONLY CURRENT STEP WHEN COLLAPSED
       SHOW ALL STEPS WHEN HOVERED
       -------------------------------------------------------- */
    const visiblePath = state.pathExpanded
        ? state.path
        : [state.path[lastIndex]];

    box.className = state.pathExpanded
        ? "path-list is-expanded"
        : "path-list is-collapsed";

    /* --------------------------------------------------------
       RENDER PATH ITEMS
       -------------------------------------------------------- */
    box.innerHTML = visiblePath.map((x) => {
        const i = state.path.indexOf(x);

        const active =
            i === lastIndex &&
            !state.finalText;

        const finalActive =
            state.finalText &&
            (
                x.nextKey === "__final__" ||
                isFinal(NODES[x.nextKey])
            );

        return `
            <div class="path-item">
                <button
                    class="path-jump ${active || finalActive ? "active" : ""}"
                    data-index="${i}"
                    type="button"
                >
                    <div class="path-step">
                        Step ${i + 1}
                    </div>

                    <div class="path-question">
                        ${esc(x.question)}
                    </div>

                    <div class="path-answer">
                        → ${esc(x.answer)}
                    </div>
                </button>
            </div>
        `;
    }).join("");

    /* --------------------------------------------------------
       MEASURE THE ACTUAL CARD CONTENT
       -------------------------------------------------------- */

    if (state.pathExpanded && state.path.length > 1) {

        /*
         * Temporarily remove the fixed height so the browser
         * can calculate the real content height.
         */
        host.style.height = "auto";

        requestAnimationFrame(() => {

            const requiredHeight = host.scrollHeight;

            /*
             * Add a tiny amount of breathing room so the last
             * path item never touches the bottom edge.
             */
            const finalHeight = requiredHeight + 2;

            /*
             * Set the measured height so CSS can animate
             * from the collapsed height to the real height.
             */
            host.style.height = `${finalHeight}px`;
        });

    } else {

        /*
         * Normal collapsed state.
         */
        host.style.height = "170px";
    }

    /* --------------------------------------------------------
       PATH JUMP BUTTONS
       -------------------------------------------------------- */
    box.querySelectorAll(".path-jump").forEach(btn => {
        btn.addEventListener("click", () => {
            jumpTo(Number(btn.dataset.index));
        });
    });
}

  function updateRecommendation(text, final) {
    const box = $("recommendationBox");
    if (!box) return;
    box.className = final ? "recommendation" : "recommendation empty";
    box.innerHTML = final ? esc(text).replace(/\n/g, "<br>") : "No recommendations yet.<br>Follow the flow to reach the final instruction.";
  }

  function renderFinal(finalNode) {
    const text = finalNode.action || nodeText(finalNode) || "";
    const note = finalNode.note || "";

    state.finalText = text;
    state.currentKey = "__final__";

    progress();
    renderPath();
    updateRecommendation(text, true);
    // Static JavaScript references generate the three outputs.
    // Do not call the old Firestore template loader here because it clears
    // the generated values and replaces them with blank values.
    window.dispatchEvent(new CustomEvent("guide-final-recommendation", {
      detail: {
        guideId: GUIDE_CONFIG.id,
        recommendation: text,
        path: state.path.slice()
      }
    }));

    $("stageCard").innerHTML = `
      <div class="stage-top">
        <span class="stage-badge"><i class="fa-solid fa-circle-check"></i> Flow Complete</span>
        <span class="stage-badge alt"><i class="fa-solid fa-lightbulb"></i> Final instruction</span>
      </div>
      <div class="final-card">
        <div class="final-badge"><i class="fa-solid fa-check"></i> Recommended Action</div>
        <div class="final-title">Use this handling outcome</div>
        <div class="final-text">${esc(text)}</div>
        ${note ? `<div class="final-note">${esc(note)}</div>` : ""}
        <div class="final-actions">
          <button class="action-btn" id="finalBack" type="button">Go Back</button>
          <button class="action-btn primary" id="finalRestart" type="button">Start Over</button>
        </div>
      </div>`;

    $("finalBack").onclick = goBack;
    $("finalRestart").onclick = restart;
  }

  function renderStart(node) {
    const ch = choices(node);
    const continueChoice = ch[0];
    const reminder = node.note || "";

    const choiceHtml = continueChoice ? `
      <button class="choice start-choice" data-next="${esc(continueChoice.next || "")}" data-label="${esc(continueChoice.label || "")}" data-action="${esc(continueChoice.action || "")}" data-note="${esc(continueChoice.note || "")}" type="button">
        <div class="choice-icon"><i class="${continueChoice.icon || "fa-solid fa-arrow-right"}"></i></div>
        <div class="choice-body">
          <div class="choice-title">${esc(continueChoice.label || "Continue")}</div>
          <div class="choice-desc">${esc(continueChoice.desc || "Start the decision flow.")}</div>
        </div>
      </button>` : "";

    $("stageCard").innerHTML = `
      <div class="stage-top">
        <span class="stage-badge"><i class="fa-solid fa-circle-dot"></i> Getting Started</span>
        <button class="save-guide-button" id="saveGuide" type="button"><i class="fa-regular fa-star"></i> Save Guide</button>
      </div>
      <div class="question-wrap start-card">
        <div class="question-card">
          <div class="question-label"><i class="fa-solid fa-share-nodes"></i> Current Step</div>
          <div class="question-text">${esc(nodeText(node))}</div>
          ${node.help ? `<div class="question-help">${esc(node.help).replace(/\n/g, "<br>")}</div>` : ""}
          ${reminder ? `<div class="note-card"><div class="note-head"><i class="fa-solid fa-bell"></i> Reminder</div><div class="note-body">${esc(reminder)}</div></div>` : ""}
        </div>
        <div class="choices">${choiceHtml}</div>
      </div>
      <div class="decision-footer">
        <div class="footer-step">DECISION GUIDE<strong>Ready to begin</strong></div>
        <div class="decision-actions"><button class="action-btn primary" id="startContinue" type="button">Continue <i class="fa-solid fa-arrow-right"></i></button></div>
      </div>`;

    const choice = $("stageCard").querySelector(".choice");
    if (choice) choice.addEventListener("click", () => choose(choice, node));
    $("startContinue")?.addEventListener("click", () => choice?.click());
    $("saveGuide")?.addEventListener("click", saveGuide);

    progress();
    renderPath();
  }

  function renderNode(key) {
    state.currentKey = key;
    state.finalText = "";
    clearTemplates();
    updateRecommendation("", false);

    const n = NODES[key];
    if (!n) {
      $("stageCard").innerHTML = `<div class="question-wrap"><div class="question-card"><div class="question-text">Guide step not found</div></div></div>`;
      return;
    }

    if (key === "start") {
      renderStart(n);
      return;
    }

    if (isFinal(n)) {
      renderFinal(n);
      return;
    }

    const idx = state.path.findIndex(x => x.fromKey === key);
    const prev = state.path.findIndex(x => x.nextKey === key);
    const step = idx >= 0 ? idx + 1 : prev >= 0 ? prev + 2 : state.path.length + 1;
    const ch = choices(n);

    const choicesHtml = ch.map(c => `
      <button class="choice" data-next="${esc(c.next || "")}" data-label="${esc(c.label || "")}" data-action="${esc(c.action || "")}" data-note="${esc(c.note || "")}" type="button">
        <div class="choice-icon"><i class="${c.icon || "fa-solid fa-circle"}"></i></div>
        <div class="choice-body">
          <div class="choice-title">${esc(c.label || "")}</div>
          <div class="choice-desc">${esc(c.desc || "Continue to the next step.")}</div>
        </div>
      </button>`).join("");

    const image = n.image ? `<div class="question-image" id="questionImage"><img src="${esc(n.image)}" alt="Guide reference image" loading="lazy"></div>` : "";

    $("stageCard").innerHTML = `
      <div class="stage-top">
        <span class="stage-badge"><i class="fa-solid fa-route"></i> Guided Decision</span>
        <span class="stage-badge alt"><i class="fa-solid fa-list-ol"></i> Step ${step}</span>
      </div>
      <div class="question-wrap">
        <div class="question-card">
          <div class="question-label"><i class="fa-solid fa-circle-nodes"></i> Decision Point</div>
          <div class="question-text">${esc(nodeText(n))}</div>
          ${n.help ? `<div class="question-help">${esc(n.help).replace(/\n/g, "<br>")}</div>` : ""}
          ${n.note ? `<div class="note-card"><div class="note-head"><i class="fa-solid fa-bell"></i> Reminder</div><div class="note-body">${esc(n.note)}</div></div>` : ""}
          ${image}
        </div>
        <div class="choices">${choicesHtml}</div>
      </div>
      <div class="decision-footer">
        <div class="footer-step">DECISION GUIDE<strong>Currently on step ${step}</strong></div>
        <div class="decision-actions">
          <button class="action-btn" id="inlineBack" type="button">Go Back</button>
          <button class="action-btn primary" id="inlineRestart" type="button">Start Over</button>
        </div>
      </div>`;

    $("inlineBack").onclick = goBack;
    $("inlineRestart").onclick = restart;
    if ($("questionImage")) $("questionImage").onclick = () => openImageModal(n.image);
    $("stageCard").querySelectorAll(".choice").forEach(btn => btn.addEventListener("click", () => choose(btn, n)));

    progress();
    renderPath();
  }

  function choose(btn, node) {
    const next = btn.dataset.next;
    const label = btn.dataset.label;
    const action = btn.dataset.action;
    const note = btn.dataset.note;

    /*
     * The INTRO / START screen is not part of the
     * decision path.
     *
     * Therefore clicking "Continue" from the intro
     * should NOT create a Selected Path step.
     */
    if (state.currentKey === "start") {
        state.currentKey = next;
        state.finalText = "";
        clearTemplates();
        updateRecommendation("", false);

        renderNode(next);
        return;
    }

    /*
     * If the user changes an earlier decision,
     * remove everything after that decision.
     */
    const existing = state.path.findIndex(
        x => x.fromKey === state.currentKey
    );

    if (existing >= 0) {
        state.path = state.path.slice(0, existing);
    }

    /*
     * Prevent duplicate / stale path entries when
     * navigating back into an existing branch.
     */
    const reached = state.path.findIndex(
        x => x.nextKey === state.currentKey
    );

    if (existing < 0 && reached >= 0) {
        state.path = state.path.slice(0, reached + 1);
    }

    /*
     * Save history before adding the new decision.
     */
    state.history.push({
        key: state.currentKey,
        path: [...state.path]
    });

    /*
     * Add ONLY real decision steps.
     *
     * The "start" intro never reaches this section.
     */
    state.path.push({
        question: nodeText(node),
        answer: label,
        fromKey: state.currentKey,
        nextKey: action ? "__final__" : next,
        finalNode: action
            ? { action, note }
            : null
    });

    btn.classList.add("selected");

    progress();
    renderPath();

    /*
     * Continue to the selected answer.
     */
    setTimeout(() => {
        if (action) {
            renderFinal({ action, note });
        } else {
            renderNode(next);
        }
    }, 100);
}

  function goBack() {
    clearTemplates();
    state.finalText = "";
    updateRecommendation("", false);

    if (state.currentKey === "__final__") {
      const i = state.path.findIndex(x => x.nextKey === "__final__" || isFinal(NODES[x.nextKey]));
      if (i < 0) return renderNode("start");
      state.path = state.path.slice(0, i);
      return renderNode(i === 0 ? "start" : state.path[i - 1].nextKey);
    }

    const i = state.path.findIndex(x => x.fromKey === state.currentKey);
    if (i >= 0) {
      state.path = state.path.slice(0, i);
      return renderNode(i === 0 ? "start" : state.path[i - 1].nextKey);
    }

    const j = state.path.findIndex(x => x.nextKey === state.currentKey);
    if (j >= 0) return renderNode(state.path[j].fromKey);

    renderNode("start");
  }

  function restart() {
    state.path = [];
    state.history = [];
    state.finalText = "";
    state.pathExpanded = false;
state.currentKey = GUIDE_CONFIG.startNode || "start";
clearTemplates();
updateRecommendation("", false);
renderNode(GUIDE_CONFIG.startNode || "start");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

function jumpTo(i) {
    const x = state.path[i];
    if (!x) return;

    /*
     * Remove any later decisions.
     * The clicked step becomes the current point
     * in the decision flow.
     */
    state.path = state.path.slice(0, i + 1);

    /*
     * Clear the final recommendation because we're
     * going back into the decision flow.
     */
    state.finalText = "";

    /*
     * Clear templates/recommendation from the previous
     * final state.
     */
    clearTemplates();
    updateRecommendation("", false);

    /*
     * IMPORTANT:
     *
     * x.fromKey is the node represented by this
     * Selected Path item.
     *
     * Do NOT use x.nextKey here.
     */
    renderNode(x.fromKey);
}

  function saveGuide() {
    const key = "savedGuides";
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(key) || "[]"); } catch (_) {}
   const guide = {
  title: GUIDE_CONFIG.title || document.title || "Decision Guide",
  url: window.location.pathname
};
    const exists = saved.some(x => x.url === guide.url);
    saved = exists ? saved.filter(x => x.url !== guide.url) : [...saved, guide];
    localStorage.setItem(key, JSON.stringify(saved));

    const btn = $("saveGuide");
    if (btn) {
      btn.innerHTML = exists ? '<i class="fa-regular fa-star"></i> Save Guide' : '<i class="fa-solid fa-star"></i> Saved';
      btn.classList.toggle("saved", !exists);
    }
  }


  function showToast(message) {
    const toast = $("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__guideToastTimer);
    window.__guideToastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
  }

  function bindTemplateButtons() {
    document.querySelectorAll(".template-copy").forEach((button) => {
      button.addEventListener("click", () => {
        copyTemplate(button.dataset.target, button);
      });
    });

    document.querySelectorAll(".template-link").forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.target;
        if (target) {
          window.location.href = target;
        } else {
          showToast("Reference tool link is not configured yet.");
        }
      });
    });
  }

  function openImageModal(src) {
    const modal = $("imageModal");
    const image = $("imageModalImg");
    if (!modal || !image || !src) return;
    image.src = src;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeImageModal() {
    const modal = $("imageModal");
    const image = $("imageModalImg");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (image) image.removeAttribute("src");
  }

function init() {
  // Render the guide first. Optional helper controls must never prevent
  // the decision flow from appearing.
  renderNode(GUIDE_CONFIG.startNode || "start");

    $("restartGuide")?.addEventListener("click", restart);
    $("backToGroup")?.addEventListener("click", () => history.back());

    bindTemplateButtons();

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeImageModal();
    });

    $("imageModal")?.addEventListener("click", (event) => {
      if (event.target.id === "imageModal") closeImageModal();
    });

    window.guideEngine = {
      restart,
      goBack,
      openImageModal,
      closeImageModal
    };
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
