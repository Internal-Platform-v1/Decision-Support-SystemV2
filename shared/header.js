/* ============================================================
   shared/header.js – V2
   FedEx Freight Decision Support System
   ============================================================ */

(function () {

    'use strict';


    /* ========================================================
       1. CURRENT USER PROFILE
       ======================================================== */

    function loadCurrentUserProfile() {

        /*
         * Firebase must already be loaded by index.html.
         */
        if (
            typeof firebase === 'undefined' ||
            !firebase.auth ||
            !firebase.firestore
        ) {
            console.warn(
                'V2 Header: Firebase is not available.'
            );
            return;
        }


        firebase.auth().onAuthStateChanged(async function (user) {

            /*
             * No authenticated user.
             */
            if (!user) {

                window.currentUserProfile = null;

                return;
            }


            /*
             * Make the Firebase user available globally.
             */
            window.currentUser = user;


            const email =
                (user.email || '').trim().toLowerCase();


            if (!email) {
                return;
            }


            try {

                /*
                 * Same approved_users lookup used by V1.
                 */
                const snapshot = await firebase
                    .firestore()
                    .collection('approved_users')
                    .where('email', '==', email)
                    .limit(1)
                    .get();


                let displayName =
                    user.displayName ||
                    email.split('@')[0];


                let role = '';


                if (!snapshot.empty) {

                    const data =
                        snapshot.docs[0].data() || {};


                    /*
                     * Get the actual name stored
                     * in approved_users.
                     */
                    if (data.name) {

                        displayName =
                            String(data.name)
                                .replace(/\s+vndr$/i, '')
                                .trim();

                    }


                    /*
                     * Get role if available.
                     */
                    if (data.role) {

                        role =
                            String(data.role).trim();

                    }

                }


                /*
                 * Store the profile globally.
                 *
                 * Other V2 pages/scripts can use:
                 *
                 * window.currentUserProfile.displayName
                 */
                window.currentUserProfile = {

                    uid: user.uid,

                    email: user.email,

                    displayName: displayName,

                    role: role

                };


                /*
                 * Update the V2 header profile immediately.
                 */
                updateHeaderUserProfile(
                    window.currentUserProfile
                );


                /*
                 * Tell the rest of V2 that the user
                 * profile is ready.
                 */
                document.dispatchEvent(
                    new CustomEvent(
                        'currentUserProfileLoaded',
                        {
                            detail:
                                window.currentUserProfile
                        }
                    )
                );


            } catch (error) {

                console.error(
                    'V2 Header: Unable to load user profile.',
                    error
                );


                /*
                 * Even if approved_users fails,
                 * still expose a usable profile.
                 */
                window.currentUserProfile = {

                    uid: user.uid,

                    email: user.email,

                    displayName:
                        user.displayName ||
                        email.split('@')[0],

                    role: ''

                };


                updateHeaderUserProfile(
                    window.currentUserProfile
                );


                document.dispatchEvent(
                    new CustomEvent(
                        'currentUserProfileLoaded',
                        {
                            detail:
                                window.currentUserProfile
                        }
                    )
                );

            }

        });

    }


    /* ========================================================
       2. UPDATE HEADER USER INFORMATION
       ======================================================== */

    function updateHeaderUserProfile(profile) {

        if (!profile) {
            return;
        }


        const displayName =
            profile.displayName || 'User';


        /*
         * Profile dropdown name
         */
        const profileName =
            document.getElementById('profileName');


        if (profileName) {

            profileName.textContent =
                displayName;

        }


        /*
         * If the existing HTML uses
         * .profile-name instead of #profileName,
         * support that as well.
         */
        const profileNameClass =
            document.querySelector(
                '.profile-menu .profile-name'
            );


        if (profileNameClass) {

            profileNameClass.textContent =
                displayName;

        }


        /*
         * Create initials for the avatar.
         *
         * Jennifer → JE
         * John Smith → JS
         */
        const initials =
            getUserInitials(displayName);


        const profileBtn =
            document.getElementById('profileBtn');


        if (profileBtn) {

            profileBtn.textContent =
                initials;

            profileBtn.setAttribute(
                'aria-label',
                'Open profile for ' + displayName
            );

        }

    }


    /* ========================================================
       3. USER INITIALS
       ======================================================== */

    function getUserInitials(name) {

        if (!name) {
            return 'JD';
        }


        const cleanName =
            String(name)
                .trim()
                .replace(/\s+/g, ' ');


        const parts =
            cleanName.split(' ');


        if (parts.length === 1) {

            return parts[0]
                .substring(0, 2)
                .toUpperCase();

        }


        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();

    }


    /* ========================================================
       4. PROFILE TOGGLE
       ======================================================== */

    var profileBtn =
        document.getElementById('profileBtn');

    var profileChevron =
        document.getElementById('profileChevron');

    var profileMenu =
        document.getElementById('profileMenu');


    function toggleProfile(e) {

        e.stopPropagation();


        if (!profileMenu) {
            return;
        }


        profileMenu.classList.toggle('open');


        var isOpen =
            profileMenu.classList.contains('open');


        if (profileBtn) {

            profileBtn.setAttribute(
                'aria-expanded',
                String(isOpen)
            );

        }


        if (profileChevron) {

            profileChevron.setAttribute(
                'aria-expanded',
                String(isOpen)
            );

        }

    }


    if (profileBtn) {

        profileBtn.addEventListener(
            'click',
            toggleProfile
        );

    }


    if (profileChevron) {

        profileChevron.addEventListener(
            'click',
            toggleProfile
        );

    }


    document.addEventListener(
        'click',
        function (e) {

            if (
                !e.target.closest(
                    '.header-actions'
                )
            ) {

                if (profileMenu) {

                    profileMenu.classList.remove(
                        'open'
                    );

                }

                if (profileBtn) {

                    profileBtn.setAttribute(
                        'aria-expanded',
                        'false'
                    );

                }

                if (profileChevron) {

                    profileChevron.setAttribute(
                        'aria-expanded',
                        'false'
                    );

                }

            }

        }
    );


    /* ========================================================
       5. CASE DIRECTORY DROPDOWN
       Matches V2 header.html
       ======================================================== */

    var caseWrapper =
        document.querySelector(
            '.case-directory-wrap'
        );


    var caseBtn =
        document.getElementById(
            'caseDirectoryBtn'
        );


    var caseDropdown =
        document.getElementById(
            'caseDirectoryMenu'
        );


    function toggleDropdown(e) {

        e.stopPropagation();


        if (!caseDropdown) {
            return;
        }


        var isOpen =
            caseDropdown.classList.contains(
                'open'
            );


        if (isOpen) {

            caseDropdown.classList.remove(
                'open'
            );


            if (caseBtn) {

                caseBtn.classList.remove(
                    'open'
                );

                caseBtn.setAttribute(
                    'aria-expanded',
                    'false'
                );

            }

        } else {

            /*
             * Close any other dropdown panels.
             */
            document
                .querySelectorAll(
                    '.dropdown-panel.open'
                )
                .forEach(function (d) {

                    if (d !== caseDropdown) {

                        d.classList.remove(
                            'open'
                        );

                    }

                });


            caseDropdown.classList.add(
                'open'
            );


            if (caseBtn) {

                caseBtn.classList.add(
                    'open'
                );

                caseBtn.setAttribute(
                    'aria-expanded',
                    'true'
                );

            }

        }

    }


    if (caseBtn) {

        caseBtn.addEventListener(
            'click',
            toggleDropdown
        );

    }


    /*
     * Close Case Directory when clicking outside.
     */
    document.addEventListener(
        'click',
        function (e) {

            if (
                caseWrapper &&
                !caseWrapper.contains(e.target)
            ) {

                if (caseDropdown) {

                    caseDropdown.classList.remove(
                        'open'
                    );

                }


                if (caseBtn) {

                    caseBtn.classList.remove(
                        'open'
                    );

                    caseBtn.setAttribute(
                        'aria-expanded',
                        'false'
                    );

                }

            }

        }
    );


    /*
     * Handle Legacy / Shine dropdown items.
     */
    if (caseDropdown) {

        caseDropdown
            .querySelectorAll('a')
            .forEach(function (link) {

                link.addEventListener(
                    'click',
                    function (e) {

                        /*
                         * These are currently placeholders
                         * until the actual Legacy and Shine
                         * URLs are supplied.
                         */
                        if (
                            this.getAttribute('href') === '#'
                        ) {

                            e.preventDefault();

                        }


                        var label =
                            this.textContent
                                .trim();


                        if (window.showToast) {

                            window.showToast(
                                'Opening ' + label
                            );

                        } else {

                            console.log(
                                'Opening ' + label
                            );

                        }


                        caseDropdown.classList.remove(
                            'open'
                        );


                        if (caseBtn) {

                            caseBtn.classList.remove(
                                'open'
                            );

                            caseBtn.setAttribute(
                                'aria-expanded',
                                'false'
                            );

                        }

                    }
                );

            });

    }


    /* ========================================================
       6. MAIN NAVIGATION
       ======================================================== */

    var allNavItems =
        document.querySelectorAll(
            '.main-nav .nav-item'
        );


    allNavItems.forEach(
        function (item) {

            /*
             * Case Directory is handled separately.
             */
            if (
                item.id === 'caseDirectoryBtn'
            ) {

                return;

            }


            item.addEventListener(
                'click',
                function () {

                    document
                        .querySelectorAll(
                            '.main-nav .nav-item'
                        )
                        .forEach(
                            function (nav) {

                                nav.classList.remove(
                                    'active'
                                );

                            }
                        );


                    this.classList.add(
                        'active'
                    );

                }
            );

        }
    );


    /* ========================================================
       7. GLOBAL SEARCH
       ======================================================== */

    var globalSearchInput =
        document.getElementById(
            'globalSearch'
        );


    if (globalSearchInput) {

        globalSearchInput.addEventListener(
            'keydown',
            function (e) {

                if (e.key !== 'Enter') {
                    return;
                }


                if (window.performSearch) {

                    window.performSearch(
                        e.target.value
                    );

                } else {

                    console.log(
                        'Search:',
                        e.target.value
                    );

                }

            }
        );

    }


    /* ========================================================
       8. INITIALIZE USER PROFILE
       ======================================================== */

    loadCurrentUserProfile();


})();
