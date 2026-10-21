/* ============================================================
   SHARED ADMIN HEADER
   ============================================================ */
(() => {
  "use strict";

  // IMMEDIATE HARD REDIRECT IF NOT UNLOCKED
  (function checkAuth() {
    try {
      const raw = localStorage.getItem("bd_admin_unlocked");
      const obj = raw ? JSON.parse(raw) : null;
      if (!obj || typeof obj.exp !== "number" || obj.exp <= Date.now()) {
        window.location.replace("/Decision-Support-SystemV2/index.html");
      }
    } catch (e) {
      window.location.replace("/Decision-Support-SystemV2/index.html");
    }
  })();

  const CONFIG = {
    htmlPath: "../../shared/header/admin-header.html",
    timeZone: "Asia/Manila",
    defaultUser: { name: "Admin User", role: "System Administrator", email: "admin@example.com" }
  };

  const pageMap = {
    dashboard: "../admin-dashboard/admin-dashboard.html",
    users: "../admin-users/admin-users.html",
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
    const firstName = String(user.name || "Admin").trim().split(/\s+/)[0] || "Admin";
    setText("sidebarUserName", user.name);
    setText("sidebarUserRole", user.role);
    setText("sidebarAvatar", initials);
    setText("topUserAvatar", initials);
    setText("dropdownUserName", user.name);
    setText("dropdownUserEmail", user.email);
    setText("adminHeroName", firstName);
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

  function applyHeroVisibility() {
    const key = getPageKey();
    if (key === "dashboard") return;
    const hero = document.getElementById("adminHero");
    if (hero && hero.parentNode) hero.parentNode.removeChild(hero);
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
    document.querySelectorAll("[data-admin-shortcut]").forEach(button => {
      button.addEventListener("click", () => navigate(button.dataset.adminShortcut));
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
          localStorage.removeItem("bd_admin_unlocked");
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
          localStorage.removeItem("bd_admin_unlocked");
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

  function setupSearch() {
    const input = document.getElementById("adminGlobalSearch");
    if (!input) return;
    input.addEventListener("keydown", event => {
      if (event.key !== "Enter") return;
      const query = input.value.trim();
      if (!query) return;
      window.dispatchEvent(new CustomEvent("adminGlobalSearch", { detail: { query } }));
    });
  }

  async function load() {
    const mount = document.getElementById("adminHeader");
    if (!mount) return;

    try {
      const response = await fetch(CONFIG.htmlPath, { cache: "no-cache" });
      if (!response.ok) throw new Error("Header failed to load");
      mount.innerHTML = await response.text();

      applyHeroVisibility();
      applyUser();
      setActiveNavigation();
      updateClock();
      setupNavigation();
      setupSettingsDropdown();
      setupTheme();
      setupRole();
      setupActions();
      setupSearch();

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
