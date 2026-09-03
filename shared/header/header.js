/* ============================================================
   shared/header.js — V2
   Header behavior + current-user display
   Runs once after header.html has been inserted.
   ============================================================ */
(function () {
    "use strict";

    const FIREBASE_CONFIG = {
        apiKey: "AIzaSyDjaMdeh0Cgx00hzDyZOi54fKDr8KwnxJU",
        authDomain: "bdgg-database.firebaseapp.com",
        projectId: "bdgg-database",
        storageBucket: "bdgg-database.appspot.com",
        messagingSenderId: "43574975434",
        appId: "1:43574975434:web:4c79e581267fdfcc6ccd33"
    };

    /* ------------------------------------------------------------
       Firebase: initialize once only
       ------------------------------------------------------------ */
    function getFirebase() {
        if (typeof firebase === "undefined") {
            console.error("V2 Header: Firebase SDK is not loaded.");
            return null;
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }

        return firebase;
    }

    /* ------------------------------------------------------------
       User name / avatar
       ------------------------------------------------------------ */
    function initialsFromName(name) {
        const value = String(name || "User").trim().replace(/\s+/g, " ");
        const parts = value.split(" ");

        if (parts.length === 1) {
            return value.slice(0, 2).toUpperCase();
        }

        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

function updateUserDisplay(profile) {
    const name = profile && profile.displayName
        ? profile.displayName
        : "User";

    const role = profile && profile.role
        ? String(profile.role).trim()
        : "";

    const profileName = document.getElementById("profileName");
    const profileRole = document.getElementById("profileRole");
    const profileButton = document.getElementById("profileBtn");
    const commandCenterButton = document.getElementById(
        "systemCommandCenterBtn"
    );

    if (profileName) {
        profileName.textContent = name;
    }

    if (profileRole) {
        profileRole.textContent = role || "BD Tools User";
    }

    if (profileButton) {
        profileButton.textContent = initialsFromName(name);
        profileButton.setAttribute(
            "aria-label",
            "Open profile for " + name
        );
    }

    /*
     * Show System Command Center only to Managers.
     * Accepts "manager" or "Manager".
     */
function updateManagerCommandCenter(profile) {
    const commandCenterButton = document.getElementById(
        "systemCommandCenterBtn"
    );

    if (!commandCenterButton) {
        console.warn(
            "System Command Center button was not found in the header."
        );
        return;
    }

    const role = String(
        profile?.role ||
        window.currentUserProfile?.role ||
        ""
    ).trim().toLowerCase();

    const isManager =
        role === "manager" ||
        role === "admin" ||
        role === "administrator";

    if (isManager) {
        commandCenterButton.removeAttribute("hidden");
        commandCenterButton.style.display = "flex";
    } else {
        commandCenterButton.setAttribute("hidden", "");
        commandCenterButton.style.display = "none";
    }

    console.log("Header role:", role);
    console.log("System Command Center visible:", isManager);
}

    const dashboardName = document.getElementById("currentUserName");

    if (dashboardName) {
        dashboardName.textContent = name;
    }
}

    async function loadUser(user) {
        const fb = getFirebase();
        if (!fb || !user) return;

        const email = String(user.email || "").trim().toLowerCase();
        let displayName = user.displayName || email.split("@")[0] || "User";
        let role = "";

        try {
            const snapshot = await fb.firestore()
                .collection("approved_users")
                .where("email", "==", email)
                .limit(1)
                .get();

            if (!snapshot.empty) {
                const data = snapshot.docs[0].data() || {};

                if (data.name) {
                    displayName = String(data.name)
                        .replace(/\s+vndr$/i, "")
                        .trim();
                }

                if (data.role) {
                    role = String(data.role).trim();
                }
            }
        } catch (error) {
            console.error("V2 Header: approved_users lookup failed:", error);
        }

        window.currentUser = user;
        window.currentUserProfile = {
            uid: user.uid,
            email: user.email,
            displayName: displayName,
            role: role
        };

        updateUserDisplay(window.currentUserProfile);

       console.log("CURRENT USER PROFILE:", window.currentUserProfile);
      console.log("CURRENT USER ROLE:", window.currentUserProfile.role);

        document.dispatchEvent(new CustomEvent("currentUserProfileLoaded", {
            detail: window.currentUserProfile
        }));

        console.log("V2 Header: current user loaded:", window.currentUserProfile);
    }

    /* ------------------------------------------------------------
       Profile dropdown
       ------------------------------------------------------------ */
    function setupProfile() {
    const button = document.getElementById("profileBtn");
    const chevron = document.getElementById("profileChevron");
    const menu = document.getElementById("profileMenu");

    const commandCenterButton = document.getElementById(
        "systemCommandCenterBtn"
    );

    if (!button || !menu) {
        console.error("V2 Header: profile elements were not found.");
        return;
    }

    const toggle = function (event) {
        event.preventDefault();
        event.stopPropagation();

        const open = menu.classList.toggle("open");

        button.setAttribute("aria-expanded", String(open));

        if (chevron) {
            chevron.setAttribute("aria-expanded", String(open));
        }
    };

    button.addEventListener("click", toggle);

    if (chevron) {
        chevron.addEventListener("click", toggle);
    }

    /*
     * System Command Center
     */
    if (commandCenterButton) {
        commandCenterButton.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            const profile = window.currentUserProfile;
            const role = profile && profile.role
                ? String(profile.role).trim().toLowerCase()
                : "";

            /*
             * Security check before navigation.
             * The button is also hidden for non-Managers.
             */
            if (role !== "manager") {
                console.warn(
                    "V2 Header: unauthorized System Command Center access."
                );
                return;
            }

            window.location.href = "admin.html";
        });
    }

    /*
     * Profile menu buttons
     */
    menu.querySelectorAll("button").forEach(function (item) {
        item.addEventListener("click", function (event) {
            event.stopPropagation();

            const action = this.textContent.trim().toLowerCase();

            if (action.includes("logout")) {
                const fb = getFirebase();

                if (fb) {
                    fb.auth().signOut().then(function () {
                        window.location.href = "index.html";
                    }).catch(function (error) {
                        console.error("Logout failed:", error);
                    });
                }
            }
        });
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".header-actions")) {
            menu.classList.remove("open");

            button.setAttribute("aria-expanded", "false");

            if (chevron) {
                chevron.setAttribute("aria-expanded", "false");
            }
        }
    });
}

    /* ------------------------------------------------------------
       Case Directory dropdown
       ------------------------------------------------------------ */
    function setupCaseDirectory() {
        const button = document.getElementById("caseDirectoryBtn");
        const menu = document.getElementById("caseDropdown");
        const wrapper = document.querySelector(".nav-dropdown-wrapper");

        if (!button || !menu || !wrapper) {
            console.error("V2 Header: Case Directory elements were not found.");
            return;
        }

        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            const profileMenu = document.getElementById("profileMenu");
            if (profileMenu) profileMenu.classList.remove("open");

            const open = menu.classList.toggle("open");
            button.classList.toggle("open", open);
            button.setAttribute("aria-expanded", String(open));
        });

        menu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function (event) {
                if (this.getAttribute("href") === "#") {
                    event.preventDefault();
                }
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

        navItems.forEach(function (item) {
            if (item.id === "caseDirectoryBtn") return;

            item.addEventListener("click", function () {
                navItems.forEach(function (nav) {
                    nav.classList.remove("active");
                });

                this.classList.add("active");

                const destination = {
                    home: "index-main.html",
                    ebs: "ebs-response-template.html",
                    fbc: "fbc-comments-guide.html",
                    links: "links.html"
                }[this.dataset.nav];

                if (destination) {
                    window.location.href = destination;
                }
            });
        });
    }

    /* ------------------------------------------------------------
       Global Search — DSS V2

       The header search is a true global guide search.
       It reads the .guide-card metadata from each group page,
       so the group HTML remains the source of truth.
       ------------------------------------------------------------ */

    const DSS_GUIDE_SEARCH_SOURCES = [
        /* Billing Dispute */
        "guides/Billing Dispute Guides/billing-dispute-guides.html",
        "guides/Billing Dispute Guides/billing-dispute-guides (7).html",

        /* Pricing */
        "guides/Pricing General Guides/pricing-guides.html",
        "guides/Pricing General Guides/pricing-guides-final.html",
        "guides/pricing-guides.html",

        /* Account Handling */
        "guides/Billing Dispute Guides/account-handling-guides.html",
        "guides/Billing Dispute Guides/account-handling-guides-secured.html",
        "guides/account-handling-guides.html",

        /* PAUD Queue */
        "guides/PAUD Queue Guides/paud-queue-guides.html",
        "guides/PAUD Queue Guides/paud-queue-guides-secured.html",
        "guides/PAUD Queue Guides/paud-queue-guides-theme-ready.html",
        "guides/paud-queue-guides.html",

        /* Other */
        "guides/Other Guides/other-guides.html",
        "guides/other-guides.html"
    ];

    const DSS_GUIDE_SEARCH_CACHE_KEY = "dssV2GlobalGuideSearchIndex";
    const DSS_GUIDE_SEARCH_CACHE_TTL = 10 * 60 * 1000;

    let globalGuideSearchIndex = [];
    let globalGuideSearchReady = false;
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

        /*
         * Group pages use <base href="../../">, and several cards store
         * root-level paths such as "guides/Billing Dispute Guides/...".
         * Resolve those against the site origin rather than the group
         * page's directory. Normal relative links stay relative to the
         * source group page.
         */
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
            console.warn("V2 Header: unable to read search cache:", error);
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
            console.warn("V2 Header: unable to save search cache:", error);
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
            /* A missing optional group source should never break the header. */
            console.debug("V2 Header: search source unavailable:", sourcePath);
            return [];
        }
    }

    async function buildGlobalGuideSearchIndex() {
        if (globalGuideSearchPromise) return globalGuideSearchPromise;

        globalGuideSearchPromise = (async function () {
            const seen = new Set();
            globalGuideSearchIndex = [];

            /* Always index the page the user is currently on first. */
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

            /* Then collect every group page in parallel. */
            const groups = await Promise.all(
                DSS_GUIDE_SEARCH_SOURCES.map(fetchGuideSource)
            );

            groups.flat().forEach(guide => addGuideToIndex(guide, seen));

            /* Stable alphabetical order keeps results predictable. */
            globalGuideSearchIndex.sort((a, b) =>
                a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
            );

            globalGuideSearchReady = globalGuideSearchIndex.length > 0;
            saveSearchIndexCache();

            return globalGuideSearchIndex;
        })().catch(error => {
            console.error("V2 Header: global guide search index failed:", error);
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
            } catch (_) {
                /* Ignore malformed highlight terms. */
            }
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

        /* Start building in the background so the first search is fast. */
        if (!loadCachedSearchIndex()) {
            buildGlobalGuideSearchIndex();
        }
    }

    /* ------------------------------------------------------------
       One-time startup
       ------------------------------------------------------------ */
    function start() {
        setupProfile();
        setupCaseDirectory();
        setupNavigation();
        setupSearch();

        const fb = getFirebase();
        if (fb) {
            /* One auth-state listener. No polling or MutationObserver. */
            fb.auth().onAuthStateChanged(function (user) {
                if (user) {
                    loadUser(user);
                } else {
                    window.currentUser = null;
                    window.currentUserProfile = null;
                }
            });
        }
    }

    start();
})();
