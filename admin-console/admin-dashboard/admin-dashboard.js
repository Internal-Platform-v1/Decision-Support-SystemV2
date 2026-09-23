/* ============================================================
   ADMIN DASHBOARD
   Location: admin-console/admin-dashboard/admin-dashboard.js
   ============================================================ */

(() => {
  "use strict";

  const pageMap = {
    users: "../../admin-console/admin-users/admin-users.html",
    templates: "../../admin-console/admin-templates/admin-templates.html",
    guides: "../../admin-console/admin-guides/admin-guides.html",
    reports: "../../admin-console/admin-reports/admin-reports.html",
    logs: "../../admin-console/admin-logs/admin-logs.html"
  };

  function navigate(page) {
    if (pageMap[page]) {
      window.location.href = pageMap[page];
    }
  }

  function setupQuickNavigation() {
    document.querySelectorAll("[data-dashboard-nav]").forEach(button => {
      button.addEventListener("click", () => {
        navigate(button.dataset.dashboardNav);
      });
    });
  }

  /*
    These functions are deliberately simple placeholders.
    Later we can connect them to your existing Firestore collections
    without changing the shared admin header.
  */
  function setStat(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function loadDashboardStats() {
    /*
      Initial state:
      The dashboard does not invent database numbers.
      Replace these with Firestore counts when we connect the data.
    */
    setStat("dashboardTotalUsers", "—");
    setStat("dashboardTotalTemplates", "—");
    setStat("dashboardTotalGuides", "—");
    setStat("dashboardActivityCount", "—");
  }

  function renderRecentActivity(items = []) {
    const container = document.getElementById("dashboardRecentActivity");
    if (!container) return;

    if (!items.length) {
      container.innerHTML = `
        <div class="dashboard-empty-state">
          <span>No recent activity loaded yet.</span>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="dashboard-activity-item">
        <span class="dashboard-activity-dot"></span>
        <div>
          <strong>${escapeHtml(item.title || "System activity")}</strong>
          <span>${escapeHtml(item.detail || "")}</span>
        </div>
      </div>
    `).join("");
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupQuickNavigation();
    loadDashboardStats();
    renderRecentActivity([]);
  });
})();