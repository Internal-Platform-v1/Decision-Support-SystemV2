/* ============================================================
   BD TOOLS — CLEAN PAGE LOADER
   Waits for the page shell, shared header/footer, fonts,
   images, and browser load before revealing the page.
   ============================================================ */

(function () {
    "use strict";

    const LOADER_ID = "pageLoader";
    const MAX_WAIT = 5000;
    const MIN_DISPLAY = 320;

    const startedAt = performance.now();

    function markPageLoading() {
        document.documentElement.classList.add("page-loading");
        document.documentElement.setAttribute("aria-busy", "true");
    }

    function getLoader() {
        return document.getElementById(LOADER_ID);
    }

    function sharedComponentsReady() {
        const header = document.getElementById("header-placeholder");
        const footer = document.getElementById("footer-placeholder");

        const headerReady = !header || header.children.length > 0;
        const footerReady = !footer || footer.children.length > 0;

        return headerReady && footerReady;
    }

    function imagesReady() {
        const images = Array.from(document.images);

        return images.every(function (img) {
            return img.complete;
        });
    }

    function fontsReady() {
        return !document.fonts || document.fonts.status === "loaded";
    }

    function pageReady() {
        return (
            document.readyState === "complete" &&
            sharedComponentsReady() &&
            imagesReady() &&
            fontsReady()
        );
    }

    function revealPage() {
        const loader = getLoader();

        if (!loader) {
            document.documentElement.classList.remove("page-loading");
            document.documentElement.removeAttribute("aria-busy");
            return;
        }

        const elapsed = performance.now() - startedAt;
        const remaining = Math.max(0, MIN_DISPLAY - elapsed);

        window.setTimeout(function () {
            loader.classList.add("is-hidden");
            document.documentElement.classList.remove("page-loading");
            document.documentElement.removeAttribute("aria-busy");

            window.setTimeout(function () {
                loader.remove();
            }, 320);
        }, remaining);
    }

    function waitForPage() {
        const deadline = performance.now() + MAX_WAIT;

        function check() {
            if (pageReady() || performance.now() >= deadline) {
                revealPage();
                return;
            }

            window.requestAnimationFrame(check);
        }

        check();
    }

    markPageLoading();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", waitForPage, { once: true });
    } else {
        waitForPage();
    }

    window.addEventListener("load", waitForPage, { once: true });
})();
