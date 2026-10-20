/* ============================================================
   shared/include.js — DSS V2
   ------------------------------------------------------------
   Central shared-component loader + theme bootstrap.

   IMPORTANT: The theme bootstrap MUST run before this file's
   main IIFE, because the loader HTML is already in the DOM by
   the time this script executes. Running synchronously here
   means the attribute is set BEFORE the first paint of any
   later-loaded stylesheet (footer, dark-theme, etc.), and the
   loader gets re-themed on the same tick.
   ============================================================ */

/* ------------------------------------------------------------
   0. THEME BOOTSTRAP — runs synchronously on script parse
      Sets <html data-theme="dark|light"> immediately.
      Also injects a <style> block that dark-styles the page
      loader so it doesn't flash light before page-loader.css
      + dark-theme.css are applied.
   ------------------------------------------------------------ */
(function bootstrapTheme() {
    var THEME_KEY = "bd_theme";

    function resolveTheme() {
        try {
            var stored = localStorage.getItem(THEME_KEY);
            if (stored === "dark" || stored === "light") return stored;
        } catch (e) { /* storage blocked */ }

        try {
            if (window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches) {
                return "dark";
            }
        } catch (e) { /* no matchMedia */ }

        return "light";
    }

    var theme = resolveTheme();
    document.documentElement.setAttribute("data-theme", theme);

    /* Inject a blocking <style> that themes the loader on the
       very first paint, regardless of when page-loader.css or
       dark-theme.css finish loading. */
    if (theme === "dark") {
        var style = document.createElement("style");
        style.id = "dss-early-dark-loader";
        style.textContent = [
            "html[data-theme=\"dark\"] .page-loader { background: #0b0b17 !important; }",
            "html[data-theme=\"dark\"] .page-loader-text { color: #b8b8d4 !important; }",
            "html[data-theme=\"dark\"] .page-loader-ring {",
            "  border-color: rgba(167,139,250,.18) !important;",
            "  border-top-color: #c4b5fd !important;",
            "}",
            "html[data-theme=\"dark\"] .page-loader-dot { background: #c4b5fd !important; }",
            "html[data-theme=\"dark\"] body { background: #0b0b17; color: #e7e7f2; }"
        ].join("\n");
        (document.head || document.documentElement).appendChild(style);
    }
})();


/* ============================================================
   MAIN LOADER
   ============================================================ */
(function () {

    "use strict";

    function loadText(url) {
        return fetch(url, { cache: "no-cache" })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error(
                        "Unable to load " + url + " (" + response.status + ")"
                    );
                }
                return response.text();
            });
    }

    function loadCss(url) {
        return new Promise(function (resolve, reject) {
            if (document.querySelector('link[data-shared-style="' + url + '"]')) {
                resolve();
                return;
            }
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = url;
            link.dataset.sharedStyle = url;
            link.onload = function () { resolve(); };
            link.onerror = function () {
                reject(new Error("Unable to load stylesheet " + url));
            };
            document.head.appendChild(link);
        });
    }

    function loadScript(url) {
        return new Promise(function (resolve, reject) {
            if (document.querySelector('script[data-shared-script="' + url + '"]')) {
                resolve();
                return;
            }
            var script = document.createElement("script");
            script.src = url;
            script.dataset.sharedScript = url;
            script.onload = function () { resolve(); };
            script.onerror = function () {
                reject(new Error("Unable to load script " + url));
            };
            document.body.appendChild(script);
        });
    }

    async function loadHeader() {
        var placeholder = document.getElementById("header-placeholder");
        if (!placeholder) return;

        var headerHtml = await loadText("shared/header/header.html");
        placeholder.innerHTML = headerHtml;

        await loadCss("shared/header/header.css");
        await loadScript("shared/header/header.js");

        window.dispatchEvent(new Event("bdtools:header-ready"));
    }

    async function loadUpdateBanner() {
        var placeholder = document.getElementById("update-banner-placeholder");
        if (!placeholder) return;

        var bannerHtml = await loadText("shared/update-banner/update-banner.html");
        placeholder.innerHTML = bannerHtml;

        await loadCss("shared/update-banner/update-banner.css");
        await loadScript("shared/update-banner/update-banner.js");

        window.dispatchEvent(new Event("bdtools:update-banner-ready"));
    }

    async function loadFooter() {
        var placeholder = document.getElementById("footer-placeholder");
        if (!placeholder) return;

        var footerHtml = await loadText("shared/footer/footer.html");
        placeholder.innerHTML = footerHtml;

        await loadCss("shared/footer/footer.css");
        await loadScript("shared/footer/footer.js");

        window.dispatchEvent(new Event("bdtools:footer-ready"));
    }

    /* ------------------------------------------------------
       EARLY-STYLESHEET PRE-LINK
       Forces dark-theme.css to be the LAST stylesheet
       in <head>, so it always wins the cascade.
       ------------------------------------------------------ */
    function ensureDarkThemeLast() {
        var darkHref = "shared/dark-theme.css";
        var existing = document.querySelector('link[data-shared-style="' + darkHref + '"]');
        if (existing && existing.parentNode) {
            existing.parentNode.appendChild(existing); /* move to end */
            return;
        }
        /* Will be loaded by start() below. */
    }

    async function start() {

        /* -----------------------------------------------------
           HEADER
           ----------------------------------------------------- */
        try {
            await loadHeader();
        } catch (error) {
            console.error("DSS V2 Header loader error:", error);
        }

        /* -----------------------------------------------------
           UPDATE BANNER
           ----------------------------------------------------- */
        try {
            await loadUpdateBanner();
        } catch (error) {
            console.error("DSS V2 Update Banner loader error:", error);
        }

        /* -----------------------------------------------------
           FOOTER
           ----------------------------------------------------- */
        try {
            await loadFooter();
        } catch (error) {
            console.error("DSS V2 Footer loader error:", error);
        }

        /* -----------------------------------------------------
           DARK THEME — LOADED LAST
           After every other shared stylesheet so its
           html[data-theme="dark"] rules win the cascade.
           ----------------------------------------------------- */
        try {
            await loadCss("shared/dark-theme.css");
            ensureDarkThemeLast();
        } catch (error) {
            console.error("DSS V2 dark theme loader error:", error);
        }

        /* -----------------------------------------------------
           ALL SHARED COMPONENTS READY
           ----------------------------------------------------- */
        window.dispatchEvent(new Event("bdtools:shared-ready"));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }

})();


/* ------------------------------------------------------------
   Auto-inject GuideStore on every page.
   ------------------------------------------------------------ */
(function () {
    if (!window.__guideStoreInjected) {
        window.__guideStoreInjected = true;
        document.write('<script src="assets/js/guide-store.js"><\/script>');
    }
})();
