/* ============================================================
   shared/header/header.js
   Consolidated & Cleaned
   ============================================================ */
(function () {
    "use strict";

    const ROLE_KEY  = "bd_role";
    const THEME_KEY = "bd_theme";
    const ADMIN_URL = "admin-console/admin-dashboard/admin-dashboard.html";
    const ADMIN_PASSWORD = "fedex-admin-2026";

    const ANNOUNCEMENTS_COLLECTION = "announcements";
    const HELP_COLLECTION = "help_requests";

    const VIEWED_KEY = "bd_viewed_announcements_v1";
    const HELP_IDS_KEY = "dss_help_ids";
    const HELP_SEEN_KEY = "dss_help_seen";

    /* ------------------------------------------------------------
       Global State
       ------------------------------------------------------------ */
    let announcementsUnsubscribe = null;
    let helpUnsubscribe = null;
    let currentNotifications = [];
    let globalGuideSearchIndex = [];
    let globalGuideSearchReady = false;

    /* ------------------------------------------------------------
       Utility Functions
       ------------------------------------------------------------ */
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
       1. Admin State & Token
       ------------------------------------------------------------ */
    function getState() {
        try { return JSON.parse(window.name) || {}; } catch (e) { return {}; }
    }

    function setState(obj) {
        try { window.name = JSON.stringify(obj); } catch (e) {}
    }

    function isAdminUnlocked() {
        const s = getState();
        return Boolean(s.token && typeof s.exp === "number" && s.exp > Date.now());
    }

    function setAdminUnlocked(user) {
        const s = getState();
        s.token = "ok";
        s.exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
        if (user) {
            s.uid = user.id || "";
            s.email = user.email || "";
            s.name = user.name || "";
            s.role = user.role || "";
        }
        setState(s);
    }

    /* ------------------------------------------------------------
       2. Role Management
       ------------------------------------------------------------ */
    function getRole() {
        if (isAdminUnlocked()) return "admin";
        try { return localStorage.getItem(ROLE_KEY) === "admin" ? "admin" : "user"; } 
        catch (e) { return "user"; }
    }

    function setRole(role) {
        const safe = role === "admin" ? "admin" : "user";
        try { localStorage.setItem(ROLE_KEY, safe); } catch (e) {}
        return safe;
    }

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
       4. Admin Gate Modal
       ------------------------------------------------------------ */
    function setupAdminGate() {
        const gate = document.getElementById("adminGate");
        if (!gate) return;

        const card = gate.querySelector(".admin-gate-card");
        const form = document.getElementById("adminGateForm");
        const emailInput = document.getElementById("adminGateEmail");
        const pwInput = document.getElementById("adminGateInput");
        const toggleBtn = document.getElementById("adminGateToggle");
        const error = document.getElementById("adminGateError");
        const cancel = document.getElementById("adminGateCancel");
        const submit = document.getElementById("adminGateSubmit");
        const backdrop = gate.querySelector(".admin-gate-backdrop");

        function reset() {
            pwInput.value = "";
            pwInput.type = "password";
            toggleBtn.textContent = "Show";
            error.textContent = "";
            card.classList.remove("shake");
            submit.classList.remove("loading");
            submit.disabled = false;
        }

        function open() {
            gate.hidden = false;
            reset();
            try {
                const last = localStorage.getItem("adminLastEmail");
                if (last) emailInput.value = last;
            } catch (e) {}
            setTimeout(() => (emailInput.value ? pwInput : emailInput).focus(), 60);
        }

        function close() {
            gate.hidden = true;
            reset();
        }

        function shake() {
            card.classList.remove("shake");
            void card.offsetWidth;
            card.classList.add("shake");
        }

        toggleBtn.addEventListener("click", () => {
            const showing = pwInput.type === "text";
            pwInput.type = showing ? "password" : "text";
            toggleBtn.textContent = showing ? "Show" : "Hide";
            pwInput.focus();
        });

        async function attemptUnlock() {
            error.textContent = "";
            const email = emailInput.value.trim().toLowerCase();
            const password = pwInput.value;

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                error.textContent = "Enter a valid email address.";
                emailInput.focus();
                return;
            }
            if (!password) {
                error.textContent = "Enter your password.";
                pwInput.focus();
                return;
            }
            if (password !== ADMIN_PASSWORD) {
                error.textContent = "Incorrect password.";
                pwInput.value = "";
                pwInput.focus();
                shake();
                return;
            }

            const db = firestore();
            if (!db) {
                error.textContent = "Authentication service unavailable.";
                return;
            }

            submit.disabled = true;
            submit.classList.add("loading");

            try {
                const snap = await db.collection("approved_users").where("email", "==", email).limit(1).get();
                if (snap.empty) {
                    error.textContent = "This email is not approved for admin access.";
                    shake();
                    return;
                }

                const doc = snap.docs[0];
                const data = doc.data() || {};
                const user = {
                    id: doc.id,
                    email: data.email || email,
                    name: data.name || data.displayName || email,
                    role: data.role || "User"
                };

                setAdminUnlocked(user);
                try {
                    localStorage.setItem("adminUser", JSON.stringify(user));
                    localStorage.setItem("adminLastEmail", email);
                } catch (e) {}

                close();
                window.location.href = ADMIN_URL;
            } catch (err) {
                console.error(err);
                error.textContent = "Could not verify your account. Please try again.";
                shake();
            } finally {
                submit.disabled = false;
                submit.classList.remove("loading");
            }
        }

        form.addEventListener("submit", e => { e.preventDefault(); attemptUnlock(); });
        cancel.addEventListener("click", close);
        if (backdrop) backdrop.addEventListener("click", close);
        document.addEventListener("keydown", e => { if (e.key === "Escape" && !gate.hidden) close(); });

        window.BDAdminGate = { open, close };
    }

    /* ------------------------------------------------------------
       5. Settings Dropdown & Navigation
       ------------------------------------------------------------ */
    function setupSettings() {
        const button = document.getElementById("settingsBtn");
        const menu = document.getElementById("settingsMenu");
        const adminBtn = document.getElementById("adminDashboardBtn");
        if (!button || !menu) return;

        applyRole(getRole());

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

        menu.querySelectorAll(".role-option").forEach(opt => {
            opt.addEventListener("click", e => {
                e.stopPropagation();
                applyRole(setRole(this.dataset.role));
            });
        });

        if (adminBtn) {
            adminBtn.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();
                if (getRole() !== "admin") return;
                close();
                if (isAdminUnlocked()) {
                    window.location.href = ADMIN_URL;
                } else if (window.BDAdminGate) {
                    window.BDAdminGate.open();
                }
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
       6. Notification System (Announcements + Help Requests)
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

                // Route to modal
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
                    // Announcement Routing with Polling
                    console.log("🟢 Notification clicked. Looking for update modal...");
                    
                    let attempts = 0;
                    const interval = setInterval(() => {
                        const modal = document.getElementById("dssUpdateModal");
                        const viewAll = document.querySelector('[data-update-action="view-all"]');

                        if (modal) {
                            clearInterval(interval);
                            console.log("✅ Modal found! Opening...");
                            
                            if (viewAll) viewAll.click();
                            
                            modal.hidden = false;
                            modal.classList.remove("is-open");
                            requestAnimationFrame(() => {
                                modal.classList.add("is-open");
                            });
                            document.body.classList.add("dss-modal-open");
                            
                        } else {
                            attempts++;
                            if (attempts >= 10) { // 10 * 100ms = 1 second
                                clearInterval(interval);
                                console.warn("⚠️ Modal NOT found after 1s. Redirecting...");
                                const currentPage = window.location.pathname.split("/").pop();
                                if (currentPage !== "" && currentPage !== "index.html") {
                                    window.location.href = "index.html";
                                }
                            }
                        }
                    }, 100);
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

                snap.forEach(doc => {
                    const data = doc.data() || {};
                    if (!isPublishedDoc(data)) return;

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
                        unread: isUnread
                    });
                });
                
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
    const DSS_GUIDE_BASE_PATH = "/Decision-Support-SystemV2/";
    const DSS_GUIDE_GROUPS = {
        billing: "Billing Dispute", pricing: "Pricing General", surcharge: "Surcharges",
        account: "Account Handling", paud: "PAUD Queue", other: "Other Operational"
    };
    
    // ... [DSS_GUIDE_CATALOG array goes here - keeping it exactly as you had it to save space] ...
    const DSS_GUIDE_CATALOG = [
        ["Debtor Update per BOL", "guides/Billing%20Dispute%20Guides/debtor-update-per-bol/debtor-update-per-bol.html", "Follow BOL terms to determine the correct debtor and ensure accurate billing setup.", "billing"],
        // ... (assuming the full array from previous context is pasted here) ...
        ["Write-off in CAPS — Step by Step Procedure", "guides/Other%20Guides/wo-process-caps-guide/wo-process-caps-guide.html", "Process write-offs in CAPS from Business Unit selection and PRO entry through comments, responses, and case closure.", "other"]
    ];

    const DSS_GUIDE_SEARCH_CACHE_KEY = "dssV2GlobalGuideSearchIndex_v3";
    const DSS_GUIDE_SEARCH_CACHE_TTL = 10 * 60 * 1000;

    function escapeSearchHtml(value) {
        return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    function normalizeSearchText(value) {
        return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
    }
    function getSearchRoot() {
        let root = document.querySelector(".global-search");
        if (!root) return null;
        let panel = root.querySelector(".global-search-results");
        if (!panel) {
            panel = document.createElement("div");
            panel.className = "global-search-results";
            panel.setAttribute("role", "listbox");
            root.appendChild(panel);
        }
        return { root, panel };
    }
    function setSearchPanel(panel, html, open) { if (!panel) return; panel.innerHTML = html; panel.classList.toggle("open", Boolean(open)); }
    
    function showSearchLoading() { const ui = getSearchRoot(); if (!ui) return; setSearchPanel(ui.panel, `<div class="global-search-state"><span class="global-search-spinner"></span><span>Loading guides...</span></div>`, true); }
    function showSearchEmpty() { const ui = getSearchRoot(); if (!ui) return; setSearchPanel(ui.panel, `<div class="global-search-state empty"><span class="global-search-state-icon">⌕</span><strong>No matching guides</strong><small>Try another keyword.</small></div>`, true); }
    
    function loadCachedSearchIndex() {
        try {
            const raw = sessionStorage.getItem(DSS_GUIDE_SEARCH_CACHE_KEY);
            if (!raw) return false;
            const cached = JSON.parse(raw);
            if (!cached || !Array.isArray(cached.items)) return false;
            if (Date.now() - Number(cached.timestamp || 0) > DSS_GUIDE_SEARCH_CACHE_TTL) return false;
            globalGuideSearchIndex = cached.items;
            globalGuideSearchReady = globalGuideSearchIndex.length > 0;
            return globalGuideSearchReady;
        } catch (error) { return false; }
    }
    
    function saveSearchIndexCache() {
        try { sessionStorage.setItem(DSS_GUIDE_SEARCH_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), items: globalGuideSearchIndex })); } catch (error) {}
    }
    
    function addGuideToIndex(guide, seen) {
        if (!guide || !guide.title || !guide.url) return;
        const key = guide.url.split("#")[0].toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        globalGuideSearchIndex.push(guide);
    }

    function buildStaticCatalogIndex(seen) {
        const base = window.location.origin + DSS_GUIDE_BASE_PATH;
        DSS_GUIDE_CATALOG.forEach(row => {
            const title = row[0], path = row[1], description = row[2], groupKey = row[3];
            const groupName = DSS_GUIDE_GROUPS[groupKey] || "Guide Library";
            let absoluteUrl; try { absoluteUrl = new URL(path, base).href; } catch (e) { return; }
            const searchable = normalizeSearchText([title, description, groupName].join(" "));
            addGuideToIndex({ title, description, keywords: "", group: groupName, url: absoluteUrl, search: searchable }, seen);
        });
    }

    function buildGlobalGuideSearchIndex() {
        const seen = new Set(); globalGuideSearchIndex = [];
        const currentPageUrl = window.location.href;
        const currentPageTitle = document.querySelector(".group-hero h1")?.textContent?.replace(/\s+/g, " ").trim() || document.title || "Current Page";
        
        document.querySelectorAll(".guide-card").forEach(card => {
            const title = card.querySelector("h3")?.textContent?.replace(/\s+/g, " ").trim(); if (!title) return;
            const description = card.querySelector(".lead, p")?.textContent?.replace(/\s+/g, " ").trim() || "";
            let link = card.getAttribute("data-url") || ""; const anchor = card.querySelector("a[href]"); if (!link && anchor) link = anchor.getAttribute("href") || "";
            if (!link) return;
            
            let absoluteUrl;
            if (/^(?:https?:)?\/\//i.test(link)) absoluteUrl = new URL(link, document.baseURI).href;
            else if (link.startsWith("/")) absoluteUrl = new URL(link, document.baseURI).href;
            else if (/^guides\//i.test(link)) absoluteUrl = new URL(link, document.baseURI).href;
            else absoluteUrl = new URL(link, currentPageUrl).href;
            
            const searchable = normalizeSearchText([title, description, currentPageTitle].join(" "));
            addGuideToIndex({ title, description, group: currentPageTitle, url: absoluteUrl, search: searchable }, seen);
        });
        
        buildStaticCatalogIndex(seen);
        globalGuideSearchIndex.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));
        globalGuideSearchReady = globalGuideSearchIndex.length > 0;
        saveSearchIndexCache();
    }

    function scoreGuide(guide, query) {
        const q = normalizeSearchText(query); if (!q) return 0;
        const words = q.split(" ").filter(Boolean);
        const title = normalizeSearchText(guide.title);
        const group = normalizeSearchText(guide.group);
        const search = guide.search || "";
        let score = 0;
        if (title === q) score += 1000; else if (title.startsWith(q)) score += 700; else if (title.includes(q)) score += 500;
        if (group === q) score += 350; else if (group.includes(q)) score += 180;
        if (search.includes(q)) score += 120;
        words.forEach(word => { if (title.includes(word)) score += 90; if (group.includes(word)) score += 40; if (search.includes(word)) score += 20; });
        return score;
    }

    function searchGlobalGuides(query) {
        const normalized = normalizeSearchText(query); if (!normalized) return [];
        return globalGuideSearchIndex.map(guide => ({ guide, score: scoreGuide(guide, normalized) })).filter(item => item.score > 0).sort((a, b) => { if (b.score !== a.score) return b.score - a.score; return a.guide.title.localeCompare(b.guide.title); }).slice(0, 8).map(item => item.guide);
    }

    function highlightMatch(text, query) {
        const safe = escapeSearchHtml(text);
        const words = normalizeSearchText(query).split(" ").filter(Boolean).slice(0, 5);
        if (!words.length) return safe;
        let output = safe;
        words.forEach(word => {
            const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            try { output = output.replace(new RegExp(`(${escaped})`, "ig"), "<mark>$1</mark>"); } catch (_) {}
        });
        return output;
    }

    function renderSearchResults(query, results) {
        const ui = getSearchRoot(); if (!ui) return;
        if (!results.length) { showSearchEmpty(); return; }
        const html = `<div class="global-search-results-header"><span>Guide results</span><b>${results.length}</b></div><div class="global-search-results-list">${results.map(guide => `<button class="global-search-result" type="button" data-guide-url="${escapeSearchHtml(guide.url)}"><span class="global-search-result-icon"><i class="fa-solid fa-file-lines"></i></span><span class="global-search-result-copy"><strong>${highlightMatch(guide.title, query)}</strong><small>${escapeSearchHtml(guide.group)}</small></span><span class="global-search-result-arrow">→</span></button>`).join("")}</div>`;
        setSearchPanel(ui.panel, html, true);
        ui.panel.querySelectorAll(".global-search-result").forEach(button => {
            button.addEventListener("click", function () {
                const target = this.getAttribute("data-guide-url"); if (!target) return;
                const titleEl = this.querySelector(".global-search-result-copy strong"); const title = titleEl ? titleEl.textContent.trim() : "Untitled Guide";
                if (window.GuideStore) window.GuideStore.trackOpen(title, target);
                ui.panel.classList.remove("open"); ui.root.classList.remove("has-results"); window.location.href = target;
            });
        });
    }

    async function performGlobalHeaderSearch(value, openFirstOnEnter) {
        const query = String(value || "").trim(); const ui = getSearchRoot(); if (!ui) return [];
        if (!query) { ui.panel.classList.remove("open"); ui.root.classList.remove("has-results"); return []; }
        ui.root.classList.add("has-results");
        if (!globalGuideSearchReady) { if (!loadCachedSearchIndex()) { showSearchLoading(); buildGlobalGuideSearchIndex(); } }
        const results = searchGlobalGuides(query); renderSearchResults(query, results);
        if (openFirstOnEnter && results[0]) { if (window.GuideStore) window.GuideStore.trackOpen(results[0].title, results[0].url); window.location.href = results[0].url; }
        return results;
    }

    function setupSearch() {
        const input = document.getElementById("globalSearch"); if (!input || input.dataset.v2SearchInitialized === "true") return;
        input.dataset.v2SearchInitialized = "true"; const ui = getSearchRoot(); if (!ui) return;
        let searchTimer = null;
        
        input.addEventListener("input", function () {
            clearTimeout(searchTimer); const value = this.value.trim();
            if (!value) { ui.panel.classList.remove("open"); ui.root.classList.remove("has-results"); return; }
            searchTimer = setTimeout(() => performGlobalHeaderSearch(value, false), 120);
        });
        input.addEventListener("focus", function () { if (this.value.trim()) performGlobalHeaderSearch(this.value, false); });
        input.addEventListener("keydown", function (event) {
            if (event.key === "Escape") { event.preventDefault(); ui.panel.classList.remove("open"); ui.root.classList.remove("has-results"); this.blur(); return; }
            if (event.key !== "Enter") return; event.preventDefault(); performGlobalHeaderSearch(this.value, true);
        });
        document.addEventListener("click", function (event) { if (!ui.root.contains(event.target)) { ui.panel.classList.remove("open"); ui.root.classList.remove("has-results"); } });
        if (!loadCachedSearchIndex()) { buildGlobalGuideSearchIndex(); }
    }

    /* ------------------------------------------------------------
       8. Initialize
       ------------------------------------------------------------ */
    function start() {
        setupTheme();
        setupAdminGate();
        setupSettings();
        setupCaseDirectory();
        setupNavigation();
        setupSearch();
        setupSharedNotifications();
    }

    start();
})();
