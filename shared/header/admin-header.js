/* ============================================================
   SHARED ADMIN HEADER
   ============================================================ */
(() => {
  "use strict";

  /* ----------------------------------------------------------
     Admin guard + password modal
     The console stays locked behind a modal until the correct
     password is entered. Unlock state is stored in window.name
     so it survives navigation between admin pages in the same tab.
     Change ADMIN_PASSWORD below to update the gate.
     ---------------------------------------------------------- */
  (function adminGuard() {
    const HOME_URL       = "/Decision-Support-SystemV2/index.html";
    const ADMIN_PASSWORD = "fedex-admin-2027"; // ← change me later
    const SESSION_HOURS  = 8;
    const MAX_ATTEMPTS   = 5;

    function readSession() {
      try {
        if (!window.name) return null;
        const s = JSON.parse(window.name);
        if (!s || typeof s !== "object") return null;
        if (!s.token || typeof s.exp !== "number") return null;
        if (s.exp <= Date.now()) return null;
        return s;
      } catch (e) { return null; }
    }

    function isUnlocked() { return Boolean(readSession()); }

    function writeSession() {
      try {
        window.name = JSON.stringify({
          token: "admin-" + Date.now() + "-" + Math.random().toString(36).slice(2),
          exp:   Date.now() + SESSION_HOURS * 60 * 60 * 1000
        });
      } catch (e) {}
    }

    function clearSession() {
      try { window.name = ""; } catch (e) {}
    }

    function goHome() { window.location.replace(HOME_URL); }

    /* Already unlocked for this tab? Let the page through. */
    if (isUnlocked()) return;

    /* Hide page content while the modal is up (avoids flash of
       dashboard behind the backdrop). */
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

    function init() {
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

        if (input.value === ADMIN_PASSWORD) {
          writeSession();
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
          setTimeout(goHome, 1000);
          return;
        }

        const left = MAX_ATTEMPTS - attempts;
        showError(
          "Incorrect password. " + left +
          " attempt" + (left === 1 ? "" : "s") + " left."
        );
      });

      cancelBtn.addEventListener("click", function () {
        clearSession();
        goHome();
      });

      /* Keep keyboard focus inside the modal */
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

    /* Small public API for debugging / other pages */
    window.AdminGuard = {
      isUnlocked: isUnlocked,
      lock:       clearSession,
      unlock:     function () { writeSession(); }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();

  const CONFIG = {
    htmlPath: "../../shared/header/admin-header.html",
    timeZone: "Asia/Manila",
    homeUrl: "/Decision-Support-SystemV2/index.html",
    defaultUser: { name: "Admin User", role: "System Administrator", email: "admin@example.com", empId: "" }
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

  function getCurrentUser() {
    const keys = ["bd_logged_in_user", "currentUser", "adminUser", "user", "loggedInUser"];
    for (const key of keys) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const user = JSON.parse(raw);
        if (!user || typeof user !== "object") continue;

        const composed = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

        return {
          name: user.name || user.displayName || user.employeeName || user.fullName || composed || CONFIG.defaultUser.name,
          role: user.role || user.userRole || CONFIG.defaultUser.role,
          email: user.email || user.userEmail || CONFIG.defaultUser.email,
          empId: user.empId || user.employeeId || user.emp_id || ""
        };
      } catch (_) {}
    }
    return { ...CONFIG.defaultUser };
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function applyUser() {
    const user = getCurrentUser();
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
          try { window.name = ""; } catch (e) {}
          try {
            localStorage.removeItem("bd_role");
            localStorage.removeItem("adminUser");
            localStorage.removeItem("bd_admin_unlocked");
            localStorage.removeItem("bd_logged_in_user");
            localStorage.removeItem("bd_display_name");
          } catch (e) {}
          window.location.href = CONFIG.homeUrl;
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
