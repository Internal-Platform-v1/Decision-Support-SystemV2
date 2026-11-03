/* ============================================================
   SHARED ADMIN HEADER
   ============================================================ */
(() => {
  "use strict";

  /* Guard reads from window.name */
  (function adminGuard() {
    const HOME_URL = "/Decision-Support-SystemV2/index.html";

    function isUnlocked() {
      try {
        if (!window.name) return false;
        const s = JSON.parse(window.name);
        return Boolean(s.token && typeof s.exp === "number" && s.exp > Date.now());
      } catch (e) { return false; }
    }

    if (!isUnlocked()) {
      window.location.replace(HOME_URL);
      return;
    }
  })();

  const CONFIG = {
    htmlPath: "../../shared/header/admin-header.html",
    timeZone: "Asia/Manila",
    defaultUser: { name: "Admin User", role: "System Administrator", email: "admin@example.com" }
  };

  const pageMap = {
    dashboard: "../admin-dashboard/admin-dashboard.html",
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
    const keys = ["currentUser", "adminUser", "user", "loggedInUser"];
    for (const key of keys) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const user = JSON.parse(raw);
        if (!user || typeof user !== "object") continue;
        return {
          name: user.name || user.displayName || user.employeeName || user.fullName || CONFIG.defaultUser.name,
          role: user.role || user.userRole || CONFIG.defaultUser.role,
          email: user.email || user.userEmail || CONFIG.defaultUser.email
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
    setText("dropdownUserName", user.name);
    setText("dropdownUserEmail", user.email);
    /* ❌ removed: setText("adminHeroName", firstName); — hero no longer exists */
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
    setText("adminPageTitle", title);
  }

  /* ❌ removed: applyHeroVisibility() — hero no longer exists anywhere */

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
    /* ❌ removed: [data-admin-shortcut] handler — hero shortcuts gone */
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

  function setupRole() {
    const apply = (role) => {
      document.querySelectorAll(".admin-role-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.role === role);
      });
      localStorage.setItem("bd_role", role);
    };
    let storedRole = localStorage.getItem("bd_role") || "admin";
    apply(storedRole);

    document.querySelectorAll(".admin-role-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const role = btn.dataset.role;
        apply(role);
        if (role === "user") {
          try { window.name = ""; } catch (e) {}
          window.location.href = "/Decision-Support-SystemV2/index.html";
        }
      });
    });
  }

  function setupActions() {
    document.querySelectorAll("[data-admin-action]").forEach(button => {
      button.addEventListener("click", () => {
        const action = button.dataset.adminAction;

        if (action === "logout") {
          try { window.name = ""; } catch (e) {}
          localStorage.removeItem("bd_role");
          window.location.href = "/Decision-Support-SystemV2/index.html";
        }

        if (action === "settings") navigate("settings");

        if (action === "profile" && typeof window.openAdminProfile === "function") {
          window.openAdminProfile();
        }
      });
    });
  }

  /* ❌ removed: setupSearch() — search box no longer exists in the header */

  async function load() {
    const mount = document.getElementById("adminHeader");
    if (!mount) return;

    try {
      const response = await fetch(CONFIG.htmlPath, { cache: "no-cache" });
      if (!response.ok) throw new Error("Header failed to load");
      mount.innerHTML = await response.text();

      /* ❌ removed: applyHeroVisibility(); */
      applyUser();
      setActiveNavigation();
      updateClock();
      setupNavigation();
      setupSettingsDropdown();
      setupTheme();
      setupRole();
      setupActions();
      /* ❌ removed: setupSearch(); */

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
