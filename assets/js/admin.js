const TEMPLATE_COLLECTION = "billing_dispute_general_template";

const $ = id => document.getElementById(id);

const config = {
    overview: {
        title: "Administrative Workspace",
        description: "Select a module to manage your Decision Support System.",
        action: "New Item",
        content: `
            <div class="module-grid">
                ${card(
                    "users",
                    "blue",
                    "fa-users",
                    "User Management",
                    "Manage employees, administrators, access status and roles.",
                    "Manage users"
                )}

                ${card(
                    "templates",
                    "orange",
                    "fa-file-lines",
                    "Template Manager",
                    "Create and maintain comments, CORR guidance and email responses.",
                    "Manage templates"
                )}

                ${card(
                    "announcements",
                    "red",
                    "fa-bullhorn",
                    "Announcement Center",
                    "Publish system announcements, alerts and important notices.",
                    "Manage announcements"
                )}

                ${card(
                    "guides",
                    "purple",
                    "fa-book-open",
                    "Guide Management",
                    "Review guide registration, visibility and guide metadata.",
                    "Manage guides"
                )}

                ${card(
                    "permissions",
                    "green",
                    "fa-user-shield",
                    "Roles & Permissions",
                    "Control administrator access and permission assignments.",
                    "Manage permissions"
                )}

                ${card(
                    "settings",
                    "blue",
                    "fa-gear",
                    "System Settings",
                    "Configure system preferences and operational options.",
                    "Open settings"
                )}
            </div>
        `
    },

    users: {
        title: "User Management",
        description: "Manage registered users, roles, regions and account access.",
        action: "Add User",
        content: table(
            "User Name",
            "Role",
            "Region",
            "Status",
            [
                [
                    "User management will connect to your approved_users collection.",
                    "Administrator",
                    "All regions",
                    "Planned"
                ]
            ]
        )
    },

    templates: {
        title: "Template Manager",
        description:
            "Manage the Suggested Comment, CORR Code and Suggested Email content used by final recommendations.",
        action: "Create Template",
        content: table(
            "Template Type",
            "Collection",
            "Purpose",
            "Status",
            [
                [
                    "Suggested Comment",
                    TEMPLATE_COLLECTION,
                    "Internal case notes",
                    "Ready"
                ],
                [
                    "Suggested CORR Code",
                    TEMPLATE_COLLECTION,
                    "Correction guidance",
                    "Ready"
                ],
                [
                    "Suggested Email",
                    TEMPLATE_COLLECTION,
                    "Customer communication",
                    "Ready"
                ]
            ]
        )
    },

    announcements: {
        title: "Announcement Center",
        description:
            "Create, publish and manage announcements displayed to system users.",
        action: "New Announcement",
        content: empty(
            "fa-bullhorn",
            "No announcements loaded yet.",
            "The announcement collection and publishing workflow will be connected here."
        )
    },

    guides: {
        title: "Guide Management",
        description:
            "Manage guide registration, categories, visibility and metadata.",
        action: "Register Guide",
        content: empty(
            "fa-book-open",
            "Guide management workspace",
            "Use this area to control which guides appear in the main dashboard."
        )
    },

    permissions: {
        title: "Roles & Permissions",
        description:
            "Review administrator roles and the access capabilities assigned to each role.",
        action: "Add Role",
        content: table(
            "Role",
            "Access Level",
            "Scope",
            "Status",
            [
                [
                    "System Administrator",
                    "Full access",
                    "All system modules",
                    "Protected"
                ],
                [
                    "Manager",
                    "Management access",
                    "Assigned region",
                    "Configured"
                ],
                [
                    "Team Leader",
                    "Operational access",
                    "Assigned team",
                    "Configured"
                ]
            ]
        )
    },

    settings: {
        title: "System Settings",
        description:
            "Configure application-wide settings and administrative preferences.",
        action: "Save Settings",
        content: empty(
            "fa-gear",
            "System settings",
            "Settings controls will be added as each system feature is connected."
        )
    }
};

