/* ============================================================
   DSS V2 — SHARED FOOTER BEHAVIOR
   Feedback + Get Help
   Uses the authenticated Firebase session already established
   by DSS V2. If Firebase is not yet present, it loads the
   compatible SDK and initializes the same DSS project once.
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

  const FIREBASE_SCRIPTS = [
    "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js",
    "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js",
    "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js"
  ];

  const ratingLabels = {
    1: "Poor",
    2: "Needs improvement",
    3: "Good",
    4: "Very good",
    5: "Excellent"
  };

  let selectedRating = 0;
  let activeModal = null;
  let lastFocusedElement = null;
  let firebaseReadyPromise = null;

  function getFirebase() {
    return typeof window.firebase !== "undefined" ? window.firebase : null;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      const existing = document.querySelector('script[src="' + src + '"]');

      if (existing) {
        if (getFirebase()) {
          resolve();
          return;
        }

        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error("Unable to load Firebase SDK."));
      };

      document.head.appendChild(script);
    });
  }

  async function ensureFirebase() {
    if (firebaseReadyPromise) {
      return firebaseReadyPromise;
    }

    firebaseReadyPromise = (async function () {
      try {
        if (!getFirebase()) {
          await loadScript(FIREBASE_SCRIPTS[0]);
        }

        if (!getFirebase()) {
          throw new Error("Firebase SDK is unavailable.");
        }

        if (typeof firebase.auth !== "function") {
          await loadScript(FIREBASE_SCRIPTS[1]);
        }

        if (typeof firebase.firestore !== "function") {
          await loadScript(FIREBASE_SCRIPTS[2]);
        }

        if (!firebase.apps.length) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }

        return firebase;
      } catch (error) {
        firebaseReadyPromise = null;
        throw error;
      }
    })();

    return firebaseReadyPromise;
  }

  function getCurrentProfile() {
    const profile = window.currentUserProfile || {};
    const authUser =
      getFirebase() &&
      typeof firebase.auth === "function"
        ? firebase.auth().currentUser
        : null;

    return {
      uid: profile.uid || (authUser && authUser.uid) || "",
      email: profile.email || (authUser && authUser.email) || "",
      displayName:
        profile.displayName ||
        (authUser && authUser.displayName) ||
        ""
    };
  }

  function getPageContext() {
    const pageTitle =
      document.title ||
      document.querySelector("h1")?.textContent?.trim() ||
      "DSS V2";

    return {
      page: window.location.pathname || "/",
      pageTitle: pageTitle.trim()
    };
  }

  function getAuthUser(firebaseInstance) {
    const current = firebaseInstance.auth().currentUser;

    if (current) {
      return Promise.resolve(current);
    }

    return new Promise(function (resolve, reject) {
      let settled = false;

      const unsubscribe = firebaseInstance.auth().onAuthStateChanged(function (user) {
        if (settled) return;

        settled = true;
        unsubscribe();

        if (user) {
          resolve(user);
        } else {
          reject(new Error("AUTH_REQUIRED"));
        }
      });

      setTimeout(function () {
        if (settled) return;

        settled = true;
        unsubscribe();
        reject(new Error("AUTH_TIMEOUT"));
      }, 7000);
    });
  }

  function setStatus(elementId, message, type) {
    const el = document.getElementById(elementId);

    if (!el) return;

    el.hidden = !message;
    el.textContent = message;
    el.className = "modal-status" + (type ? " " + type : "");
  }

  function setButtonLoading(button, loading, loadingText) {
    if (!button) return;

    if (loading) {
      button.dataset.originalText =
        button.querySelector("span")?.textContent || "";
      button.disabled = true;

      const span = button.querySelector("span");
      if (span) {
        span.textContent = loadingText || "Sending...";
      }
    } else {
      button.disabled = false;

      const span = button.querySelector("span");
      if (span && button.dataset.originalText) {
        span.textContent = button.dataset.originalText;
      }
    }
  }

  function openModal(modalId, trigger) {
    const modal = document.getElementById(modalId);

    if (!modal) return;

    lastFocusedElement = trigger || document.activeElement;
    activeModal = modal;

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("footer-modal-open");

    requestAnimationFrame(function () {
      modal.classList.add("is-open");
    });

    const firstFocusable = modal.querySelector(
      "button, input, textarea, select"
    );

    if (firstFocusable) {
      setTimeout(function () {
        firstFocusable.focus();
      }, 30);
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);

    if (!modal) return;

    modal.classList.remove("is-open");
    modal.classList.add("is-closing");
    modal.setAttribute("aria-hidden", "true");

    setTimeout(function () {
      modal.hidden = true;
      modal.classList.remove("is-closing");
    }, 210);

    document.body.classList.remove("footer-modal-open");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      setTimeout(function () {
        lastFocusedElement.focus();
      }, 20);
    }

    activeModal = null;
  }

  function resetFeedbackForm() {
    const form = document.getElementById("feedbackForm");
    if (form) form.reset();

    selectedRating = 0;

    document.querySelectorAll(".rating-star").forEach(function (star) {
      star.classList.remove("is-selected");
      star.setAttribute("aria-checked", "false");
    });

    const caption = document.getElementById("ratingCaption");
    if (caption) caption.textContent = "Select a rating";

    const count = document.getElementById("feedbackCharCount");
    if (count) count.textContent = "0/1000";

    setStatus("feedbackStatus", "", "");
  }

  function resetHelpForm() {
    const form = document.getElementById("helpForm");
    if (form) form.reset();

    const count = document.getElementById("helpCharCount");
    if (count) count.textContent = "0/1500";

    setStatus("helpStatus", "", "");
  }

  function setupRating() {
    const stars = Array.from(document.querySelectorAll(".rating-star"));

    stars.forEach(function (star) {
      star.addEventListener("mouseenter", function () {
        const value = Number(star.dataset.rating || 0);

        stars.forEach(function (item) {
          item.classList.toggle(
            "is-selected",
            Number(item.dataset.rating || 0) <= value
          );
        });
      });

      star.addEventListener("mouseleave", function () {
        stars.forEach(function (item) {
          item.classList.toggle(
            "is-selected",
            Number(item.dataset.rating || 0) <= selectedRating
          );
        });
      });

      star.addEventListener("click", function () {
        selectedRating = Number(star.dataset.rating || 0);

        stars.forEach(function (item) {
          const value = Number(item.dataset.rating || 0);
          const selected = value <= selectedRating;

          item.classList.toggle("is-selected", selected);
          item.setAttribute("aria-checked", String(value === selectedRating));
        });

        const caption = document.getElementById("ratingCaption");
        if (caption) {
          caption.textContent = ratingLabels[selectedRating] || "Selected";
        }

        setStatus("feedbackStatus", "", "");
      });
    });
  }

  function setupCharacterCounter(textareaId, counterId, max) {
    const textarea = document.getElementById(textareaId);
    const counter = document.getElementById(counterId);

    if (!textarea || !counter) return;

    function update() {
      counter.textContent =
        String(textarea.value.length) + "/" + String(max);
    }

    textarea.addEventListener("input", update);
    update();
  }

  function describeFirestoreError(error) {
    if (!error) {
      return "Unable to complete the request right now.";
    }

    console.error("DSS V2 footer Firestore error:", error);

    const code = String(error.code || "").toLowerCase();

    if (code.includes("permission-denied")) {
      return "The request reached Firestore, but permission was denied. Please contact the DSS administrator.";
    }

    if (code.includes("unauthenticated")) {
      return "Your DSS session has expired. Please sign in again.";
    }

    if (
      code.includes("failed-precondition") &&
      String(error.message || "").toLowerCase().includes("offline")
    ) {
      return "The DSS connection is currently offline. Please check your connection and try again.";
    }

    if (code.includes("unavailable")) {
      return "Firestore is temporarily unavailable. Please try again in a moment.";
    }

    if (code.includes("network")) {
      return "The network connection is unavailable. Please try again.";
    }

    return "Unable to send this request right now. Please try again.";
  }

  async function sendFeedback(event) {
    event.preventDefault();

    const statusId = "feedbackStatus";
    const button = document.getElementById("sendFeedbackBtn");

    const comment =
      document.getElementById("feedbackText")?.value.trim() || "";

    const name =
      document.getElementById("feedbackName")?.value.trim() || "";

    if (!selectedRating) {
      setStatus(statusId, "Please select a rating first.", "error");
      return;
    }

    if (!comment) {
      setStatus(statusId, "Please enter your feedback.", "error");
      document.getElementById("feedbackText")?.focus();
      return;
    }

    setButtonLoading(button, true, "Sending...");

    try {
      const firebaseInstance = await ensureFirebase();
      const user = await getAuthUser(firebaseInstance);
      const profile = getCurrentProfile();
      const page = getPageContext();

      await firebaseInstance.firestore().collection("feedback").add({
        uid: user.uid,
        userId: user.uid,
        email: user.email || profile.email || "",
        name: name || profile.displayName || "Anonymous",
        rating: selectedRating,
        comment: comment,
        page: page.page,
        pageTitle: page.pageTitle,
        createdAt: firebaseInstance.firestore.FieldValue.serverTimestamp()
      });

      setStatus(
        statusId,
        "Thank you. Your feedback was sent successfully.",
        "success"
      );

      setButtonLoading(button, false);

      setTimeout(function () {
        resetFeedbackForm();
        closeModal("feedbackModal");
      }, 900);
    } catch (error) {
      setButtonLoading(button, false);

      if (error && error.message === "AUTH_REQUIRED") {
        setStatus(
          statusId,
          "You must be signed in to send feedback.",
          "error"
        );
      } else if (error && error.message === "AUTH_TIMEOUT") {
        setStatus(
          statusId,
          "We could not confirm your DSS session. Please refresh and try again.",
          "error"
        );
      } else {
        setStatus(statusId, describeFirestoreError(error), "error");
      }
    }
  }

  async function sendHelpRequest(event) {
    event.preventDefault();

    const statusId = "helpStatus";
    const button = document.getElementById("sendHelpBtn");

    const category =
      document.getElementById("helpCategory")?.value.trim() || "";

    const subject =
      document.getElementById("helpSubject")?.value.trim() || "";

    const message =
      document.getElementById("helpMessage")?.value.trim() || "";

    if (!category) {
      setStatus(statusId, "Please select a help category.", "error");
      document.getElementById("helpCategory")?.focus();
      return;
    }

    if (!subject) {
      setStatus(statusId, "Please enter a subject.", "error");
      document.getElementById("helpSubject")?.focus();
      return;
    }

    if (!message) {
      setStatus(statusId, "Please describe the issue.", "error");
      document.getElementById("helpMessage")?.focus();
      return;
    }

    setButtonLoading(button, true, "Sending...");

    try {
      const firebaseInstance = await ensureFirebase();
      const user = await getAuthUser(firebaseInstance);
      const profile = getCurrentProfile();
      const page = getPageContext();

      await firebaseInstance.firestore().collection("help_requests").add({
        uid: user.uid,
        userId: user.uid,
        email: user.email || profile.email || "",
        name: profile.displayName || "User",
        category: category,
        subject: subject,
        message: message,
        page: page.page,
        pageTitle: page.pageTitle,
        status: "open",
        createdAt: firebaseInstance.firestore.FieldValue.serverTimestamp()
      });

      setStatus(
        statusId,
        "Your help request was sent successfully.",
        "success"
      );

      setButtonLoading(button, false);

      setTimeout(function () {
        resetHelpForm();
        closeModal("helpModal");
      }, 900);
    } catch (error) {
      setButtonLoading(button, false);

      if (error && error.message === "AUTH_REQUIRED") {
        setStatus(
          statusId,
          "You must be signed in to send a help request.",
          "error"
        );
      } else if (error && error.message === "AUTH_TIMEOUT") {
        setStatus(
          statusId,
          "We could not confirm your DSS session. Please refresh and try again.",
          "error"
        );
      } else {
        setStatus(statusId, describeFirestoreError(error), "error");
      }
    }
  }

  function trapFocus(event) {
    if (!activeModal || event.key !== "Tab") return;

    const focusables = Array.from(
      activeModal.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])'
      )
    ).filter(function (element) {
      return element.offsetParent !== null;
    });

    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape" && activeModal) {
      closeModal(activeModal.id);
      return;
    }

    trapFocus(event);
  }

  function setupModalEvents() {
    const feedbackBtn = document.getElementById("footerFeedbackBtn");
    const helpBtn = document.getElementById("footerHelpBtn");

    if (feedbackBtn) {
      feedbackBtn.addEventListener("click", function () {
        resetFeedbackForm();
        openModal("feedbackModal", feedbackBtn);
      });
    }

    if (helpBtn) {
      helpBtn.addEventListener("click", function () {
        resetHelpForm();
        openModal("helpModal", helpBtn);
      });
    }

    document.querySelectorAll("[data-close-modal]").forEach(function (element) {
      element.addEventListener("click", function () {
        closeModal(element.dataset.closeModal);
      });
    });

    const feedbackForm = document.getElementById("feedbackForm");
    if (feedbackForm) {
      feedbackForm.addEventListener("submit", sendFeedback);
    }

    const helpForm = document.getElementById("helpForm");
    if (helpForm) {
      helpForm.addEventListener("submit", sendHelpRequest);
    }

    document.addEventListener("keydown", handleKeydown);
  }

  function init() {
    setupModalEvents();
    setupRating();
    setupCharacterCounter("feedbackText", "feedbackCharCount", 1000);
    setupCharacterCounter("helpMessage", "helpCharCount", 1500);

    /*
     * If the shared header has already loaded the user's profile,
     * populate the optional feedback name automatically.
     */
    const profile = getCurrentProfile();
    const feedbackName = document.getElementById("feedbackName");

    if (feedbackName && profile.displayName) {
      feedbackName.value = profile.displayName;
    }
  }

  /*
   * Footer HTML is inserted asynchronously by the shared
   * footer loader, so support both immediate and loader-driven
   * initialization.
   */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  document.addEventListener("footerLoaded", function () {
    /*
     * Guard against duplicate initialization when a loader
     * dispatches its completion event.
     */
    if (document.body.dataset.footerModalInitialized === "true") {
      return;
    }

    document.body.dataset.footerModalInitialized = "true";
    init();
  }, { once: true });

})();
