/* ============================================================
   ADMIN DASHBOARD
   Dashboard-only behavior — realtime data wiring via onSnapshot.
   ============================================================ */

(() => {
  "use strict";

  /* ------------------------------------------------------------
     CONFIG
     ------------------------------------------------------------ */
  const CONFIG = {
    userCollections: ["employees", "users", "approved_users"],
    announcementsCollection: "announcements",
    guidesCollection: "guides",           // Firestore — realtime source
    feedbackCollection: "feedback",
    helpCollection: "help_requests",
    guideStatsCollection: "guide_stats",
    activityKey: "dss_admin_activity",
    timeZone: "Asia/Manila",
    activityWindowDays: 7
  };

  /* Matches the guide catalog in all-guides.js / script.js.
     When a new guide is added to the codebase, bump this number
     AND (ideally) add it to the Firestore `guides` collection —
     Firestore takes priority over this constant. */
  const GUIDE_COUNT_FALLBACK = 75;

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
    usersByCollection: {},
    announcements: [],
    guides: [],
    feedback: [],
    help: [],
    guideUsage: {},
    activity: [],
    region: "All Regions",
    firebaseReady: false
  };

  const unsubscribers = [];

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
    if (typeof value.seconds === "number") return new Date(value.seconds * 1000);
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

  /**
   * Resolve the current total guide count from the best available source.
   * Priority order:
   *   1. Firestore `guides` collection (realtime)
   *   2. window.GUIDE_REGISTRY — set by all-guides.js when present
   *   3. window.GUIDES / window.ALL_GUIDES — common aliases
   *   4. GUIDE_COUNT_FALLBACK — matches all-guides catalog / script.js
   */
  function resolveGuideCount() {
    if (state.guides.length > 0) return state.guides.length;

    if (Array.isArray(window.GUIDE_REGISTRY) && window.GUIDE_REGISTRY.length > 0) {
      return window.GUIDE_REGISTRY.length;
    }
    if (Array.isArray(window.GUIDES) && window.GUIDES.length > 0) {
      return window.GUIDES.length;
    }
    if (Array.isArray(window.ALL_GUIDES) && window.ALL_GUIDES.length > 0) {
      return window.ALL_GUIDES.length;
    }

    return GUIDE_COUNT_FALLBACK;
  }

  /* ------------------------------------------------------------
     LOADER CONTROL
     ------------------------------------------------------------ */
  let loaderHidden = false;
  let loaderHideTimer = null;

  function hidePageLoader() {
    if (loaderHidden) return;
    loaderHidden = true;

    const loader = document.getElementById("pageLoader");
    if (loader) {
      loader.style.transition = "opacity 0.35s ease";
      loader.style.opacity = "0";
      setTimeout(() => {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 380);
    }
    document.documentElement.classList.remove("page-loading");
    document.documentElement.removeAttribute("aria-busy");
  }

  function scheduleLoaderHide() {
    if (loaderHidden) return;
    clearTimeout(loaderHideTimer);
    loaderHideTimer = setTimeout(hidePageLoader, 400);
  }

  /* ------------------------------------------------------------
     RENDER DEBOUNCING
     ------------------------------------------------------------ */
  let renderTimer = null;
  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(renderAll, 80);
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

    if (!options.includes(state.region)) state.region = "All Regions";
    select.value = state.region;
  }

  /* ------------------------------------------------------------
     LOCAL ACTIVITY LOG
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

  /* ------------------------------------------------------------
     USER MERGE
     ------------------------------------------------------------ */
  function normalizeUserDoc(doc) {
    const data = doc.data() || {};
    const empId = String(data.empId || data.employeeId || data.emp_id || "").trim();
    const key = empId || doc.id;

    const firstName = String(data.firstName || "").trim();
    const lastName  = String(data.lastName  || "").trim();
    const composed  = [firstName, lastName].filter(Boolean).join(" ");
    const name = String(
      data.name || data.displayName || data.fullName || composed || empId || doc.id
    ).trim();

    const email = String(data.email || "").trim();
    const role = String(data.role || "User").trim();
    const region = String(
      data.region || data.country || data.location || "Unknown"
    ).trim();

    const active = data.active !== false && data.status !== "inactive";
    const createdAt =
      data.createdAt ||
      data.updatedAt ||
      data.dateAdded ||
      data.created_on ||
      null;

    return {
      id: doc.id,
      empId: key,
      name,
      firstName,
      lastName,
      email,
      role,
      region,
      active,
      createdAt
    };
  }

  function mergeAllUsers() {
    const combined = new Map();
    Object.values(state.usersByCollection).forEach(arr => {
      arr.forEach(u => {
        if (!combined.has(u.empId)) combined.set(u.empId, u);
      });
    });
    state.users = Array.from(combined.values());
  }

  /* ------------------------------------------------------------
     REALTIME LISTENERS
     ------------------------------------------------------------ */
  function attachRealtimeListeners() {
    const db = firestore();
    if (!db) {
      hidePageLoader();
      return;
    }

    // Users — three collections merged
    CONFIG.userCollections.forEach(colName => {
      try {
        const unsub = db.collection(colName).onSnapshot(
          snap => {
            state.usersByCollection[colName] = snap.docs.map(normalizeUserDoc);
            mergeAllUsers();
            scheduleRender();
            scheduleLoaderHide();
          },
          err => {
            console.info(`Dashboard: ${colName} listener failed —`, err.code || err.message);
            scheduleLoaderHide();
          }
        );
        unsubscribers.push(unsub);
      } catch (err) {
        console.info(`Dashboard: ${colName} unavailable —`, err.message);
        scheduleLoaderHide();
      }
    });

    // Announcements
    try {
      const unsubAnn = db.collection(CONFIG.announcementsCollection).onSnapshot(
        snap => {
          state.announcements = snap.docs.map(doc => {
            const data = doc.data() || {};
            return {
              id: doc.id,
              title: data.title || "",
              createdAt: data.createdAt || data.date || data.updatedAt || null,
              published: data.published !== false
            };
          });
          scheduleRender();
          scheduleLoaderHide();
        },
        err => {
          console.info("Dashboard: announcements listener failed —", err.code || err.message);
          scheduleLoaderHide();
        }
      );
      unsubscribers.push(unsubAnn);
    } catch (err) {
      scheduleLoaderHide();
    }

    // Guides — realtime from Firestore (falls back to all-guides catalog otherwise)
    try {
      const unsubGuides = db.collection(CONFIG.guidesCollection).onSnapshot(
        snap => {
          state.guides = snap.docs.map(doc => {
            const data = doc.data() || {};
            return {
              id: doc.id,
              title: data.title || data.name || doc.id,
              category: data.category || "",
              published: data.published !== false
            };
          });
          scheduleRender();
          scheduleLoaderHide();
        },
        err => {
          console.info("Dashboard: guides listener failed —", err.code || err.message);
          scheduleLoaderHide();
        }
      );
      unsubscribers.push(unsubGuides);
    } catch (err) {
      scheduleLoaderHide();
    }

    // Feedback — realtime
    try {
      const unsubFb = db.collection(CONFIG.feedbackCollection).onSnapshot(
        snap => {
          state.feedback = snap.docs.map(doc => {
            const data = doc.data() || {};
            return {
              id: doc.id,
              ...data,
              rating: Number(data.rating) || 0,
              createdAt: toDate(data.createdAt)
            };
          });
          scheduleRender();
          scheduleLoaderHide();
        },
        err => {
          console.info("Dashboard: feedback listener failed —", err.code || err.message);
          scheduleLoaderHide();
        }
      );
      unsubscribers.push(unsubFb);
    } catch (err) {
      scheduleLoaderHide();
    }

    // Help requests — realtime
    try {
      const unsubHelp = db.collection(CONFIG.helpCollection).onSnapshot(
        snap => {
          state.help = snap.docs.map(doc => {
            const data = doc.data() || {};
            return {
              id: doc.id,
              ...data,
              status: data.status || "open",
              createdAt: toDate(data.createdAt),
              adminReplyAt: toDate(data.adminReplyAt)
            };
          });
          scheduleRender();
          scheduleLoaderHide();
        },
        err => {
          console.info("Dashboard: help listener failed —", err.code || err.message);
          scheduleLoaderHide();
        }
      );
      unsubscribers.push(unsubHelp);
    } catch (err) {
      scheduleLoaderHide();
    }

    // Guide stats — realtime
    try {
      const unsubStats = db.collection(CONFIG.guideStatsCollection).onSnapshot(
        snap => {
          const next = {};
          snap.docs.forEach(doc => {
            const data = doc.data() || {};
            const id = data.guideId || doc.id;
            const count = Number(data.usageCount ?? data.count ?? 0);
            if (id) next[id] = (next[id] || 0) + (Number.isFinite(count) ? count : 0);
          });
          state.guideUsage = next;
          scheduleRender();
          scheduleLoaderHide();
        },
        err => {
          console.info("Dashboard: guide_stats listener failed —", err.code || err.message);
          scheduleLoaderHide();
        }
      );
      unsubscribers.push(unsubStats);
    } catch (err) {
      scheduleLoaderHide();
    }

    // Safety net — hide the loader even if all listeners hang
    setTimeout(hidePageLoader, 5000);
  }

  /* ------------------------------------------------------------
     RENDERING — KPI CARDS
     ------------------------------------------------------------ */
  function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value;
  }

  function renderKPIs() {
    // Users
    setText("totalUsers", state.users.length);
    setText("activeUsers", state.users.filter(u => u.active !== false).length);

    // Guides — uses resolveGuideCount() for the priority chain
    setText("totalGuides", resolveGuideCount());

    // Announcements
    const publishedAnnouncements = state.announcements.filter(a => a.published).length;
    setText("totalAnnouncements", publishedAnnouncements);

    // Feedback
    const fbCount = state.feedback.length;
    setText("totalFeedback", fbCount);

    const ratings = state.feedback
      .map(f => Number(f.rating))
      .filter(n => n > 0);
    let fbHint = "Employee feedback";
    if (ratings.length > 0) {
      const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      fbHint = `Avg ${avg.toFixed(1)} ★ from ${ratings.length} rating${ratings.length === 1 ? "" : "s"}`;
    } else if (fbCount > 0) {
      fbHint = `${fbCount} submitted · no ratings yet`;
    }
    setText("totalFeedbackHint", fbHint);

    // Open Help
    const openHelp = state.help.filter(h => {
      const s = String(h.status || "open").toLowerCase();
      return s === "open" || s === "in_progress";
    }).length;
    const resolvedHelp = state.help.filter(h =>
      String(h.status || "").toLowerCase() === "resolved"
    ).length;

    setText("totalHelp", openHelp);
    setText(
      "totalHelpHint",
      state.help.length > 0
        ? `${state.help.length} total · ${resolvedHelp} resolved`
        : "Awaiting reply or in progress"
    );
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

    const loginsPerDay = days.map(d => state.activity.filter(entry => {
      const entryDate = toDate(entry.time);
      if (!entryDate) return false;
      if (entry.type !== "login") return false;
      return entryDate.toDateString() === d.toDateString();
    }).length);

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

    const yAxis = document.querySelector(".chart-y-axis span");
    if (yAxis) yAxis.textContent = String(maxValue);
  }

  /* ------------------------------------------------------------
     RENDERING — GUIDE USAGE
     ------------------------------------------------------------ */
  function renderGuideUsage() {
    const container = document.querySelector(".guide-usage-list");
    if (!container) return;

    const registry =
      state.guides.length > 0
        ? state.guides
        : (Array.isArray(window.GUIDE_REGISTRY) && window.GUIDE_REGISTRY.length > 0
            ? window.GUIDE_REGISTRY
            : (Array.isArray(window.GUIDES) ? window.GUIDES : []));
    if (!registry.length) return;

    const rows = registry
      .map(g => ({ guide: g, count: Number(state.guideUsage[g.id] || 0) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

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
     RENDERING — REGION CARD
     ------------------------------------------------------------ */
  function renderRegionCard() {
    const donut = document.querySelector(".donut-chart");
    const center = document.querySelector(".donut-center strong");
    const legend = document.querySelector(".region-legend");
    if (!donut || !center || !legend) return;

    const counts = {};
    state.users.forEach(u => {
      const region = String(u.region || "Other").trim() || "Other";
      counts[region] = (counts[region] || 0) + 1;
    });

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    const filtered = state.region === "All Regions"
      ? entries
      : entries.filter(([region]) => region === state.region);

    const totalFiltered = filtered.reduce((a, [, count]) => a + count, 0);

    if (!totalFiltered) {
      donut.style.background = "#e9e8f1";
      center.textContent = "0";
      legend.innerHTML = "";
      return;
    }

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
    if (!body) return;

    if (!state.users.length) {
      body.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#9999ad;padding:20px 0;">No users yet</td></tr>`;
      return;
    }

    const rows = state.users
      .slice()
      .sort((a, b) => {
        const at = toDate(a.createdAt);
        const bt = toDate(b.createdAt);
        if (at && bt) return bt - at;
        if (bt && !at) return 1;
        if (at && !bt) return -1;
        return 0;
      })
      .slice(0, 5);

    body.innerHTML = rows.map(u => {
      const initial = initials(u.name, u.email);
      const statusClass = u.active === false ? "status-pill inactive" : "status-pill active";
      const statusLabel = u.active === false ? "Inactive" : "Active";
      return `
        <tr>
          <td><span class="table-person"><i>${esc(initial)}</i>${esc(u.name)}</span></td>
          <td>${esc(u.email || u.empId || "—")}</td>
          <td><span class="role-pill">${esc(u.role)}</span></td>
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
    if (!body) return;

    if (!state.activity.length) {
      body.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#9999ad;padding:20px 0;">No recent activity</td></tr>`;
      return;
    }

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
  function init() {
    setupNavigation();
    setupRegionFilter();
    loadLocalActivity();

    // Initial paint with whatever is in state (empty)
    renderAll();

    // Attach realtime listeners
    attachRealtimeListeners();

    // React to activity log updates from other tabs
    window.addEventListener("storage", event => {
      if (event.key === CONFIG.activityKey) {
        loadLocalActivity();
        renderRecentActivity();
        renderActivityChart();
      }
    });

    // Public API
    window.AdminDashboard = {
      refresh: renderAll,
      state,
      navigate
    };
  }

  // Cleanup on unload
  window.addEventListener("beforeunload", () => {
    unsubscribers.forEach(fn => {
      try { fn(); } catch (_) {}
    });
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
