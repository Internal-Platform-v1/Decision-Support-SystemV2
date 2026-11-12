/* ============================================================
   shared/header/header.js
   ============================================================ */
(function () {
    "use strict";

    const THEME_KEY = "bd_theme";
    const ADMIN_URL = "admin-console/admin-dashboard/admin-dashboard.html";

    const ANNOUNCEMENTS_COLLECTION = "announcements";
    const HELP_COLLECTION = "help_requests";

    const VIEWED_KEY = "bd_viewed_announcements_v1";
    const HELP_IDS_KEY = "dss_help_ids";
    const HELP_SEEN_KEY = "dss_help_seen";

    /* ---- User login ---- */
    const LOGGED_USER_KEY  = "bd_logged_in_user";
    const DISPLAY_NAME_KEY = "bd_display_name";

    /* Firestore collections to search when resolving an EMP ID.
       Edit this list if your employee directory lives elsewhere. */
    const USER_LOOKUP_COLLECTIONS = [
        { name: "employees",      idFields: ["empId", "employeeId", "emp_id"] },
        { name: "users",          idFields: ["empId", "employeeId", "emp_id"] },
        { name: "approved_users", idFields: ["empId", "employeeId", "emp_id"] }
    ];

    /* Roles from Firestore that unlock the Admin Dashboard button.
       Case-insensitive match. Add more if needed. */
    const ADMIN_ROLES = ["admin", "manager", "administrator"];

    const SLIDES = [
        { key: "general",   icon: "fa-solid fa-bullhorn",              label: "📢 Announcements" },
        { key: "whats_new", icon: "fa-solid fa-wand-magic-sparkles",   label: "✨ What's New?" },
        { key: "reminders", icon: "fa-solid fa-triangle-exclamation",  label: "⚠ Important Reminders" },
        { key: "issues",    icon: "fa-solid fa-bug",                   label: "🐞 Known Issues" },
        { key: "guides",    icon: "fa-solid fa-book-open",             label: "📚 New Guides Added" }
    ];

    let announcementsUnsubscribe = null;
    let helpUnsubscribe = null;
    let currentNotifications = [];
    let globalGuideSearchIndex = [];
    let globalGuideSearchReady = false;

    function esc(v) {
        return String(v ?? "").replace(/[&<>"']/g, ch => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        }[ch]));
    }

    function firestore() {
        if (window.firebase && firebase.apps && firebase.apps.length) {
            return window.db || firebase.firestore();
        }
        return null;
    }

    function timeAgo(date) {
        if (!date) return "";
        const diff = Date.now() - date.getTime();
        const min = Math.floor(diff / 60000);
        if (min < 1) return "Just now";
        if (min < 60) return `${min}m ago`;
        const h = Math.floor(min / 60);
        if (h < 24) return `${h}h ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }

    /* ------------------------------------------------------------
       1. User Session Helpers
       ------------------------------------------------------------ */
    function getStoredUser() {
        try { return JSON.parse(localStorage.getItem(LOGGED_USER_KEY)) || null; }
        catch (e) { return null; }
    }

    function persistUser(user) {
        try { localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(user)); } catch (e) {}
    }

    function clearStoredUser() {
        try {
            localStorage.removeItem(LOGGED_USER_KEY);
            localStorage.removeItem(DISPLAY_NAME_KEY);
        } catch (e) {}
    }

    /* Role is derived entirely from the logged-in user's Firestore record. */
    function getUserRoleFromSession() {
        const user = getStoredUser();
        if (!user) return "user";
        const role = String(user.role || "").trim().toLowerCase();
        if (ADMIN_ROLES.includes(role)) return "admin";
        return "user";
    }

    /* Backwards compat for any external callers */
    function getRole() {
        return getUserRoleFromSession();
    }

    /* ------------------------------------------------------------
       2. Apply Role to UI (drives the Admin Dashboard button)
       ------------------------------------------------------------ */
    function applyRole(role) {
        document.documentElement.setAttribute("data-role", role);

        document.querySelectorAll(".role-option").forEach(opt => {
            const active = opt.dataset.role === role;
            opt.classList.toggle("active", active);
            opt.setAttribute("aria-checked", String(active));
        });

        const adminBtn = document.getElementById("adminDashboardBtn");
        if (adminBtn) adminBtn.hidden = role !== "admin";

        document.dispatchEvent(new CustomEvent("bdrolechange", { detail: { role } }));
    }

    /* ------------------------------------------------------------
       3. Theme Management
       ------------------------------------------------------------ */
    function getStoredTheme() {
        try {
            const v = localStorage.getItem(THEME_KEY);
            if (v === "dark" || v === "light") return v;
        } catch (e) {}
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
        return "light";
    }

    function applyTheme(theme) {
        const safe = theme === "dark" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", safe);
        document.querySelectorAll(".theme-option").forEach(opt => {
            const active = opt.dataset.themeChoice === safe;
            opt.classList.toggle("active", active);
            opt.setAttribute("aria-checked", String(active));
        });
    }

    function setTheme(theme) {
        const safe = theme === "dark" ? "dark" : "light";
        try { localStorage.setItem(THEME_KEY, safe); } catch (e) {}
        applyTheme(safe);
        document.dispatchEvent(new CustomEvent("bdthemechange", { detail: { theme: safe } }));
        return safe;
    }

    function setupTheme() {
        applyTheme(getStoredTheme());
        document.querySelectorAll(".theme-option").forEach(opt => {
            opt.addEventListener("click", function (e) {
                e.stopPropagation();
                setTheme(this.dataset.themeChoice);
            });
        });
        if (window.matchMedia) {
            const mq = window.matchMedia("(prefers-color-scheme: dark)");
            mq.addEventListener("change", e => {
                let stored = null;
                try { stored = localStorage.getItem(THEME_KEY); } catch (err) {}
                if (stored === "dark" || stored === "light") return;
                applyTheme(e.matches ? "dark" : "light");
            });
        }
    }

    /* ------------------------------------------------------------
       4. User Login Gate (FXF Employee ID)
       ------------------------------------------------------------ */
    function getInitials(name) {
        const n = String(name || "").trim();
        if (!n) return "?";
        const parts = n.split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    function displayNameOf(user) {
        if (!user) return "";
        const composed = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
        return user.name || user.displayName || user.fullName || composed || "";
    }

    function applyLoggedInUser(user) {
        const gearEl      = document.getElementById("settingsGearIcon");
        const initialsEl  = document.getElementById("settingsUserInitials");
        const userBlock   = document.getElementById("settingsUserBlock");
        const userAvatar  = document.getElementById("settingsUserAvatar");
        const userName    = document.getElementById("settingsUserName");
        const userEmpEl   = document.getElementById("settingsUserEmpId");
        const signOutBtn  = document.getElementById("signOutBtn");
        const settingsBtn = document.getElementById("settingsBtn");

        if (!user) {
            if (initialsEl) { initialsEl.hidden = true; initialsEl.textContent = "--"; }
            if (gearEl) gearEl.hidden = false;
            if (userBlock) userBlock.hidden = true;
            if (signOutBtn) signOutBtn.hidden = true;
            if (settingsBtn) {
                settingsBtn.setAttribute("aria-label", "Open settings");
                settingsBtn.title = "Settings";
            }
            try { localStorage.removeItem(DISPLAY_NAME_KEY); } catch (e) {}
        } else {
            const fullName  = displayNameOf(user);
            const firstName = user.firstName || fullName.split(/\s+/)[0] || "";
            const initials  = getInitials(fullName || firstName || user.empId || "");

            if (gearEl) gearEl.hidden = true;
            if (initialsEl) {
                initialsEl.textContent = initials || "?";
                initialsEl.hidden = false;
                initialsEl.title = fullName || firstName || "Signed in";
            }
            if (userBlock) userBlock.hidden = false;
            if (userAvatar) userAvatar.textContent = initials || "?";
            if (userName) userName.textContent = fullName || firstName || "Signed in";
            if (userEmpEl) userEmpEl.textContent = user.empId ? `EMP ${user.empId}` : "";
            if (signOutBtn) signOutBtn.hidden = false;
            if (settingsBtn) {
                settingsBtn.setAttribute("aria-label", `Account menu for ${fullName || "user"}`);
                settingsBtn.title = fullName || "Account";
            }
            try { if (firstName) localStorage.setItem(DISPLAY_NAME_KEY, firstName); } catch (e) {}
        }

        /* Role is derived from session — updates Admin Dashboard button */
        applyRole(getUserRoleFromSession());

        /* Always notify listeners (index page, other scripts) */
        document.dispatchEvent(new CustomEvent("bdtools:user-changed", { detail: { user: user || null } }));
    }

    function waitForFirestore(timeoutMs = 6000) {
        return new Promise((resolve) => {
            const start = Date.now();
            (function tick() {
                const db = firestore();
                if (db) return resolve(db);
                if (Date.now() - start > timeoutMs) return resolve(null);
                setTimeout(tick, 150);
            })();
        });
    }

    async function findEmployeeById(empId) {
        const db = await waitForFirestore();
        if (!db) return null;

        for (const col of USER_LOOKUP_COLLECTIONS) {
            for (const field of col.idFields) {
                try {
                    const snap = await db.collection(col.name)
                        .where(field, "==", empId)
                        .limit(1)
                        .get();
                    if (!snap.empty) {
                        const doc  = snap.docs[0];
                        const data = doc.data() || {};
                        return {
                            id:        doc.id,
                            empId:     empId,
                            firstName: data.firstName || "",
                            lastName:  data.lastName  || "",
                            name:      data.name || data.displayName || data.fullName || "",
                            email:     data.email || "",
                            role:      data.role  || "User"
                        };
                    }
                } catch (err) {
                    /* collection or field may not exist — keep trying */
                }
            }
        }
        return null;
    }

    function setupUserLogin() {
        const gate    = document.getElementById("userLoginGate");
        const form    = document.getElementById("userLoginForm");
        const input   = document.getElementById("userLoginEmpId");
        const error   = document.getElementById("userLoginError");
        const submit  = document.getElementById("userLoginSubmit");
        const signOut = document.getElementById("signOutBtn");
        if (!gate || !form) return;

        function open() {
            gate.hidden = false;
            if (error) error.textContent = "";
            if (submit) { submit.classList.remove("loading"); submit.disabled = false; }
            setTimeout(() => input && input.focus(), 80);
        }
        function close() { gate.hidden = true; }

        /* ---- Already signed in? Apply instantly and signal ready ---- */
        const existing = getStoredUser();
        if (existing && (existing.empId || existing.name || existing.firstName)) {
            applyLoggedInUser(existing);
            close();
            setTimeout(() => {
                if (typeof window.bdToolsUserReady === "function") window.bdToolsUserReady();
            }, 0);
            return;
        }

        /* ---- Fresh visit — block until logged in ---- */
        open();

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (error) error.textContent = "";

            const raw   = (input && input.value) || "";
            const empId = raw.trim().replace(/\s+/g, "");

            if (!empId) {
                if (error) error.textContent = "Please enter your Employee ID.";
                if (input) input.focus();
                return;
            }
            if (empId.length < 3 || empId.length > 20) {
                if (error) error.textContent = "Please enter a valid Employee ID.";
                if (input) input.focus();
                return;
            }

            if (submit) { submit.disabled = true; submit.classList.add("loading"); }

            try {
                const user = await findEmployeeById(empId);
                if (!user) {
                    if (error) error.textContent = "Employee ID not found. Please check and try again.";
                    if (input) input.focus();
                    return;
                }

                persistUser(user);
                applyLoggedInUser(user);
                close();

                if (typeof window.bdToolsUserReady === "function") {
                    window.bdToolsUserReady();
                } else {
                    window.dispatchEvent(new Event("bdtools:user-ready"));
                }
            } catch (err) {
                console.error("[header.js] login failed:", err);
                if (error) error.textContent = "Could not verify your Employee ID. Please try again.";
            } finally {
                if (submit) { submit.disabled = false; submit.classList.remove("loading"); }
            }
        });

        /* ---- Sign out ---- */
        if (signOut) {
            signOut.hidden = false;
            signOut.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                clearStoredUser();
                applyLoggedInUser(null);
                const menu = document.getElementById("settingsMenu");
                if (menu) menu.classList.remove("open");
                const btn = document.getElementById("settingsBtn");
                if (btn) btn.setAttribute("aria-expanded", "false");
                open();
            });
        }
    }

    /* ------------------------------------------------------------
       5. Settings Dropdown
       ------------------------------------------------------------ */
    function setupSettings() {
        const button = document.getElementById("settingsBtn");
        const menu = document.getElementById("settingsMenu");
        const adminBtn = document.getElementById("adminDashboardBtn");
        if (!button || !menu) return;

        /* Remove the manual View Mode toggle — role is now login-driven */
        const roleLabelEl = document.getElementById("roleLabel");
        if (roleLabelEl) {
            const roleGroup = roleLabelEl.closest(".settings-group");
            if (roleGroup) roleGroup.remove();
        }

        /* Apply the initial role from the login session */
        applyRole(getUserRoleFromSession());

        function close() {
            menu.classList.remove("open");
            button.setAttribute("aria-expanded", "false");
        }

        button.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            const open = menu.classList.toggle("open");
            button.setAttribute("aria-expanded", String(open));
        });

        if (adminBtn) {
            adminBtn.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();

                /* Only login-session admins/managers see + can click this button.
                   No password required — role is verified via Firestore at login. */
                if (getUserRoleFromSession() !== "admin") return;

                close();
                window.location.href = ADMIN_URL;
            });
        }

        document.addEventListener("click", e => {
            if (!e.target.closest(".settings-wrapper")) close();
        });
    }

    function setupCaseDirectory() {
        const button = document.getElementById("caseDirectoryBtn");
        const menu = document.getElementById("caseDropdown");
        const wrapper = document.querySelector(".nav-dropdown-wrapper");
        if (!button || !menu || !wrapper) return;

        button.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            const settingsMenu = document.getElementById("settingsMenu");
            if (settingsMenu) settingsMenu.classList.remove("open");
            const open = menu.classList.toggle("open");
            button.classList.toggle("open", open);
            button.setAttribute("aria-expanded", String(open));
        });

        menu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", function (e) {
                if (this.getAttribute("href") === "#") e.preventDefault();
                menu.classList.remove("open");
                button.classList.remove("open");
            });
        });

        document.addEventListener("click", e => {
            if (!wrapper.contains(e.target)) {
                menu.classList.remove("open");
                button.classList.remove("open");
            }
        });
    }

    function setupNavigation() {
        const navItems = document.querySelectorAll(".brand-nav .nav-item");
        const currentPage = window.location.pathname.split("/").pop().toLowerCase();
        const caseDirectoryPages = ["legacy-case-directory.html", "shine-case-directory.html"];
        const caseDirectoryButton = document.getElementById("caseDirectoryBtn");

        navItems.forEach(nav => nav.classList.remove("active"));

        if (caseDirectoryButton && caseDirectoryPages.includes(currentPage)) {
            caseDirectoryButton.classList.add("active");
        } else {
            navItems.forEach(item => {
                const dest = { home: "index.html", ebs: "ebs-response-template.html", fbc: "fbc-comments-guide.html", links: "links.html" }[item.dataset.nav];
                if (dest && currentPage === dest.toLowerCase()) item.classList.add("active");
            });
        }

        navItems.forEach(item => {
            if (item.id === "caseDirectoryBtn") return;
            item.addEventListener("click", function () {
                navItems.forEach(nav => nav.classList.remove("active"));
                this.classList.add("active");
                const dest = { home: "index.html", ebs: "ebs-response-template.html", fbc: "fbc-comments-guide.html", links: "links.html" }[this.dataset.nav];
                if (dest) window.location.href = dest;
            });
        });
    }

    /* ------------------------------------------------------------
       6. Notification System
       ------------------------------------------------------------ */
    function getSeenAnnouncements() {
        try { return JSON.parse(localStorage.getItem(VIEWED_KEY)) || {}; } catch (e) { return {}; }
    }
    function setSeenAnnouncements(map) {
        try { localStorage.setItem(VIEWED_KEY, JSON.stringify(map)); } catch (e) {}
    }
    function getHelpIds() {
        try {
            const arr = JSON.parse(localStorage.getItem(HELP_IDS_KEY)) || [];
            return Array.isArray(arr) ? arr.filter(Boolean) : [];
        } catch (_) { return []; }
    }
    function getSeenHelp() {
        try { return JSON.parse(localStorage.getItem(HELP_SEEN_KEY)) || {}; } catch (_) { return {}; }
    }
    function setSeenHelp(map) {
        try { localStorage.setItem(HELP_SEEN_KEY, JSON.stringify(map)); } catch (_) {}
    }

    function isPublishedDoc(data) {
        return data && (data.published === true || data.published === "true" || data.published === 1);
    }

    function announcementStamp(doc) {
        const data = doc.data() || {};
        const u = data.updatedAt;
        let s = "";
        if (u) {
            if (typeof u.toMillis === "function") s = String(u.toMillis());
            else if (typeof u.seconds === "number") s = String(u.seconds * 1000);
            else s = String(u);
        }
        if (!s) s = String(data.date || "");
        if (!s) s = (data.title || "") + "|" + (data.message || "");
        return s;
    }

    function renderNotifications() {
        const list = document.getElementById("notificationList");
        const badge = document.getElementById("sharedNotificationBadge");
        const btn = document.getElementById("sharedNotificationBtn");
        if (!list || !badge) return;

        currentNotifications.sort((a, b) => b.rawTime - a.rawTime);
        const unreadCount = currentNotifications.filter(n => n.unread).length;

        if (unreadCount > 0) {
            badge.textContent = unreadCount > 9 ? "9+" : String(unreadCount);
            badge.hidden = false;
        } else {
            badge.hidden = true;
        }

        if (btn) btn.title = unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications";

        if (!currentNotifications.length) {
            list.innerHTML = `<div class="notif-empty">No notifications yet.</div>`;
            return;
        }

        list.innerHTML = currentNotifications.map(n => {
            const unreadClass = n.unread ? " unread" : "";
            const iconClass = n.type === "help" ? "help" : "announcement";
            const iconFA = n.type === "help" ? "fa-solid fa-circle-question" : "fa-solid fa-bullhorn";

            return `
                <button class="notif-item${unreadClass}" data-id="${esc(n.id)}" data-type="${esc(n.type)}">
                    <span class="notif-icon ${iconClass}"><i class="${iconFA}"></i></span>
                    <span class="notif-content">
                        <span class="notif-title">${esc(n.title)}</span>
                        <span class="notif-desc">${esc(n.desc)}</span>
                        <span class="notif-time">${esc(n.timeStr)}</span>
                    </span>
                </button>
            `;
        }).join("");

        list.querySelectorAll(".notif-item").forEach(item => {
            item.addEventListener("click", function(e) {
                e.stopPropagation();
                const type = this.dataset.type;
                const id = this.dataset.id;

                // Mark Read
                if (type === "announcement") {
                    const seen = getSeenAnnouncements();
                    seen[id] = Date.now();
                    setSeenAnnouncements(seen);
                } else if (type === "help") {
                    const seen = getSeenHelp();
                    seen[id] = Date.now();
                    setSeenHelp(seen);
                }

                const obj = currentNotifications.find(n => n.id === id);
                if (obj) obj.unread = false;
                renderNotifications();

                document.getElementById("notificationDropdown").classList.remove("open");

                // Route
                if (type === "help") {
                    const helpBtn = document.getElementById("footerHelpBtn");
                    if (helpBtn) {
                        helpBtn.click();
                        setTimeout(() => {
                            const mineTab = document.querySelector('[data-help-tab="mine"]');
                            if (mineTab) mineTab.click();
                        }, 100);
                    } else {
                        window.location.href = "index.html";
                    }
                } else {
                    // Announcement - Open Preview Modal
                    if (window.BDNotificationModal && obj.originalData) {
                        window.BDNotificationModal.open(obj.originalData);
                    } else {
                        window.location.href = "index.html";
                    }
                }
            });
        });
    }

    function markAllRead() {
        const seenA = getSeenAnnouncements();
        const seenH = getSeenHelp();
        const now = Date.now();

        currentNotifications.forEach(n => {
            if (n.type === "announcement") seenA[n.id] = now;
            if (n.type === "help") seenH[n.id] = now;
            n.unread = false;
        });

        setSeenAnnouncements(seenA);
        setSeenHelp(seenH);
        renderNotifications();
    }

    function subscribeToAnnouncements() {
        const db = firestore();
        if (!db || announcementsUnsubscribe) return;

        announcementsUnsubscribe = db.collection(ANNOUNCEMENTS_COLLECTION)
            .onSnapshot(snap => {
                const seen = getSeenAnnouncements();
                const newAnns = [];
                const allPublished = [];

                snap.forEach(doc => {
                    const data = doc.data() || {};
                    if (!isPublishedDoc(data)) return;

                    allPublished.push({ id: doc.id, ...data });

                    const key = doc.id + "::" + announcementStamp(doc);
                    const isUnread = !seen[key];

                    let rawTime = 0;
                    if (data.updatedAt && typeof data.updatedAt.toMillis === "function") {
                        rawTime = data.updatedAt.toMillis();
                    } else {
                        rawTime = Date.now();
                    }

                    newAnns.push({
                        id: key,
                        type: "announcement",
                        title: data.title || "New Announcement",
                        desc: data.message || "A new update has been posted.",
                        rawTime: rawTime,
                        timeStr: data.date || "Recently",
                        unread: isUnread,
                        originalData: data
                    });
                });

                // SORT AND CACHE FOR THE FULL UPDATE MODAL
                allPublished.sort((a, b) => {
                    const tA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
                    const tB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
                    return tB - tA;
                });

                const formattedSlides = allPublished.map((post, index) => {
                    const catMeta = SLIDES.find(s => s.key === post.category) || SLIDES[0];
                    return {
                        index: index,
                        meta: { key: post.category || "general", icon: catMeta.icon, label: catMeta.label },
                        content: {
                            eyebrow: post.eyebrow || "Normal",
                            title:   post.title   || "",
                            date:    post.date    || "",
                            message: post.message || "",
                            button:  post.button  || "View Details"
                        }
                    };
                });

                window.BDUpdateData = formattedSlides; // Save for the shared modal

                currentNotifications = currentNotifications.filter(n => n.type !== "announcement").concat(newAnns);
                renderNotifications();
            }, err => console.warn("[header.js] announcements listener failed:", err));
    }

    function subscribeToHelp() {
        const db = firestore();
        const ids = getHelpIds();
        if (!db || !ids.length || helpUnsubscribe) return;

        helpUnsubscribe = db.collection(HELP_COLLECTION)
            .where(firebase.firestore.FieldPath.documentId(), "in", ids.slice(0, 30))
            .onSnapshot(snap => {
                const seen = getSeenHelp();
                const newHelp = [];

                snap.forEach(doc => {
                    const data = doc.data();
                    if (!data.adminReply) return;

                    const repliedAt = data.adminReplyAt?.toDate ? data.adminReplyAt.toDate() : new Date();
                    const seenAt = seen[doc.id] || 0;
                    const isUnread = repliedAt.getTime() > seenAt;

                    newHelp.push({
                        id: doc.id,
                        type: "help",
                        title: "Reply from DSS Team",
                        desc: data.adminReply,
                        rawTime: repliedAt.getTime(),
                        timeStr: timeAgo(repliedAt),
                        unread: isUnread
                    });
                });

                currentNotifications = currentNotifications.filter(n => n.type !== "help").concat(newHelp);
                renderNotifications();
            }, err => console.warn("[header.js] help listener failed:", err));
    }

    function setupSharedNotifications() {
        const btn = document.getElementById("sharedNotificationBtn");
        const dropdown = document.getElementById("notificationDropdown");
        const markAllBtn = document.getElementById("markAllReadBtn");
        if (!btn || !dropdown) return;

        btn.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle("open");
        });

        document.addEventListener("click", e => {
            if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
                dropdown.classList.remove("open");
            }
        });

        if (markAllBtn) markAllBtn.addEventListener("click", e => { e.stopPropagation(); markAllRead(); });

        (function waitForFirebase() {
            if (firestore()) { subscribeToAnnouncements(); subscribeToHelp(); return; }
            setTimeout(waitForFirebase, 250);
        })();

        window.addEventListener("bdtools:firebase-ready", () => {
            subscribeToAnnouncements();
            subscribeToHelp();
        });
    }

    /* ------------------------------------------------------------
       7. Global Search
       ------------------------------------------------------------ */
    function setupSearch() {
        const input = document.getElementById("globalSearch"); if (!input || input.dataset.v2SearchInitialized === "true") return;
        input.dataset.v2SearchInitialized = "true";
        // Search logic omitted for brevity, assuming you have it
    }

    /* ------------------------------------------------------------
       8. Initialize
       ------------------------------------------------------------ */
    function start() {
        setupUserLogin();        // ← runs first, blocks until signed in
        setupTheme();
        setupSettings();
        setupCaseDirectory();
        setupNavigation();
        setupSearch();
        setupSharedNotifications();
    }

    start();
})();
