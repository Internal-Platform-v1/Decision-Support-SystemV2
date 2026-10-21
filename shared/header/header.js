/* ============================================================
   shared/header.js
   ============================================================ */
(function () {
    "use strict";

    const ROLE_KEY  = "bd_role";
    const THEME_KEY = "bd_theme";
    const ADMIN_URL = "/Decision-Support-SystemV2/admin-console/admin-dashboard/admin-dashboard.html";

    const ADMIN_PASSWORD = "fedex-admin-2026";
    const ADMIN_UNLOCK_KEY = "bd_admin_unlocked";
    const ADMIN_UNLOCK_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

    /* ------------------------------------------------------------
       Admin Unlock Helpers
       ------------------------------------------------------------ */
    function isAdminUnlocked() {
        try {
            const raw = localStorage.getItem(ADMIN_UNLOCK_KEY);
            if (!raw) return false;
            const obj = JSON.parse(raw);
            return Boolean(obj && typeof obj.exp === "number" && obj.exp > Date.now());
        } catch (e) { return false; }
    }

    function setAdminUnlocked() {
        try {
            localStorage.setItem(ADMIN_UNLOCK_KEY, JSON.stringify({ exp: Date.now() + ADMIN_UNLOCK_TTL }));
            localStorage.setItem(ROLE_KEY, "admin"); // Force admin role on unlock
        } catch (e) {}
    }

    /* ------------------------------------------------------------
       Role state
       ------------------------------------------------------------ */
    function getRole() {
        try {
            const r = localStorage.getItem(ROLE_KEY);
            // If the unlock token is valid, always report admin
            if (isAdminUnlocked()) return "admin";
            return r === "admin" ? "admin" : "user";
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

        // DO NOT clear the unlock token here anymore.
        // The token is only cleared on logout.

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
            if (!value) { error.textContent = "Enter the admin password."; input.focus(); return; }

            if (value === ADMIN_PASSWORD) {
                setAdminUnlocked();
                close();
                window.location.replace(ADMIN_URL);
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
                // If already unlocked, go straight in. No modal.
                if (isAdminUnlocked()) {
                    window.location.replace(ADMIN_URL);
                    return;
                }
                if (window.BDAdminGate) window.BDAdminGate.open();
            });
        }

        document.addEventListener("click", function (event) {
            if (!event.target.closest(".settings-wrapper")) close();
        });
    }

    function start() {
        setupTheme();
        setupAdminGate();
        setupSettings();
    }

    start();
})();
