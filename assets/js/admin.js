(function () {
    "use strict";

    const USERS_COLLECTION = "approved_users";
    const TEMPLATE_COLLECTION = "billing_dispute_general_template";
    const GUIDE_STATS_COLLECTION = "guide_stats";

    const $ = (id) => document.getElementById(id);

    let approvedUsers = [];
    let userSearch = "";
    let currentSection = "dashboard";
    let editingUserId = null;
    let userActivityChart = null;
    let regionDistributionChart = null;

    const moduleConfig = {
        users: {
            title: "User Management",
            description: "Manage all approved users, roles and account access.",
            action: "Add User",
            kicker: "ADMINISTRATION"
        },
        templates: {
            title: "Templates Management",
            description: "Manage Suggested Comment, CORR Code and Suggested Email content used by final recommendations.",
            action: "Create Template",
            kicker: "CONTENT MANAGEMENT"
        },
        announcements: {
            title: "Announcements",
            description: "Create, publish and manage announcements displayed to system users.",
            action: "New Announcement",
            kicker: "ADMINISTRATION"
        },
        guides: {
            title: "Guide Management",
            description: "Manage guide registration, categories, visibility and metadata.",
            action: "Register Guide",
            kicker: "GUIDE LIBRARY"
        },
        logs: {
            title: "System Logs",
            description: "Review recent administrative activity and system events.",
            action: "Refresh Logs",
            kicker: "SYSTEM ACTIVITY"
        },
        reports: {
            title: "Reports & Analytics",
            description: "Review users, regional distribution, guide usage and operational statistics.",
            action: "Refresh Reports",
            kicker: "ANALYTICS"
        },
        permissions: {
            title: "Roles & Permissions",
            description: "Review administrator roles and access capabilities.",
            action: "Add Role",
            kicker: "SECURITY"
        },
        settings: {
            title: "System Settings",
            description: "Configure application-wide settings and administrative preferences.",
            action: "Save Settings",
            kicker: "CONFIGURATION"
        }
    };

    function toast(message) {
        const el = $("toast");
        if (!el) {
            window.alert(message);
            return;
        }
        el.textContent = message;
        el.classList.add("show");
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => el.classList.remove("show"), 2600);
    }

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>'"]/g, (ch) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#039;",
            '"': "&quot;"
        }[ch]));
    }

    function getDb() {
        return window.db || (
            window.firebase && firebase.firestore
                ? firebase.firestore()
                : null
        );
    }

    function getAuth() {
        return window.auth || (
            window.firebase && firebase.auth
                ? firebase.auth()
                : null
        );
    }

    function storedUser() {
        try {
            const raw = localStorage.getItem("currentUser");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    function getDisplayName() {
        const stored = storedUser();
        const profile = window.currentUserProfile || {};
        const authUser = getAuth()?.currentUser;

        return profile.displayName ||
            profile.name ||
            stored?.name ||
            authUser?.displayName ||
            authUser?.email?.split("@")[0] ||
            "Admin";
    }

    function getEmail() {
        return String(
            window.currentUser?.email ||
            getAuth()?.currentUser?.email ||
            window.currentUserProfile?.email ||
            storedUser()?.email ||
            ""
        ).trim().toLowerCase();
    }

    function getInitials(name) {
        const clean = String(name || "Admin").trim();
        const parts = clean.split(/\s+/);

        if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return clean.slice(0, 2).toUpperCase();
    }

    function updateIdentity() {
        const name = getDisplayName();
        const email = getEmail();
        const initials = getInitials(name);

        if ($("header-avatar")) $("header-avatar").textContent = initials;
        if ($("sidebar-avatar")) $("sidebar-avatar").textContent = initials;
        if ($("sidebar-user-name")) $("sidebar-user-name").textContent = name;
        if ($("dropdown-user-name")) $("dropdown-user-name").textContent = name;
        if ($("dropdown-user-email")) $("dropdown-user-email").textContent = email || "—";

        const role =
            window.currentUserProfile?.role ||
            storedUser()?.role ||
            "System Administrator";

        if ($("sidebar-user-role")) $("sidebar-user-role").textContent = role;

        const heroAdmin = document.querySelector(".admin-page .hero-gradient h1 span");
        if (heroAdmin) heroAdmin.textContent = name + "!";
    }

    function updateClock() {
        const now = new Date();

        if ($("current-date-str")) {
            $("current-date-str").textContent = now.toLocaleDateString("en-US", {
                timeZone: "Asia/Manila",
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric"
            });
        }

        if ($("current-time-str")) {
            $("current-time-str").textContent =
                now.toLocaleTimeString("en-US", {
                    timeZone: "Asia/Manila",
                    hour: "numeric",
                    minute: "2-digit"
                }) + " (PHT)";
        }
    }

    function formatDate(value) {
        if (!value) return "—";
        try {
            const date = value.toDate ? value.toDate() : new Date(value);
            if (Number.isNaN(date.getTime())) return "—";
            return date.toLocaleDateString("en-US", {
                timeZone: "Asia/Manila",
                month: "short",
                day: "numeric",
                year: "numeric"
            });
        } catch {
            return "—";
        }
    }

    function relativeTime(value) {
        if (!value) return "—";
        try {
            const date = value.toDate ? value.toDate() : new Date(value);
            const diff = Math.max(0, Date.now() - date.getTime());
            const mins = Math.floor(diff / 60000);
            const hours = Math.floor(mins / 60);
            const days = Math.floor(hours / 24);

            if (mins < 1) return "Just now";
            if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
            if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
            if (days === 1) return "Yesterday";
            return `${days} days ago`;
        } catch {
            return "—";
        }
    }

    async function waitForAuth(timeout = 12000) {
        const auth = getAuth();
        if (!auth) return null;

        if (auth.currentUser) {
            window.currentUser = auth.currentUser;
            return auth.currentUser;
        }

        return new Promise((resolve) => {
            let done = false;
            let unsubscribe = null;

            const finish = (user) => {
                if (done) return;
                done = true;
                if (unsubscribe) unsubscribe();
                if (user) window.currentUser = user;
                resolve(user || null);
            };

            unsubscribe = auth.onAuthStateChanged(finish);
            setTimeout(() => finish(auth.currentUser || null), timeout);
        });
    }

    async function loadCurrentProfile(user) {
        const db = getDb();
        if (!db || !user?.email) {
            updateIdentity();
            return;
        }

        const email = String(user.email).trim().toLowerCase();

        try {
            const snap = await db.collection(USERS_COLLECTION)
                .where("email", "==", email)
                .limit(1)
                .get();

            let displayName =
                user.displayName ||
                storedUser()?.name ||
                email.split("@")[0];

            let role = storedUser()?.role || "";

            if (!snap.empty) {
                const data = snap.docs[0].data() || {};
                displayName = data.name || data.displayName || displayName;
                role = data.role || role;
            }

            window.currentUserProfile = {
                uid: user.uid,
                email: user.email,
                displayName: String(displayName).replace(/\s+vndr$/i, "").trim(),
                role: String(role).trim()
            };
        } catch (error) {
            console.warn("Admin profile lookup unavailable:", error);
        }

        updateIdentity();
    }

    async function loadApprovedUsers() {
        const db = getDb();
        if (!db) {
            toast("Firebase is not initialized.");
            return;
        }

        try {
            const snapshot = await db.collection(USERS_COLLECTION).get();

            approvedUsers = snapshot.docs
                .map((doc) => {
                    const data = doc.data() || {};
                    return {
                        id: doc.id,
                        email: data.email || doc.id,
                        name: data.name || data.displayName || doc.id,
                        role: String(data.role || "User").trim(),
                        region: String(data.region || data.country || "All regions").trim() || "All regions",
                        active: data.active !== false,
                        createdAt: data.createdAt || null,
                        updatedAt: data.updatedAt || null
                    };
                })
                .sort((a, b) =>
                    String(a.name || "").localeCompare(String(b.name || ""))
                );

            const count = approvedUsers.length;
            const active = approvedUsers.filter(user => user.active !== false).length;

            if ($("userCount")) $("userCount").textContent = count;
            if ($("kpi-total-users")) $("kpi-total-users").textContent = count;
            if ($("kpi-active-users")) $("kpi-active-users").textContent = active;

            renderRecentUsers();
            renderRegionChart();
            renderUsersModule();
            renderRecentActivity();
            updateIdentity();

            const status = document.querySelector(".admin-page .bg-green-400");
            if (status) status.parentElement.title = `${count} approved users loaded`;
        } catch (error) {
            console.error("Unable to load approved users:", error);
            toast(
                error.code === "permission-denied"
                    ? "Firestore permission denied for approved_users."
                    : "Unable to load approved users."
            );
        }
    }

    async function loadCounts() {
        const db = getDb();
        if (!db) return;

        try {
            const templates = await db.collection(TEMPLATE_COLLECTION).get();
            if ($("templateCount")) $("templateCount").textContent = templates.size;
            if ($("kpi-templates")) $("kpi-templates").textContent = templates.size;
        } catch (error) {
            console.warn("Template count unavailable:", error);
            if ($("kpi-templates")) $("kpi-templates").textContent = "—";
        }

        if ($("kpi-guides")) {
            const registryCount = Array.isArray(window.GUIDE_REGISTRY)
                ? window.GUIDE_REGISTRY.length
                : 0;
            $("kpi-guides").textContent = registryCount || "—";
        }

        try {
            const announcements = await db.collection("announcements").get();
            if ($("announcementCount")) $("announcementCount").textContent = announcements.size;
            if ($("kpi-announcements")) $("kpi-announcements").textContent = announcements.size;

            const badge = document.querySelector("#notification-btn span");
            if (badge) {
                badge.textContent = announcements.size;
                badge.classList.toggle("hidden", announcements.size === 0);
            }
        } catch {
            if ($("kpi-announcements")) $("kpi-announcements").textContent = "0";
        }
    }

    async function loadGuideStats() {
        const db = getDb();
        window.__adminGuideStats = [];

        if (!db) {
            renderGuideUsage();
            return;
        }

        try {
            const snap = await db.collection(GUIDE_STATS_COLLECTION)
                .orderBy("usageCount", "desc")
                .limit(5)
                .get();

            window.__adminGuideStats = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.info("guide_stats not available:", error.code || error.message);
        }

        renderGuideUsage();
        renderRecentActivity();
    }

    function getGuideRows() {
        const stats = Array.isArray(window.__adminGuideStats)
            ? window.__adminGuideStats
            : [];

        if (stats.length) {
            return stats.map((item, index) => ({
                rank: index + 1,
                title: item.guideTitle || item.guideName || item.guideId || item.id || "Untitled Guide",
                count: Number(item.usageCount || 0)
            }));
        }

        const registry = Array.isArray(window.GUIDE_REGISTRY)
            ? window.GUIDE_REGISTRY
            : [];

        return registry.slice(0, 5).map((guide, index) => ({
            rank: index + 1,
            title: guide.title || guide.name || guide.id || "Untitled Guide",
            count: 0
        }));
    }

    function renderGuideUsage() {
        const target = $("guide-usage-list");
        if (!target) return;

        const rows = getGuideRows();
        const max = Math.max(...rows.map(row => row.count), 1);

        target.innerHTML = rows.length
            ? rows.map(row => `
                <div>
                    <div class="flex justify-between text-xs mb-1">
                        <span class="font-semibold text-gray-700 flex items-center">
                            <span class="w-4 text-center font-bold text-fedex-purple mr-1">${row.rank}</span>
                            ${escapeHtml(row.title)}
                        </span>
                        <span class="font-bold text-gray-500">${row.count || "—"}</span>
                    </div>
                    <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div class="bg-fedex-purple h-full rounded-full" style="width:${row.count ? Math.max(8, Math.round(row.count / max * 100)) : 0}%"></div>
                    </div>
                </div>
            `).join("")
            : `<div class="text-xs text-gray-400 py-5">No guide usage data available.</div>`;
    }

    function renderRecentUsers() {
        const body = $("recent-users-body");
        if (!body) return;

        const rows = [...approvedUsers]
            .sort((a, b) => {
                const av = a.createdAt || a.updatedAt;
                const bv = b.createdAt || b.updatedAt;
                if (!av || !bv) return 0;
                const ad = av.toDate ? av.toDate().getTime() : new Date(av).getTime();
                const bd = bv.toDate ? bv.toDate().getTime() : new Date(bv).getTime();
                return bd - ad;
            })
            .slice(0, 5);

        body.innerHTML = rows.length
            ? rows.map(user => {
                const roleClass = String(user.role || "").toLowerCase().includes("team")
                    ? "text-fedex-purple bg-purple-50"
                    : String(user.role || "").toLowerCase().includes("manager")
                        ? "text-blue-600 bg-blue-50"
                        : "text-indigo-600 bg-indigo-50";

                return `
                    <tr class="hover:bg-purple-50/30 transition-colors">
                        <td class="py-3 px-4">
                            <div class="flex items-center space-x-2.5">
                                <div class="w-7 h-7 rounded-full bg-purple-100 text-fedex-purple font-bold text-[10px] flex items-center justify-center shrink-0">
                                    ${escapeHtml(getInitials(user.name || user.email))}
                                </div>
                                <div>
                                    <p class="font-bold text-gray-800">${escapeHtml(user.name || user.email)}</p>
                                    <p class="text-[10px] text-gray-400">${escapeHtml(user.email || "")}</p>
                                </div>
                            </div>
                        </td>
                        <td class="py-3 px-4">
                            <span class="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-md ${roleClass}">${escapeHtml(user.role || "User")}</span>
                        </td>
                        <td class="py-3 px-4 text-gray-600 font-medium">${escapeHtml(user.region || "All regions")}</td>
                        <td class="py-3 px-4">
                            <span class="inline-block px-2 py-0.5 text-[10px] font-bold rounded-md ${user.active === false ? "text-rose-700 bg-rose-50" : "text-emerald-700 bg-emerald-50"}">
                                ${user.active === false ? "Inactive" : "Active"}
                            </span>
                        </td>
                        <td class="py-3 px-4 text-gray-500 text-[11px]">${escapeHtml(formatDate(user.createdAt || user.updatedAt))}</td>
                    </tr>
                `;
            }).join("")
            : `<tr><td colspan="5" class="py-8 text-center text-xs text-gray-400">No approved users available.</td></tr>`;
    }

    function renderRegionChart(filter = "all") {
        const canvas = $("regionDistributionChart");
        const legend = $("region-legend");
        if (!canvas || !legend) return;

        const regionMap = approvedUsers.reduce((acc, user) => {
            const region = user.region || "All regions";
            acc[region] = (acc[region] || 0) + 1;
            return acc;
        }, {});

        const entries = Object.entries(regionMap).sort((a, b) => b[1] - a[1]);
        const filteredEntries = filter === "all"
            ? entries
            : entries.filter(([region]) => region === filter);

        const total = filter === "all"
            ? approvedUsers.length
            : (regionMap[filter] || 0);

        const totalEl = canvas.parentElement.querySelector(".text-2xl.font-black");
        if (totalEl) totalEl.textContent = total;

        if ($("region-filter")) {
            const select = $("region-filter");
            const current = select.value;
            select.innerHTML = `<option value="all">All Regions</option>` +
                entries.map(([region]) => `<option value="${escapeHtml(region)}">${escapeHtml(region)}</option>`).join("");
            select.value = current || "all";
        }

        const dataEntries = filteredEntries.length ? filteredEntries : entries;
        const values = dataEntries.map(item => item[1]);

        if (regionDistributionChart) regionDistributionChart.destroy();

        if (window.Chart) {
            regionDistributionChart = new Chart(canvas.getContext("2d"), {
                type: "doughnut",
                data: {
                    labels: dataEntries.map(item => item[0]),
                    datasets: [{
                        data: values.length ? values : [1],
                        backgroundColor: ["#4D148C", "#C4B5FD", "#EDE9FE", "#99F6E4", "#FED7AA"],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "72%",
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: "#18113C",
                            bodyFont: { family: "Inter", size: 11 },
                            cornerRadius: 8
                        }
                    }
                }
            });
        }

        const colors = ["#4D148C", "#C4B5FD", "#EDE9FE", "#99F6E4", "#FED7AA"];
        legend.innerHTML = dataEntries.length
            ? dataEntries.slice(0, 5).map(([region, count], index) => {
                const pct = approvedUsers.length
                    ? Math.round(count / approvedUsers.length * 100)
                    : 0;
                return `
                    <div class="flex items-center justify-between">
                        <span class="flex items-center font-medium text-gray-600">
                            <span class="w-2.5 h-2.5 rounded-full mr-2" style="background:${colors[index % colors.length]}"></span>
                            ${escapeHtml(region)}
                        </span>
                        <div class="space-x-3">
                            <span class="font-bold text-gray-800">${count}</span>
                            <span class="text-gray-400 text-[11px]">${pct}%</span>
                        </div>
                    </div>
                `;
            }).join("")
            : `<div class="text-xs text-gray-400">No regional data available.</div>`;
    }

    function renderActivityChart() {
        const canvas = $("userActivityChart");
        if (!canvas || !window.Chart) return;

        const now = new Date();
        const labels = [];
        const loginData = [];
        const activeData = [];

        for (let i = 6; i >= 0; i--) {
            const day = new Date(now);
            day.setDate(now.getDate() - i);
            labels.push(day.toLocaleDateString("en-US", { month: "short", day: "numeric" }));

            const dayStart = new Date(day);
            dayStart.setHours(0,0,0,0);
            const dayEnd = new Date(day);
            dayEnd.setHours(23,59,59,999);

            const dayUsers = approvedUsers.filter(user => {
                const value = user.createdAt || user.updatedAt;
                if (!value) return false;
                const date = value.toDate ? value.toDate() : new Date(value);
                return date >= dayStart && date <= dayEnd;
            }).length;

            loginData.push(dayUsers ? Math.max(1, Math.round(dayUsers * 0.7)) : 0);
            activeData.push(approvedUsers.filter(user => user.active !== false).length);
        }

        if (userActivityChart) userActivityChart.destroy();

        userActivityChart = new Chart(canvas.getContext("2d"), {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Logins",
                        data: loginData,
                        backgroundColor: "#4D148C",
                        borderRadius: 4,
                        barPercentage: 0.5,
                        categoryPercentage: 0.6
                    },
                    {
                        label: "Active Users",
                        data: activeData,
                        backgroundColor: "#DDD6FE",
                        borderRadius: 4,
                        barPercentage: 0.5,
                        categoryPercentage: 0.6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "#18113C",
                        titleFont: { family: "Inter", size: 11 },
                        bodyFont: { family: "Inter", size: 11 },
                        padding: 8,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            font: { family: "Inter", size: 10 },
                            color: "#94A3B8"
                        }
                    },
                    y: {
                        grid: { color: "#F1F5F9" },
                        ticks: {
                            font: { family: "Inter", size: 10 },
                            color: "#94A3B8",
                            stepSize: 10
                        },
                        min: 0,
                        max: Math.max(30, ...activeData, ...loginData, 10)
                    }
                }
            }
        });
    }

    function renderRecentActivity() {
        const target = $("recent-activity-body");
        if (!target) return;

        const rows = [];
        approvedUsers.slice(0, 5).forEach(user => {
            const time = user.updatedAt || user.createdAt;
            rows.push({
                type: "user",
                title: user.updatedAt ? "User Updated" : "New User Added",
                user: user.name || user.email,
                detail: user.updatedAt ? "Updated approved user record" : "Added to approved users",
                time
            });
        });

        const guideStats = Array.isArray(window.__adminGuideStats)
            ? window.__adminGuideStats
            : [];

        guideStats.slice(0, 3).forEach(item => {
            if (item.lastUpdated) {
                rows.push({
                    type: "guide",
                    title: "Guide Usage",
                    user: "System",
                    detail: item.guideTitle || item.guideId || item.id,
                    time: item.lastUpdated
                });
            }
        });

        rows.sort((a, b) => {
            const av = a.time?.toDate ? a.time.toDate().getTime() : new Date(a.time || 0).getTime();
            const bv = b.time?.toDate ? b.time.toDate().getTime() : new Date(b.time || 0).getTime();
            return bv - av;
        });

        const iconMap = {
            user: ["bg-emerald-100", "text-emerald-600", "fa-user-plus"],
            guide: ["bg-indigo-100", "text-indigo-600", "fa-book-open"]
        };

        target.innerHTML = rows.slice(0, 5).map(row => {
            const [bg, color, icon] = iconMap[row.type] || iconMap.user;
            return `
                <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0 mt-0.5">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                            <p class="text-xs font-bold text-gray-800">${escapeHtml(row.title)}</p>
                            <span class="text-[10px] text-gray-400">${escapeHtml(relativeTime(row.time))}</span>
                        </div>
                        <p class="text-xs text-gray-600"><span class="font-medium text-gray-900">${escapeHtml(row.user)}</span> ${escapeHtml(row.detail)}</p>
                    </div>
                </div>
            `;
        }).join("") || `<div class="text-xs text-gray-400">No recent activity available.</div>`;
    }

    function showDashboard(show) {
        const dashboard = $("dashboard-content");
        const module = $("admin-module-view");

        if (dashboard) dashboard.classList.toggle("hidden", !show);
        if (module) module.classList.toggle("hidden", show);
    }

    function setActiveNav(section) {
        document.querySelectorAll("#admin-nav [data-section]").forEach(link => {
            const isActive = link.dataset.section === section;
            link.classList.toggle("bg-fedex-purple", isActive);
            link.classList.toggle("text-white", isActive);
            link.classList.toggle("text-gray-400", !isActive);
            link.classList.toggle("hover:text-white", !isActive);
            link.classList.toggle("hover:bg-white/5", !isActive);
        });
    }

    function openModule(section) {
        currentSection = section;

        if (section === "dashboard") {
            showDashboard(true);
            setActiveNav("dashboard");
            return;
        }

        const config = moduleConfig[section] || moduleConfig.users;
        showDashboard(false);
        setActiveNav(section);

        if ($("module-kicker")) $("module-kicker").textContent = config.kicker;
        if ($("module-title")) $("module-title").textContent = config.title;
        if ($("module-description")) $("module-description").textContent = config.description;
        if ($("module-action-btn")) $("module-action-btn").textContent = config.action;

        if (section === "users") {
            renderUsersModule();
        } else if (section === "logs") {
            renderLogsModule();
        } else if (section === "reports") {
            renderReportsModule();
        } else {
            $("module-content").innerHTML = `
                <div class="admin-empty-state">
                    <i class="fa-solid ${section === "templates" ? "fa-file-lines" : section === "guides" ? "fa-book-open" : section === "announcements" ? "fa-bullhorn" : section === "permissions" ? "fa-shield-halved" : "fa-gear"}"></i>
                    <h3>${escapeHtml(config.title)}</h3>
                    <p>${escapeHtml(config.description)}</p>
                </div>
            `;
        }
    }

    function renderUsersModule() {
        const target = $("module-content");
        if (!target) return;

        const filtered = approvedUsers.filter(user => {
            const q = userSearch.trim().toLowerCase();
            if (!q) return true;
            return [
                user.id, user.name, user.email, user.role, user.region,
                user.active === false ? "inactive" : "active"
            ].join(" ").toLowerCase().includes(q);
        });

        target.innerHTML = `
            <div class="admin-users-toolbar">
                <div><strong>${filtered.length}</strong> approved users</div>
                <input id="adminUserSearch" type="search" placeholder="Search name, email or role..." value="${escapeHtml(userSearch)}">
            </div>

            ${filtered.length ? `
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
                            ${filtered.map(user => `
                                <tr>
                                    <td>
                                        <strong>${escapeHtml(user.name || user.email || user.id)}</strong>
                                        <small>${escapeHtml(user.email || user.id)}</small>
                                    </td>
                                    <td><span class="admin-role-badge">${escapeHtml(user.role || "User")}</span></td>
                                    <td>${escapeHtml(user.region || "All regions")}</td>
                                    <td><span class="admin-user-status ${user.active === false ? "inactive" : "active"}">${user.active === false ? "Inactive" : "Active"}</span></td>
                                    <td>
                                        <div class="admin-user-actions">
                                            <button class="admin-edit-user" type="button" data-user-id="${encodeURIComponent(user.id)}"><i class="fa-solid fa-pen"></i> Edit</button>
                                            <button class="admin-delete-user" type="button" data-user-id="${encodeURIComponent(user.id)}"><i class="fa-solid fa-trash"></i> Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            ` : `
                <div class="admin-empty-state">
                    <i class="fa-solid fa-user-slash"></i>
                    <h3>No approved users found</h3>
                    <p>Try another search term.</p>
                </div>
            `}
        `;

        bindUserControls();
    }

    function renderLogsModule() {
        const target = $("module-content");
        if (!target) return;

        target.innerHTML = `
            <div class="admin-empty-state">
                <i class="fa-solid fa-clock-rotate-left"></i>
                <h3>System Logs</h3>
                <p>The current console records the latest account and guide activity available to the dashboard.</p>
            </div>
        `;
    }

    function renderReportsModule() {
        const target = $("module-content");
        if (!target) return;

        target.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p class="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Users</p>
                    <p class="text-2xl font-extrabold text-gray-900 mt-1">${approvedUsers.length}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p class="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Active</p>
                    <p class="text-2xl font-extrabold text-gray-900 mt-1">${approvedUsers.filter(u => u.active !== false).length}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p class="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Guides</p>
                    <p class="text-2xl font-extrabold text-gray-900 mt-1">${Array.isArray(window.GUIDE_REGISTRY) ? window.GUIDE_REGISTRY.length : "—"}</p>
                </div>
            </div>
        `;
    }

    function bindUserControls() {
        const search = $("adminUserSearch");
        if (search) {
            search.addEventListener("input", (event) => {
                userSearch = event.target.value;
                renderUsersModule();
                const next = $("adminUserSearch");
                if (next) {
                    next.focus();
                    next.setSelectionRange(userSearch.length, userSearch.length);
                }
            });
        }

        document.querySelectorAll(".admin-edit-user").forEach(button => {
            button.addEventListener("click", () => {
                const id = decodeURIComponent(button.dataset.userId || "");
                const user = approvedUsers.find(item => item.id === id);
                if (user) openUserModal(user);
            });
        });

        document.querySelectorAll(".admin-delete-user").forEach(button => {
            button.addEventListener("click", () => {
                deleteUser(decodeURIComponent(button.dataset.userId || ""));
            });
        });
    }

    function openUserModal(user = null) {
        const modal = $("userModal");
        if (!modal) return;

        editingUserId = user ? user.id : null;

        $("userModalTitle").textContent = user ? "Edit User" : "Add User";
        $("userModalDescription").textContent = user
            ? "Update the employee's information and account access."
            : "Add a new employee to the approved users list.";

        $("userName").value = user?.name || "";
        $("userEmail").value = user?.email || "";
        $("userRole").value = user?.role || "User";
        $("userRegion").value = user?.region || "All regions";
        $("userActive").checked = user ? user.active !== false : true;
        $("userEmail").disabled = Boolean(user);

        $("userModalSave").innerHTML = user
            ? `<i class="fa-solid fa-floppy-disk"></i> Save Changes`
            : `<i class="fa-solid fa-user-plus"></i> Add User`;

        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
        setTimeout(() => $("userName")?.focus(), 100);
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
            return;
        }

        if (!email || !email.includes("@")) {
            toast("Enter a valid email address.");
            return;
        }

        try {
            $("userModalSave").disabled = true;

            if (editingUserId) {
                await db.collection(USERS_COLLECTION).doc(editingUserId).update({
                    name,
                    role,
                    region,
                    active,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                toast("User information updated successfully.");
            } else {
                const ref = db.collection(USERS_COLLECTION).doc(email);
                const existing = await ref.get();

                if (existing.exists) {
                    toast("This employee already exists.");
                    return;
                }

                await ref.set({
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
            openModule("users");
        } catch (error) {
            console.error("Unable to save user:", error);
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

        if (!window.confirm(
            `Delete this user?\n\n${user.name}\n${user.email}\n\nThis will permanently remove the approved user record.`
        )) {
            return;
        }

        const db = getDb();
        if (!db) {
            toast("Firebase is not initialized.");
            return;
        }

        try {
            await db.collection(USERS_COLLECTION).doc(userId).delete();
            toast("User deleted successfully.");
            await loadApprovedUsers();
            openModule("users");
        } catch (error) {
            console.error("Unable to delete user:", error);
            toast(
                error.code === "permission-denied"
                    ? "Firestore permission denied."
                    : "Unable to delete user."
            );
        }
    }

    function bindNavigation() {
        document.querySelectorAll("[data-section]").forEach(button => {
            if (button.dataset.bound === "true") return;
            button.dataset.bound = "true";

            button.addEventListener("click", (event) => {
                event.preventDefault();
                openModule(button.dataset.section);

                if (button.closest("#admin-nav") && window.innerWidth < 1024) {
                    const sidebar = $("sidebar");
                    if (sidebar) sidebar.classList.add("-translate-x-full");
                }
            });
        });

        $("mobile-menu-btn")?.addEventListener("click", () => {
            $("sidebar")?.classList.toggle("-translate-x-full");
        });

        $("region-filter")?.addEventListener("change", event => {
            renderRegionChart(event.target.value);
        });

        $("user-menu-btn")?.addEventListener("click", (event) => {
            event.stopPropagation();
            $("user-dropdown")?.classList.toggle("hidden");
        });

        document.addEventListener("click", () => {
            $("user-dropdown")?.classList.add("hidden");
        });

        $("sign-out-btn")?.addEventListener("click", async () => {
            try {
                const auth = getAuth();
                if (auth) await auth.signOut();
            } finally {
                localStorage.removeItem("currentUser");
                window.location.href = "index.html";
            }
        });

        $("notification-btn")?.addEventListener("click", () => {
            openModule("announcements");
        });

        $("module-action-btn")?.addEventListener("click", () => {
            if (currentSection === "users") {
                openUserModal();
            } else {
                toast(`${moduleConfig[currentSection]?.title || "This module"} is ready for connection.`);
            }
        });

        $("userForm")?.addEventListener("submit", saveUser);
        $("userModalClose")?.addEventListener("click", closeUserModal);
        $("userModalCancel")?.addEventListener("click", closeUserModal);

        $("userModal")?.addEventListener("click", (event) => {
            if (event.target.id === "userModal") closeUserModal();
        });

        const globalSearch = $("global-search");
        if (globalSearch) {
            globalSearch.addEventListener("input", () => {
                const q = globalSearch.value.trim().toLowerCase();
                const rows = document.querySelectorAll("#recent-users-body tr");

                rows.forEach(row => {
                    row.style.display = !q || row.textContent.toLowerCase().includes(q)
                        ? ""
                        : "none";
                });
            });
        }
    }

    function initCharts() {
        renderActivityChart();
        renderRegionChart();
    }

    async function initialize() {
        updateClock();
        setInterval(updateClock, 30000);

        bindNavigation();
        updateIdentity();
        renderGuideUsage();
        renderRecentUsers();
        renderRecentActivity();
        setActiveNav("dashboard");

        const authUser = await waitForAuth();
        if (authUser) {
            await loadCurrentProfile(authUser);
        }

        await loadApprovedUsers();
        await loadCounts();
        await loadGuideStats();
        initCharts();

        setActiveNav("dashboard");
        updateIdentity();
    }

    document.addEventListener("DOMContentLoaded", initialize);
})();
