(function () {
    "use strict";

    const TEMPLATE_COLLECTION = "billing_dispute_general_template";
    const USERS_COLLECTION = "approved_users";
    const $ = id => document.getElementById(id);
    let approvedUsers = [];
    let userSearch = "";

    const config = {
        overview: { title: "Administrative Workspace", description: "Select a module to manage your Decision Support System.", action: "New Item" },
        users: { title: "User Management", description: "Manage all approved users, roles and account access.", action: "Add User" },
        templates: { title: "Template Manager", description: "Manage Suggested Comment, CORR Code and Suggested Email content used by final recommendations.", action: "Create Template" },
        announcements: { title: "Announcement Center", description: "Create, publish and manage announcements displayed to system users.", action: "New Announcement" },
        guides: { title: "Guide Management", description: "Manage guide registration, categories, visibility and metadata.", action: "Register Guide" },
        permissions: { title: "Roles & Permissions", description: "Review administrator roles and access capabilities.", action: "Add Role" },
        settings: { title: "System Settings", description: "Configure application-wide settings and administrative preferences.", action: "Save Settings" }
    };

    function toast(message) {
        const target = $("toast");
        if (!target) return;
        target.textContent = message;
        target.classList.add("show");
        clearTimeout(toast.timer);
        toast.timer = setTimeout(() => target.classList.remove("show"), 2600);
    }

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char]));
    }

    function getDb() {
        return window.db || (window.firebase && firebase.firestore ? firebase.firestore() : null);
    }

    function overviewContent() {
        const cards = [
            ["users", "blue", "fa-users", "User Management", "Manage all approved users, roles and account access.", "Manage users"],
            ["templates", "orange", "fa-file-lines", "Template Manager", "Create and maintain comments, CORR guidance and email responses.", "Manage templates"],
            ["announcements", "red", "fa-bullhorn", "Announcement Center", "Publish system announcements, alerts and important notices.", "Manage announcements"],
            ["guides", "purple", "fa-book-open", "Guide Management", "Review guide registration, visibility and guide metadata.", "Manage guides"],
            ["permissions", "green", "fa-user-shield", "Roles & Permissions", "Control administrator access and permission assignments.", "Manage permissions"],
            ["settings", "blue", "fa-gear", "System Settings", "Configure system preferences and operational options.", "Open settings"]
        ];
        return `<div class="admin-module-grid">${cards.map(c => `<button class="admin-module-card" type="button" data-section="${c[0]}"><span class="admin-module-icon ${c[1]}"><i class="fa-solid ${c[2]}"></i></span><h3>${c[3]}</h3><p>${c[4]}</p><span class="admin-module-footer">${c[5]}<i class="fa-solid fa-arrow-right"></i></span></button>`).join("")}</div>`;
    }

    function genericContent(section) {
        if (section === "templates") return `<div class="admin-empty-state"><i class="fa-solid fa-file-lines"></i><h3>Template Manager</h3><p>Template management will be connected next.</p></div>`;
        return `<div class="admin-empty-state"><i class="fa-solid fa-${section === "announcements" ? "bullhorn" : section === "guides" ? "book-open" : section === "permissions" ? "user-shield" : "gear"}"></i><h3>${config[section].title}</h3><p>This management module will be connected next.</p></div>`;
    }

    function renderUserRows() {
        const query = userSearch.trim().toLowerCase();
        const filtered = approvedUsers.filter(user => {
            const text = [user.id, user.name, user.email, user.role, user.region, user.status].join(" ").toLowerCase();
            return !query || text.includes(query);
        });

        if (!filtered.length) return `<div class="admin-empty-state"><i class="fa-solid fa-user-slash"></i><h3>No approved users found</h3><p>Try another search term.</p></div>`;

        return `<div class="admin-users-table-wrap"><table class="admin-users-table"><thead><tr><th>User</th><th>Role</th><th>Region</th><th>Status</th><th>Action</th></tr></thead><tbody>${filtered.map(user => {
            const docId = encodeURIComponent(user.id);
            return `<tr><td><strong>${escapeHtml(user.name || user.email || user.id)}</strong><small>${escapeHtml(user.email || user.id)}</small></td><td><select class="admin-role-select" data-user-id="${docId}"><option value="Team Leader" ${user.role.toLowerCase() === "team leader" ? "selected" : ""}>Team Leader</option><option value="Manager" ${user.role.toLowerCase() === "manager" ? "selected" : ""}>Manager</option><option value="User" ${user.role.toLowerCase() === "user" ? "selected" : ""}>User</option></select></td><td>${escapeHtml(user.region || "All regions")}</td><td><span class="admin-user-status ${user.active === false ? "inactive" : "active"}">${user.active === false ? "Inactive" : "Active"}</span></td><td><button class="admin-save-role" type="button" data-user-id="${docId}">Save role</button></td></tr>`;
        }).join("")}</tbody></table></div>`;
    }

    function usersContent() {
        return `<div class="admin-users-toolbar"><div><strong>${approvedUsers.length}</strong> approved users</div><input id="adminUserSearch" type="search" placeholder="Search name, email or role..." value="${escapeHtml(userSearch)}"></div>${renderUserRows()}`;
    }

    async function loadApprovedUsers() {
        const db = getDb();
        if (!db) { console.error("Admin: Firebase/Firestore is not initialized."); toast("Firebase is not initialized."); return; }
        try {
            const snapshot = await db.collection(USERS_COLLECTION).get();
            approvedUsers = snapshot.docs.map(doc => {
                const data = doc.data() || {};
                return { id: doc.id, email: data.email || doc.id, name: data.name || data.displayName || doc.id, role: String(data.role || "User").trim(), region: data.region || data.country || "All regions", active: data.active !== false };
            }).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
            $("userCount").textContent = approvedUsers.length;
            if ($("workspaceTitle")?.textContent === "User Management") render("users");
        } catch (error) {
            console.error("Unable to load approved users:", error.code || "unknown", error.message || error);
            toast(error.code === "permission-denied" ? "Firestore permission denied for approved_users." : "Unable to load approved users.");
        }
    }

    async function saveRole(docId, role) {
        const db = getDb();
        if (!db) { console.error("Admin: Firebase/Firestore is not initialized."); toast("Firebase is not initialized."); return; }
        try {
            await db.collection(USERS_COLLECTION).doc(docId).update({ role: role });
            const user = approvedUsers.find(item => item.id === docId);
            if (user) user.role = role;
            toast(`Role updated to ${role}.`);
            render("users");
        } catch (error) {
            console.error("Unable to update user role:", error.code || "unknown", error.message || error);
            toast(error.code === "permission-denied" ? "Firestore denied this role update." : "Role update failed.");
        }
    }

    function bindUserControls() {
        $("adminUserSearch")?.addEventListener("input", event => {
            userSearch = event.target.value;
            render("users");
            $("adminUserSearch")?.focus();
            $("adminUserSearch").setSelectionRange(userSearch.length, userSearch.length);
        });
        document.querySelectorAll(".admin-save-role").forEach(button => button.addEventListener("click", () => {
            const docId = decodeURIComponent(button.dataset.userId);
            const select = document.querySelector(`.admin-role-select[data-user-id="${button.dataset.userId}"]`);
            if (select) saveRole(docId, select.value);
        }));
    }

    function render(section) {
        const current = config[section] || config.overview;
        $("workspaceTitle").textContent = current.title;
        $("workspaceDescription").textContent = current.description;
        $("workspaceAction").innerHTML = `<i class="fa-solid fa-plus"></i> ${current.action}`;
        $("workspaceContent").innerHTML = section === "overview" ? overviewContent() : section === "users" ? usersContent() : genericContent(section);
        document.querySelectorAll(".admin-side-tab").forEach(button => button.classList.toggle("active", button.dataset.section === section));
        document.querySelectorAll("[data-section]").forEach(button => {
            if (!button.classList.contains("admin-side-tab")) button.onclick = () => render(button.dataset.section);
        });
        if (section === "users") bindUserControls();
    }

    async function loadCounts() {
        const db = getDb();
        if (!db) { console.error("Admin: Firebase/Firestore is not initialized."); toast("Firebase is not initialized."); return; }
        try {
            const [users, templates] = await Promise.all([db.collection(USERS_COLLECTION).get(), db.collection(TEMPLATE_COLLECTION).get()]);
            $("userCount").textContent = users.size;
            $("templateCount").textContent = templates.size;
        } catch (error) { console.warn("Admin counts unavailable:", error); }
    }

    document.addEventListener("DOMContentLoaded", function () {
        render("overview");
        loadCounts();
        loadApprovedUsers();
        document.querySelectorAll(".admin-side-tab").forEach(button => button.onclick = () => render(button.dataset.section));
        document.querySelectorAll(".admin-hero-actions [data-section]").forEach(button => button.onclick = () => { render(button.dataset.section); $("workspaceContent").scrollIntoView({ behavior: "smooth", block: "start" }); });
        $("refreshBtn")?.addEventListener("click", () => { loadCounts(); loadApprovedUsers(); $("lastUpdated").textContent = `Updated ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`; toast("Admin dashboard refreshed."); });
        $("workspaceAction")?.addEventListener("click", () => toast("Select a management module to continue."));
    });
})();
