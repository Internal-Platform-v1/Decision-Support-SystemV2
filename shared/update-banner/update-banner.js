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

  let publishedSlides = [];
  let activeIndex = 0;
  let timerId = null;
  let banner = null;
  let modal = null;
  let modalIndex = 0;
  let initialized = false;
  let unsubscribeBanner = null;

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

  function fetchPublishedSlides() {
    const db = firestore();
    if (!db) return;

    if (unsubscribeBanner) unsubscribeBanner();

    unsubscribeBanner = db.collection(COLLECTION).onSnapshot(snap => {
      const allPublished = [];
      
      snap.forEach(doc => {
        const data = doc.data();
        const isPub = data.published === true || data.published === "true" || data.published === 1;
        
        if (isPub) {
          allPublished.push({ id: doc.id, ...data });
        }
      });

      allPublished.sort((a, b) => {
        const tA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
        const tB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
        return tB - tA;
      });

      const next = [];
      allPublished.forEach((post, index) => {
        const catMeta = SLIDES.find(s => s.key === post.category) || SLIDES[0];
        
        next.push({
          index: index,
          meta: {
            key: post.category || "general",
            icon: catMeta.icon,
            label: catMeta.label
          },
          content: {
            eyebrow: post.eyebrow || "Normal", // This is the Priority
            title:   post.title   || "",
            date:    post.date    || "",
            message: post.message || "",
            button:  post.button  || "View Details"
          }
        });
      });

      publishedSlides = next;
      
      if (!publishedSlides.length) {
        if (banner) banner.style.display = "none";
        return;
      }

      if (banner) banner.style.display = "";
      
      if (activeIndex >= publishedSlides.length) activeIndex = 0;
      
      renderSlide(activeIndex);
      startAutoAdvance();

    }, err => {
      console.warn("[update-banner] listener failed:", err.code || err.message);
    });
  }

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

    // SET PRIORITY COLOR DATA ATTRIBUTE
    const priorityVal = (content.eyebrow || "Normal").toLowerCase();
    if (["normal", "important", "urgent"].includes(priorityVal)) {
      banner.setAttribute("data-priority", priorityVal);
    } else {
      banner.removeAttribute("data-priority");
    }

    copy.style.opacity = '1';

    copy.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
    copy.style.transform = 'translateX(-100%)';

    setTimeout(() => {
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

      copy.style.transition = 'none';
      copy.style.transform = 'translateX(100%)';
      
      void copy.offsetWidth;

      copy.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
      copy.style.transform = 'translateX(0)';

    }, 350);
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

  function renderModal(index) {
    if (!modal) return;
    if (!publishedSlides.length) return;

    modalIndex = index;
    const slide = publishedSlides[index];
    if (!slide) return;
    const { meta, content } = slide;

    // SET PRIORITY COLOR DATA ATTRIBUTE FOR MODAL
    const priorityVal = (content.eyebrow || "Normal").toLowerCase();
    if (["normal", "important", "urgent"].includes(priorityVal)) {
      modal.setAttribute("data-priority", priorityVal);
    } else {
      modal.removeAttribute("data-priority");
    }

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

  function tryInit(attempt) {
    attempt = attempt || 0;
    if (initialized) return;

    banner = document.getElementById("dssUpdateBanner");
    modal = document.getElementById("dssUpdateModal");

    if (!banner) {
      if (attempt < 40) {
        setTimeout(() => tryInit(attempt + 1), 100);
      }
      return;
    }

    initialized = true;
    bindButton();
    bindHover();
    bindModal();

    const waitForFirebase = async (fbAttempt = 0) => {
      if (firestore()) {
        fetchPublishedSlides();
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
