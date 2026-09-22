(function () {
    "use strict";

    const TEMPLATE_COLLECTION = "billing_dispute_general_template";
    const USERS_COLLECTION = "approved_users";
    const GUIDE_REGISTRY = [{id:"debtor-update-per-bol",title:"Debtor Update per BOL",flowFile:"assets/js/guide-flows/debtor-update-per-bol.js",templateCollection:"debtor_update_per_bol_template"},{id:"debtor-update-per-loa",title:"Debtor Update per LOA",flowFile:"assets/js/guide-flows/debtor-update-per-loa.js",templateCollection:"debtor_update_per_loa_template"}];
    let templateState={guide:GUIDE_REGISTRY[0],nodes:{},key:"start",path:[],recommendation:""};

    const $ = id => document.getElementById(id);

    let approvedUsers = [];
    let userSearch = "";
    let currentSection = "overview";
    let editingUserId = null;

    const dashboardStats = {
        users: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        managers: 0,
        teamLeaders: 0,
        regularUsers: 0,
        regions: {},
        templates: 0,
        commentTemplates: 0,
        corrTemplates: 0,
        emailTemplates: 0,
        guides: GUIDE_REGISTRY.length,
        dataSources: 0,
        lastTemplateUpdate: null
    };

    const config = {
        overview: {
            title: "Admin Dashboard",
            description: "Live operational view of users, templates, guides and administration status.",
            action: "Add User"
        },
        users: {
            title: "User Management",
            description: "Manage all approved users, roles and account access.",
            action: "Add User"
        },
        templates: {
            title: "Template Manager",
            description: "Manage Suggested Comment, CORR Code and Suggested Email content used by final recommendations.",
            action: "Create Template"
        },
        announcements: {
            title: "Announcement Center",
            description: "Create, publish and manage announcements displayed to system users.",
            action: "New Announcement"
        },
        guides: {
            title: "Guide Management",
            description: "Manage guide registration, categories, visibility and metadata.",
            action: "Register Guide"
        },
        permissions: {
            title: "Roles & Permissions",
            description: "Review administrator roles and access capabilities.",
            action: "Add Role"
        },
        settings: {
            title: "System Settings",
            description: "Configure application-wide settings and administrative preferences.",
            action: "Save Settings"
        }
    };

    function toast(message) {
        const target = $("toast");
        if (!target) return;

        target.textContent = message;
        target.classList.add("show");

        clearTimeout(toast.timer);

        toast.timer = setTimeout(() => {
            target.classList.remove("show");
        }, 2600);
    }

    function escapeHtml(value) {
        return String(value ?? "").replace(
            /[&<>'"]/g,
            char => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "'": "&#039;",
                '"': "&quot;"
            }[char])
        );
    }

    function getDb() {
        return window.db ||
            (window.firebase && firebase.firestore
                ? firebase.firestore()
                : null);
    }

    function overviewContent() {
        const users = approvedUsers || [];
        const activeUsers = users.filter(user => user.active !== false);
        const inactiveUsers = users.filter(user => user.active === false);
        const managers = users.filter(user => String(user.role || "").toLowerCase() === "manager");
        const teamLeaders = users.filter(user => String(user.role || "").toLowerCase() === "team leader");
        const regularUsers = users.filter(user => {
            const role = String(user.role || "").toLowerCase();
            return role !== "manager" && role !== "team leader";
        });

        const regionEntries = Object.entries(
            users.reduce((acc, user) => {
                const region = user.region || "All regions";
                acc[region] = (acc[region] || 0) + 1;
                return acc;
            }, {})
        ).sort((a, b) => b[1] - a[1]);

        const roleRows = [
            ["Users", regularUsers.length, "blue"],
            ["Team Leaders", teamLeaders.length, "orange"],
            ["Managers", managers.length, "purple"]
        ];

        const maxRole = Math.max(...roleRows.map(row => row[1]), 1);
        const moduleRows = [
            ["User Management", "Connected", "fa-users", "green", "users"],
            ["Template Manager", dashboardStats.templates ? "Connected" : "No records", "fa-file-lines", "orange", "templates"],
            ["Guide Management", `${dashboardStats.guides} registered`, "fa-book-open", "purple", "guides"],
            ["Announcements", "Module ready", "fa-bullhorn", "red", "announcements"],
            ["Roles & Permissions", "Module ready", "fa-user-shield", "blue", "permissions"],
            ["System Settings", "Module ready", "fa-gear", "green", "settings"]
        ];

        const recentUsers = [...users]
            .sort((a, b) => String(a.name || a.email || "").localeCompare(String(b.name || b.email || "")))
            .slice(0, 6);

        const templateBreakdown = [
            ["Comment", dashboardStats.commentTemplates, "fa-comment-dots", "purple"],
            ["CORR Code", dashboardStats.corrTemplates, "fa-code", "blue"],
            ["Email", dashboardStats.emailTemplates, "fa-envelope", "orange"]
        ];

        return `
            <div class="dashboard-grid">

                <section class="dashboard-panel dashboard-user-summary">
                    <div class="dashboard-panel-heading">
                        <div>
                            <span>USER DIRECTORY</span>
                            <h3>Account & access summary</h3>
                        </div>
                        <button class="dashboard-link" type="button" data-section="users">
                            Manage users <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>

                    <div class="dashboard-stat-strip">
                        <div><strong>${activeUsers.length}</strong><span>Active</span></div>
                        <div><strong>${inactiveUsers.length}</strong><span>Inactive</span></div>
                        <div><strong>${managers.length}</strong><span>Managers</span></div>
                        <div><strong>${teamLeaders.length}</strong><span>Team Leaders</span></div>
                    </div>

                    <div class="dashboard-mini-title">Roles</div>
                    <div class="dashboard-bars">
                        ${roleRows.map(row => `
                            <div class="dashboard-bar-row">
                                <div><span>${row[0]}</span><strong>${row[1]}</strong></div>
                                <div class="dashboard-bar"><i class="${row[2]}" style="--bar-width:${Math.max(8, Math.round((row[1] / maxRole) * 100))}%"></i></div>
                            </div>
                        `).join("")}
                    </div>
                </section>

                <section class="dashboard-panel">
                    <div class="dashboard-panel-heading">
                        <div>
                            <span>REGIONAL DISTRIBUTION</span>
                            <h3>Users by region</h3>
                        </div>
                        <i class="fa-solid fa-earth-asia dashboard-heading-icon"></i>
                    </div>

                    <div class="dashboard-region-list">
                        ${regionEntries.length ? regionEntries.map(([region, count]) => `
                            <div class="dashboard-region-row">
                                <span><i class="fa-solid fa-location-dot"></i>${escapeHtml(region)}</span>
                                <strong>${count}</strong>
                            </div>
                        `).join("") : `
                            <div class="dashboard-no-data">No regional user data available.</div>
                        `}
                    </div>
                </section>

                <section class="dashboard-panel dashboard-template-panel">
                    <div class="dashboard-panel-heading">
                        <div>
                            <span>TEMPLATE INVENTORY</span>
                            <h3>Suggested template records</h3>
                        </div>
                        <button class="dashboard-link" type="button" data-section="templates">
                            Open manager <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>

                    <div class="dashboard-template-total">
                        <strong>${dashboardStats.templates}</strong>
                        <span>Total records across connected template collections</span>
                    </div>

                    <div class="dashboard-template-types">
                        ${templateBreakdown.map(item => `
                            <div>
                                <span class="dashboard-template-icon ${item[3]}"><i class="fa-solid ${item[2]}"></i></span>
                                <strong>${item[1]}</strong>
                                <small>${item[0]}</small>
                            </div>
                        `).join("")}
                    </div>
                </section>

                <section class="dashboard-panel dashboard-users-panel">
                    <div class="dashboard-panel-heading">
                        <div>
                            <span>APPROVED USERS</span>
                            <h3>Directory snapshot</h3>
                        </div>
                        <button class="dashboard-link" type="button" data-section="users">
                            View all <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>

                    <div class="dashboard-user-list">
                        ${recentUsers.length ? recentUsers.map(user => `
                            <div class="dashboard-user-row">
                                <span class="dashboard-avatar">${escapeHtml((user.name || user.email || "?").charAt(0).toUpperCase())}</span>
                                <div>
                                    <strong>${escapeHtml(user.name || user.email || user.id)}</strong>
                                    <small>${escapeHtml(user.email || user.id)}</small>
                                </div>
                                <span class="dashboard-role">${escapeHtml(user.role || "User")}</span>
                                <span class="dashboard-active-dot ${user.active === false ? "off" : ""}"></span>
                            </div>
                        `).join("") : `
                            <div class="dashboard-no-data">No approved users are currently available.</div>
                        `}
                    </div>
                </section>

                <section class="dashboard-panel dashboard-system-panel">
                    <div class="dashboard-panel-heading">
                        <div>
                            <span>SYSTEM CONTROL</span>
                            <h3>Administration status</h3>
                        </div>
                        <span class="dashboard-status-chip"><i class="fa-solid fa-circle"></i> Connected</span>
                    </div>

                    <div class="dashboard-system-list">
                        <div><span><i class="fa-solid fa-database"></i> Firestore</span><strong>Connected</strong></div>
                        <div><span><i class="fa-solid fa-users"></i> Approved Users</span><strong>${users.length} records</strong></div>
                        <div><span><i class="fa-solid fa-book"></i> Guide Registry</span><strong>${dashboardStats.guides} guides</strong></div>
                        <div><span><i class="fa-solid fa-file-lines"></i> Template Collections</span><strong>${dashboardStats.dataSources} sources</strong></div>
                    </div>

                    <div class="dashboard-quick-actions">
                        <button type="button" data-section="users"><i class="fa-solid fa-user-plus"></i> Add User</button>
                        <button type="button" data-section="templates"><i class="fa-solid fa-file-lines"></i> Templates</button>
                        <button type="button" data-section="guides"><i class="fa-solid fa-book-open"></i> Guides</button>
                    </div>
                </section>

                <section class="dashboard-panel dashboard-modules-panel">
                    <div class="dashboard-panel-heading">
                        <div>
                            <span>ADMIN MODULES</span>
                            <h3>Workspace availability</h3>
                        </div>
                    </div>

                    <div class="dashboard-module-list">
                        ${moduleRows.map(row => `
                            <button type="button" class="dashboard-module-row" data-section="${row[4]}">
                                <span class="dashboard-module-icon ${row[3]}"><i class="fa-solid ${row[2]}"></i></span>
                                <span>
                                    <strong>${row[0]}</strong>
                                    <small>${row[1]}</small>
                                </span>
                                <i class="fa-solid fa-chevron-right"></i>
                            </button>
                        `).join("")}
                    </div>
                </section>

            </div>
        `;
    }

    function genericContent(section) {
        if (section === "templates") {
            return `
                <div class="admin-empty-state">
                    <i class="fa-solid fa-file-lines"></i>
                    <h3>Template Manager</h3>
                    <p>Template management will be connected next.</p>
                </div>
            `;
        }

        const icon =
            section === "announcements"
                ? "bullhorn"
                : section === "guides"
                    ? "book-open"
                    : section === "permissions"
                        ? "user-shield"
                        : "gear";

        return `
            <div class="admin-empty-state">
                <i class="fa-solid fa-${icon}"></i>
                <h3>${config[section].title}</h3>
                <p>This management module will be connected next.</p>
            </div>
        `;
    }

    function renderUserRows() {
        const query = userSearch.trim().toLowerCase();

        const filtered = approvedUsers.filter(user => {
            const text = [
                user.id,
                user.name,
                user.email,
                user.role,
                user.region,
                user.active ? "active" : "inactive"
            ].join(" ").toLowerCase();

            return !query || text.includes(query);
        });

        if (!filtered.length) {
            return `
                <div class="admin-empty-state">
                    <i class="fa-solid fa-user-slash"></i>
                    <h3>No approved users found</h3>
                    <p>Try another search term.</p>
                </div>
            `;
        }

        return `
            <div class="admin-users-table-wrap">
                <table class="admin-users-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Region</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${filtered.map(user => {
                            const encodedId = encodeURIComponent(user.id);

                            return `
                                <tr>
                                    <td>
                                        <strong>
                                            ${escapeHtml(user.name || user.email || user.id)}
                                        </strong>
                                        <small>
                                            ${escapeHtml(user.email || user.id)}
                                        </small>
                                    </td>

                                    <td>
                                        <span class="admin-role-badge">
                                            ${escapeHtml(user.role || "User")}
                                        </span>
                                    </td>

                                    <td>
                                        ${escapeHtml(user.region || "All regions")}
                                    </td>

                                    <td>
                                        <span class="admin-user-status ${user.active === false ? "inactive" : "active"}">
                                            ${user.active === false ? "Inactive" : "Active"}
                                        </span>
                                    </td>

                                    <td>
                                        <div class="admin-user-actions">
                                            <button
                                                class="admin-edit-user"
                                                type="button"
                                                data-user-id="${encodedId}"
                                                title="Edit user"
                                            >
                                                <i class="fa-solid fa-pen"></i>
                                                Edit
                                            </button>

                                            <button
                                                class="admin-delete-user"
                                                type="button"
                                                data-user-id="${encodedId}"
                                                title="Delete user"
                                            >
                                                <i class="fa-solid fa-trash"></i>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join("")}
                    </tbody>
                </table>
            </div>
        `;
    }

    function usersContent() {
        return `
            <div class="admin-users-toolbar">
                <div>
                    <strong>${approvedUsers.length}</strong> approved users
                </div>

                <input
                    id="adminUserSearch"
                    type="search"
                    placeholder="Search name, email or role..."
                    value="${escapeHtml(userSearch)}"
                >
            </div>

            ${renderUserRows()}
        `;
    }

    async function loadApprovedUsers() {
        const db = getDb();

        if (!db) {
            console.error("Admin: Firebase/Firestore is not initialized.");
            toast("Firebase is not initialized.");
            return;
        }

        try {
            const snapshot = await db
                .collection(USERS_COLLECTION)
                .get();

            approvedUsers = snapshot.docs
                .map(doc => {
                    const data = doc.data() || {};

                    return {
                        id: doc.id,
                        email: data.email || doc.id,
                        name: data.name || data.displayName || doc.id,
                        role: String(data.role || "User").trim(),
                        region: data.region || data.country || "All regions",
                        active: data.active !== false
                    };
                })
                .sort((a, b) =>
                    (a.name || "").localeCompare(b.name || "")
                );

            dashboardStats.users = approvedUsers.length;
            dashboardStats.activeUsers = approvedUsers.filter(user => user.active !== false).length;
            dashboardStats.inactiveUsers = approvedUsers.filter(user => user.active === false).length;
            dashboardStats.managers = approvedUsers.filter(user => String(user.role || "").toLowerCase() === "manager").length;
            dashboardStats.teamLeaders = approvedUsers.filter(user => String(user.role || "").toLowerCase() === "team leader").length;
            dashboardStats.regularUsers = approvedUsers.filter(user => {
                const role = String(user.role || "").toLowerCase();
                return role !== "manager" && role !== "team leader";
            }).length;
            dashboardStats.regions = approvedUsers.reduce((acc, user) => {
                const region = user.region || "All regions";
                acc[region] = (acc[region] || 0) + 1;
                return acc;
            }, {});

            if ($("userCount")) {
                $("userCount").textContent = approvedUsers.length;
            }

            if (currentSection === "users") {
                render("users");
            } else if (currentSection === "overview") {
                render("overview");
            }

        } catch (error) {
            console.error(
                "Unable to load approved users:",
                error.code || "unknown",
                error.message || error
            );

            toast(
                error.code === "permission-denied"
                    ? "Firestore permission denied for approved_users."
                    : "Unable to load approved users."
            );
        }
    }

    function openUserModal(user = null) {
        const modal = $("userModal");
        const form = $("userForm");

        if (!modal || !form) {
            toast("User modal is missing from the HTML.");
            return;
        }

        editingUserId = user ? user.id : null;

        $("userModalTitle").textContent = user
            ? "Edit User"
            : "Add User";

        $("userModalDescription").textContent = user
            ? "Update the employee's information and account access."
            : "Add a new employee to the approved users list.";

        $("userName").value = user?.name || "";
        $("userEmail").value = user?.email || "";
        $("userRole").value = user?.role || "User";
        $("userRegion").value = user?.region || "All regions";
        $("userActive").checked = user
            ? user.active !== false
            : true;

        $("userEmail").disabled = Boolean(user);

        $("userModalSave").innerHTML = user
            ? `<i class="fa-solid fa-floppy-disk"></i> Save Changes`
            : `<i class="fa-solid fa-user-plus"></i> Add User`;

        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");

        setTimeout(() => {
            $("userName")?.focus();
        }, 100);
    }

    function closeUserModal() {
        const modal = $("userModal");

        if (!modal) return;

        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");

        editingUserId = null;
    }

    async function saveUser(event) {
        event.preventDefault();

        const db = getDb();

        if (!db) {
            toast("Firebase is not initialized.");
            return;
        }

        const name = $("userName").value.trim();
        const email = $("userEmail").value.trim().toLowerCase();
        const role = $("userRole").value;
        const region = $("userRegion").value.trim() || "All regions";
        const active = $("userActive").checked;

        if (!name) {
            toast("Employee name is required.");
            $("userName").focus();
            return;
        }

        if (!email || !email.includes("@")) {
            toast("Enter a valid email address.");
            $("userEmail").focus();
            return;
        }

        try {
            $("userModalSave").disabled = true;

            if (editingUserId) {
                await db
                    .collection(USERS_COLLECTION)
                    .doc(editingUserId)
                    .update({
                        name,
                        role,
                        region,
                        active,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });

                toast("User information updated successfully.");

            } else {
                const userRef = db
                    .collection(USERS_COLLECTION)
                    .doc(email);

                const existingUser = await userRef.get();

                if (existingUser.exists) {
                    toast("This employee already exists.");
                    return;
                }

                await userRef.set({
                    email,
                    name,
                    role,
                    region,
                    active,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                toast("User added successfully.");
            }

            closeUserModal();
            await loadApprovedUsers();
            render("users");

        } catch (error) {
            console.error(
                "Unable to save user:",
                error.code || "unknown",
                error.message || error
            );

            toast(
                error.code === "permission-denied"
                    ? "Firestore permission denied."
                    : "Unable to save user information."
            );

        } finally {
            $("userModalSave").disabled = false;
        }
    }

    async function deleteUser(userId) {
        const user = approvedUsers.find(item => item.id === userId);

        if (!user) {
            toast("User not found.");
            return;
        }

        const confirmed = confirm(
            `Delete this user?\n\n${user.name}\n${user.email}\n\nThis will permanently remove the approved user record.`
        );

        if (!confirmed) return;

        const db = getDb();

        if (!db) {
            toast("Firebase is not initialized.");
            return;
        }

        try {
            await db
                .collection(USERS_COLLECTION)
                .doc(userId)
                .delete();

            toast("User deleted successfully.");

            await loadApprovedUsers();
            render("users");

        } catch (error) {
            console.error(
                "Unable to delete user:",
                error.code || "unknown",
                error.message || error
            );

            toast(
                error.code === "permission-denied"
                    ? "Firestore permission denied."
                    : "Unable to delete user."
            );
        }
    }

    function bindUserControls() {
        $("adminUserSearch")?.addEventListener("input", event => {
            userSearch = event.target.value;
            render("users");

            const searchInput = $("adminUserSearch");

            if (searchInput) {
                searchInput.focus();
                searchInput.setSelectionRange(
                    userSearch.length,
                    userSearch.length
                );
            }
        });

        document.querySelectorAll(".admin-edit-user").forEach(button => {
            button.addEventListener("click", () => {
                const userId = decodeURIComponent(button.dataset.userId);
                const user = approvedUsers.find(item => item.id === userId);

                if (user) {
                    openUserModal(user);
                }
            });
        });

        document.querySelectorAll(".admin-delete-user").forEach(button => {
            button.addEventListener("click", () => {
                const userId = decodeURIComponent(button.dataset.userId);
                deleteUser(userId);
            });
        });
    }

    function templateContent(){return `<div class="template-manager"><div class="template-manager-toolbar"><label>Guide <select id="tmGuide">${GUIDE_REGISTRY.map(g=>`<option value="${g.id}">${escapeHtml(g.title)}</option>`).join("")}</select></label><button class="admin-save-role" id="tmReset">Restart Path</button></div><div class="template-manager-grid"><section class="template-path-panel"><div class="template-panel-heading"><span>GUIDE PATH</span><strong id="tmTitle">Loading…</strong></div><div id="tmBody"></div><div id="tmPath"></div></section><section class="template-editor-panel"><div class="template-panel-heading"><span>SUGGESTED TEMPLATES</span><strong id="tmRec">Select a final recommendation</strong></div><label>Comment Template<textarea id="tmComment"></textarea></label><label>CORR Code<textarea id="tmCorr"></textarea></label><label>Email Template<textarea id="tmEmail"></textarea></label><button class="admin-save-role" id="tmSave">Save Suggested Templates</button></section></div></div>`}
    const tmText=n=>n?.text||n?.question||n?.title||""; const tmChoices=n=>Array.isArray(n?.choices)?n.choices:[]; const tmFinal=n=>!!n?.action||(!tmChoices(n).length&&!n?.next); const tmNorm=x=>String(x).toLowerCase().replace(/<[^>]*>/g,"").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,180);
    function tmRender(){let n=templateState.nodes[templateState.key]; if(!n)return; $("tmTitle").textContent=tmText(n); $("tmPath").innerHTML=templateState.path.map((x,i)=>`<div>${i+1}. ${escapeHtml(x)}</div>`).join(""); if(tmFinal(n)){templateState.recommendation=n.action||tmText(n);$("tmRec").textContent=templateState.recommendation;$("tmBody").innerHTML=`<p>Final recommendation selected.</p>`;tmLoad()}else{$("tmBody").innerHTML=tmChoices(n).map(c=>`<button class="template-choice" data-next="${escapeHtml(c.next||c.nextKey||"")}" data-label="${escapeHtml(c.label||c.text||c.value||"")}">${escapeHtml(c.label||c.text||c.value||"")} →</button>`).join("");document.querySelectorAll(".template-choice").forEach(b=>b.onclick=()=>{templateState.path.push(b.dataset.label);templateState.key=b.dataset.next;tmRender()})}}
    async function tmLoad(){let db=getDb(),base=tmNorm(templateState.recommendation),col=templateState.guide.templateCollection;if(!db)return;let a=await Promise.all([db.collection(col).doc("comment__"+base).get(),db.collection(col).doc("corr__"+base).get(),db.collection(col).doc("email__"+base).get()]);$("tmComment").value=a[0].exists?a[0].data().value||"":"";$("tmCorr").value=a[1].exists?a[1].data().value||"":"";$("tmEmail").value=a[2].exists?a[2].data().value||"":""}
    async function tmSave(){let db=getDb();if(!db||!templateState.recommendation)return toast("Select a final recommendation first.");let c=db.collection(templateState.guide.templateCollection),b=db.batch(),id=tmNorm(templateState.recommendation);[["comment",$("tmComment").value],["corr",$("tmCorr").value],["email",$("tmEmail").value]].forEach(([t,v])=>b.set(c.doc(t+"__"+id),{value:v,recommendation:templateState.recommendation,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}));try{await b.commit();toast("Suggested templates saved.")}catch(e){console.error(e);toast("Save failed. Check Firestore rules.")}}
    async function tmLoadGuide(){let r=await fetch(templateState.guide.flowFile),txt=await r.text(),m=txt.match(/window\.GUIDE_NODES\s*=\s*([\s\S]*?);\s*$/);if(!m)throw Error("Flow must use window.GUIDE_NODES");templateState.nodes=Function("return ("+m[1]+")")();templateState.key="start";templateState.path=[];templateState.recommendation="";tmRender()}
    function bindTemplates(){tmLoadGuide().catch(e=>{$("tmBody").textContent="Unable to load guide flow.";console.error(e)});$("tmGuide").onchange=e=>{templateState.guide=GUIDE_REGISTRY.find(g=>g.id===e.target.value)||GUIDE_REGISTRY[0];tmLoadGuide()};$("tmReset").onclick=()=>{templateState.key="start";templateState.path=[];templateState.recommendation="";tmRender()};$("tmSave").onclick=tmSave}
    function render(section) {
        currentSection = section;

        const current = config[section] || config.overview;

        $("workspaceTitle").textContent = current.title;
        $("workspaceDescription").textContent = current.description;

        $("workspaceAction").innerHTML =
            currentSection === "overview"
                ? `<i class="fa-solid fa-user-plus"></i> Add User`
                : `<i class="fa-solid fa-plus"></i> ${current.action}`;

        if ($("topbarSection")) {
            $("topbarSection").textContent =
                currentSection === "overview" ? "Dashboard" : current.title;
        }

        $("workspaceContent").innerHTML =
            section === "overview"
                ? overviewContent()
                : section === "users"
                    ? usersContent()
                    : genericContent(section);

        document.querySelectorAll(".admin-side-tab").forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.section === section
            );
        });

        document.querySelectorAll("[data-section]").forEach(button => {
            if (!button.classList.contains("admin-side-tab")) {
                button.onclick = () => render(button.dataset.section);
            }
        });

        if (section === "users") {
            bindUserControls();
        }
    }

    async function loadCounts() {
        const db = getDb();

        if (!db) {
            toast("Firebase is not initialized.");
            return;
        }

        try {
            const collections = [
                TEMPLATE_COLLECTION,
                ...GUIDE_REGISTRY.map(guide => guide.templateCollection)
            ].filter((value, index, list) => value && list.indexOf(value) === index);

            const [users, ...templateSnapshots] = await Promise.all([
                db.collection(USERS_COLLECTION).get(),
                ...collections.map(collection => db.collection(collection).get())
            ]);

            const allTemplateDocs = templateSnapshots.flatMap(snapshot =>
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data() || {}
                }))
            );

            dashboardStats.templates = allTemplateDocs.length;
            dashboardStats.commentTemplates = allTemplateDocs.filter(item =>
                item.id.toLowerCase().startsWith("comment__")
            ).length;
            dashboardStats.corrTemplates = allTemplateDocs.filter(item =>
                item.id.toLowerCase().startsWith("corr__")
            ).length;
            dashboardStats.emailTemplates = allTemplateDocs.filter(item =>
                item.id.toLowerCase().startsWith("email__")
            ).length;
            dashboardStats.guides = GUIDE_REGISTRY.length;
            dashboardStats.dataSources = collections.length;

            $("userCount").textContent = users.size;
            $("activeUserCount").textContent = users.docs.filter(doc =>
                (doc.data() || {}).active !== false
            ).length;
            $("templateCount").textContent = dashboardStats.templates;
            $("guideCount").textContent = dashboardStats.guides;
            $("adminRoleCount").textContent = users.docs.filter(doc => {
                const role = String((doc.data() || {}).role || "").toLowerCase();
                return role === "manager" || role === "team leader";
            }).length;
            $("dataSourceCount").textContent = dashboardStats.dataSources;

            if (currentSection === "overview") {
                render("overview");
            }

        } catch (error) {
            console.warn("Admin dashboard data unavailable:", error);
            if ($("userCount")) $("userCount").textContent = "—";
            if ($("templateCount")) $("templateCount").textContent = "—";
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        render("overview");
        loadCounts();
        loadApprovedUsers();

        document.querySelectorAll(".admin-side-tab").forEach(button => {
            button.onclick = () => render(button.dataset.section);
        });

        document.querySelectorAll(".admin-hero-actions [data-section]").forEach(button => {
            button.onclick = () => {
                render(button.dataset.section);

                $("workspaceContent").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            };
        });

        $("refreshBtn")?.addEventListener("click", () => {
            loadCounts();
            loadApprovedUsers();

            $("lastUpdated").textContent =
                `Updated ${new Date().toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit"
                })}`;

            toast("Admin dashboard refreshed.");
        });

        $("workspaceAction")?.addEventListener("click", () => {
            if (currentSection === "overview" || currentSection === "users") {
                openUserModal();
            } else {
                toast("This management module is not connected yet.");
            }
        });

        $("userForm")?.addEventListener("submit", saveUser);

        $("userModalClose")?.addEventListener("click", closeUserModal);
        $("userModalCancel")?.addEventListener("click", closeUserModal);

        $("userModal")?.addEventListener("click", event => {
            if (event.target.id === "userModal") {
                closeUserModal();
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeUserModal();
            }
        });
    });

})();
