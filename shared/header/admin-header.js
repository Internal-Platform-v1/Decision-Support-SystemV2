/* ============================================================
   SHARED ADMIN HEADER
   ============================================================ */
(() => {
  "use strict";

  /* ----------------------------------------------------------
     Admin guard + password modal

     Layers:
       1) window.name token (per-tab, set by index login)
       2) localStorage live-user check (CROSS-TAB)
       3) sessionStorage password gate (per-tab)
       4) cross-tab signout watcher (storage + BroadcastChannel
          + polling fallback)

     Signing out anywhere (index tab, another admin tab, or
     storage.clear()) will now tear down every other open tab.
     ---------------------------------------------------------- */
  (function adminGuard() {
    const HOME_URL       = "/Decision-Support-SystemV2/index.html";
    const ADMIN_PASSWORD = "fedex-admin-2027"; // ← change me later
    const SESSION_HOURS  = 8;
    const MAX_ATTEMPTS   = 5;
    const GATE_KEY       = "bd_admin_gate_unlocked";
    const USER_KEYS      = ["bd_logged_in_user", "currentUser", "adminUser", "loggedInUser"];

    let signedOut = false;

    /* ---- Layer 1: index-level auth (window.name token) ---- */
    function isIndexUnlocked() {
      try {
        if (!window.name) return false;
        const s = JSON.parse(window.name);
        return Boolean(s && s.token && typeof s.exp === "number" && s.exp > Date.now());
      } catch (e) { return false; }
    }

    /* ---- Layer 2: live user must exist in localStorage ---- */
    function hasLiveUser() {
      try {
        return USER_KEYS.some(k => !!localStorage.getItem(k));
      } catch (_) { return false; }
    }

    function isGateUnlocked() {
      try {
        const raw = sessionStorage.getItem(GATE_KEY);
        if (!raw) return false;
        const s = JSON.parse(raw);
        return Boolean(s && typeof s.exp === "number" && s.exp > Date.now());
      } catch (e) { return false; }
    }

    function writeGate() {
      try {
        sessionStorage.setItem(GATE_KEY, JSON.stringify({
          token: "gate-" + Date.now() + "-" + Math.random().toString(36).slice(2),
          exp:   Date.now() + SESSION_HOURS * 60 * 60 * 1000
        }));
      } catch (e) {}
    }

    function clearGate() {
      try { sessionStorage.removeItem(GATE_KEY); } catch (e) {}
    }

    /* ---- Central sign-out used everywhere ---- */
    function performSignOut(opts) {
      if (signedOut) return;
      signedOut = true;

      const broadcast = !opts || opts.broadcast !== false;
      if (broadcast) {
        try { localStorage.setItem("bd_signout_broadcast", String(Date.now())); } catch (_) {}
        try {
          const bc = new BroadcastChannel("bdtools:auth");
          bc.postMessage({ type: "signout" });
          bc.close();
        } catch (_) {}
      }

      // Wipe every auth artifact
      try { window.name = ""; } catch (_) {}
      try { sessionStorage.removeItem(GATE_KEY); } catch (_) {}
      try {
        localStorage.removeItem("bd_role");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("bd_admin_unlocked");
        localStorage.removeItem("bd_logged_in_user");
        localStorage.removeItem("bd_display_name");
        localStorage.removeItem("bd_signout_broadcast");
      } catch (_) {}

      window.location.replace(HOME_URL);
    }

    /* ---- Cross-tab signout watcher ---- */
    function watchSignOut() {
      const AUTH_KEYS = ["bd_logged_in_user", "bd_role", "bd_display_name", "adminUser"];

      // 1) storage events (fire in OTHER tabs)
      window.addEventListener("storage", function (event) {
        // storage.clear() → key is null
        if (event.key === null) {
          if (!hasLiveUser()) performSignOut({ broadcast: false });
          return;
        }
        // Any auth key removed / blanked
        if (AUTH_KEYS.indexOf(event.key) !== -1 && !hasLiveUser()) {
          performSignOut({ broadcast: false });
          return;
        }
        // Explicit broadcast marker from a sibling tab
        if (event.key === "bd_signout_broadcast" && event.newValue) {
          performSignOut({ broadcast: false });
        }
      });

      // 2) BroadcastChannel — instant, works even if storage events are throttled
      try {
        const bc = new BroadcastChannel("bdtools:auth");
        bc.addEventListener("message", function (e) {
          if (e && e.data && e.data.type === "signout") {
            performSignOut({ broadcast: false });
          }
        });
      } catch (_) {}

      // 3) Polling fallback (every 4s) — catches any edge case
      setInterval(function () {
        if (!hasLiveUser()) performSignOut({ broadcast: false });
      }, 4000);
    }

    /* ---- Gate 1: token must exist in this tab ---- */
    if (!isIndexUnlocked()) {
      window.location.replace(HOME_URL);
      return;
    }

    /* ---- Gate 1.5: live user must still exist in localStorage ---- */
    if (!hasLiveUser()) {
      window.location.replace(HOME_URL);
      return;
    }

    /* ---- Install cross-tab watcher NOW, before showing the modal ---- */
    watchSignOut();

    /* ---- Public API for other pages + the Sign Out button ---- */
    window.AdminGuard = {
      isUnlocked:  isGateUnlocked,
      lock:        clearGate,
      unlock:      function () { writeGate(); },
      hasLiveUser: hasLiveUser,
      signOut:     performSignOut
    };

    /* ---- Gate 2: admin password modal ---- */
    if (isGateUnlocked()) return;

    document.documentElement.classList.add("admin-locked");
    let attempts = 0;

    function buildModal() {
      const wrap = document.createElement("div");
      wrap.className = "admin-auth-overlay";
      wrap.id = "adminAuthOverlay";
      wrap.setAttribute("role", "dialog");
      wrap.setAttribute("aria-modal", "true");
      wrap.setAttribute("aria-labelledby", "adminAuthTitle");
      wrap.innerHTML =
        '<div class="admin-auth-modal">' +
          '<div class="admin-auth-icon" aria-hidden="true">🔒</div>' +
          '<h2 id="adminAuthTitle">Admin Access</h2>' +
          '<p>Enter the admin password to unlock the admin console.</p>' +
          '<form novalidate>' +
            '<div class="admin-auth-field">' +
              '<label for="adminAuthPassword">Password</label>' +
              '<input type="password" id="adminAuthPassword" ' +
                     'autocomplete="current-password" autocapitalize="off" ' +
                     'spellcheck="false" placeholder="Enter admin password" />' +
            '</div>' +
            '<div class="admin-auth-error" role="alert" hidden></div>' +
            '<div class="admin-auth-actions">' +
              '<button type="button" class="admin-auth-cancel">Cancel</button>' +
              '<button type="submit" class="admin-auth-submit">Unlock</button>' +
            '</div>' +
          '</form>' +
        '</div>';
      return wrap;
    }

    function initModal() {
      if (document.getElementById("adminAuthOverlay")) return;

      const overlay   = buildModal();
      document.body.appendChild(overlay);

      const input     = overlay.querySelector("#adminAuthPassword");
      const form      = overlay.querySelector("form");
      const errorEl   = overlay.querySelector(".admin-auth-error");
      const cancelBtn = overlay.querySelector(".admin-auth-cancel");

      setTimeout(function () { try { input.focus(); } catch (e) {} }, 60);

      function showError(message) {
        errorEl.textContent = message;
        errorEl.hidden = false;
      }
      function hideError() {
        errorEl.textContent = "";
        errorEl.hidden = true;
      }

      input.addEventListener("input", hideError);

      form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!hasLiveUser()) {
          performSignOut({ broadcast: false });
          return;
        }

        if (input.value === ADMIN_PASSWORD) {
          writeGate();
          document.documentElement.classList.remove("admin-locked");
          overlay.remove();
          document.dispatchEvent(new CustomEvent("adminUnlocked"));
          return;
        }

        attempts += 1;
        input.value = "";
        input.focus();

        if (attempts >= MAX_ATTEMPTS) {
          showError("Too many attempts. Redirecting to home…");
          setTimeout(function () { performSignOut({ broadcast: false }); }, 1000);
          return;
        }

        const left = MAX_ATTEMPTS - attempts;
        showError("Incorrect password. " + left + " attempt" + (left === 1 ? "" : "s") + " left.");
      });

      cancelBtn.addEventListener("click", function () {
        performSignOut();
      });

      overlay.addEventListener("keydown", function (event) {
        if (event.key !== "Tab") return;
        const focusables = overlay.querySelectorAll("input, button");
        if (!focusables.length) return;
        const first = focusables[0];
        const last  = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initModal);
    } else {
      initModal();
    }
  })();

  const CONFIG = {
    htmlPath: "../../shared/header/admin-header.html",
    timeZone: "Asia/Manila",
    homeUrl: "/Decision-Support-SystemV2/index.html"
    // NOTE: defaultUser intentionally removed — no silent fallback
  };

  const pageMap = {
    dashboard: "../admin-dashboard/admin-dashboard.html",
    users: "../admin-user-management/admin-user-management.html",
    feedback: "../admin-feedback-gethelp/admin-feedback-gethelp.html",
    templates: "../admin-templates/admin-templates.html",
    guides: "../admin-guides/admin-guides.html",
    announcements: "../admin-announcements/admin-announcements.html",
    logs: "../admin-logs/admin-logs.html",
    reports: "../admin-reports/admin-reports.html",
    roles: "../admin-roles/admin-roles.html",
    settings: "../admin-settings/admin-settings.html"
  };

  function getInitials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "AD";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts.at(-1)[0]).toUpperCase();
  }

  /* Returns null if there is no real user — never falls back to "Admin User" */
  function getCurrentUser() {
    const keys = ["bd_logged_in_user", "currentUser", "adminUser", "loggedInUser"];
    for (const key of keys) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const user = JSON.parse(raw);
        if (!user || typeof user !== "object") continue;

        const composed = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
        const name = user.name || user.displayName || user.employeeName ||
                     user.fullName || composed;

        // Reject empty placeholder objects
        if (!name && !user.empId && !user.employeeId && !user.email) continue;

        return {
          name: name || "Administrator",
          role: user.role || user.userRole || "System Administrator",
          email: user.email || user.userEmail || "",
          empId: user.empId || user.employeeId || user.emp_id || ""
        };
      } catch (_) {}
    }
    return null;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function applyUser() {
    const user = getCurrentUser();

    if (!user) {
      if (window.AdminGuard && typeof window.AdminGuard.signOut === "function") {
        window.AdminGuard.signOut({ broadcast: false });
      } else {
        window.location.replace(CONFIG.homeUrl);
      }
      return;
    }

    const initials = getInitials(user.name);

    setText("sidebarUserName", user.name);
    setText("sidebarUserRole", user.role);
    setText("sidebarAvatar", initials);
    setText("topUserAvatar", initials);

    setText("adminSettingsUserName", user.name);
    setText("adminSettingsUserAvatar", initials);
    setText(
      "adminSettingsUserEmpId",
      user.empId ? `EMP ${user.empId}` : (user.email || user.role || "Administrator")
    );
  }

  function getPageKey() {
    if (document.body.dataset.adminPage) return document.body.dataset.adminPage.toLowerCase();
    const file = location.pathname.split("/").pop().toLowerCase();
    if (file === "admin-dashboard.html") return "dashboard";
    for (const [key, target] of Object.entries(pageMap)) {
      if (target.toLowerCase().endsWith(file)) return key;
    }
    return "dashboard";
  }

  function setActiveNavigation() {
    const key = getPageKey();
    document.querySelectorAll(".admin-nav-item").forEach(item => {
      item.classList.toggle("active", item.dataset.adminPage === key);
    });
    const title = document.body.dataset.adminTitle || "Decision Support System";
    const description = document.body.dataset.adminDescription || "Admin Console";
    setText("adminPageTitle", title);
    setText("adminPageDescription", description);
  }

  function updateClock() {
    const now = new Date();
    const date = new Intl.DateTimeFormat("en-US", {
      timeZone: CONFIG.timeZone, weekday: "short", month: "short", day: "numeric", year: "numeric"
    }).format(now);
    const time = new Intl.DateTimeFormat("en-US", {
      timeZone: CONFIG.timeZone, hour: "numeric", minute: "2-digit", hour12: true
    }).format(now);
    setText("adminCurrentDate", date);
    setText("adminCurrentTime", `${time} (PHT)`);
  }

  function navigate(page) {
    if (pageMap[page]) location.href = pageMap[page];
  }

  function setupNavigation() {
    document.querySelectorAll(".admin-nav-item").forEach(item => {
      item.addEventListener("click", () => navigate(item.dataset.adminPage));
    });
  }

  function setupSettingsDropdown() {
    const btn = document.getElementById("adminSettingsBtn");
    const dropdown = document.getElementById("adminSettingsDropdown");
    if (!btn || !dropdown) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = !dropdown.hidden;
      dropdown.hidden = isOpen;
      btn.setAttribute("aria-expanded", String(!isOpen));
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.hidden && !dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.hidden = true;
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  function setupTheme() {
    const apply = (theme) => {
      document.documentElement.setAttribute("data-theme", theme);
      document.querySelectorAll(".admin-theme-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.themeChoice === theme);
      });
    };
    let storedTheme = localStorage.getItem("bd_theme") || "light";
    apply(storedTheme);

    document.querySelectorAll(".admin-theme-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const theme = btn.dataset.themeChoice;
        localStorage.setItem("bd_theme", theme);
        apply(theme);
      });
    });
  }

  function setupActions() {
    const returnHome = document.getElementById("adminReturnHomeBtn");
    if (returnHome) {
      returnHome.addEventListener("click", () => {
        window.location.href = CONFIG.homeUrl;
      });
    }

    document.querySelectorAll("[data-admin-action]").forEach(button => {
      button.addEventListener("click", () => {
        const action = button.dataset.adminAction;

        if (action === "logout") {
          if (window.AdminGuard && typeof window.AdminGuard.signOut === "function") {
            window.AdminGuard.signOut();
          } else {
            window.location.href = CONFIG.homeUrl;
          }
        }

        if (action === "settings") navigate("settings");

        if (action === "profile" && typeof window.openAdminProfile === "function") {
          window.openAdminProfile();
        }
      });
    });
  }

  async function load() {
    const mount = document.getElementById("adminHeader");
    if (!mount) return;

    if (window.AdminGuard && !window.AdminGuard.hasLiveUser()) {
      window.AdminGuard.signOut({ broadcast: false });
      return;
    }

    try {
      const response = await fetch(CONFIG.htmlPath, { cache: "no-cache" });
      if (!response.ok) throw new Error("Header failed to load");
      mount.innerHTML = await response.text();

      applyUser();
      setActiveNavigation();
      updateClock();
      setupNavigation();
      setupSettingsDropdown();
      setupTheme();
      setupActions();

      setInterval(updateClock, 1000);
      window.dispatchEvent(new CustomEvent("adminHeaderReady"));
    } catch (error) {
      console.error("Shared Admin Header failed:", error);
    }
  }

  window.AdminHeader = { navigate, refreshUser: applyUser, refreshClock: updateClock };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();
