/* ============================================================
   shared/header.js – V2 FIXED
   FedEx Freight Decision Support System
   ============================================================ */

(function () {
    "use strict";

    /* ========================================================
       1. FIREBASE / CURRENT USER PROFILE
       ======================================================== */

    const FIREBASE_CONFIG = {
        apiKey: "AIzaSyDjaMdeh0Cgx00hzDyZOi54fDkR81wnxJU",
        authDomain: "bdgg-database.firebaseapp.com",
        projectId: "bdgg-database",
        storageBucket: "bdgg-database.appspot.com",
        messagingSenderId: "43574975434",
        appId: "1:43574975434:web:4c79e581267fdfcc6ccd33"
    };

    function ensureFirebase() {
        if (typeof firebase === "undefined") {
            console.error("V2 Header: Firebase SDK is not loaded.");
            return false;
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }

        return !!firebase.auth && !!firebase.firestore;
    }

    function updateDashboardUserName(displayName) {
        const name = displayName || "User";

        document.querySelectorAll("#currentUserName").forEach(function (el) {
            el.textContent = name;
        });
    }

    function loadCurrentUserProfile() {
        if (!ensureFirebase()) {
            return;
        }

        firebase.auth().onAuthStateChanged(async function (user) {
            if (!user) {
                window.currentUser = null;
                window.currentUserProfile = null;
                return;
            }

            window.currentUser = user;

            const email = String(user.email || "").trim().toLowerCase();

            if (!email) {
                return;
            }

            let displayName =
                user.displayName ||
                email.split("@")[0];

            let role = "";

            try {
                /*
                 * IMPORTANT:
                 * approved_users is searched by its email FIELD.
                 * This matches the existing working V1 lookup.
                 */
                const snapshot = await firebase
                    .firestore()
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
                console.error(
                    "V2 Header: Unable to load approved_users profile.",
                    error
                );
            }

            window.currentUserProfile = {
                uid: user.uid,
                email: user.email,
                displayName: displayName,
                role: role
            };

            updateHeaderUserProfile(window.currentUserProfile);

            document.dispatchEvent(
                new CustomEvent("currentUserProfileLoaded", {
                    detail: window.currentUserProfile
                })
            );
        });
    }

    /* ========================================================
       2. UPDATE HEADER USER INFORMATION
       ======================================================== */

    function updateHeaderUserProfile(profile) {
        if (!profile) {
            return;
        }

        const displayName = profile.displayName || "User";

        const profileName = document.getElementById("profileName");
        if (profileName) {
            profileName.textContent = displayName;
        }

        const profileNameClass =
            document.querySelector(".profile-menu .profile-name");

        if (profileNameClass) {
            profileNameClass.textContent = displayName;
        }

        const initials = getUserInitials(displayName);

        const profileBtn = document.getElementById("profileBtn");

        if (profileBtn) {
            profileBtn.textContent = initials;
            profileBtn.setAttribute(
                "aria-label",
                "Open profile for " + displayName
            );
        }

        updateDashboardUserName(displayName);
    }

    function getUserInitials(name) {
        if (!name) {
            return "JD";
        }

        const cleanName = String(name)
            .trim()
            .replace(/\s+/g, " ");

        const parts = cleanName.split(" ");

        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    }

    /* ========================================================
       3. PROFILE DROPDOWN
       Uses event delegation so it works even when
       header.html is injected after this script loads.
       ======================================================== */

    function setProfileOpen(open) {
        const menu = document.getElementById("profileMenu");
        const button = document.getElementById("profileBtn");
        const chevron = document.getElementById("profileChevron");

        if (!menu) {
            return;
        }

        menu.classList.toggle("open", !!open);

        if (button) {
            button.setAttribute("aria-expanded", String(!!open));
        }

        if (chevron) {
            chevron.setAttribute("aria-expanded", String(!!open));
        }
    }

    function toggleProfile(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const menu = document.getElementById("profileMenu");

        if (!menu) {
            return;
        }

        setProfileOpen(!menu.classList.contains("open"));
    }

    /* ========================================================
       4. CASE DIRECTORY DROPDOWN
       Matches the ACTUAL header.html:
       .nav-dropdown-wrapper / #caseDropdown
       ======================================================== */

    function setCaseDropdownOpen(open) {
        const menu = document.getElementById("caseDropdown");
        const button = document.getElementById("caseDirectoryBtn");

        if (!menu) {
            return;
        }

        menu.classList.toggle("open", !!open);

        if (button) {
            button.classList.toggle("open", !!open);
            button.setAttribute("aria-expanded", String(!!open));
        }
    }

    function toggleCaseDropdown(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const menu = document.getElementById("caseDropdown");

        if (!menu) {
            return;
        }

        setCaseDropdownOpen(!menu.classList.contains("open"));
    }

    /* ========================================================
       5. DYNAMIC HEADER EVENT HANDLING
       ======================================================== */

    document.addEventListener("click", function (event) {
        const profileButton = event.target.closest("#profileBtn");
        const profileChevron = event.target.closest("#profileChevron");
        const profileMenu = event.target.closest("#profileMenu");

        if (profileButton || profileChevron) {
            toggleProfile(event);
            return;
        }

        const caseButton = event.target.closest("#caseDirectoryBtn");

        if (caseButton) {
            toggleCaseDropdown(event);
            return;
        }

        const caseLink = event.target.closest("#caseDropdown a");

        if (caseLink) {
            const href = caseLink.getAttribute("href");

            if (!href || href === "#") {
                event.preventDefault();
            }

            const label = caseLink.textContent.trim();

            if (window.showToast) {
                window.showToast("Opening " + label);
            } else {
                console.log("Opening " + label);
            }

            setCaseDropdownOpen(false);
            return;
        }

        /*
         * Profile menu buttons.
         */
        const menuButton = event.target.closest("#profileMenu button");

        if (menuButton) {
            event.stopPropagation();

            const label = menuButton.textContent.trim().toLowerCase();

            if (label.includes("logout")) {
                if (ensureFirebase()) {
                    firebase.auth()
                        .signOut()
                        .then(function () {
                            window.location.href = "index.html";
                        })
                        .catch(function (error) {
                            console.error(
                                "Logout failed:",
                                error
                            );
                        });
                }

                return;
            }

            if (window.showToast) {
                window.showToast(
                    menuButton.textContent.trim() + " selected"
                );
            }

            return;
        }

        /*
         * Close profile when clicking outside the header actions.
         */
        if (!event.target.closest(".header-actions")) {
            setProfileOpen(false);
        }

        /*
         * Close Case Directory when clicking outside it.
         */
        if (!event.target.closest(".nav-dropdown-wrapper")) {
            setCaseDropdownOpen(false);
        }
    });

    /* ========================================================
       6. MAIN NAVIGATION
       Matches the ACTUAL header.html:
       .brand-nav / .nav-item
       ======================================================== */

    document.addEventListener("click", function (event) {
        const navItem = event.target.closest(
            ".brand-nav .nav-item"
        );

        if (!navItem) {
            return;
        }

        if (navItem.id === "caseDirectoryBtn") {
            return;
        }

        document
            .querySelectorAll(".brand-nav .nav-item")
            .forEach(function (item) {
                item.classList.remove("active");
            });

        navItem.classList.add("active");
    });

    /* ========================================================
       7. GLOBAL SEARCH
       Event delegation makes this safe with dynamic header.
       ======================================================== */

    document.addEventListener("keydown", function (event) {
        const searchInput = event.target.closest("#globalSearch");

        if (!searchInput || event.key !== "Enter") {
            return;
        }

        if (window.performSearch) {
            window.performSearch(searchInput.value);
        } else {
            console.log("Search:", searchInput.value);
        }
    });

    /* ========================================================
       8. KEEP HEADER PROFILE IN SYNC WHEN HEADER IS INJECTED
       ======================================================== */

    function refreshInjectedHeader() {
        if (window.currentUserProfile) {
            updateHeaderUserProfile(window.currentUserProfile);
        }
    }

    /*
     * include.js injects header.html dynamically.
     * MutationObserver catches that insertion without requiring
     * a special custom event from include.js.
     */
    if (document.body) {
        const observer = new MutationObserver(function () {
            if (
                document.getElementById("profileBtn") ||
                document.getElementById("profileName") ||
                document.getElementById("currentUserName")
            ) {
                refreshInjectedHeader();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /*
     * Also support an existing headerLoaded event if include.js
     * already dispatches it.
     */
    document.addEventListener(
        "headerLoaded",
        refreshInjectedHeader
    );

    document.addEventListener(
        "currentUserProfileLoaded",
        function (event) {
            updateHeaderUserProfile(event.detail);
        }
    );

    /* ========================================================
       9. INITIALIZE
       ======================================================== */

    loadCurrentUserProfile();

})();