function card(section, color, icon, title, description, footer) {
    return `
        <button class="module-card" data-section="${section}">
            <span class="module-icon ${color}">
                <i class="fa-solid ${icon}"></i>
            </span>

            <h3>${title}</h3>

            <p>${description}</p>

            <span class="module-footer">
                ${footer}
                <i class="fa-solid fa-arrow-right"></i>
            </span>
        </button>
    `;
}

function empty(icon, title, description) {
    return `
        <div class="empty-state">
            <i class="fa-solid ${icon}"></i>
            <h3>${title}</h3>
            <p>${description}</p>
        </div>
    `;
}

function table(columnA, columnB, columnC, columnD, rows) {
    return `
        <div class="data-preview">
            <div class="data-row header">
                <span>${columnA}</span>
                <span>${columnB}</span>
                <span>${columnC}</span>
                <span>${columnD}</span>
            </div>

            ${rows.map(row => `
                <div class="data-row">
                    <span>${row[0]}</span>
                    <span>${row[1]}</span>
                    <span>${row[2]}</span>
                    <span>
                        <span class="badge">${row[3]}</span>
                    </span>
                </div>
            `).join("")}
        </div>
    `;
}

function toast(message) {
    const toastElement = $("toast");

    if (!toastElement) return;

    toastElement.textContent = message;
    toastElement.classList.add("show");

    clearTimeout(toast.timer);

    toast.timer = setTimeout(() => {
        toastElement.classList.remove("show");
    }, 2400);
}

function render(section) {
    const currentConfig = config[section] || config.overview;

    const titleElement = $("workspaceTitle");
    const descriptionElement = $("workspaceDescription");
    const actionElement = $("workspaceAction");
    const contentElement = $("workspaceContent");

    if (titleElement) {
        titleElement.textContent = currentConfig.title;
    }

    if (descriptionElement) {
        descriptionElement.textContent = currentConfig.description;
    }

    if (actionElement) {
        actionElement.innerHTML = `
            <i class="fa-solid fa-plus"></i>
            ${currentConfig.action}
        `;
    }

    if (contentElement) {
        contentElement.innerHTML = currentConfig.content;
    }

    document.querySelectorAll(".side-tab").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.section === section
        );
    });

    document.querySelectorAll("[data-section]").forEach(button => {
        if (!button.classList.contains("side-tab")) {
            button.onclick = () => {
                render(button.dataset.section);
            };
        }
    });
}

async function loadCounts() {
    const db = window.db;

    if (!db || !db.collection) {
        console.warn("Admin: Firestore database is not available.");
        return;
    }

    try {
        const [usersSnapshot, templatesSnapshot] = await Promise.all([
            db.collection("approved_users").get(),
            db.collection(TEMPLATE_COLLECTION).get()
        ]);

        const userCount = $("userCount");
        const templateCount = $("templateCount");

        if (userCount) {
            userCount.textContent = usersSnapshot.size;
        }

        if (templateCount) {
            templateCount.textContent = templatesSnapshot.size;
        }
    } catch (error) {
        console.warn("Admin counts unavailable:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    render("overview");

    loadCounts();

    document.querySelectorAll(".side-tab").forEach(button => {
        button.onclick = () => {
            render(button.dataset.section);
        };
    });

    document.querySelectorAll(".hero-actions [data-section]").forEach(button => {
        button.onclick = () => {
            render(button.dataset.section);

            const workspacePanel = document.querySelector(
                ".workspace-panel"
            );

            if (workspacePanel) {
                workspacePanel.scrollIntoView({
                    behavior: "smooth"
                });
            }
        };
    });

    const refreshButton = $("refreshBtn");

    if (refreshButton) {
        refreshButton.onclick = () => {
            loadCounts();

            const lastUpdated = $("lastUpdated");

            if (lastUpdated) {
                lastUpdated.textContent =
                    `Updated ${new Date().toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit"
                    })}`;
            }

            toast("Admin dashboard refreshed.");
        };
    }

    const workspaceAction = $("workspaceAction");

    if (workspaceAction) {
        workspaceAction.onclick = () => {
            toast("This management action will be connected next.");
        };
    }
});
