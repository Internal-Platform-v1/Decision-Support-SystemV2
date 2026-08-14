/* ============================================================
   GROUP GUIDES — V2 MASTER SCRIPT
   Shared by all guide-group pages.
   ============================================================ */

(function () {
  "use strict";

  const SEARCH_KEY = "guideSearch";

  function initGroupSearch() {
    const input = document.getElementById("guideSearch");
    const clearButton = document.getElementById("clearGuideSearch");
    const cards = Array.from(
      document.querySelectorAll("#guideGrid .guide-card")
    );
    const resultsText = document.getElementById("resultsText");
    const noResults = document.getElementById("noResults");

    if (!input || !cards.length) return;

    function applySearch() {
      const term = input.value.trim().toLowerCase();
      let visible = 0;

      cards.forEach(function (card) {
        const searchable = String(
          card.dataset.search || ""
        ).toLowerCase();

        const matches = !term || searchable.includes(term);

        card.classList.toggle("is-hidden", !matches);

        if (matches) {
          visible += 1;
        }
      });

      if (clearButton) {
        clearButton.style.display = term ? "grid" : "none";
      }

      if (resultsText) {
        resultsText.textContent = term
          ? `Showing ${visible} matching guide${visible === 1 ? "" : "s"}`
          : `Showing all ${cards.length} guides`;
      }

      if (noResults) {
        noResults.hidden = visible !== 0;
      }

      try {
        sessionStorage.setItem(SEARCH_KEY, input.value);
      } catch (error) {
        /* Storage is optional. */
      }
    }

    input.addEventListener("input", applySearch);

    if (clearButton) {
      clearButton.addEventListener("click", function () {
        input.value = "";
        applySearch();
        input.focus();
      });
    }

    /* Restore a search only when the browser session already had one. */
    try {
      const savedSearch = sessionStorage.getItem(SEARCH_KEY);

      if (savedSearch) {
        input.value = savedSearch;
      }
    } catch (error) {
      /* Storage is optional. */
    }

    applySearch();
  }


  function getHistory() {
    try {
      return JSON.parse(
        localStorage.getItem("guideHistory")
      ) || [];
    } catch (error) {
      return [];
    }
  }


  function saveHistory(history) {
    localStorage.setItem(
      "guideHistory",
      JSON.stringify(history)
    );
  }


  function getUsage() {
    try {
      return JSON.parse(
        localStorage.getItem("guideUsageCounts")
      ) || {};
    } catch (error) {
      return {};
    }
  }


  function saveUsage(usage) {
    localStorage.setItem(
      "guideUsageCounts",
      JSON.stringify(usage)
    );
  }


  function trackGuideOpening(link) {
    const card = link.closest(".guide-card");

    if (!card) return;

    const title =
      card.querySelector("h3")?.textContent.trim() ||
      "Untitled Guide";

    const url = link.getAttribute("href");

    if (!url) return;

    const history = getHistory();

    history.push({
      title: title,
      url: url,
      timestamp: Date.now()
    });

    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }

    saveHistory(history);

    const usage = getUsage();

    if (!usage[url]) {
      usage[url] = {
        title: title,
        count: 0
      };
    }

    usage[url].title = title;
    usage[url].count += 1;

    saveUsage(usage);
  }


  function initGuideTracking() {
    document.addEventListener("click", function (event) {
      const link = event.target.closest(".guide-open");

      if (!link) return;

      trackGuideOpening(link);
    });
  }


  /*
   * Shared V2 header global search.
   * Reuses the group search instead of creating another search system.
   */
  window.performSearch = function (value) {
    const input = document.getElementById("guideSearch");

    if (!input) return;

    input.value = String(value || "");
    input.dispatchEvent(new Event("input"));

    const library =
      document.querySelector(".guide-library");

    if (library) {
      library.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    setTimeout(function () {
      input.focus({
        preventScroll: true
      });
    }, 250);
  };


  function init() {
    initGroupSearch();
    initGuideTracking();
  }


  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
