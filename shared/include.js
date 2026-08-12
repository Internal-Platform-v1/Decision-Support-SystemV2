/* ============================================================
   shared/include.js — V2
   Loads shared header/footer exactly once.
   No polling, no MutationObserver, no repeated timers.
   ============================================================ */
(function () {
    "use strict";

    function loadText(url) {
        return fetch(url, { cache: "no-cache" }).then(function (response) {
            if (!response.ok) {
                throw new Error("Unable to load " + url + " (" + response.status + ")");
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

            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = url;
            link.dataset.sharedStyle = url;
            link.onload = resolve;
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

            const script = document.createElement("script");
            script.src = url;
            script.dataset.sharedScript = url;
            script.onload = resolve;
            script.onerror = function () {
                reject(new Error("Unable to load script " + url));
            };
            document.body.appendChild(script);
        });
    }

    async function loadHeader() {
        const placeholder = document.getElementById("header-placeholder");
        if (!placeholder) return;

        const headerHtml = await loadText("shared/header.html");
        placeholder.innerHTML = headerHtml;

        await loadCss("shared/header.css");
        await loadScript("shared/header.js");

        window.dispatchEvent(new Event("bdtools:header-ready"));
    }

    async function loadFooter() {
        const placeholder = document.getElementById("footer-placeholder");
        if (!placeholder) return;

        const footerHtml = await loadText("shared/footer.html");
        placeholder.innerHTML = footerHtml;

        await loadCss("shared/footer.css");
        await loadScript("shared/footer.js");

        window.dispatchEvent(new Event("bdtools:footer-ready"));
    }

    async function start() {
        try {
            await loadHeader();
        } catch (error) {
            console.error("V2 Header loader error:", error);
        }

        try {
            await loadFooter();
        } catch (error) {
            console.error("V2 Footer loader error:", error);
        }
    }

    start();
})();
