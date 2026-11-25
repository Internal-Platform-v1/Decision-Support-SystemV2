/* ============================================================
   BD Tools — Employee Directory
   Reads from assets/references/approved_users.xlsx (Excel export
   of the approved_users collection). No Firestore dependency.

   Card click → opens the shared profile modal in view mode via
   window.BDProfileModal.view(employee).
   ============================================================ */
(function () {
  "use strict";

  const XLSX_URL     = "assets/references/approved_users.xlsx";
  const XLSX_LIB_URL = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
  const ADMIN_ROLES  = ["admin", "manager", "administrator"];

  let allEmployees = [];
  let activeQueue  = null;
  let searchQuery  = "";
  let initialized  = false;

  /* ---- Helpers ---- */
  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  function pickString(row, ...keys) {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== null) {
        const s = String(row[k]).trim();
        if (s) return s;
      }
    }
    return "";
  }

  function getDisplayName(e) {
    if (e.name && String(e.name).trim()) return String(e.name).trim();
    const first = (e.firstName || "").trim();
    const last  = (e.lastName  || "").trim();
    if (first || last) return [first, last].filter(Boolean).join(" ");
    return e.empId || e.id || "Unknown";
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

  // Effective queue: prefer `queue`, fall back to current / primary.
  function getQueue(e) {
    return String(e.queue        || "").trim()
        || String(e.currentQueue || "").trim()
        || String(e.primaryQueue || "").trim();
  }

  /* ---- XLSX library loader ---- */
  function loadXLSXLibrary() {
    return new Promise((resolve, reject) => {
      if (window.XLSX) return resolve(window.XLSX);
      const existing = document.querySelector('script[src="' + XLSX_LIB_URL + '"]');
      if (existing) {
        existing.addEventListener("load",  () => resolve(window.XLSX));
        existing.addEventListener("error", () => reject(new Error("XLSX library failed to load")));
        return;
      }
      const s = document.createElement("script");
      s.src = XLSX_LIB_URL;
      s.onload  = () => resolve(window.XLSX);
      s.onerror = () => reject(new Error("XLSX library failed to load"));
      document.head.appendChild(s);
    });
  }

  /* ---- Data loading from XLSX ---- */
  async function loadAllEmployees() {
    const XLSX = await loadXLSXLibrary();

    const res = await fetch(XLSX_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Could not load " + XLSX_URL + " (HTTP " + res.status + ")");

    const buffer    = await res.arrayBuffer();
    const workbook  = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet     = workbook.Sheets[sheetName];
    const rows      = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const byKey = new Map();

    for (const row of rows) {
      const empId = pickString(row, "employeeId", "empId", "Emp ID", "emp_id");
      const docId = pickString(row, "__docId");
      const email = pickString(row, "email", "Email").toLowerCase();
      const key   = empId || docId || email;
      if (!key) continue;
      if (byKey.has(key)) continue;                // first occurrence wins

      const firstName = pickString(row, "firstName");
      const lastName  = pickString(row, "lastName");
      const displayName = pickString(row, "name", "Name")
        || [firstName, lastName].filter(Boolean).join(" ");

      const employee = Object.assign({}, row, {
        id:             key,
        empId:          empId,
        name:           displayName,
        firstName:      firstName,
        lastName:       lastName,
        email:          pickString(row, "email", "Email"),
        role:           pickString(row, "role", "Role"),
        queue:          pickString(row, "queue"),
        currentQueue:   pickString(row, "currentQueue",   "Cur Queue"),
        primaryQueue:   pickString(row, "primaryQueue",   "Pri Queue"),
        secondaryQueue: pickString(row, "secondaryQueue", "Sec Queue"),
        supervisor:     pickString(row, "supervisor",     "Team Leader"),
        department:     pickString(row, "department"),
        title:          pickString(row, "title"),
        location:       pickString(row, "location") || pickString(row, "region"),
        phone:          pickString(row, "phone"),
        _source:        "excel"
      });

      byKey.set(key, employee);
    }

    return Array.from(byKey.values());
  }

  /* ---- Stats ---- */
  function updateStats() {
    const totalEl  = document.getElementById("statTotal");
    const queuesEl = document.getElementById("statQueues");
    const adminsEl = document.getElementById("statAdmins");

    const total        = allEmployees.length;
    const uniqueQueues = new Set(allEmployees.map(getQueue).filter(Boolean)).size;
    const admins       = allEmployees.filter(isAdmin).length;

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
      const q = getQueue(e);
      if (!q) return;
      counts.set(q, (counts.get(q) || 0) + 1);
    });

    const queues = Array.from(counts.keys()).sort();

    let html =
      '<button type="button" class="queue-pill' +
      (activeQueue === null ? " active" : "") +
      '" data-queue="">All <span class="queue-count">' +
      allEmployees.length + "</span></button>";

    queues.forEach(q => {
      const isActive = activeQueue === q;
      html +=
        '<button type="button" class="queue-pill' +
        (isActive ? " active" : "") +
        '" data-queue="' + esc(q) + '">' +
        esc(q) + ' <span class="queue-count">' + counts.get(q) + "</span></button>";
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
      getQueue(e),
      e.email,
      e.department,
      e.title,
      e.location,
      e.role,
      e.supervisor
    ].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(q);
  }

  function getFiltered() {
    const q = searchQuery.trim().toLowerCase();
    return allEmployees.filter(e => {
      if (activeQueue && getQueue(e) !== activeQueue) return false;
      return matchesSearch(e, q);
    });
  }

  /* ---- Card ---- */
  function renderEmployeeCard(e) {
    const name       = getDisplayName(e);
    const initials   = getInitials(name);
    const queue      = getQueue(e);
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
      '<article class="employee-card" role="button" tabindex="0" ' +
        'data-employee-key="' + esc(e.id || "") + '" ' +
        'aria-label="View profile for ' + esc(name) + '">' +
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
      titleEl.textContent = activeQueue ? activeQueue + " Employees" : "All Employees";
    }

    if (resultsEl) {
      resultsEl.textContent = allEmployees.length === 0
        ? "No employees found in the directory."
        : "Showing " + filtered.length + " of " + allEmployees.length + " employees";
    }

    if (filtered.length === 0) {
      grid.innerHTML = "";
      if (emptyEl) {
        emptyEl.hidden = false;
        const copyEl = emptyEl.querySelector("p");
        if (copyEl) {
          copyEl.textContent = allEmployees.length === 0
            ? "The directory file could not be loaded or is empty. Make sure assets/references/approved_users.xlsx exists."
            : "Try a different search or filter.";
        }
      }
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    grid.innerHTML = filtered.map(renderEmployeeCard).join("");
  }

  /* ---- Card click → profile modal ---- */
  function openEmployeeProfile(employee) {
    if (window.BDProfileModal && typeof window.BDProfileModal.view === "function") {
      window.BDProfileModal.view(employee);
      return;
    }
    setTimeout(function () {
      if (window.BDProfileModal && typeof window.BDProfileModal.view === "function") {
        window.BDProfileModal.view(employee);
      } else {
        console.warn("[directory] profile modal not available");
      }
    }, 500);
  }

  function handleCardClick(e) {
    const card = e.target.closest(".employee-card");
    if (!card) return;
    const key = card.dataset.employeeKey;
    if (!key) return;
    const employee = allEmployees.find(x => String(x.id) === key);
    if (!employee) return;
    openEmployeeProfile(employee);
  }

  function handleCardKeydown(e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".employee-card");
    if (!card) return;
    e.preventDefault();
    handleCardClick(e);
  }

  /* ---- Init ---- */
  async function init() {
    if (initialized) return;
    initialized = true;

    const resultsEl = document.getElementById("resultsText");
    const grid      = document.getElementById("employeeGrid");

    if (grid && !grid._directoryClickBound) {
      grid._directoryClickBound = true;
      grid.addEventListener("click",   handleCardClick);
      grid.addEventListener("keydown", handleCardKeydown);
    }

    try {
      if (resultsEl) resultsEl.textContent = "Loading employees...";

      allEmployees = await loadAllEmployees();

      allEmployees.sort((a, b) =>
        getDisplayName(a).localeCompare(getDisplayName(b), undefined, { sensitivity: "base" })
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
          if (e.key === "Enter") { e.preventDefault(); runSearch(); }
        });
      }
      if (searchBtn) searchBtn.addEventListener("click", runSearch);
    } catch (err) {
      console.error("[directory] init failed:", err);
      if (resultsEl) {
        resultsEl.textContent = "Could not load employees: " +
          (err && err.message ? err.message : "unknown error");
      }
      const emptyEl = document.getElementById("noEmployees");
      if (emptyEl) {
        emptyEl.hidden = false;
        const copyEl = emptyEl.querySelector("p");
        if (copyEl) copyEl.textContent =
          "Make sure assets/references/approved_users.xlsx exists and is reachable.";
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
