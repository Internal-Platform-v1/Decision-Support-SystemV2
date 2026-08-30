/* ============================================================
   shared/include.js — DSS V2
   ------------------------------------------------------------
   Central shared-component loader.

   Loads:
   - Header
   - Update Banner
   - Footer

   Shared component structure:

   shared/
   ├── header/
   │   ├── header.html
   │   ├── header.css
   │   └── header.js
   │
   ├── footer/
   │   ├── footer.html
   │   ├── footer.css
   │   └── footer.js
   │
   ├── update-banner/
   │   ├── update-banner.html
   │   ├── update-banner.css
   │   └── update-banner.js
   │
   └── include.js

   Pages only need to load this file.

   ============================================================ */

(function () {

    "use strict";


    /* =========================================================
       LOAD HTML
       ========================================================= */

    function loadText(url) {

        return fetch(url, {
            cache: "no-cache"
        })

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Unable to load " +
                    url +
                    " (" +
                    response.status +
                    ")"
                );

            }

            return response.text();

        });

    }


    /* =========================================================
       LOAD CSS
       ========================================================= */

    function loadCss(url) {

        return new Promise(function (resolve, reject) {

            if (
                document.querySelector(
                    'link[data-shared-style="' + url + '"]'
                )
            ) {

                resolve();

                return;

            }


            const link =
                document.createElement("link");


            link.rel = "stylesheet";

            link.href = url;

            link.dataset.sharedStyle = url;


            link.onload = function () {

                resolve();

            };


            link.onerror = function () {

                reject(
                    new Error(
                        "Unable to load stylesheet " +
                        url
                    )
                );

            };


            document.head.appendChild(link);

        });

    }


    /* =========================================================
       LOAD JAVASCRIPT
       ========================================================= */

    function loadScript(url) {

        return new Promise(function (resolve, reject) {

            if (
                document.querySelector(
                    'script[data-shared-script="' + url + '"]'
                )
            ) {

                resolve();

                return;

            }


            const script =
                document.createElement("script");


            script.src = url;

            script.dataset.sharedScript = url;


            script.onload = function () {

                resolve();

            };


            script.onerror = function () {

                reject(
                    new Error(
                        "Unable to load script " +
                        url
                    )
                );

            };


            document.body.appendChild(script);

        });

    }


    /* =========================================================
       LOAD HEADER
       ========================================================= */

    async function loadHeader() {

        const placeholder =
            document.getElementById(
                "header-placeholder"
            );


        if (!placeholder) {

            return;

        }


        const headerHtml =
            await loadText(
                "shared/header/header.html"
            );


        placeholder.innerHTML =
            headerHtml;


        await loadCss(
            "shared/header/header.css"
        );


        await loadScript(
            "shared/header/header.js"
        );


        window.dispatchEvent(
            new Event(
                "bdtools:header-ready"
            )
        );

    }


    /* =========================================================
       LOAD UPDATE BANNER
       ========================================================= */

    async function loadUpdateBanner() {

        const placeholder =
            document.getElementById(
                "update-banner-placeholder"
            );


        /*
         * Pages that do not have an update-banner
         * placeholder simply skip the component.
         */

        if (!placeholder) {

            return;

        }


        const bannerHtml =
            await loadText(
                "shared/update-banner/update-banner.html"
            );


        placeholder.innerHTML =
            bannerHtml;


        await loadCss(
            "shared/update-banner/update-banner.css"
        );


        await loadScript(
            "shared/update-banner/update-banner.js"
        );


        window.dispatchEvent(
            new Event(
                "bdtools:update-banner-ready"
            )
        );

    }


    /* =========================================================
       LOAD FOOTER
       ========================================================= */

    async function loadFooter() {

        const placeholder =
            document.getElementById(
                "footer-placeholder"
            );


        if (!placeholder) {

            return;

        }


        const footerHtml =
            await loadText(
                "shared/footer/footer.html"
            );


        placeholder.innerHTML =
            footerHtml;


        await loadCss(
            "shared/footer/footer.css"
        );


        await loadScript(
            "shared/footer/footer.js"
        );


        window.dispatchEvent(
            new Event(
                "bdtools:footer-ready"
            )
        );

    }


    /* =========================================================
       START SHARED COMPONENT LOADING
       ========================================================= */

    async function start() {


        /* -----------------------------------------------------
           HEADER
           ----------------------------------------------------- */

        try {

            await loadHeader();

        }

        catch (error) {

            console.error(
                "DSS V2 Header loader error:",
                error
            );

        }


        /* -----------------------------------------------------
           UPDATE BANNER
           ----------------------------------------------------- */

        try {

            await loadUpdateBanner();

        }

        catch (error) {

            console.error(
                "DSS V2 Update Banner loader error:",
                error
            );

        }


        /* -----------------------------------------------------
           FOOTER
           ----------------------------------------------------- */

        try {

            await loadFooter();

        }

        catch (error) {

            console.error(
                "DSS V2 Footer loader error:",
                error
            );

        }


        /* -----------------------------------------------------
           ALL SHARED COMPONENTS READY
           ----------------------------------------------------- */

        window.dispatchEvent(
            new Event(
                "bdtools:shared-ready"
            )
        );

    }


    /* =========================================================
       INITIALIZATION
       =========================================================

       Works whether include.js is loaded from:
       - <head>
       - bottom of <body>

       ========================================================= */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            start,
            {
                once: true
            }
        );

    }

    else {

        start();

    }


})();
