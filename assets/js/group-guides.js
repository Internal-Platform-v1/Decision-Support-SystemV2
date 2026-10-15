/* ============================================================
   GROUP GUIDES — V3
   Uses GuideStore for canonical URLs + dedup across the app.
   ============================================================ */

(function () {
  "use strict";

  const SEARCH_KEY = "guideSearch";
  const Store = window.GuideStore;

  /* ============================================================
     GROUP GUIDE SEARCH
     ============================================================ */

  function initGroupSearch() {
    const input = document.getElementById("guideSearch");
    const clearButton = document.getElementById("clearGuideSearch");
    const cards = Array.from(document.querySelectorAll("#guideGrid .guide-card"));
    const resultsText = document.getElementById("resultsText");
    const noResults = document.getElementById("noResults");

    if (!input || !cards.length) return;

    function applySearch() {
      const term = input.value.trim().toLowerCase();
      let visible = 0;

      cards.forEach(function (card) {
        const searchable = String(card.dataset.search || "").toLowerCase();
        const matches = !term || searchable.includes(term);

        card.classList.toggle("is-hidden", !matches);
        if (matches) visible += 1;
      });

      if (clearButton) clearButton.style.display = term ? "grid" : "none";

      if (resultsText) {
        resultsText.textContent = term
          ? `Showing ${visible} matching guide${visible === 1 ? "" : "s"}`
          : `Showing all ${cards.length} guides`;
      }

      if (noResults) noResults.hidden = visible !== 0;

      try { sessionStorage.setItem(SEARCH_KEY, input.value); } catch (e) {}
    }

    input.addEventListener("input", applySearch);

    if (clearButton) {
      clearButton.addEventListener("click", function () {
        input.value = "";
        applySearch();
        input.focus();
      });
    }

    try {
      const savedSearch = sessionStorage.getItem(SEARCH_KEY);
      if (savedSearch) input.value = savedSearch;
    } catch (error) {}

    applySearch();
  }


  /* ============================================================
     TRACK + OPEN GUIDE
     ============================================================ */

  function openGuideCard(card) {
    if (!card || card.classList.contains("is-hidden")) return;

    const title =
      card.querySelector("h3")?.textContent.trim() || "Untitled Guide";
    const url = card.dataset.url;
    if (!url) return;

    if (Store) {
      Store.trackOpen(title, url);
    } else {
      /* Fallback — no shared store loaded */
      try {
        const h = JSON.parse(localStorage.getItem("guideHistory") || "[]");
        h.push({ title: title, url: url, timestamp: Date.now() });
        localStorage.setItem("guideHistory", JSON.stringify(h.slice(-100)));

        const u = JSON.parse(localStorage.getItem("guideUsageCounts") || "{}");
        if (!u[url]) u[url] = { title: title, count: 0 };
        u[url].count = (Number(u[url].count) || 0) + 1;
        localStorage.setItem("guideUsageCounts", JSON.stringify(u));
      } catch (e) {}
    }

    window.location.href = url;
  }


  /* ============================================================
     QUICK-CARD STYLE INTERACTION
     ============================================================ */

  function initGuideTracking() {
    const cards = document.querySelectorAll("#guideGrid .guide-card");

    cards.forEach(function (card) {
      card.addEventListener("click", function (event) {
        if (event.target.closest(".arrow-btn")) event.stopPropagation();
        openGuideCard(card);
      });

      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openGuideCard(card);
        }
      });
    });
  }


  /* ============================================================
     VIEW ALL GUIDES
     ============================================================ */

  function initViewAll() {
    const buttons = document.querySelectorAll('[data-action="view-all"]');

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        window.location.href = "../../all-guides.html";
      });
    });
  }


  /* ============================================================
     SHARED HEADER GLOBAL SEARCH
     ============================================================ */

  window.performSearch = function (value) {
    const input = document.getElementById("guideSearch");
    if (!input) return;

    input.value = String(value || "");
    input.dispatchEvent(new Event("input"));

    const library = document.querySelector(".guide-library");
    if (library) library.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(function () {
      input.focus({ preventScroll: true });
    }, 250);
  };


  /* ============================================================
     INITIALIZATION
     ============================================================ */

  function init() {
    initGroupSearch();
    initGuideTracking();
    initViewAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
