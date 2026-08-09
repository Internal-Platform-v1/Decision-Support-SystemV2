/* =========================================================
   BD TOOLS — SHARED FOOTER
   shared/footer.js

   Responsibilities:
   - Load footer.html into #footer-placeholder
   - Handle Explore All Guides
   - Expose footer-ready/explore events
   ========================================================= */

(function(){
  "use strict";

  const placeholder = document.getElementById("footer-placeholder");

  if(!placeholder){
    console.warn("BD Tools: #footer-placeholder was not found.");
    return;
  }

  const scriptElement = document.currentScript;
  const sharedBase = scriptElement
    ? new URL("./", scriptElement.src)
    : new URL("./", window.location.href);

  const footerUrl = new URL("footer.html", sharedBase);

  function initializeFooter(){
    const exploreBtn = document.getElementById("exploreBtn");

    if(exploreBtn){
      exploreBtn.addEventListener("click", function(){
        if(typeof window.openGuideLibrary === "function"){
          window.openGuideLibrary();
          return;
        }

        document.dispatchEvent(new CustomEvent("bdtools:explore-guides"));
      });
    }

    window.dispatchEvent(new Event("bdtools:footer-ready"));
  }

  window.BDFooterReady = fetch(footerUrl, {cache:"no-cache"})
    .then(function(response){
      if(!response.ok){
        throw new Error(
          "Unable to load shared/footer.html (" + response.status + ")"
        );
      }

      return response.text();
    })
    .then(function(markup){
      placeholder.innerHTML = markup;
      initializeFooter();
      return true;
    })
    .catch(function(error){
      console.error("BD Tools footer error:", error);

      placeholder.innerHTML =
        '<div style="padding:15px;color:#b00020;font:12px Arial;">' +
        'Unable to load the shared footer.' +
        '</div>';

      return false;
    });
})();
