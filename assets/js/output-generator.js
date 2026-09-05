(function () {
  "use strict";

  // Automatic output generation is intentionally disabled until the
  // reference mappings have been verified with the employees.
  const ENABLE_AUTOMATIC_OUTPUTS = false;
  const EMPTY = "";

  const text = value => String(value || "").trim();
  const normalize = value =>
    text(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  const pathText = path =>
    (path || [])
      .map(item =>
        typeof item === "string"
          ? item
          : item?.label || item?.text || item?.value || ""
      )
      .join(" ");

  const setOutput = (id, value = EMPTY) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = value;
    element.classList.toggle("empty", !value);
  };

  // Kept for the future verified-reference implementation.
  function findComment(recommendation, path) {
    const haystack = normalize(`${recommendation} ${pathText(path)}`);
    const rows = window.FBC_COMMENT_REFERENCE || [];
    let best = null;
    let score = 0;

    rows.forEach(row => {
      const terms = [row.action, row.queueType, row.comment2x4].filter(Boolean);
      const currentScore = terms.reduce((total, term) => {
        const normalizedTerm = normalize(term);
        return total +
          (normalizedTerm && haystack.includes(normalizedTerm)
            ? normalizedTerm.split(" ").length
            : 0);
      }, 0);

      if (currentScore > score && row.recommendedComment) {
        score = currentScore;
        best = row;
      }
    });

    return best ? best.recommendedComment : "";
  }

  // Kept for the future verified-reference implementation.
  function findEmail(recommendation, path) {
    const haystack = normalize(`${recommendation} ${pathText(path)}`);
    const rows = window.EBS_RESPONSE_REFERENCE || [];
    let best = null;
    let score = 0;

    rows.forEach(row => {
      const terms = [row.concern, row.description, row.type].filter(Boolean);
      const currentScore = terms.reduce((total, term) => {
        const normalizedTerm = normalize(term);
        return total +
          (normalizedTerm && haystack.includes(normalizedTerm)
            ? normalizedTerm.split(" ").length
            : 0);
      }, 0);

      if (currentScore > score && row.responseTemplate) {
        score = currentScore;
        best = row;
      }
    });

    return best ? best.responseTemplate : "";
  }

  // Kept for the future verified Correction Code Guide integration.
  function findCorrCode(recommendation, path) {
    const haystack = normalize(`${recommendation} ${pathText(path)}`);
    const reference = window.CORRECTION_CODE_REFERENCE;

    if (typeof reference === "function") {
      return text(reference({ recommendation, path }));
    }

    if (reference && typeof reference.findCode === "function") {
      return text(reference.findCode({ recommendation, path }));
    }

    return text(haystack && "");
  }

  function clearSuggestedTemplates() {
    setOutput("suggestedComment");
    setOutput("suggestedCorrCode");
    setOutput("suggestedEmail");
  }

  function hideSuggestedTemplates() {
    const card = document.querySelector(".templates-card");
    if (!card) return;
    card.hidden = true;
    card.setAttribute("aria-hidden", "true");
  }

  function handleFinalRecommendation(event) {
    const detail = event.detail || {};

    // Do not expose unverified generated content to employees.
    clearSuggestedTemplates();

    if (!ENABLE_AUTOMATIC_OUTPUTS) {
      hideSuggestedTemplates();
      return;
    }

    setOutput("suggestedComment", findComment(detail.recommendation, detail.path));
    setOutput("suggestedCorrCode", findCorrCode(detail.recommendation, detail.path));
    setOutput("suggestedEmail", findEmail(detail.recommendation, detail.path));
  }

  window.addEventListener("guide-final-recommendation", handleFinalRecommendation);
  window.addEventListener("DOMContentLoaded", hideSuggestedTemplates);

  // Keep the generator functions available for the later verified mapping work.
  window.DSSOutputGenerator = {
    findComment,
    findCorrCode,
    findEmail,
    clearSuggestedTemplates,
    enable: () => {
      // Deliberately not enabled automatically. Set the constant to true only
      // after the reference mappings have been verified.
      console.warn("DSS automatic outputs are disabled pending reference verification.");
    }
  };
})();
