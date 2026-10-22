/* ============================================================
   shared/header/header.js
   ============================================================ */
(function () {
    "use strict";

    const ROLE_KEY  = "bd_role";
    const THEME_KEY = "bd_theme";
    const ADMIN_URL = "admin-console/admin-dashboard/admin-dashboard.html";
    const ADMIN_PASSWORD = "fedex-admin-2026";

    const TOKEN_KEY = "bd_admin_state";

    /* ------------------------------------------------------------
       Token stored in window.name — survives navigation,
       invisible to other scripts.
       ------------------------------------------------------------ */
    function getState() {
        try {
            if (!window.name) return {};
            return JSON.parse(window.name) || {};
        } catch (e) { return {}; }
    }

    function setState(obj) {
        try {
            window.name = JSON.stringify(obj);
        } catch (e) {
            console.error("[header.js] could not save to window.name", e);
        }
    }

    function isAdminUnlocked() {
        const s = getState();
        return Boolean(s.token && typeof s.exp === "number" && s.exp > Date.now());
    }

    function setAdminUnlocked() {
        const s = getState();
        s.token = "ok";
        s.exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
        setState(s);
        console.log("[header.js] Token saved to window.name:", window.name);
    }

    function clearAdminUnlocked() {
        const s = getState();
        delete s.token;
        delete s.exp;
        setState(s);
    }

    /* ------------------------------------------------------------
       Role
       ------------------------------------------------------------ */
    function getRole() {
        if (isAdminUnlocked()) return "admin";
        try {
            return localStorage.getItem(ROLE_KEY) === "admin" ? "admin" : "user";
        } catch (e) { return "user"; }
    }

    function setRole(role) {
        const safe = role === "admin" ? "admin" : "user";
        try { localStorage.setItem(ROLE_KEY, safe); } catch (e) {}
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
        document.dispatchEvent(new CustomEvent("bdrolechange", { detail: { role } }));
    }

    /* ------------------------------------------------------------
       Theme
       ------------------------------------------------------------ */
    function getStoredTheme() {
        try {
            const v = localStorage.getItem(THEME_KEY);
            if (v === "dark" || v === "light") return v;
        } catch (e) {}
        try {
            if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
        } catch (e) {}
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
        document.dispatchEvent(new CustomEvent("bdthemechange", { detail: { theme: safe } }));
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
    }

    /* ------------------------------------------------------------
       Admin gate modal
       ------------------------------------------------------------ */
    function setupAdminGate() {
        const gate = document.getElementById("adminGate");
        if (!gate) { console.warn("[header.js] #adminGate not found"); return; }

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
            if (!value) { error.textContent = "Enter the admin password."; input.focus(); return; }

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

        if (!button || !menu) return;

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
                if (getRole() !== "admin") return;
                close();

                if (isAdminUnlocked()) {
                    window.location.href = ADMIN_URL;
                    return;
                }

                if (window.BDAdminGate) window.BDAdminGate.open();
            });
        }

        document.addEventListener("click", function (event) {
            if (!event.target.closest(".settings-wrapper")) close();
        });
    }

    function setupCaseDirectory() {
        const button  = document.getElementById("caseDirectoryBtn");
        const menu    = document.getElementById("caseDropdown");
        const wrapper = document.querySelector(".nav-dropdown-wrapper");

        if (!button || !menu || !wrapper) return;

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

    function setupNavigation() {
        const navItems = document.querySelectorAll(".brand-nav .nav-item");
        const currentPage = window.location.pathname.split("/").pop().toLowerCase();
        const caseDirectoryPages = ["legacy-case-directory.html", "shine-case-directory.html"];
        const caseDirectoryButton = document.getElementById("caseDirectoryBtn");

        navItems.forEach(function (nav) { nav.classList.remove("active"); });

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
                navItems.forEach(function (nav) { nav.classList.remove("active"); });
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

    function start() {
        setupTheme();
        setupAdminGate();
        setupSettings();
        setupCaseDirectory();
        setupNavigation();
    }

    start();
})();
