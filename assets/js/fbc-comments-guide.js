
window.SITE_BASE = "";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDjaMdeh0Cgx00hzDyZOi54fDkR81wnxJU",
    authDomain: "bdgg-database.firebaseapp.com",
    projectId: "bdgg-database",
    storageBucket: "bdgg-database.appspot.com",
    messagingSenderId: "43574975434",
    appId: "1:43574975434:web:4c79e581267fdfcc6ccd33"
  });
}

window.auth = firebase.auth();
window.db = firebase.firestore();



/* =========================================================
   SHARED HEADER MODAL CONTROLLER
   Keeps Feedback, Get Help, View Comments, Profile, Logout.
========================================================= */

let selectedRating = 0;
let commentsUnsubscribe = null;
let ratingStars = [];

function initRatingStars() {
  ratingStars = Array.from(document.querySelectorAll(".rating-star"));

  ratingStars.forEach(star => {
    star.onclick = () => {
      selectedRating = Number(star.dataset.value);

      ratingStars.forEach(s => {
        s.classList.toggle("selected", Number(s.dataset.value) <= selectedRating);
      });
    };
  });
}

function openAnimatedModal(modal) {
  if (!modal) return;

  modal.style.display = "flex";
  modal.classList.remove("is-closing");

  requestAnimationFrame(() => {
    modal.classList.add("is-open");
  });
}

function closeAnimatedModal(modal, onClosed) {
  if (!modal) return;

  modal.classList.remove("is-open");
  modal.classList.add("is-closing");

  setTimeout(() => {
    modal.style.display = "none";
    modal.classList.remove("is-closing");

    if (typeof onClosed === "function") {
      onClosed();
    }
  }, 220);
}

function openComment() {
  openAnimatedModal(document.getElementById("commentModal"));
}

function closeComment() {
  closeAnimatedModal(document.getElementById("commentModal"));
}

function openHelp() {
  openAnimatedModal(document.getElementById("helpModal"));
}

function closeHelp() {
  closeAnimatedModal(document.getElementById("helpModal"));
}

function closeAllComments() {
  closeAnimatedModal(document.getElementById("allCommentsModal"), () => {
    if (commentsUnsubscribe) {
      commentsUnsubscribe();
      commentsUnsubscribe = null;
    }
  });
}

async function sendComment() {
  const nameInput = document.getElementById("commentName");
  const commentInput = document.getElementById("commentText");
  const message = document.getElementById("feedbackMessage");

  const name = nameInput ? nameInput.value.trim() : "";
  const comment = commentInput ? commentInput.value.trim() : "";

  if (!selectedRating) {
    if (message) {
      message.style.display = "block";
      message.style.color = "#ef4444";
      message.textContent = "Please select a star rating first.";
    } else {
      alert("Please select a star rating first.");
    }
    return;
  }

  try {
    await window.db.collection("feedback").add({
      rating: selectedRating,
      name: name || "Anonymous",
      comment,
      page: "FBC Comments Guide",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    if (message) {
      message.style.display = "block";
      message.style.color = "#16a34a";
      message.textContent = "Thank you. Your feedback has been submitted.";
    }

    if (nameInput) nameInput.value = "";
    if (commentInput) commentInput.value = "";

    selectedRating = 0;
    ratingStars.forEach(s => s.classList.remove("selected"));

    setTimeout(() => {
      if (message) message.style.display = "none";
      closeComment();
    }, 1200);
  } catch (error) {
    console.error(error);

    if (message) {
      message.style.display = "block";
      message.style.color = "#ef4444";
      message.textContent = "Something went wrong while sending feedback.";
    } else {
      alert("Something went wrong while sending feedback.");
    }
  }
}

function showAllComments() {
  const commentModal = document.getElementById("commentModal");
  const modal = document.getElementById("allCommentsModal");
  const list = document.getElementById("commentsList");

  if (!modal || !list) return;

  list.innerHTML = "<p>Loading comments...</p>";

  if (commentsUnsubscribe) {
    commentsUnsubscribe();
    commentsUnsubscribe = null;
  }

  const loadComments = () => {
    openAnimatedModal(modal);

    commentsUnsubscribe = window.db.collection("feedback")
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {
        if (snapshot.empty) {
          list.innerHTML = "<p>No comments yet.</p>";
          return;
        }

        let html = "";

        snapshot.forEach(doc => {
          const item = doc.data();
          const rating = Number(item.rating || 0);
          const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

          html += `
            <div class="comment-list-item">
              <span class="stars">${stars}</span>
              <strong>${escapeHtml(item.name || "Anonymous")}</strong>
              <p style="margin:6px 0 0;">${escapeHtml(item.comment || "No comment provided.")}</p>
            </div>
          `;
        });

        list.innerHTML = html;
      }, error => {
        console.error(error);
        list.innerHTML = "<p>Unable to load comments right now.</p>";
      });
  };

  if (commentModal && commentModal.style.display === "flex") {
    closeAnimatedModal(commentModal, loadComments);
  } else {
    loadComments();
  }
}

window.openComment = openComment;
window.closeComment = closeComment;
window.openHelp = openHelp;
window.closeHelp = closeHelp;
window.showAllComments = showAllComments;
window.closeAllComments = closeAllComments;
window.sendComment = sendComment;

window.addEventListener("click", e => {
  const commentModal = document.getElementById("commentModal");
  const allCommentsModal = document.getElementById("allCommentsModal");
  const helpModal = document.getElementById("helpModal");

  if (e.target === commentModal) closeComment();
  if (e.target === allCommentsModal) closeAllComments();
  if (e.target === helpModal) closeHelp();
});

document.addEventListener("DOMContentLoaded", initRatingStars);
document.addEventListener("headerLoaded", initRatingStars);
setTimeout(initRatingStars, 300);



/* =========================================================
   FBC COMMENT BUILDER
   Loads FBC-comment.xlsx and powers the builder.
========================================================= */

let fbcInitialized = false;

function showToast(message = "Copied!") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
  }, 1500);
}

