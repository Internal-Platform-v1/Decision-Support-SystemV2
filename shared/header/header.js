/* ============================================================
   shared/header.js — V4
   Header behavior + settings menu + admin password gate
   Runs once after header.html has been inserted.

   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
   >>>  CHANGE THE LINE BELOW TO YOUR ADMIN PASSWORD HASH  <<<
   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

   To generate the hash, open any page of this site, open
   DevTools console, and run:

     crypto.subtle.digest("SHA-256",
       new TextEncoder().encode("YourPasswordHere"))
     .then(b => console.log(
       Array.from(new Uint8Array(b))
         .map(x => x.toString(16).padStart(2, "0")).join("")
     ));

   Paste the hex string it prints as ADMIN_PASSWORD_HASH below.
   ============================================================ */
(function () {
    "use strict";

    const ROLE_KEY  = "bd_role";
    const ADMIN_URL = "admin-console/admin-dashboard/admin-dashboard.html";

    /* >>> EDIT THIS LINE <<< */
    const ADMIN_PASSWORD_HASH =
        "0000000000000000000000000000000000000000000000000000000000000000";

    const ADMIN_UNLOCK_KEY = "bd_admin_unlocked";
    const ADMIN_UNLOCK_TTL = 30 * 60 * 1000; /* 30 minutes */

    /* ------------------------------------------------------------
       Role state (localStorage only — no auth)
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

        /* Dropping back to User invalidates any active admin unlock. */
        if (role !== "admin") clearAdminUnlocked();

        document.dispatchEvent(new CustomEvent("bdrolechange", { detail: { role } }));
    }

    /* ------------------------------------------------------------
       Admin unlock helpers
       ------------------------------------------------------------ */
    async function sha256Hex(text) {
        const bytes = new TextEncoder().encode(String(text));
        const buf   = await crypto.subtle.digest("SHA-256", bytes);
        return Array.from(new Uint8Array(buf))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    }

    function isAdminUnlocked() {
        try {
            const raw = sessionStorage.getItem(ADMIN_UNLOCK_KEY);
            if (!raw) return false;
            const obj = JSON.parse(raw);
            return Boolean(obj && typeof obj.exp === "number" && obj.exp > Date.now());
        } catch (e) {
            return false;
        }
    }

    function setAdminUnlocked() {
        try {
            sessionStorage.setItem(
                ADMIN_UNLOCK_KEY,
                JSON.stringify({ exp: Date.now() + ADMIN_UNLOCK_TTL })
            );
        } catch (e) { /* storage unavailable */ }
    }

    function clearAdminUnlocked() {
        try { sessionStorage.removeItem(ADMIN_UNLOCK_KEY); } catch (e) {}
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

        async function attemptUnlock() {
            const value = input.value;
            if (!value) {
                error.textContent = "Enter the admin password.";
                input.focus();
                return;
            }

            let hash;
            try {
                hash = await sha256Hex(value);
            } catch (e) {
                error.textContent = "Unable to verify password in this browser.";
                return;
            }

            if (hash === ADMIN_PASSWORD_HASH) {
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

        /* Paint the stored role immediately. */
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

        /* User / Admin segmented control */
        menu.querySelectorAll(".role-option").forEach(function (opt) {
            opt.addEventListener("click", function (event) {
                event.stopPropagation();
                applyRole(setRole(this.dataset.role));
            });
        });

        /* Admin dashboard navigation — password gated */
        if (adminBtn) {
            adminBtn.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                if (getRole() !== "admin") {
                    console.warn("Header: admin dashboard blocked for non-admin role.");
                    return;
                }

                /* Collapse settings menu behind the modal. */
                close();

                /* Already unlocked this session? Go straight in. */
                if (isAdminUnlocked()) {
                    window.location.href = ADMIN_URL;
                    return;
                }

                /* Otherwise ask for the password. */
                if (window.BDAdminGate) {
                    window.BDAdminGate.open();
                } else {
                    console.error("Header: admin gate was not initialised.");
                }
            });
        }

        /* Click outside closes the menu */
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
       Global Search — DSS V2
       ------------------------------------------------------------ */
    const DSS_GUIDE_SEARCH_SOURCES = [
        "guides/Billing Dispute Guides/billing-dispute-guides.html",
        "guides/Billing Dispute Guides/billing-dispute-guides (7).html",
        "guides/Pricing General Guides/pricing-guides.html",
        "guides/Pricing General Guides/pricing-guides-final.html",
        "guides/pricing-guides.html",
        "guides/Billing Dispute Guides/account-handling-guides.html",
        "guides/Billing Dispute Guides/account-handling-guides-secured.html",
        "guides/account-handling-guides.html",
        "guides/PAUD Queue Guides/paud-queue-guides.html",
        "guides/PAUD Queue Guides/paud-queue-guides-secured.html",
        "guides/PAUD Queue Guides/paud-queue-guides-theme-ready.html",
        "guides/paud-queue-guides.html",
        "guides/Other Guides/other-guides.html",
        "guides/other-guides.html"
    ];

    const DSS_GUIDE_SEARCH_CACHE_KEY = "dssV2GlobalGuideSearchIndex";
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
            absoluteGuideUrl = new URL("/" + link, new URL(document.baseURI).origin).href;
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

    async function fetchGuideSource(sourcePath) {
        try {
            const sourceUrl = new URL(sourcePath, document.baseURI).href;
            const response = await fetch(sourceUrl, {
                method: "GET",
                cache: "no-cache",
                credentials: "same-origin"
            });

            if (!response.ok) return [];

            const html = await response.text();
            const parser = new DOMParser();
            const documentFragment = parser.parseFromString(html, "text/html");

            const pageTitle = documentFragment.querySelector("h1")?.textContent
                ?.replace(/\s+/g, " ")
                .trim();

            const pageKicker = documentFragment.querySelector(".intro-kicker")?.textContent
                ?.replace(/\s+/g, " ")
                .trim();

            const groupName = pageTitle || pageKicker || "Guide Library";
            const cards = Array.from(documentFragment.querySelectorAll(".guide-card"));

            return cards
                .map(card => extractGuideFromCard(card, sourceUrl, groupName))
                .filter(Boolean);
        } catch (error) {
            console.debug("Header: search source unavailable:", sourcePath);
            return [];
        }
    }

    async function buildGlobalGuideSearchIndex() {
        if (globalGuideSearchPromise) return globalGuideSearchPromise;

        globalGuideSearchPromise = (async function () {
            const seen = new Set();
            globalGuideSearchIndex = [];

            const currentPageUrl = window.location.href;
            const currentPageTitle = document.querySelector(".group-hero h1")?.textContent
                ?.replace(/\s+/g, " ")
                .trim()
                || document.title
                || "Current Page";

            getCurrentPageGuideCards().forEach(card => {
                addGuideToIndex(
                    extractGuideFromCard(card, currentPageUrl, currentPageTitle),
                    seen
                );
            });

            const groups = await Promise.all(
                DSS_GUIDE_SEARCH_SOURCES.map(fetchGuideSource)
            );

            groups.flat().forEach(guide => addGuideToIndex(guide, seen));

            globalGuideSearchIndex.sort((a, b) =>
                a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
            );

            globalGuideSearchReady = globalGuideSearchIndex.length > 0;
            saveSearchIndexCache();

            return globalGuideSearchIndex;
        })().catch(error => {
            console.error("Header: global guide search index failed:", error);
            globalGuideSearchReady = false;
            return globalGuideSearchIndex;
        }).finally(() => {
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

    /* ------------------------------------------------------------
       One-time startup
       ------------------------------------------------------------ */
    function start() {
        setupAdminGate();
        setupSettings();
        setupCaseDirectory();
        setupNavigation();
        setupSearch();
    }

    start();
})();
