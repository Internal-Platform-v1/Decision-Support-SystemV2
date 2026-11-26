/* ============================================================
   BD Tools — Employee Directory
   Reads from assets/references/approved_users.xlsx
   ============================================================ */
(function () {
  "use strict";

  const XLSX_URL     = "assets/references/approved_users.xlsx";
  const XLSX_LIB_URL = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
  const ADMIN_ROLES  = ["admin", "manager", "administrator"];

  let allEmployees = [];
  let activeQueue  = null;
  let activeTeamLeader = null;
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

  /* ---- Queue helpers ---- */
  function isRealQueue(v) {
    const s = String(v || "").trim();
    if (!s) return false;
    const lc = s.toLowerCase();
    return lc !== "n/a" && lc !== "na" && lc !== "none";
  }

  function splitSecondary(v) {
    return String(v || "").split(",").map(p => p.trim()).filter(isRealQueue);
  }

  function getQueueRoles(e) {
    const cur = String(e.currentQueue || e.queue || "").trim();
    const pri = String(e.primaryQueue || "").trim();
    const sec = String(e.secondaryQueue || "").trim();

    const lines = [];
    const seen = new Set();

    if (isRealQueue(cur)) {
      lines.push({ label: "Current", value: cur, current: true });
      seen.add(cur);
    }
    if (isRealQueue(pri) && !seen.has(pri)) {
      lines.push({ label: "Primary", value: pri });
      seen.add(pri);
    }
    if (isRealQueue(sec) && !seen.has(sec)) {
      lines.push({ label: "Secondary", value: sec });
    }
    return lines;
  }

  function atomicQueueNames(e) {
    const set = new Set();
    const cur = String(e.currentQueue || e.queue || "").trim();
    const pri = String(e.primaryQueue || "").trim();
    const sec = String(e.secondaryQueue || "").trim();

    if (isRealQueue(cur)) set.add(cur);
    if (isRealQueue(pri)) set.add(pri);
    splitSecondary(sec).forEach(p => set.add(p));
    return set;
  }

  function lineMatchesQueue(value, q) {
    if (!q) return false;
    if (value === q) return true;
    return splitSecondary(value).includes(q);
  }

  /* ---- XLSX loader ---- */
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
      if (byKey.has(key)) continue;

      const firstName = pickString(row, "firstName");
      const lastName  = pickString(row, "lastName");
      const displayName = pickString(row, "name", "Name") || [firstName, lastName].filter(Boolean).join(" ");

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
        phone:          pickString(row, "phone")
      });

      byKey.set(key, employee);
    }

    return Array.from(byKey.values());
  }

  /* ---- Stats + status ---- */
  function setStatus(label, icon) {
    const pill = document.getElementById("statusPill");
    if (pill) pill.innerHTML = '<i class="fa-solid ' + (icon || "fa-bolt") + '"></i> ' + label;
  }

  function updateStats() {
    const heroEmp  = document.getElementById("heroEmployeeCount");
    const heroQ    = document.getElementById("heroQueueCount");
    const totalEl  = document.getElementById("totalRowsValue");
    const queuesEl = document.getElementById("uniqueQueuesValue");

    const total = allEmployees.length;
    const uniqueQueues = new Set();
    allEmployees.forEach(e => atomicQueueNames(e).forEach(n => uniqueQueues.add(n)));

    if (heroEmp)  heroEmp.textContent  = total;
    if (heroQ)    heroQ.textContent    = uniqueQueues.size;
    if (totalEl)  totalEl.textContent  = total;
    if (queuesEl) queuesEl.textContent = uniqueQueues.size;
  }

  function updateFilterStats(shownCount) {
    const matchEl = document.getElementById("heroMatchCount");
    const shownEl = document.getElementById("visibleResultsValue");
    if (matchEl) matchEl.textContent = shownCount;
    if (shownEl) shownEl.textContent = shownCount;

    if (!allEmployees.length) setStatus("Waiting for Data", "fa-database");
    else if (!shownCount) setStatus("No Match Found", "fa-circle-exclamation");
    else if (searchQuery.trim() || activeQueue || activeTeamLeader) setStatus("Filtered Results", "fa-filter");
    else setStatus("Directory Ready", "fa-circle-check");
  }

   /* ---- Queue filter dropdown ---- */
  function renderQueueFilters() {
    const container = document.getElementById("queueFilters");
    const label = document.getElementById("queueFilterLabel");
    if (!container) return;

    const counts = new Map();
    allEmployees.forEach(e => {
      atomicQueueNames(e).forEach(name => {
        counts.set(name, (counts.get(name) || 0) + 1);
      });
    });

    const queues = Array.from(counts.keys()).sort();

    let html = `
      <div class="filter-item ${activeQueue === null ? 'active' : ''}" data-queue="">
        <span>All Queues</span>
        <span class="filter-count">${allEmployees.length}</span>
      </div>
    `;

    queues.forEach(q => {
      const isActive = activeQueue === q;
      html += `
        <div class="filter-item ${isActive ? 'active' : ''}" data-queue="${esc(q)}">
          <span>${esc(q)}</span>
          <span class="filter-count">${counts.get(q)}</span>
        </div>
      `;
    });

    container.innerHTML = html;

    // Update label
    if (label) {
      label.textContent = activeQueue ? activeQueue : "All Queues";
    }

    // Attach clicks to items
    container.querySelectorAll(".filter-item").forEach(item => {
      item.addEventListener("click", () => {
        const q = item.dataset.queue;
        activeQueue = q ? q : null;
        renderQueueFilters();
        renderGrid();
        
        // Close dropdown
        document.getElementById("queueFilters").classList.remove("is-open");
        
        const scroll = document.getElementById("directoryScroll");
        if (scroll) scroll.scrollTop = 0;
      });
    });
  }


    /* ---- Team Leader filter dropdown ---- */
  function renderTeamLeaderFilters() {
    const container = document.getElementById("tlFilters");
    const label = document.getElementById("tlFilterLabel");
    if (!container) return;

    const tlCounts = new Map();
    allEmployees.forEach(e => {
      const tl = String(e.supervisor || "").trim();
      if (tl) tlCounts.set(tl, (tlCounts.get(tl) || 0) + 1);
    });

    const tls = Array.from(tlCounts.keys()).sort();

    let html = `
      <div class="filter-item ${activeTeamLeader === null ? 'active' : ''}" data-tl="">
        <span>All Team Leaders</span>
        <span class="filter-count">${allEmployees.length}</span>
      </div>
    `;

    tls.forEach(tl => {
      const isActive = activeTeamLeader === tl;
      html += `
        <div class="filter-item ${isActive ? 'active' : ''}" data-tl="${esc(tl)}">
          <span>${esc(tl)}</span>
          <span class="filter-count">${tlCounts.get(tl)}</span>
        </div>
      `;
    });

    container.innerHTML = html;

    if (label) label.textContent = activeTeamLeader ? activeTeamLeader : "All Team Leaders";

    container.querySelectorAll(".filter-item").forEach(item => {
      item.addEventListener("click", () => {
        activeTeamLeader = item.dataset.tl ? item.dataset.tl : null;
        renderTeamLeaderFilters();
        renderGrid();
        document.getElementById("tlFilters").classList.remove("is-open");
        const scroll = document.getElementById("directoryScroll");
        if (scroll) scroll.scrollTop = 0;
      });
    });
  } 

  // Add this logic inside your init() function to toggle the dropdown
  function setupDropdown() {
    const btn = document.getElementById("queueFilterBtn");
    const menu = document.getElementById("queueFilters");
    
    if (btn && menu) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("is-open");
      });

      // Close when clicking outside
      document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && e.target !== btn) {
          menu.classList.remove("is-open");
        }
      });
    }
  }

  /* ---- Filtering ---- */
  function matchesSearch(e, q) {
    if (!q) return true;
    const haystack = [
      getDisplayName(e), e.empId, e.currentQueue, e.queue, e.primaryQueue,
      e.secondaryQueue, e.email, e.department, e.title, e.location, e.role, e.supervisor
    ].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(q);
  }

  function getFiltered() {
    const q = searchQuery.trim().toLowerCase();
    return allEmployees.filter(e => {
      if (activeQueue && !atomicQueueNames(e).has(activeQueue)) return false;
      return matchesSearch(e, q);
    });
  }

  /* ---- Card ---- */
  function renderQueueBlock(e) {
    const lines = getQueueRoles(e);
    if (lines.length === 0) {
      return '<div class="employee-queues"><div class="employee-queue-empty">No queue assigned</div></div>';
    }
    return '<div class="employee-queues">' +
      lines.map(line => {
        const isMatch = activeQueue && lineMatchesQueue(line.value, activeQueue);
        const cls = "employee-queue-line" + (line.current ? " current" : "") + (isMatch ? " q-match" : "");
        return '<div class="' + cls + '">' +
          '<span class="q-label">' + esc(line.label) + '</span>' +
          '<span class="q-value" title="' + esc(line.value) + '">' + esc(line.value) + '</span>' +
        '</div>';
      }).join("") +
    '</div>';
  }

  function renderEmployeeCard(e) {
    const name       = getDisplayName(e);
    const initials   = getInitials(name);
    const role       = getRoleLabel(e);
    const admin      = isAdmin(e);
    const email      = (e.email      || "").trim();
    const title      = (e.title      || "").trim();
    const department = (e.department || "").trim();
    const location   = (e.location   || "").trim();
    const phone      = (e.phone      || "").trim();

    let tagsHtml = "";
    if (admin) {
      tagsHtml = '<div class="employee-tags"><span class="employee-tag admin">' + esc(role || "Admin") + '</span></div>';
    }

    let rowsHtml = "";
    if (email) rowsHtml += '<div class="employee-row"><i class="fa-regular fa-envelope"></i><span>' + esc(email) + "</span></div>";
    if (title || department) {
      const line = [title, department].filter(Boolean).join(" · ");
      rowsHtml += '<div class="employee-row"><i class="fa-regular fa-building"></i><span>' + esc(line) + "</span></div>";
    }
    if (location) rowsHtml += '<div class="employee-row"><i class="fa-solid fa-location-dot"></i><span>' + esc(location) + "</span></div>";
    if (phone) rowsHtml += '<div class="employee-row"><i class="fa-solid fa-phone"></i><span>' + esc(phone) + "</span></div>";

    return (
      '<article class="employee-card" role="button" tabindex="0" data-employee-key="' + esc(e.id || "") + '" aria-label="View profile for ' + esc(name) + '">' +
        '<div class="employee-card-head">' +
          '<div class="employee-avatar">' + esc(initials) + "</div>" +
          '<div class="employee-identity">' +
            '<div class="employee-name" title="' + esc(name) + '">' + esc(name) + "</div>" +
            '<div class="employee-emp">' + (e.empId ? "EMP " + esc(e.empId) : "") + "</div>" +
          "</div>" +
        "</div>" +
        tagsHtml + renderQueueBlock(e) +
        '<div class="employee-body">' + rowsHtml + "</div>" +
      "</article>"
    );
  }

  function renderGrid() {
    const grid      = document.getElementById("employeeGrid");
    const emptyEl   = document.getElementById("noEmployees");
    if (!grid) return;

    const filtered = getFiltered();
    updateFilterStats(filtered.length);

    if (filtered.length === 0) {
      grid.innerHTML = "";
      if (emptyEl) {
        emptyEl.hidden = false;
        const copyEl = emptyEl.querySelector("p");
        if (copyEl) {
          copyEl.textContent = allEmployees.length === 0
            ? "The directory file could not be loaded or is empty."
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
      }
    }, 500);
  }

  function handleCardClick(e) {
    const card = e.target.closest(".employee-card");
    if (!card) return;
    const key = card.dataset.employeeKey;
    if (!key) return;
    const employee = allEmployees.find(x => String(x.id) === key);
    if (employee) openEmployeeProfile(employee);
  }

  function handleCardKeydown(e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".employee-card");
    if (!card) return;
    e.preventDefault();
    handleCardClick(e);
  }

  /* ------------------------------------------------------------
     Global hero-button handlers
     ------------------------------------------------------------ */
  window.scrollToDirectory = function () {
    searchQuery = ""; activeQueue = null;
    const searchEl = document.getElementById("directorySearch");
    if (searchEl) searchEl.value = "";
    const clearBtn = document.getElementById("clearSearchBtn");
    if (clearBtn) clearBtn.style.display = "none";
    renderQueueFilters(); renderGrid();
    const scrollEl = document.getElementById("directoryScroll");
    if (scrollEl) scrollEl.scrollTop = 0;
  };

  window.focusDirectorySearch = function () {
    const input = document.getElementById("directorySearch");
    if (input) input.focus();
  };

  window.clearDirectorySearch = function () {
    searchQuery = "";
    const input = document.getElementById("directorySearch");
    if (input) input.value = "";
    const clearBtn = document.getElementById("clearSearchBtn");
    if (clearBtn) clearBtn.style.display = "none";
    renderGrid();
    const scrollEl = document.getElementById("directoryScroll");
    if (scrollEl) scrollEl.scrollTop = 0;
    if (input) input.focus();
  };

  /* ------------------------------------------------------------
     Fullscreen toggle
     ------------------------------------------------------------ */
  function setupFullscreen() {
    const btn    = document.getElementById("fullscreenBtn");
    const target = document.getElementById("directoryWorkspace");
    if (!btn || !target) return;

    const icon = btn.querySelector("i");
    let savedModal  = null;
    let savedParent = null;

    btn.addEventListener("click", async () => {
      try {
        if (!document.fullscreenElement) {
          savedModal  = document.getElementById("profileModal");
          savedParent = savedModal ? savedModal.parentNode : null;
          if (savedModal) target.appendChild(savedModal);
          await target.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch (err) {
        console.error("[directory] fullscreen error:", err);
        if (savedModal && savedParent && savedParent.isConnected) savedParent.appendChild(savedModal);
        savedModal = null; savedParent = null;
      }
    });

    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        if (icon) icon.className = "fa-solid fa-compress";
        btn.title = "Exit Full Screen"; btn.setAttribute("aria-label", "Exit full screen");
      } else {
        if (icon) icon.className = "fa-solid fa-expand";
        btn.title = "View Full Screen"; btn.setAttribute("aria-label", "Toggle full screen");
        if (savedModal && savedParent && savedParent.isConnected) savedParent.appendChild(savedModal);
        savedModal = null; savedParent = null;
      }
    });
  }

  /* ---- Init ---- */
  async function init() {
    if (initialized) return;
    initialized = true;

    setupFullscreen();
     setupDropdown();

    const grid = document.getElementById("employeeGrid");
    if (grid && !grid._directoryClickBound) {
      grid._directoryClickBound = true;
      grid.addEventListener("click",   handleCardClick);
      grid.addEventListener("keydown", handleCardKeydown);
    }

    try {
      allEmployees = await loadAllEmployees();
      allEmployees.sort((a, b) => getDisplayName(a).localeCompare(getDisplayName(b), undefined, { sensitivity: "base" }));

      updateStats();
      renderQueueFilters();
      renderGrid();

      const search    = document.getElementById("directorySearch");
      const clearBtn  = document.getElementById("clearSearchBtn");

      function runSearch() {
        searchQuery = search ? search.value : "";
        if (clearBtn) clearBtn.style.display = searchQuery ? "block" : "none";
        renderGrid();
        const scroll = document.getElementById("directoryScroll");
        if (scroll) scroll.scrollTop = 0;
      }

      if (search) {
        search.addEventListener("input", runSearch);
        search.addEventListener("keydown", e => {
          if (e.key === "Enter") { e.preventDefault(); runSearch(); }
        });
      }
    } catch (err) {
      console.error("[directory] init failed:", err);
      const emptyEl = document.getElementById("noEmployees");
      if (emptyEl) {
        emptyEl.hidden = false;
        const copyEl = emptyEl.querySelector("p");
        if (copyEl) copyEl.textContent = "Make sure assets/references/approved_users.xlsx exists and is reachable.";
      }
      updateFilterStats(0);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
