/* ============================================================
   ADMIN · USER MANAGEMENT
   CRUD against Firestore `employees` collection.
   Realtime — table updates the instant any doc changes.
   ============================================================ */
(() => {
  "use strict";

  /* ------------------------------------------------------------
     CONFIG
     ------------------------------------------------------------ */
  const CONFIG = {
    /* The collection that User Management reads and writes.
       Change this to "approved_users" or "users" if your employee
       records live in a different collection. */
    USERS_COLLECTION: "employees",

    /* Column(s) checked for EMP-ID uniqueness across collections.
       Prevents creating two records with the same FXF ID. */
    UNIQUENESS_COLLECTIONS: ["employees", "users", "approved_users"],

    TOAST_MS: 2600
  };

  const ROLES = ["Employee", "Team Leader", "Manager", "Admin"];

  /* ------------------------------------------------------------
     STATE
     ------------------------------------------------------------ */
  const state = {
    users: [],
    selected: new Set(),
    filters: {
      search: "",
      role: "",
      region: "",
      status: "",
      sort: "newest"
    },
    editing: null,       // user being edited, or null for new
    deleting: null,      // { ids: [..], users: [..] }
    loaded: false
  };

  let unsubscribe = null;

  /* ------------------------------------------------------------
     HELPERS
     ------------------------------------------------------------ */
  const $ = id => document.getElementById(id);

  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function initials(first, last, empId) {
    const f = String(first || "").trim();
    const l = String(last || "").trim();
    if (f && l) return (f[0] + l[0]).toUpperCase();
    if (f) return f.slice(0, 2).toUpperCase();
    return String(empId || "??").slice(0, 2).toUpperCase();
  }

  function toDate(v) {
    if (!v) return null;
    if (typeof v.toDate === "function") return v.toDate();
    if (typeof v.seconds === "number") return new Date(v.seconds * 1000);
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function fmtDate(v) {
    const d = toDate(v);
    if (!d) return "—";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function roleClass(role) {
    const r = String(role || "").toLowerCase();
    if (r === "admin") return "um-pill-role-admin";
    if (r === "manager") return "um-pill-role-manager";
    if (r === "team leader") return "um-pill-role-teamleader";
    return "um-pill-role-employee";
  }

  function normalizeUser(doc) {
    const d = doc.data() || {};
    const empId = String(d.empId || d.employeeId || d.emp_id || "").trim();
    const firstName = String(d.firstName || "").trim();
    const lastName  = String(d.lastName || "").trim();
    const composed  = [firstName, lastName].filter(Boolean).join(" ");
    const name = String(
      d.name || d.displayName || d.fullName || composed || empId || doc.id
    ).trim();

    const active = d.active !== false && d.status !== "inactive";

    return {
      id: doc.id,
      empId: empId || doc.id,
      firstName,
      lastName,
      name,
      email: String(d.email || "").trim(),
      role: String(d.role || "Employee").trim(),
      region: String(d.region || d.country || d.location || "").trim(),
      active,
      createdAt: d.createdAt || d.updatedAt || d.dateAdded || null
    };
  }

  function showToast(msg, type = "success") {
    const el = $("umToast");
    if (!el) return;
    el.textContent = msg;
    el.className = "um-toast is-visible" + (type === "error" ? " is-error" : type === "success" ? " is-success" : "");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { el.className = "um-toast"; }, CONFIG.TOAST_MS);
  }

  function describeError(err) {
    if (!err) return "Something went wrong.";
    const code = String(err.code || "").toLowerCase();
    if (code.includes("permission-denied")) return "Permission denied. Check your Firestore rules.";
    if (code.includes("unavailable") || code.includes("network")) return "Network unavailable. Please try again.";
    return err.message || "Something went wrong.";
  }

  function debounce(fn, wait = 200) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  /* ------------------------------------------------------------
     LOADER
     ------------------------------------------------------------ */
  let loaderHidden = false;
  function hideLoader() {
    if (loaderHidden) return;
    loaderHidden = true;
    const el = $("pageLoader");
    if (el) {
      el.style.transition = "opacity .35s ease";
      el.style.opacity = "0";
      setTimeout(() => el.parentNode && el.parentNode.removeChild(el), 380);
    }
    document.documentElement.classList.remove("page-loading");
    document.documentElement.removeAttribute("aria-busy");
  }

  /* ------------------------------------------------------------
     REALTIME LOAD
     ------------------------------------------------------------ */
  function attachRealtime() {
    const db = window.db;
    if (!db) { hideLoader(); return; }

    try {
      unsubscribe = db.collection(CONFIG.USERS_COLLECTION).onSnapshot(
        snap => {
          state.users = snap.docs.map(normalizeUser);
          state.loaded = true;

          // Drop any selected IDs that no longer exist
          const existing = new Set(state.users.map(u => u.id));
          state.selected.forEach(id => { if (!existing.has(id)) state.selected.delete(id); });

          renderStats();
          renderRegions();
          renderTable();
          syncSelectionUI();
          setTimeout(hideLoader, 200);
        },
        err => {
          console.error("[user-mgmt] listener failed:", err);
          showToast(describeError(err), "error");
          hideLoader();
        }
      );
    } catch (err) {
      console.error(err);
      hideLoader();
    }

    // Safety net
    setTimeout(hideLoader, 5000);
  }

  /* ------------------------------------------------------------
     FILTER / SORT
     ------------------------------------------------------------ */
  function filteredUsers() {
    const f = state.filters;
    const q = f.search.toLowerCase();
    let rows = state.users.filter(u => {
      if (f.role && u.role !== f.role) return false;
      if (f.region && u.region !== f.region) return false;
      if (f.status === "active" && !u.active) return false;
      if (f.status === "inactive" && u.active) return false;
      if (q) {
        const hay = (u.name + " " + u.empId + " " + u.email + " " + u.role + " " + u.region).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    switch (f.sort) {
      case "oldest":
        rows.sort((a, b) => (toDate(a.createdAt)?.getTime() || 0) - (toDate(b.createdAt)?.getTime() || 0));
        break;
      case "name":
        rows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
        break;
      case "role":
        rows.sort((a, b) => (a.role || "").localeCompare(b.role || ""));
        break;
      default: // newest
        rows.sort((a, b) => (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0));
    }
    return rows;
  }

  /* ------------------------------------------------------------
     RENDER — STATS
     ------------------------------------------------------------ */
  function renderStats() {
    const users = state.users;
    const total = users.length;
    const active = users.filter(u => u.active).length;
    const inactive = total - active;
    const elevated = users.filter(u => {
      const r = u.role.toLowerCase();
      return r === "admin" || r === "manager";
    }).length;

    $("umStatTotal").textContent = total;
    $("umStatActive").textContent = active;
    $("umStatInactive").textContent = inactive;
    $("umStatAdmin").textContent = elevated;
  }

  /* ------------------------------------------------------------
     RENDER — REGION DROPDOWN OPTIONS
     ------------------------------------------------------------ */
  function renderRegions() {
    const sel = $("umRegionFilter");
    if (!sel) return;
    const current = sel.value;
    const regions = Array.from(new Set(
      state.users.map(u => u.region).filter(Boolean)
    )).sort();
    sel.innerHTML = `<option value="">All regions</option>` +
      regions.map(r => `<option value="${esc(r)}">${esc(r)}</option>`).join("");
    if (regions.includes(current)) sel.value = current;
  }

  /* ------------------------------------------------------------
     RENDER — TABLE
     ------------------------------------------------------------ */
  function renderTable() {
    const tbody = $("umTableBody");
    const empty = $("umEmptyState");
    const emptyTitle = $("umEmptyTitle");
    const emptyText = $("umEmptyText");
    const emptyAddBtn = $("umEmptyAddBtn");
    const footer = $("umFooterInfo");
    if (!tbody) return;

    const rows = filteredUsers();
    const hasAnyUsers = state.users.length > 0;
    const hasFilters =
      state.filters.search || state.filters.role ||
      state.filters.region || state.filters.status;

    if (!rows.length) {
      tbody.innerHTML = "";
      empty.hidden = false;
      if (!hasAnyUsers) {
        emptyTitle.textContent = "No users yet";
        emptyText.textContent = "Add your first employee to get started.";
        emptyAddBtn.hidden = false;
      } else if (hasFilters) {
        emptyTitle.textContent = "No users match your filters";
        emptyText.textContent = "Try clearing the search or filter options.";
        emptyAddBtn.hidden = true;
      } else {
        emptyTitle.textContent = "No users yet";
        emptyText.textContent = "Add your first employee to get started.";
        emptyAddBtn.hidden = false;
      }
      footer.textContent = "";
      return;
    }

    empty.hidden = true;
    tbody.innerHTML = rows.map(rowHtml).join("");
    footer.textContent = `Showing ${rows.length} of ${state.users.length} users`;
    bindRowEvents();
  }

  function rowHtml(u) {
    const isSelected = state.selected.has(u.id);
    return `
      <tr data-id="${esc(u.id)}" class="${isSelected ? "is-selected" : ""}">
        <td class="um-col-check">
          <input type="checkbox" class="um-checkbox" data-check="${esc(u.id)}" ${isSelected ? "checked" : ""} aria-label="Select ${esc(u.name)}">
        </td>
        <td>
          <div class="um-user-cell">
            <span class="um-avatar">${esc(initials(u.firstName, u.lastName, u.empId))}</span>
            <div>
              <div class="um-user-name">${esc(u.name)}</div>
            </div>
          </div>
        </td>
        <td>${esc(u.empId)}</td>
        <td>${esc(u.email || "—")}</td>
        <td><span class="um-pill ${roleClass(u.role)}">${esc(u.role)}</span></td>
        <td>${esc(u.region || "—")}</td>
        <td><span class="um-pill ${u.active ? "um-pill-status-active" : "um-pill-status-inactive"}">${u.active ? "Active" : "Inactive"}</span></td>
        <td>${esc(fmtDate(u.createdAt))}</td>
        <td class="um-col-actions">
          <div class="um-row-actions">
            <button type="button" class="um-row-action" data-edit="${esc(u.id)}" title="Edit user" aria-label="Edit ${esc(u.name)}">
              <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
            <button type="button" class="um-row-action danger" data-delete="${esc(u.id)}" title="Delete user" aria-label="Delete ${esc(u.name)}">
              <svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M6 6v14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6"/><path d="M10 11v6M14 11v6"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  function bindRowEvents() {
    document.querySelectorAll("#umTableBody [data-check]").forEach(cb => {
      cb.addEventListener("change", () => {
        if (cb.checked) state.selected.add(cb.dataset.check);
        else state.selected.delete(cb.dataset.check);
        cb.closest("tr")?.classList.toggle("is-selected", cb.checked);
        syncSelectionUI();
      });
    });

    document.querySelectorAll("#umTableBody [data-edit]").forEach(btn => {
      btn.addEventListener("click", () => {
        const user = state.users.find(u => u.id === btn.dataset.edit);
        if (user) openUserModal(user);
      });
    });

    document.querySelectorAll("#umTableBody [data-delete]").forEach(btn => {
      btn.addEventListener("click", () => {
        const user = state.users.find(u => u.id === btn.dataset.delete);
        if (user) openDeleteModal([user]);
      });
    });
  }

  /* ------------------------------------------------------------
     SELECTION UI
     ------------------------------------------------------------ */
  function syncSelectionUI() {
    const bar = $("umBulkBar");
    const count = $("umBulkCount");
    const selectAll = $("umSelectAll");
    const visible = filteredUsers();
    const selectedVisible = visible.filter(u => state.selected.has(u.id)).length;

    if (state.selected.size > 0) {
      bar.hidden = false;
      count.textContent = `${state.selected.size} selected`;
    } else {
      bar.hidden = true;
    }

    if (selectAll) {
      selectAll.checked = visible.length > 0 && selectedVisible === visible.length;
      selectAll.indeterminate = selectedVisible > 0 && selectedVisible < visible.length;
    }
  }

  /* ------------------------------------------------------------
     ADD / EDIT MODAL
     ------------------------------------------------------------ */
  function openUserModal(user) {
    state.editing = user || null;
    const modal = $("umUserModal");
    const kicker = $("umModalKicker");
    const title = $("umModalTitle");
    const submitLabel = document.querySelector("#umSubmitBtn .um-submit-label");
    const errEl = $("umFormError");
    if (errEl) errEl.textContent = "";

    const fieldEmpId = $("umFieldEmpId");
    const fieldFirst = $("umFieldFirstName");
    const fieldLast = $("umFieldLastName");
    const fieldEmail = $("umFieldEmail");
    const fieldRole = $("umFieldRole");
    const fieldRegion = $("umFieldRegion");
    const fieldActive = $("umFieldActive");

    if (user) {
      kicker.textContent = "EDIT EMPLOYEE";
      title.textContent = "Edit User";
      if (submitLabel) submitLabel.textContent = "Save Changes";
      $("umEditingId").value = user.id;
      $("umEditingEmpId").value = user.empId;
      fieldEmpId.value = user.empId;
      fieldEmpId.disabled = true;   // EMP ID is the identity — not editable
      fieldFirst.value = user.firstName || (user.name || "").split(" ")[0] || "";
      fieldLast.value = user.lastName || (user.name || "").split(" ").slice(1).join(" ") || "";
      fieldEmail.value = user.email || "";
      fieldRole.value = user.role || "Employee";
      fieldRegion.value = user.region || "";
      fieldActive.checked = user.active;
    } else {
      kicker.textContent = "NEW EMPLOYEE";
      title.textContent = "Add New User";
      if (submitLabel) submitLabel.textContent = "Add User";
      $("umEditingId").value = "";
      $("umEditingEmpId").value = "";
      fieldEmpId.value = "";
      fieldEmpId.disabled = false;
      fieldFirst.value = "";
      fieldLast.value = "";
      fieldEmail.value = "";
      fieldRole.value = "";
      fieldRegion.value = "";
      fieldActive.checked = true;
    }

    updateToggleLabel();
    modal.hidden = false;
    setTimeout(() => {
      if (user) fieldFirst.focus();
      else fieldEmpId.focus();
    }, 80);
  }

  function closeUserModal() {
    $("umUserModal").hidden = true;
    state.editing = null;
  }

  function updateToggleLabel() {
    const cb = $("umFieldActive");
    const label = $("umToggleLabel");
    if (!cb || !label) return;
    label.textContent = cb.checked ? "Active — can log in" : "Inactive — access blocked";
  }

  /* ------------------------------------------------------------
     SAVE USER
     ------------------------------------------------------------ */
  async function saveUser(e) {
    e.preventDefault();
    const errEl = $("umFormError");
    if (errEl) errEl.textContent = "";

    const empId = $("umFieldEmpId").value.trim().replace(/\s+/g, "");
    const first = $("umFieldFirstName").value.trim();
    const last  = $("umFieldLastName").value.trim();
    const email = $("umFieldEmail").value.trim().toLowerCase();
    const role  = $("umFieldRole").value;
    const region = $("umFieldRegion").value.trim();
    const active = $("umFieldActive").checked;

    const editingId = $("umEditingId").value;

    // Validation
    if (!empId || empId.length < 3 || empId.length > 20) {
      return showFormError("EMP ID must be between 3 and 20 characters.");
    }
    if (!first) return showFormError("First name is required.");
    if (!last)  return showFormError("Last name is required.");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return showFormError("Enter a valid email address.");
    }
    if (!role) return showFormError("Please select a role.");

    const submitBtn = $("umSubmitBtn");
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");

    try {
      const db = window.db;

      // EMP-ID uniqueness check (on add only)
      if (!editingId) {
        const taken = await empIdExists(empId);
        if (taken) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("loading");
          return showFormError(`EMP ID "${empId}" is already registered to another user.`);
        }
      }

      const payload = {
        empId,
        firstName: first,
        lastName: last,
        name: `${first} ${last}`.trim(),
        email,
        role,
        region,
        active,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      if (editingId) {
        await db.collection(CONFIG.USERS_COLLECTION).doc(editingId).update(payload);
        showToast(`Updated ${first} ${last}.`, "success");
      } else {
        payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection(CONFIG.USERS_COLLECTION).add(payload);
        showToast(`Added ${first} ${last}.`, "success");
      }

      closeUserModal();
    } catch (err) {
      console.error("[user-mgmt] save failed:", err);
      showFormError(describeError(err));
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
    }
  }

  async function empIdExists(empId) {
    const db = window.db;
    for (const col of CONFIG.UNIQUENESS_COLLECTIONS) {
      try {
        const snap = await db.collection(col)
          .where("empId", "==", empId)
          .limit(1).get();
        if (!snap.empty) return true;
      } catch (_) {
        // try alternate field names below
      }
      try {
        const snap = await db.collection(col)
          .where("employeeId", "==", empId)
          .limit(1).get();
        if (!snap.empty) return true;
      } catch (_) {}
    }
    return false;
  }

  function showFormError(msg) {
    const errEl = $("umFormError");
    if (errEl) errEl.textContent = msg;
  }

  /* ------------------------------------------------------------
     DELETE MODAL
     ------------------------------------------------------------ */
  function openDeleteModal(users) {
    state.deleting = { users };
    const modal = $("umDeleteModal");
    const namesEl = $("umDeleteNames");
    const copy = $("umDeleteCopy");
    const input = $("umDeleteConfirmInput");
    const btn = $("umDeleteConfirmBtn");
    const errEl = $("umDeleteError");

    if (errEl) errEl.textContent = "";
    if (input) input.value = "";
    if (btn) btn.disabled = true;

    if (users.length === 1) {
      copy.textContent = "This permanently removes this user from Firestore. This cannot be undone.";
      namesEl.innerHTML = `<div>${esc(users[0].name)} — ${esc(users[0].empId)}</div>`;
    } else {
      copy.textContent = `This permanently removes ${users.length} users from Firestore. This cannot be undone.`;
      namesEl.innerHTML = users.map(u => `<div>${esc(u.name)} — ${esc(u.empId)}</div>`).join("");
    }

    modal.hidden = false;
    setTimeout(() => input && input.focus(), 80);
  }

  function closeDeleteModal() {
    $("umDeleteModal").hidden = true;
    state.deleting = null;
  }

  async function confirmDelete() {
    const input = $("umDeleteConfirmInput");
    if (!input || input.value.trim() !== "DELETE") return;
    if (!state.deleting) return;

    const users = state.deleting.users;
    const btn = $("umDeleteConfirmBtn");
    const errEl = $("umDeleteError");
    if (errEl) errEl.textContent = "";

    btn.disabled = true;
    btn.classList.add("loading");

    try {
      const db = window.db;
      const batch = db.batch();
      users.forEach(u => {
        batch.delete(db.collection(CONFIG.USERS_COLLECTION).doc(u.id));
      });
      await batch.commit();
      users.forEach(u => state.selected.delete(u.id));
      showToast(`Deleted ${users.length} user${users.length === 1 ? "" : "s"}.`, "success");
      closeDeleteModal();
      syncSelectionUI();
    } catch (err) {
      console.error("[user-mgmt] delete failed:", err);
      if (errEl) errEl.textContent = describeError(err);
    } finally {
      btn.disabled = false;
      btn.classList.remove("loading");
    }
  }

  /* ------------------------------------------------------------
     BULK ACTIONS
     ------------------------------------------------------------ */
  async function bulkAction(action) {
    const ids = Array.from(state.selected);
    if (!ids.length) return;

    if (action === "clear") {
      state.selected.clear();
      renderTable();
      syncSelectionUI();
      return;
    }

    if (action === "delete") {
      const users = state.users.filter(u => ids.includes(u.id));
      openDeleteModal(users);
      return;
    }

    // activate / deactivate
    const target = action === "activate";
    const users = state.users.filter(u => ids.includes(u.id) && u.active !== target);
    if (!users.length) {
      showToast(`All selected users are already ${target ? "active" : "inactive"}.`, "success");
      return;
    }

    try {
      const db = window.db;
      const batch = db.batch();
      users.forEach(u => {
        batch.update(db.collection(CONFIG.USERS_COLLECTION).doc(u.id), {
          active: target,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
      await batch.commit();
      showToast(`${target ? "Activated" : "Deactivated"} ${users.length} user${users.length === 1 ? "" : "s"}.`, "success");
    } catch (err) {
      console.error("[user-mgmt] bulk update failed:", err);
      showToast(describeError(err), "error");
    }
  }

  /* ------------------------------------------------------------
     EXPORT CSV
     ------------------------------------------------------------ */
  function exportCsv() {
    const rows = filteredUsers();
    if (!rows.length) {
      showToast("No users to export.", "error");
      return;
    }

    const header = ["Name", "EMP ID", "First Name", "Last Name", "Email", "Role", "Region", "Status", "Date Added"];
    const data = rows.map(u => [
      u.name,
      u.empId,
      u.firstName,
      u.lastName,
      u.email,
      u.role,
      u.region,
      u.active ? "Active" : "Inactive",
      fmtDate(u.createdAt)
    ]);

    const csv = [header, ...data]
      .map(r => r.map(csvVal).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${rows.length} user${rows.length === 1 ? "" : "s"}.`, "success");
  }

  function csvVal(v) {
    const s = String(v == null ? "" : v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }

  /* ------------------------------------------------------------
     EVENT WIRING
     ------------------------------------------------------------ */
  function bindEvents() {
    // Add
    $("umAddUserBtn")?.addEventListener("click", () => openUserModal(null));
    $("umEmptyAddBtn")?.addEventListener("click", () => openUserModal(null));
    $("umExportBtn")?.addEventListener("click", exportCsv);

    // Filters
    $("umSearch")?.addEventListener("input", debounce(e => {
      state.filters.search = e.target.value.trim();
      renderTable();
      syncSelectionUI();
    }));
    $("umRoleFilter")?.addEventListener("change", e => {
      state.filters.role = e.target.value;
      renderTable();
      syncSelectionUI();
    });
    $("umRegionFilter")?.addEventListener("change", e => {
      state.filters.region = e.target.value;
      renderTable();
      syncSelectionUI();
    });
    $("umStatusFilter")?.addEventListener("change", e => {
      state.filters.status = e.target.value;
      renderTable();
      syncSelectionUI();
    });
    $("umSort")?.addEventListener("change", e => {
      state.filters.sort = e.target.value;
      renderTable();
      syncSelectionUI();
    });

    // Select all
    $("umSelectAll")?.addEventListener("change", e => {
      const visible = filteredUsers();
      if (e.target.checked) visible.forEach(u => state.selected.add(u.id));
      else visible.forEach(u => state.selected.delete(u.id));
      renderTable();
      syncSelectionUI();
    });

    // Bulk actions
    document.querySelectorAll("[data-bulk]").forEach(btn => {
      btn.addEventListener("click", () => bulkAction(btn.dataset.bulk));
    });

    // User modal
    $("umUserForm")?.addEventListener("submit", saveUser);
    $("umFieldActive")?.addEventListener("change", updateToggleLabel);
    document.querySelectorAll('[data-close-modal="user"]').forEach(el => {
      el.addEventListener("click", closeUserModal);
    });

    // Delete modal
    $("umDeleteConfirmInput")?.addEventListener("input", e => {
      $("umDeleteConfirmBtn").disabled = e.target.value.trim() !== "DELETE";
    });
    $("umDeleteConfirmBtn")?.addEventListener("click", confirmDelete);
    document.querySelectorAll('[data-close-modal="delete"]').forEach(el => {
      el.addEventListener("click", closeDeleteModal);
    });

    // Escape
    document.addEventListener("keydown", e => {
      if (e.key !== "Escape") return;
      if (!$("umUserModal").hidden) closeUserModal();
      else if (!$("umDeleteModal").hidden) closeDeleteModal();
    });
  }

  /* ------------------------------------------------------------
     INIT
     ------------------------------------------------------------ */
  function init() {
    bindEvents();
    attachRealtime();

    window.addEventListener("beforeunload", () => {
      try { unsubscribe && unsubscribe(); } catch (_) {}
    });

    // Public API (for debugging)
    window.UserManagement = { state };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
