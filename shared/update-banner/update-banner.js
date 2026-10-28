/* ============================================================
   DSS V2 — SHARED UPDATE BANNER ROTATOR + MODAL
   Only shows categories that have been explicitly published.
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

  // Only categories that have been published. Starts empty —
  // nothing shows in the banner until an admin publishes.
  let publishedSlides = [];

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

  /* ------------------------------------------------------------
     Fetch all 5 docs. Keep only the published ones.
     ------------------------------------------------------------ */
  async function fetchPublishedSlides() {
    const db = firestore();
    if (!db) {
      console.info("[update-banner] Firestore not ready.");
      return;
    }

    try {
      const results = await Promise.all(
        SLIDES.map(s => db.collection(COLLECTION).doc(s.key).get().catch(() => null))
      );

      const next = [];
      results.forEach((snap, i) => {
        if (!snap || !snap.exists) return;
        const data = snap.data() || {};
        if (data.published !== true) return;

        next.push({
          index: i,
          meta: SLIDES[i],
          content: {
            eyebrow: data.eyebrow || SLIDES[i].eyebrow,
            title:   data.title   || "",
            date:    data.date    || "",
            message: data.message || "",
            button:  data.button  || "View Details"
          }
        });
      });

      publishedSlides = next;
      console.log("[update-banner] Published slides:", publishedSlides.length,
        publishedSlides.map(s => s.meta.key));
    } catch (err) {
      console.warn("[update-banner] fetch failed:", err.code || err.message);
    }
  }

  /* ------------------------------------------------------------
     Banner rendering — uses publishedSlides[], not SLIDES[]
     ------------------------------------------------------------ */
  function renderSlide(index) {
    if (!banner) return;
    if (!publishedSlides.length) {
      banner.style.display = "none";
      return;
    }
    banner.style.display = "";

    const slide = publishedSlides[index];
    if (!slide) return;
    const { meta, content } = slide;
    const copy = banner.querySelector(".dss-update-banner__copy");
    if (!copy) return;

    // 1. Slide old content to the LEFT and fade out
    copy.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    copy.style.transform = 'translateX(-30px)';
    copy.style.opacity = '0';

    setTimeout(() => {
      // 2. Update the text while it's invisible
      const icon = banner.querySelector(".dss-update-banner__icon i");
      if (icon) icon.className = meta.icon;

      const eyebrowText = banner.querySelector(".dss-update-banner__eyebrow-text");
      if (eyebrowText) eyebrowText.textContent = content.eyebrow;

      const title = banner.querySelector(".dss-update-banner__title");
      if (title) title.textContent = content.title;

      const dateText = banner.querySelector(".dss-update-banner__date-text");
      if (dateText) dateText.textContent = content.date;

      const message = banner.querySelector(".dss-update-banner__message");
      if (message) {
        message.innerHTML = String(content.message || "").split("\n").map(esc).join("<br>");
      }

      const buttonText = banner.querySelector(".dss-update-banner__button-text");
      if (buttonText) buttonText.textContent = content.button;

      // Rebuild dots
      const dotsWrap = banner.querySelector(".dss-update-banner__dots");
      if (dotsWrap) {
        dotsWrap.innerHTML = publishedSlides.map((_, i) =>
          `<button type="button" class="dss-update-banner__dot${i === index ? " is-active" : ""}" data-slide-to="${i}" aria-label="${esc(publishedSlides[i].meta.label)}"></button>`
        ).join("");
        dotsWrap.querySelectorAll("[data-slide-to]").forEach(dot => {
          dot.addEventListener("click", () => {
            const i = Number(dot.dataset.slideTo);
            if (!Number.isFinite(i)) return;
            activeIndex = i;
            renderSlide(activeIndex);
            startAutoAdvance();
          });
        });
      }

      // 3. Instantly snap to the RIGHT (off-screen)
      copy.style.transition = 'none';
      copy.style.transform = 'translateX(30px)';
      
      // 4. Force browser reflow to apply the snap
      void copy.offsetWidth;

      // 5. Slide IN to the center
      copy.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
      copy.style.transform = 'translateX(0)';
      copy.style.opacity = '1';

    }, 250);
  }

  function startAutoAdvance() {
    stopAutoAdvance();
    if (publishedSlides.length < 2) return;
    timerId = setInterval(() => {
      activeIndex = (activeIndex + 1) % publishedSlides.length;
      renderSlide(activeIndex);
    }, SLIDE_INTERVAL);
  }

  function stopAutoAdvance() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }

  /* ------------------------------------------------------------
     Button opens the modal on the current slide
     ------------------------------------------------------------ */
  function bindButton() {
    const btn = banner.querySelector('[data-update-action="view-all"]');
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (!publishedSlides.length) return;
      openModal(activeIndex);
    });
  }

  function bindHover() {
    banner.addEventListener("mouseenter", stopAutoAdvance);
    banner.addEventListener("mouseleave", startAutoAdvance);
  }

  /* ------------------------------------------------------------
     Modal — uses publishedSlides[]
     ------------------------------------------------------------ */
  function renderModal(index) {
    if (!modal) return;
    if (!publishedSlides.length) return;

    modalIndex = index;
    const slide = publishedSlides[index];
    if (!slide) return;
    const { meta, content } = slide;

    const eyebrow = modal.querySelector("#dssUpdateModalEyebrow");
    const title   = modal.querySelector("#dssUpdateModalTitle");
    const badge   = modal.querySelector("#dssUpdateModalBadge");
    const date    = modal.querySelector("#dssUpdateModalDate");
    const message = modal.querySelector("#dssUpdateModalMessage");

    if (eyebrow) eyebrow.textContent = content.eyebrow;
    if (title)   title.textContent   = content.title;
    if (badge)   badge.textContent   = meta.label;
    if (date)    date.textContent    = content.date;
    if (message) message.textContent  = content.message;

    const dotsWrap = modal.querySelector("#dssUpdateModalDots");
    if (dotsWrap) {
      dotsWrap.innerHTML = publishedSlides.map((_, i) =>
        `<button type="button" class="dss-update-modal__dot${i === index ? " is-active" : ""}" data-modal-slide="${i}" aria-label="${esc(publishedSlides[i].meta.label)}"></button>`
      ).join("");
      dotsWrap.querySelectorAll("[data-modal-slide]").forEach(dot => {
        dot.addEventListener("click", () => {
          const i = Number(dot.dataset.modalSlide);
          if (Number.isFinite(i)) renderModal(i);
        });
      });
    }

    const prev = modal.querySelector("#dssUpdateModalPrev");
    const next = modal.querySelector("#dssUpdateModalNext");
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === publishedSlides.length - 1;
  }

  function openModal(index) {
    if (!modal || !publishedSlides.length) return;
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
    modal.querySelectorAll("[data-update-modal-close]").forEach(el => {
      el.addEventListener("click", closeModal);
    });
    modal.querySelector("#dssUpdateModalPrev")?.addEventListener("click", () => {
      if (modalIndex > 0) renderModal(modalIndex - 1);
    });
    modal.querySelector("#dssUpdateModalNext")?.addEventListener("click", () => {
      if (modalIndex < publishedSlides.length - 1) renderModal(modalIndex + 1);
    });
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
    modal = document.getElementById("dssUpdateModal");

    if (!banner) {
      if (attempt < 40) {
        setTimeout(() => tryInit(attempt + 1), 100);
      } else {
        console.warn("[update-banner] banner element never appeared after 4s");
      }
      return;
    }

    initialized = true;
    bindButton();
    bindHover();
    bindModal();

    const waitForFirebase = async (fbAttempt = 0) => {
      if (firestore()) {
        await fetchPublishedSlides();

        if (!publishedSlides.length) {
          // Nothing published — hide the banner entirely
          banner.style.display = "none";
          return;
        }

        activeIndex = 0;
        renderSlide(activeIndex);
        startAutoAdvance();
        return;
      }
      if (fbAttempt < 20) setTimeout(() => waitForFirebase(fbAttempt + 1), 100);
      else banner.style.display = "none";
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
