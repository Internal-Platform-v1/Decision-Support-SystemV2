(function () {
    "use strict";

    const TEMPLATE_COLLECTION = "billing_dispute_general_template";
    const $ = (id) => document.getElementById(id);

    const config = {
        overview: {
            title: "Administrative Workspace",
            description: "Select a module to manage your Decision Support System.",
            action: "New Item",
            content: `<div class="admin-module-grid">
                ${card("users", "blue", "fa-users", "User Management", "Manage employees, administrators, access status and roles.", "Manage users")}
                ${card("templates", "orange", "fa-file-lines", "Template Manager", "Create and maintain comments, CORR guidance and email responses.", "Manage templates")}
                ${card("announcements", "red", "fa-bullhorn", "Announcement Center", "Publish system announcements, alerts and important notices.", "Manage announcements")}
                ${card("guides", "purple", "fa-book-open", "Guide Management", "Review guide registration, visibility and guide metadata.", "Manage guides")}
                ${card("permissions", "green", "fa-user-shield", "Roles & Permissions", "Control administrator access and permission assignments.", "Manage permissions")}
                ${card("settings", "blue", "fa-gear", "System Settings", "Configure system preferences and operational options.", "Open settings")}
            </div>`
        },
        users: { title: "User Management", description: "Manage registered users, roles, regions and account access.", action: "Add User", content: table("User Name", "Role", "Region", "Status", [["approved_users collection", "Manager / Team Leader", "All regions", "Connected"]]) },
        templates: { title: "Template Manager", description: "Manage Suggested Comment, CORR Code and Suggested Email content used by final recommendations.", action: "Create Template", content: table("Template Type", "Collection", "Purpose", "Status", [["Suggested Comment", TEMPLATE_COLLECTION, "Internal case notes", "Ready"], ["Suggested CORR Code", TEMPLATE_COLLECTION, "Correction guidance", "Ready"], ["Suggested Email", TEMPLATE_COLLECTION, "Customer communication", "Ready"]]) },
        announcements: { title: "Announcement Center", description: "Create, publish and manage announcements displayed to system users.", action: "New Announcement", content: empty("fa-bullhorn", "No announcements loaded yet.", "The announcement collection and publishing workflow will be connected here.") },
        guides: { title: "Guide Management", description: "Manage guide registration, categories, visibility and metadata.", action: "Register Guide", content: empty("fa-book-open", "Guide management workspace", "Use this area to control which guides appear in the main dashboard.") },
        permissions: { title: "Roles & Permissions", description: "Review administrator roles and the access capabilities assigned to each role.", action: "Add Role", content: table("Role", "Access Level", "Scope", "Status", [["System Administrator", "Full access", "All system modules", "Protected"], ["Manager", "Management access", "Assigned region", "Configured"], ["Team Leader", "Operational access", "Assigned team", "Configured"]]) },
        settings: { title: "System Settings", description: "Configure application-wide settings and administrative preferences.", action: "Save Settings", content: empty("fa-gear", "System settings", "Settings controls will be added as each system feature is connected.") }
    };

    function card(section, color, icon, title, text, footer) {
        return `<button class="admin-module-card" type="button" data-section="${section}"><span class="admin-module-icon ${color}"><i class="fa-solid ${icon}"></i></span><h3>${title}</h3><p>${text}</p><span class="admin-module-footer">${footer}<i class="fa-solid fa-arrow-right"></i></span></button>`;
    }

    function empty(icon, title, text) {
        return `<div class="admin-empty-state"><i class="fa-solid ${icon}"></i><h3>${title}</h3><p>${text}</p></div>`;
    }

    function table(a, b, c, d, rows) {
        return `<div class="admin-data-preview"><div class="admin-data-row header"><span>${a}</span><span>${b}</span><span>${c}</span><span>${d}</span></div>${rows.map(row => `<div class="admin-data-row"><span>${row[0]}</span><span>${row[1]}</span><span>${row[2]}</span><span><span class="admin-badge">${row[3]}</span></span></div>`).join("")}</div>`;
    }

    function toast(message) {
        const target = $("toast");
        if (!target) return;
        target.textContent = message;
        target.classList.add("show");
        clearTimeout(toast.timer);
        toast.timer = setTimeout(() => target.classList.remove("show"), 2400);
    }

    function render(section) {
        const current = config[section] || config.overview;
        $("workspaceTitle").textContent = current.title;
        $("workspaceDescription").textContent = current.description;
        $("workspaceAction").innerHTML = `<i class="fa-solid fa-plus"></i> ${current.action}`;
        $("workspaceContent").innerHTML = current.content;

        document.querySelectorAll(".admin-side-tab").forEach(button => {
            button.classList.toggle("active", button.dataset.section === section);
        });

        document.querySelectorAll("[data-section]").forEach(button => {
            if (!button.classList.contains("admin-side-tab")) {
                button.onclick = () => render(button.dataset.section);
            }
        });
    }

    async function loadCounts() {
        const db = window.db || (window.firebase && firebase.firestore ? firebase.firestore() : null);
        if (!db) return;

        try {
            const [users, templates] = await Promise.all([
                db.collection("approved_users").get(),
                db.collection(TEMPLATE_COLLECTION).get()
            ]);

            $("userCount").textContent = users.size;
            $("templateCount").textContent = templates.size;
        } catch (error) {
            console.warn("Admin counts unavailable:", error);
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        render("overview");
        loadCounts();

        document.querySelectorAll(".admin-side-tab").forEach(button => {
            button.onclick = () => render(button.dataset.section);
        });

        document.querySelectorAll(".admin-hero-actions [data-section]").forEach(button => {
            button.onclick = () => {
                render(button.dataset.section);
                $("workspaceContent").scrollIntoView({ behavior: "smooth", block: "start" });
            };
        });

        $("refreshBtn")?.addEventListener("click", function () {
            loadCounts();
            $("lastUpdated").textContent = `Updated ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
            toast("Admin dashboard refreshed.");
        });

        $("workspaceAction")?.addEventListener("click", () => toast("This management action will be connected next."));
    });
})();
