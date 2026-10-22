/* ============================================================
   DSS V2 — SHARED UPDATE BANNER LOADER
   Fixed background image, rotating text content from Firestore.
   ============================================================ */
(function () {
  "use strict";

  const BANNER_FILE = "shared/update-banner.html";
  const BANNER_IMAGE = "assets/images/update-banner-truck.png";
  const COLLECTION = "announcements";
  const SLIDE_INTERVAL = 6000;

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

  /* Absolute base from site root — immune to <base href> */
  function base() {
    return "/Decision-Support-SystemV2/";
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
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

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

  function bindHover() {
    if (!banner) return;
    banner.addEventListener("mouseenter", stopAutoAdvance);
    banner.addEventListener("mouseleave", startAutoAdvance);
  }

  /* Force the image to load, regardless of what the placeholder said */
  function fixBannerImage() {
    if (!banner) return;
    const img = banner.querySelector("img");
    if (!img) return;

    const absolute = base() + BANNER_IMAGE;
    img.setAttribute("src", absolute);
    img.removeAttribute("srcset");
    img.onerror = function () {
      console.warn("[update-banner] image failed:", absolute);
    };
    img.onload = function () {
      console.log("[update-banner] image loaded:", absolute);
    };
  }

  async function loadUpdateBanner() {
    if (document.getElementById("dssUpdateBanner")) return;

    const header = document.getElementById("header-placeholder");
    if (!header) return;

    const htmlUrl = base() + BANNER_FILE;

    try {
      const response = await fetch(htmlUrl, { cache: "no-cache" });
      if (!response.ok) throw new Error("Unable to load update banner: " + response.status);

      let markup = await response.text();

      // Replace placeholder if present
      markup = markup.replace(/__UPDATE_BANNER_TRUCK__/g, base() + BANNER_IMAGE);

      const placeholder = document.getElementById("update-banner-placeholder");
      if (placeholder) {
        placeholder.innerHTML = markup;
      } else {
        header.insertAdjacentHTML("afterend", markup);
      }

      banner = document.getElementById("dssUpdateBanner");
      if (!banner) return;

      // Belt-and-suspenders: force the img src directly
      fixBannerImage();

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
