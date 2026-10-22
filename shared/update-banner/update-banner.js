/* ============================================================
   DSS V2 — SHARED UPDATE BANNER LOADER
   Loads the banner markup, fetches all 5 announcements from
   Firestore, and rotates them automatically.
   ============================================================ */
(function () {
  "use strict";

  const BANNER_FILE = "shared/update-banner.html";
  const BANNER_IMAGE = "assets/images/update-banner-truck.png";
  const COLLECTION = "announcements";
  const SLIDE_INTERVAL = 6000; // 6 seconds per slide

  const SLIDES = [
    {
      key: "general",
      icon: "fa-solid fa-bullhorn",
      eyebrow: "SYSTEM UPDATE",
      defaults: {
        title: "EBS System Maintenance",
        date: "May 25, 2025 from 1:00 AM – 5:00 AM PST.",
        message: "Some EBS features may be unavailable during this time.\nPlease plan your tasks accordingly.",
        button: "View All Updates"
      }
    },
    {
      key: "whats_new",
      icon: "fa-solid fa-wand-magic-sparkles",
      eyebrow: "WHAT'S NEW",
      defaults: {
        title: "New Feature Release",
        date: "Available now",
        message: "Explore the latest features added to the Decision Support System.",
        button: "See What's New"
      }
    },
    {
      key: "reminders",
      icon: "fa-solid fa-triangle-exclamation",
      eyebrow: "IMPORTANT REMINDER",
      defaults: {
        title: "Action Required",
        date: "Please review before the deadline.",
        message: "Make sure you're aware of the latest policies and requirements.",
        button: "View Reminder"
      }
    },
    {
      key: "issues",
      icon: "fa-solid fa-bug",
      eyebrow: "KNOWN ISSUE",
      defaults: {
        title: "System Issue Being Investigated",
        date: "Reported recently",
        message: "We are aware of the issue and are working on a fix. We apologize for any inconvenience.",
        button: "View Details"
      }
    },
    {
      key: "guides",
      icon: "fa-solid fa-book-open",
      eyebrow: "NEW GUIDES",
      defaults: {
        title: "New Guides Available",
        date: "Recently added",
        message: "Check out the newly published guides and resources.",
        button: "Browse New Guides"
      }
    }
  ];

  let slideData = SLIDES.map(s => ({ ...s.defaults }));
  let activeIndex = 0;
  let timerId = null;

  function getBasePrefix() {
    const path = window.location.pathname;
    const marker = "/guides/";
    const index = path.indexOf(marker);
    return index === -1 ? "" : "../../";
  }

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
     Fetch all 5 announcements in parallel
     ------------------------------------------------------------ */
  async function fetchAllAnnouncements() {
    const db = firestore();
    if (!db) {
      console.info("[update-banner] Firestore not ready — using defaults.");
      return;
    }

    try {
      const results = await Promise.all(
        SLIDES.map(s => db.collection(COLLECTION).doc(s.key).get().catch(() => null))
      );

      results.forEach((snap, i) => {
        if (snap && snap.exists) {
          const data = snap.data() || {};
          slideData[i] = {
            title:   data.title   || SLIDES[i].defaults.title,
            date:    data.date    || SLIDES[i].defaults.date,
            message: data.message || SLIDES[i].defaults.message,
            button:  data.button  || SLIDES[i].defaults.button,
            eyebrow: data.eyebrow || SLIDES[i].eyebrow
          };
        }
      });

      console.log("[update-banner] Loaded", results.filter(r => r && r.exists).length, "customized announcements.");
    } catch (err) {
      console.warn("[update-banner] Fetch failed:", err.code || err.message);
    }
  }

  /* ------------------------------------------------------------
     Render slide content
     ------------------------------------------------------------ */
  function renderSlide(index, banner) {
    const slide = banner.querySelector(`[data-slide="0"]`);
    if (!slide || !slideData[index]) return;

    const data = slideData[index];

    const eyebrowIcon = slide.querySelector(".dss-update-banner__icon i");
    if (eyebrowIcon) {
      eyebrowIcon.className = SLIDES[index].icon;
    }

    const eyebrowText = slide.querySelector(".dss-update-banner__eyebrow-text");
    if (eyebrowText) eyebrowText.textContent = data.eyebrow || SLIDES[index].eyebrow;

    const title = slide.querySelector(".dss-update-banner__title");
    if (title) title.textContent = data.title || "";

    const dateText = slide.querySelector(".dss-update-banner__date-text");
    if (dateText) dateText.textContent = data.date || "";

    const message = slide.querySelector(".dss-update-banner__message");
    if (message) {
      message.innerHTML = String(data.message || "")
        .split("\n")
        .map(line => esc(line))
        .join("<br>");
    }

    const buttonText = slide.querySelector(".dss-update-banner__button-text");
    if (buttonText) buttonText.textContent = data.button || "";

    // Update dots
    banner.querySelectorAll(".dss-update-banner__dot").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  }

  /* ------------------------------------------------------------
     Auto-advance
     ------------------------------------------------------------ */
  function startAutoAdvance(banner) {
    stopAutoAdvance();
    timerId = setInterval(() => {
      activeIndex = (activeIndex + 1) % slideData.length;
      renderSlide(activeIndex, banner);
    }, SLIDE_INTERVAL);
  }

  function stopAutoAdvance() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  /* ------------------------------------------------------------
     Bind dot clicks
     ------------------------------------------------------------ */
  function bindDots(banner) {
    banner.querySelectorAll(".dss-update-banner__dot").forEach(dot => {
      dot.addEventListener("click", () => {
        const index = Number(dot.dataset.slideTo);
        if (!Number.isFinite(index)) return;
        activeIndex = index;
        renderSlide(activeIndex, banner);
        startAutoAdvance(banner); // reset timer
      });
    });
  }

  /* ------------------------------------------------------------
     Bind View All Updates button
     ------------------------------------------------------------ */
  function bindButton(banner) {
    const btn = banner.querySelector('[data-update-action="view-all"]');
    if (!btn) return;
    btn.addEventListener("click", () => {
      const target = document.querySelector("[data-updates], #updates, .updates-page");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.dispatchEvent(new CustomEvent("dss:view-updates"));
      }
    });
  }

  /* ------------------------------------------------------------
     Main loader
     ------------------------------------------------------------ */
  async function loadUpdateBanner() {
    if (document.getElementById("dssUpdateBanner")) return;

    const header = document.getElementById("header-placeholder");
    if (!header) return;

    const prefix = getBasePrefix();
    const htmlUrl = prefix + BANNER_FILE;
    const imageUrl = prefix + BANNER_IMAGE;

    try {
      const response = await fetch(htmlUrl, { cache: "no-cache" });
      if (!response.ok) throw new Error("Unable to load update banner.");

      let markup = await response.text();
      markup = markup.replace("__UPDATE_BANNER_TRUCK__", imageUrl);

      const placeholder = document.getElementById("update-banner-placeholder");
      if (placeholder) {
        placeholder.innerHTML = markup;
      } else {
        header.insertAdjacentHTML("afterend", markup);
      }

      const banner = document.getElementById("dssUpdateBanner");
      if (!banner) return;

      bindDots(banner);
      bindButton(banner);

      // Wait for Firebase, then fetch and render
      let attempts = 0;
      const maxAttempts = 20;

      const waitForFirebase = async () => {
        if (firestore()) {
          await fetchAllAnnouncements();
          renderSlide(activeIndex, banner);
          startAutoAdvance(banner);
          return;
        }
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(waitForFirebase, 100);
        } else {
          console.info("[update-banner] Firebase not ready — using defaults.");
          renderSlide(activeIndex, banner);
          startAutoAdvance(banner);
        }
      };

      waitForFirebase();

      // Pause auto-advance while the user is hovering
      banner.addEventListener("mouseenter", stopAutoAdvance);
      banner.addEventListener("mouseleave", () => startAutoAdvance(banner));
    } catch (error) {
      console.warn("DSS update banner could not be loaded:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadUpdateBanner);
  } else {
    loadUpdateBanner();
  }
})();
