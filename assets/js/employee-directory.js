/* ============================================================
   BD Tools — Employee Directory
   Reads from `employees`, `users`, `approved_users` (deduped
   by empId, preferring `employees` as the source of truth).
   ============================================================ */
(function () {
  "use strict";

  const COLLECTIONS = ["employees", "users", "approved_users"];
  const SOURCE_RANK = { employees: 3, users: 2, approved_users: 1 };
  const ADMIN_ROLES = ["admin", "manager", "administrator"];

  let allEmployees = [];
  let activeQueue = null;   // null = all queues
  let searchQuery = "";
  let initialized = false;

  /* ---- Helpers ---- */
  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  function getDisplayName(e) {
    if (e.name && String(e.name).trim()) return String(e.name).trim();
    const first = (e.firstName || "").trim();
    const last  = (e.lastName  || "").trim();
    if (first || last) return [first, last].filter(Boolean).join(" ");
    return e.empId || "Unknown";
  }

  function getInitials(name) {
    const n = String(name || "").trim();
    if (!n) return "?";
    const parts = n.split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function isAdmin(e) {
    return ADMIN_ROLES.includes(String(e.role || "").trim().toLowerCase());
  }

  function getRoleLabel(e) {
    const role = String(e.role || "").trim();
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1);
  }

  /* ---- Data loading ---- */
  async function loadAllEmployees() {
    if (typeof firebase === "undefined" || !firebase.firestore) {
      throw new Error("Firebase not available");
    }
    const db = firebase.firestore();
    const byEmpId = new Map();

    for (const col of COLLECTIONS) {
      try {
        const snap = await db.collection(col).get();
        snap.forEach(doc => {
          const data = doc.data() || {};
          const empId = String(
            data.empId || data.employeeId || data.emp_id || ""
          ).trim();
          if (!empId) return;

          const existing     = byEmpId.get(empId);
          const existingRank = existing ? SOURCE_RANK[existing._source] : -1;
          const newRank      = SOURCE_RANK[col];

          if (newRank > existingRank) {
            byEmpId.set(empId, Object.assign({}, data, {
              id: doc.id,
              empId: empId,
              _source: col
            }));
          }
        });
      } catch (err) {
        console.warn("[directory] failed to read " + col + ":", err);
      }
    }

    return Array.from(byEmpId.values());
  }

  /* ---- Stats ---- */
  function updateStats() {
    const totalEl  = document.getElementById("statTotal");
    const queuesEl = document.getElementById("statQueues");
    const adminsEl = document.getElementById("statAdmins");

    const total        = allEmployees.length;
    const uniqueQueues = new Set(
      allEmployees.map(e => (e.queue || "").trim()).filter(Boolean)
    ).size;
    const admins = allEmployees.filter(isAdmin).length;

    if (totalEl)  totalEl.textContent  = total;
    if (queuesEl) queuesEl.textContent = uniqueQueues;
    if (adminsEl) adminsEl.textContent = admins;
  }

  /* ---- Queue filter pills ---- */
  function renderQueueFilters() {
    const container = document.getElementById("queueFilters");
    if (!container) return;

    const counts = new Map();
    allEmployees.forEach(e => {
      const q = (e.queue || "").trim();
      if (!q) return;
      counts.set(q, (counts.get(q) || 0) + 1);
    });

    const queues = Array.from(counts.keys()).sort();

    let html =
      '<button type="button" class="queue-pill' +
      (activeQueue === null ? " active" : "") +
      '" data-queue="">All <span class="queue-count">' +
      allEmployees.length +
      "</span></button>";

    queues.forEach(q => {
      const isActive = activeQueue === q;
      html +=
        '<button type="button" class="queue-pill' +
        (isActive ? " active" : "") +
        '" data-queue="' + esc(q) + '">' +
        esc(q) +
        ' <span class="queue-count">' + counts.get(q) + "</span></button>";
    });

    container.innerHTML = html;

    container.querySelectorAll(".queue-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const q = pill.dataset.queue;
        activeQueue = q ? q : null;
        renderQueueFilters();
        renderGrid();
      });
    });
  }

  /* ---- Filtering ---- */
  function matchesSearch(e, q) {
    if (!q) return true;
    const haystack = [
      getDisplayName(e),
      e.empId,
      e.queue,
      e.email,
      e.department,
      e.title,
      e.location,
      e.role
    ].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(q);
  }

  function getFiltered() {
    const q = searchQuery.trim().toLowerCase();
    return allEmployees.filter(e => {
      if (activeQueue && (e.queue || "").trim() !== activeQueue) return false;
      return matchesSearch(e, q);
    });
  }

  /* ---- Rendering ---- */
  function renderEmployeeCard(e) {
    const name       = getDisplayName(e);
    const initials   = getInitials(name);
    const queue      = (e.queue      || "").trim();
    const role       = getRoleLabel(e);
    const admin      = isAdmin(e);
    const email      = (e.email      || "").trim();
    const title      = (e.title      || "").trim();
    const department = (e.department || "").trim();
    const location   = (e.location   || "").trim();
    const phone      = (e.phone      || "").trim();

    let tagsHtml = "";
    tagsHtml += queue
      ? '<span class="employee-tag queue">' + esc(queue) + "</span>"
      : '<span class="employee-tag no-queue">No queue</span>';
    if (admin) {
      tagsHtml += '<span class="employee-tag admin">' + esc(role || "Admin") + "</span>";
    }

    let rowsHtml = "";
    if (email) {
      rowsHtml +=
        '<div class="employee-row"><i class="fa-regular fa-envelope"></i><span>' +
        esc(email) + "</span></div>";
    }
    if (title || department) {
      const line = [title, department].filter(Boolean).join(" · ");
      rowsHtml +=
        '<div class="employee-row"><i class="fa-regular fa-building"></i><span>' +
        esc(line) + "</span></div>";
    }
    if (location) {
      rowsHtml +=
        '<div class="employee-row"><i class="fa-solid fa-location-dot"></i><span>' +
        esc(location) + "</span></div>";
    }
    if (phone) {
      rowsHtml +=
        '<div class="employee-row"><i class="fa-solid fa-phone"></i><span>' +
        esc(phone) + "</span></div>";
    }

    return (
      '<article class="employee-card">' +
        '<div class="employee-card-head">' +
          '<div class="employee-avatar">' + esc(initials) + "</div>" +
          '<div class="employee-identity">' +
            '<div class="employee-name" title="' + esc(name) + '">' + esc(name) + "</div>" +
            '<div class="employee-emp">' + (e.empId ? "EMP " + esc(e.empId) : "") + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="employee-tags">' + tagsHtml + "</div>" +
        '<div class="employee-body">' + rowsHtml + "</div>" +
      "</article>"
    );
  }

  function renderGrid() {
    const grid      = document.getElementById("employeeGrid");
    const resultsEl = document.getElementById("resultsText");
    const titleEl   = document.getElementById("directoryTitle");
    const emptyEl   = document.getElementById("noEmployees");
    if (!grid) return;

    const filtered = getFiltered();

    if (titleEl) {
      titleEl.textContent = activeQueue
        ? activeQueue + " Employees"
        : "All Employees";
    }

    if (resultsEl) {
      if (allEmployees.length === 0) {
        resultsEl.textContent = "No employees found in the directory.";
      } else {
        resultsEl.textContent =
          "Showing " + filtered.length + " of " + allEmployees.length + " employees";
      }
    }

    if (filtered.length === 0) {
      grid.innerHTML = "";
      if (emptyEl) {
        emptyEl.hidden = false;
        const copyEl = emptyEl.querySelector("p");
        if (copyEl) {
          copyEl.textContent =
            allEmployees.length === 0
              ? "No employees have signed in yet. Once users save their profile, they'll appear here."
              : "Try a different search or filter.";
        }
      }
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    grid.innerHTML = filtered.map(renderEmployeeCard).join("");
  }

  /* ---- Init ---- */
  async function init() {
    if (initialized) return;
    initialized = true;

    const resultsEl = document.getElementById("resultsText");

    try {
      if (resultsEl) resultsEl.textContent = "Loading employees...";

      allEmployees = await loadAllEmployees();

      allEmployees.sort((a, b) =>
        getDisplayName(a).localeCompare(getDisplayName(b), undefined, {
          sensitivity: "base"
        })
      );

      updateStats();
      renderQueueFilters();
      renderGrid();

      const search    = document.getElementById("directorySearch");
      const searchBtn = document.getElementById("directorySearchBtn");

      function runSearch() {
        searchQuery = search ? search.value : "";
        renderGrid();
      }

      if (search) {
        search.addEventListener("input", runSearch);
        search.addEventListener("keydown", e => {
          if (e.key === "Enter") {
            e.preventDefault();
            runSearch();
          }
        });
      }
      if (searchBtn) {
        searchBtn.addEventListener("click", runSearch);
      }
    } catch (err) {
      console.error("[directory] init failed:", err);
      if (resultsEl) {
        resultsEl.textContent = "Could not load employees. Please refresh and try again.";
      }
      const emptyEl = document.getElementById("noEmployees");
      if (emptyEl) {
        emptyEl.hidden = false;
        const copyEl = emptyEl.querySelector("p");
        if (copyEl) copyEl.textContent = "There was a problem connecting to Firestore.";
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