function scrollToBuilder() {
  const target = document.getElementById("fbcBuilder");
  if (!target) return;

  const y = target.getBoundingClientRect().top + window.scrollY - 20;
  window.scrollTo({ top: y, behavior: "smooth" });
}

function escapeHtml(text) {
  return String(text || "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      return true;
    } catch (fallbackError) {
      console.error(fallbackError);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

function initFbcCommentsPage() {
  if (fbcInitialized) return;
  fbcInitialized = true;

  const queueTypeSelect = document.getElementById("queueTypeSelect");
  const actionTakenSelect = document.getElementById("actionTakenSelect");
  const caseNumberInput = document.getElementById("caseNumberInput");
  const aiContextInput = document.getElementById("aiContextInput");
  const autoCopyToggle = document.getElementById("autoCopyToggle");
  const editModeToggle = document.getElementById("editModeToggle");
  const includeContextToggle = document.getElementById("includeContextToggle");
  const generatedCommentBox = document.getElementById("generatedCommentBox");
  const copiedBadge = document.getElementById("copiedBadge");
  const statusPill = document.getElementById("statusPill");
  const selectedQueueValue = document.getElementById("selectedQueueValue");
  const selectedActionValue = document.getElementById("selectedActionValue");
  const selectedCodeValue = document.getElementById("selectedCodeValue");
  const generatorStatusValue = document.getElementById("generatorStatusValue");
  const heroQueueCount = document.getElementById("heroQueueCount");
  const heroActionCount = document.getElementById("heroActionCount");
  const assistantChecks = document.getElementById("assistantChecks");
  const aiSuggestions = document.getElementById("aiSuggestions");
  const generatedMiniStatus = document.getElementById("generatedMiniStatus");
  const caseWarning = document.getElementById("caseWarning");
  const recentCommentsList = document.getElementById("recentCommentsList");

  if (!queueTypeSelect || !actionTakenSelect || !generatedCommentBox) {
    console.warn("FBC Builder elements were not found.");
    return;
  }

  let DATA = [];

  function setStatus(label) {
    if (statusPill) statusPill.textContent = label;
  }

  function showCopiedBadge() {
    if (!copiedBadge) return;

    copiedBadge.classList.add("show");
    clearTimeout(showCopiedBadge.timer);

    showCopiedBadge.timer = setTimeout(() => {
      copiedBadge.classList.remove("show");
    }, 1600);
  }

  function autoResizeTextarea(el) {
    if (!el) return;

    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }

  function getCell(row, possibleNames) {
    const keys = Object.keys(row);

    for (const name of possibleNames) {
      const exactKey = keys.find(k => k.trim().toLowerCase() === name.trim().toLowerCase());
      if (exactKey) return row[exactKey];
    }

    return "";
  }

  function normalizeRows(rows) {
    return rows.map(row => ({
      queueType: String(getCell(row, ["Queue Type", "Queue", "QueueType"])).trim(),
      action: String(getCell(row, ["Action", "Action Taken", "Type"])).trim(),
      code: String(getCell(row, ["2x4 Comment", "2x4 Comment ", "2x4", "Code"])).trim(),
      recommendedComment: String(getCell(row, [
        "Recommended Comment",
        "Recommended comment",
        "Recommended Comments",
        "Comment",
        "Recommendation"
      ])).trim()
    })).filter(row => row.queueType && row.action);
  }

  function cleanText(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .replace(/\s+([.,;:])/g, "$1")
      .trim();
  }

  function trimEndingPeriod(text) {
    return cleanText(text).replace(/[.\s]+$/g, "");
  }

  function populateQueueTypes() {
    const queueTypes = [...new Set(DATA.map(item => item.queueType))].sort();

    queueTypeSelect.innerHTML = '<option value="">Select Queue Type</option>';

    queueTypes.forEach(queue => {
      const option = document.createElement("option");
      option.value = queue;
      option.textContent = queue;
      queueTypeSelect.appendChild(option);
    });

    if (heroQueueCount) heroQueueCount.textContent = queueTypes.length || "—";
  }

  function populateActions(queueType) {
    actionTakenSelect.innerHTML = '<option value="">Select Action Taken</option>';

    if (!queueType) {
      actionTakenSelect.disabled = true;
      if (heroActionCount) heroActionCount.textContent = "—";
      return;
    }

    const actions = [...new Set(
      DATA.filter(item => item.queueType === queueType).map(item => item.action)
    )].sort();

    actions.forEach(action => {
      const option = document.createElement("option");
      option.value = action;
      option.textContent = action;
      actionTakenSelect.appendChild(option);
    });

    actionTakenSelect.disabled = false;
    if (heroActionCount) heroActionCount.textContent = actions.length || "—";

    const savedAction = localStorage.getItem("fbc_last_action_" + queueType);
    if (savedAction && actions.includes(savedAction)) {
      actionTakenSelect.value = savedAction;
    }
  }

  function getSelectedRow() {
    const queueType = queueTypeSelect.value;
    const action = actionTakenSelect.value;

    return DATA.find(item => item.queueType === queueType && item.action === action) || null;
  }

  function getRecentComments() {
    try {
      return JSON.parse(localStorage.getItem("fbc_recent_comments") || "[]");
    } catch {
      return [];
    }
  }

  function saveRecentComment(comment) {
    if (!comment) return;

    const row = getSelectedRow();
    let list = getRecentComments().filter(item => item.comment !== comment);

    list.unshift({
      comment,
      queue: queueTypeSelect.value || "FBC",
      action: actionTakenSelect.value || "Generated",
      code: row?.code || "VS-BLER",
      caseNumber: caseNumberInput.value.trim(),
      recommendedComment: row?.recommendedComment || "",
      createdAt: new Date().toISOString()
    });

    list = list.slice(0, 5);
    localStorage.setItem("fbc_recent_comments", JSON.stringify(list));
    renderRecentComments();
  }

  function renderRecentComments() {
    const list = getRecentComments();

    if (!recentCommentsList) return;

    if (!list.length) {
      recentCommentsList.innerHTML = '<div class="helper-text">Generated comments will appear here for quick reuse during this browser session.</div>';
      return;
    }

    recentCommentsList.innerHTML = list.map((item, index) => `
      <div class="recent-item" data-index="${index}">
        <strong>${escapeHtml(item.code || "FBC")} • ${escapeHtml(item.action || "Generated")}</strong>
        <span>${escapeHtml(item.comment || "")}</span>
      </div>
    `).join("");

    recentCommentsList.querySelectorAll(".recent-item").forEach(item => {
      item.addEventListener("click", () => {
        const selected = list[Number(item.dataset.index)];
        if (!selected) return;

        if (selected.queue) {
          queueTypeSelect.value = selected.queue;
          populateActions(selected.queue);
        }

        if (selected.action) {
          actionTakenSelect.value = selected.action;
        }

        caseNumberInput.value = selected.caseNumber || "";
        generatedCommentBox.value = selected.comment || "";

        autoResizeTextarea(generatedCommentBox);
        updateGeneratedStatus(Boolean(selected.comment));
        updateState();

        showToast("Previous comment loaded.");
      });
    });
  }

  function updateGeneratedStatus(isReady) {
    if (!generatedMiniStatus) return;

    generatedMiniStatus.classList.toggle("ready", Boolean(isReady));
    generatedMiniStatus.innerHTML = isReady
      ? '<i class="fa-solid fa-circle-check"></i> Comment Ready'
      : '<i class="fa-solid fa-circle"></i> Waiting';
  }

  function validateCaseNumber(showWarning = true) {
    const value = caseNumberInput.value.trim();
    const valid = !value || /^\d+$/.test(value);

    if (caseWarning) {
      caseWarning.classList.toggle("show", showWarning && !valid);
    }

    return valid;
  }

  function updateAssistantChecks() {
    if (!assistantChecks || !aiSuggestions) return;

    const row = getSelectedRow();
    const caseNumber = caseNumberInput.value.trim();
    const hasValidCase = /^\d+$/.test(caseNumber);
    const checks = [];
    const suggestions = [];

    if (queueTypeSelect.value) checks.push("Queue type selected.");
    else suggestions.push("Select the queue type first so the assistant can load the correct action list.");

    if (actionTakenSelect.value) checks.push("Action taken selected.");
    else suggestions.push("Choose the exact action taken before generating the comment.");

    if (caseNumber && hasValidCase) checks.push("Case number format looks valid.");
    else if (caseNumber && !hasValidCase) suggestions.push("Case # should be numeric only to avoid an invalid FBC comment.");
    else suggestions.push("Enter the actual case number you are currently working.");

    if (row?.recommendedComment) checks.push("Workbook recommendation loaded.");

    if (includeContextToggle && includeContextToggle.checked && aiContextInput.value.trim()) {
      checks.push("Optional case context ready.");
    }

    assistantChecks.innerHTML = checks.length
      ? checks.map(item => `<div><i class="fa-solid fa-circle-check" style="color:#16a34a;"></i> ${escapeHtml(item)}</div>`).join("")
      : "Select Queue Type, Action Taken, and Case # to view smart checks.";

    aiSuggestions.innerHTML = suggestions.slice(0, 3).map(item => `
      <div class="ai-suggestion">
        <i class="fa-solid fa-lightbulb"></i>
        <span>${escapeHtml(item)}</span>
      </div>
    `).join("");
  }

  function updateState() {
    const row = getSelectedRow();
    const caseNumber = caseNumberInput.value.trim();

    validateCaseNumber(Boolean(caseNumber));

    if (selectedQueueValue) selectedQueueValue.textContent = queueTypeSelect.value || "—";
    if (selectedActionValue) selectedActionValue.textContent = actionTakenSelect.value || "—";
    if (selectedCodeValue) selectedCodeValue.textContent = row?.code || "—";

    if (!queueTypeSelect.value) {
      if (generatorStatusValue) generatorStatusValue.textContent = "Waiting";
      setStatus("Ready");
    } else if (!actionTakenSelect.value) {
      if (generatorStatusValue) generatorStatusValue.textContent = "Waiting for Action";
      setStatus("Select Action Taken");
    } else if (!caseNumber) {
      if (generatorStatusValue) generatorStatusValue.textContent = "Waiting for Case #";
      setStatus("Enter Case #");
    } else if (!validateCaseNumber(false)) {
      if (generatorStatusValue) generatorStatusValue.textContent = "Invalid Case #";
      setStatus("Fix Case #");
    } else {
      if (generatorStatusValue) {
        generatorStatusValue.textContent = generatedCommentBox.value.trim() ? "Generated" : "Ready to Generate";
      }

      setStatus(generatedCommentBox.value.trim() ? "Comment Ready" : "Ready to Generate");
    }

    updateAssistantChecks();
    updateGeneratedStatus(Boolean(generatedCommentBox.value.trim()));
  }

  function buildAssistantComment(row, caseNumber) {
    const code = row.code || "VS-BLER";
    const base = trimEndingPeriod(row.recommendedComment || "NO RECOMMENDED COMMENT FOUND");
    const context = aiContextInput ? cleanText(aiContextInput.value) : "";

    let finalText = base;

    if (includeContextToggle && includeContextToggle.checked && context) {
      finalText = `${base}. Additional case context: ${trimEndingPeriod(context)}`;
    }

    return {
      code,
      caseNumber,
      finalText,
      fullComment: `${code}-${caseNumber}-${finalText}`
    };
  }

  window.generateFbcComment = async function () {
    const row = getSelectedRow();
    const caseNumber = caseNumberInput.value.trim();

    if (!queueTypeSelect.value || !actionTakenSelect.value || !caseNumber) {
      showToast("Complete Queue Type, Action Taken, and Case # first.");
      updateState();
      return;
    }

    if (!validateCaseNumber(true)) {
      showToast("Case # should only contain numbers.");
      updateState();
      return;
    }

    if (!row) {
      showToast("No matching comment found.");
      if (generatorStatusValue) generatorStatusValue.textContent = "No Match";
      setStatus("No Match");
      return;
    }

    localStorage.setItem("fbc_last_action_" + queueTypeSelect.value, actionTakenSelect.value);

    setStatus("Generating...");

    const result = buildAssistantComment(row, caseNumber);
    generatedCommentBox.value = result.fullComment;

    autoResizeTextarea(generatedCommentBox);

    if (generatorStatusValue) generatorStatusValue.textContent = "Generated";

    setStatus("Comment Ready");
    updateGeneratedStatus(true);
    saveRecentComment(result.fullComment);

    if (autoCopyToggle && autoCopyToggle.checked) {
      const copied = await copyToClipboard(result.fullComment);
      if (copied) {
        showCopiedBadge();
        showToast("Generated & copied!");
      } else {
        showToast("Generated. Copy failed.");
      }
    } else {
      showToast("FBC comment generated!");
    }
  };

  window.copyGeneratedComment = async function () {
    const text = generatedCommentBox.value.trim();

    if (!text) {
      showToast("Generate a comment first.");
      return;
    }

    const copied = await copyToClipboard(text);

    if (copied) {
      showCopiedBadge();
      showToast("FBC comment copied!");
    } else {
      showToast("Unable to copy comment.");
    }
  };

  window.clearRecentComments = function () {
    localStorage.removeItem("fbc_recent_comments");
    renderRecentComments();
    showToast("Recent comments cleared.");
  };

  window.clearFbcBuilder = function () {
    queueTypeSelect.value = "";
    actionTakenSelect.innerHTML = '<option value="">Select Action Taken</option>';
    actionTakenSelect.disabled = true;

    caseNumberInput.value = "";
    if (aiContextInput) aiContextInput.value = "";
    generatedCommentBox.value = "";

    autoResizeTextarea(generatedCommentBox);

    if (selectedQueueValue) selectedQueueValue.textContent = "—";
    if (selectedActionValue) selectedActionValue.textContent = "—";
    if (selectedCodeValue) selectedCodeValue.textContent = "—";
    if (generatorStatusValue) generatorStatusValue.textContent = "Waiting";
    if (heroActionCount) heroActionCount.textContent = "—";

    setStatus("Ready");
    updateState();
  };

  queueTypeSelect.addEventListener("change", () => {
    populateActions(queueTypeSelect.value);
    generatedCommentBox.value = "";
    autoResizeTextarea(generatedCommentBox);
    updateState();
  });

  actionTakenSelect.addEventListener("change", () => {
    generatedCommentBox.value = "";
    autoResizeTextarea(generatedCommentBox);
    updateState();
  });

  caseNumberInput.addEventListener("input", () => {
    generatedCommentBox.value = "";
    autoResizeTextarea(generatedCommentBox);
    updateState();
  });

  if (aiContextInput) aiContextInput.addEventListener("input", updateState);
  if (includeContextToggle) includeContextToggle.addEventListener("change", updateState);

  if (editModeToggle) {
    editModeToggle.addEventListener("change", () => {
      generatedCommentBox.readOnly = !editModeToggle.checked;
      showToast(editModeToggle.checked ? "Edit mode enabled." : "Edit mode locked.");
    });
  }

  const workbookPaths = [
    "assets/references/FBC-comment.xlsx",
    "assets/references/FBC-comment.xlsx",
    "./FBC-comment.xlsx",
    "./FBC-comment(1).xlsx"
  ];

  (async function loadWorkbook() {
    let buffer = null;
    let loadedPath = "";

    for (const path of workbookPaths) {
      try {
        const response = await fetch(path, { cache: "no-store" });

        if (response.ok) {
          buffer = await response.arrayBuffer();
          loadedPath = path;
          break;
        }
      } catch (error) {
        console.warn("Unable to load workbook path:", path, error);
      }
    }

    if (!buffer) {
      setStatus("Workbook Missing");

      if (generatorStatusValue) generatorStatusValue.textContent = "Workbook Missing";

      generatedCommentBox.value = "Unable to load FBC-comment.xlsx. Make sure the workbook is saved in the same folder as this page.";
      autoResizeTextarea(generatedCommentBox);
      updateGeneratedStatus(false);

      return;
    }

    try {
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      DATA = normalizeRows(rawRows);

      populateQueueTypes();
      renderRecentComments();

      if (generatorStatusValue) generatorStatusValue.textContent = "Ready";

      setStatus("Ready");
      updateState();

      console.log("FBC workbook loaded:", loadedPath, DATA.length, "rows");
    } catch (error) {
      console.error("Unable to parse FBC workbook:", error);

      setStatus("Workbook Error");

      if (generatorStatusValue) generatorStatusValue.textContent = "Workbook Error";

      generatedCommentBox.value = "The workbook was found, but it could not be read. Please check the FBC-comment.xlsx file.";
      autoResizeTextarea(generatedCommentBox);
      updateGeneratedStatus(false);
    }
  })();
}

document.addEventListener("DOMContentLoaded", initFbcCommentsPage);
document.addEventListener("headerLoaded", initFbcCommentsPage);
setTimeout(initFbcCommentsPage, 300);



/* =========================================================
   FBI INSTRUCTION MODAL CONTROLLER
   Keep the modal HTML below this script.
========================================================= */

let currentFbiStep = 0;
let fbiAutoPlayTimer = null;

function getFbiSteps() {
  return Array.from(document.querySelectorAll("#fbiModal .fbi-step"));
}

function updateFbiProgress() {
  const steps = getFbiSteps();
  const total = steps.length || 1;
  const current = currentFbiStep + 1;
  const percent = Math.round((current / total) * 100);

  const stepText = document.getElementById("fbiStepCounter");
  const progressText = document.getElementById("fbiProgressPercent");
  const progressFill = document.getElementById("fbiProgressFill");
  const prevBtn = document.getElementById("fbiPrevBtn");
  const nextBtn = document.getElementById("fbiNextBtn");
  const dots = Array.from(document.querySelectorAll(".fbi-dot"));

  if (stepText) stepText.textContent = `Step ${current} of ${total}`;
  if (progressText) progressText.textContent = `${percent}% Complete`;
  if (progressFill) progressFill.style.width = `${percent}%`;
  if (prevBtn) prevBtn.disabled = currentFbiStep === 0;

  if (nextBtn) {
    nextBtn.innerHTML = currentFbiStep === total - 1
      ? '<i class="fa-solid fa-check"></i> Finish'
      : 'Next <i class="fa-solid fa-arrow-right"></i>';
  }

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentFbiStep);
  });
}

