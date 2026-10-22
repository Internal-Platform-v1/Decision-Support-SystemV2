/* ============================================================
   DSS V2 — SHARED UPDATE BANNER ROTATOR
   The HTML is already inserted by shared/include.js.
   This script only rotates the content and pulls Firestore data.
   ============================================================ */
(function () {
  "use strict";

  const COLLECTION = "announcements";
  const SLIDE_INTERVAL = 6000;

  const SLIDES = [
    { key: "general",   icon: "fa-solid fa-bullhorn",                 eyebrow: "SYSTEM UPDATE" },
    { key: "whats_new", icon: "fa-solid fa-wand-magic-sparkles",      eyebrow: "WHAT'S NEW" },
    { key: "reminders", icon: "fa-solid fa-triangle-exclamation",     eyebrow: "IMPORTANT REMINDER" },
    { key: "issues",    icon: "fa-solid fa-bug",                      eyebrow: "KNOWN ISSUE" },
    { key: "guides",    icon: "fa-solid fa-book-open",                eyebrow: "NEW GUIDES" }
  ];

  const DEFAULTS = [
    {
      eyebrow: "SYSTEM UPDATE",
      title: "EBS System Maintenance",
      date: "May 25, 2025 from 1:00 AM – 5:00 AM PST.",
      message: "Some EBS features may be unavailable during this time.\nPlease plan your tasks accordingly.",
      button: "View All Updates"
    },
    {
      eyebrow: "WHAT'S NEW",
      title: "New Feature Release",
      date: "Available now",
      message: "Explore the latest features added to the Decision Support System.",
      button: "See What's New"
    },
    {
      eyebrow: "IMPORTANT REMINDER",
      title: "Action Required",
      date: "Please review before the deadline.",
      message: "Make sure you're aware of the latest policies and requirements.",
      button: "View Reminder"
    },
    {
      eyebrow: "KNOWN ISSUE",
      title: "System Issue Being Investigated",
      date: "Reported recently",
      message: "We are aware of the issue and are working on a fix.",
      button: "View Details"
    },
    {
      eyebrow: "NEW GUIDES",
      title: "New Guides Available",
      date: "Recently added",
      message: "Check out the newly published guides and resources.",
      button: "Browse New Guides"
    }
  ];

  const slideContent = DEFAULTS.map(d => ({ ...d }));

  let activeIndex = 0;
  let timerId = null;
  let banner = null;

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
        }
      });
    } catch (err) {
      console.warn("[update-banner] fetch failed:", err.code || err.message);
    }
  }

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
        message.innerHTML = String(data.message || "")
          .split("\n")
          .map(line => esc(line))
          .join("<br>");
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
      const target = document.querySelector("[data-updates], #updates, .updates-page");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.dispatchEvent(new CustomEvent("dss:view-updates"));
    });
  }

  function bindHover() {
    banner.addEventListener("mouseenter", stopAutoAdvance);
    banner.addEventListener("mouseleave", startAutoAdvance);
  }

  function init() {
    banner = document.getElementById("dssUpdateBanner");
    if (!banner) {
      // include.js may not have inserted it yet — wait for the event
      window.addEventListener("bdtools:update-banner-ready", init);
      return;
    }

    bindDots();
    bindButton();
    bindHover();

    renderSlide(activeIndex);
    startAutoAdvance();

    const waitForFirebase = async (attempt = 0) => {
      if (firestore()) {
        await fetchAllAnnouncements();
        renderSlide(activeIndex);
        return;
      }
      if (attempt < 20) setTimeout(() => waitForFirebase(attempt + 1), 100);
    };

    waitForFirebase();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
