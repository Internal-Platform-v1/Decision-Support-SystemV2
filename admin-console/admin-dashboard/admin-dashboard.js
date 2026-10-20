/* ============================================================
   ADMIN DASHBOARD
   Dashboard-only behavior — data wiring.
   ============================================================ */

(() => {
  "use strict";

  /* ------------------------------------------------------------
     CONFIG
     ------------------------------------------------------------ */
  const CONFIG = {
    usersCollection: "approved_users",
    announcementsCollection: "announcements",
    guideStatsCollection: "guide_stats",
    activityKey: "dss_admin_activity",
    timeZone: "Asia/Manila",
    activityWindowDays: 7
  };

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

  /* ------------------------------------------------------------
     STATE
     ------------------------------------------------------------ */
  const state = {
    users: [],
    announcements: [],
    guideUsage: {},          // { guideId: count }
    activity: [],            // [{ type, action, details, user, time }]
    region: "All Regions",
    firebaseReady: false
  };

  /* ------------------------------------------------------------
     SAFE FIREBASE ACCESS
     ------------------------------------------------------------ */
  function fb() {
    return (typeof window.firebase !== "undefined" && window.firebase) || null;
  }
  function firestore() {
    const f = fb();
    if (!f || !f.firestore) return null;
    try { return window.db || f.firestore(); } catch (_) { return null; }
  }
  function fireauth() {
    const f = fb();
    if (!f || !f.auth) return null;
    try { return window.auth || f.auth(); } catch (_) { return null; }
  }

  /* ------------------------------------------------------------
     HELPERS
     ------------------------------------------------------------ */
  const $ = id => document.getElementById(id);

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  function initials(name, email) {
    const n = String(name || "").trim();
    if (!n) return String(email || "AD").slice(0, 2).toUpperCase();
    const parts = n.split(/\s+/);
    return (parts.length > 1
      ? parts[0][0] + parts[parts.length - 1][0]
      : parts[0].slice(0, 2)).toUpperCase();
  }

  function toDate(value) {
    if (!value) return null;
    if (typeof value.toDate === "function") return value.toDate();
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function formatDate(value) {
    const d = toDate(value);
    if (!d) return "—";
    return d.toLocaleDateString("en-US", {
      timeZone: CONFIG.timeZone,
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  function formatShortDay(date) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function relativeTime(value) {
    const d = toDate(value);
    if (!d) return "—";
    const minutes = Math.floor(Math.max(0, Date.now() - d.getTime()) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    return days === 1 ? "Yesterday" : `${days} days ago`;
  }

  /* ------------------------------------------------------------
     NAVIGATION
     ------------------------------------------------------------ */
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

  /* ------------------------------------------------------------
     REGION FILTER
     ------------------------------------------------------------ */
  function setupRegionFilter() {
    const select = $("regionFilter");
    if (!select) return;

    select.addEventListener("change", () => {
      state.region = select.value || "All Regions";
      window.dispatchEvent(new CustomEvent("adminRegionChanged", {
        detail: { region: state.region }
      }));
      renderRegionCard();
    });
  }

  function populateRegionFilter() {
    const select = $("regionFilter");
    if (!select) return;

    const regions = Array.from(
      new Set(
        state.users
          .map(u => String(u.region || "").trim())
          .filter(Boolean)
      )
    ).sort();

    const options = ["All Regions", ...regions];
    select.innerHTML = options
      .map(r => `<option${r === state.region ? " selected" : ""}>${esc(r)}</option>`)
      .join("");

    // Preserve current selection if still valid, else fall back to All Regions.
    if (!options.includes(state.region)) state.region = "All Regions";
    select.value = state.region;
  }

  /* ------------------------------------------------------------
     DATA LOADING
     ------------------------------------------------------------ */
  function loadLocalActivity() {
    try {
      const raw = localStorage.getItem(CONFIG.activityKey);
      const parsed = raw ? JSON.parse(raw) : [];
      state.activity = Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      state.activity = [];
    }
  }

  async function loadUsers() {
    const db = firestore();
    if (!db) return false;

    const auth = fireauth();
    if (auth && !auth.currentUser) {
      // Wait briefly for auth to settle — the shared header relies on it too.
      await new Promise(resolve => {
        let settled = false;
        const finish = () => { if (!settled) { settled = true; resolve(); } };
        const unsub = auth.onAuthStateChanged(() => { try { unsub(); } catch (_) {} finish(); });
        setTimeout(() => { try { unsub(); } catch (_) {} finish(); }, 3000);
      });
    }

    try {
      const snapshot = await db.collection(CONFIG.usersCollection).get();
      state.users = snapshot.docs.map(doc => {
        const data = doc.data() || {};
        return {
          id: doc.id,
          name: data.name || data.displayName || doc.id,
          email: data.email || doc.id,
          role: String(data.role || "User").trim(),
          region: String(data.region || data.country || "All regions").trim(),
          active: data.active !== false,
          createdAt: data.createdAt || data.updatedAt || null
        };
      });
      return true;
    } catch (err) {
      console.info("Dashboard: approved_users unavailable —", err.code || err.message);
      return false;
    }
  }

  async function loadAnnouncements() {
    const db = firestore();
    if (!db) return false;

    try {
      const snapshot = await db.collection(CONFIG.announcementsCollection).get();
      state.announcements = snapshot.docs.map(doc => {
        const data = doc.data() || {};
        return {
          id: doc.id,
          title: data.title || "",
          createdAt: data.createdAt || data.date || null,
          published: data.published !== false
        };
      });
      return true;
    } catch (err) {
      console.info("Dashboard: announcements unavailable —", err.code || err.message);
      return false;
    }
  }

  async function loadGuideStats() {
    const db = firestore();
    if (!db) return false;

    try {
      const snapshot = await db.collection(CONFIG.guideStatsCollection).get();
      const next = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data() || {};
        const id = data.guideId || doc.id;
        const count = Number(data.usageCount ?? data.count ?? 0);
        if (id) next[id] = (next[id] || 0) + (Number.isFinite(count) ? count : 0);
      });
      state.guideUsage = next;
      return true;
    } catch (err) {
      console.info("Dashboard: guide_stats unavailable —", err.code || err.message);
      return false;
    }
  }

  /* ------------------------------------------------------------
     RENDERING — KPI CARDS
     ------------------------------------------------------------ */
  function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value;
  }

  function renderKPIs() {
    if (!state.users.length && !state.announcements.length) return;

    const totalUsers = state.users.length;
    const activeUsers = state.users.filter(u => u.active !== false).length;
    const totalAnnouncements = state.announcements.filter(a => a.published).length;

    // Guides come from the shared header registry (already loaded on the page
    // before this script runs, per admin-dashboard.html).
    const guides = Array.isArray(window.GUIDE_REGISTRY) ? window.GUIDE_REGISTRY : [];
    const totalGuides = guides.length;

    // Templates count: sum guide-specific template usage where available.
    const totalTemplates = Object.values(state.guideUsage).reduce((a, b) => a + b, 0);

    setText("totalUsers", totalUsers);
    setText("activeUsers", activeUsers);
    setText("totalGuides", totalGuides);
    setText("totalAnnouncements", totalAnnouncements);
    if (totalTemplates > 0) setText("totalTemplates", totalTemplates);
  }

  /* ------------------------------------------------------------
     RENDERING — USER ACTIVITY CHART
     ------------------------------------------------------------ */
  function renderActivityChart() {
    const container = document.querySelector(".bar-groups");
    if (!container) return;

    const days = [];
    const now = new Date();
    for (let i = CONFIG.activityWindowDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      days.push(d);
    }

    // Logins per day from local activity log.
    const loginsPerDay = days.map(d => state.activity.filter(entry => {
      const entryDate = toDate(entry.time);
      if (!entryDate) return false;
      if (entry.type !== "login") return false;
      return entryDate.toDateString() === d.toDateString();
    }).length);

    // Active users per day: users whose createdAt/updatedAt lands on that day.
    const activePerDay = days.map(d => {
      return state.users.filter(u => {
        if (u.active === false) return false;
        const src = toDate(u.createdAt);
        if (!src) return false;
        return src.toDateString() === d.toDateString();
      }).length;
    });

    const maxValue = Math.max(1, ...loginsPerDay, ...activePerDay);

    container.innerHTML = days.map((d, i) => {
      const loginHeight = Math.round((loginsPerDay[i] / maxValue) * 100);
      const activeHeight = Math.round((activePerDay[i] / maxValue) * 100);
      return `
        <div class="bar-group">
          <div class="bars">
            <b style="height:${Math.max(loginHeight, 2)}%"></b>
            <b class="soft" style="height:${Math.max(activeHeight, 2)}%"></b>
          </div>
          <span>${esc(formatShortDay(d))}</span>
        </div>
      `;
    }).join("");

    // Update y-axis max label to reflect real scale.
    const yAxis = document.querySelector(".chart-y-axis span");
    if (yAxis) yAxis.textContent = String(maxValue);
  }

  /* ------------------------------------------------------------
     RENDERING — GUIDE USAGE
     ------------------------------------------------------------ */
  function renderGuideUsage() {
    const container = document.querySelector(".guide-usage-list");
    if (!container) return;

    const registry = Array.isArray(window.GUIDE_REGISTRY) ? window.GUIDE_REGISTRY : [];
    if (!registry.length) return;

    const rows = registry
      .map(g => ({ guide: g, count: Number(state.guideUsage[g.id] || 0) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // If we have no real stats at all, leave the HTML's static demo list intact.
    const hasAnyStats = rows.some(r => r.count > 0);
    if (!hasAnyStats) return;

    const max = Math.max(...rows.map(r => r.count), 1);
    const rankClasses = ["purple", "lavender", "purple", "orange", "purple"];

    container.innerHTML = rows.map((row, i) => {
      const width = Math.max(4, Math.round((row.count / max) * 100));
      return `
        <div class="guide-row">
          <span class="rank ${rankClasses[i] || "purple"}">${i + 1}</span>
          <strong title="${esc(row.guide.title)}">${esc(row.guide.title)}</strong>
          <div class="guide-bar"><i style="width:${width}%"></i></div>
          <b>${row.count}</b>
        </div>
      `;
    }).join("");
  }

  /* ------------------------------------------------------------
     RENDERING — REGION CARD (donut + legend)
     ------------------------------------------------------------ */
  function renderRegionCard() {
    const donut = document.querySelector(".donut-chart");
    const center = document.querySelector(".donut-center strong");
    const legend = document.querySelector(".region-legend");
    if (!donut || !center || !legend) return;

    // Aggregate users by region.
    const counts = {};
    state.users.forEach(u => {
      const region = String(u.region || "Other").trim() || "Other";
      counts[region] = (counts[region] || 0) + 1;
    });

    const entries = Object.entries(counts)
      .sort((a, b) => b[1] - a[1]);

    // If a specific region is selected, filter the donut to that one region.
    const filtered = state.region === "All Regions"
      ? entries
      : entries.filter(([region]) => region === state.region);

    const totalFiltered = filtered.reduce((a, [, count]) => a + count, 0);

    if (!totalFiltered) {
      // Nothing to show — keep existing static content untouched.
      return;
    }

    // Build conic-gradient stops.
    const palette = ["#6640d4", "#aa93ed", "#d4c8f6", "#8ed5b0", "#ffb470", "#7fb3ff"];
    const stops = [];
    let acc = 0;
    filtered.forEach(([, count], i) => {
      const start = acc;
      const span = (count / totalFiltered) * 100;
      acc += span;
      stops.push(`${palette[i % palette.length]} ${start}% ${acc}%`);
    });

    donut.style.background = `conic-gradient(${stops.join(", ")})`;
    center.textContent = String(totalFiltered);

    // Legend.
    legend.innerHTML = filtered.slice(0, 4).map(([region, count], i) => {
      const pct = Math.round((count / totalFiltered) * 100);
      return `
        <div>
          <i class="region-dot" style="background:${palette[i % palette.length]}"></i>
          <span>${esc(region)}</span>
          <b>${count}</b>
          <small>${pct}%</small>
        </div>
      `;
    }).join("");
  }

  /* ------------------------------------------------------------
     RENDERING — RECENT USERS TABLE
     ------------------------------------------------------------ */
  function renderRecentUsers() {
    const body = $("recentUsersBody");
    if (!body || !state.users.length) return;

    const rows = state.users
      .slice()
      .sort((a, b) => {
        const at = toDate(a.createdAt);
        const bt = toDate(b.createdAt);
        if (at && bt) return bt - at;
        return 0;
      })
      .slice(0, 5);

    body.innerHTML = rows.map(u => {
      const initial = initials(u.name, u.email);
      const roleClass = "role-pill";
      const statusClass = u.active === false ? "status-pill inactive" : "status-pill active";
      const statusLabel = u.active === false ? "Inactive" : "Active";
      return `
        <tr>
          <td><span class="table-person"><i>${esc(initial)}</i>${esc(u.name)}</span></td>
          <td>${esc(u.email)}</td>
          <td><span class="${roleClass}">${esc(u.role)}</span></td>
          <td>${esc(u.region)}</td>
          <td><span class="${statusClass}">${esc(statusLabel)}</span></td>
          <td>${esc(formatDate(u.createdAt))}</td>
        </tr>
      `;
    }).join("");
  }

  /* ------------------------------------------------------------
     RENDERING — RECENT ACTIVITY TABLE
     ------------------------------------------------------------ */
  function renderRecentActivity() {
    const body = $("recentActivityBody");
    if (!body || !state.activity.length) return;

    const rows = state.activity.slice(0, 5);

    const typeMap = {
      login:    { cls: "login",    glyph: "↪", label: "User Login" },
      template: { cls: "template", glyph: "▣", label: "Template Updated" },
      user:     { cls: "user",     glyph: "●", label: "New User Added" },
      guide:    { cls: "guide",    glyph: "▣", label: "Guide Published" },
      announce: { cls: "announce", glyph: "⚑", label: "Announcement" }
    };

    body.innerHTML = rows.map(entry => {
      const meta = typeMap[entry.type] || typeMap.login;
      return `
        <tr>
          <td><span class="activity-action ${meta.cls}">${meta.glyph} <b>${esc(entry.action || meta.label)}</b></span></td>
          <td>${esc(entry.user || "System")}</td>
          <td>${esc(entry.details || "")}</td>
          <td>${esc(relativeTime(entry.time))}</td>
        </tr>
      `;
    }).join("");
  }

  /* ------------------------------------------------------------
     RENDER ALL
     ------------------------------------------------------------ */
  function renderAll() {
    renderKPIs();
    renderActivityChart();
    renderGuideUsage();
    populateRegionFilter();
    renderRegionCard();
    renderRecentUsers();
    renderRecentActivity();
  }

  /* ------------------------------------------------------------
     INIT
     ------------------------------------------------------------ */
  async function init() {
    setupNavigation();
    setupRegionFilter();

    loadLocalActivity();

    // Firebase loads asynchronously; the shared admin-header script may still
    // be settling auth. We try each source independently and re-render
    // whenever new data lands.
    const results = await Promise.allSettled([
      loadUsers(),
      loadAnnouncements(),
      loadGuideStats()
    ]);

    state.firebaseReady = results.some(r => r.status === "fulfilled" && r.value === true);

    renderAll();

    // React to activity log updates from other tabs / sections.
    window.addEventListener("storage", event => {
      if (event.key === CONFIG.activityKey) {
        loadLocalActivity();
        renderRecentActivity();
        renderActivityChart();
      }
    });

    // If the shared header publishes an auth-ready signal, re-run data loads.
    window.addEventListener("adminHeaderReady", async () => {
      await Promise.allSettled([loadUsers(), loadAnnouncements()]);
      renderAll();
    });

    // Public API for other dashboard scripts / modules.
    window.AdminDashboard = {
      refresh: renderAll,
      state,
      navigate
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
