/* ============================================================
   DSS V2 — SHARED UPDATE BANNER LOADER

   Static-site implementation.
   The banner markup lives in shared/update-banner.html.
   This script inserts it after the shared header placeholder.
   ============================================================ */
(function () {
  "use strict";

  const BANNER_FILE = "shared/update-banner.html";
  const BANNER_IMAGE = "assets/images/update-banner-truck.png";

  function getBasePrefix() {
    const path = window.location.pathname;
    const marker = "/guides/";
    const index = path.indexOf(marker);
    return index === -1 ? "" : "../../";
  }

  async function loadUpdateBanner() {
    if (document.getElementById("dssUpdateBanner")) return;

    const header = document.getElementById("header-placeholder");
    if (!header) return;

    const prefix = getBasePrefix();
    const htmlUrl = prefix + BANNER_FILE;
    const imageUrl = prefix + BANNER_IMAGE;

    try {
      const response = await fetch(htmlUrl, { cache: "no-cache" });
      if (!response.ok) throw new Error("Unable to load update banner.");

      let markup = await response.text();
      markup = markup.replace("__UPDATE_BANNER_TRUCK__", imageUrl);

      header.insertAdjacentHTML("afterend", markup);

      const banner = document.getElementById("dssUpdateBanner");
      if (!banner) return;

      const button = banner.querySelector('[data-update-action="view-all"]');
      if (button) {
        button.addEventListener("click", function () {
          const target = document.querySelector("[data-updates], #updates, .updates-page");
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            window.dispatchEvent(new CustomEvent("dss:view-updates"));
          }
        });
      }
    } catch (error) {
      console.warn("DSS update banner could not be loaded:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadUpdateBanner);
  } else {
    loadUpdateBanner();
  }
})();
