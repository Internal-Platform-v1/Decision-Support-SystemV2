/* ============================================================
   DSS V2 — SHARED FOOTER
   Feedback + Get Help
   All behavior lives here. No separate rating JS.
   ============================================================ */

(function () {
    "use strict";

    let selectedRating = 0;
    let ratingStars = [];
    let lastFocusedElement = null;

    function getFirebaseDB() {
        if (typeof firebase === "undefined") {
            return null;
        }

        try {
            if (firebase.apps && firebase.apps.length) {
                return firebase.firestore();
            }
        } catch (error) {
            console.error("DSS Footer: Firestore unavailable.", error);
        }

        return null;
    }

    function getCurrentUser() {
        try {
            if (window.currentUser) return window.currentUser;

            if (typeof firebase !== "undefined" &&
                firebase.auth &&
                firebase.auth().currentUser) {
                return firebase.auth().currentUser;
            }
        } catch (error) {
            console.error("DSS Footer: Unable to read current user.", error);
        }

        return null;
    }

    function openModal(modal) {
        if (!modal) return;

        lastFocusedElement = document.activeElement;

        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");
        modal.classList.remove("is-closing");

        requestAnimationFrame(function () {
            modal.classList.add("is-open");

            const firstInput = modal.querySelector(
                "input, textarea, button:not(.footer-modal-close)"
            );

            if (firstInput) firstInput.focus();
        });
    }

    function closeModal(modal, callback) {
        if (!modal) return;

        modal.classList.remove("is-open");
        modal.classList.add("is-closing");
        modal.setAttribute("aria-hidden", "true");

        setTimeout(function () {
            modal.style.display = "none";
            modal.classList.remove("is-closing");

            if (typeof callback === "function") {
                callback();
            }

            if (lastFocusedElement &&
                typeof lastFocusedElement.focus === "function") {
                lastFocusedElement.focus();
            }
        }, 220);
    }

    function updateRatingUI() {
        const ratingValue = document.getElementById("ratingValue");
        const ratingHint = document.getElementById("ratingHint");

        if (ratingValue) {
            ratingValue.textContent = selectedRating + " / 5";
        }

        ratingStars.forEach(function (star) {
            const value = Number(star.dataset.value || 0);
            const selected = value <= selectedRating;

            star.classList.toggle("selected", selected);
            star.classList.remove("is-preview");
            star.setAttribute("aria-checked", String(value === selectedRating));
        });

        const hints = {
            0: "Select a star rating",
            1: "Very poor",
            2: "Needs improvement",
            3: "Okay",
            4: "Good",
            5: "Excellent"
        };

        if (ratingHint) {
            ratingHint.textContent = hints[selectedRating] || "Select a star rating";
        }
    }

    function initRatingStars() {
        ratingStars = Array.from(
            document.querySelectorAll("#ratingStars .rating-star")
        );

        if (!ratingStars.length) return;

        ratingStars.forEach(function (star) {
            if (star.dataset.footerRatingInitialized === "true") {
                return;
            }

            star.dataset.footerRatingInitialized = "true";

            star.addEventListener("mouseenter", function () {
                const value = Number(star.dataset.value || 0);

                ratingStars.forEach(function (item) {
                    const itemValue = Number(item.dataset.value || 0);
                    item.classList.toggle("is-preview", itemValue <= value);
                });
            });

            star.addEventListener("mouseleave", function () {
                ratingStars.forEach(function (item) {
                    item.classList.remove("is-preview");
                });
            });

            star.addEventListener("focus", function () {
                const value = Number(star.dataset.value || 0);

                ratingStars.forEach(function (item) {
                    const itemValue = Number(item.dataset.value || 0);
                    item.classList.toggle("is-preview", itemValue <= value);
                });
            });

            star.addEventListener("blur", function () {
                ratingStars.forEach(function (item) {
                    item.classList.remove("is-preview");
                });
            });

            star.addEventListener("click", function () {
                selectedRating = Number(star.dataset.value || 0);
                updateRatingUI();
            });

            star.addEventListener("keydown", function (event) {
                let nextRating = selectedRating;

                if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                    nextRating = Math.min(5, Math.max(1, selectedRating + 1));
                    event.preventDefault();
                }

                if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                    nextRating = Math.max(1, selectedRating - 1);
                    event.preventDefault();
                }

                if (event.key === "Home") {
                    nextRating = 1;
                    event.preventDefault();
                }

                if (event.key === "End") {
                    nextRating = 5;
                    event.preventDefault();
                }

                if (nextRating !== selectedRating) {
                    selectedRating = nextRating;
                    updateRatingUI();

                    const target = ratingStars.find(function (item) {
                        return Number(item.dataset.value || 0) === selectedRating;
                    });

                    if (target) target.focus();
                }
            });
        });

        updateRatingUI();
    }

    function clearFeedbackForm() {
        const name = document.getElementById("commentName");
        const text = document.getElementById("commentText");
        const message = document.getElementById("feedbackMessage");

        if (name) name.value = "";
        if (text) text.value = "";

        selectedRating = 0;
        updateRatingUI();

        if (message) {
            message.style.display = "none";
            message.textContent = "";
        }
    }

    function clearHelpForm() {
        const subject = document.getElementById("helpSubject");
        const message = document.getElementById("helpMessage");
        const status = document.getElementById("helpMessageStatus");

        if (subject) subject.value = "";
        if (message) message.value = "";

        if (status) {
            status.style.display = "none";
            status.textContent = "";
        }
    }

    function showStatus(element, text, type) {
        if (!element) return;

        element.style.display = "block";
        element.textContent = text;

        if (type === "success") {
            element.style.background = "#ecfdf3";
            element.style.color = "#15803d";
        } else {
            element.style.background = "#fff1f2";
            element.style.color = "#dc2626";
        }
    }

    window.openComment = function () {
        openModal(document.getElementById("commentModal"));
    };

    window.closeComment = function () {
        closeModal(document.getElementById("commentModal"));
    };

    window.openHelp = function () {
        openModal(document.getElementById("helpModal"));
    };

    window.closeHelp = function () {
        closeModal(document.getElementById("helpModal"));
    };

    window.sendComment = async function () {
        const message = document.getElementById("feedbackMessage");
        const name = (document.getElementById("commentName")?.value || "").trim();
        const comment = (document.getElementById("commentText")?.value || "").trim();

        if (!selectedRating) {
            showStatus(message, "Please select a star rating first.", "error");
            return;
        }

        const db = getFirebaseDB();
        const user = getCurrentUser();

        if (!db) {
            showStatus(
                message,
                "Feedback could not be submitted because the DSS database is not available.",
                "error"
            );
            return;
        }

        try {
            const payload = {
                rating: selectedRating,
                name: name || "Anonymous",
                comment: comment || "",
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            if (user) {
                payload.uid = user.uid;

                if (user.email) {
                    payload.email = String(user.email).trim().toLowerCase();
                }
            }

            await db.collection("feedback").add(payload);

            showStatus(
                message,
                "Thank you. Your feedback was submitted successfully.",
                "success"
            );

            setTimeout(function () {
                closeModal(document.getElementById("commentModal"), clearFeedbackForm);
            }, 900);

        } catch (error) {
            console.error("DSS Footer: feedback submission failed:", error);

            showStatus(
                message,
                "Unable to send feedback right now. Please try again.",
                "error"
            );
        }
    };

    window.sendHelpRequest = async function () {
        const status = document.getElementById("helpMessageStatus");
        const subject = (document.getElementById("helpSubject")?.value || "").trim();
        const helpText = (document.getElementById("helpMessage")?.value || "").trim();

        if (!subject || !helpText) {
            showStatus(
                status,
                "Please enter both a subject and a description.",
                "error"
            );
            return;
        }

        const db = getFirebaseDB();
        const user = getCurrentUser();

        if (!db) {
            showStatus(
                status,
                "Your help request could not be submitted because the DSS database is not available.",
                "error"
            );
            return;
        }

        try {
            const payload = {
                subject: subject,
                message: helpText,
                status: "new",
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            if (user) {
                payload.uid = user.uid;

                if (user.email) {
                    payload.email = String(user.email).trim().toLowerCase();
                }

                if (user.displayName) {
                    payload.name = user.displayName;
                }
            }

            await db.collection("help_requests").add(payload);

            showStatus(
                status,
                "Your help request was submitted successfully.",
                "success"
            );

            setTimeout(function () {
                closeModal(document.getElementById("helpModal"), clearHelpForm);
            }, 900);

        } catch (error) {
            console.error("DSS Footer: help request submission failed:", error);

            showStatus(
                status,
                "Unable to submit your help request right now. Please try again.",
                "error"
            );
        }
    };

    function closeOnBackdrop(event) {
        if (event.target.classList.contains("footer-modal")) {
            if (event.target.id === "commentModal") {
                window.closeComment();
            }

            if (event.target.id === "helpModal") {
                window.closeHelp();
            }
        }
    }

    function closeOnEscape(event) {
        if (event.key !== "Escape") return;

        const commentModal = document.getElementById("commentModal");
        const helpModal = document.getElementById("helpModal");

        if (commentModal?.classList.contains("is-open")) {
            window.closeComment();
        }

        if (helpModal?.classList.contains("is-open")) {
            window.closeHelp();
        }
    }

    function initFooter() {
        initRatingStars();

        const commentModal = document.getElementById("commentModal");
        const helpModal = document.getElementById("helpModal");

        if (commentModal) {
            commentModal.addEventListener("click", closeOnBackdrop);
        }

        if (helpModal) {
            helpModal.addEventListener("click", closeOnBackdrop);
        }

        if (document.body.dataset.footerEventsInitialized !== "true") {
            document.body.dataset.footerEventsInitialized = "true";
            document.addEventListener("keydown", closeOnEscape);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initFooter);
    } else {
        initFooter();
    }

    document.addEventListener("footerLoaded", initFooter);

})();
