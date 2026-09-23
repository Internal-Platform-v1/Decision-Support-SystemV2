/* ============================================================
   ADMIN DASHBOARD
   Dashboard-only behavior.
   ============================================================ */

(() => {
  "use strict";

  const pageMap = {
    dashboard: "admin-dashboard.html",
    users: "../admin-users/admin-users.html",
    templates: "../admin-templates/admin-templates.html",
    guides: "../admin-guides/admin-guides.html",
    announcements: "../admin-announcements/admin-announcements.html",
    logs: "../admin-logs/admin-logs.html",
    reports: "../admin-reports/admin-reports.html",
    roles: "../admin-roles/admin-roles.html",
    settings: "../admin-settings/admin-settings.html"
  };

  function navigate(page) {
    const target = pageMap[page];
    if (target) window.location.href = target;
  }

  function setupNavigation() {
    document.querySelectorAll("[data-dashboard-nav]").forEach(button => {
      button.addEventListener("click", () => {
        navigate(button.dataset.dashboardNav);
      });
    });
  }

  /*
   * These values currently mirror the supplied dashboard reference.
   * We will replace them with Firestore-driven values when the
   * dashboard data layer is connected.
   */
  function setupRegionFilter() {
    const select = document.getElementById("regionFilter");
    if (!select) return;

    select.addEventListener("change", () => {
      window.dispatchEvent(new CustomEvent("adminRegionChanged", {
        detail: { region: select.value }
      }));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupRegionFilter();
  });
})();