function showFbiStep(index) {
  const steps = getFbiSteps();
  if (!steps.length) return;

  currentFbiStep = Math.max(0, Math.min(index, steps.length - 1));

  steps.forEach((step, stepIndex) => {
    step.classList.toggle("active", stepIndex === currentFbiStep);
  });

  updateFbiProgress();
}

function openFbiModal() {
  const modal = document.getElementById("fbiModal");
  if (!modal) return;

  modal.classList.add("show");
  document.body.classList.add("modal-open");

  stopFbiAutoPlay();
  showFbiStep(0);
}

function closeFbiModal() {
  const modal = document.getElementById("fbiModal");
  if (!modal) return;

  modal.classList.remove("show");
  document.body.classList.remove("modal-open");

  stopFbiAutoPlay();
}

function nextFbiStep() {
  const steps = getFbiSteps();
  if (!steps.length) return;

  if (currentFbiStep >= steps.length - 1) {
    closeFbiModal();
    return;
  }

  showFbiStep(currentFbiStep + 1);
}

function prevFbiStep() {
  showFbiStep(currentFbiStep - 1);
}

function goToFbiStep(index) {
  stopFbiAutoPlay();
  showFbiStep(index);
}

function toggleFbiAutoPlay() {
  const autoBtn = document.getElementById("fbiAutoBtn");

  if (fbiAutoPlayTimer) {
    stopFbiAutoPlay();
    return;
  }

  if (autoBtn) autoBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';

  fbiAutoPlayTimer = setInterval(() => {
    const steps = getFbiSteps();

    if (currentFbiStep >= steps.length - 1) {
      stopFbiAutoPlay();
      return;
    }

    showFbiStep(currentFbiStep + 1);
  }, 3000);
}

