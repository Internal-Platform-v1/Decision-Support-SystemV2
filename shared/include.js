/* ============================================================
   shared/include.js — DSS V2
   ============================================================ */
(function bootstrapTheme() {
    var THEME_KEY = "bd_theme";
    function resolveTheme() {
        try {
            var stored = localStorage.getItem(THEME_KEY);
            if (stored === "dark" || stored === "light") return stored;
        } catch (e) {}
        try {
            if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
        } catch (e) {}
        return "light";
    }
    var theme = resolveTheme();
    document.documentElement.setAttribute("data-theme", theme);

    if (theme === "dark") {
        var style = document.createElement("style");
        style.id = "dss-early-dark-loader";
        style.textContent = [
            "html[data-theme=\"dark\"] .page-loader { background: #0b0b17 !important; }",
            "html[data-theme=\"dark\"] .page-loader-text { color: #b8b8d4 !important; }",
            "html[data-theme=\"dark\"] .page-loader-ring { border-color: rgba(167,139,250,.18) !important; border-top-color: #c4b5fd !important; }",
            "html[data-theme=\"dark\"] .page-loader-dot { background: #c4b5fd !important; }",
            "html[data-theme=\"dark\"] body { background: #0b0b17; color: #e7e7f2; }"
        ].join("\n");
        (document.head || document.documentElement).appendChild(style);
    }
})();


(function () {
    "use strict";

    function loadText(url) {
        return fetch(url, { cache: "no-cache" }).then(function (response) {
            if (!response.ok) throw new Error("Unable to load " + url);
            return response.text();
        });
    }

    function loadCss(url) {
        return new Promise(function (resolve, reject) {
            if (document.querySelector('link[data-shared-style="' + url + '"]')) { resolve(); return; }
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = url;
            link.dataset.sharedStyle = url;
            link.onload = function () { resolve(); };
            link.onerror = function () { reject(new Error("Unable to load CSS " + url)); };
            document.head.appendChild(link);
        });
    }

    function loadScript(url) {
        return new Promise(function (resolve, reject) {
            if (document.querySelector('script[data-shared-script="' + url + '"]')) { resolve(); return; }
            var script = document.createElement("script");
            script.src = url;
            script.dataset.sharedScript = url;
            script.onload = function () { resolve(); };
            script.onerror = function () { reject(new Error("Unable to load JS " + url)); };
            document.body.appendChild(script);
        });
    }

    async function loadHeader() {
        var placeholder = document.getElementById("header-placeholder");
        if (!placeholder) return;
        placeholder.innerHTML = await loadText("shared/header/header.html");
        await loadCss("shared/header/header.css");
        await loadScript("shared/header/header.js");
        window.dispatchEvent(new Event("bdtools:header-ready"));
    }

    async function loadUpdateBanner() {
        var placeholder = document.getElementById("update-banner-placeholder");
        if (!placeholder) return;
        placeholder.innerHTML = await loadText("shared/update-banner/update-banner.html");
        await loadCss("shared/update-banner/update-banner.css");
        await loadScript("shared/update-banner/update-banner.js");
        window.dispatchEvent(new Event("bdtools:update-banner-ready"));
    }

    async function loadFooter() {
        var placeholder = document.getElementById("footer-placeholder");
        if (!placeholder) return;
        placeholder.innerHTML = await loadText("shared/footer/footer.html");
        await loadCss("shared/footer/footer.css");
        await loadScript("shared/footer/footer.js");
        window.dispatchEvent(new Event("bdtools:footer-ready"));
    }

    /* NEW: LOAD NOTIFICATION MODAL */
    async function loadNotificationModal() {
        try {
            var modalHtml = await loadText("shared/notification-modal/notification-modal.html");
            var container = document.createElement("div");
            container.id = "notification-modal-container";
            container.innerHTML = modalHtml;
            document.body.appendChild(container);
            
            await loadCss("shared/notification-modal/notification-modal.css");
            await loadScript("shared/notification-modal/notification-modal.js");
        } catch (error) {
            console.error("DSS V2 Notification Modal loader error:", error);
        }
    }

    function ensureDarkThemeLast() {
        var darkHref = "shared/dark-theme.css";
        var existing = document.querySelector('link[data-shared-style="' + darkHref + '"]');
        if (existing && existing.parentNode) {
            existing.parentNode.appendChild(existing);
            return;
        }
    }

    async function start() {
        try { await loadHeader(); } catch (error) { console.error("Header loader error:", error); }
        try { await loadNotificationModal(); } catch (error) { console.error("Notif Modal loader error:", error); }
        try { await loadUpdateBanner(); } catch (error) { console.error("Update Banner loader error:", error); }
        try { await loadFooter(); } catch (error) { console.error("Footer loader error:", error); }

        try {
            await loadCss("shared/dark-theme.css");
            ensureDarkThemeLast();
        } catch (error) { console.error("Dark theme loader error:", error); }

        window.dispatchEvent(new Event("bdtools:shared-ready"));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
})();

(function () {
    if (!window.__guideStoreInjected) {
        window.__guideStoreInjected = true;
        document.write('<script src="assets/js/guide-store.js"><\/script>');
    }
})();

(function ensureThemePersistsAcrossHistory() {
    var THEME_KEY = "bd_theme";
    function applyStoredTheme() {
        try {
            var stored = localStorage.getItem(THEME_KEY);
            if (stored !== "dark" && stored !== "light") return;
            var current = document.documentElement.getAttribute("data-theme");
            if (current === stored) return;
            document.documentElement.setAttribute("data-theme", stored);

            if (stored === "dark" && !document.getElementById("dss-early-dark-loader")) {
                var style = document.createElement("style");
                style.id = "dss-early-dark-loader";
                style.textContent = [
                    "html[data-theme=\"dark\"] .page-loader { background: #0b0b17 !important; }",
                    "html[data-theme=\"dark\"] .page-loader-text { color: #b8b8d4 !important; }",
                    "html[data-theme=\"dark\"] .page-loader-ring { border-color: rgba(167,139,250,.18) !important; border-top-color: #c4b5fd !important; }",
                    "html[data-theme=\"dark\"] .page-loader-dot { background: #c4b5fd !important; }",
                    "html[data-theme=\"dark\"] body { background: #0b0b17; color: #e7e7f2; }"
                ].join("\n");
                (document.head || document.documentElement).appendChild(style);
            }
            document.dispatchEvent(new CustomEvent("bdthemechange", { detail: { theme: stored } }));
        } catch (e) {}
    }

    window.addEventListener("pageshow", applyStoredTheme);
    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") applyStoredTheme();
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", applyStoredTheme, { once: true });
    } else {
        applyStoredTheme();
    }
})();
