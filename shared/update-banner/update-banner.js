/* ============================================================
   DSS V2 — SHARED UPDATE BANNER ROTATOR + MODAL
   ============================================================ */
(function () {
  "use strict";

  const COLLECTION = "announcements";
  const SLIDE_INTERVAL = 6000;

  const SLIDES = [
    { key: "general",   icon: "fa-solid fa-bullhorn",              eyebrow: "SYSTEM UPDATE",     label: "📢 Announcements" },
    { key: "whats_new", icon: "fa-solid fa-wand-magic-sparkles",   eyebrow: "WHAT'S NEW",        label: "✨ What's New?" },
    { key: "reminders", icon: "fa-solid fa-triangle-exclamation",  eyebrow: "IMPORTANT REMINDER", label: "⚠ Important Reminders" },
    { key: "issues",    icon: "fa-solid fa-bug",                   eyebrow: "KNOWN ISSUE",       label: "🐞 Known Issues" },
    { key: "guides",    icon: "fa-solid fa-book-open",             eyebrow: "NEW GUIDES",        label: "📚 New Guides Added" }
  ];

  const DEFAULTS = [
    { eyebrow: "SYSTEM UPDATE", title: "EBS System Maintenance", date: "May 25, 2025 from 1:00 AM – 5:00 AM PST.", message: "Some EBS features may be unavailable during this time.\nPlease plan your tasks accordingly.", button: "View All Updates" },
    { eyebrow: "WHAT'S NEW", title: "New Feature Release", date: "Available now", message: "Explore the latest features added to the Decision Support System.", button: "See What's New" },
    { eyebrow: "IMPORTANT REMINDER", title: "Action Required", date: "Please review before the deadline.", message: "Make sure you're aware of the latest policies and requirements.", button: "View Reminder" },
    { eyebrow: "KNOWN ISSUE", title: "System Issue Being Investigated", date: "Reported recently", message: "We are aware of the issue and are working on a fix.", button: "View Details" },
    { eyebrow: "NEW GUIDES", title: "New Guides Available", date: "Recently added", message: "Check out the newly published guides and resources.", button: "Browse New Guides" }
  ];

  const slideContent = DEFAULTS.map(d => ({ ...d }));

  let activeIndex = 0;
  let timerId = null;
  let banner = null;
  let modal = null;
  let modalIndex = 0;
  let initialized = false;

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

  async function fetchAllAnnouncements() {
    const db = firestore();
    if (!db) return;
    try {
      const results = await Promise.all(
        SLIDES.map(s => db.collection(COLLECTION).doc(s.key).get().catch(() => null))
      );
      let customized = 0;
      results.forEach((snap, i) => {
        if (snap && snap.exists) {
          const data = snap.data() || {};
          slideContent[i] = {
            eyebrow: data.eyebrow || DEFAULTS[i].eyebrow,
            title:   data.title   || DEFAULTS[i].title,
            date:    data.date    || DEFAULTS[i].date,
            message: data.message || DEFAULTS[i].message,
            button:  data.button  || DEFAULTS[i].button
          };
          customized++;
        }
      });
      console.log("[update-banner] Loaded", customized, "customized announcements.");
    } catch (err) {
      console.warn("[update-banner] fetch failed:", err.code || err.message);
    }
  }

  /* ------------------------------------------------------------
     BANNER RENDER
     ------------------------------------------------------------ */
  function renderSlide(index) {
    if (!banner) return;
    const data = slideContent[index];
    if (!data) return;
    const copy = banner.querySelector(".dss-update-banner__copy");
    if (!copy) return;

    copy.classList.add("is-swapping");

    setTimeout(() => {
      const icon = banner.querySelector(".dss-update-banner__icon i");
      if (icon) icon.className = SLIDES[index].icon;

      const eyebrowText = banner.querySelector(".dss-update-banner__eyebrow-text");
      if (eyebrowText) eyebrowText.textContent = data.eyebrow;

      const title = banner.querySelector(".dss-update-banner__title");
      if (title) title.textContent = data.title;

      const dateText = banner.querySelector(".dss-update-banner__date-text");
      if (dateText) dateText.textContent = data.date;

      const message = banner.querySelector(".dss-update-banner__message");
      if (message) {
        message.innerHTML = String(data.message || "").split("\n").map(esc).join("<br>");
      }

      const buttonText = banner.querySelector(".dss-update-banner__button-text");
      if (buttonText) buttonText.textContent = data.button;

      banner.querySelectorAll(".dss-update-banner__dot").forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
      });

      copy.classList.remove("is-swapping");
    }, 250);
  }

  function startAutoAdvance() {
    stopAutoAdvance();
    timerId = setInterval(() => {
      activeIndex = (activeIndex + 1) % SLIDES.length;
      renderSlide(activeIndex);
    }, SLIDE_INTERVAL);
  }

  function stopAutoAdvance() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }

  /* ------------------------------------------------------------
     BANNER BINDINGS
     ------------------------------------------------------------ */
  function bindDots() {
    banner.querySelectorAll(".dss-update-banner__dot").forEach(dot => {
      dot.addEventListener("click", () => {
        const index = Number(dot.dataset.slideTo);
        if (!Number.isFinite(index)) return;
        activeIndex = index;
        renderSlide(activeIndex);
        startAutoAdvance();
      });
    });
  }

  function bindButton() {
    const btn = banner.querySelector('[data-update-action="view-all"]');
    if (!btn) return;
    btn.addEventListener("click", () => {
      openModal(activeIndex);
    });
  }

  function bindHover() {
    banner.addEventListener("mouseenter", stopAutoAdvance);
    banner.addEventListener("mouseleave", startAutoAdvance);
  }

  /* ------------------------------------------------------------
     MODAL
     ------------------------------------------------------------ */
  function ensureModalRefs() {
    modal = document.getElementById("dssUpdateModal");
  }

  function renderModal(index) {
    if (!modal) return;
    modalIndex = index;
    const data = slideContent[index];
    const meta = SLIDES[index];
    if (!data || !meta) return;

    const eyebrow = modal.querySelector("#dssUpdateModalEyebrow");
    const title   = modal.querySelector("#dssUpdateModalTitle");
    const badge   = modal.querySelector("#dssUpdateModalBadge");
    const date    = modal.querySelector("#dssUpdateModalDate");
    const message = modal.querySelector("#dssUpdateModalMessage");

    if (eyebrow) eyebrow.textContent = data.eyebrow || meta.eyebrow;
    if (title)   title.textContent   = data.title   || "";
    if (badge)   badge.textContent   = meta.label;
    if (date)    date.textContent    = data.date    || "";
    if (message) message.textContent  = data.message || "";

    // Dots inside the modal
    const dotsWrap = modal.querySelector("#dssUpdateModalDots");
    if (dotsWrap) {
      dotsWrap.innerHTML = SLIDES.map((_, i) =>
        `<button type="button" class="dss-update-modal__dot${i === index ? " is-active" : ""}" data-modal-slide="${i}" aria-label="${esc(SLIDES[i].label)}"></button>`
      ).join("");
      dotsWrap.querySelectorAll("[data-modal-slide]").forEach(dot => {
        dot.addEventListener("click", () => {
          const i = Number(dot.dataset.modalSlide);
          if (Number.isFinite(i)) renderModal(i);
        });
      });
    }

    // Prev / next disabled states
    const prev = modal.querySelector("#dssUpdateModalPrev");
    const next = modal.querySelector("#dssUpdateModalNext");
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === SLIDES.length - 1;
  }

  function openModal(index) {
    if (!modal) return;
    renderModal(index);
    modal.hidden = false;
    modal.classList.remove("is-open");
    requestAnimationFrame(() => {
      modal.classList.add("is-open");
    });
    document.body.classList.add("dss-modal-open");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("dss-modal-open");
    setTimeout(() => {
      modal.hidden = true;
    }, 220);
  }

  function bindModal() {
    if (!modal) return;

    // Close on backdrop click or close button
    modal.querySelectorAll("[data-update-modal-close]").forEach(el => {
      el.addEventListener("click", closeModal);
    });

    // Prev / next
    modal.querySelector("#dssUpdateModalPrev")?.addEventListener("click", () => {
      if (modalIndex > 0) renderModal(modalIndex - 1);
    });
    modal.querySelector("#dssUpdateModalNext")?.addEventListener("click", () => {
      if (modalIndex < SLIDES.length - 1) renderModal(modalIndex + 1);
    });

    // ESC to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal && !modal.hidden) closeModal();
    });
  }

  /* ------------------------------------------------------------
     INIT
     ------------------------------------------------------------ */
  function tryInit(attempt) {
    attempt = attempt || 0;
    if (initialized) return;

    banner = document.getElementById("dssUpdateBanner");
    ensureModalRefs();

    if (!banner) {
      if (attempt < 40) {
        setTimeout(() => tryInit(attempt + 1), 100);
      } else {
        console.warn("[update-banner] banner element never appeared after 4s");
      }
      return;
    }

    initialized = true;
    bindDots();
    bindButton();
    bindHover();
    bindModal();
    renderSlide(activeIndex);
    startAutoAdvance();

    const waitForFirebase = async (fbAttempt = 0) => {
      if (firestore()) {
        await fetchAllAnnouncements();
        renderSlide(activeIndex);
        // If modal is open, refresh it too
        if (modal && !modal.hidden) renderModal(modalIndex);
        return;
      }
      if (fbAttempt < 20) setTimeout(() => waitForFirebase(fbAttempt + 1), 100);
    };

    waitForFirebase();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => tryInit(0));
  } else {
    tryInit(0);
  }

  window.addEventListener("bdtools:update-banner-ready", () => tryInit(0));
})();
