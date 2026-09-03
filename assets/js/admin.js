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

    const config = {
        overview: {
            title: "Administrative Workspace",
            description: "Select a module to manage your Decision Support System.",
            action: "New Item"
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
        const cards = [
            ["users", "blue", "fa-users", "User Management", "Manage all approved users, roles and account access.", "Manage users"],
            ["templates", "orange", "fa-file-lines", "Template Manager", "Create and maintain comments, CORR guidance and email responses.", "Manage templates"],
            ["announcements", "red", "fa-bullhorn", "Announcement Center", "Publish system announcements, alerts and important notices.", "Manage announcements"],
            ["guides", "purple", "fa-book-open", "Guide Management", "Review guide registration, visibility and guide metadata.", "Manage guides"],
            ["permissions", "green", "fa-user-shield", "Roles & Permissions", "Control administrator access and permission assignments.", "Manage permissions"],
            ["settings", "blue", "fa-gear", "System Settings", "Configure system preferences and operational options.", "Open settings"]
        ];

        return `
            <div class="admin-module-grid">
                ${cards.map(card => `
                    <button
                        class="admin-module-card"
                        type="button"
                        data-section="${card[0]}"
                    >
                        <span class="admin-module-icon ${card[1]}">
                            <i class="fa-solid ${card[2]}"></i>
                        </span>
                        <h3>${card[3]}</h3>
                        <p>${card[4]}</p>
                        <span class="admin-module-footer">
                            ${card[5]}
                            <i class="fa-solid fa-arrow-right"></i>
                        </span>
                    </button>
                `).join("")}
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

            if ($("userCount")) {
                $("userCount").textContent = approvedUsers.length;
            }

            if (currentSection === "users") {
                render("users");
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
            `<i class="fa-solid fa-plus"></i> ${current.action}`;

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
            const [users, templates] = await Promise.all([
                db.collection(USERS_COLLECTION).get(),
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
            if (currentSection === "users") {
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
