/* ============================================================
   GROUP GUIDES — V2 MASTER SCRIPT
   Shared by all guide-group pages.
   ============================================================ */

(function () {
  "use strict";

  const SEARCH_KEY = "guideSearch";

  /* ============================================================
     GROUP GUIDE SEARCH
     ============================================================ */

  function initGroupSearch() {
    const input = document.getElementById("guideSearch");

    const clearButton =
      document.getElementById("clearGuideSearch");

    const cards = Array.from(
      document.querySelectorAll(
        "#guideGrid .guide-card"
      )
    );

    const resultsText =
      document.getElementById("resultsText");

    const noResults =
      document.getElementById("noResults");

    if (!input || !cards.length) return;

    function applySearch() {
      const term =
        input.value.trim().toLowerCase();

      let visible = 0;

      cards.forEach(function (card) {
        const searchable = String(
          card.dataset.search || ""
        ).toLowerCase();

        const matches =
          !term ||
          searchable.includes(term);

        card.classList.toggle(
          "is-hidden",
          !matches
        );

        if (matches) {
          visible += 1;
        }
      });

      /* Show / hide clear button */
      if (clearButton) {
        clearButton.style.display =
          term ? "grid" : "none";
      }

      /* Results counter */
      if (resultsText) {
        resultsText.textContent = term
          ? `Showing ${visible} matching guide${
              visible === 1 ? "" : "s"
            }`
          : `Showing all ${cards.length} guides`;
      }

      /* No results message */
      if (noResults) {
        noResults.hidden =
          visible !== 0;
      }

      /* Save search for current browser session */
      try {
        sessionStorage.setItem(
          SEARCH_KEY,
          input.value
        );
      } catch (error) {
        /* Storage is optional. */
      }
    }

    input.addEventListener(
      "input",
      applySearch
    );

    /* Clear search */
    if (clearButton) {
      clearButton.addEventListener(
        "click",
        function () {
          input.value = "";

          applySearch();

          input.focus();
        }
      );
    }

    /* Restore previous search */
    try {
      const savedSearch =
        sessionStorage.getItem(
          SEARCH_KEY
        );

      if (savedSearch) {
        input.value = savedSearch;
      }
    } catch (error) {
      /* Storage is optional. */
    }

    applySearch();
  }


  /* ============================================================
     GUIDE HISTORY
     ============================================================ */

  function getHistory() {
    try {
      return JSON.parse(
        localStorage.getItem(
          "guideHistory"
        )
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


  /* ============================================================
     GUIDE USAGE COUNTS
     ============================================================ */

  function getUsage() {
    try {
      return JSON.parse(
        localStorage.getItem(
          "guideUsageCounts"
        )
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


  /* ============================================================
     TRACK GUIDE OPENING
     ============================================================ */

  function trackGuideOpening(link) {
    const card =
      link.closest(".guide-card");

    if (!card) return;

    const title =
      card.querySelector("h3")
        ?.textContent
        .trim() ||
      "Untitled Guide";

    const url =
      link.getAttribute("href");

    if (!url) return;

    /* ------------------------------
       HISTORY
       ------------------------------ */

    const history =
      getHistory();

    history.push({
      title: title,
      url: url,
      timestamp: Date.now()
    });

    /* Keep maximum 100 history records */
    if (history.length > 100) {
      history.splice(
        0,
        history.length - 100
      );
    }

    saveHistory(history);


    /* ------------------------------
       USAGE COUNT
       ------------------------------ */

    const usage =
      getUsage();

    if (!usage[url]) {
      usage[url] = {
        title: title,
        count: 0
      };
    }

    usage[url].title =
      title;

    usage[url].count += 1;

    saveUsage(usage);
  }


  /* ============================================================
     GUIDE CARD INTERACTION
     
     IMPORTANT:
     The ENTIRE guide card is clickable.
     The arrow is only a visual/action indicator.
     ============================================================ */

  function initGuideTracking() {

    /* --------------------------------
       CLICK HANDLING
       -------------------------------- */

    document.addEventListener(
      "click",
      function (event) {

        /* If the actual guide link was
           clicked, track it normally. */
        const link =
          event.target.closest(
            ".guide-open"
          );

        if (link) {
          trackGuideOpening(link);
          return;
        }


        /* --------------------------------
           ENTIRE CARD IS CLICKABLE
           -------------------------------- */

        const card =
          event.target.closest(
            ".guide-card"
          );

        if (!card) return;


        const targetLink =
          card.querySelector(
            ".guide-open"
          );

        if (!targetLink) return;


        /*
         * Clicking ANYWHERE inside the card
         * opens the guide.
         *
         * This includes:
         * - icon
         * - title
         * - description
         * - empty card area
         * - arrow
         */
        targetLink.click();
      }
    );


    /* --------------------------------
       KEYBOARD ACCESSIBILITY
       -------------------------------- */

    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key !== "Enter" &&
          event.key !== " "
        ) {
          return;
        }


        const card =
          event.target.closest(
            ".guide-card"
          );

        if (!card) return;


        /*
         * If the user is already focused
         * on the actual guide link, allow
         * the browser's normal link action.
         */
        if (
          event.target.closest(
            ".guide-open"
          )
        ) {
          return;
        }


        event.preventDefault();


        const targetLink =
          card.querySelector(
            ".guide-open"
          );

        if (targetLink) {
          targetLink.click();
        }
      }
    );
  }


  /* ============================================================
     SHARED HEADER GLOBAL SEARCH
     
     The header search can use the same
     Billing Dispute guide search.
     ============================================================ */

  window.performSearch =
    function (value) {

      const input =
        document.getElementById(
          "guideSearch"
        );

      if (!input) return;


      input.value =
        String(value || "");


      input.dispatchEvent(
        new Event("input")
      );


      const library =
        document.querySelector(
          ".guide-library"
        );


      if (library) {
        library.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }


      setTimeout(
        function () {
          input.focus({
            preventScroll: true
          });
        },
        250
      );
    };


  /* ============================================================
     INITIALIZATION
     ============================================================ */

  function init() {

    initGroupSearch();

    initGuideTracking();

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }

})();
