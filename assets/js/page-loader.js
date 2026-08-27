/* ============================================================
   BD TOOLS — GLOBAL PAGE LOADER
   ============================================================ */

(function () {
    "use strict";

    const loader = document.getElementById("pageLoader");
    const MIN_DISPLAY_TIME = 450;
    const MAX_WAIT_TIME = 7000;
    const USER_READY_EVENT = "bdtools:user-ready";
    const started = performance.now();

    let userReady = false;

    /*
     * The Main Index can receive the authenticated user's name after the
     * document itself is already loaded. Listening for this event lets the
     * loader reveal the page only after that name has been resolved.
     *
     * Existing pages that do not dispatch the event are not blocked forever;
     * the normal readiness check and safety timeout still apply.
     */
    window.addEventListener(USER_READY_EVENT, function () {
        userReady = true;
    }, { once: true });


    function sharedPartsReady() {
        const header = document.getElementById("header-placeholder");
        const footer = document.getElementById("footer-placeholder");

        const headerReady = !header || header.children.length > 0;
        const footerReady = !footer || footer.children.length > 0;

        return headerReady && footerReady;
    }

    function imagesReady() {
        return Array.from(document.images).every(function (img) {
            return img.complete;
        });
    }

    function fontsReady() {
        return !document.fonts || document.fonts.status === "loaded";
    }

    function pageReady() {
        const waitsForUser =
            document.body &&
            document.body.dataset &&
            document.body.dataset.waitsForUser === "true";

        return (
            document.readyState === "complete" &&
            sharedPartsReady() &&
            imagesReady() &&
            fontsReady() &&
            (!waitsForUser || userNameIsResolved())
        );
    }

    function userNameIsResolved() {
        /*
         * Accept the authenticated user's resolved name when the page code
         * has already populated a visible greeting/name element.
         * Generic placeholders are treated as unresolved.
         */
        const selectors = [
            "#userName",
            "#user-name",
            "#welcomeName",
            "#welcome-name",
            ".user-name",
            ".welcome-name"
        ];

        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (!el) continue;

            const text = (el.textContent || "").trim();

            if (
                text &&
                !/^(jennifer|loading|user|guest|undefined|null|name)$/i.test(text)
            ) {
                return true;
            }
        }

        /*
         * If the current page uses another mechanism for the greeting,
         * don't hold the page indefinitely. The safety timeout remains the
         * final fallback.
         */
        return false;
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
            }, 320);
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
