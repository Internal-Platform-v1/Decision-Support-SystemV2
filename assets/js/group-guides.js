/* ============================================================
   GROUP GUIDES — V2 MASTER SCRIPT
   Billing Dispute Group Page

   Behavior is aligned with the Main Dashboard Quick Access cards:
   - entire card is clickable
   - arrow is clickable
   - Enter / Space opens the card
   - guide usage + history are recorded before navigation
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
      document.querySelectorAll("#guideGrid .guide-card")
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


      /* Update result counter */

      if (resultsText) {

        resultsText.textContent =
          term
            ? `Showing ${visible} matching guide${visible === 1 ? "" : "s"}`
            : `Showing all ${cards.length} guides`;

      }


      /* No-result message */

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


    /* Search while typing */

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

        input.value =
          savedSearch;

      }

    } catch (error) {

      /* Storage is optional. */

    }


    /* Initial search state */

    applySearch();

  }



  /* ============================================================
     HISTORY
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
     USAGE COUNTS
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
     TRACK + OPEN GUIDE
     ============================================================ */

  function openGuideCard(card) {

    if (
      !card ||
      card.classList.contains("is-hidden")
    ) {
      return;
    }


    const title =
      card.querySelector("h3")?.textContent.trim() ||
      "Untitled Guide";


    const url =
      card.dataset.url;


    if (!url) {
      return;
    }



    /* ========================================================
       HISTORY
       ======================================================== */

    const history =
      getHistory();


    history.push({

      title: title,

      url: url,

      timestamp: Date.now()

    });


    /* Keep maximum of 100 history records */

    if (history.length > 100) {

      history.splice(
        0,
        history.length - 100
      );

    }


    saveHistory(history);



    /* ========================================================
       USAGE
       ======================================================== */

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



    /* ========================================================
       NAVIGATE
       ======================================================== */

    window.location.href =
      url;

  }



  /* ============================================================
     QUICK-CARD STYLE INTERACTION
     
     Matches Main Dashboard behavior:
     clicking anywhere on the card opens the guide.
     ============================================================ */

  function initGuideTracking() {

    const cards =
      document.querySelectorAll(
        "#guideGrid .guide-card"
      );


    cards.forEach(function (card) {


      /* ========================================================
         MOUSE / POINTER CLICK
         ======================================================== */

      card.addEventListener(
        "click",
        function (event) {

          /*
           * The arrow is already part of the card action.
           * Prevent duplicate propagation only.
           */

          if (
            event.target.closest(
              ".arrow-btn"
            )
          ) {

            event.stopPropagation();

          }


          openGuideCard(card);

        }
      );



      /* ========================================================
         KEYBOARD ACCESSIBILITY
         ======================================================== */

      card.addEventListener(
        "keydown",
        function (event) {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            openGuideCard(card);

          }

        }
      );

    });

  }



/* ============================================================
   VIEW ALL GUIDES
   ============================================================ */

function initViewAll() {

  const buttons =
    document.querySelectorAll(
      '[data-action="view-all-guides"]'
    );

  buttons.forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

        window.location.href =
          "../../all-guides.html";

      }
    );

  });

}



  /* ============================================================
     SHARED HEADER GLOBAL SEARCH
     ============================================================ */

  window.performSearch =
    function (value) {

      const input =
        document.getElementById(
          "guideSearch"
        );


      if (!input) {
        return;
      }


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

    initViewAll();

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