function stopFbiAutoPlay() {
  if (fbiAutoPlayTimer) {
    clearInterval(fbiAutoPlayTimer);
    fbiAutoPlayTimer = null;
  }

  const autoBtn = document.getElementById("fbiAutoBtn");
  if (autoBtn) autoBtn.innerHTML = '<i class="fa-solid fa-play"></i> Auto';
}

function zoomFbiImage(img) {
  const modal = document.getElementById("imageZoomModal");
  const zoomed = document.getElementById("zoomedFbiImage");

  if (!modal || !zoomed || !img) return;

  zoomed.src = img.src;
  zoomed.alt = img.alt || "FBI instruction image";
  modal.classList.add("show");
}

function closeFbiZoom() {
  const modal = document.getElementById("imageZoomModal");
  if (modal) modal.classList.remove("show");
}

window.openFbiModal = openFbiModal;
window.closeFbiModal = closeFbiModal;
window.nextFbiStep = nextFbiStep;
window.prevFbiStep = prevFbiStep;
window.goToFbiStep = goToFbiStep;
window.toggleFbiAutoPlay = toggleFbiAutoPlay;
window.zoomFbiImage = zoomFbiImage;
window.closeFbiZoom = closeFbiZoom;

document.addEventListener("keydown", event => {
  const modal = document.getElementById("fbiModal");
  const zoom = document.getElementById("imageZoomModal");

  if (zoom?.classList.contains("show") && event.key === "Escape") {
    closeFbiZoom();
    return;
  }

  if (!modal?.classList.contains("show")) return;

  if (event.key === "Escape") closeFbiModal();
  if (event.key === "ArrowRight") nextFbiStep();
  if (event.key === "ArrowLeft") prevFbiStep();
});




