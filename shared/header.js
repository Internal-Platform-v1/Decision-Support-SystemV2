/* ============================================================
   shared/header.js — V2
   Header behavior + current-user display
   Runs once after header.html has been inserted.
   ============================================================ */
(function () {
    "use strict";

    const FIREBASE_CONFIG = {
        apiKey: "AIzaSyDjaMdeh0Cgx00hzDyZOi54fKDr8KwnxJU",
        authDomain: "bdgg-database.firebaseapp.com",
        projectId: "bdgg-database",
        storageBucket: "bdgg-database.appspot.com",
        messagingSenderId: "43574975434",
        appId: "1:43574975434:web:4c79e581267fdfcc6ccd33"
    };

    /* ------------------------------------------------------------
       Firebase: initialize once only
       ------------------------------------------------------------ */
    function getFirebase() {
        if (typeof firebase === "undefined") {
            console.error("V2 Header: Firebase SDK is not loaded.");
            return null;
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }

        return firebase;
    }

    /* ------------------------------------------------------------
       User name / avatar
       ------------------------------------------------------------ */
    function initialsFromName(name) {
        const value = String(name || "User").trim().replace(/\s+/g, " ");
        const parts = value.split(" ");

        if (parts.length === 1) {
            return value.slice(0, 2).toUpperCase();
        }

        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    function updateUserDisplay(profile) {
        const name = profile && profile.displayName
            ? profile.displayName
            : "User";

        const profileName = document.getElementById("profileName");
        const profileButton = document.getElementById("profileBtn");

        if (profileName) {
            profileName.textContent = name;
        }

        if (profileButton) {
            profileButton.textContent = initialsFromName(name);
            profileButton.setAttribute("aria-label", "Open profile for " + name);
        }

        const dashboardName = document.getElementById("currentUserName");
        if (dashboardName) {
            dashboardName.textContent = name;
        }
    }

    async function loadUser(user) {
        const fb = getFirebase();
        if (!fb || !user) return;

        const email = String(user.email || "").trim().toLowerCase();
        let displayName = user.displayName || email.split("@")[0] || "User";
        let role = "";

        try {
            const snapshot = await fb.firestore()
                .collection("approved_users")
                .where("email", "==", email)
                .limit(1)
                .get();

            if (!snapshot.empty) {
                const data = snapshot.docs[0].data() || {};

                if (data.name) {
                    displayName = String(data.name)
                        .replace(/\s+vndr$/i, "")
                        .trim();
                }

                if (data.role) {
                    role = String(data.role).trim();
                }
            }
        } catch (error) {
            console.error("V2 Header: approved_users lookup failed:", error);
        }

        window.currentUser = user;
        window.currentUserProfile = {
            uid: user.uid,
            email: user.email,
            displayName: displayName,
            role: role
        };

        updateUserDisplay(window.currentUserProfile);

        document.dispatchEvent(new CustomEvent("currentUserProfileLoaded", {
            detail: window.currentUserProfile
        }));

        console.log("V2 Header: current user loaded:", window.currentUserProfile);
    }

    /* ------------------------------------------------------------
       Profile dropdown
       ------------------------------------------------------------ */
    function setupProfile() {
        const button = document.getElementById("profileBtn");
        const chevron = document.getElementById("profileChevron");
        const menu = document.getElementById("profileMenu");

        if (!button || !menu) {
            console.error("V2 Header: profile elements were not found.");
            return;
        }

        const toggle = function (event) {
            event.preventDefault();
            event.stopPropagation();

            const open = menu.classList.toggle("open");
            button.setAttribute("aria-expanded", String(open));

            if (chevron) {
                chevron.setAttribute("aria-expanded", String(open));
            }
        };

        button.addEventListener("click", toggle);

        if (chevron) {
            chevron.addEventListener("click", toggle);
        }

        menu.querySelectorAll("button").forEach(function (item) {
            item.addEventListener("click", function (event) {
                event.stopPropagation();

                const action = this.textContent.trim().toLowerCase();

                if (action.includes("logout")) {
                    const fb = getFirebase();
                    if (fb) {
                        fb.auth().signOut().then(function () {
                            window.location.href = "index.html";
                        }).catch(function (error) {
                            console.error("Logout failed:", error);
                        });
                    }
                }
            });
        });

        document.addEventListener("click", function (event) {
            if (!event.target.closest(".header-actions")) {
                menu.classList.remove("open");
                button.setAttribute("aria-expanded", "false");
                if (chevron) chevron.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* ------------------------------------------------------------
       Case Directory dropdown
       ------------------------------------------------------------ */
    function setupCaseDirectory() {
        const button = document.getElementById("caseDirectoryBtn");
        const menu = document.getElementById("caseDropdown");
        const wrapper = document.querySelector(".nav-dropdown-wrapper");

        if (!button || !menu || !wrapper) {
            console.error("V2 Header: Case Directory elements were not found.");
            return;
        }

        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            const profileMenu = document.getElementById("profileMenu");
            if (profileMenu) profileMenu.classList.remove("open");

            const open = menu.classList.toggle("open");
            button.classList.toggle("open", open);
            button.setAttribute("aria-expanded", String(open));
        });

        menu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function (event) {
                if (this.getAttribute("href") === "#") {
                    event.preventDefault();
                }
                menu.classList.remove("open");
                button.classList.remove("open");
                button.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", function (event) {
            if (!wrapper.contains(event.target)) {
                menu.classList.remove("open");
                button.classList.remove("open");
                button.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* ------------------------------------------------------------
       Main navigation
       ------------------------------------------------------------ */
    function setupNavigation() {
        const navItems = document.querySelectorAll(".brand-nav .nav-item");

        navItems.forEach(function (item) {
            if (item.id === "caseDirectoryBtn") return;

            item.addEventListener("click", function () {
                navItems.forEach(function (nav) {
                    nav.classList.remove("active");
                });

                this.classList.add("active");

                const destination = {
                    home: "index-main.html",
                    ebs: "ebs-response-template.html",
                    fbc: "fbc-comments-guide.html",
                    links: "links.html"
                }[this.dataset.nav];

                if (destination) {
                    window.location.href = destination;
                }
            });
        });
    }

    /* ------------------------------------------------------------
       Global search
       ------------------------------------------------------------ */
    function setupSearch() {
        const input = document.getElementById("globalSearch");
        if (!input) return;

        input.addEventListener("keydown", function (event) {
            if (event.key !== "Enter") return;

            const value = input.value.trim();
            if (!value) return;

            if (typeof window.performSearch === "function") {
                window.performSearch(value);
            }
        });
    }

    /* ------------------------------------------------------------
       One-time startup
       ------------------------------------------------------------ */
    function start() {
        setupProfile();
        setupCaseDirectory();
        setupNavigation();
        setupSearch();

        const fb = getFirebase();
        if (fb) {
            /* One auth-state listener. No polling or MutationObserver. */
            fb.auth().onAuthStateChanged(function (user) {
                if (user) {
                    loadUser(user);
                } else {
                    window.currentUser = null;
                    window.currentUserProfile = null;
                }
            });
        }
    }

    start();
})();
