/* ============================================================
   V2 LOGIN — Firebase Authentication
   Decision Support System V2
   ============================================================ */

(function () {
    "use strict";


    /* ========================================================
       FIREBASE CONFIGURATION
       ======================================================== */

    const firebaseConfig = {
        apiKey: "AIzaSyDjaMdeh0Cgx00hzDyZOi54fDkR81wnxJU",
        authDomain: "bdgg-database.firebaseapp.com",
        projectId: "bdgg-database",
        storageBucket: "bdgg-database.appspot.com",
        messagingSenderId: "43574975434",
        appId: "1:43574975434:web:4c79e581267fdfcc6ccd33"
    };


    /* ========================================================
       APPLICATION SETTINGS
       ======================================================== */

    const ALLOWED_DOMAIN = "@fedexfreight.com";

    const APPROVED_USERS_COLLECTION =
        "approved_users";

    /*
     * V2 dashboard
     *
     * index.html     = Login
     * index-main.html = Main Dashboard
     */
    const REDIRECT_AFTER_LOGIN =
        "index-main.html";

    /*
     * Keep this only if your V2 project will use
     * the existing force-password-change page.
     */
    const CHANGE_PASSWORD_PAGE =
        "change-password.html";


    /* ========================================================
       INITIALIZE FIREBASE
       ======================================================== */

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const auth = firebase.auth();
    const db = firebase.firestore();


    /* ========================================================
       GET HTML ELEMENTS
       ======================================================== */

    const emailEl =
        document.getElementById("email");

    const passwordEl =
        document.getElementById("password");

    const loginBtn =
        document.getElementById("loginBtn");

    const resetBtn =
        document.getElementById("resetBtn");

    const messageEl =
        document.getElementById("message");

    const togglePasswordBtn =
        document.getElementById("togglePassword");

    const togglePasswordIcon =
        document.getElementById("togglePasswordIcon");


    let isProcessingLogin = false;


    /* ========================================================
       MESSAGE
       ======================================================== */

    function showMessage(text, type) {

        type = type || "error";

        if (!messageEl) {
            return;
        }

        messageEl.className =
            "message " + type;

        messageEl.textContent =
            text;
    }


    function clearMessage() {

        if (!messageEl) {
            return;
        }

        messageEl.className = "message";

        messageEl.textContent = "";
    }


    /* ========================================================
       EMAIL HELPERS
       ======================================================== */

    function normalizeEmail(email) {

        return String(email || "")
            .trim()
            .toLowerCase();

    }


    function isAllowedFedExEmail(email) {

        return normalizeEmail(email)
            .endsWith(ALLOWED_DOMAIN);

    }


    /* ========================================================
       LOGIN BUTTON LOADING STATE
       ======================================================== */

    function setLoadingState(
        isLoading,
        stage
    ) {

        if (!loginBtn) {
            return;
        }

        if (loginBtn) {
            loginBtn.disabled =
                isLoading;
        }

        if (resetBtn) {
            resetBtn.disabled =
                isLoading;
        }

        if (emailEl) {
            emailEl.disabled =
                isLoading;
        }

        if (passwordEl) {
            passwordEl.disabled =
                isLoading;
        }


        loginBtn.classList.toggle(
            "is-loading",
            isLoading
        );


        if (!isLoading) {

            loginBtn.innerHTML =
                'Sign In <span class="button-arrow">→</span>';

            return;
        }


        let loadingText =
            "Checking account...";


        if (stage === "redirect") {

            loadingText =
                "Opening workspace...";

        }


        loginBtn.innerHTML = `
            <span class="btn-loading-content">
                <span class="btn-spinner"></span>
                <span>${loadingText}</span>
            </span>
        `;

    }


    /* ========================================================
       APPROVED USER CHECK
       ======================================================== */

    async function checkApprovedUser(email) {

        const emailKey =
            normalizeEmail(email);


        try {

            const docRef =
                db
                    .collection(
                        APPROVED_USERS_COLLECTION
                    )
                    .doc(emailKey);


            const docSnap =
                await docRef.get();


            /*
             * User does not exist in
             * approved_users.
             */
            if (!docSnap.exists) {

                return {

                    allowed: false,

                    reason:
                        "This email is not yet approved for access. Please contact your administrator."

                };

            }


            const data =
                docSnap.data() || {};


            /*
             * Account has been disabled.
             */
            if (data.active === false) {

                return {

                    allowed: false,

                    reason:
                        "Your account has been disabled. Please contact your administrator."

                };

            }


            return {

                allowed: true,

                data: data

            };


        } catch (error) {

            console.error(
                "Firestore read error:",
                error
            );


            return {

                allowed: false,

                reason:
                    "Unable to verify access. Please check your network connection and try again."

            };

        }

    }


    /* ========================================================
       SECURITY CHECKS AFTER FIREBASE LOGIN
       ======================================================== */

    async function continueAfterSecurityChecks(user) {

        if (!user) {

            showMessage(
                "Unable to sign in right now."
            );

            return;

        }


        const email =
            normalizeEmail(user.email);


        /* ----------------------------------------------------
           1. CHECK EMAIL DOMAIN
           ---------------------------------------------------- */

        if (!isAllowedFedExEmail(email)) {

            await auth.signOut();

            showMessage(
                "Please use your FedEx Freight email address."
            );

            return;

        }


        /* ----------------------------------------------------
           2. CHECK EMAIL VERIFICATION
           ---------------------------------------------------- */

        if (!user.emailVerified) {

            try {

                await user.sendEmailVerification();

            } catch (verificationError) {

                console.warn(
                    "Verification email could not be sent:",
                    verificationError
                );

            }


            await auth.signOut();


            showMessage(
                "Your email is not verified yet. A verification email has been sent to your FedEx Freight inbox. Please verify your email first, then sign in again.",
                "success"
            );


            return;

        }


        /* ----------------------------------------------------
           3. CHECK APPROVED USERS
           ---------------------------------------------------- */

        const approvalCheck =
            await checkApprovedUser(email);


        if (!approvalCheck.allowed) {

            await auth.signOut();


            showMessage(
                approvalCheck.reason ||
                "You are not authorized to access this system."
            );


            return;

        }


        /* ----------------------------------------------------
           4. FORCE PASSWORD CHANGE
           ---------------------------------------------------- */

        if (
            approvalCheck.data &&
            approvalCheck.data.forcePasswordChange === true
        ) {

            window.location.replace(
                CHANGE_PASSWORD_PAGE
            );

            return;

        }


        /* ----------------------------------------------------
           5. LOGIN SUCCESSFUL
           ---------------------------------------------------- */

        setLoadingState(
            true,
            "redirect"
        );


        window.location.replace(
            REDIRECT_AFTER_LOGIN
        );

    }


    /* ========================================================
       PASSWORD VISIBILITY
       ======================================================== */

    if (togglePasswordBtn) {

        togglePasswordBtn.addEventListener(
            "click",
            function () {

                if (!passwordEl) {
                    return;
                }


                const isHidden =
                    passwordEl.type === "password";


                passwordEl.type =
                    isHidden
                        ? "text"
                        : "password";


                if (togglePasswordIcon) {

                    if (isHidden) {

                        togglePasswordIcon.innerHTML = `
                            <path d="M3.5 12s3.2-5 8.5-5 8.5 5 8.5 5-3.2 5-8.5 5-8.5-5-8.5-5Z"></path>
                            <path d="m4 4 16 16"></path>
                        `;

                    } else {

                        togglePasswordIcon.innerHTML = `
                            <path d="M3.5 12s3.2-5 8.5-5 8.5 5 8.5 5-3.2 5-8.5 5-8.5-5-8.5-5Z"></path>
                            <circle cx="12" cy="12" r="2.2"></circle>
                        `;

                    }

                }


                togglePasswordBtn.setAttribute(
                    "aria-label",
                    isHidden
                        ? "Hide password"
                        : "Show password"
                );

            }
        );

    }


    /* ========================================================
       ENTER KEY LOGIN
       ======================================================== */

    if (passwordEl) {

        passwordEl.addEventListener(
            "keydown",
            function (e) {

                if (e.key === "Enter") {

                    if (loginBtn) {
                        loginBtn.click();
                    }

                }

            }
        );

    }


    /* ========================================================
       LOGIN
       ======================================================== */

    if (loginBtn) {

        loginBtn.addEventListener(
            "click",
            async function () {

                if (isProcessingLogin) {
                    return;
                }


                isProcessingLogin = true;

                clearMessage();


                const email =
                    normalizeEmail(
                        emailEl
                            ? emailEl.value
                            : ""
                    );


                const password =
                    passwordEl
                        ? passwordEl.value
                        : "";


                /* ------------------------------------------------
                   EMPTY FIELDS
                   ------------------------------------------------ */

                if (!email || !password) {

                    showMessage(
                        "Please enter your email and password."
                    );


                    isProcessingLogin = false;

                    return;

                }


                /* ------------------------------------------------
                   EMAIL DOMAIN
                   ------------------------------------------------ */

                if (!isAllowedFedExEmail(email)) {

                    showMessage(
                        "Please use your FedEx Freight email address."
                    );


                    isProcessingLogin = false;

                    return;

                }


                try {

                    setLoadingState(
                        true,
                        "checking"
                    );


                    /*
                     * Keep user signed in while navigating
                     * between V2 pages.
                     */
                    await auth.setPersistence(
                        firebase.auth.Auth.Persistence.LOCAL
                    );


                    /*
                     * Firebase authentication.
                     */
                    const result =
                        await auth
                            .signInWithEmailAndPassword(
                                email,
                                password
                            );


                    /*
                     * Continue with the security checks.
                     */
                    await continueAfterSecurityChecks(
                        result.user
                    );


                } catch (error) {

                    console.error(
                        "Login error:",
                        error
                    );


                    let friendlyMessage =
                        "Unable to sign in right now.";


                    if (
                        error.code ===
                            "auth/user-not-found" ||

                        error.code ===
                            "auth/wrong-password" ||

                        error.code ===
                            "auth/invalid-login-credentials"
                    ) {

                        friendlyMessage =
                            "The email or password entered is incorrect.";

                    }


                    else if (
                        error.code ===
                        "auth/too-many-requests"
                    ) {

                        friendlyMessage =
                            "Too many failed attempts. Please try again later or reset your password.";

                    }


                    else if (
                        error.code ===
                        "auth/invalid-email"
                    ) {

                        friendlyMessage =
                            "Please enter a valid email address.";

                    }


                    else if (
                        error.code ===
                        "auth/user-disabled"
                    ) {

                        friendlyMessage =
                            "This account has been disabled.";

                    }


                    showMessage(
                        friendlyMessage
                    );


                    setLoadingState(
                        false
                    );


                    isProcessingLogin =
                        false;

                }


                finally {

                    /*
                     * If we are still on the login page,
                     * restore the controls.
                     */
                    if (
                        !window.location.href.includes(
                            "index-main.html"
                        ) &&

                        !window.location.href.includes(
                            "change-password.html"
                        )
                    ) {

                        setLoadingState(
                            false
                        );

                        isProcessingLogin =
                            false;

                    }

                }

            }
        );

    }


    /* ========================================================
       PASSWORD RESET
       ======================================================== */

    if (resetBtn) {

        resetBtn.addEventListener(
            "click",
            async function () {

                if (resetBtn.disabled) {
                    return;
                }


                resetBtn.disabled =
                    true;


                clearMessage();


                const email =
                    normalizeEmail(
                        emailEl
                            ? emailEl.value
                            : ""
                    );


                /* ------------------------------------------------
                   EMAIL REQUIRED
                   ------------------------------------------------ */

                if (!email) {

                    showMessage(
                        "Please enter your email address."
                    );


                    resetBtn.disabled =
                        false;

                    return;

                }


                /* ------------------------------------------------
                   DOMAIN CHECK
                   ------------------------------------------------ */

                if (!isAllowedFedExEmail(email)) {

                    showMessage(
                        "Only @fedexfreight.com email addresses are allowed."
                    );


                    resetBtn.disabled =
                        false;

                    return;

                }


                /*
                 * Do not reveal whether an email
                 * exists in Firebase.
                 */
                const genericMessage =
                    "If that email is registered, you will receive a password reset link.";


                try {

                    await auth.sendPasswordResetEmail(
                        email
                    );


                    showMessage(
                        genericMessage,
                        "success"
                    );


                } catch (error) {

                    console.warn(
                        "Password reset request:",
                        error
                    );


                    /*
                     * Keep the response generic.
                     */
                    showMessage(
                        genericMessage,
                        "success"
                    );


                }


                finally {

                    setTimeout(
                        function () {

                            resetBtn.disabled =
                                false;

                        },
                        3000
                    );

                }

            }
        );

    }


    /* ========================================================
       AUTH STATE MONITOR
       ======================================================== */

    auth.onAuthStateChanged(
        async function (user) {

            /*
             * Do not interfere while the login button
             * is processing a login.
             */
            if (isProcessingLogin) {
                return;
            }


            /*
             * No existing Firebase session.
             */
            if (!user) {
                return;
            }


            const email =
                normalizeEmail(user.email);


            /* ------------------------------------------------
               1. DOMAIN CHECK
               ------------------------------------------------ */

            if (!isAllowedFedExEmail(email)) {

                await auth.signOut();

                showMessage(
                    "Only @fedexfreight.com email addresses are allowed to use this page."
                );

                return;

            }


            /* ------------------------------------------------
               2. EMAIL VERIFICATION
               ------------------------------------------------ */

            if (!user.emailVerified) {

                await auth.signOut();

                showMessage(
                    "Please verify your email before using the system."
                );

                return;

            }


            try {

                /* ------------------------------------------------
                   3. APPROVED USER CHECK
                   ------------------------------------------------ */

                const approvalCheck =
                    await checkApprovedUser(email);


                if (!approvalCheck.allowed) {

                    await auth.signOut();

                    showMessage(
                        approvalCheck.reason ||
                        "You are not authorized to access this system."
                    );

                    return;

                }


                /* ------------------------------------------------
                   4. FORCE PASSWORD CHANGE
                   ------------------------------------------------ */

                if (
                    approvalCheck.data &&
                    approvalCheck.data.forcePasswordChange === true
                ) {

                    window.location.replace(
                        CHANGE_PASSWORD_PAGE
                    );

                    return;

                }


                /* ------------------------------------------------
                   5. EXISTING VALID SESSION
                   ------------------------------------------------ */

                window.location.replace(
                    REDIRECT_AFTER_LOGIN
                );


            } catch (error) {

                console.error(
                    "Approval check failed:",
                    error
                );


                await auth.signOut();

            }

        }
    );


})();