function scrollToBuilder() {
  const target = document.getElementById("fbcBuilder");
  if (!target) return;
  const y = target.getBoundingClientRect().top + window.scrollY - 20;
  window.scrollTo({ top: y, behavior: "smooth" });
}

function focusFbcSearch() {
  const input = document.getElementById("fbcSearch");
  if (!input) {
    scrollToBuilder();
    return;
  }
  input.focus();
  input.scrollIntoView({ behavior: "smooth", block: "center" });
}

function clearFbcSearch() {
  const input = document.getElementById("fbcSearch");
  const clearBtn = document.getElementById("clearSearchBtn");
  if (!input) return;
  input.value = "";
  if (clearBtn) clearBtn.style.display = "none";
  filterFbcOptions("");
  input.focus();
}

function filterFbcOptions(query) {
  const queueSelect = document.getElementById("queueTypeSelect");
  const actionSelect = document.getElementById("actionTakenSelect");
  const clearBtn = document.getElementById("clearSearchBtn");
  if (!queueSelect) return;

  query = String(query || "").toLowerCase().trim();
  if (clearBtn) clearBtn.style.display = query ? "block" : "none";

  const allOptions = Array.from(queueSelect.options)
    .map(option => option.value)
    .filter(Boolean);

  if (!queueSelect.dataset.allQueues && allOptions.length) {
    queueSelect.dataset.allQueues = JSON.stringify(allOptions);
  }

  let baseQueues = [];
  try {
    baseQueues = JSON.parse(queueSelect.dataset.allQueues || "[]");
  } catch (error) {
    baseQueues = allOptions;
  }

  const currentValue = queueSelect.value;

  if (!query) {
    queueSelect.innerHTML = '<option value="">Select Queue Type</option>';
    baseQueues.forEach(queue => {
      const opt = document.createElement("option");
      opt.value = queue;
      opt.textContent = queue;
      queueSelect.appendChild(opt);
    });
    if (currentValue && baseQueues.includes(currentValue)) queueSelect.value = currentValue;
    return;
  }

  const matches = baseQueues.filter(queue => queue.toLowerCase().includes(query));

  queueSelect.innerHTML = '<option value="">Select Queue Type</option>';
  matches.forEach(queue => {
    const opt = document.createElement("option");
    opt.value = queue;
    opt.textContent = queue;
    queueSelect.appendChild(opt);
  });

  if (actionSelect) {
    actionSelect.innerHTML = '<option value="">Select Action Taken</option>';
    actionSelect.disabled = true;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const fbcSearch = document.getElementById("fbcSearch");
  const clearBtn = document.getElementById("clearSearchBtn");

  if (fbcSearch && !fbcSearch.dataset.bound) {
    fbcSearch.dataset.bound = "true";
    fbcSearch.addEventListener("input", () => filterFbcOptions(fbcSearch.value));
  }

  if (clearBtn && !clearBtn.dataset.bound) {
    clearBtn.dataset.bound = "true";
    clearBtn.addEventListener("click", clearFbcSearch);
  }

  setTimeout(() => {
    const queueSelect = document.getElementById("queueTypeSelect");
    if (queueSelect && !queueSelect.dataset.allQueues) {
      const queues = Array.from(queueSelect.options).map(o => o.value).filter(Boolean);
      if (queues.length) queueSelect.dataset.allQueues = JSON.stringify(queues);
    }
  }, 900);
});




  function scrollToBuilder() {
    const target = document.getElementById("fbcBuilder");
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - 20;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  function openFbcTableModal() {
    const modal = document.getElementById("fbcTableModal");
    if (!modal) return;
    modal.classList.add("is-open");
    modal.style.display = "flex";
    document.body.classList.add("modal-open");
  }

  function closeFbcTableModal() {
    const modal = document.getElementById("fbcTableModal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  }

  function ensureFbiModal() {
    let modal = document.getElementById("fbiModal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "fbiModal";
    modal.className = "fbi-modal";
    modal.innerHTML = `
      <div class="fbi-modal-card">
        <div class="fbi-modal-head">
          <div>
            <h3>How to add comment in FBI</h3>
            <p>Follow these steps when adding the FBC/FBI comment.</p>
          </div>
          <button class="fbi-modal-close" type="button" onclick="closeFbiModal()">×</button>
        </div>

        <div class="fbi-step-grid">
          <div class="fbi-step">
            <div class="fbi-step-number">1</div>
            <div>
              <strong>Open the PRO in FBI/FBC</strong>
              <span>Go to the PRO you are working and confirm that you are updating the correct shipment or case.</span>
            </div>
          </div>

          <div class="fbi-step">
            <div class="fbi-step-number">2</div>
            <div>
              <strong>Press F9 or open the comment area</strong>
              <span>Use the comment function where FBC/FBI comments are added for the PRO.</span>
            </div>
          </div>

          <div class="fbi-step">
            <div class="fbi-step-number">3</div>
            <div>
              <strong>Paste the generated comment</strong>
              <span>Use the generated 2x4 comment format and make sure the case number is correct.</span>
            </div>
          </div>

          <div class="fbi-step">
            <div class="fbi-step-number">4</div>
            <div>
              <strong>Save and confirm</strong>
              <span>Save the comment, then review the PRO to make sure the comment was added successfully.</span>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeFbiModal();
    });
    return modal;
  }

  function openFbiModal() {
    const modal = ensureFbiModal();
    modal.classList.add("is-open");
    modal.style.display = "flex";
    document.body.classList.add("modal-open");
  }

  function closeFbiModal() {
    const modal = document.getElementById("fbiModal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  }

  document.addEventListener("click", (event) => {
    const tableModal = document.getElementById("fbcTableModal");
    const fbiModal = document.getElementById("fbiModal");

    if (event.target === tableModal) closeFbcTableModal();
    if (event.target === fbiModal) closeFbiModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeFbcTableModal();
    closeFbiModal();
  });

  window.openFbcTableModal = openFbcTableModal;
  window.closeFbcTableModal = closeFbcTableModal;
  window.openFbiModal = openFbiModal;
  window.closeFbiModal = closeFbiModal;
