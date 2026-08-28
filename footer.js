/* ============================================================
   DSS V2 — SHARED FOOTER
   Feedback + Get Help
   Self-contained behavior for dynamically loaded footer.
   ============================================================ */

(function () {
    "use strict";

    const state = {
        rating: 0,
        activeModal: null,
        lastFocus: null,
        initialized: false
    };

    const ratingLabels = {
        0: "Select a star rating",
        1: "Very poor",
        2: "Needs improvement",
        3: "Okay",
        4: "Good",
        5: "Excellent"
    };

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

    function getCurrentUser() {
        try {
            if (window.currentUser && window.currentUser.uid) {
                return window.currentUser;
            }

            if (
                typeof firebase !== "undefined" &&
                firebase.auth &&
                firebase.auth().currentUser
            ) {
                return firebase.auth().currentUser;
            }
        } catch (error) {
            console.error("DSS Footer: unable to read current user.", error);
        }

        return null;
    }

    function getFirestore() {
        try {
            if (
                typeof firebase === "undefined" ||
                !firebase.firestore
            ) {
                return null;
            }

            if (!firebase.apps || !firebase.apps.length) {
                return null;
            }

            return firebase.firestore();
        } catch (error) {
            console.error("DSS Footer: Firestore unavailable.", error);
            return null;
        }
    }

    function pageContext() {
        const heading =
            $(".group-hero h1") ||
            $("main h1") ||
            $("h1");

        return {
            pageUrl: window.location.href,
            pagePath: window.location.pathname,
            pageTitle: document.title || "",
            guideTitle: heading
                ? heading.textContent.trim()
                : ""
        };
    }

    function userContext() {
        const profile = window.currentUserProfile || {};
        const user = getCurrentUser() || {};

        return {
            uid: profile.uid || user.uid || null,
            email: profile.email || user.email || null,
            displayName:
                profile.displayName ||
                user.displayName ||
                null
        };
    }

    function showMessage(element, text, type) {
        if (!element) return;

        element.textContent = text;
        element.style.display = "block";

        if (type === "success") {
            element.style.background = "#ecfdf3";
            element.style.color = "#15803d";
        } else {
            element.style.background = "#fff1f2";
            element.style.color = "#dc2626";
        }
    }

    function clearMessage(element) {
        if (!element) return;

        element.textContent = "";
        element.style.display = "none";
    }

    function setRating(value) {
        state.rating = Math.max(0, Math.min(5, Number(value) || 0));

        const ratingValue = $("#ratingValue");
        const ratingHint = $("#ratingHint");

        if (ratingValue) {
            ratingValue.textContent = state.rating + " / 5";
        }

        $$(".rating-star").forEach(function (star) {
            const number = Number(star.dataset.value || 0);
            const selected = number <= state.rating;

            star.classList.toggle("selected", selected);
            star.classList.remove("is-preview");
            star.setAttribute(
                "aria-checked",
                number === state.rating ? "true" : "false"
            );
        });

        if (ratingHint) {
            ratingHint.textContent =
                ratingLabels[state.rating] || ratingLabels[0];
        }
    }

    function previewRating(value) {
        const number = Number(value || 0);

        $$(".rating-star").forEach(function (star) {
            const starValue = Number(star.dataset.value || 0);
            star.classList.toggle(
                "is-preview",
                starValue <= number
            );
        });
    }

    function clearRatingPreview() {
        $$(".rating-star").forEach(function (star) {
            star.classList.remove("is-preview");
        });
    }

    function setupRating() {
        $$(".rating-star").forEach(function (star) {
            if (star.dataset.footerBound === "true") return;

            star.dataset.footerBound = "true";

            star.addEventListener("mouseenter", function () {
                previewRating(star.dataset.value);
            });

            star.addEventListener("mouseleave", clearRatingPreview);

            star.addEventListener("focus", function () {
                previewRating(star.dataset.value);
            });

            star.addEventListener("blur", clearRatingPreview);
        });

        setRating(state.rating);
    }

    function resetFeedback() {
        const name = $("#commentName");
        const comment = $("#commentText");
        const message = $("#feedbackMessage");

        if (name) name.value = "";
        if (comment) comment.value = "";

        setRating(0);
        clearMessage(message);

        const submit = $('[data-footer-submit="feedback"]');
        if (submit) {
            submit.disabled = false;
            submit.innerHTML =
                '<i class="fa-solid fa-paper-plane"></i> Send Feedback';
        }
    }

    function resetHelp() {
        const subject = $("#helpSubject");
        const details = $("#helpMessage");
        const status = $("#helpMessageStatus");

        if (subject) subject.value = "";
        if (details) details.value = "";

        clearMessage(status);

        const submit = $('[data-footer-submit="help"]');
        if (submit) {
            submit.disabled = false;
            submit.innerHTML =
                '<i class="fa-solid fa-paper-plane"></i> Submit Help Request';
        }
    }

    function openModal(modal) {
        if (!modal) {
            console.error("DSS Footer: modal element not found.");
            return;
        }

        state.lastFocus = document.activeElement;
        state.activeModal = modal;

        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");
        modal.classList.remove("is-closing");

        document.body.classList.add("dss-footer-modal-open");

        requestAnimationFrame(function () {
            modal.classList.add("is-open");

            const firstFocusable = $(
                "input, textarea, select, button:not(.footer-modal-close)",
                modal
            );

            if (firstFocusable) {
                setTimeout(function () {
                    firstFocusable.focus();
                }, 40);
            }
        });
    }

    function closeModal(modal, resetCallback) {
        if (!modal) return;

        modal.classList.remove("is-open");
        modal.classList.add("is-closing");
        modal.setAttribute("aria-hidden", "true");

        setTimeout(function () {
            modal.style.display = "none";
            modal.classList.remove("is-closing");

            if (state.activeModal === modal) {
                state.activeModal = null;
            }

            document.body.classList.remove("dss-footer-modal-open");

            if (typeof resetCallback === "function") {
                resetCallback();
            }

            if (
                state.lastFocus &&
                document.contains(state.lastFocus) &&
                typeof state.lastFocus.focus === "function"
            ) {
                state.lastFocus.focus();
            }
        }, 220);
    }

    function openFeedback() {
        resetFeedback();
        openModal($("#commentModal"));
    }

    function openHelp() {
        resetHelp();
        openModal($("#helpModal"));
    }

    async function sendFeedback(event) {
        if (event) event.preventDefault();

        const message = $("#feedbackMessage");
        const submit = $('[data-footer-submit="feedback"]');

        const name =
            ($("#commentName")?.value || "").trim();

        const comment =
            ($("#commentText")?.value || "").trim();

        if (!state.rating) {
            showMessage(
                message,
                "Please select a star rating first.",
                "error"
            );
            return;
        }

        const db = getFirestore();
        const user = userContext();

        if (!db) {
            showMessage(
                message,
                "Feedback could not be sent because the DSS database connection is unavailable.",
                "error"
            );
            return;
        }

        if (!user.uid) {
            showMessage(
                message,
                "Please sign in to DSS before submitting feedback.",
                "error"
            );
            return;
        }

        if (submit) {
            submit.disabled = true;
            submit.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        }

        try {
            const page = pageContext();

            await db.collection("feedback").add({
                uid: user.uid,
                email: user.email || null,
                name: name || user.displayName || "Anonymous",
                rating: state.rating,
                comment: comment || "",
                pageUrl: page.pageUrl,
                pagePath: page.pagePath,
                pageTitle: page.pageTitle,
                guideTitle: page.guideTitle,
                createdAt:
                    firebase.firestore.FieldValue.serverTimestamp()
            });

            showMessage(
                message,
                "Thank you! Your feedback was submitted successfully.",
                "success"
            );

            if (submit) {
                submit.innerHTML =
                    '<i class="fa-solid fa-check"></i> Sent';
            }

            setTimeout(function () {
                closeModal($("#commentModal"), resetFeedback);
            }, 900);

        } catch (error) {
            console.error(
                "DSS Footer: feedback submission failed:",
                error
            );

            showMessage(
                message,
                "Unable to send feedback right now. Please try again.",
                "error"
            );

            if (submit) {
                submit.disabled = false;
                submit.innerHTML =
                    '<i class="fa-solid fa-paper-plane"></i> Send Feedback';
            }
        }
    }

    async function sendHelpRequest(event) {
        if (event) event.preventDefault();

        const status = $("#helpMessageStatus");
        const submit = $('[data-footer-submit="help"]');

        const subject =
            ($("#helpSubject")?.value || "").trim();

        const details =
            ($("#helpMessage")?.value || "").trim();

        if (!subject) {
            showMessage(
                status,
                "Please enter a subject.",
                "error"
            );
            $("#helpSubject")?.focus();
            return;
        }

        if (!details) {
            showMessage(
                status,
                "Please describe the issue.",
                "error"
            );
            $("#helpMessage")?.focus();
            return;
        }

        const db = getFirestore();
        const user = userContext();

        if (!db) {
            showMessage(
                status,
                "Your help request could not be sent because the DSS database connection is unavailable.",
                "error"
            );
            return;
        }

        if (!user.uid) {
            showMessage(
                status,
                "Please sign in to DSS before submitting a help request.",
                "error"
            );
            return;
        }

        if (submit) {
            submit.disabled = true;
            submit.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        }

        try {
            const page = pageContext();

            await db.collection("help_requests").add({
                uid: user.uid,
                email: user.email || null,
                name: user.displayName || null,
                subject: subject,
                message: details,
                status: "new",
                pageUrl: page.pageUrl,
                pagePath: page.pagePath,
                pageTitle: page.pageTitle,
                guideTitle: page.guideTitle,
                createdAt:
                    firebase.firestore.FieldValue.serverTimestamp()
            });

            showMessage(
                status,
                "Your help request was submitted successfully.",
                "success"
            );

            if (submit) {
                submit.innerHTML =
                    '<i class="fa-solid fa-check"></i> Sent';
            }

            setTimeout(function () {
                closeModal($("#helpModal"), resetHelp);
            }, 900);

        } catch (error) {
            console.error(
                "DSS Footer: help request submission failed:",
                error
            );

            showMessage(
                status,
                "Unable to submit your help request right now. Please try again.",
                "error"
            );

            if (submit) {
                submit.disabled = false;
                submit.innerHTML =
                    '<i class="fa-solid fa-paper-plane"></i> Submit Help Request';
            }
        }
    }

    function handleClick(event) {
        const action = event.target.closest("[data-footer-action]");

        if (action) {
            event.preventDefault();

            if (action.dataset.footerAction === "feedback") {
                openFeedback();
                return;
            }

            if (action.dataset.footerAction === "help") {
                openHelp();
                return;
            }
        }

        const close = event.target.closest("[data-footer-close]");

        if (close) {
            event.preventDefault();

            const modal =
                close.dataset.footerClose === "comment"
                    ? $("#commentModal")
                    : $("#helpModal");

            closeModal(modal);
            return;
        }

        const submit =
            event.target.closest("[data-footer-submit]");

        if (submit) {
            event.preventDefault();

            if (submit.dataset.footerSubmit === "feedback") {
                sendFeedback(event);
            } else if (submit.dataset.footerSubmit === "help") {
                sendHelpRequest(event);
            }

            return;
        }

        const star = event.target.closest(".rating-star");

        if (star) {
            event.preventDefault();
            setRating(star.dataset.value);
        }

        if (
            event.target.classList &&
            (
                event.target.id === "commentModal" ||
                event.target.id === "helpModal"
            )
        ) {
            closeModal(event.target);
        }
    }

    function handleKeydown(event) {
        if (event.key === "Escape" && state.activeModal) {
            closeModal(state.activeModal);
            return;
        }

        if (
            event.target.classList.contains("rating-star") &&
            (
                event.key === "ArrowRight" ||
                event.key === "ArrowUp" ||
                event.key === "ArrowLeft" ||
                event.key === "ArrowDown" ||
                event.key === "Home" ||
                event.key === "End"
            )
        ) {
            let next = state.rating || 1;

            if (
                event.key === "ArrowRight" ||
                event.key === "ArrowUp"
            ) {
                next = Math.min(5, next + 1);
            }

            if (
                event.key === "ArrowLeft" ||
                event.key === "ArrowDown"
            ) {
                next = Math.max(1, next - 1);
            }

            if (event.key === "Home") next = 1;
            if (event.key === "End") next = 5;

            event.preventDefault();
            setRating(next);

            const target = $(
                '.rating-star[data-value="' + next + '"]'
            );

            if (target) target.focus();
        }
    }

    function bind() {
        setupRating();

        if (!state.initialized) {
            document.addEventListener("click", handleClick);
            document.addEventListener("keydown", handleKeydown);
            state.initialized = true;
        }
    }

    function init() {
        bind();
    }

    /*
     * Footer may be inserted asynchronously by footer-loader.js.
     * Run immediately, on DOM ready, and after footerLoaded.
     */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }

    document.addEventListener("footerLoaded", function () {
        setTimeout(bind, 0);
    });

    /*
     * Extra safety for pages where the footer is inserted after
     * footerLoaded or by a different loader.
     */
    const observer = new MutationObserver(function () {
        if (
            $("#commentModal") ||
            $("#helpModal") ||
            $(".footer-action-btn")
        ) {
            bind();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    window.DSSFooter = {
        openFeedback,
        openHelp,
        closeFeedback: function () {
            closeModal($("#commentModal"));
        },
        closeHelp: function () {
            closeModal($("#helpModal"));
        }
    };

})();
