/* ============================================================
   DSS V2 — SHARED UPDATE BANNER LOADER
   Fixed background image, rotating text content from Firestore.
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
        message: "We are aware of the issue and are working on a fix.",
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

  // Loaded content, initialized with defaults so slides always have data
  const slideContent = SLIDES.map(s => ({
    eyebrow: s.eyebrow,
    title: s.defaults.title,
    date: s.defaults.date,
    message: s.defaults.message,
    button: s.defaults.button
  }));

  let activeIndex = 0;
  let timerId = null;
  let banner = null;

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
            eyebrow: data.eyebrow || SLIDES[i].eyebrow,
            title:   data.title   || SLIDES[i].defaults.title,
            date:    data.date    || SLIDES[i].defaults.date,
            message: data.message || SLIDES[i].defaults.message,
            button:  data.button  || SLIDES[i].defaults.button
          };
          customized++;
        }
      });

      console.log("[update-banner] Loaded", customized, "customized announcements.");
    } catch (err) {
      console.warn("[update-banner] Fetch failed:", err.code || err.message);
    }
  }

  /* ------------------------------------------------------------
     Render slide at index (fade text, then swap content)
     ------------------------------------------------------------ */
  function renderSlide(index) {
    if (!banner) return;
    const data = slideContent[index];
    if (!data) return;

    const copy = banner.querySelector(".dss-update-banner__copy");
    if (!copy) return;

    // Fade out, swap, fade in
    copy.classList.add("is-swapping");

    setTimeout(() => {
      // Icon
      const icon = banner.querySelector(".dss-update-banner__icon i");
      if (icon) icon.className = SLIDES[index].icon;

      // Eyebrow text
      const eyebrowText = banner.querySelector(".dss-update-banner__eyebrow-text");
      if (eyebrowText) eyebrowText.textContent = data.eyebrow;

      // Title
      const title = banner.querySelector(".dss-update-banner__title");
      if (title) title.textContent = data.title;

      // Date
      const dateText = banner.querySelector(".dss-update-banner__date-text");
      if (dateText) dateText.textContent = data.date;

      // Message (preserve line breaks)
      const message = banner.querySelector(".dss-update-banner__message");
      if (message) {
        message.innerHTML = String(data.message || "")
          .split("\n")
          .map(line => esc(line))
          .join("<br>");
      }

      // Button
      const buttonText = banner.querySelector(".dss-update-banner__button-text");
      if (buttonText) buttonText.textContent = data.button;

      // Dots
      banner.querySelectorAll(".dss-update-banner__dot").forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
      });

      copy.classList.remove("is-swapping");
    }, 250); // matches the fade-out transition
  }

  /* ------------------------------------------------------------
     Auto-advance
     ------------------------------------------------------------ */
  function startAutoAdvance() {
    stopAutoAdvance();
    timerId = setInterval(() => {
      activeIndex = (activeIndex + 1) % SLIDES.length;
      renderSlide(activeIndex);
    }, SLIDE_INTERVAL);
  }

  function stopAutoAdvance() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  /* ------------------------------------------------------------
     Bind dots
     ------------------------------------------------------------ */
  function bindDots() {
    if (!banner) return;
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

  /* ------------------------------------------------------------
     Bind View All Updates button
     ------------------------------------------------------------ */
  function bindButton() {
    if (!banner) return;
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
     Pause on hover
     ------------------------------------------------------------ */
  function bindHover() {
    if (!banner) return;
    banner.addEventListener("mouseenter", stopAutoAdvance);
    banner.addEventListener("mouseleave", startAutoAdvance);
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

      banner = document.getElementById("dssUpdateBanner");
      if (!banner) return;

      bindDots();
      bindButton();
      bindHover();

      // Show the first slide immediately from defaults (no blank banner)
      renderSlide(activeIndex);
      startAutoAdvance();

      // Then fetch Firestore content and re-render current slide
      const waitForFirebase = async (attempt = 0) => {
        if (firestore()) {
          await fetchAllAnnouncements();
          renderSlide(activeIndex);
          return;
        }
        if (attempt < 20) {
          setTimeout(() => waitForFirebase(attempt + 1), 100);
        }
      };

      waitForFirebase();
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
