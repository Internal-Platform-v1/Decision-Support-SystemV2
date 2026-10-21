/* ============================================================
   shared/header.js — V7
   Header behavior + settings menu + admin password gate + theme
   ============================================================ */
(function () {
    "use strict";

    const ROLE_KEY  = "bd_role";
    const THEME_KEY = "bd_theme";
    const ADMIN_URL = "admin-console/admin-dashboard/admin-dashboard.html";

    const ADMIN_PASSWORD = "fedex-admin-2026";

    const ADMIN_UNLOCK_KEY = "bd_admin_unlocked";
    const ADMIN_UNLOCK_TTL = 7 * 24 * 60 * 60 * 1000; /* 7 days */

    /* ------------------------------------------------------------
       Role state
       ------------------------------------------------------------ */
    function getRole() {
        try {
            return localStorage.getItem(ROLE_KEY) === "admin" ? "admin" : "user";
        } catch (e) {
            return "user";
        }
    }

    function setRole(role) {
        const safe = role === "admin" ? "admin" : "user";
        try {
            localStorage.setItem(ROLE_KEY, safe);
        } catch (e) { /* storage unavailable */ }
        return safe;
    }

    function applyRole(role) {
        document.documentElement.setAttribute("data-role", role);

        document.querySelectorAll(".role-option").forEach(function (opt) {
            const active = opt.dataset.role === role;
            opt.classList.toggle("active", active);
            opt.setAttribute("aria-checked", String(active));
        });

        const adminBtn = document.getElementById("adminDashboardBtn");
        if (adminBtn) adminBtn.hidden = role !== "admin";

        if (role !== "admin") clearAdminUnlocked();

        document.dispatchEvent(new CustomEvent("bdrolechange", { detail: { role } }));
    }

    /* ------------------------------------------------------------
       Theme
       ------------------------------------------------------------ */
    function getStoredTheme() {
        try {
            const v = localStorage.getItem(THEME_KEY);
            if (v === "dark" || v === "light") return v;
        } catch (e) { /* storage unavailable */ }

        try {
            if (window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches) {
                return "dark";
            }
        } catch (e) { /* no matchMedia */ }

        return "light";
    }

    function applyTheme(theme) {
        const safe = theme === "dark" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", safe);

        document.querySelectorAll(".theme-option").forEach(function (opt) {
            const active = opt.dataset.themeChoice === safe;
            opt.classList.toggle("active", active);
            opt.setAttribute("aria-checked", String(active));
        });
    }

    function setTheme(theme) {
        const safe = theme === "dark" ? "dark" : "light";
        try { localStorage.setItem(THEME_KEY, safe); } catch (e) {}
        applyTheme(safe);
        document.dispatchEvent(
            new CustomEvent("bdthemechange", { detail: { theme: safe } })
        );
        return safe;
    }

    function setupTheme() {
        applyTheme(getStoredTheme());

        document.querySelectorAll(".theme-option").forEach(function (opt) {
            opt.addEventListener("click", function (event) {
                event.stopPropagation();
                setTheme(this.dataset.themeChoice);
            });
        });

        if (window.matchMedia) {
            const mq = window.matchMedia("(prefers-color-scheme: dark)");
            const handler = function (event) {
                let stored = null;
                try { stored = localStorage.getItem(THEME_KEY); } catch (e) {}
                if (stored === "dark" || stored === "light") return;
                applyTheme(event.matches ? "dark" : "light");
            };
            if (mq.addEventListener) mq.addEventListener("change", handler);
            else if (mq.addListener) mq.addListener(handler);
        }
    }

    /* ------------------------------------------------------------
       Admin unlock helpers
       ------------------------------------------------------------ */
    function isAdminUnlocked() {
        try {
            const raw = localStorage.getItem(ADMIN_UNLOCK_KEY); // CHANGED to localStorage
            if (!raw) return false;
            const obj = JSON.parse(raw);
            return Boolean(obj && typeof obj.exp === "number" && obj.exp > Date.now());
        } catch (e) {
            return false;
        }
    }

    function setAdminUnlocked() {
        try {
            localStorage.setItem( // CHANGED to localStorage
                ADMIN_UNLOCK_KEY,
                JSON.stringify({ exp: Date.now() + ADMIN_UNLOCK_TTL })
            );
        } catch (e) { /* storage unavailable */ }
    }

    function clearAdminUnlocked() {
        try { localStorage.removeItem(ADMIN_UNLOCK_KEY); } catch (e) {} // CHANGED to localStorage
    }

    /* ------------------------------------------------------------
       Admin gate modal
       ------------------------------------------------------------ */
    function setupAdminGate() {
        const gate = document.getElementById("adminGate");
        if (!gate) return;

        const card     = gate.querySelector(".admin-gate-card");
        const input    = document.getElementById("adminGateInput");
        const error    = document.getElementById("adminGateError");
        const cancel   = document.getElementById("adminGateCancel");
        const submit   = document.getElementById("adminGateSubmit");
        const backdrop = gate.querySelector(".admin-gate-backdrop");

        function open() {
            gate.hidden = false;
            input.value = "";
            error.textContent = "";
            card.classList.remove("shake");
            setTimeout(function () { input.focus(); }, 50);
        }

        function close() {
            gate.hidden = true;
            input.value = "";
            error.textContent = "";
            card.classList.remove("shake");
        }

        function attemptUnlock() {
            const value = input.value;
            if (!value) {
                error.textContent = "Enter the admin password.";
                input.focus();
                return;
            }

            if (value === ADMIN_PASSWORD) {
                setAdminUnlocked();
                close();
                window.location.href = ADMIN_URL;
                return;
            }

            error.textContent = "Incorrect password.";
            input.value = "";
            input.focus();

            card.classList.remove("shake");
            void card.offsetWidth;
            card.classList.add("shake");
        }

        submit.addEventListener("click", attemptUnlock);

        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter")  { event.preventDefault(); attemptUnlock(); }
            if (event.key === "Escape") { event.preventDefault(); close(); }
        });

        cancel.addEventListener("click", close);
        if (backdrop) backdrop.addEventListener("click", close);

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && !gate.hidden) close();
        });

        window.BDAdminGate = { open: open, close: close };
    }

    /* ------------------------------------------------------------
       Settings dropdown
       ------------------------------------------------------------ */
    function setupSettings() {
        const button   = document.getElementById("settingsBtn");
        const menu     = document.getElementById("settingsMenu");
        const adminBtn = document.getElementById("adminDashboardBtn");

        if (!button || !menu) {
            console.error("Header: settings elements were not found.");
            return;
        }

        applyRole(getRole());

        function close() {
            menu.classList.remove("open");
            button.setAttribute("aria-expanded", "false");
        }

        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            const open = menu.classList.toggle("open");
            button.setAttribute("aria-expanded", String(open));
        });

        menu.querySelectorAll(".role-option").forEach(function (opt) {
            opt.addEventListener("click", function (event) {
                event.stopPropagation();
                applyRole(setRole(this.dataset.role));
            });
        });

        if (adminBtn) {
            adminBtn.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                if (getRole() !== "admin") {
                    console.warn("Header: admin dashboard blocked for non-admin role.");
                    return;
                }

                close();

                if (isAdminUnlocked()) {
                    window.location.href = ADMIN_URL;
                    return;
                }

                if (window.BDAdminGate) {
                    window.BDAdminGate.open();
                } else {
                    console.error("Header: admin gate was not initialised.");
                }
            });
        }

        document.addEventListener("click", function (event) {
            if (!event.target.closest(".settings-wrapper")) close();
        });
    }

    /* ------------------------------------------------------------
       Case Directory dropdown
       ------------------------------------------------------------ */
    function setupCaseDirectory() {
        const button  = document.getElementById("caseDirectoryBtn");
        const menu    = document.getElementById("caseDropdown");
        const wrapper = document.querySelector(".nav-dropdown-wrapper");

        if (!button || !menu || !wrapper) {
            console.error("Header: Case Directory elements were not found.");
            return;
        }

        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            const settingsMenu = document.getElementById("settingsMenu");
            if (settingsMenu) settingsMenu.classList.remove("open");

            const open = menu.classList.toggle("open");
            button.classList.toggle("open", open);
            button.setAttribute("aria-expanded", String(open));
        });

        menu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function (event) {
                if (this.getAttribute("href") === "#") event.preventDefault();
                menu.classList.remove("open");
                button.classList.remove("open");
                button.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", function (event) {
            if (!wrapper.contains(event.target)) {
                menu.classList.remove("open");
                button.classList.remove("open");
                button.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* ------------------------------------------------------------
       Main navigation
       ------------------------------------------------------------ */
    function setupNavigation() {
        const navItems = document.querySelectorAll(".brand-nav .nav-item");

        const currentPage = window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

        const caseDirectoryPages = [
            "legacy-case-directory.html",
            "shine-case-directory.html"
        ];

        const caseDirectoryButton = document.getElementById("caseDirectoryBtn");

        navItems.forEach(function (nav) {
            nav.classList.remove("active");
        });

        if (caseDirectoryButton && caseDirectoryPages.includes(currentPage)) {
            caseDirectoryButton.classList.add("active");
        } else {
            navItems.forEach(function (item) {
                const destination = {
                    home: "index.html",
                    ebs:  "ebs-response-template.html",
                    fbc:  "fbc-comments-guide.html",
                    links:"links.html"
                }[item.dataset.nav];

                if (destination && currentPage === destination.toLowerCase()) {
                    item.classList.add("active");
                }
            });
        }

        navItems.forEach(function (item) {
            if (item.id === "caseDirectoryBtn") return;

            item.addEventListener("click", function () {
                navItems.forEach(function (nav) {
                    nav.classList.remove("active");
                });

                this.classList.add("active");

                const destination = {
                    home: "index.html",
                    ebs:  "ebs-response-template.html",
                    fbc:  "fbc-comments-guide.html",
                    links:"links.html"
                }[this.dataset.nav];

                if (destination) window.location.href = destination;
            });
        });
    }

    /* ------------------------------------------------------------
       Global Search
       ------------------------------------------------------------ */
    const DSS_GUIDE_BASE_PATH = "/Decision-Support-SystemV2/";

    const DSS_GUIDE_GROUPS = {
        billing:   "Billing Dispute",
        pricing:   "Pricing General",
        surcharge: "Surcharges",
        account:   "Account Handling",
        paud:      "PAUD Queue",
        other:     "Other Operational"
    };

    const DSS_GUIDE_CATALOG = [
        ["Debtor Update per BOL", "guides/Billing%20Dispute%20Guides/debtor-update-per-bol/debtor-update-per-bol.html", "Follow BOL terms to determine the correct debtor and ensure accurate billing setup.", "billing"],
        ["Debtor Update per LOA", "guides/Billing%20Dispute%20Guides/debtor-update-per-loa/debtor-update-per-loa.html", "Use LOA to evaluate debtor update requests and determine the correct billing action.", "billing"],
        ["Debtor Update per Reversal/Refusal", "guides/Billing%20Dispute%20Guides/debtor-update-per-rvsl/debtor-update-per-rvsl.html", "Evaluate reversal or refusal cases and determine the correct debtor and billing action.", "billing"],
        ["Weight Update per BOL", "guides/Billing%20Dispute%20Guides/weight-update-per-bol/weight-update-per-bol.html", "Evaluate BOL-based weight and pallet discrepancies to determine the correct action or routing.", "billing"],
        ["Service Level/Type Update per BOL", "guides/Billing%20Dispute%20Guides/service-level-type/service-level-type.html", "Evaluate service level disputes to confirm correct rating based on BOL details.", "billing"],
        ["Reference Number Update - Add/Edit/Delete", "guides/Billing%20Dispute%20Guides/reference-number/reference-number.html", "Manage reference number updates and ensure correct correction processing and invoice handling.", "billing"],
        ["Fuel Guide", "guides/Pricing%20Guides/fuel-guide/fuel-guide.html", "Review fuel-related pricing disputes using the correct guide and supporting validation steps.", "pricing"],
        ["Surcharge Guide", "guides/Pricing%20Guides/surcharge-guide/surcharge-guide.html", "Check surcharge disputes and verify the correct supporting logic before responding.", "pricing"],
        ["ePRT Guide", "guides/Pricing%20Guides/eprt-guide/eprt-guide.html", "Use ePRT guidance when pricing results need exception handling or escalation review.", "pricing"],
        ["ePRT Submission", "guides/Pricing%20Guides/eprt-submission/eprt-submission.html", "Open the submission page when the case already requires formal ePRT routing.", "pricing"],
        ["Checking EPRS", "guides/Pricing%20Guides/checking-eprs/checking-eprs.html", "Validate customer agreement and pricing setup using the EPRS reference tool.", "pricing"],
        ["Base Rater", "guides/Pricing%20Guides/base-rater/base-rater.html", "Open the base rating tool when pricing needs direct rate validation support.", "pricing"],
        ["Discount - AMC Guide", "guides/Pricing%20Guides/discount-amc-guide/discount-amc-guide.html", "Follow the premium decision flow for agreement checks, pricing exceptions, AMC handling, and rerate direction.", "pricing"],
        ["Courtesy Discount Guide", "guides/Pricing%20Guides/courtesy-discount/courtesy-discount.html", "Use this guide when the concern involves courtesy discount handling, review direction, or surcharge-related adjustment support.", "pricing"],
        ["High Cost Fee", "guides/Other%20Surcharge%20Guides/high-cost-fee/high-cost-fee.html", "Review high cost fee concerns and validate the appropriate surcharge handling.", "surcharge"],
        ["Peak Surcharge Fee", "guides/Other%20Surcharge%20Guides/peak-surcharge-fee/peak-surcharge-fee.html", "Review peak surcharge concerns and determine the correct handling for period-based charges.", "surcharge"],
        ["California Compliance", "guides/Other%20Surcharge%20Guides/california-compliance/california-compliance.html", "Review surcharge concerns tied to California compliance requirements and validation.", "surcharge"],
        ["Zip Service Charge", "guides/Other%20Surcharge%20Guides/zip-service-charge/zip-service-charge.html", "Validate location-based service charges and determine the appropriate surcharge action.", "surcharge"],
        ["Cross-Border Processing Fee", "guides/Other%20Surcharge%20Guides/cross-border-processing-fee/cross-border-processing-fee.html", "Review international processing fee concerns and validate the appropriate surcharge handling.", "surcharge"],
        ["Canadian Custom Inspection Fee", "guides/Other%20Surcharge%20Guides/canadian-custom-inspection-fee/canadian-custom-inspection-fee.html", "Review Canadian inspection-related fee concerns and validate the applicable fee.", "surcharge"],
        ["Canadian Surcharge Guide", "guides/Other%20Surcharge%20Guides/canadian-surcharge-guide/canadian-surcharge-guide.html", "Review Canada-related surcharge concerns and determine the correct pricing action.", "surcharge"],
        ["Weighing Service Fee", "guides/Other%20Surcharge%20Guides/weighing-service-guide/weighing-service-guide.html", "Review weighing service fee disputes and determine whether the charge should remain or be removed.", "surcharge"],
        ["NOST Guide", "guides/Other%20Surcharge%20Guides/nost-guide/nost-guide.html", "Review NOST disputes, validate pickup and dashboard details, and determine the correct account action.", "surcharge"],
        ["Sort & Segregate Guide", "guides/Other%20Surcharge%20Guides/sort-and-segregate-guide/sort-and-segregate-guide.html", "Validate Sort & Segregate disputes and determine the correct surcharge handling.", "surcharge"],
        ["Notify Fee Guide", "guides/Other%20Surcharge%20Guides/notify-fee-guide/notify-fee-guide.html", "Validate Notify Fee disputes and determine whether the notification charge should remain or be removed.", "surcharge"],
        ["Lumper Fee Guide", "guides/Other%20Surcharge%20Guides/lumper-fee-guide/lumper-fee-guide.html", "Handle Lumper fee disputes and validate the appropriate surcharge response and documentation.", "surcharge"],
        ["Storage Fee Guide", "guides/Other%20Surcharge%20Guides/storage-fee-guide/storage-fee-guide.html", "Validate storage fee disputes, calculations, supporting documents, and FedEx fault claims.", "surcharge"],
        ["Redelivery Handling Guide", "guides/Other%20Surcharge%20Guides/redelivery-handling-guide/redelivery-handling-guide.html", "Review second delivery attempts, receiving conditions, and customer refusal scenarios to validate the fee.", "surcharge"],
        ["Handling Inactive Account", "guides/Account%20Handling%20Guides/handling-notactive-guide/handling-notactive-guide.html", "Validate inactive, archived, deleted, or do-not-use accounts and determine the correct next action.", "account"],
        ["Creating Customer's Account", "guides/Account%20Handling%20Guides/creating-customer-account/creating-customer-account.html", "Follow the correct setup process when creating a new customer account.", "account"],
        ["Steps on How to Create an Account", "guides/Account%20Handling%20Guides/account-creation-steps/account-creation-steps.html", "Follow the structured step-by-step process for complete customer account creation.", "account"],
        ["Searching for Account Guide", "guides/Account%20Handling%20Guides/searching-account-guide/searching-account-guide.html", "Locate and validate the correct customer account before proceeding with account handling.", "account"],
        ["Updating SCAC/BU Guide", "guides/Account%20Handling%20Guides/updating-pt-scacbu-guide/updating-pt-scacbu-guide.html", "Validate SCAC/BU update requests and determine the correct correction and update steps.", "account"],
        ["Regions and EHOT Queue Guide", "guides/PAUD%20Guides/region-and-ehot-queue/region-and-ehot-queue.html", "Review and process region and EHOT queue requests including account, accessorial, service type, and related updates.", "paud"],
        ["TPLO Guide", "guides/PAUD%20Guides/tplo-guide/tplo-guide.html", "Handle TPLO requests including SPOC validation, account mapping, special account routing, and billing handling.", "paud"],
        ["TPHI Guide", "guides/PAUD%20Guides/tphi-guide/tphi-guide.html", "Follow the TEMP-SYS matching process to correctly map charge accounts and ensure proper debtor selection.", "paud"],
        ["PAUD / TPKN Guide", "guides/PAUD%20Guides/paud-tpkn-guide/paud-tpkn-guide.html", "Follow the process for replacing Shipper Code requests, including account validation, auto-rating, and corrections.", "paud"],
        ["CRAU — Request Decision Guide", "guides/PAUD%20Guides/crau-guide/crau-guide.html", "Handle CRAU requests through validation checks, request review, and the correct next action.", "paud"],
        ["PAUD-FPAY Guide", "guides/PAUD%20Guides/paud-fpay-guide/paud-fpay-guide.html", "Review payment-related handling, account validation, and proper PAUD-FPAY workflow decisions.", "paud"],
        ["COD (Collect on Delivery) Guide", "guides/PAUD%20Guides/cod-guide/cod-guide.html", "Handle COD additions or removals using BOL validation, LOA/CLP support, keywords, and automating steps.", "paud"],
        ["Invalid Consignee/Shipper Account (ISPD)", "guides/PAUD%20Guides/ispd-guide/ispd-guide.html", "Review ISPD queue requests, validate account discrepancies, and apply the correct ACR correction path.", "paud"],
        ["LMPB (Lumper Fee) Guide", "guides/PAUD%20Guides/lmpb-guide/lmpb-guide.html", "Handle Lumper fee requests, Sort & Segregate validation, prepaid/third-party handling, and CORR ACC processing.", "paud"],
        ["IRT1–PO Number & Division Validation", "guides/PAUD%20Guides/irt1-po-number-division-guide/irt1-po-number-division-guide.html", "Validate PO number and division information and determine the correct billing terms, account, and correction action.", "paud"],
        ["IRT/VSAT – Queue Guide", "guides/PAUD%20Guides/irt-vsat-guide/irt-vsat-guide.html", "Handle Graino, Rio Bravo, and Hino queue cases through validation, account mapping, and correction codes.", "paud"],
        ["SAF2 Guide – NMFC, Reweigh & Weight Validation", "guides/PAUD%20Guides/saf2-guide/saf2-guide.html", "Validate NMFC classifications, pallet and tare weights, reweigh certificates, and billing corrections.", "paud"],
        ["BLOA Guide – Accessorial & Terms Validation", "guides/PAUD%20Guides/bloa-guide/bloa-guide.html", "Validate accessorial terms against the Letter of Authority and determine the correct billing correction.", "paud"],
        ["PAT8 – Multi-Company Queue Guide", "guides/PAUD%20Guides/pat8-guide/pat8-guide.html", "Handle EMERSON, FLMRS, Harte Hanks, Two Value Fabrics, and accessorial removal requests.", "paud"],
        ["PAT7 – Special Invoice Review Guide", "guides/PAUD%20Guides/pat7-guide/pat7-guide.html", "Review special invoice handling, BOL imaging, reference edits, PO validation, and invoice posting actions.", "paud"],
        ["PARS – Parker Hannifin Queue Guide", "guides/PAUD%20Guides/pars-guide/pars-guide.html", "Validate Parker Hannifin debtor handling, consignee updates, rate comparisons, and correction code selection.", "paud"],
        ["CORT – Reconsignment Guide", "guides/PAUD%20Guides/cort-guide/cort-guide.html", "Handle reconsignment requests by validating weight, piece count, customer center, NEWP, and AUTO RATE requirements.", "paud"],
        ["HOT – EHOT Queue Requests", "guides/PAUD%20Guides/hot-ehot-queue-guide/hot-ehot-queue-guide.html", "Handle HOT/EHOT requests including storage disputes, shipment detail updates, routing, redelivery, GAMD, and REDOT.", "paud"],
        ["OVC — General Guideline", "guides/Other%20Guides/ovc-general-guide/ovc-general-guide.html", "Official OVC guideline for handling customer claims and disputes.", "other"],
        ["Reweigh — General Guide", "guides/Other%20Guides/reweigh-general-guide/reweigh-general-guide.html", "Decision guide for reweigh disputes and corrections.", "other"],
        ["Correction Code Guide", "guides/Other%20Guides/correction-code-guide/correction-code-guide.html", "Decision tree to determine the correct CORR CODE.", "other"],
        ["FedEx Direct Guide", "guides/Other%20Guides/fedex-direct-guide/fedex-direct-guide.html", "Decision tree for FedEx Direct disputes and validation.", "other"],
        ["Class Update Guide", "guides/Other%20Guides/class-update-guide/class-update-guide.html", "Decision tree for handling Class Update requests.", "other"],
        ["Rate & Volume Quote Guide", "guides/Other%20Guides/rate-volume-guide/rate-volume-guide.html", "Decision tree for validating LTL and Volume Quotes.", "other"],
        ["Save a Day Guide/Early Delivery Fee", "guides/Other%20Guides/shave-a-day-guide/shave-a-day-guide.html", "Verify SHAD fees, LOA and service level details, delivery status, and the correct service correction.", "other"],
        ["Verifying Tracking Number Guide", "guides/Other%20Guides/information-validation-guide/information-validation-guide.html", "Guide for validating freight tracking and shipment information.", "other"],
        ["Missing Documents Guide", "guides/Other%20Guides/missing-docs-guide/missing-docs-guide.html", "Guide for requesting missing BOL and supporting documents.", "other"],
        ["Keep or Remove Payment Guide", "guides/Other%20Guides/keep-or-remove-payment-guide/keep-or-remove-payment-guide.html", "Determine whether to keep or remove payment based on LOA, billing corrections, and pricing scenarios.", "other"],
        ["Demand Invoice Guide", "guides/Other%20Guides/demand-invoice-guide/demand-invoice-guide.html", "Structured decision flow for demand invoice cases, PRO checks, resend scenarios, and invoice types.", "other"],
        ["Recycled Pro Guide", "guides/Other%20Guides/recycled-pro-guide/recycled-pro-guide.html", "Identify recycled PRO issues, validate version history, and apply the correct resolution steps.", "other"],
        ["Employee Discount Guide", "guides/Other%20Guides/employee-discount-guide/employee-discount-guide.html", "Validate employee discount eligibility and determine the correct billing handling.", "other"],
        ["Void and Write Off Guide", "guides/Other%20Guides/void-and-wo-guide/void-and-wo-guide.html", "Follow the workflow for service errors, rebill scenarios, surcharge handling, PRO voiding, and write-offs.", "other"],
        ["Pro Number Suffix Guide", "guides/Other%20Guides/pro-no-suffix/pro-no-suffix.html", "Identify correct handling based on PRO number suffix, including F0, CO, YO, and non-revenue scenarios.", "other"],
        ["Volume Application Guide", "guides/Other%20Guides/volume-application/volume-application.html", "Review, validate, and process volume application requests using the correct workflow.", "other"],
        ["Expedited Shipment / Priority Plus Guide", "guides/Other%20Guides/priority-plus-guide/priority-plus-guide.html", "Review Priority Plus or Expedited Shipment disputes and validate rate, service, BOL, and LOA support.", "other"],
        ["Rerate Treatment Process Guide", "guides/Other%20Guides/rerate-treatment-process-guide/rerate-treatment-process-guide.html", "Determine the correct rerate treatment based on PRO age, pricing status, debtor updates, rebills, and corrections.", "other"],
        ["Inbond Fee Guide", "guides/Other%20Guides/inbond-fee-guide/inbond-fee-guide.html", "Validate Inbond fee disputes using BOL documentation and Cargo Care indicators.", "other"],
        ["Handling Fee Guide", "guides/Other%20Guides/handling-fee-guide/handling-fee-guide.html", "Validate Handling fee disputes involving usage, loading, unloading, assembly, and supporting documents.", "other"],
        ["ISPI — Mass Adjustment Guide", "guides/Other%20Guides/ispi-guide/ispi-guide.html", "Process mass adjustments including PRO entry, account changes, approvals, checks, and final processing.", "other"],
        ["All Shorts Guide", "guides/Other%20Guides/all-shorts-guide/all-shorts-guide.html", "Handle All Short and Partial Short disputes using shipment history, claims, LOA documentation, and piece counts.", "other"],
        ["Sales Write-Off Guide", "guides/Other%20Guides/sales-write-off-guide/sales-write-off-guide.html", "Review Sales Write-Off requests, validate PRO and debtor eligibility, and follow approval thresholds.", "other"],
        ["Write-off in CAPS — Step by Step Procedure", "guides/Other%20Guides/wo-process-caps-guide/wo-process-caps-guide.html", "Process write-offs in CAPS from Business Unit selection and PRO entry through comments, responses, and case closure.", "other"]
    ];

    const DSS_GUIDE_SEARCH_CACHE_KEY = "dssV2GlobalGuideSearchIndex_v3";
    const DSS_GUIDE_SEARCH_CACHE_TTL = 10 * 60 * 1000;

    let globalGuideSearchIndex   = [];
    let globalGuideSearchReady   = false;
    let globalGuideSearchPromise = null;

    function escapeSearchHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function normalizeSearchText(value) {
        return String(value || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function getSearchRoot() {
        let root = document.querySelector(".global-search");
        if (!root) return null;

        let panel = root.querySelector(".global-search-results");
        if (!panel) {
            panel = document.createElement("div");
            panel.className = "global-search-results";
            panel.setAttribute("role", "listbox");
            panel.setAttribute("aria-label", "Guide search results");
            root.appendChild(panel);
        }

        return { root, panel };
    }

    function setSearchPanel(panel, html, open) {
        if (!panel) return;
        panel.innerHTML = html;
        panel.classList.toggle("open", Boolean(open));
    }

    function showSearchLoading() {
        const ui = getSearchRoot();
        if (!ui) return;

        setSearchPanel(ui.panel, `
            <div class="global-search-state">
                <span class="global-search-spinner" aria-hidden="true"></span>
                <span>Loading guide library...</span>
            </div>
        `, true);
    }

    function showSearchEmpty(query) {
        const ui = getSearchRoot();
        if (!ui) return;

        setSearchPanel(ui.panel, `
            <div class="global-search-state empty">
                <span class="global-search-state-icon" aria-hidden="true">⌕</span>
                <strong>No matching guides</strong>
                <small>Try another guide name, topic, or keyword.</small>
            </div>
        `, true);
    }

    function getCurrentPageGuideCards() {
        return Array.from(document.querySelectorAll(".guide-card"));
    }

    function extractGuideFromCard(card, sourceUrl, groupName) {
        if (!card) return null;

        const title = card.querySelector("h3")?.textContent?.replace(/\s+/g, " ").trim();
        if (!title) return null;

        const description = card.querySelector(".lead, p")?.textContent?.replace(/\s+/g, " ").trim() || "";
        const keywords = card.getAttribute("data-search") || card.getAttribute("data-keywords") || "";

        let link = card.getAttribute("data-url") || "";
        const anchor = card.querySelector("a[href]");
        if (!link && anchor) link = anchor.getAttribute("href") || "";

        if (!link) return null;

        let absoluteGuideUrl;

        if (/^(?:https?:)?\/\//i.test(link)) {
            absoluteGuideUrl = new URL(link, document.baseURI).href;
        } else if (link.startsWith("/")) {
            absoluteGuideUrl = new URL(link, document.baseURI).href;
        } else if (/^guides\//i.test(link)) {
            absoluteGuideUrl = new URL(link, document.baseURI).href;
        } else {
            absoluteGuideUrl = new URL(link, sourceUrl || document.baseURI).href;
        }

        const searchable = normalizeSearchText([
            title,
            description,
            keywords,
            groupName || ""
        ].join(" "));

        return {
            title,
            description,
            keywords,
            group: groupName || "Guide Library",
            url: absoluteGuideUrl,
            search: searchable
        };
    }

    function addGuideToIndex(guide, seen) {
        if (!guide || !guide.title || !guide.url) return;

        const key = guide.url.split("#")[0].toLowerCase();
        if (seen.has(key)) return;

        seen.add(key);
        globalGuideSearchIndex.push(guide);
    }

    function loadCachedSearchIndex() {
        try {
            const raw = sessionStorage.getItem(DSS_GUIDE_SEARCH_CACHE_KEY);
            if (!raw) return false;

            const cached = JSON.parse(raw);
            if (!cached || !Array.isArray(cached.items)) return false;
            if (Date.now() - Number(cached.timestamp || 0) > DSS_GUIDE_SEARCH_CACHE_TTL) return false;

            globalGuideSearchIndex = cached.items;
            globalGuideSearchReady = globalGuideSearchIndex.length > 0;
            return globalGuideSearchReady;
        } catch (error) {
            console.warn("Header: unable to read search cache:", error);
            return false;
        }
    }

    function saveSearchIndexCache() {
        try {
            sessionStorage.setItem(DSS_GUIDE_SEARCH_CACHE_KEY, JSON.stringify({
                timestamp: Date.now(),
                items: globalGuideSearchIndex
            }));
        } catch (error) {
            console.warn("Header: unable to save search cache:", error);
        }
    }

    function buildStaticCatalogIndex(seen) {
        const base = window.location.origin + DSS_GUIDE_BASE_PATH;

        DSS_GUIDE_CATALOG.forEach(function (row) {
            const title       = row[0];
            const path        = row[1];
            const description = row[2];
            const groupKey    = row[3];
            const groupName   = DSS_GUIDE_GROUPS[groupKey] || "Guide Library";

            let absoluteUrl;
            try {
                absoluteUrl = new URL(path, base).href;
            } catch (e) {
                return;
            }

            const searchable = normalizeSearchText([
                title,
                description,
                groupName
            ].join(" "));

            addGuideToIndex({
                title: title,
                description: description,
                keywords: "",
                group: groupName,
                url: absoluteUrl,
                search: searchable
            }, seen);
        });
    }

    async function buildGlobalGuideSearchIndex() {
        if (globalGuideSearchPromise) return globalGuideSearchPromise;

        globalGuideSearchPromise = (async function () {
            const seen = new Set();
            globalGuideSearchIndex = [];

            const currentPageUrl = window.location.href;
            const currentPageTitle =
                document.querySelector(".group-hero h1")?.textContent
                    ?.replace(/\s+/g, " ").trim()
                || document.title
                || "Current Page";

            getCurrentPageGuideCards().forEach(function (card) {
                addGuideToIndex(
                    extractGuideFromCard(card, currentPageUrl, currentPageTitle),
                    seen
                );
            });

            buildStaticCatalogIndex(seen);

            globalGuideSearchIndex.sort(function (a, b) {
                return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
            });

            globalGuideSearchReady = globalGuideSearchIndex.length > 0;
            saveSearchIndexCache();

            return globalGuideSearchIndex;
        })().catch(function (error) {
            console.error("Header: global guide search index failed:", error);
            globalGuideSearchReady = false;
            return globalGuideSearchIndex;
        }).finally(function () {
            globalGuideSearchPromise = null;
        });

        return globalGuideSearchPromise;
    }

    function scoreGuide(guide, query) {
        const q = normalizeSearchText(query);
        if (!q) return 0;

        const words = q.split(" ").filter(Boolean);
        const title = normalizeSearchText(guide.title);
        const group = normalizeSearchText(guide.group);
        const search = guide.search || "";

        let score = 0;

        if (title === q) score += 1000;
        else if (title.startsWith(q)) score += 700;
        else if (title.includes(q)) score += 500;

        if (group === q) score += 350;
        else if (group.includes(q)) score += 180;

        if (search.includes(q)) score += 120;

        words.forEach(word => {
            if (title.includes(word)) score += 90;
            if (group.includes(word)) score += 40;
            if (search.includes(word)) score += 20;
        });

        return score;
    }

    function searchGlobalGuides(query) {
        const normalized = normalizeSearchText(query);
        if (!normalized) return [];

        return globalGuideSearchIndex
            .map(guide => ({ guide, score: scoreGuide(guide, normalized) }))
            .filter(item => item.score > 0)
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return a.guide.title.localeCompare(b.guide.title);
            })
            .slice(0, 8)
            .map(item => item.guide);
    }

    function highlightMatch(text, query) {
        const safe = escapeSearchHtml(text);
        const words = normalizeSearchText(query)
            .split(" ")
            .filter(Boolean)
            .slice(0, 5);

        if (!words.length) return safe;

        let output = safe;
        words.forEach(word => {
            const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            try {
                output = output.replace(new RegExp(`(${escaped})`, "ig"), "<mark>$1</mark>");
            } catch (_) { /* ignore malformed terms */ }
        });

        return output;
    }

    function renderSearchResults(query, results) {
        const ui = getSearchRoot();
        if (!ui) return;

        if (!results.length) {
            showSearchEmpty(query);
            return;
        }

        const html = `
            <div class="global-search-results-header">
                <span>Guide results</span>
                <b>${results.length}${globalGuideSearchIndex.length > results.length ? "+" : ""}</b>
            </div>
            <div class="global-search-results-list">
                ${results.map((guide, index) => `
                    <button
                        class="global-search-result"
                        type="button"
                        role="option"
                        data-search-index="${index}"
                        data-guide-url="${escapeSearchHtml(guide.url)}"
                    >
                        <span class="global-search-result-icon" aria-hidden="true">
                            <i class="fa-solid fa-file-lines"></i>
                        </span>
                        <span class="global-search-result-copy">
                            <strong>${highlightMatch(guide.title, query)}</strong>
                            <small>${escapeSearchHtml(guide.group)}</small>
                        </span>
                        <span class="global-search-result-arrow" aria-hidden="true">→</span>
                    </button>
                `).join("")}
            </div>
            <div class="global-search-results-footer">
                <span><kbd>Enter</kbd> open first result</span>
                <span><kbd>Esc</kbd> close</span>
            </div>
        `;

        setSearchPanel(ui.panel, html, true);

        ui.panel.querySelectorAll(".global-search-result").forEach(button => {
            button.addEventListener("click", function () {
                const target = this.getAttribute("data-guide-url");
                if (!target) return;

                const titleEl = this.querySelector(".global-search-result-copy strong");
                const title = titleEl ? titleEl.textContent.trim() : "Untitled Guide";

                if (window.GuideStore) {
                    window.GuideStore.trackOpen(title, target);
                }

                ui.panel.classList.remove("open");
                ui.root.classList.remove("has-results");
                window.location.href = target;
            });
        });
    }

    async function performGlobalHeaderSearch(value, openFirstOnEnter) {
        const query = String(value || "").trim();
        const ui = getSearchRoot();
        if (!ui) return [];

        if (!query) {
            ui.panel.classList.remove("open");
            ui.root.classList.remove("has-results");
            return [];
        }

        ui.root.classList.add("has-results");

        if (!globalGuideSearchReady) {
            if (!loadCachedSearchIndex()) {
                showSearchLoading();
                await buildGlobalGuideSearchIndex();
            }
        }

        const results = searchGlobalGuides(query);
        renderSearchResults(query, results);

        if (openFirstOnEnter && results[0]) {
            if (window.GuideStore) {
                window.GuideStore.trackOpen(results[0].title, results[0].url);
            }
            window.location.href = results[0].url;
        }

        return results;
    }

    function setupSearch() {
        const input = document.getElementById("globalSearch");
        if (!input || input.dataset.v2SearchInitialized === "true") return;

        input.dataset.v2SearchInitialized = "true";
        const ui = getSearchRoot();
        if (!ui) return;

        input.setAttribute("aria-autocomplete", "list");
        input.setAttribute("aria-controls", "globalSearchResults");
        ui.panel.id = "globalSearchResults";

        let searchTimer = null;

        input.addEventListener("input", function () {
            clearTimeout(searchTimer);
            const value = this.value.trim();

            if (!value) {
                ui.panel.classList.remove("open");
                ui.root.classList.remove("has-results");
                return;
            }

            searchTimer = setTimeout(function () {
                performGlobalHeaderSearch(value, false);
            }, 120);
        });

        input.addEventListener("focus", function () {
            if (this.value.trim()) {
                performGlobalHeaderSearch(this.value, false);
            }
        });

        input.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                event.preventDefault();
                ui.panel.classList.remove("open");
                ui.root.classList.remove("has-results");
                this.blur();
                return;
            }

            if (event.key !== "Enter") return;

            event.preventDefault();
            performGlobalHeaderSearch(this.value, true);
        });

        document.addEventListener("click", function (event) {
            if (!ui.root.contains(event.target)) {
                ui.panel.classList.remove("open");
                ui.root.classList.remove("has-results");
            }
        });

        if (!loadCachedSearchIndex()) {
            buildGlobalGuideSearchIndex();
        }
    }

    function start() {
        setupTheme();
        setupAdminGate();
        setupSettings();
        setupCaseDirectory();
        setupNavigation();
        setupSearch();
    }

    start();
})();
