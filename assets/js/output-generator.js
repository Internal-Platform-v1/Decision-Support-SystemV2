(function () {
  "use strict";

  const EMPTY = "No matching reference found.";
  const clean = value => String(value ?? "").trim();
  const normalize = value => clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = value => normalize(value).split(" ").filter(word => word.length > 2);

  function pathText(path) {
    return (Array.isArray(path) ? path : []).map(step => {
      if (typeof step === "string") return step;
      return [step.question, step.answer, step.label, step.text]
        .filter(Boolean)
        .join(" ");
    }).join(" ");
  }

  function setOutput(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    const result = clean(value);
    element.textContent = result || EMPTY;
    element.classList.toggle("empty", !result);
  }

  function rowValue(row, names) {
    for (const name of names) {
      if (row && row[name] != null && clean(row[name])) return clean(row[name]);
    }
    return "";
  }

  function matchScore(query, candidate) {
    const q = new Set(words(query));
    const c = new Set(words(candidate));
    let score = 0;
    q.forEach(word => { if (c.has(word)) score += word.length > 5 ? 2 : 1; });
    return score;
  }

  function findFbc(query) {
    const rows = Array.isArray(window.FBC_COMMENT_REFERENCE)
      ? window.FBC_COMMENT_REFERENCE : [];
    let best = null;
    let bestScore = 0;

    rows.forEach(row => {
      const candidate = [
        rowValue(row, ["Queue Type", "queueType"]),
        rowValue(row, ["Action", "action"]),
        rowValue(row, ["2x4 Comment ", "2x4 Comment", "comment2x4"]),
        rowValue(row, ["Recommended Comment", "recommendedComment"])
      ].join(" ");
      const score = matchScore(query, candidate);
      if (score > bestScore) {
        bestScore = score;
        best = row;
      }
    });

    if (!best || bestScore < 2) return "";
    return rowValue(best, ["Recommended Comment", "recommendedComment", "2x4 Comment ", "2x4 Comment"]);
  }

  function findEbs(query) {
    const rows = Array.isArray(window.EBS_RESPONSE_REFERENCE)
      ? window.EBS_RESPONSE_REFERENCE : [];
    let best = null;
    let bestScore = 0;

    rows.forEach(row => {
      const candidate = [
        rowValue(row, ["Concern", "concern"]),
        rowValue(row, ["Description", "description"]),
        rowValue(row, ["Type", "type"]),
        rowValue(row, ["Note", "note"]),
        rowValue(row, ["Response Template", "responseTemplate"])
      ].join(" ");
      const score = matchScore(query, candidate);
      if (score > bestScore) {
        bestScore = score;
        best = row;
      }
    });

    if (best && bestScore >= 2) {
      return rowValue(best, ["Response Template", "responseTemplate"]);
    }

    const approved = rows.find(row => normalize(rowValue(row, ["Concern", "concern"])) === "all request approved");
    return approved ? rowValue(approved, ["Response Template", "responseTemplate"]) : "";
  }

  function findCorrectionCode(query) {
    const rules = Array.isArray(window.CORRECTION_CODE_REFERENCE)
      ? window.CORRECTION_CODE_REFERENCE : [];
    const normalizedQuery = normalize(query);

    let best = null;
    let bestScore = 0;
    rules.forEach(rule => {
      const terms = Array.isArray(rule.terms) ? rule.terms : [];
      const score = terms.reduce((total, term) => {
        const normalizedTerm = normalize(term);
        return total + (normalizedTerm && normalizedQuery.includes(normalizedTerm) ? words(term).length + 1 : 0);
      }, 0);
      if (score > bestScore) {
        bestScore = score;
        best = rule;
      }
    });

    return best && best.code ? best.code : "Review Correction Code Guide";
  }

  function generateFinalOutputs(detail) {
    const recommendation = clean(detail && detail.recommendation);
    const query = [recommendation, pathText(detail && detail.path)].filter(Boolean).join(" ");

    setOutput("suggestedComment", findFbc(query));
    setOutput("suggestedCorrCode", findCorrectionCode(query));
    setOutput("suggestedEmail", findEbs(query));
  }

  window.generateFinalOutputs = generateFinalOutputs;
  window.addEventListener("guide-final-recommendation", event => {
    generateFinalOutputs(event.detail || {});
  });
})();
