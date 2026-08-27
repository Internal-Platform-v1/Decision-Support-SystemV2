/* ============================================================
   BD TOOLS — GLOBAL PAGE LOADER
   Fast, clean reveal for Main Index and Group Pages
   ============================================================ */

(function () {
    "use strict";

    const loader = document.getElementById("pageLoader");
    const MIN_DISPLAY_TIME = 180;
    const MAX_WAIT_TIME = 1800;
    const started = performance.now();

    function sharedPartsReady() {
        const header = document.getElementById("header-placeholder");
        const footer = document.getElementById("footer-placeholder");

        const headerReady = !header || header.children.length > 0;
        const footerReady = !footer || footer.children.length > 0;

        return headerReady && footerReady;
    }

    function pageReady() {
        /*
         * Only wait for the document and dynamically injected shared shell.
         * Images/fonts are allowed to finish naturally after the page appears,
         * which keeps the loading screen short.
         */
        return (
            document.readyState === "complete" &&
            sharedPartsReady()
        );
    }

    function reveal() {
        if (!loader) {
            document.documentElement.classList.remove("page-loading");
            document.documentElement.removeAttribute("aria-busy");
            return;
        }

        const elapsed = performance.now() - started;
        const delay = Math.max(0, MIN_DISPLAY_TIME - elapsed);

        window.setTimeout(function () {
            loader.classList.add("is-hidden");
            document.documentElement.classList.remove("page-loading");
            document.documentElement.removeAttribute("aria-busy");

            window.setTimeout(function () {
                if (loader && loader.parentNode) {
                    loader.remove();
                }
            }, 280);
        }, delay);
    }

    function waitUntilReady() {
        const deadline = performance.now() + MAX_WAIT_TIME;

        function check() {
            if (pageReady() || performance.now() >= deadline) {
                reveal();
                return;
            }

            window.requestAnimationFrame(check);
        }

        check();
    }

    document.documentElement.classList.add("page-loading");
    document.documentElement.setAttribute("aria-busy", "true");

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", waitUntilReady, { once: true });
    } else {
        waitUntilReady();
    }

    window.addEventListener("load", waitUntilReady, { once: true });
})();
