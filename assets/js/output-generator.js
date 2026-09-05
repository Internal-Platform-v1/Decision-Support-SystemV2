(function () {
  "use strict";

  const EMPTY = "No matching reference found.";
  const text = v => String(v || "").trim();
  const normalize = v => text(v).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const pathText = path => (path || []).map(x => typeof x === "string" ? x : (x.label || x.text || x.value || "")).join(" ");
  const setOutput = (id, value) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value || EMPTY;
    el.classList.toggle("empty", !value);
  };

  function findComment(recommendation, path) {
    const haystack = normalize(recommendation + " " + pathText(path));
    const rows = window.FBC_COMMENT_REFERENCE || [];
    let best = null, score = 0;
    rows.forEach(row => {
      const terms = [row.action, row.queueType, row.comment2x4].filter(Boolean);
      const s = terms.reduce((n, term) => n + (haystack.includes(normalize(term)) ? normalize(term).split(" ").length : 0), 0);
      if (s > score && row.recommendedComment) { score = s; best = row; }
    });
    return best ? best.recommendedComment : "";
  }

  function findEmail(recommendation, path) {
    const haystack = normalize(recommendation + " " + pathText(path));
    const rows = window.EBS_RESPONSE_REFERENCE || [];
    let best = null, score = 0;
    rows.forEach(row => {
      const terms = [row.concern, row.description, row.type].filter(Boolean);
      const s = terms.reduce((n, term) => n + (haystack.includes(normalize(term)) ? normalize(term).split(" ").length : 0), 0);
      if (s > score && row.responseTemplate) { score = s; best = row; }
    });
    if (best) return best.responseTemplate;
    const approved = rows.find(r => normalize(r.concern) === "all request approved");
    return approved ? approved.responseTemplate : "";
  }

  function findCorrCode(recommendation, path) {
    const value = text(recommendation + " " + pathText(path));
    const codes = ["CUSI", "CAE", "RQE", "SYSM", "ACCR", "ECD", "ETMS", "OPSO", "OPSD", "EPDC", "EREF", "ACC", "EADL", "NACC", "EACC", "EXPR", "PRCE", "PROT", "PRHA", "SSDY", "YEAR"];
    const found = codes.find(code => new RegExp("\\b" + code + "\\b", "i").test(value));
    return found || "";
  }

  window.addEventListener("guide-final-recommendation", event => {
    const detail = event.detail || {};
    setOutput("suggestedComment", findComment(detail.recommendation, detail.path));
    setOutput("suggestedCorrCode", findCorrCode(detail.recommendation, detail.path));
    setOutput("suggestedEmail", findEmail(detail.recommendation, detail.path));
  });
})();
